/**
 * YAPAY ZEKÂ KATMANI — sağlayıcıdan bağımsız arayüz (T-20, web araması T-25)
 *
 * Bu dosya **hiçbir sağlayıcıyı tanımaz.** Gemini'ye özgü her şey `gemini.ts`
 * içindedir; panel yalnızca `index.ts`'in dışa aktardığı `saglayici`yı çağırır.
 *
 * Arama isteğe bağlıdır (`YzIstek.arama`) ve çağrı noktasının kararıdır —
 * sağlayıcı yalnızca uygular. Başka bir sağlayıcıya geçmek gerektiğinde
 * değişecek tek yer `gemini.ts`'in yanına konacak yeni bir dosya ve
 * `index.ts`'teki tek satır olsun.
 */

/** Modelin **neyi** araştıracağını söyleyen künye. Bağlam metninden bağımsızdır (T-25). */
export interface YzOlay {
  /** Kullanıcının baktığı takvim günü + olayın yılı: "24 Ağustos 1814". */
  tarih: string;
  /** Beslemenin olay cümlesi (`OtdItem.text`) ya da kişi/dosya başlığı. */
  baslik: string;
  /** Bağlamın geldiği Vikipedi maddesi — çağrı noktasındaki `kaynakAdi`. */
  madde?: string;
}

export interface YzIstek {
  /** Kullanıcının sorusu; boşsa moduna göre bir varsayılan görev kullanılır. */
  soru: string;
  /** Modelin dayanacağı Vikipedi metni. **Boş geçilmez** — bağlamsız çağrı
   *  halüsinasyon üretir (T-20 §Halüsinasyon Riski). */
  baglam: string;
  /** Modelin **neyi** araştıracağını netleştiren künye — yoksa bağlam metnine düşülür. */
  olay?: YzOlay;
  /** Web araması açık mı — çağrı noktası karar verir, sağlayıcı değil (T-25). */
  arama: boolean;
  /** Panel kapandığında / gün değiştiğinde iptal için. */
  signal?: AbortSignal;
}

export interface YzYanit {
  /** Düz metin yanıt. HTML **değildir**, düz metin olarak basılır. */
  metin: string;
  /** Model **gerçekten** aradı mı? `webSearchQueries` doluysa evet. */
  arandi: boolean;
  /** En çok 5, URL'e göre tekilleştirilmiş. `url` Google yönlendirmesidir, olduğu gibi kullanılır. */
  kaynaklar: { baslik: string; url: string }[];
  /** Modelin Google'da aradığı sorgular — künye satırında/öneri olarak gösterilir. */
  sorgular: string[];
  /** `searchEntryPoint.renderedContent` — Plan A seçilirse sandbox `iframe` içinde basılır. */
  aramaOnerileriHtml?: string;
  /** Arama istenmişti ama bu model desteklemiyor; istek sessizce aramasız tekrarlandı
   *  (bkz. `gemini.ts` > 400 tuzağı, T-25 madde 5). Panel bu durumda `YZ_MESAJ.aramaYok`'u gösterir. */
  aramaDesteklenmedi?: boolean;
}

export interface YzSaglayici {
  /** Kullanıcıya gösterilen ad — ayarlar ekranında ve künye satırında geçer. */
  ad: string;
  sor(istek: YzIstek): Promise<YzYanit>;
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
   * 404 — anahtar geçerli ama modellerin **hiçbiri** yok. `gemini.ts` 404'te
   * aday zincirindeki bir sonraki modele sessizce geçer (T-24); bu mesaj
   * yalnızca zincirin tamamı tükenince görülür. Artık bunu görmek kaynak
   * kodu güncellemeyi gerektirmez — ayarlardan "Modelleri getir" ile
   * anahtarın gördüğü modeller listelenip elle seçilebilir.
   */
  model: "Model bulunamadı; sağlayıcı bu modeli artık sunmuyor olabilir.",
  /**
   * 200 döndü, aday var ama metin yok çünkü `finishReason: MAX_TOKENS`.
   * Düşünen modellerde (bkz. `gemini.ts` > `YANIT_JETONU`) düşünme jetonları
   * da çıktı bütçesinden yenir; bütçe darsa model yalnızca düşünür ve
   * tek harf metin döndürmez.
   */
  kesik: "Yanıt tamamlanamadan kesildi. Tekrar deneyin.",
  /** "Bağlantıyı sına" başarıyla dönünce gösterilir — ayarlardaki tek tanı aracı (T-24 madde 4). */
  baglantiTamam: "Bağlantı çalışıyor.",
  /** "Modelleri getir" sıfır sonuç dönünce — anahtar geçerli ama kullanılabilir model yok. */
  modelListesiBos: "Bu anahtarla metin üretebilen bir model bulunamadı.",
  /** Arama istenmişti ama model desteklemiyordu; istek sessizce aramasız tekrarlandı (T-25 madde 5). */
  aramaYok: "Web araması yapılamadı; yanıt yalnızca sayfadaki metne dayanıyor.",
  /** Günlük arama kotası ayrı bir hata yüzeyi doğurursa kullanılacak Türkçe metin (T-25 madde 4). */
  aramaKotasi: "Günlük arama hakkı dolmuş olabilir; yanıt sayfadaki metne dayanıyor.",
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
