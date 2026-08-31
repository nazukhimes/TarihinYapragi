# T-15 · Yaprak Gezinme Satırının Dekoratif Katmanla Örtülmesi

| Alan             | Değer                                                                          |
| ---------------- | ------------------------------------------------------------------------------ |
| **Faz**          | FAZ 1 — Kritik Hata Düzeltmeleri _(plan yürürken eklendi, en son uygulanıyor)_ |
| **Öncelik**      | 🔴 Kritik                                                                      |
| **Tahmini süre** | ~1 saat                                                                        |
| **Bağımlılık**   | Yok — `leaf.tsx` T-13'ten beri kararlı                                         |
| **İlgili bulgu** | K-5                                                                            |
| **Durum**        | ✅ Tamamlandı — 2026-08-24                                                     |

> ⚠️ **Bu talimat T-14'ten (kapanış) önce yapılmalıdır.** K-5, uygulamanın
> birincil gün gezinme mekanizmasını devre dışı bırakan kritik bir hatadır;
> belgeler ve yayın, hatanın düzeltilmiş hâlini anlatmalıdır.

---

## 🎯 Amaç

Yaprağın altındaki **Önceki gün / Bugüne dön / Sonraki gün** satırını yeniden
görünür ve tıklanabilir yapmak.

Bugün bu üç düğme, dekoratif "arkadaki yapraklar" katmanının altında kalıyor:
fare veya dokunmatik tıklaması düğmeye **hiç ulaşmıyor** ve düğme yazıları
**görünmüyor**. Talimat bittiğinde, uygulamanın en doğal gün değiştirme yolu
gerçek bir tarayıcıda çalışır durumda olacak.

---

## 📍 Mevcut Durum

### Kök neden — konumlanmış dekor, konumlanmamış gezinme satırı

`src/components/leaf.tsx:86-89` ve `:153-154`

```tsx
<div className="relative" style={{ perspective: "1400px" }}>   // 86 · dış sarmalayıcı
  {/* arkadaki yapraklar */}
  <div className="absolute inset-0 translate-y-3 translate-x-2 rounded-sm bg-paper-2/70 rotate-2" />   // 88
  <div className="absolute inset-0 translate-y-1.5 translate-x-1 rounded-sm bg-paper-2 rotate-1" />    // 89

  <div className="paper torn-edge relative w-full ...">…</div>  // 91 · kart (relative → dekorun üstünde)

  {/* yaprak navigasyonu */}
  <div className="flex items-center justify-between mt-7">      // 154 · position YOK → static
    <button onClick={() => shift(-1)} aria-label="Önceki gün">…</button>
    …
  </div>

  <MiniCalendar … />                                            // 188 · className'inde `relative` var → korunuyor
</div>
```

Dekoratif katmanlar `absolute inset-0` kullanıyor. En yakın konumlanmış ataları
**dış sarmalayıcı** olduğu için, kutuları kartın değil, sarmalayıcının
**otomatik yüksekliğinin tamamıdır** — yani kart **+ gezinme satırı + (açıksa)
mini takvim**.

CSS boyama sırasına göre, `z-index: auto` taşıyan **konumlanmış** öğeler,
DOM sırasından bağımsız olarak konumlanmamış (`static`) öğelerin **üzerinde**
boyanır. Gezinme satırı `static` olduğu için, kod içinde dekordan _sonra_
gelmesine rağmen **altında** kalıyor. Mini takvim ise kendi `className`'inde
`relative` taşıdığı için etkilenmiyor — bu yüzden bugüne kadar günü yalnızca
mini takvimden değiştirmek mümkün oldu.

### Kanıt 1 — canlı yığılım sırası (`elementsFromPoint`, 29 Ekim)

"Sonraki gün" düğmesinin tam merkezinde:

```
1. <div class="absolute inset-0 translate-y-1.5 translate-x-1 bg-paper-2">   ← tıklamayı yakalayan
2. <div class="absolute inset-0 translate-y-3   translate-x-2 bg-paper-2/70">
3. <span> (düğme metni)
4. <button aria-label="Sonraki gün">                                          ← gerçek hedef
5. <div class="flex items-center justify-between mt-7">
```

Aynı ölçüm üç düğme için de aynı sonucu verdi:

| Hedef       | `elementFromPoint` sonucu |
| ----------- | ------------------------- |
| Önceki gün  | dekoratif `div`           |
| Bugüne dön  | dekoratif `div`           |
| Sonraki gün | dekoratif `div`           |

### Kanıt 2 — geometri

29 Ekim'de, mini takvim açıkken (piksel, viewport):

| Öğe                | `position`   | üst     | alt     |
| ------------------ | ------------ | ------- | ------- |
| Dış sarmalayıcı    | relative     | 155     | 1119    |
| Dekor 1            | **absolute** | 157     | 1128    |
| Dekor 2            | **absolute** | 160     | 1138    |
| Kart (`.paper`)    | relative     | 155     | 603     |
| **Gezinme satırı** | **static**   | **630** | **688** |
| Mini takvim        | relative     | 714     | 1129    |

Dekor kutuları 1128/1138'e kadar iniyor; gezinme satırı (630-688) tamamen
onların içinde kalıyor.

### Kanıt 3 — görsel (gerçek tarayıcı ekran görüntüsü)

Dekoratif katmanın rengi `#e7dcc4` (`--color-paper-2`) ve **opak**. Kartın
altındaki bölge bu yüzden boş bir krem blok olarak boyanıyor: "ÖNCEKİ GÜN",
"BUGÜNE DÖN", "SONRAKİ GÜN" yazılarının **hiçbiri okunmuyor**, yalnızca iki
ok simgesi soluk biçimde seçiliyor.

> **Not — bulgunun kayıtlı hâlinden farkı:** `ANALIZ-RAPORU.md`'deki K-5 kaydı
> yalnızca _tıklanamama_ üzerine yazılmıştı. Bu talimat hazırlanırken alınan
> gerçek tarayıcı görüntüsü, satırın aynı zamanda **görsel olarak da örtüldüğünü**
> gösterdi. Düzeltme her iki belirtiyi birden gidermelidir; bulgu kaydı
> Adım 5'te bu gerçeğe göre güncellenecek.

### Neden 10 talimat boyunca fark edilmedi

- `button.click()` DOM olay akışını atladığı için otomatik/programatik
  doğrulamalarda hata **hiç görünmüyor** — `shift()` mantığı zaten doğru.
- Klavye yolu (`Tab` + `Enter`, T-07'nin `←`/`→` kısayolları) hit-testing'den
  geçmediği için etkilenmiyor.
- jsdom'un düzen (layout) motoru olmadığından T-12'nin 203 testinin hiçbiri
  bu sınıf hatayı yakalayamaz.

---

## ✅ Yapılacaklar

### Adım 1 — Dekoratif katmanları kartın kutusuna hapset

`src/components/leaf.tsx:86-91`. İki dekoratif `div` ile kartı, **kendi
`relative` sarmalayıcısına** al. Böylece `inset-0` artık kartın kutusunu
ifade eder, dış sütunun tamamını değil.

```tsx
<div className="relative" style={{ perspective: "1400px" }}>
  {/* kart + arkadaki yapraklar — dekor yalnızca kartın kutusunu kaplar */}
  <div className="relative">
    <div
      aria-hidden="true"
      className="absolute inset-0 translate-y-3 translate-x-2 rounded-sm bg-paper-2/70 rotate-2 pointer-events-none"
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 translate-y-1.5 translate-x-1 rounded-sm bg-paper-2 rotate-1 pointer-events-none"
    />

    <div className="paper torn-edge relative w-full rounded-sm shadow-[…] overflow-visible select-none">
      {/* kartın içi — DEĞİŞMEDİ */}
    </div>
  </div>

  {/* yaprak navigasyonu — DEĞİŞMEDİ */}
```

Kartın **içine hiç dokunulmaz**; yalnızca sarmalayıcı eklenir ve iki dekor
`div`'i onun içine alınır.

### Adım 2 — Dekora `pointer-events-none` ve `aria-hidden` ekle

Adım 1'deki kod parçasında gösterildiği gibi. Gerekçe:

- `pointer-events-none` — bu katmanlar tamamen görseldir, hiçbir tıklama hedefi
  taşımazlar. Aynı desen projede zaten var: `leaf.tsx:111`'deki `paper-grain`
  katmanı da `pointer-events-none` taşıyor.
- `aria-hidden="true"` — ekran okuyucuya anlamsız iki boş `div` bildirilmesin
  (T-07'nin erişilebilirlik çizgisiyle tutarlı).

### Adım 3 — Gezinme satırını konumlandır

`leaf.tsx:154`:

```tsx
<div className="relative flex items-center justify-between mt-7">
```

Adım 1'den sonra teknik olarak şart değildir; ileride dış sarmalayıcıya yeni
bir `absolute` dekor eklenirse aynı hatanın tekrarlamaması için **kasıtlı bir
güvence** olarak eklenir. Görsel etkisi yoktur (`static` → `relative`, konum
kayması olmaz).

### Adım 4 — Yorum satırını gerçeğe eşitle

`leaf.tsx:87`'deki `{/* arkadaki yapraklar */}` yorumunu, katmanların artık
neden kart sarmalayıcısının içinde olduğunu söyleyecek biçimde güncelle —
bir sonraki geliştirici sarmalayıcıyı "gereksiz" görüp silmesin:

```tsx
{
  /* arkadaki yapraklar — kendi relative sarmalayıcısında durmalılar:
    dış sarmalayıcıya bağlanırlarsa inset-0 gezinme satırını da kaplar (K-5) */
}
```

### Adım 5 — Bulgu kaydını kapat

`Dokumanlar/ANALIZ-RAPORU.md` içindeki K-5 başlığını çözüldü olarak işaretle
(diğer bulguların biçimiyle birebir aynı: `— ✅ ÇÖZÜLDÜ (T-15)`), gövdesine
kısa bir kapanış notu ekle ve **Kanıt 3'teki görsel belirtiyi** kayda geçir
(kayıtlı hâli yalnızca tıklanamamayı anlatıyor).

---

## 🚫 Kapsam Dışı

| Dokunma                                                                                   | Neden                                                      |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Kartın içi (`.paper` gövdesi, zımba delikleri, kırmızı bant, `leaf-flip`)                 | Bu talimat yalnızca **dekor katmanının kutusunu** düzeltir |
| `MiniCalendar`                                                                            | Zaten `relative`, hatadan etkilenmiyor                     |
| Paylaş düğmesinin yeri (`App.tsx`)                                                        | T-06'nın bilinçli kararı, ayrı konu                        |
| O-10 (`text-brand` kontrastı), O-11 (`holidays` çöp kayıt), O-12 (Bilim & Keşif mükerrer) | Ayrı bulgular, PLAN-02 adayı                               |
| O-13 (`react-router` güvenlik danışmaları)                                                | Kırılma içeren 6→7 yükseltmesi gerektiriyor, ayrı talimat  |
| Otomatik tıklama-denetimi betiği yazmak                                                   | Değerli ama ayrı iş — _Sonraki talimata not_'a yazılacak   |
| `npm run kontrol` dışında test altyapısına dokunmak                                       | T-12'nin kapsamı                                           |

---

## ☑️ Kabul Kriterleri

- [x] Gerçek bir tarayıcıda **Önceki gün** düğmesine fareyle tıklamak günü bir gün geri alıyor
- [x] **Sonraki gün** düğmesi aynı şekilde çalışıyor
- [x] Bugün olmayan bir günde **Bugüne dön** düğmesi çalışıyor
- [x] Üç düğmenin yazısı da ekranda **okunuyor** (krem blok kalmadı)
- [x] `document.elementFromPoint` üç düğmenin merkezinde de **düğmenin kendisini** döndürüyor
- [x] Dekoratif yaprakların görsel etkisi (kartın arkasından taşan iki kâğıt) **korunmuş**
- [x] Mini takvim, "Ekim takvimi" düğmesi ve Paylaş düğmesi eskisi gibi çalışıyor
- [x] `npm run typecheck` hatasız
- [x] `npm run lint` hatasız
- [x] `npm test` yeşil (203 test)
- [x] `npm run build` hatasız

---

## 🧪 Doğrulama

### 1. Hit-testing denetimi

`npm run dev` çalışırken, tarayıcı konsolunda:

```js
(() => {
  const out = [];
  document.querySelectorAll("button").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = r.left + r.width / 2,
      y = r.top + r.height / 2;
    if (y < 0 || y > innerHeight) return;
    const top = document.elementFromPoint(x, y);
    if (top && top !== el && !el.contains(top))
      out.push((el.getAttribute("aria-label") || el.textContent.trim()).slice(0, 24));
  });
  return out.length ? "ENGELLENEN: " + out.join(", ") : "temiz";
})();
```

**Beklenen:** `temiz`

> ⚠️ Ölçümü **görünür bir sekmede** yapın. Sekme arka plandayken `leaf-flip`
> animasyonu `rotateX(-78deg)`'de donuyor ve kart öne doğru yatık kaldığı için
> "Ekim takvimi" düğmesi **yanlış biçimde** engellenmiş görünüyor. Bu bir test
> ortamı yanılsamasıdır, hata değildir (T-08 ve T-13'ün Tamamlanma Kayıtlarındaki
> aynı sınırın bir başka görünümü).

### 2. Görsel doğrulama — 3 gün (`CALISMA-SISTEMI.md` §6.3)

| Gün          | Adres       | Bakılacak                                    |
| ------------ | ----------- | -------------------------------------------- |
| Özel dosyalı | `/29-ekim`  | Üç düğme de okunuyor ve tıklanıyor           |
| Sıradan      | `/7-mart`   | Aynısı                                       |
| Kenar durum  | `/29-subat` | Aynısı + "artık yıl değil" satırı bozulmamış |

Her günde ayrıca: mini takvimi aç/kapat, dekoratif yaprakların kartın
arkasından taşması korunuyor mu bak.

### 3. Ekran görüntüsü (Browser pane çalışmıyorsa)

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1280,900 --virtual-time-budget=6000 --screenshot=k5-sonra.png "http://localhost:3000/29-ekim"
```

Düzeltme öncesi görüntüyle yan yana koyun: kartın altındaki krem blok gitmiş,
üç düğme okunur olmalı.

### 4. Yeşil kapı

```bash
npm run kontrol
```

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-08-24

- **Değişen dosyalar:**

  | Dosya                                               | İşlem                                                                                                                                                                                                                                                                                                                                                                                                                         |
  | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `src/components/leaf.tsx`                           | Kart ve iki dekoratif katman yeni bir `<div className="relative">` sarmalayıcısının içine alındı — `inset-0` artık dış sütunun değil **kartın** kutusunu ifade ediyor. İki dekor `div`'ine `pointer-events-none` ve `aria-hidden="true"` eklendi. Gezinme satırı `flex …` → `relative flex …` yapıldı. Yorum satırı, sarmalayıcının neden gerekli olduğunu (K-5) söyleyecek biçimde güncellendi. Kartın içine hiç dokunulmadı |
  | `Dokumanlar/ANALIZ-RAPORU.md`                       | K-5 başlığı `✅ ÇÖZÜLDÜ (T-15)` işaretlendi; genel sağlık tablosunda kritik hatalar 4/5 → **5/5**; K-5 gövdesine çözüm notu, kayda geçmemiş ikinci belirti (görsel örtme) ve düzeltme sonrası geometri ölçümü eklendi                                                                                                                                                                                                         |
  | `Dokumanlar/BAGLAM.md`                              | "Mevcut Durum"daki açık K-5 maddesi üstü çizili + `✅ T-15` yapıldı; plan ilerlemesi 13/14 → **14/15**; son güncelleme tarihi 2026-08-24 (T-15)                                                                                                                                                                                                                                                                               |
  | `Dokumanlar/MIMARI.md`                              | §8 Bilinen Teknik Borç tablosundaki K-5 satırı üstü çizili + çözüm açıklaması                                                                                                                                                                                                                                                                                                                                                 |
  | `Dokumanlar/KULLANIM-KILAVUZU.md`                   | §9 Sorun Giderme'deki K-5 satırı, K-1…K-4 ile aynı üslupta "düzeltildi" hâline getirildi                                                                                                                                                                                                                                                                                                                                      |
  | `Talimatlar/PLAN-01-temel-duzeltme-ve-tamamlama.md` | Talimat sayısı 14 → 15; FAZ 1 tablosuna T-15 satırı; bağımlılık haritasına T-15; Kesin kurallar'a T-15 notu; ilerleme tablosuna T-15 satırı; durum 14/15                                                                                                                                                                                                                                                                      |

- **Kanıt (önce / sonra):**

  | Ölçüm                                                | Önce                               | Sonra                                 |
  | ---------------------------------------------------- | ---------------------------------- | ------------------------------------- |
  | Dekor katmanının kutusu (29 Şubat, mini takvim açık) | 157-1128 · **tüm sütun**           | 157-645 · **yalnızca kart**           |
  | Gezinme satırı                                       | `static`, dekorun içinde (630-688) | `relative`, dekorun altında (654-712) |
  | Dekor `pointer-events`                               | `auto`                             | `none`                                |
  | `elementFromPoint` (üç düğmenin merkezi)             | dekoratif `div`                    | **düğmenin kendisi**                  |
  | Sayfadaki engellenen denetim sayısı                  | 3                                  | **0** (148 görünür denetim tarandı)   |
  | Gerçek fare tıklaması                                | tetiklenmiyor                      | 29 Ekim → 30 Ekim → 29 Ekim → bugün   |
  | Düğme yazıları                                       | okunmuyor (opak krem blok)         | okunuyor                              |

- **Yeşil kapı:** `npm run kontrol` → typecheck ✅ · lint ✅ · **203 test** ✅ · build ✅
  (`sitemap.xml` 366 adres, PWA 17 girdi).

- **Görsel doğrulama (3 gün, `CALISMA-SISTEMI.md` §6.3):** `/29-ekim` (özel dosyalı),
  `/7-mart` (sıradan), `/29-subat` (kenar durum) — üçünde de hit-testing denetimi
  `temiz`. 29 Şubat'ta "2026 artık yıl değil" satırı ve mini takvimdeki artık gün
  hücresi (`title="Artık gün"`, 29 hücre) bozulmadı. Mini takvim açık/kapalı iki
  durumda da ölçüldü.

- **Sapmalar / notlar:**

  1. **Talimatın kendi kapsamına sadık kalındı** — kartın içine, `MiniCalendar`'a,
     Paylaş düğmesine dokunulmadı.
  2. **Ölçüm tuzağı (talimatta önceden uyarılmıştı, doğrulandı):** Browser pane
     görünür değilken sayfa compositing yapmıyor, `leafFlip` animasyonu
     `rotateX(-78deg)`'de donuyor ve kart öne yatık kaldığı için "Ekim takvimi"
     düğmesi **yanlışlıkla** engellenmiş görünüyor. İlk ölçüm bu yüzden 3 yerine
     4 engellenen denetim bildirdi. Animasyonlar `Animation.finish()` ile son
     karesine sabitlenerek gerçek sayı (3) elde edildi. Bu, T-08 ve T-13'ün
     Tamamlanma Kayıtlarındaki aynı ortam sınırının bir başka görünümüdür.
  3. **React ölçüm tuzağı:** `button.click()` sonrası aynı senkron blokta ölçüm
     yapmak React yeniden çizmediği için yanlış sonuç veriyor (mini takvim "kapalı"
     görünüyordu). Ölçüm iki ayrı çağrıya bölündü.
  4. **Ekran görüntüleri Browser pane yerine başsız (headless) Chrome ile alındı** —
     pane görüntülenmediği için `screenshot` çalışmıyor. Aynı yöntem T-07 ve
     T-08'de Lighthouse için de kullanılmıştı.

- **Sonraki talimata not:**

  1. **T-14 artık açık ve plandaki son talimat.** Belgelerin K-5 ile ilgili
     kısımları bu talimatta zaten gerçeğe eşitlendi; T-14'ün geri kalan
     kapsamı (README, LICENSE, CHANGELOG, MIMARI'nin Yönlendirme + Test
     Stratejisi bölümleri, ANALIZ-RAPORU özet tablosu, yayın, plan kapanışı)
     olduğu gibi duruyor.
  2. **Otomatik tıklama-denetimi (hit-test) guard'ı yok.** K-5 tam olarak bunun
     yokluğu yüzünden 10 talimat boyunca gözden kaçtı: jsdom'un düzen motoru
     olmadığı için T-12'nin 203 testi bu sınıf hatayı **yapısal olarak**
     yakalayamaz. Gerçek bir tarayıcı sürücüsü (Playwright ya da CDP üzerinden
     başsız Chrome) ile `elementFromPoint` denetimini CI'a bağlamak **PLAN-02
     adayıdır** — bu talimatın kapsamı dışında bilinçli olarak bırakıldı.
  3. **Açık kalan bulgular:** O-10 (`text-brand` kontrastı), O-11 (`holidays`
     şablon artığı), O-12 (Bilim & Keşif mükerrer ayıklaması), O-13
     (`react-router` güvenlik danışmaları), m-7 (yazdırma stili), m-8
     (`estimateMinutes` ölü eşiği). Hiçbiri T-15'in kapsamında değildi.
