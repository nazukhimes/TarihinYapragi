# T-08 · Site Kimliği: Favicon, SEO ve PWA

| Alan | Değer |
|---|---|
| **Faz** | FAZ 2 — Ürün Kabuğu |
| **Öncelik** | 🟠 Yüksek |
| **Tahmini süre** | ~3 saat |
| **Bağımlılık** | **T-06 zorunlu** (URL şeması olmadan meta etiketleri yazılamaz) |
| **İlgili bulgu** | U-4 |
| **Durum** | ⬜ Bekliyor |

---

## 🎯 Amaç

Uygulamayı "localhost'ta çalışan bir sayfa" olmaktan çıkarıp **paylaşılabilir,
bulunabilir ve kurulabilir bir web sitesine** dönüştürmek: tarayıcı sekmesinde
simgesi olan, WhatsApp'ta önizlemesi çıkan, telefona eklenebilen bir ürün.

---

## 📍 Mevcut Durum

`index.html` içinde bugün olanlar ✅ / olmayanlar ❌:

| Öğe | Durum |
|---|---|
| `lang="tr"` | ✅ |
| `<title>` | ✅ |
| `meta description` | ✅ |
| `meta theme-color` | ✅ |
| **favicon** | ❌ — tarayıcı varsayılan simgeyi gösteriyor |
| `og:title` / `og:description` / `og:image` | ❌ — sosyal medyada çıplak bağlantı |
| `twitter:card` | ❌ |
| `canonical` | ❌ |
| `manifest.json` | ❌ — telefona eklenemiyor |
| `apple-touch-icon` | ❌ |
| `robots.txt` | ❌ |
| `sitemap.xml` | ❌ — 366 sayfa var, hiçbiri arama motoruna bildirilmiyor |
| Service worker | ❌ — `localStorage` yedeği varken çevrimdışı açılış yok |
| Gün bazlı dinamik `<title>` | ❌ — her gün aynı başlık |

---

## ✅ Yapılacaklar

### Adım 1 — Favicon takımı

**Tasarım:** Uygulamanın `IconLeafMark` ikonu (takvim yaprağı) esas alınmalı —
kırmızı bantlı, yırtık alt kenarlı yaprak. Kaynak SVG'yi `ui.tsx`'ten alın.

`public/` altına:

| Dosya | Boyut | Kullanım |
|---|---|---|
| `favicon.svg` | vektör | Modern tarayıcılar |
| `favicon.ico` | 32×32 | Eski tarayıcılar |
| `apple-touch-icon.png` | 180×180 | iOS ana ekran |
| `icon-192.png` | 192×192 | Android / PWA |
| `icon-512.png` | 512×512 | PWA splash |
| `icon-maskable-512.png` | 512×512 | Android adaptif (güvenli alan: %80 iç daire) |
| `og-image.png` | 1200×630 | Sosyal medya önizleme |

**`og-image.png` içeriği:** koyu zemin, ortada takvim yaprağı görseli,
`TARİH YAPRAĞI` başlığı, altında `Bugün tarihte ne oldu?` — fontlar Fraunces + IBM Plex Mono.

> Üretim aracı serbest (Figma, SVG → PNG dönüştürücü, `sharp` betiği).
> Önemli olan dosyaların `public/` altında ve doğru boyutta olması.

### Adım 2 — `index.html` `<head>` genişletme

```html
<!-- simgeler -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="alternate icon" href="/favicon.ico" sizes="32x32" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.webmanifest" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Tarih Yaprağı" />
<meta property="og:locale" content="tr_TR" />
<meta property="og:title" content="Tarih Yaprağı — Bugün Tarihte Ne Oldu?" />
<meta property="og:description" content="Seçtiğin gün için tarihteki olaylar, doğanlar, kaybettiklerimiz, karanlık dosyalar ve bilim dönüm noktaları — yayıncılar için hazır sohbet kartlarıyla." />
<meta property="og:image" content="/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Tarih Yaprağı — takvim yaprağı görseli" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Tarih Yaprağı — Bugün Tarihte Ne Oldu?" />
<meta name="twitter:description" content="Her güne bir arşiv." />
<meta name="twitter:image" content="/og-image.png" />
```

> **Not:** `og:image` mutlak URL olmalı. Dağıtım alan adı belliyse
> `https://alan-adi.com/og-image.png` yaz; belli değilse göreli bırak ve
> T-14'te güncelle.

### Adım 3 — Gün bazlı dinamik başlık ve meta

Statik HTML her gün aynı başlığı verir. `App.tsx` içinde güne göre güncelle:

```tsx
useEffect(() => {
  const baslik = `${dayLabel} — Tarihte Bugün | Tarih Yaprağı`;
  document.title = baslik;

  const ayarla = (secici: string, deger: string) => {
    let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(secici);
    if (!el) return;
    if (el instanceof HTMLMetaElement) el.content = deger;
    else el.href = deger;
  };

  const ozet = spotlight?.title
    ? `${dayLabel}: ${spotlight.title}`
    : `${dayLabel} tarihinde yaşanan olaylar, doğanlar ve kaybettiklerimiz.`;

  ayarla('meta[name="description"]', ozet);
  ayarla('meta[property="og:title"]', baslik);
  ayarla('meta[property="og:description"]', ozet);
  ayarla('link[rel="canonical"]', `${location.origin}/${toDaySlug(month, day)}`);
}, [dayLabel, spotlight, month, day]);
```

`index.html` içine boş bir canonical yer tutucusu ekle:

```html
<link rel="canonical" href="/" />
```

> ⚠️ **Sınır:** Bu, JavaScript çalıştıktan sonra devreye girer. Google JS çalıştırır,
> ancak WhatsApp/Twitter tarayıcıları çalıştırmaz — onlar `index.html`'deki **statik**
> etiketleri okur. Gün bazlı sosyal önizleme istiyorsanız ön-işleme (prerender) gerekir;
> bu **bu planın kapsamı dışında**, PLAN-02 konusudur.

### Adım 4 — `public/manifest.webmanifest`

```json
{
  "name": "Tarih Yaprağı — Bugün Tarihte Ne Oldu?",
  "short_name": "Tarih Yaprağı",
  "description": "Her güne bir arşiv: tarihî olaylar, doğanlar, kaybettiklerimiz, karanlık dosyalar ve bilim dönüm noktaları.",
  "lang": "tr",
  "dir": "ltr",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#0f131a",
  "theme_color": "#0f131a",
  "categories": ["education", "news", "reference"],
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Adım 5 — `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: /sitemap.xml
```

> Alan adı belli olunca `Sitemap:` satırını mutlak URL yap (T-14).

### Adım 6 — `sitemap.xml` üretimi

366 gün için elle yazılamaz. `scripts/sitemap.mjs`:

```js
import { writeFileSync } from "node:fs";

const AY_SLUG = ["ocak","subat","mart","nisan","mayis","haziran",
                 "temmuz","agustos","eylul","ekim","kasim","aralik"];
const GUN = [31,29,31,30,31,30,31,31,30,31,30,31];   // 29 Şubat dahil
const TABAN = process.env.SITE_URL || "https://tarihyapragi.example";

const url = [];
for (let m = 0; m < 12; m++)
  for (let d = 1; d <= GUN[m]; d++)
    url.push(`  <url><loc>${TABAN}/${d}-${AY_SLUG[m]}</loc><changefreq>yearly</changefreq><priority>0.7</priority></url>`);

writeFileSync("public/sitemap.xml",
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url.join("\n")}
</urlset>
`);
console.log(`sitemap.xml yazıldı — ${url.length} adres`);
```

`package.json`:

```json
"scripts": {
  "sitemap": "node scripts/sitemap.mjs",
  "build": "npm run sitemap && vite build"
}
```

> Slug listesini `src/lib/slug.ts` ile **elle senkron tutmak zorundasınız**.
> T-12'de bunu doğrulayan bir test yazın (`MONTH_SLUGS` ile `AY_SLUG` eşit olmalı).

### Adım 7 — Yapılandırılmış veri (JSON-LD)

`index.html` `</body>` öncesine:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Tarih Yaprağı",
  "url": "/",
  "inLanguage": "tr-TR",
  "description": "Her güne bir arşiv: tarihî olaylar, doğanlar, kaybettiklerimiz, karanlık dosyalar ve bilim dönüm noktaları."
}
</script>
```

### Adım 8 — Service worker (çevrimdışı kabuk)

`vite-plugin-pwa` ekle:

```bash
npm install -D vite-plugin-pwa
```

`vite.config.ts`:

```ts
import { VitePWA } from "vite-plugin-pwa";

plugins: [
  react(),
  tailwindcss(),
  VitePWA({
    registerType: "autoUpdate",
    manifest: false,                      // kendi manifest.webmanifest dosyamızı kullanıyoruz
    includeAssets: ["favicon.svg", "favicon.ico", "apple-touch-icon.png", "og-image.png"],
    workbox: {
      globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.wikimedia\.org\/.*/i,
          handler: "NetworkFirst",
          options: {
            cacheName: "wikimedia-otd",
            networkTimeoutSeconds: 5,
            expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 7 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /^https:\/\/upload\.wikimedia\.org\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "wikimedia-gorsel",
            expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
      ],
    },
  }),
]
```

> **`NetworkFirst`** seçimi bilinçli: tarihsel veri nadiren değişir ama kullanıcının
> önce güncel veriyi görmesi doğrudur; ağ 5 saniyede yanıt vermezse önbellek devreye girer.
> Görseller ise `CacheFirst` — değişmezler.

---

## 🚫 Kapsam Dışı

| Dokunma | Neden / Hangi talimat |
|---|---|
| Ön-işleme (prerender) / SSR | PLAN-02 — statik SPA kararı bu planda korunuyor |
| Gün bazlı **statik** `og:image` üretimi | PLAN-02 |
| Analitik / izleme kodu | Kapsam dışı — gizlilik kararı |
| Çerez / onay bandı | Gerek yok — çerez kullanılmıyor |
| Dağıtım (deploy) | T-14 |
| Tasarım dilinin değişmesi | Simgeler mevcut ikonografiyi izler |

---

## ☑️ Kabul Kriterleri

- [ ] Tarayıcı sekmesinde takvim yaprağı simgesi görünüyor
- [ ] `public/` altında 7 görsel dosyanın hepsi var ve doğru boyutta
- [ ] `og:*` ve `twitter:*` etiketleri `index.html`'de
- [ ] Gün değişince `document.title` ve `canonical` güncelleniyor
- [ ] `manifest.webmanifest` geçerli; Chrome "Uygulamayı yükle" seçeneği çıkıyor
- [ ] `robots.txt` var
- [ ] `npm run sitemap` çalışıyor, **366 adres** üretiyor
- [ ] `npm run build` sitemap'i otomatik üretiyor
- [ ] JSON-LD hatasız
- [ ] Service worker kayıtlı; ağ kapalıyken daha önce açılan gün açılıyor
- [ ] Lighthouse **SEO ≥ 95**, **PWA kurulabilir** ✅
- [ ] `npm run typecheck` ve `npm run build` hatasız

---

## 🧪 Doğrulama

### 1. Favicon

Sekmede simge görünmeli. Sabit disk önbelleği yüzünden görünmüyorsa
gizli pencerede aç.

### 2. Sosyal önizleme

```bash
npm run build && npm run preview
```

`curl` ile etiketleri kontrol et:

```bash
curl -s http://localhost:4173/ | grep -E 'og:|twitter:'
```

Alan adı yayındaysa:
[opengraph.xyz](https://www.opengraph.xyz) veya
[Twitter Card Validator](https://cards-dev.twitter.com/validator) ile doğrula.

### 3. Dinamik başlık

`/29-ekim` aç → sekme başlığı **"29 Ekim — Tarihte Bugün | Tarih Yaprağı"** olmalı.
`/1-ocak`'a geç → başlık değişmeli.

```js
document.querySelector('link[rel="canonical"]').href
```

→ `http://localhost:3000/1-ocak`

### 4. PWA kurulabilirlik

DevTools → **Application → Manifest** → hata olmamalı, tüm simgeler yüklenmeli.
Adres çubuğunda **"Yükle"** simgesi çıkmalı.
Kur, uygulama penceresi olarak açıldığını doğrula.

### 5. Çevrimdışı

1. `/29-ekim` aç (önbelleğe girsin)
2. DevTools → Network → **Offline**
3. Sayfayı yenile → **açılmalı**, boş sayfa gelmemeli
4. `/1-mart` (hiç açılmamış) → çevrimdışı ekranı görünmeli

### 6. Sitemap

```bash
npm run sitemap && grep -c "<url>" public/sitemap.xml
```

Beklenen: **366**

```bash
grep -o "<loc>[^<]*</loc>" public/sitemap.xml | head -3
grep "subat" public/sitemap.xml | tail -1
```

Son satır `29-subat` içermeli.

### 7. Slug tutarlılığı

`scripts/sitemap.mjs` içindeki `AY_SLUG` ile `src/lib/slug.ts` içindeki
`MONTH_SLUGS` **birebir aynı** olmalı. Sitemap'teki rastgele 5 adresi
tarayıcıda aç — hiçbiri 404 vermemeli.

### 8. Lighthouse

DevTools → Lighthouse → SEO + PWA → **SEO ≥ 95**, PWA kurulabilir.

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:**
- **Değişen dosyalar:**
- **Lighthouse SEO puanı:**
- **Alan adı (canonical/og için):**
- **Sapmalar / notlar:**
- **Sonraki talimata not:**
