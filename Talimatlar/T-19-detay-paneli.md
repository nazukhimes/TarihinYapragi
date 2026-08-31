# T-19 · Zengin Detay Paneli (Vikipedi Tabanlı)

| Alan             | Değer                               |
| ---------------- | ----------------------------------- |
| **Faz**          | FAZ 3 — Derinlik                    |
| **Öncelik**      | 🟡 Orta                             |
| **Tahmini süre** | ~4 saat                             |
| **Bağımlılık**   | **T-16 ve T-18 tamamlanmış olmalı** |
| **İlgili bulgu** | U-6                                 |
| **Durum**        | ⬜ Bekliyor                         |

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

- [ ] `src/components/DetayPaneli.tsx` var ve üç çağrı noktası da onu kullanıyor
- [ ] `sections.tsx`'te üç ayrı detay render'ı kalmadı
- [ ] Panel görseli olan olaylarda `thumbnail` gösteriyor, olmayanlarda boş alan bırakmıyor
- [ ] "Daha fazlasını oku" **yalnızca basılınca** ağ isteği yapıyor
- [ ] Aynı paneli iki kez açmak iki istek üretmiyor (önbellek)
- [ ] `page/summary` hatası panelin geri kalanını bozmuyor, Türkçe mesaj çıkıyor
- [ ] T-20 için ayrılan slot tanımlı ve boş
- [ ] `npm run kontrol` yeşil

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

> Talimat bitince doldurulur.

- **Tamamlanma tarihi:**
- **Değişen dosyalar:**
- **Kaldırılan mükerrer kod (satır sayısı):**
- **Sapmalar / notlar:**
- **Sonraki talimata not (T-20 slotunun imzası):**
