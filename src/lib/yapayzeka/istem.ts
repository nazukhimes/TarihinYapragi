/**
 * İSTEM KURULUMU — iki mod (T-20 §Halüsinasyon Riski, T-25 web araması)
 *
 * T-20 modeli bilerek ekrandaki Vikipedi paragrafına hapsetmişti (Gemini'nin
 * ücretsiz katmanında o tarihte web araması yoktu). Bu artık doğru değil —
 * `google_search` aracı ücretsiz katmana da açıldı (T-25 §Araştırma Kaydı).
 * Kısıtı kaldırmanın dürüst yolu modeli serbest bırakmak değil, ona gerçek bir
 * arama aracı vermek: bu yüzden burada **iki ayrı kurallı gövde** var.
 *
 * - Arama açıkken: model "hatırla"nın ötesine geçip **araştırır**; eldeki metin
 *   bir başlangıç noktasıdır, sınır değildir.
 * - Arama kapalıyken (ya da 400 tuzağı yüzünden geri çekilince): T-20'nin
 *   orijinal kuralı **birebir** korunur — model yalnızca eldeki metni kullanır,
 *   bilmediğini "kaynakta belirtilmemiş" diye işaretler.
 *
 * Hangi modun seçildiği çağrı noktasının (kullanıcının ayarlardan seçtiği
 * tercih) kararıdır; bu dosya sağlayıcıdan da çağrı noktasından da bağımsızdır.
 */

import type { YzOlay } from "./tipler";

/** Kaynağa sadık modda, kullanıcı soru yazmadan düğmeye bastığında çalışan görev. */
export const VARSAYILAN_ISTEM =
  "Bu olayı, bir yayıncının dinleyicisine anlatacağı gibi kısaca açıkla.";

/** Araştırma modunda, kullanıcı soru yazmadan düğmeye bastığında çalışan görev. */
export const VARSAYILAN_ISTEM_ARASTIRMA =
  "Bu olayı araştır; ne olduğunu ve neden önemli olduğunu kısaca özetle.";

/** Serbest soru kutusuna basılan ipucu metni. */
export const SORU_IPUCU = "Bu olay hakkında bir şey sor…";

/**
 * Uzun bağlam kırpma sınırı.
 *
 * Vikipedi `extract`leri tipik olarak 400–1100 karakterdir; bu sınır
 * "Daha fazlasını oku"nun getirdiği daha uzun özetler ve editör `detail`
 * metinleri için bir emniyet valfidir. Ücretsiz katmanda jeton bütçesini
 * korur, kelime ortasında kesmemek için son boşluktan böler.
 */
const BAGLAM_SINIRI = 4000;

export function baglamiKirp(baglam: string): string {
  const temiz = baglam.trim();
  if (temiz.length <= BAGLAM_SINIRI) return temiz;
  const kesik = temiz.slice(0, BAGLAM_SINIRI);
  const sonBosluk = kesik.lastIndexOf(" ");
  return (sonBosluk > BAGLAM_SINIRI * 0.8 ? kesik.slice(0, sonBosluk) : kesik) + "…";
}

/** Arama açıkken kullanılan kurallı gövde — metin `Hazır İstem Metni` bölümünden birebir. */
const ARASTIRMA_KURALLARI = [
  "Sen Türkçe yazan bir tarih anlatıcısısın. Görevin, aşağıda künyesi verilen olayı",
  "Google Arama ile araştırıp anlaşılır bir özet çıkarmaktır.",
  "",
  "Nasıl çalışacaksın:",
  "- Önce araştır. Künyedeki tarihi, olay cümlesini ve madde adını kullanarak arama",
  "  yap; tek arama yetmezse birden fazla arama yap.",
  '- "ELDEKİ METİN" bir başlangıç ipucudur, sınır değildir. Metinde olmayan ama',
  "  aramayla doğruladığın bilgiyi ekle.",
  "- Eldeki metin ile arama sonuçları çelişirse çelişkiyi gizleme: yaygın kabul",
  '  göreni yaz, diğerini "bazı kaynaklarda ..." diye belirt.',
  '- Bulamadığını uydurma. Arama sonuç vermezse "güvenilir bir kaynakta bulamadım"',
  "  de ve elindekiyle yetin.",
  "- Tarih, yer, sayı ve özel adları yalnızca bir kaynakta gördüysen yaz.",
  "- Künyedeki tarih olayın tarihidir; başka bir yılın olayını anlatma.",
  "",
  "Nasıl yazacaksın:",
  "- Türkçe, sade, akıcı. Bir yayıncının dinleyicisine anlatacağı ton.",
  "- 120-200 kelime, tek parça düz paragraf.",
  "- Madde işareti, başlık, numaralı liste, yıldız, kare, HTML kullanma.",
  "- Yanıtın sonuna kaynak listesi ekleme; bağlantılar ayrıca gösteriliyor.",
  "- Soruyu tekrar etme, doğrudan anlatmaya başla.",
].join("\n");

/** Arama kapalıyken (ya da geri çekilmede) kullanılan kurallı gövde — T-20'nin orijinali, değişmedi. */
const KAYNAGA_SADIK_KURALLARI = [
  "Aşağıdaki Vikipedi metnine dayanarak yanıt ver.",
  "",
  "Kurallar:",
  "- Yalnızca metinde yazanı kullan; metinde olmayan bilgi ekleme.",
  '- Emin olmadığın yeri "kaynakta belirtilmemiş" olarak işaretle.',
  "- Türkçe, sade ve akıcı yaz. Madde işareti kullanma, düz paragraf yaz.",
  "- Biçimlendirme işareti (yıldız, kare, HTML) kullanma; düz metin yaz.",
].join("\n");

/** Olay künyesi bloğu. `arama` modunda `madde` satırı da eklenir (boşsa hiç yazılmaz). */
function kunyeBlogu(olay: YzOlay, arama: boolean): string {
  const satirlar = [`Tarih: ${olay.tarih}`, `Olay: ${olay.baslik}`];
  if (arama && olay.madde) satirlar.push(`İlgili Vikipedi maddesi: ${olay.madde}`);
  return ["--- OLAY KÜNYESİ ---", ...satirlar].join("\n");
}

/**
 * Görevi, künyeyi (varsa) ve bağlamı tek bir isteme birleştirir.
 *
 * Kurallar bağlamın **önüne** yazılır: model uzun bir metnin sonundaki
 * yönergeden çok başındakine uyar. Araştırma modunda istem uzadığı için görev
 * satırı **iki kez** yazılır — kurallardan hemen sonra ve metnin en sonunda —
 * ki model metnin başında okuduğu görevi sonda tazelesin.
 *
 * Künye yoksa `--- OLAY KÜNYESİ ---` bloğu tümüyle atlanır; araştırma modu bu
 * durumda da çalışır, yalnızca bağlam metnine düşer.
 */
export function istemBirlestir(
  istem: string,
  baglam: string,
  arama: boolean,
  olay?: YzOlay
): string {
  const gorev = istem.trim() || (arama ? VARSAYILAN_ISTEM_ARASTIRMA : VARSAYILAN_ISTEM);
  const kunye = olay ? kunyeBlogu(olay, arama) : "";
  const kirpik = baglamiKirp(baglam);

  if (arama) {
    return [
      ARASTIRMA_KURALLARI,
      "",
      `Görev: ${gorev}`,
      "",
      ...(kunye ? [kunye] : []),
      "--- ELDEKİ METİN (Vikipedi özeti; sınır değil, başlangıç) ---",
      kirpik,
      "--- METİN SONU ---",
      "",
      `Görev: ${gorev}`,
    ].join("\n");
  }

  return [
    KAYNAGA_SADIK_KURALLARI,
    "",
    `Görev: ${gorev}`,
    "",
    ...(kunye ? [kunye] : []),
    "--- VİKİPEDİ METNİ ---",
    kirpik,
    "--- METİN SONU ---",
  ].join("\n");
}
