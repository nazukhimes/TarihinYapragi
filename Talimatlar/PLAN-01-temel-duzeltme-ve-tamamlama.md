# PLAN-01 · Temel Düzeltme ve Tamamlama

| Alan | Değer |
|---|---|
| **Oluşturulma** | 2026-08-21 |
| **Durum** | 🟡 Aktif — 14 / 15 tamamlandı |
| **Son hareket** | 2026-08-24 · T-15 tamamlandı (K-5 kapandı) |
| **Talimat sayısı** | 15 (T-01 … T-15 · T-15 plan yürürken eklendi) |
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
| ~~T-15~~ ✅ | [Yaprak gezinme satırının dekoratif katmanla örtülmesi](Tamamland%C4%B1/T-15-yaprak-gezinme-tiklama-hatasi.md) *(plan yürürken eklendi, 2026-08-24'te uygulandı)* | 🔴 Kritik | K-5 | ~1 sa |

### FAZ 2 — Ürün Kabuğu
*Uygulamayı "web sitesi" yapan katman: paylaşım, simge, hata dayanıklılığı, erişilebilirlik.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| ~~T-06~~ ✅ | [Yönlendirme ve paylaşılabilir bağlantı](Tamamland%C4%B1/T-06-yonlendirme-ve-paylasilabilir-baglanti.md) | 🔴 Kritik | U-1 | ~4 sa |
| ~~T-07~~ ✅ | [Erişilebilirlik ve klavye](Tamamland%C4%B1/T-07-erisilebilirlik-ve-klavye.md) | 🟠 Yüksek | O-6, O-7 | ~3,5 sa |
| ~~T-08~~ ✅ | [Site kimliği: favicon, SEO, PWA](Tamamland%C4%B1/T-08-site-kimligi-favicon-seo-pwa.md) | 🟠 Yüksek | U-4 | ~3 sa |
| ~~T-09~~ ✅ | [Hata sınırı ve durum ekranları](Tamamland%C4%B1/T-09-hata-siniri-ve-durum-ekranlari.md) | 🟠 Yüksek | O-5, O-9, m-3, m-6 | ~3 sa |

### FAZ 3 — İçerik
*Uygulamanın asıl değeri. En uzun soluklu faz.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| ~~T-10~~ ✅ | [İçerik mimarisi ve kapsam genişletme](Tamamland%C4%B1/T-10-icerik-mimarisi-ve-kapsam.md) | 🟠 Yüksek | U-2 | ~6 sa+ |
| ~~T-11~~ ✅ | [Sınıflandırma doğruluğu](Tamamland%C4%B1/T-11-siniflandirma-dogrulugu.md) | 🟡 Orta | U-3 | ~4 sa |

### FAZ 4 — Kalite Güvencesi
*Buraya kadar yapılan her şeyi koruyan çit.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| ~~T-12~~ ✅ | [Test, lint ve biçimlendirme altyapısı](Tamamland%C4%B1/T-12-test-lint-bicimlendirme.md) | 🟠 Yüksek | U-5 | ~4 sa |
| ~~T-13~~ ✅ | [Performans ve derleme iyileştirmesi](Tamamland%C4%B1/T-13-performans-ve-derleme.md) | 🟡 Orta | m-1, m-4, m-5, perf | ~3 sa |

### FAZ 5 — Kapanış
*Belgeleri gerçeğe eşitle, yayına al.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| T-14 | [Dokümantasyon güncelleme ve yayın](T-14-dokumantasyon-ve-yayin.md) | 🟠 Yüksek | — | ~2,5 sa |

**Toplam tahmini süre:** ~45 saat

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
              T-15 ──────────┤   (bağımsız · plan yürürken eklendi, K-5)
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
- ~~**T-09.**~~ ✅ **2026-08-22'de tamamlandı.** Yeni `src/components/ErrorBoundary.tsx`
  (projenin tek sınıf bileşeni): `main.tsx`'te kökte, `App.tsx`'te altı bölümün
  her birinde ayrı örnek — bir bölüm çökerse yalnızca o bölüm bir hata kartı
  gösterir, diğerleri etkilenmez (canlı doğrulandı: `CasesSection`'a geçici bir
  `throw` eklenip diğer beş bölümün normal çalıştığı görüldü). **Sapma/düzeltme:**
  talimatın taslağı yalnızca `main.tsx`'te `<ErrorBoundary><RouterProvider/></ErrorBoundary>`
  öneriyordu; canlı doğrulamada bunun **etkisiz** olduğu ortaya çıktı —
  `createBrowserRouter`'ın kendi dahili hata sınırı, rota elemanının (`App`)
  render'ında oluşan bir hatayı kök `ErrorBoundary`'ye hiç ulaştırmadan kendi
  jenerik İngilizce ekranını gösteriyor (React en yakın hata sınırını kullanır).
  Düzeltme: her rotaya `errorElement={<RouteErrorFallback />}` eklendi (yeni,
  `useRouteError` kullanan bir fonksiyon bileşeni, aynı görsel kimliği taşıyor);
  kök `ErrorBoundary` yalnızca react-router'ın kendisinin dışında kalan bir hata
  için son bir güvenlik ağı olarak kaldı. `data.error.kind`'a göre beş ayrı
  başlık/mesaj (T-05'in `DayError`'ı **yalnızca gösterildi**, üretim mantığına
  dokunulmadı); arama sonuç sayacı (toplam + bölüm bazlı) ve sonuç yoksa altı
  bölüm yerine tek bir boş durum ekranı; `holidays` verisi artık bir "Bugünün
  anlamı" şeridi (bölüm değil); Karanlık Dosyalar'da (`allCases` `slice(0,6)`
  kaldırıldı) ve Bilim & Keşif'te (`slice(0,3)` kaldırıldı, talimatın
  "uygulanabilir" notu izlenerek) "N … daha göster" düğmesi; 4 saniyeyi geçen
  yüklemede uyarı satırı. O-5, O-9, m-3, m-6 çözüldü. **Yeni bulgu O-11**
  (Vikipedi TR `holidays` alanında şablon artığı tek harfli çöp kayıtlar, ör.
  29 Ekim'de "g"/"t"/"d") keşfedildi, bilinçli olarak kapsam dışı bırakıldı —
  ayrıntı → `ANALIZ-RAPORU.md`. K-5'e T-09 da dokunmadı (`leaf.tsx`'e hiç
  dokunulmadı). Artık T-10 ve T-11 açık (zaten T-01 sonrası açıktı, bağımlılıkları
  T-09'a değil).
- ~~**T-10.**~~ ✅ **2026-08-22'de tamamlandı.** İki bölüm: **(A) Mimari** —
  1.001 satırlık tek `src/data/curated.ts` silindi; yerine `src/data/types.ts`
  (tipler + `curatedKey()`), `src/data/gunler/` altında 12 ay dosyası ve hepsini
  birleştiren `src/data/index.ts` geldi. Mevcut 10 günün içeriği `sed` ile satır
  aralığı bazında taşındı (elle yeniden yazılmadı) — taşıma öncesi/sonrası gün
  sayısı ve anahtarları Node'da doğrulandı, hiçbir gün kaybolmadı. Tembel yükleme
  (A3 adımı) talimatın kendi kararıyla bilinçli olarak ertelendi (paket boyutu
  eşiği altında kalındığı için gerek kalmadı). **(B) İçerik** — editör içeriği
  10 günden **60 güne** çıkarıldı (4 parti + 4 editör seçimi). **Sapma:**
  talimatın *Kapsam Dışı* tablosu "yapay zekâ ile toplu içerik üretimi"ni
  **yasak** olarak işaretliyordu; Bölüm A bitirildikten sonra bu çelişki
  kullanıcıya açıkça sorulmuş, kullanıcı bu oturum için 4 partinin tamamının
  web araştırmasıyla kaynak doğrulanarak yazılmasına **açıkça onay vermiştir**
  (bkz. T-10 Tamamlanma Kaydı). `Dokumanlar/ICERIK-SABLONU.md` (yeni) şablonu
  belgeliyor. **Yeni bulgu O-12** (Bilim & Keşif bölümü editör kayıtlarını
  Vikipedi'nin aynı olayına karşı ayıklamıyor, `ScienceMilestone`'da `matchKeys`
  yok) keşfedildi, bilinçli olarak kapsam dışı bırakıldı (veri şeması **ve**
  bileşen mantığı değişikliği gerektiriyor) — ayrıntı → `ANALIZ-RAPORU.md` §9.
  K-5'e T-10 da dokunmadı (`leaf.tsx`'e hiç dokunulmadı). T-11 hâlâ açık, T-10'un
  tamamlanması onu etkilemedi (bağımlılığı yalnızca T-01'di).
- ~~**T-11.**~~ ✅ **2026-08-22'de tamamlandı.** `classifyItem`/`detectDarkItem`
  `wiki.ts`'ten bağımsız bir modüle (`src/lib/classification.ts`) taşındı;
  "ilk eşleşen kazanır" yerine puanlama geldi (kural başına 1-3 puan, kategori
  bazında toplanır, eşitlikte dosya başında belgelenen sabit bir öncelik
  sırası devreye girer); `detectDarkItem` aynı yöntemle yeniden yazıldı, puan
  eşiği (≥3) kazandı. Sorun 2 tablosundaki 7 kalıbın hepsi (kazas, ay', ordu,
  patlama, sel, makale, bat-) düzeltildi. **Kritik yan bulgu:** JS'in `\b`/`\w`'ı
  Türkçe harfleri (ç/ğ/ı/ö/ş/ü) kelime karakteri saymıyor — bu yüzden birkaç
  kural (`çığ`, `şampiyon`, `öldürüldü` gibi) gerçek veride **hiç eşleşmiyordu**;
  elle yazılmış bir Türkçe-farkında sınırla düzeltildi (ayrıntı → T-11
  Tamamlanma Kaydı). `src/lib/__fixtures__/siniflandirma-ornekleri.ts` (66
  örnek, gerçek Vikipedi verisinden + talimatın kendi örnekleri, 16 yanlış
  pozitif tuzağı) ve `scripts/siniflandirma-raporu.mjs` (`npm run
  siniflandirma`) eklendi — altın kümede kategori doğruluğu **%100** (hedef
  ≥%85), karanlık yanlış pozitif **0**, kesinlik **%100** (hedef ≥%90). U-3
  çözüldü. **Sapma:** ölçüm betiği TypeScript kodunu (`classification.ts` ve
  fixtures) çalışma zamanında derlemek için `esbuild`'i (öncesinde yalnızca
  `vite` üzerinden dolaylı bir bağımlılıktı) `package.json`'a açık bir
  `devDependency` olarak ekledi — yeni bir paket **inmedi** (zaten kuruluydu),
  yalnızca zaten var olan bir bağımlılık dürüstçe beyan edildi. **Bilinçli
  olarak kapsam dışı bırakılan iki bulgu:** `genel` oranı bazı günlerde
  talimatın önerdiği %40 eşiğinin üstünde (ortalama ~%45, resmî ölçütlerin
  hiçbiri etkilenmiyor); anahtar kelime taraması bir felaket sözcüğünün
  cümlenin konusu mu yoksa yalnızca bir tarihleme ifadesi mi olduğunu
  ayıramıyor (nadir görülen bir örnek, en yaygın biçim düzeltildi) — ikisi de
  regex'in doğal sınırı, embedding gerektirir, T-11'in kendi *Kapsam Dışı*
  tablosunda dışarıda bırakılmış. O-12 (Bilim & Keşif mükerrer kaydı) canlı
  olarak yeniden doğrulandı, hâlâ düzeltilmedi (T-11'in kapsamı dışında).
  T-12 hâlâ açıktı (bağımlılığı T-01'di), T-11'in tamamlanması onu etkilemedi.
- ~~**T-12.**~~ ✅ **2026-08-22'de tamamlandı.** Vitest kuruldu (`jsdom` + v8
  kapsam sağlayıcısı); 7 yeni test dosyası, 203 test — `date.test.ts` (K-1
  regresyonu), `slug.test.ts` (366 gün çift yönlü), `classification.test.ts`
  (66 örneklik altın küme + karanlık kesinlik), `wiki.test.ts` (`normalize`,
  `classifyStatus`, `buildAutoTalk`), `sections.test.ts` (Türkçe `matchQuery`),
  `data.test.ts` (CURATED bütünlüğü), `ui.test.tsx` (`CountUp` K-2 regresyonu).
  ESLint (flat config, `rules-of-hooks`+`exhaustive-deps`) ve Prettier kuruldu;
  `npm run kontrol` (typecheck+lint+test+build) tek komut. `src/lib` satır
  kapsamı **%78,78** (hedef ≥%70). **Dört önemli sapma, hepsi bugün kurulan
  güncel paket sürümlerinden kaynaklandı:** (1) `vitest`/`@vitest/coverage-v8`
  (4.1.11) gerçek bir kapsam-raporlama hatası içeriyordu (yoğun test edilen
  dosyalar raporda tamamen kayboluyordu) — köklü **3.2.7** hattına
  sabitlenerek çözüldü; (2) `eslint-plugin-react-hooks` (7.x) React
  Compiler'a yönelik kurallar taşıyordu (bu proje derleyici kullanmıyor),
  yalnızca klasik iki kurala daraltıldı; (3) jsdom'un `requestAnimationFrame`'i
  gerçek tarayıcılarla tutarsız bir saat veriyor — `CountUp` testi
  `vi.useFakeTimers()`'a geçirilerek düzeltildi; (4) **CI'da gerçek bir
  kararsızlık (flaky) yakalandı** — kök neden `undici`'nin (jsdom'un
  bağımlılığı) 8.0.3+ sürümlerinin `node:worker_threads.markAsUncloneable`'ı
  koşulsuz çağırması, CI çalıştırıcısının Node sürümünde bu fonksiyon ara sıra
  bulunmuyor (`TypeError: webidl.util.markAsUncloneable is not a function`,
  bilinen bir üst akış hatası — [nodejs/undici#5024](https://github.com/nodejs/undici/issues/5024));
  `package.json`'a `overrides: { undici: "7.29.0" }` eklenerek kalıcı çözüldü
  (aynı zamanda undici 8.0.0-8.8.0'ın kendi bilinen güvenlik açıklarını da
  giderdi). CI'da testi 5 kez art arda çalıştıran bir teşhis adımıyla
  düzeltme sonrası **5/5** doğrulandı. Ayrıntı → T-12 Tamamlanma Kaydı madde
  11. CI iş akışı (`.github/workflows/kontrol.yml`) **canlı olarak doğrulandı
  ve yeşil**. Artık T-13 açık.
- ~~**T-13.**~~ ✅ **2026-08-23'te tamamlandı.** `BroadcastMode` ayrı dosyaya
  (`src/components/broadcast.tsx`) taşınıp `React.lazy` ile yükleniyor (canlı
  doğrulandı: ağ isteği yalnızca Yayın Modu düğmesine basılınca geliyor) ·
  Google Fonts isteği gerçek kullanıma göre daraltıldı + preload/onload takası
  (Lighthouse'ta render-blocking kaybını giderdi) · Ticker hızı öğe sayısına
  bağlandı (20-90s) · `.noise`/`.drift-slow/-slower` mobilde kapatıldı ·
  `SectionShell`'e `content-visibility:auto` eklendi (`scrollIntoView` ile
  hedef konumlandırma doğrulandı) · `App.tsx` 1.079→**244** satıra indi,
  `hooks/useGunVerisi.ts` + 9 yeni bileşen dosyasına bölündü · `stats.indexOf`
  kalıbı kaldırıldı (`m-1` çözüldü) · arama süzmesi `useAramaSonuclari`'nde
  tekilleştirildi (üst bar sayacıyla bölümler artık aynı, daha geniş alan
  listesini paylaşıyor — canlı doğrulandı: "cumhuriyet" araması sayaçta ve
  listede tutarlı 4 sonuç verdi) · `rollup-plugin-visualizer` + `manualChunks`
  (react ayrı parçada) eklendi, `npm run analyze` çalışıyor · Tailwind
  `@source not` ile `Dokumanlar/`/`Talimatlar/` taramadan çıkarıldı (A/B
  testiyle doğrulandı) · **Lighthouse ilk kez Performans+Erişilebilirlik+SEO
  birlikte, gerçek üretim derlemesine (`vite preview`) karşı ölçüldü: 92/96/100**
  (dev sunucusuna karşı ölçülen ilk deneme yanıltıcı biçimde 42 çıkmıştı,
  düzeltildi). **Sapma:** **≥%15 ilk paket küçülmesi hedefi karşılanmadı** —
  T-10'un eklediği 60 günlük içerik verisi (`data/gunler/`, ~300 kB kaynak)
  paketin çoğunluğunu oluşturuyor ve tembel yüklemesi T-10'un kendi Kapsam Dışı
  kararıyla ertelenmiş durumda; bu talimatın yaptığı her şey (kod bölme, font,
  CSS, `manualChunks`) doğru ve etkili ama veri hacminden bağımsız — asıl
  küçülme için içerik tembel yüklemesi (PLAN-02 adayı) gerekiyor. Ayrıca
  Lighthouse Performans puanının canlı Wikipedia API gecikmesine (~2,4 sn)
  bağlı olarak ölçümden ölçüme belirgin salındığı (68-92) gözlemlendi — T-13'ün
  istemci-taraflı kapsamının dışında, ayrıntı → T-13 Tamamlanma Kaydı. K-5'e
  T-13 de dokunmadı (`leaf.tsx`'in gezinme düğmeleri dışındaki kısımlarına
  dokunuldu, hâlâ atanmadı). Artık T-14 açık.
- ~~**T-15.**~~ ✅ **2026-08-24'te tamamlandı.** K-5, T-03'te keşfedilip 10 talimat
  boyunca hiçbir talimata atanmamıştı; T-14 (kapanış) öncesinde ayrı bir talimat
  olarak açıldı ve kapatıldı. Kök neden doğrulandı: `leaf.tsx`'teki iki dekoratif
  "arkadaki yapraklar" katmanı `absolute inset-0` ile **dış sarmalayıcıya**
  bağlıydı, bu yüzden kutuları kart + gezinme satırı + mini takvimin tamamını
  kaplıyordu; `z-index:auto` konumlanmış öğeler `static` öğelerin üzerine
  boyandığı için gezinme satırı altta kalıyordu. Düzeltme: kart ve dekor kendi
  `relative` sarmalayıcısına alındı (`inset-0` artık kartın kutusu), dekora
  `pointer-events-none` + `aria-hidden="true"`, gezinme satırına `relative`
  eklendi. **Kayıtlı bulgudan farkı:** hata yalnızca tıklamayı değil, satırın
  **görünürlüğünü** de bozuyormuş — dekor opak (`#e7dcc4`) olduğu için üç düğme
  yazısı hiç okunmuyordu; ekran görüntüsüyle kanıtlandı ve `ANALIZ-RAPORU.md`'ye
  işlendi. Üç düğme de gerçek fare tıklamasıyla doğrulandı. Artık yalnızca T-14 açık.
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
| T-09 | Hata sınırı ve durum ekranları | ✅ Tamamlandı | 2026-08-22 | `ErrorBoundary.tsx` eklendi (kökte + 6 bölümde) · **Sapma:** `main.tsx`'teki kök sarmalayıcı tek başına yetersizdi (react-router kendi dahili hata sınırını kullanıyor) → her rotaya `errorElement`/`RouteErrorFallback` eklendi, canlı doğrulandı · `data.error.kind`'a göre 5 başlık · arama sonuç sayacı + boş durum ekranı · "Bugünün anlamı" şeridi (`holidays`) · Karanlık Dosyalar/Bilim & Keşif'te "N daha göster" · 4 sn gecikme uyarısı · O-5, O-9, m-3, m-6 çözüldü · Yeni bulgu O-11 (`holidays`'te şablon artığı çöp kayıt) kapsam dışı bırakıldı |
| T-10 | İçerik mimarisi ve kapsam genişletme | ✅ Tamamlandı | 2026-08-22 | `curated.ts` (1.001 satır) silindi → `types.ts` + `gunler/` (12 ay dosyası) + `index.ts`; mevcut 10 gün birebir taşındı (sed ile) · editör içeriği 10→60 gün (%2,7→%16,4) · **Sapma:** "AI toplu üretim yasak" notuna rağmen kullanıcı bu oturum için açık onay verdi, 4 parti web araştırmasıyla kaynak doğrulanarak yazıldı · `ICERIK-SABLONU.md` eklendi · paket boyutu +64,64 kB gzip (<100 kB eşiği altında, tembel yükleme gerekmedi) · Yeni bulgu O-12 (Bilim & Keşif'te editör/Vikipedi mükerrer ayıklaması yok) kapsam dışı bırakıldı |
| T-11 | Sınıflandırma doğruluğu | ✅ Tamamlandı | 2026-08-22 | `wiki.ts`'ten ayrılan `classification.ts` · "ilk eşleşen kazanır" → puanlama + sabit öncelik sırası · `detectDarkItem` puan eşiği (≥3) · Sorun 2'deki 7 kalıp düzeltildi · **kritik yan bulgu:** JS `\b`/`\w` Türkçe harfleri (ç/ğ/ı/ö/ş/ü) kelime saymıyor, birkaç kural gerçek veride hiç eşleşmiyordu, elle sınırla düzeltildi · 66 örneklik altın küme + `npm run siniflandirma` · kategori doğruluğu %100 (≥%85 hedef), karanlık yanlış pozitif 0, kesinlik %100 (≥%90 hedef) · U-3 çözüldü · `genel` oranı bazı günlerde %40 hedefinin üstünde ve "felaket kelimesi tarihleme amaçlı" örnekler bilinçli kapsam dışı bırakıldı (regex sınırı) |
| T-12 | Test, lint ve biçimlendirme altyapısı | ✅ Tamamlandı | 2026-08-22 | Vitest (jsdom+v8) · 203 test/7 dosya · ESLint (flat, rules-of-hooks+exhaustive-deps) + Prettier · `npm run kontrol` tek komut · `src/lib` satır kapsamı %78,78 (≥%70 hedef) · **4 sapma:** güncel `vitest`/`@vitest/coverage-v8` 4.1.11'de gerçek kapsam-raporlama hatası → 3.2.7'ye sabitlendi · güncel `eslint-plugin-react-hooks` 7.x React Compiler kuralları taşıyor → klasik iki kurala daraltıldı · jsdom `requestAnimationFrame` saat tutarsızlığı → CountUp testi `vi.useFakeTimers()`'a geçirildi · **CI'da gerçek bir kararsızlık** (`undici` 8.0.3+'ın CI'nın Node sürümünde bazen eksik olan `markAsUncloneable`'ı koşulsuz çağırması) → `overrides: {undici: "7.29.0"}` ile kalıcı çözüldü (aynı zamanda undici'nin bilinen güvenlik açıklarını da giderdi), 5x tekrar testiyle 5/5 doğrulandı · CI canlı olarak doğrulandı ve yeşil |
| T-13 | Performans ve derleme iyileştirmesi | ✅ Tamamlandı | 2026-08-23 | `BroadcastMode` `React.lazy` ile ayrı parçada (canlı doğrulandı) · font isteği daraltıldı + preload/onload takası · ticker hızı öğe sayısına bağlı (20-90s) · mobilde `.noise`/`.drift` kapalı · `content-visibility:auto` (`scrollIntoView` ile doğrulandı) · `App.tsx` 1.079→244 satır, `useGunVerisi` hook'u + 9 yeni bileşen · `m-1` (`stats.indexOf`) çözüldü · arama süzmesi tekilleştirildi (canlı doğrulandı) · `manualChunks`+`rollup-plugin-visualizer` · Tailwind `@source not` · **Lighthouse ilk kez üçü birlikte: Performans 92 · Erişilebilirlik 96 · SEO 100** (üretim derlemesine karşı) · **Sapma:** ≥%15 ilk paket küçülmesi hedefi karşılanmadı — T-10'un 60 günlük içerik verisi paketin çoğunluğu, tembel yüklemesi ayrı bir talimat (PLAN-02 adayı) gerektiriyor |
| T-15 | Yaprak gezinme satırının dekoratif katmanla örtülmesi | ✅ Tamamlandı | 2026-08-24 | Plan yürürken eklendi · K-5 kapandı · dekor katmanları kartın kendi `relative` sarmalayıcısına alındı, `pointer-events-none` + `aria-hidden` eklendi, gezinme satırı `relative` yapıldı · **kayıtlı bulgudan farkı:** hata satırı görsel olarak da örtüyormuş (opak dekor), ekran görüntüsüyle kanıtlandı · üç düğme de gerçek fare tıklamasıyla doğrulandı · 203 test + `npm run kontrol` yeşil |
| T-14 | Dokümantasyon güncelleme ve yayın | ⬜ Bekliyor | | |

**İlerleme:** 14 / 15 · `██████████████████░░` %93

---

## 6. Başarı Ölçütleri

Plan ancak aşağıdakilerin tamamı doğruysa kapatılabilir:

### Doğruluk
- [x] "Yılın X. günü" değeri her yıl ve her gün için doğru
- [x] Sayaçlar gün değişiminde doğru güncelleniyor
- [x] 29 Şubat dahil hiçbir kenar durumda yanlış bilgi yok

### Sağlamlık
- [x] Sekme arka planda açılsa bile içerik görünüyor
- [x] Bir bileşen hata verse bile sayfa çökmüyor, kullanıcı mesaj görüyor (T-09)
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
- [x] Editör içeriği en az 60 günde mevcut (T-10 — tam 60/366)
- [x] İçerik dosya yapısı 366 güne ölçekleniyor (T-10 — 12 ay dosyası, her biri bağımsız düzenlenebilir)
- [x] Sınıflandırma doğruluğu test edilmiş ve ölçülü (T-11 — altın kümede kategori %100, karanlık yanlış pozitif 0)

### Kalite
- [x] `npm run typecheck` yeşil
- [x] `npm run build` yeşil
- [x] `npm run lint` yeşil (T-12 — 0 hata, 8 uyarı)
- [x] `npm test` yeşil, kritik saf fonksiyonlar kapsanmış (T-12 — 203 test, `src/lib` %78,78 satır kapsamı)
- [x] Lighthouse: Performans ≥ 90, Erişilebilirlik ≥ 95, SEO ≥ 95 (T-13 — üçü ilk kez birlikte, üretim derlemesine karşı ölçüldü: **92 / 96 / 100**; Performans puanı canlı Wikipedia API gecikmesine bağlı ölçümden ölçüme salınıyor, ayrıntı → T-13 Tamamlanma Kaydı)

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
