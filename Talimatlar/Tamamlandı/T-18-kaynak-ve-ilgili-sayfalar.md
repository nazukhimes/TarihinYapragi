# T-18 · İlgili Sayfalar ve Kaynak Çıkışları

| Alan             | Değer                                                        |
| ---------------- | ------------------------------------------------------------ |
| **Faz**          | FAZ 2 — Kaynak ve Bağlantı                                   |
| **Öncelik**      | 🟠 Yüksek                                                    |
| **Tahmini süre** | ~3 saat                                                      |
| **Bağımlılık**   | **T-16 tamamlanmış olmalı** (`description` alanı buna bağlı) |
| **İlgili bulgu** | O-14                                                         |
| **Durum**        | ✅ **Tamamlandı** — 2026-09-01                               |

---

## 🎯 Amaç

Bir olayın Vikipedi bağlantısında **tek bir tahmini dayatmayı** bırakmak.

Talimat bittiğinde: kullanıcı olayla ilgili tüm sayfaları açıklamalarıyla birlikte
görecek ve hangisini açacağına kendisi karar verecek; ayrıca olay metniyle
Vikipedi'de arama yapabilecek.

---

## 📍 Mevcut Durum

### Kanıt 1 — ilk URL'li sayfa seçiliyor

`src/hooks/useGunVerisi.ts:85`:

```ts
const page = item.pages?.find((p) => p.extract || p.content_urls?.desktop?.page);
```

> **T-16 notu (2026-08-31):** Bu satır T-16'da `p.excerpt` → `p.extract` olarak
> düzeltildi; yukarıdaki alıntı güncel hâlidir. Seçim **mantığı** değişmedi —
> Kanıt 1'deki sorun aynen duruyor. Ama artık `p.extract` gerçekten dolu geldiği
> için `find` çoğu olayda **ilk sayfada** duruyor: eskiden koşulun ilk yarısı hep
> `false` olduğundan seçim fiilen "URL'si olan ilk sayfa"ydı. Yani yanlış sayfa
> seçimi T-16 sonrası biraz daha sık ilk sayfaya kayıyor.

Wikimedia `pages` dizisini **olay metnindeki geçiş sırasına** göre doldurur; ilk
geçen varlık genellikle bir ülke ya da şehirdir.

**Kullanıcının bildirdiği örnek** (24 Ağustos, TR beslemesi):

```
1814 · "İngiliz Birlikleri, Washington'u işgal etti, White House ve pek çok
        başka binayı ateşe verdi."

  pages[0] İngiltere      · "Batı Avrupa'daki bir Birleşik Krallık ülkesi"   ← SEÇİLEN
  pages[1] Washington, DC · "Amerika Birleşik Devletleri'nin başkenti"
  pages[2] Beyaz Saray    · "ABD başkanının resmî konutu ve çalışma yeri"
```

Bağlantının gerçek `href`'i: `https://tr.wikipedia.org/wiki/İngiltere`

Kullanıcının ifadesiyle: _"Vikipedi'ye yönlendirmesi çok geniş."_

### Kanıt 1b — yıl maddeleri de `pages` içine karışıyor _(T-16'da gözlendi)_

T-16'nın fixture'ında (31 Ağustos, TR beslemesi) `deaths` öğelerinin ikinci/üçüncü
sayfası düzenli olarak bir **yıl maddesi**:

```
deaths[0] pages[0] Sol Bamba · "Fransız futbolcu"     ← kişi
          pages[1] 1985      · "yıl"                   ← yıl maddesi
deaths[1] pages[0] Kadir Baykenov
          pages[1] 1944      · "yıl"
deaths[2] pages[0] Lorraine Botha
          pages[1] 1965      · "yıl"
```

Bugün görünmüyorlar çünkü kod yalnızca `pages[0]`ı okuyor. **T-18 Katman 1 tüm
sayfaları çip olarak basacağı için bunlar doğrudan çöp çip hâline gelecek** —
`description === "yıl"` (ve EN'de `"year"`) bir eleme koşulu olarak
düşünülmelidir. T-16 bunu düzeltmedi: kapsamı dışındaydı.

### Kanıt 2 — otomatik puanlama denendi ve **reddedildi**

ANALIZ-RAPORU-02 §O-14'te bir "özgüllük puanlaması" prototiplendi (çok kelimeli
başlık +, açıklamada olay yılı +, "ülke/şehir/dil/meslek" −). 24 Ağustos'un çok
sayfalı 28 olayına uygulandığında **11 olayda farklı sayfa seçti, 3'ünde sonucu
bozdu.** Net bir iyileşme yok.

> **Bu talimat puanlama sezgiseli yazmayacaktır.** Karar: tahmin etme, **seçenek sun.**

### Kanıt 3 — `pages` üçe kırpılıyor

`src/lib/wiki.ts:90`:

```ts
pages: (r.pages || []).slice(0, 3),
```

Üç çip için yeterli olabilir ama bilinçli bir karar olarak gözden geçirilmeli.

---

## ✅ Yapılacaklar

### Katman 1 — tüm ilgili sayfalar çip olarak

1. `MergedEvent`'in tek `page` alanını **`pages` dizisine** çevir
   (`sections.tsx:38`, `useGunVerisi.ts:85-95`). Tek sayfa seçimi kaldırılır.

2. Detay alanında (`TimelineSection`, `sections.tsx:167-175`) her sayfa bir çip
   olarak render edilir; çipin alt satırında API'nin `description` alanı durur:

   ```
   [ Beyaz Saray · ABD başkanının resmî konutu ]
   [ Washington, DC · ABD'nin başkenti ]
   [ İngiltere · Batı Avrupa'daki bir Birleşik Krallık ülkesi ]
   ```

   `description` boşsa yalnızca başlık gösterilir. Her çip `content_urls.desktop.page`
   adresine `target="_blank" rel="noopener noreferrer"` ile açılır.

3. `wiki.ts:90`'daki `slice(0, 3)` sınırını gözden geçir. Öneri: **5**. Karar
   Tamamlanma Kaydı'na gerekçesiyle yazılır.

### Katman 2 — "Vikipedi'de ara"

4. Çiplerin yanına bir **"Vikipedi'de ara"** düğmesi eklenir. Olay metnini
   Vikipedi'nin gerçek arama sayfasına taşır:

   ```
   https://tr.wikipedia.org/w/index.php?search=<olay metni, encodeURIComponent>
   ```

   Bu, hiçbir sayfanın olayın kendisi olmadığı durumların (1958 Bursa Kapalı Çarşı
   yangını → yalnızca "Bursa" sayfası) tek dürüst çıkışıdır.

### Katman 3 — EN çapraz eşlemesi

5. EN beslemesinde aynı yıla ait bir **olay makalesi** varsa, `langlinks` ile TR
   karşılığı çözülür ve çiplerin başında _"Bu olay hakkında"_ olarak öne çıkarılır.

   Doğrulanmış örnek: `Burning_of_Washington` → `Washington Yangını`

   ```
   https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&lllang=tr&llprop=url&titles=<EN başlık>&format=json&origin=*
   ```

   > **T-18 notu (2026-09-01):** Yukarıdaki adres uygulama sırasında düzeltildi.
   > Talimatın ilk hâli `tr.wikipedia.org` ve `lltang` yazıyordu; ikisi de yanlış —
   > parametrenin adı `lllang` ve sorgu EN wiki'ye sorulur (TR wiki'de
   > `Burning of Washington` sayfası yok). `llprop=url` de eklendi ki TR adresi
   > başlıktan elle kurulmasın. Ayrıntı: Tamamlanma Kaydı, sapma 1-2.

6. **İsabet etmezse sessizce atlanır.** Uydurma yapılmaz, "bulunamadı" satırı
   gösterilmez.

---

## 🚫 Kapsam Dışı

| Konu                                                     | Hangi talimata ait                        |
| -------------------------------------------------------- | ----------------------------------------- |
| Otomatik "en doğru sayfa" puanlaması                     | **Hiçbiri — reddedildi** (O-14, yukarıda) |
| `extract` metninin gösterimi                             | **T-16** (önce yapılmış olmalı)           |
| Karanlık dosya rozetleri ve damgası                      | **T-17**                                  |
| Panelin ortak bileşene taşınması, `page/summary` çağrısı | **T-19**                                  |
| Yapay zekâ                                               | **T-20**                                  |
| Ayrı detay rotası (`/24-agustos/olay/...`)               | Plan §2 — kapsam dışı                     |

---

## ☑️ Kabul Kriterleri

- [x] 24 Ağustos 1814 olayında **üç sayfa da** çip olarak görünüyor
- [x] Her çipte `description` alt başlığı var (boşsa yalnızca başlık)
- [x] Tek bir sayfa "doğru cevap" olarak dayatılmıyor
- [x] "Vikipedi'de ara" düğmesi olay metniyle gerçek arama sayfasını açıyor
- [x] `Burning_of_Washington` örneğinde "Bu olay hakkında" çipi TR makalesine gidiyor
- [x] Eşleşme yoksa hiçbir ek satır çıkmıyor
- [x] Tüm dış bağlantılarda `rel="noopener noreferrer"` var
- [x] `npm run kontrol` yeşil

---

## 🧪 Doğrulama

**Kanıt komutu — olayın sayfalarını ham hâliyle görün:**

```bash
curl -s "https://api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/events/08/24"
```

**EN çapraz eşleme kontrolü:**

```bash
curl -s "https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&lllang=tr&llprop=url&titles=Burning_of_Washington&format=json&origin=*"
```

> Düzeltilmiş adres — gerekçesi için yukarıdaki T-18 notuna bakın. Beklenen yanıt:
> `"langlinks":[{"lang":"tr","url":"https://tr.wikipedia.org/wiki/Washington_Yang%C4%B1n%C4%B1","title":"Washington Yangını"}]`

**Tarayıcıda (üç gün):**

| Gün            | Beklenen                                                                       |
| -------------- | ------------------------------------------------------------------------------ |
| **24 Ağustos** | 1814 olayında üç çip, açıklamalarıyla; "Bu olay hakkında → Washington Yangını" |
| **7 Mart**     | Tek sayfalı olaylarda tek çip + "Vikipedi'de ara" düğmesi                      |
| **29 Şubat**   | Çip alanı boş olaylarda bozulmuyor                                             |

```bash
npm run kontrol
```

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-09-01

- **Değişen dosyalar:**

  | Dosya                          | Ne değişti                                                                                                                       |
  | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
  | `src/lib/wiki.ts`              | `PAGES_LIMIT = 5`; `yilMaddesiMi()` ile yıl maddeleri `normalize()` içinde, kırpmadan **önce** eleniyor                          |
  | `src/lib/olayMakalesi.ts`      | **Yeni.** Katman 3 — EN beslemesinden olay makalesi bulma, `langlinks` ile TR karşılığını çözme, önbellek ve `useOlayMakaleleri` |
  | `src/lib/olayMakalesi.test.ts` | **Yeni.** Saf yardımcılar için 35 test                                                                                           |
  | `src/lib/wiki.test.ts`         | `yilMaddesiMi` için 8 test; kırpma testi `PAGES_LIMIT`e bağlandı                                                                 |
  | `src/hooks/useGunVerisi.ts`    | Tek sayfa seçimi (`pages.find(...)`) kaldırıldı — tüm sayfalar geçiyor; `lang` alanı eklendi; arama `olayOzeti()` kullanıyor     |
  | `src/components/sections.tsx`  | `MergedEvent.page` → `pages: OlayKaynagi[]`; `olayOzeti()`, `wikiAramaUrl()`, `KaynakCipleri` bileşeni                           |
  | `src/components/Bolumler.tsx`  | `olayMakaleleri` prop'u `TimelineSection`'a geçiriliyor                                                                          |
  | `src/App.tsx`                  | `useOlayMakaleleri(month, day, data)` bağlandı                                                                                   |

- **`slice` sınırı kararı ve gerekçesi:** **3 → 5.**

  T-18 öncesinde sınırın bir önemi yoktu: arayüz zaten yalnızca **bir** sayfa
  gösteriyordu. Artık hepsi çip olarak basıldığı için sınır doğrudan kullanıcının
  gördüğü seçenek sayısıdır. 6 günlük canlı örnekte (08-24, 03-07, 02-29, 10-29,
  01-01, 07-15 · 233 olay) yıl maddeleri elendikten sonra:

  | Sınır | Kırpılan olay | Oran     |
  | ----- | ------------- | -------- |
  | 3     | 35            | %15,0    |
  | **5** | **10**        | **%4,3** |

  5, kırpmanın nadirleştiği ve çip satırının hâlâ tek bakışta okunabildiği yer.
  Canlı doğrulama: 24 Ağustos'ta en uzun çip listesi 6 (5 sayfa + 1 "Bu olay
  hakkında"), 7 Mart'ta 5, 29 Şubat'ta 5 — hiçbiri sınırı aşmıyor.

- **EN eşlemesinin isabet oranı (kaç olayda çalıştı):** **233 olayın 18'i (%7,7).**

  Huni, aynı 6 günlük örnekte şöyle daralıyor:

  | Kapı                                       | Kalan olay | Oran  |
  | ------------------------------------------ | ---------- | ----- |
  | TR olay (toplam)                           | 233        | %100  |
  | EN'de aynı yıla düşen bir olay var         | 135        | %57,9 |
  | Ortak özel isimle **aynı olay** doğrulandı | —          | —     |
  | Seçilen EN sayfası bir **olay makalesi**   | 28         | %12,0 |
  | TR Vikipedi'de karşılığı var (`langlinks`) | **18**     | %7,7  |

  Tarayıcıda doğrulanan gerçek sonuçlar (önbellekten okundu):

  | Gün        | Çip                                                                                                                                                                       |
  | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | 24 Ağustos | 6 — Washington Yangını · 2016 Orta İtalya depremi · Iran Aseman Airlines'ın 6895 sefer sayılı uçuşu · 2006 yeni gezegen tanımı · Windows 95 · Roma'nın Yağmalanması (410) |
  | 29 Ekim    | 3 — STS-95 · 1929 Wall Street İflası · İstanbul Antlaşması (1888)                                                                                                         |
  | 7 Mart     | 0                                                                                                                                                                         |
  | 29 Şubat   | 0 (2 aday bulundu, ikisinin de TR makalesi yok)                                                                                                                           |

  **Oranın düşüklüğü kasıtlıdır.** Katman yalnızca emin olduğunda konuşur; şüphede
  susar. Yanlış bir "Bu olay hakkında" çipi, O-14'ün düzeltmeye çalıştığı hatanın
  daha yüksek sesle tekrarı olurdu.

- **Sapmalar / notlar:**

  1. **Talimattaki doğrulama komutu hatalıydı, düzeltilerek uygulandı.** Madde 5 ve
     Doğrulama bölümü `tr.wikipedia.org/…&lltang=tr` diyor; bu adres iki noktada
     yanlış. Canlı yanıt:

     ```
     {"warnings":{"main":{"*":"Unrecognized parameter: lltang."}},
      …"pages":{"-1":{"title":"Burning of Washington","missing":""}}}
     ```

     Parametrenin adı `lllang`, sorgu da **EN** wiki'ye sorulmalı (TR wiki'de
     `Burning of Washington` diye bir sayfa yok — `missing`). Doğrusu:

     ```bash
     curl -s "https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&lllang=tr&titles=Burning_of_Washington&format=json&origin=*"
     ```

     ANALIZ-RAPORU-02 §O-14 bunu zaten doğru yazıyordu (`lllang`); hata yalnızca
     talimata geçerken oluşmuş. Kodda doğru biçim kullanıldı.

  2. **`llprop=url` eklendi — TR adresi elle kurulmuyor.** `langlinks` istendiğinde
     API hazır `url` alanını da veriyor. Başlıktan adres üretmek
     (`/wiki/${encodeURIComponent(title)}`) parantezli ve apostroflu başlıklarda
     (`Roma'nın Yağmalanması (410)`) kırılgan olurdu.

  3. **Sorgular tek istekte toplandı.** Bir günde 39 olaya kadar aday çıkabiliyor;
     her biri için ayrı istek atmak yerine `titles=A|B|C` ile 50'lik yığınlar
     kullanılıyor (anonim istemci sınırı). Ayrıca `lllimit=max` şart: varsayılan 10,
     50 başlıklı bir istekte sonuçları kırpardı.

  4. **Yıl aralığı kapısı eklendi — talimatta yoktu, olmadan katman O-14'ü tekrar
     ediyordu.** "Aynı yıl geçiyor" ölçütü tek başına 1991 olayını `Communist Party
of the Soviet Union`'a (`Ruling party … (1912–1991)`), 1954'ü `Café Filho`ya
     (`President of Brazil from 1954 to 1955`) bağlıyordu — yani yine genel varlığa.
     Yıl bir aralığın parçasıysa sayfa eleniyor. Ölçülen etki: 39 aday → 28, elenen
     11'inin tamamı yanlış eşleşmeydi; üstelik iki olayda `find` daha derine inip
     doğru makaleyi buldu (`Alaric I` → `Sack of Rome (410)`, `Greek junta` →
     `1974 Cypriot coup d'état`).

  5. **Yıl eşleşmesine "aynı olay" kapısı eklendi.** Yalnız yıl bakmak 24 Ağustos'ta
     "Çin–Güney Kore diplomatik ilişkileri"ni `Hurricane Andrew`'a bağlıyordu. Artık
     TR ve EN metinleri arasında en az bir ortak özel isim aranıyor, berabere kalan
     adaylarda susuluyor. Bedeli: `Kudüs ↔ Jerusalem` gibi çeviriyle tamamen değişen
     adlar yakalanamıyor — kabul edildi, sessiz kayıp yanlış çipten iyidir.

  6. **Yıl maddesi elemesi iki koşula bağlandı.** Talimat `description === "yıl"`
     diyor; tek başına bu koşul açıklaması rastlantıyla "yıl" olan gerçek bir maddeyi
     de elerdi. Kod başlığın da salt yıl olmasını arıyor (`1985`, `MÖ 44`). 6 günlük
     örnekteki 638 yıl maddesinin başlığı istisnasız salt sayıydı. Ayrıca 2016'nın TR
     açıklaması `"yıl"` değil `"bir yıl"` — o da listeye eklendi.

  7. **Çipler detay panelinin içinde.** Talimat madde 2 "detay alanında" diyor ve
     öyle yapıldı. Kapalı satırda yalnızca "N ilgili sayfa" sayacı görünüyor;
     39 olaylık bir günde tüm çipleri açık basmak zaman tünelini okunamaz kılardı.

  8. **"Vikipedi'de ara" editör kayıtlarında da var.** Editör olaylarının `pages`
     dizisi boş; çip çıkmıyor ama arama çıkışı duruyor. 29 Ekim 1923 kaydında
     doğrulandı: "N ilgili sayfa" etiketi yok, çip yok, yalnızca editör metni +
     arama düğmesi. Kaynağı gizlememe ilkesiyle çelişmiyor — arama düğmesi bir
     kaynak iddiası değil, araştırma çıkışıdır.

  9. **Detay panelindeki `extract` davranışı bilinçli olarak değişmedi.** Hâlâ özet
     taşıyan **ilk** sayfadan geliyor; 24 Ağustos 1814'te bu "İngiltere" maddesinin
     özeti, yani olayla ilgisiz. T-18'in kapsamı dışında (bkz. Kapsam Dışı tablosu →
     T-19), o yüzden düzeltilmedi. Aşağıdaki nota bakın.

- **Sonraki talimata not:**

  - **T-19 için birinci iş:** Detay panelinin metni artık çiplerle çelişiyor.
    Kullanıcı "Beyaz Saray / Washington, DC / Washington Yangını" çiplerini
    görürken üstteki paragraf İngiltere'nin coğrafyasını anlatıyor. Panel ortak
    bileşene taşınırken metin ya seçilen çipe bağlanmalı ya da `page/summary`
    çağrısı olayın kendi makalesinden yapılmalı. Çipler zaten `extract` taşıyor
    (`OlayKaynagi.extract`), yani veri hazır — eksik olan yalnızca hangisinin
    gösterileceğine dair etkileşim.
  - `MergedEvent.pages` ve `OlayKaynagi` T-19'un `sayfalar?: WikiPage[]` alanının
    yerini tutar; T-19 kendi tipini tanımlamak yerine bunu kullanabilir.
  - `MergedEvent.lang` eklendi — T-20'nin YZ istemi hangi dilde kaynak okuduğunu
    bilmek isterse hazır.
  - `useOlayMakaleleri` yalnızca `sources.events === "tr"` iken çalışır. TR
    beslemesinin boş döndüğü günlerde olaylar zaten EN makalelerine bağlanıyor.
  - **Karanlık Dosyalar ve Bilim bölümleri hâlâ `pages[0]`ı okuyor**
    (`useGunVerisi.ts`, `detail` ve `summary` alanları). Zaman Tüneli artık tüm
    sayfaları gösterirken bu iki bölüm eski tek-sayfa varsayımında kaldı. T-19'un
    ortak paneli buraya da uygulanırsa tutarlılık kendiliğinden gelir; uygulanmazsa
    **T-21'e aday.**
