/**
 * İSTEM KURULUMU — halüsinasyon azaltma (T-20 §Halüsinasyon Riski)
 *
 * Gemini ücretsiz katmanında **web araması yoktur**; model yalnızca kendi
 * hafızasından konuşur. Niş Türkiye tarihi konularında (1958 Bursa Kapalı Çarşı
 * yangını gibi) bu gerçek bir uydurma riskidir: model olayı "hatırlamaya"
 * çalışır ve hatırlamadığında tarih, yer, sayı uydurur.
 *
 * Azaltma, görevi **"hatırla"dan "açıkla"ya çevirmektir**: elimizdeki Vikipedi
 * metni isteme bağlam olarak gömülür, model o metnin dışına çıkmaması için
 * açıkça sınırlanır ve bilmediği yeri uydurmak yerine işaretlemesi istenir.
 *
 * Bunun T-16 olmadan **teknik olarak mümkün olmadığını** not etmek gerekir:
 * `extract` alanı T-16 öncesinde hiç okunmuyordu (yanlış alan adı yüzünden
 * beslemenin bütün metni atılıyordu), yani gömülecek bağlam yoktu.
 *
 * Bu dosya sağlayıcıdan bağımsızdır — arama destekli bir sağlayıcıya geçilse
 * bile "kaynağın dışına çıkma" kuralı aynı kalır.
 */

/** Kullanıcı soru yazmadan düğmeye bastığında çalışan görev. */
export const VARSAYILAN_ISTEM =
  "Bu olayı, bir yayıncının dinleyicisine anlatacağı gibi kısaca açıkla.";

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

/**
 * Görevi ve bağlamı tek bir isteme birleştirir.
 *
 * Kurallar bağlamın **önüne** yazılır: model uzun bir metnin sonundaki
 * yönergeden çok başındakine uyar. Bağlam en sona, açık bir ayraçla konur ki
 * metnin içindeki cümleler yönerge sanılmasın.
 */
export function istemBirlestir(istem: string, baglam: string): string {
  const gorev = istem.trim() || VARSAYILAN_ISTEM;
  return [
    "Aşağıdaki Vikipedi metnine dayanarak yanıt ver.",
    "",
    "Kurallar:",
    "- Yalnızca metinde yazanı kullan; metinde olmayan bilgi ekleme.",
    '- Emin olmadığın yeri "kaynakta belirtilmemiş" olarak işaretle.',
    "- Türkçe, sade ve akıcı yaz. Madde işareti kullanma, düz paragraf yaz.",
    "- Biçimlendirme işareti (yıldız, kare, HTML) kullanma; düz metin yaz.",
    "",
    `Görev: ${gorev}`,
    "",
    "--- VİKİPEDİ METNİ ---",
    baglamiKirp(baglam),
    "--- METİN SONU ---",
  ].join("\n");
}
