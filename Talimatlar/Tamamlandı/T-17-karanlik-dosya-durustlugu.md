# T-17 · Karanlık Dosyalarda Kaynak Dürüstlüğü ve Kontrast

| Alan             | Değer                                                                             |
| ---------------- | --------------------------------------------------------------------------------- |
| **Faz**          | FAZ 1 — Veri Onarımı                                                              |
| **Öncelik**      | 🟠 Yüksek                                                                         |
| **Tahmini süre** | ~2 saat                                                                           |
| **Bağımlılık**   | **T-16 tamamlanmış olmalı** (`detail`/`summary` karşılaştırması `extract`e bağlı) |
| **İlgili bulgu** | O-15, O-10                                                                        |
| **Durum**        | ✅ **Tamamlandı** — 2026-08-31                                                    |

---

## 🎯 Amaç

Otomatik derlenen karanlık dosyaların **editör hükmü taşıyormuş gibi görünmesini**
bitirmek ve kırmızı metin/simge renginin kontrast eşiğini AA'ya çıkarmak.

Talimat bittiğinde: Vikipedi taramasından gelen bir dosya "KAPANDI" damgası
taşımayacak, sahte bir konum yazmayacak, kaynağı rozetle belli olacak; detayı
özetin kopyasıysa "Dosyayı aç" düğmesi hiç çıkmayacak.

---

## 📍 Mevcut Durum

### Kanıt 1 — otomatik dosya uydurma hüküm veriyor (O-15)

`src/hooks/useGunVerisi.ts:120-140`, Vikipedi kayıtlarından otomatik dosya üretiyor:

```ts
auto.push({
  id: `auto-${item.id}`,
  year: item.year,
  type,
  title: firstClause(item.text),
  location: "Arşiv taraması — otomatik tespit", // ← 130
  status: "KAPANDI", // ← 131 · UYDURMA HÜKÜM
  summary: truncate(item.text, 240),
  detail: item.pages?.[0]?.extract || item.text, // ← 133 · T-16 sonrası extract DOLU geliyor
  tags: [theme.toLocaleLowerCase("tr-TR"), formatYear(item.year)],
});
```

Üç ayrı sorun:

1. **`status: "KAPANDI"`** — kullanıcının sorusu tam buydu: _"Kapandı yazıyor,
   olay çözüldü mü demek?"_ Hayır. Bu kayıt bir arama sonucudur; dosyanın
   akıbeti hakkında hiçbir bilgi taşımaz. Ekranda ise editör dosyalarıyla aynı
   damga biçiminde görünüyor.
2. **`location` sabiti** — her otomatik dosya aynı metni taşıyor, üstelik
   `location` alanı editör dosyalarında **gerçek bir yer** anlamına geliyor.
3. ~~**`detail` çoğu zaman `summary`nin kopyası**~~ — ✅ **T-16'da çözüldü
   (2026-08-31).** `excerpt` → `extract` yeniden adlandırmasından sonra
   `item.pages[0].extract` gerçekten dolu geliyor; `detail` artık `item.text`e
   düşmüyor, Vikipedi'nin kendi özet metnini gösteriyor. 7 Mart'ta canlı
   doğrulandı. Kullanıcının _"dosyayı aç dediğimde aynı şey altta tekrar
   yazıyor"_ şikâyeti bu talimatın kapsamından **düşmüştür**.

   > **T-17 için sonuç:** Üç sorundan yalnızca **ikisi** (1 ve 2 —
   > `status: "KAPANDI"` ve sabit `location`) açık kaldı. Tahmini süre buna göre
   > kısalabilir. Yine de `detail`in `item.text`e düştüğü **kenar durum duruyor**:
   > sayfası olmayan ya da `extract`i boş olan olaylarda geri düşüş hâlâ devrede,
   > yalnızca artık nadir.

> **Not:** `src/data/gunler/*.ts` içindeki **41 adet** `status: "KAPANDI"`
> **editör kayıtlarıdır ve dokunulmayacaktır.** Sorun yalnızca
> `useGunVerisi.ts:131`'de otomatik üretilen kayıtlardadır.

### Kanıt 2 — Editör/Otomatik ayrımı Karanlık Dosyalar'da yok

Zaman Tüneli ve Bilim & Keşif bölümleri `curated` bayrağına göre bir **"Editör"**
rozeti gösteriyor (`sections.tsx` → `ScienceSection`, altın renkli rozet).
`CasesSection`'da böyle bir ayrım yok — otomatik dosya, elle yazılmış dosyayla
görsel olarak aynı.

Bu, `BAGLAM.md` §1 ürün ilkesi 3'ün ("kaynağı gizleme") ihlalidir.

### Kanıt 3 — kontrast AA altında (O-10)

Gerçek Lighthouse/axe denetimi üç noktada `color-contrast` hatası verdi:

| Yer                               | Renk çifti                                | Ölçülen     | AA eşiği |
| --------------------------------- | ----------------------------------------- | ----------- | -------- |
| `Ticker` "Bugün Tarihte" etiketi  | `text-paper` #f2ead9 / `bg-brand` #d23b2e | **3,98:1**  | 4,5:1    |
| `CasesSection` dosya türü rozeti  | `text-brand` #d23b2e / panel ~#171d29     | **≈3,54:1** | 4,5:1    |
| `CasesSection` "Dosyayı aç/kapat" | `text-brand` #d23b2e / panel              | **≈3,54:1** | 4,5:1    |

---

## ✅ Yapılacaklar

1. **`CaseFile` tipine kaynak alanı ekle** (`src/data/types.ts`):

   ```ts
   /** Kayıt elle mi yazıldı, Vikipedi taramasından mı geldi. */
   curated?: boolean;
   ```

   Editör kayıtları `useGunVerisi`'de `curated: true` ile işaretlenir
   (`gunler/*.ts` dosyalarına **dokunmadan**, `base` haritalanırken).

2. **Otomatik dosyanın `status`'ünü nötrle.** `CaseFile["status"]` birleşimine
   `"ARŞİV KAYDI"` eklenir ve `useGunVerisi.ts:131` bunu kullanır. Bu değer bir
   hüküm değil, kaydın nereden geldiğini söyleyen bir etikettir.

3. **`location` sabitini dürüst bir ifadeyle değiştir** (`:130`):
   `"Arşiv taraması — otomatik tespit"` → `"Konum bilgisi yok"`
   (ya da alanı boş bırakıp `CasesSection`'da hiç render etmemek — tercih
   uygulayanın, ikisi de kabul edilir; **sahte yer adı yazılmaz**).

4. **`CasesSection`'a Otomatik/Editör rozeti ekle** (`sections.tsx:476+`).
   Biçim `ScienceSection`'daki altın rozetle **birebir aynı** olsun; otomatik
   kayıtlar için nötr (`text-ink-faint`, `border-line`) bir "Otomatik" rozeti.

5. **`detail === summary` ise detay bölümünü hiç açma.** `CasesSection` kartında
   "Dosyayı aç" düğmesi yalnızca `detail` gerçekten yeni bilgi taşıyorsa
   render edilir:

   ```ts
   const detayVar = !!c.detail && c.detail.trim() !== c.summary.trim();
   ```

   T-16'dan sonra `extract` dolacağı için bu durum azalacak ama sıfırlanmayacak.

6. **Kontrastı AA'ya çıkar** (`src/index.css` `@theme`):
   - Metin/simge rengi olarak kullanılan kırmızı için **yeni bir token** tanımla
     (örn. `--color-brand-text`), `#d23b2e`'yi açarak 4,5:1'i geçir.
   - `--color-brand` dolgu (background) rengi olarak **olduğu gibi kalır** —
     marka kimliği bozulmasın.
   - `Ticker` etiketinde zemin/metin çiftini AA'ya taşı.
   - Değişen üç noktayı yeni token'a bağla.

7. **Ölçümü kaydet.** Değişiklikten sonra üç çiftin oranını WCAG göreli parlaklık
   formülüyle yeniden hesapla ve Tamamlanma Kaydı'na yaz.

---

## 🚫 Kapsam Dışı

| Konu                                                      | Hangi talimata ait              |
| --------------------------------------------------------- | ------------------------------- |
| `excerpt` → `extract` yeniden adlandırması                | **T-16** (önce yapılmış olmalı) |
| `src/data/gunler/*.ts` içindeki 41 editör `KAPANDI` kaydı | **Hiçbiri — dokunulmayacak**    |
| İlgili sayfa çipleri, kaynak bağlantıları                 | **T-18**                        |
| Ortak detay paneli                                        | **T-19**                        |
| `holidays` çöp kayıtları                                  | **T-21**                        |
| Renk paletinin genel olarak değiştirilmesi                | Plan §2 — kapsam dışı           |

---

## ☑️ Kabul Kriterleri

- [x] Otomatik üretilen hiçbir dosyada `KAPANDI` damgası yok — hepsi `ARŞİV KAYDI`
- [x] Otomatik dosyalarda sahte konum metni yok — `location` boş, satır hiç render edilmiyor
- [x] `CasesSection`'da Editör/Otomatik rozeti var, `ScienceSection` ile aynı biçimde
- [x] `detail === summary` olan kartta "Dosyayı aç" düğmesi hiç çıkmıyor — `dosyaDetayiVar`, 6 birim testi
- [x] Üç kontrast çifti de **≥ 4,5:1** (ölçülen: 5,00 · 4,84 · 5,21), tablo aşağıda
- [x] `src/data/gunler/*.ts` dosyalarında **hiçbir değişiklik yok** (`git diff` boş)
- [x] `npm run kontrol` yeşil — 250 test

---

## 🧪 Doğrulama

```bash
git diff --stat src/data/gunler/
```

Çıktı **boş** olmalı — editör içeriğine dokunulmadığının kanıtı.

```bash
npm run kontrol
```

**Tarayıcıda (üç gün):**

| Gün          | Beklenen                                                                      |
| ------------ | ----------------------------------------------------------------------------- |
| **29 Ekim**  | Editör dosyaları altın "Editör" rozetli, gerçek `status` damgasıyla           |
| **7 Mart**   | Otomatik dosyalar "Otomatik" rozetli, damga "ARŞİV KAYDI", konum uydurulmuyor |
| **29 Şubat** | Bölüm çalışıyor, boş durum metni bozulmamış                                   |

**Kontrast ölçümü:** Tarayıcı geliştirici araçlarında ya da axe eklentisiyle
`color-contrast` denetimi çalıştırın; O-10'daki üç kayıt da temiz dönmeli.

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-08-31

- **Değişen dosyalar:**

  | Dosya                             | Ne değişti                                                                                                                     |
  | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
  | `src/data/types.ts`               | `CaseFile`'a `curated?: boolean`; `status` birleşimine `"ARŞİV KAYDI"`                                                         |
  | `src/hooks/useGunVerisi.ts`       | Editör kayıtları `curated: true` ile işaretleniyor; otomatik kayıtta `location: ""`, `status: "ARŞİV KAYDI"`, `curated: false` |
  | `src/components/sections.tsx`     | Kaynak rozeti, arşiv damgası ayrımı, boş konum satırı gizleme, `dosyaDetayiVar` kapısı, AA renkleri                            |
  | `src/components/sections.test.ts` | `dosyaDetayiVar` için 6 test                                                                                                   |
  | `src/components/leaf.tsx`         | `Ticker` etiketi `bg-brand-label`, elmas `text-brand-text`                                                                     |
  | `src/index.css`                   | `--color-brand-text` ve `--color-brand-label` token'ları                                                                       |

  `src/data/gunler/` altında **hiçbir değişiklik yok** — `git diff --stat src/data/gunler/` boş döndü.

- **Kontrast ölçümü (önce / sonra):** oranlar canlı sayfada, gerçek hesaplanmış
  renklerden (alfa katmanları zemine karıştırılarak) WCAG göreli parlaklık
  formülüyle ölçüldü. Kapalı kart en açık zemini verdiği için en zor durumdur.

  | Yer                                 | Önce       | Sonra         | Ölçüm zemini      |
  | ----------------------------------- | ---------- | ------------- | ----------------- |
  | `Ticker` "Bugün Tarihte" etiketi    | 3,98:1 ❌  | **5,00:1** ✅ | #f2ead9 / #b83127 |
  | `CasesSection` dosya türü rozeti    | ≈3,54:1 ❌ | **5,40:1** ✅ | #e35f52 / #0e1119 |
  | `CasesSection` "Dosyayı aç/kapat"   | ≈3,54:1 ❌ | **4,84:1** ✅ | #e35f52 / #171d29 |
  | `Ticker` ◆ ayracı _(listede yoktu)_ | 3,90:1 ❌  | **5,34:1** ✅ | #e35f52 / #1a1014 |
  | "Editör" rozeti _(yeni)_            | —          | **9,82:1** ✅ | #e8b04b / #0c0f15 |
  | "Otomatik" rozeti _(yeni)_          | —          | **5,89:1** ✅ | #8b909c / #0e1119 |
  | "ARŞİV KAYDI" damgası _(yeni)_      | —          | **5,28:1** ✅ | #8b909c / #171d29 |

- **Sapmalar / notlar:**

  1. **Madde 3'te ikinci seçenek uygulandı.** `location` "Konum bilgisi yok"
     yazmak yerine boş bırakıldı ve `CasesSection` boş konumu hiç render etmiyor.
     Gerekçe: kart zaten "Otomatik" rozeti taşıyor, konumun yokluğu kendini
     anlatıyor; her otomatik karta aynı cümleyi basmak gürültü olurdu.
  2. **Damga görsel olarak da ayrıştırıldı.** Nötr renk tek başına yetmiyordu:
     eğik duran, kalın çerçeveli mürekkep damgası biçimi "ARŞİV KAYDI"nı hâlâ
     hüküm gibi gösteriyordu. Arşiv etiketi artık eğilmiyor ve kenarlığı kesik
     çizgi — editör damgasıyla bir bakışta ayrılıyor.
  3. **Listede olmayan iki nokta daha AA'ya çekildi:** `Ticker` ◆ ayracı (3,90:1)
     ve "FAİLİ MEÇHUL" damgasının metin rengi. İkisi de aynı `text-brand`
     kusurunun aynı iki bileşendeki devamıydı; ayrı bırakılsa axe denetimi yine
     kırmızı dönerdi. Palet **genel olarak değiştirilmedi** — `--color-brand`
     dolgu rengi olarak aynen duruyor.
  4. **Madde 5'in karşılaştırması sağlamlaştırıldı.** Talimattaki
     `c.detail.trim() !== c.summary.trim()` yanıltıcıydı: `summary`
     `truncate`ten geçtiği için boşlukları sadeleşmiş, `detail` ham geliyor.
     İkisi de aynı metinken sırf iç boşluk farkından "farklı" sayılıyorlardı.
     `dosyaDetayiVar` artık boşlukları ve `truncate`in bıraktığı üç noktayı
     eleyip karşılaştırıyor; kural 6 birim testiyle kilitlendi.
  5. **Canlı veride bu durum artık nadir.** 29 Ekim ve 7 Mart'ta üretilen
     dosyaların hepsinde `extract` dolu geldiği için "Dosyayı aç" düğmesi
     yerinde. Kural bu yüzden tarayıcıda değil, birim testiyle doğrulandı.

- **Sonraki talimata not:**

  - **Otomatik kartlarda başlık ile özet birbirinin aynısı.** 29 Şubat'ta net
    görülüyor: başlık `firstClause(item.text)`, özet `truncate(item.text, 240)`
    — kısa kayıtlarda ikisi de aynı cümle çıkıyor, kartta üst üste iki kez
    yazıyor. T-17'nin kapsamı `detail`/`summary` çiftiydi, bu ayrı bir çift.
    **T-21'e (devredilen içerik bulguları) aday.**
  - `CaseFile.curated` artık var; T-18'in kaynak bağlantısı çipleri "yalnızca
    otomatik kayıtlarda göster" ayrımını bu bayrakla yapabilir.
  - `--color-brand-text` token'ı hazır: T-18/T-19'da koyu panel üzerine kırmızı
    metin koyacaksanız `text-brand` değil bunu kullanın.
