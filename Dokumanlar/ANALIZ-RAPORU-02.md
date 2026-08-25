# ANALİZ RAPORU 02 — İçerik Derinliği ve Kaynak Doğruluğu

**Tarih:** 2026-08-24 · **İnceleme kapsamı:** Veri katmanı, Vikipedi API entegrasyonu, içerik sunumu
**Yöntem:** Kod okuma + gerçek API yanıtının indirilip ölçülmesi (`curl` + Node) + tarayıcıda canlı DOM doğrulaması
**Tetikleyen:** Kullanıcı geri bildirimi (2026-08-24) — "detayı aç çalışmıyor, isimler HTML çıkıyor,
Vikipedi bağlantısı çok genel, karanlık dosyada değişen bir şey yok, daha detaylı öğrenebileceğim bir yer lazım"

> Bu rapor `ANALIZ-RAPORU.md`'nin (2026-08-21, PLAN-01 dayanağı) devamıdır, yerine geçmez.
> Bulgu kodları o rapordan devam eder (K-6'dan, O-14'ten, U-6'dan, m-9'dan başlar).
> `PLAN-02`'nin dayanağıdır.

---

## 0. Yönetici Özeti

PLAN-01 uygulamanın **kabuğunu** tamamladı (yönlendirme, SEO, PWA, hata sınırı, test, erişilebilirlik).
Bu rapor **içeriğe** bakıyor ve tek bir kök nedenin uygulamanın bilgi değerinin büyük kısmını
sessizce yok ettiğini tespit ediyor.

**Tek cümlelik hüküm:** Uygulama Vikipedi'den her gün yüz binlerce karakterlik gerçek, kaynaklı
metin indiriyor ve **%100'ünü kullanmadan atıyor** — çünkü kod API'de var olmayan bir alan adı okuyor.

| Ölçüt | Durum | Not |
|---|---|---|
| `npm run test` | ✅ 203/203 geçiyor | Ancak K-6'yı yakalayamıyor — sebebi m-9 |
| `npm run typecheck` | ✅ Geçiyor | Alan adı hatası tip sistemine takılmıyor (isteğe bağlı alan) |
| Kullanıcıya gösterilen içerik | 🔴 Ciddi kayıp | 24 Ağustos'ta 38/38 "Detayı aç" paneli **boş** |
| Kişi adlarının doğruluğu | 🔴 Bozuk | Sayfada **141 isim** ham HTML olarak görünüyor |
| Kaynak bağlantısı isabeti | 🟠 Zayıf | Olay bağlantıları çoğu zaman genel varlığa (ülke/şehir) gidiyor |
| Editör kapsamı | 🟡 %16 | 366 günün 60'ında editör içeriği var |

**Yeni bulgu sayısı:** 2 kritik, 3 orta, 1 ürün/içerik boşluğu, 1 küçük not.

---

## 1. KRİTİK BULGULAR

### K-6 · Vikipedi API'sinin özet alanı yanlış adla okunuyor — uygulamanın tüm detay içeriği kayboluyor

**Dosyalar:** `src/lib/wiki.ts:11` (tip tanımı) ve 31 kullanım noktası —
`src/lib/wiki.ts`, `src/components/sections.tsx`, `src/hooks/useGunVerisi.ts`

Wikimedia "On this day" API'si her sayfa nesnesinde özet metni **`extract`** alanında döndürür.
Kod ise her yerde **`excerpt`** okuyor. Böyle bir alan API yanıtında **yoktur**.

```ts
// src/lib/wiki.ts:5-17 — WikiPage arayüzü
export interface WikiPage {
  title: string;
  displaytitle?: string;
  description?: string;
  excerpt?: string;          // ← API'de böyle bir alan YOK
  thumbnail?: { source: string };
  originalimage?: { source: string };
  content_urls?: { desktop?: { page?: string } };
}
```

**Kanıt — gerçek API yanıtındaki alanlar** (`api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/all/08/24`,
bir sayfa nesnesinin `Object.keys()` çıktısı):

```
type, title, displaytitle, namespace, wikibase_item, titles, pageid, thumbnail,
originalimage, lang, dir, revision, tid, timestamp, description,
description_source, content_urls, extract, extract_html, normalizedtitle
                                   ^^^^^^^
```

`'extract' in page === true` · `'excerpt' in page === false`

**Kanıt — kaybedilen içeriğin hacmi** (24 Ağustos, TR beslemesi):

| Bölüm | Öğe | `extract` dolu | `description` dolu | Görsel var |
|---|---|---|---|---|
| Olaylar | 39 | **39 (%100)** | 32 | 37 |
| Doğumlar | 93 | **93 (%100)** | 58 | 83 |
| Vefatlar | 48 | **48 (%100)** | 30 | 38 |

Olaylardaki `extract` metinlerinin **ortalama uzunluğu 469 karakter.** Yani uygulama her gün
yaklaşık **80.000 karakterlik** gerçek, kaynaklı Vikipedi metnini indirip çöpe atıyor.

**Kanıt — canlı DOM doğrulaması** (`localhost:3000`, 24 Ağustos, tarayıcıda çalıştırıldı):

Sayfadaki 38 "Detayı aç" düğmesinden ilk beşi tek tek açıldı ve açılan panelin metin uzunluğu ölçüldü:

| Olay yılı | Panel içerik uzunluğu |
|---|---|
| 79 (Vezüv) | **0 karakter** |
| 410 (Roma) | **0 karakter** |
| 1516 | **0 karakter** |
| 1572 | **0 karakter** |
| 1814 (Washington) | **0 karakter** |

**Etkilenen davranışlar — hepsi aynı kökten:**

| Görünen sorun | Kod yolu |
|---|---|
| "Detayı aç" boş panel açıyor | `sections.tsx:170` → `{e.detail \|\| e.page?.excerpt}` — ikisi de `undefined` |
| "Dosyayı aç" özeti tekrar ediyor | `useGunVerisi.ts:112` → `detail: item.pages?.[0]?.excerpt \|\| item.text` — hep `item.text` |
| Kişi modallarında biyografi yok | `sections.tsx:249` → `excerpt: p.excerpt` |
| Sohbet kartlarında doğum/vefat kartı hiç üretilmiyor | `wiki.ts:341,352` → `find((p) => p.thumbnail && p.excerpt)` hiç eşleşmiyor |
| Spotlight metni hep boş | `useGunVerisi.ts:152` → `featured.pages[0].excerpt` |
| Bilim kartı özeti ham metne düşüyor | `useGunVerisi.ts:131` → `e.pages?.[0]?.excerpt \|\| truncate(e.text, 260)` |

Canlı doğrulama son ikisini de teyit etti: sayfada `"'de bugün doğan:"` ve `"'de bugün veda etti:"`
kartları **hiç yok**, `"Arşivden öne çıkan"` spotlight'ı **hiç görünmüyor**.

**Etki:** Uygulamanın "detay" vaadinin tamamı. Kullanıcının bildirdiği altı şikayetten **beşi**
doğrudan bu bulgudan kaynaklanıyor.

**Düzeltme yönü:** `WikiPage.excerpt` → `extract` olarak yeniden adlandırılır (31 nokta).
Geriye dönük uyumluluk gerekmez — `excerpt` hiçbir zaman veri taşımadı.

---

### K-7 · Kişi adları ham HTML olarak gösteriliyor

**Dosya:** `src/components/sections.tsx:251` (ayrıca `src/lib/wiki.ts:344`, `wiki.ts:356`)

```ts
name: p.displaytitle || p.title,
```

Wikimedia API'sinin `displaytitle` alanı **HTML içerir**, düz metin değildir. React bu metni
kaçırdığı (escape ettiği) için etiketler ekranda olduğu gibi görünür.

**Kanıt — API yanıtı:**

```json
{
  "title": "Alan_Walker",
  "displaytitle": "<span lang=\"tr\" dir=\"ltr\"><span class=\"mw-page-title-main\">Alan Walker</span></span>",
  "normalizedtitle": "Alan Walker",
  "description": "Norveçli müzik yapımcısı"
}
```

24 Ağustos beslemesindeki **93 doğumun 93'ünde** `displaytitle` HTML içeriyor; düz metin olan **0**.

**Kanıt — canlı DOM:** Sayfadaki `<h3>` başlıklarından **141 tanesi** `<span` dizgesi içeriyor.
Kullanıcı bunu ekran görüntüsüyle bildirdi.

**İkincil hasarlar:**

- Görseli olmayan kişi kartlarında monogram harfi `p.name.charAt(0)` ile alınıyor → ekranda **`<`** çıkıyor
  (`sections.tsx:357-360`).
- `<img alt={p.name}>` → ekran okuyucular HTML etiketlerini okuyor (`sections.tsx:340`).
- Arama `matchQuery(query, p.name, …)` HTML üzerinde çalışıyor → `span`, `lang`, `class` gibi
  kelimeler tüm kişilerle eşleşiyor.

**Düzeltme yönü:** `normalizedtitle` kullanılır (API zaten temiz hâlini veriyor).
Yedek: `title.replace(/_/g, " ")`. `displaytitle` hiç kullanılmaz.

---

## 2. ORTA SEVİYE EKSİKLER

### O-14 · Olay bağlantıları olayın kendisine değil, içinde geçen genel varlığa gidiyor

**Dosya:** `src/hooks/useGunVerisi.ts:71` — `mergedEvents` üretimi

```ts
const page = item.pages?.find((p) => p.excerpt || p.content_urls?.desktop?.page);
```

`pages` dizisinin **ilk** URL'li öğesi seçiliyor. Wikimedia bu diziyi olay metnindeki geçiş sırasına
göre doldurur; ilk geçen varlık genellikle bir ülke veya şehirdir.

**Kanıt — kullanıcının bildirdiği örnek** (24 Ağustos, TR beslemesi):

```
1814 · "İngiliz Birlikleri, Washington'u işgal etti, White House ve pek çok başka binayı ateşe verdi."
   pages[0] İngiltere      · "Batı Avrupa'daki bir Birleşik Krallık ülkesi"   ← seçilen
   pages[1] Washington, DC · "Amerika Birleşik Devletleri'nin başkenti"
   pages[2] Beyaz Saray    · "ABD başkanının resmî konutu ve çalışma yeri"
```

**Canlı doğrulama:** Bağlantının `href`'i → `https://tr.wikipedia.org/wiki/İngiltere`

**İkinci örnek (daha ağır):**

```
1958 · "Bursa Kapalı Çarşı yangını."
   pages[0] Bursa   ← tek sayfa; bağlantı şehir makalesine gidiyor
```

**Denenen ve REDDEDİLEN çözüm — otomatik puanlama sezgiseli.**
Sayfa başlığı ve açıklamasına göre "özgüllük" puanlayan bir prototip yazıldı
(çok kelimeli başlık +, açıklamada olay yılı +, açıklamada "ülke/şehir/dil/meslek" −).
24 Ağustos'un çok sayfalı 28 olayına uygulandı; 11'inde farklı sayfa seçti.
Sonuçlar **karışık**, net bir iyileşme yok:

| Olay | Eski seçim | Puanlamanın seçimi | Değerlendirme |
|---|---|---|---|
| 1925 Şapka Devrimi | Kastamonu | Mustafa Kemal Atatürk | ✅ daha iyi |
| 1814 Washington | İngiltere | Washington, DC | 🟡 daha iyi ama Beyaz Saray daha doğruydu |
| 1932 Amelia Earhart | Amelia Earhart | Newark, New Jersey | ❌ **bozuyor** |
| 1912 Alaska | Alaska | Amerika Birleşik Devletleri | ❌ **bozuyor** |
| 1993 Keşmir | Keşmir | Müslüman | ❌ **bozuyor** |

**Denenen ve KISMEN çalışan ikinci yol — Vikipedi araması.**
Olay metninden anahtar kelime çıkarıp `api.wikimedia.org/core/v1/wikipedia/tr/search/page`'e sorulduğunda:

| Olay | Aramanın bulduğu | Değerlendirme |
|---|---|---|
| 1925 Şapka | **Şapka Devrimi** (1. sıra) | ✅ tam isabet |
| 1814 Washington | **Washington Yangını** (2. sıra) | ✅ doğru makale var |
| 1992 Çin–Güney Kore | **Çin-Güney Kore ilişkileri** (3. sıra) | ✅ |
| 1958 Bursa | "1958'de Türkiye" | ❌ gürültü |
| 79 Vezüv | "Volkan kemeri" | ❌ gürültü |

**Üçüncü yol — İngilizce besleme çapraz eşlemesi (doğrulandı, çalışıyor).**
EN beslemesi aynı gün için 76 olay içeriyor (TR: 39) ve olay makalelerine doğrudan bağlanıyor:

```
EN 1814 · pages[0] = Burning_of_Washington · "1814 British attack on the United States"
```

`en.wikipedia.org/w/api.php?…&prop=langlinks&lllang=tr` sorgusu bunun TR karşılığını veriyor:
**"Washington Yangını"** — yani TR Vikipedi'de doğru makale var, besleme onu bağlamıyor.
Ortak yıla sahip 27 olayın 6'sında (%22) EN beslemesi gerçek bir olay makalesi veriyor
(İtalya depremi, İran uçak kazası, Hebron katliamı, Washington yangını, İspanya İç Savaşı, Asturias Konseyi).

**Hüküm:** Tek "doğru" sayfayı otomatik seçmek güvenilir biçimde çözülebilir bir problem değildir.
**Tahmin yerine seçenek sunulmalıdır** — tüm ilgili sayfalar açıklamalarıyla gösterilir,
ayrıca gerçek Vikipedi aramasına bir çıkış konur. EN çapraz eşlemesi, isabet ettiğinde
kazandırdığı için ek bir katman olarak değerlidir; tek başına birincil mekanizma olamaz.

---

### O-15 · Otomatik karanlık dosyalar uydurma editör hükmü taşıyor, detayı özetin kopyası

**Dosya:** `src/hooks/useGunVerisi.ts:104-118`

```ts
auto.push({
  id: `auto-${item.id}`,
  year: item.year,
  type,
  title: firstClause(item.text),
  location: "Arşiv taraması — otomatik tespit",   // ← her dosyada sabit
  status: "KAPANDI",                              // ← her dosyada sabit
  summary: truncate(item.text, 240),
  detail: item.pages?.[0]?.excerpt || item.text,  // ← K-6 nedeniyle hep item.text
  tags: [theme.toLocaleLowerCase("tr-TR"), formatYear(item.year)],
});
```

**İki ayrı sorun:**

1. **`status: "KAPANDI"` bir editör hükmüdür ve uydurmadır.** Otomatik regex taramasıyla tespit
   edilmiş bir kayıt hakkında "dosya kapandı" demek, kullanıcıya olayın çözüldüğü izlenimi verir.
   Kullanıcı bunu doğrudan sordu: *"kapandı yazıyor, yani kapandıdan kastı olay çözüldü mü?"*
   Bu, `BAGLAM.md` §1'deki 3. ürün ilkesine (**"Kaynağı gizleme"** — otomatik içerik ile editör
   içeriği görsel olarak ayrılmalı) aykırıdır. Karanlık dosyalarda otomatik/editör ayrımını
   gösteren **hiçbir rozet yok** — Zaman Tüneli'nde "Editör notu", Bilim'de "Editör" rozeti varken.
2. **`detail === summary`.** K-6 nedeniyle `detail` hep `item.text`'e düşüyor; `summary` de
   aynı metnin 240 karakterlik kısaltması. Dosya açıldığında ekranda aynı cümle iki kez yazıyor.

**Canlı doğrulama** (24 Ağustos, kullanıcının örneği):

```
Özet   : "Bursa Kapalı Çarşı yangını."
Detay  : "Bursa Kapalı Çarşı yangını."
Aynı mı: true
```

Sayfadaki tüm damgalar tek değer gösteriyor: `["KAPANDI"]`.
Tüm konum satırları tek değer: `["Arşiv taraması — otomatik tespit"]`.

**Not:** O-10 (kontrast bulgusu, PLAN-01'den devredildi) de tam olarak bu bölümdeki iki öğeyi
işaret ediyor — `text-brand` rozeti ve "Dosyayı aç/kapat" düğmesi. İki bulgu aynı dosyada
birlikte çözülmelidir.

---

### O-16 · API'nin hazır `description` alanı hiç gösterilmiyor

**Dosya:** `src/components/sections.tsx:246` — yalnızca sınıflandırma girdisi olarak kullanılıyor

```ts
const probe = `${p.title} ${p.description || ""} ${p.excerpt || ""} ${it.text}`;
//                          ^^^^^^^^^^^^^^ sınıflandırmaya giriyor, ekrana çıkmıyor
```

`description` alanı Vikipedi'nin kısa tanımıdır: *"Norveçli müzik yapımcısı"*,
*"ABD'li kadın basketbolcu"*, *"Karadağlı hentbolcu"*. 24 Ağustos'ta doğumların 58'inde,
vefatların 30'unda, olayların 32'sinde dolu.

Kişi kartlarında ad ile açıklama arasında bir alt başlık olarak gösterilebilecekken hiç kullanılmıyor.
Kod tabanında `normalizedtitle` **0 kez**, `extract_html` **0 kez**, `wikibase_item` **0 kez** geçiyor.

**Etki:** Düşük, ama maliyeti sıfır bir kazanç — veri zaten indirilmiş durumda.

---

## 3. ÜRÜN / İÇERİK BOŞLUĞU

### U-6 · Kullanıcının "daha detaylı öğrenebileceğim bir yer" ihtiyacı karşılanmıyor

**Kullanıcı ifadesi (2026-08-24):**

> "Mesela bugün 24 Ağustos 1958 yılında Bursalı Capital Çarşı yangını olmuş. Ama bununla ilgili
> herhangi bir bilgi yok. Sadece bu kadar. Benim bu daha detaylı öğrenebileceğim bir yer lazım."
>
> "Vikipedi yönlendirmesi bana yeterli gelmiyor — farklı bilgiler, o anda kısa bir özet."

**Mevcut durum üç katmanda eksik:**

| Katman | Durum |
|---|---|
| Editör içeriği | 366 günün **60'ında** var (%16). 24 Ağustos'ta **yok** |
| Vikipedi özeti | İndiriliyor ama gösterilmiyor (K-6) |
| Harici araştırma | Tek çıkış Vikipedi bağlantısı, o da çoğu zaman yanlış sayfaya (O-14) |

K-6 düzeltilince ikinci katman açılır ve boşluğun büyük kısmı kapanır. Ancak kullanıcı bunun
ötesinde **o anda, uygulama içinde, olaya özel bir açıklama ve serbest soru sorabilme** istiyor.

**Yapay zekâ değerlendirmesi.** PLAN-01 bu konuyu *"Ayrı değerlendirme"* notuyla ertelemişti
ve `ICERIK-SABLONU.md` §0 **"Yapay zekâ ile toplu içerik üretimi yasaktır"** diyor.
Kullanıcı 2026-08-24'te bu değerlendirmeyi açıkça istedi ve çalışma zamanı YZ yönünde karar verdi.

**Teknik fizibilite — canlı test edildi (tarayıcıdan, sahte anahtarla):**

| Servis | CORS | Yanıt |
|---|---|---|
| `api.anthropic.com/v1/messages` (+ `anthropic-dangerous-direct-browser-access: true`) | ✅ geçti | HTTP 401 `invalid x-api-key` |
| `generativelanguage.googleapis.com` (Gemini) | ✅ geçti | HTTP 400 `API key not valid` |

Yani **backend gerekmiyor**; tarayıcıdan doğrudan çağrı yapılabiliyor.

**Sağlayıcı karşılaştırması (2026-08-24 itibarıyla, resmî fiyatlandırma sayfalarından):**

| | Claude | Gemini ücretsiz katman |
|---|---|---|
| Model çağrısı | Ücretli (Haiku 4.5: $1/$5 MTok) | **Ücretsiz** (Flash / Flash-Lite) |
| Web arama | $10 / 1.000 arama, **kaynak atıflı** | ❌ ücretsiz katmanda **yok** |
| Veri kullanımı | Eğitimde kullanılmaz | ⚠️ "Google'ın ürünlerini geliştirmek için" kullanılır |

**Karar (kullanıcı, 2026-08-24):** Ücretsiz katman nedeniyle **Gemini**.

**Halüsinasyon riski ve tasarımla azaltılması.** Ücretsiz katmanda arama olmadığı için model
yalnızca kendi hafızasından konuşur. "Bursa Kapalı Çarşı yangını" gibi niş bir Türkiye tarihi
konusunda Flash seviyesi bir model için bu **gerçek bir uydurma riskidir** — §0 yasağının
yazılma sebebi tam olarak budur.

**Azaltma:** K-6 düzeltildikten sonra elde edilecek Vikipedi `extract` metni modele **bağlam**
olarak verilir. Görev "hatırla" olmaktan çıkıp "önündeki metni açıkla"ya döner:

```
❌ "1958 Bursa Kapalı Çarşı yangını hakkında ne biliyorsun?"     → hafızadan üretir
✅ "Şu Vikipedi metnine dayanarak olayı açıkla. Metinde olmayan
    bilgiyi ekleme; emin olmadığın yeri 'kaynakta belirtilmemiş'
    olarak işaretle. [extract]"                                   → verilen metni işler
```

Bu tasarım hem ücretsiz katmanla uyumludur hem de §0'ın koruduğu değeri (olgusal doğruluk)
korur. Yine de üretilen metin **açıkça YZ üretimi olarak etiketlenmeli** ve editör içeriğinden
görsel olarak ayrılmalıdır (aynı 3. ürün ilkesi).

---

## 4. KÜÇÜK NOTLAR

### m-9 · Test kümesi API'de olmayan bir alanı doğruluyor

**Dosya:** `src/lib/wiki.test.ts:102-115`

```ts
pages: [{ title: "Kişi", displaytitle: "Kişi", excerpt: "Kısa özet." }],
//                                       ^^^^^^^ elle uydurulmuş alan
```

203 testin tamamı yeşil olmasına rağmen K-6 ve K-7 fark edilmedi; çünkü test verisi
gerçek API yanıtından değil, kodun **beklediği** biçimden türetilmiş. Test, gerçeği değil
hatanın kopyasını doğruluyor.

**Düzeltme yönü:** `src/lib/__fixtures__/` altına gerçek bir API yanıtının kırpılmış kopyası
konur ve testler ondan beslenir. Böylece alan adı sözleşmesi kırıldığında test kırmızıya döner.

---

## 5. Bulgu Durum Tablosu

| Kod | Bulgu | Ağırlık | Talimat |
|---|---|---|---|
| K-6 | `excerpt`/`extract` alan adı hatası — tüm detay içeriği kayboluyor | 🔴 Kritik | T-16 |
| K-7 | Kişi adları ham HTML gösteriliyor | 🔴 Kritik | T-16 |
| O-14 | Olay bağlantısı genel varlığa gidiyor | 🟠 Orta | T-18 |
| O-15 | Otomatik karanlık dosyada uydurma "KAPANDI" + detay tekrarı | 🟠 Orta | T-17 |
| O-16 | `description` alanı hiç gösterilmiyor | 🟠 Orta | T-16 |
| U-6 | Derinlik yok — uygulama içi araştırma katmanı gerekiyor | 🟡 Ürün | T-19, T-20 |
| m-9 | Test kümesi gerçek API yanıtıyla beslenmiyor | ⚪ Küçük | T-16 |

**PLAN-01'den devredilenler** (bu planda ele alınacak):

| Kod | Bulgu | Talimat |
|---|---|---|
| O-10 | `text-brand` kontrast yetersizliği (karanlık dosyalar bölümü) | T-17 |
| O-11 | `holidays` alanında Vikipedi şablon artığı çöp kayıtlar | T-21 |
| O-12 | `allScience` editör/otomatik mükerrerliğini ayıklamıyor | T-21 |
| O-13 | `react-router` güvenlik danışma kayıtları (kırıcı yükseltme) | T-22 |
| m-7, m-8 | Zararsız küçük notlar | T-21 |

---

## 6. Kanıt Üretim Komutları

Bu rapordaki ölçümler aşağıdaki komutlarla yeniden üretilebilir:

```bash
curl -s "https://api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/all/08/24" -o tr-0824.json
```

```bash
node -e "const d=require('./tr-0824.json'); const p=d.events[0].pages[0]; console.log(Object.keys(p).join(', ')); console.log('extract:', 'extract' in p, '| excerpt:', 'excerpt' in p);"
```

Canlı DOM doğrulaması `npm run dev` sonrası tarayıcı konsolunda yapılmıştır
(detay panellerinin `textContent.length` ölçümü, `<h3>` içindeki `<span` taraması,
karanlık dosya özet/detay karşılaştırması, 1814 olayının bağlantı `href`'i).
