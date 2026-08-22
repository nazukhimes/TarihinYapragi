import type { CategoryId } from "../data/types";

export const trLower = (s: string) => s.toLocaleLowerCase("tr-TR");

/**
 * JS'in `\b`/`\w`'ı yalnızca ASCII harfleri "kelime karakteri" sayar —
 * ç/ğ/ı/ö/ş/ü bu kapsamda değildir. Sonuç: `\bçığ\b` gibi bir kalıp hem
 * "çığır"a hatalı eşleşebilir HEM DE (daha ciddisi) sıradan bir cümlede
 * "çığ " biçiminde HİÇ eşleşmeyebilir — boşluk da "ğ" de `\w` dışı sayıldığı
 * için ikisi arasında `\b` oluşmaz. Türkçe harfle başlayan/biten kalıplarda
 * bu yüzden `\b` yerine `(?<![a-zçğıöşü])` / `(?![a-zçğıöşü])` (Türkçe
 * harfleri de kapsayan elle yazılmış sınır) kullanılır. Kaynak: T-11
 * sırasında gerçek veriyle doğrulanan bir bulgu (bkz. T-11 Tamamlanma Kaydı).
 */

/**
 * Eşit puanda öncelik sırası (yüksekten düşüğe):
 *   felaket > savas > siyaset > bilim > kesif > kultur > spor > genel
 * Gerekçe: Bir olay hem felaket hem siyaset olabilir; kullanıcı için
 * "ne oldu" (felaket) "kim yaptı"dan (siyaset) önce gelir. Askerî/silahlı
 * konu, sivil siyasi kurumsal konudan önce gelir (savas > siyaset).
 * "genel" hiçbir kuralın eşleşmediği varsayılan durumdur, puan alamaz.
 */
const PRIORITY: CategoryId[] = [
  "felaket",
  "savas",
  "siyaset",
  "bilim",
  "kesif",
  "kultur",
  "spor",
  "genel",
];

interface Kural {
  kategori: CategoryId;
  desen: RegExp;
  puan: number; // 3 = güçlü ipucu, 2 = orta, 1 = zayıf/destekleyici
}

/**
 * Sıra ÖNEMLİ DEĞİL — "ilk eşleşen kazanır" yerine tüm kurallar denenir,
 * kategori bazında puanlar toplanır, en yüksek toplam kazanır (eşitlikte
 * yukarıdaki PRIORITY sırası). Kalıplar Türkçe ek toleransı için genelde
 * kelime **köküne** demirlenir (`\b` başta), sona serbest ek bırakılır;
 * yanlış pozitif riski yüksek kısa kalıplar (kaza, ay', ordu, patlama, sel,
 * bat-) bağlamla birlikte yazılır (bkz. T-11 Tamamlanma Kaydı, Sorun 2).
 */
const KURALLAR: Kural[] = [
  // ---- felaket ----
  { kategori: "felaket", desen: /\b(deprem|tsunami|kasırga)/, puan: 3 },
  { kategori: "felaket", desen: /\bvolkan(ik)?/, puan: 3 },
  { kategori: "felaket", desen: /\b(salgın|pandemi|kıtlık)/, puan: 3 },
  { kategori: "felaket", desen: /\bfacia/, puan: 2 },
  { kategori: "felaket", desen: /\byangın|\byan(dı|ıyor|arak)/, puan: 2 },
  { kategori: "felaket", desen: /(?<![a-zçğıöşü])çığ(?![a-zçğıöşü])/, puan: 2 },
  { kategori: "felaket", desen: /\b(uçak|tren|maden|trafik|otobüs) kaza/, puan: 2 },
  { kategori: "felaket", desen: /\b(uçak|helikopter)\w* düş/, puan: 2 },
  { kategori: "felaket", desen: /raydan çık/, puan: 2 },
  { kategori: "felaket", desen: /toprak kayması/, puan: 2 },
  { kategori: "felaket", desen: /\b(gemi|vapur|feribot|transatlantik)\w*(?:\s+\S+){0,2}\s+bat(tı|an|ıyor)/, puan: 2 },
  { kategori: "felaket", desen: /(gaz|bomba|maden|fabrika) patlama/, puan: 2 },
  { kategori: "felaket", desen: /\bsel felaketi|\bsel bask[ıi]n/, puan: 2 },
  { kategori: "felaket", desen: /(?<![a-zçğıöşü])çök(tü|en|müş)/, puan: 2 },

  // ---- savas ----
  { kategori: "savas", desen: /\bsavaş/, puan: 3 },
  { kategori: "savas", desen: /\bmuharebe/, puan: 3 },
  { kategori: "savas", desen: /\bkuşat/, puan: 3 },
  { kategori: "savas", desen: /\bişgal (etti|edil|altın)/, puan: 3 },
  { kategori: "savas", desen: /\bcephe/, puan: 3 },
  { kategori: "savas", desen: /\bfetih\b|\bfethet/, puan: 3 },
  { kategori: "savas", desen: /\bistila/, puan: 3 },
  { kategori: "savas", desen: /\bharekât/, puan: 2 },
  { kategori: "savas", desen: /\b(osmanlı|türk|kızıl|alman|rus|sovyet|amerikan|ingiliz|fransız|japon|italyan|yunan) ordu/, puan: 2 },
  { kategori: "savas", desen: /\bisyan|\bayaklanma/, puan: 2 },
  { kategori: "savas", desen: /\bateşkes/, puan: 2 },
  { kategori: "savas", desen: /\bzafer kazan/, puan: 2 },
  { kategori: "savas", desen: /\bsaldır/, puan: 2 },
  { kategori: "savas", desen: /(?<![a-zçğıöşü])çarpış/, puan: 1 },

  // ---- siyaset ----
  { kategori: "siyaset", desen: /\bcumhurbaşkan/, puan: 3 },
  { kategori: "siyaset", desen: /\banayasa/, puan: 3 },
  { kategori: "siyaset", desen: /\bparlamento/, puan: 3 },
  { kategori: "siyaset", desen: /\bmeclis/, puan: 3 },
  { kategori: "siyaset", desen: /\bseç(il|im)/, puan: 3 },
  { kategori: "siyaset", desen: /\bdarbe/, puan: 3 },
  { kategori: "siyaset", desen: /\bbağımsızlığ(ı|ını) (ilan|kazan|kabul)/, puan: 3 },
  { kategori: "siyaset", desen: /\bbaşbakan/, puan: 2 },
  { kategori: "siyaset", desen: /\bbakan(ı|lar|lığ)/, puan: 2 },
  { kategori: "siyaset", desen: /\b(ant|an)laşma(sı|yı)? imzala|\bsözleşme(si)? imzala/, puan: 2 },
  { kategori: "siyaset", desen: /\bistifa/, puan: 2 },
  { kategori: "siyaset", desen: /\bkral(lık)?|\bkraliçe/, puan: 2 },
  { kategori: "siyaset", desen: /\bpapa(?!ğan|ya\b)|\bpapalığ/, puan: 2 },
  { kategori: "siyaset", desen: /\bimparator/, puan: 2 },
  { kategori: "siyaset", desen: /\bsıkıyönetim/, puan: 2 },
  { kategori: "siyaset", desen: /\bdevrim/, puan: 1 },
  { kategori: "siyaset", desen: /\bdevlet\b/, puan: 1 },
  { kategori: "siyaset", desen: /\bcumhuriyet/, puan: 1 },

  // ---- bilim ----
  { kategori: "bilim", desen: /\bdna\b|\bgenom/, puan: 3 },
  { kategori: "bilim", desen: /\bkuantum/, puan: 3 },
  { kategori: "bilim", desen: /\bnükleer|\bradyoaktif/, puan: 3 },
  { kategori: "bilim", desen: /\başı(sı|yı)? (geliştir|bul|icat)/, puan: 3 },
  { kategori: "bilim", desen: /\bbilim/, puan: 2 },
  { kategori: "bilim", desen: /\bfizik/, puan: 2 },
  { kategori: "bilim", desen: /\bkimya/, puan: 2 },
  { kategori: "bilim", desen: /\bmatematik/, puan: 2 },
  { kategori: "bilim", desen: /\bameliyat/, puan: 2 },
  { kategori: "bilim", desen: /\bdeney(?!im)/, puan: 2 },
  { kategori: "bilim", desen: /\bteori/, puan: 2 },
  { kategori: "bilim", desen: /\bformül/, puan: 2 },
  { kategori: "bilim", desen: /\bevrim/, puan: 2 },
  { kategori: "bilim", desen: /\bhücre/, puan: 2 },
  { kategori: "bilim", desen: /\blaboratuvar/, puan: 1 },
  { kategori: "bilim", desen: /\batom/, puan: 1 },

  // ---- kesif ----
  { kategori: "kesif", desen: /\buzay/, puan: 3 },
  { kategori: "kesif", desen: /\bnasa\b/, puan: 3 },
  { kategori: "kesif", desen: /\broket/, puan: 3 },
  { kategori: "kesif", desen: /\byörünge/, puan: 3 },
  { kategori: "kesif", desen: /\bteleskop/, puan: 3 },
  { kategori: "kesif", desen: /\buydu(su|yu)?\b/, puan: 3 },
  { kategori: "kesif", desen: /\bmars['’]|\bmars gezegen|\bmars yüzey/, puan: 3 },
  { kategori: "kesif", desen: /\bay['’](a|ın|da|dan)\b/, puan: 3 },
  { kategori: "kesif", desen: /\bkeşif|\bkeşfett|\bkeşfedil/, puan: 3 },
  { kategori: "kesif", desen: /\bicat|\bpatent/, puan: 2 },
  { kategori: "kesif", desen: /\bkutup\b|\bkutb/, puan: 2 },
  { kategori: "kesif", desen: /\bilk ([a-zçğıöşü]+ )?(insan|yolculuk|uçuş)/, puan: 2 },
  { kategori: "kesif", desen: /\bkıta(sı|yı)? keşf/, puan: 2 },

  // ---- kultur ----
  { kategori: "kultur", desen: /\broman/, puan: 3 },
  { kategori: "kultur", desen: /\bsenfoni/, puan: 3 },
  { kategori: "kultur", desen: /\bopera/, puan: 3 },
  { kategori: "kultur", desen: /\btiyatro/, puan: 3 },
  { kategori: "kultur", desen: /\btablo/, puan: 3 },
  { kategori: "kultur", desen: /\bmüze/, puan: 3 },
  { kategori: "kultur", desen: /\bedebiyat/, puan: 3 },
  { kategori: "kultur", desen: /\bbeste/, puan: 3 },
  { kategori: "kultur", desen: /\bheykel/, puan: 3 },
  { kategori: "kultur", desen: /\bkütüphane/, puan: 2 },
  { kategori: "kultur", desen: /\bfilm/, puan: 2 },
  { kategori: "kultur", desen: /\bkitap|\bkitab/, puan: 2 },
  { kategori: "kultur", desen: /\bresim|\bressam/, puan: 2 },
  { kategori: "kultur", desen: /\balbüm/, puan: 2 },
  { kategori: "kultur", desen: /\bkonser/, puan: 2 },
  { kategori: "kultur", desen: /\byazar(?!ken)/, puan: 2 },
  { kategori: "kultur", desen: /(?<![a-zçğıöşü])şair/, puan: 2 },

  // ---- spor ----
  { kategori: "spor", desen: /\bolimpiyat/, puan: 3 },
  { kategori: "spor", desen: /(?<![a-zçğıöşü])şampiyon/, puan: 3 },
  { kategori: "spor", desen: /\bdünya kupası/, puan: 3 },
  { kategori: "spor", desen: /\bfifa\b/, puan: 3 },
  { kategori: "spor", desen: /\bfutbol/, puan: 2 },
  { kategori: "spor", desen: /\bmaç/, puan: 2 },
  { kategori: "spor", desen: /\bturnuva/, puan: 2 },
  { kategori: "spor", desen: /\btenis/, puan: 2 },
  { kategori: "spor", desen: /\brekor kır/, puan: 2 },
  { kategori: "spor", desen: /\bbasketbol|\bvoleybol|\bgüreş/, puan: 2 },
];

export function classifyItem(text: string): CategoryId {
  const t = trLower(text);
  const puanlar = new Map<CategoryId, number>();

  for (const k of KURALLAR) {
    if (k.desen.test(t)) {
      puanlar.set(k.kategori, (puanlar.get(k.kategori) ?? 0) + k.puan);
    }
  }
  if (puanlar.size === 0) return "genel";

  let enIyi: CategoryId = "genel";
  let enYuksek = 0;
  for (const kat of PRIORITY) {
    const p = puanlar.get(kat) ?? 0;
    if (p > enYuksek) {
      enYuksek = p;
      enIyi = kat;
    }
  }
  return enIyi;
}

/* ---------------- karanlık arşiv taraması ---------------- */

interface KaranlikKurali {
  tema: string;
  desen: RegExp;
  puan: number;
}

const DARK_PRIORITY = ["Suikast", "İnfaz & İdam", "Kayıp & Gizem", "Şiddet", "Felaket"];

/** Toplam puan bu eşiğin altındaysa karanlık dosya sayılmaz (bkz. T-11 Adım 4). */
const DARK_ESIK = 3;

const KARANLIK: KaranlikKurali[] = [
  { tema: "Suikast", desen: /\bsuikast|(?<![a-zçğıöşü])öldürüldü/, puan: 3 },
  { tema: "İnfaz & İdam", desen: /\bidam edil|\basılarak idam|\bkurşuna dizil|\binfaz edil/, puan: 3 },
  { tema: "Kayıp & Gizem", desen: /\besrarengiz( şekilde)? kayb|\bortadan kayboldu|\bsırra kadem/, puan: 3 },
  {
    // can kaybı/yaralanma sözcüğü yakınlarda geçmeli — yoksa "X salgını sırasında/
    // nedeniyle ertelendi" gibi felaketin yalnızca zaman belirteci olarak kullanıldığı
    // cümleler de (gerçek veride görülen bir durum, ör. "Eurovision ... pandemi
    // nedeniyle ertelendi") karanlık sayılır (bkz. T-11 Tamamlanma Kaydı).
    tema: "Felaket",
    desen: /(deprem|tsunami|kasırga|salgın|pandemi|kıtlık).{0,80}(öl|yaraland|kayıp|hayatını kaybet|can kaybı)/,
    puan: 3,
  },
  { tema: "Felaket", desen: /\bfacia|\byangın|\byan(dı|ıyor|arak)|(?<![a-zçğıöşü])çığ(?![a-zçğıöşü])/, puan: 3 },
  { tema: "Felaket", desen: /\b(uçak|tren|maden|trafik|otobüs) kaza/, puan: 3 },
  { tema: "Felaket", desen: /\b(uçak|helikopter)\w* düş/, puan: 3 },
  { tema: "Felaket", desen: /raydan çık/, puan: 3 },
  { tema: "Felaket", desen: /toprak kayması/, puan: 3 },
  { tema: "Felaket", desen: /\b(gemi|vapur|feribot|transatlantik)\w*(?:\s+\S+){0,2}\s+bat(tı|an|ıyor)/, puan: 3 },
  { tema: "Felaket", desen: /(gaz|bomba|maden|fabrika) patlama/, puan: 3 },
  { tema: "Felaket", desen: /\bsel felaketi|\bsel bask[ıi]n/, puan: 3 },
  { tema: "Şiddet", desen: /\bkatliam|\bkatledil|\blinç edil|\bbombalı( intihar)? saldır|\bsilahlı saldır/, puan: 3 },
  { tema: "Şiddet", desen: /\bsaldır/, puan: 2 },
];

export function detectDarkItem(text: string): string | null {
  const t = trLower(text);
  const puanlar = new Map<string, number>();

  for (const k of KARANLIK) {
    if (k.desen.test(t)) {
      puanlar.set(k.tema, (puanlar.get(k.tema) ?? 0) + k.puan);
    }
  }
  if (puanlar.size === 0) return null;

  let enIyi: string | null = null;
  let enYuksek = 0;
  for (const tema of DARK_PRIORITY) {
    const p = puanlar.get(tema) ?? 0;
    if (p > enYuksek) {
      enYuksek = p;
      enIyi = tema;
    }
  }
  return enYuksek >= DARK_ESIK ? enIyi : null;
}
