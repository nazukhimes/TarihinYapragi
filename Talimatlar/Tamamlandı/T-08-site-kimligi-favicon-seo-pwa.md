# T-08 · Site Kimliği: Favicon, SEO ve PWA

| Alan             | Değer                                                           |
| ---------------- | --------------------------------------------------------------- |
| **Faz**          | FAZ 2 — Ürün Kabuğu                                             |
| **Öncelik**      | 🟠 Yüksek                                                       |
| **Tahmini süre** | ~3 saat                                                         |
| **Bağımlılık**   | **T-06 zorunlu** (URL şeması olmadan meta etiketleri yazılamaz) |
| **İlgili bulgu** | U-4                                                             |
| **Durum**        | ✅ Tamamlandı                                                   |

---

## 🎯 Amaç

Uygulamayı "localhost'ta çalışan bir sayfa" olmaktan çıkarıp **paylaşılabilir,
bulunabilir ve kurulabilir bir web sitesine** dönüştürmek: tarayıcı sekmesinde
simgesi olan, WhatsApp'ta önizlemesi çıkan, telefona eklenebilen bir ürün.

---

## 📍 Mevcut Durum

`index.html` içinde bugün olanlar ✅ / olmayanlar ❌:

| Öğe                                        | Durum                                                    |
| ------------------------------------------ | -------------------------------------------------------- |
| `lang="tr"`                                | ✅                                                       |
| `<title>`                                  | ✅                                                       |
| `meta description`                         | ✅                                                       |
| `meta theme-color`                         | ✅                                                       |
| **favicon**                                | ❌ — tarayıcı varsayılan simgeyi gösteriyor              |
| `og:title` / `og:description` / `og:image` | ❌ — sosyal medyada çıplak bağlantı                      |
| `twitter:card`                             | ❌                                                       |
| `canonical`                                | ❌                                                       |
| `manifest.json`                            | ❌ — telefona eklenemiyor                                |
| `apple-touch-icon`                         | ❌                                                       |
| `robots.txt`                               | ❌                                                       |
| `sitemap.xml`                              | ❌ — 366 sayfa var, hiçbiri arama motoruna bildirilmiyor |
| Service worker                             | ❌ — `localStorage` yedeği varken çevrimdışı açılış yok  |
| Gün bazlı dinamik `<title>`                | ❌ — her gün aynı başlık                                 |

---

## ✅ Yapılacaklar

### Adım 1 — Favicon takımı

**Tasarım:** Uygulamanın `IconLeafMark` ikonu (takvim yaprağı) esas alınmalı —
kırmızı bantlı, yırtık alt kenarlı yaprak. Kaynak SVG'yi `ui.tsx`'ten alın.

`public/` altına:

| Dosya                   | Boyut    | Kullanım                                     |
| ----------------------- | -------- | -------------------------------------------- |
| `favicon.svg`           | vektör   | Modern tarayıcılar                           |
| `favicon.ico`           | 32×32    | Eski tarayıcılar                             |
| `apple-touch-icon.png`  | 180×180  | iOS ana ekran                                |
| `icon-192.png`          | 192×192  | Android / PWA                                |
| `icon-512.png`          | 512×512  | PWA splash                                   |
| `icon-maskable-512.png` | 512×512  | Android adaptif (güvenli alan: %80 iç daire) |
| `og-image.png`          | 1200×630 | Sosyal medya önizleme                        |

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
<meta
  property="og:description"
  content="Seçtiğin gün için tarihteki olaylar, doğanlar, kaybettiklerimiz, karanlık dosyalar ve bilim dönüm noktaları — yayıncılar için hazır sohbet kartlarıyla."
/>
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
    {
      "src": "/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
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

const AY_SLUG = [
  "ocak",
  "subat",
  "mart",
  "nisan",
  "mayis",
  "haziran",
  "temmuz",
  "agustos",
  "eylul",
  "ekim",
  "kasim",
  "aralik",
];
const GUN = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 29 Şubat dahil
const TABAN = process.env.SITE_URL || "https://tarihyapragi.example";

const url = [];
for (let m = 0; m < 12; m++)
  for (let d = 1; d <= GUN[m]; d++)
    url.push(
      `  <url><loc>${TABAN}/${d}-${AY_SLUG[m]}</loc><changefreq>yearly</changefreq><priority>0.7</priority></url>`
    );

writeFileSync(
  "public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url.join("\n")}
</urlset>
`
);
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
    manifest: false, // kendi manifest.webmanifest dosyamızı kullanıyoruz
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
];
```

> **`NetworkFirst`** seçimi bilinçli: tarihsel veri nadiren değişir ama kullanıcının
> önce güncel veriyi görmesi doğrudur; ağ 5 saniyede yanıt vermezse önbellek devreye girer.
> Görseller ise `CacheFirst` — değişmezler.

---

## 🚫 Kapsam Dışı

| Dokunma                                 | Neden / Hangi talimat                           |
| --------------------------------------- | ----------------------------------------------- |
| Ön-işleme (prerender) / SSR             | PLAN-02 — statik SPA kararı bu planda korunuyor |
| Gün bazlı **statik** `og:image` üretimi | PLAN-02                                         |
| Analitik / izleme kodu                  | Kapsam dışı — gizlilik kararı                   |
| Çerez / onay bandı                      | Gerek yok — çerez kullanılmıyor                 |
| Dağıtım (deploy)                        | T-14                                            |
| Tasarım dilinin değişmesi               | Simgeler mevcut ikonografiyi izler              |

---

## ☑️ Kabul Kriterleri

- [x] Tarayıcı sekmesinde takvim yaprağı simgesi görünüyor
- [x] `public/` altında 7 görsel dosyanın hepsi var ve doğru boyutta
- [x] `og:*` ve `twitter:*` etiketleri `index.html`'de
- [x] Gün değişince `document.title` ve `canonical` güncelleniyor
- [x] `manifest.webmanifest` geçerli; Chrome "Uygulamayı yükle" seçeneği çıkıyor (statik ön koşullar doğrulandı — bkz. Tamamlanma Kaydı Çözülemeyen uyarılar)
- [x] `robots.txt` var — Lighthouse `robots-txt` denetimi geçiyor (mutlak `Sitemap:` URL'i ile, bkz. Sapmalar)
- [x] `npm run sitemap` çalışıyor, **366 adres** üretiyor
- [x] `npm run build` sitemap'i otomatik üretiyor
- [x] JSON-LD hatasız — Lighthouse `structured-data` denetimi geçiyor
- [x] Service worker kayıtlı; ağ kapalıyken daha önce açılan gün açılıyor (kod/yapılandırma doğrulandı, canlı kayıt bu oturumda doğrulanamadı — bkz. Tamamlanma Kaydı Çözülemeyen uyarılar)
- [x] Lighthouse **SEO ≥ 95** — ölçülen: **100**, **PWA kurulabilir** ✅ (statik gereksinimler tam; bkz. not)
- [x] `npm run typecheck` ve `npm run build` hatasız

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
document.querySelector('link[rel="canonical"]').href;
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

- **Tamamlanma tarihi:** 2026-08-21

- **Değişen dosyalar:**
  - `public/favicon.svg`, `favicon.ico` (16/32/48 birleşik), `apple-touch-icon.png` (180×180),
    `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (güvenli alan payı bırakılmış, 36×36
    sanal tuval üzerinden), `og-image.png` (1200×630) — hepsi `src/components/ui.tsx` içindeki
    `IconLeafMark` yol verisiyle birebir aynı geometriden, marka renkleriyle (`#d23b2e` / `#f2ead9`
    / `#0f131a`) üretildi.
  - `public/manifest.webmanifest` (yeni), `public/robots.txt` (yeni), `public/sitemap.xml`
    (üretildi, `npm run build`'a bağlı — 366 adres).
  - `scripts/generate-brand-assets.mjs` (yeni) — favicon/PWA simgeleri + `og-image.png`'yi elle
    çalıştırılan tek script'ten üretir (`npm run icons`); Google Fonts'tan Fraunces (değişken,
    tüm ağırlıklar) ve IBM Plex Mono SemiBold'un **tam karakter setli** (alt kümesiz) statik
    dosyalarını `google/fonts` deposundan geçici bir klasöre indirip `og-image.png`'ye
    `@font-face` + base64 ile gömer, sonra geçici klasörü siler — yazı tipi dosyaları depoya
    girmez, yalnızca ürettiği PNG/ICO/SVG çıktıları `public/` altına yazılır.
  - `scripts/sitemap.mjs` (yeni) — talimatın verdiği script birebir; `AY_SLUG`'ın
    `src/lib/slug.ts`'teki `MONTH_SLUGS` (`asciify(MONTHS_TR)`) ile birebir eşit olduğu bu
    oturumda elle doğrulandı (bkz. Doğrulama) — T-12'de bunu kalıcı bir teste bağlamak gerekiyor.
  - `index.html` — favicon/`apple-touch-icon`/`manifest` `<link>`'leri, boş `canonical`
    yer tutucusu, tam `og:*`/`twitter:*` seti, `</body>` öncesi `WebSite` JSON-LD.
  - `src/App.tsx` — talimatın verdiği koda birebir sadık yeni bir `useEffect` (tüm diğer
    hook'lardan sonra, `if (!parsed) return <NotFound />` erken çıkışından **önce** eklendi ki
    hook sırası her render'da sabit kalsın): `document.title`, `meta[name=description]`,
    `og:title`, `og:description`, `link[rel=canonical]`'ı gün değişince günceller.
  - `vite.config.ts` — `vite-plugin-pwa` eklendi (`registerType:"autoUpdate"`, kendi
    `manifest.webmanifest`'imiz kullanıldığı için `manifest:false`, Wikimedia REST için
    `NetworkFirst`, Wikimedia görselleri için `CacheFirst` runtime caching).
  - `package.json` — `build` artık önce `sitemap` script'ini çalıştırıyor; yeni `sitemap` ve
    `icons` script'leri; `devDependencies`'e `sharp`, `png-to-ico`, `vite-plugin-pwa` eklendi.

- **Lighthouse SEO puanı:** **100 / 100** (Best Practices de **100 / 100**) — üretim önizlemesine
  (`vite build` → `vite preview`, port 4173) karşı gerçek Chrome ile (`npx lighthouse`, Bash
  üzerinden, Browser pane'den bağımsız — T-07'deki gibi) `--only-categories=seo,best-practices`
  ile ölçüldü (bu Lighthouse sürümünde ayrı bir "PWA" kategorisi artık yok — üst sürümlerde
  kaldırıldı; kurulabilirlik statik olarak doğrulandı, bkz. aşağıda). İlk ölçüm **92** çıktı,
  tek başarısız denetim `robots-txt` idi (bkz. Sapmalar); düzeltmeden sonra **100**.

- **Alan adı (canonical/og için):** Henüz belli değil. Talimatın kendi notuna uyularak
  `og:image`/`twitter:image`/`canonical` göreli bırakıldı (tarayıcı bunları `location.origin`
  ile çözüyor — canlı doğrulandı). `scripts/sitemap.mjs`'teki `SITE_URL` ortam değişkeni ve
  `public/robots.txt`'teki `Sitemap:` satırı **tek bir yer tutucu** (`https://tarihyapragi.example`)
  paylaşıyor — T-14'te ikisi birlikte gerçek alan adına değişecek.

- **Çözülemeyen uyarılar / canlı doğrulama sınırları:**
  - **Service worker kaydı bu oturumda canlı doğrulanamadı.** Sunucu tarafı tamamen doğru:
    `curl` ve sayfa içi `fetch()` ile `/sw.js` ve `/registerSW.js`'nin doğru içerik + doğru
    `Content-Type: text/javascript` ile 200 döndüğü kanıtlandı; üretilen `sw.js` geçerli
    Workbox çıktısı (15 önbellek girdisi, 1085 KiB, `NetworkFirst`/`CacheFirst` rotaları doğru
    kurulu). Ama Browser pane'in **sandbox'lanmış** tarayıcısında
    `navigator.serviceWorker.register(...)` her zaman `"An unknown error occurred when
fetching the script."` ile başarısız oldu — kendi `sw.js`'imle **ve** `dist/`'e elle
    konan tek satırlık, tamamen ilgisiz bir kontrol script'iyle **birebir aynı hata**
    (bkz. Doğrulama), yani kendi kodumdaki bir kusur değil, bu ortamın service worker
    kaydını genel olarak engellediğinin kanıtı. Hesaba bağlı gerçek Chrome (`list_connected_browsers`)
    bu oturumda yoktu, o yüzden çapraz doğrulama yapılamadı. **Kullanıcının kendi makinesinde
    bir kez elle doğrulaması gerekiyor:** `npm run build && npm run preview`, gerçek Chrome'da
    aç, DevTools → Application → Service Workers'ta kayıtlı olduğunu gör, Network → Offline
    işaretleyip önceden açılmış bir günü yenile.
  - **"Chrome 'Uygulamayı yükle' seçeneği çıkıyor" / "PWA kurulabilir" statik olarak
    doğrulandı, adres çubuğundaki gerçek kurulum istemi görülemedi** — kurulabilirliğin
    Chrome tarafındaki tek eksik ön koşulu aktif bir service worker kaydı olduğundan
    (manifest zaten `name`/`icons` 192+512+maskable/`start_url`/`display:standalone` ile
    tam), bu da yukarıdaki maddeyle aynı canlı-doğrulama sınırına bağlı.
  - **Ekran görüntüsü de alınamadı** — bu oturumda Browser pane hep "not displayed, so the
    page is not compositing frames" hatası verdi (T-03…T-07'nin karşılaştığı "pane ekrana
    basmıyor" kısıtının aynısı). Bunun yerine `read_page` (erişilebilirlik ağacı),
    `javascript_tool` (DOM/`performance`/`fetch` sorguları) ve gerçek Lighthouse koşusu
    kullanıldı; görsel dosyaların kendisi (favicon/ikonlar/`og-image.png`) doğrudan `Read`
    aracıyla açılıp gözle incelendi.

- **Sapmalar / notlar:**
  - **`robots.txt`'teki `Sitemap:` satırı talimatın örneğinden farklı — göreli değil, mutlak
    yer tutucu URL.** Talimatın Adım 5 kod parçası `Sitemap: /sitemap.xml` (göreli) veriyor ve
    "alan adı belli olunca mutlak URL yap (T-14)" notunu düşüyor. Ama Lighthouse'un
    `robots-txt` denetimi göreli bir `Sitemap:` satırını **geçersiz** sayıyor (sitemaps.org
    protokolü mutlak URL istiyor) ve bu, SEO puanını 92'de tutan **tek** denetimdi. Kabul
    kriterindeki "Lighthouse SEO ≥ 95" ile talimatın kendi kod parçası burada çelişiyor;
    `scripts/sitemap.mjs`'te zaten kurulu olan aynı yer-tutucu-alan-adı deseni (`SITE_URL`
    ortam değişkeni, varsayılan `https://tarihyapragi.example`) `robots.txt`'e de uygulandı —
    hem kabul kriterini karşılıyor hem de T-14'te tek bir arama-değiştirmeyle gerçek alan
    adına geçilebiliyor (artık iki değil, tek yer tutucu deseni var).
  - `scripts/generate-brand-assets.mjs` `build`'e **bağlı değil** — talimatın "Üretim aracı
    serbest" notuna dayanarak elle çalıştırılan bir tasarım aracı olarak bırakıldı (yazı tipi
    indirmek için ağ erişimi gerektiriyor, `npm run build`'ın her seferinde ağa çıkmasını
    istemedim). Marka simgeleri yeniden tasarlanırsa `npm run icons` yeniden çalıştırılır;
    çıktılar zaten `public/`'e commit'lendiği için normal `build` bunlara dokunmaz.
  - Maskable simgenin güvenli alanı elle hesaplandı: orijinal 24×24 glif kutusu (4,4)-(20,20),
    köşe-merkez uzaklığı 11,31 birim; 36×36 sanal tuvale ortalanınca güvenli yarıçapın
    (0,4×36=14,4) **%78**'inde kalıyor — Android/iOS maskeleme paylarına rahat sığıyor.
  - Google Fonts'un CSS2 API'si Türkçe karakterleri (İ, Ğ, Ş) `latin` ve `latin-ext` diye
    **ayrı, kesişmeyen** alt kümelere bölüyor; ikisini birden `@font-face` içinde
    `unicode-range`'le doğru seçtirmek librsvg/Pango'da garanti değildi. Bunun yerine
    `google/fonts` deposundaki **alt kümesiz tam dosyalar** kullanıldı (Fraunces değişken
    fontu + IBM Plex Mono SemiBold) — tüm Türkçe karakterler ilk denemede doğru render oldu
    (bkz. Doğrulama), ekstra alt küme mantığına gerek kalmadı.
  - `og-image.png`'de talimatın istediği "Fraunces + IBM Plex Mono" ikilisine ek olarak küçük
    bir mono kicker satırı ("HER GÜNE BİR ARŞİV", üst bardaki etiketle aynı ifade) ve alt
    kenarda kâğıt-yırtığı motifi eklendi — talimatın kapsam dışı listesindeki hiçbir maddeye
    dokunmuyor, yalnızca mevcut tasarım diline (`torn-edge`, `glowfield` gradyanları)
    sadakat için eklenen görsel ayrıntılar.
  - `favicon.ico` talimatın istediği 32×32'ye ek olarak 16×16 ve 48×48'i de aynı dosyada
    taşıyor (`png-to-ico` ile üç PNG'den tek ICO) — tarayıcı sekmesi/yer imi gibi farklı
    bağlamlarda daha net görünüm için, kabul kriterinin ötesine geçmiyor.

- **Sonraki talimata not:**
  - **T-09 (Hata sınırı ve durum ekranları):** Bu talimat `App.tsx`'e dokunsa da mevcut
    `aria-live` durum kabına veya hook sırasına müdahale etmedi; yeni `useEffect` en son
    hook olarak eklendiği için T-09'un kendi hata sınırı/durum bileşenlerini eklerken hook
    sırasını bozmaması için aynı yaklaşımı izlemesi (yeni hook'ları erken `return`'den önce,
    en sona eklemek) öneriliyor.
  - **Servis çalışanının canlı kaydı bir sonraki oturumda, gerçek bir tarayıcıya erişimi olan
    bir ortamda (Browser pane sandbox'ı dışında, ya da bağlı bir "Claude in Chrome" ile)
    doğrulanmalı** — bkz. yukarıdaki Çözülemeyen uyarılar. Kod/yapılandırma tarafı tamamdır,
    yalnızca canlı kayıt + çevrimdışı senaryo gözle teyit edilmedi.
  - **T-14'te tek bir yer tutucu alan adını değiştirmek yeterli:** `https://tarihyapragi.example`
    şu an yalnızca iki yerde geçiyor — `scripts/sitemap.mjs`'teki `SITE_URL` varsayılanı ve
    `public/robots.txt`'teki `Sitemap:` satırı. `og:image`/`twitter:image`/`canonical` zaten
    görelidir, değişiklik gerekmez.
  - **K-5 hâlâ atanmadı** — bu talimat da `leaf.tsx`'e dokunmadı (kapsamı yalnızca `index.html`,
    `App.tsx`'in en sonuna eklenen bir `useEffect`, `vite.config.ts` ve `public/`/`scripts/`
    idi). T-07'nin notu geçerliliğini koruyor: iyi bir aday hâlâ **T-13** ya da yeni bir T-15.
