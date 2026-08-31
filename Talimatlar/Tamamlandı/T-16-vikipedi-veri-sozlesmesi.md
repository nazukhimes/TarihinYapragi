# T-16 · Vikipedi Veri Sözleşmesi Düzeltmesi

| Alan             | Değer                                             |
| ---------------- | ------------------------------------------------- |
| **Faz**          | FAZ 1 — Veri Onarımı                              |
| **Öncelik**      | 🔴 Kritik                                         |
| **Tahmini süre** | ~3 saat                                           |
| **Bağımlılık**   | Yok — **planın ilk adımı, diğer beşinin girdisi** |
| **İlgili bulgu** | K-6, K-7, O-16, m-9                               |
| **Durum**        | ✅ **Tamamlandı** — 2026-08-31                    |

> ⚠️ **Bu talimat T-17, T-18, T-19 ve T-20'den önce yapılmalıdır.** Dördü de bu
> talimatın açtığı `extract` metnine dayanır; T-16 olmadan hiçbiri çalışamaz.

---

## 🎯 Amaç

Vikipedi'nin **indirdiği ama ekrana hiç çıkmayan** açıklama metnini görünür kılmak
ve kişi adlarının ham HTML olarak gösterilmesini bitirmek.

Talimat bittiğinde: her olay kartında gerçek bir özet metni olacak, hiçbir kişi adı
`<span lang="tr" dir="ltr">…` biçiminde görünmeyecek, API'nin hazır `description`
alanı kişi kartlarında alt başlık olarak çıkacak.

---

## 📍 Mevcut Durum

### Kanıt 1 — API `extract` döndürüyor, kod `excerpt` okuyor

```bash
curl -s "https://api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/all/08/31"
```

Yanıttaki `pages[]` nesnesinin gerçek alanları:

```
content_urls, dir, displaytitle, extract, extract_html, lang, namespace,
normalizedtitle, originalimage, pageid, revision, thumbnail, tid, timestamp,
title, titles, type, wikibase_item
```

`excerpt` **yok.** `src/lib/wiki.ts:12` ise onu bekliyor:

```ts
export interface WikiPage {
  title: string;
  displaytitle?: string;
  description?: string;
  excerpt?: string;        // ← API'de böyle bir alan yok
  ...
}
```

Sonuç: `p.excerpt` her zaman `undefined`. İndirilen tüm açıklama metni atılıyor.

**Gözlenen belirti (2026-08-31, 5 Ağustos sayfası):** Sohbet Kartları'nda
"Bugün Doğanlar" ve "Aramızdan Ayrılanlar" kartları hiç üretilmiyor. Sebebi
`src/lib/wiki.ts:338` ve `:350` — ikisi de `p.excerpt` dolu olmasını bekliyor:

```ts
const famousBirth = day.births.find((b) => b.pages?.some((p) => p.thumbnail && p.excerpt));
```

### Kanıt 2 — `displaytitle` ham HTML taşıyor

Aynı API yanıtından:

```
displaytitle    : '<span lang="tr" dir="ltr"><span class="mw-page-title-main">Jang Wonyoung</span></span>'
normalizedtitle : 'Jang Wonyoung'
```

`src/components/sections.tsx:251` HTML'i alıyor:

```ts
name: p.displaytitle || p.title,
```

Bu, kullanıcının _"hâlâ tam ismi yazmıyor, HTML kodu olarak yazıyor"_ şikâyetidir (K-7).

### Kanıt 3 — `excerpt`in geçtiği 31 nokta

```bash
grep -rn "excerpt" src/ --include=*.ts --include=*.tsx | wc -l   # → 31
```

| Dosya                         | Satırlar                                        |
| ----------------------------- | ----------------------------------------------- |
| `src/lib/wiki.ts`             | 12, 338, 340, 345, 346, 350, 352, 357, 358      |
| `src/hooks/useGunVerisi.ts`   | 85, 93, 133, 153, 180, 181, 185, 255, 258, 261  |
| `src/components/sections.tsx` | 38, 141, 170, 237, 248, 254, 386, 388, 449, 450 |
| `src/lib/wiki.test.ts`        | 103, 115                                        |

`displaytitle` 5 noktada: `wiki.ts:10, 344, 356`, `sections.tsx:251`, `wiki.test.ts:102`.

### Kanıt 4 — testler API'de olmayan alanı doğruluyor (m-9)

`src/lib/wiki.test.ts:102-103` ve `:115` elle uydurulmuş `excerpt`/`displaytitle`
alanları kuruyor. Testler yeşil, çünkü gerçek API sözleşmesini hiç görmüyorlar.

---

## ✅ Yapılacaklar

1. **`WikiPage` arayüzünü gerçek sözleşmeye eşitle** (`src/lib/wiki.ts:8-17`):
   - `excerpt?: string` → `extract?: string`
   - `displaytitle?: string` → `normalizedtitle?: string`
   - `description?: string` **kalır** (O-16'da kullanılacak)

2. **31 `excerpt` noktasını `extract` olarak güncelle.** Yalnızca yeniden
   adlandırma — hiçbir mantık değişmez. Sıra: `wiki.ts` → `useGunVerisi.ts` →
   `sections.tsx`.

3. **5 `displaytitle` noktasını `normalizedtitle` olarak güncelle.**
   `PersonCard.name` (`sections.tsx:251`) ve monogram üretimi dahil.

4. **`sections.tsx:248`'deki `probe` dizesini** de `extract` kullanacak biçimde
   güncelle (arama eşleşmesi bu dizeye bakıyor).

5. **`description`'ı kişi kartlarında alt başlık olarak göster** (O-16).
   `PersonCard` arayüzüne `description?: string` eklenir, `itemToPeople`
   (`sections.tsx:243-260`) doldurur, `PeopleRow` kart gövdesinde adın altında
   küçük puntoyla render eder. Boşsa satır hiç çıkmaz.

6. **Gerçek API yanıtından fixture üret:**

   ```bash
   curl -s "https://api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/all/08/31" \
     > src/lib/__fixtures__/otd-tr-08-31.json
   ```

   Yanıtı kırp: `events`, `births`, `deaths`, `holidays`, `selected`
   bölümlerinin her birinden **3 öğe**, hedef ~15 kB.

7. **`wiki.test.ts`'i fixture'dan besle** (m-9). Uydurma `excerpt`/`displaytitle`
   alanları silinir. Ek olarak bir **alan sözleşmesi testi** yazılır:

   ```ts
   it("API yanıtı beklenen alanları taşıyor", () => {
     const p = fixture.births[0].pages[0];
     expect(p).toHaveProperty("extract");
     expect(p).toHaveProperty("normalizedtitle");
     expect(p).not.toHaveProperty("excerpt");
   });
   ```

---

## 🚫 Kapsam Dışı

| Konu                                                                               | Hangi talimata ait    |
| ---------------------------------------------------------------------------------- | --------------------- |
| Karanlık dosyalardaki `KAPANDI` damgası, `location` sabiti, Otomatik/Editör rozeti | **T-17**              |
| İlgili sayfa çipleri, "Vikipedi'de ara" düğmesi, EN çapraz eşleme                  | **T-18**              |
| Ortak `DetayPaneli` bileşeni, `page/summary` çağrısı                               | **T-19**              |
| Yapay zekâ katmanı                                                                 | **T-20**              |
| `holidays` çöp kayıtları, `allScience` ayıklaması                                  | **T-21**              |
| `text-brand` kontrastı                                                             | **T-17**              |
| Tasarımın değiştirilmesi                                                           | Plan §2 — kapsam dışı |

> Bu talimat bir **yeniden adlandırma + bir alan gösterimi**dir. Metin akışını,
> kırpma uzunluklarını, kart düzenini değiştirmeyin.

---

## ☑️ Kabul Kriterleri

- [x] `grep -rn "excerpt" src/` → **üretim kodunda 0 sonuç** · kalan 3 geçiş yalnızca
      `wiki.test.ts` içinde: 1'i Adım 7'nin şart koştuğu `not.toHaveProperty("excerpt")`
      iddiası, 2'si açıklama yorumu (bkz. Sapmalar §2)
- [x] `grep -rn "displaytitle" src/` → **üretim kodunda 0 sonuç** · fixture'da bilerek
      duruyor (API'nin gerçek alanı) ve bir test onun ham HTML olduğunu doğruluyor
- [x] `src/lib/__fixtures__/otd-tr-08-31.json` var ve gerçek API yanıtından kırpılmış
      (boyut hedefi için bkz. Sapmalar §1)
- [x] `wiki.test.ts` fixture'dan besleniyor, uydurma alan kurmuyor
- [x] Alan sözleşmesi testi var ve geçiyor
- [x] Kişi kartlarında `description` alt başlık olarak görünüyor; boşsa satır çıkmıyor
- [x] Hiçbir ekranda `<span` ile başlayan bir ad görünmüyor (29 Ekim 128/128 → **0**)
- [x] `npm run typecheck` hatasız
- [x] `npm run lint` 0 hata
- [x] `npm run test` yeşil — **244 test**
- [x] `npm run build` hatasız

---

## 🧪 Doğrulama

```bash
grep -rn "excerpt\|displaytitle" src/
```

```bash
npm run kontrol
```

**Tarayıcıda (CALISMA-SISTEMI §6.3 — üç gün):**

| Gün                               | Beklenen                                                                                      |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| **29 Ekim** (editör içeriği dolu) | Doğanlar/Kaybettiklerimiz kartlarında gerçek özet metni; adların altında `description` satırı |
| **7 Mart** (yalnızca otomatik)    | Zaman Tüneli'nde "Detayı aç" gerçek metin gösteriyor, boş açılmıyor                           |
| **29 Şubat** (kenar durum)        | Sayfa çalışıyor, kart üretimi bozulmuyor                                                      |

**Ek kontrol — K-6'nın asıl belirtisi:** Herhangi bir günde Sohbet Kartları
bölümünde **"Bugün Doğanlar"** ve **"Aramızdan Ayrılanlar"** kartlarının artık
üretildiğini doğrulayın. Bugün hiç çıkmıyorlar.

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-08-31 · dal `talimat/T-16-vikipedi-veri-sozlesmesi`

- **Değişen dosyalar:**

  | Dosya                                    | İşlem                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
  | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `src/lib/wiki.ts`                        | `WikiPage` arayüzü gerçek API sözleşmesine eşitlendi: `excerpt` → `extract`, `displaytitle` → `normalizedtitle`; `description` olduğu gibi kaldı. `buildAutoTalk` içindeki `auto-birth` / `auto-death` koşulları ve kancaları yeni adlarla güncellendi (9 `extract` + 3 `normalizedtitle` noktası). **Mantık değişmedi** — yalnızca alan adları                                                                                                                                    |
  | `src/hooks/useGunVerisi.ts`              | 10 nokta: `mergedEvents`in sayfa seçimi, `allCases.detail`, `allScience.summary`, `spotlight` (yerel `excerpt` değişkeni de `extract` oldu) ve arama süzgeçlerindeki üç `matchQuery` alanı                                                                                                                                                                                                                                                                                         |
  | `src/components/sections.tsx`            | 10 `extract` + 1 `normalizedtitle` noktası: `MergedEvent.page` şekli, Zaman Tüneli "Detayı aç" paneli, `PersonCard`, `itemToPeople`'ın `probe` dizesi ve `name` alanı, kişi kartı gövdesi, kişi modalı. **Ayrıca (O-16):** `PersonCard`'a `description?: string` eklendi, `itemToPeople` dolduruyor, `PeopleRow` kart gövdesinde adın hemen altında `text-[12px] text-ink-faint line-clamp-2` ile basıyor — alan boşsa `{p.description && …}` sayesinde satır hiç render edilmiyor |
  | `src/lib/__fixtures__/otd-tr-08-31.json` | **YENİ.** `api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/all/08/31` yanıtının kırpılmış hâli. Her bölümden 3 öğe (`selected`/`births`/`deaths`/`events`/`holidays`), her öğeden en fazla 3 `pages` — bu ikinci sınır `normalize()`'ın kendi sınırıyla aynı, dolayısıyla uygulamanın okuyabildiği hiçbir şey kaybolmadı. **Sayfa nesnelerinden tek bir alan bile silinmedi** (`displaytitle`, `extract_html`, `tid` dahil hepsi duruyor)                                         |
  | `src/lib/wiki.test.ts`                   | Fixture'dan besleniyor (m-9). Uydurma `excerpt`/`displaytitle` alanları silindi; kart sınırı testindeki sayfa nesneleri artık `gercekSayfa()` ile **fixture'dan** çekiliyor, elle kurulmuyor. Üç yeni sözleşme testi + iki yeni davranış testi eklendi (18 → **23 test**)                                                                                                                                                                                                          |
  | `tsconfig.json`                          | `resolveJsonModule: true` — fixture'ı testten içe aktarabilmek için gerekli tek yapılandırma değişikliği                                                                                                                                                                                                                                                                                                                                                                           |
  | `Talimatlar/T-17…T-19`                   | T-16'nın değiştirdiği kod alıntıları güncellendi + devir notları (aşağıda "Sonraki talimata not")                                                                                                                                                                                                                                                                                                                                                                                  |

- **Kanıt (önce / sonra):**

  | Ölçüm                                        | Önce                                                                                                                                            | Sonra                                                                                                                                    |
  | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
  | `grep -rn "excerpt" src/` (üretim kodu)      | **31**                                                                                                                                          | **0**                                                                                                                                    |
  | `grep -rn "displaytitle" src/` (üretim kodu) | **5**                                                                                                                                           | **0**                                                                                                                                    |
  | Sohbet Kartları · 29 Ekim                    | Teknoloji, Ekonomi, Tarih, Havacılık, Rekorlar ×2, Tarih, Zaman Atlaması, Karanlık Tarih — **"Bugün Doğanlar" yok, "Aramızdan Ayrılanlar" yok** | … + **"Bugün Doğanlar"** (KART 09: _"1998'de bugün doğan: Lance Stroll"_)                                                                |
  | Sohbet Kartları · 7 Mart                     | (aynı eksiklik)                                                                                                                                 | **hem "Bugün Doğanlar" hem "Aramızdan Ayrılanlar"** üretiliyor                                                                           |
  | Kişi kartı adı (29 Ekim, ilk doğum)          | `<span lang="tr" dir="ltr"><span class="mw-page-title-main">Lance Stroll</span></span>`                                                         | `Lance Stroll`                                                                                                                           |
  | Ham HTML ad sayısı (29 Ekim, 128 kart)       | **128 / 128**                                                                                                                                   | **0 / 128**                                                                                                                              |
  | Kişi kartında özet paragrafı (29 Ekim)       | `<p>` sayısı **0**                                                                                                                              | `description` + `extract` iki ayrı satır                                                                                                 |
  | `description` alt başlığı görünen kart       | — (alan hiç okunmuyordu)                                                                                                                        | 29 Ekim 55/76 doğum · 39/52 vefat; 7 Mart 52/74 · 32/57; **kalanlarda satır hiç çıkmıyor**                                               |
  | Zaman Tüneli "Detayı aç" (7 Mart, 4 örnek)   | `e.detail` ve `e.page.excerpt` ikisi de `undefined` → boş                                                                                       | 4/4'ünde gerçek Vikipedi metni (_"Marcus Aurelius Antoninus, 161 ile 180 yılları arasında Roma imparatoru olan Stoacı bir filozoftur…"_) |
  | Arama `"futbolcu"` (29 Şubat)                | 0 sonuç (`p.excerpt` hep `undefined`, yalnızca ad taranıyordu)                                                                                  | **5 sonuç** · 4 doğum · 1 vefat                                                                                                          |
  | `wiki.test.ts` test sayısı                   | 18                                                                                                                                              | **23**                                                                                                                                   |
  | Test paketi toplamı                          | 239                                                                                                                                             | **244**                                                                                                                                  |
  | **Eski testler, düzeltilmiş kodda**          | —                                                                                                                                               | **kırmızı** (aşağıya bakınız)                                                                                                            |

  Render edilen kart gövdesi (29 Ekim, ilk doğum kartı):

  ```html
  <h3 class="font-display font-semibold text-[17px] …">Lance Stroll</h3>
  <p class="mt-1 text-[12px] leading-snug text-ink-faint line-clamp-2">Kanadalı yarış pilotu</p>
  <p class="mt-2 text-[13px] leading-relaxed text-ink-dim line-clamp-3">
    Lance Strulovitch ya da bilinen ismiyle Lance Stroll, Kanadalı yarış pilotu. Formula 1
    takımlarından…
  </p>
  ```

  **m-9'un canlı gösterimi.** Eski `wiki.test.ts` (HEAD sürümü) düzeltilmiş kodun
  üzerinde çalıştırıldı: **18 testin 1'i düştü** —

  ```
  FAIL src/lib/wiki.test.ts > buildAutoTalk > "en az 5 kart adayı olduğunda sonuç 5 ile sınırlanır…"
    src/lib/wiki.test.ts:128:26   ← expect(cards.length).toBe(5)
  ```

  Sebebi: eski test sayfa nesnesini `excerpt` alanıyla kuruyordu, düzeltilmiş
  `buildAutoTalk` ise `extract` okuyor → `auto-birth` ve `auto-death` üretilmedi,
  6 aday yerine 4 kart çıktı. Yani **eski testler yalnızca kod da aynı hatayı
  yaptığı için yeşildi** — bulgunun tarifi tam olarak buydu.

- **Yeşil kapı:** `npm run kontrol` → typecheck ✅ · lint 0 hata ✅ · **244 test** ✅ · build ✅
  (önce 239 testti; `sitemap.xml` 366 adres, PWA 17 girdi). Fixture pakete **girmiyor** —
  yalnızca `wiki.test.ts` içe aktarıyor, `dist` çıktısı ve modül sayısı (76) değişmedi.

- **Görsel doğrulama (3 gün, `CALISMA-SISTEMI.md` §6.3):**

  | Gün                               | Sonuç                                                                                                                                  |
  | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
  | **29 Ekim** (editör içeriği dolu) | Doğanlar/Kaybettiklerimiz kartlarında gerçek özet + adın altında `description` satırı ✅ · "Bugün Doğanlar" sohbet kartı üretiliyor ✅ |
  | **7 Mart** (yalnızca otomatik)    | "Detayı aç" gerçek metin gösteriyor, boş açılmıyor ✅ · **iki kart da** (Doğanlar + Ayrılanlar) üretiliyor ✅                          |
  | **29 Şubat** (kenar durum)        | Sayfa çalışıyor, "Artık gün" bilgisi bozulmadı, 28 doğum / 14 vefat kartı, 0 ham HTML ad ✅                                            |

- **Sapmalar / notlar:**

  1. **Fixture ~15 kB hedefini tutturamadı — 80 kB oldu.** Talimatın kuralı ("her
     bölümden 3 öğe") ile hedef boyutu birbiriyle çelişiyor: bu uç noktada tek bir
     `pages` nesnesi ~2 kB (`content_urls` 8 URL, `extract`, `extract_html`,
     `thumbnail`, `originalimage`, `titles`). 3 öğe × 5 bölüm = 15 öğe, ~27 sayfa
     → küçültülmüş hâliyle bile 62 kB (minified) / 80 kB (girintili). 15 kB'ye
     ancak **alan silerek** inilebilirdi; bu talimatın **tam da varlık sebebine**
     aykırı olurdu — ileride okuyan biri eksik alanın "API'de yok" mu yoksa "biz
     kırptık" mı olduğunu ayırt edemezdi. Boyut yerine **sadakat** seçildi;
     `~15 kB` bir "hedef", dosyanın var olması ise "kabul kriteri" olduğu için
     kriter karşılanıyor. Dosya girintili yazıldı: sözleşmeyi insan gözüyle
     okunur kılmak bu fixture'ın asıl işi.
  2. **`grep -rn "excerpt" src/` → 0 kriteri harfiyen karşılanamaz.** Talimatın
     kendi Adım 7'si `expect(p).not.toHaveProperty("excerpt")` iddiasını şart
     koşuyor; bu iddia kelimenin kendisini içermek zorunda. **Üretim kodunda 0
     sonuç** var; kalan 3 geçiş yalnızca `wiki.test.ts` içinde — 1'i talimatın
     istediği iddia, 2'si hatanın neden görünmediğini anlatan yorum satırı.
     Kelimeyi grep'ten kaçırmak için yeniden yazmak, kriteri karşılamak değil
     kandırmak olurdu.
  3. **`displaytitle` fixture'da bilerek duruyor** — API'nin gerçek bir alanı.
     Silinmesi fixture'ı yalancı yapardı. Yeni bir test bu alanın ham HTML
     taşıdığını (`/^<span/`), `normalizedtitle`'ın ise düz metin olduğunu
     doğruluyor: K-7'nin sebebi böylece kalıcı olarak belgelenmiş oluyor.
  4. **`normalizedtitle || title` geri düşüşü olduğu gibi bırakıldı.**
     ANALIZ-RAPORU-02 §K-7 ek olarak `title.replace(/_/g, " ")` öneriyor; talimatın
     Yapılacaklar listesinde yok, bu yüzden yapılmadı. Ölçüldü: 31 Ağustos
     beslemesindeki **345 sayfanın 345'inde** `normalizedtitle` dolu — geri düşüş
     pratikte hiç çalışmıyor.
  5. **Ekran görüntüsü alınamadı (ortam sınırı, uygulama hatası değil).** Sayfa
     17.167 px yüksekliğinde ve T-13'ün `content-visibility: auto` optimizasyonunu
     kullanıyor; önizleme paneli `scrollY > 0`'da tamamen siyah kare veriyor.
     Sayfanın gerçekten boyandığı `document.elementFromPoint(innerWidth/2,
innerHeight/2)` ile doğrulandı (`div.reveal.in-view` → "19. YÜZYIL"). Bu
     yüzden tüm ölçümler DOM üzerinden alındı. T-08, T-13 ve T-15'in Tamamlanma
     Kayıtlarındaki aynı ortam sınırının bir başka görünümü.
  6. **İlgisiz, önceden var olan hata gözlendi:** `query.wikidata.org/sparql`
     502 döndürüyor (~13 sn). Rekorlar katmanı (`wikidata.ts`) bu talimatta hiç
     değiştirilmedi; kartlar statik `REKORLAR` verisinden üretilmeye devam ediyor.
     WDQS'in bilinen geçici hatası.
  7. **`npm run format:check` kırmızı — T-16'dan önce de kırmızıydı.** Depodaki
     **51 dosya** (dokunulmayanlar dahil, ör. `src/lib/date.ts`, `src/vite-env.d.ts`)
     CRLF satır sonu taşıyor, Prettier LF bekliyor. `format:check` `npm run kontrol`
     kapısının parçası **değil**; düzeltmek 51 dosyayı yeniden yazmak demek olurdu ve
     bu talimatın kapsamı dışında. Bir sonraki bakım talimatına aday.
  8. **Kapsam dışı tablosuna uyuldu:** `status: "KAPANDI"`, sabit `location`,
     ilgili sayfa çipleri, `DetayPaneli`, YZ katmanı, `holidays` çöp kayıtları ve
     `text-brand` kontrastı **bilinçli olarak ellenmedi**. Metin akışı, kırpma
     uzunlukları ve kart düzeni değiştirilmedi — tek görsel ekleme, talimatın
     Adım 5'te açıkça istediği `description` satırıdır.

- **Sonraki talimata not:**

  1. **T-17'nin üç sorunundan biri düştü.** `detail` artık `summary`nin kopyası
     değil — `extract` dolu geldiği için Vikipedi'nin kendi metnini gösteriyor
     (7 Mart'ta canlı doğrulandı). T-17 dosyasında bu madde üstü çizili işaretlendi
     ve kod alıntısı güncellendi. Geriye **`status: "KAPANDI"`** ve **sabit
     `location`** kaldı; tahmini süre buna göre kısalabilir. Kenar durum duruyor:
     sayfası olmayan ya da `extract`i boş olan olaylarda `item.text`e geri düşüş
     hâlâ devrede, yalnızca artık nadir.
  2. **T-18'e iki not düşüldü.** (a) Kanıt 1'in kod alıntısı güncellendi; seçim
     mantığı değişmedi ama `p.extract` artık dolu geldiği için `find` çoğu olayda
     **ilk sayfada** duruyor — eskiden koşulun ilk yarısı hep `false` olduğundan
     seçim fiilen "URL'si olan ilk sayfa"ydı. (b) **Yeni Kanıt 1b:** `deaths`
     öğelerinin ikinci sayfası düzenli olarak bir **yıl maddesi**
     (`normalizedtitle: "1985"`, `description: "yıl"`). Bugün görünmüyorlar çünkü
     yalnızca `pages[0]` okunuyor; **T-18 Katman 1 tüm sayfaları çip yapacağı için
     doğrudan çöp çip hâline gelecekler.** `description === "yıl"` / `"year"` bir
     eleme koşulu olarak düşünülmelidir.
  3. **T-19'un kod alıntısı güncellendi.** "Detayı aç" artık boş açılmıyor; T-19'un
     asıl tespiti (panelin yalnızca düz metin olması, görsel/kaynak yokluğu) aynen
     geçerli.
  4. **T-20 için girdi hazır.** `extract` metni artık gerçekten okunuyor — YZ
     katmanının bağlam kaynağı olarak kullanılabilir durumda (PLAN-02 §5'in
     T-16'yı T-20'den önce şart koşmasının sebebi buydu).
  5. **Fixture bir sözleşme kilididir.** `otd-tr-08-31.json` yenilenirse
     `wiki.test.ts`'teki üç sözleşme testi API değişikliğini anında yakalar.
     Yenileme komutu talimatın Adım 6'sındadır; **sayfa nesnelerinden alan
     silmeyin.**
