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
 * Kayıtlı anahtar; yoksa boş dizge.
 *
 * `localStorage` erişimi try/catch içinde: Safari'nin özel penceresi ve
 * "site verilerini engelle" ayarı okumada bile fırlatır (`wiki.ts`'teki
 * çevrimdışı yedek katmanıyla aynı savunma).
 */
export function anahtarOku(): string {
  try {
    return localStorage.getItem(ANAHTAR_ADI)?.trim() ?? "";
  } catch {
    return "";
  }
}

/** Anahtarı kaydeder. Boş/boşluk dizge kaydetmez, **siler** — "temizle" ile aynı sonuç. */
export function anahtarYaz(deger: string): void {
  const temiz = deger.trim();
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
