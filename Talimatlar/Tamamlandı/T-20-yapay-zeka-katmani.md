# T-20 · Yapay Zekâ Araştırma Katmanı

| Alan             | Değer                               |
| ---------------- | ----------------------------------- |
| **Faz**          | FAZ 3 — Derinlik                    |
| **Öncelik**      | 🟡 Orta                             |
| **Tahmini süre** | ~5 saat                             |
| **Bağımlılık**   | **T-16 ve T-19 tamamlanmış olmalı** |
| **İlgili bulgu** | U-6                                 |
| **Durum**        | ✅ Tamamlandı (2026-09-01)          |

> 📌 **Onay kaydı:** Kullanıcı 2026-08-24 oturumunda çalışma zamanı yapay zekâ
> katmanını açıkça istedi (_"o anda orada o olayla ilgili kısa bir özet oluştursa
> veya o olay hakkında farklı bir soru sorabilsem"_), sağlayıcı olarak ücretsiz
> katmanı nedeniyle Gemini'yi seçti ve YZ'nin **istek üzerine** çalışmasını onayladı.

---

## 🎯 Amaç

Kullanıcının bir olay hakkında sayfadan ayrılmadan soru sorabilmesini sağlamak.

Talimat bittiğinde: detay panelinin altında bir "Yapay zekâya sor" düğmesi ve
serbest soru kutusu olacak; model, önüne konan Vikipedi metnini açıklayacak;
çıktı görsel olarak "YZ üretimi" işaretli olacak.

---

## 📍 Mevcut Durum

Böyle bir katman yok. `U-6` (ANALIZ-RAPORU-02 §3), kullanıcının _"daha detaylı
öğrenebileceğim bir yer lazım"_ ihtiyacının karşılanmadığını kaydediyor. T-19 bu
ihtiyacın Vikipedi tarafını çözer; bu talimat soru sorma tarafını ekler.

---

## 🔒 Yapay Zekâ Politikası — bu talimat §0 yasağını KALDIRMAZ

`ICERIK-SABLONU.md` §0: _"Yapay zekâ ile toplu içerik üretimi yasaktır."_

| §0'ın yasakladığı                                       | T-20'nin yaptığı                                                 |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| `src/data/gunler/*.ts` içine YZ ile toplu içerik yazmak | Depoya **hiçbir** YZ metni yazılmaz                              |
| Editör içeriği gibi görünen üretilmiş olgular           | Çıktı açıkça "YZ üretimi" etiketli, editör rozetinden ayrı       |
| Doğrulanmamış olgu üretimi                              | Model önüne konan Vikipedi metnini açıklar; kaynak ekranda kalır |
| Kalıcı, sürüm kontrollü içerik                          | Geçici, isteğe bağlı, kullanıcı tetiklemeli                      |

---

## ⚠️ Halüsinasyon Riski ve Azaltma

Gemini ücretsiz katmanında **web araması yoktur**; model yalnızca kendi hafızasından
konuşur. Niş Türkiye tarihi konularında (örn. 1958 Bursa Kapalı Çarşı yangını) bu
gerçek bir uydurma riskidir.

Azaltma: isteme Vikipedi `extract` metnini **bağlam olarak gömmek** ve görevi
"hatırla"dan "açıkla"ya çevirmek.

```
Şu Vikipedi metnine dayanarak olayı bir yayıncının anlatacağı gibi açıkla.
Metinde olmayan bilgi ekleme. Emin olmadığın yeri "kaynakta belirtilmemiş"
olarak işaretle.

[extract metni]
```

> Bu, T-16 yapılmadan **teknik olarak mümkün değildir** — `extract` bugün hiç
> okunmuyor. T-16'nın bu talimattan önce gelmesinin asıl sebebi budur.

---

## ✅ Yapılacaklar

### Sağlayıcıdan bağımsız katman

1. **`src/lib/yapayzeka/` klasörü oluştur:**
   - `tipler.ts` — sağlayıcıdan bağımsız arayüz:
     ```ts
     export interface YzSaglayici {
       ad: string;
       sor(istem: string, baglam: string, signal?: AbortSignal): Promise<string>;
     }
     ```
   - `gemini.ts` — `YzSaglayici` uygulaması. Model adı dosyanın başında **tek bir
     sabitte** tutulur (Google'ın güncel Flash / Flash-Lite modeli seçilir).
   - `index.ts` — aktif sağlayıcıyı dışa aktarır.

   Gerekçe: ileride arama destekli bir sağlayıcıya geçmek küçük bir iş kalsın.

2. **Anahtar yönetimi:**
   - Anahtar **kullanıcı tarafından** girilir; uygulamaya bir ayarlar ekranı eklenir.
   - `localStorage`'da tutulur (anahtar adı: `ty-yz-anahtar`).
   - Anahtar **hiçbir zaman** depoya, sürüm kontrolüne, belgelere veya `.env`'e
     yazılmaz — istemci taraflı derlemede `.env` gizli değildir.
   - Ayarlar ekranında anahtarı **silme** düğmesi bulunur.

3. **Panele bağlanma.** T-19'un bıraktığı slot doldurulur:
   - "Yapay zekâya sor" düğmesi (anahtar yoksa: "Önce anahtarınızı girin" + ayarlara bağlantı)
   - Serbest soru kutusu
   - Yanıt alanı

4. **Tetikleme yalnızca kullanıcı basınca.** Otomatik çağrı yok — günde 40+ boşuna
   istek anlamına gelir.

5. **Çıktı etiketleme.** Yanıt alanı görsel olarak "YZ ÜRETİMİ" rozeti taşır;
   Editör (altın) ve Otomatik (nötr) rozetlerinden **açıkça farklı** bir renk kullanılır.
   Yanıtın altında sabit bir uyarı satırı: kaynağın Vikipedi metni olduğu,
   doğrulanmadan kullanılmaması gerektiği.

6. **Hata durumları — hepsi Türkçe:**

   | Durum                  | Mesaj                                                         |
   | ---------------------- | ------------------------------------------------------------- |
   | Anahtar yok / geçersiz | "Anahtar geçersiz görünüyor. Ayarlardan kontrol edin."        |
   | Kota doldu (429)       | "Günlük ücretsiz kota dolmuş olabilir. Yarın tekrar deneyin." |
   | Ağ hatası              | "Bağlantı kurulamadı."                                        |
   | Zaman aşımı            | "Yanıt gelmedi, tekrar deneyin."                              |

   Hata hâlinde panel **Vikipedi içeriğiyle çalışmaya devam eder.**

7. **XSS yüzeyi kontrolü.** Model çıktısı düz metin olarak render edilir.
   `dangerouslySetInnerHTML` / `innerHTML` / `eval` **kullanılmaz** (bugün kod
   tabanında hiç geçmiyor, öyle kalmalı).

---

## 🚫 Kapsam Dışı

| Konu                                     | Hangi talimata ait                      |
| ---------------------------------------- | --------------------------------------- |
| Detay panelinin kendisi                  | **T-19** (önce yapılmış olmalı)         |
| `extract` metninin okunması              | **T-16** (önce yapılmış olmalı)         |
| YZ ile toplu içerik üretip depoya yazmak | **Yasak** — `ICERIK-SABLONU.md` §0      |
| Backend üzerinden proxy'lenmiş anahtar   | Plan §2 — backend kapsam dışı           |
| Sohbet geçmişi, çoklu tur konuşma        | Bu talimatta yok; gerekirse PLAN-03     |
| Rekorlar Kasası kartlarına bağlanması    | Bu talimatta yok — T-23 sonrası ayrı iş |

---

## ☑️ Kabul Kriterleri

- [x] `src/lib/yapayzeka/` sağlayıcıdan bağımsız arayüzle kurulu
- [x] Anahtar yalnızca `localStorage`'da; `grep -rn "AIza" .` → **0 sonuç**
- [x] `.env` / `.env.example` içinde YZ anahtarı **yok**
- [x] Ayarlar ekranından anahtar girilebiliyor ve silinebiliyor
- [x] Sayfa yüklenirken **hiçbir** YZ isteği çıkmıyor (Network sekmesi)
- [x] İstek yalnızca düğmeye basılınca gidiyor
- [x] İsteme Vikipedi `extract` metni bağlam olarak gömülüyor
- [x] Çıktı "YZ ÜRETİMİ" rozetli, Editör/Otomatik rozetlerinden farklı
- [x] Dört hata durumu da Türkçe mesaj veriyor, panel çökmüyor
- [x] `grep -rn "dangerouslySetInnerHTML\|innerHTML\|eval(" src/` → **0 sonuç**
- [x] `npm run kontrol` yeşil

---

## 🧪 Doğrulama

```bash
grep -rn "AIza" . --exclude-dir=node_modules
```

```bash
grep -rn "dangerouslySetInnerHTML\|innerHTML\|eval(" src/
```

İkisi de **boş** dönmeli.

**Elle test — anahtarsız durum:** `localStorage`'ı temizleyip paneli açın.
"Yapay zekâya sor" düğmesi anahtar istemeli, çökmemeli.

**Elle test — kota hatası:** Geçersiz bir anahtarla deneyin; Türkçe hata mesajı
çıkmalı, panelin Vikipedi içeriği yerinde kalmalı.

**Halüsinasyon kontrolü:** Niş bir olayda (örn. 1958 Bursa Kapalı Çarşı yangını)
yanıtın Vikipedi metninde geçmeyen bir "olgu" uydurup uydurmadığına bakın.
Uyduruyorsa istem güçlendirilir ve bu, Tamamlanma Kaydı'na yazılır.

**Tarayıcıda (üç gün):** 29 Ekim · 7 Mart · 29 Şubat.

```bash
npm run kontrol
```

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-09-01

- **Değişen dosyalar:**

  _Yeni:_

  | Dosya                                     | İş                                                                 |
  | ----------------------------------------- | ------------------------------------------------------------------ |
  | `src/lib/yapayzeka/tipler.ts`             | `YzSaglayici` arayüzü, `YzHatasi`, Türkçe mesajlar, durum eşlemesi |
  | `src/lib/yapayzeka/anahtar.ts`            | `localStorage` anahtar yönetimi + `useYzAnahtari` aboneliği        |
  | `src/lib/yapayzeka/istem.ts`              | Bağlam gömme, kural bloğu, uzun metin kırpma                       |
  | `src/lib/yapayzeka/gemini.ts`             | Tek sağlayıcı uygulaması; model adı tek sabitte                    |
  | `src/lib/yapayzeka/index.ts`              | Aktif sağlayıcı ve dışa aktarımlar                                 |
  | `src/lib/yapayzeka/yapayzeka.test.ts`     | 31 test — anahtar, istem, hata eşlemesi, sağlayıcı                 |
  | `src/components/YapayZekaBolumu.tsx`      | Panel bölümü: düğme, soru kutusu, yanıt, rozet, hatalar            |
  | `src/components/YapayZekaBolumu.test.tsx` | 19 test — anahtarsız durum, tetikleme, etiketleme, hatalar, XSS    |
  | `src/components/YzAyarlari.tsx`           | Ayarlar modalı + `yzAyarlariniAc()` olay köprüsü                   |

  _Değişen:_

  | Dosya                                 | İş                                                         |
  | ------------------------------------- | ---------------------------------------------------------- |
  | `src/components/DetayPaneli.tsx`      | T-20 yuvası dolduruldu; `metin` varsa YZ bölümü basılır    |
  | `src/components/DetayPaneli.test.tsx` | Yuva testi T-19'un "boş" sözleşmesinden T-20'ninkine geçti |
  | `src/components/UstBar.tsx`           | Ayarlar düğmesi (kıvılcım simgesi)                         |
  | `src/components/ui.tsx`               | `IconSpark` eklendi                                        |
  | `src/App.tsx`                         | Ayarlar modalı durumu ve olay aboneliği                    |
  | `src/test/setup.ts`                   | `localStorage` yaması (bkz. sapmalar 2)                    |

- **Seçilen model ve sürümü:** `gemini-2.5-flash` — `src/lib/yapayzeka/gemini.ts`
  içindeki `GEMINI_MODEL` sabitinde. Değiştirilecek **tek yer** orasıdır; kota
  sıkışırsa `gemini-2.5-flash-lite` bir alt basamaktır. Uç nokta
  `v1beta/models/{model}:generateContent`, kimlik `x-goog-api-key`
  **başlığında** — sorgu dizesinde değil, çünkü URL'ler tarayıcı geçmişine,
  sunucu günlüklerine ve `Referer` başlığına düşer.

- **Halüsinasyon testi sonucu:** ⚠️ **Yapılmadı — gerçek anahtar gerektiriyor.**
  Bu oturumda geçerli bir Gemini anahtarı yoktu. Kod tarafındaki azaltma yerinde
  ve test edilmiş durumda: `extract` metni isteme bağlam olarak gömülüyor,
  kurallar bağlamın **önüne** yazılıyor (model uzun metinde baştaki yönergeye
  uyar), sıcaklık 0.2, ve "metinde olmayan bilgi ekleme" / "kaynakta
  belirtilmemiş olarak işaretle" kuralları `istem.ts`'te sabit. Bağlamsız çağrı
  **mimari olarak imkânsız**: `metin` yoksa bölüm hiç render edilmiyor.

  **Kullanıcının yapması gereken elle test:** kendi anahtarını Ayarlar'dan girip
  1958 Bursa Kapalı Çarşı yangını gibi niş bir olayda yanıtı panelin üstündeki
  Vikipedi metniyle karşılaştırmak. Metinde geçmeyen bir tarih/sayı/isim
  çıkarsa `istem.ts`'teki kural bloğu güçlendirilmeli ve sonuç buraya yazılmalı.

- **Sapmalar / notlar:**

  1. **Yuva `DetayPaneli` içinden dolduruldu, çağrı noktalarından değil.**
     Talimat "T-19'un bıraktığı slot doldurulur" diyor; slot `children` prop'u.
     Üç çağrı noktasına aynı JSX'i geçirmek, T-19'un ortadan kaldırdığı "aynı
     iyileştirmeyi üç yere ayrı ayrı yaz" sorununu geri getirirdi. Bölüm bu
     yüzden panelin kendi içinde, `metin` varsa basılıyor; `children` prop'u
     ileride tek bir çağrı noktasına özgü eklenti için duruyor. Üç çağrı
     noktasının üçü de tarayıcıda doğrulandı.

  2. **`src/test/setup.ts`'e `localStorage` yaması eklendi.** Bu kurulumdaki
     jsdom `localStorage`'ı **tanımsız** bırakıyor (Node'un deneysel global'i
     jsdom'unkini gölgeliyor). Uygulama kodu buna karşı zaten korumalı, ama
     koruma sessizce devreye girdiği için depoya yazan hiçbir davranış test
     edilemiyordu — T-20'nin anahtar yönetimi tam olarak bu. Bellek içi bir
     `Storage` uygulaması konuldu, her testten önce sıfırlanıyor. Yan fayda:
     `wiki.ts`'in çevrimdışı yedeği de artık test edilebilir (T-21 adayı).

  3. **Kapsam dışı ama yeşil kapı için zorunluydu: 15 dosyanın satır sonu —
     ve bu bir depo değil, çalışma kopyası onarımı.** `npm run kontrol` bu
     talimattan **önce de kırmızıydı**: 15 kaynak dosyası bu çalışma kopyasında
     CRLF ile duruyordu (dosyalar `.gitattributes` eklenmeden önce yazılmış),
     Prettier ise `endOfLine: "lf"` istiyor, dolayısıyla `format:check` daha ilk
     adımda düşüyordu. Dosyalar LF'e çevrildi ve kapı yeşile döndü.

     **Bu değişiklik commit edilemiyor ve edilmesine gerek de yok.**
     `.gitattributes`'taki `* text=auto eol=lf` yüzünden git karşılaştırmada iki
     tarafı da normalize ediyor: `git status`, `git diff --cached` ve hatta
     `git add --renormalize .` bu 15 dosya için **hiçbir fark üretmiyor**
     (HEAD'deki blob hâlâ CRLF taşısa bile). Temiz bir klon zaten `eol=lf`
     sayesinde LF alır, yani sorun yalnızca bu makinedeki eski kopyaya özgüydü.
     Bu yüzden ayrı bir commit **yok** — kayda geçirilmesinin sebebi, ileride
     aynı belirti görülürse ("kontrol kırmızı ama ben hiçbir şeye dokunmadım")
     doğru yere bakılabilsin diye.

     **Alınacak ders:** `npm run kontrol` talimatın **başında** da çalıştırılmalı;
     yoksa önceden var olan kırmızı kapı, o oturumda yapılan işin verdiği zarar
     gibi görünüyor.

  4. **Test kuklalarında `AIza` öneki kullanılmadı.** Kabul kriteri
     `grep -rn "AIza" .` → 0 sonuç istiyor; bu grep bir sızıntı tuzağıdır ve
     gerçeğe benzeyen sahte anahtar onu işe yaramaz hâle getirir. Kuklalar
     `KUKLA-ANAHTAR` biçiminde. Aynı sebeple `YapayZekaBolumu.tsx`'teki
     yorumlar ikinci grep'in aradığı sözcükleri **yazmıyor**; iki doğrulama
     grep'i de gerçekten boş dönüyor.

  5. **Ayarlar ekranı olayla açılıyor, prop zinciriyle değil.** Panel ağacın
     çok derininde; `ui.tsx`'teki `toast` deseni (`window` üzerinde özel olay)
     tekrarlandı. `useSyncExternalStore` sayesinde anahtar kaydedilir
     kaydedilmez açık paneller kendiliğinden "Yapay zekâya sor"a dönüyor;
     anahtar silinince de uyarıya geri dönüyor — ikisi de tarayıcıda doğrulandı.

  6. **Canlı hata yolu gerçek uç noktada doğrulandı.** Geçersiz anahtarla
     Google 400 döndürdü, panel "Anahtar geçersiz görünüyor. Ayarlardan
     kontrol edin." bastı; Vikipedi metni, künye, 4 kaynak çipi ve arama
     çıkışı yerinde kaldı, soru kutusu tekrar denenebilir durumdaydı. CORS
     sorunu yok — tarayıcıdan `x-goog-api-key` başlığıyla çağrı çalışıyor.

  7. **Tarayıcı ekran görüntüsü alınamadı.** Önizleme panelinin ekran
     yakalaması bu sayfada boş kare / zaman aşımı veriyor (sayfa sürekli
     animasyonlu: saniyelik saat, `glowfield`, `noise`, nabız noktası).
     Doğrulama bu yüzden metin tabanlı yapıldı: `read_page`, erişilebilirlik
     ağacı ve DOM sorguları. Üç gün ve üç çağrı noktası bu yolla doğrulandı.

- **Sonraki talimata not:**

  - **T-21'e:** Karanlık Dosyalar'ın `DetayPaneli` çağrısı hâlâ `sayfalar={[]}`
    ile gidiyor (T-18'in açık bıraktığı iş): otomatik dosyalarda metin
    `pages[0].extract`ten geliyor ama hangi sayfa olduğu `CaseFile`'a
    yazılmıyor, dolayısıyla çip listesi ve metin künyesi boş. Aynı kayıtta YZ
    bölümü çalışıyor (bağlam `c.detail`) ama kullanıcı bağlamın hangi maddeden
    geldiğini göremiyor. `CaseFile`'a bir `kaynakSayfa` alanı eklemek ikisini
    birden çözer. Ayrıca (2) numaralı sapma `wiki.ts` çevrimdışı yedeğini test
    edilebilir hâle getirdi.
  - **Genel:** Sohbet Kartları ve Rekorlar Kasası `DetayPaneli` kullanmıyor,
    dolayısıyla YZ bölümü oralarda yok. Talimatın "Kapsam Dışı" tablosu
    Rekorlar'ı zaten T-23 sonrasına bırakıyor.
  - **Sağlayıcı değişimi:** arama destekli bir modele geçilecekse değişecek
    yer `gemini.ts`'in yanına yeni bir dosya + `index.ts`'teki tek satır.
    `YapayZekaBolumu` hiçbir sağlayıcının adını bilmiyor.
