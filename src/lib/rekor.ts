import type { TalkCard, WorldRecord } from "../data/types";
import { dayOfYear } from "./date";

/**
 * REKOR ROTASYONU
 *
 * Sorun: rekorların çoğunun takvim günü yoktur. "En uzun burun" 5 Ağustos'a ait
 * değildir. Ama uygulamanın kuralı "boş gün yoktur" (bkz. `Dokumanlar/BAGLAM.md`
 * §1, ürün ilkesi 4) — her gün dolu bir kasa göstermek zorundayız.
 *
 * Çözüm iki katmanlı:
 *
 * 1. **Sabitlenmiş rekorlar** — `date: "MM-DD"` taşıyanlar yalnızca o gün çıkar
 *    ve listenin başına geçer ("Bugün kırılan rekor"). Bu alan yalnızca gün
 *    kesin doğrulandıysa doldurulur, bkz. `src/data/rekorlar.ts` başlığı.
 *
 * 2. **Rotasyon** — kalan kontenjan tarihsiz havuzdan doldurulur. Seçim
 *    deterministiktir: aynı gün her zaman aynı rekorları verir (test edilebilir,
 *    paylaşılan bağlantı aynı içeriği açar), ama ardışık günler birbirinden
 *    uzak kayıtlar gösterir.
 *
 * 365 günü elle doldurmak gerekmemesinin sebebi budur: ~20 kayıtlık bir havuz
 * yılın tamamını dolu gösterir, havuz büyüdükçe tekrar aralığı açılır.
 */

/** Bir günde gösterilecek varsayılan rekor sayısı. */
export const GUNLUK_REKOR_ADEDI = 3;

/**
 * `n` ile aralarında asal olan, 1'den büyük ilk adım değerini bulur.
 *
 * Rotasyonun havuzun **tamamını** dolaşması buna bağlıdır: adım ile havuz boyu
 * aralarında asal değilse seçim havuzun yalnızca bir alt kümesinde döner ve
 * bazı rekorlar hiçbir gün görünmez. Havuz büyüdükçe boy değişeceği için sabit
 * bir asal yazmak yerine çalışma zamanında hesaplanır.
 */
export function rotasyonAdimi(n: number): number {
  if (n <= 2) return 1;
  for (let adim = 7; adim < n; adim++) {
    if (obeb(adim, n) === 1) return adim;
  }
  return 1;
}

function obeb(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

/** `MM-DD` — `curatedKey` ile aynı biçim. */
export function rekorGunAnahtari(month: number, day: number): string {
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export interface GununRekorlari {
  /** Ekranda gösterilecek kayıtlar — sabitlenmişler önce. */
  gosterilecek: WorldRecord[];
  /** Bu güne sabitlenmiş (tarihi doğrulanmış) kayıtlar. */
  sabit: WorldRecord[];
  /** Havuzdaki toplam kayıt sayısı — "N rekordan 3'ü" bilgisi için. */
  havuzBoyu: number;
}

/**
 * Seçili günün rekorlarını hesaplar.
 *
 * @param havuz  Editör havuzu (`REKORLAR`).
 * @param month  1-12
 * @param day    1-31
 * @param adet   Toplam gösterilecek kayıt sayısı.
 *
 * Sabitlenmiş kayıtlar kontenjanı doldurursa rotasyon devreye girmez; sabitler
 * `adet`'i aşarsa hepsi gösterilir (bir günü doğrulanmış rekorlar yüzünden
 * kırpmak yanlış olurdu).
 */
export function gununRekorlari(
  havuz: WorldRecord[],
  month: number,
  day: number,
  adet: number = GUNLUK_REKOR_ADEDI
): GununRekorlari {
  const anahtar = rekorGunAnahtari(month, day);

  const sabit = havuz.filter((r) => r.date === anahtar);
  const rotasyonHavuzu = havuz.filter((r) => r.date !== anahtar);

  const kalan = Math.max(0, adet - sabit.length);
  const secilen: WorldRecord[] = [];

  if (kalan > 0 && rotasyonHavuzu.length > 0) {
    const n = rotasyonHavuzu.length;
    const adim = rotasyonAdimi(n);
    // Sabit bir referans yıl kullanılır: gün seçimi takvim gününe bağlı olmalı,
    // içinde bulunulan yıla değil. Aksi halde aynı bağlantı yıl değişince
    // başka rekorlar gösterirdi.
    const gun = dayOfYear(month, day, 2001);
    const baslangic = (gun * adim) % n;

    for (let i = 0; i < Math.min(kalan, n); i++) {
      secilen.push(rotasyonHavuzu[(baslangic + i) % n]);
    }
  }

  return {
    gosterilecek: [...sabit, ...secilen],
    sabit,
    havuzBoyu: havuz.length,
  };
}

/**
 * Rekoru yayında okunabilir tek bir metne çevirir — Sohbet Kartı gövdesi ve
 * "kopyala" düğmesi bunu kullanır. Boş alanlar sessizce atlanır.
 */
export function rekorMetni(r: WorldRecord): string {
  const parcalar = [r.story];
  if (r.compare) parcalar.push(r.compare);
  if (r.question) parcalar.push(r.question);
  return parcalar.join(" ");
}

/** ~150 kelime/dakika — `ICERIK-SABLONU.md`'deki sesli okuma ölçüsü. */
function sureTahmini(metin: string): 1 | 2 | 3 {
  const n = metin.length;
  if (n < 240) return 1;
  if (n < 460) return 2;
  return 3;
}

/**
 * Günün rekorlarını Sohbet Kartı'na çevirir — Yayın Modu ve kopyalama zaten
 * `TalkCard` üzerinden çalıştığı için rekorlar ayrı bir teleprompter gerektirmez.
 *
 * Yalnızca `opener` (yayın açılışı) yazılmış kayıtlar karta dönüşür: kancası
 * olmayan bir rekor yayında okunacak bir metin değildir, kasada durması yeterlidir.
 */
export function buildRekorTalk(rekorlar: WorldRecord[], adet = 2): TalkCard[] {
  return rekorlar
    .filter((r) => r.opener)
    .slice(0, adet)
    .map((r) => {
      const body = `${r.value} — ${r.holder}. ${rekorMetni(r)}`;
      return {
        id: `talk-${r.id}`,
        category: "Rekorlar",
        hook: r.opener!,
        body,
        minutes: sureTahmini(body),
      };
    });
}
