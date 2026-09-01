# PLAN-02 · İçerik Derinliği ve Araştırma Katmanı

| Alan               | Değer                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **Oluşturulma**    | 2026-08-24                                                                                      |
| **Durum**          | 🟡 **Sürüyor — 5 / 7** (FAZ 1, 2 ve 3 tamamlandı)                                               |
| **Son hareket**    | 2026-09-01 · **T-20 tamamlandı** — çalışma zamanı yapay zekâ katmanı; FAZ 3 bitti (U-6 kapandı) |
| **Talimat sayısı** | 7 (T-16 … T-22)                                                                                 |
| **Faz sayısı**     | 4                                                                                               |
| **Dayanak**        | [`../Dokumanlar/ANALIZ-RAPORU-02.md`](../Dokumanlar/ANALIZ-RAPORU-02.md)                        |
| **İş akışı**       | [`../Dokumanlar/CALISMA-SISTEMI.md`](../Dokumanlar/CALISMA-SISTEMI.md)                          |
| **Tetikleyen**     | Kullanıcı geri bildirimi, 2026-08-24                                                            |

---

## 1. Planın Amacı

PLAN-01 uygulamanın **kabuğunu** tamamladı. PLAN-02 **içini** doldurur.

Kullanıcının 2026-08-24'te bildirdiği altı somut şikayet bu planın çıkış noktasıdır:

1. "Detayı açlar, çalışmıyor" → K-6
2. "Hâlâ tam ismi yazmıyor, HTML kodu olarak yazıyor" → K-7
3. "Vikipedi'ye yönlendirmesi çok geniş" → O-14
4. "Dosyayı aç dediğimde aynı şey altta tekrar yazıyor" → K-6 + O-15
5. "Kapandı yazıyor, olay çözüldü mü demek?" → O-15
6. "Daha detaylı öğrenebileceğim bir yer lazım" → U-6

Plan bittiğinde:

- Vikipedi'nin indirdiği **her metin ekrana çıkacak** — bugün %100'ü atılıyor.
- Hiçbir kişi adı HTML olarak görünmeyecek.
- Her olay için **tüm** ilgili kaynak sayfalar açıklamalarıyla listelenecek; tek bir yanlış tahmin dayatılmayacak.
- Otomatik üretilmiş hiçbir kayıt, editör hükmü taşıyormuş gibi görünmeyecek.
- Kullanıcı, sayfadan ayrılmadan bir olay hakkında **açıklama okuyabilecek ve soru sorabilecek.**
- Testler gerçek API yanıtıyla beslenecek; alan sözleşmesi kırılırsa test kırmızıya dönecek.

---

## 2. Kapsam Dışı (bu planda yapılmayacak)

| Konu                                               | Neden                                                                | Ne zaman          |
| -------------------------------------------------- | -------------------------------------------------------------------- | ----------------- |
| Backend / veritabanı                               | YZ katmanı dahil her şey istemci taraflı çözülüyor (CORS doğrulandı) | Yayına alınırsa   |
| Uygulamanın yayına alınması                        | Bilinçli karar — yerel kullanılıyor                                  | Kullanıcı isterse |
| Editör içeriğinin 60 günden fazlaya çıkarılması    | Elle yazım işi, ayrı bir plan konusu                                 | PLAN-03           |
| **Yapay zekâ ile toplu içerik üretimi**            | `ICERIK-SABLONU.md` §0 yasağı **yürürlükte kalıyor** — bkz. §5       | —                 |
| Ayrı detay sayfası / rota (`/24-agustos/olay/...`) | Yerinde panel tercih edildi (kullanıcı kararı)                       | PLAN-03           |
| Kullanıcı hesabı, favori, not                      | Ürün henüz gerektirmiyor                                             | —                 |
| Çoklu dil arayüzü (i18n)                           | Hedef kitle Türkçe                                                   | —                 |
| Tasarım dilinin değiştirilmesi                     | Mevcut tasarım güçlü, korunacak                                      | —                 |

---

## 3. Fazlar ve Talimatlar

### FAZ 1 — Veri Onarımı

> Uygulamanın zaten indirdiği veriyi ekrana çıkarmak. Bu faz tek başına kullanıcının
> altı şikayetinden dördünü çözer ve sonraki iki fazın girdisini üretir.

| Talimat      | Başlık                                                   | Bulgular            | Öncelik   | Süre |
| ------------ | -------------------------------------------------------- | ------------------- | --------- | ---- |
| ~~**T-16**~~ | ~~Vikipedi veri sözleşmesi düzeltmesi~~ ✅               | K-6, K-7, O-16, m-9 | 🔴 Kritik | ~3s  |
| ~~**T-17**~~ | ~~Karanlık dosyalarda kaynak dürüstlüğü ve kontrast~~ ✅ | O-15, O-10          | 🟠 Yüksek | ~2s  |

> ✅ **T-16 kapandı (2026-08-31).** `extract` artık okunuyor: Sohbet Kartları'nda
> "Bugün Doğanlar" ve "Aramızdan Ayrılanlar" üretiliyor, kişi adları düz metin,
> `description` alt başlık olarak görünüyor. Testler gerçek API yanıtından üretilmiş
> bir fixture'dan besleniyor. Devir notları T-17, T-18 ve T-19 dosyalarına işlendi.
> Ayrıntı: [`Tamamlandı/T-16-vikipedi-veri-sozlesmesi.md`](Tamamland%C4%B1/T-16-vikipedi-veri-sozlesmesi.md)

**T-16 kapsamı:** `WikiPage.excerpt` → `extract` (31 nokta) · `displaytitle` → `normalizedtitle`
(monogram, `alt`, arama dahil) · `description` kişi kartlarında alt başlık olarak gösterilir ·
`src/lib/__fixtures__/` altına gerçek API yanıtının kırpılmış kopyası konur, `wiki.test.ts`
ondan beslenir.

> ✅ **T-17 kapandı (2026-08-31) — FAZ 1 bitti.** Arşiv taramasından gelen dosyalar
> artık "KAPANDI" hükmü vermiyor (`ARŞİV KAYDI`), sahte konum yazmıyor ve altın
> "Editör" rozetinin yanında nötr "Otomatik" rozetiyle ayrılıyor. Arşiv etiketi eğik
> mürekkep damgası biçiminden de çıkarıldı. O-10'un üç kontrast kaydı ve listede
> olmayan iki nokta daha AA'nın üstüne alındı; `--color-brand` dolgu rengi olarak
> aynen duruyor.
> Ayrıntı: [`Tamamlandı/T-17-karanlik-dosya-durustlugu.md`](Tamamland%C4%B1/T-17-karanlik-dosya-durustlugu.md)

**T-17 kapsamı:** Otomatik dosyalarda `status: "KAPANDI"` kaldırılır, yerine kaynağı belli eden
nötr bir işaret gelir · `location` sabiti dürüst bir ifadeyle değişir · Zaman Tüneli ve Bilim
bölümlerindeki gibi bir **"Otomatik" / "Editör" rozeti** eklenir · `detail === summary` durumunda
detay bölümü hiç açılmaz · `text-brand` kontrast oranı AA eşiğine (4,5:1) çıkarılır.

---

### FAZ 2 — Kaynak ve Bağlantı

| Talimat  | Başlık                              | Bulgular | Öncelik   | Süre |
| -------- | ----------------------------------- | -------- | --------- | ---- |
| **T-18** | İlgili sayfalar ve kaynak çıkışları | O-14     | 🟠 Yüksek | ~3s  |

**Yaklaşım — tahmin etme, seçenek sun.** ANALİZ-RAPORU-02 §O-14'te puanlama sezgiseli
prototiplendi ve **reddedildi** (11 değişiklikten 3'ü bozuyordu). Bunun yerine üç katman:

1. **Tüm ilgili sayfalar çip olarak listelenir**, her biri `description` alt başlığıyla:
   `Beyaz Saray · ABD başkanının resmî konutu` / `Washington, DC · ABD'nin başkenti` / `İngiltere · …`
2. **"Vikipedi'de ara"** düğmesi — olay metniyle gerçek arama sayfasını açar.
3. **EN çapraz eşlemesi** — EN beslemesinde aynı yıla ait olay makalesi varsa `langlinks` ile
   TR karşılığı çözülür ve _"Bu olay hakkında"_ olarak öne çıkarılır (doğrulandı: `Burning_of_Washington`
   → `Washington Yangını`). İsabet etmezse sessizce atlanır, uydurma yapılmaz.

---

### FAZ 3 — Derinlik

| Talimat      | Başlık                                        | Bulgular | Öncelik | Süre |
| ------------ | --------------------------------------------- | -------- | ------- | ---- |
| ~~**T-19**~~ | ~~Zengin detay paneli (Vikipedi tabanlı)~~ ✅ | U-6      | 🟡 Orta | ~4s  |
| ~~**T-20**~~ | ~~Yapay zekâ araştırma katmanı~~ ✅           | U-6      | 🟡 Orta | ~5s  |

**T-19 kapsamı:** "Detayı aç" / "Dosyayı aç" panelleri ortak bir `DetayPaneli` bileşenine
taşınır. Panel şunları gösterir: `extract` metni · görsel (`thumbnail`) · T-18'in kaynak çipleri ·
talep üzerine `page/summary` çağrısıyla daha uzun özet (CORS doğrulandı, çalışıyor).
T-20'nin YZ bölümü bu panelin içine oturacak.

**T-20 kapsamı:** Panelin altında **"Yapay zekâya sor"** düğmesi ve serbest soru kutusu.

> ✅ **T-19 ve T-20 kapandı (2026-09-01) — FAZ 3 bitti.** Üç detay görünümü tek
> `DetayPaneli`'nde birleşti ve panelin ayırdığı yuvaya çalışma zamanı yapay zekâ
> katmanı oturdu. Katman sağlayıcıdan bağımsız (`src/lib/yapayzeka/`), anahtar
> kullanıcının ve yalnızca `localStorage`'da, istek yalnızca düğmeye basınca
> gidiyor, çıktı leylak "YZ ÜRETİMİ" rozetiyle ve doğrulama uyarısıyla basılıyor.
> **§0 yasağı yürürlükte:** depoya hiçbir YZ metni yazılmıyor.
> Halüsinasyon elle testi gerçek anahtar gerektirdiği için kullanıcıya bırakıldı —
> ayrıntı: [`Tamamlandı/T-20-yapay-zeka-katmani.md`](Tamamland%C4%B1/T-20-yapay-zeka-katmani.md)

| Karar      | Değer                                               | Gerekçe                                                                                                            |
| ---------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Sağlayıcı  | **Google Gemini** (Flash / Flash-Lite)              | Ücretsiz katman — kullanıcı kararı                                                                                 |
| Mimari     | Tarayıcıdan doğrudan çağrı, backend yok             | CORS canlı doğrulandı                                                                                              |
| Anahtar    | Kullanıcının kendi anahtarı, `localStorage`         | Uygulama yerel çalışıyor; XSS yüzeyi yok (`dangerouslySetInnerHTML`/`innerHTML`/`eval` kod tabanında hiç geçmiyor) |
| Tetikleme  | **Sadece kullanıcı basınca**                        | Otomatik çağrı = günde 40+ boşuna istek                                                                            |
| Bağlam     | Vikipedi `extract` metni isteme gömülür             | Halüsinasyon azaltma — bkz. §5                                                                                     |
| Kod yapısı | Sağlayıcıdan bağımsız arayüz (`src/lib/yapayzeka/`) | İleride arama destekli bir sağlayıcı eklemek küçük iş kalsın                                                       |
| Etiketleme | Çıktı görsel olarak "YZ üretimi" işaretlenir        | 3. ürün ilkesi: kaynağı gizleme                                                                                    |

**Anahtar girişi kullanıcı tarafından yapılır.** Uygulamaya bir ayarlar ekranı eklenir;
anahtarı kullanıcı kendisi yapıştırır. Anahtar hiçbir zaman depoya, sürüm kontrolüne veya
belgelere yazılmaz; `.env`'e de konmaz (istemci taraflı derlemede `.env` gizli değildir).

---

### FAZ 4 — Devir ve Temizlik

> PLAN-01'den devredilen dört bulgu.

| Talimat  | Başlık                              | Bulgular             | Öncelik  | Süre |
| -------- | ----------------------------------- | -------------------- | -------- | ---- |
| **T-21** | Devredilen içerik bulguları         | O-11, O-12, m-7, m-8 | 🟢 Düşük | ~2s  |
| **T-22** | `react-router` güvenlik yükseltmesi | O-13                 | 🟢 Düşük | ~2s  |

**T-21:** `holidays` alanındaki Vikipedi şablon artığı kayıtların ayıklanması (`namespace.id !== 0`
olanlar + tek harflik metinler) · `allScience`'ın editör kayıtlarını `matchKeys` ile ayıklaması
(`mergedEvents`'teki mevcut korumanın aynısı).

**T-22:** `react-router-dom` 6 → 7 kırıcı yükseltmesi. `src/main.tsx`, `src/lib/slug.ts` ve
`App.tsx`'in yönlendirme çağrıları etkilenebilir. **En sona bırakıldı** — kırıcı bir yükseltme,
diğer fazların doğrulamasını bulandırmasın.

---

## 4. Bağımlılık Sırası

```
T-16 (veri onarımı)  ─── zorunlu ilk adım, hepsinin girdisi
   │
   ├──► T-17 (karanlık dosya dürüstlüğü)   ── T-16'nın detail/summary düzeltmesine bağlı
   │
   └──► T-18 (kaynak çipleri)              ── T-16'nın description alanına bağlı
            │
            └──► T-19 (detay paneli)       ── T-18'in çiplerini içine alır
                     │
                     └──► T-20 (YZ katmanı) ── T-19'un panelinin içine oturur
                                              ── T-16'nın extract metnini bağlam olarak kullanır

T-21, T-22  ── bağımsız, herhangi bir sırada; T-22 en sona önerilir
```

---

## 5. Yapay Zekâ Politikası — Açık Kayıt

`ICERIK-SABLONU.md` §0 şunu diyor:

> **"Yapay zekâ ile toplu içerik üretimi yasaktır.** Editör kalitesi korunmalı; her gün elle
> yazılır, her olgu Vikipedi TR + EN karşılaştırmasıyla doğrulanır."

PLAN-01 de yapay zekâyı _"Ayrı değerlendirme"_ notuyla kapsam dışı bırakmıştı.

**Bu plan §0 yasağını kaldırmıyor.** T-20 farklı bir şey yapıyor:

| §0'ın yasakladığı                                       | T-20'nin yaptığı                                                   |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| `src/data/gunler/*.ts` içine YZ ile toplu içerik yazmak | Depoya hiçbir YZ metni yazılmaz                                    |
| Editör içeriği gibi görünen üretilmiş olgular           | Çıktı açıkça "YZ üretimi" etiketli, editör rozetinden ayrı         |
| Doğrulanmamış olgu üretimi                              | Model, önüne konan Vikipedi metnini açıklar; kaynağı ekranda durur |
| Kalıcı, sürüm kontrollü içerik                          | Geçici, isteğe bağlı, kullanıcı tetiklemeli                        |

**Halüsinasyon riski ve azaltma.** Gemini ücretsiz katmanında web araması yoktur; model yalnızca
kendi hafızasından konuşur. Niş Türkiye tarihi konularında (örn. 1958 Bursa Kapalı Çarşı yangını)
bu **gerçek bir uydurma riskidir.** Azaltma yöntemi, isteme Vikipedi `extract` metnini bağlam
olarak gömmek ve görevi yeniden tanımlamaktır:

```
Şu Vikipedi metnine dayanarak olayı bir yayıncının anlatacağı gibi açıkla.
Metinde olmayan bilgi ekleme. Emin olmadığın yeri "kaynakta belirtilmemiş"
olarak işaretle.

[extract metni]
```

Böylece görev "hatırla"dan "açıkla"ya döner. Bu, K-6 düzeltilmeden **teknik olarak mümkün değildir**
— `extract` bugün hiç okunmuyor. T-16'nın T-20'den önce gelmesinin asıl sebebi budur.

**Onay kaydı:** Kullanıcı 2026-08-24 tarihli oturumda çalışma zamanı yapay zekâ katmanını
açıkça istedi ("o anda orada o olayla ilgili kısa bir özet oluştursa veya o olay hakkında farklı
bir soru sorabilsem"), sağlayıcı olarak ücretsiz katmanı nedeniyle Gemini'yi seçti ve
Vikipedi içeriğinin otomatik, YZ'nin istek üzerine çalışmasını onayladı.

---

## 6. İlerleme Tablosu

| #           | Talimat dosyası                                                                          | Faz | Bulgular             | Durum             | Tarih      |
| ----------- | ---------------------------------------------------------------------------------------- | --- | -------------------- | ----------------- | ---------- |
| ~~T-16~~ ✅ | [`T-16-vikipedi-veri-sozlesmesi.md`](Tamamland%C4%B1/T-16-vikipedi-veri-sozlesmesi.md)   | 1   | K-6, K-7, O-16, m-9  | ✅ **Tamamlandı** | 2026-08-31 |
| ~~T-17~~ ✅ | [`T-17-karanlik-dosya-durustlugu.md`](Tamamland%C4%B1/T-17-karanlik-dosya-durustlugu.md) | 1   | O-15, O-10           | ✅ **Tamamlandı** | 2026-08-31 |
| ~~T-18~~ ✅ | [`T-18-kaynak-ve-ilgili-sayfalar.md`](Tamamland%C4%B1/T-18-kaynak-ve-ilgili-sayfalar.md) | 2   | O-14                 | ✅ **Tamamlandı** | 2026-09-01 |
| ~~T-19~~ ✅ | [`T-19-detay-paneli.md`](Tamamland%C4%B1/T-19-detay-paneli.md)                           | 3   | U-6                  | ✅ **Tamamlandı** | 2026-09-01 |
| ~~T-20~~ ✅ | [`T-20-yapay-zeka-katmani.md`](Tamamland%C4%B1/T-20-yapay-zeka-katmani.md)               | 3   | U-6                  | ✅ **Tamamlandı** | 2026-09-01 |
| T-21        | [`T-21-devredilen-icerik-bulgulari.md`](T-21-devredilen-icerik-bulgulari.md)             | 4   | O-11, O-12, m-7, m-8 | ⬜ Bekliyor       | —          |
| T-22        | [`T-22-react-router-yukseltmesi.md`](T-22-react-router-yukseltmesi.md)                   | 4   | O-13                 | ⬜ Bekliyor       | —          |

> **Uygulama sırası:** T-16 → T-17 → T-18 → T-19 → T-20 → T-21 → T-22.
> T-16 zorunlu ilk adımdır (§4). T-21 bağımsızdır, araya alınabilir.
> T-22 kırıcı bir yükseltme olduğu için **en sonda** kalmalıdır.

**Toplam tahmini süre:** ~21 saat

---

## 7. Riskler ve Karşı Önlemler

| Risk                                                                | Olasılık | Karşı önlem                                                                                                                                                                      |
| ------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~`excerpt` → `extract` yeniden adlandırması bir noktayı atlar~~ ✅ | Orta     | **Gerçekleşmedi.** 31 noktanın tamamı güncellendi; üretim kodunda `grep` sıfır sonuç veriyor. Kalan geçişler yalnızca sözleşme testinin kendi iddiasında (bkz. T-16 Sapmalar §2) |
| Gerçek API fixture'ı büyük olur, test yavaşlar                      | Düşük    | Yanıt kırpılır: her bölümden 3 öğe, ~15 kB                                                                                                                                       |
| API alan sözleşmesi ileride yine değişir                            | Düşük    | Gerçek yanıttan beslenen fixture + alan varlığını doğrulayan test                                                                                                                |
| YZ anahtarı yanlışlıkla depoya girer                                | Düşük    | `.gitignore` kontrolü + anahtar yalnızca `localStorage`, hiç dosyaya yazılmaz (kabul kriteri)                                                                                    |
| YZ çıktısı yanlış olgu üretir                                       | **Orta** | Vikipedi bağlamlı istem + "YZ üretimi" etiketi + kaynak metnin panelde görünür kalması                                                                                           |
| Gemini ücretsiz katman kotası dolar                                 | Orta     | Hata durumu kullanıcıya Türkçe açıklanır; panel Vikipedi içeriğiyle çalışmaya devam eder                                                                                         |
| T-22 yönlendirmeyi kırar                                            | Orta     | En sona alındı; ayrı dalda, 3 günde görsel doğrulama                                                                                                                             |

---

## 8. Kapanış Özeti

> Plan tamamlandığında doldurulacak.
