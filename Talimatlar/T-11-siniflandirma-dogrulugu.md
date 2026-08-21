# T-11 · Sınıflandırma Doğruluğu

| Alan | Değer |
|---|---|
| **Faz** | FAZ 3 — İçerik |
| **Öncelik** | 🟡 Orta |
| **Tahmini süre** | ~4 saat |
| **Bağımlılık** | T-05 · **T-12'nin test altyapısı önce kurulursa çok daha güvenli** |
| **İlgili bulgu** | U-3 |
| **Durum** | ⬜ Bekliyor |

---

## 🎯 Amaç

Otomatik sınıflandırmayı "çalışıyor gibi görünen" hâlden **ölçülebilir** hâle
getirmek. Yanlış pozitifleri azaltmak, öncelik çakışmalarını çözmek ve kural
değiştiğinde neyin bozulduğunu görünür kılmak.

---

## 📍 Mevcut Durum

`src/lib/wiki.ts:151-196`

```ts
const RULES: [CategoryId, RegExp][] = [ /* 7 kural */ ];

export function classifyItem(text: string): CategoryId {
  const t = trLower(text);
  for (const [cat, re] of RULES) {
    if (re.test(t)) return cat;      // ← İLK EŞLEŞEN KAZANIR
  }
  return "genel";
}
```

### Sorun 1 — "İlk eşleşen kazanır" öncelik hatası üretir

Metin birden çok kategoriye ait olabilir. Şu an dizideki **sıra** karar veriyor,
metnin **ağırlığı** değil.

> *"Deprem sonrası çıkan isyan bastırıldı"* → `felaket` (1. kural).
> Oysa cümlenin ağırlığı `savas`/`siyaset` tarafında.

### Sorun 2 — Çok kısa kalıplar yanlış pozitif üretiyor

| Kalıp | Amaç | Yanlış yakaladığı |
|---|---|---|
| `/kazas/` | "uçak kazası" | **"Bursa kazası"** (Osmanlı idari birimi), **"kazasker"** |
| `/ay'/` | "Ay'a iniş" | **"Saray'a"**, **"Saray'ın"** |
| `/ordu(su)? /` | "Osmanlı ordusu" | **Ordu ili** geçen her cümle |
| `/patlama/` | "gaz patlaması" | **"nüfus patlaması"** |
| `/sel( \|i)/` | "sel felaketi" | **"selam"**, **"selanik"** (`seli` eşleşir) |
| `/makale/` | bilimsel makale | her türlü gazete makalesi |

### Sorun 3 — Kural çakışması

`/saldırı/` hem `RULES` → `savas` hem `DARK_THEMES` → `Şiddet` içinde.
Aynı metin hem savaş kategorisine giriyor hem karanlık dosya oluyor.
Bu bazen doğru, bazen değil — ama **kontrol edilemiyor**.

### Sorun 4 — Ölçüm yok

Kaç öğe doğru sınıflanıyor? Bilinmiyor. Bir regex değiştirildiğinde neyin
bozulduğu görülemiyor. Kural iyileştirmesi kör uçuş.

---

## ✅ Yapılacaklar

### Adım 1 — Referans veri kümesi (altın küme) oluştur

`src/lib/__fixtures__/siniflandirma-ornekleri.ts`:

```ts
export interface Ornek {
  text: string;
  beklenen: CategoryId;
  karanlik: string | null;
  not?: string;               // neden bu kategori — tartışmalı örnekler için
}

export const ORNEKLER: Ornek[] = [
  // — doğru eşleşmesi gerekenler —
  { text: "İkinci Anafartalar Savaşı başladı.", beklenen: "savas", karanlik: null },
  { text: "Mona Lisa tablosu, Louvre Müzesi'nin bir çalışanı tarafından çalındı.",
    beklenen: "kultur", karanlik: null },
  { text: "Sovyet Devrimi liderlerinden Leon Troçki, Meksika'da öldürüldü.",
    beklenen: "siyaset", karanlik: "Suikast" },
  { text: "İstanbul Kuledibi'ndeki Eskiciler Çarşısı yandı; 167 dükkân kül oldu.",
    beklenen: "felaket", karanlik: "Felaket" },
  { text: "Semiorka adıyla bilinen Sovyet füzesi R7'nin ilk başarılı uçuşu gerçekleşti.",
    beklenen: "kesif", karanlik: null },

  // — YANLIŞ POZİTİF TUZAKLARI —
  { text: "Bursa kazası kadılığına atama yapıldı.", beklenen: "genel", karanlik: null,
    not: "'kazas' kalıbı buraya takılmamalı" },
  { text: "Rumeli kazaskerliğine getirildi.", beklenen: "genel", karanlik: null },
  { text: "Topkapı Sarayı'na yeni bir kütüphane eklendi.", beklenen: "kultur", karanlik: null,
    not: "'ay'' kalıbı Saray'a takılmamalı" },
  { text: "Ordu ilinde belediye seçimleri yapıldı.", beklenen: "siyaset", karanlik: null,
    not: "'ordu ' kalıbı il adına takılmamalı" },
  { text: "Ülkedeki nüfus patlaması tartışmaya yol açtı.", beklenen: "genel", karanlik: null },
  { text: "Selanik'te yeni bir okul açıldı.", beklenen: "genel", karanlik: null,
    not: "'sel(i)' kalıbı Selanik'e takılmamalı" },
];
```

**Hedef:** en az **60 örnek**. Kaynak: gerçek Vikipedi verisi.
Toplamak için konsolda:

```js
// 20 farklı günün olaylarını topla, elle etiketle
```

### Adım 2 — Skorlamaya geç

"İlk eşleşen" yerine "en çok puan alan":

```ts
interface Kural {
  kategori: CategoryId;
  desen: RegExp;
  puan: number;        // 1 = zayıf ipucu, 3 = güçlü ipucu
}

const KURALLAR: Kural[] = [
  // güçlü ipuçları (3)
  { kategori: "felaket", desen: /\bdeprem|tsunami|kasırga|volkan(ik)?|salgın|pandemi/, puan: 3 },
  { kategori: "savas",   desen: /\bsavaş[ıi]?\b|muharebe|kuşatma|işgal etti|cephe/, puan: 3 },
  { kategori: "kesif",   desen: /uzay|nasa|roket|yörünge|teleskop/, puan: 3 },
  { kategori: "bilim",   desen: /\bdna\b|genom|kuantum|nükleer|aşı(sı|yı)?\b/, puan: 3 },

  // orta ipuçları (2)
  { kategori: "felaket", desen: /facia(sı)?\b|yangın[ıi]?\b|çığ\b/, puan: 2 },
  { kategori: "siyaset", desen: /cumhurbaşkan|başbakan|anayasa|antlaşma|bağımsızlık/, puan: 2 },
  { kategori: "kultur",  desen: /roman[ıi]?\b|senfoni|opera|tiyatro|tablo(su)?\b|müze/, puan: 2 },

  // zayıf ipuçları (1)
  { kategori: "spor",    desen: /şampiyon|turnuva|rekor kır/, puan: 1 },
  /* ... */
];

export function classifyItem(text: string): CategoryId {
  const t = trLower(text);
  const puanlar = new Map<CategoryId, number>();

  for (const k of KURALLAR) {
    if (k.desen.test(t)) {
      puanlar.set(k.kategori, (puanlar.get(k.kategori) ?? 0) + k.puan);
    }
  }
  if (puanlar.size === 0) return "genel";

  let enIyi: CategoryId = "genel";
  let enYuksek = 0;
  for (const [kat, p] of puanlar) {
    if (p > enYuksek) { enYuksek = p; enIyi = kat; }
  }
  // eşitlik durumunda ÖNCELİK sırası devreye girsin
  return enIyi;
}
```

### Adım 3 — Kelime sınırı ve Türkçe ek toleransı

Türkçe sondan eklemeli bir dil; `\b` tek başına yetmez.

**Kural:** Kalıp bir **kelimenin başına** demirlensin, sonuna serbest ek bıraksın:

```ts
// KÖTÜ:  /kazas/          → "Bursa kazası" ve "kazasker" eşleşir
// İYİ:   /\bkaza(sı|sında|sının)?\b/  → yalnızca "kaza" kökü, belirli eklerle
// İYİ:   /uçak kazası|tren kazası|maden kazası/   → bağlamla birlikte
```

Düzeltilecek kalıplar:

| Eski | Yeni |
|---|---|
| `/kazas/` | `/\b(uçak\|tren\|maden\|trafik\|otobüs) kaza/` |
| `/ay'/` | `/\bay'(a\|ın\|da\|dan)\b/` — ve `RULES` sırasında `saray` negatif kontrolü |
| `/ordu(su)? /` | `/\b(osmanlı\|türk\|kızıl\|alman\|rus) ordusu/` |
| `/patlama/` | `/(gaz\|bomba\|maden\|fabrika) patlama/` |
| `/sel( \|i)/` | `/\bsel felaketi\|\bsel bask[ıi]n/` |
| `/makale/` | **kaldır** — çok genel, ayırt edici değil |
| `/bat(tı\|an)/` | `/\b(gemi\|vapur\|feribot)[a-zçğıöşü]* bat/` |

### Adım 4 — `DARK_THEMES`'i aynı yöntemle düzelt

```ts
const KARANLIK: Kural2[] = [
  { tema: "Suikast",      desen: /suikast|suikaste kurban|öldürüldü\b/, puan: 3 },
  { tema: "İnfaz & İdam", desen: /idam edil|asılarak idam|kurşuna dizil/, puan: 3 },
  { tema: "Kayıp & Gizem",desen: /esrarengiz şekilde kayb|ortadan kayboldu/, puan: 3 },
  { tema: "Felaket",      desen: /\bdeprem|facia(sı)?\b|(gemi|uçak) kaza/, puan: 2 },
  { tema: "Şiddet",       desen: /katliam|katledil|linç edil|bombalı saldırı/, puan: 3 },
];
```

**Eşik koy:** Toplam puan **3'ün altındaysa** karanlık dosya sayma.
Şu an tek bir zayıf eşleşme yeterli oluyor ve zayıf dosyalar üretiyor.

```ts
export function detectDarkItem(text: string): string | null {
  /* ... puanla ... */
  return enYuksek >= 3 ? enIyiTema : null;
}
```

### Adım 5 — Ölçüm betiği

`scripts/siniflandirma-raporu.mjs`:

```
KATEGORİ DOĞRULUĞU
─────────────────────────────────
savas       12/13   %92
siyaset      9/11   %82
bilim        8/8   %100
kesif        7/7   %100
kultur       6/8    %75
felaket     10/11   %91
genel        9/12   %75
─────────────────────────────────
TOPLAM      61/70   %87

KARANLIK TESPİT
─────────────────────────────────
Doğru pozitif   18
Yanlış pozitif   2   ← hedef: 0
Yanlış negatif   3
Kesinlik        %90
Duyarlılık      %86

HATALI ÖRNEKLER
─────────────────────────────────
✗ "Ordu ilinde belediye seçimleri yapıldı."
    beklenen: siyaset   bulunan: savas
```

`package.json`:

```json
"scripts": { "siniflandirma": "node scripts/siniflandirma-raporu.mjs" }
```

### Adım 6 — Hedef ve kabul

| Ölçüt | Mevcut | Hedef |
|---|---|---|
| Kategori doğruluğu | ölçülmemiş | **≥ %85** |
| Karanlık yanlış pozitif | ölçülmemiş | **0** (altın kümede) |
| Karanlık kesinlik | ölçülmemiş | **≥ %90** |

> **Yanlış pozitif neden sıfır olmalı?** Karanlık Dosyalar bölümü ürünün en iddialı
> bölümü. "Bursa kazası kadılığı" bir suç dosyası olarak görünürse ürün gülünç olur.
> Yanlış negatif (kaçırma) kabul edilebilir, yanlış pozitif değil.

### Adım 7 — Kategori öncelik sırasını belgele

`wiki.ts` başına yorum bloğu ekle: eşitlik durumunda hangi kategori kazanır ve neden.

```ts
/**
 * Eşit puanda öncelik sırası:
 *   felaket > savas > siyaset > bilim > kesif > kultur > spor > genel
 * Gerekçe: Bir olay hem felaket hem siyaset olabilir; kullanıcı için
 * "ne oldu" (felaket) "kim yaptı"dan (siyaset) önce gelir.
 */
```

---

## 🚫 Kapsam Dışı

| Dokunma | Neden / Hangi talimat |
|---|---|
| Editör içeriği (`CURATED`) | T-10 — editör verisi sınıflandırmadan geçmez |
| `buildAutoTalk` kart **yapısı** | Yalnızca kullandığı sınıflandırma değişir |
| Ağ katmanı | T-05 |
| Makine öğrenmesi / gömme (embedding) tabanlı sınıflandırma | Kapsam dışı — istemci taraflı ürün, regex yeterli |
| Yeni kategori ekleme | Kapsam dışı — mevcut 8 kategori korunur |
| Bileşen görünümleri | Dokunulmaz |

---

## ☑️ Kabul Kriterleri

- [ ] `src/lib/__fixtures__/siniflandirma-ornekleri.ts` var, **≥ 60 örnek** içeriyor
- [ ] En az **15 örnek** yanlış pozitif tuzağı (Bursa kazası, Saray'a, Ordu ili, nüfus patlaması, Selanik…)
- [ ] `classifyItem` skorlama kullanıyor; "ilk eşleşen kazanır" kaldırıldı
- [ ] `detectDarkItem` puan eşiği (≥3) uyguluyor
- [ ] Sorun 2 tablosundaki 7 kalıbın hepsi düzeltildi
- [ ] `npm run siniflandirma` rapor basıyor
- [ ] Kategori doğruluğu **≥ %85**
- [ ] Karanlık yanlış pozitif sayısı **0**
- [ ] Öncelik sırası kod içinde belgelendi
- [ ] `npm run typecheck` ve `npm run build` hatasız

---

## 🧪 Doğrulama

### 1. Rapor

```bash
npm run siniflandirma
```

Hedeflerin tutması gerekiyor. Tutmuyorsa kuralları iyileştir, örnek kümeyi
**değiştirme** (küme hedefe göre ayarlanırsa ölçüm anlamsızlaşır).

### 2. Tuzak testleri — tek tek

| Girdi | Beklenen kategori | Beklenen karanlık |
|---|---|---|
| "Bursa kazası kadılığına atama yapıldı." | `genel` | `null` |
| "Rumeli kazaskerliğine getirildi." | `genel` | `null` |
| "Topkapı Sarayı'na kütüphane eklendi." | `kultur` | `null` |
| "Ordu ilinde seçim yapıldı." | `siyaset` | `null` |
| "Nüfus patlaması tartışmaya yol açtı." | `genel` | `null` |
| "Selanik'te okul açıldı." | `genel` | `null` |
| "Apollo 11 Ay'a indi." | `kesif` | `null` |
| "Gemi fırtınada battı, 200 kişi öldü." | `felaket` | `Felaket` |

### 3. Gerçek veri turu

10 farklı günü aç, Karanlık Dosyalar bölümünü incele:

- `Arşiv taraması — otomatik tespit` etiketli her dosya **gerçekten** karanlık mı?
- Bariz bir suç/felaket **kaçırılmış** mı?

Bulduğun her yanlışı altın kümeye ekle ve kuralı düzelt.

### 4. Regresyon — zaman tüneli renkleri

Kategori renkleri mantıklı dağılmalı. Bir gün açıp kategori çiplerine bak:
`Genel · 20` gibi bir dağılım kuralların çalışmadığını gösterir.
Sağlıklı bir günde `genel` oranı **%40'ın altında** olmalı.

### 5. Performans

`classifyItem` her öğe için çağrılıyor ve artık **tüm** kuralları deniyor
(eskiden ilk eşleşmede duruyordu). 100 öğelik bir günde toplam süre
**5 ms'yi geçmemeli**:

```js
console.time("sınıflandırma");
data.events.forEach(e => classifyItem(e.text));
console.timeEnd("sınıflandırma");
```

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:**
- **Örnek sayısı:**
- **Kategori doğruluğu:**
- **Karanlık kesinlik / duyarlılık:**
- **Değişen dosyalar:**
- **Sapmalar / notlar:**
- **Sonraki talimata not:**
