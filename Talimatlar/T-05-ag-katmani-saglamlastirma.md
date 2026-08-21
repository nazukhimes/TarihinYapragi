# T-05 · Ağ Katmanı Sağlamlaştırma

| Alan | Değer |
|---|---|
| **Faz** | FAZ 1 — Kritik Hata Düzeltmeleri |
| **Öncelik** | 🟠 Yüksek |
| **Tahmini süre** | ~3 saat |
| **Bağımlılık** | T-01, T-02 (`config.ts`) |
| **İlgili bulgu** | O-4, O-8 |
| **Durum** | ⬜ Bekliyor |

---

## 🎯 Amaç

`src/lib/wiki.ts` içindeki veri getirme katmanını üretime hazır hâle getirmek:
gereksiz istekleri kesmek, iptal desteği eklemek, önbelleğe süre (TTL) koymak ve
hata durumlarını ayırt edilebilir yapmak.

---

## 📍 Mevcut Durum

### O-4a · Her gün için iki istek — biri çoğu zaman boşa

`src/lib/wiki.ts:104`

```ts
const [tr, en] = await Promise.all([load("tr"), load("en")]);
```

EN verisi **yalnızca TR boş kaldığında** kullanılıyor (`pick()` fonksiyonu).
Türkçe Vikipedi'nin "Bugün tarihte" verisi çoğu gün doludur → EN isteğinin
büyük kısmı boşa gidiyor. Kullanıcı 10 gün gezdiğinde **20 istek** yola çıkıyor.

### O-4b · İstek iptali yok

`src/lib/wiki.ts:289-303`

```ts
useEffect(() => {
  const id = ++reqId.current;
  setLoading(true);
  fetchDayData(month, day).then((d) => {
    if (reqId.current === id) { setData(d); setLoading(false); }
  });
}, [month, day, reloadKey]);
```

`reqId` yalnızca **state güncellemesini** koruyor; ağ isteği devam ediyor.
Hızlı gün geçişinde tüm istekler tamamlanıyor. Wikimedia hız sınırına takılma riski var.

### O-8a · `localStorage` yedeğinde zaman damgası yok

```ts
function lsSet(key: string, data: RawDay) {
  localStorage.setItem(key, JSON.stringify(data));   // ← ne zaman yazıldığı bilinmiyor
}
```

Bir gün için kaydedilen veri, ağ hatası anında **süresiz** kullanılıyor.
Vikipedi güncellense bile kullanıcı eski veriyi görüyor ve bunu fark etmiyor.

### O-8b · Bellek önbelleği sınırsız

```ts
const memCache = new Map<string, DayData>();    // hiç boşaltılmıyor
```

Uzun oturumda 366 günün tamamı bellekte birikebilir.

### O-8c · Anahtar birikmesi

`ty-otd-tr-08-21`, `ty-otd-en-08-21`, … Her gün iki anahtar. Temizlik yok.
`localStorage` dolduğunda `lsSet` sessizce başarısız oluyor (`catch {}`).

### O-4c · Hata türleri ayırt edilmiyor

```ts
try { const res = await fetch(...); ... } catch { return lsGet(lsKey); }
```

Ağ kesintisi, 404, 429 (hız sınırı) ve 500 aynı şekilde ele alınıyor.
Kullanıcıya gösterilecek mesaj da tek: *"Arşive şu an ulaşılamıyor."*

---

## ✅ Yapılacaklar

### Adım 1 — TR'yi önce dene, EN'i gerekirse çek

```ts
async function fetchDayData(month, day, signal): Promise<DayData> {
  const tr = await load("tr", signal);

  // TR'de üç ana alandan biri bile boşsa EN'i tamamlayıcı olarak çek
  const trThin =
    !tr ||
    !tr.events?.length ||
    !tr.births?.length ||
    !tr.deaths?.length;

  const en = trThin ? await load("en", signal) : null;
  // ... mevcut pick() mantığı aynen devam
}
```

**Kazanç:** TR verisi dolu olan günlerde istek sayısı **yarıya** iner.
`pick()` fonksiyonunun mantığı **değişmez** — `en` null olduğunda TR'yi kullanır.

### Adım 2 — `AbortController` desteği

`load()` ve `fetchDayData()` fonksiyonlarına `signal?: AbortSignal` parametresi ekle:

```ts
const res = await fetch(url, { signal });
```

`useDayData` içinde:

```ts
useEffect(() => {
  const ctrl = new AbortController();
  setLoading(true);
  setError(null);

  fetchDayData(month, day, ctrl.signal)
    .then((d) => { setData(d); setLoading(false); })
    .catch((e) => {
      if (e.name === "AbortError") return;   // beklenen iptal, sessiz geç
      setError(toDayError(e));
      setLoading(false);
    });

  return () => ctrl.abort();                  // gün değişince öncekini kes
}, [month, day, reloadKey]);
```

`reqId` mekanizması artık gereksiz — **kaldır**.

> ⚠️ **Dikkat:** `memCache`'ten dönen sonuç senkron olduğu için iptal edilemez;
> bu sorun değil — zaten ağ isteği yok.

### Adım 3 — TTL'li önbellek

```ts
const TTL_MS = 24 * 60 * 60 * 1000;   // 24 saat

interface CachedDay {
  savedAt: number;
  data: RawDay;
}

function lsSet(key: string, data: RawDay) {
  try {
    const payload: CachedDay = { savedAt: Date.now(), data };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    pruneCache();                        // dolmuşsa temizle
    try { localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data })); } catch { /* pes */ }
  }
}

function lsGet(key: string): { data: RawDay; stale: boolean } | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedDay;
    if (!parsed?.data) return null;              // eski biçim → yok say
    return { data: parsed.data, stale: Date.now() - parsed.savedAt > TTL_MS };
  } catch {
    return null;
  }
}
```

> **Önemli:** TTL dolmuş veri **atılmaz**, `stale: true` ile döner. Ağ yoksa
> eski veri hiç veri olmamasından iyidir — ama kullanıcıya söylenmelidir (Adım 5).

### Adım 4 — Önbellek temizliği

```ts
const LS_PREFIX = "ty-otd-";
const MAX_ENTRIES = 60;

function pruneCache() {
  const entries: { key: string; savedAt: number }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k?.startsWith(LS_PREFIX)) continue;
    try {
      const p = JSON.parse(localStorage.getItem(k)!) as CachedDay;
      entries.push({ key: k, savedAt: p?.savedAt ?? 0 });
    } catch {
      localStorage.removeItem(k);        // bozuk kayıt
    }
  }
  entries
    .sort((a, b) => a.savedAt - b.savedAt)          // en eski önce
    .slice(0, Math.max(0, entries.length - MAX_ENTRIES))
    .forEach((e) => localStorage.removeItem(e.key));
}
```

Bellek önbelleği için de sınır koy:

```ts
const MAX_MEM = 40;
function memSet(key: string, data: DayData) {
  if (memCache.size >= MAX_MEM) {
    memCache.delete(memCache.keys().next().value!);   // en eskisini at (FIFO)
  }
  memCache.set(key, data);
}
```

### Adım 5 — Hata türlerini ayır

```ts
export type DayErrorKind = "network" | "notfound" | "ratelimit" | "server" | "unknown";

export interface DayError {
  kind: DayErrorKind;
  message: string;      // kullanıcıya gösterilecek Türkçe metin
  retryable: boolean;
}
```

`load()` içinde HTTP durum koduna göre sınıflandır:

| Durum | `kind` | Kullanıcı mesajı | Tekrar denenebilir |
|---|---|---|---|
| `fetch` hata verdi | `network` | "İnternet bağlantısı kurulamadı." | ✅ |
| 404 | `notfound` | "Bu gün için Vikipedi'de kayıt bulunamadı." | ❌ |
| 429 | `ratelimit` | "Arşiv çok yoğun. Biraz sonra tekrar deneyin." | ✅ |
| 5xx | `server` | "Vikipedi sunucusu yanıt vermiyor." | ✅ |
| diğer | `unknown` | "Beklenmeyen bir sorun oluştu." | ✅ |

`DayData` tipine ekle:

```ts
export interface DayData {
  /* ... mevcut alanlar ... */
  offline: boolean;
  stale: boolean;        // ← YENİ: TTL dolmuş önbellekten geldi
  error: DayError | null; // ← YENİ
}
```

### Adım 6 — Bayat veri uyarısını göster

`src/App.tsx` içinde, mevcut kaynak etiketinin bulunduğu yer:

```diff
 {data && !loading && (
   <span className="font-mono text-[11px] text-ink-faint">
-    {data.offline ? "çevrimdışı önbellek" : `kaynak: ${data.sources.events === "tr" ? "TR" : "EN"} Vikipedi`}
+    {data.offline
+      ? "çevrimdışı önbellek"
+      : data.stale
+        ? "önbellekten · 24 saatten eski"
+        : `kaynak: ${data.sources.events === "tr" ? "TR" : "EN"} Vikipedi`}
   </span>
 )}
```

`data.stale` durumunda etiket rengini `text-copper` yap — kullanıcı fark etsin.

### Adım 7 — Yeniden deneme (retry) — yalnızca 429 ve 5xx için

```ts
async function fetchWithRetry(url: string, signal?: AbortSignal, tries = 2): Promise<Response> {
  let last: Response | undefined;
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { signal });
    if (res.ok) return res;
    if (res.status !== 429 && res.status < 500) return res;   // kalıcı hata, deneme
    last = res;
    await new Promise((r) => setTimeout(r, 400 * (i + 1)));   // 400ms, 800ms
  }
  return last!;
}
```

> Toplam en fazla 2 deneme. Daha fazlası kullanıcıyı bekletir ve Wikimedia'yı yorar.

---

## 🚫 Kapsam Dışı

| Dokunma | Neden / Hangi talimat |
|---|---|
| Sınıflandırma (`classifyItem`, `detectDarkItem`) | T-11 |
| `buildAutoTalk` içeriği | T-11 |
| Hata **ekranı** tasarımı | T-09 (bu talimat yalnızca hata **verisini** üretir) |
| Service worker / çevrimdışı sayfa | T-08 |
| Yeni veri kaynağı (başka API) ekleme | Kapsam dışı |
| `App.tsx` içindeki `useMemo` birleştirme mantığı | Değişmemeli |

---

## ☑️ Kabul Kriterleri

- [ ] TR verisi doluyken EN isteği **atılmıyor** (Ağ sekmesinde tek istek)
- [ ] Gün değişince önceki istek `AbortController` ile iptal ediliyor
- [ ] `reqId` mekanizması kaldırıldı
- [ ] `localStorage` kayıtları `savedAt` zaman damgası taşıyor
- [ ] 24 saatten eski önbellek `stale: true` ile dönüyor ve arayüzde belirtiliyor
- [ ] `pruneCache()` çalışıyor; en fazla 60 gün kaydı tutuluyor
- [ ] `memCache` en fazla 40 kayıtta sabitleniyor
- [ ] `DayError` tipi var; 404 / 429 / 5xx / ağ hatası ayrı `kind` üretiyor
- [ ] 429 ve 5xx için en fazla 2 deneme yapılıyor, 404 için hiç denenmiyor
- [ ] `AbortError` konsola hata olarak düşmüyor
- [ ] `npm run typecheck` hatasız
- [ ] `npm run build` hatasız

---

## 🧪 Doğrulama

### 1. İstek sayısı — TR dolu bir gün

DevTools → Network → `onthisday` ile süz → `29 Ekim` gününü aç.

| Önce | Sonra |
|---|---|
| 2 istek (`/tr/`, `/en/`) | **1 istek** (`/tr/`) |

### 2. İstek iptali

Network sekmesi açıkken `SONRAKİ GÜN`'e hızlıca 5 kez bas.
En fazla 1-2 istek `pending` kalmalı, gerisi **`(canceled)`** görünmeli.
Konsolda `AbortError` **yazmamalı**.

### 3. TTL testi

1. Bir günü aç (önbelleğe yazılsın).
2. Konsolda zaman damgasını geriye al:

```js
const k = "ty-otd-tr-08-21";
const v = JSON.parse(localStorage.getItem(k));
v.savedAt = Date.now() - 25 * 3600 * 1000;
localStorage.setItem(k, JSON.stringify(v));
```

3. DevTools → Network → **Offline** işaretle → sayfayı yenile.
4. Kaynak etiketi **"önbellekten · 24 saatten eski"** göstermeli (bakır renkte).

### 4. Önbellek temizliği

```js
Object.keys(localStorage).filter(k => k.startsWith("ty-otd-")).length
```

70 gün gezindikten sonra bu sayı **60'ı geçmemeli**.

### 5. Hata sınıflandırma

| Test | Nasıl | Beklenen `kind` |
|---|---|---|
| Ağ yok | DevTools → Offline | `network` |
| 404 | `.env` ile geçersiz API tabanı ver | `notfound` veya `network` |
| 429 | DevTools → Network → İsteği engelle/override et | `ratelimit` |

### 6. Regresyon

- Çevrimdışı ekranı ve `YENİDEN DENE` düğmesi hâlâ çalışıyor
- Kaynak etiketi normal durumda `kaynak: TR Vikipedi` gösteriyor
- Tüm bölümler normal doluyor

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:**
- **Değişen dosyalar:**
- **İstek sayısı (önce / sonra):**
- **Sapmalar / notlar:**
- **Sonraki talimata not:**
