# T-03 · Takvim ve Tarih Doğruluğu

| Alan             | Değer                            |
| ---------------- | -------------------------------- |
| **Faz**          | FAZ 1 — Kritik Hata Düzeltmeleri |
| **Öncelik**      | 🔴 Kritik                        |
| **Tahmini süre** | ~2 saat                          |
| **Bağımlılık**   | T-01                             |
| **İlgili bulgu** | K-1                              |
| **Durum**        | ✅ Tamamlandı — 2026-08-21       |

---

## 🎯 Amaç

Takvim yaprağının gösterdiği tarih bilgilerini **her yıl ve her gün için doğru** hâle
getirmek. Şu an "Yılın X. günü" değeri artık yıl olmayan yılların %84'ünde bir fazla
gösteriliyor — bu, uygulamanın en görünür yerindeki yanlış bilgi.

---

## 📍 Mevcut Durum

### Kök sebep: referans yıl 2024'e sabitlenmiş

`src/components/leaf.tsx:12-20`

```ts
export function dayOfYear(month: number, day: number): number {
  const d = new Date(2024, month - 1, day); // ← 2024 = ARTIK YIL
  const start = new Date(2024, 0, 1);
  return Math.floor((d.getTime() - start.getTime()) / 86400000) + 1;
}

export function daysInMonth(month: number): number {
  return new Date(2024, month, 0).getDate(); // ← Şubat her zaman 29
}
```

### Kanıt (canlı, 2026-08-21)

Ekranda: **"Yılın 234. günü"**

|               | Ocak | Şubat  | Mart–Tem       | 21 Ağu | Toplam     |
| ------------- | ---- | ------ | -------------- | ------ | ---------- |
| 2024 (artık)  | 31   | **29** | 31+30+31+30+31 | +21    | **234**    |
| 2026 (normal) | 31   | **28** | 31+30+31+30+31 | +21    | **233** ✅ |

Fark, 29 Şubat'ın referans yılda var olmasından geliyor. **1 Mart – 31 Aralık arası
tüm günler, artık olmayan yıllarda +1 kayıyor.** Bu, yılın 306 günü demek.

### İkinci sorun: 29 Şubat'ta haftanın günü yanlış

`src/components/leaf.tsx:57-60`

```ts
const weekday = useMemo(() => {
  const refYear = new Date().getFullYear(); // ← gerçek yıl
  return WEEKDAYS_TR[new Date(refYear, month - 1, day).getDay()];
}, [day, month]);
```

`daysInMonth` her zaman 29 döndüğü için 29 Şubat seçilebiliyor. Ancak haftanın günü
**içinde bulunulan yıla** göre hesaplanıyor. 2026'da `new Date(2026, 1, 29)` JavaScript
tarafından **1 Mart 2026**'ya taşınır → yaprak "29 Şubat" yazarken haftanın gününü
1 Mart'a göre gösterir.

### Üçüncü sorun: `MiniCalendar` ızgara hizası

`src/components/leaf.tsx:185`

```ts
const firstOffset = (new Date(2024, viewMonth - 1, 1).getDay() + 6) % 7;
```

Ayın ilk gününün hafta içindeki yeri de 2024'e göre hesaplanıyor; ızgara,
gösterilen "bugün" işaretiyle tutarsız olabiliyor.

---

## ✅ Yapılacaklar

### Adım 1 — `src/lib/date.ts` oluştur

Tarih mantığını bileşenden ayır (T-12'de test edilebilmesi için):

```ts
/** Verilen yıl artık yıl mı? (Gregoryen kural) */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

const DAYS_NORMAL = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** Aydaki gün sayısı. year verilmezse Şubat 29 kabul edilir (arşiv modu). */
export function daysInMonth(month: number, year?: number): number {
  if (month === 2) {
    return year === undefined ? 29 : isLeapYear(year) ? 29 : 28;
  }
  return DAYS_NORMAL[month - 1];
}

/** Yılın kaçıncı günü. year verilmezse içinde bulunulan yıl kullanılır. */
export function dayOfYear(month: number, day: number, year = new Date().getFullYear()): number {
  let total = day;
  for (let m = 1; m < month; m++) total += daysInMonth(m, year);
  return total;
}

/**
 * Haftanın günü indeksi (0 = Pazar).
 * 29 Şubat, artık olmayan bir yılda taşma yapacağı için en yakın artık yıla düşer.
 */
export function weekdayIndex(
  month: number,
  day: number,
  year = new Date().getFullYear()
): number | null {
  if (month === 2 && day === 29 && !isLeapYear(year)) return null;
  return new Date(year, month - 1, day).getDay();
}
```

### Adım 2 — `leaf.tsx` içindeki eski fonksiyonları kaldır

`dayOfYear` ve `daysInMonth` tanımlarını sil, `src/lib/date.ts`'ten içe aktar.
`leaf.tsx`'ten dışa aktarılıyorlarsa, bunları içe aktaran dosyaları da güncelle
(`grep -rn "dayOfYear\|daysInMonth" src/`).

### Adım 3 — Yaprak üzerindeki "Yılın X. günü" satırını düzelt

`year` prop'u zaten `CalendarLeaf`'e geliyor (`App.tsx` → `today.getFullYear()`).
Kullan:

```diff
-<span>Yılın {dayOfYear(month, day)}. günü</span>
+<span>Yılın {dayOfYear(month, day, year)}. günü</span>
```

### Adım 4 — 29 Şubat'ta haftanın gününü doğru göster

```ts
const weekday = useMemo(() => {
  const idx = weekdayIndex(month, day, year);
  return idx === null ? null : WEEKDAYS_TR[idx];
}, [day, month, year]);
```

`weekday === null` olduğunda, haftanın günü yerine şu metni göster:

```
ARTIK GÜN
```

Ve gün sayısı satırının yanına küçük bir açıklama ekle:

```
{year} artık yıl değil
```

> Bu bir hata mesajı değil, bir **bilgi**. 29 Şubat gerçekten dört yılda bir vardır;
> uygulamanın bunu bilmesi ve söylemesi doğrudur.

### Adım 5 — `MiniCalendar` ızgarasını gerçek yıla bağla

```diff
-const firstOffset = (new Date(2024, viewMonth - 1, 1).getDay() + 6) % 7;
+const year = new Date().getFullYear();
+const firstOffset = (new Date(year, viewMonth - 1, 1).getDay() + 6) % 7;
```

Gün sayısı için `daysInMonth(viewMonth)` çağrısını **yıl parametresi vermeden**
bırak — takvimde 29 Şubat'ın **seçilebilir kalması gerekiyor** (arşiv modu).
Ancak 29 Şubat hücresine, artık olmayan yıllarda görsel bir ipucu ekle:
kesikli çerçeve veya `title="Artık gün"`.

### Adım 6 — Önceki/Sonraki gün geçişini kontrol et

`leaf.tsx:62-63` satırlarındaki `prev` / `next` fonksiyonları tek satırlık iç içe
üçlü koşullarla yazılmış ve okunması zor. Aynı davranışı koruyarak okunur hâle getir:

```ts
const shift = (delta: number) => {
  let d = day + delta;
  let m = month;
  if (d < 1) {
    m = m === 1 ? 12 : m - 1;
    d = daysInMonth(m);
  } else if (d > daysInMonth(m)) {
    m = m === 12 ? 1 : m + 1;
    d = 1;
  }
  onChangeDay(d, m);
};
```

**Davranış aynı kalmalı:** 1 Ocak'tan geriye → 31 Aralık; 31 Aralık'tan ileriye → 1 Ocak;
28 Şubat'tan ileriye → **29 Şubat** (arşiv modunda var).

---

## 🚫 Kapsam Dışı

| Dokunma                              | Neden / Hangi talimat             |
| ------------------------------------ | --------------------------------- |
| `CountUp` / `Reveal` bileşenleri     | T-04                              |
| Klavye ile gün geçişi (`←` `→`)      | T-07                              |
| URL'de gün taşıma                    | T-06                              |
| Hicri / Rumi takvim desteği          | Kapsam dışı — ürün kararı gerekir |
| Tarih fonksiyonları için test yazımı | T-12 (altyapı orada kuruluyor)    |
| `date-fns` gibi kütüphane ekleme     | Gereksiz — 40 satır kod yeter     |

---

## ☑️ Kabul Kriterleri

- [x] `src/lib/date.ts` var; `isLeapYear`, `daysInMonth`, `dayOfYear`, `weekdayIndex` dışa aktarılıyor
- [x] `leaf.tsx` içinde 2024 sabiti **hiç geçmiyor** (`grep -n "2024" src/components/leaf.tsx` boş)
- [x] 21 Ağustos 2026 için yaprakta **"Yılın 233. günü"** yazıyor
- [x] 1 Ocak → 1. gün, 31 Aralık → 365. gün (2026'da)
- [x] Artık yılda 31 Aralık → 366. gün _(Node ile doğrulandı — canlı uygulama her zaman gerçek/güncel yılı kullandığından 2028 senaryosu tarayıcıda değil, formül düzeyinde test edildi; bkz. Tamamlanma Kaydı)_
- [x] 29 Şubat seçilebiliyor, "ARTIK GÜN" bilgisi görünüyor, haftanın günü uydurulmuyor
- [x] Mini takvim ızgarası içinde bulunulan yıla göre hizalanıyor
- [x] Gün geçişi ay ve yıl sınırlarını doğru aşıyor
- [x] `npm run typecheck` hatasız
- [x] `npm run build` hatasız

---

## 🧪 Doğrulama

### 1. Hesaplama tablosu (Node ile hızlı kontrol)

```bash
node -e "const{dayOfYear}=await import('./src/lib/date.ts')" 2>/dev/null || echo "TS dosyası doğrudan çalıştırılamaz — tarayıcı konsolunu kullan"
```

Tarayıcı konsolunda beklenen değerler:

| Tarih      | 2026 (normal) | 2028 (artık) |
| ---------- | ------------- | ------------ |
| 1 Ocak     | 1             | 1            |
| 28 Şubat   | 59            | 59           |
| 1 Mart     | 60            | **61**       |
| 21 Ağustos | **233**       | **234**      |
| 31 Aralık  | **365**       | **366**      |

### 2. Görsel kontrol — 5 gün

| Gün           | Beklenen                                        |
| ------------- | ----------------------------------------------- |
| **1 Ocak**    | "Yılın 1. günü", geriye git → 31 Aralık         |
| **28 Şubat**  | "Yılın 59. günü", ileriye git → **29 Şubat**    |
| **29 Şubat**  | "ARTIK GÜN" bilgisi, haftanın günü uydurulmamış |
| **1 Mart**    | 2026'da "Yılın 60. günü"                        |
| **31 Aralık** | 2026'da "Yılın 365. günü", ileriye git → 1 Ocak |

### 3. Mini takvim hizası

`AĞUSTOS TAKVİMİ` düğmesine bas. 2026 Ağustos'un 1'i **Cumartesi** — ızgarada
`Ct` sütununda başlamalı. Bugün (21) altın çerçeveli olmalı.

### 4. Regresyon

Zaman tüneli, kişi kartları, karanlık dosyalar bölümleri gün geçişlerinde
normal çalışmaya devam etmeli — bu talimat yalnızca yaprağa dokunur.

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-08-21

- **Değişen dosyalar:**

  | Dosya                                               | İşlem                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
  | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `src/lib/date.ts`                                   | Yeni — `isLeapYear`, `daysInMonth`, `dayOfYear`, `weekdayIndex`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
  | `src/components/leaf.tsx`                           | Eski `dayOfYear`/`daysInMonth` (2024 sabitli) silindi, `../lib/date`'ten içe aktarılıyor; `CalendarLeaf` haftanın günü hesaplaması `weekdayIndex` + `null` durumunda "ARTIK GÜN" gösterimine geçti; "Yılın X. günü" satırı `year` parametresi alıyor; artık olmayan yılda 29 Şubat için "{yıl} artık yıl değil" notu eklendi; `prev`/`next` iç içe üçlü koşullar okunur bir `shift(delta)` fonksiyonuna dönüştürüldü; `MiniCalendar` `year` prop'u almaya başladı, `firstOffset` gerçek yıla bağlandı, 29 Şubat hücresine artık olmayan yıllarda kesikli çerçeve + `title="Artık gün"` eklendi |
  | `Dokumanlar/ANALIZ-RAPORU.md`                       | K-1 `✅ ÇÖZÜLDÜ (T-03)` işaretlendi + Çözüm bloğu eklendi; genel sağlık tablosu ve öncelik sıralaması güncellendi; yeni bölüm 6 → K-5 bulgusu eklendi                                                                                                                                                                                                                                                                                                                                                                                                                                          |
  | `Dokumanlar/BAGLAM.md`                              | Dosya haritasına `date.ts` eklendi; plan ilerlemesi 3/14; "Eksik/hatalı" listesinde K-1 çözüldü işaretlendi, K-5 eklendi                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
  | `Dokumanlar/MIMARI.md`                              | Yeni bölüm 2.6 (`date.ts` modül tablosu); `leaf.tsx` ihracat tablosundan eski `dayOfYear`/`daysInMonth` satırları kaldırıldı; teknik borç tablosunda K-1 çözüldü işaretlendi, K-5 eklendi                                                                                                                                                                                                                                                                                                                                                                                                      |
  | `Dokumanlar/KULLANIM-KILAVUZU.md`                   | Sorun giderme tablosunda K-1 satırı "düzeltildi" olarak güncellendi; K-5 için yeni satır eklendi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
  | `Talimatlar/PLAN-01-temel-duzeltme-ve-tamamlama.md` | Durum 3/14, T-03 satırı ✅ + `Tamamlandı/` bağlantısına güncellendi, Kesin kurallar'a T-03 notu eklendi, ilerleme tablosu ve yüzdesi güncellendi, 2 başarı ölçütü işaretlendi                                                                                                                                                                                                                                                                                                                                                                                                                  |

- **Sapmalar / notlar:**

  1. **`MiniCalendar`'a talimatta yazılı olmayan bir `year` prop'u eklendi.**
     Adım 5'teki diff, `firstOffset`'i `new Date().getFullYear()` çağrısıyla
     `MiniCalendar`'ın kendi içinde hesaplıyordu. Bunun yerine `CalendarLeaf`'in
     zaten sahip olduğu `year` prop'u `MiniCalendar`'a geçirildi (`year={year}`)
     ve `firstOffset` ile 29 Şubat ipucu (`isLeapYear(year)`) bu prop'u kullanıyor.
     Gerekçe: `CalendarLeaf` ve `MiniCalendar` aynı render ağacında iki ayrı
     `new Date()` çağrısıyla yıl okumak yerine tek bir kaynaktan (`year` prop'u)
     beslenmeleri, gece yarısı sınırında teorik bir tutarsızlığı önlüyor ve kod
     tabanının "tek referans yıl" ilkesiyle daha tutarlı. Görünen davranışta fark
     yok — canlı testte doğrulandı.
  2. **`date.ts` içindeki `weekdayIndex` JSDoc yorumu düzeltildi.** Talimatın
     verdiği kod parçasındaki yorum ("29 Şubat ... en yakın artık yıla düşer")
     fonksiyonun asıl davranışıyla (o durumda `null` döner, başka bir yıla
     düşmez) çelişiyordu. Kod, talimatta verildiği gibi birebir uygulandı;
     yalnızca yanıltıcı yorum, gerçek davranışı anlatacak şekilde güncellendi.
  3. **Adım 5'teki "Bugün altın çerçeveli olmalı" beklentisi, bugün aynı zamanda
     seçili günse geçerli değil.** Mini takvimde bir hücre hem "bugün" hem
     "seçili gün" ise, mevcut (T-03 öncesinden gelen, dokunulmayan) koşul seçili
     stilini önceliklendiriyor (`isTodayCell && !selected`) — bu doğru ve
     kasıtlı bir tasarım (seçili zaten en belirgin stil, üstüne bir de altın
     çerçeve gereksiz). Talimatın doğrulama adımı varsayılan açılış durumunu
     (bugün = seçili gün) test ettiği için bu ayrım orada netleşmiyor; ayrıca
     doğrulandı ve **kabul kriterlerini etkilemiyor** — kayıt amaçlı not.
  4. **Beklenmeyen kritik bulgu — K-5 (T-03 kapsamı dışında bırakıldı).**
     Canlı doğrulama sırasında "Önceki gün" / "Sonraki gün" / "Bugüne dön"
     düğmelerinin gerçek bir fare tıklamasıyla **hiç tetiklenmediği** ortaya
     çıktı: dekoratif "arkadaki yapraklar" katmanları (`position: absolute;
inset: 0`) CSS yığılım kurallarınca `position: static` olan gezinme
     satırının **her zaman üzerinde** boyanıyor ve tıklamayı yakalıyor
     (`document.elementsFromPoint` ile doğrulandı). Bu, T-03'ün kapsamındaki
     bir tarih-hesaplama hatası değil, ayrı bir CSS/yerleşim hatası olduğu için
     **düzeltilmedi** — `Dokumanlar/ANALIZ-RAPORU.md` bölüm 6'ya K-5 olarak
     işlendi. `shift()` fonksiyonunun kendisi `button.click()` ile (DOM olay
     akışını atlayarak) doğrudan tetiklenip doğru çalıştığı ayrıca kanıtlandı;
     yani bu talimatın ürettiği mantık sağlam, yalnızca gerçek tıklamalar o
     mantığa gerçek tarayıcıda hiç ulaşamıyor.

- **Doğrulama kanıtları:**

  | Test                                                 | Sonuç                                                                                                                                                                                  |
  | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `grep -n "2024" src/components/leaf.tsx`             | Boş — hiç eşleşme yok                                                                                                                                                                  |
  | `npm run typecheck`                                  | Temiz, hata yok                                                                                                                                                                        |
  | `npm run build`                                      | Temiz, `dist/` üretti (254 kB JS / 82 kB gzip, 53 kB CSS)                                                                                                                              |
  | Node formül testi — `dayOfYear`                      | 10/10 örnek doğru: 2026 (normal) ve 2028 (artık) için 1 Ocak, 28 Şubat, 1 Mart, 21 Ağustos, 31 Aralık — tamamı beklenen değerle eşleşti (bkz. beklenti tablosu, `dev doğrulama` adımı) |
  | Canlı — 21 Ağustos 2026                              | Yaprakta **"Yılın 233. günü"** ve **"CUMA"** göründü (önceden 234/hatalı gün)                                                                                                          |
  | Canlı — 31 Aralık → Sonraki gün                      | **"1 Ocak"**, "Yılın 1. günü"                                                                                                                                                          |
  | Canlı — 1 Ocak → Önceki gün                          | **"31 Aralık"**, "Yılın 365. günü"                                                                                                                                                     |
  | Canlı — 29 Şubat seçimi (mini takvim)                | **"ARTIK GÜN"**, "2026 artık yıl değil" notu, gün sayısı "60"                                                                                                                          |
  | Canlı — 29 Şubat → Sonraki gün                       | **"1 Mart"**, "PAZAR", "Yılın 60. günü" — haftanın günü uydurulmadı                                                                                                                    |
  | Mini takvim ızgara hizası (DOM ölçümü)               | Ağustos 2026: 5 boş hücre + gün "1" tam olarak **`Ct`** (Cumartesi) sütununda — `firstOffset=5` matematiksel olarak da doğrulandı                                                      |
  | Mini takvim — 29 Şubat hücresi (Şubat 2026 görünümü) | `title="Artık gün"` + kesikli çerçeve sınıfı DOM'da doğrulandı                                                                                                                         |
  | Bugüne dön / isToday mantığı                         | Dokunulmadı, regresyon yok — canlı testlerde normal çalıştığı gözlendi                                                                                                                 |
  | Zaman tüneli / kişi kartları / karanlık dosyalar     | Gün geçişlerinde (29 Şubat dahil) normal veri geldiği canlı olarak gözlendi — regresyon yok                                                                                            |

- **Sonraki talimata not:**

  - **T-04 →** Bu talimat sırasında **K-5** keşfedildi: gün gezinme düğmeleri
    (Önceki gün/Sonraki gün/Bugüne dön) dekoratif katman yüzünden tıklanamıyor.
    Ayrıntı ve önerilen küçük düzeltme (`pointer-events-none`) →
    `Dokumanlar/ANALIZ-RAPORU.md` bölüm 6. T-04'ün kapsamına eklenmesi önerilir
    (K-2/K-3 ile aynı "görünürlük/etkileşim sağlamlığı" ailesinde), ama nihai
    karar plan sahibine ait — henüz hiçbir talimata resmen atanmadı.
  - **T-06 →** Gün gezinmesi URL'e bağlanırken (`onChangeDay` → route), `shift()`
    fonksiyonundaki ay/yıl sınırı geçiş mantığı (`src/components/leaf.tsx`)
    referans alınabilir; `src/lib/date.ts`'teki `daysInMonth(month, year?)`
    imzası zaten URL'den gelecek gerçek `year` değerini destekliyor.
  - **T-07 →** Klavye ile gün geçişi eklenirken `shift(-1)`/`shift(1)` doğrudan
    çağrılabilir; fonksiyon zaten dışa aktarılabilir hâlde (şu an bileşen
    içinde tanımlı, gerekirse `date.ts`'e taşınabilir).
  - **T-12 →** `src/lib/date.ts` bilinçli olarak saf/bağımsız yazıldı — dört
    fonksiyon da doğrudan birim testine hazır, React'e bağımlılığı yok.
