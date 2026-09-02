/**
 * ANAHTAR YÖNETİMİ (T-20 madde 2)
 *
 * Anahtar **kullanıcınındır**: ayarlar ekranından girilir, yalnızca o tarayıcının
 * `localStorage`'ında durur ve silinebilir.
 *
 * ## Neden `.env` değil
 *
 * Bu proje backend'siz, tamamen istemci taraflı bir SPA'dır (BAGLAM.md §2).
 * `VITE_*` değişkenleri derleme sırasında **paketin içine düz metin olarak
 * gömülür**; `dist/assets/*.js` dosyasını açan herkes okur. Yani istemci
 * taraflı bir derlemede `.env` bir gizlilik aracı değildir — anahtarı oraya
 * koymak, onu yayınlamaktır. Bu yüzden anahtar depoya, sürüm kontrolüne,
 * belgelere ve `.env`'e **hiçbir koşulda** yazılmaz.
 *
 * Sunucu tarafında proxy'lenmiş bir anahtar doğru çözümdür ama backend
 * PLAN-02 §2'de kapsam dışıdır.
 */

import { useSyncExternalStore } from "react";

export const ANAHTAR_ADI = "ty-yz-anahtar";

/** Anahtar değişince abone bileşenleri uyandıran olay (bkz. `useYzAnahtari`). */
const DEGISTI = "ty-yz-anahtar-degisti";

/**
 * Yapıştırma artıklarını anahtardan söker.
 *
 * `trim()` yetmiyordu ve bu **gerçek bir arıza sebebiydi**: AI Studio'daki
 * anahtar kutusundan kopyalarken araya sıfır genişlikli boşluk (U+200B),
 * bayt sırası imi (U+FEFF) ya da yumuşak tire (U+00AD) karışabiliyor. Bunlar
 * `trim()`in *boşluk* tanımına girmez — Unicode'da "biçim" (Cf) sınıfıdırlar —
 * ve dizgenin **ortasında** duranı zaten hiçbir `trim` almaz.
 *
 * Sonuç sinsiydi: anahtar kaydedilmiş görünüyor, panel "Sor" düğmesini
 * açıyor, ama `fetch` başlığa ISO-8859-1 dışı bir karakter koyamadığı için
 * istek **daha ağa çıkmadan** `TypeError` ile düşüyordu. Kullanıcı bunu
 * "Bağlantı kurulamadı." olarak görüyordu; oysa bağlantı hiç denenmemişti.
 *
 * Yalnızca **görünmez** karakterler silinir. Gerçek bir harf (yanlışlıkla
 * kopyalanan bir "ı" gibi) bilerek bırakılır: sessizce silmek anahtarı
 * bozardı, bırakınca `gemini.ts`'teki denetim onu "anahtar geçersiz" diye
 * doğru mesajla yakalar.
 */
export function anahtarTemizle(deger: string): string {
  return deger.replace(/[\s\p{Cf}]/gu, "");
}

/**
 * Kayıtlı anahtar; yoksa boş dizge.
 *
 * `localStorage` erişimi try/catch içinde: Safari'nin özel penceresi ve
 * "site verilerini engelle" ayarı okumada bile fırlatır (`wiki.ts`'teki
 * çevrimdışı yedek katmanıyla aynı savunma).
 *
 * Temizlik **okumada da** yapılır: düzeltmeden önce kirli kaydedilmiş
 * anahtarlar hâlâ depoda duruyor, kullanıcı yeniden yapıştırmak zorunda kalmasın.
 */
export function anahtarOku(): string {
  try {
    return anahtarTemizle(localStorage.getItem(ANAHTAR_ADI) ?? "");
  } catch {
    return "";
  }
}

/** Anahtarı kaydeder. Boş/boşluk dizge kaydetmez, **siler** — "temizle" ile aynı sonuç. */
export function anahtarYaz(deger: string): void {
  const temiz = anahtarTemizle(deger);
  if (!temiz) return anahtarSil();
  try {
    localStorage.setItem(ANAHTAR_ADI, temiz);
  } catch {
    /* yazılamadıysa anahtar bu oturumda yok sayılır */
  }
  window.dispatchEvent(new CustomEvent(DEGISTI));
}

/** Anahtarı siler — ayarlar ekranındaki "Anahtarı sil" düğmesi. */
export function anahtarSil(): void {
  try {
    localStorage.removeItem(ANAHTAR_ADI);
  } catch {
    /* yoksa zaten silinmiş sayılır */
  }
  window.dispatchEvent(new CustomEvent(DEGISTI));
}

/**
 * MODEL SEÇİMİ (T-24 madde 1–3)
 *
 * Anahtarla aynı yerde duruyor çünkü aynı basit `localStorage` deseni
 * geçerli: değer kullanıcının tarayıcısında kalır, depoya yazılmaz.
 *
 * Tek anahtarda iki farklı kaynaktan gelen değer durur — `gemini.ts`'in
 * 404 zincirinde kendiliğinden bulduğu çalışan model ve kullanıcının
 * ayarlardan elle seçtiği model. İkisi de "bir sonraki istekte doğrudan
 * bunu dene" anlamına geldiği için ayrı anahtar gerekmiyor: elle seçim
 * otomatik öğrenileni **ezer**, "Varsayılana dön" ikisini birden temizler.
 */
export const MODEL_ADI = "ty-yz-model";

/** Sabitlenmiş model adı; yoksa boş dizge — bu durumda `gemini.ts` aday zincirini baştan dener. */
export function modelOku(): string {
  try {
    return localStorage.getItem(MODEL_ADI) ?? "";
  } catch {
    return "";
  }
}

/** Çalışan ya da elle seçilen modeli sabitler. */
export function modelYaz(model: string): void {
  try {
    localStorage.setItem(MODEL_ADI, model);
  } catch {
    /* yazılamadıysa zincir bir sonraki istekte baştan taranır */
  }
}

/** Sabitlemeyi kaldırır — ayarlar ekranındaki "Varsayılana dön" düğmesi. */
export function modelSil(): void {
  try {
    localStorage.removeItem(MODEL_ADI);
  } catch {
    /* yoksa zaten silinmiş sayılır */
  }
}

/**
 * "WEB'DE ARAŞTIR" TERCİHİ (T-25 madde 7)
 *
 * Varsayılan **açık**: kullanıcının şikâyeti "araştırmıyor"du (T-25 canlı
 * kullanıcı raporu, 2026-09-02); varsayılanı kapalı yapmak aynı şikâyeti
 * üretirdi. Kayıt yoksa (ilk kullanım, ya da `localStorage` erişilemiyor)
 * açık sayılır — anahtar/model desenlerinin aksine burada "kayıt yok" ile
 * "kullanıcı kapattı" ayrımı gerekiyor, bu yüzden değer `"0"`/`"1"` dizgesi.
 */
export const ARAMA_ADI = "ty-yz-arama";

export function aramaAcikMi(): boolean {
  try {
    const deger = localStorage.getItem(ARAMA_ADI);
    return deger === null || deger === "1";
  } catch {
    return true;
  }
}

/** Tercihi kaydeder — ayarlar ekranındaki "Web'de araştır" anahtarı. */
export function aramaYaz(acik: boolean): void {
  try {
    localStorage.setItem(ARAMA_ADI, acik ? "1" : "0");
  } catch {
    /* yazılamadıysa bu oturumda tercih hatırlanmaz, varsayılan (açık) kullanılır */
  }
  window.dispatchEvent(new CustomEvent(DEGISTI));
}

/** Kayıtlı arama tercihini okur ve değiştiğinde yeniden render eder (bkz. `useYzAnahtari`). */
export function useAramaTercihi(): boolean {
  return useSyncExternalStore(abone, aramaAcikMi, () => true);
}

/**
 * MODELE ÖZGÜ "ARAMA DESTEKLENMİYOR" İŞARETİ (T-25 madde 5)
 *
 * `gemini.ts`, arama açıkken 400 alıp gövdede araç hatası görünce aynı model
 * için aramasız bir isteği sessizce tekrarlar. Bu tekrar her soruda olmasın
 * diye sonuç buraya yazılır; bir sonraki soruda o model doğrudan aramasız
 * denenir (tek istek). Modele özgüdür çünkü aday zincirindeki bir model
 * desteklemese bile bir başkası destekleyebilir.
 */
function aramaYokAnahtari(model: string): string {
  return `ty-yz-arama-yok:${model}`;
}

export function aramaDesteklenmiyorMu(model: string): boolean {
  try {
    return localStorage.getItem(aramaYokAnahtari(model)) === "1";
  } catch {
    return false;
  }
}

export function aramaDesteklenmiyorIsaretle(model: string): void {
  try {
    localStorage.setItem(aramaYokAnahtari(model), "1");
  } catch {
    /* yazılamadıysa her soruda iki istek atılır ama davranış bozulmaz */
  }
}

function abone(geriCagri: () => void): () => void {
  window.addEventListener(DEGISTI, geriCagri);
  // Başka bir sekmede silinen anahtar bu sekmede de geçersizdir.
  window.addEventListener("storage", geriCagri);
  return () => {
    window.removeEventListener(DEGISTI, geriCagri);
    window.removeEventListener("storage", geriCagri);
  };
}

/**
 * Kayıtlı anahtarı okur ve **değiştiğinde yeniden render eder.**
 *
 * Buna ihtiyaç var çünkü anahtar, panelin çok uzağındaki ayarlar modalında
 * giriliyor: kullanıcı anahtarı kaydedip modalı kapattığında panelin "Önce
 * anahtarınızı girin" uyarısının kendiliğinden "Yapay zekâya sor" düğmesine
 * dönmesi gerekiyor.
 */
export function useYzAnahtari(): string {
  return useSyncExternalStore(abone, anahtarOku, () => "");
}
