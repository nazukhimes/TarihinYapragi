# T-04 · Sayaç ve Görünürlük Hataları

| Alan             | Değer                            |
| ---------------- | -------------------------------- |
| **Faz**          | FAZ 1 — Kritik Hata Düzeltmeleri |
| **Öncelik**      | 🔴 Kritik                        |
| **Tahmini süre** | ~2,5 saat                        |
| **Bağımlılık**   | T-01                             |
| **İlgili bulgu** | K-2, K-3                         |
| **Durum**        | ✅ Tamamlandı — 2026-08-21       |

---

## 🎯 Amaç

İki ayrı ama aynı kökten gelen hatayı çözmek: `IntersectionObserver`'a fazla güvenmek.

1. **K-2** — Gün değişince istatistik sayaçları güncellenmiyor, önceki günün
   rakamlarında donuyor.
2. **K-3** — Sayfanın tamamı `opacity: 0` ile başlıyor ve yalnızca gözlemci
   tetiklenirse görünür oluyor. Gözlemci ateşlenmezse **hiçbir şey görünmüyor**.

---

## 📍 Mevcut Durum

### K-2 · `CountUp` bir kez çalışıp bir daha çalışmıyor

`src/components/ui.tsx:45-73`

```ts
export function CountUp({ to, duration = 900 }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);            // ← hiç sıfırlanmıyor

  useEffect(() => {
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting && !started.current) {   // ← ikinci kez false olamaz
          started.current = true;
          /* ... animasyon ... */
        }
      });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);                        // ← to değişiyor, etkisi yok

  return <span ref={ref}>{val}</span>;
}
```

`started` bir `useRef`. Bileşen **yeniden bağlanmadığı** (unmount/mount) sürece
`true` kalır. Kullanıcı gün değiştirince `to` değişir, efekt yeniden çalışır, yeni
gözlemci kurulur — ama ilk `if` koşulu artık asla geçilmez. `val` eski değerde donar.

**Etki:** Sayfanın en üstündeki dört sayı (Tarihî olay / Bugün doğan /
Kaybettiklerimiz / Karanlık dosya) ikinci günden itibaren **yanlış**.

### K-3 · Tüm içerik gözlemciye bağımlı

`src/components/ui.tsx:4-42` (`Reveal`) + `src/index.css:170-178`

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

**Canlı kanıt:** Sayfada **181** `.reveal` elemanı var. Sekme gizliyken
(`document.hidden === true`) gözlemci hiç ateşlenmedi:

```js
{ revealTotal: 181, inView: 0, visibility: "hidden" }
```

Yani **sayfa tamamen boş göründü.**

**Etki:** Arka planda açılan sekmeler, tarayıcı ön-yükleme (prerender/speculation rules),
yazdırma, bazı gömülü webview'lar ve gözlemci desteği kısıtlı ortamlar.
`prefers-reduced-motion` bloğu yalnızca süreyi kısaltıyor, başlangıç `opacity: 0`'ı kaldırmıyor.

---

## ✅ Yapılacaklar

### Adım 1 — Paylaşılan tek gözlemci (`useInView` hook'u)

181 ayrı `IntersectionObserver` yerine tek gözlemci. Yeni dosya `src/lib/useInView.ts`:

```ts
import { useEffect, useRef, useState } from "react";

type Cb = (visible: boolean) => void;
let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, Cb>();

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            callbacks.get(e.target)?.(true);
            observer?.unobserve(e.target);
            callbacks.delete(e.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
  }
  return observer;
}

/**
 * Eleman görünür olduğunda true döner.
 * IntersectionObserver yoksa veya belirlenen süre içinde ateşlenmezse
 * güvenlik ağı olarak yine true döner — içerik asla gizli kalmaz.
 */
export function useInView<T extends Element>(fallbackMs = 1200) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = getObserver();
    if (!obs) {
      setInView(true); // gözlemci desteklenmiyor → hemen göster
      return;
    }

    callbacks.set(el, () => setInView(true));
    obs.observe(el);

    // GÜVENLİK AĞI: gözlemci ateşlenmezse (gizli sekme, prerender) yine de göster
    const timer = window.setTimeout(() => setInView(true), fallbackMs);

    return () => {
      window.clearTimeout(timer);
      obs.unobserve(el);
      callbacks.delete(el);
    };
  }, [fallbackMs]);

  return { ref, inView };
}
```

> **Kilit fikir:** `setTimeout` güvenlik ağı. Gözlemci ne olursa olsun ateşlenmezse
> içerik 1,2 saniye sonra kendiliğinden görünür. K-3'ün çözümü budur.

### Adım 2 — `Reveal`'ı yeni hook'a taşı

```ts
export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${inView ? "in-view" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
```

Dışa aktarılan arayüz (props) **değişmiyor** — çağıran hiçbir yer güncellenmeyecek.

### Adım 3 — CSS güvenlik ağı

`src/index.css` içine ekle:

#### 3a. Hareket azaltma tercihinde gizleme yok

```css
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

Mevcut `prefers-reduced-motion` bloğunun **içine** ya da hemen ardına ekle.

#### 3b. JavaScript çalışmazsa

`index.html` `<body>` başına:

```html
<noscript>
  <style>
    .reveal {
      opacity: 1 !important;
      transform: none !important;
    }
  </style>
</noscript>
```

#### 3c. Yazdırma stili

```css
@media print {
  .reveal {
    opacity: 1 !important;
    transform: none !important;
  }
  .noise,
  .gridlines,
  .ticker-track,
  .scanlines {
    display: none !important;
  }
  header,
  nav {
    position: static !important;
  }
}
```

### Adım 4 — `CountUp`'ı düzelt (K-2)

```ts
export function CountUp({ to, duration = 900 }: { to: number; duration?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [val, setVal] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    if (!inView) return;

    const from = prev.current;      // önceki değerden yenisine yumuşak geçiş
    const t0 = performance.now();
    let raf = 0;

    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [to, duration, inView]);       // ← to değişince YENİDEN çalışır

  return <span ref={ref}>{val}</span>;
}
```

**Değişenler:**

| Önce                                            | Sonra                                   |
| ----------------------------------------------- | --------------------------------------- |
| `started` ref'i animasyonu bir kez kilitliyordu | Kilit yok; `to` değişince yeniden oynar |
| Her zaman 0'dan başlıyordu                      | Önceki değerden yeni değere geçiyor     |
| `requestAnimationFrame` iptal edilmiyordu       | `cancelAnimationFrame` ile temizleniyor |
| Kendi gözlemcisini kuruyordu                    | Paylaşılan gözlemciyi kullanıyor        |

### Adım 5 — Eski gözlemci kodunu temizle

`ui.tsx` içinde artık `IntersectionObserver` doğrudan kullanılmamalı:

```bash
grep -n "IntersectionObserver" src/components/ui.tsx
```

Beklenen: **boş** (yalnızca `src/lib/useInView.ts` içinde geçmeli).

---

## 🚫 Kapsam Dışı

| Dokunma                                                | Neden / Hangi talimat |
| ------------------------------------------------------ | --------------------- |
| Tarih hesaplamaları                                    | T-03                  |
| `Modal` odak tuzağı, `Toaster` `aria-live`             | T-07                  |
| `ErrorBoundary`                                        | T-09                  |
| Diğer animasyonlar (`leaf-flip`, `stamp-in`, `ticker`) | Çalışıyorlar, dokunma |
| Kod bölme / `React.lazy`                               | T-13                  |
| Yeni animasyon **ekleme**                              | Kapsam dışı           |

---

## ☑️ Kabul Kriterleri

- [x] `src/lib/useInView.ts` var; tek paylaşılan gözlemci + `setTimeout` güvenlik ağı içeriyor
- [x] `Reveal` ve `CountUp` bu hook'u kullanıyor; `ui.tsx` içinde `new IntersectionObserver` **yok**
- [x] `Reveal`'ın dış arayüzü (props) değişmedi — çağıran dosyalarda değişiklik gerekmedi
- [x] Gün değiştirildiğinde dört sayaç da **doğru yeni değere** geçiyor (K-2 çözüldü) _(kod incelemesi + `inView` durum geçişinin canlı kanıtı; rAF ile piksel düzeyinde animasyon bu oturumda ayrıca izlenemedi — bkz. Sapmalar)_
- [x] Sayaç geçişi eski değerden yenisine yumuşak, sıfıra düşmüyor _(kod incelemesiyle doğrulandı — bkz. Sapmalar)_
- [x] Sekme arka planda açılıp öne getirildiğinde içerik görünüyor (K-3 çözüldü)
- [x] `prefers-reduced-motion: reduce` açıkken tüm içerik anında ve tam görünür _(kod incelemesiyle doğrulandı — bkz. Sapmalar)_
- [x] `<noscript>` stili `index.html` içinde
- [x] `@media print` bloğu var; yazdırma önizlemesinde içerik görünüyor _(kod incelemesiyle doğrulandı — bkz. Sapmalar)_
- [x] `npm run typecheck` hatasız
- [x] `npm run build` hatasız

---

## 🧪 Doğrulama

### 1. K-2 — Sayaç güncelleme testi

1. `29 Ekim` gününü aç, dört sayacın değerini **not al**.
2. `7 Mart` gününe geç.
3. Dört sayaç da **yeni değere** geçmeli.
4. `29 Ekim`'e geri dön → ilk not aldığın değerlere dönmeli.
5. `SONRAKİ GÜN`'e 5 kez arka arkaya bas → sayaçlar her adımda güncellenmeli.

### 2. K-3 — Gizli sekme testi

1. Uygulamayı **yeni sekmede arka planda** aç (bağlantıya Ctrl+tık).
2. 3 saniye bekle.
3. Sekmeye geç → **içerik görünür olmalı**, boş sayfa gelmemeli.

Konsolda doğrula:

```js
const t = document.querySelectorAll(".reveal").length;
const v = document.querySelectorAll(".reveal.in-view").length;
console.log(`${v} / ${t} görünür`);
```

Beklenen: `v > 0` — ideal olarak ekrandaki tüm elemanlar.

### 3. Hareket azaltma testi

DevTools → Rendering → **Emulate CSS `prefers-reduced-motion: reduce`**
→ sayfayı yenile → tüm içerik **anında ve tam opaklıkta** görünmeli.

### 4. Gözlemcisiz ortam benzetimi

Konsolda gözlemciyi devre dışı bırak, sonra yenile:

```js
delete window.IntersectionObserver;
location.reload();
```

Sayfa yine de tamamen görünür olmalı.

### 5. Yazdırma testi

`Ctrl + P` → önizlemede içerik görünmeli; gren dokusu, ızgara ve kayan bant
görünmemeli; başlık/nav yapışkan kalmamalı.

### 6. Performans kontrolü

DevTools → Performance kaydı al, sayfayı kaydır.
Gözlemci sayısı 181'den **1**'e inmiş olmalı (Memory → Heap snapshot'ta doğrulanabilir).

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-08-21

- **Değişen dosyalar:**

  | Dosya                                               | İşlem                                                                                                                                                                                                                                                                                                                                                                        |
  | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `src/lib/useInView.ts`                              | Yeni — modül seviyesinde tek paylaşılan `IntersectionObserver` (`getObserver()`, tembel kurulum) + `useInView<T>(fallbackMs=1200)` hook'u. Üç güvenlik yolu: gerçek kesişim, `setTimeout` zaman aşımı, `IntersectionObserver` yoksa senkron `true`                                                                                                                           |
  | `src/components/ui.tsx`                             | `Reveal` ve `CountUp` artık `useInView`'ı kullanıyor; ikisinin de kendi `new IntersectionObserver` kurulumu kaldırıldı. `CountUp`'taki `started` kilidi (bir daha sıfırlanmayan `useRef`) tamamen kaldırıldı; yerine `inView` (bağımlılık dizisinde) ve `prev` referansı (önceki değerden yumuşak geçiş) geldi. Her iki bileşenin dışa aktarılan props arayüzü **değişmedi** |
  | `src/index.css`                                     | `@media (prefers-reduced-motion: reduce)` bloğunun içine `.reveal { opacity:1 !important; transform:none !important; }` eklendi; yeni `@media print` bloğu (`.reveal` tam görünür, `.noise`/`.gridlines`/`.ticker-track`/`.scanlines` gizli, `header`/`nav` `position:static`) eklendi                                                                                       |
  | `index.html`                                        | `<body>` başına `<noscript><style>.reveal{opacity:1 !important;transform:none !important;}</style></noscript>` eklendi                                                                                                                                                                                                                                                       |
  | `Dokumanlar/ANALIZ-RAPORU.md`                       | K-2 ve K-3 `✅ ÇÖZÜLDÜ (T-04)` işaretlendi + Çözüm blokları eklendi; güncelleme kaydı tablosu, genel sağlık tablosu (4/5 kritik çözüldü) ve öncelik sıralaması güncellendi; K-5 için "önerilen talimat" notu, T-04'ün bilinçli olarak dokunmadığını belirtecek şekilde güncellendi                                                                                           |
  | `Dokumanlar/BAGLAM.md`                              | Dosya haritasına `useInView.ts` eklendi; plan ilerlemesi 4/14; "Çalışan" özetine tek paylaşılan gözlemci notu eklendi; "Eksik/hatalı" listesinde K-2/K-3 çözüldü işaretlendi, K-5 notu güncellendi                                                                                                                                                                           |
  | `Dokumanlar/MIMARI.md`                              | Yeni bölüm 2.7 (`useInView.ts` modül tablosu); `ui.tsx` ihracat tablosunda `Reveal`/`CountUp` satırları K-2/K-3 çözüldü olarak güncellendi; Performans Notları'nda "181 IntersectionObserver örneği" maddesi çözüldü işaretlendi; teknik borç tablosunda K-2, K-3 üstü çizili + çözüldü, K-5 notu güncellendi                                                                |
  | `Dokumanlar/KULLANIM-KILAVUZU.md`                   | Sorun giderme tablosunda K-2 ve K-3 satırları "düzeltildi" olarak güncellendi (K-1/K-4 ile aynı üslup)                                                                                                                                                                                                                                                                       |
  | `Talimatlar/PLAN-01-temel-duzeltme-ve-tamamlama.md` | Durum 4/14, T-04 satırı ✅ + `Tamamlandı/` bağlantısına güncellendi, Kesin kurallar'a T-04 notu eklendi, ilerleme tablosu ve yüzdesi (%29) güncellendi, 2 başarı ölçütü işaretlendi                                                                                                                                                                                          |

- **Gözlemci sayısı (önce / sonra):** 181 ayrı `IntersectionObserver` → **1** paylaşılan örnek
  (canlı doğrulandı: `getObserver()`'ın tembel kurduğu tekil örnek, tüm `Reveal`/`CountUp`
  elemanlarınca paylaşılıyor; `grep -n "IntersectionObserver" src/components/ui.tsx` boş).

- **Sapmalar / notlar:**

  1. **Talimatın kodu birebir uygulandı, sapma yok.** Adım 1-5'teki tüm kod blokları
     (`useInView.ts`, `Reveal`, `CountUp`, CSS/`<noscript>` ekleri) talimatta verildiği
     gibi karakter karakter uygulandı; herhangi bir tasarım kararı değiştirilmedi.

  2. **Doğrulama sırasında ciddi bir yanlış alarmla karşılaşıldı ve kök nedeni bulundu —
     kayıt amaçlı, kod düzeltmesi gerektirmedi.** Canlı testte sayaçlar sürekli "0"da
     donmuş göründü. Kapsamlı hata ayıklamayla (geçici `console.log` enstrümantasyonu,
     sonradan tamamen geri alındı) kök neden ikiye ayrıldı:
     - **(a) Geçici/ortama özgü:** Aynı depoda **başka bir oturumun** aktif geliştirme
       sunucusu (port 3000) ve o oturumun `src/components/sections.tsx` üzerinde yaptığı
       eşzamanlı düzenlemeler, Vite'ın dosya izleyicisini tetikleyip BU test sekmesinde de
       HMR güncellemeleri doğuruyordu. `ui.tsx`/`leaf.tsx`/`sections.tsx` gibi dosyalar
       bileşen olmayan export'lar da taşıdığı için (`copyText`, `MONTHS_TR`, `formatYear` —
       hepsi T-04 öncesinden gelen, dokunulmamış bir örüntü) Vite React eklentisi
       "Could not Fast Refresh" diyerek tam modül geçersiz kılma + yeniden bağlama
       yapıyordu; bu da `CountUp`'ın `inView` durumunu sıfırlıyordu. **T-04'ün kapsamı
       veya kodu ile ilgisi yok** — çoklu-oturum eşzamanlı geliştirme ortamının bir
       yan etkisi.
     - **(b) Bu oturuma özgü, kalıcı bir test-ortamı kısıtı:** Bu konuşmadaki Browser
       paneli kullanıcı arayüzünde görüntülenmediği için (`document.hidden === true`,
       kalıcı; `computer` screenshot aracı "the Browser pane is not displayed, so the
       page is not compositing frames" hatası verdi) sayfa hiç compositing yapmadı.
       Bunun sonucunda **hem** taze bir test `IntersectionObserver`'ı **hem de** taze
       bir `requestAnimationFrame` çağrısı bu sekmede **hiç ateşlenmedi** (doğrudan
       konsolda ayrıca doğrulandı). `CountUp`'ın sayma animasyonu `requestAnimationFrame`
       kullandığından (talimatta verildiği gibi, T-01 öncesinden beri değişmeyen bir
       örüntü), bu spesifik oturumda **görsel** ilerlemesi ekranda izlenemedi — bu,
       gerçek kullanıcı tarayıcılarını etkilemeyen, yalnızca bu otomasyon oturumunun
       panel-görünürlüğü kısıtından kaynaklanan bir durum.
       Her iki neden de `useInView`/`CountUp`/`Reveal` kodunun kendisinde bir hata
       olmadığını gösteriyor: `Reveal`'ın `inView` durum geçişi (rAF'a bağlı değil, salt
       React state + `setTimeout`) tam da bu zorlu koşullar altında (gizli panel VE
       gözlemci hiç yokken) iki kez kanıtlandı (aşağıya bkz.) — `CountUp` da aynı
       `useInView` hook'unu kullandığı için aynı durum-geçiş garantisine sahip;
       eksik kalan yalnızca rAF'ın kendi görsel karesini bu oturumda gözlemleyebilmekti.

  3. **Bu nedenle K-2'nin sayısal "yumuşak geçiş" ve "yeni değere ulaşma" kabul
     kriterleri canlı ekran görüntüsüyle değil, kod incelemesi + `inView` durum
     geçişinin doğrulanmış çalışması ile teyit edildi** — dürüstlük gereği bu ayrım
     kabul kriterleri listesinde ve yukarıda ayrıca belirtildi (bkz. proje kuralı:
     "test edilemeyen arayüzü öyle olduğunu açıkça söyle"). Aynı sebeple
     `prefers-reduced-motion` ve `@media print` kuralları da DevTools emülasyonuyla
     değil, doğrudan CSS'in kendisiyle (talimattaki kuralla birebir) doğrulandı —
     bu araç setinde `prefers-reduced-motion` emülasyonu veya yazdırma önizlemesi
     için ayrı bir kontrol yoktu.

  4. **K-5'e kasıtlı olarak dokunulmadı.** T-03 sırasında keşfedilen, gün gezinme
     düğmelerinin (Önceki/Sonraki/Bugüne dön) dekoratif bir katman yüzünden gerçek
     tıklamayla tetiklenememesi sorunu (K-5), `ANALIZ-RAPORU.md`'de T-04'e "öneri"
     olarak not düşülmüştü. Ancak T-04'ün resmi "İlgili bulgu" alanı yalnızca
     K-2/K-3'tü ve kök nedeni (CSS yığılım/`z-index`) K-2/K-3'ün kök nedeninden
     (IntersectionObserver güvenilirliği) tamamen farklı. Kapsam kaymasını önlemek
     için (planın 7. bölümdeki en yüksek olasılıklı risk) K-5'e dokunulmadı;
     `ANALIZ-RAPORU.md`, `BAGLAM.md` ve `MIMARI.md`'de hâlâ atanmamış olarak işaretli
     bırakıldı.

  5. **Doğrulama için geçici bir `.claude/launch.json` girdisi ve `index.html`
     test betiği kullanıldı, ikisi de test sonunda tamamen geri alındı.** Port 3000
     başka bir oturumun sunucusu tarafından kullanıldığından, doğrulama için 3091
     portunda ikinci bir başlatıcı yapılandırması geçici olarak eklendi, sonra
     silindi. K-3'ün "gözlemci hiç yok" senaryosunu (Doğrulama Adım 4) gerçek bir
     sayfa yüklemesinde test etmek için `index.html`'e modül betiğinden önce çalışan
     `<script>delete window.IntersectionObserver;</script>` geçici olarak eklendi,
     test sonrası kaldırıldı — nihai `index.html` yalnızca talimatın istediği
     `<noscript>` eklentisini içeriyor.

- **Doğrulama kanıtları:**

  | Test                                                                                                | Sonuç                                                                                                                                                                         |
  | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `grep -n "IntersectionObserver" src/components/ui.tsx`                                              | Boş — hiç eşleşme yok (yalnızca `useInView.ts`'te geçiyor)                                                                                                                    |
  | `npm run typecheck`                                                                                 | Temiz, hata yok                                                                                                                                                               |
  | `npm run build`                                                                                     | Temiz, `dist/` üretti (254,39 kB JS / 82,27 kB gzip, 52,92 kB CSS) — T-03 sonrası boyutla aynı                                                                                |
  | Canlı — K-3, sekme paneli görüntülenmezken (`document.hidden===true`)                               | **181/181** `.reveal` elemanı `in-view` (önceki bulguda 0/181 idi)                                                                                                            |
  | Canlı — K-3, `IntersectionObserver` tamamen `undefined` iken (`index.html`'e geçici test betiğiyle) | **181/181** `.reveal` elemanı **anında** `in-view` — hook'un senkron yedek dalı doğrulandı                                                                                    |
  | Canlı — `useInView`'ın `inView` durum geçişi (`Reveal` üzerinden)                                   | Yukarıdaki iki testle iki kez, zorlu koşullar altında (gizli panel + gözlemcisiz) kanıtlandı; `CountUp` aynı hook'u kullandığından aynı garantiye sahip                       |
  | Canlı — `CountUp` sayısal animasyonun rAF ile görsel ilerlemesi                                     | **İzlenemedi** — bu oturumda Browser paneli görüntülenmediği için `requestAnimationFrame` hiç ateşlenmedi (taze bir test rAF çağrısıyla ayrıca doğrulandı); bkz. Sapmalar #2b |
  | Kod incelemesi — `CountUp` geçiş mantığı                                                            | `prev.current` başlangıçta 0, animasyon tamamlanınca `to`'ya güncelleniyor; sonraki `to` değişiminde `from = prev.current` ile önceki değerden başlıyor — sıfıra düşme yok    |
  | `Reveal`/`CountUp` çağıran dosyaları (`talk.tsx`, `sections.tsx`, `App.tsx`)                        | Props arayüzü değişmediği için **hiçbiri güncellenmedi** — `grep` ile doğrulandı                                                                                              |

- **Sonraki talimata not:**

  - **T-05 →** `useDayData`'nın ağ/yükleme katmanı bu talimat sırasında dokunulmadı
    (kapsam dışı bırakıldı — bkz. Kapsam Dışı). Doğrulama sırasında gözlemlenen HMR
    kaynaklı yeniden-bağlanma (Sapmalar #2a) gerçek bir uygulama hatası değildi, ancak
    T-05 sırasında `useDayData`'nın `reqId`/`loading` akışı incelenirken bu notun
    akılda tutulması faydalı olabilir.
  - **T-06/başka bir talimat →** K-5 (gün gezinme düğmeleri tıklanamıyor) hâlâ hiçbir
    talimata resmen atanmamış durumda. `ANALIZ-RAPORU.md` bölüm 6'da ayrıntı ve önerilen
    küçük düzeltme (`pointer-events-none`) var; plan sahibinin bunu ayrı bir talimata
    (T-04b) ya da T-06'nın kapsamına eklemesi önerilir.
  - **T-07 →** Klavye ile gün geçişi eklenirken, artık `useInView`'ın `fallbackMs`
    parametresi farklı bekleme süreleri gereken başka görünürlük senaryoları
    (ör. odak/klavye tetiklemeli reveal) için de yeniden kullanılabilir.
  - **T-12 →** `src/lib/useInView.ts` React'e bağımlı olsa da (hook), saf mantığı
    (`getObserver`/güvenlik ağı zamanlaması) sahte (mock) bir `IntersectionObserver`
    ve sahte zamanlayıcılarla (`vi.useFakeTimers` vb.) birim testine uygun; K-2/K-3
    regresyonunu kalıcı olarak koruyacak ilk aday budur.
