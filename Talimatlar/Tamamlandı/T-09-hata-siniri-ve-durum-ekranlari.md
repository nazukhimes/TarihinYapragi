# T-09 · Hata Sınırı ve Durum Ekranları

| Alan             | Değer                                       |
| ---------------- | ------------------------------------------- |
| **Faz**          | FAZ 2 — Ürün Kabuğu                         |
| **Öncelik**      | 🟠 Yüksek                                   |
| **Tahmini süre** | ~3 saat                                     |
| **Bağımlılık**   | T-05 (`DayError` tipi), T-06 (yönlendirici) |
| **İlgili bulgu** | O-5, O-9, m-3, m-6                          |
| **Durum**        | ✅ Tamamlandı                               |

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

interface Props {
  children: ReactNode;
}
interface State {
  hata: Error | null;
}

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
          <h1 className="font-display font-bold text-3xl text-inkpaper mt-4">Yaprak yırtıldı</h1>
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
              onClick={() => {
                localStorage.clear();
                location.reload();
              }}
              className="px-5 py-3 rounded-sm border border-inkpaper-dim/50 text-inkpaper
                         font-mono text-[12px] tracking-[0.2em] uppercase"
            >
              Önbelleği temizle
            </button>
          </div>

          {import.meta.env.DEV && (
            <pre
              className="mt-6 text-left text-[11px] text-brand-deep overflow-auto
                            max-h-40 p-3 bg-paper-2 rounded-sm"
            >
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
{
  data?.error && mergedEvents.length === 0 && (
    <div className="py-8">
      <p className="font-display italic text-2xl text-ink">{BASLIK[data.error.kind]}</p>
      <p className="mt-3 text-ink-dim max-w-xl text-[15px] leading-relaxed">{data.error.message}</p>
      <div className="mt-6 flex gap-3 flex-wrap">
        {data.error.retryable && (
          <button onClick={reload} className="...gold...">
            Yeniden dene
          </button>
        )}
        <button onClick={() => setDate(bugun.getDate(), bugun.getMonth() + 1)} className="...">
          Bugüne dön
        </button>
      </div>
    </div>
  );
}
```

Başlık eşlemesi:

| `kind`      | Başlık                           |
| ----------- | -------------------------------- |
| `network`   | "İnternet bağlantısı yok."       |
| `notfound`  | "Bu gün için kayıt bulunamadı."  |
| `ratelimit` | "Arşiv şu an çok yoğun."         |
| `server`    | "Arşiv sunucusu yanıt vermiyor." |
| `unknown`   | "Beklenmeyen bir sorun oluştu."  |

### Adım 4 — Arama sonuç sayacı (m-6)

`App.tsx` içinde toplam eşleşmeyi hesapla:

```ts
const aramaSonuclari = useMemo(() => {
  if (!searching) return null;
  const say = (n: number) => n;
  return {
    olay: mergedEvents.filter((e) =>
      matchQuery(query, e.text, e.detail, e.page?.excerpt, formatYear(e.year))
    ).length,
    dogum: births.filter((p) => matchQuery(query, p.name, p.excerpt)).length,
    vefat: deaths.filter((p) => matchQuery(query, p.name, p.excerpt)).length,
    dosya: allCases.filter((c) => matchQuery(query, c.title, c.summary, c.detail, c.tags.join(" ")))
      .length,
    bilim: allScience.filter((s) => matchQuery(query, s.title, s.summary, s.field)).length,
  };
}, [searching, query, mergedEvents, births, deaths, allCases, allScience]);

const toplamSonuc = aramaSonuclari ? Object.values(aramaSonuclari).reduce((a, b) => a + b, 0) : 0;
```

> **Not:** Bu, bölümlerin kendi içindeki süzme mantığını **tekrarlıyor**.
> Tekrarı önlemek için `matchQuery` çağrılarını ortak bir yardımcıya taşımak
> daha temiz olur; ancak bölüm bileşenlerinin arayüzünü değiştirmemek adına
> bu talimatta tekrar kabul edilebilir. Refaktör notu T-13'e düşülsün.

Arama kutusunun altına bir şerit ekle:

```tsx
{
  searching && (
    <div
      className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex items-center gap-3 flex-wrap
                  border-b border-line/60 font-mono text-[12px]"
    >
      <span className="text-gold">"{query}"</span>
      <span className="text-ink-dim">{toplamSonuc > 0 ? `${toplamSonuc} sonuç` : "sonuç yok"}</span>
      {toplamSonuc > 0 && (
        <span className="text-ink-faint">
          {aramaSonuclari!.olay} olay · {aramaSonuclari!.dogum} doğum ·{aramaSonuclari!.vefat} vefat
          · {aramaSonuclari!.dosya} dosya ·{aramaSonuclari!.bilim} bilim
        </span>
      )}
      <button onClick={() => setQuery("")} className="ml-auto text-brand">
        ✕ temizle
      </button>
    </div>
  );
}
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
{
  data && data.holidays.length > 0 && (
    <Reveal className="mt-8">
      <div className="rounded-sm border border-gold/40 bg-gold/[0.06] px-5 py-4">
        <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-gold mb-2">
          Bugünün anlamı
        </p>
        <ul className="space-y-1.5">
          {data.holidays.map((h) => (
            <li
              key={h.id}
              className="text-[14.5px] text-ink-dim leading-relaxed
                                     flex gap-2.5"
            >
              <span className="text-gold shrink-0">◆</span>
              <span>{h.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
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
{
  !hepsi && visible.length > LIMIT && (
    <button
      onClick={() => setHepsi(true)}
      className="md:col-span-2 border border-dashed border-line rounded-sm py-4
                     font-mono text-[12px] tracking-widest uppercase text-ink-faint
                     hover:text-brand hover:border-brand/60 transition-colors"
    >
      {visible.length - LIMIT} dosya daha göster
    </button>
  );
}
```

Aynı desen `ScienceSection`'da da uygulanabilir (`slice(0, 3)` sınırı için).

### Adım 7 — Yükleme durumunu iyileştir

Mevcut `SkeletonLines` / `SkeletonCards` iyi. Tek eksik: uzun süren yüklemede
kullanıcıya bilgi. 4 saniyeyi geçerse ek satır göster:

```tsx
{
  loading && gecikti && (
    <p className="mt-3 font-mono text-[12px] text-copper">Arşiv beklenenden yavaş yanıt veriyor…</p>
  );
}
```

---

## 🚫 Kapsam Dışı

| Dokunma                           | Neden / Hangi talimat                   |
| --------------------------------- | --------------------------------------- |
| Hata izleme servisi (Sentry vb.)  | Kapsam dışı — gizlilik kararı           |
| `DayError` üretim mantığı         | T-05 (burada yalnızca **gösteriliyor**) |
| 404 sayfası                       | T-06'da yapıldı                         |
| Yeni bölüm ekleme (`NAV` dizisi)  | "Bugünün anlamı" bilinçli olarak şerit  |
| Arama mantığının refaktörü        | Not T-13'e düşüldü                      |
| Service worker çevrimdışı sayfası | T-08                                    |

---

## ☑️ Kabul Kriterleri

- [x] `src/components/ErrorBoundary.tsx` var; kökte ve altı bölümde kullanılıyor
- [x] Bir bölüm çöktüğünde diğer bölümler çalışmaya devam ediyor
- [x] Hata ekranında "Sayfayı yenile" ve "Önbelleği temizle" düğmeleri çalışıyor
- [x] Hata yığını (stack) **yalnızca** `import.meta.env.DEV` iken görünüyor
- [x] Beş hata türü (`network`/`notfound`/`ratelimit`/`server`/`unknown`) ayrı başlık gösteriyor
- [x] `retryable: false` olan hatada "Yeniden dene" **gösterilmiyor**
- [x] Arama yapıldığında toplam ve bölüm bazlı sonuç sayısı görünüyor
- [x] Sonuç yoksa tek bir boş durum ekranı çıkıyor, altı boş bölüm değil
- [x] `holidays` verisi olan günlerde "Bugünün anlamı" şeridi görünüyor
- [x] Karanlık dosyalarda 6'dan fazlası varsa "N dosya daha göster" düğmesi çıkıyor
- [x] 4 saniyeyi geçen yüklemede uyarı satırı görünüyor
- [x] `npm run typecheck` ve `npm run build` hatasız

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

| Test        | Nasıl                                 | Beklenen                                  |
| ----------- | ------------------------------------- | ----------------------------------------- |
| `network`   | DevTools → Offline, hiç açılmamış gün | "İnternet bağlantısı yok." + Yeniden dene |
| `notfound`  | `.env` ile geçersiz API tabanı        | Uygun başlık, **Yeniden dene yok**        |
| `ratelimit` | DevTools → isteği 429 ile override et | "Arşiv şu an çok yoğun." + Yeniden dene   |

### 4. Arama sayacı

| Sorgu                  | Beklenen                                   |
| ---------------------- | ------------------------------------------ |
| `atatürk` (29 Ekim'de) | Toplam > 0, bölüm dağılımı görünür         |
| `zzzqqq`               | "sonuç yok" + boş durum ekranı + iki düğme |
| boş                    | Şerit hiç görünmemeli                      |

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

- **Tamamlanma tarihi:** 2026-08-22

- **Değişen dosyalar:**
  - `src/components/ErrorBoundary.tsx` — **yeni.** `ErrorBoundary` sınıf bileşeni
    (`variant="page"|"section"`) + `RouteErrorFallback` fonksiyon bileşeni
    (react-router `errorElement` için, `useRouteError` kullanır). İkisi de aynı
    `ErrorCard` görselini paylaşır.
  - `src/main.tsx` — kök `<ErrorBoundary>` sarmalayıcı; üç rotanın her birine
    `errorElement={<RouteErrorFallback />}` eklendi.
  - `src/App.tsx` — altı bölümün her biri `<ErrorBoundary variant="section">` ile
    sarıldı; `data.error.kind`'a göre 5 başlıklı hata ekranı (`HATA_BASLIK`);
    arama sonuç sayacı (`aramaSonuclari`/`toplamSonuc`) + sonuç şeridi + boş durum
    ekranı; `aria-live` durumu bu sayıya bağlandı; "Bugünün anlamı" şeridi
    (`data.holidays`); `allCases`'teki `.slice(0,6)` ve `allScience`'teki
    `.slice(0,3)` sınırları kaldırıldı; 4 saniyelik gecikme uyarısı (`gecikti` state'i).
  - `src/components/sections.tsx` — `CasesSection` (`CASES_LIMIT=6`) ve
    `ScienceSection` (`SCIENCE_LIMIT=3`) artık kendi `hepsi`/`setHepsi` state'i ile
    "N … daha göster" düğmesi taşıyor; gün değişince (`useEffect([cases|items])`)
    sıfırlanıyor.

- **Sapmalar / notlar:**
  - **Kök hata sınırının etkisiz olması (canlı doğrulamada bulundu, düzeltildi):**
    Talimatın Adım 2'deki taslak kodu yalnızca `main.tsx`'te
    `<ErrorBoundary><RouterProvider/></ErrorBoundary>` öneriyordu — bu, O-5'in ilk
    analiz anındaki `ReactDOM.createRoot(...).render(<App />)` koduna dayanıyordu.
    Ama T-06'dan beri uygulama `createBrowserRouter` kullanıyor ve react-router'ın
    veri yönlendiricileri (v6.4+) her rota elemanını **kendi dahili hata
    sınırıyla** sarıyor — bu, `App`'in kendi render'ında oluşan bir hatayı kök
    `ErrorBoundary`'ye hiç ulaştırmadan react-router'ın kendi jenerik İngilizce
    ekranını gösteriyor (React en yakın hata sınırını kullanır, react-router'ınki
    daha yakında). Talimatın kendi Doğrulama Adım 2'sini (`App.tsx`'in başına
    `throw new Error("kök test")`) uygularken canlı olarak yakalandı — düzeltmeden
    önce konsolda `"Error handled by React Router default ErrorBoundary"` görüldü,
    kök `ErrorBoundary` hiç devreye girmedi. Düzeltme: her rotaya
    `errorElement={<RouteErrorFallback />}` eklendi; kök `ErrorBoundary` artık
    yalnızca react-router'ın kendisinin dışında kalan bir hata için son bir
    güvenlik ağı. Düzeltmeden sonra aynı test doğru Türkçe hata ekranını verdi.
  - **Bölüm-seviyesi hata kartı kompakt varyant aldı:** Talimatın Adım 1 kod
    parçasındaki tek fallback görünümü (`glowfield min-h-screen grid
place-items-center`) kökte doğru ama bir bölümü sarmak için kullanılırsa
    Doğrulama Adım 7'nin kendi beklentisiyle ("ErrorBoundary sarmalayıcıları
    düzen bozmamalı") çelişirdi — 100vh yüksekliğinde boş bir kutu sayfanın
    ortasında açılırdı. `ErrorBoundary`'ye `variant` prop'u eklendi: `"page"`
    (varsayılan, tam ekran, kökte kullanılır) ve `"section"` (`min-h-screen`
    olmadan, `max-w-lg mx-auto` ile bölüm içine sığan kompakt kart, altı bölümde
    kullanılır). İkisi de aynı mesaj/düğme/dev-stack mantığını paylaşıyor.
  - **Bilim & Keşif'e de "daha göster" eklendi:** Talimatın Adım 6'sı bunu
    "aynı desen uygulanabilir" diye önerdi (Kabul Kriterleri'nde zorunlu değildi);
    tutarlılık için ve m-3'ün kardeşi sayılabilecek aynı sessiz-kesme deseni
    olduğu için uygulandı (`allScience`'teki `.slice(0,3)` kaldırıldı,
    `ScienceSection`'a `SCIENCE_LIMIT=3` + "N kayıt daha göster" eklendi).
  - `bugüneDön` (mevcut `useCallback`) yeniden kullanıldı; talimatın kod
    parçasındaki `setDate(bugun.getDate(), bugun.getMonth() + 1)` tekrarı yerine.

- **Doğrulama (canlı, Browser pane üzerinden — bu oturumda ekran görüntüsü/
  compositing engelli değildi, `preview_start` + `read_page`/`javascript_tool`/
  `read_console_messages` kullanıldı):**
  - **Hata sınırı testi:** `CasesSection`'ın başına geçici `throw new
Error("test hatası")` eklendi → yalnızca Karanlık Dosyalar bölümünde
    "Arşivde bir sorun çıktı / Yaprak yırtıldı" kartı çıktı, diğer beş bölüm
    (Zaman Tüneli, Doğanlar, Kaybettiklerimiz, Bilim & Keşif, Sohbet Kartları)
    normal render edildi, konsolda `[Tarih Yaprağı] beklenmeyen hata:` kaydı
    görüldü. Test satırı silindi.
  - **Kök hata sınırı testi:** `App.tsx`'in başına geçici `throw new
Error("kök test")` eklendi → düzeltmeden ÖNCE react-router'ın jenerik
    ekranı, düzeltmeden SONRA projenin "Sayfayı yenile"/"Önbelleği temizle"
    düğmeli Türkçe ekranı + dev modunda hata yığını çıktı. Test satırı silindi.
  - **Arama sayacı:** 29 Ekim'de `"cumhuriyet"` yazıldı → şerit `"cumhuriyet" 4
sonuç · 4 olay · 0 doğum · 0 vefat · 0 dosya · 0 bilim` gösterdi,
    `aria-live` kabı `"4 sonuç bulundu"` içeriyordu (DOM'dan `javascript_tool`
    ile doğrulandı). `"zzzqqq"` yazıldığında altı bölüm/nav kayboldu, tek boş
    durum ekranı (`"zzzqqq" için bu günde sonuç yok."` + iki düğme) çıktı,
    `aria-live` `"sonuç yok"` oldu. Arama temizlenince (`✕ temizle` gerçek
    tıklamayla) hem kutu hem şerit sıfırlandı.
  - **Bugünün anlamı:** 29 Ekim ve 7 Mart'ta veri var → şerit göründü (29
    Ekim'de ayrıca gerçek API'de üç şablon-artığı çöp kayıt olduğu keşfedildi,
    bkz. aşağıdaki not). Arama sonucu boş durumunda hiç render edilmedi.
  - **Daha fazla dosya:** 29 Ekim'de (10 karanlık dosya: 2 editör + 8 otomatik)
    6 kart + `"4 dosya daha göster"` çıktı; düğmeye JS ile tıklanınca 10 kartın
    tamamı açıldı. 7 Mart'ta Bilim & Keşif `"1 kayıt daha göster"` gösterdi.
  - **Regresyon:** 29 Ekim (özel dosyalı gün), 7 Mart (sıradan gün), 29 Şubat
    (kenar durum) üçünde de sayfa hatasız açıldı, başlık doğru güncellendi,
    konsolda beklenmeyen hata yoktu.
  - **Doğrulanamayan/canlı test edilmeyen:** Beş `DayError` türünün her birinin
    ayrı ekranı ve `retryable:false`'ta "Yeniden dene"nin gizlenmesi, gerçek ağ
    hatası enjeksiyonu (DevTools offline/429 override, `.env` ile geçersiz API
    tabanı) gerektirdiğinden bu oturumda canlı tetiklenmedi; kod incelemesiyle
    doğrulandı — `HATA_BASLIK: Record<DayErrorKind, string>` TypeScript'te
    tüm 5 türü kapsamayı derleme zamanında zorunlu kılıyor, `retryable` koşulu
    `wiki.ts`'in zaten T-05'te doğrulanmış `DayError` sözleşmesinden okunuyor.
    4 saniyelik gecikme uyarısı da benzer şekilde (yavaş ağ simülasyonu
    gerektirdiğinden) canlı tetiklenmedi, kod incelemesiyle doğrulandı.
  - `npm run typecheck` ve `npm run build` — geçici test `throw`'ları
    eklendiğinde/temizlenmeden önce beklenen (ilgisiz) tip hataları verdi,
    ikisi de kaldırıldıktan sonra iki kez de temiz geçti.

- **Sonraki talimata not:**
  - **Yeni bulgu O-11** (`Dokumanlar/ANALIZ-RAPORU.md` bölüm 8): Vikipedi TR
    `holidays` alanı bazı günlerde `Şablon:`/`Şablon tartışma:` ad alanına bağlı
    tek harfli çöp kayıtlar döndürüyor (29 Ekim'de "g", "t", "d"). T-09 veri
    üretimine (T-05/`wiki.ts` kapsamı) bilinçli olarak dokunmadı, yalnızca
    geleni gösterdi. Önerilen küçük düzeltme: `wiki.ts`'te `holidays`
    üretiminde sayfası `Şablon` ad alanında olan veya çok kısa (<3 karakter)
    metinleri süzmek. `wiki.ts`'e zaten dokunacak T-11 (sınıflandırma
    doğruluğu) iyi bir aday.
  - Arama sonucu sayaç mantığı (`aramaSonuclari`), bölümlerin kendi içindeki
    `matchQuery` süzmesini **tekrarlıyor** — talimatın kendi notu bu tekrarı
    bilinçli kabul ediyor ve refaktörü T-13'e düşüyor; burada da aynen
    bırakıldı, T-13'e taşınan not geçerliliğini koruyor.
  - K-5 (gezinme düğmeleri gerçek tıklamayla çalışmıyor) hâlâ atanmadı; T-09
    `leaf.tsx`'e hiç dokunmadı.
