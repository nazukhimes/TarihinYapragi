# ANALİZ RAPORU — Tarih Yaprağı

**Tarih:** 2026-08-21 · **İnceleme kapsamı:** Tüm kod tabanı (3.608 satır, 9 kaynak dosya)
**Yöntem:** Statik kod okuma + `npm run typecheck` + `npm run build` + tarayıcıda canlı çalıştırma

> **Güncelleme kaydı**
>
> | Tarih      | Talimat                                                                              | Çözülen bulgular        |
> | ---------- | ------------------------------------------------------------------------------------ | ----------------------- |
> | 2026-08-21 | [T-01](../Talimatlar/Tamamland%C4%B1/T-01-proje-kimligi-ve-bagimlilik-temizligi.md)  | K-4, O-1, O-2, O-3, m-2 |
> | 2026-08-21 | [T-03](../Talimatlar/Tamamland%C4%B1/T-03-takvim-tarih-dogrulugu.md)                 | K-1                     |
> | 2026-08-21 | [T-04](../Talimatlar/Tamamland%C4%B1/T-04-sayac-ve-gorunurluk-hatalari.md)           | K-2, K-3                |
> | 2026-08-21 | [T-05](../Talimatlar/Tamamland%C4%B1/T-05-ag-katmani-saglamlastirma.md)              | O-4, O-8                |
> | 2026-08-21 | [T-06](../Talimatlar/Tamamland%C4%B1/T-06-yonlendirme-ve-paylasilabilir-baglanti.md) | U-1                     |
> | 2026-08-21 | [T-07](../Talimatlar/Tamamland%C4%B1/T-07-erisilebilirlik-ve-klavye.md)              | O-6, O-7                |
> | 2026-08-21 | [T-08](../Talimatlar/Tamamland%C4%B1/T-08-site-kimligi-favicon-seo-pwa.md)           | U-4                     |
> | 2026-08-22 | [T-09](../Talimatlar/Tamamland%C4%B1/T-09-hata-siniri-ve-durum-ekranlari.md)         | O-5, O-9, m-3, m-6      |
> | 2026-08-22 | [T-10](../Talimatlar/Tamamland%C4%B1/T-10-icerik-mimarisi-ve-kapsam.md)              | U-2                     |
> | 2026-08-22 | [T-11](../Talimatlar/Tamamland%C4%B1/T-11-siniflandirma-dogrulugu.md)                | U-3                     |
> | 2026-08-22 | [T-12](../Talimatlar/Tamamland%C4%B1/T-12-test-lint-bicimlendirme.md)                | U-5                     |
> | 2026-08-23 | [T-13](../Talimatlar/Tamamland%C4%B1/T-13-performans-ve-derleme.md)                  | m-1, m-4                |
>
> Bu rapor **ilk analiz anının** fotoğrafıdır; metin korunur, çözülen bulguların
> başlığına `✅ ÇÖZÜLDÜ` işareti ve bir _Çözüm_ bloğu eklenir.

---

## 0. Genel Sağlık Tablosu

| Ölçüt                | Durum                      | Not                                                                                                                                                     |
| -------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`  | ✅ Geçiyor                 | Hata yok                                                                                                                                                |
| `npm run build`      | ✅ Geçiyor                 | react 206 kB + uygulama 331 kB + yayın modu 4,7 kB · gzip toplam ~177 kB · 54,7 kB CSS (T-13 sonrası, 3 parça)                                          |
| Uygulama açılıyor mu | ✅ Evet                    | Veri geliyor · `npm run kontrol` (typecheck+lint+203 test+build) yeşil                                                                                  |
| Kritik hata          | ✅ 5 adet · **5 çözüldü**  | K-1…K-5 · K-1 ✅ T-03, K-2 ✅ T-04, K-3 ✅ T-04, K-4 ✅ T-01, K-5 ✅ T-15                                                                               |
| Orta seviye eksik    | ⚠️ 13 adet · **9 çözüldü** | O-1, O-2, O-3 ✅ T-01 · O-4, O-8 ✅ T-05 · O-5, O-9 ✅ T-09 · O-6, O-7 ✅ T-07 · **O-10, O-11, O-12, O-13 ⏭️ PLAN-02'ye devredildi** (gerekçeler → §11) |
| Ürün/içerik boşluğu  | ✅ 5 adet · **5 çözüldü**  | U-1 ✅ T-06 · U-4 ✅ T-08 · U-2 ✅ T-10 · U-3 ✅ T-11 · U-5 ✅ T-12                                                                                     |
| Küçük not            | ⚠️ 8 adet · **6 çözüldü**  | m-2 ✅ T-01 · m-3, m-6 ✅ T-09 · m-5 ✅ T-07 · m-1, m-4 ✅ T-13 · **m-7, m-8 ⏭️ PLAN-02** (ikisi de zararsız)                                           |

> 📋 **Tüm bulguların tek sayfalık durum özeti için → [§11 Bulgu Durum Tablosu](#11-bulgu-durum-tablosu--plan-01-kapanışı-2026-08-24)**

**İlk hüküm (2026-08-21, PLAN-01 öncesi):** Uygulama sağlam bir iskelete ve gerçekten
güzel bir tasarım diline sahip. Kod temiz, tipli ve tutarlı. Sorun "bozuk olması"
değil, **yarım kalmış olması**: üretime çıkmak için gereken kabuk (paylaşım, SEO,
PWA, hata sınırı, test) ve içerik hacmi henüz yok.

**Kapanış hükmü (2026-08-24, PLAN-01 sonrası):** O kabuk artık var. 31 bulgunun
25'i (%81) çözüldü; **kritik hataların ve ürün/içerik boşluklarının tamamı kapandı.**
Kalan 6 bulgunun hiçbiri kullanıcıya yanlış bilgi göstermiyor — dördü ayrı bir
karar veya kırılma içeren bir yükseltme gerektirdiği için, ikisi zararsız olduğu
için PLAN-02'ye devredildi. Uygulama bilinçli olarak yayına alınmadı; yerel
çalıştırılan bir uygulama olarak kullanılıyor.

---

## 1. KRİTİK BULGULAR

### K-1 · Takvim yaprağındaki "Yılın X. günü" artık yıl hatası — ✅ ÇÖZÜLDÜ (T-03)

**Dosya:** `src/components/leaf.tsx:12-16`

```ts
export function dayOfYear(month: number, day: number): number {
  const d = new Date(2024, month - 1, day); // ← 2024 SABİT (artık yıl)
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
> olarak doğrulandı. Sayaçların _canlı ekranda_ sayısal olarak ilerlemesi bu oturumda
> tarayıcı panelinin ekrana basılmaması nedeniyle piksel düzeyinde ayrıca
> gözlemlenemedi (`requestAnimationFrame` bu ortamda hiç tetiklenmedi — sayfa
> gerçekten gizliyken/compositing yokken evrensel bir tarayıcı kısıtı, K-3'ün tam
> da güvenlik ağıyla ele aldığı senaryo). Ayrıntı → T-04 Tamamlanma Kaydı.

---

### K-3 · Sayfanın tamamı IntersectionObserver'a bağımlı — yedeği yok — ✅ ÇÖZÜLDÜ (T-04)

**Dosya:** `src/components/ui.tsx:4-42` (`Reveal`) ve `src/index.css:170-178`

```css
.reveal {
  opacity: 0;
  transform: translateY(26px);
}
.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}
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
another one...`), konsolda `[vite] connected.` — WebSocket hatası yok.
> `/@vite/client` içinde `hmrPort = null` ve soket adresi sayfanın kendi portu.
> `src/App.tsx` üzerinde yapılan düzenleme sayfa yenilenmeden tarayıcıya yansıdı.

---

## 2. ORTA SEVİYE BULGULAR

### O-1 · Kullanılmayan 10 bağımlılık — ✅ ÇÖZÜLDÜ (T-01)

Kaynak kodda **hiçbiri** import edilmiyor (`grep` ile doğrulandı, hepsi 0 eşleşme):

| Paket                                                      | Neden duruyor                               |
| ---------------------------------------------------------- | ------------------------------------------- |
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | İskelet şablonundan kalma                   |
| `@supabase/supabase-js`                                    | Backend yok                                 |
| `canvas-confetti` + `@types/canvas-confetti`               | Kullanılmıyor                               |
| `date-fns`                                                 | Tarih işleri elle yapılıyor                 |
| `framer-motion`                                            | Animasyonlar saf CSS                        |
| `lucide-react`                                             | İkonlar elle çizilmiş (`ui.tsx`)            |
| `react-router-dom`                                         | Yönlendirme yok (ama **olmalı** — bkz. U-1) |
| `recharts`                                                 | Grafik yok                                  |
| `uuid` + `@types/uuid`                                     | ID'ler elle üretiliyor                      |

**Etki:** `node_modules` gereksiz büyüyor, `npm install` uzuyor, güvenlik denetimi
gürültülü hâle geliyor. Üretim paketine girmiyorlar (tree-shaking) ama proje hijyeni bozuk.

> **✅ Çözüm — T-01 (2026-08-21)**
>
> Tablodaki paketlerden **`react-router-dom` hariç** hepsi (tip paketleriyle birlikte
> 12 giriş) kaldırıldı. `react-router-dom` T-06'da kullanılacağı için **bilerek bırakıldı**.
>
> | Ölçüt             | Önce                    | Sonra                                       |
> | ----------------- | ----------------------- | ------------------------------------------- |
> | `dependencies`    | 13                      | 3                                           |
> | `devDependencies` | 9                       | 7                                           |
> | `node_modules`    | 130,7 MB · 15.304 dosya | 83,6 MB · 2.728 dosya                       |
> | Üretim paketi     | 253 kB JS / 51 kB CSS   | **değişmedi** (253.62 kB JS / 50,78 kB CSS) |
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

### O-4 · Ağ katmanında iptal (abort) yok — ✅ ÇÖZÜLDÜ (T-05)

**Dosya:** `src/lib/wiki.ts:88-105, 289-303`

`useDayData` içinde `reqId` sayacı yalnızca **state güncellemesini** koruyor; ağ isteği
iptal edilmiyor. Kullanıcı takvimde hızlıca 10 gün gezdiğinde 20 istek (TR+EN) yola çıkar
ve hepsi tamamlanır. Wikimedia hız sınırına takılmak mümkün.

**İlgili:** `fetchDayData` **her zaman** TR ve EN'i paralel çeker (`Promise.all`), oysa
EN yalnızca TR boşsa kullanılıyor. İsteklerin yaklaşık yarısı boşa gidiyor.

> **✅ Çözüm — T-05 (2026-08-21)**
>
> `fetchDayData` artık TR'yi **önce** dener; `events`/`births`/`deaths`'ten biri bile
> boşsa (`trThin`) EN'i **tamamlayıcı** olarak çeker — TR dolu bir günde EN hiç
> çekilmiyor. `reqId` sayacı tamamen kaldırıldı; `useDayData` her efektte yeni bir
> `AbortController` kurup temizlik fonksiyonunda `ctrl.abort()` çağırıyor, `load()` ve
> `fetchWithRetry()` bu `signal`'i `fetch()`'e iletiyor. Ayrıca 429/5xx için en fazla
> 2 deneme (400ms/800ms bekleme) eklendi; 404 ve diğer kalıcı hatalarda hiç deneme
> yapılmıyor.
>
> **Doğrulama:** Canlı ortamda, `javascript_tool` ile uygulamanın kendi `wiki.ts`
> modülü doğrudan çağrılarak doğrulandı (DevTools panelinin bu oturumda
> compositing yapmaması ve K-5'in gün gezinme UI'sını engellemesi nedeniyle —
> bkz. T-05 Tamamlanma Kaydı). TR verisi dolu bir günde (22 Ağustos, 20/80/75 kayıt)
> **1 istek** (`/tr/`) — önceden 2 idi. `AbortController.abort()` çağrıldığında
> `fetchDayData`'nın promise'i `AbortError` (`DOMException`) ile reddediyor ve bu
> konsola hiçbir hata düşürmüyor. 404 için her dilde 1 çağrı (deneme yok); 429/5xx
> için her dilde 2 çağrı (toplam 4). Ayrıntı → T-05 Tamamlanma Kaydı.

### O-5 · Hata sınırı (ErrorBoundary) yok — ✅ ÇÖZÜLDÜ (T-09)

`src/main.tsx` doğrudan `<App />` render ediyor. Herhangi bir bileşende oluşan bir
runtime hatası **tüm sayfayı beyaz ekrana** çevirir; kullanıcıya hiçbir mesaj gösterilmez.

> **✅ Çözüm — T-09 (2026-08-22)**
>
> Yeni `src/components/ErrorBoundary.tsx` — projenin tek sınıf bileşeni (React'te
> hata sınırı yalnızca sınıf bileşeniyle yazılabilir). `main.tsx`'te kökte,
> `App.tsx`'te altı bölümün her birinde ayrı bir örnek var; bir bölüm çökerse
> yalnızca o bölüm bir "Yaprak yırtıldı" hata kartı gösterir, diğer beşi normal
> çalışmaya devam eder. "Sayfayı yenile" ve "Önbelleği temizle" (`localStorage.clear()`)
> düğmeleri var; hata yığını (`stack`) yalnızca `import.meta.env.DEV`'de görünür.
>
> **Sapma/düzeltme (canlı doğrulamada keşfedildi):** Talimatın taslak kodu yalnızca
> `main.tsx`'te `<ErrorBoundary><RouterProvider/></ErrorBoundary>` öneriyordu — bu,
> O-5'in ilk analiz anındaki `ReactDOM.createRoot(...).render(<App />)` koduna göre
> yazılmıştı. Ancak T-06'dan beri uygulama `createBrowserRouter` kullanıyor ve
> react-router'ın veri yönlendiricileri (v6.4+) her rota elemanını **kendi dahili
> hata sınırıyla** sarıyor; bu, `App`'in kendi render'ında oluşan bir hatayı kök
> `ErrorBoundary`'ye hiç ulaştırmadan react-router'ın kendi jenerik İngilizce
> "Unexpected Application Error" ekranını gösteriyor (React en yakın hata sınırını
> kullanır — react-router'ınki `RouterProvider`'ın _içinde_, kök `ErrorBoundary`
> _dışında_ kalıyor). Canlı testte (`App.tsx`'in başına geçici `throw new Error("kök
test")` eklenerek) doğrulandı: konsolda `"Error handled by React Router default
ErrorBoundary"` görüldü, kök `ErrorBoundary` hiç devreye girmedi. Düzeltme: her
> rotaya (`main.tsx`) `errorElement={<RouteErrorFallback />}` eklendi — yeni,
> `useRouteError()` kullanan bir fonksiyon bileşeni, aynı "torn-paper" görsel
> kimliğini taşıyor. Kök `ErrorBoundary` artık yalnızca react-router'ın kendisinin
> dışında kalan bir hata için son bir güvenlik ağı.
>
> **Doğrulama:** Canlı ortamda üç senaryo test edildi: (1) `CasesSection`'ın başına
> geçici `throw new Error("test hatası")` eklendi → yalnızca Karanlık Dosyalar
> bölümünde hata kartı çıktı, diğer beş bölüm (Zaman Tüneli, Doğanlar,
> Kaybettiklerimiz, Bilim & Keşif, Sohbet Kartları) normal render edildi, konsolda
> `[Tarih Yaprağı] beklenmeyen hata:` kaydı görüldü; (2) `App.tsx`'in başına geçici
> kök hata eklendi → `errorElement` düzeltmesinden ÖNCE react-router'ın jenerik
> ekranı çıktı, düzeltmeden SONRA projenin kendi Türkçe hata ekranı ("Sayfayı
> yenile"/"Önbelleği temizle" düğmeleriyle) çıktı; (3) her iki geçici `throw`
> testten sonra kaldırıldı, `npm run typecheck`/`npm run build` tekrar temiz.

### O-6 · Erişilebilirlik boşlukları — ✅ ÇÖZÜLDÜ (T-07)

| Sorun                                                                                    | Yer                    |
| ---------------------------------------------------------------------------------------- | ---------------------- |
| Modal'da odak tuzağı (focus trap) ve kapanışta odak iadesi yok                           | `ui.tsx:117-152`       |
| Toaster'da `aria-live` yok — ekran okuyucu bildirimi duymuyor                            | `ui.tsx:159-186`       |
| "Ana içeriğe atla" bağlantısı yok                                                        | `App.tsx`              |
| Arama girdisinde görünür/`aria-label` etiket yok                                         | `App.tsx` üst bar      |
| `text-ink-faint` (#6f7481) koyu zeminde **4.0:1** — WCAG AA eşiği 4.5:1, altında kalıyor | `index.css:22`         |
| Kategori filtre çipleri `aria-pressed` taşımıyor                                         | `sections.tsx:159-180` |

> **✅ Çözüm — T-07 (2026-08-21)**
>
> `Modal` (`ui.tsx`) artık `panelRef` + `tabIndex={-1}` ile Tab döngüsünü paneli
> içinde tutuyor, açılıştan önceki `document.activeElement`'i kaydedip kapanışta
> geri veriyor, isteğe bağlı `titleId` prop'uyla dış sarmalayıcıya
> `aria-labelledby` bağlıyor. `Toaster` kabı `role="status"` `aria-live="polite"`
> `aria-atomic="true"` taşıyor. `App.tsx`'e `<main id="top">`'a giden bir
> "Ana içeriğe atla" bağlantısı (`.skip-link`, yalnızca odaklanınca görünür)
> eklendi. İki arama girdisi (masaüstü/mobil) `type="search"` + `aria-label`
> aldı. `--color-ink-faint` `#6f7481` (≈3,98:1) → `#8b909c` (≈5,82:1) oldu — AA
> eşiğini geçiyor, `ink` > `ink-dim` > `ink-faint` parlaklık sıralaması korunuyor.
> Kategori çipleri (`CatChip`) `aria-pressed={active}` taşıyor. Ayrıca bölüm
> başlıkları (`<h2 id="baslik-0N">`) ile `<section aria-labelledby>` eşleştirildi
> ve bölüm nav'ına `aria-label="Bölümler"` eklendi (talimatın Adım 11'i).
>
> **Doğrulama:** Gerçek bir Lighthouse denetimi (Bash üzerinden, yerel Chrome ile,
> üretim önizlemesine karşı — bu oturumda Browser pane'e hiç ulaşılamadığı için)
> Erişilebilirlik puanını **89 → 96**'ya çıkardı. Kontrast oranları Node'da WCAG
> göreli parlaklık formülüyle elle doğrulandı. Ayrıntı → T-07 Tamamlanma Kaydı.

### O-7 · Klavye kısayolları yalnızca Yayın Modu'nda — ✅ ÇÖZÜLDÜ (T-07)

`BroadcastMode` içinde `←` `→` `Space` `Esc` çalışıyor (`talk.tsx:170-186`), fakat
ana sayfada gün değiştirmek için klavye kısayolu yok. Gün geçişi bu ürünün ana eylemi.

> **✅ Çözüm — T-07 (2026-08-21)**
>
> `App.tsx`'e global bir `keydown` dinleyicisi eklendi: `←`/`→` gün kaydırır
> (`gunKaydir`, `CalendarLeaf`'teki `shift()` ile aynı ay-sınırı mantığı), `T`
> bugüne döner, `/` arama kutusuna odaklanır, `?` bir Kısayol Yardımı `Modal`'ı
> açar, `Esc` kapatır. Arama girdisinde yazarken (`INPUT`/`TEXTAREA`/
> `contentEditable` hedefi), Yayın Modu açıkken **ve açık bir `Modal` varken**
> (`[aria-modal="true"]` kontrolü — talimatın kod parçasında yoktu, bu oturumda
> odak tuzağıyla birleşince ortaya çıkan bir regresyonu önlemek için eklendi,
> bkz. T-07 Tamamlanma Kaydı) kısayollar devre dışı kalıyor.
>
> **Doğrulama:** Kod incelemesiyle talimatın kendi kod parçasına sadakat
> doğrulandı; gerçek tuş vuruşlarıyla canlı deneme bu oturumda Browser pane'e
> ulaşılamadığı için yapılamadı (bkz. T-07 Tamamlanma Kaydı).

### O-8 · Önbellek stratejisi yarım — ✅ ÇÖZÜLDÜ (T-05)

- `memCache` (`wiki.ts:52`) hiç boşaltılmıyor — uzun oturumda sınırsız büyür.
- `localStorage` yedeğinde **zaman damgası/TTL yok**; bir gün için kaydedilen veri
  Vikipedi güncellense bile ağ hatası anında süresiz kullanılır.
- Ayrı ayrı `ty-otd-tr-MM-DD` anahtarları birikiyor, temizlik mekanizması yok.

> **✅ Çözüm — T-05 (2026-08-21)**
>
> `localStorage` kayıtları artık `{ savedAt, data }` zarfında tutuluyor; 24 saatten
> (`TTL_MS`) eski bir kayıt **atılmıyor**, `stale: true` ile dönüyor ve arayüzde
> "önbellekten · 24 saatten eski" (bakır renkte) olarak gösteriliyor —
> `App.tsx`'teki kaynak etiketi. Yeni `pruneCache()`, `ty-otd-` önekli anahtarları
> tarayıp en eski olanlardan başlayarak **60 kaydın üzerini** siliyor; her başarılı
> yazımdan sonra (yalnızca kota dolduğunda değil) çalışıyor. `memCache` için de
> `memSet()` eklendi: **40 kayıt** sınırı, aşılırsa en eski giriş FIFO ile atılıyor.
>
> **Doğrulama:** 25 saat önce yazılmış bir kayıt + tamamen kesik ağ simülasyonuyla
> `stale:true, offline:false` ve önbellekteki verinin doğru döndüğü kanıtlandı.
> 65 sahte kayıt + 1 gerçek yazımla `pruneCache()`'in sayıyı **65'ten 60'a**
> indirdiği doğrulandı. 41 farklı güne art arda istek yapılıp en eskisi tekrar
> istendiğinde **yeni bir ağ isteğinin tetiklendiği** (belleğe alınmış hâlinin FIFO
> ile atıldığı), en yenisinin ise hâlâ bellekte olduğu (yeni istek tetiklemediği)
> canlı olarak kanıtlandı. Ayrıntı → T-05 Tamamlanma Kaydı.

### O-9 · `holidays` verisi çekiliyor ama neredeyse kullanılmıyor — ✅ ÇÖZÜLDÜ (T-09)

`wiki.ts` `holidays` alanını dolduruyor; ekranda yalnızca otomatik sohbet kartlarından
biri olarak (`buildAutoTalk` → `auto-holiday`) dolaylı görünüyor. "Bugünün anlamı"
başlı başına bir bölüm olmayı hak ediyor.

> **✅ Çözüm — T-09 (2026-08-22)**
>
> `App.tsx`'e, Zaman Tüneli'nin **üstünde** (kendi bölümü değil, altın çerçeveli
> kısa bir şerit — `NAV` dizisine eklenmedi, altı bölümlü yapı korundu) `data.holidays`
> listesini gösteren bir blok eklendi; veri yoksa hiç render edilmiyor.
>
> **Doğrulama:** Canlı ortamda 29 Ekim ("Türkiye'de Cumhuriyet Bayramı", "Kızılay
> Haftası…") ve 7 Mart'ta şerit doğru göründü; veri olmayan günlerde (ör. arama
> sonucu boş durumunda) hiç render edilmediği doğrulandı. **Yan bulgu:** 29 Ekim'de
> gerçek Wikimedia yanıtında `holidays` dizisinin 5 öğesinden üçü tek harflik
> çöp metin ("g", "t", "d") — bu, T-09'un ürettiği bir veri değil, Vikipedi TR
> şablonunun kendisinden geliyor (`curl` ile doğrudan API'ye karşı doğrulandı) →
> yeni bulgu O-11, bkz. bölüm 8.

---

## 3. ÜRÜN VE İÇERİK BOŞLUKLARI

### U-1 · Paylaşılabilir bağlantı yok — en büyük ürün eksiği — ✅ ÇÖZÜLDÜ (T-06)

Uygulama tek URL'de çalışıyor. `21 Ağustos` sayfasının adresi yok; kullanıcı seçtiği
günü **paylaşamıyor**, **yer imine ekleyemiyor**, tarayıcı **geri tuşu çalışmıyor**.
"Bugün tarihte" türü bir üründe paylaşım birincil büyüme kanalıdır.

`react-router-dom` zaten kurulu — sadece devreye alınmamış.

> **✅ Çözüm — T-06 (2026-08-21)**
>
> Yeni `src/lib/slug.ts`: `toDaySlug`/`parseDaySlug`, ay adı biçiminde (`/21-agustos`)
> okunur URL'ler üretir; `08-21` gibi sayısal biçimi de kabul edip kanonik ad biçimine
> `replace` ile yönlendirir. `src/main.tsx`'te `createBrowserRouter` üç rota kuruyor:
> `/` (bugüne `replace`), `/:daySlug` (`App`), `*` (yeni `NotFound.tsx`, 404). `App.tsx`
> içindeki `day`/`month` için ayrı `useState` tamamen kaldırıldı; ikisi de artık
> `useParams` → `parseDaySlug` üzerinden **URL'den türetiliyor** — URL tek doğruluk
> kaynağı. Takvim yaprağının altına, mobilde `navigator.share` masaüstünde panoya
> kopyalama yapan bir **Paylaş** düğmesi eklendi. Üretim SPA yönlendirmesi için
> `public/_redirects` (Netlify/Cloudflare) ve kök `vercel.json` eklendi.
>
> **Doğrulama:** Canlı tarayıcıda `/` → `/21-agustos` (bugün) yönlendirmesi,
> `/29-subat`'ın **404 vermediği** (29 Şubat arşiv modunda geçerli), `/32-agustos` /
> `/0-ocak` / `/31-subat` / `/agustos`'un 404 gösterdiği, `/08-21`'in `/21-agustos`'a
> kanonikleştiği doğrulandı. Gerçek tıklamayla hızlı seçim düğmesi ve mini takvimden
> gün değiştirme URL'i güncelledi; tarayıcı geri/ileri tuşu bu geçişler arasında doğru
> gezindi; `/29-ekim`'e doğrudan yükleme bugüne dönmedi. Paylaş düğmesi gerçek
> tıklamayla test edildi — bu ortamda `navigator.share` yok, `copyText` yedeği
> devreye girdi ve işletim sistemi panosunun değiştiği bağımsız olarak doğrulandı.
> `npm run build && npm run preview` sonrası `/29-ekim`'e doğrudan `curl` HTTP 200
> döndürdü (üretim SPA yönlendirmesi çalışıyor). `src/lib/date.ts` + `slug.ts`
> mantığı ayrıca Node'da tarayıcısız, 366 günün tamamı için çift yönlü tutarlılık
> testiyle doğrulandı. Ayrıntı → T-06 Tamamlanma Kaydı (döngüsel import düzeltmesi ve
> Hooks sırası düzeltmesi dahil, ikisi de talimatın taslak koduna göre bir sapmaydı).
>
> **K-5 ile ilişki:** T-06 sırasında K-5 (gezinme düğmeleri gerçek tıklamayla
> çalışmıyor, bkz. bölüm 6) canlı olarak **yeniden doğrulandı** — hâlâ mevcut, hâlâ
> hiçbir talimata atanmadı. T-06 bilinçli olarak K-5'in DOM bölgesine dokunmadı; yeni
> Paylaş düğmesi bu yüzden `CalendarLeaf`'in içine değil, `App.tsx`'te ona komşu
> eklendi (K-5'in etki alanı dışında).

### U-2 · Editör içeriği 366 günün 10'unda (%2,7) — ✅ ÇÖZÜLDÜ (T-10)

`src/data/curated.ts` içinde yalnızca: `02-14`, `03-08`, `04-23`, `04-25`, `05-19`,
`07-20`, `08-20`, `10-29`, `11-10`, `12-31`.

**Sonuç:** Günlerin %97'sinde "Karanlık Dosyalar" ve "Bilim & Keşif" bölümleri ya boş
ya da yalnızca regex taramasının ürettiği zayıf içerikle dolu. Uygulamanın en özgün
iki bölümü çoğu gün sönük kalıyor.

Ayrıca 1.001 satırlık tek dosya, içerik büyüdükçe yönetilemez hâle gelecek.

> **✅ Çözüm — T-10 (2026-08-22)**
>
> **Mimari:** `src/data/curated.ts` silindi; yerine `src/data/types.ts` (tipler +
> `curatedKey()`), `src/data/gunler/` altında 12 ay dosyası (`01-ocak.ts` …
> `12-aralik.ts`, her biri kendi ayının günlerini `Record<string, CuratedDay>`
> olarak dışa aktarır) ve hepsini birleştirip `CURATED`'ı yeniden dışa aktaran
> `src/data/index.ts` geldi. Tüm içe aktarmalar `"./data"` / `"../data"` üzerinden
> — dosya yapısı değişse de çağıran kod etkilenmiyor.
>
> **İçerik:** Editör içeriği 10 günden **60 güne** çıkarıldı (%2,7 → %16,4).
> Mevcut 10 günün içeriği birebir korundu (`sed` ile satır aralığı bazında
> taşındı, elle yeniden yazılmadı — bkz. T-10 Tamamlanma Kaydı'ndaki doğrulama).
> Yeni 50 gün, T-10'un kendi partileme planına göre (Türkiye günleri, dünya
> tarihi, bilim/keşif, kültür/karanlık arşiv + 4 editör seçimi) web
> araştırmasıyla kaynak doğrulanarak yazıldı — talimatın "yapay zekâ ile toplu
> içerik üretimi yasak" notuna rağmen, kullanıcının bu oturum için açık onayıyla
> (bkz. T-10 Tamamlanma Kaydı'ndaki sapma notu). İçerik şablonu artık
> [`ICERIK-SABLONU.md`](ICERIK-SABLONU.md)'da belgeli.
>
> **Doğrulama:** `npm run typecheck` + `npm run build` yeşil; 60/60 gün asgari
> sözleşmeyi (spotlight + ≥1 cases + ≥1 science + ≥2 talk) sağlıyor (geçici bir
> Node betiğiyle taranıp T-12'de kalıcı teste dönüştürülmesi önerilir); tekrarsız
> `id` doğrulandı (`grep -rhoE 'id: "[^"]+"' src/data/gunler/ | sort | uniq -d` boş
> çıktı verdi); paket boyutu artışı +64,64 kB gzip (< 100 kB eşiği, tembel yükleme
> gerekmedi); iki örnek gün (30 Eylül, 25 Aralık) tarayıcıda canlı doğrulandı.

### U-3 · Otomatik sınıflandırma kalitesi ölçülmemiş — ✅ ÇÖZÜLDÜ (T-11)

`classifyItem` ve `detectDarkItem` (eskiden `wiki.ts:151-196`) sıralı regex denemesiyle çalışıyordu:
**ilk eşleşen kural kazanır.** Bu, hem yanlış pozitif hem öncelik hatası üretiyordu.

Somut örnekler:

- `/saldırı/` hem `savas` (2. kural) hem `Şiddet` (5. karanlık tema) kalıbında var.
- `/kazas/` kalıbı "uçak kazası" kadar Osmanlı idari birimi **"Bursa kazası"** ve **"kazasker"** unvanını da yakalar.
- `/patlama/` nüfus patlaması gibi mecazi kullanımları felaket sayar.
- `/ay'/` kalıbı "Ay'a iniş" ile birlikte **"Saray'a"**, **"Saray'ın"** kelimelerini de keşif sayar.
- `/ordu(su)? /` kalıbı **Ordu ili** geçen her cümleyi savaş kategorisine atar.

Bir doğruluk testi yoktu; kural değiştirildiğinde neyin bozulduğu görülemiyordu.

> **✅ Çözüm — T-11 (2026-08-22)**
>
> Sınıflandırma mantığı `wiki.ts`'ten bağımsız bir modüle (`src/lib/classification.ts`)
> taşındı; "ilk eşleşen kazanır" yerine **puanlama** geldi (her kural 1-3 puan,
> kategori bazında toplanır, en yüksek toplam kazanır, eşitlikte dosya başında
> belgelenen sabit bir öncelik sırası — `felaket > savas > siyaset > bilim >
kesif > kultur > spor` — devreye girer). `detectDarkItem` aynı yöntemle yeniden
> yazıldı, ayrıca bir **eşik** kazandı: toplam puan 3'ün altındaysa `null` döner
> (tek başına zayıf bir `saldır` eşleşmesi artık yetmiyor). Yukarıdaki 5 somut
> örneğin hepsi düzeltildi — `kazas`/`ay'`/`ordu(su)? `/`patlama`/`sel( |i)`
> bağlamla birlikte yazıldı (ör. `/\b(uçak|tren|maden|trafik|otobüs) kaza/`),
> `/makale/` (çok genel, ayırt edici değildi) tamamen kaldırıldı,
> `/bat(tı|an)/` gemi/vapur/feribot bağlamına bağlandı. `saldırı`'nın
> `savas`/`Şiddet` çakışması artık **kontrollü**: kategori tarafında orta (2)
> puan, karanlık tarafında zayıf (2, tek başına eşiği geçmiyor) — `bombalı
saldırı`/`silahlı saldır` gibi somut ifadeler ayrıca güçlü (3) sinyal taşıyor.
>
> **Kritik bir yan bulgu:** JS'in `\b`/`\w`'ı yalnızca ASCII harfleri kelime
> karakteri sayıyor — ç/ğ/ı/ö/ş/ü bunun dışında. Sonuç: `\bçığ\b` gibi bir kalıp
> gerçek veride **hiç eşleşmiyordu** (boşluk + Türkçe harf = ikisi de "kelime
> dışı" sayıldığından `\b` hiç oluşmuyor) — bu, kuralları ilk yazdığımda fark
> etmediğim, yalnızca gerçek Vikipedi cümleleriyle test edince ortaya çıkan bir
> hataydı. Türkçe harfle başlayan/biten kalıplarda artık elle yazılmış bir sınır
> (`(?<![a-zçğıöşü])`/`(?![a-zçğıöşü])`) kullanılıyor. Ayrıntı → `classification.ts`
> başındaki yorum, T-11 Tamamlanma Kaydı.
>
> **Doğrulama:** `src/lib/__fixtures__/siniflandirma-ornekleri.ts` — 66 örnek
> (gerçek Vikipedi TR "bugün tarihte" verisinden 16 gün taranarak + talimatın
> kendi örnekleri), 16'sı bilinçli yanlış-pozitif tuzağı. `npm run siniflandirma`
> (yeni betik, `scripts/siniflandirma-raporu.mjs`) altın kümeye karşı **kategori
> doğruluğu %100** (hedef ≥%85), **karanlık kesinlik %100, yanlış pozitif 0**
> (hedef: 0) verdi; 100 öğe sınıflandırma ~3 ms sürdü (hedef <5 ms). Golden
> kümenin ötesinde, aynı 16 günden çekilen **~1.600 gerçek kayıt** üzerinde
> elle tur atıldı (talimatın "gerçek veri turu" adımı): `genel` oranı günlere
> göre %23-%61 arasında değişiyor (ortalama ~%45 — talimatın "%40 altı"
> önerisinden yüksek, bilinçli kabul edildi, aşağıya bakın); 70'den fazla
> gerçek karanlık-işaretli kayıt elle gözden geçirildi, bariz bir yanlış
> pozitif bulunmadı (Eurovision'ın "pandemi **nedeniyle** ertelenmesi" gerçek
> veride yakalanan tek somut yanlış pozitifti, can kaybı/yaralanma yakınlık
> şartı eklenerek düzeltildi — bkz. yukarı).
>
> **Bilinçli olarak kapsam dışı bırakılan iki bulgu:**
>
> 1. `genel` oranının bazı günlerde talimatın önerdiği %40 eşiğinin üstünde
>    kalması (ör. taranan 16 günün ortalaması ~%45) — anahtar kelime listesi
>    genişletildikçe kazanım azalıyor (üç ayrı gerçek-veri turunda toplam ~20
>    yeni kural eklendi, her turda daha az kazanım); daha fazla genişletmek
>    kesinlik riskini artırmadan sürdürülemez hâle geliyor. `%40` bu talimatın
>    Kabul Kriterleri'nde bir sayı olarak yok (yalnızca Doğrulama bölümünde bir
>    sağlık kontrolü önerisi) — resmî ölçütler (kategori ≥%85, karanlık
>    yanlış pozitif 0, kesinlik ≥%90) rahatça aşıldı.
> 2. Anahtar kelime taraması bir felaket sözcüğünün cümlenin **konusu** mu
>    yoksa yalnızca bir **zaman belirteci/isim** mi olduğunu ayıramıyor —
>    ör. "Çernobil Faciası'nın yıl dönümünde bir bilgisayar virüsü yayıldı"
>    gerçek veride hâlâ `facia` kalıbına takılıp karanlık sayılıyor
>    (en yaygın biçim — "X **nedeniyle** ertelendi/iptal edildi" — düzeltildi,
>    bu daha nadir "X'in yıl dönümünde" biçimi düzeltilmeden bırakıldı).
>    Gerçek bir çözüm gömme (embedding) tabanlı anlam analizi gerektirir —
>    T-11'in kendi _Kapsam Dışı_ tablosu bunu açıkça dışarıda bırakıyor
>    ("istemci taraflı ürün, regex yeterli").
>
> Ayrıntı → T-11 Tamamlanma Kaydı.

### U-4 · Site kabuğu eksik: favicon, PWA, SEO, paylaşım kartı — ✅ ÇÖZÜLDÜ (T-08)

`index.html` içinde:

- ❌ favicon (hiç yok — tarayıcı varsayılan simgeyi gösteriyor)
- ❌ `og:title` / `og:description` / `og:image` — sosyal medyada çıplak bağlantı
- ❌ `twitter:card`
- ❌ `manifest.json` — telefona "uygulama olarak ekle" yok
- ❌ `robots.txt`, `sitemap.xml`
- ❌ Service worker — `localStorage` yedeği varken çevrimdışı açılış hâlâ yok
- ✅ `lang="tr"`, `description`, `theme-color` var (bunlar doğru yapılmış)

> **✅ Çözüm — T-08 (2026-08-21)**
>
> `src/components/ui.tsx`'teki `IconLeafMark` yol verisinden, marka renkleriyle
> (`#d23b2e` / `#f2ead9` / `#0f131a`) 7 görsel üretildi (`scripts/generate-brand-assets.mjs`,
> elle çalıştırılır: `npm run icons`): `favicon.svg`, `favicon.ico` (16/32/48 birleşik),
> `apple-touch-icon.png` (180×180), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`
> (güvenli alan payı hesaplanarak bırakılmış), `og-image.png` (1200×630, Fraunces + IBM Plex
> Mono `google/fonts` deposundan indirilip gömülü). `index.html`'e favicon/`apple-touch-icon`/
> `manifest` `<link>`'leri, tam `og:*`/`twitter:*` seti, boş bir `canonical` yer tutucusu ve
> `WebSite` JSON-LD eklendi. `App.tsx`'e gün değişince `document.title`, meta açıklama,
> `og:title`/`og:description` ve `canonical`'ı güncelleyen bir `useEffect` eklendi.
> `public/manifest.webmanifest` ve `public/robots.txt` eklendi; `scripts/sitemap.mjs`
> (`npm run build`'a bağlı) 366 günün tamamı için adres üretiyor. `vite-plugin-pwa` ile bir
> service worker kuruldu (Wikimedia API için `NetworkFirst`, Wikimedia görselleri için
> `CacheFirst`).
>
> **Doğrulama:** Gerçek bir Lighthouse denetimi (Bash üzerinden, Browser pane'den bağımsız —
> T-07'deki gibi `npx lighthouse` + yerel Chrome, üretim önizlemesine karşı) **SEO 100/100**
> verdi (ilk ölçüm 92'ydi; tek başarısız denetim, talimatın kendi kod parçasındaki göreli
> `Sitemap:` satırının sitemaps.org protokolüne göre geçersiz olmasıydı — mutlak yer tutucu
> URL'e düzeltildi). Canlı tarayıcıda gün değişince `document.title` ve
> `link[rel=canonical]`'ın hem tam sayfa yüklemede hem `←`/`→` klavye kısayoluyla istemci
> taraflı geçişte doğru güncellendiği doğrulandı; tüm 7 görsel dosya `curl`/`fetch` ile doğru
> `Content-Type` ve boyutla servis edildiği, `manifest.webmanifest`'in `application/
manifest+json` ile geçerli JSON olduğu, JSON-LD'nin geçerli JSON olduğu (Lighthouse
> `structured-data` denetimi de geçti) doğrulandı. `npm run sitemap` 366 adres üretti,
> son satır `29-subat` içeriyor; `scripts/sitemap.mjs`'teki ay-slug listesi `src/lib/slug.ts`
> içindeki `MONTH_SLUGS` ile birebir eşit olduğu Node'da elle karşılaştırılarak doğrulandı.
> **Servis çalışanının canlı kaydı bu oturumda doğrulanamadı** — sunucu tarafı (`sw.js`'in
> doğru içerik/`Content-Type` ile servis edildiği, geçerli Workbox çıktısı olduğu) kanıtlandı,
> ama Browser pane'in sandbox'lanmış tarayıcısında `navigator.serviceWorker.register(...)`
> hem kendi `sw.js`'i hem tamamen ilgisiz, tek satırlık bir kontrol script'i için **aynı**
> `"An unknown error occurred when fetching the script."` hatasıyla başarısız oldu — bu ortamın
> service worker kaydını genel olarak engellediğinin kanıtı, kod kusuru değil. Ayrıntı →
> T-08 Tamamlanma Kaydı.

### U-5 · Kalite güvencesi altyapısı hiç yok — ✅ ÇÖZÜLDÜ (T-12)

- Test yok (birim, bileşen, uçtan uca — hiçbiri)
- ESLint yapılandırması yok
- Prettier / biçimlendirme kuralı yok
- CI (GitHub Actions vb.) yok
- `README.md` iki satır

Kritik saf fonksiyonlar (`dayOfYear`, `classifyItem`, `formatYear`, `firstSentence`,
`normalize`) test edilmeye çok uygun ve şu an hiçbiri korunmuyor.

> **✅ Çözüm — T-12 (2026-08-22)**
>
> Vitest (`jsdom` ortamı + v8 kapsam sağlayıcısı) kuruldu; 7 yeni test dosyası,
> **203 test**: `date.test.ts` (K-1 regresyonu — 2026→233), `slug.test.ts`
> (366 gün çift yönlü tutarlılık), `classification.test.ts` (66 örneklik altın
> küme — T-11'in ölçtüğü %100 kategori doğruluğu/0 yanlış pozitif burada
> kalıcı hâle geldi), `wiki.test.ts` (`normalize`, `classifyStatus`,
> `buildAutoTalk`), `sections.test.ts` (Türkçe `matchQuery`), `data.test.ts`
> (`CURATED` bütünlüğü), `ui.test.tsx` (`CountUp` K-2 regresyonu). `src/lib`
> satır kapsamı **%78,78** (746/947, hedef ≥%70). ESLint (flat config,
> `rules-of-hooks`+`exhaustive-deps`) ve Prettier kuruldu, `npm run kontrol`
> (typecheck+lint+test+build) tek komut hâline getirildi; `.github/workflows/
kontrol.yml` eklendi.
>
> **Üç önemli, bu oturumda gerçek çalıştırmayla keşfedilen sapma** (hiçbiri
> uygulama davranışını değiştirmedi — hepsi test/araç seviyesinde çözüldü):
>
> 1. **jsdom'un `requestAnimationFrame`'i gerçek tarayıcılarla tutarsız bir
>    saat veriyor** — geri çağrıya _pencere oluşturma anına göre sıfırlanmış_
>    bir zaman damgası verirken, doğrudan `performance.now()` çağrıları bu
>    sıfırlamayı görmüyor (gerçek tarayıcılarda ikisi her zaman aynı saattir).
>    `CountUp`'ın tamamen standart `t0 = performance.now()` mantığı bu yüzden
>    jsdom'da devasa bir sapmaya düşüyordu; bileşen dokunulmadı, test rAF'ı tek
>    bir saate bağlayan bir kuklayla yazıldı.
> 2. **Bugün kurulan güncel `vitest`/`@vitest/coverage-v8` (4.1.11) gerçek bir
>    kapsam-raporlama hatası içeriyordu** — yoğun test edilen bazı dosyalar
>    (`date.ts`, `classification.ts`, `config.ts`, `data/gunler/*.ts`) kapsam
>    raporunda tamamen kayboluyordu (istanbul sağlayıcısı ve `all:true` da
>    denendi, sorun sürdü). Köklü **3.2.7** hattına sabitlenerek tamamen
>    çözüldü.
> 3. **Bugün kurulan güncel `eslint-plugin-react-hooks` (7.x)** `recommended`
>    setinde React Compiler'a yönelik ~16 kural taşıyor — bu proje React
>    18'de, derleyici olmadan çalıştığı için o kurallar idiomatik kodu hatalı
>    "hata" sayıyordu; yalnızca klasik `rules-of-hooks`+`exhaustive-deps`'e
>    daraltıldı.
>
> **Doğrulama:** mutasyon denemeleri gerçek koruma sağladığını doğruladı —
> `dayOfYear`'ın gövdesinde `year` parametresi görmezden gelindiğinde 3 test
> kırmızı oldu; `slug.ts`'in Türkçe harf eşlemesi bozulduğunda 2 test kırmızı
> oldu (ikisi de denemeden sonra geri alındı). `başlat.bat` `npm run format`
> sonrası hâlâ CRLF. Ayrıntı → T-12 Tamamlanma Kaydı.

---

## 4. Küçük Notlar

| #   | Bulgu                                                                                                                                                                                                                                                                                                                            | Yer                                         |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| m-1 | ~~`NAV[stats.indexOf(s)]` — dizi sırasına gizli bağımlılık, kırılgan~~ **✅ ÇÖZÜLDÜ (T-13)** — her `stat` nesnesine doğrudan bir `hedef` alanı eklendi, `NAV`/`indexOf` bağımlılığı tamamen kaldırıldı                                                                                                                           | `src/components/GunOzeti.tsx`               |
| m-2 | ~~`vite.config.js` — proje TS olduğu hâlde config JS~~ **✅ ÇÖZÜLDÜ (T-01)** — `vite.config.ts`                                                                                                                                                                                                                                  | kök                                         |
| m-3 | ~~`CasesSection` otomatik dosyaları `slice(0, 6)` ile kesiyor, "daha fazla" yok~~ **✅ ÇÖZÜLDÜ (T-09)** — sınır kaldırıldı, "N dosya daha göster" düğmesi eklendi (aynı desen `ScienceSection`'daki `slice(0,3)`'e de uygulandı)                                                                                                 | `App.tsx` allCases, `sections.tsx`          |
| m-4 | ~~Ticker `55s` sabit; 3 öğede de 14 öğede de aynı hız~~ **✅ ÇÖZÜLDÜ (T-13)** — süre öğe sayısına göre hesaplanıyor (`öğe × 4s`, 20-90s arasında sınırlı), satır içi `animationDuration` ile uygulanıyor (canlı doğrulandı: 14 öğede 56s)                                                                                        | `src/components/leaf.tsx` Ticker            |
| m-5 | ~~Kişi kartlarında görseller `loading="lazy"` var ama `width/height` yok → düzen kayması~~ **✅ ÇÖZÜLDÜ (T-07)** — kart küçük resmi `248×132`, modal küçük resmi `96×112`                                                                                                                                                        | `sections.tsx` PeopleRow                    |
| m-6 | ~~Arama sonucu global sayacı yok; kullanıcı hangi bölümde kaç sonuç olduğunu göremiyor~~ **✅ ÇÖZÜLDÜ (T-09)** — toplam + bölüm bazlı sayaç şeridi, `aria-live` duyurusu, sonuç yoksa tek boş durum ekranı                                                                                                                       | `App.tsx`                                   |
| m-7 | Yazdırma (print) stil sayfası yok — kart çıktısı alınamıyor                                                                                                                                                                                                                                                                      | `index.css`                                 |
| m-8 | `estimateMinutes`'ın "3 dakika" eşiği (`n ≥ 460`) `buildAutoTalk`'ın hiçbir çağrı noktasından tetiklenemez — her girdi ona ulaşmadan önce `firstSentence(…, 420)` ile ≤420 karaktere kırpılıyor (420 < 460). Yalnızca bir okuma-süresi rozetini etkiler, T-12 testleri yazılırken keşfedildi, zararsız kabul edilip düzeltilmedi | `lib/wiki.ts` buildAutoTalk/estimateMinutes |

---

## 5. Öncelik Sıralaması (öneri)

```
ÖNCE   →  K-1✅ K-2✅ K-4✅  K-5   (görünür yanlış bilgi + bozuk geliştirme deneyimi + kırık birincil gezinme)
SONRA  →  O-1✅ O-2✅ O-3✅     (temizlik — sonraki her iş bundan faydalanır)  [T-01 ile bitti]
SONRA  →  K-3✅ O-5✅ O-6✅       (sağlamlık ve erişilebilirlik)  [O-5 T-09, O-6 T-07 ile bitti]
SONRA  →  U-1✅ U-4✅           (paylaşım + kabuk — ürünü "yayınlanabilir" yapar)  [U-1 T-06, U-4 T-08 ile bitti]
SONRA  →  O-4✅ O-7✅ O-8✅ O-9✅   (ağ, klavye, önbellek, içerik zenginliği)  [O-4/O-8 T-05, O-7 T-07, O-9 T-09 ile bitti]
SONRA  →  U-2✅ U-3✅            (içerik hacmi ve doğruluğu — sürekli iş)  [U-2 T-10, U-3 T-11 ile bitti]
SON    →  U-5✅                 (test/lint — sonraki tüm işleri korur)  [T-12 ile bitti]
```

Bu sıralama `../Talimatlar/PLAN-01-temel-duzeltme-ve-tamamlama.md` dosyasında
T-01…T-14 talimatlarına dönüştürülmüştür. K-5, T-03 sırasında keşfedilmiş yeni
bir bulgudur ve henüz bir talimata atanmamıştır — bkz. bölüm 6. O-10, T-07
sırasında (gerçek bir Lighthouse denetimiyle) keşfedilmiş yeni bir bulgudur ve
henüz bir talimata atanmamıştır — bkz. bölüm 7. O-11, T-09 sırasında keşfedilmiş
yeni bir bulgudur ve henüz bir talimata atanmamıştır — bkz. bölüm 8. O-12, T-10
sırasında keşfedilmiş yeni bir bulgudur ve henüz bir talimata atanmamıştır —
bkz. bölüm 9.

---

## 6. T-03 Sırasında Keşfedilen Yeni Bulgu (2026-08-21)

> Bu bölüm ilk analiz anının parçası değildir. T-03 (takvim/tarih doğruluğu)
> talimatının canlı doğrulaması sırasında keşfedilmiş, ilk analizde
> yakalanmamış yeni bir bulgudur. K-serisi numaralandırması sürdürülür.

### K-5 · "Önceki gün" / "Sonraki gün" / "Bugüne dön" düğmeleri gerçek bir tıklamayla tetiklenemiyor — ✅ ÇÖZÜLDÜ (T-15)

**Dosya:** `src/components/leaf.tsx:69-70` (dekoratif "arkadaki yapraklar" katmanı) ve `:127-160` (gün navigasyonu)

```tsx
<div className="relative" style={{ perspective: "1400px" }}>
  {/* arkadaki yapraklar */}
  <div className="absolute inset-0 translate-y-3 translate-x-2 rounded-sm bg-paper-2/70 rotate-2" />
  <div className="absolute inset-0 translate-y-1.5 translate-x-1 rounded-sm bg-paper-2 rotate-1" />

  <div className="paper torn-edge relative w-full ...">...</div>

  {/* yaprak navigasyonu — position sınıfı YOK (static) */}
  <div className="flex items-center justify-between mt-7">
    <button onClick={() => shift(-1)} aria-label="Önceki gün">
      ...
    </button>
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

> **Güncelleme (T-06, 2026-08-21):** Canlı olarak yeniden doğrulandı, hâlâ mevcut.
> T-06 bilinçli olarak dokunmadı; T-07 için önerildi (aynı gezinme bölgesine
> dokunacağı varsayımıyla).
>
> **Güncelleme (T-07, 2026-08-21):** Bu varsayım **doğrulanmadı** — T-07'nin 11
> adımının hiçbiri `leaf.tsx`'e dokunmadı (klavye kısayolları `App.tsx`'te ayrı bir
> global dinleyici olarak yaşıyor). Ayrıca K-5 bir **fare/dokunmatik**
> hit-testing hatasıdır (yukarıdaki kanıt `button.click()`'in doğru çalıştığını
> gösteriyor); `Tab` + `Enter` ile klavye üzerinden düğmeye ulaşıp etkinleştirmek
> bu hatadan **etkilenmiyor**. Bu oturumda Browser pane'e hiç ulaşılamadığı için
> (bkz. T-07 Tamamlanma Kaydı) canlı olarak yeniden doğrulanamadı. K-5 hâlâ
> atanmadı; `leaf.tsx`'e gerçekten dokunacak bir sonraki talimat (T-13 ya da yeni
> bir T-15) önerilir.
>
> **Çözüm (T-15, 2026-08-24):** ✅ Kök neden doğrulandı ve giderildi. İki dekoratif
> katman, kartın kendi `relative` sarmalayıcısının içine alındı — `inset-0` artık
> dış sütunun tamamını değil **yalnızca kartın kutusunu** ifade ediyor; ayrıca
> ikisine de `pointer-events-none` ve `aria-hidden="true"` eklendi, gezinme satırı
> `relative` yapıldı. Üç düğme de gerçek fare tıklamasıyla doğrulandı
> (29 Ekim → 30 Ekim → 29 Ekim → bugün).
>
> **Kayda geçmemiş ikinci belirti:** Bu bulgu yalnızca _tıklanamama_ olarak
> yazılmıştı. T-15 hazırlanırken alınan gerçek tarayıcı ekran görüntüsü, dekoratif
> katmanın rengi (`#e7dcc4`, opak) nedeniyle gezinme satırını **görsel olarak da
> örttüğünü** gösterdi: "ÖNCEKİ GÜN" / "BUGÜNE DÖN" / "SONRAKİ GÜN" yazılarının
> hiçbiri okunmuyordu, kartın altında boş bir krem blok görünüyordu. Yani hatanın
> etkisi kayıtlı hâlinden **daha ağırdı**. Düzeltme her iki belirtiyi de giderdi.
>
> **Ölçüm (düzeltme sonrası, 29 Şubat, mini takvim açık):** dekor kutuları
> 160-645 / 157-635, kart 155-626, gezinme satırı **654-712** — dekorun tamamen
> dışında. Sayfadaki 148 görünür denetimin hiçbiri `elementFromPoint` testinde
> engellenmiyor.

---

## 7. T-07 Sırasında Keşfedilen Yeni Bulgular (2026-08-21)

> Bu bölüm ilk analiz anının parçası değildir. T-07 (erişilebilirlik ve klavye)
> talimatının doğrulaması sırasında — bu kez Browser pane'e ulaşılamadığı için
> Bash üzerinden gerçek bir Lighthouse (axe-core tabanlı) denetimiyle — keşfedilmiş,
> ilk analizde yakalanmamış bulgulardır.

### Aynı oturumda keşfedilip düzeltilen iki hata

Talimatın 11 adımının parçası değildi; `npm run build && npm run preview`'a karşı
çalıştırılan gerçek bir Lighthouse denetimi (89/100) tarafından yakalandı ve her
ikisi de tek satırlık, sıfır görsel etkili düzeltmelerle aynı oturumda giderildi
(ikinci denetim: 96/100):

| #   | Bulgu                                                                                                                                                | Yer            | Düzeltme                                                            |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------- |
| 1   | Üst bardaki "Yayın Modu" düğmesinin metni `hidden md:inline` — dar viewport'ta düğmenin tek içeriği `aria-hidden` bir SVG ikon, erişilebilir adı yok | `App.tsx`      | `aria-label="Yayın Modu"` eklendi                                   |
| 2   | `PeopleRow` kart başlığı `<h4>`, `<h2>` (bölüm başlığı) altında doğrudan geliyor — `h3` atlanıyor                                                    | `sections.tsx` | `<h4>` → `<h3>` (kişi modalındaki başlık zaten `<h3>`, çakışma yok) |

### O-10 · `text-brand` koyu zeminde metin/simge rengi olarak yetersiz kontrast — ⏭️ PLAN-02'YE DEVREDİLDİ

**Dosyalar:** `src/components/leaf.tsx:267` (`Ticker` başlığı), `src/components/sections.tsx` (`CasesSection` dosya türü rozeti ve "Dosyayı aç/kapat" düğmesi)

Gerçek Lighthouse/axe denetimi üç yerde `color-contrast` hatası verdi — hepsi
`--color-brand` (#d23b2e) kırmızısının **metin/simge rengi** olarak kullanıldığı
ve arka planla yeterli kontrast oluşturmadığı yerler:

| Yer                                               | Renk çifti                                       | Ölçülen oran | AA eşiği |
| ------------------------------------------------- | ------------------------------------------------ | ------------ | -------- |
| `Ticker` "Bugün Tarihte" etiketi                  | `text-paper` (#f2ead9) / `bg-brand` (#d23b2e)    | **3,98:1**   | 4,5:1    |
| `CasesSection` dosya türü rozeti (örn. "SUİKAST") | `text-brand` (#d23b2e) / panel zemini (~#171d29) | **≈3,54:1**  | 4,5:1    |
| `CasesSection` "Dosyayı aç/kapat" düğmesi         | `text-brand` (#d23b2e) / panel zemini            | **≈3,54:1**  | 4,5:1    |

(Oranlar Node'da WCAG göreli parlaklık formülüyle elle hesaplandı, ardından
gerçek bir Lighthouse denetimiyle bağımsız olarak doğrulandı.)

**Etki:** Karanlık Dosyalar bölümü **her açık günde görünen** iki öğeyi (dosya
türü rozeti + aç/kapat düğmesi) düşük kontrastlı metinle gösteriyor; düşük
görüşlü kullanıcılar için okunabilirlik sorunu.

**Kapsam notu:** T-07 yalnızca `--color-ink-faint` (ve gerekirse `--color-ink-dim`)
değişikliğine izin veriyordu (bkz. talimatın _Kapsam Dışı_ tablosu); `--color-brand`
tamamen farklı bir renk ve `ink-faint` gibi talimatın hazır bir değer verdiği bir
durum değil — metin kullanımı için daha açık bir kırmızı ton mu gerekiyor, yoksa
bu iki yerin arka plan/kullanım biçimi mi değişmeli, bu ayrı bir tasarım kararı.
Bu yüzden T-07 **bilinçli olarak** dokunmadı (bkz. T-07 Tamamlanma Kaydı).

**Önerilen talimat:** Henüz hiçbir talimata atanmadı. `sections.tsx`'e zaten
dokunacak bir talimat (T-11 sınıflandırma doğruluğu, ya da T-13 performans/temizlik)
iyi bir aday olabilir; ayrı bir küçük talimat da (`--color-brand`'ın metin
kullanımı için daha açık bir varyantını tanımlamak, örn. `--color-brand-light`)
mümkün — nihai karar plan sahibine aittir.

---

## 8. T-09 Sırasında Keşfedilen Yeni Bulgu (2026-08-22)

> Bu bölüm ilk analiz anının parçası değildir. T-09 (hata sınırı ve durum
> ekranları) talimatının canlı doğrulaması sırasında keşfedilmiş, ilk analizde
> yakalanmamış bir bulgudur.

### O-11 · `holidays` alanında Vikipedi şablon artığı çöp kayıtlar — ⏭️ PLAN-02'YE DEVREDİLDİ

**Dosya:** `src/lib/wiki.ts:252-255` (`holidays` üretimi — dokunulmadı, yalnızca kanıtlandı)

T-09, O-9'u çözerken (`data.holidays`'i bir "Bugünün anlamı" şeridinde gösterme)
29 Ekim'de şeridin üç anlamsız tek harfli madde gösterdiği görüldü: `g`, `t`, `d`.
Gerçek Wikimedia API'sine doğrudan `curl` ile bakıldığında bunun uygulamanın bir
hatası olmadığı, **Vikipedi TR'nin kendi "bugün tarihte" şablonundan** geldiği
doğrulandı:

```bash
curl -s "https://api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/all/10/29"
```

`holidays` dizisinin 5 öğesinden üçü şunlar (API yanıtından, kısaltılmış):

```json
{ "text": "g", "pages": [{ "title": "Şablon:Aylar", "namespace": { "id": 10, "text": "Şablon" }, ... }] }
{ "text": "t", "pages": [{ "title": "Şablon_tartışma:Aylar", "namespace": { "id": 11, "text": "Şablon tartışma" }, ... }] }
{ "text": "d", "pages": [] }
```

Bu üç kaydın ortak noktası: bağlı oldukları sayfa (varsa) `Şablon:` / `Şablon
tartışma:` ad alanında (Vikipedi'nin "ay şablonu" navigasyon kalıbının bir
artığı olduğu görülüyor — muhtemelen "gün/tarih/devam" gibi gezinme
bağlantılarının kısaltmaları), gerçek bir ansiklopedi maddesi değil.

**Etki:** "Bugünün anlamı" şeridi (T-09) bazı günlerde ciddi iki-üç satırın
yanına anlamsız tek harfler ekliyor — küçük ama görünür bir kalite sorunu, tam
da T-09'un "kullanıcıya boş/anlamsız bir şeyle karşılaştırmama" amacına ters.

**Kapsam notu:** `holidays`'in **üretimi** (`wiki.ts`, T-05'in kapsamı) T-09'un
_Kapsam Dışı_ tablosunda "burada yalnızca gösteriliyor" diye işaretliydi; T-09
veriyi olduğu gibi gösterdi, filtrelemedi. Bu bilinçli bir seçimdi (talimatın
kendi kod parçası da filtresizdi) — ama bulgu gerçek ve gösterilebilir bir
düzeltmesi var.

**Önerilen düzeltme (küçük):** `wiki.ts`'teki `holidays` üretiminde, sayfası
`Şablon` / `Şablon tartışma` ad alanında olan (veya metni belirli bir uzunluğun
altında kalan, ör. 3 karakterden kısa) kayıtları süzmek — bu, gerçek tatil/anma
günü metinlerini etkilemez, yalnızca şablon navigasyon artıklarını eler.

**Önerilen talimat:** Henüz hiçbir talimata atanmadı. `wiki.ts`'e zaten dokunacak
bir talimat (T-11 sınıflandırma doğruluğu) iyi bir aday olabilir; ayrı bir küçük
talimat da mümkün — nihai karar plan sahibine aittir.

---

## 9. T-10 Sırasında Keşfedilen Yeni Bulgu (2026-08-22)

> Bu bölüm ilk analiz anının parçası değildir. T-10 (içerik mimarisi ve kapsam
> genişletme) talimatının canlı doğrulaması sırasında keşfedilmiş, ilk analizde
> yakalanmamış bir bulgudur.

### O-12 · `allScience` (Bilim & Keşif), editör kaydını Vikipedi'nin aynı olayına karşı ayıklamıyor — ⏭️ PLAN-02'YE DEVREDİLDİ

**Dosya:** `src/App.tsx:261-277` (`allScience` useMemo'su)

`mergedEvents` (Zaman Tüneli), editör olaylarını `matchKeys` ile Vikipedi'nin
otomatik olaylarına karşı ayıklıyor (bkz. `ANALIZ-RAPORU.md` §... / `MIMARI.md`
§3.2). `allScience` aynı korumaya sahip değil:

```ts
const allScience = useMemo(() => {
  const base = (curated?.science || []).map((s) => ({ ...s, curated: true as const }));
  const auto = (data?.events || [])
    .filter((e) => classifyItem(e.text) === "bilim" || classifyItem(e.text) === "kesif")
    .map((e) => ({ ... , curated: false }));
  return [...base, ...auto].sort((a, b) => b.year - a.year);   // ← ayıklama yok
}, [data, curated]);
```

**Kanıt (canlı, 18 Mart):** T-10'da eklenen `sci-0318-leonov` (Editör rozetli,
Leonov'un uzay yürüyüşünü anlatan curated kayıt) ile Vikipedi'nin kendi
`onthisday` akışındaki aynı olay ("İnsanoğlu ilk kez uzayda yürüdü. Sovyet
kozmonot Aleksey Leonov...") **Bilim & Keşif bölümünde art arda iki ayrı kart**
olarak göründü — biri "EDİTÖR" rozetli, diğeri rozetsiz, ikisi de aynı 1965
olayını anlatıyor.

**Etki:** Bir curated `science` kaydının anlattığı olay Vikipedi'nin günlük
`events` akışında da geçiyorsa (yaygın bir durum — bilinen bilim dönüm
noktalarının çoğu zaten Vikipedi'nin kendi "tarihte bugün" listesinde), Bilim &
Keşif bölümü aynı bilgiyi iki kez gösteriyor. Bu, T-10'dan önce de var olan bir
mimari boşluktu (`ScienceMilestone` tipinde hiç `matchKeys` alanı yok); T-10
yalnızca veri eklediği için bulguyu **görünür kıldı**, kendisi üretmedi —
örneğin mevcut 10 günden `07-20`'nin (Apollo 11) science kaydının da aynı
şekilde çakıştığı büyük olasılıkla.

**Kapsam notu:** T-10'un kapsamı açıkça "yalnızca veri" ve "sınıflandırma
regex'leri T-11'e ait" diye sınırlıydı (bkz. T-10 _Kapsam Dışı_ tablosu); bu
bulgunun düzeltmesi `ScienceMilestone`'a `matchKeys` benzeri bir alan eklemeyi
ve `App.tsx`'teki `allScience`'a `mergedEvents`'inkine benzer bir ayıklama
mantığı yazmayı gerektiriyor — bu, veri şemasını **ve** bileşen mantığını
değiştiren bir iş, T-10'un veri-yalnızca sınırının açıkça dışında.

**Önerilen düzeltme (orta boy):** `CuratedEvent.matchKeys`'e benzer bir
`ScienceMilestone.matchKeys?: string[]` alanı eklemek, `allScience`'ı
`mergedEvents`'teki gibi ayıklamak. Geriye dönük uyumluluk için alan **isteğe
bağlı** olmalı (mevcut ve yeni science kayıtlarının çoğunda henüz yok).

**Önerilen talimat:** Henüz hiçbir talimata atanmadı. T-11 (sınıflandırma
doğruluğu) hem `wiki.ts` hem `App.tsx`'in ayıklama/eşleştirme mantığına zaten
dokunacağı için uygun bir aday olabilir; ayrı bir küçük talimat da mümkün —
nihai karar plan sahibine aittir.

---

## 10. T-13 Sırasında Keşfedilen Yeni Bulgu (2026-08-23)

> Bu bölüm ilk analiz anının parçası değildir. T-13 (performans ve derleme
> iyileştirmesi) talimatı sırasında, `npm audit` çalıştırılırken keşfedilmiş,
> kod mantığı değil **bağımlılık güvenliği** ile ilgili bir bulgudur.

### O-13 · `react-router-dom`'un dolaylı bağımlılığı `react-router`'da 2 orta seviye güvenlik danışma kaydı — ✅ ÇÖZÜLDÜ (T-22)

**Dosya:** `package.json` (dolaylı: `react-router-dom` → `react-router`)

`npm audit` şu ikisini bildiriyor:

- **Open redirect via backslash in `<Link>` and `useNavigate`**
  (CVE-2025-68470 bypass)
- **Arbitrary Constructor Injection via `deserializeErrors()`** — React
  Router SSR Hydration sırasında

Düzeltme `react-router-dom@7.18.2`'ye **kırılma içeren** bir yükseltme
gerektiriyor (`npm audit fix --force`); mevcut sürüm T-06'nın kurduğu
`createBrowserRouter` API'sini kullanıyor, 6→7 geçişi `src/main.tsx` ve
muhtemelen `src/lib/slug.ts`/`App.tsx`'in yönlendirme çağrılarını etkileyebilir.

**Risk değerlendirmesi (hafifletici, kanıt değil):** İkinci danışma SSR
hydration'a özgü — bu proje **backend'siz, saf istemci taraflı bir SPA**
(bkz. `BAGLAM.md` §2), SSR hiç yapılmıyor, bu yüzden o vektör muhtemelen
uygulanmıyor. Birincisi (`<Link>`/`useNavigate` açık yönlendirme) için
projedeki tüm `navigate()`/`toDaySlug()` çağrıları yalnızca doğrulanmış
sayısal `day`/`month` değerlerinden URL kurar (`parseDaySlug` ile
ayrıştırılmış ya da `new Date()`'ten gelir) — hiçbir yerde ham, kullanıcı
kontrollü bir dize doğrudan `navigate()`'e verilmiyor. Yine de bu bir kanıt
değil, yalnızca bu spesifik kod tabanında **şu anki** kullanım örüntüsünün
gözlemlenen bir özelliği; paket kendisi hâlâ güvenlik açığı taşıyor ve
yükseltilmeli.

**Önerilen düzeltme:** `react-router-dom@7.x`'e ayrı, dikkatli bir talimatla
yükseltmek — `createBrowserRouter`/`useNavigate`/`useParams` kullanım
noktalarının (T-06, `src/main.tsx`, `src/App.tsx`) hepsini regresyon
testleriyle (T-12'nin 203 testi + T-13'ün 3 günlük canlı regresyon turu)
doğrulayarak.

**Önerilen talimat:** Henüz hiçbir talimata atanmadı. PLAN-01'in kapsamı
dışında yeni, küçük bir talimat (ör. T-15) ya da PLAN-02'nin bakım
kapsamına alınabilir — nihai karar plan sahibine aittir.

> **✅ Çözüm — T-22 (2026-09-02)**
>
> `react-router-dom` `^6.8.0` → **`^7.18.3`** (`npm install react-router-dom@7`;
> `npm audit fix --force` bilerek kullanılmadı, başka paketlere dokunmasın diye).
> Her iki danışma kaydı da kapandı: `npm audit` artık **0 açık** bildiriyor.
>
> **Kırıcı değişiklik çıkmadı.** v7'de `react-router-dom` ince bir yeniden dışa
> aktarım katmanına dönüşmüş (`export * from "react-router"` + `react-router/dom`
> kaynaklı `RouterProvider`), kullanılan altı API'nin (`createBrowserRouter`,
> `RouterProvider`, `Navigate`, `useNavigate`, `useParams`, `Link`,
> `useRouteError`, `isRouteErrorResponse`) hiçbirinin imzası değişmedi.
> `errorElement` v7'de **kaldırılmadı** — veri yönlendirici rota nesnesinde
> hâlâ geçerli; `ErrorBoundary` alanı yalnızca çerçeve kipi (framework mode)
> rota modülleri içindir, bu proje onu kullanmıyor. Uygulama kodunda **tek bir
> satır bile değişmedi**; yalnızca `package.json` + `package-lock.json`.
>
> **Doğrulama (canlı, `npm run dev`):** `/` → `/2-eylul`; `/08-21` → `/21-agustos`
> (adres çubuğunda `replace` ile yeniden yazıldı); `/21-agustos` doğrudan açıldı;
> `/29-subat` açıldı; `/abc` → `NotFound`. Geri/ileri tuşu gün geçmişinde doğru
> çalıştı (21 → 22 → 23 Ağustos, geri → 22, geri → 21, ileri → 22; her adımda
> `document.title` de birlikte değişti). Üç günde (29 Ekim · 7 Mart · 29 Şubat)
> gün gezinme düğmeleri, mini takvim ve paylaş bağlantısı çalıştı; 29 Şubat ↔
> 1 Mart artık gün sınırı iki yönde de doğru; Şubat mini takvimi 29 gün
> gösterdi (arşiv kipi). Konsolda v6'nın gelecek bayrağı (future flag) uyarıları
> **kayboldu**, yeni uyarı çıkmadı.
>
> **`errorElement` yeniden doğrulaması (T-09 notu, §12.4):** `App.tsx`'e geçici
> bir `throw` konuldu. Türkçe `RouteErrorFallback` kartı çıktı (react-router'ın
> jenerik İngilizce ekranı değil); konsolda **yalnızca** `[Tarih Yaprağı]
beklenmeyen hata (rota):` göründü — kök `ErrorBoundary`'nin `(rota)` eki
> **olmayan** mesajı hiç düşmedi. React'in bileşen yığını da bunu doğruladı:
> `App → RenderedRoute → RenderErrorBoundary` (react-router'ın kendi iç sınırı)
> → … → `RouterProvider` → `ErrorBoundary` (bizimki, tetiklenmemiş).
> **v7'de davranış aynen korunuyor.** Geçici `throw` geri alındı.
>
> **Yan etki:** `react` satıcı parçası 206,26 kB → **235,93 kB** (gzip 67,36 →
> 77,28 kB) büyüdü; v7 çalışma zamanı v6'dan büyük. `vite.config.ts`'in
> `manualChunks` girdisine dokunmak gerekmedi — Rollup, `react-router`'ı
> `react-router-dom` üzerinden aynı satıcı parçasına aldı (T-13'ün uzun vadeli
> önbellek amacı korundu; `index` parçası 385,25 kB'de sabit kaldı).

---

## 11. Bulgu Durum Tablosu — PLAN-01 Kapanışı (2026-08-24)

> Bu tablo, raporun tamamındaki bulguların tek sayfalık özetidir. Ayrıntı ve kanıt
> için ilgili bulgunun kendi bölümüne bakın; düzeltmenin nasıl yapıldığı için
> talimatın Tamamlanma Kaydı'na → [`../Talimatlar/Tamamlandı/`](../Talimatlar/Tamamland%C4%B1/).

### Kritik hatalar — 5 / 5 çözüldü

| Kod | Bulgu                                                                      | Durum | Talimat |
| --- | -------------------------------------------------------------------------- | ----- | ------- |
| K-1 | Takvimde "Yılın X. günü" artık yıl hatası                                  | ✅    | T-03    |
| K-2 | Gün değişince istatistik sayaçları güncellenmiyor                          | ✅    | T-04    |
| K-3 | Sayfanın tamamı `IntersectionObserver`'a bağımlı, yedeği yok               | ✅    | T-04    |
| K-4 | HMR WebSocket'i sabit 3000 portuna bağlı                                   | ✅    | T-01    |
| K-5 | Gün gezinme düğmeleri dekoratif katman yüzünden görünmüyor ve tıklanamıyor | ✅    | T-15    |

### Orta seviye eksikler — 9 / 13 çözüldü

| Kod  | Bulgu                                                                     | Durum      | Talimat |
| ---- | ------------------------------------------------------------------------- | ---------- | ------- |
| O-1  | Kullanılmayan 10 bağımlılık                                               | ✅         | T-01    |
| O-2  | `package.json` kimliği iskelet şablonundan kalma                          | ✅         | T-01    |
| O-3  | `.gitignore` yanlış çatıya ait                                            | ✅         | T-01    |
| O-4  | Ağ katmanında iptal (abort) yok                                           | ✅         | T-05    |
| O-5  | Hata sınırı (`ErrorBoundary`) yok                                         | ✅         | T-09    |
| O-6  | Erişilebilirlik boşlukları                                                | ✅         | T-07    |
| O-7  | Klavye kısayolları yalnızca Yayın Modu'nda                                | ✅         | T-07    |
| O-8  | Önbellek stratejisi yarım                                                 | ✅         | T-05    |
| O-9  | `holidays` verisi çekiliyor ama kullanılmıyor                             | ✅         | T-09    |
| O-10 | `text-brand` koyu zeminde yetersiz kontrast (3 yer)                       | ⏭️ PLAN-02 | —       |
| O-11 | `holidays` alanında Vikipedi şablon artığı çöp kayıtlar                   | ⏭️ PLAN-02 | —       |
| O-12 | Bilim & Keşif, editör kaydını Vikipedi'nin aynı olayına karşı ayıklamıyor | ⏭️ PLAN-02 | —       |
| O-13 | `react-router`'da 2 orta seviye güvenlik danışma kaydı                    | ⏭️ PLAN-02 | —       |

### Ürün / içerik boşlukları — 5 / 5 çözüldü

| Kod | Bulgu                                                | Durum | Talimat               |
| --- | ---------------------------------------------------- | ----- | --------------------- |
| U-1 | Paylaşılabilir bağlantı yok                          | ✅    | T-06                  |
| U-2 | Editör içeriği 366 günün 10'unda (%2,7)              | ✅    | T-10 (60 gün · %16,4) |
| U-3 | Otomatik sınıflandırma kalitesi ölçülmemiş           | ✅    | T-11                  |
| U-4 | Site kabuğu eksik: favicon, PWA, SEO, paylaşım kartı | ✅    | T-08                  |
| U-5 | Kalite güvencesi altyapısı hiç yok                   | ✅    | T-12                  |

### Küçük notlar — 6 / 8 çözüldü

| Kod | Bulgu                                                       | Durum      | Talimat |
| --- | ----------------------------------------------------------- | ---------- | ------- |
| m-1 | `NAV[stats.indexOf(s)]` — dizi sırasına gizli bağımlılık    | ✅         | T-13    |
| m-2 | `vite.config.js` — proje TS olduğu hâlde config JS          | ✅         | T-01    |
| m-3 | Karanlık dosyalar `slice(0, 6)` ile sessizce kesiliyor      | ✅         | T-09    |
| m-4 | Ticker hızı sabit `55s`                                     | ✅         | T-13    |
| m-5 | Kişi kartı görsellerinde `width`/`height` yok               | ✅         | T-07    |
| m-6 | Arama sonucu global sayacı yok                              | ✅         | T-09    |
| m-7 | Yazdırma (print) stil sayfası yok                           | ⏭️ PLAN-02 | —       |
| m-8 | `estimateMinutes`'ın "3 dakika" eşiği erişilemez (zararsız) | ⏭️ PLAN-02 | —       |

### Toplam

|               | Adet   | Çözüldü      | Devredildi |
| ------------- | ------ | ------------ | ---------- |
| Kritik        | 5      | **5**        | 0          |
| Orta          | 13     | 9            | 4          |
| Ürün / içerik | 5      | **5**        | 0          |
| Küçük         | 8      | 6            | 2          |
| **Toplam**    | **31** | **25 (%81)** | **6**      |

### PLAN-02'ye devredilenlerin gerekçesi

| Kod  | Neden bu planda yapılmadı                                                                                                                                                          |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| O-10 | T-07'nin doğrulaması sırasında keşfedildi; renk paleti kararı, tasarım dilinin korunması ilkesiyle birlikte ele alınmalı (PLAN-01 _Kapsam Dışı_: "tasarım dilinin değiştirilmesi") |
| O-11 | Kaynak veri temizliği; `wiki.ts`'in ayrıştırma katmanında yeni bir süzgeç gerektiriyor, T-09'un kapsamı yalnızca gösterimdi                                                        |
| O-12 | Hem veri şeması (`ScienceMilestone`'a `matchKeys`) hem bileşen mantığı değişikliği gerektiriyor; T-10 veri-yalnız, T-11 sınıflandırma-yalnızdı                                     |
| O-13 | Düzeltmesi `react-router-dom@7`'ye **kırılma içeren** bir yükseltme; T-06'nın kurduğu yönlendirme katmanının tamamının regresyon testini gerektirir                                |
| m-7  | Yeni özellik (yazdırma düzeni), hata değil                                                                                                                                         |
| m-8  | Ölü kod eşiği; yalnızca bir okuma-süresi rozetini etkiliyor, kullanıcıya yansıyan bir yanlışlık yok                                                                                |

### Ayrıca not: doğrulanamamış iki madde

Bunlar bulgu değil, **kapatılamamış doğrulama**dır — bir sonraki oturumda gerçek
bir tarayıcıda elle kontrol edilmelidir:

| Madde                                             | Durum                                                                                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Service worker'ın canlı kaydı (T-08)              | Sunucu tarafı ve Workbox çıktısı doğrulandı; tarayıcıda kayıt, geliştirme ortamının sandbox kısıtı yüzünden doğrulanamadı |
| `content-visibility:auto`'nun canlı etkisi (T-13) | Konumlandırma mantığı (`scrollIntoView`) doğrulandı; render kazancı aynı kısıt yüzünden ölçülemedi                        |
