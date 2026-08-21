# ANALİZ RAPORU — Tarih Yaprağı

**Tarih:** 2026-08-21 · **İnceleme kapsamı:** Tüm kod tabanı (3.608 satır, 9 kaynak dosya)
**Yöntem:** Statik kod okuma + `npm run typecheck` + `npm run build` + tarayıcıda canlı çalıştırma

> **Güncelleme kaydı**
>
> | Tarih | Talimat | Çözülen bulgular |
> |---|---|---|
> | 2026-08-21 | [T-01](../Talimatlar/Tamamland%C4%B1/T-01-proje-kimligi-ve-bagimlilik-temizligi.md) | K-4, O-1, O-2, O-3, m-2 |
> | 2026-08-21 | [T-03](../Talimatlar/Tamamland%C4%B1/T-03-takvim-tarih-dogrulugu.md) | K-1 |
> | 2026-08-21 | [T-04](../Talimatlar/Tamamland%C4%B1/T-04-sayac-ve-gorunurluk-hatalari.md) | K-2, K-3 |
>
> Bu rapor **ilk analiz anının** fotoğrafıdır; metin korunur, çözülen bulguların
> başlığına `✅ ÇÖZÜLDÜ` işareti ve bir *Çözüm* bloğu eklenir.

---

## 0. Genel Sağlık Tablosu

| Ölçüt | Durum | Not |
|---|---|---|
| `npm run typecheck` | ✅ Geçiyor | Hata yok |
| `npm run build` | ✅ Geçiyor | 2.90 s · 253 kB JS (82 kB gzip) · 51 kB CSS |
| Uygulama açılıyor mu | ✅ Evet | Veri geliyor, 23 kayıt listelendi |
| Kritik hata | ⚠️ 5 adet · **4 çözüldü** | K-1…K-5 · K-1 ✅ T-03, K-2 ✅ T-04, K-3 ✅ T-04, K-4 ✅ T-01 · K-5 T-03 sırasında keşfedildi, henüz atanmadı |
| Orta seviye eksik | ⚠️ 9 adet · **3 çözüldü** | O-1…O-9 · O-1, O-2, O-3 ✅ T-01 |
| Ürün/içerik boşluğu | ⚠️ 5 adet | U-1…U-5 |
| Küçük not | ⚠️ 7 adet · **1 çözüldü** | m-1…m-7 · m-2 ✅ T-01 |

**Kısa hüküm:** Uygulama sağlam bir iskelete ve gerçekten güzel bir tasarım diline sahip.
Kod temiz, tipli ve tutarlı. Sorun "bozuk olması" değil, **yarım kalmış olması**:
üretime çıkmak için gereken kabuk (paylaşım, SEO, PWA, hata sınırı, test) ve
içerik hacmi henüz yok.

---

## 1. KRİTİK BULGULAR

### K-1 · Takvim yaprağındaki "Yılın X. günü" artık yıl hatası — ✅ ÇÖZÜLDÜ (T-03)

**Dosya:** `src/components/leaf.tsx:12-16`

```ts
export function dayOfYear(month: number, day: number): number {
  const d = new Date(2024, month - 1, day);   // ← 2024 SABİT (artık yıl)
  const start = new Date(2024, 0, 1);
  return Math.floor((d.getTime() - start.getTime()) / 86400000) + 1;
}
```

**Kanıt (canlı):** 21 Ağustos 2026 için ekranda **"Yılın 234. günü"** yazıyor.
2026 artık yıl değil; doğru değer **233**. Referans 2024 (artık yıl) olduğu için
1 Mart'tan 31 Aralık'a kadar **tüm günler artık yıl olmayan yıllarda +1 kayıyor.**

**Etki:** Takvim yaprağının en görünür bilgilerinden biri yılın 306 gününde yanlış.

**Aynı kökten ikinci sorun:** `daysInMonth(2)` de 2024'e sabitlendiği için **her zaman 29**
döner. Tarihsel arşiv için 29 Şubat'ın seçilebilir olması doğrudur; ancak
`leaf.tsx:57-60` haftanın gününü **içinde bulunulan yıla** göre hesapladığından,
artık olmayan bir yılda 29 Şubat seçilirse JavaScript tarihi 1 Mart'a taşır ve
**haftanın günü yanlış gösterilir.**

> **✅ Çözüm — T-03 (2026-08-21)**
>
> Tarih mantığı `src/lib/date.ts`'e taşındı (`isLeapYear`, `daysInMonth`,
> `dayOfYear`, `weekdayIndex`); `leaf.tsx` içindeki 2024 referans sabiti tamamen
> kaldırıldı. `dayOfYear` artık gerçek `year` parametresini kullanıyor;
> `weekdayIndex`, artık olmayan bir yılda 29 Şubat için uydurma bir gün yerine
> `null` döndürüyor ve yaprak bu durumda "ARTIK GÜN" + "{yıl} artık yıl değil"
> bilgisini gösteriyor. Mini takvim ızgarası da gerçek yıla bağlandı (29 Şubat
> archive modunda seçilebilir kalıyor, kesikli çerçeve ile işaretli).
>
> **Doğrulama:** Canlı ortamda (2026-08-21) yaprak **"Yılın 233. günü"** gösterdi
> (önceden 234 idi). `dayOfYear` formülü Node ile hem 2026 (normal) hem 2028
> (artık) için doğrulandı: 1 Ocak→1, 28 Şubat→59, 1 Mart→60/61, 21 Ağustos→233/234,
> 31 Aralık→365/366 — tamamı doğru. Tarayıcıda canlı olarak 31 Aralık→1 Ocak,
> 1 Ocak→31 Aralık, 29 Şubat→1 Mart geçişleri ve mini takvim hizası (Ağustos 2026,
> 1'i Cumartesi → `Ct` sütunu) test edildi. Ayrıntı → T-03 Tamamlanma Kaydı.

---

### K-2 · Gün değiştirilince istatistik sayaçları güncellenmiyor — ✅ ÇÖZÜLDÜ (T-04)

**Dosya:** `src/components/ui.tsx:45-73`

```ts
const started = useRef(false);
useEffect(() => {
  ...
  if (e.isIntersecting && !started.current) {   // ← started bir daha sıfırlanmıyor
    started.current = true;
    ...
  }
}, [to, duration]);                              // ← to değişiyor ama etki yok
```

`started` bir `useRef`; bileşen yeniden bağlanmadığı sürece `true` kalır.
Kullanıcı gün değiştirdiğinde `to` (örn. 23 → 18) değişir, `useEffect` yeniden çalışır,
gözlemci yeniden kurulur — ama `started.current` zaten `true` olduğu için
animasyon **bir daha hiç başlamaz.** Sayaç önceki günün değerinde donar.

**Etki:** "Tarihî olay / Bugün doğan / Kaybettiklerimiz / Karanlık dosya" kutularının
dördü de ikinci günden itibaren yanlış sayı gösterir. Bunlar sayfanın en üstündeki
güven verici rakamlar; yanlış olmaları ürünün güvenilirliğine doğrudan zarar verir.

> **✅ Çözüm — T-04 (2026-08-21)**
>
> `started` kilidi tamamen kaldırıldı. `CountUp` artık paylaşılan `useInView()`
> hook'undan gelen `inView` boole'unu kullanıyor; `useEffect` bağımlılık dizisi
> `[to, duration, inView]` olduğu için `to` her değiştiğinde animasyon **yeniden
> çalışır.** Ayrıca geçiş artık her zaman 0'dan değil, `prev.current` ile saklanan
> **önceki değerden** yeni değere yumuşak ilerliyor; `requestAnimationFrame`
> `cancelAnimationFrame` ile düzgün temizleniyor.
>
> **Doğrulama:** Kod incelemesiyle doğrulandı — düzeltme K-2'nin kök nedenini
> (bir daha sıfırlanmayan `started` referansı) tamamen ortadan kaldırıyor ve
> talimatta verilen mantığın birebir uygulaması. `inView` durum geçişinin kendisi
> (aynı mekanizmayı paylaşan `Reveal` üzerinden, aşağıdaki K-3 kanıtıyla) canlı
> olarak doğrulandı. Sayaçların *canlı ekranda* sayısal olarak ilerlemesi bu oturumda
> tarayıcı panelinin ekrana basılmaması nedeniyle piksel düzeyinde ayrıca
> gözlemlenemedi (`requestAnimationFrame` bu ortamda hiç tetiklenmedi — sayfa
> gerçekten gizliyken/compositing yokken evrensel bir tarayıcı kısıtı, K-3'ün tam
> da güvenlik ağıyla ele aldığı senaryo). Ayrıntı → T-04 Tamamlanma Kaydı.

---

### K-3 · Sayfanın tamamı IntersectionObserver'a bağımlı — yedeği yok — ✅ ÇÖZÜLDÜ (T-04)

**Dosya:** `src/components/ui.tsx:4-42` (`Reveal`) ve `src/index.css:170-178`

```css
.reveal { opacity: 0; transform: translateY(26px); }
.reveal.in-view { opacity: 1; transform: translateY(0); }
```

Sayfada **181 adet** `.reveal` elemanı var. Hepsi `opacity: 0` ile başlıyor ve yalnızca
IntersectionObserver tetiklenirse görünür oluyor.

**Kanıt (canlı):** Sekme arka planda / gizliyken (`document.hidden === true`)
IntersectionObserver hiç ateşlenmedi ve **181 elemanın 0 tanesi** `in-view` sınıfını aldı —
yani sayfa tamamen boş göründü.

**Etki:** Arka planda açılan sekme, tarayıcı ön-yükleme (prerender), yazdırma çıktısı,
bazı gömülü webview'lar ve JavaScript'i kısıtlanmış ortamlarda **içerik hiç görünmez.**
`prefers-reduced-motion` bloğu yalnızca süreyi kısaltıyor, `opacity: 0` başlangıcını
kaldırmıyor.

> **✅ Çözüm — T-04 (2026-08-21)**
>
> Yeni `src/lib/useInView.ts`: 181 ayrı gözlemci yerine **tek paylaşılan**
> `IntersectionObserver` + her elemana özel bir **`setTimeout` güvenlik ağı**
> (varsayılan 1200 ms). Gözlemci ateşlenmese bile içerik kendiliğinden görünür
> olur; `IntersectionObserver` tarayıcıda hiç yoksa hook senkron olarak
> `inView = true` döner. `Reveal` bu hook'u kullanacak şekilde yeniden yazıldı,
> dışa aktarılan props değişmedi. Ayrıca `prefers-reduced-motion: reduce` bloğuna
> `.reveal` için `opacity: 1 !important` eklendi, `@media print` bloğu ve
> `index.html`'e `<noscript>` yedek stili eklendi.
>
> **Doğrulama (canlı, bu ortamda tarayıcı paneli gösterilmediği için
> `document.hidden === true` — tam olarak bu bulgunun tarif ettiği senaryo):**
> Sayfa yüklendiğinde **181/181** `.reveal` elemanı `in-view` sınıfını aldı
> (önceden 0/181 idi). Ayrıca daha da sert bir koşulda —
> `IntersectionObserver` tamamen `undefined` iken (`index.html`'e geçici bir
> test betiğiyle simüle edildi, sonra geri alındı) — yine **181/181** eleman
> anında görünür oldu; bu, hook'un senkron yedek dalının (gözlemci yok →
> doğrudan `true`) doğru çalıştığını kanıtlıyor. Performans tarafında paylaşılan
> tek gözlemci sayesinde IntersectionObserver örnek sayısı **181 → 1**'e indi.
> Ayrıntı → T-04 Tamamlanma Kaydı.

---

### K-4 · HMR WebSocket'i sabit 3000 portuna bağlı — ✅ ÇÖZÜLDÜ (T-01)

**Dosya:** `vite.config.js:8-13`

```js
server: {
  port: 3000,
  strictPort: true,
  hmr: { port: 3000 },   // ← sabit
}
```

**Kanıt (canlı konsol):**
```
WebSocket connection to 'ws://localhost:3000/?token=...' failed
[vite] failed to connect to websocket
```

Sunucu 3000 dışında bir portta çalıştığı anda (port meşgulse ya da `--port` verilirse)
HMR bozulur; kaydettiğiniz değişiklik tarayıcıya yansımaz, elle yenilemek gerekir.
Ayrıca `strictPort: true` yüzünden 3000 meşgulse Vite **hiç başlamaz** — hata verip çıkar.

> **✅ Çözüm — T-01 (2026-08-21)**
>
> `vite.config.js` → `vite.config.ts` taşındı; `hmr` bloğu tamamen kaldırıldı ve
> `strictPort: false` yapıldı. Vite artık HMR portunu sunucu portundan türetiyor.
>
> **Doğrulama:** Sunucu 3000 meşgulken 3001'e geçti (`Port 3000 is in use, trying
> another one...`), konsolda `[vite] connected.` — WebSocket hatası yok.
> `/@vite/client` içinde `hmrPort = null` ve soket adresi sayfanın kendi portu.
> `src/App.tsx` üzerinde yapılan düzenleme sayfa yenilenmeden tarayıcıya yansıdı.

---

## 2. ORTA SEVİYE BULGULAR

### O-1 · Kullanılmayan 10 bağımlılık — ✅ ÇÖZÜLDÜ (T-01)

Kaynak kodda **hiçbiri** import edilmiyor (`grep` ile doğrulandı, hepsi 0 eşleşme):

| Paket | Neden duruyor |
|---|---|
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | İskelet şablonundan kalma |
| `@supabase/supabase-js` | Backend yok |
| `canvas-confetti` + `@types/canvas-confetti` | Kullanılmıyor |
| `date-fns` | Tarih işleri elle yapılıyor |
| `framer-motion` | Animasyonlar saf CSS |
| `lucide-react` | İkonlar elle çizilmiş (`ui.tsx`) |
| `react-router-dom` | Yönlendirme yok (ama **olmalı** — bkz. U-1) |
| `recharts` | Grafik yok |
| `uuid` + `@types/uuid` | ID'ler elle üretiliyor |

**Etki:** `node_modules` gereksiz büyüyor, `npm install` uzuyor, güvenlik denetimi
gürültülü hâle geliyor. Üretim paketine girmiyorlar (tree-shaking) ama proje hijyeni bozuk.

> **✅ Çözüm — T-01 (2026-08-21)**
>
> Tablodaki paketlerden **`react-router-dom` hariç** hepsi (tip paketleriyle birlikte
> 12 giriş) kaldırıldı. `react-router-dom` T-06'da kullanılacağı için **bilerek bırakıldı**.
>
> | Ölçüt | Önce | Sonra |
> |---|---|---|
> | `dependencies` | 13 | 3 |
> | `devDependencies` | 9 | 7 |
> | `node_modules` | 130,7 MB · 15.304 dosya | 83,6 MB · 2.728 dosya |
> | Üretim paketi | 253 kB JS / 51 kB CSS | **değişmedi** (253.62 kB JS / 50,78 kB CSS) |
>
> Tree-shaking öngörüsü doğrulandı: paket boyutu bayt bayt aynı kaldı, kazanç
> tamamen kurulum süresi ve disk tarafında.

### O-2 · `package.json` kimliği iskelet şablonundan kalma — ✅ ÇÖZÜLDÜ (T-01)

`"name": "sandbox-workspace"` — proje adı, sürüm, açıklama, lisans, depo bilgisi yok.
`preview`, `lint`, `format`, `test` betikleri de yok.

> **✅ Çözüm — T-01 (2026-08-21)**
>
> `name: "tarih-yapragi"`, `version: "0.1.0"`, `description`, `license: "MIT"`,
> `repository` (GitHub adresi) ve `engines: { node: ">=18" }` dolduruldu;
> `preview` betiği eklendi ve çalıştığı doğrulandı.
>
> `lint` / `format` / `test` betikleri **bilerek eklenmedi** — bunlar T-12'nin kapsamında.

### O-3 · `.gitignore` yanlış çatıya ait — ✅ ÇÖZÜLDÜ (T-01)

`.next/` satırı Next.js şablonundan kalma; bu proje Vite. `dist/` doğru, ama
`.vite/`, `*.local`, `.DS_Store`, editör klasörleri eksik.

> **✅ Çözüm — T-01 (2026-08-21)**
>
> `.next/` kaldırıldı; `.vite/`, `*.local`, `.DS_Store`, `Thumbs.db`, `.idea/`,
> `.vscode/*` (`!.vscode/extensions.json` istisnasıyla), günlük dosyaları ve
> `.env` / `.env.*` (`!.env.example` istisnasıyla) eklendi. Dosya başlıklı
> bloklara ayrıldı.

### O-4 · Ağ katmanında iptal (abort) yok

**Dosya:** `src/lib/wiki.ts:88-105, 289-303`

`useDayData` içinde `reqId` sayacı yalnızca **state güncellemesini** koruyor; ağ isteği
iptal edilmiyor. Kullanıcı takvimde hızlıca 10 gün gezdiğinde 20 istek (TR+EN) yola çıkar
ve hepsi tamamlanır. Wikimedia hız sınırına takılmak mümkün.

**İlgili:** `fetchDayData` **her zaman** TR ve EN'i paralel çeker (`Promise.all`), oysa
EN yalnızca TR boşsa kullanılıyor. İsteklerin yaklaşık yarısı boşa gidiyor.

### O-5 · Hata sınırı (ErrorBoundary) yok

`src/main.tsx` doğrudan `<App />` render ediyor. Herhangi bir bileşende oluşan bir
runtime hatası **tüm sayfayı beyaz ekrana** çevirir; kullanıcıya hiçbir mesaj gösterilmez.

### O-6 · Erişilebilirlik boşlukları

| Sorun | Yer |
|---|---|
| Modal'da odak tuzağı (focus trap) ve kapanışta odak iadesi yok | `ui.tsx:117-152` |
| Toaster'da `aria-live` yok — ekran okuyucu bildirimi duymuyor | `ui.tsx:159-186` |
| "Ana içeriğe atla" bağlantısı yok | `App.tsx` |
| Arama girdisinde görünür/`aria-label` etiket yok | `App.tsx` üst bar |
| `text-ink-faint` (#6f7481) koyu zeminde **4.0:1** — WCAG AA eşiği 4.5:1, altında kalıyor | `index.css:22` |
| Kategori filtre çipleri `aria-pressed` taşımıyor | `sections.tsx:159-180` |

### O-7 · Klavye kısayolları yalnızca Yayın Modu'nda

`BroadcastMode` içinde `←` `→` `Space` `Esc` çalışıyor (`talk.tsx:170-186`), fakat
ana sayfada gün değiştirmek için klavye kısayolu yok. Gün geçişi bu ürünün ana eylemi.

### O-8 · Önbellek stratejisi yarım

- `memCache` (`wiki.ts:52`) hiç boşaltılmıyor — uzun oturumda sınırsız büyür.
- `localStorage` yedeğinde **zaman damgası/TTL yok**; bir gün için kaydedilen veri
  Vikipedi güncellense bile ağ hatası anında süresiz kullanılır.
- Ayrı ayrı `ty-otd-tr-MM-DD` anahtarları birikiyor, temizlik mekanizması yok.

### O-9 · `holidays` verisi çekiliyor ama neredeyse kullanılmıyor

`wiki.ts` `holidays` alanını dolduruyor; ekranda yalnızca otomatik sohbet kartlarından
biri olarak (`buildAutoTalk` → `auto-holiday`) dolaylı görünüyor. "Bugünün anlamı"
başlı başına bir bölüm olmayı hak ediyor.

---

## 3. ÜRÜN VE İÇERİK BOŞLUKLARI

### U-1 · Paylaşılabilir bağlantı yok — en büyük ürün eksiği

Uygulama tek URL'de çalışıyor. `21 Ağustos` sayfasının adresi yok; kullanıcı seçtiği
günü **paylaşamıyor**, **yer imine ekleyemiyor**, tarayıcı **geri tuşu çalışmıyor**.
"Bugün tarihte" türü bir üründe paylaşım birincil büyüme kanalıdır.

`react-router-dom` zaten kurulu — sadece devreye alınmamış.

### U-2 · Editör içeriği 366 günün 10'unda (%2,7)

`src/data/curated.ts` içinde yalnızca: `02-14`, `03-08`, `04-23`, `04-25`, `05-19`,
`07-20`, `08-20`, `10-29`, `11-10`, `12-31`.

**Sonuç:** Günlerin %97'sinde "Karanlık Dosyalar" ve "Bilim & Keşif" bölümleri ya boş
ya da yalnızca regex taramasının ürettiği zayıf içerikle dolu. Uygulamanın en özgün
iki bölümü çoğu gün sönük kalıyor.

Ayrıca 1.001 satırlık tek dosya, içerik büyüdükçe yönetilemez hâle gelecek.

### U-3 · Otomatik sınıflandırma kalitesi ölçülmemiş

`classifyItem` ve `detectDarkItem` (`wiki.ts:151-196`) sıralı regex denemesiyle çalışır:
**ilk eşleşen kural kazanır.** Bu, hem yanlış pozitif hem öncelik hatası üretir.

Somut örnekler:
- `/saldırı/` hem `savas` (2. kural) hem `Şiddet` (5. karanlık tema) kalıbında var.
- `/kazas/` kalıbı "uçak kazası" kadar Osmanlı idari birimi **"Bursa kazası"** ve **"kazasker"** unvanını da yakalar.
- `/patlama/` nüfus patlaması gibi mecazi kullanımları felaket sayar.
- `/ay'/` kalıbı "Ay'a iniş" ile birlikte **"Saray'a"**, **"Saray'ın"** kelimelerini de keşif sayar.
- `/ordu(su)? /` kalıbı **Ordu ili** geçen her cümleyi savaş kategorisine atar.

Bir doğruluk testi yok; kural değiştirildiğinde neyin bozulduğu görülemiyor.

### U-4 · Site kabuğu eksik: favicon, PWA, SEO, paylaşım kartı

`index.html` içinde:
- ❌ favicon (hiç yok — tarayıcı varsayılan simgeyi gösteriyor)
- ❌ `og:title` / `og:description` / `og:image` — sosyal medyada çıplak bağlantı
- ❌ `twitter:card`
- ❌ `manifest.json` — telefona "uygulama olarak ekle" yok
- ❌ `robots.txt`, `sitemap.xml`
- ❌ Service worker — `localStorage` yedeği varken çevrimdışı açılış hâlâ yok
- ✅ `lang="tr"`, `description`, `theme-color` var (bunlar doğru yapılmış)

### U-5 · Kalite güvencesi altyapısı hiç yok

- Test yok (birim, bileşen, uçtan uca — hiçbiri)
- ESLint yapılandırması yok
- Prettier / biçimlendirme kuralı yok
- CI (GitHub Actions vb.) yok
- `README.md` iki satır

Kritik saf fonksiyonlar (`dayOfYear`, `classifyItem`, `formatYear`, `firstSentence`,
`normalize`) test edilmeye çok uygun ve şu an hiçbiri korunmuyor.

---

## 4. Küçük Notlar

| # | Bulgu | Yer |
|---|---|---|
| m-1 | `NAV[stats.indexOf(s)]` — dizi sırasına gizli bağımlılık, kırılgan | `App.tsx` istatistik bağlantıları |
| m-2 | ~~`vite.config.js` — proje TS olduğu hâlde config JS~~ **✅ ÇÖZÜLDÜ (T-01)** — `vite.config.ts` | kök |
| m-3 | `CasesSection` otomatik dosyaları `slice(0, 6)` ile kesiyor, "daha fazla" yok | `App.tsx` allCases |
| m-4 | Ticker `55s` sabit; 3 öğede de 14 öğede de aynı hız | `index.css:127` |
| m-5 | Kişi kartlarında görseller `loading="lazy"` var ama `width/height` yok → düzen kayması | `sections.tsx` PeopleRow |
| m-6 | Arama sonucu global sayacı yok; kullanıcı hangi bölümde kaç sonuç olduğunu göremiyor | `App.tsx` |
| m-7 | Yazdırma (print) stil sayfası yok — kart çıktısı alınamıyor | `index.css` |

---

## 5. Öncelik Sıralaması (öneri)

```
ÖNCE   →  K-1✅ K-2✅ K-4✅  K-5   (görünür yanlış bilgi + bozuk geliştirme deneyimi + kırık birincil gezinme)
SONRA  →  O-1✅ O-2✅ O-3✅     (temizlik — sonraki her iş bundan faydalanır)  [T-01 ile bitti]
SONRA  →  K-3✅ O-5  O-6        (sağlamlık ve erişilebilirlik)
SONRA  →  U-1  U-4             (paylaşım + kabuk — ürünü "yayınlanabilir" yapar)
SONRA  →  O-4  O-7  O-8  O-9   (ağ, klavye, önbellek, içerik zenginliği)
SONRA  →  U-2  U-3             (içerik hacmi ve doğruluğu — sürekli iş)
SON    →  U-5                  (test/lint — sonraki tüm işleri korur)
```

Bu sıralama `../Talimatlar/PLAN-01-temel-duzeltme-ve-tamamlama.md` dosyasında
T-01…T-14 talimatlarına dönüştürülmüştür. K-5, T-03 sırasında keşfedilmiş yeni
bir bulgudur ve henüz bir talimata atanmamıştır — bkz. bölüm 6.

---

## 6. T-03 Sırasında Keşfedilen Yeni Bulgu (2026-08-21)

> Bu bölüm ilk analiz anının parçası değildir. T-03 (takvim/tarih doğruluğu)
> talimatının canlı doğrulaması sırasında keşfedilmiş, ilk analizde
> yakalanmamış yeni bir bulgudur. K-serisi numaralandırması sürdürülür.

### K-5 · "Önceki gün" / "Sonraki gün" / "Bugüne dön" düğmeleri gerçek bir tıklamayla tetiklenemiyor

**Dosya:** `src/components/leaf.tsx:69-70` (dekoratif "arkadaki yapraklar" katmanı) ve `:127-160` (gün navigasyonu)

```tsx
<div className="relative" style={{ perspective: "1400px" }}>
  {/* arkadaki yapraklar */}
  <div className="absolute inset-0 translate-y-3 translate-x-2 rounded-sm bg-paper-2/70 rotate-2" />
  <div className="absolute inset-0 translate-y-1.5 translate-x-1 rounded-sm bg-paper-2 rotate-1" />

  <div className="paper torn-edge relative w-full ...">...</div>

  {/* yaprak navigasyonu — position sınıfı YOK (static) */}
  <div className="flex items-center justify-between mt-7">
    <button onClick={() => shift(-1)} aria-label="Önceki gün">...</button>
    ...
  </div>
</div>
```

Dekoratif "arkadaki yapraklar" katmanları `position: absolute; inset: 0` kullanıyor.
En yakın konumlanmış atası dış `.relative` sarmalayıcı olduğu için, bu katmanlar
o sarmalayıcının **otomatik yüksekliğinin tamamını** kaplıyor — yani kart +
gezinme satırı + (açıksa) mini takvim. Gezinme satırı (`Önceki gün` /
`Bugüne dön` / `Sonraki gün`) hiçbir `position` sınıfı taşımıyor
(`position: static`). CSS yığılım (stacking) kurallarına göre `z-index: auto`
**konumlanmış** öğeler, DOM sırasından bağımsız olarak, konumlanmamış
(`static`) öğelerin **her zaman üzerinde** boyanır — dekoratif katmanlar kod
içinde gezinme satırından ÖNCE gelse bile.

**Kanıt (canlı, `document.elementsFromPoint`):** Sayfa ilk yüklendiğinde, hiçbir
etkileşim olmadan, "Sonraki gün" düğmesinin tam merkezinde yığılım sırası:

```
1. <div class="absolute inset-0 ... bg-paper-2 rotate-1">   ← üstte, tıklamayı yakalıyor
2. <div class="absolute inset-0 ... bg-paper-2/70 rotate-2">
3. <span> (düğme metni)
4. <button aria-label="Sonraki gün">                        ← gerçek hedef, 3. sırada
5. <div class="flex items-center justify-between mt-7">
```

Gerçek bir fare/dokunmatik tıklaması bu noktada **dekoratif `div`'e** gider,
düğmeye değil; `onClick` hiç tetiklenmiyor. (Bulgu, `button.click()` ile
tetiklenerek de doğrulandı — bu yöntem olay işleyicisini DOM olay akışını
atlayarak doğrudan çağırdığından, `shift()` gün-geçiş mantığının kendisinin
doğru olduğu ayrıca kanıtlandı; sorun yalnızca gerçek tıklama olaylarının
düğmeye hiç ulaşmamasıdır.)

**Etki:** Uygulamanın **birincil gün gezinme mekanizması** — yaprağın hemen
altındaki "Önceki gün" / "Bugüne dön" / "Sonraki gün" düğmeleri — gerçek bir
tarayıcıda fare veya dokunmatik ekranla **tıklanamıyor**. Kullanıcılar günü
yalnızca mini takvim ızgarası veya "Özel dosyalı günler" hızlı seçim
düğmeleriyle değiştirebiliyor; bunlar farklı bir DOM bölgesinde olduğundan
etkilenmiyor. Bu, K-2'nin ("gün değiştirilince sayaçlar güncellenmiyor") canlı
ortamda geç fark edilmiş olmasını da açıklıyor olabilir — birincil gün
değiştirme yolu zaten yanıt vermiyorsa, sayaç donması ayrıca göze çarpmaz.

**Kapsam notu:** T-03 yalnızca tarih/takvim **hesaplama mantığını** düzeltir; bu
bulgu bir CSS yığılım (z-index/stacking) hatasıdır ve T-03'ün kapsamı dışındadır
— bkz. [T-03 Tamamlanma Kaydı](../Talimatlar/Tamamland%C4%B1/T-03-takvim-tarih-dogrulugu.md).
Önerilen düzeltme (küçük): dekoratif katmanlara `pointer-events-none` eklemek —
zaten yalnızca görsel amaçlıdırlar, hiçbir tıklama hedefi taşımazlar.

**Önerilen talimat:** T-04'ün resmi kapsamı (bkz. talimat dosyasının "İlgili
bulgu" alanı) yalnızca K-2 ve K-3'tü; K-5 bir CSS yığılım hatası olup K-2/K-3'ün
kök nedeninden (IntersectionObserver güvenilirliği) tamamen farklıdır, bu yüzden
T-04 **bilinçli olarak** K-5'e dokunmadı (bkz. T-04 Tamamlanma Kaydı). K-5 hâlâ
**hiçbir talimata resmen atanmamış** durumda; ayrı bir küçük talimat (ör. T-04b)
ya da mevcut bir sonraki talimata (T-06 gün gezinmesini URL'e bağlarken aynı
DOM bölgesine dokunacağı için uygun bir aday olabilir) eklenmesi önerilir — nihai
karar plan sahibine aittir.
