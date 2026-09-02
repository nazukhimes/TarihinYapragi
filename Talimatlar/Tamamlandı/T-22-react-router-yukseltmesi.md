# T-22 · `react-router` Güvenlik Yükseltmesi (6 → 7)

| Alan             | Değer                                         |
| ---------------- | --------------------------------------------- |
| **Faz**          | FAZ 4 — Devir ve Temizlik                     |
| **Öncelik**      | 🟢 Düşük (güvenlik: orta)                     |
| **Tahmini süre** | ~2 saat                                       |
| **Bağımlılık**   | Yok — ama **planın EN SONUNA bırakılmalıdır** |
| **İlgili bulgu** | O-13                                          |
| **Durum**        | ✅ Tamamlandı — 2026-09-02                    |

> ⚠️ **Bu kırıcı bir yükseltmedir ve bilerek en sona bırakılmıştır.** Yönlendirme
> katmanı kırılırsa diğer altı talimatın görsel doğrulaması bulanır — hangi
> değişikliğin neyi bozduğu ayırt edilemez.

---

## 🎯 Amaç

`react-router`'daki iki orta seviye güvenlik danışma kaydını kapatmak ve
uygulamanın yönlendirmesini **davranış değişmeden** 7'ye taşımak.

---

## 📍 Mevcut Durum

### `npm audit` çıktısı (2026-08-31 doğrulaması)

```
react-router  6.0.0 - 7.17.0
Severity: moderate

· Open redirect via backslash in <Link> and useNavigate (CVE-2025-68470 bypass)
  GHSA-wrjc-x8rr-h8h6
· Arbitrary Constructor Injection via deserializeErrors() in React Router
  SSR Hydration
  GHSA-337j-9hxr-rhxg

fix available via `npm audit fix --force`
Will install react-router-dom@7.18.3, which is a breaking change
```

|                | Değer                            |
| -------------- | -------------------------------- |
| `package.json` | `"react-router-dom": "^6.8.0"`   |
| Hedef          | `7.18.3` (npm'deki güncel sürüm) |

### Risk değerlendirmesi

İkinci kayıt (`deserializeErrors`) **SSR hidrasyonu** ile ilgilidir; bu uygulama
tamamen istemci taraflı statik bir SPA olduğu için o yol hiç çalışmaz. Birinci
kayıt (open redirect) `<Link>` ve `useNavigate` üzerinden geçerlidir ve uygulama
ikisini de kullanır — asıl gerekçe budur.

### Etkilenecek dosyalar

| Dosya                         | Ne kullanıyor                                                       |
| ----------------------------- | ------------------------------------------------------------------- |
| `src/main.tsx`                | `createBrowserRouter`, `RouterProvider`, `Navigate`, `errorElement` |
| `src/App.tsx`                 | `useParams`, `useNavigate`                                          |
| `src/lib/slug.ts`             | Doğrudan router API'si kullanmıyor ama URL sözleşmesini üretiyor    |
| `src/components/NotFound.tsx` | Bağlantılar                                                         |

### Özel dikkat — T-09'un bulgusu

`MIMARI.md` §12.4: rota elemanında oluşan bir hata kök `ErrorBoundary`'ye
**ulaşmaz**; react-router kendi iç hata sınırını kullanır. Gerçek koruma
`errorElement`'tir ve bu T-09'da canlı doğrulanmıştır.

**Yükseltmeden sonra bu davranış yeniden doğrulanmalıdır.** v7'de hata sınırı
davranışı değişmiş olabilir.

---

## ✅ Yapılacaklar

1. **Ayrı bir dal aç:** `talimat/T-22-react-router-yukseltmesi`
   (`CALISMA-SISTEMI.md` §6.5).

2. **Yükseltmeyi yap:**

   ```bash
   npm install react-router-dom@7
   ```

   `npm audit fix --force` yerine doğrudan kurulum tercih edilir — `--force`
   başka paketleri de habersiz değiştirebilir.

3. **v7 göç rehberini uygula.** Kırıcı değişiklikleri tek tek gözden geçir:
   - `createBrowserRouter` imzası
   - `RouterProvider` propları
   - `errorElement` → v7'de `ErrorBoundary` alanına taşınmış olabilir
   - `Navigate` / `useNavigate` davranışı
   - Future flag'lerin artık varsayılan olması

4. **Kanonik yönlendirmeyi doğrula.** `App.tsx`'teki sayısal → ad biçimi
   yönlendirmesi (`/08-21` → `/21-agustos`, `replace: true`) çalışmaya devam etmeli.

5. **`errorElement` davranışını yeniden doğrula** (yukarıdaki T-09 notu).
   Rota bileşenine bilerek bir hata attırıp `RouteErrorFallback`'in çıktığını
   görün; kök `ErrorBoundary`'nin devreye girmediğini teyit edin.

6. **`npm audit` temiz dönmeli.**

7. **Bulgu belgelerini güncelle:** `ANALIZ-RAPORU.md` §O-13 çözüldü olarak
   işaretlenir; `MIMARI.md` §12 sürüm bilgisi güncellenir.

---

## 🚫 Kapsam Dışı

| Konu                                               | Neden                                                        |
| -------------------------------------------------- | ------------------------------------------------------------ |
| Yeni rota eklemek (`/olay/...` gibi)               | Plan §2 — kapsam dışı                                        |
| URL şemasını değiştirmek                           | T-06'nın kurduğu sözleşme korunur                            |
| Data router / loader / action özelliklerine geçmek | Bu bir **güvenlik yükseltmesidir**, mimari değişikliği değil |
| Diğer bağımlılıkların yükseltilmesi                | Ayrı iş; bu talimat yalnızca `react-router-dom`              |
| React 18 → 19                                      | Bu talimatta yok                                             |

---

## ☑️ Kabul Kriterleri

- [x] `npm audit` → **0 açık** (yalnızca `react-router` kaynaklı değil, tüm ağaçta 0)
- [x] `package.json` → `react-router-dom` **^7.18.3**
- [x] `/` kökü bugünün gününe yönlendiriyor (`/` → `/2-eylul`)
- [x] `/08-21` → `/21-agustos` kanonik yönlendirmesi çalışıyor (adres çubuğunda doğrulandı)
- [x] Geçersiz slug (`/abc`) → `NotFound`
- [x] Tarayıcı geri/ileri tuşu gün geçmişinde doğru çalışıyor
- [x] `errorElement` hâlâ devrede (elle, geçici `throw` ile doğrulandı)
- [x] `npm run kontrol` yeşil
- [x] `ANALIZ-RAPORU.md` §O-13 çözüldü olarak işaretli

---

## 🧪 Doğrulama

```bash
npm audit
```

```bash
npm run kontrol
```

**Yönlendirme testi — sırayla:**

| Adres         | Beklenen                             |
| ------------- | ------------------------------------ |
| `/`           | Bugünün gününe yönlenir              |
| `/08-21`      | `/21-agustos` olarak yeniden yazılır |
| `/21-agustos` | Doğrudan açılır                      |
| `/29-subat`   | Açılır (kenar durum)                 |
| `/abc`        | `NotFound`                           |
| Geri tuşu     | Önceki güne döner                    |

**Tarayıcıda (üç gün):** 29 Ekim · 7 Mart · 29 Şubat — her birinde gün gezinme
düğmeleri, mini takvim ve paylaş bağlantısı çalışmalı.

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-09-02

- **Kurulan sürüm:** `react-router-dom` **7.18.3** (`^6.8.0` → `^7.18.3`),
  dolaylı `react-router` 7.18.3. Kurulum `npm install react-router-dom@7` ile
  yapıldı; `npm audit fix --force` bilerek kullanılmadı.

- **Değişen dosyalar:**

  | Dosya                             | Değişiklik                                                        |
  | --------------------------------- | ----------------------------------------------------------------- |
  | `package.json`                    | `react-router-dom` 7.x · `engines.node` `>=18` → `>=20` (sapma 1) |
  | `package-lock.json`               | Bağımlılık ağacı                                                  |
  | `Dokumanlar/ANALIZ-RAPORU.md`     | §O-13 → ✅ ÇÖZÜLDÜ (T-22) + _Çözüm_ bloğu                         |
  | `Dokumanlar/MIMARI.md`            | §12 başlığı + sürüm bloğu · §12.4'e v7 yeniden doğrulama notu     |
  | `Dokumanlar/BAGLAM.md`            | §2 yönlendirme satırı v6 → v7 · §7'deki açık O-13 maddesi kapandı |
  | `Dokumanlar/KULLANIM-KILAVUZU.md` | Node 18 → Node 20 (sapma 1)                                       |
  | `README.md`                       | Yığın tablosu: yönlendirme v6 → v7                                |
  | `Talimatlar/PLAN-02-...md`        | İlerleme tablosu T-22 ✅ · başlık 6/7 → 7/7                       |

  > **`src/` altında tek satır değişmedi.** Yükseltme tamamen bağımlılık
  > düzeyinde kaldı.

- **Karşılaşılan kırıcı değişiklikler:** **Hiçbiri.** Talimat kırıcı bir
  yükseltme bekliyordu; pratikte bu kod tabanı için kırılma çıkmadı. Nedeni:
  v7'de `react-router-dom` ince bir yeniden dışa aktarım katmanına dönüşmüş
  (`export * from "react-router"`, `RouterProvider`'ı ise `react-router/dom`'dan
  alır), dolayısıyla mevcut içe aktarma yolları aynen çalışıyor. Göç rehberinin
  maddeleri tek tek gözden geçirildi:

  | v7 kırıcı maddesi                                        | Bu projede etkisi                                                                                                                                                                                                                                                                                                                           |
  | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `createBrowserRouter` imzası                             | Değişmedi; yalnızca `routes` veriliyor, ikinci `opts` argümanı kullanılmıyor                                                                                                                                                                                                                                                                |
  | `RouterProvider` propları — `fallbackElement` kaldırıldı | Kullanılmıyordu                                                                                                                                                                                                                                                                                                                             |
  | `errorElement` → `ErrorBoundary`                         | **Beklenti yanlıştı**: `errorElement` kaldırılmadı, veri yönlendirici rota nesnesinde hâlâ geçerli. `ErrorBoundary` **alanı** çerçeve kipi (framework mode) rota modülleri içindir — bu proje o kipte değil. Değişiklik gerekmedi                                                                                                           |
  | `Navigate` / `useNavigate` davranışı                     | Aynı; kanonik yönlendirme (`replace: true`) korundu                                                                                                                                                                                                                                                                                         |
  | Future flag'lerin artık varsayılan olması                | `v7_relativeSplatPath` (splat rotasında göreli bağlantı yok — `*` rotası mutlak `<Link to="/...">` kullanıyor), `v7_startTransition` (gözlemlenebilir etki çıkmadı), `v7_fetcherPersist` / `v7_normalizeFormMethod` / `v7_skipActionErrorRevalidation` (fetcher/form/action kullanılmıyor), `v7_partialHydration` (SSR yok) → hepsi etkisiz |
  | `json()` / `defer()` kullanımdan kalkması                | Kullanılmıyor                                                                                                                                                                                                                                                                                                                               |

  Ek kazanç: T-06 Tamamlanma Kaydı'nda not edilen **gelecek bayrağı (future
  flag) konsol uyarıları kayboldu**; yerine yeni bir uyarı gelmedi.

- **`errorElement` davranışı (v7'de değişti mi):** **Değişmedi — T-09'un
  bulgusu ve `MIMARI.md` §12.4 aynen geçerli.** `App.tsx`'e geçici bir `throw`
  konularak canlı doğrulandı:

  1. Türkçe `RouteErrorFallback` kartı ("Arşivde bir sorun çıktı · Yaprak
     yırtıldı") çıktı — react-router'ın jenerik İngilizce ekranı **değil**.
  2. Konsola **yalnızca** `[Tarih Yaprağı] beklenmeyen hata (rota):` düştü;
     kök `ErrorBoundary`'nin `(rota)` eki **olmayan** mesajı hiç görünmedi →
     kök sınır devreye girmedi.
  3. React'in bileşen yığını da bunu doğruladı:
     `App → RenderedRoute → RenderErrorBoundary` (react-router'ın kendi iç
     sınırı) → … → `RouterProvider` → `ErrorBoundary` (bizimki, tetiklenmemiş).

  Geçici `throw` geri alındı; `src/App.tsx` `git diff`'te temiz.

- **`npm audit` sonucu:** **0 açık.** (Öncesi: 2 orta seviye —
  GHSA-wrjc-x8rr-h8h6 açık yönlendirme, GHSA-337j-9hxr-rhxg SSR hydration
  enjeksiyonu.)

- **Sapmalar / notlar:**

  1. **`engines.node` `>=18` → `>=20` (bilinçli, kapsam dışı sayılabilir):**
     `react-router@7.18.3` kendi `engines` alanında Node ≥ 20 istiyor. npm bunu
     varsayılan olarak zorlamıyor (depoda `.npmrc`/`engine-strict` yok), ama
     manifesto artık gerçekte desteklenmeyen bir Node sürümünü vaat ediyor
     olurdu. Bu, yükseltmenin **doğrudan sonucu** olduğu için düzeltildi;
     `KULLANIM-KILAVUZU.md` de buna göre güncellendi. CI zaten Node 20
     kullanıyor (`.github/workflows/kontrol.yml`), boru hattı etkilenmedi.
     Talimatın "diğer bağımlılıkların yükseltilmesi kapsam dışı" maddesine
     aykırı değil — başka paket yükseltilmedi, yalnızca kendi beyanımız
     gerçeğe uyduruldu. **Geri alınması tek satırlık bir iştir.**
  2. **Paket boyutu arttı:** `react` satıcı parçası 206,26 kB → **235,93 kB**
     (gzip 67,36 → **77,28 kB**). v7 çalışma zamanı v6'dan büyük; güvenlik
     yükseltmesinin bedeli. `index` parçası 385,25 kB'de **sabit** kaldı.
  3. **`vite.config.ts`'e dokunulmadı.** `manualChunks` girdisi hâlâ
     `react-router-dom` diyor; Rollup ince katmanı izleyip `react-router`'ı da
     aynı satıcı parçasına aldığı için T-13'ün uzun vadeli önbellek amacı
     kendiliğinden korundu. Derleme çıktısında doğrulandı: `react-router
v7.18.3` dizgesi `assets/react-*.js` içinde geçiyor, `assets/index-*.js`
     içinde **0 kez**.
  4. **Testler yönlendirmeyi kapsamıyor.** `src/**` altında hiçbir test
     `MemoryRouter`/`createMemoryRouter` kullanmıyor; 399 testin tamamı geçti
     ama bu, yönlendirme regresyonu için **kanıt değil**. Bu talimatın gerçek
     güvencesi baştan sona canlı tarayıcı doğrulamasıdır. (Yönlendirme testi
     eklemek ayrı bir iş — bu talimatın kapsamında değil.)
  5. **`ANALIZ-RAPORU.md`'nin §11 özet tabloları güncellenmedi.** O tablolar
     "PLAN-01 Kapanışı (2026-08-24)" başlıklı **tarihsel bir fotoğraf**;
     O-10/O-11/O-12 de PLAN-02'de çözüldükleri hâlde orada "⏭️ PLAN-02" olarak
     duruyor. Yalnızca O-13'ün satırını değiştirmek tabloyu tutarsız yapardı.
     Belgenin kendi kuralı (giriş bölümü) "çözülen bulguların **başlığına**
     `✅ ÇÖZÜLDÜ` işareti ve bir _Çözüm_ bloğu eklenir" diyor — kabul kriteri
     bu şekilde karşılandı.
  6. **PLAN-02 kapatılmadı.** T-22 bu planın son talimatıydı; ilerleme tablosu
     ve başlık 7/7'ye çekildi, ama `CALISMA-SISTEMI.md` §7'nin _plan kapanışı_
     listesi (Kapanış Özeti, `BAGLAM.md` § Mevcut Durum, `KULLANIM-KILAVUZU.md`
     yeni özellikler, plan dosyasının `Talimatlar/Plan/`'a taşınması) ayrı bir
     adım olarak **bekliyor**.
  7. **Doğrulama sırasında iki yanıltıcı gözlem** (uygulama hatası değil, ileride
     zaman kaybetmemek için not ediliyor): (a) Tarayıcı paneli gizlendiğinde
     görünüm alanı 0×0'a düşüyor ve düğme koordinatları anlamsız (negatif)
     çıkıyor. (b) Sayfa `content-visibility: auto` ile geç yerleşim yaptığından,
     kaydırma oturmadan gönderilen sentetik tıklamalar hedefi ıskalayabiliyor;
     kaydırma oturduktan sonra aynı tıklama çalışıyor. İkisi de otomasyon
     artefaktı — T-15'in gerçek örtü (overlay) hatasıyla karıştırılmamalı:
     `elementFromPoint` her iki durumda da düğmenin **içini** döndürdü.

---

## 🔎 Doğrulama Kayıtları (canlı, `npm run dev`)

**Yönlendirme matrisi**

| Adres         | Beklenen                | Gözlenen                                              |
| ------------- | ----------------------- | ----------------------------------------------------- |
| `/`           | Bugünün gününe yönlenir | `/2-eylul` ✅ (başlık: "2 Eylül — Tarihte Bugün")     |
| `/08-21`      | `/21-agustos`           | `/21-agustos` ✅ (adres çubuğunda yeniden yazıldı)    |
| `/21-agustos` | Doğrudan açılır         | ✅                                                    |
| `/29-subat`   | Açılır (kenar durum)    | ✅ ("ARTIK GÜN" rozeti + "2026 artık yıl değil" notu) |
| `/abc`        | `NotFound`              | ✅ (404 kartı)                                        |

**Geçmiş (history)**

21 Ağustos → (Sonraki gün) 22 → (Sonraki gün) 23 → (geri) 22 → (geri) 21 →
(ileri) 22. Her adımda `document.title` de birlikte değişti; kanonik
yönlendirmenin `replace: true` kullanması sayesinde geçmişe fazladan kayıt
düşmedi.

**Üç gün · gün gezinme + mini takvim + paylaş**

| Gün          | Gezinme düğmeleri                  | Mini takvim                   | Paylaş                          |
| ------------ | ---------------------------------- | ----------------------------- | ------------------------------- |
| **29 Ekim**  | ✅                                 | ✅ 31 gün · "5" → `/5-ekim`   | ✅ "Bağlantı panoya kopyalandı" |
| **7 Mart**   | ✅ 8 Mart ↔ 7 Mart                 | ✅ 31 gün · "15" → `/15-mart` | ✅ "Bağlantı panoya kopyalandı" |
| **29 Şubat** | ✅ → `/1-mart`, geri → `/29-subat` | ✅ **29 gün** (arşiv kipi)    | ✅ "Bağlantı panoya kopyalandı" |

Üç günde de editör içeriği ve sayaçlar geldi (29 Ekim: 32/76/52/7 · 7 Mart:
47/74/57/3 · 29 Şubat: 18/28/14/1). Konsolda yeni hata/uyarı yok.

**Kapılar**

| Komut             | Öncesi (main)      | Sonrası                        |
| ----------------- | ------------------ | ------------------------------ |
| `npm audit`       | 2 orta seviye açık | **0 açık**                     |
| `npm run kontrol` | ✅ yeşil           | ✅ yeşil (399 test / 15 dosya) |
