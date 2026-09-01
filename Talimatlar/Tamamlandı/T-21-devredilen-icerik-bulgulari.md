# T-21 · Devredilen İçerik Bulguları

| Alan             | Değer                                           |
| ---------------- | ----------------------------------------------- |
| **Faz**          | FAZ 4 — Devir ve Temizlik                       |
| **Öncelik**      | 🟢 Düşük                                        |
| **Tahmini süre** | ~2 saat                                         |
| **Bağımlılık**   | Yok — bağımsız, herhangi bir sırada yapılabilir |
| **İlgili bulgu** | O-11, O-12, m-7, m-8                            |
| **Durum**        | ✅ Tamamlandı — 2026-09-01                      |

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

| Konu                                      | Hangi talimata ait                                   |
| ----------------------------------------- | ---------------------------------------------------- |
| `excerpt` → `extract`                     | **T-16**                                             |
| Karanlık dosya rozetleri                  | **T-17**                                             |
| `src/lib/rekor.ts` içindeki `sureTahmini` | **Hiçbiri — dokunulmayacak** (eşikleri erişilebilir) |
| Editör içeriğinin genişletilmesi          | Plan §2 — kapsam dışı                                |
| `react-router` yükseltmesi                | **T-22**                                             |

---

## ☑️ Kabul Kriterleri

- [x] "Bugünün anlamı" şeridinde tek harflik kayıt yok (29 Ekim'de doğrulandı:
      5 kayıttan 3'ü elendi, "Cumhuriyet Bayramı" ve "Kızılay Haftası" kaldı)
- [x] `gecerliHolidayMi` saf fonksiyon olarak ayrılmış ve test edilmiş (9 test,
      fixture 29 Ekim'in canlı yanıtı)
- [x] Aynı bilim olayı Bilim & Keşif'te iki kez listelenmiyor (60 gün ölçüldü:
      22 mükerrerin 22'si elendi, fazla eleme 0; 4 Ekim'de tarayıcıda doğrulandı)
- [x] `Ctrl+P` önizlemesi okunabilir: beyaz zemin, dekor yok, bölümler dolu basılıyor
      (yedi bölümün de `content-visibility` değeri `visible`, boş bölüm yok)
- [x] `estimateMinutes`'ın hiçbir dalı erişilemez değil (eski eşikle 3 test kırmızı)
- [x] `npm run kontrol` yeşil (399 test, 0 hata)

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

| Gün          | Beklenen                                              |
| ------------ | ----------------------------------------------------- |
| **29 Ekim**  | "Bugünün anlamı" temiz; Bilim & Keşif'te mükerrer yok |
| **7 Mart**   | Şerit ya dolu ya hiç yok — çöp kayıt yok              |
| **29 Şubat** | Yazdırma önizlemesi bozulmuyor                        |

```bash
npm run kontrol
```

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-09-01

- **Değişen dosyalar:**
  - `src/lib/wiki.ts` — `gecerliHolidayMi` + `MIN_HOLIDAY_UZUNLUK`, `WikiPage.namespace`,
    `RawHoliday` dışa aktarımı, `estimateMinutes` yeniden eşiklendi ve dışa aktarıldı,
    `GOVDE_MAX` sabiti
  - `src/lib/wiki.test.ts` — `gecerliHolidayMi` (9 test) ve `estimateMinutes` (7 test)
  - `src/lib/__fixtures__/otd-tr-10-29-holidays.json` — **yeni**, 29 Ekim'in canlı
    `holidays` dizisi (5 kayıt, hiçbir alan silinmedi)
  - `src/hooks/useGunVerisi.ts` — `allScience`'a `matchKeys` koruması
  - `src/hooks/useGunVerisi.test.ts` — **yeni**, mükerrer ayıklama (4 test)
  - `src/data/types.ts` — `ScienceMilestone.matchKeys?`
  - `src/data/gunler/*.ts` — 12 dosya, 22 kayda `matchKeys` yazıldı
  - `src/data/data.test.ts` — science `matchKeys` biçim testi
  - `src/index.css` — `@media print` bloğu genişletildi

- **m-8 için seçilen yol ve gerekçesi:** **Eşikler gerçek girdi aralığına çekildi**
  (kırpma sınırı yükseltilmedi). 420 kart düzeninin taşıyabildiği uzunluk, yani bir
  ürün kararı; onu bir rozet uğruna büyütmek görünen metni uzatır ve düzeni bozardı.
  Rozet ise yalnızca gösterge — girdiye uyması gereken taraf o. Alt eşik 240'ta
  bırakıldı (kısa kartların rozeti değişmesin), üst eşik kalan aralığın ortasına
  çekildi: `(240 + 420) / 2 = 330`. İki sayı artık `GOVDE_MAX` üzerinden birbirine
  bağlı; eskiden 420 ile 460 bağımsızdı ve sessizce ayrışmışlardı. Üç dal da
  erişilebilir — eski eşikle üç test kırmızıya dönüyor (doğrulandı).
  `src/lib/rekor.ts`'teki `sureTahmini`'ye dokunulmadı.

- **Elenen holiday kaydı sayısı (örnek bir günde):** 29 Ekim'de **5 kayıttan 3'ü**
  elendi (`g`, `t`, `d`), 2 gerçek tatil kaldı. Canlı olarak ölçülen diğer günler:
  7 Mart 7→4, 5 Ağustos 3→0, 16 Ağustos 4→1, 29 Şubat 1→1.

- **Sapmalar / notlar:**
  1. **m-7 kısmen yapılmıştı.** Talimat "`src/index.css`'te hiç `@media print` bloğu
     yok" diyor; aslında 12 satırlık bir blok vardı (`.reveal`, `noise`/`gridlines`/
     `ticker-track`/`scanlines` gizleme, `header`/`nav` için `position: static`).
     Yeni blok yazmak yerine mevcut blok genişletildi.
  2. **`content-visibility` tuzağı ölçülerek doğrulandı.** Yazdırma kuralları
     kapalıyken ekran dışı yedi bölümün de yüksekliği `contain-intrinsic-size`
     yer tutucusuna, yani **800 px**'e düşüyor; kural açıkken gerçek yüksekliklerine
     (18542 / 1171 / 1039 / 2186 / 1756 / 2004 / 6332 px) çıkıyor. Tuzak gerçek.
  3. **`.outline-num` de gizlendi** (talimatın listesinde yoktu). Açılıştaki "dev
     ambiyans yılları" ve bilim kartlarındaki yıl filigranı metnin üstüne biniyor;
     ayrıca toplu `color: #000` kuralı onları kâğıtta simsiyah/kapkalın basardı.
     Bilim kartındaki yıl zaten kartın içinde yazıyla da geçiyor.
  4. **O-12 için `matchKeys` yazmak zorunluydu.** Yalnızca alanı eklemek kabul
     kriterini karşılamıyordu: hiçbir kayıtta anahtar olmayınca koruma hiç çalışmaz.
     Mükerrerlik **ölçüldü** — editör bilim kaydı olan 60 günün canlı Vikipedi
     yanıtı çekilip `classifyItem` ile süzüldü: **22 gerçek mükerrer**. Anahtarlar
     editör başlığından değil **API metninden** seçildi (API "Aleksey Leonov" der,
     editör "Alexei"; API "Mariner-2", editör "Mariner 2"). Doğrulama betiği:
     22/22 elendi, **fazla eleme 0**, kalan aynı-yıl çakışması 0.
  5. **29 Ekim'de ARPANET mükerrer DEĞİL.** Vikipedi'nin 1969 ARPANET metnini
     `classifyItem` "genel" sayıyor, yani Bilim & Keşif'e hiç girmiyor. O günkü
     doğrulama bu yüzden 4 Ekim (Sputnik) üzerinden de yapıldı — orada koruma
     gerçekten devreye giriyor.
  6. Vikipedi API'si 60 günü hızlı çekerken hız sınırına takıldı (35 yanıt hata
     metni döndü); istekler 6 saniye arayla tekrarlandı.

- **Sonraki talimata not:**
  - **`holidays` dil seçimi süzgeçten ÖNCE yapılıyor** (`wiki.ts`,
    `tr?.holidays?.length ? tr.holidays : en?.holidays`). 5 Ağustos gibi TR listesi
    **yalnızca çöpten** ibaret olan günlerde liste dolu sayılıp EN'e düşülmüyor;
    süzgeçten sonra şerit boş kalıyor. Kabul kriteri bunu ("ya dolu ya hiç yok")
    karşılıyor, o yüzden kapsam genişletilmedi. Düzeltilecekse dikkat: `events`/
    `births`/`deaths` için EN yedeği dil rozetiyle gösteriliyor, `holidays` içinse
    `sources` kaydı yok — İngilizce metin Türkçe şeride rozetsiz girer.
  - `ScienceMilestone.matchKeys` **isteğe bağlı** kalsın: yalnızca Vikipedi'de
    gerçekten otomatik karşılığı çıkan kayıtlara yazılır. Zorunlu yapmak, karşılığı
    olmayan 45 kayda uydurma anahtar yazdırır.
  - Yazdırma bloğu `@media print` içinde; ekranda denemek için bloğu geçici olarak
    `@media screen` yapıp sayfayı yeniden yüklemek en sadık yöntem (CSSOM'dan
    kural enjekte etmek düzeni oturmuş sayfada boyama artığı bırakıyor).
