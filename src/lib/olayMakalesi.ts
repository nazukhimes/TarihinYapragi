import { useEffect, useState } from "react";
import { WIKI_API_BASE as FEED_API } from "./config";
import type { DayData, OtdItem, WikiPage } from "./wiki";

/**
 * OLAY MAKALESİ KATMANI — "Bu olay hakkında"
 *
 * Türkçe `onthisday` beslemesi bir olayın `pages` dizisini **olay metnindeki
 * geçiş sırasına** göre doldurur; ilk geçen varlık genellikle bir ülke ya da
 * şehirdir. Olayın kendisine ait bir Vikipedi makalesi TR'de var olsa bile
 * besleme onu bağlamaz (O-14).
 *
 * İngilizce besleme aynı gün için belirgin biçimde daha zengindir (24 Ağustos:
 * EN 75 olay, TR 39) ve olay makalelerine doğrudan bağlanır:
 *
 *     EN 1814 · pages[0] = Burning_of_Washington · "1814 British attack on the United States"
 *
 * Bu katman EN beslemesinden olay makalesini bulur ve `langlinks` ile TR
 * karşılığını çözer → **Washington Yangını**.
 *
 * ## Bu katmanın sınırları (dürüst kayıt)
 *
 * - **Tahmin etmez, ya bulur ya susar.** Üç kapıdan (aynı yıl → aynı olay →
 *   olay makalesi) biri bile geçilmezse hiçbir şey döndürmez; arayüzde
 *   "bulunamadı" satırı çıkmaz (T-18 madde 6).
 * - İsabet oranı 6 günlük canlı örnekte (08-24, 03-07, 02-29, 10-29, 01-01,
 *   07-15 · 233 TR olayı) şöyle daralıyor: **135** olayın EN'de aynı yıla düşen
 *   bir karşılığı var → **28**'i üç kapıyı da geçiyor → bunların **18**'inin TR
 *   Vikipedi'de makalesi var. Yani kullanıcıya ulaşan çip **233 olayın 18'inde
 *   (%7,7)**. Kalanlar EN'de de genel varlığa bağlanıyor ya da TR karşılığı yok.
 *   **Bu normaldir** — katman ikincildir, çipler onsuz da çalışır.
 * - Ağ hatası, zaman aşımı, bozuk yanıt: hepsi boş nesne döner.
 */

/** MediaWiki Action API — TR karşılığı yalnızca EN wiki'den `lllang=tr` ile çözülür. */
const LANGLINKS_ENDPOINT = "https://en.wikipedia.org/w/api.php";
/** Anonim istemci için `titles` sınırı 50'dir. */
const BASLIK_YIGINI = 50;
const LS_PREFIX = "ty-olaymak-";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 gün — geçmiş bir günün eşlemesi değişmez
const ZAMAN_ASIMI_MS = 12_000;

export interface OlayMakalesi {
  /** TR Vikipedi'deki makale adı. */
  title: string;
  /** TR makalenin adresi — langlinks'in `url` alanından gelir, elle kurulmaz. */
  url: string;
}

/* ---------------- saf yardımcılar (test edilebilir) ---------------- */

/**
 * İki dildeki metni karşılaştırılabilir kılar: aksanları çözer, Türkçe'ye özgü
 * harfleri ASCII karşılıklarına indirir, küçültür. "Getúlio" ↔ "Getulio",
 * "Bişkek" ↔ "biskek".
 */
export function katla(s: string): string {
  return s
    .normalize("NFD") // ş → s + çengel, ğ → g + kısa çizgi, ö → o + iki nokta
    .replace(/[\u0300-\u036f]/g, "") // birleşen işaretleri at
    .replace(/ı/g, "i") // ı'nın ayrıştırılabilir bir biçimi yok
    .toLowerCase();
}

/**
 * Metinden karşılaştırmaya değer jetonları çıkarır.
 *
 * Türkçe ek ayrılır (`Washington'u` → `washington`), 4 harften kısa kelimeler
 * atılır: "the", "ile", "bir" gibi kelimeler iki metni rastgele eşleştirirdi.
 */
export function jetonlar(metin: string): string[] {
  return [
    ...new Set(
      katla(metin)
        .replace(/['’][a-z]*/g, " ")
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length >= 4)
    ),
  ];
}

/**
 * İki jeton kümesinin örtüşme sayısı.
 *
 * Tam eşitliğin yanında 5 harflik ön ek eşleşmesi de sayılır: aynı özel isim
 * iki dilde çoğu zaman yalnızca son harflerde ayrışır (`grunwald` ↔ `grunwaldu`).
 * Çeviriyle tamamen değişen adlar (`Kudüs` ↔ `Jerusalem`) yakalanmaz; o olaylar
 * eşleştirilemez ve sessizce atlanır.
 */
export function ortakJetonSayisi(a: string[], b: string[]): number {
  let n = 0;
  for (const x of a) {
    for (const y of b) {
      const onEk =
        x.length >= 5 &&
        y.length >= 5 &&
        (x.startsWith(y.slice(0, 5)) || y.startsWith(x.slice(0, 5)));
      if (x === y || onEk) {
        n++;
        break;
      }
    }
  }
  return n;
}

/**
 * Yıl bir **aralığın** parçası mı? — `(1912–1991)`, `from 1929 to 1931`, `(1936–39)`
 *
 * Aralık, bir varlığın ne kadar sürdüğünü anlatır; belirli bir günde olan bir
 * olayı değil. Bu kapı olmadan 1991 olayı "Sovyetler Birliği Komünist Partisi"ne
 * (`Ruling party … (1912–1991)`), 1954 olayı "Café Filho"ya
 * (`President of Brazil from 1954 to 1955`) bağlanıyordu — yani O-14'ün ta kendisi.
 */
export function yilAralikta(metin: string, yil: number): boolean {
  const n = String(Math.abs(yil));
  const kalip = [
    `[\\u2013\\u2014-]\\s*${n}\\b`, // "1912–1991"
    `\\bto\\s+${n}\\b`, // "from 1929 to 1931"
    `\\b${n}\\s*[\\u2013\\u2014-]`, // "1936–39"
    `\\b${n}\\s+to\\b`, // "1954 to 1955"
  ].join("|");
  return new RegExp(kalip).test(metin);
}

/** `AD 161`, `404`, `44 BC` — EN tarafındaki yıl maddeleri. */
const SALT_YIL_EN = /^(AD\s+)?\d{1,4}(\s+BC)?$/i;

/**
 * Bu sayfa olayın **kendisine** ait bir makale mi?
 *
 * Tek ölçüt: olayın yılı başlıkta ya da açıklamada, bir aralığın parçası
 * olmadan geçiyor. `Burning of Washington · "1814 British attack…"` geçer;
 * `Amelia Earhart · "American aviation pioneer (1897–1937)"` geçmez — 1932
 * olayında Amelia Earhart'ı "bu olay hakkında" diye sunmak, reddedilen
 * puanlama sezgiselinin bozduğu örneğin aynısıdır (O-14).
 */
export function olayMakalesiMi(p: WikiPage, yil: number): boolean {
  const baslik = (p.normalizedtitle || p.title || "").replace(/_/g, " ").trim();
  if (SALT_YIL_EN.test(baslik)) return false;
  const n = Math.abs(yil);
  const yilGecer = new RegExp(`(^|[^0-9])${n}($|[^0-9])`);
  // Başlık ve açıklama **ayrı ayrı** sınanır; birleştirilirlerse araya konan
  // ayraç aralık kalıbına benzeyip yılı boşuna eleyebilir.
  return [baslik, p.description || ""].some((a) => yilGecer.test(a) && !yilAralikta(a, yil));
}

/**
 * Aynı yıla düşen EN olayları arasından TR olayının eşini seçer.
 *
 * **Yıl tek başına yetmez.** 24 Ağustos'ta 1992'nin TR karşılığı "Çin ve Güney
 * Kore arasında diplomatik ilişkiler başladı", EN karşılığı ise Hurricane
 * Andrew: aynı yıl, bambaşka olay. Bu yüzden en az bir ortak özel isim jetonu
 * şart koşulur ve berabere kalan adaylar elenir.
 */
export function esOlayiBul<T extends { text: string }>(trText: string, adaylar: T[]): T | null {
  if (adaylar.length === 0) return null;
  const tj = jetonlar(trText);
  const puanlar = adaylar.map((a) => ortakJetonSayisi(tj, jetonlar(a.text)));
  const enIyi = Math.max(...puanlar);
  if (enIyi === 0) return null; // ortak hiçbir şey yok → aynı olay olduğuna güvenemeyiz
  if (puanlar.filter((p) => p === enIyi).length > 1) return null; // belirsiz → sus
  return adaylar[puanlar.indexOf(enIyi)];
}

/**
 * Önbellek anahtarı: olayın **içeriğinden** türetilir, dizinden değil.
 *
 * `OtdItem.id` beslemedeki sıraya bağlıdır (`events-tr-1814-24`); Vikipedi araya
 * bir olay eklerse tüm kimlikler kayar ve 7 günlük önbellek yanlış olaya
 * eşleşirdi.
 */
export function olayAnahtari(yil: number, text: string): string {
  return `${yil}|${katla(text).slice(0, 60)}`;
}

/* ---------------- ağ ---------------- */

interface HamOlay {
  text?: string;
  year?: number;
  pages?: WikiPage[];
}

interface LanglinksYanit {
  query?: {
    pages?: { title?: string; langlinks?: { title?: string; url?: string }[] }[];
  };
}

/** EN beslemesinin olaylarını getirir. Başarısızlıkta boş dizi. */
async function enOlaylari(mm: string, dd: string, signal: AbortSignal): Promise<HamOlay[]> {
  const res = await fetch(`${FEED_API}/en/onthisday/events/${mm}/${dd}`, { signal });
  if (!res.ok) return [];
  const json = (await res.json()) as { events?: HamOlay[] };
  return json.events || [];
}

/** EN başlıklarının TR karşılıklarını 50'lik yığınlar hâlinde çözer. */
async function trKarsiliklari(
  basliklar: string[],
  signal: AbortSignal
): Promise<Map<string, OlayMakalesi>> {
  const out = new Map<string, OlayMakalesi>();
  for (let i = 0; i < basliklar.length; i += BASLIK_YIGINI) {
    const yigin = basliklar.slice(i, i + BASLIK_YIGINI);
    const url =
      `${LANGLINKS_ENDPOINT}?action=query&prop=langlinks&lllang=tr&llprop=url` +
      `&lllimit=max&format=json&formatversion=2&origin=*&titles=${encodeURIComponent(yigin.join("|"))}`;
    const res = await fetch(url, { signal });
    if (!res.ok) continue;
    const json = (await res.json()) as LanglinksYanit;
    for (const p of json.query?.pages || []) {
      const ll = p.langlinks?.[0];
      // TR makalesi olmayan sayfa (`langlinks` yok) sessizce atlanır.
      if (!p.title || !ll?.title || !ll.url) continue;
      out.set(p.title, { title: ll.title, url: ll.url });
    }
  }
  return out;
}

interface Onbellek {
  savedAt: number;
  /** olayAnahtari() → TR makale */
  eslesme: Record<string, OlayMakalesi>;
}

function lsGet(key: string): Record<string, OlayMakalesi> | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Onbellek;
    if (!parsed?.eslesme || Date.now() - parsed.savedAt > TTL_MS) return null;
    return parsed.eslesme;
  } catch {
    return null;
  }
}

function lsSet(key: string, eslesme: Record<string, OlayMakalesi>) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), eslesme } as Onbellek));
  } catch {
    /* kota dolu — önbelleksiz devam, wiki.ts'teki gün önbelleği önceliklidir */
  }
}

const memCache = new Map<string, Record<string, OlayMakalesi>>();

/**
 * Günün TR olayları için EN olay makalelerini bulur ve TR karşılıklarını çözer.
 *
 * Dönen nesne `olayAnahtari()` ile anahtarlanır. Hiçbir durumda hata fırlatmaz
 * (dışarıdan gelen iptal hariç — onu çağıran bilmelidir).
 */
export async function fetchOlayMakaleleri(
  month: number,
  day: number,
  trOlaylar: Pick<OtdItem, "year" | "text">[],
  signal?: AbortSignal
): Promise<Record<string, OlayMakalesi>> {
  const anahtar = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const bellek = memCache.get(anahtar);
  if (bellek) return bellek;

  const lsKey = `${LS_PREFIX}${anahtar}`;
  const onbellek = lsGet(lsKey);
  if (onbellek) {
    memCache.set(anahtar, onbellek);
    return onbellek;
  }

  if (trOlaylar.length === 0) return {};

  // İki uçtan (besleme + Action API) veri çekiliyor; kendi süremizi koyuyoruz.
  const ctrl = new AbortController();
  const zamanlayici = setTimeout(() => ctrl.abort(), ZAMAN_ASIMI_MS);
  const disaridanIptal = () => ctrl.abort();
  signal?.addEventListener("abort", disaridanIptal);

  try {
    const [mm, dd] = anahtar.split("-");
    const en = await enOlaylari(mm, dd, ctrl.signal);

    const yilaGore = new Map<number, HamOlay[]>();
    for (const e of en) {
      if (typeof e.year !== "number" || typeof e.text !== "string") continue;
      const grup = yilaGore.get(e.year);
      if (grup) grup.push(e);
      else yilaGore.set(e.year, [e]);
    }

    // Aday EN başlıkları topla — her olay için en fazla bir tane.
    const adaylar = new Map<string, string>(); // olayAnahtari → EN başlık
    for (const t of trOlaylar) {
      const es = esOlayiBul(
        t.text,
        (yilaGore.get(t.year) || []) as { text: string; pages?: WikiPage[] }[]
      );
      const sayfa = es?.pages?.find((p) => olayMakalesiMi(p, t.year));
      if (sayfa?.title) adaylar.set(olayAnahtari(t.year, t.text), sayfa.title);
    }
    if (adaylar.size === 0) {
      memCache.set(anahtar, {});
      lsSet(lsKey, {});
      return {};
    }

    const cozum = await trKarsiliklari([...new Set(adaylar.values())], ctrl.signal);

    const eslesme: Record<string, OlayMakalesi> = {};
    for (const [k, enBaslik] of adaylar) {
      // Action API başlıkları normalleştirir: `Burning_of_Washington` → `Burning of Washington`.
      const tr = cozum.get(enBaslik) ?? cozum.get(enBaslik.replace(/_/g, " "));
      if (tr) eslesme[k] = tr;
    }

    memCache.set(anahtar, eslesme);
    lsSet(lsKey, eslesme);
    return eslesme;
  } catch (e) {
    if (signal?.aborted) throw e; // gün değişti — çağıranın bilmesi gereken durum
    return {};
  } finally {
    clearTimeout(zamanlayici);
    signal?.removeEventListener("abort", disaridanIptal);
  }
}

/* ---------------- hook ---------------- */

/**
 * Bölüm için hook. Sonuç `MergedEvent.id` ile anahtarlanır ki çip render'ı
 * doğrudan bakabilsin.
 *
 * Olaylar zaten EN beslemesinden geliyorsa (TR o gün için hiç olay döndürmemiş)
 * katman hiç çalışmaz: çipler o hâlde zaten EN makalelerine gidiyordur, çapraz
 * eşleme yalnızca aynı bağlantıyı ikinci kez basardı.
 */
export function useOlayMakaleleri(
  month: number,
  day: number,
  data: DayData | null
): Record<string, OlayMakalesi> {
  const [eslesme, setEslesme] = useState<Record<string, OlayMakalesi>>({});

  useEffect(() => {
    setEslesme({});
    if (!data || data.sources.events !== "tr" || data.events.length === 0) return;

    const ctrl = new AbortController();
    fetchOlayMakaleleri(month, day, data.events, ctrl.signal)
      .then((r) => {
        // Anahtarları içerikten olay kimliğine çevir.
        const kimlige: Record<string, OlayMakalesi> = {};
        for (const e of data.events) {
          const hit = r[olayAnahtari(e.year, e.text)];
          if (hit) kimlige[e.id] = hit;
        }
        setEslesme(kimlige);
      })
      .catch(() => {
        /* iptal — yeni gün için yeni istek zaten yolda */
      });

    return () => ctrl.abort();
  }, [month, day, data]);

  return eslesme;
}
