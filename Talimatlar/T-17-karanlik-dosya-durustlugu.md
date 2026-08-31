# T-17 · Karanlık Dosyalarda Kaynak Dürüstlüğü ve Kontrast

| Alan | Değer |
|---|---|
| **Faz** | FAZ 1 — Veri Onarımı |
| **Öncelik** | 🟠 Yüksek |
| **Tahmini süre** | ~2 saat |
| **Bağımlılık** | **T-16 tamamlanmış olmalı** (`detail`/`summary` karşılaştırması `extract`e bağlı) |
| **İlgili bulgu** | O-15, O-10 |
| **Durum** | ⬜ Bekliyor |

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
  location: "Arşiv taraması — otomatik tespit",   // ← 130
  status: "KAPANDI",                              // ← 131 · UYDURMA HÜKÜM
  summary: truncate(item.text, 240),
  detail: item.pages?.[0]?.extract || item.text,  // ← 133 · T-16 sonrası extract DOLU geliyor
  tags: [theme.toLocaleLowerCase("tr-TR"), formatYear(item.year)],
});
```

Üç ayrı sorun:

1. **`status: "KAPANDI"`** — kullanıcının sorusu tam buydu: *"Kapandı yazıyor,
   olay çözüldü mü demek?"* Hayır. Bu kayıt bir arama sonucudur; dosyanın
   akıbeti hakkında hiçbir bilgi taşımaz. Ekranda ise editör dosyalarıyla aynı
   damga biçiminde görünüyor.
2. **`location` sabiti** — her otomatik dosya aynı metni taşıyor, üstelik
   `location` alanı editör dosyalarında **gerçek bir yer** anlamına geliyor.
3. ~~**`detail` çoğu zaman `summary`nin kopyası**~~ — ✅ **T-16'da çözüldü
   (2026-08-31).** `excerpt` → `extract` yeniden adlandırmasından sonra
   `item.pages[0].extract` gerçekten dolu geliyor; `detail` artık `item.text`e
   düşmüyor, Vikipedi'nin kendi özet metnini gösteriyor. 7 Mart'ta canlı
   doğrulandı. Kullanıcının *"dosyayı aç dediğimde aynı şey altta tekrar
   yazıyor"* şikâyeti bu talimatın kapsamından **düşmüştür**.

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

| Yer | Renk çifti | Ölçülen | AA eşiği |
|---|---|---|---|
| `Ticker` "Bugün Tarihte" etiketi | `text-paper` #f2ead9 / `bg-brand` #d23b2e | **3,98:1** | 4,5:1 |
| `CasesSection` dosya türü rozeti | `text-brand` #d23b2e / panel ~#171d29 | **≈3,54:1** | 4,5:1 |
| `CasesSection` "Dosyayı aç/kapat" | `text-brand` #d23b2e / panel | **≈3,54:1** | 4,5:1 |

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

| Konu | Hangi talimata ait |
|---|---|
| `excerpt` → `extract` yeniden adlandırması | **T-16** (önce yapılmış olmalı) |
| `src/data/gunler/*.ts` içindeki 41 editör `KAPANDI` kaydı | **Hiçbiri — dokunulmayacak** |
| İlgili sayfa çipleri, kaynak bağlantıları | **T-18** |
| Ortak detay paneli | **T-19** |
| `holidays` çöp kayıtları | **T-21** |
| Renk paletinin genel olarak değiştirilmesi | Plan §2 — kapsam dışı |

---

## ☑️ Kabul Kriterleri

- [ ] Otomatik üretilen hiçbir dosyada `KAPANDI` damgası yok
- [ ] Otomatik dosyalarda sahte konum metni yok
- [ ] `CasesSection`'da Editör/Otomatik rozeti var, `ScienceSection` ile aynı biçimde
- [ ] `detail === summary` olan kartta "Dosyayı aç" düğmesi hiç çıkmıyor
- [ ] Üç kontrast çifti de **≥ 4,5:1**, ölçüm Tamamlanma Kaydı'nda yazılı
- [ ] `src/data/gunler/*.ts` dosyalarında **hiçbir değişiklik yok** (`git diff` boş)
- [ ] `npm run kontrol` yeşil

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

| Gün | Beklenen |
|---|---|
| **29 Ekim** | Editör dosyaları altın "Editör" rozetli, gerçek `status` damgasıyla |
| **7 Mart** | Otomatik dosyalar "Otomatik" rozetli, damga "ARŞİV KAYDI", konum uydurulmuyor |
| **29 Şubat** | Bölüm çalışıyor, boş durum metni bozulmamış |

**Kontrast ölçümü:** Tarayıcı geliştirici araçlarında ya da axe eklentisiyle
`color-contrast` denetimi çalıştırın; O-10'daki üç kayıt da temiz dönmeli.

---

## 📝 Tamamlanma Kaydı

> Talimat bitince doldurulur.

- **Tamamlanma tarihi:**
- **Değişen dosyalar:**
- **Kontrast ölçümü (önce / sonra):**
- **Sapmalar / notlar:**
- **Sonraki talimata not:**
