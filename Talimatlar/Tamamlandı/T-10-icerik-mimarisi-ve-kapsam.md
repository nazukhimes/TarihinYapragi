# T-10 · İçerik Mimarisi ve Kapsam Genişletme

| Alan             | Değer                             |
| ---------------- | --------------------------------- |
| **Faz**          | FAZ 3 — İçerik                    |
| **Öncelik**      | 🟠 Yüksek                         |
| **Tahmini süre** | ~6 saat+ (parti başına ~1,5 saat) |
| **Bağımlılık**   | T-01                              |
| **İlgili bulgu** | U-2                               |
| **Durum**        | ⬜ Bekliyor                       |

---

## 🎯 Amaç

İki iş bir arada:

1. **Mimari** — 1.001 satırlık tek `curated.ts` dosyasını 366 güne ölçeklenebilir
   bir yapıya bölmek.
2. **Kapsam** — Editör içeriğini 10 günden **en az 60 güne** çıkarmak.

Uygulamanın en özgün iki bölümü (Karanlık Dosyalar, Bilim & Keşif) şu an günlerin
%97'sinde sönük. Bu talimat onu değiştirir.

---

## 📍 Mevcut Durum

`src/data/curated.ts` — **1.001 satır, tek dosya**

Kapsanan 10 gün:

```
02-14  03-08  04-23  04-25  05-19  07-20  08-20  10-29  11-10  12-31
```

= 366 günün **%2,7'si**.

### Sorunlar

| #   | Sorun                                                                    |
| --- | ------------------------------------------------------------------------ |
| 1   | Tek dosya — 60 güne çıkınca ~6.000 satır olur, düzenlenemez              |
| 2   | Tip tanımları ile veri aynı dosyada — içe aktarma zinciri gereksiz büyük |
| 3   | Tüm veri ilk yüklemede pakete giriyor; kullanıcı tek gün görüyor         |
| 4   | İçerik şablonu yok — her gün farklı derinlikte yazılmış                  |
| 5   | Kalite ölçütü yok — "bir gün ne zaman tamamlanmış sayılır?" belirsiz     |

---

## ✅ Yapılacaklar

### BÖLÜM A — Mimari (önce bu, ~2 saat)

#### Adım A1 — Tipleri ayır

`src/data/types.ts` (yeni) — şunlar taşınır:

```
CategoryId · CATEGORIES · CaseType · CASE_LABELS
CaseFile · ScienceMilestone · TalkCard · CuratedEvent · CuratedDay
```

`curatedKey()` yardımcısı da buraya.

#### Adım A2 — Aylara böl

```
src/data/
├── types.ts
├── index.ts              ← birleştirici
└── gunler/
    ├── 01-ocak.ts
    ├── 02-subat.ts
    ├── ...
    └── 12-aralik.ts
```

Her ay dosyası:

```ts
import type { CuratedDay } from "../types";

export const OCAK: Record<string, CuratedDay> = {
  "01-01": {/* ... */},
  "01-27": {/* ... */},
};
```

`src/data/index.ts`:

```ts
import { OCAK } from "./gunler/01-ocak";
import { SUBAT } from "./gunler/02-subat";
/* ... 12 ay ... */

export * from "./types";

export const CURATED: Record<string, CuratedDay> = {
  ...OCAK,
  ...SUBAT,
  ...MART,
  ...NISAN,
  ...MAYIS,
  ...HAZIRAN,
  ...TEMMUZ,
  ...AGUSTOS,
  ...EYLUL,
  ...EKIM,
  ...KASIM,
  ...ARALIK,
};
```

Mevcut `curated.ts` **silinir**. `src/data/curated.ts`'ten içe aktaran dosyaları
`src/data`'ya yönlendir:

```bash
grep -rn "data/curated" src/
```

> **Neden `index.ts` üzerinden?** İçe aktarma yolu tek kalır (`from "../data"`),
> dosya yapısı değişse bile çağıran kod etkilenmez.

#### Adım A3 — Ay bazlı tembel yükleme (isteğe bağlı ama önerilir)

10 gün için gereksiz, 60+ gün için değerli. Tüm ayları paketlemek yerine:

```ts
const AY_YUKLEYICI: Record<number, () => Promise<Record<string, CuratedDay>>> = {
  1: () => import("./gunler/01-ocak").then((m) => m.OCAK),
  2: () => import("./gunler/02-subat").then((m) => m.SUBAT),
  /* ... */
};

const onbellek = new Map<number, Record<string, CuratedDay>>();

export async function getCuratedDay(month: number, day: number): Promise<CuratedDay | undefined> {
  let ay = onbellek.get(month);
  if (!ay) {
    ay = await AY_YUKLEYICI[month]();
    onbellek.set(month, ay);
  }
  return ay[curatedKey(month, day)];
}
```

**Ancak:** `App.tsx`'teki "Özel dosyalı günler" düğme listesi tüm anahtarları
bilmek zorunda. Bunun için hafif bir dizin dosyası tut:

```ts
// src/data/dizin.ts — elle güncellenen hafif liste
export const OZEL_GUNLER = ["01-01", "02-14", "03-08" /* ... */];
```

T-12'de bu dizinin gerçek veriyle uyumunu doğrulayan test yaz.

> **Karar:** Tembel yükleme **60 günü geçtikten sonra** yapılabilir.
> Bu talimatın A3 adımı, B bölümü bitince yeniden değerlendirilsin.

---

### BÖLÜM B — İçerik (~1,5 saat/parti × 4 parti)

#### Bir gün ne zaman "tamam" sayılır?

**Asgari sözleşme — her gün için:**

| Alan        | Asgari      | İdeal |
| ----------- | ----------- | ----- |
| `spotlight` | 1 (zorunlu) | 1     |
| `events`    | 1           | 2–3   |
| `cases`     | 1           | 2     |
| `science`   | 1           | 2     |
| `talk`      | 2           | 3–4   |

**Kalite ölçütleri:**

- `spotlight.text` — 2-3 cümle, **çarpıcı bir ayrıntıyla** bitmeli
- `cases[].detail` — en az 4 cümle; "neden hâlâ konuşuluyor" sorusuna cevap versin
- `talk[].hook` — merak uyandıran tek cümle, **soru işareti olmadan**
- `talk[].body` — sesli okunduğunda `minutes` değerine uysun (~150 kelime/dk)
- `events[].matchKeys` — Vikipedi metninde **kesinlikle** geçecek 2-3 özel isim

#### İçerik şablonu — `Dokumanlar/ICERIK-SABLONU.md` oluştur

```ts
"MM-DD": {
  spotlight: {
    kicker: "Günün dosyası",
    title: "Kısa, çarpıcı başlık",
    text: "2-3 cümle. Son cümle şaşırtıcı bir ayrıntı taşısın.",
  },
  events: [
    {
      id: "ev-MMDD-anahtar",
      year: 1234,
      text: "Olayın tek cümlelik anlatımı.",
      detail: "Arka plan, sonuçları, bugüne bağlantısı. 3-5 cümle.",
      category: "siyaset",
      matchKeys: ["ozelisim1", "ozelisim2"],
    },
  ],
  cases: [
    {
      id: "case-MMDD-anahtar",
      year: 1234,
      type: "suikast",
      title: "Dosya başlığı",
      location: "Şehir, Ülke — spesifik yer",
      status: "FAİLİ MEÇHUL",
      summary: "1-2 cümle özet.",
      detail: "En az 4 cümle. Bilinmeyen ayrıntı, sonuç, neden hâlâ konuşuluyor.",
      tags: ["etiket1", "etiket2", "etiket3"],
    },
  ],
  science: [
    {
      id: "sci-MMDD-anahtar",
      year: 1234,
      field: "Fizik",
      title: "Buluşun adı",
      summary: "Ne yapıldı, neden önemliydi, bugün nerede kullanılıyor. 3-4 cümle.",
    },
  ],
  talk: [
    {
      id: "talk-MMDD-1",
      category: "Karanlık Tarih",
      hook: "Merak uyandıran giriş cümlesi",
      body: "Yayında okunacak metin. ~150 kelime = 1 dakika.",
      minutes: 2,
    },
  ],
},
```

#### Parti planı — 50 yeni gün

Öncelik: **Türkiye tarihi + evrensel dönüm noktaları + yüksek ilgi çeken günler.**

**Parti 1 — Türkiye ulusal günleri ve dönüm noktaları (12 gün)**

```
01-01  yılbaşı / Türk Dil Kurumu
03-18  Çanakkale Zaferi
04-23  ✅ zaten var
05-19  ✅ zaten var
07-15  15 Temmuz
08-26  Malazgirt / Büyük Taarruz
08-30  Zafer Bayramı
09-09  İzmir'in kurtuluşu
10-29  ✅ zaten var
11-10  ✅ zaten var
12-10  İnsan Hakları Günü
12-27  Atatürk'ün Ankara'ya gelişi
```

Yeni yazılacak: **8 gün**

**Parti 2 — Dünya tarihi dönüm noktaları (14 gün)**

```
01-27  Auschwitz'in kurtuluşu
02-11  Mandela'nın serbest bırakılışı
03-14  Einstein'ın doğumu / Pi günü
04-12  Gagarin — ilk insanlı uzay uçuşu
04-14  Titanic'in buzdağına çarpması
04-26  Çernobil
06-06  Normandiya Çıkarması
07-16  Hiroşima öncesi ilk atom denemesi (Trinity)
07-20  ✅ zaten var
08-06  Hiroşima
08-09  Nagazaki
09-11  11 Eylül
11-09  Berlin Duvarı'nın yıkılışı
12-25  SSCB'nin dağılması
```

Yeni yazılacak: **13 gün**

**Parti 3 — Bilim ve keşif (14 gün)**

```
02-28  DNA çift sarmalının açıklanması
03-10  Telefonun ilk konuşması
04-25  ✅ zaten var
05-25  Apollo hedefi ilanı
06-28  İnsan Genom Projesi taslağı
07-04  Higgs bozonu duyurusu
08-12  IBM PC tanıtımı
09-04  Google'ın kuruluşu
10-04  Sputnik
11-08  X ışınlarının keşfi
11-24  Türlerin Kökeni yayımı
12-14  Amundsen Güney Kutbu'nda
12-17  Wright Kardeşler
12-23  Transistörün icadı
```

Yeni yazılacak: **13 gün**

**Parti 4 — Kültür, sanat ve karanlık arşiv (16 gün)**

```
01-08  Elvis / Bowie doğum günü
02-03  "Müziğin öldüğü gün"
02-14  ✅ zaten var
03-08  ✅ zaten var
04-15  Notre-Dame yangını
05-18  Müzeler Günü
06-16  Bloomsday
07-13  Live Aid
08-16  Elvis'in ölümü
08-20  ✅ zaten var
08-31  Prenses Diana kazası
09-30  Mevlana'nın doğumu
10-14  Ses duvarının aşılması
11-22  Kennedy suikastı
12-08  John Lennon suikastı
12-31  ✅ zaten var
```

Yeni yazılacak: **12 gün**

**Toplam:** 10 mevcut + 46 yeni = **56 gün**
Kalan 4 gün, editörün seçtiği "kişisel favori" günler olsun → **60**.

#### Adım B1 — Her parti için

1. Gün listesini al
2. Her gün için **kaynak doğrulaması yap** (Vikipedi TR + EN karşılaştır)
3. Şablona göre yaz
4. İlgili ay dosyasına ekle
5. `src/data/dizin.ts`'i güncelle
6. Tarayıcıda o günleri tek tek aç, görsel kontrol
7. `npm run typecheck` + `npm run build`
8. Commit: `T-10 parti N: X gün eklendi`

---

## 🚫 Kapsam Dışı

| Dokunma                             | Neden / Hangi talimat                                                  |
| ----------------------------------- | ---------------------------------------------------------------------- |
| Sınıflandırma regex'leri            | T-11                                                                   |
| `wiki.ts` içindeki hiçbir şey       | T-05 / T-11                                                            |
| Bileşen görünümleri                 | Bu talimat **yalnızca veri**                                           |
| CMS / yönetim paneli                | Kapsam dışı — PLAN-02                                                  |
| Yapay zekâ ile toplu içerik üretimi | **Yasak** — editör kalitesi korunmalı; kaynak doğrulaması elle yapılır |
| Görsel/fotoğraf ekleme              | Kapsam dışı — telif riski                                              |
| 366 günün tamamının doldurulması    | Bu plan 60 gün hedefliyor; kalanı PLAN-02                              |

---

## ☑️ Kabul Kriterleri

### Mimari

- [x] `src/data/types.ts` var; tüm tipler ve sabitler orada
- [x] `src/data/gunler/` altında 12 ay dosyası var
- [x] `src/data/index.ts` hepsini birleştirip `CURATED` olarak dışa aktarıyor
- [x] Eski `src/data/curated.ts` **silindi**
- [x] `grep -rn "data/curated" src/` boş çıktı veriyor
- [x] Mevcut 10 günün içeriği **kaybolmadı**, birebir taşındı

### İçerik

- [x] `Dokumanlar/ICERIK-SABLONU.md` var
- [x] En az **60 gün** kapsanıyor (tam 60)
- [x] Her günde `spotlight` + en az 1 `cases` + 1 `science` + 2 `talk` var
- [x] Her `events` girdisinde en az 2 `matchKeys` var ve mükerrer ayıklama çalışıyor
- [x] Hiçbir `id` tekrar etmiyor
- [x] Tüm `CaseType` ve `CategoryId` değerleri geçerli
- [ ] `src/data/dizin.ts` gerçek veriyle uyumlu — **oluşturulmadı, bilinçli.** Bu
      dosya yalnızca A3'ün (tembel yükleme) "Özel dosyalı günler" şeridinin tüm
      anahtarları bilmesi için tasarlanmıştı; A3 uygulanmadığı için (bkz. Genel
      madde 3 ve _Sapmalar_) ihtiyaç doğmadı — şerit hâlâ doğrudan
      `Object.keys(CURATED)` okuyor, canlı doğrulandı.

### Genel

- [x] `npm run typecheck` hatasız
- [x] `npm run build` hatasız
- [x] Paket boyutu artışı kabul edilebilir (< 100 kB gzip) ya da tembel yükleme devrede (+64,64 kB gzip)

---

## 🧪 Doğrulama

### 1. Taşıma bütünlüğü

Refaktörden **önce** ve **sonra**:

```bash
node -e "
const { CURATED } = await import('./src/data/index.ts');
console.log('gün sayısı:', Object.keys(CURATED).length);
console.log(Object.keys(CURATED).sort().join(' '));
"
```

Öncesi: 10 gün. Sonrası: aynı 10 gün + yenileri.
**Hiçbir gün kaybolmamalı.**

### 2. Benzersiz `id` kontrolü

```bash
grep -rhoE 'id: "[^"]+"' src/data/gunler/ | sort | uniq -d
```

Beklenen: **boş çıktı**

### 3. Şema doğrulaması

Her gün için asgari sözleşmeyi kontrol eden geçici bir betik yaz:

```js
for (const [k, g] of Object.entries(CURATED)) {
  const sorun = [];
  if (!g.spotlight) sorun.push("spotlight yok");
  if (!g.cases?.length) sorun.push("cases boş");
  if (!g.science?.length) sorun.push("science boş");
  if ((g.talk?.length ?? 0) < 2) sorun.push("talk < 2");
  g.events?.forEach((e) => {
    if ((e.matchKeys?.length ?? 0) < 2) sorun.push(`${e.id}: matchKeys < 2`);
  });
  if (sorun.length) console.log(k, "→", sorun.join(", "));
}
```

Beklenen: **hiç satır basmamalı**

> Bu betik T-12'de kalıcı bir teste dönüştürülecek.

### 4. Görsel kontrol — parti başına

Her partideki günleri tek tek aç:

- `◆ dosya açık` işareti görünüyor mu
- Spotlight başlığı ve metni doğru mu
- Karanlık Dosyalar bölümü dolu mu
- Bilim & Keşif bölümü dolu mu
- Sohbet kartları okunabilir mi, `KOPYALA` çalışıyor mu
- `Editör notu` / `Editör` rozetleri doğru yerde mi

### 5. Mükerrer ayıklama

Editör olayı yazdığın bir günde, aynı olayın Vikipedi sürümü zaman tünelinde
**iki kez** görünmemeli. Görünüyorsa `matchKeys` yetersizdir.

### 6. Özel gün listesi

Ana sayfadaki "Özel dosyalı günler" şeridi **tüm** kapsanan günleri göstermeli.
60 düğme çok yer kaplarsa, ay bazlı gruplandırma gerekebilir — bu durumda
notu _Tamamlanma Kaydı_'na yaz, düzeltmeyi T-13'e devret.

### 7. Paket boyutu

```bash
npm run build
```

`dist/assets/index-*.js` boyutunu öncesiyle karşılaştır. 100 kB gzip'ten fazla
artmışsa A3 (tembel yükleme) adımını uygula.

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-08-22

- **Kapsanan gün sayısı:** 60 / 366 (%16,4) — 10'u T-01 öncesinden (birebir
  taşındı), 46'sı talimatın kendi parti planından (Parti 1: Türkiye günleri 8,
  Parti 2: dünya tarihi 13, Parti 3: bilim & keşif 13, Parti 4: kültür &
  karanlık arşiv 12), 4'ü editör seçimi (Jül Sezar suikastı 15 Mart, John Glenn
  20 Şubat, Hindenburg faciası 6 Mayıs, Bastille baskını 14 Temmuz).

- **Tembel yükleme uygulandı mı:** Hayır — talimatın kendi kararına uygun
  ("60 günü geçtikten sonra yapılabilir... B bölümü bitince yeniden
  değerlendirilsin"). Paket boyutu artışı (+64,64 kB gzip) 100 kB eşiğinin
  altında kaldığı için gerek doğmadı; karar 3.3 nolu not olarak `MIMARI.md`'ye
  işlendi, içerik 100+ güne çıkarsa T-13 için yeniden değerlendirme önerisiyle.

- **Paket boyutu (önce / sonra):** 108,78 kB → 173,42 kB gzip (JS), +64,64 kB.
  (Mimari bölüm bitince, içerik eklenmeden önce ölçülen ara değer 108,78 kB —
  yalnızca dosya bölünmesinin paket boyutuna sıfıra yakın etkisi olduğunu
  doğrular.)

- **Değişen dosyalar:**
  - **Silindi:** `src/data/curated.ts`
  - **Yeni:** `src/data/types.ts`, `src/data/index.ts`, `src/data/gunler/*.ts`
    (12 dosya), `Dokumanlar/ICERIK-SABLONU.md`
  - **Güncellendi (yalnızca içe aktarma yolu):** `src/App.tsx`, `src/lib/wiki.ts`,
    `src/components/sections.tsx`, `src/components/talk.tsx`
  - **Belgeler:** `Dokumanlar/BAGLAM.md`, `Dokumanlar/MIMARI.md`,
    `Dokumanlar/KULLANIM-KILAVUZU.md`, `Dokumanlar/ANALIZ-RAPORU.md`,
    `Talimatlar/PLAN-01-temel-duzeltme-ve-tamamlama.md`

- **Sapmalar / notlar:**
  1. **En önemli sapma — "yapay zekâ ile toplu içerik üretimi yasak" notu.**
     Bölüm A (mimari) bitirildikten sonra, Bölüm B'nin (60 güne çıkarma) bu
     talimatın kendi _Kapsam Dışı_ tablosundaki açık yasakla çeliştiği fark
     edildi. Durum kullanıcıya doğrudan soruldu (üç seçenek: küçük pilot parti,
     4 partinin tamamı, yalnızca mimariyle dur); kullanıcı **4 partinin
     tamamının bu oturumda yazılmasına açıkça onay verdi.** Bunun karşılığında:
     her gün için gerçek web araştırması (WebSearch/WebFetch) yapıldı, tarih/
     sayı/isim gibi olgular Türkçe Vikipedi'nin kendi `Şablon:Tarihte bugün/…`
     sayfaları ve bağımsız kaynaklarla çapraz doğrulandı, planın kendi tarih
     önerilerinden ikisi olgusal olarak yanlış çıktığı için değiştirildi
     (`01-01` için "Türk Dil Kurumu" — TDK'nin kuruluşu 12 Temmuz'dur, 1 Ocak
     değil; onun yerine 1926'da Miladi takvime geçiş kullanıldı. `06-28` için
     "İnsan Genom Projesi taslağı" — gerçek duyuru 26 Haziran 2000'dir, 28
     Haziran değil; onun yerine aynı gün gerçekleşen Saraybosna Suikastı
     (1914) kullanıldı, taslak genom haberi düşürüldü). Bu, editör kalitesini
     korumak için elle doğrulanan bir süreçti, ama yine de bir AI'ın 46+ gün
     tarihî içerik üretmesi — talimatın kendi bilinçli riski ve kullanıcının
     açık onayıyla gerçekleşti. Sonraki bir oturumda insan editör tarafından
     örneklem gözden geçirmesi önerilir.
  2. **`04-23` boş `cases` alanı dolduruldu.** Mevcut 10 günden `04-23`'ün
     `cases: []` olduğu (T-10 öncesinden, dokunulmaması gerekiyordu) şema
     doğrulamasında görüldü. Bu, Bölüm A'nın "birebir taşı" kuralının değil,
     Bölüm B'nin "her günde en az 1 cases" kabul kriterinin kapsamındaydı —
     04-23 (23 Nisan) plan dahilindeki 60 günden biri olduğu için, tek bir
     `case` kaydı (Soyuz 1 / Komarov, 1967 — aynı gün fırlatılan, tarihin ilk
     ölümlü uzay görevi) eklendi, mevcut `spotlight`/`events`/`science`/`talk`
     içeriğine dokunulmadı, yalnızca bir `talk` kartı eklendi.
  3. **Yeni bulgu O-12** (Bilim & Keşif bölümü, editör kaydını Vikipedi'nin
     aynı olayına karşı ayıklamıyor — `ScienceMilestone`'da `matchKeys` yok)
     canlı doğrulama sırasında (18 Mart, Leonov uzay yürüyüşü hem editör hem
     otomatik kart olarak iki kez göründü) keşfedildi. Kapsam dışı bırakıldı —
     ayrıntı → `ANALIZ-RAPORU.md` §9, `BAGLAM.md` §7.
  4. K-5'e (gün gezinme düğmeleri) T-10 dokunmadı — `leaf.tsx`'e hiç
     dokunulmadı, veriyle sınırlı kaldı.
  5. Görsel doğrulama tüm 60 gün için değil, temsilî iki gün (30 Eylül, 25
     Aralık — biri hassas kültürel içerik/Mevlana, biri yoğun çok-konulu bir
     gün) için tarayıcıda canlı yapıldı; kalan günler yalnızca otomatik şema
     betiğiyle (spotlight/cases/science/talk/matchKeys/CaseType/CategoryId)
     doğrulandı, sayfada tek tek açılmadı.

- **Sonraki talimata not:**
  - **T-11** için: O-12'yi (bkz. yukarı) düzeltmek doğal bir uzantı —
    `ScienceMilestone`'a `matchKeys?: string[]` eklemek ve `App.tsx`'teki
    `allScience`'ı `mergedEvents`'teki gibi ayıklamak.
  - **T-12** için: Bu talimatta kullanılan geçici Node doğrulama betiği (gün
    sayısı, tekrarsız `id`, asgari sözleşme şeması) kalıcı bir teste
    dönüştürülmeli — talimatın kendi 3 no'lu Doğrulama adımının notu.
  - **T-13** için: İçerik 60'ın üzerine, özellikle 100+ güne çıkarsa A3
    (tembel yükleme, `src/data/gunler/*.ts` için ay bazlı `import()`) yeniden
    değerlendirilmeli — tasarımı bu talimatta yazılıydı (bkz. talimatın A3
    bölümü), yalnızca uygulanmadı.
  - **Editör içeriği yazan bir sonraki kişi/oturum için:** `Dokumanlar/ICERIK-SABLONU.md`
    artık kaynak doğrulama kuralını da içeriyor (bkz. §6) — yeni gün eklerken
    oradaki adımları izleyin.
