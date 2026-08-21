import { useEffect, useRef, useState } from "react";
import type { CategoryId, TalkCard } from "../data/curated";
import { WIKI_API_BASE as API } from "./config";

export interface WikiPage {
  title: string;
  displaytitle?: string;
  description?: string;
  excerpt?: string;
  thumbnail?: { source: string };
  originalimage?: { source: string };
  content_urls?: { desktop?: { page?: string } };
}

export interface OtdItem {
  text: string;
  year: number;
  pages?: WikiPage[];
  lang: "tr" | "en";
  id: string;
}

export interface HolidayItem {
  text: string;
  id: string;
}

export interface DayData {
  events: OtdItem[];
  births: OtdItem[];
  deaths: OtdItem[];
  holidays: HolidayItem[];
  selected: OtdItem[];
  sources: { events: "tr" | "en"; births: "tr" | "en"; deaths: "tr" | "en" };
  offline: boolean;
  fetchedAt: number;
}

interface RawOtd {
  text?: string;
  year?: number;
  pages?: WikiPage[];
}
interface RawDay {
  events?: RawOtd[];
  births?: RawOtd[];
  deaths?: RawOtd[];
  holidays?: { text?: string; pages?: WikiPage[] }[];
  selected?: RawOtd[];
}

const memCache = new Map<string, DayData>();

function normalize(raw: RawOtd[] | undefined, lang: "tr" | "en", prefix: string): OtdItem[] {
  if (!raw) return [];
  return raw
    .filter((r) => r && typeof r.year === "number" && typeof r.text === "string" && r.text.trim())
    .map((r, i) => ({
      text: r.text!.trim(),
      year: r.year!,
      pages: (r.pages || []).slice(0, 3),
      lang,
      id: `${prefix}-${lang}-${r.year}-${i}`,
    }));
}

function lsGet(key: string): RawDay | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as RawDay;
  } catch {
    return null;
  }
}

function lsSet(key: string, data: RawDay) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* dolu olabilir */
  }
}

export async function fetchDayData(month: number, day: number): Promise<DayData> {
  const cacheKey = `day-${month}-${day}`;
  const hit = memCache.get(cacheKey);
  if (hit) return hit;

  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");

  const load = async (lang: "tr" | "en"): Promise<RawDay | null> => {
    const lsKey = `ty-otd-${lang}-${mm}-${dd}`;
    try {
      const res = await fetch(`${API}/${lang}/onthisday/all/${mm}/${dd}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as RawDay;
      lsSet(lsKey, data);
      return data;
    } catch {
      return lsGet(lsKey);
    }
  };

  const [tr, en] = await Promise.all([load("tr"), load("en")]);

  if (!tr && !en) {
    return {
      events: [],
      births: [],
      deaths: [],
      holidays: [],
      selected: [],
      sources: { events: "en", births: "en", deaths: "en" },
      offline: true,
      fetchedAt: Date.now(),
    };
  }

  const pick = (key: "events" | "births" | "deaths") => {
    const trItems = normalize(tr?.[key], "tr", key);
    if (trItems.length > 0) return { items: trItems, src: "tr" as const };
    return { items: normalize(en?.[key], "en", key), src: "en" as const };
  };

  const events = pick("events");
  const births = pick("births");
  const deaths = pick("deaths");

  const selected = normalize(
    (tr?.selected && tr.selected.length > 0 ? tr.selected : en?.selected) || [],
    tr?.selected && tr.selected.length > 0 ? "tr" : "en",
    "sel"
  );

  const holidaysRaw = tr?.holidays?.length ? tr.holidays : en?.holidays || [];
  const holidays: HolidayItem[] = holidaysRaw
    .filter((h) => h.text)
    .map((h, i) => ({ text: h.text!.trim(), id: `hol-${i}` }));

  const data: DayData = {
    events: events.items,
    births: births.items,
    deaths: deaths.items,
    holidays,
    selected,
    sources: { events: events.src, births: births.src, deaths: deaths.src },
    offline: false,
    fetchedAt: Date.now(),
  };
  memCache.set(cacheKey, data);
  return data;
}

/* ---------------- sınıflandırma ---------------- */

const trLower = (s: string) => s.toLocaleLowerCase("tr-TR");

const RULES: [CategoryId, RegExp][] = [
  ["felaket", /deprem|tsunami|yangın|fırtına|kasırga|sel( |i)|volkan|kıtlık|salgın|pandemi|facia|faciası|bat(tı|an)|çök(tü|en)|kazas|felaket|çığ|patlama/],
  ["savas", /savaş|istila|işgal|saldırı|saldır|çarpış|kuşat|fetih|fethet|ordu(su)? |zafer|barış antlaş|cephede|isyan/],
  ["bilim", /aşı|deney|formül|teori|bilim|fizik|kimya|matematik|tıp|ameliyat|genom|dna|atom|nükleer|radyoaktif|kuantum|evrim|hücre|laboratuvar|makale/],
  ["kesif", /keşif|keşfett|keşfedil|icat|patent|uzay|nasa|ay'|ay yüzey|mars|teleskop|uydu|roket|uçuş|kıta|kutup|expedition|ilk (insan|yolculuk)|yörünge/],
  ["spor", /olimpiyat|şampiyon|futbol|maç|turnuva|fifa|tenis|yarış|rekor kır/],
  ["kultur", /opera|senfoni|film|roman|kitap|tiyatro|resim|albüm|konser|müze|edebiyat|besteci|yazar|şair|tablo|heykel/],
  ["siyaset", /seçil|seçim|başkan|cumhurbaşkan|bakan|parlamento|meclis|anayasa|devlet|cumhuriyet|antlaşma|devrim|istifa|krallık|kral |papa|imparator|bağımsızlık/],
];

export function classifyItem(text: string): CategoryId {
  const t = trLower(text);
  for (const [cat, re] of RULES) {
    if (re.test(t)) return cat;
  }
  return "genel";
}

/* ---------------- karanlık arşiv taraması ---------------- */

export const DARK_THEMES: [string, RegExp][] = [
  ["Suikast", /suikast|sui̇kast|öldürüldü|suikaste/],
  ["İnfaz & İdam", /idam|asılarak|kurşuna dizil|infaz/],
  ["Kayıp & Gizem", /kayboldu|kaybolan|ortadan kaybol|sırra kadem/],
  ["Felaket", /facia|kazas|bat(tı|an)|çök(tü|en)|deprem|yangın|sel( |i)|patlama/],
  ["Şiddet", /katliam|katledil|linç|bombal|saldırı/],
];

export function detectDarkItem(text: string): string | null {
  const t = trLower(text);
  for (const [label, re] of DARK_THEMES) {
    if (re.test(t)) return label;
  }
  return null;
}

/* ---------------- otomatik sohbet kartları ---------------- */

function firstSentence(s: string, max = 220): string {
  const clean = s.replace(/\s+/g, " ").trim();
  const cut = clean.search(/[.!?]["')\]]?\s/);
  const out = cut > 40 ? clean.slice(0, cut + 1) : clean;
  return out.length > max ? out.slice(0, max - 1).trimEnd() + "…" : out;
}

function estimateMinutes(body: string): 1 | 2 | 3 {
  const n = body.length;
  if (n < 240) return 1;
  if (n < 460) return 2;
  return 3;
}

export function buildAutoTalk(day: DayData): TalkCard[] {
  const cards: TalkCard[] = [];

  const featured = day.selected[0] || day.events[0];
  if (featured) {
    const body = featured.text;
    cards.push({
      id: "auto-lead",
      category: featured.year <= 500 ? "Kadim Tarih" : featured.year < 1500 ? "Orta Çağ" : "Tarih",
      hook: `Yıl ${featured.year}: Bugünün manşeti`,
      body: firstSentence(body, 420),
      minutes: estimateMinutes(firstSentence(body, 420)),
    });
  }

  const sorted = [...day.events].sort((a, b) => a.year - b.year);
  if (sorted.length > 1) {
    const oldest = sorted[0];
    const newest = sorted[sorted.length - 1];
    if (oldest.id !== newest.id) {
      cards.push({
        id: "auto-contrast",
        category: "Zaman Atlaması",
        hook: `Aynı gün, ${newest.year - oldest.year} yıl arayla`,
        body: `${oldest.year}: ${firstSentence(oldest.text, 190)} — Ve ${newest.year}: ${firstSentence(newest.text, 190)}`,
        minutes: 2,
      });
    }
  }

  const famousBirth = day.births.find((b) => b.pages?.some((p) => p.thumbnail && p.excerpt));
  if (famousBirth) {
    const p = famousBirth.pages!.find((x) => x.thumbnail && x.excerpt)!;
    cards.push({
      id: "auto-birth",
      category: "Bugün Doğanlar",
      hook: `${famousBirth.year}'de bugün doğan: ${p.displaytitle || p.title}`,
      body: firstSentence(p.excerpt!, 400),
      minutes: estimateMinutes(firstSentence(p.excerpt!, 400)),
    });
  }

  const famousDeath = day.deaths.find((d) => d.pages?.some((p) => p.excerpt));
  if (famousDeath) {
    const p = famousDeath.pages!.find((x) => x.excerpt)!;
    cards.push({
      id: "auto-death",
      category: "Aramızdan Ayrılanlar",
      hook: `${famousDeath.year}'de bugün veda etti: ${p.displaytitle || p.title}`,
      body: firstSentence(p.excerpt!, 400),
      minutes: estimateMinutes(firstSentence(p.excerpt!, 400)),
    });
  }

  const dark = day.deaths.map((d) => ({ d, theme: detectDarkItem(d.text) })).find((x) => x.theme);
  if (dark) {
    cards.push({
      id: "auto-dark",
      category: "Karanlık Tarih",
      hook: `Karanlık arşivden: ${dark.theme}`,
      body: firstSentence(dark.d.text, 420),
      minutes: estimateMinutes(firstSentence(dark.d.text, 420)),
    });
  }

  if (day.holidays.length > 0) {
    cards.push({
      id: "auto-holiday",
      category: "Bugünün Anlamı",
      hook: "Bugünün bir adı var",
      body: day.holidays.map((h) => h.text).slice(0, 3).join(" • "),
      minutes: 1,
    });
  }

  return cards.slice(0, 5);
}

/* ---------------- hook ---------------- */

export function useDayData(month: number, day: number) {
  const [data, setData] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const reqId = useRef(0);

  useEffect(() => {
    const id = ++reqId.current;
    setLoading(true);
    fetchDayData(month, day).then((d) => {
      if (reqId.current === id) {
        setData(d);
        setLoading(false);
      }
    });
  }, [month, day, reloadKey]);

  return { data, loading, reload: () => setReloadKey((k) => k + 1) };
}
