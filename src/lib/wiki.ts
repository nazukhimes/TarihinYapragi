import { useEffect, useState } from "react";
import type { TalkCard } from "../data";
import { WIKI_API_BASE as API } from "./config";
import { detectDarkItem } from "./classification";

export { classifyItem, detectDarkItem } from "./classification";

export interface WikiPage {
  title: string;
  normalizedtitle?: string;
  description?: string;
  extract?: string;
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

export type DayErrorKind = "network" | "notfound" | "ratelimit" | "server" | "unknown";

export interface DayError {
  kind: DayErrorKind;
  message: string; // kullanıcıya gösterilecek Türkçe metin
  retryable: boolean;
}

export interface DayData {
  events: OtdItem[];
  births: OtdItem[];
  deaths: OtdItem[];
  holidays: HolidayItem[];
  selected: OtdItem[];
  sources: { events: "tr" | "en"; births: "tr" | "en"; deaths: "tr" | "en" };
  offline: boolean;
  stale: boolean; // TTL dolmuş önbellekten geldi
  error: DayError | null;
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

interface LoadResult {
  raw: RawDay | null;
  stale: boolean;
  error: DayError | null;
}

const memCache = new Map<string, DayData>();

const TTL_MS = 24 * 60 * 60 * 1000; // 24 saat
const LS_PREFIX = "ty-otd-";
const MAX_ENTRIES = 60;
const MAX_MEM = 40;

interface CachedDay {
  savedAt: number;
  data: RawDay;
}

/**
 * Bir öğeye kaç ilgili sayfa saklandığı.
 *
 * T-18 öncesinde 3'tü ve bunun bir önemi yoktu: arayüz zaten yalnızca **bir**
 * sayfa gösteriyordu. Artık hepsi çip olarak basıldığı için sınır doğrudan
 * kullanıcının gördüğü seçenek sayısıdır. 6 günlük canlı örnekte (08-24, 03-07,
 * 02-29, 10-29, 01-01, 07-15 · 233 olay) yıl maddeleri elendikten sonra
 * olayların %15'i 3'ten, yalnızca %4,3'ü 5'ten fazla sayfa taşıyordu —
 * 5, kırpmanın nadirleştiği ve çip satırının hâlâ okunabildiği yer.
 */
export const PAGES_LIMIT = 5;

/** Salt yıl başlığı: `1985`, `2016`, `MÖ 44`. */
const SALT_YIL = /^(MÖ\s*)?\d{1,4}$/;
/** Yıl maddelerinin Vikipedi açıklaması — TR'de "yıl" (2016 için "bir yıl"), EN'de "year". */
const YIL_ACIKLAMALARI = new Set(["yıl", "bir yıl", "year"]);

/**
 * Yıl maddesi mi? (`1985 · "yıl"`)
 *
 * Wikimedia `pages` dizisine olay metnindeki **yıl sayısı** için de bir madde
 * koyuyor. Bunlar T-18 öncesinde görünmüyordu, çünkü kod yalnızca ilk sayfayı
 * okuyordu; tüm sayfalar çip olarak basılınca doğrudan çöp çipe dönüşürlerdi
 * (T-16'da gözlendi, T-18 Kanıt 1b).
 *
 * İki koşul **birlikte** aranır: başlık salt yıl VE açıklama yıl maddesi kalıbı.
 * Tek başına açıklama koşulu, açıklaması rastlantıyla "yıl" olan gerçek bir
 * maddeyi de elerdi. Yukarıdaki 6 günlük örnekte 638 yıl maddesinin başlığı
 * istisnasız salt sayıydı.
 */
export function yilMaddesiMi(p: WikiPage): boolean {
  const desc = (p?.description || "").trim().toLocaleLowerCase("tr-TR");
  if (!YIL_ACIKLAMALARI.has(desc)) return false;
  return SALT_YIL.test((p.normalizedtitle || p.title || "").trim());
}

export function normalize(raw: RawOtd[] | undefined, lang: "tr" | "en", prefix: string): OtdItem[] {
  if (!raw) return [];
  return raw
    .filter((r) => r && typeof r.year === "number" && typeof r.text === "string" && r.text.trim())
    .map((r, i) => ({
      text: r.text!.trim(),
      year: r.year!,
      pages: (r.pages || []).filter((p) => !yilMaddesiMi(p)).slice(0, PAGES_LIMIT),
      lang,
      id: `${prefix}-${lang}-${r.year}-${i}`,
    }));
}

function isAbortError(e: unknown): e is DOMException {
  return e instanceof DOMException && e.name === "AbortError";
}

export function classifyStatus(status: number): DayError {
  if (status === 404) {
    return {
      kind: "notfound",
      message: "Bu gün için Vikipedi'de kayıt bulunamadı.",
      retryable: false,
    };
  }
  if (status === 429) {
    return {
      kind: "ratelimit",
      message: "Arşiv çok yoğun. Biraz sonra tekrar deneyin.",
      retryable: true,
    };
  }
  if (status >= 500) {
    return { kind: "server", message: "Vikipedi sunucusu yanıt vermiyor.", retryable: true };
  }
  return { kind: "unknown", message: "Beklenmeyen bir sorun oluştu.", retryable: true };
}

function toDayError(_e: unknown): DayError {
  return { kind: "unknown", message: "Beklenmeyen bir sorun oluştu.", retryable: true };
}

/** 429 ve 5xx için en fazla `tries` deneme (400ms, 800ms bekleme); diğer hatalarda ilk yanıt döner. */
async function fetchWithRetry(url: string, signal?: AbortSignal, tries = 2): Promise<Response> {
  let last: Response | undefined;
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { signal });
    if (res.ok) return res;
    if (res.status !== 429 && res.status < 500) return res; // kalıcı hata, deneme
    last = res;
    await new Promise((r) => setTimeout(r, 400 * (i + 1))); // 400ms, 800ms
  }
  return last!;
}

function lsGet(key: string): { data: RawDay; stale: boolean } | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedDay;
    if (!parsed?.data) return null; // eski biçim → yok say
    return { data: parsed.data, stale: Date.now() - parsed.savedAt > TTL_MS };
  } catch {
    return null;
  }
}

function lsSet(key: string, data: RawDay) {
  try {
    const payload: CachedDay = { savedAt: Date.now(), data };
    localStorage.setItem(key, JSON.stringify(payload));
    pruneCache(); // MAX_ENTRIES sınırını her yazımda uygula (ucuz: sınır altındaysa hiçbir şey silmez)
  } catch {
    pruneCache(); // dolmuşsa temizle
    try {
      localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data } as CachedDay));
    } catch {
      /* pes */
    }
  }
}

function pruneCache() {
  const entries: { key: string; savedAt: number }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k?.startsWith(LS_PREFIX)) continue;
    try {
      const p = JSON.parse(localStorage.getItem(k)!) as CachedDay;
      entries.push({ key: k, savedAt: p?.savedAt ?? 0 });
    } catch {
      localStorage.removeItem(k); // bozuk kayıt
    }
  }
  entries
    .sort((a, b) => a.savedAt - b.savedAt) // en eski önce
    .slice(0, Math.max(0, entries.length - MAX_ENTRIES))
    .forEach((e) => localStorage.removeItem(e.key));
}

function memSet(key: string, data: DayData) {
  if (memCache.size >= MAX_MEM) {
    const oldestKey = memCache.keys().next().value;
    if (oldestKey !== undefined) memCache.delete(oldestKey); // en eskisini at (FIFO)
  }
  memCache.set(key, data);
}

export async function fetchDayData(
  month: number,
  day: number,
  signal?: AbortSignal
): Promise<DayData> {
  const cacheKey = `day-${month}-${day}`;
  const hit = memCache.get(cacheKey);
  if (hit) return hit;

  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");

  const load = async (lang: "tr" | "en"): Promise<LoadResult> => {
    const lsKey = `${LS_PREFIX}${lang}-${mm}-${dd}`;
    try {
      const res = await fetchWithRetry(`${API}/${lang}/onthisday/all/${mm}/${dd}`, signal);
      if (!res.ok) {
        const cached = lsGet(lsKey);
        if (cached) return { raw: cached.data, stale: cached.stale, error: null };
        return { raw: null, stale: false, error: classifyStatus(res.status) };
      }
      const data = (await res.json()) as RawDay;
      lsSet(lsKey, data);
      return { raw: data, stale: false, error: null };
    } catch (e) {
      if (isAbortError(e)) throw e; // beklenen iptal, yukarı ilet
      const cached = lsGet(lsKey);
      if (cached) return { raw: cached.data, stale: cached.stale, error: null };
      return {
        raw: null,
        stale: false,
        error: { kind: "network", message: "İnternet bağlantısı kurulamadı.", retryable: true },
      };
    }
  };

  // TR'yi önce dene; TR'de üç ana alandan biri bile boşsa EN'i tamamlayıcı olarak çek
  const trResult = await load("tr");
  const trThin =
    !trResult.raw ||
    !trResult.raw.events?.length ||
    !trResult.raw.births?.length ||
    !trResult.raw.deaths?.length;

  const enResult = trThin ? await load("en") : null;

  const tr = trResult.raw;
  const en = enResult?.raw ?? null;

  if (!tr && !en) {
    return {
      events: [],
      births: [],
      deaths: [],
      holidays: [],
      selected: [],
      sources: { events: "en", births: "en", deaths: "en" },
      offline: true,
      stale: false,
      error: trResult.error ?? enResult?.error ?? null,
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
    stale: trResult.stale || (enResult?.stale ?? false),
    error: null,
    fetchedAt: Date.now(),
  };
  memSet(cacheKey, data);
  return data;
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

  const famousBirth = day.births.find((b) => b.pages?.some((p) => p.thumbnail && p.extract));
  if (famousBirth) {
    const p = famousBirth.pages!.find((x) => x.thumbnail && x.extract)!;
    cards.push({
      id: "auto-birth",
      category: "Bugün Doğanlar",
      hook: `${famousBirth.year}'de bugün doğan: ${p.normalizedtitle || p.title}`,
      body: firstSentence(p.extract!, 400),
      minutes: estimateMinutes(firstSentence(p.extract!, 400)),
    });
  }

  const famousDeath = day.deaths.find((d) => d.pages?.some((p) => p.extract));
  if (famousDeath) {
    const p = famousDeath.pages!.find((x) => x.extract)!;
    cards.push({
      id: "auto-death",
      category: "Aramızdan Ayrılanlar",
      hook: `${famousDeath.year}'de bugün veda etti: ${p.normalizedtitle || p.title}`,
      body: firstSentence(p.extract!, 400),
      minutes: estimateMinutes(firstSentence(p.extract!, 400)),
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
      body: day.holidays
        .map((h) => h.text)
        .slice(0, 3)
        .join(" • "),
      minutes: 1,
    });
  }

  return cards.slice(0, 5);
}

/* ---------------- hook ---------------- */

export function useDayData(month: number, day: number) {
  const [data, setData] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DayError | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    fetchDayData(month, day, ctrl.signal)
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (isAbortError(e)) return; // beklenen iptal, sessiz geç
        setError(toDayError(e));
        setLoading(false);
      });

    return () => ctrl.abort(); // gün değişince öncekini kes
  }, [month, day, reloadKey]);

  return { data, loading, error, reload: () => setReloadKey((k) => k + 1) };
}
