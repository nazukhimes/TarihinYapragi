# PLAN-01 · Temel Düzeltme ve Tamamlama

| Alan | Değer |
|---|---|
| **Oluşturulma** | 2026-08-21 |
| **Durum** | 🟡 Aktif — 8 / 14 tamamlandı |
| **Son hareket** | 2026-08-21 · T-08 tamamlandı |
| **Talimat sayısı** | 14 (T-01 … T-14) |
| **Faz sayısı** | 5 |
| **Dayanak** | [`../Dokumanlar/ANALIZ-RAPORU.md`](../Dokumanlar/ANALIZ-RAPORU.md) |
| **İş akışı** | [`../Dokumanlar/CALISMA-SISTEMI.md`](../Dokumanlar/CALISMA-SISTEMI.md) |

---

## 1. Planın Amacı

Tarih Yaprağı bugün **çalışan ama yarım** bir uygulama. Bu plan onu
**yayınlanabilir, bakımı yapılabilir ve içerik olarak dolu** bir ürüne taşır.

Plan bittiğinde:

- Görünen hiçbir bilgi yanlış olmayacak (takvim, sayaçlar).
- Her gün paylaşılabilir bir adrese sahip olacak.
- Uygulama sosyal medyada düzgün önizlenecek, telefona kurulabilecek.
- Bir hata tüm sayfayı çökertmeyecek.
- Kritik mantık testlerle korunacak.
- Editör içeriği 10 günden anlamlı bir kapsama çıkacak ve **büyütülebilir** olacak.

## 2. Kapsam Dışı (bu planda yapılmayacak)

| Konu | Neden | Ne zaman |
|---|---|---|
| Backend / veritabanı | Ürün istemci taraflı çalışıyor, ihtiyaç yok | Kullanıcı hesabı gerekirse |
| Kullanıcı hesabı, favori, not | Ürün henüz bunu gerektirmiyor | PLAN-02+ |
| Çoklu dil arayüzü (i18n) | Hedef kitle Türkçe | PLAN-02+ |
| Tasarım dilinin değiştirilmesi | Mevcut tasarım güçlü, korunacak | — |
| Yapay zekâ ile içerik üretimi | Editör kalitesi korunmalı | Ayrı değerlendirme |

---

## 3. Fazlar ve Talimatlar

### FAZ 0 — Temizlik ve Zemin
*Sonraki her işin üzerine basacağı düz zemin. Önce burası.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| ~~T-01~~ ✅ | [Proje kimliği ve bağımlılık temizliği](Tamamland%C4%B1/T-01-proje-kimligi-ve-bagimlilik-temizligi.md) | 🔴 Kritik | O-1, O-2, O-3, K-4, m-2 | ~2 sa |
| ~~T-02~~ ✅ | [Geliştirme ortamı ve başlatıcı](Tamamland%C4%B1/T-02-gelistirme-ortami-ve-baslatici.md) | 🟠 Yüksek | — | ~1,5 sa |

### FAZ 1 — Kritik Hata Düzeltmeleri
*Kullanıcının gördüğü yanlış bilgiler. Doğruluk her şeyden önce gelir.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| ~~T-03~~ ✅ | [Takvim ve tarih doğruluğu](Tamamland%C4%B1/T-03-takvim-tarih-dogrulugu.md) | 🔴 Kritik | K-1 | ~2 sa |
| ~~T-04~~ ✅ | [Sayaç ve görünürlük hataları](Tamamland%C4%B1/T-04-sayac-ve-gorunurluk-hatalari.md) | 🔴 Kritik | K-2, K-3 | ~2,5 sa |
| ~~T-05~~ ✅ | [Ağ katmanı sağlamlaştırma](Tamamland%C4%B1/T-05-ag-katmani-saglamlastirma.md) | 🟠 Yüksek | O-4, O-8 | ~3 sa |

### FAZ 2 — Ürün Kabuğu
*Uygulamayı "web sitesi" yapan katman: paylaşım, simge, hata dayanıklılığı, erişilebilirlik.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| ~~T-06~~ ✅ | [Yönlendirme ve paylaşılabilir bağlantı](Tamamland%C4%B1/T-06-yonlendirme-ve-paylasilabilir-baglanti.md) | 🔴 Kritik | U-1 | ~4 sa |
| ~~T-07~~ ✅ | [Erişilebilirlik ve klavye](Tamamland%C4%B1/T-07-erisilebilirlik-ve-klavye.md) | 🟠 Yüksek | O-6, O-7 | ~3,5 sa |
| ~~T-08~~ ✅ | [Site kimliği: favicon, SEO, PWA](Tamamland%C4%B1/T-08-site-kimligi-favicon-seo-pwa.md) | 🟠 Yüksek | U-4 | ~3 sa |
| T-09 | [Hata sınırı ve durum ekranları](T-09-hata-siniri-ve-durum-ekranlari.md) | 🟠 Yüksek | O-5, O-9, m-3, m-6 | ~3 sa |

### FAZ 3 — İçerik
*Uygulamanın asıl değeri. En uzun soluklu faz.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| T-10 | [İçerik mimarisi ve kapsam genişletme](T-10-icerik-mimarisi-ve-kapsam.md) | 🟠 Yüksek | U-2 | ~6 sa+ |
| T-11 | [Sınıflandırma doğruluğu](T-11-siniflandirma-dogrulugu.md) | 🟡 Orta | U-3 | ~4 sa |

### FAZ 4 — Kalite Güvencesi
*Buraya kadar yapılan her şeyi koruyan çit.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| T-12 | [Test, lint ve biçimlendirme altyapısı](T-12-test-lint-bicimlendirme.md) | 🟠 Yüksek | U-5 | ~4 sa |
| T-13 | [Performans ve derleme iyileştirmesi](T-13-performans-ve-derleme.md) | 🟡 Orta | m-4, m-5, perf | ~3 sa |

### FAZ 5 — Kapanış
*Belgeleri gerçeğe eşitle, yayına al.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| T-14 | [Dokümantasyon güncelleme ve yayın](T-14-dokumantasyon-ve-yayin.md) | 🟠 Yüksek | — | ~2,5 sa |

**Toplam tahmini süre:** ~44 saat

---

## 4. Bağımlılık Haritası

```
T-01 ──┬─► T-02
       │
       ├─► T-03 ──┐
       ├─► T-04 ──┤
       └─► T-05 ──┤
                  │
                  ├─► T-06 ──┬─► T-08
                  ├─► T-07 ──┤
                  └─► T-09 ──┘
                             │
              T-10 ──────────┤   (T-01 sonrası her an başlanabilir)
              T-11 ──────────┤   (T-10 ile paralel yürüyebilir)
                             │
                             ├─► T-12 ──► T-13
                             │
                             └───────────► T-14  (EN SON)
```

### Kesin kurallar

- ~~**T-01 ilk sırada.**~~ ✅ **2026-08-21'de tamamlandı.** Zemin hazır: `vite.config.ts`
  boş portu kendi buluyor, HMR her portta çalışıyor, kullanılmayan 12 bağımlılık kalktı.
  Artık T-02 ve T-03/T-04/T-05 açık.
- ~~**T-02.**~~ ✅ **2026-08-21'de tamamlandı.** `başlat.bat` sadeleştirildi, `baslat.sh`
  eklendi, editör/ortam sözleşmeleri (`.editorconfig`, `.nvmrc`, `.vscode/*`) kuruldu,
  `wiki.ts`'teki gömülü API URL'si `src/lib/config.ts` + `.env.example` üzerinden
  ortam değişkenine taşındı. Artık T-03/T-04/T-05 açık.
- ~~**T-03.**~~ ✅ **2026-08-21'de tamamlandı.** `src/lib/date.ts` eklendi
  (`isLeapYear`, `daysInMonth`, `dayOfYear`, `weekdayIndex`); `leaf.tsx`'teki 2024
  referans sabiti tamamen kaldırıldı. K-1 çözüldü. **Yeni bulgu:** doğrulama
  sırasında gün gezinme düğmelerinin (Önceki/Sonraki/Bugüne dön) bir CSS yığılım
  hatası yüzünden gerçek tıklamayla tetiklenemediği keşfedildi (K-5,
  `ANALIZ-RAPORU.md`'ye eklendi, henüz bir talimata atanmadı — T-04 önerilir).
- ~~**T-04.**~~ ✅ **2026-08-21'de tamamlandı.** Yeni `src/lib/useInView.ts`:
  181 ayrı `IntersectionObserver` yerine tek paylaşılan gözlemci + `setTimeout`
  güvenlik ağı. `Reveal` ve `CountUp` bu hook'u kullanacak şekilde yeniden
  yazıldı (dışa aktarılan props değişmedi). K-2 (sayaçların gün değişiminde
  donması) ve K-3 (sekme arka plandayken sayfanın tamamen boş görünmesi)
  çözüldü. K-5'e **bilinçli olarak dokunulmadı** — kapsamı yalnızca K-2/K-3
  idi, K-5 ayrı bir CSS yığılım hatası (bkz. T-03 notu yukarıda), hâlâ hiçbir
  talimata atanmadı. Artık T-05 açık.
- ~~**T-05.**~~ ✅ **2026-08-21'de tamamlandı.** `src/lib/wiki.ts` ağ/önbellek katmanı
  baştan yazıldı: TR önce denenir, üç ana alandan (`events`/`births`/`deaths`) biri
  boşsa EN tamamlayıcı olarak çekilir (TR dolu bir günde istek 2'den 1'e indi);
  `reqId` kaldırıldı, yerine gün değişiminde önceki isteği kesen `AbortController`
  geldi; `localStorage` yedeği `savedAt` zaman damgası + 24 saatlik TTL taşıyor
  (süresi dolan veri atılmaz, `stale:true` ile döner, arayüzde bakır renkle
  belirtilir); `pruneCache()` (60 kayıt) ve `memSet()` (40 kayıt, FIFO) önbellek
  sınırlarını uyguluyor; `DayError` tipi 404/429/5xx/ağ hatasını ayrı `kind`'lara
  sınıflandırıyor, 429/5xx en fazla 2 deneniyor. O-4 ve O-8 çözüldü. **FAZ 1 tamamen
  bitti (T-01…T-05).** T-06 zaten T-04 sonrasında açıktı (bağımlılığı T-01/T-03/T-04);
  T-05'in tamamlanmasıyla T-09'un iki bağımlılığından biri (`DayError` tipi) de
  karşılandı — T-09 hâlâ T-06'yı bekliyor. T-07 ve T-08 da hâlâ T-06'ya bağımlı.
- ~~**T-06.**~~ ✅ **2026-08-21'de tamamlandı.** Yeni `src/lib/slug.ts`
  (`toDaySlug`/`parseDaySlug`, 366 gün çift yönlü test edildi); `src/main.tsx`
  `createBrowserRouter` ile `/`, `/:daySlug`, `*` (404) rotalarını kuruyor;
  `App.tsx`'te `day`/`month` `useState`'i tamamen kaldırıldı, URL tek doğruluk
  kaynağı oldu (`useParams` → `parseDaySlug`); sayısal biçim (`/08-21`) kanonik
  ad biçimine (`/21-agustos`) `replace` ile yönleniyor; yeni `NotFound.tsx` (404);
  Paylaş düğmesi eklendi (mobilde `navigator.share`, masaüstünde panoya kopyalama);
  `public/_redirects` + kök `vercel.json` ile üretim SPA yönlendirmesi. U-1 çözüldü.
  **Sapma:** Paylaş düğmesi, talimatın önerdiği gibi `CalendarLeaf`'in gezinme
  satırının *içine* değil, `App.tsx`'te ona komşu eklendi — hem `leaf.tsx`↔`slug.ts`
  döngüsel import'unu (canlı testte yakalandı) hem de K-5'in etkilediği DOM bölgesini
  atlamak için (ayrıntı → T-06 Tamamlanma Kaydı). **K-5 hâlâ atanmadı** — canlı olarak
  yeniden doğrulandı, hâlâ hiçbir talimatın kapsamında değil, T-07 için önerilir
  (aynı gezinme bölgesine dokunacak). Artık T-07 ve T-08 açık.
- ~~**T-07.**~~ ✅ **2026-08-21'de tamamlandı.** `ui.tsx`'teki `Modal`'a odak tuzağı
  (Tab döngüsü) + kapanışta odak iadesi + `titleId`→`aria-labelledby` eklendi;
  `Toaster` `role="status"`/`aria-live="polite"` taşıyor; "Ana içeriğe atla" bağlantısı
  ve `index.css`'e `.skip-link`/`.sr-only`/`:focus-visible` eklendi; arama girdileri
  `type="search"`+`aria-label` aldı; `--color-ink-faint` `#6f7481`→`#8b909c`
  (3,98:1→5,82:1, AA geçti); kategori çipleri `aria-pressed` taşıyor; `App.tsx`'e
  `←`/`→`/`T`/`/`/`?`/`Esc` global klavye kısayolları ve bir Kısayol Yardımı `Modal`'ı
  eklendi (arama girdisinde, Yayın Modu'nda ve açık bir `Modal` varken devre dışı);
  kişi kartı görsellerine `width`/`height` eklendi; altı bölüme `aria-labelledby`
  bağlandı. O-6 ve O-7 çözüldü. Gerçek bir Lighthouse denetimi (Bash üzerinden, Browser
  pane'den bağımsız) **89 → 96** iyileşme gösterdi; yol boyunca yakalanan iki bonus
  hata (ikon-only "Yayın Modu" düğmesinde `aria-label` eksikliği, `PeopleRow`'da
  `h4`→`h3` başlık sırası atlaması) de düzeltildi. **Yeni bulgu O-10** (`text-brand`
  koyu zeminde metin olarak yetersiz kontrast, üç yerde) keşfedildi, bilinçli olarak
  kapsam dışı bırakıldı — ayrıntı → `ANALIZ-RAPORU.md`. **K-5'e T-07 de dokunmadı**:
  talimatın 11 adımının hiçbiri `leaf.tsx`'e dokunmuyor (varsayılan aksine) ve K-5 bir
  fare/dokunmatik hatası olduğu için klavye kısayollarını etkilemiyor; hâlâ atanmadı,
  `leaf.tsx`'e gerçekten dokunacak bir talimata (T-13 veya yeni bir T-15) önerilir.
  T-08 ve T-09 zaten açıktı (bağımlılıkları yalnızca T-06'ydı), T-07'nin
  tamamlanması onları etkilemedi.
- ~~**T-08.**~~ ✅ **2026-08-21'de tamamlandı.** `IconLeafMark`'ın yol verisinden
  (`ui.tsx`) 7 marka görseli (`favicon.svg`/`.ico`, `apple-touch-icon.png`,
  `icon-192/512.png`, `icon-maskable-512.png` — güvenli alan payı bırakılmış,
  `og-image.png` 1200×630, Fraunces + IBM Plex Mono gömülü) `scripts/generate-brand-assets.mjs`
  ile üretildi; `index.html`'e favicon/`manifest`/`og:*`/`twitter:*`/`canonical`
  yer tutucusu/JSON-LD eklendi; `App.tsx`'e gün değişince `document.title` +
  `canonical` + meta açıklamayı güncelleyen bir `useEffect` eklendi (canlı
  doğrulandı — hem tam sayfa yüklemede hem `←`/`→` ile istemci taraflı geçişte
  çalışıyor); `scripts/sitemap.mjs` 366 adresi `npm run build`'a bağlı üretiyor;
  `vite-plugin-pwa` ile bir service worker (`NetworkFirst` Wikimedia API,
  `CacheFirst` Wikimedia görselleri) kuruldu. U-4 çözüldü. Gerçek bir Lighthouse
  denetimi (Bash üzerinden, Browser pane'den bağımsız) **SEO 100/100** verdi —
  yol boyunca `robots.txt`'teki göreli `Sitemap:` satırının geçersiz olduğu
  yakalandı ve talimatın kendi kod parçasından sapılarak mutlak yer tutucu
  URL'e düzeltildi (bkz. T-08 Tamamlanma Kaydı). **Servis çalışanının canlı
  kaydı bu oturumda doğrulanamadı** — Browser pane sandbox'ı service worker
  kaydını genel olarak engelliyor (kendi `sw.js`'i **ve** ilgisiz bir kontrol
  script'iyle aynı hata doğrulandı, bkz. Tamamlanma Kaydı); sunucu tarafı
  (`curl`/`fetch` ile doğru içerik + `Content-Type`) ve Workbox çıktısının
  kendisi doğrulandı. Bir sonraki oturumda gerçek bir tarayıcıda elle
  doğrulanmalı. K-5'e T-08 de dokunmadı (yalnızca `index.html`, `App.tsx`'in
  sonu, `vite.config.ts`, `public/`, `scripts/`).
- **T-14 en sonda.** Belgeler ancak her şey bitince gerçeğe eşitlenebilir.
- ~~**T-06 → T-08 sırası zorunlu.**~~ SEO meta etiketleri gün bazlı URL'lere
  bağlıydı — T-06 tamamlandı, URL şeması (`/gun-ay`) sabitlendi, T-08 bu şema
  üzerine yazıldı ve tamamlandı.
- **T-10 ve T-11 paralel yürüyebilir** ama T-11 tamamlanmadan T-10'un otomatik
  içerik kalitesi ölçülemez.
- **T-12 mümkün olduğunca erken.** T-03, T-04, T-11 testleri T-12 sonrası yazılırsa
  regresyon koruması gecikir. Zaman varsa T-12'yi FAZ 1'den sonra öne alın.

---

## 5. İlerleme Tablosu

> Bir talimat bitince buradaki durumu `✅ Tamamlandı` yapın ve tarih girin.

| # | Talimat | Durum | Tamamlanma | Not |
|---|---|---|---|---|
| T-01 | Proje kimliği ve bağımlılık temizliği | ✅ Tamamlandı | 2026-08-21 | 60 paket kaldırıldı · `node_modules` −47,1 MB · K-4 çözüldü · üretim paketi büyümedi. Tailwind kaynak taraması bulgusu → T-13 Adım 10 |
| T-02 | Geliştirme ortamı ve başlatıcı | ✅ Tamamlandı | 2026-08-21 | `başlat.bat` sadeleşti (PowerShell port taraması kalktı) · `baslat.sh` eklendi · `.editorconfig`/`.nvmrc`/`.vscode/*` kuruldu · API tabanı `config.ts` + `.env.example` üzerinden ortam değişkenine taşındı |
| T-03 | Takvim ve tarih doğruluğu | ✅ Tamamlandı | 2026-08-21 | `src/lib/date.ts` eklendi · 2024 sabiti kaldırıldı · "Yılın 233. günü" doğrulandı · Yeni bulgu K-5 (gezinme düğmeleri tıklanamıyor) → `ANALIZ-RAPORU.md` |
| T-04 | Sayaç ve görünürlük hataları | ✅ Tamamlandı | 2026-08-21 | `src/lib/useInView.ts` eklendi (tek paylaşılan gözlemci + `setTimeout` güvenlik ağı) · gözlemci sayısı 181→1 · `Reveal`/`CountUp` bu hook'u kullanıyor, props değişmedi · K-2 ve K-3 çözüldü · K-5'e bilinçli olarak dokunulmadı (kapsam dışı) |
| T-05 | Ağ katmanı sağlamlaştırma | ✅ Tamamlandı | 2026-08-21 | TR önce denenir, dolu günde EN hiç çekilmiyor (istek 2→1) · `AbortController` ile iptal, `reqId` kaldırıldı · `localStorage` `savedAt`/24s TTL, `stale` arayüzde bakır renkle gösteriliyor · `pruneCache()` 60 kayıt, `memSet()` 40 kayıt FIFO · `DayError` (404/429/5xx/ağ), 429/5xx'te en fazla 2 deneme · O-4, O-8 çözüldü |
| T-06 | Yönlendirme ve paylaşılabilir bağlantı | ✅ Tamamlandı | 2026-08-21 | `src/lib/slug.ts` eklendi (366 gün çift yönlü test edildi) · `createBrowserRouter` (`/`, `/:daySlug`, `*`) · `App.tsx`'te `day`/`month` `useState`'i kalktı, URL tek kaynak · `/08-21`→`/21-agustos` kanonikleşiyor · `NotFound.tsx` eklendi · Paylaş düğmesi (native share / panoya kopyalama) · `public/_redirects` + `vercel.json` · U-1 çözüldü · K-5 canlı yeniden doğrulandı, hâlâ atanmadı → T-07'ye önerilir |
| T-07 | Erişilebilirlik ve klavye | ✅ Tamamlandı | 2026-08-21 | `Modal` odak tuzağı + odak iadesi + `aria-labelledby` · `Toaster` `aria-live` · "Ana içeriğe atla" · arama `aria-label`/`type=search` · `ink-faint` kontrastı 3,98→5,82:1 · `aria-pressed` çipler · `←/→/T//? Esc` klavye kısayolları + Kısayol Yardımı modalı (Modal açıkken de devre dışı) · kişi görsellerine `width/height` · altı bölüme `aria-labelledby` · O-6, O-7 çözüldü · Lighthouse Erişilebilirlik 89→96 (yol boyunca 2 bonus hata da düzeltildi) · **Yeni bulgu O-10** (text-brand kontrastı) kapsam dışı bırakıldı · K-5'e T-07 de dokunmadı (leaf.tsx'e hiç dokunmadı, hâlâ atanmadı) |
| T-08 | Site kimliği: favicon, SEO, PWA | ✅ Tamamlandı | 2026-08-21 | 7 marka görseli `ui.tsx`'teki `IconLeafMark`'tan üretildi (`scripts/generate-brand-assets.mjs`) · `index.html`'e favicon/manifest/`og:*`/`twitter:*`/canonical/JSON-LD eklendi · `App.tsx`'te gün bazlı dinamik başlık/canonical `useEffect`'i (canlı doğrulandı) · `scripts/sitemap.mjs` 366 adresi `build`'e bağlı üretiyor · `vite-plugin-pwa` ile service worker kuruldu · Lighthouse SEO **100/100** (yol boyunca `robots.txt`'teki göreli `Sitemap:` satırı düzeltildi) · U-4 çözüldü · Service worker'ın canlı kaydı Browser pane sandbox kısıtı yüzünden doğrulanamadı, sonraki oturumda gerçek tarayıcıda kontrol edilmeli |
| T-09 | Hata sınırı ve durum ekranları | ⬜ Bekliyor | | |
| T-10 | İçerik mimarisi ve kapsam genişletme | ⬜ Bekliyor | | |
| T-11 | Sınıflandırma doğruluğu | ⬜ Bekliyor | | |
| T-12 | Test, lint ve biçimlendirme altyapısı | ⬜ Bekliyor | | |
| T-13 | Performans ve derleme iyileştirmesi | ⬜ Bekliyor | | |
| T-14 | Dokümantasyon güncelleme ve yayın | ⬜ Bekliyor | | |

**İlerleme:** 8 / 14 · `████████████░░░░░░░░░` %57

---

## 6. Başarı Ölçütleri

Plan ancak aşağıdakilerin tamamı doğruysa kapatılabilir:

### Doğruluk
- [x] "Yılın X. günü" değeri her yıl ve her gün için doğru
- [x] Sayaçlar gün değişiminde doğru güncelleniyor
- [x] 29 Şubat dahil hiçbir kenar durumda yanlış bilgi yok

### Sağlamlık
- [x] Sekme arka planda açılsa bile içerik görünüyor
- [ ] Bir bileşen hata verse bile sayfa çökmüyor, kullanıcı mesaj görüyor
- [x] Hızlı gün değiştirmede eski istekler iptal ediliyor
- [x] Çevrimdışı yedek TTL'li çalışıyor

### Ürün
- [x] Her gün için paylaşılabilir bir URL var (örn. `/21-agustos`)
- [x] Tarayıcı geri/ileri tuşu gün geçişinde çalışıyor
- [x] Bağlantı sosyal medyada başlık + görselle önizleniyor (T-08 — statik `og:*`/`twitter:*`;
      gün bazlı önizleme PLAN-02 kapsamında, bkz. T-08 Mevcut Durum sınırı)
- [x] Favicon var, telefona uygulama olarak eklenebiliyor (T-08 — statik ön koşullar tam;
      service worker'ın canlı kaydı bu oturumda doğrulanamadı, bkz. T-08 Tamamlanma Kaydı)
- [x] Klavye ile tam gezinme mümkün, ekran okuyucu bildirimleri duyuyor (T-07 — bu kutu o
      talimatta işaretlenmemiş kalmıştı, burada düzeltildi)

### İçerik
- [ ] Editör içeriği en az 60 günde mevcut
- [ ] İçerik dosya yapısı 366 güne ölçekleniyor
- [ ] Sınıflandırma doğruluğu test edilmiş ve ölçülü

### Kalite
- [ ] `npm run typecheck` yeşil
- [ ] `npm run build` yeşil
- [ ] `npm run lint` yeşil
- [ ] `npm test` yeşil, kritik saf fonksiyonlar kapsanmış
- [ ] Lighthouse: Performans ≥ 90, Erişilebilirlik ≥ 95, SEO ≥ 95

### Belge
- [ ] `BAGLAM.md` gerçeği yansıtıyor
- [ ] `KULLANIM-KILAVUZU.md` yeni özellikleri içeriyor
- [ ] `README.md` dolu

---

## 7. Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| Wikimedia API'si değişir / hız sınırı uygular | Düşük | Yüksek | T-05'te TTL'li önbellek ve zarif düşüş; API sözleşmesi tek dosyada (`wiki.ts`) izole |
| İçerik yazımı (T-10) tahminden çok uzun sürer | **Yüksek** | Orta | T-10 partilere bölündü; her parti bağımsız teslim edilebilir |
| Yönlendirme (T-06) mevcut durum akışını bozar | Orta | Yüksek | Önce T-03/T-04 bitmeli; URL yalnızca `day`/`month` state'ini yansıtsın, ikinci doğruluk kaynağı olmasın |
| Sınıflandırma iyileştirmesi (T-11) mevcut doğru eşleşmeleri bozar | Orta | Orta | T-12'nin test altyapısı önce kurulmalı; anlık görüntü (snapshot) testi ile korunmalı |
| Kapsam kayması — "bir de şunu yapayım" | **Yüksek** | Yüksek | Her talimatta *Kapsam Dışı* bölümü zorunlu |

---

## 8. Kapanış Özeti

> Plan tamamlandığında doldurulacak.

- **Kapanış tarihi:**
- **Gerçekleşen süre:**
- **Tamamlanan talimatlar:** / 14
- **Kapsam dışı bırakılanlar ve gerekçesi:**
- **PLAN-02'ye devredilen konular:**
- **Öğrenilenler:**
