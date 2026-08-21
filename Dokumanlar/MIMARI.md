# MİMARİ — Tarih Yaprağı

> Teknik derinlik belgesi. Projenin "ne olduğu" için önce
> [`BAGLAM.md`](BAGLAM.md)'yi okuyun; burası **nasıl çalıştığını** anlatır.
>
> **Son güncelleme:** 2026-08-21

---

## 1. Genel Şema

```
┌──────────────────────────────────────────────────────────────────┐
│  index.html                                                      │
│    · lang="tr", meta, theme-color, Google Fonts (Fraunces /      │
│      IBM Plex Sans / IBM Plex Mono)                              │
│    · <div id="root">                                             │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                    src/main.tsx  (6 satır)
                               │
                    ┌──────────▼──────────┐
                    │      App.tsx        │  ← TEK sayfa, tek durum sahibi
                    │  ------------------ │
                    │  state:             │
                    │   day, month        │  seçili gün
                    │   pickerOpen        │  mini takvim açık mı
                    │   query             │  arama metni
                    │   broadcast         │  yayın modu açık mı
                    │  ------------------ │
                    │  useDayData()       │  → { data, loading, reload }
                    │  ------------------ │
                    │  6 adet useMemo     │  ham veriyi bölüm verisine dönüştürür
                    └──────────┬──────────┘
                               │  props (aşağı doğru tek yön)
        ┌──────────────┬───────┴────────┬──────────────┐
        ▼              ▼                ▼              ▼
   leaf.tsx       sections.tsx      talk.tsx        ui.tsx
   (takvim)       (4 bölüm)      (kart + yayın)  (ortak parçalar)
```

**Mimari karar:** Global durum yönetimi (Context/Redux/Zustand) **yok**.
`App.tsx` tek durum sahibi, alt bileşenler saf sunum. Uygulama tek sayfa ve tek
"seçili gün" ekseninde döndüğü için bu doğru bir sadeleştirme.

---

## 2. Veri Katmanı — `src/lib/wiki.ts`

Dosya dört sorumluluğu üstlenir:

### 2.1 Getirme ve normalleştirme

```
fetchDayData(month, day)
  ├─ memCache kontrolü            → varsa anında dön
  ├─ load("tr") ve load("en") paralel
  │    ├─ fetch(API/{lang}/onthisday/all/MM/DD)
  │    ├─ başarılı → localStorage'a yaz ("ty-otd-{lang}-MM-DD")
  │    └─ başarısız → localStorage'dan oku
  ├─ ikisi de null → { offline: true, ...boş }
  ├─ pick(key): TR doluysa TR, değilse EN     ← alan bazında (events/births/deaths ayrı)
  └─ normalize(): year+text doğrula, pages'i 3 ile sınırla, id ata
```

**Dikkat:** Dil seçimi **alan bazında** yapılır. Bir gün için TR'de olay varsa ama
doğum yoksa; olaylar TR'den, doğumlar EN'den gelir. `data.sources` bunu takip eder ve
arayüzde "kaynak: TR Vikipedi" olarak gösterilir.

**`API` sabiti nereden geliyor:** `wiki.ts` artık URL'i kendi içinde tanımlamaz;
`import { WIKI_API_BASE as API } from "./config"` ile alır (T-02). `config.ts`
`VITE_WIKI_API_BASE` ortam değişkenini okur, yoksa üretim Wikimedia adresine düşer.
API sözleşmesini değiştirecek talimatlar (T-05) yine yalnızca `wiki.ts`'e dokunur;
taban adresi değiştirecekseniz `config.ts`'e bakın.

### 2.2 Sınıflandırma — `classifyItem()`

```ts
const RULES: [CategoryId, RegExp][] = [ ... ];  // SIRA ÖNEMLİ
```

Kurallar dizideki **sırayla** denenir, **ilk eşleşen kazanır**. Sıra:
`felaket → savas → bilim → kesif → spor → kultur → siyaset → genel`

Bu sıralama bir önceliktir: "deprem sırasında çıkan savaş" metni `felaket` sayılır.
Kural eklerken/sırasını değiştirirken bunun bilinçli bir tercih olduğunu unutmayın.

### 2.3 Karanlık arşiv taraması — `detectDarkItem()`

`DARK_THEMES` üzerinde aynı "ilk eşleşen kazanır" mantığı.
Dönen etiket `App.tsx` içinde `CaseType`'a haritalanır:

| Tema etiketi | `CaseType` |
|---|---|
| Suikast | `suikast` |
| İnfaz & İdam | `idam` |
| Kayıp & Gizem | `kayıp` |
| Felaket | `felaket` |
| *(diğer / Şiddet)* | `katliam` |

### 2.4 Otomatik sohbet kartı üretimi — `buildAutoTalk()`

En fazla 5 kart üretir, sabit bir sırayla:

| id | Koşul | İçerik |
|---|---|---|
| `auto-lead` | `selected[0]` ya da `events[0]` var | Günün manşeti |
| `auto-contrast` | ≥2 olay | En eski ile en yeni arasındaki yıl farkı |
| `auto-birth` | Küçük resimli + özetli doğum | Portre kartı |
| `auto-death` | Özetli vefat | Veda kartı |
| `auto-dark` | Vefatlarda karanlık tema | Karanlık arşiv kartı |
| `auto-holiday` | `holidays` dolu | Bugünün anlamı |

`minutes` alanı gövde uzunluğundan tahmin edilir: `<240` → 1 dk, `<460` → 2 dk, üstü → 3 dk.

### 2.5 Hook — `useDayData(month, day)`

`reqId` sayacı yarış durumuna (race condition) karşı koruma sağlar: geç dönen eski
istek, `reqId.current === id` kontrolünü geçemez ve state'i kirletemez.
**Not:** İstek iptal edilmez, yalnızca sonucu yok sayılır (bkz. ANALIZ-RAPORU O-4).

### 2.6 Tarih yardımcıları — `src/lib/date.ts`

Saf, bileşenden bağımsız tarih hesaplama fonksiyonları (T-03). `leaf.tsx`'te
2024'e sabitlenmiş eski `dayOfYear`/`daysInMonth` tanımlarının yerini aldı:

| Fonksiyon | İş |
|---|---|
| `isLeapYear(year)` | Gregoryen artık yıl kuralı |
| `daysInMonth(month, year?)` | Aydaki gün sayısı; `year` verilmezse Şubat **29** kabul edilir (arşiv modu — mini takvimde 29 Şubat her zaman seçilebilir kalır) |
| `dayOfYear(month, day, year?)` | Yılın kaçıncı günü; `year` verilmezse `new Date().getFullYear()` |
| `weekdayIndex(month, day, year?)` | Haftanın günü (0=Pazar); 29 Şubat artık olmayan bir yılda **`null`** döner |

`leaf.tsx` bu dört fonksiyonu içe aktarır; kendi içinde tarih hesaplaması
**tanımlamaz**. `weekdayIndex` `null` döndüğünde yaprak "ARTIK GÜN" bilgisini
gösterir — bu bir hata durumu değil, kasıtlı bir bilgi mesajıdır.

### 2.7 Görünürlük hook'u — `src/lib/useInView.ts`

Modül seviyesinde **tek** `IntersectionObserver` örneği (`getObserver()`, tembel
kurulum) ve bunu paylaşan `useInView<T>(fallbackMs = 1200)` hook'u (T-04).
Eskiden her `Reveal`/`CountUp` kendi gözlemcisini kuruyordu (181 örnek); artık
hepsi aynı gözlemciyi ve bir `WeakMap<Element, callback>` kaydını paylaşıyor.

| Parça | İş |
|---|---|
| `getObserver()` | Gözlemciyi tembel oluşturur; `IntersectionObserver` yoksa `null` döner |
| `useInView(fallbackMs)` | `{ ref, inView }` döner; eleman görünür olunca **veya** `fallbackMs` (vars. 1200 ms) dolunca `inView = true` olur |

**Güvenlik ağı ilkesi:** `inView`, üç yoldan biriyle `true` olabilir — (1) gerçek
kesişim, (2) `setTimeout` zaman aşımı, (3) `IntersectionObserver` tarayıcıda hiç
yoksa senkron olarak. Üçü de aynı sonucu üretir: **içerik hiçbir koşulda kalıcı
olarak gizli kalmaz.** `Reveal` ve `CountUp` (bkz. 4.5) bu hook'u kullanır;
`ui.tsx` içinde artık doğrudan `new IntersectionObserver` çağrısı yoktur.

---

## 3. Veri Modeli — `src/data/curated.ts`

### 3.1 Tipler

```
CategoryId   = savas | siyaset | bilim | kesif | kultur | spor | felaket | genel
CaseType     = suikast | cinayet | katliam | kayıp | felaket | idam | skandal

CATEGORIES   : Record<CategoryId, { label, color }>     ← renk tek kaynaktan
CASE_LABELS  : Record<CaseType, string>                 ← büyük harf dosya etiketi

CuratedDay {
  events?   : CuratedEvent[]   // matchKeys ile API mükerreri ayıklanır
  cases     : CaseFile[]
  science   : ScienceMilestone[]
  talk      : TalkCard[]
  spotlight?: { kicker, title, text }
}

CURATED : Record<"MM-DD", CuratedDay>
```

### 3.2 `matchKeys` mekanizması — mükerrer ayıklama

Editör bir olayı elle yazdığında, Vikipedi'de aynı olay tekrar gelebilir.
`CuratedEvent.matchKeys` bunu engeller:

```ts
// App.tsx — mergedEvents useMemo'su
if (cur.some((ce) => ce.matchKeys.some((k) => t.includes(trLower(k))))) return;
```

API'den gelen olayın metni, herhangi bir editör olayının `matchKeys` dizisindeki
bir kelimeyi içeriyorsa **atlanır**. Yani editör sürümü kazanır.

> Yeni editör olayı yazarken `matchKeys`'e Vikipedi metninde geçmesi kesin olan
> 2-3 ayırt edici kelime koyun (özel isim tercih edin: `["rushdie", "humeyni", "fetva"]`).

### 3.3 Şu anki kapsam

10 gün: `02-14`, `03-08`, `04-23`, `04-25`, `05-19`, `07-20`, `08-20`, `10-29`, `11-10`, `12-31`
Dosya boyutu: 1.001 satır. **Ölçeklenmiyor** — T-10 talimatı bunu aylık dosyalara böler.

---

## 4. Sunum Katmanı

### 4.1 `App.tsx` — birleştirme (useMemo) katmanı

| useMemo | Girdi | Çıktı | Kural |
|---|---|---|---|
| `mergedEvents` | CURATED.events + API events | `MergedEvent[]` | matchKeys ile ayıkla, yıla göre **artan** sırala |
| `births` / `deaths` | API | `PersonCard[]` | `pages[0]` olmayan atlanır |
| `allCases` | CURATED.cases + tarama | `CaseFile[]` | otomatik olanlar `slice(0, 6)` |
| `allScience` | CURATED.science + bilim/keşif olaylar | `ScienceMilestone[]` | otomatik `slice(0, 3)`, yıla göre **azalan** |
| `talkCards` | CURATED.talk + buildAutoTalk | `TalkCard[]` | toplam `slice(0, 9)` |
| `spotlight` | CURATED.spotlight ya da `selected[0]` | manşet | editör varsa o kazanır |

Ayrıca `tickerItems` (14 öğeye seyreltilmiş bant) ve `ambientYears` (arka plandaki
dev yıl rakamları) türetilir.

### 4.2 `components/leaf.tsx`

| Export | İş |
|---|---|
| `MONTHS_TR`, `WEEKDAYS_TR`, `WEEKDAYS_SHORT` | Türkçe sabitler |
| `LiveClock` | Saniyelik `setInterval`, `md` altında gizli |
| `CalendarLeaf` | Yaprak + önceki/sonraki/bugün + picker tetikleyici |
| `MiniCalendar` *(dosya içi)* | Pazartesi başlangıçlı ay ızgarası |
| `Ticker` | CSS `@keyframes tickerSlide` ile sonsuz bant, hover'da durur |

Yaprak `key={`${day}-${month}`}` ile yeniden bağlanır → `.leaf-flip` animasyonu
her gün değişiminde tekrar oynar. Bu bilinçli bir hiledir.

### 4.3 `components/sections.tsx`

| Export | İş |
|---|---|
| `matchQuery(q, ...texts)` | Türkçe duyarlı arama; boş sorgu **her zaman true** |
| `formatYear(y)` | `-480` → `MÖ 480` |
| `centuryOf(y)` *(dosya içi)* | Zaman tünelinde yüzyıl ayracı |
| `TimelineSection` | Kategori çipleri + dikey zaman çizgisi + genişleyen detay |
| `itemToPeople()` | `OtdItem[]` → `PersonCard[]` |
| `PeopleRow` | Yatay kaydırmalı kart şeridi + modal |
| `CasesSection` | 2 sütunlu dosya kartları, damgalı durum etiketi |
| `ScienceSection` | 3 sütunlu dönüm noktası kartları |
| `SectionShell` | `id` + `scroll-mt-28` sarmalayıcı (yapışkan nav için) |

### 4.4 `components/talk.tsx`

- `TalkSection` — yayıncı bandı + kart ızgarası
- `TalkCardView` — kâğıt dokulu, çizgili defter görünümlü kart + kopyala
- `BroadcastMode` — tam ekran teleprompter; `←` `→` `Space` `Esc` klavye desteği,
  ilerleme çubuğu, nokta göstergeleri, `scanlines` efekti

`CAT_COLOR` sözlüğü kart kategorisini renge çevirir; eşleşme yoksa altın (`#e8b04b`).

### 4.5 `components/ui.tsx`

| Export | İş |
|---|---|
| `Reveal` | Giriş animasyonu; görünürlük `useInView` (2.7) üzerinden — güvenlik ağlı *(K-3 ✅ T-04)* |
| `CountUp` | Sayaç animasyonu; `useInView`'dan gelen `inView` her `to` değişiminde yeniden tetikler, önceki değerden geçiş yapar *(K-2 ✅ T-04)* |
| `SectionHead` | "BÖLÜM 01 · Kronoloji" başlık bloğu |
| `Modal` | Esc ile kapanır, `body` kaydırmasını kilitler *(⚠ odak tuzağı yok)* |
| `toast()` / `Toaster` | `window` CustomEvent tabanlı, en fazla 3 bildirim |
| `copyText()` | `navigator.clipboard` → `execCommand` yedeği |
| `IconXxx` (11 adet) | Elle çizilmiş SVG; `currentColor` kullanır |

**Not:** İkon kütüphanesi yok — hepsi 24×24 viewBox'ta elle çizilmiş.
Yeni ikon eklerken aynı kalıbı izleyin: `viewBox="0 0 24 24"`, `fill="none"`,
`stroke="currentColor"`, `strokeWidth` 1.4–1.8, `aria-hidden`.

---

## 5. Stil Sistemi — `src/index.css`

### 5.1 Tema (`@theme` bloğu)

Tailwind v4'te renkler CSS değişkeni olarak tanımlanır ve otomatik olarak
`bg-*`, `text-*`, `border-*` yardımcılarına dönüşür.

| Grup | Değişkenler |
|---|---|
| Zemin (koyu) | `night` `night-2` `panel` `panel-2` `line` |
| Metin (koyu üzerine) | `ink` `ink-dim` `ink-faint` |
| Kâğıt (açık) | `paper` `paper-2` `inkpaper` `inkpaper-dim` |
| Vurgu | `brand` (kırmızı) `brand-deep` `gold` `teal` `sky` `copper` `lilac` `leaf` `slate` |
| Font | `--font-display` (Fraunces) `--font-body` (IBM Plex Sans) `--font-mono` (IBM Plex Mono) |

**İki paletli sistem:** Koyu arayüz + açık "kâğıt" yüzeyleri. Kâğıt yüzeylerde
(`paper` sınıfı) metin rengi `inkpaper` olmalı, `ink` değil.

### 5.2 Özel sınıflar

| Sınıf | Etki |
|---|---|
| `.glowfield` | 3 katmanlı radyal ışıma + dikey gradyan |
| `.gridlines` | 44px ızgara, radyal maske ile üstte söner |
| `.noise` | SVG `feTurbulence` grenli doku, `z-70`, `opacity .05` |
| `.paper` / `.paper-grain` | Kâğıt gradyanı + gren |
| `.torn-edge` | `::after` ile testere dişi yırtık kenar |
| `.ruled` | Çizgili defter satırları (28px aralık) |
| `.outline-num` | İçi boş dev rakamlar (`-webkit-text-stroke`) |
| `.scanlines` | Yayın modu tarama çizgileri |
| `.row-scroll` | İnce özel kaydırma çubuğu |

### 5.3 Animasyonlar

`tickerSlide` (55s) · `leafFlip` (0.55s) · `riseIn` (0.45s) · `driftSlow` (22s/34s) ·
`blinkDot` (1.8s) · `stampIn` (0.5s, 0.35s gecikmeli) · `modalIn` (0.35s) ·
`.reveal` geçişi (0.7s)

Hepsi dosya sonundaki `@media (prefers-reduced-motion: reduce)` bloğuyla 0.01ms'e iner.

---

## 6. Genişletme Noktaları

| Yapmak istediğiniz | Adımlar |
|---|---|
| **Yeni bölüm** | 1) `App.tsx` → `NAV` dizisine `{id, label}` ekle · 2) `SectionShell` + `SectionHead` ile blok yaz · 3) veri için yeni `useMemo` · 4) `SkeletonCards` yükleme durumu |
| **Yeni kategori** | 1) `curated.ts` → `CategoryId` birleşimine ekle · 2) `CATEGORIES`'e `{label, color}` · 3) `wiki.ts` → `RULES`'a regex (sırayı düşün) |
| **Yeni dosya türü** | 1) `CaseType` birleşimi · 2) `CASE_LABELS` · 3) `App.tsx` tema→tür haritası |
| **Yeni gün içeriği** | `curated.ts` → `CURATED["MM-DD"] = { spotlight?, events?, cases, science, talk }` |
| **Yeni dil** | `wiki.ts` → `load()` çağrılarını ve `pick()` mantığını genişlet; `sources` tipini güncelle |

---

## 7. Performans Notları

**Mevcut derleme:** 253 kB JS (82 kB gzip), 51 kB CSS (10 kB gzip), 34 modül, 2.9 s.

Bilinen maliyet kalemleri:

- ~~**181 IntersectionObserver örneği**~~ **✅ çözüldü (T-04)** — `src/lib/useInView.ts`
  artık tek paylaşılan gözlemci kullanıyor (181 → 1); bkz. 2.7.
- **Kod bölme yok** — `BroadcastMode` ilk yüklemede geliyor, oysa yalnızca butona
  basılınca gerekiyor. `React.lazy` adayı.
- **Görsellerde `width`/`height` yok** — Vikipedi küçük resimleri yüklenirken düzen kayar.
- **Google Fonts** `display=swap` ile geliyor (doğru), ancak 3 aile × çok ağırlık
  yükleniyor; alt küme daraltılabilir.

---

## 8. Bilinen Teknik Borç

Tam liste ve kanıtlar → [`ANALIZ-RAPORU.md`](ANALIZ-RAPORU.md)
Üstü çizili satırlar tamamlanan talimatlarla kapanmıştır.

| Kod | Özet | Talimat |
|---|---|---|
| ~~K-1~~ | ~~`dayOfYear` / `daysInMonth` 2024'e sabit~~ **✅ çözüldü** (tarih mantığı `src/lib/date.ts`'e taşındı) | T-03 · 2026-08-21 |
| ~~K-2~~ | ~~`CountUp` gün değişiminde tetiklenmiyor~~ **✅ çözüldü** (`useInView` + `[to,duration,inView]` bağımlılığı) | T-04 · 2026-08-21 |
| ~~K-3~~ | ~~`Reveal` için IO yedeği yok~~ **✅ çözüldü** (paylaşılan gözlemci + `setTimeout` güvenlik ağı) | T-04 · 2026-08-21 |
| ~~K-4~~ | ~~HMR sabit port~~ **✅ çözüldü** | T-01 · 2026-08-21 |
| K-5 | Gün gezinme düğmeleri (Önceki/Sonraki/Bugüne dön) dekoratif katman yüzünden tıklanamıyor — T-03 sırasında keşfedildi | Henüz atanmadı (T-04 kapsamı yalnızca K-2/K-3 idi) |
| ~~O-1~~ | ~~10 kullanılmayan bağımlılık~~ **✅ çözüldü** (11 paket kaldırıldı, `react-router-dom` korundu) | T-01 · 2026-08-21 |
| O-4 | Ağ isteği iptali yok | T-05 |
| O-5 | ErrorBoundary yok | T-09 |
| U-1 | Yönlendirme / paylaşılabilir URL yok | T-06 |
| U-2 | İçerik 10/366 gün | T-10 |
| U-5 | Test/lint altyapısı yok | T-12 |
