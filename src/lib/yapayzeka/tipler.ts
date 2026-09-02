/**
 * YAPAY ZEKÂ KATMANI — sağlayıcıdan bağımsız arayüz (T-20)
 *
 * Bu dosya **hiçbir sağlayıcıyı tanımaz.** Gemini'ye özgü her şey `gemini.ts`
 * içindedir; panel yalnızca `index.ts`'in dışa aktardığı `saglayici`yı çağırır.
 *
 * Gerekçe: ücretsiz katmanda **web araması yoktur** (bkz. `istem.ts`).
 * Arama destekli bir sağlayıcıya geçmek gerektiğinde değişecek tek yer
 * `gemini.ts`'in yanına konacak yeni bir dosya ve `index.ts`'teki tek satır olsun.
 */

export interface YzSaglayici {
  /** Kullanıcıya gösterilen ad — ayarlar ekranında ve künye satırında geçer. */
  ad: string;
  /**
   * @param istem   Kullanıcının sorusu ya da varsayılan "açıkla" görevi.
   * @param baglam  Modelin dayanacağı Vikipedi metni. **Boş geçilmez** —
   *                bağlamsız çağrı halüsinasyon üretir (T-20 §Halüsinasyon Riski).
   * @param signal  Panel kapandığında / gün değiştiğinde iptal için.
   * @returns       Düz metin yanıt. HTML **değildir**, düz metin olarak basılır.
   */
  sor(istem: string, baglam: string, signal?: AbortSignal): Promise<string>;
}

/**
 * Kullanıcıya **doğrudan gösterilebilir** Türkçe hata.
 *
 * `lib/sayfaOzeti.ts`'teki `OzetHatasi` ile aynı desen: ayrı bir tip olmasının
 * tek sebebi `catch` bloğunda kendi mesajımızı ham ağ hatasından ayırmaktır.
 * Panel bu mesajı olduğu gibi basar ve **Vikipedi içeriğiyle çalışmaya devam eder.**
 */
export class YzHatasi extends Error {
  constructor(message: string) {
    super(message);
    this.name = "YzHatasi";
  }
}

/** T-20 madde 6'daki dört hata durumunun metinleri — tek yerde. */
export const YZ_MESAJ = {
  anahtar: "Anahtar geçersiz görünüyor. Ayarlardan kontrol edin.",
  kota: "Günlük ücretsiz kota dolmuş olabilir. Yarın tekrar deneyin.",
  ag: "Bağlantı kurulamadı.",
  zamanAsimi: "Yanıt gelmedi, tekrar deneyin.",
  /** Dördün dışında kalan tek durum: sağlayıcı ayakta değil. */
  sunucu: "Yapay zekâ servisi şu an yanıt vermiyor.",
  /** 200 döndü ama içerik yok (güvenlik filtresi, boş aday). */
  bos: "Model bu metin için yanıt üretmedi.",
  /**
   * 404 — anahtar geçerli ama model yok. Eskiden `ag`'ye düşüyordu ve
   * "Bağlantı kurulamadı." diyordu; oysa bağlantı kurulmuştu, kurulmayan
   * şey modeldi. İki durumu ayırmak `GEMINI_MODEL`'i güncellemek gerektiğini
   * söyleyen tek ipucudur.
   */
  model: "Model bulunamadı; sağlayıcı bu modeli artık sunmuyor olabilir.",
  /**
   * 200 döndü, aday var ama metin yok çünkü `finishReason: MAX_TOKENS`.
   * Düşünen modellerde (bkz. `gemini.ts` > `YANIT_JETONU`) düşünme jetonları
   * da çıktı bütçesinden yenir; bütçe darsa model yalnızca düşünür ve
   * tek harf metin döndürmez.
   */
  kesik: "Yanıt tamamlanamadan kesildi. Tekrar deneyin.",
} as const;

/**
 * HTTP durumundan Türkçe mesaj. `sayfaOzeti.ts`'teki `ozetDurumMesaji` ile aynı ton.
 *
 * 400 de anahtar hatası sayılır: Gemini geçersiz anahtarı `400 API_KEY_INVALID`
 * ile döndürür, `401` ile değil.
 */
export function yzDurumMesaji(status: number): string {
  if (status === 400 || status === 401 || status === 403) return YZ_MESAJ.anahtar;
  if (status === 404) return YZ_MESAJ.model;
  if (status === 429) return YZ_MESAJ.kota;
  if (status >= 500) return YZ_MESAJ.sunucu;
  return YZ_MESAJ.ag;
}
