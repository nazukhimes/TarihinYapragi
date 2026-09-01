/**
 * SAYFA ÖZETİ — "Daha fazlasını oku"
 *
 * REST `page/summary` uç noktasından **tek bir maddenin** özetini getirir.
 * Çağrı yalnızca kullanıcı düğmeye bastığında yapılır; sayfa yüklenirken
 * hiçbir istek çıkmaz (T-19 madde 4, otomatik çağrı = günde 40+ boşuna istek).
 *
 * ## Bu katmanın neyi getirdiği — ve neyi getirmediği
 *
 * T-19 Kanıt 3 bu uç noktanın "`extract`ten daha uzun metin" verdiğini
 * söylüyordu; **canlı ölçümde öyle değil.** 24 Ağustos beslemesinin 14 sayfası
 * iki uçtan da çekilip karşılaştırıldı: `page/summary`'nin `extract`i,
 * beslemenin `extract`iyle **bayt bayt aynı** (İtalya 853/853, Fırat Kalkanı
 * Harekâtı 1087/1087, Windows 95 625/625 …). Besleme zaten sayfa özetlerini
 * gömüyor.
 *
 * Bu yüzden düğme, beslemede **özeti bulunmayan** bir maddeye bağlanır:
 * T-18'in çapraz eşlemeyle bulduğu **olay makalesi**. 24 Ağustos 1814 olayında
 * beslemenin verdiği metin `İngiltere` maddesinin özetidir (444 karakter,
 * İngiltere'nin coğrafyası); bu uçtan gelen `Washington Yangını` özeti ise
 * olayın kendisini anlatır. Aradaki fark, T-18'in T-19'a bıraktığı birinci iştir.
 *
 * Çağrı noktası bunu `DetayPaneli`'nin `ozetBasligi` prop'uyla seçer: elinde
 * özeti zaten olan bir sayfadan başkası yoksa düğme hiç basılmaz (O-15 ilkesi —
 * kullanıcı aynı metni ikinci kez okumaya çağrılmaz).
 */

const ZAMAN_ASIMI_MS = 12_000;

export interface SayfaOzeti {
  /** API'nin normalleştirdiği başlık. */
  baslik: string;
  /** Özet metni (`extract`). Boş dönen yanıt hata sayılır. */
  metin: string;
  /** Maddenin adresi — elle kurulmaz, yanıttan gelir. */
  url?: string;
  /** Küçük görsel; olmayabilir. */
  gorsel?: string;
}

interface HamOzet {
  title?: string;
  titles?: { normalized?: string };
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
  thumbnail?: { source: string };
}

/**
 * Kullanıcıya **doğrudan gösterilebilir** Türkçe hata.
 *
 * Ayrı bir tip olmasının tek sebebi `catch` bloğunda kendi mesajımızı ağ
 * hatasından ayırmaktır; panel bu mesajı olduğu gibi basar ve kapanmaz.
 */
export class OzetHatasi extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OzetHatasi";
  }
}

/** Başlık → özet. Yalnızca **başarılı** yanıtlar saklanır; hata tekrar denenebilsin. */
const onbellek = new Map<string, SayfaOzeti>();

/** Testler için — modül düzeyindeki önbelleği sıfırlar. */
export function ozetOnbelleginiTemizle(): void {
  onbellek.clear();
}

/** HTTP durumundan Türkçe mesaj. `wiki.ts`'teki `classifyStatus` ile aynı ton. */
export function ozetDurumMesaji(status: number): string {
  if (status === 404) return "Bu madde Vikipedi'de bulunamadı.";
  if (status === 429) return "Arşiv çok yoğun. Biraz sonra tekrar deneyin.";
  if (status >= 500) return "Vikipedi sunucusu yanıt vermiyor.";
  return "Özet alınamadı.";
}

/** `Washington Yangını` → `.../page/summary/Washington_Yang%C4%B1n%C4%B1` */
export function ozetUrl(baslik: string, dil: "tr" | "en"): string {
  return `https://${dil}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    baslik.trim().replace(/ /g, "_")
  )}`;
}

/**
 * Bir maddenin özetini getirir.
 *
 * - Aynı başlık ikinci kez istendiğinde **ağa çıkılmaz**, önbellekten döner.
 * - Hata hâlinde `OzetHatasi` fırlatır; mesajı Türkçe ve gösterilebilirdir.
 * - Çağıranın `signal`'i iptal ederse (panel kapandı, gün değişti) iptal
 *   hatası **yukarı iletilir** — bu bir hata değil, beklenen bir durumdur.
 */
export async function sayfaOzetiGetir(
  baslik: string,
  dil: "tr" | "en" = "tr",
  signal?: AbortSignal
): Promise<SayfaOzeti> {
  const anahtar = `${dil}:${baslik.trim()}`;
  const bellek = onbellek.get(anahtar);
  if (bellek) return bellek;

  // Kendi süremizi koyuyoruz; dışarıdan gelen iptal de bu denetleyiciye bağlanır.
  const ctrl = new AbortController();
  let zamanAsti = false;
  const zamanlayici = setTimeout(() => {
    zamanAsti = true;
    ctrl.abort();
  }, ZAMAN_ASIMI_MS);
  const disaridanIptal = () => ctrl.abort();
  signal?.addEventListener("abort", disaridanIptal);

  try {
    const res = await fetch(ozetUrl(baslik, dil), { signal: ctrl.signal });
    if (!res.ok) throw new OzetHatasi(ozetDurumMesaji(res.status));

    const ham = (await res.json()) as HamOzet;
    const metin = (ham.extract || "").trim();
    if (!metin) throw new OzetHatasi("Bu madde için özet bulunamadı.");

    const ozet: SayfaOzeti = {
      baslik: ham.titles?.normalized || ham.title || baslik,
      metin,
      url: ham.content_urls?.desktop?.page,
      gorsel: ham.thumbnail?.source,
    };
    onbellek.set(anahtar, ozet);
    return ozet;
  } catch (e) {
    if (signal?.aborted) throw e; // beklenen iptal — çağıran bilmeli
    if (zamanAsti) throw new OzetHatasi("Yanıt gelmedi, tekrar deneyin.");
    if (e instanceof OzetHatasi) throw e;
    throw new OzetHatasi("Bağlantı kurulamadı.");
  } finally {
    clearTimeout(zamanlayici);
    signal?.removeEventListener("abort", disaridanIptal);
  }
}
