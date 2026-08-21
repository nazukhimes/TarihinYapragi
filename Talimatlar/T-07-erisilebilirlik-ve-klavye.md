# T-07 · Erişilebilirlik ve Klavye

| Alan | Değer |
|---|---|
| **Faz** | FAZ 2 — Ürün Kabuğu |
| **Öncelik** | 🟠 Yüksek |
| **Tahmini süre** | ~3,5 saat |
| **Bağımlılık** | T-04 (`Reveal` düzeltmesi), T-06 (gün geçişi `setDate` üzerinden) |
| **İlgili bulgu** | O-6, O-7 |
| **Durum** | ⬜ Bekliyor |

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

- [ ] Modal açıkken Tab tuşu panelin dışına çıkmıyor (ileri ve geri)
- [ ] Modal kapanınca odak, açan karta/düğmeye dönüyor
- [ ] `Toaster` `role="status"` + `aria-live="polite"` taşıyor
- [ ] `Tab` tuşuna ilk basışta "Ana içeriğe atla" bağlantısı görünüyor ve çalışıyor
- [ ] Arama girdisinde `aria-label` ve `type="search"` var
- [ ] `--color-ink-faint` ≥ 4.5:1 kontrast sağlıyor
- [ ] `:focus-visible` halkası koyu ve kâğıt yüzeylerde görünür
- [ ] Kategori çipleri `aria-pressed` taşıyor
- [ ] `←` `→` `T` `/` `?` kısayolları çalışıyor
- [ ] Arama kutusuna yazarken `←` `→` kısayolları **tetiklenmiyor**
- [ ] Yayın Modu açıkken ana sayfa kısayolları **tetiklenmiyor**
- [ ] Kişi kartı görsellerinde `width`/`height` var, düzen kaymıyor
- [ ] Lighthouse Erişilebilirlik puanı **≥ 95**
- [ ] `npm run typecheck` ve `npm run build` hatasız

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

- **Tamamlanma tarihi:**
- **Değişen dosyalar:**
- **Lighthouse Erişilebilirlik puanı:**
- **Çözülemeyen uyarılar:**
- **Sapmalar / notlar:**
- **Sonraki talimata not:**
