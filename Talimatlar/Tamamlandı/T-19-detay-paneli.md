# T-19 · Zengin Detay Paneli (Vikipedi Tabanlı)

| Alan             | Değer                               |
| ---------------- | ----------------------------------- |
| **Faz**          | FAZ 3 — Derinlik                    |
| **Öncelik**      | 🟡 Orta                             |
| **Tahmini süre** | ~4 saat                             |
| **Bağımlılık**   | **T-16 ve T-18 tamamlanmış olmalı** |
| **İlgili bulgu** | U-6                                 |
| **Durum**        | ✅ Tamamlandı (2026-09-01)          |

---

## 🎯 Amaç

Bugün üç ayrı yerde, üç ayrı biçimde açılan detay görünümlerini **tek bir
bileşende** toplamak ve içine gerçek bir derinlik koymak.

Talimat bittiğinde: kullanıcı bir olayın/dosyanın detayını açtığında özet metni,
görseli, kaynak çipleri ve isterse daha uzun bir Vikipedi özetini sayfadan
ayrılmadan görebilecek. T-20'nin yapay zekâ bölümü bu panelin içine oturacak.

---

## 📍 Mevcut Durum

### Kanıt 1 — üç ayrı detay uygulaması var

| Yer                            | Dosya                  | Biçim                          |
| ------------------------------ | ---------------------- | ------------------------------ |
| Zaman Tüneli "Detayı aç"       | `sections.tsx:163-175` | Satır içi, sol kenarlıklı blok |
| Karanlık Dosyalar "Dosyayı aç" | `sections.tsx:~570`    | Kart içinde açılan bölüm       |
| Kişi kartı modalı              | `sections.tsx:440-455` | `Modal` bileşeni               |

Üçü de aynı işi yapıyor, üçü de farklı görünüyor ve farklı alanları okuyor.
Bir iyileştirme (örn. T-18'in çipleri) üç yere ayrı ayrı yazılmak zorunda.

### Kanıt 2 — panelin içi zayıf

Zaman Tüneli detayı bugün tek satır:

```tsx
{
  e.detail || e.page?.extract;
}
```

> **T-16 notu (2026-08-31):** Alan adı düzeltildi ve `extract` **artık dolu
> geliyor** — "Detayı aç" 7 Mart'ta gerçek Vikipedi metnini gösteriyor, boş
> açılmıyor. Aşağıdaki tespit aynen geçerli: panel hâlâ yalnızca düz metin.

Panel hâlâ yalnızca düz metin gösteriyor: görsel yok, kaynak yok, daha fazlasını
okuma yolu yok.

Kullanıcının ifadesi: _"Daha detaylı öğrenebileceğim bir yer lazım."_

### Kanıt 3 — daha uzun özet çekilebiliyor

`page/summary` uç noktası CORS'a açık ve `extract`ten daha uzun metin veriyor:

```bash
curl -s "https://tr.wikipedia.org/api/rest_v1/page/summary/Washington_Yang%C4%B1n%C4%B1"
```

Bu çağrı **talep üzerine** yapılır — her olay için otomatik çağrı günde 40+ boşuna
istek demektir.

---

## ✅ Yapılacaklar

1. **`src/components/DetayPaneli.tsx` oluştur.** Tek bir bileşen, şu propları alır:

   ```ts
   interface DetayPaneliProps {
     baslik: string;
     metin?: string; // extract / detail
     gorsel?: string; // thumbnail.source
     sayfalar?: WikiPage[]; // T-18'in çipleri
     aramaMetni?: string; // "Vikipedi'de ara" için ham olay metni
     kaynak: "editor" | "otomatik"; // rozet (T-17 ile aynı biçim)
   }
   ```

2. **Panel içeriği (sırayla):**
   - Kaynak rozeti (Editör / Otomatik) — T-17'deki biçimin aynısı
   - Görsel (`thumbnail`), varsa; yoksa alan hiç render edilmez
   - `metin`
   - **"Daha fazlasını oku"** düğmesi → `page/summary` çağrısı, yalnızca basılınca
   - T-18'in kaynak çipleri + "Vikipedi'de ara" düğmesi

3. **Üç çağrı noktasını panele bağla:**
   - `TimelineSection` "Detayı aç"
   - `CasesSection` "Dosyayı aç"
   - Kişi kartı modalı (`Modal` içinde `DetayPaneli` render edilir)

   Görsel dil korunur — panel kartın içinde açılır, ayrı bir sayfaya gidilmez.

4. **`page/summary` çağrısı için küçük bir yardımcı yaz** (`src/lib/wiki.ts` ya da
   yeni `src/lib/sayfaOzeti.ts`):
   - `AbortSignal` desteği
   - Hata durumunda Türkçe mesaj, panel kapanmaz
   - Aynı başlık için bellek içi önbellek (aynı paneli iki kez açmak iki istek olmasın)

5. **Yükleniyor durumu.** "Daha fazlasını oku" basıldığında düğme yerinde bir
   iskelet/bekleme göstergesi çıkar; `Iskeletler.tsx`'teki desen kullanılır.

6. **T-20 için yer bırak.** Panelin en altında, `children` ya da adlandırılmış bir
   slot olarak yapay zekâ bölümünün gireceği alan tanımlanır. **Bu talimatta boş
   kalır.**

---

## 🚫 Kapsam Dışı

| Konu                                  | Hangi talimata ait                           |
| ------------------------------------- | -------------------------------------------- |
| Yapay zekâ düğmesi ve soru kutusu     | **T-20** (bu panelin içine oturacak)         |
| Kaynak çiplerinin üretimi             | **T-18** (önce yapılmış olmalı)              |
| `extract` alanının okunması           | **T-16** (önce yapılmış olmalı)              |
| Karanlık dosya rozetinin tanımlanması | **T-17** (burada yalnızca kullanılır)        |
| Ayrı detay rotası / sayfası           | Plan §2 — kapsam dışı (yerinde panel kararı) |
| Tasarım dilinin değiştirilmesi        | Plan §2 — kapsam dışı                        |

---

## ☑️ Kabul Kriterleri

- [x] `src/components/DetayPaneli.tsx` var ve üç çağrı noktası da onu kullanıyor
- [x] `sections.tsx`'te üç ayrı detay render'ı kalmadı
- [x] Panel görseli olan olaylarda `thumbnail` gösteriyor, olmayanlarda boş alan bırakmıyor
- [x] "Daha fazlasını oku" **yalnızca basılınca** ağ isteği yapıyor
- [x] Aynı paneli iki kez açmak iki istek üretmiyor (önbellek)
- [x] `page/summary` hatası panelin geri kalanını bozmuyor, Türkçe mesaj çıkıyor
- [x] T-20 için ayrılan slot tanımlı ve boş
- [x] `npm run kontrol` yeşil

---

## 🧪 Doğrulama

**Ağ trafiği kontrolü:** Tarayıcı geliştirici araçlarında Network sekmesini açın,
bir günü yükleyin. `page/summary` isteği **sayfa yüklenirken çıkmamalı**; yalnızca
"Daha fazlasını oku" basıldığında bir tane çıkmalı, ikinci basışta hiç çıkmamalı.

**Tarayıcıda (üç gün):**

| Gün          | Beklenen                                                             |
| ------------ | -------------------------------------------------------------------- |
| **29 Ekim**  | Editör olayında panel "Editör" rozetli; kaynak çipleri görünüyor     |
| **7 Mart**   | Otomatik olayda panel "Otomatik" rozetli; görselli olayda görsel var |
| **29 Şubat** | Panel açılıyor, boş alanlarda düzen bozulmuyor                       |

```bash
npm run kontrol
```

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-09-01

- **Değişen dosyalar:**

  | Dosya                                 | Ne değişti                                                                                                                          |
  | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
  | `src/components/DetayPaneli.tsx`      | **Yeni.** Ortak panel + `OlayKaynagi`, `wikiAramaUrl`, `KaynakRozeti`, `MetinKunyesi`, `DahaFazlasi`, `KaynakCipleri`               |
  | `src/components/DetayPaneli.test.tsx` | **Yeni.** 18 test — rozet, görsel, künye, çipler, ağ tetikleme, önbellek, iskelet, hata, T-20 yuvası                                |
  | `src/lib/sayfaOzeti.ts`               | **Yeni.** `page/summary` çağrısı: `AbortSignal`, 12 sn zaman aşımı, bellek içi önbellek, Türkçe hatalar (`OzetHatasi`)              |
  | `src/lib/sayfaOzeti.test.ts`          | **Yeni.** 14 test — URL kurulumu, durum mesajları, önbellek, zaman aşımı, iptalin yukarı iletilmesi                                 |
  | `src/components/sections.tsx`         | Üç detay render'ı kaldırıldı, üçü de `DetayPaneli` çağırıyor; `KaynakCipleri` ve `wikiAramaUrl` panele taşındı; `olayOzetSayfasi()` |
  | `src/components/Iskeletler.tsx`       | `SkeletonParagraf` — "Daha fazlasını oku" bekleme göstergesi                                                                        |
  | `src/hooks/useGunVerisi.ts`           | `OlayKaynagi.thumbnail` dolduruluyor; otomatik dosya kayıtlarına `lang` yazılıyor                                                   |
  | `src/data/types.ts`                   | `CaseFile.lang?` — dosya panelindeki arama çıkışı doğru Vikipedi'ye gitsin                                                          |

- **Kaldırılan mükerrer kod (satır sayısı):** `sections.tsx` **869 → 834** satır
  (132 satır silindi, 97 satır eklendi). Silinenlerin çekirdeği üç ayrı detay
  render'ı ve tek çağrı noktasına bağlı `KaynakCipleri`'ydi; eklenenlerin büyük
  kısmı üç çağrı noktasının prop'ları ve gerekçe yorumları. Asıl kazanç satır
  sayısında değil: T-18'in çipleri, kaynak rozeti ve "Vikipedi'de ara" artık
  **tek yerde** yazılı ve üç bölümde birden çıkıyor (dosya panelinde ve kişi
  modalında ikisi de yoktu).

- **Sapmalar / notlar:**

  1. **Kanıt 3 yanlıştı: `page/summary`, `extract`ten daha uzun metin vermiyor.**
     Talimat bu uç noktayı "daha uzun özet" kaynağı sayıyordu. 24 Ağustos
     beslemesinin 14 sayfası iki uçtan da çekilip karşılaştırıldı — `extract`ler
     **bayt bayt aynı**:

     | Sayfa                   | Besleme | `page/summary` |
     | ----------------------- | ------- | -------------- |
     | İtalya                  | 853     | 853            |
     | Fırat Kalkanı Harekâtı  | 1087    | 1087           |
     | Windows 95              | 625     | 625            |
     | Uluslararası Astronomi… | 338     | 338            |

     Besleme sayfa özetlerini zaten gömüyor. Düğmeyi beslemede **var olan** bir
     sayfaya bağlamak, kullanıcıyı aynı metni ikinci kez okumaya çağırırdı —
     T-17/O-15'te reddedilen hatanın aynısı.

     **Uygulanan çözüm:** düğme yalnızca beslemede özeti **olmayan** bir madde
     varsa çıkar; bu da T-18'in çapraz eşlemeyle bulduğu **olay makalesidir**.
     24 Ağustos 1814'te besleme `İngiltere` maddesinin özetini veriyor (444
     karakter, İngiltere'nin coğrafyası); düğme `Washington Yangını` özetini
     getiriyor — olayın kendisini anlatan metin. Bu, T-18'in T-19'a bıraktığı
     **birinci işi** çözüyor.

     Sonuç olarak düğme üç çağrı noktasından yalnızca Zaman Tüneli'nde ve orada da
     yalnızca çapraz eşlemenin tuttuğu olaylarda (T-18 ölçümü: 233 olayın 18'i)
     çıkıyor. **Bu kasıtlıdır**: okunacak fazlası olmayan yerde düğme basmıyoruz.

  2. **Panel metni artık künyeli — çelişki kaynağı gizlemeyerek çözüldü.** Metnin
     altında `Özet · İngiltere` satırı var ve maddeye bağlanıyor. T-18 devir
     notundaki "panel metni çiplerle çelişiyor" sorunu, metni bir çipe bağlayan
     bir seçim etkileşimi eklemeden kapandı; T-18'in "tek sayfa doğru cevap olarak
     dayatılmaz" kararı bozulmadı.

  3. **`sayfalar` prop'u `WikiPage[]` değil `OlayKaynagi[]`.** Talimat madde 1
     `WikiPage[]` diyor; T-18 Tamamlanma Kaydı ise "T-19 kendi tipini tanımlamak
     yerine `OlayKaynagi`'yi kullanabilir" diye devrediyor. Devir notu izlendi.
     `OlayKaynagi`'ye tek alan eklendi: `thumbnail`.

  4. **`baslik` görünür başlık olarak basılmıyor.** Üç çağrı noktasının üçünde de
     başlık (olay metni / dosya adı / kişi adı) panelin hemen üstünde zaten
     duruyor; panel onu ikinci kez yazsa her detay iki başlıkla açılırdı. Prop
     görselin `alt` metni ve panelin erişilebilir adı olarak kullanılıyor.

  5. **Panel çerçevesiz.** Sol kenarlık (Zaman Tüneli, kategori rengi), kesik
     çizgili üst ayraç (Karanlık Dosyalar) ve modal gövdesi çağrı noktalarında
     bırakıldı — "görsel dil korunur" maddesi ancak böyle karşılanıyordu.

  6. **`rozetGoster` prop'u eklendi.** Talimat rozeti panelin ilk öğesi sayıyor,
     ama rozet Karanlık Dosyalar'ın üst bandında (T-17) ve Zaman Tüneli'nin
     "Editör notu" çipinde **zaten** basılı. İki çağrı noktasında kapatıldı; aynı
     rozet iki kez çıkmıyor. Yan kazanç: otomatik olaylar ve kişi kartları artık
     ilk kez "Otomatik" rozeti taşıyor.

  7. **Görsel, metnin geldiği sayfadan alınıyor** (`olayOzetSayfasi`). Farklı
     sayfalardan derlenen bir panel İngiltere'nin özetini Beyaz Saray'ın
     fotoğrafıyla yan yana koyardı. Bedeli ölçüldü: 6 günlük örnekte en az bir
     sayfasında görsel olan **223** olayın **215**'inde görsel zaten özeti veren
     sayfada duruyor — kayıp 8 olay.

  8. **Kişi modalındaki altın "Vikipedi'de oku" düğmesi çipe dönüştü.** Kişinin
     maddesi artık "Kaynaklar" satırında, açıklamasıyla birlikte
     (`Lance Stroll · Kanadalı yarış pilotu`) ve yanında "Vikipedi'de ara" ile
     duruyor. Modalın alt satırı (`Kaynak: Türkçe Vikipedi arşivi`) korundu —
     rozetin söylemediği tek bilgi olan **hangi Vikipedi** orada.
     Kişi modalında "Daha fazlasını oku" çıkmıyor: 6 günlük örnekteki **929**
     kişinin **tamamında** besleme `extract`i dolu (ve `page/summary` ile aynı).

  9. **Karanlık Dosyalar'da çip yok, arama çıkışı var.** `CaseFile` metnin hangi
     sayfadan geldiğini saklamıyor (`detail = pages[0].extract`), bu yüzden çip
     listesi üretilemiyor — T-18'in devir notundaki açık iş, T-21 adayı olarak
     duruyor. Panel yine de dosyaya iki yenilik getirdi: "Vikipedi'de ara" çıkışı
     ve ortak biçim. `CaseFile.lang?` alanı bunun için eklendi.

  10. **`page/summary` servis çalışanı önbelleğine girmiyor.** `vite.config.ts`
      yalnızca `api.wikimedia.org` ve `upload.wikimedia.org` için `runtimeCaching`
      tanımlıyor; bu çağrı `tr.wikipedia.org`a gidiyor. Çevrimdışıyken düğme Türkçe
      hata veriyor, panelin geri kalanı çalışıyor. Kapsam dışı bırakıldı — ekleme
      PWA yapılandırmasına dokunmayı gerektirirdi.

- **Doğrulama (canlı tarayıcı, `npm run dev`):**

  | Gün            | Gözlenen                                                                                                                                                                            |
  | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | **24 Ağustos** | 1814 paneli: "Otomatik" rozeti · İngiltere görseli · İngiltere özeti · `Özet · İngiltere` künyesi · `Daha fazlasını oku — Washington Yangını maddesinden` · 5 çip + arama           |
  | **29 Ekim**    | 1923 editör kaydı: "Editör notu" çipi **bir kez**, editör metni, görsel yok, çip yok, arama çıkışı var. Lion Air dosyası: üst bantta tek "Editör" rozeti, detay + arama çıkışı      |
  | **7 Mart**     | 1911 paneli görselli ve künyeli; 1954 paneli (Basın-yayın maddesinin görseli yok) boş kutu bırakmadan yalnızca metin sütunuyla açılıyor; günde hiç "Daha fazlasını oku" yok — doğru |
  | **29 Şubat**   | 18 olay, 1 dosya, 28 kişi kartı; panel açılıyor, boş alanlarda düzen bozulmuyor; görselsiz kişi modalında `img` düğümü hiç yok                                                      |

  **Ağ trafiği** (sayfadaki `fetch` sarmalanarak sayıldı):

  | Adım                                           | `page/summary` isteği |
  | ---------------------------------------------- | --------------------- |
  | Gün yükleniyor (dört günde de)                 | **0**                 |
  | "Detayı aç" / "Dosyayı aç" / modal açılışı     | **0**                 |
  | "Daha fazlasını oku" ilk basış                 | **1**                 |
  | Panel kapatılıp yeniden açıldı, tekrar basıldı | **0** (toplam 1)      |

  **Hata yolu** (404 döndüren `fetch` ile): panelde `Bu madde Vikipedi'de
bulunamadı.` çıktı; metin, künye, 6 çip ve düğme yerinde kaldı, düğme tekrar
  denenebilir durumda.

  **Yeşil kapı:** `npm run kontrol` — `format:check` + `typecheck` + `lint`
  (0 hata) + **325 test** (293 → 325) + `build` hepsi geçti.

  > **Not:** Bu oturumda tarayıcı ekran görüntüsü alınamadı (yakalanan kareler
  > boş çıkıyordu); görsel doğrulama canlı DOM okunarak yapıldı — yukarıdaki
  > metinler sayfadan alınmıştır.

- **Sonraki talimata not (T-20 slotunun imzası):**

  Yuva `DetayPaneli`'nin `children`'ıdır ve **boştur** — bu talimatta hiçbir çağrı
  noktası doldurmuyor, dolayısıyla alan hiç render edilmiyor:

  ```tsx
  // src/components/DetayPaneli.tsx
  export interface DetayPaneliProps {
    baslik: string;
    metin?: string;
    gorsel?: string;
    metinKaynagi?: OlayKaynagi;
    sayfalar?: OlayKaynagi[];
    olayMakalesi?: OlayMakalesi;
    aramaMetni?: string;
    dil?: "tr" | "en";
    kaynak: "editor" | "otomatik";
    rozetGoster?: boolean;
    ozetBasligi?: string;
    /** T-20 yuvası — panelin en altında, kesik çizgili ayracın altında. */
    children?: ReactNode;
  }
  ```

  Render'daki yeri:

  ```tsx
  {
    children && <div className="mt-5 pt-4 border-t border-dashed border-line/70">{children}</div>;
  }
  ```

  T-20 için hazır olanlar:

  - **Bağlam metni** doğrudan `metin` prop'unun kaynağıdır; Zaman Tüneli'nde
    `e.detail || olayOzetSayfasi(e)?.extract`, kişi modalında `modal.extract`,
    dosyada `c.detail`. İstemi zenginleştirmek gerekirse `sayfalar[].extract`
    (beslemedeki **tüm** sayfaların özeti) ve `ozetBasligi` de elde.
  - **Dil** `dil` prop'unda (`MergedEvent.lang` / `PersonCard.lang` /
    `CaseFile.lang`).
  - **Rozet biçimi** `KaynakRozeti` içinde; T-20'nin "YZ ÜRETİMİ" rozeti buradaki
    altın (Editör) ve nötr (Otomatik) renklerden **açıkça farklı** bir renk
    seçmeli.
  - **Hata deseni** `DahaFazlasi` içinde çalışan biçimiyle duruyor: Türkçe mesaj
    panelin altına basılır, panelin geri kalanı bozulmaz, düğme tekrar denenebilir
    kalır. `lib/sayfaOzeti.ts`'teki `OzetHatasi` sınıfı aynı deseni YZ katmanına
    kopyalamak için örnek alınabilir.

  Devreden diğer işler:

  - **Karanlık Dosyalar'ın çip listesi hâlâ yok** (yukarıda sapma 9). Çözümü
    `CaseFile`'a sayfa listesini taşımak; **T-21 adayı**.
  - **Bilim & Keşif bölümü panele bağlanmadı** — o bölümde açılan bir detay yok
    (kartlar tek parça), bu yüzden T-19'un "üç çağrı noktası" kapsamına girmiyor.
    Bölüme detay eklenirse dördüncü çağrı noktası olur.
