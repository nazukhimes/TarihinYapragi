import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CATEGORIES,
  CURATED,
  curatedKey,
  type CaseFile,
  type CaseType,
  type ScienceMilestone,
  type TalkCard,
} from "./data";
import {
  buildAutoTalk,
  classifyItem,
  detectDarkItem,
  useDayData,
  type DayErrorKind,
} from "./lib/wiki";
import { daysInMonth } from "./lib/date";
import { CalendarLeaf, LiveClock, MONTHS_TR, Ticker } from "./components/leaf";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NotFound } from "./components/NotFound";
import {
  CasesSection,
  formatYear,
  itemToPeople,
  matchQuery,
  PeopleRow,
  ScienceSection,
  SectionShell,
  TimelineSection,
  type MergedEvent,
} from "./components/sections";
import { BroadcastMode, TalkSection } from "./components/talk";
import {
  copyText,
  CountUp,
  IconAtom,
  IconDossier,
  IconLeafMark,
  IconMic,
  IconQuill,
  IconSearch,
  IconShare,
  IconSkull,
  Modal,
  Reveal,
  SectionHead,
  toast,
  Toaster,
} from "./components/ui";
import { parseDaySlug, toDaySlug } from "./lib/slug";

const trLower = (s: string) => s.toLocaleLowerCase("tr-TR");

function truncate(s: string, n: number): string {
  const clean = s.replace(/\s+/g, " ").trim();
  return clean.length > n ? clean.slice(0, n - 1).trimEnd() + "…" : clean;
}

function firstClause(s: string, n = 64): string {
  const clean = s.replace(/\s+/g, " ").trim();
  const cut = clean.search(/[,;:]/);
  const base = cut > 18 ? clean.slice(0, cut) : clean;
  return truncate(base, n);
}

const NAV = [
  { id: "tunel", label: "Zaman Tüneli" },
  { id: "doganlar", label: "Doğanlar" },
  { id: "kaybettiklerimiz", label: "Kaybettiklerimiz" },
  { id: "karanlik", label: "Karanlık Dosyalar" },
  { id: "bilim", label: "Bilim & Keşif" },
  { id: "sohbet", label: "Sohbet Kartları" },
];

const HATA_BASLIK: Record<DayErrorKind, string> = {
  network: "İnternet bağlantısı yok.",
  notfound: "Bu gün için kayıt bulunamadı.",
  ratelimit: "Arşiv şu an çok yoğun.",
  server: "Arşiv sunucusu yanıt vermiyor.",
  unknown: "Beklenmeyen bir sorun oluştu.",
};

export default function App() {
  const { daySlug } = useParams<{ daySlug: string }>();
  const navigate = useNavigate();
  const today = new Date();

  // URL tek doğruluk kaynağıdır — day/month için ayrı state yok.
  // Slug geçersizse aşağıdaki tüm hesaplamalar bugünün verisiyle boşa döner;
  // hook sırası sabit kalsın diye erken çıkış en sondaki JSX dönüşüne bırakılır.
  const parsed = useMemo(() => parseDaySlug(daySlug ?? ""), [daySlug]);
  const day = parsed?.day ?? today.getDate();
  const month = parsed?.month ?? today.getMonth() + 1;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [broadcast, setBroadcast] = useState(false);
  const [kisayolYardimi, setKisayolYardimi] = useState(false);
  const [gecikti, setGecikti] = useState(false);
  const aramaRef = useRef<HTMLInputElement>(null);
  const aramaMobilRef = useRef<HTMLInputElement>(null);

  const { data, loading, reload } = useDayData(month, day);

  // 4 saniyeyi geçen yüklemede kullanıcıya ek bilgi göster (O-9/T-09 Adım 7)
  useEffect(() => {
    setGecikti(false);
    if (!loading) return;
    const t = setTimeout(() => setGecikti(true), 4000);
    return () => clearTimeout(t);
  }, [loading, month, day]);

  const setDate = useCallback(
    (d: number, m: number) => navigate(`/${toDaySlug(m, d)}`),
    [navigate]
  );

  // klavye kısayolu için gün kaydırma (CalendarLeaf'teki shift() ile aynı mantık)
  const gunKaydir = useCallback(
    (delta: number) => {
      let d = day + delta;
      let m = month;
      if (d < 1) {
        m = m === 1 ? 12 : m - 1;
        d = daysInMonth(m);
      } else if (d > daysInMonth(m)) {
        m = m === 12 ? 1 : m + 1;
        d = 1;
      }
      setDate(d, m);
    },
    [day, month, setDate]
  );

  const bugüneDön = useCallback(() => {
    const t = new Date();
    setDate(t.getDate(), t.getMonth() + 1);
  }, [setDate]);

  // ana sayfa klavye kısayolları — arama kutusunda ve Yayın Modu'nda devre dışı (O-7)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (broadcast) return;
      if (document.querySelector('[aria-modal="true"]')) return; // açık bir Modal varken odak tuzağını atlama

      switch (e.key) {
        case "ArrowLeft": e.preventDefault(); gunKaydir(-1); break;
        case "ArrowRight": e.preventDefault(); gunKaydir(1); break;
        case "t": case "T": e.preventDefault(); bugüneDön(); break;
        case "/": e.preventDefault(); (aramaRef.current?.offsetParent ? aramaRef.current : aramaMobilRef.current)?.focus(); break;
        case "?": setKisayolYardimi(true); break;
        case "Escape": setKisayolYardimi(false); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [broadcast, gunKaydir, bugüneDön]);

  // sayısal biçim (/08-21) → kanonik ad biçimine (/21-agustos) yönlendir
  useEffect(() => {
    if (!parsed) return;
    const canonical = toDaySlug(parsed.month, parsed.day);
    if (daySlug !== canonical) navigate(`/${canonical}`, { replace: true });
  }, [parsed, daySlug, navigate]);

  const key = curatedKey(month, day);
  const curated = CURATED[key];
  const dayLabel = `${day} ${MONTHS_TR[month - 1]}`;
  const isToday = day === today.getDate() && month === today.getMonth() + 1;

  const shareDay = useCallback(async () => {
    const url = `${location.origin}/${toDaySlug(month, day)}`;
    const shareData = {
      title: `${dayLabel} — Tarih Yaprağı`,
      text: `${dayLabel} tarihinde neler olmuş?`,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* kullanıcı vazgeçti */
      }
    }
    const ok = await copyText(url);
    toast(ok ? "Bağlantı panoya kopyalandı" : "Kopyalanamadı");
  }, [month, day, dayLabel]);

  /* ---------- birleşik zaman tüneli ---------- */
  const mergedEvents: MergedEvent[] = useMemo(() => {
    const out: MergedEvent[] = (curated?.events || []).map((ev) => ({
      id: ev.id,
      year: ev.year,
      text: ev.text,
      detail: ev.detail,
      category: ev.category,
      curated: true,
    }));
    const cur = curated?.events || [];
    (data?.events || []).forEach((item) => {
      const t = trLower(item.text);
      if (cur.some((ce) => ce.matchKeys.some((k) => t.includes(trLower(k))))) return;
      const page = item.pages?.find((p) => p.excerpt || p.content_urls?.desktop?.page);
      out.push({
        id: item.id,
        year: item.year,
        text: item.text,
        category: classifyItem(item.text),
        curated: false,
        page: page
          ? { title: page.title, excerpt: page.excerpt, url: page.content_urls?.desktop?.page }
          : undefined,
      });
    });
    return out.sort((a, b) => a.year - b.year);
  }, [data, curated]);

  /* ---------- insanlar ---------- */
  const births = useMemo(() => itemToPeople(data?.births || [], "births"), [data]);
  const deaths = useMemo(() => itemToPeople(data?.deaths || [], "deaths"), [data]);

  /* ---------- karanlık dosyalar ---------- */
  const allCases: CaseFile[] = useMemo(() => {
    const base = curated?.cases || [];
    const seen = new Set<string>();
    const auto: CaseFile[] = [];
    [...(data?.deaths || []), ...(data?.events || [])].forEach((item) => {
      const theme = detectDarkItem(item.text);
      if (!theme) return;
      const dedupe = `${item.year}-${trLower(item.text).slice(0, 36)}`;
      if (seen.has(dedupe)) return;
      seen.add(dedupe);
      const type: CaseType =
        theme === "Suikast" ? "suikast"
        : theme === "İnfaz & İdam" ? "idam"
        : theme === "Kayıp & Gizem" ? "kayıp"
        : theme === "Felaket" ? "felaket"
        : "katliam";
      auto.push({
        id: `auto-${item.id}`,
        year: item.year,
        type,
        title: firstClause(item.text),
        location: "Arşiv taraması — otomatik tespit",
        status: "KAPANDI",
        summary: truncate(item.text, 240),
        detail: item.pages?.[0]?.excerpt || item.text,
        tags: [theme.toLocaleLowerCase("tr-TR"), formatYear(item.year)],
      });
    });
    return [...base, ...auto];
  }, [data, curated]);

  /* ---------- bilim ---------- */
  const allScience: (ScienceMilestone & { curated?: boolean })[] = useMemo(() => {
    const base = (curated?.science || []).map((s) => ({ ...s, curated: true as const }));
    const auto: (ScienceMilestone & { curated?: boolean })[] = (data?.events || [])
      .filter((e) => {
        const c = classifyItem(e.text);
        return c === "bilim" || c === "kesif";
      })
      .map((e) => ({
        id: `sci-${e.id}`,
        year: e.year,
        field: CATEGORIES[classifyItem(e.text)].label,
        title: firstClause(e.text, 80),
        summary: e.pages?.[0]?.excerpt || truncate(e.text, 260),
        curated: false,
      }));
    return [...base, ...auto].sort((a, b) => b.year - a.year);
  }, [data, curated]);

  /* ---------- sohbet kartları ---------- */
  const talkCards: TalkCard[] = useMemo(() => {
    const base = curated?.talk || [];
    if (!data) return base;
    return [...base, ...buildAutoTalk(data)].slice(0, 9);
  }, [data, curated]);

  /* ---------- öne çıkan dosya ---------- */
  const spotlight = useMemo(() => {
    if (curated?.spotlight) return { ...curated.spotlight, curated: true };
    const featured = data?.selected?.[0] || mergedEvents[Math.floor(mergedEvents.length / 2)];
    if (!featured) return null;
    const excerpt = "pages" in featured && featured.pages?.[0]?.excerpt ? featured.pages[0].excerpt : undefined;
    return {
      kicker: "Arşivden öne çıkan",
      title: truncate(featured.text, 90),
      text: excerpt ? truncate(excerpt, 240) : "",
      curated: false,
    };
  }, [curated, data, mergedEvents]);

  /* ---------- bant ---------- */
  const tickerItems = useMemo(() => {
    if (mergedEvents.length === 0) return [];
    const step = Math.max(1, Math.floor(mergedEvents.length / 14));
    return mergedEvents.filter((_, i) => i % step === 0).slice(0, 14).map((e) => ({ year: e.year, text: e.text }));
  }, [mergedEvents]);

  /* ---------- ambiyans yılları ---------- */
  const ambientYears = useMemo(() => {
    if (mergedEvents.length === 0) return [];
    const ys = [mergedEvents[0]?.year, mergedEvents[Math.floor(mergedEvents.length / 2)]?.year, mergedEvents[mergedEvents.length - 1]?.year].filter(Boolean) as number[];
    return [...new Set(ys)].slice(0, 3);
  }, [mergedEvents]);

  /* ---------- arama sonuç sayacı (m-6) ---------- */
  // Not: bölümlerin kendi içindeki matchQuery süzmesini tekrarlıyor — bilinçli;
  // bölüm bileşenlerinin arayüzünü değiştirmemek için kabul edildi (T-13'e refaktör notu düşüldü).
  const aramaSonuclari = useMemo(() => {
    if (!query.trim()) return null;
    return {
      olay: mergedEvents.filter((e) => matchQuery(query, e.text, e.detail, e.page?.excerpt, formatYear(e.year))).length,
      dogum: births.filter((p) => matchQuery(query, p.name, p.excerpt)).length,
      vefat: deaths.filter((p) => matchQuery(query, p.name, p.excerpt)).length,
      dosya: allCases.filter((c) => matchQuery(query, c.title, c.summary, c.detail, c.tags.join(" "))).length,
      bilim: allScience.filter((s) => matchQuery(query, s.title, s.summary, s.field)).length,
    };
  }, [query, mergedEvents, births, deaths, allCases, allScience]);

  const toplamSonuc = aramaSonuclari
    ? Object.values(aramaSonuclari).reduce((a, b) => a + b, 0)
    : 0;

  // gün bazlı dinamik başlık + meta (statik index.html her günde aynı etiketi verir,
  // burada JS çalıştıktan sonra günün gerçek başlığına güncellenir — bkz. T-08 sınırı:
  // WhatsApp/Twitter gibi JS çalıştırmayan önizleyiciler statik etiketleri görmeye devam eder)
  useEffect(() => {
    const baslik = `${dayLabel} — Tarihte Bugün | Tarih Yaprağı`;
    document.title = baslik;

    const ayarla = (secici: string, deger: string) => {
      const el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(secici);
      if (!el) return;
      if (el instanceof HTMLMetaElement) el.content = deger;
      else el.href = deger;
    };

    const ozet = spotlight?.title
      ? `${dayLabel}: ${spotlight.title}`
      : `${dayLabel} tarihinde yaşanan olaylar, doğanlar ve kaybettiklerimiz.`;

    ayarla('meta[name="description"]', ozet);
    ayarla('meta[property="og:title"]', baslik);
    ayarla('meta[property="og:description"]', ozet);
    ayarla('link[rel="canonical"]', `${location.origin}/${toDaySlug(month, day)}`);
  }, [dayLabel, spotlight, month, day]);

  // geçersiz slug → 404 (tüm hook'lardan sonra, her render'da aynı sırayı korumak için)
  if (!parsed) return <NotFound />;

  const searching = query.trim().length > 0;
  const noSearchResults = searching && toplamSonuc === 0;
  const stats = [
    { label: "Tarihî olay", value: mergedEvents.length, color: "#e8b04b", icon: <IconQuill className="w-4.5 h-4.5" /> },
    { label: "Bugün doğan", value: births.length, color: "#8fbf6a", icon: <IconLeafMark className="w-4.5 h-4.5" /> },
    { label: "Kaybettiklerimiz", value: deaths.length, color: "#6f9fd8", icon: <IconSkull className="w-4.5 h-4.5" /> },
    { label: "Karanlık dosya", value: allCases.length, color: "#e05b4b", icon: <IconDossier className="w-4.5 h-4.5" /> },
  ];

  return (
    <div className="glowfield min-h-screen relative">
      <div className="gridlines fixed inset-0 pointer-events-none" />
      <div className="noise" />
      <Toaster />
      <a href="#top" className="skip-link">Ana içeriğe atla</a>

      {/* ======== ÜST BAR ======== */}
      <header className="sm:sticky sm:top-0 z-[60] border-b border-line/80 bg-night/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center gap-4">
          <a href="#top" className="flex items-center gap-3 shrink-0 group">
            <span className="text-brand group-hover:scale-110 transition-transform duration-300">
              <IconLeafMark className="w-7 h-7" />
            </span>
            <span className="leading-none">
              <span className="block font-display font-bold text-lg tracking-wide text-ink group-hover:text-gold transition-colors">
                TARİH YAPRAĞI
              </span>
              <span className="block font-mono text-[9.5px] tracking-[0.3em] uppercase text-ink-faint mt-1">
                her güne bir arşiv
              </span>
            </span>
          </a>

          <div className="flex-1 flex justify-center">
            <label className="relative w-full max-w-md hidden sm:block">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
                <IconSearch className="w-4 h-4" />
              </span>
              <input
                ref={aramaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                aria-label={`${dayLabel} arşivinde ara`}
                placeholder={`${dayLabel} arşivinde ara: olay, kişi, dosya…`}
                className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-panel border border-line text-[14px] text-ink placeholder:text-ink-faint outline-none focus:border-gold/70 focus:shadow-[0_0_0_3px_rgba(232,176,75,0.12)] transition-all duration-200"
              />
              {searching && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-brand hover:text-paper cursor-pointer"
                >
                  ✕ temizle
                </button>
              )}
            </label>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <LiveClock />
            <button
              onClick={() => setBroadcast(true)}
              disabled={talkCards.length === 0}
              aria-label="Yayın Modu"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-brand text-paper font-mono text-[11.5px] tracking-[0.18em] uppercase font-semibold hover:bg-brand-deep hover:shadow-[0_10px_26px_rgba(210,59,46,0.4)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <IconMic className="w-4 h-4" />
              <span className="hidden md:inline">Yayın Modu</span>
            </button>
          </div>
        </div>

        {/* mobil arama */}
        <div className="sm:hidden px-4 pb-3">
          <label className="relative block">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
              <IconSearch className="w-4 h-4" />
            </span>
            <input
              ref={aramaMobilRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              aria-label={`${dayLabel} arşivinde ara`}
              placeholder="Arşivde ara…"
              className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-panel border border-line text-[14px] text-ink placeholder:text-ink-faint outline-none focus:border-gold/70 transition-colors"
            />
          </label>
        </div>
      </header>
      <p className="sr-only" role="status" aria-live="polite">
        {searching ? (toplamSonuc > 0 ? `${toplamSonuc} sonuç bulundu` : "sonuç yok") : ""}
      </p>

      {searching && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex items-center gap-3 flex-wrap
                        border-b border-line/60 font-mono text-[12px]">
          <span className="text-gold">&quot;{query}&quot;</span>
          <span className="text-ink-dim">
            {toplamSonuc > 0 ? `${toplamSonuc} sonuç` : "sonuç yok"}
          </span>
          {toplamSonuc > 0 && aramaSonuclari && (
            <span className="text-ink-faint">
              {aramaSonuclari.olay} olay · {aramaSonuclari.dogum} doğum ·{" "}
              {aramaSonuclari.vefat} vefat · {aramaSonuclari.dosya} dosya ·{" "}
              {aramaSonuclari.bilim} bilim
            </span>
          )}
          <button
            onClick={() => setQuery("")}
            className="ml-auto font-mono text-[11px] text-brand hover:text-paper cursor-pointer"
          >
            ✕ temizle
          </button>
        </div>
      )}

      <main id="top" className="relative">
        {/* ======== AÇILIŞ: TAKVİM YAPRAĞI ======== */}
        <section className="relative overflow-hidden">
          {/* dev ambiyans yılları */}
          {ambientYears.map((y, i) => (
            <span
              key={`${y}-${i}`}
              className={`absolute font-display font-black outline-num select-none pointer-events-none leading-none ${i % 2 === 0 ? "drift-slow" : "drift-slower"}`}
              style={{
                fontSize: "clamp(9rem, 22vw, 20rem)",
                right: i === 1 ? undefined : `${6 + i * 22}%`,
                left: i === 1 ? "-4%" : undefined,
                top: `${8 + i * 26}%`,
              }}
            >
              {formatYear(y)}
            </span>
          ))}

          <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-12 grid lg:grid-cols-[400px_1fr] gap-10 lg:gap-16 items-start">
            {/* yaprak */}
            <Reveal className="max-w-[400px] w-full mx-auto lg:mx-0">
              <CalendarLeaf
                day={day}
                month={month}
                year={today.getFullYear()}
                onChangeDay={setDate}
                onOpenPicker={() => setPickerOpen((o) => !o)}
                pickerOpen={pickerOpen}
                isToday={isToday}
              />
              <div className="mt-3 flex justify-center">
                <button
                  onClick={shareDay}
                  aria-label={`${dayLabel} gününü paylaş`}
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-line bg-panel/60 text-ink-faint hover:text-gold hover:border-gold/60 transition-all duration-200 cursor-pointer"
                >
                  <IconShare className="w-3.5 h-3.5 group-hover:text-gold transition-colors" />
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase">Paylaş</span>
                </button>
              </div>
            </Reveal>

            {/* günün özeti */}
            <div className="pt-2">
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-gold">
                    {isToday ? "Bugünün arşivi" : "Seçili günün arşivi"}
                  </span>
                  <span className="h-px flex-1 bg-line" />
                  {data && !loading && (
                    <span className={`font-mono text-[11px] ${data.stale ? "text-copper" : "text-ink-faint"}`}>
                      {data.offline
                        ? "çevrimdışı önbellek"
                        : data.stale
                          ? "önbellekten · 24 saatten eski"
                          : `kaynak: ${data.sources.events === "tr" ? "TR" : "EN"} Vikipedi`}
                    </span>
                  )}
                </div>
              </Reveal>

              {loading ? (
                <div className="py-8">
                  <div className="animate-pulse space-y-4">
                    <div className="h-5 w-44 bg-panel-2 rounded-sm" />
                    <div className="h-14 w-full max-w-xl bg-panel-2 rounded-sm" />
                    <div className="h-4 w-3/4 max-w-lg bg-panel-2 rounded-sm" />
                    <div className="h-4 w-2/3 max-w-md bg-panel-2 rounded-sm" />
                  </div>
                  <p className="mt-6 font-mono text-[13px] text-ink-faint">
                    Arşiv taranıyor · {dayLabel} için kayıtlar getiriliyor…
                  </p>
                  {gecikti && (
                    <p className="mt-3 font-mono text-[12px] text-copper">
                      Arşiv beklenenden yavaş yanıt veriyor…
                    </p>
                  )}
                </div>
              ) : data?.error && mergedEvents.length === 0 ? (
                <div className="py-8">
                  <p className="font-display italic text-2xl text-ink">{HATA_BASLIK[data.error.kind]}</p>
                  <p className="mt-3 text-ink-dim max-w-xl text-[15px] leading-relaxed">
                    {data.error.message}
                  </p>
                  <div className="mt-6 flex gap-3 flex-wrap">
                    {data.error.retryable && (
                      <button
                        onClick={reload}
                        className="px-5 py-3 rounded-sm bg-gold text-night font-mono text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-paper transition-colors cursor-pointer"
                      >
                        Yeniden dene
                      </button>
                    )}
                    <button
                      onClick={bugüneDön}
                      className="px-5 py-3 rounded-sm border border-line text-ink-dim hover:text-gold hover:border-gold/60 font-mono text-[12px] tracking-[0.2em] uppercase transition-colors cursor-pointer"
                    >
                      Bugüne dön
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Reveal delay={80}>
                    <h1 className="font-display font-bold text-3xl md:text-[2.9rem] leading-[1.1] text-ink max-w-2xl">
                      {spotlight?.title}
                    </h1>
                    {spotlight && "text" in spotlight && spotlight.text && (
                      <p className="mt-4 text-[15.5px] md:text-base leading-relaxed text-ink-dim max-w-2xl">
                        {spotlight.text}
                      </p>
                    )}
                    <p className="mt-3 font-mono text-[11.5px] tracking-[0.2em] uppercase text-ink-faint">
                      {spotlight?.kicker} · {dayLabel}
                    </p>
                  </Reveal>

                  {/* sayaçlar */}
                  <Reveal delay={160} className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
                    {stats.map((s) => (
                      <a
                        key={s.label}
                        href={`#${NAV[stats.indexOf(s)]?.id || "tunel"}`}
                        className="group rounded-sm border border-line bg-panel/70 px-4 py-3.5 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.35)] transition-all duration-300"
                        style={{ borderColor: undefined }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${s.color}77`)}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
                      >
                        <div className="flex items-center justify-between" style={{ color: s.color }}>
                          <span className="font-display font-black text-3xl tabular-nums text-ink group-hover:text-gold transition-colors">
                            <CountUp to={s.value} />
                          </span>
                          <span className="opacity-80">{s.icon}</span>
                        </div>
                        <p className="mt-1.5 font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-faint">
                          {s.label}
                        </p>
                      </a>
                    ))}
                  </Reveal>

                  {mergedEvents.length > 1 && (
                    <Reveal delay={240} className="mt-8 max-w-2xl">
                      <p className="font-mono text-[12px] text-ink-faint leading-relaxed">
                        <span className="text-gold">Zaman aralığı:</span> {formatYear(mergedEvents[0].year)} —{" "}
                        {formatYear(mergedEvents[mergedEvents.length - 1].year)} ·{" "}
                        {mergedEvents[mergedEvents.length - 1].year - mergedEvents[0].year} yıla yayılan{" "}
                        {mergedEvents.length} kayıt
                      </p>
                    </Reveal>
                  )}
                </>
              )}
            </div>

            {/* özel dosyalı günler */}
            <Reveal delay={200} className="lg:col-span-2 mt-2 lg:mt-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-[11px] tracking-[0.26em] uppercase text-ink-faint mr-1">
                  Özel dosyalı günler
                </span>
                {Object.keys(CURATED)
                  .sort()
                  .map((k) => {
                    const [m, d] = k.split("-").map(Number);
                    const active = d === day && m === month;
                    return (
                      <button
                        key={k}
                        onClick={() => {
                          setDate(d, m);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`px-3 py-1.5 rounded-sm font-mono text-[11.5px] tracking-wide transition-all duration-200 cursor-pointer border ${
                          active
                            ? "bg-gold text-night border-gold font-semibold shadow-[0_8px_18px_rgba(232,176,75,0.3)]"
                            : "border-line text-ink-dim hover:border-gold/60 hover:text-gold hover:-translate-y-0.5"
                        }`}
                      >
                        {d} {MONTHS_TR[m - 1].slice(0, 3)}
                      </button>
                    );
                  })}
                {curated && (
                  <span className="rise-in font-mono text-[11px] tracking-[0.2em] uppercase text-gold ml-1">
                    ◆ dosya açık
                  </span>
                )}
              </div>
            </Reveal>
          </div>

          {/* haber bandı */}
          {!loading && tickerItems.length > 0 && <Ticker items={tickerItems} />}
        </section>

        {/* ======== BÖLÜM NAVİGASYONU ======== */}
        {!noSearchResults && (
          <nav aria-label="Bölümler" className="sticky top-0 sm:top-16 z-[55] border-b border-line/80 bg-night/85 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex gap-1 overflow-x-auto row-scroll">
              {NAV.map((n, i) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className="shrink-0 px-4 py-3.5 font-mono text-[12px] tracking-[0.14em] uppercase text-ink-faint hover:text-gold border-b-2 border-transparent hover:border-gold transition-all duration-200"
                >
                  <span className="text-brand mr-1.5">{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </a>
              ))}
            </div>
          </nav>
        )}

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {noSearchResults ? (
            <div className="py-24 text-center">
              <p className="font-display italic text-2xl text-ink">
                &quot;{query}&quot; için bu günde sonuç yok.
              </p>
              <p className="mt-3 text-ink-dim max-w-md mx-auto text-[15px] leading-relaxed">
                Başka bir gün deneyin ya da aramayı temizleyin.
              </p>
              <div className="mt-6 flex gap-3 justify-center flex-wrap">
                <button
                  onClick={() => setQuery("")}
                  className="px-5 py-3 rounded-sm bg-gold text-night font-mono text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-paper transition-colors cursor-pointer"
                >
                  Aramayı temizle
                </button>
                <button
                  onClick={bugüneDön}
                  className="px-5 py-3 rounded-sm border border-line text-ink-dim hover:text-gold hover:border-gold/60 font-mono text-[12px] tracking-[0.2em] uppercase transition-colors cursor-pointer"
                >
                  Bugüne dön
                </button>
              </div>
            </div>
          ) : (
            <>
              {data && data.holidays.length > 0 && (
                <Reveal className="mt-8">
                  <div className="rounded-sm border border-gold/40 bg-gold/[0.06] px-5 py-4">
                    <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-gold mb-2">
                      Bugünün anlamı
                    </p>
                    <ul className="space-y-1.5">
                      {data.holidays.map((h) => (
                        <li key={h.id} className="text-[14.5px] text-ink-dim leading-relaxed flex gap-2.5">
                          <span className="text-gold shrink-0">◆</span>
                          <span>{h.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}

              {/* ======== 01 ZAMAN TÜNELİ ======== */}
              <SectionShell id="tunel" labelledBy="baslik-01">
                <div className="pt-16">
                  <SectionHead
                    index="01"
                    kicker="Kronoloji"
                    title="Zaman Tüneli"
                    desc={`${dayLabel} gününe düşen tüm tarihî kayıtlar — en eskiden en yeniye. Noktalara dokun, yüzyıllar arasında gezin.`}
                    accent="#e8b04b"
                  />
                  {loading ? (
                    <SkeletonLines />
                  ) : (
                    <ErrorBoundary variant="section">
                      <TimelineSection events={mergedEvents} query={query} />
                    </ErrorBoundary>
                  )}
                </div>
              </SectionShell>

              {/* ======== 02 DOĞANLAR ======== */}
              <SectionShell id="doganlar" labelledBy="baslik-02">
                <div className="pt-20">
                  <SectionHead
                    index="02"
                    kicker="Portreler"
                    title="Bugün Doğanlar"
                    desc="Siyasetçiler, sanatçılar, bilim insanları, sporcular… Bu tarihte dünyaya gelenler. Karta dokun, portreyi aç."
                    accent="#8fbf6a"
                  />
                  {loading ? (
                    <SkeletonCards />
                  ) : (
                    <ErrorBoundary variant="section">
                      <PeopleRow
                        people={births}
                        query={query}
                        accentLabel="Doğum"
                        accentColor="#8fbf6a"
                        emptyText="Bu tarih için arşivde doğum kaydı bulunamadı — başka bir güne bak."
                      />
                    </ErrorBoundary>
                  )}
                </div>
              </SectionShell>

              {/* ======== 03 KAYBETTİKLERİMİZ ======== */}
              <SectionShell id="kaybettiklerimiz" labelledBy="baslik-03">
                <div className="pt-20">
                  <SectionHead
                    index="03"
                    kicker="Vedalar"
                    title="Kaybettiklerimiz"
                    desc="Bu tarihte aramızdan ayrılanlar. Arşiv, her vedanın ardındaki hikâyeyi kartlara işler."
                    accent="#6f9fd8"
                  />
                  {loading ? (
                    <SkeletonCards />
                  ) : (
                    <ErrorBoundary variant="section">
                      <PeopleRow
                        people={deaths}
                        query={query}
                        accentLabel="Vefat"
                        accentColor="#6f9fd8"
                        emptyText="Bu tarih için arşivde vefat kaydı bulunamadı."
                      />
                    </ErrorBoundary>
                  )}
                </div>
              </SectionShell>

              {/* ======== 04 KARANLIK DOSYALAR ======== */}
              <SectionShell id="karanlik" labelledBy="baslik-04">
                <div className="pt-20">
                  <SectionHead
                    index="04"
                    kicker="Adli arşiv"
                    title="Karanlık Dosyalar"
                    desc="Suikastlar, katliamlar, kayıplar ve felaketler. Editör dosyaları elle derlenir; arşiv taraması, günün kayıtlarını otomatik tarar."
                    accent="#e05b4b"
                  />
                  {loading ? (
                    <SkeletonCards />
                  ) : (
                    <ErrorBoundary variant="section">
                      <CasesSection cases={allCases} query={query} />
                    </ErrorBoundary>
                  )}
                </div>
              </SectionShell>

              {/* ======== 05 BİLİM & KEŞİF ======== */}
              <SectionShell id="bilim" labelledBy="baslik-05">
                <div className="pt-20">
                  <SectionHead
                    index="05"
                    kicker="Dönüm noktaları"
                    title="Bilim & Keşif"
                    desc="DNA'dan Mars'a, ilk bilgisayarlardan ilk pilotlara… Bu güne denk gelen büyük sıçramalar."
                    accent="#43a08f"
                  />
                  {loading ? (
                    <SkeletonCards />
                  ) : (
                    <ErrorBoundary variant="section">
                      <ScienceSection items={allScience} query={query} />
                    </ErrorBoundary>
                  )}
                </div>
              </SectionShell>

              {/* ======== 06 SOHBET KARTLARI ======== */}
              <SectionShell id="sohbet" labelledBy="baslik-06">
                <div className="pt-20 pb-24">
                  <SectionHead
                    index="06"
                    kicker="Yayıncılar için"
                    title="Sohbet Kartları"
                    desc="Canlı yayında okunmaya hazır, kanca cümleli bilgi kartları. Kopyala ve paylaş ya da Yayın Modu ile teleprompter gibi kullan."
                    accent="#d23b2e"
                    right={
                      talkCards.length > 0 && (
                        <span className="flex items-center gap-2 font-mono text-[12px] text-ink-faint">
                          <IconAtom className="w-4 h-4 text-teal" />
                          {talkCards.reduce((a, c) => a + c.minutes, 0)} dk malzeme
                        </span>
                      )
                    }
                  />
                  {loading ? (
                    <SkeletonCards />
                  ) : (
                    <ErrorBoundary variant="section">
                      <TalkSection cards={talkCards} dayLabel={dayLabel} onBroadcast={() => setBroadcast(true)} />
                    </ErrorBoundary>
                  )}
                </div>
              </SectionShell>
            </>
          )}
        </div>
      </main>

      {/* ======== ALT BİLGİ ======== */}
      <footer className="relative border-t border-line/80 bg-night-2/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-brand"><IconLeafMark className="w-6 h-6" /></span>
              <span className="font-display font-bold text-lg text-ink">TARİH YAPRAĞI</span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-ink-dim max-w-xs">
              Her gün koparılacak bir yaprak, her yaprakta bir arşiv. Duvar takvimlerinden yayın stüdyolarına:
              bugünün tarihi, konuşmaya hazır.
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-ink-faint mb-4">Kaynaklar</p>
            <ul className="space-y-2.5 text-[13.5px] text-ink-dim">
              <li>· Tarihî olaylar, doğum ve vefatlar: <span className="text-sky">Wikimedia REST API</span> (TR + EN Vikipedi)</li>
              <li>· Karanlık dosyalar ve bilim seçkisi: <span className="text-gold">editör derlemesi</span></li>
              <li>· Sohbet kartları: derleme + <span className="text-teal">arşiv özetlerinden otomatik üretim</span></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-ink-faint mb-4">Not</p>
            <p className="text-[13.5px] leading-relaxed text-ink-dim">
              Otomatik sınıflandırmalar anahtar kelime taramasıyla yapılır; nadiren yanılabilir.
              Kesin bilgi için kartlardaki Vikipedi bağlantılarını izleyin. Takvim, Miladi takvim esas alır.
            </p>
            <p className="mt-6 font-mono text-[11px] text-ink-faint">
              © {today.getFullYear()} Tarih Yaprağı · 366 gün, tek arşiv
            </p>
            <p className="mt-2 font-mono text-[11px] text-ink-faint">
              Kısayollar için <kbd className="px-1.5 py-0.5 rounded-sm border border-line bg-panel-2 text-gold">?</kbd> tuşuna basın
            </p>
          </div>
        </div>
      </footer>

      {broadcast && talkCards.length > 0 && (
        <BroadcastMode cards={talkCards} dayLabel={dayLabel} onClose={() => setBroadcast(false)} />
      )}

      {kisayolYardimi && (
        <Modal onClose={() => setKisayolYardimi(false)} titleId="kisayol-modal-baslik">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h3 id="kisayol-modal-baslik" className="font-display font-bold text-2xl text-ink">
                Klavye Kısayolları
              </h3>
              <button
                onClick={() => setKisayolYardimi(false)}
                aria-label="Kapat"
                className="w-9 h-9 grid place-items-center rounded-sm border border-line text-ink-dim hover:text-brand hover:border-brand transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-gold mb-3">Ana sayfa</p>
            <dl className="space-y-2.5 mb-7">
              {[
                ["←", "Önceki gün"],
                ["→", "Sonraki gün"],
                ["T", "Bugüne dön"],
                ["/", "Arama kutusuna odaklan"],
                ["?", "Bu yardımı aç"],
                ["Esc", "Yardımı/modalı kapat"],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center gap-3">
                  <dt>
                    <kbd className="inline-block min-w-[2.5rem] text-center px-2 py-1 rounded-sm border border-line bg-panel-2 font-mono text-[12px] text-gold">
                      {key}
                    </kbd>
                  </dt>
                  <dd className="text-[14px] text-ink-dim">{desc}</dd>
                </div>
              ))}
            </dl>

            <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-gold mb-3">Yayın Modu</p>
            <dl className="space-y-2.5">
              {[
                ["←", "Önceki kart"],
                ["→ / Boşluk", "Sonraki kart"],
                ["Esc", "Yayın Modunu kapat"],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center gap-3">
                  <dt>
                    <kbd className="inline-block min-w-[2.5rem] text-center px-2 py-1 rounded-sm border border-line bg-panel-2 font-mono text-[12px] text-gold">
                      {key}
                    </kbd>
                  </dt>
                  <dd className="text-[14px] text-ink-dim">{desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- iskeletler ---------- */
function SkeletonLines() {
  return (
    <div className="animate-pulse space-y-6 max-w-3xl">
      {[80, 60, 90, 50, 70].map((w, i) => (
        <div key={i} className="flex gap-4 items-start">
          <div className="w-3.5 h-3.5 rounded-full bg-panel-2 mt-1.5" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 bg-panel-2 rounded-sm" style={{ width: `${w}%` }} />
            <div className="h-3 bg-panel-2 rounded-sm w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonCards() {
  return (
    <div className="animate-pulse grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-52 rounded-sm bg-panel-2 border border-line" />
      ))}
    </div>
  );
}
