# T-25 · Web Aramalı Araştırma Modu

| Alan             | Değer                                                         |
| ---------------- | ------------------------------------------------------------- |
| **Faz**          | Bakım — T-20'nin devamı, T-24'ün üstüne                       |
| **Öncelik**      | 🔴 Yüksek (özellik çalışıyor ama kullanıcının işini görmüyor) |
| **Tahmini süre** | ~5–6 saat                                                     |
| **Bağımlılık**   | T-20 ve T-24 tamamlanmış olmalı                               |
| **İlgili bulgu** | Canlı kullanıcı raporu — 2026-09-02                           |
| **Durum**        | ✅ Tamamlandı                                                 |

> ⚠️ **Bu talimat bir hata düzeltmez; bilinçli bir kısıtı kaldırır.**
> T-20 yapay zekâyı bilerek ekrandaki Vikipedi paragrafına hapsetti (halüsinasyon
> korkusu, §Halüsinasyon Riski). Kullanıcı şimdi tam da o kapatılan şeyi istiyor.
> Kısıtı kaldırmanın **tek dürüst yolu** modeli serbest bırakmak değil, ona
> gerçek bir arama aracı vermek ve kaynakları ekranda göstermektir.

---

## 🎯 Amaç

Panel bugün "ekrandaki paragrafı açıklayan" bir araç. Bu talimattan sonra
**olayı web'de araştırıp özetleyen ve kullandığı kaynakları gösteren** bir araç
olacak.

Somut fark, aynı soruda:

| Bugün                                                                          | T-25'ten sonra                                                                                                                       |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| _"Bu olayın sonuçları ne oldu?"_ → **"Kaynakta belirtilmemiş."**               | Google'da arar, olayın sonuçlarını 120–200 kelimeyle özetler, altında tıklanabilir kaynak listesi durur.                             |
| Bağlam metni İngiltere maddesinin coğrafya özetiyse model İngiltere'yi anlatır | Modele **olayın künyesi** (tarih + olay cümlesi + madde adı) verilir; arama olayın kendisini hedefler.                               |
| Künye satırı: "yukarıdaki Vikipedi özetine dayanılarak üretildi"               | Künye satırı hangi modun çalıştığını doğru söyler: web'de arandıysa "arandı", aranmadıysa (model gerek görmediyse) eski cümle durur. |

---

## 📍 Mevcut Durum

### Kullanıcı raporu (2026-09-02)

> "Bu uygulamadaki yapay zekâ istediğim gibi çalışmıyor; soru sorduğumda
> internetten araştırması gerekiyor, özet vermesi gerekiyor."

Doğru bir teşhis. Ve **istem metnini değiştirerek çözülemez** — modelde arama
yeteneği isteğin içinde açılmadığı sürece yoktur. Aşağıdaki üç sebebin üçü de
aynı anda giderilmeli; biri eksik kalırsa sonuç ya değişmez ya da yanlış şeyi
araştırır.

### Sebep 1 — İstem, modeli metnin dışına çıkmaktan **men ediyor**

`src/lib/yapayzeka/istem.ts:56` ve devamı:

```ts
"Aşağıdaki Vikipedi metnine dayanarak yanıt ver.",
"",
"Kurallar:",
"- Yalnızca metinde yazanı kullan; metinde olmayan bilgi ekleme.",
'- Emin olmadığın yeri "kaynakta belirtilmemiş" olarak işaretle.',
```

Model kuralı uyguluyor. Kullanıcının "araştırmıyor" dediği davranış, isteme
kelimesi kelimesine yazılmış olan davranıştır.

### Sebep 2 — İstekte **arama aracı yok**

`src/lib/yapayzeka/gemini.ts:124`:

```ts
const govde = JSON.stringify({
  contents: [{ role: "user", parts: [{ text: istemBirlestir(istem, baglam) }] }],
  generationConfig: { temperature: 0.2, maxOutputTokens: YANIT_JETONU },
});
```

`tools` alanı hiç yok. Dosya başlığındaki _"Gemini ücretsiz katmanında web
araması yoktur"_ notu **artık doğru değil** (bkz. §Araştırma Kaydı). Bu not
2026-08 tarihli bir gözlemdi; o zamandan beri `google_search` aracı ücretsiz
katmana da açıldı.

### Sebep 3 — Model, **hangi olayı** konuştuğunu bilmiyor

`src/components/DetayPaneli.tsx:148`:

```tsx
<YapayZekaBolumu baglam={metin} kaynakAdi={metinKaynagi?.title ?? ozetBasligi} />
```

Panelin elindeki `baslik` (= `e.text`, olay cümlesi) ve olayın **yılı** yapay
zekâya hiç geçmiyor (`sections.tsx:201`). Modelin gördüğü tek şey `metin`, yani
beslemenin `extract`i.

Bu, T-18'in ve `olayMakalesi.ts` başlığının belgelediği bilinen bir durumla
birleşince arama modunu **doğrudan sabote eder**: besleme, olayın kendi
maddesini değil, olay cümlesinde ilk geçen varlığın maddesini bağlar. 24 Ağustos
1814 olayında panele düşen metin `İngiltere` maddesinin 444 karakterlik coğrafya
özetidir. Sebep 1 ve 2 giderilip Sebep 3 bırakılırsa elde edilecek şey şudur:
**İngiltere'nin coğrafyasını web'de araştıran bir model.** Sebep 3 bu yüzden
isteğe bağlı bir iyileştirme değil, diğer ikisinin ön koşuludur.

### Etkilenecek dosyalar

| Dosya                                 | Ne değişecek                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| `src/lib/yapayzeka/istem.ts`          | İki mod (araştırma / kaynağa sadık), olay künyesi bloğu, yeni varsayılan görev |
| `src/lib/yapayzeka/gemini.ts`         | `tools: [{ google_search: {} }]`, `groundingMetadata` ayrıştırma, 400 tuzağı   |
| `src/lib/yapayzeka/tipler.ts`         | `YzIstek` / `YzYanit` / `YzOlay` tipleri, yeni mesajlar                        |
| `src/lib/yapayzeka/anahtar.ts`        | "Web'de araştır" tercihi (`ty-yz-arama`)                                       |
| `src/lib/yapayzeka/index.ts`          | Yeni dışa aktarımlar                                                           |
| `src/components/YapayZekaBolumu.tsx`  | Kaynak listesi, arama önerileri, doğru künye satırı, `olay` prop'u             |
| `src/components/DetayPaneli.tsx`      | `olay` künyesini yapay zekâ bölümüne geçirme                                   |
| `src/components/sections.tsx`         | Üç çağrı noktasında künyeyi kurma (olay / kişi / dosya)                        |
| `src/components/YzAyarlari.tsx`       | "Web'de araştır" anahtarı; sınama isteği aramasız kalacak                      |
| `src/lib/yapayzeka/yapayzeka.test.ts` | Yeni davranışların testleri                                                    |
| `src/components/*.test.tsx`           | Değişen imza ve yeni arayüz                                                    |

---

## 🔬 Araştırma Kaydı — 2026-09-02

> Aşağıdakiler bu talimat yazılırken canlı belgelerden doğrulandı.
> **Yeniden araştırmayın**; doğrudan uygulayın.

| Konu                          | Doğrulanan                                                                                                                                                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aracın adı ve yeri            | Klasik `generateContent` gövdesinde `tools: [{ "google_search": {} }]`. Alan adı **yılan_kılıfı** (`google_search`), `googleSearch` değil.                                                                                         |
| Yanıt üst verisi              | `candidates[0].groundingMetadata` altında: `webSearchQueries` (dizi), `groundingChunks[].web.uri` + `.title`, `groundingSupports[].segment` + `.groundingChunkIndices`, `searchEntryPoint.renderedContent` (HTML+CSS).             |
| Model desteği                 | Gemini 2.0 Flash'tan itibaren tüm Flash/Pro hattı destekliyor — `ADAY_MODELLER`'in **üçü de** listede (`gemini-3.5-flash`, `gemini-2.5-flash`, `gemini-2.5-flash-lite`).                                                           |
| Ücretsiz katman               | Gemini 2.5 hattı: **500 istek/gün** (Flash ile Flash-Lite bu kotayı paylaşır). Gemini 3.x hattı: **ayda 5.000 arama**. Yani BYOK kullanıcısı için ücretsiz — ama sınırsız değil.                                                   |
| Ücretli fiyat (bilgi olarak)  | 2.5 hattı 1.000 istem başına 35 $, 3.x hattı 1.000 arama başına 14 $. Uygulama hiçbir koşulda kullanıcı adına ücret doğurmaz; anahtar kullanıcınındır.                                                                             |
| **Kaynak bağlantıları**       | `groundingChunks[].web.uri` **gerçek adres değildir**: `https://vertexaisearch.cloud.google.com/grounding-api-redirect/…` biçiminde bir yönlendirmedir ve kalıcı değildir. `web.title` çoğunlukla alan adıdır (`reuters.com` vb.). |
| **Kullanım şartı**            | Şartlar, Grounded Results ile birlikte gelen Search Suggestions'ın / bağlantıların kullanıcıya **gösterilmesini** ister ve sonuçların "değiştirilmesini, araya başka içerik sokulmasını" ve **önbelleğe alınmasını** yasaklar.     |
| Desteklemeyen model / çakışma | Araç desteklenmiyorsa ya da özel fonksiyon çağrısıyla birleştirilirse API **400** döndürür — 404 değil.                                                                                                                            |
| Yapılandırılmış çıktı         | `google_search` ile `responseMimeType`/şema **birlikte çalışmaz**. Bizi etkilemiyor (düz metin üretiyoruz) ama ileride şema eklenmemeli.                                                                                           |
| CORS                          | Klasik `v1beta/models/…:generateContent` ucu tarayıcıdan çalışıyor (T-24'te canlı doğrulandı). Yeni **Interactions API** tarayıcıdan **çağrılamaz** (`api-revision` başlığı ön uçuşta reddediliyor) — o uca **geçmeyin**.          |

### Bu kaydın doğurduğu iki kritik sonuç

**1. 400 tuzağı.** `src/lib/yapayzeka/tipler.ts:77`:

```ts
if (status === 400 || status === 401 || status === 403) return YZ_MESAJ.anahtar;
```

Aracı desteklemeyen bir modele arama isteği gidince kullanıcı **"Anahtar
geçersiz görünüyor. Ayarlardan kontrol edin."** görür. Bu, olabilecek en yanlış
mesajdır: kullanıcı çalışan anahtarını silip yenisini almaya gider. Üstelik
T-24'ün kendini onarma zinciri **yalnızca 404'te** ilerlediği için burada devreye
girmez. Madde 5 bunu çözer.

**2. Ham HTML çelişkisi.** `searchEntryPoint.renderedContent` HTML'dir; T-20
madde 7 ise ham HTML basmayı yasaklar (XSS yüzeyi). İkisi de haklı. Çözüm madde
6.3'te: **komut dosyası yetkisi olmayan bir `iframe`**.

---

## ✅ Yapılacaklar

### 1. Olay künyesini yapay zekâya kadar taşı

`tipler.ts`'e:

```ts
/** Modelin **neyi** araştıracağını söyleyen künye. Bağlam metninden bağımsızdır. */
export interface YzOlay {
  /** Kullanıcının baktığı takvim günü + olayın yılı: "24 Ağustos 1814". */
  tarih: string;
  /** Beslemenin olay cümlesi (`OtdItem.text`) ya da kişi/dosya başlığı. */
  baslik: string;
  /** Bağlamın geldiği Vikipedi maddesi — bugünkü `kaynakAdi`. */
  madde?: string;
}
```

- `YapayZekaBolumu` yeni bir `olay?: YzOlay` prop'u alsın.
- `DetayPaneli` künyeyi kurup geçsin; künyeyi **çağrı noktası** doldurur, panel
  uydurmaz.
- `sections.tsx`'teki üç çağrı noktası:
  - **Olay listesi (satır ~201):** `tarih` = görüntülenen gün + `e.year`,
    `baslik` = `e.text`, `madde` = `makale?.title ?? ozetSayfasi?.title`.
  - **Kişi modalı (satır ~492):** `tarih` = gün (yıl kişinin doğum/ölüm yılı),
    `baslik` = `modal.name`, `madde` = `modal.name`.
  - **Karanlık dosya (satır ~662):** `tarih` = gün + varsa dosyanın yılı,
    `baslik` = `c.title`.
- Künye **yoksa** araştırma modu yine de çalışabilmeli (bağlam metnine düşer);
  ama künye varsa arama belirgin biçimde isabetlenir.

### 2. `istem.ts` — iki mod

`istemBirlestir` tek bir metin üretmeye devam etsin ama iki kurallı gövdeden
birini seçsin. Tam metinler §Hazır İstem Metni'nde; buraya kopyalanacak.

- `ARASTIRMA_KURALLARI` — arama açıkken.
- `KAYNAGA_SADIK_KURALLARI` — bugünkü kurallar, **aynen korunur** (arama kapalı
  ya da geri çekilme durumunda kullanılır).
- `VARSAYILAN_ISTEM` araştırma modunda değişsin:
  `"Bu olayı araştır; ne olduğunu ve neden önemli olduğunu kısaca özetle."`
  Kaynağa sadık moddaki bugünkü metin olduğu gibi kalsın.
- Olay künyesi bloğu bağlamdan **önce**, kurallardan **sonra** gelsin.
- Görev satırı **iki kez** yazılsın: kurallardan hemen sonra ve metnin en
  sonunda. Sebep dosyanın kendi notunda yazılı (model uzun metnin başındaki
  yönergeye daha iyi uyar); araştırma modunda istem uzadığı için sondaki
  tekrar görevi tazeler.
- `BAGLAM_SINIRI` 4000 kalsın.

### 3. `gemini.ts` — arama aracını ekle

```ts
const govde = (arama: boolean) =>
  JSON.stringify({
    contents: [{ role: "user", parts: [{ text: istemBirlestir(...) }] }],
    ...(arama ? { tools: [{ google_search: {} }] } : {}),
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: arama ? ARAMA_JETONU : YANIT_JETONU,
    },
  });
```

- `ARAMA_JETONU = 3072`. Gerekçe: T-24'ün `YANIT_JETONU` notu hâlâ geçerli —
  düşünme jetonları çıktı bütçesinden yenir; arama tur sayısı arttıkça bu pay
  büyür, 2048 tekrar `MAX_TOKENS`'a çarpar.
- `thinkingConfig`'e **dokunulmayacak** (T-24 kapsam dışı kaydı geçerli).
- Yanıt ayrıştırma `groundingMetadata`yı da okusun:

```ts
interface GeminiYanit {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    finishReason?: string;
    groundingMetadata?: {
      webSearchQueries?: string[];
      groundingChunks?: { web?: { uri?: string; title?: string } }[];
      searchEntryPoint?: { renderedContent?: string };
    };
  }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string; status?: string };
}
```

- `yanitiCoz` düz metin döndürmeye devam etsin; üst veri için ayrı bir saf
  fonksiyon yazılsın (`kaynaklariCoz`) — ikisi de ayrı ayrı test edilebilsin.
- Kaynaklar **URL'e göre tekilleştirilsin** ve **en çok 5** tanesi tutulsun
  (kullanım şartındaki üst sınır).

### 4. `tipler.ts` — istek ve yanıt tipleri

Konumsal parametre zincirini (`sor(istem, baglam, signal)`) tek nesneye çevir:

```ts
export interface YzIstek {
  soru: string;
  baglam: string;
  olay?: YzOlay;
  /** Web araması açık mı — çağrı noktası karar verir, sağlayıcı değil. */
  arama: boolean;
  signal?: AbortSignal;
}

export interface YzYanit {
  metin: string;
  /** Model **gerçekten** aradı mı? `webSearchQueries` doluysa evet. */
  arandi: boolean;
  /** En çok 5, tekilleştirilmiş. `url` Google yönlendirmesidir, olduğu gibi kullanılır. */
  kaynaklar: { baslik: string; url: string }[];
  /** Modelin Google'da aradığı sorgular — künye satırında gösterilir. */
  sorgular: string[];
  /** `searchEntryPoint.renderedContent` — sandbox `iframe` içinde basılır. */
  aramaOnerileriHtml?: string;
}
```

Gerekçe: dördüncü bir konumsal parametre eklemek çağrı noktalarında
`sor(a, b, undefined, undefined, signal)` üretirdi. İki çağrı noktası var
(`YapayZekaBolumu.tsx:72`, `YzAyarlari.tsx:112`), ikisi de nesneye çevrilecek.

Yeni mesajlar:

```ts
aramaYok: "Web araması yapılamadı; yanıt yalnızca sayfadaki metne dayanıyor.",
aramaKotasi: "Günlük arama hakkı dolmuş olabilir; yanıt sayfadaki metne dayanıyor.",
```

### 5. 400 tuzağı — tek seferlik geri çekilme

`sor()` içinde, **yalnızca arama açıkken**:

- İstek `400` dönerse gövde okunsun. `error.message` içinde `tool`,
  `google_search` ya da `not supported` geçiyorsa: **aynı model için** aramasız
  bir istek tekrarlansın (`tools` alanı olmadan, kaynağa sadık kurallarla).
- Geri çekilme başarılıysa yanıt `arandi: false` ile dönsün; panel
  `YZ_MESAJ.aramaYok` satırını göstersin. Kullanıcı yanıtsız kalmasın.
- O modelin aramayı desteklemediği `localStorage`'a yazılsın
  (`ty-yz-arama-yok:<model>`) ki her soruda iki istek atılmasın.
- `error.message` araçla ilgili **değilse** davranış bugünkü gibi kalsın
  (anahtar mesajı) — gerçek anahtar hatasını gizlemeyin.
- `429` geldiğinde geri çekilme **yapılmasın**: kota hatası kotayı ikinci
  istekle daha da yakar. Bugünkü `YZ_MESAJ.kota` gösterilsin.

> Bu maddenin tamamı T-24'ün kuralının aynısıdır, bir basamak yukarıda:
> **sessizce ilerlemek yalnızca "bu yol kapalı" anlamına gelen durumda meşrudur.**

### 6. `YapayZekaBolumu.tsx` — dürüst arayüz

**6.1 Künye satırı doğruyu söylesin.** Bugünkü sabit cümle (satır 193) yanıtın
moduna göre değişsin:

- `arandi === true` → "Bu metin, {sağlayıcı} tarafından web'de arama yapılarak
  üretildi. Editör derlemesi değildir; aşağıdaki kaynaklardan doğrulayın."
- `arandi === false` → bugünkü cümle **aynen** kalsın.

Rozet ("YZ üretimi") ve leylak renk şeması değişmesin — T-20 madde 5 ve
BAGLAM.md §1'in "kaynağı gizleme" ilkesi.

**6.2 Kaynak listesi.** Yanıt kutusunun altında, `KaynakCipleri`'nin görsel
diliyle uyumlu, en çok 5 bağlantı: `target="_blank" rel="noopener noreferrer"`,
`IconExternal` ile. `web.title` boşsa alan adı gösterilsin.
Bağlantı adresi **değiştirilmesin, çözülmeye çalışılmasın, saklanmasın**
(kullanım şartı).

**6.3 Arama önerileri (`searchEntryPoint`).** Kullanım şartı bunun
gösterilmesini ister; T-20 madde 7 ham HTML basmayı yasaklar. İkisini birden
karşılayan tek yol:

```tsx
<iframe
  title="Google arama önerileri"
  srcDoc={aramaOnerileriHtml}
  sandbox="allow-popups allow-popups-to-escape-sandbox"
  className="w-full h-11 border-0"
/>
```

- `allow-scripts` **ve** `allow-same-origin` **birlikte asla verilmez** — bu
  ikisi bir aradayken sandbox kendini iptal eder.
- Yükseklik canlıda ölçülüp sabitlensin; Google'ın kutusu tek satırdır.
- **Plan B:** `iframe` içindeki bağlantı tıklanamıyorsa (sandbox açılır pencereyi
  kesiyorsa) öneri kutusu yerine `sorgular` düz metin olarak yazılsın ve her biri
  `https://www.google.com/search?q=…` bağlantısına dönüşsün. Şartın "Search
  Suggestions **ya da diğer bağlantılar**" ifadesi bunu karşılar. Hangi yolun
  seçildiği Tamamlanma Kaydı'na yazılsın.

**6.4** Soru kutusunun altındaki ipucu satırı (satır 142) araştırma modunda
"Boş bırakırsanız olayı araştırıp özetler" desin.

### 7. `YzAyarlari.tsx` — "Web'de araştır" anahtarı

- Model bölümünün altına tek bir açma/kapama: **varsayılan AÇIK.**
  Gerekçe: kullanıcının şikâyeti "araştırmıyor". Varsayılanı kapalı yapmak aynı
  şikâyeti üretir; kapatma imkânı yine de dursun (kota, gizlilik, hız).
- Tercih `localStorage`'da: `ty-yz-arama` — `anahtar.ts`'teki mevcut
  try/catch + `useSyncExternalStore` deseniyle, yeni bir desen icat etmeden.
- Anahtarın altına tek satır bilgi: _"Ücretsiz katmanda günlük arama hakkı
  sınırlıdır; dolduğunda yanıt sayfadaki metinle üretilir."_
- **"Bağlantıyı sına" isteği aramasız gitsin** (`arama: false`). Sınama tanı
  aracıdır; günlük arama kotasını yakmamalı.

### 8. Testler

`fetch` kuklasıyla (mevcut desen):

1. `arama: true` → gövdede `tools[0].google_search` var; `arama: false` → `tools`
   alanı **hiç yok**.
2. `groundingMetadata` dolu yanıt → `arandi: true`, kaynaklar tekilleşmiş ve
   5'te kırpılmış, sorgular geçiyor.
3. `groundingMetadata` **yok** ama 200 → `arandi: false`, metin yine dönüyor
   (model aramaya gerek görmemiş olabilir; bu bir hata değil).
4. 400 + gövdesinde araç hatası → ikinci istek `tools`suz atılıyor, metin dönüyor,
   `arandi: false`.
5. 400 + araçla ilgisiz gövde → **tek** istek, `YZ_MESAJ.anahtar`.
6. 429 → **tek** istek, `YZ_MESAJ.kota`, geri çekilme yok.
7. Aramayı desteklemediği öğrenilen model → ikinci soruda doğrudan `tools`suz
   gidiyor (tek `fetch`).
8. `istemBirlestir`: künye verilince "OLAY KÜNYESİ" bloğu istemde; araştırma
   modunda "Yalnızca metinde yazanı kullan" cümlesi **yok**; kaynağa sadık
   modda **var**.
9. Bileşen: `arandi` true iken kaynak listesi ve yeni künye cümlesi basılıyor;
   false iken eski cümle basılıyor ve kaynak listesi hiç yok.

### 9. Belgeler

- `CHANGELOG.md` → `[Yayımlanmamış] › Eklenen`: T-25 etiketli madde.
- `Dokumanlar/KULLANIM-KILAVUZU.md` → yapay zekâ bölümüne araştırma modu, kota
  sınırı ve kaynak listesi anlatılsın.
- `src/lib/yapayzeka/index.ts` ve `gemini.ts` başlıklarındaki _"ücretsiz katmanda
  web araması yoktur"_ notları **düzeltilsin** — yanlış bilgi kod içinde kalmasın.

---

## 📄 Hazır İstem Metni

> Bu bölüm `istem.ts`'e **olduğu gibi** taşınacak metindir. Uygulayan oturum
> yeniden yazmasın; kelimeler halüsinasyon davranışını doğrudan etkiliyor.

### A) Araştırma modu (arama açık)

```
Sen Türkçe yazan bir tarih anlatıcısısın. Görevin, aşağıda künyesi verilen olayı
Google Arama ile araştırıp anlaşılır bir özet çıkarmaktır.

Nasıl çalışacaksın:
- Önce araştır. Künyedeki tarihi, olay cümlesini ve madde adını kullanarak arama
  yap; tek arama yetmezse birden fazla arama yap.
- "ELDEKİ METİN" bir başlangıç ipucudur, sınır değildir. Metinde olmayan ama
  aramayla doğruladığın bilgiyi ekle.
- Eldeki metin ile arama sonuçları çelişirse çelişkiyi gizleme: yaygın kabul
  göreni yaz, diğerini "bazı kaynaklarda ..." diye belirt.
- Bulamadığını uydurma. Arama sonuç vermezse "güvenilir bir kaynakta bulamadım"
  de ve elindekiyle yetin.
- Tarih, yer, sayı ve özel adları yalnızca bir kaynakta gördüysen yaz.
- Künyedeki tarih olayın tarihidir; başka bir yılın olayını anlatma.

Nasıl yazacaksın:
- Türkçe, sade, akıcı. Bir yayıncının dinleyicisine anlatacağı ton.
- 120-200 kelime, tek parça düz paragraf.
- Madde işareti, başlık, numaralı liste, yıldız, kare, HTML kullanma.
- Yanıtın sonuna kaynak listesi ekleme; bağlantılar ayrıca gösteriliyor.
- Soruyu tekrar etme, doğrudan anlatmaya başla.

Görev: {GÖREV}

--- OLAY KÜNYESİ ---
Tarih: {TARİH}
Olay: {OLAY CÜMLESİ}
İlgili Vikipedi maddesi: {MADDE}
--- ELDEKİ METİN (Vikipedi özeti; sınır değil, başlangıç) ---
{BAĞLAM}
--- METİN SONU ---

Görev: {GÖREV}
```

Yerine geçenler:

| Yer sahibi       | Kaynağı                                                                                |
| ---------------- | -------------------------------------------------------------------------------------- |
| `{GÖREV}`        | Kullanıcının sorusu; boşsa `VARSAYILAN_ISTEM` (araştırma sürümü)                       |
| `{TARİH}`        | `YzOlay.tarih` — "24 Ağustos 1814"                                                     |
| `{OLAY CÜMLESİ}` | `YzOlay.baslik`                                                                        |
| `{MADDE}`        | `YzOlay.madde`; yoksa bu satır **hiç yazılmaz** (boş etiket modeli yanlış yönlendirir) |
| `{BAĞLAM}`       | `baglamiKirp(baglam)`                                                                  |

Künye yoksa `--- OLAY KÜNYESİ ---` bloğu tümüyle atlanır.

### B) Kaynağa sadık mod (arama kapalı / geri çekilme)

Bugünkü metin **değişmeden** korunur; yalnızca varsa künye bloğu eklenir:

```
Aşağıdaki Vikipedi metnine dayanarak yanıt ver.

Kurallar:
- Yalnızca metinde yazanı kullan; metinde olmayan bilgi ekleme.
- Emin olmadığın yeri "kaynakta belirtilmemiş" olarak işaretle.
- Türkçe, sade ve akıcı yaz. Madde işareti kullanma, düz paragraf yaz.
- Biçimlendirme işareti (yıldız, kare, HTML) kullanma; düz metin yaz.

Görev: {GÖREV}

--- OLAY KÜNYESİ ---
Tarih: {TARİH}
Olay: {OLAY CÜMLESİ}
--- VİKİPEDİ METNİ ---
{BAĞLAM}
--- METİN SONU ---
```

---

## 🚫 Kapsam Dışı

- **Sağlayıcı değiştirmek.** Gemini kararı (2026-08-24 kullanıcı onayı) geçerli;
  `google_search` bu kararı bozmadan işi görüyor.
- **Yeni Interactions API'ye geçiş.** Tarayıcıdan CORS ön uçuşunda reddediliyor
  (bkz. Araştırma Kaydı). Klasik `generateContent` ucunda kalınacak.
- **`url_context` aracı.** Arama ile birlikte çalışıyor ama ayrı bir iş; önce
  aramanın canlıda davranışı görülsün.
- **Sunucu tarafı proxy / anahtar saklama.** BYOK kararı ve backend yasağı
  geçerli (PLAN-02 §2).
- **`ICERIK-SABLONU.md` §0 yürürlükte.** Araştırma modu da dahil, üretilen
  hiçbir metin `src/data/gunler/*`'a yazılmaz, depoya girmez, editör içeriği
  gibi görünmez. Bu talimat o yasağı **genişletmez de daraltmaz da**.
- **Yanıtın önbelleğe alınması.** Hem kullanım şartı yasaklıyor hem de T-20'nin
  "üretim geçicidir" ilkesine aykırı. Aynı soru iki kez sorulursa iki istek gider.
- **Kaynak bağlantılarının çözülmesi / kısaltılması.** Google yönlendirmesi
  olduğu gibi kullanılır.

---

## ☑️ Kabul Kriterleri

1. Gerçek bir anahtarla, arama açıkken sorulan soru **web'de aranıyor**: ağ
   sekmesinde istek gövdesinde `google_search` görünüyor, yanıtta
   `groundingMetadata` dönüyor.
2. Yanıtın altında en çok 5 tıklanabilir kaynak ve Google'ın arama önerisi
   kutusu (ya da Plan B bağlantıları) görünüyor.
3. Künye satırı **modu doğru söylüyor**: aranmadıysa "web'de arandı" demiyor.
4. Modele olayın künyesi gidiyor: bağlam metni başka bir maddenin özeti olsa
   bile yanıt **olayı** anlatıyor (24 Ağustos 1814 denemesi).
5. Aramayı desteklemeyen bir modelde kullanıcı **"Anahtar geçersiz"** görmüyor;
   aramasız yanıt + tek satır açıklama alıyor.
6. Ayarlardan arama kapatılınca T-20'nin bugünkü davranışı **birebir** geri
   geliyor.
7. "Bağlantıyı sına" arama kotası harcamıyor (istekte `tools` yok).
8. Model çıktısı hâlâ düz metin olarak basılıyor; `dangerouslySetInnerHTML`
   deponun hiçbir yerinde yok (`grep` ile doğrulanacak) — `searchEntryPoint`
   dahil.
9. `npm run kontrol` yeşil.

---

## 🧪 Doğrulama

**Birim.** §8'deki dokuz senaryo. `localStorage` jsdom'da `src/test/setup.ts`
shim'iyle çalışıyor (T-20 kaydı).

**Canlı — gerçek anahtar gerekir.** `npm run dev` ve üç gün:

1. **24 Ağustos** → 1814 olayı. Bağlam `İngiltere` maddesinden geliyor; yanıtın
   Washington Yangını'nı anlattığı doğrulanacak. Sebep 3'ün asıl sınavı budur.
2. **7 Mart** → yalnızca otomatik içerik.
3. **29 Şubat** → kenar durum.

Her birinde: ağ sekmesinde gövdede `tools`, yanıtta `groundingMetadata`;
ekranda kaynak listesi; kaynağa tıklayınca gerçek siteye gidiliyor.

**Geri çekilme sınavı.** `ADAY_MODELLER`'in başına aramayı desteklemeyen eski
bir model adı koy (örn. `gemini-1.5-flash`); 400 → aramasız yanıt geldiği ve
kullanıcıya anahtar hatası **gösterilmediği** doğrulanacak. Sonra geri al.

**Kota sınavı (isteğe bağlı).** Ayarlardan aramayı kapat, aynı soruyu sor: yanıt
gelmeli, kaynak listesi olmamalı, künye satırı eski cümleyi yazmalı.

---

## ⚠️ Riskler

| Risk                                                         | Olasılık | Karşı önlem                                                                                                                             |
| ------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Model arama yapabildiği hâlde **yapmamayı** seçer            | Orta     | `arandi` bayrağı ekrana yansır; kullanıcı yanıltılmaz. İstem "önce araştır" diyor ama zorlama yok — modelin kararı gizlenmez.           |
| Arama açıkken halüsinasyon **artar** (T-20'nin asıl korkusu) | Orta     | İstem "yalnızca kaynakta gördüğünü yaz" kuralını korur; kaynaklar ekranda listelenir, kullanıcı denetleyebilir; künye "doğrulayın" der. |
| Ücretsiz arama kotası (2.5 hattında 500/gün) dolar           | Düşük    | İstek yalnızca düğmeye basınca gider (T-20 kural 2). Kota dolunca 429 → mevcut kota mesajı; ayarlardan arama kapatılabilir.             |
| `searchEntryPoint` HTML'i sandbox'ta çalışmaz / tıklanamaz   | Orta     | Plan B (madde 6.3) hazır; hangisinin seçildiği Tamamlanma Kaydı'na yazılır.                                                             |
| Kaynak yönlendirme adresleri kısa ömürlü                     | Düşük    | Hiçbir yerde saklanmıyor; yanıtla birlikte doğuyor, panel kapanınca ölüyor. Şart zaten önbelleklemeyi yasaklıyor.                       |
| `sor()` imza değişikliği çağrı noktalarını kırar             | Düşük    | İki çağrı noktası var, ikisi de bu talimatta; `typecheck` kalanını yakalar.                                                             |
| Google şartı ileride gösterim zorunluluğunu sıkılaştırır     | Düşük    | Kaynak listesi + öneri kutusu bugünden gösteriliyor; değişiklik olursa tek bileşende toplanmış durumda.                                 |
| Uygulama yayına alınmadığı için şart ihlali görünmez kalır   | Düşük    | Uygulama bilinçli olarak yayında değil (BAGLAM.md); yine de şart yerel kullanımda da geçerli sayılıp uygulanıyor.                       |

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-09-02

- **Değişen dosyalar:**
  `src/lib/yapayzeka/tipler.ts` (YzOlay/YzIstek/YzYanit, yeni mesajlar),
  `src/lib/yapayzeka/istem.ts` (iki mod, künye bloğu), `src/lib/yapayzeka/gemini.ts`
  (`tools: [{google_search:{}}]`, `kaynaklariCoz`, 400 tuzağı geri çekilmesi),
  `src/lib/yapayzeka/anahtar.ts` (`ty-yz-arama` tercihi, `ty-yz-arama-yok:<model>`
  işareti), `src/lib/yapayzeka/index.ts` (yeni dışa aktarımlar + düzeltilen
  başlık notu), `src/components/YapayZekaBolumu.tsx` (kaynak listesi, arama
  önerileri, dürüst künye, `olay` prop'u), `src/components/DetayPaneli.tsx`
  (`olay` prop'unu geçirme), `src/components/sections.tsx` (üç çağrı noktasında
  künye kurma + `dayLabel` prop'u), `src/components/Bolumler.tsx` (`dayLabel`'i
  üç bileşene geçirme), `src/components/YzAyarlari.tsx` ("Web'de araştır"
  anahtarı, sınama isteği aramasız), `src/lib/yapayzeka/yapayzeka.test.ts`
  (yeniden yazıldı — iki mod, 400 tuzağı, aday-bazlı öğrenme, `kaynaklariCoz`),
  `src/components/YapayZekaBolumu.test.tsx` (künye/kaynak listesi/aramaYok
  senaryoları eklendi), `CHANGELOG.md`, `Dokumanlar/KULLANIM-KILAVUZU.md` (yeni
  "5. Yapay Zekâya Sor" bölümü — bu özellik T-20'den beri hiç belgelenmemişti,
  T-25 hem kendi hem T-20'nin temel davranışını belgeledi; sonraki bölümler
  6→10 kaydırıldı).

- **Arama önerisi için Plan A mı Plan B mi seçildi, neden:** **Plan B**
  (`searchEntryPoint.renderedContent` hiç basılmıyor; bunun yerine `sorgular`
  düz metin olarak, her biri `https://www.google.com/search?q=…`ye giden bir
  bağlantı olarak gösteriliyor). Gerekçe: Plan A'nın sandbox `iframe`'i
  (`allow-popups allow-popups-to-escape-sandbox`) yalnızca gerçek bir arama
  yanıtıyla canlıda ölçülebilirdi ("Yükseklik canlıda ölçülüp sabitlensin"
  notu madde 6.3'te bunu zaten öngörüyordu) ve bu oturumda gerçek bir Gemini
  anahtarı yoktu. Plan B kullanım şartının "Search Suggestions **ya da diğer
  bağlantılar**" ifadesini karşılıyor, ham HTML basmıyor (T-20 madde 7 ile
  çakışmıyor) ve canlı ölçüm gerektirmeden test edilebiliyor.

- **Canlıda doğrulanan / doğrulanamayan maddeler:** Hiçbiri canlıda
  doğrulanamadı — gerçek bir Gemini anahtarı bu oturumda yok (talimatın kendi
  "Doğrulama" bölümü de bunu "gerçek anahtar gerekir" diye ayrıca işaretliyor).
  Bu oturumdaki tarayıcı önizlemesi de bu ortamda `localhost`'a gezinemedi
  (izin/erişim sorunu), o yüzden anahtarsız arayüz bile görsel olarak
  doğrulanamadı. Doğrulanan: `npm run kontrol` (biçim, tip, lint, 445 test,
  derleme) yeşil; §8'deki dokuz senaryonun hepsi birim testiyle karşılanıyor;
  `dangerouslySetInnerHTML` depoda hâlâ yok (`grep` ile doğrulandı). **24
  Ağustos / 7 Mart / 29 Şubat canlı denemesi ve geri çekilme sınavı bir sonraki
  oturumda gerçek anahtarla yapılmalı.**

- **Sapmalar / notlar:**
  - `YzYanit`e talimatın verdiği alanların dışında bir alan eklendi:
    `aramaDesteklenmedi?: boolean`. Gerekçe: madde 5 "geri çekilme başarılıysa
    panel `YZ_MESAJ.aramaYok` satırını göstersin" diyor ama verilen `YzYanit`
    şemasında bunu tetikleyecek bir alan yoktu — `arandi:false` hem "model
    aramaya gerek görmedi" hem "model aramayı desteklemiyor" durumunda aynı
    değeri alıyor, ikisi farklı mesajlar gerektiriyor (risk tablosundaki
    "model bilerek aramadı" durumu için `aramaYok` **gösterilmemeli**). Bu
    ayrım olmadan iki durum ayırt edilemezdi.
  - `YZ_MESAJ.aramaKotasi` metni eklendi (madde 4'ün istediği gibi) ama hiçbir
    kod yoluna bağlanmadı: 429'da mevcut `YZ_MESAJ.kota` kullanılmaya devam
    ediyor (madde 5 bunu açıkça istiyor), ayarlardaki tek satır bilgi de kendi
    metnini taşıyor (madde 7). `aramaKotasi`nin tetikleneceği ayrı bir akış
    talimatta tarif edilmemişti; sonraki bir talimat ihtiyaç görürse burada
    duruyor.
  - `istemBirlestir` imzası pozisyonel kaldı (`istem, baglam, arama, olay`) —
    yalnızca `gemini.ts` ve testler çağırıyor, nesneye çevirmek talimatın
    yalnızca `sor()` için istediği bir şeydi (madde 4, "dördüncü konumsal
    parametre" gerekçesiyle sınırlı).
  - `YzAyarlari.tsx`'teki "Web'de araştır" anahtarı özel bir `Switch`
    bileşeni olmadığı için (`ui.tsx`'te yoktu) küçük, kendi içinde duran bir
    `role="switch"` düğmesiyle yapıldı; yeni bir genel bileşen eklenmedi.

- **Sonraki talimata not:** Gerçek bir Gemini anahtarıyla üç şey doğrulanmalı:
  (1) 24 Ağustos denemesinde arama gerçekten Washington Yangını'nı mı
  anlatıyor (Sebep 3'ün asıl sınavı), (2) kaynak bağlantıları gerçekten
  `vertexaisearch.cloud.google.com/grounding-api-redirect/…` biçiminde geliyor
  mu ve tıklanınca gerçek siteye gidiyor mu, (3) `ADAY_MODELLER`'in başına
  aramayı desteklemeyen eski bir model (`gemini-1.5-flash`) koyup 400 geri
  çekilmesinin canlıda da tek satır açıklamayla (anahtar hatası göstermeden)
  sonuçlandığını doğrulamak. Üçü de yapılırsa Plan B'nin (arama önerisi
  bağlantıları) kullanıcı deneyimi açısından yeterli olup olmadığı da bu
  arada gözlemlenebilir; yetersiz görünürse Plan A'nın `iframe`'ine geçiş
  ayrı bir talimat gerektirir.
