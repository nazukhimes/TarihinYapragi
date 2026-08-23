import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CURATED, curatedKey } from "./data";
import { useDayData } from "./lib/wiki";
import { daysInMonth } from "./lib/date";
import { MONTHS_TR } from "./components/leaf";
import { NotFound } from "./components/NotFound";
import { copyText, toast, Toaster } from "./components/ui";
import { parseDaySlug, toDaySlug } from "./lib/slug";
import { useAramaSonuclari, useGunVerisi } from "./hooks/useGunVerisi";
import { useKlavyeKisayollari } from "./hooks/useKlavyeKisayollari";
import { UstBar } from "./components/UstBar";
import { AcilisBolumu } from "./components/AcilisBolumu";
import { BolumNav } from "./components/BolumNav";
import { Bolumler } from "./components/Bolumler";
import { AltBilgi } from "./components/AltBilgi";
import { KisayolYardimi } from "./components/KisayolYardimi";

// Yayın Modu nadiren açılıyor (çoğu kullanıcı hiç açmıyor) — ayrı parçaya alınıp
// yalnızca düğmeye basılınca yüklenir (T-13 Adım 1).
const BroadcastMode = lazy(() =>
  import("./components/broadcast").then((m) => ({ default: m.BroadcastMode }))
);

function YayinYukleniyor() {
  return (
    <div className="fixed inset-0 z-[85] bg-[#0a0d12] flex items-center justify-center">
      <span className="live-dot w-3 h-3 rounded-full bg-brand" />
    </div>
  );
}

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

  useKlavyeKisayollari({
    aktif: !broadcast,
    gunKaydir,
    bugüneDön,
    aramaRef,
    aramaMobilRef,
    setKisayolYardimi,
  });

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

  const veri = useGunVerisi(data, curated);
  const arama = useAramaSonuclari(veri, query);

  const searching = query.trim().length > 0;
  const toplamSonuc = searching
    ? arama.olay.length +
      arama.dogum.length +
      arama.vefat.length +
      arama.dosya.length +
      arama.bilim.length
    : 0;
  const noSearchResults = searching && toplamSonuc === 0;

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

    const ozet = veri.spotlight?.title
      ? `${dayLabel}: ${veri.spotlight.title}`
      : `${dayLabel} tarihinde yaşanan olaylar, doğanlar ve kaybettiklerimiz.`;

    ayarla('meta[name="description"]', ozet);
    ayarla('meta[property="og:title"]', baslik);
    ayarla('meta[property="og:description"]', ozet);
    ayarla('link[rel="canonical"]', `${location.origin}/${toDaySlug(month, day)}`);
  }, [dayLabel, veri.spotlight, month, day]);

  // geçersiz slug → 404 (tüm hook'lardan sonra, her render'da aynı sırayı korumak için)
  if (!parsed) return <NotFound />;

  return (
    <div className="glowfield min-h-screen relative">
      <div className="gridlines fixed inset-0 pointer-events-none" />
      <div className="noise" />
      <Toaster />
      <a href="#top" className="skip-link">
        Ana içeriğe atla
      </a>

      <UstBar
        query={query}
        setQuery={setQuery}
        dayLabel={dayLabel}
        talkCardsVar={veri.talkCards.length > 0}
        onBroadcast={() => setBroadcast(true)}
        aramaRef={aramaRef}
        aramaMobilRef={aramaMobilRef}
        searching={searching}
        toplamSonuc={toplamSonuc}
        arama={arama}
      />

      <main id="top" className="relative">
        <AcilisBolumu
          day={day}
          month={month}
          year={today.getFullYear()}
          onChangeDay={setDate}
          onOpenPicker={() => setPickerOpen((o) => !o)}
          pickerOpen={pickerOpen}
          isToday={isToday}
          shareDay={shareDay}
          dayLabel={dayLabel}
          loading={loading}
          data={data}
          gecikti={gecikti}
          reload={reload}
          bugüneDön={bugüneDön}
          curated={curated}
          setDate={setDate}
          veri={veri}
        />

        <BolumNav visible={!noSearchResults} />

        <Bolumler
          noSearchResults={noSearchResults}
          query={query}
          setQuery={setQuery}
          bugüneDön={bugüneDön}
          data={data}
          loading={loading}
          veri={veri}
          arama={arama}
          dayLabel={dayLabel}
          onBroadcast={() => setBroadcast(true)}
        />
      </main>

      <AltBilgi />

      {broadcast && veri.talkCards.length > 0 && (
        <Suspense fallback={<YayinYukleniyor />}>
          <BroadcastMode
            cards={veri.talkCards}
            dayLabel={dayLabel}
            onClose={() => setBroadcast(false)}
          />
        </Suspense>
      )}

      {kisayolYardimi && <KisayolYardimi onClose={() => setKisayolYardimi(false)} />}
    </div>
  );
}
