# MİMARİ — Tarih Yaprağı

> Teknik derinlik belgesi. Projenin "ne olduğu" için önce
> [`BAGLAM.md`](BAGLAM.md)'yi okuyun; burası **nasıl çalıştığını** anlatır.
>
> **Son güncelleme:** 2026-08-23 (T-13)

---

## 1. Genel Şema

```
┌──────────────────────────────────────────────────────────────────┐
│  index.html                                                      │
│    · lang="tr", meta, theme-color, Google Fonts (Fraunces /      │
│      IBM Plex Sans / IBM Plex Mono — daraltılmış ağırlık/italik  │
│      aralığı + preload/onload takası, T-13, bkz. 7)              │
│    · favicon/apple-touch-icon/manifest <link>, og:*/twitter:*,   │
│      canonical yer tutucusu, WebSite JSON-LD (T-08, bkz. 9)      │
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
                    │      App.tsx        │  ← TEK sayfa, tek durum sahibi (244 satır, T-13'te 1.079'dan indi)
                    │  ------------------ │
                    │  useParams():       │
                    │   daySlug           │  → parseDaySlug → day, month (URL tek kaynak)
                    │  state:             │
                    │   pickerOpen        │  mini takvim açık mı
                    │   query             │  arama metni
                    │   broadcast         │  yayın modu açık mı
                    │  ------------------ │
                    │  useDayData()       │  → { data, loading, reload }
                    │  useGunVerisi()     │  → türetilmiş veri (bkz. 4.1)
                    │  useAramaSonuclari()│  → arama sonuçları (bkz. 4.1)
                    │  useKlavyeKisayollari() → global ←/→/T// /?/Esc dinleyicisi
                    │  ------------------ │
                    │  !parsed → <NotFound/> (tüm hook'lardan sonra, en son)
                    └──────────┬──────────┘
                               │  props (aşağı doğru tek yön)
     ┌───────────┬─────────────┼─────────────┬────────────┬─────────────┐
     ▼           ▼             ▼             ▼            ▼             ▼
 UstBar    AcilisBolumu   BolumNav      Bolumler     AltBilgi    KisayolYardimi
(başlık+   (takvim yaprağı (yapışkan     (6 içerik    (footer)    (? modalı)
 arama)     +GunOzeti+      bölüm nav)    bölümü, her
            OzelGunler+                   biri sections.tsx/
            Ticker)                       talk.tsx'ten)
                                                │
                              ┌─────────────────┼─────────────────┐
                              ▼                 ▼                 ▼
                         leaf.tsx         sections.tsx        talk.tsx
                         (takvim)         (4 bölüm)         (kart; BroadcastMode
                                                              React.lazy ile
                                                              broadcast.tsx'ten,
                                                              T-13 bkz. 7)
```

Tüm bu bileşenler (+ `ui.tsx`, ortak parçalar) `src/components/` altında yaşar.

**Mimari karar:** Global durum yönetimi (Context/Redux/Zustand) **yok**.
`App.tsx` tek durum sahibi, alt bileşenler saf sunum. Uygulama tek sayfa ve tek
"seçili gün" ekseninde döndüğü için bu doğru bir sadeleştirme. **Seçili günün
kendisi de artık `App.tsx`'in kendi state'i değil** — `react-router-dom`'un URL
state'i (T-06, bkz. 2.8). **T-13'te** veri türetme (`useMemo` katmanı) ve
sunum, `App.tsx`'ten `src/hooks/useGunVerisi.ts` ile 9 yeni `components/*.tsx`
dosyasına ayrıştırıldı; `App.tsx`'in kendisi artık yalnızca *düzen + durum +
efekt* kabuğu — tek durum sahibi olma ilkesi bozulmadı, yalnızca JSX/hesaplama
hacmi dışarı taşındı (bkz. 4.1, 4.6).

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

### 2.2 Sınıflandırma — `classifyItem()` (`src/lib/classification.ts`, T-11)

`classifyItem`/`detectDarkItem` artık `wiki.ts` içinde tanımlı değil —
`src/lib/classification.ts`'e taşındı (`wiki.ts` yalnızca içe aktarıp yeniden
dışa aktarır, çağıranlar için hiçbir şey değişmedi). Ayrımın sebebi:
`scripts/siniflandirma-raporu.mjs`'in gerçek sınıflandırıcıyı (bir kopyasını
değil) ölçebilmesi için bağımsız, `react`/ağ katmanından tamamen arınmış bir
modül gerekiyordu (bkz. §9.5).

```ts
interface Kural { kategori: CategoryId; desen: RegExp; puan: number }
const KURALLAR: Kural[] = [ ... ];  // SIRA ÖNEMLİ DEĞİL
```

Eskiden kurallar dizi sırasıyla denenip **ilk eşleşen kazanırdı** — hem yanlış
pozitif hem de öngörülemez öncelik hataları üretiyordu (bkz. `ANALIZ-RAPORU.md`
U-3, ✅ T-11). Artık **tüm kurallar** denenir, her kuralın bir `puan`ı
(3=güçlü, 2=orta, 1=zayıf) kategori bazında toplanır, en yüksek toplamı alan
kategori kazanır. Eşit puanda **sabit bir öncelik sırası** devreye girer
(dosyanın başında belgeli):

```
felaket > savas > siyaset > bilim > kesif > kultur > spor > genel
```

**Türkçe ek toleransı:** Kalıplar genelde kelime köküne `\b` ile demirlenir,
sonuna serbest ek bırakılır. **Dikkat:** JS'in `\b`/`\w`'ı yalnızca ASCII
harfleri kelime karakteri sayar — ç/ğ/ı/ö/ş/ü bunun dışında kalır. Bir kalıp
bu harflerden biriyle başlıyor/bitiyorsa (`çığ`, `şampiyon`, `öldürüldü` gibi)
`\b` yerine dosyanın başındaki `(?<![a-zçğıöşü])`/`(?![a-zçğıöşü])` sınırı
kullanılır — aksi hâlde kalıp normal bir cümlede (boşluktan önce/sonra) **hiç
eşleşmez** (bu, T-11 sırasında gerçek veriyle doğrulanan, kritik bir bulguydu).
Yanlış pozitif riski yüksek kısa kalıplar (`kaza`, `ay'`, `ordu`, `patlama`,
`sel`, `bat-`) bağlamla birlikte yazılır — örn. `/\b(uçak|tren|maden|trafik|
otobüs) kaza/`, `/\bay['’](a|ın|da|dan)\b/` (bu ikisi artık sırasıyla "Bursa
kazası" ve "Saray'a" gibi kelimeleri yakalamıyor).

Altın küme doğruluğu ölçmek için: `npm run siniflandirma` (bkz. §9.5).

### 2.3 Karanlık arşiv taraması — `detectDarkItem()`

`KARANLIK` üzerinde aynı puanlama mantığı, ek olarak bir **eşik**: toplam puan
**3'ün altındaysa** `null` döner (karanlık dosya sayılmaz) — tek bir zayıf
eşleşme (ör. bağlamsız `saldır`, puan 2) artık tek başına yetmiyor; güçlü
kanıtlar (`suikast`, `katliam`, `idam edil`, can kaybı belirtilen `deprem`…)
tek başına yeterli (puan 3). Dönen etiket `App.tsx` içinde `CaseType`'a
haritalanır:

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

### 2.9 Gün bazlı dinamik meta — `App.tsx` (T-08)

`index.html`'deki etiketler **statik** (her günde aynı) — sunucu tarafı render
yok, bu yüzden ilk HTML her zaman bugünün değil, varsayılan başlığı taşır. Bunu
telafi etmek için `App.tsx`'in en sonuna (tüm diğer hook'lardan sonra, `if
(!parsed) return <NotFound/>` erken çıkışından **önce** — hook sırası sabit
kalsın diye) bir `useEffect` eklendi:

```
[dayLabel, spotlight, month, day] değişince:
  document.title
  meta[name=description]
  meta[property=og:title]
  meta[property=og:description]
  link[rel=canonical]           → `${location.origin}/${toDaySlug(month,day)}`
```

**Sınır (bilinçli, talimatın kendi notu):** Bu güncelleme JS çalıştıktan
**sonra** devreye girer. Google gibi JS çalıştıran botlar günceli görür; ama
WhatsApp/Twitter gibi bağlantı-önizleme botları JS çalıştırmaz, `index.html`'deki
**statik** `og:*` etiketlerini görmeye devam eder — yani paylaşılan her bağlantı
aynı genel (gün-bağımsız) önizlemeyi gösterir. Gün bazlı sosyal önizleme için
ön-işleme (prerender/SSR) gerekir; bu **PLAN-02** kapsamındadır (bkz. 9.5).

---

## 3. Veri Modeli — `src/data/`

**T-10 (2026-08-22) öncesi** tüm veri tek dosyadaydı: `src/data/curated.ts`,
1.001 satır. **T-10 ile** dosya 12 ay dosyasına + bir tip dosyasına bölündü —
neden ve nasıl için bkz. 3.3.

```
src/data/
├── types.ts          ← tipler + sabitler + curatedKey()
├── index.ts           ← birleştirici: 12 ay nesnesini CURATED'ta toplar, types.ts'i yeniden dışa aktarır
└── gunler/
    ├── 01-ocak.ts      → export const OCAK: Record<string, CuratedDay>
    ├── 02-subat.ts     → export const SUBAT: ...
    ├── ...
    └── 12-aralik.ts    → export const ARALIK: ...
```

**Çağıran koddan bakınca hiçbir şey değişmedi:** her yerde `from "./data"` /
`from "../data"` içe aktarılır (`App.tsx`, `wiki.ts`, `sections.tsx`, `talk.tsx`);
`index.ts` tek giriş noktası olduğu için ay dosyalarının kendisi dışarıya hiç
sızmaz.

### 3.1 Tipler — `src/data/types.ts`

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

curatedKey(month, day) → "MM-DD"   // tip dosyasında yaşıyor, veri değil
```

`src/data/index.ts` içindeki `CURATED : Record<"MM-DD", CuratedDay>`, 12 ay
nesnesinin spread'iyle (`{ ...OCAK, ...SUBAT, ..., ...ARALIK }`) kurulur.

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

**60 gün** (366 günün %16,4'ü) — 10 gün T-01 öncesinden, 50 gün T-10 ile eklendi
(46'sı planlanan 4 parti, 4'ü editörün seçtiği ek gün). Tam liste `src/data/dizin.ts`
diye ayrı bir dosyada **tutulmuyor** — T-10, tembel yükleme (aşağıya bakın) devreye
girmediği için ayrı bir dizin dosyasına gerek görmedi; "Özel dosyalı günler" şeridi
(`App.tsx`) hâlâ doğrudan `Object.keys(CURATED)` okuyor.

12 ay dosyasının toplam boyutu ~3.850 satır (eski tek dosyanın ~%385'i, 6 kat
içerikle orantılı büyüme). **Tembel yükleme (T-10'un A3 adımı) uygulanmadı** —
talimatın kendi kararı gereği ("60 günü geçtikten sonra yapılabilir") bilinçli
olarak ertelendi; paket boyutu artışı (+64,64 kB gzip) talimatın kendi eşiğinin
(<100 kB) altında kaldığı için gerek de kalmadı. 366 günün tamamı doldurulursa
(PLAN-02+) bu karar yeniden değerlendirilmeli.

---

## 4. Sunum Katmanı

### 4.1 `src/hooks/useGunVerisi.ts` — birleştirme (useMemo) katmanı (T-13'te `App.tsx`'ten taşındı)

| useMemo | Girdi | Çıktı | Kural |
|---|---|---|---|
| `mergedEvents` | CURATED.events + API events | `MergedEvent[]` | matchKeys ile ayıkla, yıla göre **artan** sırala |
| `births` / `deaths` | API | `PersonCard[]` | `pages[0]` olmayan atlanır |
| `allCases` | CURATED.cases + tarama | `CaseFile[]` | otomatik olanlar `slice(0, 6)` |
| `allScience` | CURATED.science + bilim/keşif olaylar | `ScienceMilestone[]` | otomatik `slice(0, 3)`, yıla göre **azalan** |
| `talkCards` | CURATED.talk + buildAutoTalk | `TalkCard[]` | toplam `slice(0, 9)` |
| `spotlight` | CURATED.spotlight ya da `selected[0]` | manşet | editör varsa o kazanır |

Ayrıca `tickerItems` (14 öğeye seyreltilmiş bant) ve `ambientYears` (arka plandaki
dev yıl rakamları) türetilir. `useGunVerisi(data, curated)` bu yediyi tek bir
`GunVerisi` nesnesinde döner; `App.tsx` bunu çağırıp aşağı doğru (bkz. 4.6)
props olarak dağıtır — davranış T-13 öncesiyle **birebir aynı**, yalnızca
konum değişti.

**Arama süzmesi — `useAramaSonuclari(veri, query)` (aynı dosya, T-13):**
Önceden üst bardaki arama sonuç sayacı ile her bölümün kendi `visible` listesi
**aynı** `matchQuery` taramasını iki kez (App.tsx'te sayaç için, bölüm
içinde render için) çalıştırıyordu — üstelik biraz **farklı** alan
listeleriyle (sayaç daha dar, bölüm daha geniş arıyordu, bkz. eski m-8 notu /
T-09 Tamamlanma Kaydı). `useAramaSonuclari` artık her tür (`olay`/`dogum`/
`vefat`/`dosya`/`bilim`) için **tek** bir kanonik `matchQuery` çağrısı yapar
(bölümlerin daha geniş alan listesi kazandı) ve süzülmüş dizileri döner; üst
bar bunların `.length`'ini sayaç olarak, bölüm bileşenleri (`sections.tsx`,
bkz. 4.3) kendi tam listeleriyle kesişimini (`Set`+kimlik karşılaştırması,
metin taraması **tekrar çalışmaz**) `matched` prop'u üzerinden alır. Arama
boşsa (`query.trim()===""`) filtreleme hiç çalışmaz, tam listeler doğrudan
döner (ucuz kısayol).

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
| `SectionShell` | `id` + `scroll-mt-28` + `.section-shell` (`content-visibility:auto`, T-13) sarmalayıcı (yapışkan nav için) |

**T-13 API değişikliği:** `TimelineSection`/`PeopleRow`/`CasesSection`/
`ScienceSection` artık bir `query: string` prop'u **almaz** — bunun yerine
`matched` prop'unu alır (üst düzeyde `useAramaSonuclari`'nin ürettiği,
önceden süzülmüş alt küme, bkz. 4.1). İçeride `matchQuery` **çağırmazlar**;
yalnızca `matched`'ten kurulan bir `Set`e kimlik (`id`) karşılaştırmasıyla
bakarlar. Kategori (`cat`) filtresi ve "Tümü · N" çip sayaçları **tam**
listeden (`events`/`people`/`cases`/`items`, arama ile daralmaz) beslenmeye
devam eder — bu, T-13 öncesindeki davranışla birebir aynı kalması gereken bir
ayrıntıydı (arama açıkken bile çip sayaçları günün toplamını göstermeli).

### 4.4 `components/talk.tsx` + `components/broadcast.tsx` (T-13'te ayrıldı)

- `TalkSection` — yayıncı bandı + kart ızgarası (`talk.tsx`, ana pakette)
- `TalkCardView` — kâğıt dokulu, çizgili defter görünümlü kart + kopyala (`talk.tsx`)
- `BroadcastMode` — tam ekran teleprompter; `←` `→` `Space` `Esc` klavye desteği,
  ilerleme çubuğu, nokta göstergeleri, `scanlines` efekti — **`broadcast.tsx`**
  dosyasına taşındı, `App.tsx`'te `React.lazy(() => import("./components/
  broadcast"))` ile yükleniyor (T-13 Adım 1). Çoğu ziyaretçi Yayın Modu'nu hiç
  açmadığı için bu içerik ilk pakete girmiyor; `Suspense` geri dönüşü
  (`YayinYukleniyor`, `App.tsx`) tam ekran koyu zemin + yanıp sönen nokta.

`CAT_COLOR`/`catColor()` sözlüğü kart kategorisini renge çevirir (eşleşme
yoksa altın `#e8b04b`); **`talk.tsx`'te kalıyor** (`dışa aktarılıyor`) çünkü
`TalkSection` zaten ana pakette — `broadcast.tsx` bunu oradan içe aktarır,
kopyalanmaz (Rollup, ayrı parçadan ana paketteki bir dışa aktarıma referans
verir, tekrar paketlemez).

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

### 4.6 `App.tsx`'in bölündüğü bileşenler (T-13)

`App.tsx` 1.079 satırdan 244'e indi (hedef ≤300, bkz. 7). Bölünme sorumluluğa
göre yapıldı — her parça `App.tsx`'in JSX'inde neyin karşılığıysa onu taşıyor,
davranış **birebir aynı** kaldı:

| Dosya | Karşılık geldiği eski JSX | Not |
|---|---|---|
| `UstBar.tsx` | Üst bar: logo, arama (masaüstü+mobil), canlı saat, Yayın Modu düğmesi, arama sonuç şeridi | `aramaRef`/`aramaMobilRef` `App.tsx`'te kalır (klavye kısayolu `/` bunlara odaklanır), prop olarak geçirilir |
| `AcilisBolumu.tsx` | Açılış `<section>`: dev ambiyans yılları + takvim yaprağı + paylaş düğmesi + `GunOzeti` + `OzelGunler` + haber bandı | `veri: GunVerisi`'i tek prop olarak alır (bkz. 4.1) |
| `GunOzeti.tsx` | Spotlight başlığı + sayaçlar + zaman aralığı + yükleniyor/hata durumları | `HATA_BASLIK` haritası buraya taşındı; `stats` dizisi burada kurulur (`hedef` alanıyla, m-1 düzeltmesi) |
| `OzelGunler.tsx` | "Özel dosyalı günler" pill şeridi | `CURATED`'ı doğrudan içe aktarır |
| `BolumNav.tsx` | Yapışkan bölüm navigasyonu | `NAV` dizisi artık burada tanımlı (eskiden `App.tsx`'te); `visible` prop'u `false` ise `null` döner |
| `Bolumler.tsx` | Altı içerik bölümü (`SectionShell`×6) + "Bugünün anlamı" şeridi + arama boş durumu | `arama: AramaSonuclari`'ni her bölüme `matched` olarak dağıtır (bkz. 4.1, 4.3) |
| `AltBilgi.tsx` | Footer | Durumsuz, saf statik JSX |
| `KisayolYardimi.tsx` | Klavye kısayolları modalı (`?` ile açılır) | `Modal`'ı sarar, kısayol listeleri sabit dizi |
| `Iskeletler.tsx` | `SkeletonLines`/`SkeletonCards` | Değişmedi, yalnızca taşındı |
| `src/hooks/useKlavyeKisayollari.ts` | Global `←/→/T///?/Esc` `keydown` dinleyicisi | `aktif` prop'u eski `if (broadcast) return;` kontrolünün yerini alır |

`App.tsx`'te kalanlar: `useParams`/URL ayrıştırma, tüm `useState`, `useDayData`,
`useGunVerisi`/`useAramaSonuclari` çağrıları, `setDate`/`gunKaydir`/
`bugüneDön`/`shareDay` geri çağırmaları, kanonik URL yönlendirme `useEffect`'i,
gün bazlı meta `useEffect`'i (2.9) ve yukarıdaki bileşenleri saran düzen JSX'i.

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
| **Yeni kategori** | 1) `data/types.ts` → `CategoryId` birleşimine ekle · 2) `CATEGORIES`'e `{label, color}` · 3) `classification.ts` → `KURALLAR`'a puanlı kural(lar) + `PRIORITY`'ye ekle · 4) `npm run siniflandirma` ile doğrula |
| **Yeni dosya türü** | 1) `data/types.ts` → `CaseType` birleşimi · 2) `CASE_LABELS` · 3) `App.tsx` tema→tür haritası |
| **Yeni gün içeriği** | İlgili ay dosyasına (`data/gunler/MM-ad.ts`) `"MM-DD": { spotlight?, events?, cases, science, talk }` ekle — şablon ve kalite ölçütleri için [`ICERIK-SABLONU.md`](ICERIK-SABLONU.md) |
| **Yeni dil** | `wiki.ts` → `load()` çağrılarını ve `pick()` mantığını genişlet; `sources` tipini güncelle |

---

## 7. Performans Notları (T-13'te ölçüldü ve iyileştirildi)

**Mevcut derleme (T-13 sonrası, 60 gün, 72 modül):** 3 parça —
`react` (206,26 kB / 67,36 kB gzip, `manualChunks` ile ayrıldı — uygulama
kodu değiştiğinde yeniden inmez), `index` (330,98 kB / 108,18 kB gzip, uygulama
kodu + 60 günlük editör verisi), `broadcast` (4,67 kB / 1,63 kB gzip, **yalnızca
Yayın Modu açılınca iner**, `React.lazy`). İlk yük (`react`+`index`) =
**175,54 kB gzip**. CSS: **54,73 kB (10,43 kB gzip)** — `@source not` ile
`Dokumanlar/`/`Talimatlar/` artık taranmıyor (A/B testiyle doğrulandı:
55,19→54,65 kB ham, exclusion olmadan/olarak, bkz. 11.1).

**T-13 öncesi (T-12 sonrası, tek parça, 59 modül):** 537,97 kB JS
(174,38 kB gzip), 55,01 kB CSS (10,44 kB gzip, belge klasörleri dahil
taranmış). **İlk yük neredeyse değişmedi** (174,38→175,54 kB gzip, kod bölme
+`manualChunks` sayesinde parça sayısı arttı ama toplam gzip bayt hafifçe
arttı bile — çoklu parça gzip sıkıştırmasının bağlam paylaşamamasının
beklenen bedeli). **Kök neden:** `rollup-plugin-visualizer` (`npm run
analyze`, T-13 Adım 9) ile incelenince `src/data/gunler/` (60 günlük editör
içeriği, T-10) tek başına **~300 kB kaynak kod** olduğu ve `index` parçasının
büyük çoğunluğunu oluşturduğu görüldü — bu, 3.3'teki "tembel yükleme
ertelendi" kararının artık gerçek bir bedeli olduğunun kanıtı. T-13'ün
yaptığı her şey (kod bölme, font/CSS daraltma, `manualChunks`) doğru ve etkili
ama **veri hacminden bağımsız**; asıl kütleyi düşürmek 3.3'teki tembel
yüklemeyi gerektiriyor (bkz. Bilinen maliyet kalemleri, aşağı).

**Lighthouse (mobil, üretim derlemesi — `vite preview` + `npx lighthouse`,
Bash üzerinden, Browser pane'den bağımsız, T-13):** İlk kez Performans,
Erişilebilirlik ve SEO **aynı üretim derlemesine karşı, birlikte** ölçüldü.

| Kategori | Puan | Not |
|---|---|---|
| Performans | **92** | LCP 2,3 s · CLS 0,009 · TBT 240 ms · FCP 2,1 s (29 Ekim, temiz ölçüm) |
| Erişilebilirlik | **96** | T-07'deki 96 ile birebir aynı, regresyon yok |
| SEO | **100** | T-08'deki 100 ile birebir aynı, regresyon yok |

**Ölçüm sapmaları (T-13 Tamamlanma Kaydı'nda ayrıntılı):** (1) dev sunucusuna
(`npm run dev`) karşı ölçülen ilk deneme Performans **42** verdi — bu bir
regresyon değil, Vite dev modunun her modülü bundlesiz ayrı dosya olarak
servis etmesinin doğal sonucu (LCP 18,5 s); yalnızca `vite preview` (gerçek
paket) anlamlı bir ölçüm verir. (2) İlk `vite preview` turunda render-blocking
font CSS'i ~1.980 ms kayıp olarak işaretlendi; talimatın önerdiği çıplak
`<link rel="preload" as="style">` **tek başına** bunu çözmüyordu — standart
preload+`onload` takas deseni eklenince Performans **69 → 92**'ye çıktı (bkz.
`index.html`). (3) Aynı sayfayı farklı turlarda ölçünce puan **68-92**
arasında salındı; kök neden client kodda değil, canlı Wikipedia API isteğinin
(~750 kB, ~2,4 s) LCP'nin önündeki gerçek darboğaz olması ve Lighthouse'un
`simulate` gecikme modelinin bu dış isteğin zamanlamasına duyarlı olması —
PLAN-01'in "backend yok" ilkesiyle doğrudan çelişen bir sunucu-taraflı önbellek/
proxy olmadan **garanti edilemez**.

Bilinen maliyet kalemleri:

- ~~**181 IntersectionObserver örneği**~~ **✅ çözüldü (T-04)** — `src/lib/useInView.ts`
  artık tek paylaşılan gözlemci kullanıyor (181 → 1); bkz. 2.7.
- ~~**Kod bölme yok**~~ **✅ çözüldü (T-13)** — `BroadcastMode` `broadcast.tsx`'e
  taşındı, `React.lazy` ile yalnızca Yayın Modu düğmesine basılınca iner
  (canlı doğrulandı: ağ isteği tıklamadan önce yok); `react` de ayrı bir
  önbellek parçasında (`manualChunks`).
- **`data/gunler/*.ts` hâlâ hiç tembel yüklenmiyor** — 60 günün tamamı (T-10)
  ana pakete giriyor; kullanıcı tek bir günü görüyor. T-13'ün `rollup-plugin-
  visualizer` ölçümü bunun artık paketin **baskın** kalemi olduğunu doğruladı
  (~300 kB kaynak). T-10'un kendi A3 adımı bu amaçla ay bazlı `import()`
  tasarladı ama uygulamadı; T-13 de kendi Kapsam Dışı tablosu gereği
  dokunmadı — 366 güne çıkılırsa (PLAN-02) artık **zorunlu** bir adım.
- ~~**Görsellerde `width`/`height` yok**~~ **✅ çözüldü (T-07)** — kart küçük
  resmi `248×132`, modal küçük resmi `96×112` (bkz. eski m-5 notu).
- ~~**Google Fonts** 3 aile × çok ağırlık yükleniyordu~~ **✅ çözüldü (T-13)** —
  gerçek kullanım (`grep -rn italic`/`font-bold` vb.) taranıp aralık
  daraltıldı: Fraunces düz 600-900 + italik yalnızca 400-500 (talimatın
  önerdiği "italiği tamamen kaldır" diff'i **uygulanmadı** — 4 gerçek italik
  kullanım noktası vardı), IBM Plex Mono 400/600/700, IBM Plex Sans (gövde)
  yalnızca 400. Ayrıca render-blocking olmaktan çıkarıldı (preload+onload
  takası, yukarı bkz.).
- **Canlı Wikipedia API isteği** (~750 kB, ~2,4 s) — LCP'nin önündeki en büyük
  tek darboğaz (yukarı bkz.); istemci taraflı bir çözümü yok, PLAN-01'in
  backend'siz ilkesiyle çelişiyor.

---

### 7.1 Diğer T-13 iyileştirmeleri (kısa liste)

Yukarıdaki paket/Lighthouse rakamlarına doğrudan yansımayan ama görsel/kod
kalitesi açısından önemli değişiklikler:

- **Ticker hızı** artık öğe sayısına bağlı (`öğe × 4s`, 20-90s sınırlı;
  `leaf.tsx` → `Ticker`) — önceden sabit 55s, 3 öğede sürünüyordu.
- **`.noise` ve `.drift-slow`/`.drift-slower`** mobilde (≤768px / ≤640px)
  tamamen kapatılıyor (`index.css`) — masaüstünde değişmedi.
- **`content-visibility: auto`** altı içerik bölümünün her birinde
  (`.section-shell`, `sections.tsx` → `SectionShell`) — ekran dışı bölümler
  render/boyama maliyetinden muaf. `scrollIntoView` ile hedef konumlandırma
  canlı doğrulandı, geri alınmadı (bkz. T-13 Tamamlanma Kaydı).
- **`stats.indexOf(s)` kalıbı kaldırıldı** (eski m-1) — her sayaç nesnesine
  doğrudan bir `hedef` alanı eklendi (`GunOzeti.tsx`).
- **Arama süzmesi tekilleştirildi** (`useAramaSonuclari`, bkz. 4.1) — üst bar
  sayacı ile bölümler artık aynı, tutarlı sonuç kümesini paylaşıyor.

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
| ~~K-5~~ | ~~Gün gezinme düğmeleri (Önceki/Sonraki/Bugüne dön) dekoratif katman yüzünden fare/dokunmatikle tıklanamıyor~~ | **✅ ÇÖZÜLDÜ (T-15)** — dekoratif katmanlar kartın kendi `relative` sarmalayıcısına alındı (`inset-0` artık kartın kutusunu ifade ediyor), `pointer-events-none` + `aria-hidden` eklendi, gezinme satırı `relative` yapıldı. Düğmeler hem görünür hem tıklanabilir |
| ~~O-1~~ | ~~10 kullanılmayan bağımlılık~~ **✅ çözüldü** (11 paket kaldırıldı, `react-router-dom` korundu) | T-01 · 2026-08-21 |
| ~~O-4~~ | ~~Ağ isteği iptali yok, TR doluyken de EN çekiliyordu~~ **✅ çözüldü** (`AbortController` + TR-önce/EN-tamamlayıcı + 429/5xx için sınırlı deneme) | T-05 · 2026-08-21 |
| ~~O-8~~ | ~~Önbellek stratejisi yarım (TTL/sınır yok)~~ **✅ çözüldü** (`savedAt`/`stale`, `pruneCache()` 60 kayıt, `memSet()` 40 kayıt FIFO) | T-05 · 2026-08-21 |
| ~~O-6~~ | ~~Erişilebilirlik boşlukları (odak tuzağı, `aria-live`, skip link, arama etiketi, kontrast, `aria-pressed`)~~ **✅ çözüldü** | T-07 · 2026-08-21 |
| ~~O-7~~ | ~~Klavye kısayolları yalnızca Yayın Modu'nda~~ **✅ çözüldü** (`←`/`→`/`T`/`/`/`?`/`Esc` + Kısayol Yardımı) | T-07 · 2026-08-21 |
| O-5 | ErrorBoundary yok | T-09 |
| O-10 | `text-brand` koyu zeminde metin/simge olarak yetersiz kontrast (Ticker başlığı, Karanlık Dosyalar rozeti/düğmesi) — T-07 sırasında gerçek bir Lighthouse denetimiyle keşfedildi | Henüz atanmadı |
| O-12 | `allScience`, editör kaydını Vikipedi'nin aynı olayına karşı ayıklamıyor (`ScienceMilestone`'da `matchKeys` yok) — T-10 sırasında keşfedildi, bkz. `ANALIZ-RAPORU.md` §9 | Henüz atanmadı |
| ~~U-1~~ | ~~Yönlendirme / paylaşılabilir URL yok~~ **✅ çözüldü** (`createBrowserRouter` + `src/lib/slug.ts`, URL tek doğruluk kaynağı) | T-06 · 2026-08-21 |
| ~~U-2~~ | ~~İçerik 10/366 gün~~ **✅ çözüldü** (60/366 güne çıkarıldı, `curated.ts` 12 ay dosyasına bölündü, bkz. 3) | T-10 · 2026-08-22 |
| ~~U-3~~ | ~~Otomatik sınıflandırma "ilk eşleşen kazanır", ölçülmemiş, yanlış pozitif tuzakları var~~ **✅ çözüldü** (puanlama + öncelik sırası + karanlık eşiği + altın küme, bkz. 2.2/2.3) | T-11 · 2026-08-22 |
| ~~U-4~~ | ~~Favicon, PWA, SEO, paylaşım kartı eksik~~ **✅ çözüldü** (favicon/manifest/`og:*`/`twitter:*`/JSON-LD/sitemap/service worker, bkz. 9) | T-08 · 2026-08-21 |
| U-5 | Test/lint altyapısı yok | T-12 |

---

## 9. Site Kimliği, SEO ve PWA (T-08)

### 9.1 Marka görselleri — `scripts/generate-brand-assets.mjs`

Elle çalıştırılan bir üretim aracı (`npm run icons`), `build`'e **bağlı değil**
(ağ erişimi gerektiriyor — Google Fonts indiriyor). Tek kaynak:
`src/components/ui.tsx`'teki `IconLeafMark` yol verisi (aynı `<path>`'ler script
içinde `leafGlyph()` olarak tekrarlanır — `currentColor` yerine sabit marka
renkleri: `#d23b2e` gövde, `#f2ead9` iki delik).

```
leafGlyph()  →  favicon.svg (24×24 viewBox, saydam zemin)
             →  squareIconSvg() (24×24 + gece zemini) → sharp ile rasterize:
                  apple-touch-icon.png (180) · icon-192.png · icon-512.png
             →  maskableIconSvg() (36×36, glif (6,6)'ya ötelenmiş) → icon-maskable-512.png
             →  favicon.ico (16/32/48 aynı SVG'den, png-to-ico ile birleştirilir)
```

**Rasterizasyon kuralı:** her hedef boyut için `sharp(svg, { density: 72 *
(hedefBoyut/viewBoxBoyutu) })` ile **taze** bir density hesaplanır, sonra o
boyuta `resize()` edilir — küçük bir rasterden büyütmek yerine her seferinde
vektörden doğru çözünürlükte basılır (bulanıklık yok).

**Maskable güvenli alan:** orijinal glif 24×24 içinde (4,4)-(20,20) kutusunda;
köşe-merkez uzaklığı 11,31 birim. 36×36 tuvale ortalanınca (glif `translate(6,6)`)
güvenli yarıçapın (%40×36=14,4) **%78'inde** kalır — Android/iOS'un dairesel/
yuvarlak-kare maskeleri glifi kesmez.

**`og-image.png` (1200×630):** aynı script içinde, `google/fonts` deposundan
Fraunces (değişken font, tüm ağırlıklar) ve IBM Plex Mono SemiBold'un **alt
kümesiz tam** dosyaları indirilip (`fetch` + `node:os.tmpdir()` altında geçici
bir klasöre) base64 ile `@font-face` üzerinden SVG'ye gömülür, `sharp` ile
rasterize edilir, geçici klasör silinir. Google Fonts'un CSS2 API'sinin
`latin`/`latin-ext` alt küme ayrımı Türkçe karakterleri (İ, Ğ, Ş) ikiye
bölüyor; alt kümesiz dosyalar bu sorunu tamamen atlar. Arka plan `.glowfield`
(bkz. 5.2) ile aynı üç radyal ışıma + `feTurbulence` gren dokusunu SVG
filtreleriyle taklit eder; alt kenarda `.torn-edge` motifinin küçük bir
yorumu var.

### 9.2 `index.html` — statik kimlik etiketleri

`favicon.svg`/`favicon.ico`/`apple-touch-icon.png` `<link>`'leri, boş bir
`<link rel="canonical" href="/">` yer tutucusu (2.9'daki `useEffect` doldurur),
tam `og:*`/`twitter:card` seti (`og:image` **göreli** — alan adı belli olana
kadar, bkz. 9.4) ve `</body>` öncesi bir `WebSite` `application/ld+json` bloğu.

### 9.3 `public/manifest.webmanifest` + service worker (`vite.config.ts`)

Manifest elle yazılmış statik bir dosya (`vite-plugin-pwa`'ya `manifest: false`
verildi — kendi dosyamız kullanılıyor). Service worker `vite-plugin-pwa`
(`registerType: "autoUpdate"`, `generateSW` modu) ile üretiliyor:

| Rota | Strateji | Neden |
|---|---|---|
| `api.wikimedia.org/*` | `NetworkFirst` (5s zaman aşımı) | Tarihsel veri nadiren değişir ama güncel veri önceliklidir |
| `upload.wikimedia.org/*` | `CacheFirst` | Görseller değişmez |
| Statik varlıklar (`js/css/html/svg/png/ico/woff2`) | precache (`globPatterns`) | Uygulama kabuğu çevrimdışı açılsın diye |

`registerSW.js` (üretim derlemesinde `index.html`'e otomatik enjekte edilir)
sayfa yüklenince `navigator.serviceWorker.register('/sw.js')` çağırır — yalnızca
`npm run build` çıktısında var, `npm run dev`'de **yok** (`devOptions.enabled`
ayarlanmadı, bilinçli — geliştirmede SW önbelleği HMR'ı karıştırmasın diye).
Test etmek için `npm run build && npm run preview` gerekir.

> **Bilinen doğrulama sınırı:** Bu servis çalışanının canlı kaydı T-08 sırasında
> Browser pane'in sandbox'lanmış tarayıcısında doğrulanamadı (o ortam service
> worker kaydını genel olarak engelliyor — kod kusuru değil, ayrıntı → T-08
> Tamamlanma Kaydı). Sunucu tarafı (`sw.js`'in doğru içerik/`Content-Type` ile
> servis edildiği) ve Workbox çıktısının kendisi doğrulandı; yalnızca gerçek
> tarayıcıdaki canlı kayıt + çevrimdışı senaryo bir sonraki oturumda elle
> teyit edilmeli.

### 9.4 `public/robots.txt` + `scripts/sitemap.mjs`

`sitemap.mjs`, `src/lib/slug.ts`'teki `MONTH_SLUGS`'ı **elle kopyalayan** bir
`AY_SLUG` dizisi taşır (script düz Node ile çalışır, TS derlemesine bağlı
değil) — ikisinin birebir eşit olduğu bu talimatta Node'da elle doğrulandı,
**T-12'de kalıcı bir teste bağlanmalı** (talimatın kendi notu). `npm run build`
artık önce `npm run sitemap` çalıştırır, sonra `vite build`.

**Yer tutucu alan adı:** `sitemap.mjs`'teki `SITE_URL` ortam değişkeni
(varsayılan `https://tarihyapragi.example`) ve `robots.txt`'teki `Sitemap:`
satırı **aynı** yer tutucuyu paylaşır — sitemaps.org protokolü `Sitemap:`
satırının mutlak URL olmasını şart koşuyor (Lighthouse'un `robots-txt`
denetimi göreli bir satırı geçersiz sayıyor, bu T-08 sırasında canlı olarak
yakalandı). `og:image`/`twitter:image`/`canonical` ise **göreli** bırakıldı
(tarayıcı bunları sayfanın kendi origin'iyle çözüyor). T-14'te gerçek alan adı
belli olunca yalnızca bu **tek** yer tutucuyu değiştirmek yeterli.

### 9.5 Kapsam dışı bırakılanlar (bilinçli, PLAN-02'ye devredildi)

Ön-işleme/SSR ve gün bazlı **statik** `og-image.png` üretimi bu planın
kapsamında değil — mevcut mimari (backend'siz statik SPA, bkz. `BAGLAM.md` §2)
bilinçli olarak korunuyor. Sonucu: paylaşılan bağlantılar WhatsApp/Twitter gibi
JS çalıştırmayan önizleyicilerde her zaman **aynı genel** kart+açıklamayı
gösterir, seçili günün başlığını değil (bkz. 2.9'daki sınır notu).

---

## 10. Sınıflandırma Ölçümü — `scripts/siniflandirma-raporu.mjs` (T-11)

Elle çalıştırılan bir ölçüm aracı (`npm run siniflandirma`), `build`'e
**bağlı değil**. `src/lib/__fixtures__/siniflandirma-ornekleri.ts` içindeki
altın kümeye (66 örnek, gerçek Vikipedi verisinden ve talimatın kendi
örneklerinden derlenmiş, ≥15'i bilinçli yanlış-pozitif tuzağı) karşı
`classifyItem`/`detectDarkItem`'ı çalıştırır; kategori doğruluğu (hedef ≥%85),
karanlık kesinlik/duyarlılık (hedef: yanlış pozitif 0, kesinlik ≥%90) ve
performans (100 öğe <5 ms) raporlar. Hedeflerden biri tutmazsa `process.exitCode`
1 döner (CI'a bağlanabilir — henüz bağlanmadı, bkz. T-12).

**Neden esbuild var (`package.json` → `devDependencies`):** `classification.ts`
ve fixtures dosyası TypeScript. Script'in bunları `tsx`/`ts-node` gibi ek bir
çalışma zamanı bağımlılığı kurmadan çalıştırabilmesi için, Vite'ın derlemede
zaten kullandığı `esbuild`'i (öncesinde yalnızca `vite` üzerinden **dolaylı**
bir bağımlılıktı, artık `package.json`'da açık) kendisi çağırır:
`esbuild.transformSync` ile TS'i JS'e çevirir, geçici bir `.mjs` dosyasına
yazar, `import()` ile yükler, sonra siler. Bu iki dosyanın **hiçbir** çalışma
zamanı `import`'u olmadığı için (yalnızca `import type`, derlemede tamamen
silinir) bu basit tek-dosya çeviri yeterli — `wiki.ts`'in geri kalanı gibi
`react`/ağ bağımlılığı olan bir dosya için bu yöntem yetmez (bkz. §2.2).

**Türkçe sınır bulgusu:** Bu talimat sırasında, JS'in `\b`/`\w`'ının Türkçe
harfleri (ç/ğ/ı/ö/ş/ü) kelime karakteri saymadığı — ve bu yüzden `\bçığ\b`
gibi kalıpların normal cümlelerde **hiç eşleşmediği** — gerçek veriyle
doğrulanan kritik bir bulgu oldu. Ayrıntı ve düzeltme yöntemi → §2.2 ve
`classification.ts`'in başındaki yorum bloğu.

**Bilinen sınır (bilinçli kabul edildi):** Anahtar kelime tabanlı tarama,
bir felaket kelimesinin cümlenin **konusu** mu yoksa yalnızca bir **zaman
belirteci/isim** mi olduğunu ayıramaz — ör. "X, Çernobil faciasının yıl
dönümünde gerçekleşti" gibi bir cümle, felaketin kendisiyle ilgili olmasa
bile `facia` kalıbına takılabilir. "X pandemi/deprem/tsunami **nedeniyle**
ertelendi" biçimindeki en yaygın örnek için can kaybı/yaralanma sözcüğü
yakınlığı şartı eklenerek düzeltildi (bkz. `classification.ts` → `KARANLIK`
"Felaket" majör kural); daha nadir örnekler (ör. "X faciası" bir olayı
tarihlemek için kullanılıyor) çözülmeden bırakıldı — gömme (embedding)
tabanlı bir yaklaşım gerektirir, T-11'in kendi *Kapsam Dışı* tablosunda
bilinçli olarak dışarıda bırakılmış.

---

## 11. Derleme Optimizasyonu (T-13)

Performans rakamları için bkz. 7. Bu bölüm yalnızca **derleme yapılandırması**
değişikliklerini belgeler.

### 11.1 Tailwind kaynak taraması — `src/index.css`

Tailwind v4'ün otomatik kaynak keşfi, `.gitignore`'da olmayan **her** dosyayı
tarar. Proje belgeleri (`Dokumanlar/`, `Talimatlar/`) markdown kod bloklarında
gerçek `className` örnekleri taşıdığı için bu dosyalar da taranıyor, oradaki
metinler yardımcı sınıf adı sanılıp üretim CSS'ine sızabiliyordu (T-01'de ilk
kez ölçülmüştü, düzeltmesi bu talimata bırakılmıştı). Çözüm, `@import
"tailwindcss";` satırının hemen altına iki satır:

```css
@source not "../Dokumanlar";
@source not "../Talimatlar";
```

**Doğrulama yöntemi:** Bu iki satır geçici olarak yorum satırına alınıp
derleme tekrarlandı (55,19 kB ham CSS), sonra geri açılıp tekrar derlendi
(54,65 kB ham CSS) — fark (-0,54 kB ham / -0,09 kB gzip) doğrulandı. T-01'de
ölçülen fark (-1,72 kB ham) daha büyüktü çünkü o tarihte belge klasörleri
farklı içerik taşıyordu; kesin sayı yerine **yönün doğruluğu ve mekanizmanın
çalıştığı** önemli — belge klasörleri büyüdükçe bu koruma olmadan CSS de
büyürdü.

### 11.2 Paket analizi — `rollup-plugin-visualizer` + `manualChunks`

```bash
npm run analyze   # = npm run sitemap && cross-env ANALYZE=1 vite build
```

`vite.config.ts`'teki `visualizer({ open: true, gzipSize: true, filename:
"dist/analiz.html" })` yalnızca `process.env.ANALYZE` set edilmişse pakete
eklenir (`plugins` dizisi `.filter(Boolean)` ile süzülür); `dist/analiz.html`
bir treemap üretir. **`cross-env` neden gerekti:** talimatın önerdiği
`"ANALYZE=1 vite build"` yalnızca POSIX kabuğunda çalışır; proje Windows'u da
resmî olarak destekliyor (T-02'nin `başlat.bat`/`baslat.sh` çifti), bu yüzden
`cross-env` devDependency olarak eklendi.

`build.rollupOptions.output.manualChunks: { react: ["react", "react-dom",
"react-router-dom"] }` React'i uygulama kodundan ayrı bir parçaya alır —
uygulama kodu (`index-*.js`) her deploy'da değişse bile `react-*.js` aynı
kalırsa tarayıcı onu yeniden indirmez (uzun vadeli önbellek kazancı; **ilk
ziyarette** toplam bayt sayısını azaltmaz, bkz. 7).

### 11.3 Windows'ta Lighthouse çalıştırma notu

`npx lighthouse` bu makinede Chrome'u (`C:\Program Files\Google\Chrome\
Application\chrome.exe`) buluyor ve raporu doğru üretiyor, ancak her
çalıştırmanın **sonunda** (rapor yazıldıktan sonra) geçici Chrome profilini
silerken zararsız bir `EPERM`/`Runtime error` fırlatıyor
(`chrome-launcher`'ın Windows'a özgü bilinen bir dosya-kilidi sorunu). Bu
hatayı görürseniz paniklemeyin — `--output-path` ile verilen JSON dosyası
büyük olasılıkla zaten diskte. Ayrıca **dev sunucusuna** (`npm run dev`)
karşı Lighthouse çalıştırmayın — Vite dev modu her modülü ayrı, bundlesiz bir
dosya olarak servis eder, bu da Performans puanını gerçek dışı biçimde çok
düşük gösterir (bu talimatta 42 vs. gerçek 92). Her zaman `npm run build &&
npm run preview` çıktısına karşı ölçün.
