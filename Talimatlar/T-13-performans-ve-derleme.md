# T-13 · Performans ve Derleme İyileştirmesi

| Alan | Değer |
|---|---|
| **Faz** | FAZ 4 — Kalite Güvencesi |
| **Öncelik** | 🟡 Orta |
| **Tahmini süre** | ~3 saat |
| **Bağımlılık** | T-04 (paylaşılan gözlemci), T-08 (PWA), T-12 (regresyon koruması) |
| **İlgili bulgu** | m-4, m-5, performans notları |
| **Durum** | ⬜ Bekliyor |

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

- [ ] `@source not` ile belge klasörleri Tailwind taramasından çıkarıldı; CSS ≈ 50,8 kB (Adım 10)

- [ ] `BroadcastMode` ayrı dosyada ve `React.lazy` ile yükleniyor
- [ ] İlk paket boyutu **≥ %15 küçüldü** (gzip)
- [ ] Font isteği daraltıldı; kullanılmayan ağırlık/italik indirilmiyor
- [ ] Ticker hızı öğe sayısına göre değişiyor (20–90 s arası)
- [ ] Mobilde `.noise` ve `drift` animasyonları kapalı
- [ ] `App.tsx` **≤ 300 satır**
- [ ] `useGunVerisi` hook'u var; `useMemo`'lar oradan geliyor
- [ ] `stats.indexOf` kalıbı kaldırıldı, `hedef` alanı kullanılıyor
- [ ] Arama süzmesi **tek yerde** yapılıyor
- [ ] `npm run analyze` çalışıyor
- [ ] React ayrı parçada (`manualChunks`)
- [ ] **Davranış birebir aynı** — hiçbir görsel/işlevsel regresyon yok
- [ ] `npm run kontrol` tamamen yeşil
- [ ] Lighthouse Performans (mobil) **≥ 90**

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

- **Tamamlanma tarihi:**
- **Paket boyutu (önce / sonra, gzip):**
- **Lighthouse Performans (önce / sonra):**
- **`App.tsx` satır sayısı (önce / sonra):**
- **`content-visibility` uygulandı mı:**
- **Değişen dosyalar:**
- **Sapmalar / notlar:**
- **Sonraki talimata not:**
