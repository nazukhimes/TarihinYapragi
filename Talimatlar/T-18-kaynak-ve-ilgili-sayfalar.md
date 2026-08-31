# T-18 · İlgili Sayfalar ve Kaynak Çıkışları

| Alan | Değer |
|---|---|
| **Faz** | FAZ 2 — Kaynak ve Bağlantı |
| **Öncelik** | 🟠 Yüksek |
| **Tahmini süre** | ~3 saat |
| **Bağımlılık** | **T-16 tamamlanmış olmalı** (`description` alanı buna bağlı) |
| **İlgili bulgu** | O-14 |
| **Durum** | ⬜ Bekliyor |

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

Kullanıcının ifadesiyle: *"Vikipedi'ye yönlendirmesi çok geniş."*

### Kanıt 1b — yıl maddeleri de `pages` içine karışıyor *(T-16'da gözlendi)*

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
   karşılığı çözülür ve çiplerin başında *"Bu olay hakkında"* olarak öne çıkarılır.

   Doğrulanmış örnek: `Burning_of_Washington` → `Washington Yangını`

   ```
   https://tr.wikipedia.org/w/api.php?action=query&prop=langlinks&lltang=tr&titles=<EN başlık>&format=json&origin=*
   ```

6. **İsabet etmezse sessizce atlanır.** Uydurma yapılmaz, "bulunamadı" satırı
   gösterilmez.

---

## 🚫 Kapsam Dışı

| Konu | Hangi talimata ait |
|---|---|
| Otomatik "en doğru sayfa" puanlaması | **Hiçbiri — reddedildi** (O-14, yukarıda) |
| `extract` metninin gösterimi | **T-16** (önce yapılmış olmalı) |
| Karanlık dosya rozetleri ve damgası | **T-17** |
| Panelin ortak bileşene taşınması, `page/summary` çağrısı | **T-19** |
| Yapay zekâ | **T-20** |
| Ayrı detay rotası (`/24-agustos/olay/...`) | Plan §2 — kapsam dışı |

---

## ☑️ Kabul Kriterleri

- [ ] 24 Ağustos 1814 olayında **üç sayfa da** çip olarak görünüyor
- [ ] Her çipte `description` alt başlığı var (boşsa yalnızca başlık)
- [ ] Tek bir sayfa "doğru cevap" olarak dayatılmıyor
- [ ] "Vikipedi'de ara" düğmesi olay metniyle gerçek arama sayfasını açıyor
- [ ] `Burning_of_Washington` örneğinde "Bu olay hakkında" çipi TR makalesine gidiyor
- [ ] Eşleşme yoksa hiçbir ek satır çıkmıyor
- [ ] Tüm dış bağlantılarda `rel="noopener noreferrer"` var
- [ ] `npm run kontrol` yeşil

---

## 🧪 Doğrulama

**Kanıt komutu — olayın sayfalarını ham hâliyle görün:**

```bash
curl -s "https://api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/events/08/24"
```

**EN çapraz eşleme kontrolü:**

```bash
curl -s "https://tr.wikipedia.org/w/api.php?action=query&prop=langlinks&lltang=tr&titles=Burning_of_Washington&format=json&origin=*"
```

**Tarayıcıda (üç gün):**

| Gün | Beklenen |
|---|---|
| **24 Ağustos** | 1814 olayında üç çip, açıklamalarıyla; "Bu olay hakkında → Washington Yangını" |
| **7 Mart** | Tek sayfalı olaylarda tek çip + "Vikipedi'de ara" düğmesi |
| **29 Şubat** | Çip alanı boş olaylarda bozulmuyor |

```bash
npm run kontrol
```

---

## 📝 Tamamlanma Kaydı

> Talimat bitince doldurulur.

- **Tamamlanma tarihi:**
- **Değişen dosyalar:**
- **`slice` sınırı kararı ve gerekçesi:**
- **EN eşlemesinin isabet oranı (kaç olayda çalıştı):**
- **Sapmalar / notlar:**
- **Sonraki talimata not:**
