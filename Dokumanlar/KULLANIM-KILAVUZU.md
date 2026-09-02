# KULLANIM KILAVUZU — Tarih Yaprağı

> Uygulamayı **kullanacak** kişiler için. Kod bilgisi gerekmez.
>
> **Sürüm:** 0.2.0 · **Son güncelleme:** 2026-09-02

---

## İçindekiler

1. [Uygulamayı Başlatma](#1-uygulamayı-başlatma)
2. [Ekranı Tanıyalım](#2-ekranı-tanıyalım)
3. [Gün Seçme — 5 Farklı Yol](#3-gün-seçme--5-farklı-yol)
4. [Bölümler](#4-bölümler)
5. [Yapay Zekâya Sor](#5-yapay-zekâya-sor)
6. [Yayın Modu](#6-yayın-modu--yayıncılar-için)
7. [Arama](#7-arama)
8. [Klavye Kısayolları](#8-klavye-kısayolları)
9. [Sıkça Sorulanlar](#9-sıkça-sorulanlar)
10. [Sorun Giderme](#10-sorun-giderme)

---

## 1. Uygulamayı Başlatma

### Windows'ta (önerilen)

Proje klasöründeki **`başlat.bat`** dosyasına **çift tıklayın.**

Açılan pencerede bir menü çıkar:

| Seçenek                     | Ne yapar                    | Ne zaman kullanılır                          |
| --------------------------- | --------------------------- | -------------------------------------------- |
| **1** — Geliştirme sunucusu | Canlı yenilemeli sunucu     | Normal kullanım ve geliştirme _(varsayılan)_ |
| **2** — Üretim önizlemesi   | Önce derler, sonra sunar    | Yayına çıkmadan önce son kontrol             |
| **3** — Sadece build al     | `dist/` klasörünü üretir    | Siteyi bir sunucuya yükleyeceksiniz          |
| **4** — Tip kontrolü        | TypeScript hatalarını tarar | Kod değişikliğinden sonra                    |

Enter'a basmanız yeterli — **1** varsayılandır. Tarayıcı otomatik açılır.

> **İlk çalıştırma:** `node_modules` klasörü yoksa bağımlılıklar otomatik kurulur.
> Bu birkaç dakika sürebilir, bir kereye mahsustur.
>
> **Port:** 3000 meşgulse uygulama kendiliğinden 3001, 3002… diye boş port arar.
>
> **Kapatmak için:** Siyah pencerede **Ctrl + C**.

### macOS / Linux'ta

Terminalde proje klasörüne girip:

```bash
./baslat.sh
```

Aynı menü (1-4) burada da çıkar; Enter'a basmak yine **1**'i (geliştirme sunucusu) seçer.
İlk çalıştırmadan önce çalıştırma izni gerekebilir: `chmod +x baslat.sh`.

### Elle başlatma (her işletim sistemi)

```bash
npm install
```

```bash
npm run dev
```

Sonra terminalde Vite'ın yazdığı adresi açın (genelde `http://localhost:3000`).

### Gereksinim

**Node.js 20 veya üzeri.** Kurulu değilse `başlat.bat` / `baslat.sh` uyarır.
(T-22'den önce 18 yeterliydi; `react-router` 7 Node 20 istiyor.)
İndirme: [nodejs.org](https://nodejs.org) → LTS sürümü. Proje `.nvmrc` ile Node 20'yi
önerir; `nvm` kullananlar `nvm use` ile otomatik geçebilir (zorunlu değil).

---

## 2. Ekranı Tanıyalım

```
┌─────────────────────────────────────────────────────────────────┐
│ 🍂 TARİH YAPRAĞI      [🔍 arama kutusu]      ⏱ saat  [🎙 YAYIN] │  ← Üst bar
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐     BUGÜNÜN ARŞİVİ      kaynak: TR Vikipedi │
│   │   CUMA       │                                              │
│   │              │     Günün manşeti buraya gelir...            │
│   │     21       │     ────────────────────────────────         │
│   │              │     ┌────┐ ┌────┐ ┌────┐ ┌────┐             │
│   │   Ağustos    │     │ 23 │ │ 12 │ │  8 │ │  3 │  ← sayaçlar │
│   │              │     └────┘ └────┘ └────┘ └────┘             │
│   │ [TAKVİM ▾]   │     Zaman aralığı: 1680 — 2008              │
│   └──────────────┘                                              │
│   ◀ ÖNCEKİ   BUGÜN   SONRAKİ ▶                                 │
│                                                                 │
│   ÖZEL DOSYALI GÜNLER  [14 Şub] [8 Mar] [23 Nis] ...           │
├─────────────────────────────────────────────────────────────────┤
│ BUGÜN TARİHTE │ 1680 ◆ ... 1911 ◆ ... 1922 ◆ ...   ← kayan bant│
├─────────────────────────────────────────────────────────────────┤
│ 01 ZAMAN TÜNELİ  02 DOĞANLAR  03 KAYBETTİKLERİMİZ  ...  ← nav  │
└─────────────────────────────────────────────────────────────────┘
```

### Takvim yaprağı

Ekranın solundaki kâğıt yaprak, seçili günü gösterir. Üzerinde:
haftanın günü, gün sayısı, ay adı, yılın kaçıncı günü olduğu ve ayın numarası.

Gün değiştiğinde yaprak **çevrilme animasyonuyla** yenilenir.

Yaprağın altındaki gezinme düğmelerinin hemen altında bir **`PAYLAŞ`** düğmesi
vardır — bkz. [Paylaşım](#paylaşım).

### Sayaçlar

Dört kutu, o güne ait kayıt sayılarını gösterir. Her kutuya tıklayınca
ilgili bölüme kayar.

| Kutu             | Ne sayar                                      |
| ---------------- | --------------------------------------------- |
| Tarihî olay      | Zaman tünelindeki toplam kayıt                |
| Bugün doğan      | O tarihte doğan kişi sayısı                   |
| Kaybettiklerimiz | O tarihte vefat eden kişi sayısı              |
| Karanlık dosya   | Suikast, infaz, felaket, kayıp dosyası sayısı |

### Kayan bant (ticker)

Ekranın üst kısmındaki kırmızı bant, günün olaylarını sürekli kaydırır.
**Üzerine gelin, durur** — okumak istediğinizde işe yarar.

### Özel dosyalı günler

`14 Şub`, `8 Mar`, `23 Nis`… şeklindeki düğmeler, **editörün elle hazırladığı
özel dosyaların** bulunduğu günlerdir. Bu günlerde Karanlık Dosyalar ve
Bilim & Keşif bölümleri çok daha zengindir. Seçili gün özel dosyalıysa
yanında **"◆ dosya açık"** yazar.

---

## 3. Gün Seçme — 5 Farklı Yol

| Yol                  | Nasıl                                                                                                                                                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Önceki / Sonraki** | Yaprağın altındaki `◀ ÖNCEKİ GÜN` / `SONRAKİ GÜN ▶` düğmeleri. Ay sınırını otomatik aşar (31 Ocak → 1 Şubat).                                                                                                                                                    |
| **Bugüne dön**       | Başka bir gündeyken ortadaki `BUGÜNE DÖN` düğmesi. Bugündeyseniz yerine yanıp sönen **● Bugün** yazar.                                                                                                                                                           |
| **Ay takvimi**       | Yaprağın üzerindeki `AĞUSTOS TAKVİMİ ▾` düğmesi → tam ay ızgarası açılır. Ok tuşlarıyla ay değiştirin, bir güne tıklayın.                                                                                                                                        |
| **Özel dosyalı gün** | Kısayol düğmelerinden birine tıklayın; sayfa yukarı kayar.                                                                                                                                                                                                       |
| **Adres çubuğu**     | Her günün kendi adresi var: `localhost:3000/21-agustos`. Adresi doğrudan yazıp Enter'a basabilir, yer imine ekleyebilir veya bir bağlantı olarak paylaşabilirsiniz. (Uygulama internette yayınlanırsa aynı adres `siteadresi.com/21-agustos` biçiminde çalışır.) |

> **Ay takviminde:** Seçili gün **kırmızı**, bugün **altın çerçeveli**tir.
> Hafta Pazartesi'den başlar.

> **Tarayıcı geri/ileri tuşu:** Gün değiştirdikçe adres çubuğu güncellenir, bu
> yüzden tarayıcının **geri** ve **ileri** tuşları da önceki/sonraki günler
> arasında gezinir — siteden çıkmaz.

### Paylaşım

Yaprağın altındaki **`PAYLAŞ`** düğmesi, o an baktığınız günün adresini paylaşır:

- **Telefonda:** İşletim sisteminin kendi paylaşım ekranı açılır (WhatsApp,
  Mesajlar, e-posta…) — orada göndermek istediğiniz uygulamayı seçin.
- **Bilgisayarda:** Adres doğrudan panoya kopyalanır; **"Bağlantı panoya
  kopyalandı"** bildirimi çıkar. Yapıştırmak istediğiniz yere `Ctrl+V` yapın.

Paylaştığınız bağlantı açıldığında **aynı gün** doğrudan açılır — alıcı bugüne
değil, sizin baktığınız güne bakar.

---

## 4. Bölümler

### Bugünün anlamı (bazı günlerde)

Zaman Tüneli'nin hemen üstünde, altın çerçeveli kısa bir şerit çıkabilir:
seçili günün resmî bir anlamı varsa (bayram, anma günü, haftası…) burada
listelenir. Bu **ayrı bir bölüm değildir** — her günde çıkmaz, veri yoksa
hiç görünmez.

> Bu bilgi doğrudan Vikipedi'den geldiği için bazı günlerde şablon kaynaklı
> anlamsız kısa bir madde de görülebilir; bu bilinen bir veri kalitesi
> sorunudur, uygulamanın hatası değildir.

### 01 · Zaman Tüneli

O güne düşen **tüm** tarihî kayıtlar, en eskiden en yeniye dikey bir çizgide.

- Yüzyıllar arasına **ayraç** konur (`19. YÜZYIL`, `20. YÜZYIL`…).
- Her kaydın solunda **kategori rengi** taşıyan bir nokta vardır.
- Üstteki **kategori çipleri** ile süzebilirsiniz (`Savaş & İşgal · 4`, `Bilim · 2`…).
  Aynı çipe tekrar tıklamak süzmeyi kaldırır.
- **`DETAYI AÇ`** — kaydın uzun açıklamasını açar.
- **`VİKİPEDİ`** — kaynağı yeni sekmede açar.
- **`Editör notu`** rozeti taşıyan kayıtlar elle yazılmıştır, en güvenilir olanlardır.

### 02 · Bugün Doğanlar · 03 · Kaybettiklerimiz

Yatay kaydırılan kart şeritleri. Her kartta portre (varsa), yıl, kategori ve kısa özet.

- **Karta tıklayın** → büyük dosya penceresi açılır (fotoğraf, tam özet, Vikipedi bağlantısı).
- Pencereyi **Esc** ile veya dışına tıklayarak kapatın.
- Şeridi fare tekerleği (Shift ile), dokunmatik kaydırma veya alttaki çubukla gezin.
- Fotoğrafı olmayan kişilerde adın **ilk harfi** renkli bir monogram olarak gösterilir.

### 04 · Karanlık Dosyalar

Suikastlar, infazlar, katliamlar, kayıplar ve felaketler — **adli dosya** görünümünde.

Her kartta:

| Öğe                | Anlamı                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------- |
| Üst bant           | Dosya türü — `SUİKAST`, `İNFAZ`, `KATLİAM`, `KAYIP DOSYASI`, `FELAKET`                  |
| Eğik damga         | Dosya durumu — `FAİLİ MEÇHUL` (kırmızı), `SÜRÜYOR` (altın), `ÇÖZÜLDÜ` / `KAPANDI` (gri) |
| Bakır renkli satır | Olayın geçtiği yer                                                                      |
| `#etiketler`       | Konu etiketleri                                                                         |
| `DOSYAYI AÇ`       | Uzun anlatımı açar                                                                      |

> **Not:** `Arşiv taraması — otomatik tespit` yazan dosyalar, Vikipedi metninden
> anahtar kelimeyle bulunmuştur ve **yanılabilir.** Editör dosyaları yer bilgisi
> ve ayrıntılı anlatım taşır.

Bir günde 6'dan fazla dosya varsa yalnızca ilk 6'sı gösterilir; altındaki
**`N dosya daha göster`** düğmesine tıklayınca kalanı da açılır.

### 05 · Bilim & Keşif

O güne denk gelen bilimsel dönüm noktaları. Kartın arka planında dev, içi boş
yıl rakamı vardır. `Editör` rozeti taşıyanlar elle derlenmiştir. Bir günde
3'ten fazla kayıt varsa aynı şekilde **`N kayıt daha göster`** düğmesi çıkar.

### 06 · Sohbet Kartları

**Uygulamanın en özgün bölümü.** Yayında/podcast'te okunmaya hazır, kanca cümleli kartlar.

Her kart bir kâğıt parçası gibi görünür:

- Üstte **kategori** ve `KART 01` numarası
- **Kalın kanca cümlesi** (dinleyicinin dikkatini çeken giriş)
- Çizgili defter zemininde **gövde metni**
- Altta **≈ 2 dk konuşma** tahmini ve **`KOPYALA`** düğmesi

**`KOPYALA`** düğmesi kartı şu biçimde panoya alır:

```
[Kanca cümlesi]

[Gövde metni]

— Tarih Yaprağı arşivi · 21 Ağustos
```

Bölüm başlığının sağında toplam **"X dk malzeme"** yazar.

---

## 5. Yapay Zekâya Sor

Bir olayın, kişinin ya da karanlık dosyanın detayını açtığınızda, panelin
altında leylak renkli bir **`YAPAY ZEKÂYA SOR`** düğmesi görürsünüz. Bu, o
kaydı yapay zekâya açıklatan ya da hakkında soru sorabileceğiniz serbest bir
kutudur. İstek yalnızca düğmeye bastığınızda gider; sayfa açılırken hiçbir
çağrı yapılmaz.

**Kendi anahtarınız gerekir.** Uygulamanın sunucusu yok; üst bardaki kıvılcım
simgesinden kendi Google Gemini anahtarınızı girersiniz. Anahtar yalnızca **bu
tarayıcıda** durur, hiçbir yere gönderilmez ve aynı ekrandan silinebilir.
Anahtarınız yoksa düğme yerine "Önce anahtarınızı girin" uyarısı çıkar.

### Web'de araştırma modu

Varsayılan olarak **açıktır.** Bu modda model, Vikipedi özetiyle sınırlı kalmaz —
olayın tarihini, olay cümlesini ve ilgili Vikipedi maddesini kullanarak Google'da
arar, 120–200 kelimelik bir özet çıkarır ve yanıtın altında **tıklanabilir kaynak
listesi** gösterir. Bağlam metni başka bir maddenin özeti olsa bile (ör. bazı
günlerde panele düşen metin olayın kendisini değil, içinde geçen bir ülke ya da
şehri anlatabilir) arama olayın kendisini hedefler.

Yanıtın altındaki cümle hangi modun çalıştığını söyler:

- **"…web'de arama yapılarak üretildi"** — model gerçekten aradı; altındaki
  kaynak listesinden doğrulayabilirsiniz.
- **"…Vikipedi özetine dayanılarak üretildi"** — model aramaya gerek görmedi ya
  da arama kapalı; yanıt yalnızca ekrandaki metne dayanır.

Ayarlar ekranında (kıvılcım simgesi → anahtar girildikten sonra) **"Web'de
araştır"** anahtarıyla bu modu kapatabilirsiniz — kapatınca yanıtlar yalnızca
sayfadaki metne dayanır, hiç arama yapılmaz.

> **Kota:** Ücretsiz Gemini katmanında günlük arama hakkı sınırlıdır. Kota
> dolduğunda uygulama çökmez; yanıt sayfadaki metinle üretilmeye devam eder,
> yalnızca kaynak listesi çıkmaz. Ayarlardaki **"Bağlantıyı sına"** düğmesi bu
> kotayı harcamaz.

Model çıktısı her zaman düz metin olarak basılır ve leylak **"YZ üretimi"**
rozetiyle işaretlenir — Editör (altın) ve Otomatik (nötr) rozetlerinden bilerek
farklı renktedir, üretilmiş metin derlenmiş metinle karıştırılmaz.

---

## 6. Yayın Modu — Yayıncılar İçin

Sağ üstteki **🎙 YAYIN MODU** düğmesi (veya Sohbet Kartları bölümündeki
**`YAYIN MODUNU BAŞLAT`**) tam ekran bir teleprompter açar.

```
┌──────────────────────────────────────────────────────┐
│ ● YAYIN MODU · 21 Ağustos          03 / 09  [KAPAT] │
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  ← ilerleme  │
│                                                      │
│        [KARANLIK TARİH]   ≈ 2 dakika                │
│                                                      │
│        Karanlık arşivden: Suikast                    │  ← dev punto
│                                                      │
│        1940'ta bugün Leon Troçki Meksika'da...       │
│                                                      │
│ ◀ ÖNCEKİ      ● ● ● ○ ○ ○ ○      [KOPYALA] SONRAKİ ▶│
└──────────────────────────────────────────────────────┘
```

- Metin **büyük puntoyla** gösterilir; kameraya bakarken okunabilir.
- Alttaki **noktalara** tıklayarak istediğiniz karta atlayabilirsiniz.
- İlerleme çubuğu kaçıncı karttan kaçta olduğunuzu gösterir.
- Hafif **tarama çizgisi** efekti stüdyo hissi verir.

---

## 7. Arama

Üst bardaki arama kutusu **seçili günün arşivinde** arar — tüm yıl içinde değil.

Aradığınız kelime aynı anda şu bölümlerde süzülür:
Zaman Tüneli · Doğanlar · Kaybettiklerimiz · Karanlık Dosyalar · Bilim & Keşif

- **Türkçe duyarlıdır:** `İSTANBUL` yazsanız da `istanbul` bulunur.
- **Yıl arayabilirsiniz:** `1922` yazın.
- **Kategori adı arayabilirsiniz:** `Savaş` yazın.
- Temizlemek için kutunun sağındaki **`✕ temizle`**.
- Telefonda arama kutusu üst barın altında ayrı bir satırdadır.

Yazdığınız anda üst barın altında bir şerit çıkar: aradığınız kelime, **toplam
kaç sonuç** bulunduğu ve bölüm bazlı dağılım (`4 olay · 0 doğum · 0 vefat · 0
dosya · 0 bilim` gibi). Hiçbir bölümde eşleşme yoksa altı boş bölümü tek tek
görmek yerine tek bir ekran çıkar: _"… için bu günde sonuç yok"_ + aramayı
temizleme ve bugüne dönme düğmeleri.

---

## 8. Klavye Kısayolları

Uygulama artık **fareye hiç dokunmadan** kullanılabilir.

### Ana sayfada

| Tuş   | İşlev                          |
| ----- | ------------------------------ |
| `→`   | Sonraki gün                    |
| `←`   | Önceki gün                     |
| `T`   | Bugüne dön                     |
| `/`   | Arama kutusuna odaklan         |
| `?`   | Kısayol yardımı penceresini aç |
| `Esc` | Açık pencereyi/yardımı kapat   |

> Bu kısayollar **arama kutusuna yazarken** ve **Yayın Modu açıkken** çalışmaz —
> aksi hâlde yazdığınız harfler veya yayın kartları arasında gezinme
> etkilenirdi. Kısayolların tam listesini her an `?` tuşuna basarak
> görebilirsiniz; alt bilgide de küçük bir hatırlatma vardır.

### Tab tuşuyla gezinme

Sayfaya girip ilk `Tab`'a bastığınızda ekranın sol üstünde **"Ana içeriğe
atla"** bağlantısı belirir — `Enter`'a basarsanız üst bar ve gezinme
menüsünü atlayıp doğrudan içeriğe inersiniz. `Tab` ile sırayla üst bara,
arama kutusuna, Yayın Modu düğmesine, kartlara ve düğmelere ulaşırsınız;
odaklandığınız öğenin etrafında **altın (kâğıt yüzeylerde kırmızı) bir
çerçeve** belirir.

### Yayın Modu içinde

| Tuş               | İşlev              |
| ----------------- | ------------------ |
| `→` veya `Boşluk` | Sonraki kart       |
| `←`               | Önceki kart        |
| `Esc`             | Yayın modundan çık |

### Dosya penceresi (modal) içinde

| Tuş                 | İşlev                                                                      |
| ------------------- | -------------------------------------------------------------------------- |
| `Tab` / `Shift+Tab` | Pencere içindeki öğeler arasında dolaş — odak pencerenin **dışına çıkmaz** |
| `Esc`               | Pencereyi kapat, odak açtığınız karta geri döner                           |

> **Ekran okuyucu kullanıyorsanız:** bir kartı kopyaladığınızda ("Kart panoya
> kopyalandı" gibi) bildirimler otomatik olarak duyulur; kategori çiplerinde
> hangisinin seçili olduğu ("basılı") bilgisi de aktarılır.

---

## 9. Sıkça Sorulanlar

**S: Bilgiler nereden geliyor?**
İki kaynaktan. (1) **Wikimedia REST API** — Türkçe Vikipedi'nin "Bugün tarihte"
verisi; Türkçe'de kayıt yoksa İngilizce Vikipedi'ye düşer. (2) **Editör derlemesi** —
elle yazılmış özel dosyalar. Editör içeriği `Editör notu` / `Editör` rozetiyle işaretlidir.

**S: Neden bazı günlerde Karanlık Dosyalar bölümü boş?**
Editörün özel dosya hazırladığı günler şimdilik 60 tanedir (366 günün %16,4'ü).
Diğer günlerde bölüm, vefat ve olay kayıtlarını anahtar kelimeyle tarayarak
dolar — bazı günlerde eşleşme çıkmaz. İçerik kapsamı genişletiliyor.

**S: Otomatik sınıflandırma yanlış olabilir mi?**
Evet, ama nadiren. Kategori ve karanlık dosya tespiti anahtar kelime
taramasıyla yapılır; bir referans örnek kümesine karşı düzenli ölçülür
(kategori doğruluğu, karanlık dosyalarda sıfır yanlış pozitif hedefiyle).
Yine de kesin bilgi için kartlardaki **Vikipedi** bağlantısını izleyin.

**S: 29 Şubat'ı seçebilir miyim?**
Evet, tarihsel arşivde 29 Şubat kayıtları vardır ve takvimde her zaman görünür.

**S: Belirli bir günü birine gönderebilir miyim?**
Evet. Her günün kendi adresi vardır (`siteadresi.com/21-agustos`); adres
çubuğundaki bağlantıyı kopyalayıp gönderebilir ya da yaprağın altındaki
**`PAYLAŞ`** düğmesini kullanabilirsiniz — bkz. [Paylaşım](#paylaşım).

**S: MÖ tarihler var mı?**
Evet. Zaman tünelinde `MÖ 480` biçiminde gösterilir.

**S: İnternet olmadan çalışır mı?**
Kısmen, iki ayrı katmanla. (1) Uygulamanın kendisi (sayfa iskeleti, tasarım,
kod) bir **service worker** tarafından cihazınıza kaydedilir; internet kesilse
bile daha önce ziyaret ettiğiniz gün sayfası açılır, bomboş bir ekranla
karşılaşmazsınız. (2) Gün **verisi** (olaylar, doğanlar, vefatlar) ayrıca
tarayıcı hafızasına kaydedilir ve internet kesildiğinde bu yedekten okunur.
Bu yedek 24 saatten eskiyse (ör. bir haftadır internetsizseniz) atılmaz, yine
gösterilir — ama kaynak etiketi **"önbellekten · 24 saatten eski"** yazar ve
bakır renge döner, böylece gördüğünüz bilginin güncel olmayabileceğini
anlarsınız. Hiç açmadığınız bir gün için, sorunun türüne göre ayrı bir başlık
çıkar — _"İnternet bağlantısı yok."_, _"Arşiv şu an çok yoğun."_, _"Arşiv
sunucusu yanıt vermiyor."_ gibi — ve mümkünse yanında bir **`YENİDEN DENE`**
düğmesi olur (kalıcı bir hatada, ör. o gün için hiç kayıt yoksa, bu düğme hiç
çıkmaz). Arşiv sunucusu yoğunsa (çok sık istek) uygulama birkaç saniye içinde
otomatik olarak bir kez daha dener; siz bir şey yapmanıza gerek kalmaz.

**S: Uygulamayı telefonuma veya bilgisayarıma yükleyebilir miyim?**
Evet. Tarih Yaprağı bir PWA (Progressive Web App) olarak kurulabilir:

- **Android / masaüstü Chrome:** Adres çubuğunun sağındaki **"Yükle"** simgesine
  (veya menüdeki "Uygulamayı yükle" seçeneğine) tıklayın.
- **iPhone / iPad (Safari):** Paylaş düğmesine, ardından **"Ana Ekrana Ekle"**ye
  dokunun.

Kurulunca uygulama kendi penceresinde, adres çubuğu olmadan açılır ve daha önce
ziyaret ettiğiniz günler için kısmen çevrimdışı çalışır (bkz. bir önceki soru).

**S: Verilerim bir yere gönderiliyor mu?**
Hayır. Uygulamanın sunucusu yoktur; hesap, çerez izleme veya analitik yoktur.
Tek dış bağlantı Vikipedi'ye ve Google Fonts'adır. Önbellek yalnızca kendi
tarayıcınızdaki `localStorage` alanında durur.

**S: Telefonda kullanabilir miyim?**
Evet, arayüz mobil uyumludur. Kart şeritleri dokunmatik kaydırılır.

---

## 10. Sorun Giderme

| Belirti                                                                                    | Sebep                                                                     | Çözüm                                                                                                                                           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `başlat.bat` açılıp hemen kapanıyor                                                        | Node.js kurulu değil                                                      | [nodejs.org](https://nodejs.org)'dan LTS kurun, bilgisayarı yeniden başlatın                                                                    |
| `[HATA] npm install basarisiz oldu`                                                        | Ağ / izin sorunu                                                          | İnterneti kontrol edin; `node_modules` klasörünü silip tekrar deneyin                                                                           |
| `./baslat.sh` çalışmıyor: `Permission denied`                                              | Çalıştırma izni yok                                                       | `chmod +x baslat.sh` çalıştırıp tekrar deneyin                                                                                                  |
| Sayfa açılıyor ama boş                                                                     | Tarayıcı çok eski                                                         | Güncel Chrome, Edge veya Firefox kullanın                                                                                                       |
| _"İnternet bağlantısı yok." / "Arşiv şu an çok yoğun." / "Arşiv sunucusu yanıt vermiyor."_ | Vikipedi'ye erişilemiyor, sorunun türü ekranda ayrı başlıkla belirtiliyor | Varsa `YENİDEN DENE`'ye basın; yoksa (ör. o gün için kayıt yok) internet sorunu değildir                                                        |
| Bir bölüm "Arşivde bir sorun çıktı / Yaprak yırtıldı" kartı gösteriyor                     | O bölümde beklenmeyen bir hata oldu (T-09)                                | Diğer bölümler etkilenmez, normal kullanmaya devam edebilirsiniz. Düzelmezse `SAYFAYI YENİLE`, olmazsa `ÖNBELLEĞİ TEMİZLE`'ye basın             |
| Kod değişikliği tarayıcıya yansımıyor                                                      | Geliştirme sunucusunun canlı yenileme bağlantısı koptu                    | Sayfayı yenileyin. (Bu yalnızca `npm run dev` ile çalışırken görülür.)                                                                          |
| Kopyala çalışmıyor                                                                         | Tarayıcı pano izni vermedi                                                | Adres çubuğundaki izin simgesinden panoya erişime izin verin                                                                                    |
| Port 3000 meşgul                                                                           | Başka uygulama kullanıyor                                                 | Vite kendiliğinden bir sonraki boş porta geçer (3001, 3002…) ve adresi konsola yazar. Belirli bir port isterseniz: `npm run dev -- --port 3005` |

> **Bu tabloda artık çözülmemiş bir "bilinen sorun" yok.** PLAN-01 kapsamında
> raporlanan beş kritik hatanın (K-1 … K-5) hepsi düzeltildi; kayıtları
> [`ANALIZ-RAPORU.md`](ANALIZ-RAPORU.md) ve
> [`../Talimatlar/Tamamlandı/`](../Talimatlar/Tamamland%C4%B1/) altında durur.

---

## Geri Bildirim

Hata bulduysanız veya bir günün içeriğinin zenginleştirilmesini istiyorsanız,
projenin GitHub deposunda konu (issue) açabilirsiniz.
