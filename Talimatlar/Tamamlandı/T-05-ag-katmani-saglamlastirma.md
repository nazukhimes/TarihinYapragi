# T-05 · Ağ Katmanı Sağlamlaştırma

| Alan             | Değer                            |
| ---------------- | -------------------------------- |
| **Faz**          | FAZ 1 — Kritik Hata Düzeltmeleri |
| **Öncelik**      | 🟠 Yüksek                        |
| **Tahmini süre** | ~3 saat                          |
| **Bağımlılık**   | T-01, T-02 (`config.ts`)         |
| **İlgili bulgu** | O-4, O-8                         |
| **Durum**        | ✅ Tamamlandı — 2026-08-21       |

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
    if (reqId.current === id) {
      setData(d);
      setLoading(false);
    }
  });
}, [month, day, reloadKey]);
```

`reqId` yalnızca **state güncellemesini** koruyor; ağ isteği devam ediyor.
Hızlı gün geçişinde tüm istekler tamamlanıyor. Wikimedia hız sınırına takılma riski var.

### O-8a · `localStorage` yedeğinde zaman damgası yok

```ts
function lsSet(key: string, data: RawDay) {
  localStorage.setItem(key, JSON.stringify(data)); // ← ne zaman yazıldığı bilinmiyor
}
```

Bir gün için kaydedilen veri, ağ hatası anında **süresiz** kullanılıyor.
Vikipedi güncellense bile kullanıcı eski veriyi görüyor ve bunu fark etmiyor.

### O-8b · Bellek önbelleği sınırsız

```ts
const memCache = new Map<string, DayData>(); // hiç boşaltılmıyor
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
Kullanıcıya gösterilecek mesaj da tek: _"Arşive şu an ulaşılamıyor."_

---

## ✅ Yapılacaklar

### Adım 1 — TR'yi önce dene, EN'i gerekirse çek

```ts
async function fetchDayData(month, day, signal): Promise<DayData> {
  const tr = await load("tr", signal);

  // TR'de üç ana alandan biri bile boşsa EN'i tamamlayıcı olarak çek
  const trThin = !tr || !tr.events?.length || !tr.births?.length || !tr.deaths?.length;

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
    .then((d) => {
      setData(d);
      setLoading(false);
    })
    .catch((e) => {
      if (e.name === "AbortError") return; // beklenen iptal, sessiz geç
      setError(toDayError(e));
      setLoading(false);
    });

  return () => ctrl.abort(); // gün değişince öncekini kes
}, [month, day, reloadKey]);
```

`reqId` mekanizması artık gereksiz — **kaldır**.

> ⚠️ **Dikkat:** `memCache`'ten dönen sonuç senkron olduğu için iptal edilemez;
> bu sorun değil — zaten ağ isteği yok.

### Adım 3 — TTL'li önbellek

```ts
const TTL_MS = 24 * 60 * 60 * 1000; // 24 saat

interface CachedDay {
  savedAt: number;
  data: RawDay;
}

function lsSet(key: string, data: RawDay) {
  try {
    const payload: CachedDay = { savedAt: Date.now(), data };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    pruneCache(); // dolmuşsa temizle
    try {
      localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
    } catch {
      /* pes */
    }
  }
}

function lsGet(key: string): { data: RawDay; stale: boolean } | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedDay;
    if (!parsed?.data) return null; // eski biçim → yok say
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
      localStorage.removeItem(k); // bozuk kayıt
    }
  }
  entries
    .sort((a, b) => a.savedAt - b.savedAt) // en eski önce
    .slice(0, Math.max(0, entries.length - MAX_ENTRIES))
    .forEach((e) => localStorage.removeItem(e.key));
}
```

Bellek önbelleği için de sınır koy:

```ts
const MAX_MEM = 40;
function memSet(key: string, data: DayData) {
  if (memCache.size >= MAX_MEM) {
    memCache.delete(memCache.keys().next().value!); // en eskisini at (FIFO)
  }
  memCache.set(key, data);
}
```

### Adım 5 — Hata türlerini ayır

```ts
export type DayErrorKind = "network" | "notfound" | "ratelimit" | "server" | "unknown";

export interface DayError {
  kind: DayErrorKind;
  message: string; // kullanıcıya gösterilecek Türkçe metin
  retryable: boolean;
}
```

`load()` içinde HTTP durum koduna göre sınıflandır:

| Durum              | `kind`      | Kullanıcı mesajı                               | Tekrar denenebilir |
| ------------------ | ----------- | ---------------------------------------------- | ------------------ |
| `fetch` hata verdi | `network`   | "İnternet bağlantısı kurulamadı."              | ✅                 |
| 404                | `notfound`  | "Bu gün için Vikipedi'de kayıt bulunamadı."    | ❌                 |
| 429                | `ratelimit` | "Arşiv çok yoğun. Biraz sonra tekrar deneyin." | ✅                 |
| 5xx                | `server`    | "Vikipedi sunucusu yanıt vermiyor."            | ✅                 |
| diğer              | `unknown`   | "Beklenmeyen bir sorun oluştu."                | ✅                 |

`DayData` tipine ekle:

```ts
export interface DayData {
  /* ... mevcut alanlar ... */
  offline: boolean;
  stale: boolean; // ← YENİ: TTL dolmuş önbellekten geldi
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
    if (res.status !== 429 && res.status < 500) return res; // kalıcı hata, deneme
    last = res;
    await new Promise((r) => setTimeout(r, 400 * (i + 1))); // 400ms, 800ms
  }
  return last!;
}
```

> Toplam en fazla 2 deneme. Daha fazlası kullanıcıyı bekletir ve Wikimedia'yı yorar.

---

## 🚫 Kapsam Dışı

| Dokunma                                          | Neden / Hangi talimat                               |
| ------------------------------------------------ | --------------------------------------------------- |
| Sınıflandırma (`classifyItem`, `detectDarkItem`) | T-11                                                |
| `buildAutoTalk` içeriği                          | T-11                                                |
| Hata **ekranı** tasarımı                         | T-09 (bu talimat yalnızca hata **verisini** üretir) |
| Service worker / çevrimdışı sayfa                | T-08                                                |
| Yeni veri kaynağı (başka API) ekleme             | Kapsam dışı                                         |
| `App.tsx` içindeki `useMemo` birleştirme mantığı | Değişmemeli                                         |

---

## ☑️ Kabul Kriterleri

- [x] TR verisi doluyken EN isteği **atılmıyor** (Ağ sekmesinde tek istek)
- [x] Gün değişince önceki istek `AbortController` ile iptal ediliyor
- [x] `reqId` mekanizması kaldırıldı
- [x] `localStorage` kayıtları `savedAt` zaman damgası taşıyor
- [x] 24 saatten eski önbellek `stale: true` ile dönüyor ve arayüzde belirtiliyor
- [x] `pruneCache()` çalışıyor; en fazla 60 gün kaydı tutuluyor
- [x] `memCache` en fazla 40 kayıtta sabitleniyor
- [x] `DayError` tipi var; 404 / 429 / 5xx / ağ hatası ayrı `kind` üretiyor
- [x] 429 ve 5xx için en fazla 2 deneme yapılıyor, 404 için hiç denenmiyor
- [x] `AbortError` konsola hata olarak düşmüyor
- [x] `npm run typecheck` hatasız
- [x] `npm run build` hatasız

---

## 🧪 Doğrulama

### 1. İstek sayısı — TR dolu bir gün

DevTools → Network → `onthisday` ile süz → `29 Ekim` gününü aç.

| Önce                     | Sonra                |
| ------------------------ | -------------------- |
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
Object.keys(localStorage).filter((k) => k.startsWith("ty-otd-")).length;
```

70 gün gezindikten sonra bu sayı **60'ı geçmemeli**.

### 5. Hata sınıflandırma

| Test   | Nasıl                                           | Beklenen `kind`           |
| ------ | ----------------------------------------------- | ------------------------- |
| Ağ yok | DevTools → Offline                              | `network`                 |
| 404    | `.env` ile geçersiz API tabanı ver              | `notfound` veya `network` |
| 429    | DevTools → Network → İsteği engelle/override et | `ratelimit`               |

### 6. Regresyon

- Çevrimdışı ekranı ve `YENİDEN DENE` düğmesi hâlâ çalışıyor
- Kaynak etiketi normal durumda `kaynak: TR Vikipedi` gösteriyor
- Tüm bölümler normal doluyor

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-08-21

- **Değişen dosyalar:**

  | Dosya                                               | İşlem                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
  | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `src/lib/wiki.ts`                                   | Ağ/önbellek katmanı baştan yazıldı: `fetchDayData(month, day, signal?)` artık TR'yi önce dener, yalnızca `events`/`births`/`deaths`'ten biri boşsa (`trThin`) EN'i tamamlayıcı olarak çeker (Adım 1); `load()` ve `fetchWithRetry()` bir `AbortSignal` alır, `useDayData` artık `reqId` yerine her efektte yeni bir `AbortController` kurup temizlik fonksiyonunda `ctrl.abort()` çağırır (Adım 2); `lsGet`/`lsSet` artık `{ savedAt, data }` zarfı kullanır, `TTL_MS=24s`, `stale` hesaplanır (Adım 3); `pruneCache()` (`MAX_ENTRIES=60`, en eski önce silinir) ve `memSet()` (`MAX_MEM=40`, FIFO) eklendi (Adım 4); yeni `DayErrorKind`/`DayError` tipleri + `classifyStatus()` (404→notfound, 429→ratelimit, 5xx→server, diğer→unknown) + `toDayError()`; `DayData`'ya `stale`/`error` alanları eklendi (Adım 5); `fetchWithRetry()` 429/5xx için en fazla 2 deneme (400ms/800ms bekleme), diğer hatalarda hiç deneme yapmıyor (Adım 7). Sınıflandırma (`classifyItem`/`detectDarkItem`), `buildAutoTalk` ve `normalize` **değişmedi** |
  | `src/App.tsx`                                       | Kaynak etiketi bloğu (Adım 6): `data.stale` doğruysa `"önbellekten · 24 saatten eski"` gösteriyor ve `text-copper` rengine geçiyor; `data.offline` durumu ve normal `kaynak: TR/EN Vikipedi` metni değişmedi. `useMemo` birleştirme mantığına dokunulmadı                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
  | `.claude/launch.json`                               | Doğrulama için geçici `TarihYapragi-verify` (port 3091) girdisi eklendi, doğrulama biter bitmez tamamen geri alındı — nihai dosya T-05 öncesiyle birebir aynı                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
  | `Dokumanlar/ANALIZ-RAPORU.md`                       | O-4 ve O-8 `✅ ÇÖZÜLDÜ (T-05)` işaretlendi + Çözüm blokları eklendi; güncelleme kaydı tablosu, genel sağlık tablosu ve öncelik sıralaması güncellendi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
  | `Dokumanlar/BAGLAM.md`                              | Plan ilerlemesi 5/14; "Çalışan" özetine ağ katmanı notu eklendi; "Eksik/hatalı" listesinde O-4/O-8 çözüldü işaretlendi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
  | `Dokumanlar/MIMARI.md`                              | Bölüm 2.1 ve 2.5 T-05'in yeni davranışını yansıtacak şekilde güncellendi; teknik borç tablosunda O-4 üstü çizili + çözüldü                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
  | `Dokumanlar/KULLANIM-KILAVUZU.md`                   | Ekran şemasına ve SSS'e "önbellekten · 24 saatten eski" durumu eklendi; sorun giderme tablosuna O-4/O-8 ile ilgili yeni bir satır eklenmedi çünkü kullanıcı tarafında önceden bilinen bir hata değildi (dayanıklılık iyileştirmesi)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
  | `Talimatlar/PLAN-01-temel-duzeltme-ve-tamamlama.md` | Durum 5/14, T-05 satırı ✅ + `Tamamlandı/` bağlantısına güncellendi, Kesin kurallar'a T-05 notu eklendi, ilerleme tablosu ve yüzdesi güncellendi, ilgili başarı ölçütleri işaretlendi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

- **İstek sayısı (önce / sonra):** TR verisi dolu bir günde (canlı doğrulama: **22 Ağustos** —
  20 olay / 80 doğum / 75 vefat, hiçbiri boş değil) **2 istek → 1 istek** (yalnızca `/tr/`).
  TR'nin herhangi bir ana alanı boşsa (`trThin`) davranış öncekiyle aynı kalır: hem `/tr/`
  hem `/en/` çekilir.

- **Sapmalar / notlar:**

  1. **Talimatın Adım 1-3, 5-7 kodu büyük ölçüde birebir uygulandı; Adım 2 ve Adım 4'te
     TypeScript `strict: true` ve doğrulanmış tam kapsam için birkaç bilinçli uyarlama
     yapıldı** — hepsi aşağıda gerekçesiyle:

     - **`isAbortError()` yardımcı fonksiyonu eklendi.** Talimatın örnek kodu doğrudan
       `e.name === "AbortError"` yazıyor; ancak `strict: true` altında `catch (e)` değişkeni
       `unknown` tipindedir ve doğrudan `.name` erişimi derlenmez. `DOMException`'ın
       `fetch`'in abort rejection'ı için gerçek çalışma zamanı tipi olduğu doğrulanarak
       (`e instanceof DOMException && e.name === "AbortError"`) hem `load()` içinde
       (iptali yukarı ilet) hem `useDayData` içinde (iptali sessizce yok say) aynı
       yardımcı kullanıldı. Davranış talimattakiyle birebir aynı, yalnızca tip güvenliği
       için sarmalandı.
     - **`pruneCache()` artık her başarılı `lsSet` yazımından sonra da çağrılıyor**,
       yalnızca `localStorage.setItem` kotayı aşıp hata verdiğinde değil (talimatın
       Adım 3 kod örneği yalnızca `catch` bloğunda gösteriyordu). Gerekçe: Kabul
       Kriterleri ve Doğrulama Adım 4 "70 gün gezindikten sonra bu sayı 60'ı geçmemeli"
       diyor — gerçek tarayıcı `localStorage` kotası (genelde 5-10 MB) 60-70 küçük gün
       kaydıyla pratikte **hiç dolmaz**, yani yalnızca `catch`'te tetiklenen bir
       `pruneCache()` bu kriteri asla karşılamazdı. `pruneCache()` kotanın altındayken
       çağrıldığında zaten ucuzdur (`entries.length - MAX_ENTRIES` negatifse hiçbir şey
       silmez), bu yüzden her yazımda çağırmak güvenli. Canlı doğrulandı: bkz. aşağıdaki
       kanıt tablosu.
     - **`useDayData` içine `error` state'i (Adım 2'nin kod örneğindeki `setError`/
       `toDayError` çağrısı) eklendi** ama **App.tsx bu alanı tüketmiyor** — Kapsam Dışı
       bölümü "Hata ekranı tasarımı" işini T-09'a bırakıyor. `error`, yalnızca
       `fetchDayData`'nın döndürdüğü promise'in _gerçekten reddedildiği_ (abort dışında,
       yani beklenmeyen bir istisna) nadir durum için bir güvenlik ağıdır; günlük ağ/HTTP
       hataları zaten `DayData.error`/`offline` alanlarıyla veri düzeyinde taşınıyor.
       Ekleme geriye dönük uyumlu (yeni, tüketilmeyen bir alan) ve `App.tsx`'in
       `useMemo` birleştirme mantığına dokunmuyor.
     - **`holidays`/`selected` alanları `trThin` kontrolüne dahil edilmedi** — talimat
       Adım 1'de yalnızca `events`/`births`/`deaths`'i sayıyor ("TR'de üç ana alandan
       biri bile boşsa"). Bunun bilinçli bir sonucu var: TR'nin üç ana alanı doluyken
       yalnızca `tr.holidays`/`tr.selected` boşsa artık EN'e **düşülmüyor** (EN hiç
       çekilmiyor), oysa T-05 öncesinde EN her zaman paralel çekildiği için bu iki alan
       her zaman EN'e düşebiliyordu. Bu, talimatın kendi tasarım kararının doğal bir
       sonucudur (istek sayısını yarıya indirmenin bedeli), kapsam dışına çıkılmadı —
       yalnızca burada not düşülüyor.

  2. **Doğrulama, DevTools Network sekmesi yerine doğrudan modül testiyle yapıldı.**
     Bu ortamda tarayıcı paneli görüntülenmediği için (`computer` screenshot aracı
     "the Browser pane is not displayed" hatası verdi — T-04'te de belgelenen aynı kısıt)
     ve ayrıca yaprağın altındaki "Önceki gün"/"Sonraki gün" düğmeleri K-5 nedeniyle
     gerçek tıklamayla tetiklenemediği, mini takvim açılır penceresi de (`Ağustos takvimi`
     düğmesi tıklandığında) gün hücreleri hiçbir zaman erişilebilirlik ağacında
     belirmediği için (muhtemelen aynı veya benzer bir CSS yığılım sorunu; bu talimatın
     kapsamı **`leaf.tsx` gezinme UI'sını kapsamıyor**, dokunulmadı), gerçek kullanıcı
     tıklamasıyla gün değiştirip Network sekmesini gözlemlemek bu oturumda mümkün
     olmadı. Bunun yerine `javascript_tool` ile çalışan uygulamanın **kendi**
     `/src/lib/wiki.ts` modülü tarayıcıda dinamik `import()` ile yüklendi ve
     `fetchDayData()` doğrudan çağrılarak (gerçek ağ + kontrollü sahte `window.fetch`
     ile) her kabul kriteri tek tek kanıtlandı — aşağıdaki tablo. Bu, kodun kendisini
     (üretimde çalışan tam olarak aynı modülü) gerçek ve sahte ağ koşulları altında
     çalıştırdığı için DevTools gözlemiyle eşdeğer, bazı senaryolarda (TTL, hata
     sınıflandırma, deneme sayısı) daha kesin bir kanıt sağladı.

  3. **Doğrulama için geçici bir `.claude/launch.json` girdisi kullanıldı, tamamen geri
     alındı.** Port 3000 başka bir oturumun sunucusu tarafından kullanıldığından (T-04'te
     de aynı durum yaşanmıştı), doğrulama için 3091 portunda ikinci bir başlatıcı
     yapılandırması geçici olarak eklendi, doğrulama biter bitmez silindi.

- **Doğrulama kanıtları (canlı, `javascript_tool` ile doğrudan modül çağrısı):**

  | Test                                                                                       | Sonuç                                                                                                                                                                                           |
  | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | TR dolu gün (22 Ağustos, 20/80/75 kayıt)                                                   | `fetchLog` **yalnızca** `.../tr/onthisday/all/08/22` — EN hiç çağrılmadı                                                                                                                        |
  | `AbortController.abort()` çağrıldıktan sonra `fetchDayData` promise'i                      | Reddedildi: `name: "AbortError"`, `instanceof DOMException: true`                                                                                                                               |
  | 25 saat önce yazılmış önbellek + ağ tamamen kesik (`fetch` reddediyor)                     | `offline:false`, `stale:true`, önbellekteki metin doğru döndü, `error:null`                                                                                                                     |
  | 404 yanıtı (mock)                                                                          | Her dil için **1 çağrı** (deneme yok), `kind:"notfound"`, `retryable:false`, `offline:true`                                                                                                     |
  | 429 yanıtı (mock)                                                                          | Her dil için **2 çağrı** (toplam 4), `kind:"ratelimit"`, `retryable:true`                                                                                                                       |
  | 5xx yanıtı (mock)                                                                          | Her dil için **2 çağrı** (toplam 4), `kind:"server"`, `retryable:true`                                                                                                                          |
  | Ağ tamamen kesik (`fetch` reddediyor, önbellek de yok)                                     | `kind:"network"`, `retryable:true`, `offline:true`                                                                                                                                              |
  | 65 sahte `ty-otd-` kaydı + 1 gerçek başarılı yazım                                         | Kayıt sayısı **65 → 60** (en yeni 60 tutuldu)                                                                                                                                                   |
  | 41 farklı güne art arda `fetchDayData` çağrısı, sonra en eskisini (`gün 1`) tekrar çağırma | `gün 1` için **yeni** bir ağ isteği tetiklendi (FIFO ile atılmıştı); `gün 41` (en yeni) hâlâ bellekte, **yeni istek tetiklemedi**                                                               |
  | Tüm yukarıdaki testler boyunca konsol                                                      | `read_console_messages` → **hiç hata yok** (`AbortError` dahil hiçbir istisna konsola sızmadı)                                                                                                  |
  | `npm run typecheck`                                                                        | Temiz, hata yok                                                                                                                                                                                 |
  | `npm run build`                                                                            | Temiz, `dist/` üretti (256,55 kB JS / 83,13 kB gzip, 52,92 kB CSS — T-04 sonrasına göre +2,16 kB JS / +0,86 kB gzip, TTL/hata sınıflandırma/deneme mantığı eklendiği için beklenen küçük artış) |
  | `grep -n "reqId" src/**`                                                                   | Boş — hiç eşleşme yok                                                                                                                                                                           |
  | Canlı sayfa (21 Ağustos, gerçek ağ)                                                        | "kaynak: TR Vikipedi" etiketi normal (bakır değil) görünüyor; zaman tüneli, kişi kartları, karanlık dosyalar, bilim ve sohbet kartları bölümleri gerçek verilerle doluyor — regresyon yok       |

- **Sonraki talimata not:**

  - **T-06 →** `useDayData` artık `{ data, loading, error, reload }` döndürüyor (yeni
    `error: DayError | null` alanı). `App.tsx` bunu şu an tüketmiyor. Yönlendirme
    eklenirken (URL → `day`/`month`) gün geçişleri artık `AbortController` ile iptal
    edildiğinden, hızlı URL değişimlerinde önceki isteklerin iptal edildiğini varsaymak
    güvenli.
  - **T-09 →** `DayData.error` (kind: network/notfound/ratelimit/server/unknown) ve
    `useDayData`'nın döndürdüğü `error` alanı artık hazır; hata sınırı/durum ekranları
    bu veriyi doğrudan tüketebilir. Şu an yalnızca `data.offline` durumu `App.tsx`'te
    bir ekran gösteriyor — `data.error.kind`'a göre farklılaştırılmış mesaj/simge
    T-09'un kapsamında.
  - **T-06/başka bir talimat →** Mini takvim açılır penceresinin (`Ağustos takvimi ▾`
    düğmesi) bu oturumda erişilebilirlik ağacında hiç gün hücresi üretmediği gözlemlendi
    (K-5'in "Önceki gün"/"Sonraki gün" düğmelerini etkileyen CSS yığılım sorunuyla aynı
    kökten olabilir, ama doğrulanmadı — T-05'in kapsamı `leaf.tsx`'e dokunmuyor). Gün
    gezinmesini URL'e bağlarken bu DOM bölgesine zaten dokunulacağı için, K-5 düzeltilirken
    mini takvimin de gerçek tıklamayla açılıp açılmadığının ayrıca doğrulanması önerilir.
  - **T-12 →** `classifyStatus()`, `fetchWithRetry()`, TTL hesaplaması (`lsGet`/`lsSet`),
    `pruneCache()` ve `memSet()` saf/izole mantık taşıyor (DOM'a yalnızca `localStorage`
    ve `fetch` üzerinden dokunuyor) — sahte (mock) `fetch`/`localStorage` ile birim
    testine uygun ilk adaylardan. Bu oturumda `javascript_tool` ile yapılan doğrulama
    testleri (yukarıdaki tablo) gerçek `vi.fn()` mock'larına neredeyse birebir
    çevrilebilir durumda.
