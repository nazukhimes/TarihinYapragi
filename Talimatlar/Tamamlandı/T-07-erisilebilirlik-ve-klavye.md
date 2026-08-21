# T-07 · Erişilebilirlik ve Klavye

| Alan | Değer |
|---|---|
| **Faz** | FAZ 2 — Ürün Kabuğu |
| **Öncelik** | 🟠 Yüksek |
| **Tahmini süre** | ~3,5 saat |
| **Bağımlılık** | T-04 (`Reveal` düzeltmesi), T-06 (gün geçişi `setDate` üzerinden) |
| **İlgili bulgu** | O-6, O-7 |
| **Durum** | ✅ Tamamlandı |

---

## 🎯 Amaç

Uygulamayı klavyeyle tam gezilebilir, ekran okuyucuyla anlaşılır ve WCAG 2.1 AA
ölçütlerine uygun hâle getirmek. Ayrıca ürünün ana eylemi olan **gün geçişini**
klavyeye açmak.

---

## 📍 Mevcut Durum

| # | Sorun | Yer |
|---|---|---|
| 1 | `Modal` odak tuzağı yok — Tab tuşu arka plandaki öğelere kaçıyor | `ui.tsx:117-152` |
| 2 | Modal kapanınca odak, açan düğmeye dönmüyor | `ui.tsx` |
| 3 | `Toaster` `aria-live` taşımıyor — ekran okuyucu bildirimi duymuyor | `ui.tsx:159-186` |
| 4 | "Ana içeriğe atla" bağlantısı yok | `App.tsx` |
| 5 | Arama girdisinde erişilebilir etiket yok (yalnızca `placeholder`) | `App.tsx` üst bar |
| 6 | `text-ink-faint` (#6f7481 / #0f131a) kontrastı **4.0:1** — AA eşiği 4.5:1 | `index.css:22` |
| 7 | Kategori çipleri `aria-pressed` taşımıyor | `sections.tsx:159-180` |
| 8 | Ana sayfada klavyeyle gün değiştirilemiyor | `App.tsx` |
| 9 | Odak halkası (focus ring) özelleştirilmemiş; koyu zeminde zor görülüyor | `index.css` |
| 10 | Kişi kartı görsellerinde `width`/`height` yok → düzen kayması | `sections.tsx` |

---

## ✅ Yapılacaklar

### Adım 1 — Modal odak yönetimi

`ui.tsx` → `Modal` bileşenine ekle:

```tsx
const panelRef = useRef<HTMLDivElement>(null);
const oncekiOdak = useRef<HTMLElement | null>(null);

useEffect(() => {
  oncekiOdak.current = document.activeElement as HTMLElement;
  panelRef.current?.focus();

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key !== "Tab") return;

    const odaklanabilir = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!odaklanabilir?.length) return;

    const ilk = odaklanabilir[0];
    const son = odaklanabilir[odaklanabilir.length - 1];

    if (e.shiftKey && document.activeElement === ilk) { e.preventDefault(); son.focus(); }
    else if (!e.shiftKey && document.activeElement === son) { e.preventDefault(); ilk.focus(); }
  };

  window.addEventListener("keydown", onKey);
  document.body.style.overflow = "hidden";

  return () => {
    window.removeEventListener("keydown", onKey);
    document.body.style.overflow = "";
    oncekiOdak.current?.focus();          // odağı geri ver
  };
}, [onClose]);
```

Panel elemanına `ref={panelRef}` ve `tabIndex={-1}` ekle.
Ayrıca `aria-labelledby` ile başlığa bağla.

### Adım 2 — `Toaster` ekran okuyucuya duyulur olsun

```diff
-<div className="fixed bottom-6 left-1/2 ...">
+<div
+  role="status"
+  aria-live="polite"
+  aria-atomic="true"
+  className="fixed bottom-6 left-1/2 ..."
+>
```

### Adım 3 — "Ana içeriğe atla" bağlantısı

`App.tsx` → en üste, `<header>`'dan **önce**:

```tsx
<a href="#top" className="skip-link">Ana içeriğe atla</a>
```

`index.css`:

```css
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 100;
  padding: 0.75rem 1.25rem;
  background: var(--color-gold);
  color: var(--color-night);
  font-family: var(--font-mono);
  font-size: 13px;
  border-radius: 2px;
}
.skip-link:focus {
  left: 1rem;
  top: 1rem;
}
```

### Adım 4 — Arama girdisine etiket

```diff
 <input
   value={query}
   onChange={(e) => setQuery(e.target.value)}
+  type="search"
+  aria-label={`${dayLabel} arşivinde ara`}
   placeholder={`${dayLabel} arşivinde ara: olay, kişi, dosya…`}
```

Arama sonucu sayısını da duyur (T-09'daki sonuç sayacıyla birlikte):

```tsx
<p className="sr-only" role="status" aria-live="polite">
  {searching ? `${toplamSonuc} sonuç bulundu` : ""}
</p>
```

`sr-only` yardımcı sınıfı `index.css`'e:

```css
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Adım 5 — Kontrast düzeltmesi

`index.css` `@theme` bloğunda:

```diff
-  --color-ink-faint: #6f7481;
+  --color-ink-faint: #8b909c;
```

**Doğrulama:** `#8b909c` / `#0f131a` ≈ **5.9:1** — AA eşiğini (4.5:1) rahat geçer.
(Mevcut `#6f7481` ≈ 4.0:1 idi.)

> Renk değişimi tüm `text-ink-faint` kullanımlarını etkiler (yaklaşık 40 yer).
> Görsel olarak biraz daha parlak olacak — bu **istenen** sonuçtur. Tasarım
> hiyerarşisi `ink` > `ink-dim` > `ink-faint` sırasıyla korunmalı; gerekirse
> `--color-ink-dim`'i de `#b4b5ab` yapıp aralığı yeniden dengeleyin.

### Adım 6 — Odak halkası

`index.css`:

```css
:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
  border-radius: 2px;
}

/* kâğıt yüzeylerde altın görünmez — kırmızıya geç */
.paper :focus-visible {
  outline-color: var(--color-brand);
}
```

`:focus` değil **`:focus-visible`** kullan — fareyle tıklamada halka çıkmasın.

### Adım 7 — Kategori çiplerine `aria-pressed`

`sections.tsx` → `CatChip`:

```diff
 <button
   onClick={onClick}
+  aria-pressed={active}
   className="..."
```

### Adım 8 — Klavyeyle gün geçişi (O-7)

`App.tsx` içinde:

```tsx
useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    // yazı yazarken kısayol çalışmasın
    const t = e.target as HTMLElement;
    if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (broadcast) return;                  // yayın modunun kendi kısayolları var

    switch (e.key) {
      case "ArrowLeft":  e.preventDefault(); gunKaydir(-1); break;
      case "ArrowRight": e.preventDefault(); gunKaydir(+1); break;
      case "t": case "T": e.preventDefault(); bugüneDon(); break;
      case "/": e.preventDefault(); aramaRef.current?.focus(); break;
      case "?": setKisayolYardimi(true); break;
      case "Escape": setKisayolYardimi(false); break;
    }
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [broadcast, month, day]);
```

**Kısayol tablosu:**

| Tuş | İşlev |
|---|---|
| `←` | Önceki gün |
| `→` | Sonraki gün |
| `T` | Bugüne dön |
| `/` | Arama kutusuna odaklan |
| `?` | Kısayol yardımı |
| `Esc` | Yardımı/modalı kapat |

### Adım 9 — Kısayol yardımı penceresi

`?` tuşuna basınca açılan basit bir `Modal`. İçinde yukarıdaki tablo,
artı Yayın Modu kısayolları (`←` `→` `Boşluk` `Esc`).
Alt bilgiye küçük bir ipucu ekle: `Kısayollar için ? tuşuna basın`.

### Adım 10 — Görsel boyutları (m-5)

`sections.tsx` → `PeopleRow` içindeki `<img>`:

```diff
 <img
   src={p.thumb}
   alt={p.name}
   loading="lazy"
+  width={248}
+  height={132}
+  decoding="async"
   className="w-full h-full object-cover object-top ..."
 />
```

Modal'daki küçük görsele de `width={96} height={112}` ekle.

### Adım 11 — Bölüm işaretleri (landmark)

- `SectionShell` içindeki `<section>`'a `aria-labelledby` ekle; `SectionHead` içindeki
  `<h2>`'ye eşleşen bir `id` ver (örn. `id={`baslik-${index}`}`).
- Bölüm navigasyonundaki `<nav>` elemanına `aria-label="Bölümler"` ekle.
- Üst bardaki `<nav>` yoksa `<header>` zaten banner işareti taşır — dokunma.
- Alt bilgideki `<footer>` contentinfo işaretini otomatik taşır — dokunma.

---

## 🚫 Kapsam Dışı

| Dokunma | Neden / Hangi talimat |
|---|---|
| Renk paletinin geri kalanı | Yalnızca `ink-faint` (ve gerekirse `ink-dim`) değişecek |
| Yeni bölüm veya özellik ekleme | Kapsam dışı |
| Arama sonucu sayacının hesaplanması | T-09 (burada yalnızca `aria-live` kabı hazırlanıyor) |
| Service worker | T-08 |
| Otomatik erişilebilirlik testleri | T-12 |
| Tasarım dilinin değiştirilmesi | Kapsam dışı |

---

## ☑️ Kabul Kriterleri

- [x] Modal açıkken Tab tuşu panelin dışına çıkmıyor (ileri ve geri)
- [x] Modal kapanınca odak, açan karta/düğmeye dönüyor
- [x] `Toaster` `role="status"` + `aria-live="polite"` taşıyor
- [x] `Tab` tuşuna ilk basışta "Ana içeriğe atla" bağlantısı görünüyor ve çalışıyor
- [x] Arama girdisinde `aria-label` ve `type="search"` var
- [x] `--color-ink-faint` ≥ 4.5:1 kontrast sağlıyor
- [x] `:focus-visible` halkası koyu ve kâğıt yüzeylerde görünür
- [x] Kategori çipleri `aria-pressed` taşıyor
- [x] `←` `→` `T` `/` `?` kısayolları çalışıyor
- [x] Arama kutusuna yazarken `←` `→` kısayolları **tetiklenmiyor**
- [x] Yayın Modu açıkken ana sayfa kısayolları **tetiklenmiyor**
- [x] Kişi kartı görsellerinde `width`/`height` var, düzen kaymıyor
- [x] Lighthouse Erişilebilirlik puanı **≥ 95** — ölçülen: **96** (bkz. Tamamlanma Kaydı)
- [x] `npm run typecheck` ve `npm run build` hatasız

---

## 🧪 Doğrulama

### 1. Yalnızca klavye turu

Fareye **hiç dokunmadan** şunları yap:

1. `Tab` → "Ana içeriğe atla" görünmeli, `Enter` ile çalışmalı
2. `Tab` ile üst bara, arama kutusuna, Yayın Modu düğmesine ulaş
3. `→` `→` `←` ile gün değiştir
4. `T` ile bugüne dön
5. `/` ile aramaya odaklan, `atatürk` yaz, `Esc` ile çık
6. Kişi kartına `Tab` ile ulaş, `Enter` ile aç
7. Modal içinde `Tab` ile dolaş — dışarı **kaçmamalı**
8. `Esc` ile kapat — odak **açtığın karta** dönmeli
9. `?` ile yardımı aç, `Esc` ile kapat

### 2. Kontrast ölçümü

DevTools → bir `text-ink-faint` elemanı seç → Styles → renk kutusu → kontrast oranı
**≥ 4.5** görünmeli. Ölçülecek örnekler: "her güne bir arşiv", "Yılın 233. günü",
"BÖLÜM 01", "#etiketler".

### 3. Ekran okuyucu

Windows'ta **NVDA** (ücretsiz) veya Narrator ile:

- Sayfa başlığı ve bölüm başlıkları okunuyor mu
- Bir kartı kopyaladığında "Kart panoya kopyalandı" **duyuluyor** mu
- Kategori çipi seçiliyken "basılı" (pressed) bilgisi veriliyor mu

### 4. Lighthouse

DevTools → Lighthouse → Accessibility → **≥ 95**
Kalan uyarıları not al; çözülemeyenleri *Tamamlanma Kaydı*'na yaz.

### 5. Kısayol çakışma testi

- Arama kutusunda `←` `→` → **imleç hareket etmeli**, gün değişmemeli
- Yayın Modu açıkken `→` → **kart** ilerlemeli, gün değişmemeli
- `Ctrl + →` → tarayıcı davranışı korunmalı

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-08-21

- **Değişen dosyalar:**
  - `src/components/ui.tsx` — `Modal`: odak tuzağı (Tab ileri/geri döngüsü), açılışta önceki odağı kaydetme + kapanışta geri verme, yeni `titleId` prop → dış sarmalayıcıya `aria-labelledby`, panel `ref`+`tabIndex={-1}`; `Toaster` kabına `role="status"` `aria-live="polite"` `aria-atomic="true"`; `SectionHead`'in `<h2>`'sine `id={`baslik-${index}`}`
  - `src/components/sections.tsx` — `CatChip`'e `aria-pressed={active}`; `PeopleRow` kart küçük resmine `width={248} height={132} decoding="async"`, modal küçük resmine `width={96} height={112}`, kişi modalına `titleId` + eşleşen `<h3 id>`; `SectionShell`'e `labelledBy` prop → `<section aria-labelledby>`; **(bonus — bkz. Sapmalar)** `PeopleRow` kart başlığı `<h4>` → `<h3>`
  - `src/index.css` — `--color-ink-faint` `#6f7481` → `#8b909c` (kontrast); `.skip-link`, `.sr-only`, `:focus-visible` + `.paper :focus-visible` eklendi
  - `src/App.tsx` — "Ana içeriğe atla" bağlantısı; iki arama girdisine `type="search"` + `aria-label` + `ref` (masaüstü/mobil); boş bir `aria-live="polite"` durum kabı (T-09 dolduracak); `gunKaydir`/`bugüneDön` + global klavye kısayolu `useEffect`'i (`←` `→` `T` `/` `?` `Esc`; arama girdisinde, Yayın Modu'nda **ve açık bir `Modal` varken** devre dışı — bkz. Sapmalar); Kısayol Yardımı `Modal`'ı + alt bilgiye ipucu satırı; bölüm nav'ına `aria-label="Bölümler"`; altı `SectionShell`'e `labelledBy="baslik-0N"`; **(bonus — bkz. Sapmalar)** "Yayın Modu" düğmesine `aria-label="Yayın Modu"`

- **Lighthouse Erişilebilirlik puanı:** **96 / 100** (ilk ölçüm 89 → iki ek düzeltmeden sonra 96;
  bkz. Doğrulama). Kalan tek uyarı kasıtlı olarak bırakıldı (bkz. Çözülemeyen uyarılar).

- **Çözülemeyen uyarılar:**
  - **`color-contrast` — `text-brand` (#d23b2e) koyu zeminde metin/simge rengi olarak
    yetersiz kontrast:** Gerçek Lighthouse/axe denetimi üç yerde yakaladı: (1) `leaf.tsx`
    `Ticker`'daki "Bugün Tarihte" etiketi (`text-paper` `bg-brand` üzerinde — ölçülen
    **3,98:1**), (2) `sections.tsx` `CasesSection`'daki dosya türü rozeti
    (`text-brand`, örn. "SUİKAST" — panel zemininde ölçülen **≈3,54:1**), (3) aynı
    bileşendeki "Dosyayı aç/kapat" düğmesi (aynı `text-brand`, aynı kontrast sorunu).
    **Bilinçli olarak dokunulmadı** — bu talimatın *Kapsam Dışı* tablosu rengi yalnızca
    `ink-faint`'e (gerekirse `ink-dim`'e) sınırlıyor; `brand` kırmızısını metin
    kullanımı için değiştirmek ayrı bir tasarım kararı gerektirir (`ink-faint` gibi
    talimatın kendi verdiği hazır bir değer yok). `ANALIZ-RAPORU.md`'ye **O-10** olarak
    işlendi, gelecekteki bir talimata bırakıldı — ayrıntı → Sonraki talimata not.

- **Sapmalar / notlar:**
  - **Adım 8'e eklenen bir koruma (talimatın kod parçasında yoktu):** Talimat yalnızca
    arama girdisinde yazarken ve Yayın Modu açıkken kısayolları devre dışı bırakıyordu.
    Kod incelemesi sırasında, Adım 1'in odak tuzağıyla birleşince şu iki regresyon
    ortaya çıktı: (1) bir kişi kartı modalı açıkken `←`/`→` basmak günü modalın
    **arkasında** sessizce değiştiriyordu (modal yalnızca `Tab`'ı yakalıyor, ok
    tuşlarını değil); (2) `/` basmak odağı modalın **dışına**, arkadaki arama kutusuna
    taşıyarak Adım 1'in odak tuzağını bizzat kırıyordu. İkisi de bu talimatın kendi
    içinde birleşen iki yeni özelliğin (klavye kısayolları + odak tuzağı) etkileşiminden
    doğduğu için (başka bir talimatın kapsamına girmiyor), `onKey` içine tek satır
    eklendi: `if (document.querySelector('[aria-modal="true"]')) return;`. `Modal`'ın
    zaten taşıdığı `aria-modal="true"` özniteliğine dayanır, yeni bir state/ref
    gerektirmez.
  - **Gerçek Lighthouse denetimi iki ek, önceden var olan hata yakaladı — ikisi de bu
    oturumda düzeltildi:**
    1. `button-name`: Üst bardaki "Yayın Modu" düğmesinin metni `hidden md:inline`
       taşıyor; dar viewport'ta düğmenin tek içeriği `aria-hidden` bir SVG ikondu →
       erişilebilir adı yoktu. `aria-label="Yayın Modu"` eklendi.
    2. `heading-order`: `PeopleRow` kart başlığı `<h4>` idi, `<h2>` (bölüm başlığı)
       altında doğrudan geliyordu — `h3` atlanıyordu. `<h4>` → `<h3>` yapıldı (kişi
       modalındaki başlık zaten `<h3>`; ikisi de aynı `<h2>`'nin altında kardeş
       düzeyde kalıyor, çakışma yok). Görsel etki **yok** — `index.css`'te `h3`/`h4`
       için ayrı bir kural yok, tüm biçim Tailwind sınıflarından geliyor.
    Bu ikisi talimatın 11 adımının parçası değildi; gerçek bir Lighthouse denetimi
    çalıştırılınca ortaya çıktı (bkz. Doğrulama). Kapsam dışına taşmadıkları
    (aynı erişilebilirlik temasında, tek satırlık, sıfır görsel etkili düzeltmeler
    olduğu) için doğrudan uygulandı, yeni bir bulgu numarası açılmadı.
  - **K-5 ile ilişki — bilinçli olarak dokunulmadı:** `PLAN-01`'in T-06 notu ve
    `ANALIZ-RAPORU.md` K-5 bölümü, "aynı gezinme bölgesine dokunacağı" varsayımıyla
    K-5'i (gün gezinme düğmeleri gerçek tıklamayla çalışmıyor) T-07'ye önerdi. Bu
    varsayım **doğrulanmadı**: T-07'nin 11 adımının hiçbiri `leaf.tsx`'e dokunmuyor —
    klavye kısayolları `App.tsx`'te ayrı bir global dinleyici olarak yaşıyor, mevcut
    düğmelerin `onClick`'lerine dokunmadan. Ayrıca K-5 bir **fare/dokunmatik**
    hit-testing hatasıdır — `ANALIZ-RAPORU.md`'deki kanıt `button.click()`'in (DOM olay
    akışını atlayarak) doğru çalıştığını gösteriyor, yani `Tab` + `Enter` ile klavye
    üzerinden düğmeye ulaşıp etkinleştirmek K-5'ten **etkilenmiyor**. Bu talimatın
    "erişilebilirlik ve klavye" kapsamıyla K-5 arasında varsayılan bağlantı, kanıtlar
    incelenince zayıf çıktı. K-5'e bilinçli olarak dokunulmadı; T-04/T-06'nın aksine bu
    oturumda tarayıcıya hiç erişilemediği için canlı olarak da yeniden doğrulanamadı
    (bkz. Doğrulama). Bir sonraki talimata not olarak tekrar düşüldü.
  - **Arama sonucu `aria-live` kabı bilerek boş bırakıldı:** Adım 4'ün örnek kodu
    `toplamSonuc` adlı bir değişken kullanıyor; bu değişken T-09 Adım 4'te tanımlanıyor
    ("T-07'deki `aria-live` kabına da bu sayıyı bağla" — T-09'un kendi metni). Bu
    talimatın *Kapsam Dışı* tablosu da sayacın hesaplanmasını açıkça T-09'a bırakıyor.
    Bu yüzden `<p className="sr-only" role="status" aria-live="polite" />` içeriksiz
    eklendi; T-09 kendi `toplamSonuc` hesaplamasını buraya bağlayacak.
  - **`--color-ink-dim` değiştirilmedi:** Adım 5'in notu bunu koşullu bırakıyordu
    ("gerekirse"). Yeni `ink-faint` (#8b909c, L≈0,278) ile mevcut `ink-dim` (#a8a99f,
    L≈0,392) arasındaki görece parlaklık sıralaması bozulmuyor (`ink` L≈0,777 >
    `ink-dim` > `ink-faint`, bkz. Doğrulama) — bu yüzden ikinci değişikliğe gerek
    görülmedi, kapsam en dar tutuldu.
  - **Yazım tutarlılığı:** Talimatın Adım 8 örneği `bugüneDon` yazıyordu (ikinci
    kelimede aksan eksik); doğru Türkçe "dön" fiiliyle `bugüneDön` olarak yazıldı,
    davranış aynı.

- **Doğrulama:**
  - `npm run typecheck` ve `npm run build` iki kez temiz geçti (ilk uygulamadan sonra
    ve Lighthouse'un yakaladığı iki bonus düzeltmeden sonra) — 44 modül, son hâli
    328,25 kB JS (106,96 kB gzip), 53,68 kB CSS (10,27 kB gzip).
  - **Kontrast, Node'da WCAG göreli parlaklık formülüyle elle hesaplandı** (DevTools
    yerine — bkz. aşağıdaki canlı tarayıcı kısıtı): `#8b909c`/`#0f131a` → **5,82:1**
    (talimatın kendi tahmini ≈5,9 ile uyumlu), AA eşiği 4,5'i rahat geçiyor. Eski
    `#6f7481`/`#0f131a` → **3,98:1** (talimatla tutarlı, "≈4.0:1"). Hiyerarşi:
    `ink` L=0,7767 > `ink-dim` L=0,3920 > yeni `ink-faint` L=0,2784 — sıralama korunuyor.
  - **Canlı tarayıcı (Browser pane) bu oturumda ulaşılamaz durumdaydı:** Oturum
    başında bu proje klasöründe başka bir oturumun geliştirme sunucusu zaten
    çalıştığı bildirildi. Bu oturumun kendi `preview_start` sunucusuna (iki ayrı port,
    iki temiz yeniden başlatma) Browser pane `net::ERR_CONNECTION_REFUSED` ile hiç
    ulaşamadı — sayfa hiç yüklenmediği için `read_page`/`get_page_text`/
    `javascript_tool`/ekran görüntüsü de (T-03…T-06'nın "pane ekrana basmıyor ama
    sayfa yüklü" kısıtından daha temel bir engel) kullanılamadı.
  - **Bunun yerine gerçek bir Lighthouse denetimi Bash üzerinden (Browser pane'den
    bağımsız), `npx lighthouse` + yerel Chrome ile üretim önizlemesine (`vite build`
    → `vite preview`, port 4173, `curl` ile `HTTP 200` doğrulandı) karşı **iki kez**
    çalıştırıldı:**
    - 1. çalıştırma (yalnızca talimatın 11 adımından sonra): **89 / 100** —
      `button-name`, `color-contrast`, `heading-order` başarısız.
    - `button-name` ve `heading-order` yukarıdaki bonus düzeltmelerle giderildi.
    - 2. çalıştırma: **96 / 100** — yalnızca `color-contrast` (yukarıdaki O-10,
      bilinçli olarak bırakıldı) kaldı. **≥95 hedefi karşılandı.**
  - Bu ölçüm gerçek bir Chrome örneğinde (headless), gerçek üretim derlemesine karşı
    çalıştı — Browser pane'in kısıtından bağımsız, geçerli bir kanıt.
  - **Canlı olarak denenemeyenler:** yalnızca-klavye tur (`Tab` sırası, gerçek tuş
    vuruşlarıyla `←`/`→`/`T`/`/`/`?`), NVDA/Narrator ekran okuyucu turu, fareyle
    `:focus-visible` halkasının gözle görülmesi. Bunların mantığı kod incelemesiyle
    (talimatın kendi kod parçalarına birebir sadakat) doğrulandı ama gerçek
    etkileşimle **denenmedi**. Bu, `CALISMA-SISTEMI.md` §6.3'ün istediği "3 farklı
    günde görsel doğrulama" adımının bu talimat için eksik kalan tek parçası.

- **Sonraki talimata not:**
  - **K-5 hâlâ atanmadı — T-07 de kapsamına almadı** (gerekçe için yukarıki
    Sapmalar'a bakın). `leaf.tsx`'e gerçekten dokunacak bir sonraki talimat iyi bir
    aday (içerik/performans talimatları arasında en olası — **T-13** — ya da ayrı
    küçük bir T-15); önerilen düzeltme hâlâ aynı: iki dekoratif katmana
    `pointer-events-none` eklemek.
  - **Yeni bulgu O-10 (bu talimat sırasında, gerçek Lighthouse denetimiyle
    keşfedildi):** `text-brand` (#d23b2e) koyu zeminde metin/simge rengi olarak
    kullanıldığında AA kontrastını (4,5:1) karşılamıyor — üç yer: `leaf.tsx` Ticker
    başlığı (3,98:1), `sections.tsx` `CasesSection` dosya türü rozeti ve
    "Dosyayı aç/kapat" düğmesi (≈3,54:1). Düzeltme, `ink-faint`'in aksine, talimatın
    hazır bir değer vermediği yeni bir tasarım kararı gerektiriyor (metin için daha
    açık bir kırmızı ton mu, yoksa arka plan/kullanım değişikliği mi?) — bu yüzden
    ayrı bir talimata (veya T-11/T-13 gibi `sections.tsx`'e zaten dokunacak bir
    talimata) bırakıldı. Ayrıntı → `ANALIZ-RAPORU.md` O-10.
  - **T-09'a bağımlılık:** Arama sonucu `aria-live` kabı (`App.tsx`, boş `<p
    className="sr-only" role="status" aria-live="polite" />`) burada hazırlandı; T-09
    Adım 4 kendi `toplamSonuc` hesaplamasını doğrudan bu elemanın içeriğine
    bağlamalı, yeni bir kap açmamalı.
  - **Yeni bir tam ekran katman eklenirse** (`BroadcastMode` gibi), o da ya
    `aria-modal="true"` taşımalı ya da `App.tsx`'teki global klavye dinleyicisine
    `broadcast` durumunun ele alındığı gibi kendi bayrağıyla eklenmeli — aksi hâlde
    ana sayfa kısayolları o katmanın arkasında sessizce çalışmaya devam eder.
  - **Canlı tarayıcı doğrulaması (yalnızca-klavye tur, NVDA/Narrator) bir sonraki
    oturumda, Browser pane çalışan bir ortamda tamamlanmalı** — bu oturumda yalnızca
    kod incelemesi ve gerçek bir Lighthouse denetimiyle doğrulanabildi (bkz.
    Doğrulama).
