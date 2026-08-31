# T-20 · Yapay Zekâ Araştırma Katmanı

| Alan             | Değer                               |
| ---------------- | ----------------------------------- |
| **Faz**          | FAZ 3 — Derinlik                    |
| **Öncelik**      | 🟡 Orta                             |
| **Tahmini süre** | ~5 saat                             |
| **Bağımlılık**   | **T-16 ve T-19 tamamlanmış olmalı** |
| **İlgili bulgu** | U-6                                 |
| **Durum**        | ⬜ Bekliyor                         |

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

- [ ] `src/lib/yapayzeka/` sağlayıcıdan bağımsız arayüzle kurulu
- [ ] Anahtar yalnızca `localStorage`'da; `grep -rn "AIza" .` → **0 sonuç**
- [ ] `.env` / `.env.example` içinde YZ anahtarı **yok**
- [ ] Ayarlar ekranından anahtar girilebiliyor ve silinebiliyor
- [ ] Sayfa yüklenirken **hiçbir** YZ isteği çıkmıyor (Network sekmesi)
- [ ] İstek yalnızca düğmeye basılınca gidiyor
- [ ] İsteme Vikipedi `extract` metni bağlam olarak gömülüyor
- [ ] Çıktı "YZ ÜRETİMİ" rozetli, Editör/Otomatik rozetlerinden farklı
- [ ] Dört hata durumu da Türkçe mesaj veriyor, panel çökmüyor
- [ ] `grep -rn "dangerouslySetInnerHTML\|innerHTML\|eval(" src/` → **0 sonuç**
- [ ] `npm run kontrol` yeşil

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

> Talimat bitince doldurulur.

- **Tamamlanma tarihi:**
- **Değişen dosyalar:**
- **Seçilen model ve sürümü:**
- **Halüsinasyon testi sonucu:**
- **Sapmalar / notlar:**
- **Sonraki talimata not:**
