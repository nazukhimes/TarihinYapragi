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
                    src/main.tsx
                    createBrowserRouter([
                      "/"         → Navigate → /{bugünün-slug'ı} (replace)
                      "/:daySlug" → <App/>
                      "*"         → <NotFound/>
                    ])
                               │
                    ┌──────────▼──────────┐
                    │      App.tsx        │  ← TEK sayfa, tek durum sahibi
                    │  ------------------ │
                    │  useParams():       │
                    │   daySlug           │  → parseDaySlug → day, month (URL tek kaynak)
                    │  state:             │
                    │   pickerOpen        │  mini takvim açık mı
                    │   query             │  arama metni
                    │   broadcast         │  yayın modu açık mı
                    │  ------------------ │
                    │  useDayData()       │  → { data, loading, reload }
                    │  ------------------ │
                    │  6 adet useMemo     │  ham veriyi bölüm verisine dönüştürür
                    │  ------------------ │
                    │  !parsed → <NotFound/> (tüm hook'lardan sonra, en son)
                    └──────────┬──────────┘
                               │  props (aşağı doğru tek yön)
        ┌──────────────┬───────┴────────┬──────────────┐
        ▼              ▼                ▼              ▼
   leaf.tsx       sections.tsx      talk.tsx        ui.tsx
   (takvim)       (4 bölüm)      (kart + yayın)  (ortak parçalar)
```

**Mimari karar:** Global durum yönetimi (Context/Redux/Zustand) **yok**.
`App.tsx` tek durum sahibi, alt bileşenler saf sunum. Uygulama tek sayfa ve tek
"seçili gün" ekseninde döndüğü için bu doğru bir sadeleştirme. **Seçili günün
kendisi de artık `App.tsx`'in kendi state'i değil** — `react-router-dom`'un URL
state'i (T-06, bkz. 2.8).

---

## 2. Veri Katmanı — `src/lib/wiki.ts`

Dosya dört sorumluluğu üstlenir:

### 2.1 Getirme ve normalleştirme

```
fetchDayData(month, day, signal?)
  ├─ memCache kontrolü (en fazla 40 kayıt, FIFO) → varsa anında dön
  ├─ load("tr")  — fetchWithRetry(API/tr/onthisday/all/MM/DD, signal)
  │    ├─ başarılı → localStorage'a { savedAt, data } yaz ("ty-otd-tr-MM-DD") + pruneCache()
  │    └─ başarısız → localStorage'dan oku (varsa stale bayrağıyla) → yoksa DayError üret
  ├─ trThin? (events/births/deaths'ten biri boş) → load("en") aynı akışla (tamamlayıcı)
  ├─ ikisi de null → { offline: true, error: DayError, ...boş }
  ├─ pick(key): TR doluysa TR, değilse EN     ← alan bazında (events/births/deaths ayrı)
  └─ normalize(): year+text doğrula, pages'i 3 ile sınırla, id ata
```

**Dikkat:** Dil seçimi **alan bazında** yapılır. Bir gün için TR'de olay varsa ama
doğum yoksa; olaylar TR'den, doğumlar EN'den gelir. `data.sources` bunu takip eder ve
arayüzde "kaynak: TR Vikipedi" olarak gösterilir.

**TR-önce optimizasyonu (T-05):** `fetchDayData` artık EN'i **koşulsuz** çekmez —
yalnızca TR'nin `events`/`births`/`deaths` alanlarından biri bile boşsa (`trThin`)
EN tamamlayıcı olarak çekilir. TR'nin üç ana alanı doluyken `tr.holidays`/`tr.selected`
boş kalsa bile EN'e düşülmez (istek sayısını yarıya indirmenin bilinçli bir bedeli —
bkz. T-05 Tamamlanma Kaydı). `load()` ve `fetchWithRetry()` bir `AbortSignal` alır;
`useDayData` her gün değişiminde önceki isteği `AbortController.abort()` ile iptal
eder (eski `reqId` sayacı **kaldırıldı**). `fetchWithRetry()` yalnızca 429/5xx için
en fazla 2 deneme yapar (400ms/800ms bekleme); 404 ve diğer kalıcı hatalarda hiç
denemez. HTTP durumu `classifyStatus()` ile `DayErrorKind`'a
(`network`/`notfound`/`ratelimit`/`server`/`unknown`) sınıflandırılır.

**Önbellek (T-05):** `localStorage` kaydı artık `{ savedAt, data }` zarfında; 24 saat
(`TTL_MS`) sonra `stale: true` ile döner (veri **atılmaz**, yalnızca işaretlenir —
arayüzde "önbellekten · 24 saatten eski" olarak gösterilir). `pruneCache()` her
başarılı yazımdan sonra `ty-otd-` önekli anahtarları tarar, en eski olanlardan
başlayarak **60 kaydın üzerini** siler. `memCache` için `memSet()` aynı mantığı
FIFO ile bellek üzerinde uygular, sınır **40 kayıt**.

**`API` sabiti nereden geliyor:** `wiki.ts` artık URL'i kendi içinde tanımlamaz;
`import { WIKI_API_BASE as API } from "./config"` ile alır (T-02). `config.ts`
`VITE_WIKI_API_BASE` ortam değişkenini okur, yoksa üretim Wikimedia adresine düşer.
Taban adresi değiştirecekseniz `config.ts`'e bakın.

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

`{ data, loading, error, reload }` döner (T-05'te `error: DayError | null` eklendi;
`App.tsx` şu an bunu tüketmiyor — hata **ekranı** T-09'un kapsamında). Yarış durumuna
(race condition) karşı koruma artık eski `reqId` sayacı yerine gerçek iptaldir: her
efekt yeni bir `AbortController` kurar, temizlik fonksiyonu `ctrl.abort()` çağırır,
`fetchDayData`'ya `ctrl.signal` iletilir. Geç dönen eski istek artık yalnızca
yok sayılmaz — **ağ düzeyinde iptal edilir** (bkz. ANALIZ-RAPORU O-4, ✅ T-05).
`AbortError` `isAbortError()` ile ayırt edilip sessizce yutulur; `error` state'i
yalnızca *beklenmeyen* (abort dışı) bir promise reddi için bir güvenlik ağıdır.

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

### 2.8 Yönlendirme — `src/lib/slug.ts` + `src/main.tsx` (T-06)

Her gün kendi URL'sine sahip: `/21-agustos` (ana biçim, ay adıyla) veya `/08-21`
(sayısal, kanonik ad biçimine `replace` ile yönlenir).

```
toDaySlug(month, day)   → "21-agustos"   (ay adı MONTH_SLUGS'tan, Türkçe karaktersiz)
parseDaySlug(slug)      → { month, day } | null
  ├─ "\d{1,2}-\d{1,2}"     → sayısal biçim (08-21)
  ├─ "\d{1,2}-[a-z]+"      → ad biçimi (21-agustos), MONTH_SLUGS.indexOf ile ay bulunur
  └─ isValidDay()          → daysInMonth(month) ile sınır kontrolü, YIL VERİLMEZ
                              (29 Şubat arşiv modunda her zaman geçerli)
```

`MONTH_SLUGS`, `../components/leaf`'teki `MONTHS_TR`'den türetilir (tek kaynak,
tekrar yok) — **bu, `lib` → `components` yönünde bir bağımlılık** ve projenin
genel katman yönüne ters düşer; bilinçli bir ödünleşim (T-06'da böyle
belirlendi). **Dikkat:** `components/leaf.tsx`'in kendisi `slug.ts`'ten hiçbir
şey içe aktarmamalı — aksi hâlde döngüsel import oluşur. T-06 sırasında tam
olarak bu hataya düşüldü (Paylaş düğmesi ilk denemede `leaf.tsx`'e eklenmişti,
`toDaySlug` içe aktarımıyla döngü oluştu); `vite build` (Rollup) bunu
**yakalamadı**, yalnızca `vite dev`'in native ESM sırası `ReferenceError: Cannot
access 'MONTHS_TR' before initialization` olarak açığa çıkardı. Bu yüzden Paylaş
düğmesi (`shareDay`) `App.tsx`'te yaşıyor, `leaf.tsx`'te değil.

`src/main.tsx`, `createBrowserRouter` ile üç rota kurar: `/` bugünün slug'ına
`replace` ile yönlenir (geçmişte iz bırakmaz), `/:daySlug` `App`'i render eder,
`*` (eşleşmeyen her şey) `NotFound`'u render eder. `App.tsx` içinde `day`/`month`
için **ayrı `useState` yoktur** — `useParams()` → `parseDaySlug()` üzerinden
URL'den türetilir; gün değiştirme (`setDate`) `navigate(/${toDaySlug(m,d)})`
çağırır. Slug geçersizse `App` yine de **tüm hook'larını** (Hooks kuralları
gereği) bugünün verisiyle boşa çalıştırıp en sonda `<NotFound/>` döner —
`day`/`month`'un state yerine URL'den türetilmiş olması bunu mümkün kılan
tasarımın parçasıdır.

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
| `Modal` | Esc ile kapanır, `body` kaydırmasını kilitler, Tab döngüsü (odak tuzağı) + kapanışta odağı çağırana iade eder, isteğe bağlı `titleId` prop ile `aria-labelledby` *(odak tuzağı T-07'de eklendi)* |
| `toast()` / `Toaster` | `window` CustomEvent tabanlı, en fazla 3 bildirim, kap `role="status"`/`aria-live="polite"` taşır *(T-07)* |
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

**Mevcut derleme:** 324,12 kB JS (105,76 kB gzip), 53,09 kB CSS (10,07 kB gzip), 44 modül.
Artış `react-router-dom`'un artık gerçekten paketlenmesinden (T-06 öncesi kurulu
ama kullanılmadığı için tree-shaking ile tamamen düşüyordu).

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
| K-5 | Gün gezinme düğmeleri (Önceki/Sonraki/Bugüne dön) dekoratif katman yüzünden fare/dokunmatikle tıklanamıyor — T-03 sırasında keşfedildi | Henüz atanmadı (T-04, T-06 ve T-07 sırayla değerlendirdi, üçü de bilinçli olarak dokunmadı — `leaf.tsx`'e gerçekten dokunacak bir talimat gerekiyor) |
| ~~O-1~~ | ~~10 kullanılmayan bağımlılık~~ **✅ çözüldü** (11 paket kaldırıldı, `react-router-dom` korundu) | T-01 · 2026-08-21 |
| ~~O-4~~ | ~~Ağ isteği iptali yok, TR doluyken de EN çekiliyordu~~ **✅ çözüldü** (`AbortController` + TR-önce/EN-tamamlayıcı + 429/5xx için sınırlı deneme) | T-05 · 2026-08-21 |
| ~~O-8~~ | ~~Önbellek stratejisi yarım (TTL/sınır yok)~~ **✅ çözüldü** (`savedAt`/`stale`, `pruneCache()` 60 kayıt, `memSet()` 40 kayıt FIFO) | T-05 · 2026-08-21 |
| ~~O-6~~ | ~~Erişilebilirlik boşlukları (odak tuzağı, `aria-live`, skip link, arama etiketi, kontrast, `aria-pressed`)~~ **✅ çözüldü** | T-07 · 2026-08-21 |
| ~~O-7~~ | ~~Klavye kısayolları yalnızca Yayın Modu'nda~~ **✅ çözüldü** (`←`/`→`/`T`/`/`/`?`/`Esc` + Kısayol Yardımı) | T-07 · 2026-08-21 |
| O-5 | ErrorBoundary yok | T-09 |
| O-10 | `text-brand` koyu zeminde metin/simge olarak yetersiz kontrast (Ticker başlığı, Karanlık Dosyalar rozeti/düğmesi) — T-07 sırasında gerçek bir Lighthouse denetimiyle keşfedildi | Henüz atanmadı |
| ~~U-1~~ | ~~Yönlendirme / paylaşılabilir URL yok~~ **✅ çözüldü** (`createBrowserRouter` + `src/lib/slug.ts`, URL tek doğruluk kaynağı) | T-06 · 2026-08-21 |
| U-2 | İçerik 10/366 gün | T-10 |
| U-5 | Test/lint altyapısı yok | T-12 |
