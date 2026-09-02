# T-24 · Yapay Zekâ Model Seçimi ve Kendini Onaran Sağlayıcı

| Alan             | Değer                                              |
| ---------------- | -------------------------------------------------- |
| **Faz**          | Bakım — T-20'nin devamı                            |
| **Öncelik**      | 🔴 Yüksek (özellik şu anda kullanıcıda çalışmıyor) |
| **Tahmini süre** | ~3–4 saat                                          |
| **Bağımlılık**   | T-20 (yapay zekâ katmanı) tamamlanmış olmalı       |
| **İlgili bulgu** | Canlı kullanıcı raporu — 2026-09-02                |
| **Durum**        | ⬜ Bekliyor                                        |

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

_(Talimat tamamlandığında doldurulacak.)_
