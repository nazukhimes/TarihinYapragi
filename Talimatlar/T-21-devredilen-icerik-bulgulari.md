# T-21 · Devredilen İçerik Bulguları

| Alan | Değer |
|---|---|
| **Faz** | FAZ 4 — Devir ve Temizlik |
| **Öncelik** | 🟢 Düşük |
| **Tahmini süre** | ~2 saat |
| **Bağımlılık** | Yok — bağımsız, herhangi bir sırada yapılabilir |
| **İlgili bulgu** | O-11, O-12, m-7, m-8 |
| **Durum** | ⬜ Bekliyor |

---

## 🎯 Amaç

PLAN-01'den devredilen dört küçük bulguyu kapatmak: "Bugünün anlamı" şeridindeki
çöp kayıtlar, Bilim & Keşif'teki mükerrer girdiler, yazdırma stili ve erişilemez
bir kod eşiği.

Dördü de birbirinden bağımsız; hiçbiri kullanıcıya yanlış bilgi göstermiyor ama
üçü görünür kalitesizlik yaratıyor.

---

## 📍 Mevcut Durum

### O-11 — `holidays` şablon artığı çöp kayıtlar

`src/lib/wiki.ts:271-274`:

```ts
const holidaysRaw = tr?.holidays?.length ? tr.holidays : en?.holidays || [];
const holidays: HolidayItem[] = holidaysRaw
  .filter((h) => h.text)
  .map((h, i) => ({ text: h.text!.trim(), id: `hol-${i}` }));
```

Tek süzgeç `h.text`in var olması. Sonuç ekranda:

```
BUGÜNÜN ANLAMI
◆ g
◆ t
◆ d
```

**2026-08-31 oturumunda 5 ve 16 Ağustos sayfalarında canlı gözlendi** — yani bulgu
hâlâ aynen duruyor. Kaynak Vikipedi TR'nin kendi "bugün tarihte" şablonu;
uygulamanın hatası değil ama uygulamanın süzmesi gerekiyor.

```bash
curl -s "https://api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/all/10/29"
```

### O-12 — `allScience` mükerrer ayıklaması yok

`src/hooks/useGunVerisi.ts:143-157`:

```ts
const base = (curated?.science || []).map((s) => ({ ...s, curated: true as const }));
const auto = (data?.events || [])
  .filter((e) => { const c = classifyItem(e.text); return c === "bilim" || c === "kesif"; })
  .map((e) => ({ ... }));
return [...base, ...auto].sort((a, b) => b.year - a.year);
```

`mergedEvents` (Zaman Tüneli) editör kayıtlarını `matchKeys` ile Vikipedi'nin aynı
olayına karşı ayıklıyor (`useGunVerisi.ts:82-84`):

```ts
if (cur.some((ce) => ce.matchKeys.some((k) => t.includes(trLower(k))))) return;
```

`allScience`'ta bu koruma yok — aynı bilim olayı hem editör hem otomatik kaydı
olarak iki kez listelenebiliyor.

### m-7 — yazdırma stili yok

`src/index.css`'te hiç `@media print` bloğu yok. Kullanıcı bir günü yazdırmak
isterse koyu zemin, sabit üst bar ve dekoratif katmanlar çıktıya gidiyor.

### m-8 — erişilemez eşik

`src/lib/wiki.ts` `estimateMinutes`, `n >= 460` için `3` döndürüyor. Ama
`buildAutoTalk`'ın her çağrı noktası girdiyi önce `firstSentence(…, 420)` ile
≤420 karaktere kırpıyor (420 < 460). Yani "3 dakika" dalı **hiçbir zaman
çalışmıyor.** Zararsız; yalnızca bir okuma süresi rozetini etkiliyor.

> Not: `src/lib/rekor.ts` içindeki `sureTahmini` aynı eşikleri kullanır ama oradaki
> girdi kırpılmadığı için 3 dalı **erişilebilir**. O fonksiyona dokunulmayacak.

---

## ✅ Yapılacaklar

1. **`holidays` süzgecini sıkılaştır** (`wiki.ts:271-274`). İki kural:
   - `pages[].namespace.id !== 0` olan kayıtlar atılır (şablon/kategori uzayı,
     madde uzayı değil).
   - Kırpılmış metni **2 karakterden kısa** olan kayıtlar atılır.

   Süzgeç ayrı bir saf fonksiyona alınır (`gecerliHolidayMi`) ki test edilebilsin.

2. **`allScience`'a `matchKeys` koruması ekle** (`useGunVerisi.ts:143-157`).
   `mergedEvents`'teki korumanın **aynısı** kullanılır:
   ```ts
   const cur = curated?.science || [];
   // ... auto üretiminde:
   if (cur.some((cs) => /* matchKeys eşleşmesi */)) return;
   ```
   `ScienceMilestone` tipinde `matchKeys` alanı yok — eklenmesi gerekir
   (isteğe bağlı alan, mevcut kayıtları bozmaz).

3. **`@media print` bloğu ekle** (`src/index.css`, m-7):
   - Zemin beyaz, metin siyah
   - Üst bar, bölüm navigasyonu, `glowfield` / `gridlines` / `noise` / `scanlines`
     katmanları gizlenir
   - `content-visibility: auto` yazdırmada iptal edilir (yoksa ekran dışı bölümler
     boş basılır — **bu tuzağa dikkat**)
   - Bağlantı adresleri `a[href]::after` ile görünür kılınır

4. **m-8'i kapat.** İki yoldan biri seçilir ve gerekçesi kayda yazılır:
   - `firstSentence` kırpma sınırını yükseltmek, **veya**
   - `estimateMinutes` eşiklerini gerçek girdi aralığına göre yeniden ayarlamak

   Ölü kod bırakılmaz.

5. **Test ekle:** `gecerliHolidayMi` için (tek harf, namespace ≠ 0, geçerli kayıt)
   ve `allScience` mükerrer ayıklaması için birer test.

---

## 🚫 Kapsam Dışı

| Konu | Hangi talimata ait |
|---|---|
| `excerpt` → `extract` | **T-16** |
| Karanlık dosya rozetleri | **T-17** |
| `src/lib/rekor.ts` içindeki `sureTahmini` | **Hiçbiri — dokunulmayacak** (eşikleri erişilebilir) |
| Editör içeriğinin genişletilmesi | Plan §2 — kapsam dışı |
| `react-router` yükseltmesi | **T-22** |

---

## ☑️ Kabul Kriterleri

- [ ] "Bugünün anlamı" şeridinde tek harflik kayıt yok (29 Ekim'de doğrulanır)
- [ ] `gecerliHolidayMi` saf fonksiyon olarak ayrılmış ve test edilmiş
- [ ] Aynı bilim olayı Bilim & Keşif'te iki kez listelenmiyor
- [ ] `Ctrl+P` önizlemesi okunabilir: beyaz zemin, dekor yok, bölümler dolu basılıyor
- [ ] `estimateMinutes`'ın hiçbir dalı erişilemez değil
- [ ] `npm run kontrol` yeşil

---

## 🧪 Doğrulama

**O-11 — ham veriyi görün:**

```bash
curl -s "https://api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/all/10/29"
```

Tek harflik `holidays` kayıtlarının API'de olduğunu, ekranda **olmadığını** doğrulayın.

**m-7 — yazdırma önizlemesi:** Tarayıcıda `Ctrl+P`. Özellikle **tüm bölümlerin
dolu basıldığını** kontrol edin; `content-visibility: auto` yazdırmada iptal
edilmezse ekran dışı bölümler boş çıkar.

**Tarayıcıda (üç gün):**

| Gün | Beklenen |
|---|---|
| **29 Ekim** | "Bugünün anlamı" temiz; Bilim & Keşif'te mükerrer yok |
| **7 Mart** | Şerit ya dolu ya hiç yok — çöp kayıt yok |
| **29 Şubat** | Yazdırma önizlemesi bozulmuyor |

```bash
npm run kontrol
```

---

## 📝 Tamamlanma Kaydı

> Talimat bitince doldurulur.

- **Tamamlanma tarihi:**
- **Değişen dosyalar:**
- **m-8 için seçilen yol ve gerekçesi:**
- **Elenen holiday kaydı sayısı (örnek bir günde):**
- **Sapmalar / notlar:**
- **Sonraki talimata not:**
