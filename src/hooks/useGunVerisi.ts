import { useMemo } from "react";
import {
  CASE_LABELS,
  CATEGORIES,
  RECORD_SCOPES,
  RECORD_STATUS_LABELS,
  type CaseFile,
  type CaseType,
  type CuratedDay,
  type ScienceMilestone,
  type TalkCard,
  type WorldRecord,
} from "../data";
import { REKORLAR } from "../data/rekorlar";
import { buildRekorTalk, gununRekorlari } from "../lib/rekor";
import { buildAutoTalk, classifyItem, detectDarkItem, type DayData } from "../lib/wiki";
import {
  formatYear,
  itemToPeople,
  matchQuery,
  type MergedEvent,
  type PersonCard,
} from "../components/sections";

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

export interface Spotlight {
  kicker: string;
  title: string;
  text: string;
  curated: boolean;
}

export interface GunVerisi {
  mergedEvents: MergedEvent[];
  births: PersonCard[];
  deaths: PersonCard[];
  allCases: CaseFile[];
  allScience: (ScienceMilestone & { curated?: boolean })[];
  rekorlar: WorldRecord[];
  talkCards: TalkCard[];
  spotlight: Spotlight | null;
  tickerItems: { year: number; text: string }[];
  ambientYears: number[];
}

/** Günün ham `data` (Vikipedi) + `curated` (editör) verisinden bölümlerin ihtiyaç
 * duyduğu türetilmiş listeleri hesaplar. Davranış T-13 öncesiyle birebir aynı —
 * yalnızca App.tsx'ten buraya taşındı (Adım 6).
 *
 * `month`/`day` yalnızca Rekorlar Kasası için gerekir: rekor havuzu güne göre
 * değil rotasyonla dağıtılır, bu yüzden Vikipedi verisinden türetilemez. */
export function useGunVerisi(
  data: DayData | null,
  curated: CuratedDay | undefined,
  month: number,
  day: number
): GunVerisi {
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
      const page = item.pages?.find((p) => p.extract || p.content_urls?.desktop?.page);
      out.push({
        id: item.id,
        year: item.year,
        text: item.text,
        category: classifyItem(item.text),
        curated: false,
        page: page
          ? { title: page.title, extract: page.extract, url: page.content_urls?.desktop?.page }
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
        theme === "Suikast"
          ? "suikast"
          : theme === "İnfaz & İdam"
            ? "idam"
            : theme === "Kayıp & Gizem"
              ? "kayıp"
              : theme === "Felaket"
                ? "felaket"
                : "katliam";
      auto.push({
        id: `auto-${item.id}`,
        year: item.year,
        type,
        title: firstClause(item.text),
        location: "Arşiv taraması — otomatik tespit",
        status: "KAPANDI",
        summary: truncate(item.text, 240),
        detail: item.pages?.[0]?.extract || item.text,
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
        summary: e.pages?.[0]?.extract || truncate(e.text, 260),
        curated: false,
      }));
    return [...base, ...auto].sort((a, b) => b.year - a.year);
  }, [data, curated]);

  /* ---------- rekorlar kasası ---------- */
  const rekorlar: WorldRecord[] = useMemo(
    () => gununRekorlari(REKORLAR, month, day).gosterilecek,
    [month, day]
  );

  /* ---------- sohbet kartları ---------- */
  const talkCards: TalkCard[] = useMemo(() => {
    const base = curated?.talk || [];
    // Rekor kartları editör kartlarının hemen ardına girer, otomatik Vikipedi
    // kartlarının önüne: elle yazılmış oldukları için kalite sıraları oradadır.
    const rekorKartlari = buildRekorTalk(rekorlar);
    if (!data) return [...base, ...rekorKartlari];
    return [...base, ...rekorKartlari, ...buildAutoTalk(data)].slice(0, 9);
  }, [data, curated, rekorlar]);

  /* ---------- öne çıkan dosya ---------- */
  const spotlight: Spotlight | null = useMemo(() => {
    if (curated?.spotlight) return { ...curated.spotlight, curated: true };
    const featured = data?.selected?.[0] || mergedEvents[Math.floor(mergedEvents.length / 2)];
    if (!featured) return null;
    const extract =
      "pages" in featured && featured.pages?.[0]?.extract ? featured.pages[0].extract : undefined;
    return {
      kicker: "Arşivden öne çıkan",
      title: truncate(featured.text, 90),
      text: extract ? truncate(extract, 240) : "",
      curated: false,
    };
  }, [curated, data, mergedEvents]);

  /* ---------- bant ---------- */
  const tickerItems = useMemo(() => {
    if (mergedEvents.length === 0) return [];
    const step = Math.max(1, Math.floor(mergedEvents.length / 14));
    return mergedEvents
      .filter((_, i) => i % step === 0)
      .slice(0, 14)
      .map((e) => ({ year: e.year, text: e.text }));
  }, [mergedEvents]);

  /* ---------- ambiyans yılları ---------- */
  const ambientYears = useMemo(() => {
    if (mergedEvents.length === 0) return [];
    const ys = [
      mergedEvents[0]?.year,
      mergedEvents[Math.floor(mergedEvents.length / 2)]?.year,
      mergedEvents[mergedEvents.length - 1]?.year,
    ].filter(Boolean) as number[];
    return [...new Set(ys)].slice(0, 3);
  }, [mergedEvents]);

  return {
    mergedEvents,
    births,
    deaths,
    allCases,
    allScience,
    rekorlar,
    talkCards,
    spotlight,
    tickerItems,
    ambientYears,
  };
}

export interface AramaSonuclari {
  olay: MergedEvent[];
  dogum: PersonCard[];
  vefat: PersonCard[];
  dosya: CaseFile[];
  bilim: (ScienceMilestone & { curated?: boolean })[];
  rekor: WorldRecord[];
}

/** Arama metnini bölümlerin (Zaman Tüneli, Doğanlar, Kaybettiklerimiz, Karanlık
 * Dosyalar, Bilim & Keşif) her biri için TEK SEFERDE süzer. Hem üst bardaki arama
 * sonuç sayacı hem de bölüm bileşenleri aynı sonuçtan beslenir — önceden ikisi
 * ayrı ayrı aynı `matchQuery` taramasını tekrarlıyordu (T-09 notu, m-8). Alan
 * listeleri, öncesinde her bölümün kendi içinde kullandığı listelerle birebir
 * aynı (bkz. T-13 Tamamlanma Kaydı — üst bardaki sayaç daha dar bir alan listesi
 * kullanıyordu, burada bölümlerle birleştirilerek tutarlı hale getirildi). */
export function useAramaSonuclari(veri: GunVerisi, query: string): AramaSonuclari {
  return useMemo(() => {
    if (!query.trim()) {
      return {
        olay: veri.mergedEvents,
        dogum: veri.births,
        vefat: veri.deaths,
        dosya: veri.allCases,
        bilim: veri.allScience,
        rekor: veri.rekorlar,
      };
    }
    return {
      olay: veri.mergedEvents.filter((e) =>
        matchQuery(query, e.text, e.detail, e.page?.extract, formatYear(e.year))
      ),
      dogum: veri.births.filter((p) =>
        matchQuery(query, p.name, p.extract, formatYear(p.year), CATEGORIES[p.category].label)
      ),
      vefat: veri.deaths.filter((p) =>
        matchQuery(query, p.name, p.extract, formatYear(p.year), CATEGORIES[p.category].label)
      ),
      dosya: veri.allCases.filter((c) =>
        matchQuery(
          query,
          c.title,
          c.summary,
          c.detail,
          c.location,
          formatYear(c.year),
          c.tags.join(" "),
          CASE_LABELS[c.type]
        )
      ),
      bilim: veri.allScience.filter((s) =>
        matchQuery(query, s.title, s.summary, s.field, formatYear(s.year))
      ),
      rekor: veri.rekorlar.filter((r) =>
        matchQuery(
          query,
          r.title,
          r.holder,
          r.value,
          r.summary,
          r.story,
          r.place,
          r.tags.join(" "),
          formatYear(r.year),
          RECORD_SCOPES[r.scope].label,
          RECORD_STATUS_LABELS[r.status]
        )
      ),
    };
  }, [veri, query]);
}
