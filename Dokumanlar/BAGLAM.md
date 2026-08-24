# BAĞLAM DOSYASI — Tarih Yaprağı

> Bu dosya projeye yeni katılan bir geliştiricinin (veya bir yapay zekâ asistanının)
> **ilk okuyacağı** dosyadır. Kodu okumadan önce projenin ne olduğunu, nasıl çalıştığını
> ve hangi kurallara uyulduğunu buradan öğren.
>
> **Son güncelleme:** 2026-08-24 (T-15) · **Sürüm:** 0.1.0 (geliştirme aşaması)

---

## 1. Proje Nedir?

**Tarih Yaprağı**, klasik duvar takvimi yapraklarından ilham alan bir "bugün tarihte ne oldu?"
web uygulamasıdır. Kullanıcı yılın herhangi bir gününü seçer; uygulama o güne düşen
tarihî olayları, doğanları, kaybettiklerimizi, karanlık dosyaları ve bilim dönüm
noktalarını tek sayfada sunar.

**Ayırt edici özellik:** İçerik yalnızca "listelenmez"; **yayıncılar için hazır konuşma
malzemesine** dönüştürülür. *Sohbet Kartları* ve *Yayın Modu* (teleprompter) bölümleri
bu amaca hizmet eder.

### Hedef kitle

| Kitle | Beklentisi |
|---|---|
| Genel ziyaretçi | Günün ilginç tarihini hızlıca okumak |
| İçerik üreticisi / YouTuber / podcast'çi | Yayında okunacak, kanca cümleli hazır kart |
| Öğrenci / meraklı | Kaynağa (Vikipedi) hızlı sıçrama |

### Ürün ilkeleri

1. **Gün merkezli.** Her şey seçili günün etrafında döner; global arama ikincildir.
2. **Kâğıt hissi.** Takvim yaprağı, yırtık kenar, daktilo tipografisi — dijital ama nostaljik.
3. **Kaynağı gizleme.** Otomatik derlenen içerik ile editör derlemesi görsel olarak ayrılır
   ("Editör notu" rozeti). Kullanıcı neyin nereden geldiğini bilir.
4. **Boş gün yoktur.** Editör içeriği olmasa bile Vikipedi arşivi devreye girer.

---

## 2. Teknoloji Yığını

| Katman | Seçim | Not |
|---|---|---|
| Çatı | React 18 + TypeScript 5.7 (`strict: true`) | Sınıf bileşeni yok, hepsi fonksiyon + hook |
| Derleyici | Vite 6 | `npm run dev` / `build` / `preview` / `typecheck` · yapılandırma `vite.config.ts` |
| Stil | Tailwind CSS **v4** (`@tailwindcss/vite`) | Config dosyası **yok**; tema `src/index.css` içindeki `@theme` bloğunda |
| Yönlendirme | `react-router-dom` v6 (`createBrowserRouter`) | Her gün kendi URL'sinde: `/21-agustos` biçimi (T-06). `src/lib/slug.ts` ↔ URL çevrimi yapar |
| Durum yönetimi | React `useState` / `useMemo` | Redux/Zustand yok, gerek de yok |
| Veri | Wikimedia REST "On this day" API | Sunucu/backend **yok**, tamamen istemci taraflı |
| Kalıcılık | `localStorage` (çevrimdışı yedek) + bellek içi `Map` | Veritabanı yok |
| Kalite | Vitest (`jsdom`) + Testing Library, ESLint (flat config), Prettier | `npm run test` / `lint` / `format` / `kontrol` (T-12) · CI: `.github/workflows/kontrol.yml` |

> **Önemli:** Bu proje **backend'siz, statik bir SPA**'dır. Derleme çıktısı (`dist/`)
> herhangi bir statik sunucuya konulabilir. Gizli anahtar gerektiren bir `.env` yoktur;
> `.env` yalnızca isteğe bağlı olarak Wikimedia API tabanını değiştirmek için var
> (`VITE_WIKI_API_BASE` → `src/lib/config.ts`, örnek: `.env.example`).

### Tailwind v4 uyarısı

`tailwind.config.js` **aramayın, yok.** Renkler ve fontlar `src/index.css` içindeki
`@theme { ... }` bloğunda CSS değişkeni olarak tanımlıdır. Yeni bir renk eklemek =
oraya `--color-xxx` eklemek. `w-4.5`, `pl-13`, `scale-108` gibi "standart dışı görünen"
sınıflar Tailwind v4'ün dinamik ölçek motoru sayesinde geçerlidir; **silmeyin.**

---

## 3. Veri Kaynağı ve Akışı

```
Kullanıcı bir gün seçer  (day, month)
          │
          ▼
   useDayData(month, day)            ← src/lib/wiki.ts (AbortController ile iptal edilebilir)
          │
          ├─ TR Vikipedi (önce denenir)
          │     └─ events/births/deaths'ten biri boşsa (trThin) ──► EN Vikipedi (tamamlayıcı)
          │
          │  ağ hatası → localStorage yedeği (savedAt zaman damgalı, TTL 24s)
          │              24 saatten eskiyse stale:true (arayüzde belirtilir)
          │              o da yoksa offline:true
          ▼
       normalize → DayData
          │
          ▼
   App.tsx  useMemo katmanı
          │
          ├─ mergedEvents  = CURATED.events  +  API events   (mükerrer ayıklanır)
          ├─ births/deaths = API → PersonCard
          ├─ allCases      = CURATED.cases   +  detectDarkItem() taraması
          ├─ allScience    = CURATED.science +  classifyItem() === bilim|kesif
          └─ talkCards     = CURATED.talk    +  buildAutoTalk()
          ▼
      Bölüm bileşenleri (sections.tsx / talk.tsx / leaf.tsx)
```

**API adresi:** `https://api.wikimedia.org/feed/v1/wikipedia/{tr|en}/onthisday/all/{MM}/{DD}`
Kimlik doğrulama gerektirmez, ücretsizdir, ancak **hız sınırı** vardır. Taban adres
`src/lib/config.ts` içindeki `WIKI_API_BASE`'den gelir; `VITE_WIKI_API_BASE` ortam
değişkeniyle geçersiz kılınabilir (bkz. `.env.example`). Koda gömülü URL **yok**.

### İki içerik türü — asla karıştırma

| Tür | Kaynak | Rozet | Dosya |
|---|---|---|---|
| **Editör içeriği** | Elle yazılır, güvenilir | `Editör notu` / `Editör` | `src/data/gunler/*.ts` (T-10'dan önce tek dosya: `curated.ts`) |
| **Otomatik içerik** | Vikipedi + regex sınıflandırma | rozet yok | `src/lib/classification.ts` |

Otomatik sınıflandırma anahtar kelime tabanlıdır ve **yanılabilir**. Bu yüzden
alt bilgide bir uyarı notu vardır ve her karta Vikipedi bağlantısı konur.
Puanlama tabanlı, ölçülen bir doğruluğu var (altın kümede %100 kategori
doğruluğu, karanlık dosyalarda 0 yanlış pozitif — `npm run siniflandirma`,
T-11); yine de kesin bilgi için okuyucu Vikipedi bağlantısını izlemeli.

---

## 4. Dosya Haritası

```
TarihinYapragi/
├── başlat.bat              ← Windows tek tıkla başlatıcı (menülü, BOM'suz + CRLF)
├── baslat.sh               ← macOS/Linux başlatıcı (chmod +x)
├── .editorconfig           ← satır sonu / girinti sözleşmesi (*.bat hariç LF)
├── .nvmrc                  ← Node sürümü (20)
├── .env.example            ← VITE_WIKI_API_BASE örneği (gerçek .env git'e girmez)
├── .vscode/
│   ├── extensions.json     ← önerilen eklentiler (Tailwind, ESLint, Prettier, EditorConfig)
│   └── settings.json       ← format-on-save, tabSize 2, Tailwind sınıf regex'i
├── index.html              ← Giriş noktası, favicon/manifest/og:*/twitter:*/JSON-LD (T-08)
├── vercel.json             ← Vercel SPA yönlendirmesi (T-06)
├── vite.config.ts          ← Sunucu portu + eklentiler + vite-plugin-pwa (T-08)
├── tsconfig.json           ← strict TypeScript
├── package.json
│
├── scripts/
│   ├── generate-brand-assets.mjs ← favicon/PWA simgeleri + og-image.png üretir (npm run icons, T-08)
│   ├── sitemap.mjs         ← 366 adresi public/sitemap.xml'e yazar (npm run build'a bağlı, T-08)
│   └── siniflandirma-raporu.mjs ← sınıflandırma doğruluğu ölçer (npm run siniflandirma, T-11)
│
├── public/
│   ├── _redirects          ← Netlify / Cloudflare Pages SPA yönlendirmesi (T-06)
│   ├── favicon.svg / favicon.ico / apple-touch-icon.png
│   ├── icon-192.png / icon-512.png / icon-maskable-512.png
│   ├── og-image.png        ← sosyal medya önizleme kartı (1200×630, T-08)
│   ├── manifest.webmanifest / robots.txt / sitemap.xml (T-08)
│
├── src/
│   ├── main.tsx            ← createBrowserRouter + RouterProvider (/, /:daySlug, *) (T-06)
│   ├── App.tsx             ← TEK sayfa, 244 satır (T-13'te 1.079'dan indi). Düzen + durum + efektler; veri/sunum aşağıdaki dosyalara ayrıştırıldı. URL → day/month (T-06)
│   ├── index.css           ← Tailwind v4 @theme + tüm özel animasyon/doku sınıfları + `@source not` (T-13)
│   ├── vite-env.d.ts       ← `ImportMetaEnv` tipi (VITE_WIKI_API_BASE)
│   │
│   ├── data/
│   │   ├── types.ts        ← Tip tanımları + curatedKey() (T-10)
│   │   ├── index.ts        ← 12 ay dosyasını birleştirip CURATED'ı dışa aktarır (T-10)
│   │   └── gunler/         ← 12 ay dosyası (01-ocak.ts … 12-aralik.ts), şu an 60 gün (T-10)
│   │
│   ├── lib/
│   │   ├── __fixtures__/
│   │   │   └── siniflandirma-ornekleri.ts ← sınıflandırma altın kümesi, 66 örnek (T-11)
│   │   ├── classification.ts ← classifyItem / detectDarkItem — puanlı kural motoru (T-11)
│   │   ├── config.ts       ← WIKI_API_BASE (ortam değişkeninden, varsayılanlı)
│   │   ├── date.ts         ← Artık yıl / gün sayısı / haftanın günü — saf fonksiyonlar
│   │   ├── slug.ts         ← toDaySlug / parseDaySlug — gün ↔ URL çevrimi (T-06)
│   │   ├── useInView.ts    ← Paylaşılan IntersectionObserver + setTimeout güvenlik ağı (T-04)
│   │   └── wiki.ts         ← API çağrısı, önbellek, otomatik kart üretimi (sınıflandırmayı classification.ts'ten alır)
│   │
│   ├── hooks/               ← (T-13) App.tsx'ten ayrıştırılan veri/etkileşim hook'ları
│   │   ├── useGunVerisi.ts  ← useMemo birleştirme katmanı + useAramaSonuclari (arama tekilleştirme)
│   │   └── useKlavyeKisayollari.ts ← Global ←/→/T///?/Esc dinleyicisi
│   │
│   └── components/
│       ├── leaf.tsx        ← Takvim yaprağı, mini takvim, canlı saat, haber bandı (ticker hızı T-13'te öğe sayısına bağlandı)
│       ├── ErrorBoundary.tsx ← Hata sınırı (kök + bölüm) ve rota hata ekranı (T-09)
│       ├── NotFound.tsx    ← 404 sayfası — geçersiz gün adresi (T-06)
│       ├── sections.tsx    ← Zaman tüneli, kişi kartları, karanlık dosyalar, bilim (T-13: `query`→`matched` API, `SectionShell` artık `content-visibility:auto`)
│       ├── talk.tsx        ← Sohbet kartları (Yayın Modu artık `broadcast.tsx`'te, T-13)
│       ├── broadcast.tsx   ← (T-13) Yayın Modu (teleprompter) — `App.tsx`'te `React.lazy` ile yüklenir
│       ├── ui.tsx          ← Reveal, CountUp, Modal, Toaster, copyText, tüm SVG ikonlar
│       ├── UstBar.tsx      ← (T-13) Üst bar: logo, arama, canlı saat, Yayın Modu düğmesi
│       ├── AcilisBolumu.tsx← (T-13) Açılış bölümü: ambiyans yılları + takvim yaprağı + paylaş + GunOzeti + OzelGunler + ticker
│       ├── GunOzeti.tsx    ← (T-13) Spotlight + sayaçlar + zaman aralığı + yükleniyor/hata durumları
│       ├── OzelGunler.tsx  ← (T-13) "Özel dosyalı günler" pill şeridi
│       ├── BolumNav.tsx    ← (T-13) Yapışkan bölüm navigasyonu (NAV dizisi burada)
│       ├── Bolumler.tsx    ← (T-13) Altı içerik bölümü + "Bugünün anlamı" şeridi + arama boş durumu
│       ├── AltBilgi.tsx    ← (T-13) Footer
│       ├── KisayolYardimi.tsx ← (T-13) Klavye kısayolları modalı
│       └── Iskeletler.tsx  ← (T-13) SkeletonLines / SkeletonCards
│
├── Dokumanlar/             ← BU KLASÖR — proje belgeleri
│   ├── BAGLAM.md           ← (bu dosya)
│   ├── MIMARI.md           ← teknik mimari, modül sorumlulukları
│   ├── KULLANIM-KILAVUZU.md← son kullanıcı kılavuzu
│   ├── ANALIZ-RAPORU.md    ← mevcut durum eksik/hata analizi
│   ├── ICERIK-SABLONU.md   ← yeni gün ekleme şablonu ve kalite ölçütleri (T-10)
│   └── CALISMA-SISTEMI.md  ← plan → talimat → tamamlandı iş akışı
│
└── Talimatlar/             ← İŞ AKIŞI klasörü
    ├── PLAN-01-*.md        ← aktif plan
    ├── T-12-*.md ...       ← aktif talimatlar
    ├── Tamamlandı/         ← biten talimatlar buraya taşınır (T-01…T-11)
    └── Plan/               ← tamamen biten planlar buraya taşınır
```

### Nerede ne var? (hızlı referans)

| Ne yapmak istiyorum | Hangi dosya |
|---|---|
| Yeni bir güne özel dosya eklemek | İlgili ay dosyası, `src/data/gunler/MM-ad.ts` → şablon: [`ICERIK-SABLONU.md`](ICERIK-SABLONU.md) |
| Yeni renk / font eklemek | `src/index.css` → `@theme` bloğu |
| Yeni bölüm eklemek | `src/components/BolumNav.tsx` → `NAV` dizisi · `src/components/Bolumler.tsx` → yeni `SectionShell` bloğu (T-13) |
| Sınıflandırma kuralı değiştirmek | `src/lib/classification.ts` → `KURALLAR` / `KARANLIK`, sonra `npm run siniflandirma` ile doğrula |
| Yeni ikon eklemek | `src/components/ui.tsx` → `IconXxx` fonksiyonu |
| Yayın modunu değiştirmek | `src/components/broadcast.tsx` → `BroadcastMode` (T-13'te ayrıldı, `App.tsx`'te `React.lazy`) |
| API tabanını değiştirmek | `.env` içine `VITE_WIKI_API_BASE=...` (örnek: `.env.example`) |
| URL şemasını değiştirmek | `src/lib/slug.ts` → `toDaySlug`/`parseDaySlug`; rotalar `src/main.tsx` |
| Favicon/PWA simgelerini yeniden üretmek | `npm run icons` → `scripts/generate-brand-assets.mjs` (kaynak: `ui.tsx` → `IconLeafMark`) |
| SEO/OG/manifest etiketlerini değiştirmek | `index.html` `<head>` + `App.tsx`'teki gün bazlı `useEffect` + `public/manifest.webmanifest` |
| Service worker önbellek kurallarını değiştirmek | `vite.config.ts` → `VitePWA({ workbox: {...} })` |

---

## 5. Kod Konvansiyonları

- **Dil:** Arayüz metinleri, yorumlar ve commit mesajları **Türkçe**. Kod tanımlayıcıları
  (değişken/fonksiyon adları) **İngilizce**. Bu bilinçli bir karardır, bozmayın.
- **Küçük harfe çevirme:** Asla `toLowerCase()` kullanma. Her zaman
  `toLocaleLowerCase("tr-TR")` — projede `trLower` yardımcısı olarak tekrarlanır.
  (Sebebi: `I → ı`, `İ → i` dönüşümü.)
- **Yıl biçimi:** Negatif yıllar için `formatYear()` kullan → `MÖ 480`.
- **Bileşen dosyaları:** Tek dosyada birden çok `export function` olabilir; her dosya bir
  *tema* (bölümler, kâğıt/takvim, yayın, temel UI) etrafında toplanır.
- **Animasyon:** CSS sınıfları (`reveal`, `leaf-flip`, `rise-in`, `stamp-in`) `index.css`
  içinde. JS animasyon kütüphanesi kullanılmıyor.
- **Erişilebilirlik:** `prefers-reduced-motion` desteklenir (`index.css` sonu).
- **Renk kullanımı:** Kategoriye göre renk `CATEGORIES[cat].color`'dan gelir; sabit hex
  kodunu bileşene gömmek yerine oradan al.

---

## 6. Komutlar

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run preview
```

```bash
npm run typecheck
```

Windows'ta bunların hepsi `başlat.bat` menüsünden de yapılabilir (çift tık → 1-4 seç).
macOS/Linux'ta aynı menü `./baslat.sh` ile gelir.

```bash
npm run siniflandirma
```

Sınıflandırma (kategori + karanlık dosya tespiti) doğruluğunu altın kümeye
karşı ölçer (T-11); başlatıcı menüsünde değil, yalnızca `classification.ts`
üzerinde çalışırken elle çalıştırılır.

> Port 3000 meşgulse Vite hata vermeden bir sonraki boş porta geçer
> (`strictPort: false`) ve HMR o portu izler.

> Node sürümü `.nvmrc` ile sabitlenir (`20`). `nvm use` çalıştırırsan otomatik geçer.
> Editör satır sonu / girinti kuralları `.editorconfig`'te; VS Code kullanıyorsan
> `.vscode/extensions.json` önerilen eklentileri, `.vscode/settings.json` format-on-save'i
> otomatik kurar.

---

## 7. Mevcut Durum — Dürüst Özet

> **Plan ilerlemesi:** PLAN-01 · 14 / 15 talimat tamamlandı (T-01, T-02, T-03, T-04, T-05, T-06, T-07, T-08 · 2026-08-21; T-09, T-10, T-11, T-12 · 2026-08-22; T-13 · 2026-08-23; T-15 · 2026-08-24). Kalan: T-14 (dokümantasyon ve yayın).
> Ayrıntı → [`../Talimatlar/PLAN-01-temel-duzeltme-ve-tamamlama.md`](../Talimatlar/PLAN-01-temel-duzeltme-ve-tamamlama.md)

**Çalışan:** Takvim yaprağı ve gün geçişi, Vikipedi entegrasyonu (TR→EN yedeği),
zaman tüneli + kategori filtresi, kişi kartları + modal, karanlık dosya kartları,
bilim kartları, sohbet kartları + kopyalama, Yayın Modu (klavye destekli),
arama, çevrimdışı yedek, tip kontrolü ve üretim derlemesi. Geliştirme ortamı artık
tek satırlık başlatıcılarla (`başlat.bat` / `baslat.sh`) ve sabit editör ayarlarıyla
(`.editorconfig`, `.nvmrc`, `.vscode/*`) herkes için aynı. İstatistik sayaçları ve
sayfa görünürlüğü artık tek paylaşılan bir `useInView` gözlemcisine ve
`setTimeout` güvenlik ağına dayanıyor (`src/lib/useInView.ts`). Ağ katmanı artık
TR'yi önce deniyor ve TR doluysa EN'i hiç çekmiyor, gün değişince önceki isteği
`AbortController` ile iptal ediyor, `localStorage` yedeği 24 saatlik TTL ve
60/40 kayıtlık önbellek sınırları taşıyor, HTTP hataları `network`/`notfound`/
`ratelimit`/`server`/`unknown` olarak ayrı `kind`'lara sınıflandırılıyor
(`src/lib/wiki.ts`, T-05). Her günün artık kendi adresi var (`/21-agustos`
biçiminde, `createBrowserRouter` + `src/lib/slug.ts`); `App.tsx`'te `day`/`month`
için ayrı durum yok, URL tek doğruluk kaynağı; tarayıcı geri/ileri tuşu ve
yenileme doğru çalışıyor; geçersiz adresler için kâğıt-yaprak temalı bir 404
sayfası var; takvim yaprağının altında mobilde yerel paylaşım, masaüstünde panoya
kopyalama yapan bir Paylaş düğmesi var (T-06). Uygulama artık klavyeyle tam
gezilebilir: `←`/`→` gün değiştirir, `T` bugüne döner, `/` aramaya odaklanır, `?`
bir kısayol yardımı açar; "Ana içeriğe atla" bağlantısı, `Modal` odak tuzağı +
kapanışta odak iadesi, `Toaster` ekran okuyucu bildirimi (`aria-live`), arama
girdisinde `aria-label`, kategori çiplerinde `aria-pressed` ve AA eşiğini geçen
bir metin kontrastı (`ink-faint`) eklendi (T-07). Gerçek bir Lighthouse denetimi
Erişilebilirlik puanını 96/100'e çıkardı. Uygulamanın artık bir site kimliği var:
tarayıcı sekmesinde takvim yaprağı favikonu, sosyal medyada başlık+görselle
önizleme (`og:*`/`twitter:*`), telefona kurulabilir bir PWA kabuğu
(`manifest.webmanifest`, service worker) ve arama motorları için `robots.txt` +
366 adresi kapsayan `sitemap.xml` (T-08). Gün değişince sekme başlığı ve
`canonical` bağlantısı otomatik güncelleniyor. Gerçek bir Lighthouse denetimi
SEO puanını 100/100 verdi. Uygulama artık bir bileşen çökse bile beyaz ekran
vermiyor: kökte (`main.tsx`) ve altı bölümün her birinde ayrı bir
`ErrorBoundary` (`src/components/ErrorBoundary.tsx`) var; bir bölüm çökerse
yalnızca o bölüm bir hata kartı gösterir, diğer beşi normal çalışmaya devam
eder — hata yığını yalnızca geliştirme modunda görünür. `createBrowserRouter`
rotalarına da ayrı bir `errorElement` bağlandı (canlı doğrulamada, react-router'ın
kendi dahili hata sınırının rota bileşenlerindeki hatayı kök `ErrorBoundary`'ye
hiç ulaştırmadığı ortaya çıktı — bkz. T-09 Tamamlanma Kaydı). Ağ hatası artık
tek bir genel mesaj yerine türüne göre ayrı başlık gösteriyor (bağlantı yok /
kayıt yok / arşiv yoğun / sunucu yanıtsız / bilinmeyen), yeniden denenebilir
olmayan hatalarda "Yeniden dene" düğmesi hiç çıkmıyor (T-09). Arama artık
toplam ve bölüm bazlı sonuç sayısını gösteriyor, sonuç yoksa altı boş bölüm
yerine tek bir açıklayıcı ekran çıkıyor (T-09). Daha önce sessizce çekilip
gösterilmeyen `holidays` verisi artık Zaman Tüneli'nin üstünde bir "Bugünün
anlamı" şeridi olarak görünüyor; Karanlık Dosyalar ve Bilim & Keşif'te altıdan
(sırasıyla üçten) fazla kayıt varsa "N … daha göster" düğmesiyle tamamı
açılabiliyor; 4 saniyeyi geçen yüklemelerde ek bir uyarı satırı beliriyor (T-09).
Editör içeriği artık 366 günün 10'u değil **60'ında** (%16,4) — 1.001 satırlık
tek `curated.ts` dosyası silinip yerine bir tip dosyası (`src/data/types.ts`) ve
12 ay dosyasından (`src/data/gunler/`) oluşan, `src/data/index.ts` üzerinden
birleşen bir yapı kuruldu; mevcut 10 günün içeriği birebir korundu, 50 yeni gün
(Türkiye tarihi, dünya dönüm noktaları, bilim & keşif, kültür & karanlık arşiv)
kaynak doğrulamasıyla eklendi (T-10). Otomatik sınıflandırma (`classifyItem`/
`detectDarkItem`) artık bağımsız bir modülde (`src/lib/classification.ts`) ve
"ilk eşleşen kazanır" yerine puanlama kullanıyor; en az %85 hedefine karşı
altın kümede **%100** kategori doğruluğu, karanlık dosyalarda **0 yanlış
pozitif** ölçüldü (`npm run siniflandirma`, T-11). Test/lint/format altyapısı
artık var: Vitest ile 203 test, ESLint + Prettier, tek komutla hepsini
çalıştıran `npm run kontrol`, ve GitHub Actions CI (T-12). Uygulama artık
ölçülmüş biçimde daha hızlı: Yayın Modu ayrı bir pakete alınıp yalnızca
düğmeye basılınca iniyor (`React.lazy`), Google Fonts isteği gerçek kullanıma
göre daraltıldı ve render-blocking olmaktan çıkarıldı, ticker hızı öğe
sayısına göre değişiyor, mobilde ambiyans animasyonları kapanıyor, ekran dışı
bölümler `content-visibility:auto` ile render maliyetinden muaf tutuluyor,
Tailwind artık proje belgelerini (`Dokumanlar/`/`Talimatlar/`) taramıyor.
`App.tsx` 1.079 satırdan **244**'e indi — veri birleştirme mantığı
`src/hooks/useGunVerisi.ts`'e, sunum dokuz yeni bileşen dosyasına ayrıştırıldı;
arama artık tek bir yerde süzülüyor (üst bar sayacı ile bölümler aynı, tutarlı
sonucu paylaşıyor). Lighthouse'ta **ilk kez** Performans, Erişilebilirlik ve
SEO birlikte, gerçek bir üretim derlemesine karşı ölçüldü: **92 / 96 / 100**
(T-13). **Sapma:** İlk paket boyutunda hedeflenen ≥%15 küçülme
gerçekleşmedi — T-10'un eklediği 60 günlük içerik verisi paketin çoğunluğunu
oluşturuyor ve tembel yüklemesi ayrı bir talimatı (PLAN-02 adayı) gerektiriyor;
ayrıntı → `MIMARI.md` §7.

**Eksik / hatalı:** Ayrıntılı liste ve kanıtlar için → [`ANALIZ-RAPORU.md`](ANALIZ-RAPORU.md)
Özet başlıklar:

- ~~Takvimde artık yıl kaynaklı gün-sayısı hatası~~ ✅ **T-03 ile çözüldü**
- ~~Gün değişince sayaçların güncellenmemesi~~ ✅ **T-04 ile çözüldü**
- ~~Sekme arka planda açıldığında sayfanın tamamen boş görünmesi~~ ✅ **T-04 ile çözüldü**
- ~~"Önceki gün" / "Sonraki gün" / "Bugüne dön" düğmelerinin dekoratif arka plan
  katmanı yüzünden tıklanamaması ve görünmemesi~~ ✅ **T-15 ile çözüldü** (K-5 —
  T-03'te keşfedilmiş, 10 talimat boyunca atanmamıştı; dekor katmanları kartın
  kendi sarmalayıcısına alındı) → ayrıntı [`ANALIZ-RAPORU.md`](ANALIZ-RAPORU.md)
- ~~HMR WebSocket'inin sabit porta bağlı olması~~ ✅ **T-01 ile çözüldü**
- ~~Kullanılmayan 10 bağımlılık (paket boyutu ve kurulum süresi)~~ ✅ **T-01 ile çözüldü**
- ~~`başlat.bat`'ın PowerShell ile elle port araması~~ ✅ **T-02 ile çözüldü**
- ~~Editör ayarı / `.env` iskeleti / macOS-Linux başlatıcı yokluğu~~ ✅ **T-02 ile çözüldü**
- ~~Ağ isteklerinde iptal yoktu, TR doluyken bile EN her zaman boşuna çekiliyordu,
  `localStorage` yedeğinde TTL/temizlik yoktu~~ ✅ **T-05 ile çözüldü**
- ~~Paylaşılabilir URL / yönlendirme yok~~ ✅ **T-06 ile çözüldü**
- ~~Klavye ile gezinme ve ekran okuyucu desteği yoktu~~ ✅ **T-07 ile çözüldü**
  (ayrıntı → [`ANALIZ-RAPORU.md`](ANALIZ-RAPORU.md) O-6, O-7)
- **Bulgu (T-07 sırasında, gerçek bir Lighthouse denetimiyle keşfedildi, hâlâ açık):**
  `text-brand` rengi (#d23b2e) koyu zeminde metin/simge olarak kullanıldığında üç
  yerde AA kontrastını karşılamıyor (Karanlık Dosyalar rozeti/düğmesi, haber bandı
  başlığı) — O-10, henüz bir talimata atanmadı →
  [`ANALIZ-RAPORU.md`](ANALIZ-RAPORU.md#7-t-07-sırasında-keşfedilen-yeni-bulgular-2026-08-21)
- ~~Favicon, PWA, SEO meta eksik~~ ✅ **T-08 ile çözüldü** (service worker'ın canlı
  kaydı bir sonraki oturumda gerçek tarayıcıda doğrulanmalı — bkz. T-08 Tamamlanma Kaydı)
- ~~Hata sınırı (ErrorBoundary) yoktu, `holidays` verisi gösterilmiyordu, karanlık
  dosyalar/bilim 6-3 sınırında sessizce kesiliyordu, arama sonuç sayacı yoktu~~
  ✅ **T-09 ile çözüldü** (O-5, O-9, m-3, m-6) — canlı doğrulama sırasında
  react-router'ın kendi dahili hata sınırının kök `ErrorBoundary`'yi etkisiz
  kıldığı ortaya çıktı ve `errorElement` ile düzeltildi, bkz. T-09 Tamamlanma Kaydı
- **Bulgu (T-09 sırasında keşfedildi, hâlâ açık):** Vikipedi TR "bugün tarihte"
  şablonunun `holidays` alanı bazı günlerde şablon/navigasyon artığı tek harfli
  çöp kayıtlar döndürüyor (ör. 29 Ekim'de "g", "t", "d") — veri üretimi `wiki.ts`
  (T-05) kapsamında olduğu için T-09 bilinçli olarak dokunmadı, yalnızca geleni
  gösterdi → ayrıntı [`ANALIZ-RAPORU.md`](ANALIZ-RAPORU.md#8-t-09-sırasında-keşfedilen-yeni-bulgu-2026-08-22) (O-11)
- ~~Editör içeriği 366 günün yalnızca 10'unda~~ ✅ **T-10 ile çözüldü** (60'a çıkarıldı,
  veri 12 ay dosyasına bölündü)
- **Bulgu (T-10 sırasında keşfedildi, hâlâ açık):** Bilim & Keşif bölümündeki
  (`allScience`) editör kayıtları, Zaman Tüneli'nin aksine, Vikipedi'nin aynı
  olayına karşı ayıklanmıyor — bir bilim dönüm noktası hem editör kaydı hem
  Vikipedi'nin otomatik akışında geçiyorsa iki kez görünebiliyor (canlı olarak
  18 Mart'ta doğrulandı). Düzeltmesi `ScienceMilestone` tipine `matchKeys`
  benzeri bir alan eklemeyi gerektirdiği için T-10 bilinçli olarak dokunmadı
  (kapsamı "yalnızca veri") — O-12, henüz bir talimata atanmadı →
  [`ANALIZ-RAPORU.md`](ANALIZ-RAPORU.md#9-t-10-sırasında-keşfedilen-yeni-bulgu-2026-08-22)
  (T-11 sırasında canlı olarak yeniden doğrulandı, hâlâ düzeltilmedi — T-11'in
  kapsamı yalnızca `classifyItem`/`detectDarkItem`'dı, `ScienceMilestone`'a dokunmadı)
- ~~Otomatik sınıflandırma "ilk eşleşen kazanır", ölçülmemiş, bilinen yanlış
  pozitif tuzakları vardı~~ ✅ **T-11 ile çözüldü** (puanlama + öncelik sırası +
  karanlık eşiği; altın kümede %100 kategori doğruluğu, 0 yanlış pozitif) —
  ayrıntı [`ANALIZ-RAPORU.md`](ANALIZ-RAPORU.md#u-3-otomatik-sınıflandırma-kalitesi-ölçülmemiş--✅-çözüldü-t-11).
  **Bilinçli olarak kapsam dışı bırakılan iki bulgu:** `genel` oranı bazı
  günlerde talimatın önerdiği %40 eşiğinin üstünde kalıyor (ortalama ~%45,
  resmî ölçütlerin hiçbiri bundan etkilenmiyor); anahtar kelime taraması bir
  felaket sözcüğünün cümlenin konusu mu yoksa yalnızca bir tarihleme ifadesi mi
  olduğunu ayıramıyor (ör. "X faciasının yıl dönümünde Y oldu" hâlâ karanlık
  sayılabiliyor — en yaygın biçim, "... nedeniyle ertelendi", düzeltildi) →
  ayrıntı T-11 Tamamlanma Kaydı
- ~~Test, lint, format altyapısı yok~~ ✅ **T-12 ile çözüldü** (Vitest ·
  203 test · `src/lib` %78,78 satır kapsamı · ESLint + Prettier ·
  `npm run kontrol` · CI) — ayrıntı
  [`ANALIZ-RAPORU.md`](ANALIZ-RAPORU.md#u-5-kalite-güvencesi-altyapısı-hiç-yok--✅-çözüldü-t-12)
- ~~`NAV[stats.indexOf(s)]` kırılgan bağımlılığı, ticker'ın öğe sayısından
  bağımsız sabit hızı~~ ✅ **T-13 ile çözüldü** (m-1, m-4) — ayrıca kod bölme
  (`BroadcastMode` artık `React.lazy`), font daraltma, `content-visibility`,
  `App.tsx`'in 244 satıra bölünmesi ve arama tekilleştirmesi de bu talimatta;
  Lighthouse ilk kez Performans+Erişilebilirlik+SEO birlikte ölçüldü:
  92/96/100 — ayrıntı [`MIMARI.md`](MIMARI.md) §7, §11
- **Bulgu (T-13 sırasında, `npm audit` ile keşfedildi, hâlâ açık):**
  `react-router-dom`'un dolaylı bağımlılığı `react-router`'da 2 orta seviye
  güvenlik danışma kaydı var (açık yönlendirme + SSR hydration enjeksiyonu —
  bu proje SSR yapmadığı için ikincisi muhtemelen uygulanmıyor). Düzeltmesi
  kırılma içeren bir `react-router-dom@7.x` yükseltmesi gerektiriyor, T-13'ün
  kapsamı dışında bırakıldı — O-13, henüz bir talimata atanmadı →
  [`ANALIZ-RAPORU.md`](ANALIZ-RAPORU.md#o-13-react-router-domun-dolaylı-bağımlılığı-react-routerda-2-orta-seviye-güvenlik-danışma-kaydı)

**Çalışma planı:** [`../Talimatlar/`](../Talimatlar/) klasöründe. İş akışı için
→ [`CALISMA-SISTEMI.md`](CALISMA-SISTEMI.md)

---

## 8. Yapay Zekâ Asistanı İçin Notlar

Bu projede çalışırken:

1. **Önce bu dosyayı, sonra `ANALIZ-RAPORU.md`'yi oku.**
2. Görev al: `Talimatlar/` klasöründeki bir `T-xx-*.md` dosyası senin görev tanımındır.
   Talimatın **Kabul Kriterleri** bölümünü karşılamadan bitmiş sayma.
3. Bitirince talimat dosyasını `Talimatlar/Tamamlandı/` klasörüne taşı ve dosyanın
   sonundaki *Tamamlanma Kaydı* bölümünü doldur.
4. Türkçe karakterleri bozma. Dosyaları UTF-8 (BOM'suz) yaz. `.bat` dosyaları CRLF olmalı.
5. `npm run kontrol` (typecheck+lint+test+build, T-12) yeşil kalmadan hiçbir talimatı kapatma.
6. Bir talimat başka bir talimatın işine giriyorsa **girme** — kapsamı koru, notu
   ilgili talimata düş.
