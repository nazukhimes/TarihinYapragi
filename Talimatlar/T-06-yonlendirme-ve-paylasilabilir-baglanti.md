# T-06 · Yönlendirme ve Paylaşılabilir Bağlantı

| Alan | Değer |
|---|---|
| **Faz** | FAZ 2 — Ürün Kabuğu |
| **Öncelik** | 🔴 Kritik |
| **Tahmini süre** | ~4 saat |
| **Bağımlılık** | T-01, T-03, T-04 |
| **İlgili bulgu** | U-1 |
| **Durum** | ⬜ Bekliyor |

---

## 🎯 Amaç

Her günün kendi adresi olsun. Kullanıcı seçtiği günü **paylaşabilsin**,
**yer imine ekleyebilsin**, tarayıcının **geri tuşu çalışsın**.

"Bugün tarihte" türü bir üründe paylaşım birincil büyüme kanalıdır ve şu an
uygulamanın tamamı tek URL'de yaşıyor.

---

## 📍 Mevcut Durum

`src/App.tsx:70-72`

```ts
const today = new Date();
const [day, setDay] = useState(today.getDate());
const [month, setMonth] = useState(today.getMonth() + 1);
```

Seçili gün yalnızca React state'inde. Sonuçlar:

| Sorun | Kullanıcı deneyimi |
|---|---|
| Tek URL | `29 Ekim` sayfası paylaşılamıyor |
| Geri tuşu | Gün geçişlerini geri almıyor, siteden çıkıyor |
| Yer imi | Her zaman bugüne açılıyor |
| Yenileme | Seçilen gün kayboluyor |
| SEO | Arama motoru tek sayfa görüyor, 366 gün değil |

`react-router-dom@6.8` **zaten kurulu** ama hiç kullanılmıyor
(T-01'de bu yüzden silinmedi).

---

## ✅ Yapılacaklar

### Adım 1 — URL şemasına karar ver ve uygula

**Seçilen şema:**

```
/                     → bugüne yönlendir (replace)
/21-agustos           → 21 Ağustos  ← ANA BİÇİM (paylaşılabilir, okunur)
/08-21                → sayısal biçim, /21-agustos'a yönlendir
/gecersiz-sey         → 404 sayfası
```

**Neden ay adı?** `tarihyapragi.com/29-ekim` bir bağlantı olarak kendini anlatır;
`/10-29` anlatmaz. Paylaşım metninin kendisi ürünün reklamıdır.

### Adım 2 — Slug yardımcıları — `src/lib/slug.ts`

```ts
import { MONTHS_TR } from "../components/leaf";

/** "Ağustos" → "agustos" (URL güvenli) */
const TR_MAP: Record<string, string> = {
  ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u",
};

function asciify(s: string): string {
  return s
    .toLocaleLowerCase("tr-TR")
    .split("")
    .map((ch) => TR_MAP[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const MONTH_SLUGS = MONTHS_TR.map(asciify);
// ["ocak","subat","mart","nisan","mayis","haziran",
//  "temmuz","agustos","eylul","ekim","kasim","aralik"]

/** (8, 21) → "21-agustos" */
export function toDaySlug(month: number, day: number): string {
  return `${day}-${MONTH_SLUGS[month - 1]}`;
}

/** "21-agustos" | "08-21" → { month, day } | null */
export function parseDaySlug(slug: string): { month: number; day: number } | null {
  const s = slug.trim().toLocaleLowerCase("tr-TR");

  // sayısal biçim: 08-21
  const num = /^(\d{1,2})-(\d{1,2})$/.exec(s);
  if (num) {
    const m = Number(num[1]);
    const d = Number(num[2]);
    return isValidDay(m, d) ? { month: m, day: d } : null;
  }

  // ad biçimi: 21-agustos
  const named = /^(\d{1,2})-([a-z]+)$/.exec(s);
  if (named) {
    const d = Number(named[1]);
    const m = MONTH_SLUGS.indexOf(named[2]) + 1;
    return m > 0 && isValidDay(m, d) ? { month: m, day: d } : null;
  }

  return null;
}

function isValidDay(month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1) return false;
  // 29 Şubat geçerlidir (arşiv modu) — T-03'teki daysInMonth(month) yıl vermeden çağrılır
  return day <= daysInMonth(month);
}
```

> `daysInMonth`'ı **T-03'te oluşturulan** `src/lib/date.ts`'ten içe aktar.
> Yıl parametresi **verme** — 29 Şubat her zaman geçerli olmalı.

### Adım 3 — Yönlendiriciyi kur — `src/main.tsx`

```tsx
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { toDaySlug } from "./lib/slug";

const bugun = new Date();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={`/${toDaySlug(bugun.getMonth() + 1, bugun.getDate())}`} replace />,
  },
  { path: "/:daySlug", element: <App /> },
  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
```

> **`createBrowserRouter` kullan** (`BrowserRouter` değil) — v6.8'in önerdiği API'dir
> ve T-09'daki `errorElement` desteğini sağlar.

### Adım 4 — `App.tsx`'i URL'e bağla

**Kritik tasarım kuralı: URL tek doğruluk kaynağıdır.**
`day` / `month` için ayrı `useState` **kalmamalı** — aksi hâlde iki kaynak
senkronizasyon hatası üretir.

```tsx
export default function App() {
  const { daySlug } = useParams<{ daySlug: string }>();
  const navigate = useNavigate();

  const parsed = useMemo(() => parseDaySlug(daySlug ?? ""), [daySlug]);

  // geçersiz slug → 404
  if (!parsed) return <NotFound />;

  const { month, day } = parsed;

  const setDate = useCallback(
    (d: number, m: number) => navigate(`/${toDaySlug(m, d)}`),
    [navigate]
  );

  // ... geri kalan her yerde setDay/setMonth yerine setDate(d, m)
}
```

`onChangeDay={(d, m) => { setDay(d); setMonth(m); }}` çağrılarının hepsini
`onChangeDay={setDate}` yap.

> **Sayısal biçim yönlendirmesi:** `/08-21` gibi bir slug geldiğinde,
> `toDaySlug` ile üretilen ad biçimine `navigate(..., { replace: true })` ile
> yönlendir. Böylece kanonik URL tek olur (T-08'deki `canonical` etiketi için önemli).

### Adım 5 — 404 sayfası — `src/components/NotFound.tsx`

Uygulamanın tasarım diliyle uyumlu olmalı: yırtık kâğıt yaprak metaforu.

```tsx
export function NotFound() {
  const bugun = new Date();
  return (
    <div className="glowfield min-h-screen grid place-items-center px-6">
      <div className="paper paper-grain torn-edge rounded-sm p-10 max-w-md text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-brand">
          Yaprak bulunamadı
        </p>
        <p className="font-display font-black text-inkpaper leading-none my-4"
           style={{ fontSize: "clamp(5rem, 14vw, 8rem)" }}>
          404
        </p>
        <p className="text-inkpaper-dim text-[15px] leading-relaxed">
          Bu takvimde böyle bir gün yok. Yaprak yırtılmış olabilir.
        </p>
        <Link to={`/${toDaySlug(bugun.getMonth() + 1, bugun.getDate())}`}
              className="mt-6 inline-block px-5 py-3 rounded-sm bg-brand text-paper
                         font-mono text-[12px] tracking-[0.2em] uppercase font-semibold">
          Bugüne dön
        </Link>
      </div>
    </div>
  );
}
```

### Adım 6 — Paylaş düğmesi

Takvim yaprağının altındaki gezinme satırına ekle:

```tsx
async function paylas(month: number, day: number, dayLabel: string) {
  const url = `${location.origin}/${toDaySlug(month, day)}`;
  const veri = {
    title: `${dayLabel} — Tarih Yaprağı`,
    text: `${dayLabel} tarihinde neler olmuş?`,
    url,
  };

  if (navigator.share) {
    try { await navigator.share(veri); return; } catch { /* kullanıcı vazgeçti */ }
  }
  const ok = await copyText(url);
  toast(ok ? "Bağlantı panoya kopyalandı" : "Kopyalanamadı");
}
```

`navigator.share` mobilde yerel paylaşım sayfasını açar; masaüstünde
`copyText` yedeği devreye girer. `copyText` ve `toast` zaten `ui.tsx`'te var.

### Adım 7 — Sunucu tarafı yönlendirme (SPA fallback)

İstemci yönlendirmesi kullanan uygulamada `/21-agustos` doğrudan açıldığında
sunucunun `index.html` döndürmesi gerekir.

`public/_redirects` (Netlify / Cloudflare Pages):

```
/*    /index.html   200
```

`public/vercel.json` yerine kökte `vercel.json` (Vercel):

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

> `npm run preview` (`vite preview`) bunu kendiliğinden yapar — geliştirmede sorun çıkmaz.
> Sorun yalnızca üretim sunucusunda görülür, bu yüzden şimdi ekleniyor.

---

## 🚫 Kapsam Dışı

| Dokunma | Neden / Hangi talimat |
|---|---|
| `og:` / `canonical` meta etiketleri | T-08 (URL şeması buradan gelecek) |
| `sitemap.xml` üretimi | T-08 |
| `errorElement` ile hata sınırı | T-09 |
| Sunucu tarafı işleme (SSR) | Kapsam dışı — statik SPA kararı korunuyor |
| Klavye ile gün geçişi | T-07 |
| Arama sorgusunun URL'e taşınması (`?q=`) | Kapsam dışı — bu planda değil |
| Yıl bazlı URL (`/2026/08/21`) | Kapsam dışı — ürün gün bazlı, yıl bazlı değil |

---

## ☑️ Kabul Kriterleri

- [ ] `src/lib/slug.ts` var; `toDaySlug` ve `parseDaySlug` çift yönlü tutarlı
- [ ] `/` adresi bugünün slug'ına `replace` ile yönleniyor (geçmişte iz bırakmıyor)
- [ ] `/21-agustos` doğrudan açılıyor ve doğru günü gösteriyor
- [ ] `/08-21` açılıyor ve `/21-agustos` adresine `replace` ile yönleniyor
- [ ] `/olmayan-sey` 404 sayfası gösteriyor
- [ ] `/32-agustos` ve `/0-ocak` 404 gösteriyor
- [ ] `/29-subat` **geçerli** — 404 değil
- [ ] `App.tsx` içinde `day` / `month` için `useState` **yok** — tek kaynak URL
- [ ] Geri / ileri tuşları gün geçişlerinde çalışıyor
- [ ] Paylaş düğmesi var; mobilde yerel paylaşım, masaüstünde panoya kopyalama
- [ ] `public/_redirects` ve `vercel.json` var
- [ ] `npm run typecheck` hatasız
- [ ] `npm run build` hatasız

---

## 🧪 Doğrulama

### 1. URL biçimi tablosu

| Adres | Beklenen |
|---|---|
| `/` | `/21-agustos` (bugün) — `replace` |
| `/21-agustos` | 21 Ağustos içeriği |
| `/1-ocak` | 1 Ocak içeriği |
| `/29-subat` | 29 Şubat içeriği (**404 değil**) |
| `/31-aralik` | 31 Aralık içeriği |
| `/08-21` | → `/21-agustos` |
| `/32-agustos` | 404 |
| `/31-subat` | 404 |
| `/agustos` | 404 |
| `/` + rastgele metin | 404 |

### 2. Gezinme senaryosu

1. `/21-agustos` aç
2. `SONRAKİ GÜN` → URL `/22-agustos` olmalı
3. Mini takvimden `1` seç → `/1-agustos`
4. Özel dosyalı gün `29 Eki` → `/29-ekim`
5. **Geri** tuşuna 3 kez bas → sırasıyla `/1-agustos`, `/22-agustos`, `/21-agustos`
6. **İleri** tuşu → `/1-agustos`

### 3. Yenileme testi

`/29-ekim` sayfasındayken **F5**. Aynı sayfa açılmalı, bugüne dönmemeli.

### 4. Paylaşım testi

- **Masaüstü:** Paylaş düğmesi → "Bağlantı panoya kopyalandı" bildirimi →
  panodaki adres `http://localhost:3000/21-agustos` olmalı.
- **Mobil (veya DevTools cihaz emülasyonu):** yerel paylaşım sayfası açılmalı.

### 5. Türkçe karakter kontrolü

12 ayın slug'ı ASCII olmalı — konsolda:

```js
MONTH_SLUGS.every(s => /^[a-z]+$/.test(s))   // true
```

Özellikle: `subat`, `mayis`, `agustos`, `eylul`, `kasim`, `aralik`

### 6. Çift yönlü tutarlılık

```js
for (let m = 1; m <= 12; m++)
  for (let d = 1; d <= daysInMonth(m); d++) {
    const s = toDaySlug(m, d);
    const p = parseDaySlug(s);
    console.assert(p?.month === m && p?.day === d, s);
  }
```

366 gün için hata vermemeli.

### 7. Üretim sunucusu testi

```bash
npm run build && npm run preview
```

`/29-ekim` adresini **doğrudan** aç → 404 değil, sayfa gelmeli.

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:**
- **Değişen dosyalar:**
- **Sapmalar / notlar:**
- **Sonraki talimata not:**
