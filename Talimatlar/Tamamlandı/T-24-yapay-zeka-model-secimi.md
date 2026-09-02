# T-24 · Yapay Zekâ Model Seçimi ve Kendini Onaran Sağlayıcı

| Alan             | Değer                                              |
| ---------------- | -------------------------------------------------- |
| **Faz**          | Bakım — T-20'nin devamı                            |
| **Öncelik**      | 🔴 Yüksek (özellik şu anda kullanıcıda çalışmıyor) |
| **Tahmini süre** | ~3–4 saat                                          |
| **Bağımlılık**   | T-20 (yapay zekâ katmanı) tamamlanmış olmalı       |
| **İlgili bulgu** | Canlı kullanıcı raporu — 2026-09-02                |
| **Durum**        | ✅ Tamamlandı (2026-09-02)                         |

> ⚠️ **Bu talimat, kullanıcının elindeki çalışmayan bir özelliği onarır.**
> Geçerli bir Gemini anahtarıyla "Yapay zekâya sor" `404` alıyor ve
> "Model bulunamadı" diyor. Geçici çözüm tek satırdır (§Hızlı Onarım); bu
> talimat aynı arızanın **tekrar etmemesini** sağlar.

---

## 🎯 Amaç

`GEMINI_MODEL`'i sabit bir tahmin olmaktan çıkarmak.

Bugün model adı kaynak kodda gömülü tek bir dizgedir. Google bir modeli emekliye
ayırdığında, yeniden adlandırdığında ya da ücretsiz katmandan çıkardığında
uygulama `404` alır ve kullanıcı **arayüzden hiçbir şey yapamaz** — onarım
kaynak kodu düzenlemeyi gerektirir. Bu, anahtarını kendi getiren (BYOK) bir
tasarımda kabul edilemez: anahtar kullanıcınındır, o anahtarın hangi modelleri
gördüğü de kullanıcıdan kullanıcıya değişir.

---

## 📍 Mevcut Durum

### Arıza zinciri (2026-09-02, canlı doğrulandı)

1. Kullanıcı AI Studio'dan geçerli bir anahtar aldı, ayarlara girdi.
2. "Sor" düğmesine bastı → **"Bağlantı kurulamadı."**
3. Bu mesaj iki ayrı arızayı birden gizliyordu; ikisi de aynı oturumda düzeltildi:
   - anahtara karışan görünmez karakter (`U+200B`/`U+FEFF`) `fetch`i istek
     çıkmadan düşürüyordu → `anahtarTemizle()` ile çözüldü;
   - `yzDurumMesaji` **404'ü de** `YZ_MESAJ.ag`'ye eşliyordu → 404'e kendi
     mesajı verildi.
4. Düzeltmeden sonra gerçek hata görünür oldu: **`404` — model çözümlenemiyor.**

### Doğrulanmış olanlar (bunları yeniden araştırmayın)

| Şüphe                            | Sonuç                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------- |
| CORS / tarayıcı engeli           | ❌ Değil — ön uçuş `x-goog-api-key`'e izin veriyor, POST'ta da başlık var     |
| `v1beta` yolu kalkmış olabilir   | ❌ Değil — `v1beta`, `v1`, `v1alpha` üçü de ayakta; uydurma sürüm 404 veriyor |
| CSP `connect-src` engeli         | ❌ Yok — depoda hiç CSP tanımı yok                                            |
| `file://` üzerinden açılma       | ❌ Değil — başlatıcılar hep `http://localhost` sunucusu kaldırıyor            |
| Anahtar biçimi                   | ✅ Düzeltildi (`anahtarTemizle`)                                              |
| Hata eşlemesi                    | ✅ Düzeltildi (404 ayrıldı, ham hata konsola yazılıyor)                       |
| **Modelin anahtara açık olması** | ❗ **Açık kalan tek neden** — bu talimatın konusu                             |

### Kök sebep

`src/lib/yapayzeka/gemini.ts`:

```ts
export const GEMINI_MODEL = "gemini-2.5-flash";
const UC_NOKTA = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
```

Tek bir sabit, üstelik **hiçbir yerde doğrulanmıyor**. Google'ın 404 gövdesi
şunu der: _"is not found for API version v1beta, or is not supported for
generateContent"_ — yani model ya yok, ya bu sürümde yok, ya da bu anahtara
kapalı. Uygulama üçünü ayırt edemez ve hiçbirinden kurtulamaz.

### Etkilenecek dosyalar

| Dosya                                 | Ne değişecek                                           |
| ------------------------------------- | ------------------------------------------------------ |
| `src/lib/yapayzeka/gemini.ts`         | Aday zinciri, 404'te sıradakine geçme, model listeleme |
| `src/lib/yapayzeka/anahtar.ts`        | Seçili modelin `localStorage`'da saklanması            |
| `src/lib/yapayzeka/tipler.ts`         | Yeni durum mesajları                                   |
| `src/components/YzAyarlari.tsx`       | Model seçimi + "Bağlantıyı sına" düğmesi               |
| `src/lib/yapayzeka/yapayzeka.test.ts` | Yeni davranışların testleri                            |
| `scripts/yz-model-listesi.mjs`        | Zaten eklendi — talimat sırasında referans             |

---

## 🩹 Hızlı Onarım (talimattan önce, ~5 dakika)

Kullanıcıyı hemen açmak için:

```bash
npm run yz-modeller
```

Betik anahtarın **gerçekten** eriştiği, `generateContent` destekleyen modelleri
listeler ve bir aday önerir. Çıkan adı `gemini.ts`'teki `GEMINI_MODEL`'e yazmak
özelliği çalıştırır. Bu bir yamadır; aynı arıza bir sonraki emeklilikte döner —
kalıcı çözüm aşağısıdır.

---

## ✅ Yapılacaklar

### 1. Aday model zinciri

`GEMINI_MODEL` tek sabit olmaktan çıkıp **sıralı bir aday listesine** dönüşsün:

```ts
export const ADAY_MODELLER = [
  "gemini-3.5-flash",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
] as const;
```

- Sıra bilinçli olsun: önce yeni/yetenekli, sonra ucuz/yüksek kotalı.
- `preview` ve `exp` ekli adlar **listeye girmesin** — ücretsiz katmanda
  habersiz kapanırlar.
- Liste `gemini.ts` içinde kalsın; `tipler.ts` ve panel sağlayıcıyı tanımaz
  (T-20'nin katman kuralı bozulmayacak).

### 2. 404'te sıradakine geçme + öğrenme

- İstek `404` alırsa **bir sonraki aday** denensin; kullanıcıya hata gösterilmeden.
- Çalışan model `localStorage`'a yazılsın (`ty-yz-model`) ve sonraki isteklerde
  **doğrudan** o kullanılsın — her açılışta zinciri baştan taramak boşuna
  gecikme ve kota tüketimidir.
- Zincirin tamamı 404 verirse `YZ_MESAJ.model` gösterilsin.
- **Yalnızca 404'te** ilerlenmeli. 400/401/403 anahtar sorunudur, 429 kotadır;
  bunlarda başka model denemek arızayı gizler ve kotayı boşa yakar.

### 3. Ayarlarda model görünürlüğü ve seçimi

`YzAyarlari.tsx`:

- Hâlâ hangi modelin kullanıldığını **yazsın** (künye satırında da geçiyor).
- Anahtar kayıtlıyken "Modelleri getir" ile `ListModels` çağrılsın; dönen
  liste bir açılır menüye konsun, kullanıcı elle seçebilsin.
- Elle seçim `localStorage`'daki değeri ezsin; "Varsayılana dön" ile temizlensin.

### 4. "Bağlantıyı sına" düğmesi

Ayarlar ekranına tek düğme: kısa, sabit bir istem gönderir ve **ne olduğunu
açıkça yazar** — başarılı / anahtar geçersiz / kota dolu / model yok / ağ
engelli. Bugün kullanıcının elinde tanı aracı yok; arızayı ancak bir olay
paneli açıp deneyerek görüyor.

### 5. Testler

- 404 → sıradaki aday deneniyor; ikinci aday başarılıysa metin dönüyor.
- Zincirin tamamı 404 → `YZ_MESAJ.model`.
- 400/429 → **zincirde ilerlenmiyor**, tek istek atılıyor (kota koruması).
- Çalışan model `localStorage`'a yazılıyor ve ikinci çağrıda doğrudan
  kullanılıyor (tek `fetch`).
- Elle seçilen model aday zincirini eziyor.

---

## 🚫 Kapsam Dışı

- **Sağlayıcı değiştirmek** (OpenAI, Anthropic vb.). T-20'nin katman ayrımı
  bunu zaten ucuzlaştırdı; ihtiyaç doğarsa ayrı talimat.
- **Sunucu tarafı anahtar proxy'si.** Backend PLAN-02 §2'de kapsam dışı;
  BYOK kararı geçerli.
- **`thinkingConfig` ile düşünmeyi kapatmak.** Alan `v1beta` şemasında
  doğrulanamadı ve tanınmayan bir alan **bütün istekleri** 400'e düşürür.
  Ayrı bir doğrulama işi; şimdilik jeton bütçesi 2048'e çıkarılarak çözüldü.
- **`ICERIK-SABLONU.md` §0** yürürlükte: üretilen metin depoya yazılmaz.

---

## ☑️ Kabul Kriterleri

1. Geçerli bir anahtarla "Yapay zekâya sor" **çalışır**; model adı kaynak kodda
   elle güncellenmeden.
2. Zincirdeki ilk model 404 verirse kullanıcı bunu **görmez**; ikinci model
   yanıtı gelir.
3. Çalışan model saklanır; ikinci soruda tek `fetch` atılır.
4. Ayarlar ekranı kullanılan modeli gösterir ve değiştirmeye izin verir.
5. "Bağlantıyı sına" dört hata durumunu da ayrı ayrı, Türkçe raporlar.
6. `npm run kontrol` yeşil.

---

## 🧪 Doğrulama

- **Birim:** `fetch` kuklasıyla 404→200 zinciri, 400/429'da ilerlememe,
  `localStorage`'a yazma. (`localStorage` jsdom'da `src/test/setup.ts`
  shim'iyle çalışıyor — bkz. T-20 kaydı.)
- **Canlı:** `npm run dev`, gerçek anahtarla soru sor; ağ sekmesinde **tek**
  isteğin gittiğini doğrula. Ardından `ADAY_MODELLER`'in başına uydurma bir ad
  koyup zincirin sessizce ikinciye geçtiğini gör.
- **Tanı:** `npm run yz-modeller` çıktısı ile ayarlar ekranındaki listenin
  **aynı** olduğunu karşılaştır.

---

## 📝 Tamamlanma Kaydı

**Tamamlandı: 2026-09-02.** Altı kabul kriterinin altısı da karşılandı; `npm run kontrol`
yeşil (416 test, önceki 406'dan +10).

### Ne değişti

- **`gemini.ts`** — `GEMINI_MODEL` sabiti kaldırıldı, yerine `ADAY_MODELLER` (talimattaki
  üç adaylık dizi, aynen) geldi. `sor()` artık `denemeSirasi()`'nin döndürdüğü liste
  üzerinde döngüye giriyor: `404`'te sessizce sıradakine geçiyor, her başka durumda
  (`400/401/403/429/5xx`/boş yanıt/`MAX_TOKENS`) döngü kırılıp doğrudan fırlatılıyor —
  kota ve anahtar hataları asla gizlenmiyor. Başarılı model `modelYaz()` ile kaydediliyor.
  Yeni `modelleriGetir()` fonksiyonu `ListModels`'i çağırıp `generateContent` destekleyen
  modelleri döndürüyor (`scripts/yz-model-listesi.mjs` ile aynı süzgeç).
- **`anahtar.ts`** — `MODEL_ADI` (`ty-yz-model`) + `modelOku`/`modelYaz`/`modelSil`,
  anahtarınkiyle aynı try/catch deseninde.
- **`tipler.ts`** — `YZ_MESAJ.baglantiTamam` ve `YZ_MESAJ.modelListesiBos` eklendi;
  `model` mesajının yorumu güncellendi (artık zincirin tamamı tükenince görülüyor,
  `GEMINI_MODEL` güncellemesi gerektirmiyor).
- **`YzAyarlari.tsx`** — anahtar kayıtlıyken açılan yeni bir bölüm: kullanılan modeli
  gösteren satır (`ADAY_MODELLER[0]` + "(otomatik aday zinciri)" etiketi, hiçbir şey
  sabitlenmemişse), "Modelleri getir" (açılır listeye dolduruyor, seçim `modelYaz`'a
  gidiyor), "Varsayılana dön" (`modelSil`, yalnızca bir model sabitliyken görünüyor) ve
  "Bağlantıyı sına" (kısa sabit bir istemle `saglayici.sor()`'u çağırıp sonucu `role=status`
  ile Türkçe basıyor).
- **`yapayzeka.test.ts`** — `GEMINI_MODEL` referansı olan test `ADAY_MODELLER[0]`'e
  güncellendi; yeni iki `describe` bloğu: "aday zinciri ve kendini onarma" (7 test — 404
  ilerlemesi, zincir tükenmesi, 400/429'da ilerlememe, `localStorage` kalıcılığı, elle/
  önceden-öğrenilmiş modelin önceliği, sabitlenen model 404 verirse zincire düşme) ve
  "modelleriGetir" (3 test — anahtarsız ret, süzgeç+sıralama, HTTP hata eşlemesi).
- **`CHANGELOG.md`** — `[Yayımlanmamış] › Düzeltilen`'e T-24 etiketli yeni madde eklendi.

### Karar gerektiren bir belirsizlik: "elle seçim zinciri eziyor" ne demek

Talimat metni iki farklı okumaya açıktı: (a) elle seçilen/öğrenilmiş model **tek başına**
kullanılsın, aday zincirine hiç düşülmesin; (b) o model **önce** denensin, zincirin geri
kalanı arkasında yedek olarak dursun. (b) seçildi — gerekçesi: "kendini onaran sağlayıcı"
başlığının kendisi, sabitlenen model de zamanla emekliye ayrılabileceğinden onarmanın **tek
seferlik olmaması** gerektiğini söylüyor. (a) seçilseydi, otomatik öğrenilen bir model
retired olduğunda kullanıcı yeniden kilitlenip ayarlara gitmek zorunda kalırdı — talimatın
çözmeye çalıştığı arızanın aynısı, bir basamak ötelenmiş hâli. `denemeSirasi()` bu yüzden
`[sabit, ...ADAY_MODELLER.filter(m => m !== sabit)]` döndürüyor; "eziyor" ifadesi
`localStorage`'daki **değerin** üzerine yazılması olarak okundu, ilerleme mantığının
devre dışı bırakılması olarak değil. Test "sabitlenen model de 404 verirse aday zincirine
düşülür" bunu doğruluyor.

### Canlıda doğrulanamayan iki madde — gerçek anahtar gerektiriyor

Bu oturumda kullanıcının gerçek Gemini anahtarı yoktu (T-20'nin halüsinasyon kontrolü de
aynı sebeple kullanıcıya bırakılmıştı). Sahte bir anahtarla (`FAKE-TEST-KEY-…`) canlı
doğrulama yapıldı: `npm run dev` ayağa kaldırılıp tarayıcıdan hem panelin "Sor" düğmesi hem
ayarlardaki "Bağlantıyı sına" hem de "Modelleri getir" tıklandı — üçü de gerçekten
`generativelanguage.googleapis.com`'a çıktı, Google gerçek bir `400` döndürdü ve üçü de
doğru Türkçe mesajı ("Anahtar geçersiz görünüyor. Ayarlardan kontrol edin.") bastı
(konsolda `Failed to load resource: 400` olarak görüldü). Ayarlar ekranında "Kullanılan
model" satırının varsayılan durumda `gemini-3.5-flash (otomatik aday zinciri)` yazdığı da
doğrulandı. Ama şunlar **doğrulanamadı**, çünkü gerçek bir 404 ya da başarılı yanıt
gerektiriyor:

1. Zincirin gerçekten ikinci adaya geçtiği (`ADAY_MODELLER`'in başına uydurma bir ad koyup
   sessizce ikinciye düşmesi) — 7 birim testiyle kuklalanmış `fetch` üzerinden doğrulandı,
   canlı değil.
2. `npm run yz-modeller` çıktısıyla "Modelleri getir" listesinin gerçekten aynı olduğu —
   süzgeç mantığı satır satır aynı (kod okumasıyla ve `modelleriGetir` testleriyle
   doğrulandı) ama iki aracın **aynı anahtarla** yan yana koşturulması yapılmadı.

**Kullanıcıya not:** kendi anahtarınızla bir kez "Bağlantıyı sına"ya basın; ayarlardaki
"Kullanılan model" satırının gerçek bir model adı gösterdiğini görün. İsterseniz
`ADAY_MODELLER`'in ilk elemanını geçici olarak uydurma bir adla değiştirip zincirin
ikinciye sessizce düştüğünü de gözlemleyebilirsiniz.

### Kapsam dışı bırakılanlar (talimatın kendi tablosuna sadık kalındı)

`kaydet()` fonksiyonu hâlâ anahtar kaydedilince modalı kapatıyor — değiştirilmedi. Yeni
model araçlarına ulaşmak için ayarları bir kez daha açmak gerekiyor; bu, talimatın
istemediği bir davranış değişikliği (modalı açık tutmak) yerine en küçük değişiklik
tercih edilerek bilinçli bırakıldı. `thinkingConfig`, sağlayıcı değişimi ve sunucu
proxy'si dokunulmadı (zaten kapsam dışıydı).
