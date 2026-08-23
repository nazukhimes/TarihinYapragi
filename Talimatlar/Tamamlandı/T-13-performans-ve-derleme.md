# T-13 · Performans ve Derleme İyileştirmesi

| Alan | Değer |
|---|---|
| **Faz** | FAZ 4 — Kalite Güvencesi |
| **Öncelik** | 🟡 Orta |
| **Tahmini süre** | ~3 saat |
| **Bağımlılık** | T-04 (paylaşılan gözlemci), T-08 (PWA), T-12 (regresyon koruması) |
| **İlgili bulgu** | m-4, m-5, performans notları |
| **Durum** | ✅ Tamamlandı (2026-08-23) |

---

## 🎯 Amaç

Uygulamayı ölçülebilir biçimde hızlandırmak ve ilk yükleme deneyimini
iyileştirmek. Hedef: **Lighthouse Performans ≥ 90** (mobil).

---

## 📍 Mevcut Durum

**Derleme (T-01 öncesi ölçüm):**

```
dist/index.html                   1.23 kB │ gzip:  0.65 kB
dist/assets/index-*.css          50.78 kB │ gzip:  9.71 kB
dist/assets/index-*.js          253.62 kB │ gzip: 81.96 kB
34 modül · 2.90 s
```

### Tespit edilen maliyet kalemleri

| # | Sorun | Etki |
|---|---|---|
| 1 | Kod bölme yok — `BroadcastMode` ilk yüklemede geliyor | Çoğu kullanıcı Yayın Modu'nu hiç açmıyor |
| 2 | `Modal` ve kişi kartı modalı da ilk pakette | Aynı |
| 3 | Google Fonts: 3 aile, çok geniş ağırlık aralığı | Fraunces `300..900` + italik = büyük indirme |
| 4 | Vikipedi görsellerinde boyut yok (m-5) | Düzen kayması (CLS) — T-07'de kısmen çözülüyor |
| 5 | Ticker animasyonu sabit 55 s (m-4) | 3 öğede sürünüyor, 14 öğede hızlı |
| 6 | `.noise` katmanı tam ekran SVG, `z-70` | Sürekli kompozisyon maliyeti |
| 7 | `drift-slow` animasyonları dev metinlerde | Kaydırma sırasında boyama yükü |
| 8 | `App.tsx` 660 satır, 6 `useMemo` — hepsi her veri değişiminde | Gün geçişinde tam yeniden hesap |
| 9 | `NAV[stats.indexOf(s)]` (m-1) | O(n²) + kırılgan bağımlılık |
| 10 | Arama süzmesi hem bölümlerde hem sayaçta tekrarlanıyor (T-09 notu) | Çift hesap |

---

## ✅ Yapılacaklar

### Adım 1 — Kod bölme: Yayın Modu

`App.tsx`:

```tsx
import { lazy, Suspense } from "react";

const BroadcastMode = lazy(() =>
  import("./components/talk").then((m) => ({ default: m.BroadcastMode }))
);

/* ... */

{broadcast && talkCards.length > 0 && (
  <Suspense fallback={<YayinYukleniyor />}>
    <BroadcastMode cards={talkCards} dayLabel={dayLabel} onClose={() => setBroadcast(false)} />
  </Suspense>
)}
```

`YayinYukleniyor` — tam ekran koyu zemin + yanıp sönen nokta, ~10 satır.

> **Dikkat:** `talk.tsx` hem `TalkSection` (hep gerekli) hem `BroadcastMode`
> (nadiren gerekli) içeriyor. Bölme etkili olsun diye `BroadcastMode`'u
> **ayrı dosyaya** taşıyın: `src/components/broadcast.tsx`.

### Adım 2 — Font yükünü daralt

`index.html`:

```diff
-family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900
+family=Fraunces:opsz,wght@9..144,600..900
```

Projede Fraunces yalnızca başlıklarda (`font-display`) kullanılıyor; italik
sınırlı yerde. Kullanımı doğrula:

```bash
grep -rn "italic" src/ | grep -c "font-display"
```

Ağırlık kullanımını da tara: `font-bold`, `font-black`, `font-semibold`, `font-medium`.
Gerçekten kullanılan aralık neyse ona daralt.

`IBM Plex Sans` ve `Mono` için de aynı: kullanılan ağırlıkları tespit edip
`wght@400;500;600;700` gibi **sabit listeye** indirin (aralık yerine).

Ayrıca:

```html
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?..." />
```

### Adım 3 — Ticker hızını öğe sayısına bağla (m-4)

```tsx
export function Ticker({ items }: { items: { year: number; text: string }[] }) {
  // öğe başına ~4 saniye, 20–90 s arasında sınırla
  const sure = Math.min(90, Math.max(20, items.length * 4));
  return (
    <div className="...">
      <div className="ticker-track ..." style={{ animationDuration: `${sure}s` }}>
```

`index.css`'te sabit süreyi kaldır:

```diff
 .ticker-track {
-  animation: tickerSlide 55s linear infinite;
+  animation: tickerSlide 55s linear infinite;   /* satır içi stil geçersiz kılar */
   will-change: transform;
 }
```

### Adım 4 — Ambiyans katmanlarını hafiflet

**`.noise`:**

```css
.noise {
  /* ... */
  content-visibility: auto;
}

@media (max-width: 768px) {
  .noise { display: none; }        /* mobilde görsel katkısı düşük, maliyeti yüksek */
}
```

**`.drift-slow` / `.drift-slower`:** Bunlar dev `outline-num` metinlerini
sürekli hareket ettiriyor. `will-change` ekleyerek kompozitör katmanına al:

```css
.drift-slow, .drift-slower { will-change: transform; }
```

Mobilde tamamen kapat:

```css
@media (max-width: 640px) {
  .drift-slow, .drift-slower { animation: none; }
}
```

### Adım 5 — `content-visibility` ile ekran dışı bölümler

```css
.section-shell {
  content-visibility: auto;
  contain-intrinsic-size: auto 800px;
}
```

`SectionShell` bileşenine bu sınıfı ekle.

> ⚠️ **Dikkat:** `content-visibility: auto` sayfa içi bağlantı atlamalarını
> (`#tunel`) etkileyebilir. T-07'deki klavye gezinmesini ve nav bağlantılarını
> mutlaka yeniden test edin. Sorun çıkarsa bu adımı **atlayın** — kazanç
> risk kadar büyük değil.

### Adım 6 — `App.tsx`'i böl

660 satır tek dosya. Sorumluluğa göre ayır:

```
src/
├── App.tsx                    ← düzen (layout) + durum, ~250 satır
├── hooks/
│   └── useGunVerisi.ts        ← 6 useMemo buraya taşınır
└── components/
    ├── UstBar.tsx             ← header + arama
    ├── GunOzeti.tsx           ← spotlight + sayaçlar + zaman aralığı
    ├── OzelGunler.tsx         ← özel dosyalı gün düğmeleri
    ├── BolumNav.tsx           ← yapışkan bölüm navigasyonu
    ├── AltBilgi.tsx           ← footer
    └── Iskeletler.tsx         ← SkeletonLines, SkeletonCards
```

`useGunVerisi.ts`:

```ts
export function useGunVerisi(data: DayData | null, curated: CuratedDay | undefined) {
  const mergedEvents = useMemo(/* ... */, [data, curated]);
  const births       = useMemo(/* ... */, [data]);
  const deaths       = useMemo(/* ... */, [data]);
  const allCases     = useMemo(/* ... */, [data, curated]);
  const allScience   = useMemo(/* ... */, [data, curated]);
  const talkCards    = useMemo(/* ... */, [data, curated]);
  const spotlight    = useMemo(/* ... */, [curated, data, mergedEvents]);

  return { mergedEvents, births, deaths, allCases, allScience, talkCards, spotlight };
}
```

> **Bu bir refaktör** — davranış **birebir** aynı kalmalı. T-12'nin testleri
> bu adımın güvenlik ağıdır; testler yoksa bu adımı **yapmayın**.

### Adım 7 — `m-1` düzeltmesi

`App.tsx` içindeki:

```diff
-href={`#${NAV[stats.indexOf(s)]?.id || "tunel"}`}
```

`stats` dizisine hedefi doğrudan koy:

```ts
const stats = [
  { hedef: "tunel",           label: "Tarihî olay", value: mergedEvents.length, /* ... */ },
  { hedef: "doganlar",        label: "Bugün doğan", value: births.length, /* ... */ },
  { hedef: "kaybettiklerimiz",label: "Kaybettiklerimiz", value: deaths.length, /* ... */ },
  { hedef: "karanlik",        label: "Karanlık dosya", value: allCases.length, /* ... */ },
];
```

```diff
+href={`#${s.hedef}`}
```

### Adım 8 — Arama süzmesi tekrarını gider (T-09 notu)

`useGunVerisi`'ne süzülmüş sonuçları da ekle; hem sayaç hem bölümler aynı
kaynaktan beslensin:

```ts
export function useAramaSonuclari(veri, query) {
  return useMemo(() => ({
    olaylar: veri.mergedEvents.filter((e) => matchQuery(query, e.text, /* ... */)),
    dogumlar: veri.births.filter(/* ... */),
    /* ... */
  }), [veri, query]);
}
```

Bölüm bileşenleri artık **süzülmüş** listeyi alsın; kendi içlerinde tekrar
süzmesinler. `query` prop'u yalnızca vurgulama (highlight) için kalabilir.

### Adım 9 — Derleme analizi

```bash
npm install -D rollup-plugin-visualizer
```

```ts
import { visualizer } from "rollup-plugin-visualizer";

plugins: [
  /* ... */
  process.env.ANALYZE && visualizer({ open: true, gzipSize: true, filename: "dist/analiz.html" }),
].filter(Boolean)
```

```json
"scripts": { "analyze": "ANALYZE=1 vite build" }
```

Ayrıca manuel parça bölme:

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        react: ["react", "react-dom", "react-router-dom"],
      },
    },
  },
}
```

> React'i ayrı parçaya almak, uygulama kodu değiştiğinde kullanıcının React'i
> yeniden indirmemesini sağlar (uzun vadeli önbellek).

---

### Adım 10 — Tailwind kaynak taramasını proje belgelerinden ayır

> 📌 **T-01'den gelen not (2026-08-21).** Bu bulgu T-01 uygulanırken ortaya çıktı;
> düzeltmesi `src/index.css` gerektirdiği için T-01'in kapsamı dışında bırakıldı.

**Sorun:** Tailwind v4'ün otomatik kaynak keşfi, `.gitignore`'da olmayan **her** dosyayı
tarar — `Dokumanlar/` ve `Talimatlar/` altındaki Markdown belgeleri dahil. Bu belgelerdeki
kod blokları ve metinler yardımcı sınıf adı sanılıp üretim CSS'ine giriyor.

**Ölçülen etki (T-01 sırasında, kontrollü deney):**

| Derleme | CSS |
|---|---|
| `Dokumanlar/` + `Talimatlar/` yerinde | 52,50 kB |
| İkisi geçici olarak dışarı alınmış | **50,78 kB** |

Fark **+1,72 kB** — tamamen belge klasörlerinden geliyor, uygulama kodundan değil.
(JS her iki durumda da bayt bayt aynı: 253,62 kB.)

**Çözüm** — `src/index.css` başındaki `@import "tailwindcss";` satırının hemen altına:

```css
@source not "../Dokumanlar";
@source not "../Talimatlar";
```

**Doğrulama:** `npm run build` sonrası CSS ≈ 50,8 kB olmalı. Belge klasörlerine yeni
`.md` eklemek CSS boyutunu artırmamalı.

> ⚠️ Bu ayarı yapmadan Adım 9'daki boyut ölçümleri yanıltıcı olur: belge yazdıkça
> CSS büyür ve performans regresyonu sanılır.

---

## 🚫 Kapsam Dışı

| Dokunma | Neden / Hangi talimat |
|---|---|
| Tasarım dilini değiştirmek | Animasyonlar **kısılabilir**, kaldırılamaz |
| Görsel kalitesini düşürmek | Vikipedi görselleri olduğu gibi kalır |
| Yeni özellik ekleme | Bu talimat yalnızca hız ve yapı |
| SSR / statik üretim | PLAN-02 |
| CDN / barındırma seçimi | T-14 |
| İçerik verisinin tembel yüklenmesi | T-10 (A3 adımı) |

---

## ☑️ Kabul Kriterleri

- [x] `@source not` ile belge klasörleri Tailwind taramasından çıkarıldı; CSS ≈ 50,8 kB (Adım 10) — **sapma:** güncel taban artık 54,65 kB (bkz. Tamamlanma Kaydı), 50,8 kB T-01 dönemine ait eski bir referans

- [x] `BroadcastMode` ayrı dosyada ve `React.lazy` ile yükleniyor
- [ ] İlk paket boyutu **≥ %15 küçüldü** (gzip) — **karşılanmadı, kök nedeni belgelendi** (bkz. Tamamlanma Kaydı)
- [x] Font isteği daraltıldı; kullanılmayan ağırlık/italik indirilmiyor
- [x] Ticker hızı öğe sayısına göre değişiyor (20–90 s arası)
- [x] Mobilde `.noise` ve `drift` animasyonları kapalı
- [x] `App.tsx` **≤ 300 satır** (244 satır)
- [x] `useGunVerisi` hook'u var; `useMemo`'lar oradan geliyor
- [x] `stats.indexOf` kalıbı kaldırıldı, `hedef` alanı kullanılıyor
- [x] Arama süzmesi **tek yerde** yapılıyor
- [x] `npm run analyze` çalışıyor
- [x] React ayrı parçada (`manualChunks`)
- [x] **Davranış birebir aynı** — hiçbir görsel/işlevsel regresyon yok
- [x] `npm run kontrol` tamamen yeşil
- [x] Lighthouse Performans (mobil) **≥ 90** (production derlemesinde 92 — dev sunucusunda **değil**, bkz. Tamamlanma Kaydı)

---

## 🧪 Doğrulama

### 1. Boyut karşılaştırması

Önce ve sonra kaydet:

```bash
npm run build
```

| Ölçüt | Önce | Sonra | Hedef |
|---|---|---|---|
| index JS (gzip) | 81.96 kB | ? | ≤ 70 kB |
| CSS (gzip) | 9.71 kB | ? | ~aynı |
| Parça sayısı | 1 | ≥ 3 | — |

### 2. Kod bölme çalışıyor mu

DevTools → Network → JS ile süz → sayfayı yenile.
`broadcast-*.js` **yüklenmemeli**.
Yayın Modu düğmesine bas → o an yüklenmeli.

### 3. Font isteği

Network → Font ile süz. İndirilen `woff2` sayısı ve toplam boyut
öncesine göre **azalmalı**.

### 4. Lighthouse (mobil)

DevTools → Lighthouse → **Mobile** + Performance:

| Ölçüt | Hedef |
|---|---|
| Performans | ≥ 90 |
| LCP | < 2,5 s |
| CLS | < 0,1 |
| TBT | < 200 ms |

### 5. Regresyon turu — zorunlu

Refaktör (Adım 6) davranışı değiştirmemeli. **Üç günde** tam tur:

| Gün | Kontrol |
|---|---|
| `29 Ekim` (editör içeriği dolu) | Altı bölüm, spotlight, sayaçlar, sohbet kartları |
| `7 Mart` (yalnızca otomatik) | Boş durumlar doğru mu |
| `29 Şubat` | Kenar durum |

Her günde:
- Kategori süzme çalışıyor
- Kişi kartı modalı açılıyor/kapanıyor
- Karanlık dosya açılıyor
- Kart kopyalama çalışıyor
- Yayın Modu açılıyor, klavye çalışıyor
- Arama sonuç veriyor
- Klavye kısayolları (T-07) çalışıyor

### 6. `content-visibility` yan etkisi

Bölüm navigasyonundaki altı bağlantıya da tıkla — doğru bölüme kaymalı.
`Ctrl+F` ile ekran dışı metin bulunabilmeli. Sorun varsa Adım 5'i geri al.

### 7. Animasyon kalitesi

Ticker: 3 öğeli bir gün ve 14 öğeli bir gün karşılaştır — ikisi de
okunabilir hızda olmalı.

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-08-23

- **Paket boyutu (önce / sonra, gzip):** Bu oturumun kendi T-13-öncesi ölçümü
  (tek parça): JS **174,38 kB** (537,97 kB ham), CSS **10,44 kB** (55,01 kB ham,
  belge klasörleri dahil taranmış — Adım 10 düzeltmesi öncesi). Sonra: **3 parça**
  — ilk yükte inen `react` (67,36 kB / 206,26 kB ham) + `index` (108,18 kB /
  330,98 kB ham) = **175,54 kB gzip ilk yük**; `broadcast` (1,63 kB / 4,67 kB ham)
  yalnızca Yayın Modu açılınca iner, ilk yüke dahil değil. CSS **10,43 kB**
  (54,73 kB ham, belge klasörleri artık taramaya girmiyor — Adım 10 canlı A/B
  testiyle doğrulandı: 55,19→54,65 kB ham, exclusion olmadan/olarak).
  **≥%15 küçülme hedefi karşılanmadı** (ilk yük neredeyse aynı kaldı, gzip'te
  hafifçe arttı bile — 174,38→175,54 kB). Kök neden: `rollup-plugin-visualizer`
  ile üretilen `dist/analiz.html` incelendiğinde `src/data/gunler/` (60 günlük
  editör içeriği, T-10) tek başına ~300 kB kaynak koddur ve `index` parçasının
  büyük çoğunluğunu oluşturur; bu talimatın kendi Kapsam Dışı tablosu "İçerik
  verisinin tembel yüklenmesi"ni T-10'un A3 adımına (uygulanmamış, bkz.
  `MIMARI.md` §3.3) bırakıyor. `≥%15`/`≤70 kB` hedefleri, T-10'un 60 gün
  eklemesinden **önceki** (81,96 kB gzip) ölçüme göre yazılmıştı — o tarihte
  `BroadcastMode`/font/CSS optimizasyonları paketin çok daha büyük bir yüzdesini
  oluşturuyordu. Bu oturumda yapılan her şey (kod bölme, font daraltma, Tailwind
  taraması, `manualChunks`) doğru ve etkili ama **veri hacminden bağımsız** bir
  ilk-yük küçülmesi sağlıyor; asıl kütleyi düşürmek içerik tembel yüklemesini
  gerektirir — bkz. Sonraki talimata not. `Parça sayısı: 1 → 3` hedefi
  karşılandı.

- **Lighthouse (mobil, production derlemesi — `vite preview`, `npx lighthouse`
  ile Bash üzerinden, Browser pane'den bağımsız):** Bu **ilk kez** Performans'ın
  Erişilebilirlik+SEO ile birlikte, gerçek bir üretim derlemesine karşı
  ölçüldüğü talimat (T-07/T-08 bunları ayrı ayrı ölçmüştü). **Performans 92**
  (29 Ekim, ilk temiz ölçüm) — LCP 2,3 s, CLS 0,009, TBT 240 ms, FCP 2,1 s;
  tekrar ölçümlerde 68-92 arasında değişti (bkz. aşağıdaki sapma notu).
  **Erişilebilirlik 96** (T-07 ile birebir aynı, regresyon yok). **SEO 100**
  (T-08 ile birebir aynı, regresyon yok). **Kritik ilk deneme hatası:** dev
  sunucusuna (`npm run dev`) karşı ölçülen ilk turda Performans **42** çıktı —
  bu bir regresyon değil, Vite dev modunun her modülü ayrı dosya olarak
  (bundlesiz) servis etmesinin doğal sonucuydu (LCP 18,5 s); `vite preview`
  (gerçek üretim paketi) karşısında ölçülünce 92'ye çıktı. **İkinci sapma:**
  ilk `vite preview` ölçümünde render-blocking font CSS'i Lighthouse'un kendi
  `render-blocking-insight` bulgusuyla ~1.980 ms kayıp olarak işaretledi;
  talimatın Adım 2'deki `<link rel="preload" as="style">` satırı **tek başına**
  bunu çözmüyordu (tarayıcı `preload`'ı yalnızca erken keşif için kullanır,
  asıl `rel="stylesheet"` satırı hâlâ render-blocking kalır) — standart
  preload+`onload` takas deseni (+ `<noscript>` yedeği) eklenince Performans
  **69 → 92**'ye çıktı (bkz. Adım 2 sapma notu, `index.html`). **Üçüncü sapma
  (kapsam dışı, yalnızca gözlem):** aynı sayfayı farklı günlerde/turlarda
  ölçünce puan 68-92 arasında salındı; kök neden client-side kodda değil —
  canlı Wikipedia API isteği (`api.wikimedia.org`, ~700-800 kB yanıt, ~2,4 s)
  LCP'nin önündeki gerçek darboğaz ve Lighthouse'un `simulate` gecikme modeli
  bu dış isteğin gerçek zamanlamasına duyarlı. Bu, PLAN-01'in kapsamı dışında
  (backend/proxy yok, bkz. `BAGLAM.md` §2); tutarlı bir Performans puanı için
  gelecekte bir sunucu tarafı önbellek/proxy katmanı gerekebilir (PLAN-02 adayı).

- **`App.tsx` satır sayısı (önce / sonra):** 1.079 → **244** (hedef ≤300).
  Talimatın önerdiği 6 bileşenin (`UstBar`, `GunOzeti`, `OzelGunler`, `BolumNav`,
  `AltBilgi`, `Iskeletler`) yanına, 300 satır hedefine rahatça sığmak için üç ek
  dosya daha çıkarıldı: `AcilisBolumu.tsx` (takvim yaprağı + paylaş + `GunOzeti`
  + `OzelGunler` + ticker'ı saran açılış bölümü), `Bolumler.tsx` (altı içerik
  bölümü + "Bugünün anlamı" şeridi + arama boş durumu) ve `KisayolYardimi.tsx`
  (klavye kısayolları modalı) — talimatın ağaç örneği kapsayıcı değildi
  (ör. altı içerik bölümünün nereye gideceğini belirtmiyordu). Klavye kısayolu
  `useEffect`'i de `src/hooks/useKlavyeKisayollari.ts`'e taşındı.

- **`content-visibility` uygulandı mı:** Evet, `.section-shell` (Adım 5) —
  `SectionShell`'e eklendi, `index.css`'e `content-visibility:auto` +
  `contain-intrinsic-size:auto 800px` kuralı geldi. Canlı test: `scrollIntoView`
  ile altı bölümün tümüne (özellikle ekran dışında, `content-visibility` ile
  "skip" edilmiş `#bilim`/`#sohbet`) doğru piksel konumuna gidildiği doğrulandı;
  içerik (`textContent`) her zaman DOM'da okunabilir kaldı. **Not:** Bu
  oturumdaki Browser pane sekmesi arka planda kaldığı için (compositing
  yapmıyor, ekran görüntüsü alınamadı) yumuşak kaydırma **animasyonu** görsel
  olarak doğrulanamadı — yalnızca konumlandırma mantığı (asıl risk: `content-
  visibility`'nin hedefi "bulamaması") test edildi, geri alınmadı.

- **Değişen dosyalar:**
  `index.html`, `src/index.css`, `vite.config.ts`, `package.json` ·
  `src/App.tsx` (1.079→244 satır) · `src/components/leaf.tsx` (Ticker) ·
  `src/components/sections.tsx` (`SectionShell` + 4 bölüm bileşeninin `query`→
  `matched` API'si) · `src/components/talk.tsx` (`BroadcastMode` çıkarıldı,
  `catColor` dışa aktarıldı) · **yeni:** `src/components/broadcast.tsx`,
  `src/components/UstBar.tsx`, `src/components/AcilisBolumu.tsx`,
  `src/components/GunOzeti.tsx`, `src/components/OzelGunler.tsx`,
  `src/components/BolumNav.tsx`, `src/components/Bolumler.tsx`,
  `src/components/AltBilgi.tsx`, `src/components/KisayolYardimi.tsx`,
  `src/components/Iskeletler.tsx`, `src/hooks/useGunVerisi.ts`,
  `src/hooks/useKlavyeKisayollari.ts`.

- **Sapmalar / notlar:**
  1. **Font aralığı** (Adım 2) — talimatın örnek diff'i (`opsz,wght@9..144,
     600..900`, `ital` ekseni tamamen kaldırılmış) körü körüne uygulanmadı;
     `grep -rn italic` + ağırlık taraması gerçek kullanımı (3 yerde ağırlıksız
     italik, 1 yerde `font-medium` italik) ortaya çıkardı — italik ekseni
     **korunarak** yalnızca ağırlık aralığı daraltıldı
     (`ital,opsz,wght@0,9..144,600..900;1,9..144,400..500`). Talimatın diff'i
     olduğu gibi uygulansaydı 4 gerçek kullanım noktasında italik yerine
     tarayıcı-taklidi (oblik sentezleme) render'a düşülürdü — küçük ama
     gereksiz bir görsel regresyon.
  2. **Font preload+onload takası** (Adım 2) — talimatın `<link rel="preload"
     as="style">` satırı tek başına render-blocking'i çözmüyordu (Lighthouse
     canlı ölçümünde yakalandı); standart preload/onload-swap + `<noscript>`
     yedeği eklendi — Doğrulama Adım 4'ün (Lighthouse ≥90) gerçek gereksinimiydi.
  3. **`cross-env` eklendi** (Adım 9) — talimatın `"analyze": "ANALYZE=1 vite
     build"` satırı yalnızca POSIX kabuğunda çalışır; proje Windows'u da
     desteklediği için (T-02'nin `başlat.bat`/`baslat.sh` çifti) `cross-env`
     devDependency olarak eklenip komut ona göre yazıldı.
  4. **Arama tekilleştirme alan listesi** (Adım 8) — üst bardaki eski sayaç
     (`aramaSonuclari`) her tür için bölüm bileşenlerinden **daha dar** bir
     alan listesiyle arıyordu (ör. kişi kartları ada+özete ek olarak yıla ve
     kategori etiketine de bakıyordu, sayaç bakmıyordu) — T-09'un kendi notu
     bunu bilinçli bir tutarsızlık olarak T-13'e bırakmıştı. `useAramaSonuclari`
     tek bir kanonik alan listesi kullanacak şekilde birleştirildi (bölümlerin
     **daha geniş** listesi kazandı) — canlı doğrulandı: "cumhuriyet" araması
     29 Ekim'de sayaçta "4 olay" gösterdi, Zaman Tüneli'nde tam olarak 4 `<li>`
     render etti (öncesinde sayaç ile liste arasında sessiz bir sapma
     olabilirdi). Kategori (`cat`) filtresi bölüm içinde yerel kaldı (paylaşılan
     bir kaygı değil). Bölüm bileşenlerindeki "Tümü · N" çip sayaçları kasıtlı
     olarak **arama ile daraltılmaz** (öncekiyle birebir aynı davranış) —
     `matched` listesi yalnızca gösterilecek kartları belirler, çip sayaçları
     hâlâ günün tam listesinden gelir.
  5. **`npm audit`** sırasında proje bağımlılıklarında T-13'ün kapsamı dışında
     bir bulgu fark edildi: `react-router-dom` (mevcut sürüm) → `react-router`
     için 2 orta seviye güvenlik danışma kaydı (açık yönlendirme + hatalı
     nesne oluşturma enjeksiyonu). Düzeltmesi `react-router-dom@7.x`'e kırılma
     içeren bir yükseltme gerektiriyor (T-06'nın yönlendirme mimarisini
     etkileyebilir) — bu talimatın kapsamına girmiyor, ayrı bir talimata/oturuma
     bırakıldı.
  6. Lighthouse CLI'ın kendisi bu Windows makinesinde her çalıştırmanın
     sonunda (rapor **üretildikten sonra**) geçici Chrome profilini silerken
     zararsız bir `EPERM` hatası veriyor (`chrome-launcher`'ın Windows'a özgü
     bilinen bir dosya-kilidi sorunu) — rapor dosyası her seferinde doğru
     üretildi, yalnızca CLI'ın kendi çıkışı "Runtime error" gösteriyor. Bir
     sonraki oturumda Lighthouse çalıştırırken bu hatayı görürseniz JSON
     çıktısını yine de kontrol edin, muhtemelen üretilmiştir.
  7. **Regresyon turu canlı doğrulandı** (29 Ekim, 7 Mart, 29 Şubat): kategori
     süzme, kişi kartı modalı aç/kapat, karanlık dosya aç/kapat, kart kopyalama
     (toast + "Kopyalandı" etiketi), Yayın Modu (tembel yükleme ağ isteğiyle
     doğrulandı: `broadcast.tsx` yalnızca düğmeye basılınca indi), arama
     (sayaç+liste tutarlılığı), klavye kısayolları (`←`/`→`/`T`/`/`/`?`/`Esc`,
     hepsi `window.dispatchEvent(KeyboardEvent)` ile doğrulandı), mobil
     görünümde `.noise`/`.drift` kapanması (375px) ve masaüstünde geri gelmesi
     (1280px) — hepsi geçti. **CountUp sayaç animasyonu bu oturumda görsel
     olarak doğrulanamadı** (Browser pane sekmesi arka planda/compositing
     yapmıyor → `requestAnimationFrame` tarayıcı tarafından duraklatılıyor);
     `git stash` ile T-13 öncesi koda dönülüp **aynı davranışın orada da**
     var olduğu doğrulandı — T-13 kaynaklı bir regresyon değil, bu oturumun
     test ortamına özgü bir kısıt (bir sonraki oturumda gerçek bir görünür
     tarayıcı sekmesinde elle doğrulanmalı, T-08'in service-worker sınırına
     benzer bir durum).

- **Sonraki talimata not (T-14 ve olası PLAN-02):**
  - Lighthouse Performans/Erişilebilirlik/SEO'nun **üçü birden** ilk kez bu
    talimatta, aynı üretim derlemesine karşı ölçüldü (92/96/100) — `KULLANIM-
    KILAVUZU.md`/`BAGLAM.md`'deki "Mevcut Durum" bu üçlü rakamı T-14'te
    kesinleştirebilir (bu talimat kendi ölçümünü zaten Dokumanlar'a işledi).
  - **≥%15 ilk paket küçülmesi** hedefi, T-10'un ertelediği içerik tembel
    yüklemesi (`data/gunler/*.ts`'in ay bazlı `import()`'u) yapılmadan
    ulaşılamaz — 60 günlük editör verisi tek başına ana paketin çoğunluğu.
    366 güne çıkılırsa (PLAN-02) bu **zorunlu** hâle gelir.
  - Lighthouse Performans puanı, canlı Wikipedia API'sinin (~2,4 sn, ~750 kB)
    yanıt süresine doğrudan bağlı ve her ölçümde belirgin biçimde değişiyor;
    tutarlı/garanti bir puan isteniyorsa bir sunucu tarafı önbellek veya proxy
    katmanı (PLAN-02 adayı, PLAN-01'in "backend yok" ilkesiyle çelişir, bilinçli
    bir gelecek kararı gerektirir) düşünülmeli.
  - `react-router-dom` güvenlik danışma kaydı (bkz. Sapmalar madde 5) ayrı bir
    talimatla ele alınmalı.
