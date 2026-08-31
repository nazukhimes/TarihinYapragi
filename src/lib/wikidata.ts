import { useEffect, useState } from "react";

/**
 * WIKIDATA REKOR KATMANI — "bugün kırılan rekor"
 *
 * Editör havuzu (`src/data/rekorlar.ts`) elle yazılır ve yavaş büyür. Bu katman
 * onun yanında, seçili güne ait **tarihi doğrulanmış** rekorları canlı çeker.
 *
 * Kaynak: Wikidata `P1000` ("record held") ifadeleri, `P580` (başlangıç tarihi)
 * niteleyicisiyle. Ay/gün eşleşmesi doğrudan SPARQL'de yapılır.
 *
 * ## Neden Wikidata, neden Guinness değil
 *
 * Guinness World Records'ın halka açık bir API'si yok ve kullanım şartları
 * içeriğin kopyalanıp yeniden yayımlanmasını açıkça yasaklıyor. Wikidata ise
 * CC0 — yani kamu malı. Buradan gelen kayıtlar rekorun **olgusudur**, GWR'ın
 * metni değil.
 *
 * ## Bu katmanın sınırları (dürüst kayıt)
 *
 * - Havuz dar: `P1000` ifadelerinin tamamı bini bulmuyor ve ağırlıkla atletizm
 *   ile havacılık kazalarından oluşuyor. Çoğu gün hiç sonuç dönmez — bu normaldir.
 * - Türkçe etiket kapsamı zayıf. Etiketi çözülemeyen kayıtlar ham `Q…` kimliği
 *   olarak döner; bunlar kullanıcıya gösterilmez, `temizle()` tarafından ayıklanır.
 * - Sorgu servisi (WDQS) yoğun saatlerde yavaşlar. Bu ikincil bir katmandır:
 *   başarısız olursa sessizce boş döner, bölüm editör havuzuyla çalışmaya devam eder.
 */

const ENDPOINT = "https://query.wikidata.org/sparql";
/**
 * Sondaki sayı önbellek sürümüdür. `normalize()` kuralları değiştiğinde artırılır:
 * eski anahtarla yazılmış kayıtlar eski elemeyle üretilmiştir ve TTL dolana kadar
 * (7 gün) ekranda kalırdı.
 */
const LS_PREFIX = "ty-wdrec2-";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 gün — rekor verisi sık değişmez
const ZAMAN_ASIMI_MS = 12_000;
/** SPARQL'den istenen ham satır sayısı — eleme sonrası azalır. */
const LIMIT = 20;
/** Şeritte gösterilecek en fazla satır. Uzun liste editör kartlarını bastırıyor. */
const GOSTERIM_SINIRI = 6;

export interface WikidataRekor {
  id: string;
  /** Rekoru elinde tutan kişi/kurum. */
  holder: string;
  /** Rekorun adı. */
  record: string;
  /** Rekorun kurulduğu yıl. */
  year: number;
  /** Vikipedi/Wikidata sayfası. */
  url?: string;
}

export interface SparqlBinding {
  holder?: { value: string };
  holderLabel?: { value: string };
  recLabel?: { value: string };
  start?: { value: string };
}

function sorgu(month: number, day: number): string {
  return `SELECT ?holder ?holderLabel ?recLabel ?start WHERE {
  ?holder p:P1000 ?st .
  ?st ps:P1000 ?rec ; pq:P580 ?start .
  FILTER(MONTH(?start) = ${month} && DAY(?start) = ${day})
  SERVICE wikibase:label { bd:serviceParam wikibase:language "tr,en". }
}
LIMIT ${LIMIT}`;
}

/**
 * Etiketi çözülememiş kayıtları ayıklar.
 *
 * Wikidata'nın etiket servisi, öğenin ne TR ne EN etiketi varsa ham kimliği
 * (`Q3922803`) etiket olarak döndürür. Bunu ekrana basmak kullanıcıya hiçbir şey
 * anlatmaz — canlı veriyle doğrulanmış bir davranış, bkz. 5 Ağustos sorgusu.
 */
function etiketGecerli(s: string | undefined): s is string {
  return !!s && s.trim().length > 0 && !/^Q\d+$/.test(s.trim());
}

/**
 * Hiçbir şey anlatmayan rekor adları.
 *
 * Wikidata'da pek çok ifade rekoru yalnızca "national record" olarak adlandırır;
 * hangi ülke, hangi branş, hangi değer olduğu ifadenin niteleyicilerinde durur ve
 * etiket servisine yansımaz. Ekranda "Israel Olatunde — national record" satırı
 * yayıncıya kullanılabilir bir şey vermez (16 Ağustos sorgusunda gözlendi).
 */
const JENERIK_ADLAR = /^(national|world|olympic|european|continental)?\s*record$/i;

export function normalize(bindings: SparqlBinding[]): WikidataRekor[] {
  const out: WikidataRekor[] = [];
  const gorulenKisi = new Set<string>();

  for (const b of bindings) {
    const holder = b.holderLabel?.value?.trim();
    const record = b.recLabel?.value?.trim();
    const start = b.start?.value;
    if (!etiketGecerli(holder) || !etiketGecerli(record) || !start) continue;
    if (JENERIK_ADLAR.test(record)) continue;

    const yil = Number(start.slice(0, 4));
    if (!Number.isFinite(yil)) continue;

    // Kişi başına tek satır: aynı sporcunun aynı gün birden çok mesafede rekor
    // kırması sık (ör. 800 m + 1500 m serbest), listeyi tek isim dolduruyor.
    const kisi = holder.toLocaleLowerCase("tr-TR");
    if (gorulenKisi.has(kisi)) continue;
    gorulenKisi.add(kisi);

    out.push({
      id: `wd-${b.holder?.value?.split("/").pop() ?? out.length}`,
      holder,
      record,
      year: yil,
      url: b.holder?.value,
    });
  }

  return out.sort((a, b) => b.year - a.year).slice(0, GOSTERIM_SINIRI);
}

interface Cached {
  savedAt: number;
  items: WikidataRekor[];
}

function lsGet(key: string): WikidataRekor[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cached;
    if (!Array.isArray(parsed?.items)) return null;
    if (Date.now() - parsed.savedAt > TTL_MS) return null;
    return parsed.items;
  } catch {
    return null;
  }
}

function lsSet(key: string, items: WikidataRekor[]) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), items } as Cached));
  } catch {
    /* kota dolu — önbelleksiz devam, wiki.ts'teki gün önbelleği önceliklidir */
  }
}

const memCache = new Map<string, WikidataRekor[]>();

/**
 * Seçili güne ait Wikidata rekorlarını getirir.
 *
 * Hiçbir durumda hata fırlatmaz (`AbortError` hariç — o yukarı iletilir ki
 * `useEffect` temizliği sessiz kalsın). Ağ hatası, zaman aşımı, bozuk yanıt:
 * hepsi boş dizi döner.
 */
export async function fetchWikidataRekorlari(
  month: number,
  day: number,
  signal?: AbortSignal
): Promise<WikidataRekor[]> {
  const anahtar = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const bellek = memCache.get(anahtar);
  if (bellek) return bellek;

  const lsKey = `${LS_PREFIX}${anahtar}`;
  const onbellek = lsGet(lsKey);
  if (onbellek) {
    memCache.set(anahtar, onbellek);
    return onbellek;
  }

  // WDQS yoğun saatlerde dakikalarca bekletebiliyor; kendi süremizi koyuyoruz.
  const ctrl = new AbortController();
  const zamanlayici = setTimeout(() => ctrl.abort(), ZAMAN_ASIMI_MS);
  const disaridanIptal = () => ctrl.abort();
  signal?.addEventListener("abort", disaridanIptal);

  try {
    const url = `${ENDPOINT}?format=json&query=${encodeURIComponent(sorgu(month, day))}`;
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/sparql-results+json" },
    });
    if (!res.ok) return [];

    const json = (await res.json()) as { results?: { bindings?: SparqlBinding[] } };
    const items = normalize(json.results?.bindings ?? []);

    memCache.set(anahtar, items);
    lsSet(lsKey, items);
    return items;
  } catch (e) {
    // Dışarıdan gelen iptal (gün değişti) çağıranın bilmesi gereken bir durum;
    // kendi zaman aşımımız ise sıradan bir başarısızlık — boş dön.
    if (signal?.aborted) throw e;
    return [];
  } finally {
    clearTimeout(zamanlayici);
    signal?.removeEventListener("abort", disaridanIptal);
  }
}

/** Bölüm için hook — yükleniyor durumunu ayrı tutar ki iskelet gösterilebilsin. */
export function useWikidataRekorlari(month: number, day: number) {
  const [items, setItems] = useState<WikidataRekor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);

    fetchWikidataRekorlari(month, day, ctrl.signal)
      .then((r) => {
        setItems(r);
        setLoading(false);
      })
      .catch(() => {
        /* iptal — yeni gün için yeni istek zaten yolda */
      });

    return () => ctrl.abort();
  }, [month, day]);

  return { items, loading };
}
