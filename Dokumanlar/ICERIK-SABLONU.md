# İÇERİK ŞABLONU — Editör Günü Nasıl Yazılır

> Bu dosya, `src/data/gunler/*.ts` altına yeni bir gün eklerken izlenecek kuralları
> ve asgari kalite sözleşmesini tanımlar. Kaynak: `Talimatlar/T-10-icerik-mimarisi-ve-kapsam.md`.
>
> **Son güncelleme:** 2026-08-22

---

## 0. Altın kural

> **Yapay zekâ ile toplu içerik üretimi yasaktır.** Editör kalitesi korunmalı;
> her gün elle yazılır, her olgu Vikipedi TR + EN karşılaştırmasıyla (mümkünse
> ek bir bağımsız kaynakla) doğrulanır. Bu şablon otomasyon için değil, tutarlılık
> için vardır.

---

## 1. Bir gün ne zaman "tamam" sayılır?

**Asgari sözleşme — her gün için:**

| Alan        | Asgari      | İdeal |
| ----------- | ----------- | ----- |
| `spotlight` | 1 (zorunlu) | 1     |
| `events`    | 1           | 2–3   |
| `cases`     | 1           | 2     |
| `science`   | 1           | 2     |
| `talk`      | 2           | 3–4   |

**Kalite ölçütleri:**

- `spotlight.text` — 2-3 cümle, **çarpıcı bir ayrıntıyla** bitmeli.
- `cases[].detail` — en az 4 cümle; "neden hâlâ konuşuluyor" sorusuna cevap versin.
- `talk[].hook` — merak uyandıran tek cümle, **soru işareti olmadan**.
- `talk[].body` — sesli okunduğunda `minutes` değerine uysun (~150 kelime/dakika).
- `events[].matchKeys` — Vikipedi metninde **kesinlikle** geçecek 2-3 özel isim
  (mükerrer ayıklamanın çalışması buna bağlı).

---

## 2. Dosya ve yer

Gün, ait olduğu ayın dosyasına eklenir: `src/data/gunler/MM-adaySlug.ts`
(örn. `03-mart.ts`). Dosya, ayın büyük harfli sabitini (`MART`) dışa aktarır;
yeni gün bu nesneye bir anahtar olarak eklenir:

```ts
export const MART: Record<string, CuratedDay> = {
  "03-08": {/* mevcut gün */},
  "03-18": {/* yeni gün buraya */},
};
```

Ay dosyası yoksa (henüz hiç günü olmayan bir ay) dosya zaten
`export const XXX: Record<string, CuratedDay> = {};` olarak duruyordur — boş
nesneyi doldurun. Yeni bir ay dosyası **eklemeyin**; 12'si de `src/data/gunler/`
altında zaten var.

---

## 3. TypeScript şablonu

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

`events` alanı isteğe bağlıdır (`CuratedDay.events?`); `cases`, `science`, `talk`
her zaman dizi olarak bulunmalı (boşsa `[]`, `undefined` değil).

---

## 4. Geçerli sabit değerler

Bunların dışında bir değer yazarsanız `npm run typecheck` hata verir —
kaynak: `src/data/types.ts`.

**`category` (`CategoryId`):**
`savas` · `siyaset` · `bilim` · `kesif` · `kultur` · `spor` · `felaket` · `genel`

**`cases[].type` (`CaseType`):**
`suikast` · `cinayet` · `katliam` · `kayıp` · `felaket` · `idam` · `skandal`

**`cases[].status`:**
`ÇÖZÜLDÜ` · `FAİLİ MEÇHUL` · `SÜRÜYOR` · `KAPANDI`

**`talk[].minutes`:** `1` | `2` | `3` (sayı olarak, tırnaksız)

---

## 5. `id` kuralı

- Önek türe göre: `ev-`, `case-`, `sci-`, `talk-`.
- Ardından `MMDD` (tire yok, dört haneli gün-ay), ardından kısa bir anahtar kelime
  veya `talk` için sıra numarası (`talk-0308-1`, `talk-0308-2`, …).
- **Proje genelinde benzersiz olmalı.** Eklemeden önce kontrol edin:

  ```bash
  grep -rhoE 'id: "[^"]+"' src/data/gunler/ | sort | uniq -d
  ```

  Boş çıktı = sorun yok.

---

## 6. Kaynak doğrulama

1. Vikipedi **TR** sayfasını oku.
2. Aynı olayın Vikipedi **EN** sayfasıyla karşılaştır — tarih, isim, sayı
   uyuşmazlığı varsa ikisini de not düş, üçüncü bir kaynakla (mümkünse) doğrula.
3. `events[].matchKeys` için seçtiğin özel isimlerin Wikimedia "on this day"
   API'sinin döndürdüğü metinde **gerçekten geçtiğini** kontrol et — geçmiyorsa
   mükerrer ayıklama çalışmaz ve aynı olay zaman tünelinde iki kez görünür.
4. Gerçek kişilerin ölümü/kaybı gibi hassas konularda (`cases`) spekülasyondan
   kaçın; `status` alanını yalnızca kaynaklarda açıkça belirtilen sonuca göre seç.

---

## 7. Ekledikten sonra

1. `npm run typecheck` ve `npm run build` hatasız çalışmalı.
2. Günü tarayıcıda aç: `◆ dosya açık` işareti, spotlight, dolu Karanlık Dosyalar
   ve Bilim & Keşif bölümleri, okunabilir sohbet kartları, `KOPYALA` düğmesi.
3. Editör olayının otomatik (Vikipedi) sürümüyle zaman tünelinde **iki kez**
   görünmediğini doğrula.

---

## 8. Rekorlar Kasası — `src/data/rekorlar.ts` (T-23)

Rekorlar günlere değil **havuza** yazılır. 365 günü doldurmak gerekmez: rotasyon
her gün havuzdan üç kayıt seçer (`src/lib/rekor.ts`). Bir rekor eklemek bir günü
doldurmakla aynı şey değildir — sıra beklemeden, istediğiniz zaman eklenir.

### 8.1 Altın kural burada da geçerli

Yapay zekâ ile toplu rekor üretimi **yasaktır.** `npm run rekor-avi` yalnızca aday
listesi çıkarır (`Dokumanlar/rekor-adaylari.md`); kaydı editör okur, doğrular ve
elle yazar. Dil modelleri rekor sorularında en çok uydurma yapan alandadır:
rakamlar spesifik, isimler az bilinen kişilerden ve model yanlış cevabı da
kendinden emin bir tonla verir.

### 8.2 `value` alanının kuralı

`value` ekranda **en büyük puntoyla** çıkar ve yayında doğrudan okunur. Bu yüzden:

> Yalnızca kaynağında **açıkça geçen** rakam yazılır.

Yaygın olarak bilinen ama kaynakta doğrulanamayan bir sayı `value`'ya konmaz;
gerekiyorsa `story` içinde "yaklaşık" diye geçer. Örnek: Jyoti Amge'nin boyu
TR/EN Vikipedi özetlerinde geçmediği için `value: "Yaklaşık 63 cm"` yazıldı,
"62,8 cm" değil.

### 8.3 `date` — ne zaman yazılır, ne zaman yazılmaz

`date: "MM-DD"` rekoru o güne **sabitler** ve karta "Bugün" rozeti koyar.
Yalnızca kırılma günü kesin doğrulandıysa yazılır. Emin değilseniz **boş bırakın** —
kayıt rotasyona girer, hiçbir şey kaybedilmez. Yanlış güne sabitlenmiş bir rekor
ise her yıl o gün yanlış bilgi gösterir.

### 8.4 `status` — bayatlamaya karşı

| Değer     | Ne zaman                                                       |
| --------- | -------------------------------------------------------------- |
| `GÜNCEL`  | Bugün hâlâ geçerli                                             |
| `KIRILDI` | Sonradan aşıldı — `brokenBy` **zorunlu** (test bunu denetler)  |
| `EMEKLİ`  | Kategori artık kabul edilmiyor (genelde güvenlik gerekçesiyle) |

Sürekli kırılan rekorlarda (sırıkla atlama, sprint) kaydı `GÜNCEL` bırakmak
bayat bir rakamı geçerliymiş gibi gösterir. Duplantis kaydı bu yüzden `KIRILDI`
ve `brokenBy: "Yine kendisi — rekoru düzenli olarak bir santim artırıyor"`.

### 8.5 `official` — GWR onaylı mı

`true` yalnızca Guinness World Records'ın resmen onayladığı unvanlar içindir.
"En"i tartışmalı, birden fazla adayı olan başlıklar (`"dünyanın en eski restoranı"`)
`false` alır ve ekranda ayrı bir uyarı satırıyla gösterilir.

### 8.6 Yayıncı alanları

Bunlar kasayı bir ansiklopediden ayıran şey — boş bırakılabilir ama bırakılmamalı:

| Alan       | Ne yazılır                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `story`    | Rekorun kendisini değil, **ardındaki hikâyeyi**. En az 3 cümle (test denetler). Kim bu insan, neden yaptı, sonra ne oldu |
| `compare`  | Rakamı hayal edilebilir kılan kıyas: "üst üste dizilmiş 14 otobüs kadar"                                                 |
| `opener`   | Yayında konuya girerken okunacak tek cümle. **Soru işareti olmadan** (test denetler)                                     |
| `question` | İzleyiciye sorulabilecek tartışma sorusu                                                                                 |

`opener` yazılmayan rekor Sohbet Kartı'na dönüşmez — kasada durur ama Yayın
Modu'na girmez.

### 8.7 Ekledikten sonra

1. `npm run test` — `data.test.ts` içindeki "REKORLAR bütünlüğü" testleri
   `id` benzersizliğini, `status`/`brokenBy` tutarlılığını, `date` biçimini,
   `story` uzunluğunu ve `opener` kuralını denetler.
2. Günü tarayıcıda aç: kart doğru kapsamda mı, damga doğru mu, "Kaynak"
   bağlantısı çalışıyor mu.
3. `date` yazdıysanız o güne gidip **listenin başında** ve "Bugün" rozetiyle
   çıktığını doğrulayın.
