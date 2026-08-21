# T-09 · Hata Sınırı ve Durum Ekranları

| Alan | Değer |
|---|---|
| **Faz** | FAZ 2 — Ürün Kabuğu |
| **Öncelik** | 🟠 Yüksek |
| **Tahmini süre** | ~3 saat |
| **Bağımlılık** | T-05 (`DayError` tipi), T-06 (yönlendirici) |
| **İlgili bulgu** | O-5, O-9, m-3, m-6 |
| **Durum** | ⬜ Bekliyor |

---

## 🎯 Amaç

Uygulamanın "kötü gün"lerini de tasarlamak: bir bileşen çöktüğünde, veri
gelmediğinde, arama sonuç vermediğinde kullanıcı **boş bir ekranla değil, bir
açıklamayla ve bir çıkış yoluyla** karşılaşsın.

Ek olarak, hâlihazırda çekilip kullanılmayan `holidays` verisini görünür kılmak.

---

## 📍 Mevcut Durum

### O-5 · Hata sınırı yok

`src/main.tsx`

```tsx
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
```

Herhangi bir bileşende oluşan runtime hatası tüm ağacı söker → **beyaz ekran**.
Kullanıcı ne olduğunu bilmez, yenilemekten başka seçeneği olduğunu da bilmez.

### O-9 · `holidays` çekiliyor ama gösterilmiyor

`wiki.ts` `holidays` alanını dolduruyor. Ekranda yalnızca dolaylı olarak,
otomatik sohbet kartlarından biri (`auto-holiday`) hâlinde beliriyor —
o da 9 kartlık listede kesilebiliyor. Veri var, görünürlük yok.

### m-3 · Karanlık dosyalarda sessiz kesme

`App.tsx` → `allCases`: `auto.slice(0, 6)`.
Otomatik tespit 20 dosya bulsa bile 6'sı gösteriliyor, kullanıcıya
"daha var" denmiyor.

### m-6 · Arama sonuç sayacı yok

Arama yapıldığında her bölüm kendi içinde süzülüyor ama **toplam kaç sonuç
bulunduğu** hiçbir yerde yazmıyor. Sonuç yoksa kullanıcı bunu ancak altı
bölümü de gezerek anlıyor.

---

## ✅ Yapılacaklar

### Adım 1 — `ErrorBoundary` bileşeni

React'te hata sınırı **yalnızca sınıf bileşeniyle** yazılabilir — projedeki tek
sınıf bileşen bu olacak, bu bir istisna değil zorunluluktur.

`src/components/ErrorBoundary.tsx`:

```tsx
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hata: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hata: null };

  static getDerivedStateFromError(hata: Error): State {
    return { hata };
  }

  componentDidCatch(hata: Error, bilgi: ErrorInfo) {
    console.error("[Tarih Yaprağı] beklenmeyen hata:", hata, bilgi.componentStack);
  }

  render() {
    if (!this.state.hata) return this.props.children;

    return (
      <div className="glowfield min-h-screen grid place-items-center px-6">
        <div className="paper paper-grain torn-edge rounded-sm p-10 max-w-lg text-center">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-brand">
            Arşivde bir sorun çıktı
          </p>
          <h1 className="font-display font-bold text-3xl text-inkpaper mt-4">
            Yaprak yırtıldı
          </h1>
          <p className="mt-3 text-inkpaper-dim text-[15px] leading-relaxed">
            Beklenmeyen bir hata oluştu. Sayfayı yenilemek çoğu zaman yeterli olur.
          </p>

          <div className="mt-7 flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => location.reload()}
              className="px-5 py-3 rounded-sm bg-brand text-paper font-mono
                         text-[12px] tracking-[0.2em] uppercase font-semibold"
            >
              Sayfayı yenile
            </button>
            <button
              onClick={() => { localStorage.clear(); location.reload(); }}
              className="px-5 py-3 rounded-sm border border-inkpaper-dim/50 text-inkpaper
                         font-mono text-[12px] tracking-[0.2em] uppercase"
            >
              Önbelleği temizle
            </button>
          </div>

          {import.meta.env.DEV && (
            <pre className="mt-6 text-left text-[11px] text-brand-deep overflow-auto
                            max-h-40 p-3 bg-paper-2 rounded-sm">
              {this.state.hata.stack}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
```

> **`localStorage.clear()` düğmesi** özellikle değerli: bozuk önbellek kaydı
> yüzünden çöken bir uygulamayı kullanıcı kendi kurtarabilir.
> Hata ayrıntısı **yalnızca geliştirme modunda** gösterilir.

### Adım 2 — Hata sınırlarını yerleştir

`src/main.tsx` → kök:

```tsx
<ErrorBoundary>
  <RouterProvider router={router} />
</ErrorBoundary>
```

`src/App.tsx` → her bölümü ayrı sar, böylece bir bölümün çökmesi diğerlerini
götürmez:

```tsx
<SectionShell id="karanlik">
  <ErrorBoundary>
    <CasesSection cases={allCases} query={query} />
  </ErrorBoundary>
</SectionShell>
```

Altı bölümün hepsine uygula.

### Adım 3 — Hata türüne göre ekran (T-05'in `DayError`'ını kullan)

Mevcut çevrimdışı bloğu tek mesaj gösteriyor. `data.error.kind`'a göre ayır:

```tsx
{data?.error && mergedEvents.length === 0 && (
  <div className="py-8">
    <p className="font-display italic text-2xl text-ink">{BASLIK[data.error.kind]}</p>
    <p className="mt-3 text-ink-dim max-w-xl text-[15px] leading-relaxed">
      {data.error.message}
    </p>
    <div className="mt-6 flex gap-3 flex-wrap">
      {data.error.retryable && (
        <button onClick={reload} className="...gold...">Yeniden dene</button>
      )}
      <button onClick={() => setDate(bugun.getDate(), bugun.getMonth() + 1)} className="...">
        Bugüne dön
      </button>
    </div>
  </div>
)}
```

Başlık eşlemesi:

| `kind` | Başlık |
|---|---|
| `network` | "İnternet bağlantısı yok." |
| `notfound` | "Bu gün için kayıt bulunamadı." |
| `ratelimit` | "Arşiv şu an çok yoğun." |
| `server` | "Arşiv sunucusu yanıt vermiyor." |
| `unknown` | "Beklenmeyen bir sorun oluştu." |

### Adım 4 — Arama sonuç sayacı (m-6)

`App.tsx` içinde toplam eşleşmeyi hesapla:

```ts
const aramaSonuclari = useMemo(() => {
  if (!searching) return null;
  const say = (n: number) => n;
  return {
    olay:    mergedEvents.filter((e) => matchQuery(query, e.text, e.detail, e.page?.excerpt, formatYear(e.year))).length,
    dogum:   births.filter((p) => matchQuery(query, p.name, p.excerpt)).length,
    vefat:   deaths.filter((p) => matchQuery(query, p.name, p.excerpt)).length,
    dosya:   allCases.filter((c) => matchQuery(query, c.title, c.summary, c.detail, c.tags.join(" "))).length,
    bilim:   allScience.filter((s) => matchQuery(query, s.title, s.summary, s.field)).length,
  };
}, [searching, query, mergedEvents, births, deaths, allCases, allScience]);

const toplamSonuc = aramaSonuclari
  ? Object.values(aramaSonuclari).reduce((a, b) => a + b, 0)
  : 0;
```

> **Not:** Bu, bölümlerin kendi içindeki süzme mantığını **tekrarlıyor**.
> Tekrarı önlemek için `matchQuery` çağrılarını ortak bir yardımcıya taşımak
> daha temiz olur; ancak bölüm bileşenlerinin arayüzünü değiştirmemek adına
> bu talimatta tekrar kabul edilebilir. Refaktör notu T-13'e düşülsün.

Arama kutusunun altına bir şerit ekle:

```tsx
{searching && (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex items-center gap-3 flex-wrap
                  border-b border-line/60 font-mono text-[12px]">
    <span className="text-gold">"{query}"</span>
    <span className="text-ink-dim">
      {toplamSonuc > 0 ? `${toplamSonuc} sonuç` : "sonuç yok"}
    </span>
    {toplamSonuc > 0 && (
      <span className="text-ink-faint">
        {aramaSonuclari!.olay} olay · {aramaSonuclari!.dogum} doğum ·
        {aramaSonuclari!.vefat} vefat · {aramaSonuclari!.dosya} dosya ·
        {aramaSonuclari!.bilim} bilim
      </span>
    )}
    <button onClick={() => setQuery("")} className="ml-auto text-brand">✕ temizle</button>
  </div>
)}
```

Sonuç yoksa, sayfanın gövdesinde bölümler yerine tek bir boş durum göster:

```
"xyz" için bu günde sonuç yok.
Başka bir gün deneyin ya da aramayı temizleyin.
[Aramayı temizle]  [Bugüne dön]
```

T-07'deki `aria-live` kabına da bu sayıyı bağla.

### Adım 5 — "Bugünün Anlamı" bölümü (O-9)

`holidays` verisini görünür kıl. Zaman Tüneli'nin **üstüne**, kısa bir şerit olarak:

```tsx
{data && data.holidays.length > 0 && (
  <Reveal className="mt-8">
    <div className="rounded-sm border border-gold/40 bg-gold/[0.06] px-5 py-4">
      <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-gold mb-2">
        Bugünün anlamı
      </p>
      <ul className="space-y-1.5">
        {data.holidays.map((h) => (
          <li key={h.id} className="text-[14.5px] text-ink-dim leading-relaxed
                                     flex gap-2.5">
            <span className="text-gold shrink-0">◆</span>
            <span>{h.text}</span>
          </li>
        ))}
      </ul>
    </div>
  </Reveal>
)}
```

> **Bölüm değil şerit** olarak konumlandırılıyor: `NAV` dizisine eklenmez,
> altı bölümlü yapı bozulmaz. Her günde veri olmadığı için sabit bir bölüm
> olmayı hak etmiyor.

### Adım 6 — Karanlık dosyalarda "daha fazla" (m-3)

`App.tsx` → `allCases` içindeki `auto.slice(0, 6)` sınırını kaldır, tümünü döndür.
`CasesSection` içinde göster/gizle:

```tsx
const [hepsi, setHepsi] = useState(false);
const LIMIT = 6;
const gosterilecek = hepsi ? visible : visible.slice(0, LIMIT);

// ... kartlardan sonra
{!hepsi && visible.length > LIMIT && (
  <button onClick={() => setHepsi(true)}
          className="md:col-span-2 border border-dashed border-line rounded-sm py-4
                     font-mono text-[12px] tracking-widest uppercase text-ink-faint
                     hover:text-brand hover:border-brand/60 transition-colors">
    {visible.length - LIMIT} dosya daha göster
  </button>
)}
```

Aynı desen `ScienceSection`'da da uygulanabilir (`slice(0, 3)` sınırı için).

### Adım 7 — Yükleme durumunu iyileştir

Mevcut `SkeletonLines` / `SkeletonCards` iyi. Tek eksik: uzun süren yüklemede
kullanıcıya bilgi. 4 saniyeyi geçerse ek satır göster:

```tsx
{loading && gecikti && (
  <p className="mt-3 font-mono text-[12px] text-copper">
    Arşiv beklenenden yavaş yanıt veriyor…
  </p>
)}
```

---

## 🚫 Kapsam Dışı

| Dokunma | Neden / Hangi talimat |
|---|---|
| Hata izleme servisi (Sentry vb.) | Kapsam dışı — gizlilik kararı |
| `DayError` üretim mantığı | T-05 (burada yalnızca **gösteriliyor**) |
| 404 sayfası | T-06'da yapıldı |
| Yeni bölüm ekleme (`NAV` dizisi) | "Bugünün anlamı" bilinçli olarak şerit |
| Arama mantığının refaktörü | Not T-13'e düşüldü |
| Service worker çevrimdışı sayfası | T-08 |

---

## ☑️ Kabul Kriterleri

- [ ] `src/components/ErrorBoundary.tsx` var; kökte ve altı bölümde kullanılıyor
- [ ] Bir bölüm çöktüğünde diğer bölümler çalışmaya devam ediyor
- [ ] Hata ekranında "Sayfayı yenile" ve "Önbelleği temizle" düğmeleri çalışıyor
- [ ] Hata yığını (stack) **yalnızca** `import.meta.env.DEV` iken görünüyor
- [ ] Beş hata türü (`network`/`notfound`/`ratelimit`/`server`/`unknown`) ayrı başlık gösteriyor
- [ ] `retryable: false` olan hatada "Yeniden dene" **gösterilmiyor**
- [ ] Arama yapıldığında toplam ve bölüm bazlı sonuç sayısı görünüyor
- [ ] Sonuç yoksa tek bir boş durum ekranı çıkıyor, altı boş bölüm değil
- [ ] `holidays` verisi olan günlerde "Bugünün anlamı" şeridi görünüyor
- [ ] Karanlık dosyalarda 6'dan fazlası varsa "N dosya daha göster" düğmesi çıkıyor
- [ ] 4 saniyeyi geçen yüklemede uyarı satırı görünüyor
- [ ] `npm run typecheck` ve `npm run build` hatasız

---

## 🧪 Doğrulama

### 1. Hata sınırı testi

Geçici olarak `CasesSection`'ın başına ekle:

```tsx
if (cases.length > 0) throw new Error("test hatası");
```

Beklenen:
- Karanlık Dosyalar bölümünde hata kartı
- **Diğer beş bölüm normal çalışıyor**
- Konsolda `[Tarih Yaprağı] beklenmeyen hata:` kaydı

Testten sonra satırı **sil**.

### 2. Kök hata sınırı

`App.tsx`'in en başına `throw new Error("kök test")` ekle → tam sayfa hata ekranı
görünmeli. "Sayfayı yenile" ve "Önbelleği temizle" düğmeleri çalışmalı.
Testten sonra **sil**.

### 3. Hata türü ekranları

| Test | Nasıl | Beklenen |
|---|---|---|
| `network` | DevTools → Offline, hiç açılmamış gün | "İnternet bağlantısı yok." + Yeniden dene |
| `notfound` | `.env` ile geçersiz API tabanı | Uygun başlık, **Yeniden dene yok** |
| `ratelimit` | DevTools → isteği 429 ile override et | "Arşiv şu an çok yoğun." + Yeniden dene |

### 4. Arama sayacı

| Sorgu | Beklenen |
|---|---|
| `atatürk` (29 Ekim'de) | Toplam > 0, bölüm dağılımı görünür |
| `zzzqqq` | "sonuç yok" + boş durum ekranı + iki düğme |
| boş | Şerit hiç görünmemeli |

Ekran okuyucuda "N sonuç bulundu" duyulmalı (T-07 `aria-live`).

### 5. Bugünün anlamı

`1 Ocak` (yılbaşı) veya `23 Nisan` aç → altın çerçeveli şerit görünmeli.
Veri olmayan bir günde şerit **hiç render edilmemeli** (boş kutu bırakmamalı).

### 6. Daha fazla dosya

Karanlık dosyası bol bir gün bul (`grep` ile `DARK_THEMES` eşleşmesi çok olan).
6 kart + "N dosya daha göster" düğmesi görünmeli; basınca hepsi açılmalı.

### 7. Regresyon

Altı bölüm de normal günlerde çalışmalı; ErrorBoundary sarmalayıcıları
düzen (layout) bozmamalı.

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:**
- **Değişen dosyalar:**
- **Sapmalar / notlar:**
- **Sonraki talimata not:**
