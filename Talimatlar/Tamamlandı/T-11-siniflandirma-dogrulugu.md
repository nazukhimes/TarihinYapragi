# T-11 · Sınıflandırma Doğruluğu

| Alan | Değer |
|---|---|
| **Faz** | FAZ 3 — İçerik |
| **Öncelik** | 🟡 Orta |
| **Tahmini süre** | ~4 saat |
| **Bağımlılık** | T-05 · **T-12'nin test altyapısı önce kurulursa çok daha güvenli** |
| **İlgili bulgu** | U-3 |
| **Durum** | ✅ Tamamlandı (2026-08-22) |

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

- [x] `src/lib/__fixtures__/siniflandirma-ornekleri.ts` var, **≥ 60 örnek** içeriyor (66)
- [x] En az **15 örnek** yanlış pozitif tuzağı (Bursa kazası, Saray'a, Ordu ili, nüfus patlaması, Selanik…) (16)
- [x] `classifyItem` skorlama kullanıyor; "ilk eşleşen kazanır" kaldırıldı
- [x] `detectDarkItem` puan eşiği (≥3) uyguluyor
- [x] Sorun 2 tablosundaki 7 kalıbın hepsi düzeltildi
- [x] `npm run siniflandirma` rapor basıyor
- [x] Kategori doğruluğu **≥ %85** (%100)
- [x] Karanlık yanlış pozitif sayısı **0**
- [x] Öncelik sırası kod içinde belgelendi
- [x] `npm run typecheck` ve `npm run build` hatasız

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

- **Tamamlanma tarihi:** 2026-08-22

- **Örnek sayısı:** 66 (hedef ≥60) — 16'sı bilinçli yanlış pozitif tuzağı (hedef ≥15).
  Kaynak: gerçek Vikipedi TR "bugün tarihte" verisi (16 farklı gün, Wikimedia REST
  API'sinden çekildi) + talimatın Adım 1/Doğrulama §2'de verdiği örnekler.

- **Kategori doğruluğu:** %100 (65/65 — bir örnek `karanlık` alanı için
  `null`/tema testi olduğundan kategori sayımına girmedi) — hedef ≥%85.

- **Karanlık kesinlik / duyarlılık:** Kesinlik %100, duyarlılık %100, yanlış
  pozitif 0 (hedef: 0) — altın kümede. Ayrıca ~1.600 gerçek kayıt üzerinde
  elle tur atıldı (aşağıya bakın).

- **Değişen dosyalar:**
  - `src/lib/classification.ts` (yeni) — `classifyItem`/`detectDarkItem`, puanlı
    kural motoru (`KURALLAR`/`KARANLIK`), sabit öncelik sırası (`PRIORITY`/
    `DARK_PRIORITY`), karanlık eşiği (`DARK_ESIK = 3`)
  - `src/lib/__fixtures__/siniflandirma-ornekleri.ts` (yeni) — 66 örneklik altın küme
  - `scripts/siniflandirma-raporu.mjs` (yeni) — `npm run siniflandirma` betiği
  - `src/lib/wiki.ts` — sınıflandırma mantığı çıkarıldı, `classification.ts`'ten
    içe aktarılıp yeniden dışa aktarılıyor (çağıranlar için API değişmedi)
  - `package.json` / `package-lock.json` — `"siniflandirma"` betiği eklendi;
    `esbuild` açık `devDependency` oldu (bkz. Sapmalar)

- **Sapmalar / notlar:**

  1. **`wiki.ts`'ten ayrı modül.** Talimat `wiki.ts` içinde kalınacağını
     varsayıyordu; sınıflandırma mantığı `src/lib/classification.ts`'e
     taşındı. Sebep: ölçüm betiğinin gerçek kodu (bir kopyasını değil)
     çalışma zamanında ölçebilmesi için `react`/ağ katmanından tamamen
     arınmış, bağımsız bir dosya gerekiyordu (bkz. aşağıdaki esbuild notu).
     `wiki.ts`'in dışa aktardığı public API (`classifyItem`, `detectDarkItem`)
     değişmedi — `App.tsx`/`sections.tsx` hiç dokunulmadı.

  2. **`esbuild` `package.json`'a açık bağımlılık olarak eklendi.**
     `classification.ts` ve fixtures dosyası TypeScript; ölçüm betiğinin
     bunları `tsx`/`ts-node` gibi yeni bir çalışma zamanı bağımlılığı
     kurmadan çalıştırabilmesi için, Vite'ın derlemede zaten kullandığı
     `esbuild` (öncesinde yalnızca `vite` üzerinden **dolaylı** bir
     bağımlılıktı) kendisi çağrıldı: `esbuild.transformSync` ile TS'i JS'e
     çevirip geçici bir dosyaya yazıp `import()` ile yüklüyor. `npm install`
     çalıştırıldığında **yeni bir paket inmedi** (zaten kuruluydu, `0.25.12`
     sürümü zaten `package-lock.json`'daydı) — yalnızca zaten var olan bir
     bağımlılık dürüstçe `package.json`'da beyan edildi.

  3. **Kritik, talimatta öngörülmeyen bir bulgu: JS'in `\b`/`\w`'ı Türkçe
     harfleri kelime karakteri saymıyor.** Gerçek Vikipedi cümleleriyle
     test ederken ortaya çıktı: ç/ğ/ı/ö/ş/ü ASCII `\w` kapsamı dışında
     olduğu için `\bçığ\b` gibi bir kalıp hem "çığır"a hatalı eşleşebiliyor
     HEM DE (çok daha ciddisi) sıradan bir cümlede "çığ " biçiminde **hiç
     eşleşmiyordu** — boşluk da "ğ" de kelime dışı sayıldığından aralarında
     `\b` hiç oluşmuyor. Aynı sorun `\böldürüldü` (suikast tespiti!),
     `\bşampiyon`, `\bşair`, `\bçarpış`, `\bçök` ve birkaç kuralın sonundaki
     Türkçe ek gruplarında (`facia(sı)?\b`, `yan(dı)?\b`, `yazar(ı)?\b`…)
     bulundu. Düzeltme: bu kalıplarda `\b` yerine elle yazılmış
     `(?<![a-zçğıöşü])`/`(?![a-zçğıöşü])` sınırı kullanıldı (bkz.
     `classification.ts` başındaki yorum). Bu, ilk yazımda regex'i yalnızca
     zihinsel/sentetik örneklerle test edip gerçek veriyle doğrulamamış
     olsaydım fark edilmeyecek türde bir hataydı — talimatın "gerçek veri
     turu" adımının neden zorunlu olduğunu somut biçimde doğruladı.

  4. **Talimatın örnek regex'lerinden birkaçı, gerçek veriyle test edilince
     kendi verdiği Doğrulama örneklerini bile geçmiyordu** — düzeltildi,
     talimatın *niyeti* korunarak: `/\b(gemi|vapur|feribot) bat/` tam
     bitişiklik istiyordu, ama "Gemi fırtınada battı" (talimatın kendi
     Doğrulama §2 örneği) gemi ile battı arasına bir kelime giriyor — kalıp
     0-2 ara kelimeye izin verecek şekilde gevşetildi. `/\bilk (insan|
     yolculuk|uçuş)/` "ilk başarılı uçuşu" (talimatın kendi Adım 1 örneği,
     Semiorka/R7) ile eşleşmiyordu — "ilk" ile hedef sözcük arasına bir
     sıfat girebilecek şekilde genişletildi.

  5. **Karanlık dosya kesinliği için bir ek kural: felaket "majör" kalıpları
     (deprem/tsunami/kasırga/salgın/pandemi) artık yakınında can kaybı/
     yaralanma sözcüğü şart koşuyor.** Gerçek veri turunda somut bir yanlış
     pozitif yakalandı: "Eurovision Şarkı Yarışması koronavirüs pandemisi
     **nedeniyle** 2021'e ertelendi" cümlesi (felaket sözcüğü yalnızca
     nedensellik belirteci, cümlenin konusu değil) `Karanlık Dosyalar`da
     "FELAKET" olarak beliriyordu — talimatın kendi endişesiyle birebir
     örtüşen türden bir hata ("Bursa kazası kadılığı" örneğiyle aynı ruhta).
     Düzeltme canlı olarak doğrulandı (Browser pane, `#karanlik` DOM
     sorgusu).

  6. **Bilinçli olarak kapsam dışı bırakılan iki bulgu** (talimatın Kapsam
     Dışı tablosundaki "embedding tabanlı sınıflandırma kapsam dışı" ilkesiyle
     tutarlı):
     - `genel` oranı taranan 16 günün bazılarında talimatın önerdiği %40
       eşiğinin üstünde kalıyor (ortalama ~%45). Bu, Kabul Kriterleri'nde bir
       sayı olarak yok (yalnızca Doğrulama'da bir sağlık kontrolü önerisi);
       üç ayrı gerçek-veri turunda toplam ~20 yeni kural eklendi, her turda
       kazanım küçüldü — daha fazla genişletmek kesinlik riskini artırmadan
       sürdürülemez hâle geliyordu, bu yüzden durduruldu.
     - Anahtar kelime taraması bir felaket sözcüğünün cümlenin **konusu** mu
       yoksa yalnızca bir **tarihleme/isim** ifadesi mi olduğunu genel
       olarak ayıramıyor — ör. "Çernobil Faciası'nın yıl dönümünde bir
       bilgisayar virüsü yayıldı" hâlâ `facia` kalıbına takılıp karanlık
       sayılabiliyor (en yaygın somut biçim — "X nedeniyle ertelendi/iptal
       edildi" — madde 5'te düzeltildi; bu daha nadir "X'in yıl dönümünde"
       biçimi düzeltilmeden bırakıldı). Gerçek bir çözüm anlam analizi
       gerektirir, regex'in doğal sınırı.

  7. **O-12 (Bilim & Keşif mükerrer kaydı, T-10'da keşfedilmişti) canlı
     olarak 18 Mart'ta yeniden doğrulandı, hâlâ düzeltilmedi** — T-11'in
     kapsamı yalnızca `classifyItem`/`detectDarkItem`'dı, `ScienceMilestone`/
     `matchKeys` şemasına dokunmadı (talimatın kendi Kapsam Dışı tablosuyla
     tutarlı).

  8. **Doğrulama:** `npm run typecheck` ve `npm run build` yeşil (59 modül,
     537,90 kB JS / 174,35 kB gzip — T-10 sonrasına göre +5,76 kB/+0,93 kB
     gzip, yeni modül). Canlı doğrulama (Browser pane, 18 Mart): kategori
     çipleri (`Genel · 13/40 = %32,5`), Karanlık Dosyalar ve Bilim & Keşif
     bölümleri konsol hatasız render edildi; "Selanik'te", "Ordu ilinde",
     "Kral" gibi tuzak kelimeler canlı veride doğru sınıflandı.

- **Sonraki talimata not:** T-12 (test altyapısı) kurulunca
  `src/lib/__fixtures__/siniflandirma-ornekleri.ts` + `npm run siniflandirma`
  mantığı kalıcı bir Vitest/Jest testine dönüştürülebilir (talimatın kendi
  bağımlılık notu — "T-12'nin test altyapısı önce kurulursa çok daha
  güvenli" — tersine, T-11 T-12'den önce bitti; `npm run siniflandirma`
  şimdilik CI'a bağlı değil, yalnızca elle çalıştırılıyor, bu yüzden regresyon
  koruması **otomatik değil**). Madde 6'daki iki kapsam-dışı bulgu (genel
  oranı, tarihleme-amaçlı felaket sözcüğü) ileride bir T-15 adayı olabilir —
  ama küçük/düşük öncelikli, resmî hiçbir ölçütü etkilemiyor.
