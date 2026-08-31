# T-23 · Rekorlar Kasası

| Alan             | Değer                                                    |
| ---------------- | -------------------------------------------------------- |
| **Faz**          | Plan dışı — kullanıcı isteğiyle açıldı                   |
| **Öncelik**      | 🟡 Orta (yeni özellik, mevcut hiçbir bulguyu kapatmıyor) |
| **Tahmini süre** | ~5 saat                                                  |
| **Bağımlılık**   | Yok — mevcut bölümlerin hiçbirine dokunmuyor             |
| **İlgili bulgu** | Yok. Tetikleyici: kullanıcı isteği, 2026-08-31           |
| **Durum**        | ✅ Tamamlandı — 2026-08-31                               |

> ⚠️ **Bu talimat PLAN-02'nin parçası değildir.** PLAN-02 (İçerik Derinliği ve
> Araştırma Katmanı, T-16…T-22) hâlâ 0/7 durumunda ve bu iş onun sırasını
> değiştirmez. Kayıt, plan dışı bir işin izlenebilir kalması için yazıldı
> (`CALISMA-SISTEMI.md` §3).

---

## 🎯 Amaç

Uygulamaya, dünya rekorları üzerine yedinci bir içerik bölümü eklemek.

Kullanıcının beyanı: _"Guinness rekorlar kitabı ile ilgili kapsamlı bir eklenti…
amacım ilginç bilgiler edinerek yayında kullanmak."_ Yani bölüm bir ansiklopedi
girdisi değil, **yayın malzemesi** üretmeli.

---

## 📍 Kısıt — neden Guinness'ten veri çekilmiyor

Uygulamaya başlamadan önce kaynak fizibilitesi ölçüldü. Bulgular:

| Yol                               | Sonuç                                                                                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GWR resmî API                     | Yok                                                                                                                                                        |
| GWR sitesini kazıma               | Kullanım şartları kopyalamayı, yeniden yayımlamayı ve başka bir siteye koymayı açıkça yasaklıyor                                                           |
| Üçüncü parti "Guinness API"       | Kaynağı belirsiz, kazımaya dayalı olma ihtimali yüksek                                                                                                     |
| Wikidata `P1000`                  | **CC0.** 848 ifade, `P580` niteleyicisiyle tarihli. Gün eşleşmesi canlı doğrulandı                                                                         |
| Vikipedi `insource:`              | TR'de 200 + 323 madde, EN'de 13.117. Aday kaynağı olarak kullanılabilir                                                                                    |
| Wikidata'dan superlatif hesaplama | **Reddedildi.** "En yüksek dağ" sorgusu Everest yerine Mount Blackburn döndürdü (16390) — veride metre/feet karışıklığı var. Yayında yanlış bilgi üretirdi |

CORS üç kaynakta da açık (`access-control-allow-origin: *`) — backend gerekmedi.

**Ayrım:** rekorun kendisi bir olgudur; telifli olan GWR'ın metni ve fotoğrafıdır.
Kasadaki her kayıt elle, kendi cümlelerimizle yazıldı.

---

## 🔧 Yapılan İş

### Üç katman

1. **Editör havuzu** (`src/data/rekorlar.ts`) — 17 elle yazılmış kayıt. Kartların gövdesi.
2. **Wikidata şeridi** (`src/lib/wikidata.ts`) — seçili günde kırılmış rekorlar, ayrı
   şeritte ve ayrı rozetle. İkincil katman: hata verirse sessizce boş döner.
3. **Rekor avı** (`scripts/rekor-avi.mjs`) — editör aracı, çalışma zamanı değil.
   Depoya hiçbir şey yazmaz.

### Rotasyon

365 günü elle doldurmak yerine havuz rotasyonla dağıtıldı: `date` taşıyan kayıtlar
kendi gününe sabitlenir, gerisi `dayOfYear × aralarında-asal-adım % havuzBoyu`
formülüyle seçilir. Sabit referans yıl (2001) kullanıldı — yoksa paylaşılan bir
bağlantı yıl değişince başka içerik gösterirdi.

Ayrıntılı gerekçeler: `Dokumanlar/MIMARI.md` §14.

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-08-31

- **Değişen dosyalar:**

  | Dosya                          | İşlem                                                                                                                                                                        |
  | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `src/data/types.ts`            | `WorldRecord`, `RecordScope`, `RecordStatus` tipleri; `RECORD_SCOPES` ve `RECORD_STATUS_LABELS` haritaları eklendi                                                           |
  | `src/data/rekorlar.ts`         | **Yeni.** 17 kayıtlık editör havuzu + doğrulama kurallarını anlatan dosya başlığı                                                                                            |
  | `src/data/index.ts`            | `REKORLAR` / `REKOR_IDLER` dışa aktarımı                                                                                                                                     |
  | `src/lib/rekor.ts`             | **Yeni.** `gununRekorlari()`, `rotasyonAdimi()`, `rekorMetni()`, `buildRekorTalk()`                                                                                          |
  | `src/lib/wikidata.ts`          | **Yeni.** P1000 SPARQL sorgusu, `normalize()` eleme kuralları, sürümlü `localStorage` önbelleği, `useWikidataRekorlari()`                                                    |
  | `src/components/rekorlar.tsx`  | **Yeni.** `RekorlarSection` (kapsam çipleri, kart, açılır detay, kopyala), `WikidataSeridi`, `IconMadalya`                                                                   |
  | `src/components/BolumNav.tsx`  | `NAV`'a `rekorlar` girdisi — bölüm sayısı 6 → 7                                                                                                                              |
  | `src/components/Bolumler.tsx`  | 06 Rekorlar Kasası bölümü eklendi; Sohbet Kartları 06 → 07 (`baslik-06` → `baslik-07`); `wikidata`/`wikidataLoading` propları                                                |
  | `src/hooks/useGunVerisi.ts`    | İmzaya `month`/`day` eklendi; `rekorlar` alanı; `talkCards`'a rekor kartları; `AramaSonuclari`'na `rekor` süzgeci                                                            |
  | `src/App.tsx`                  | `useGunVerisi(data, curated, month, day)`; `useWikidataRekorlari` çağrısı; arama sayacına `arama.rekor.length`                                                               |
  | `scripts/rekor-avi.mjs`        | **Yeni.** Vikipedi `insource:` taraması, snippet temizliği, çöp eleme, `Dokumanlar/rekor-adaylari.md` raporu                                                                 |
  | `package.json`                 | `rekor-avi` betiği                                                                                                                                                           |
  | `.gitignore`                   | `Dokumanlar/rekor-adaylari.md` (üretilmiş çıktı)                                                                                                                             |
  | `src/lib/rekor.test.ts`        | **Yeni.** 19 test — rotasyon determinizmi, havuz dolaşımı, sabitleme, `buildRekorTalk`                                                                                       |
  | `src/lib/wikidata.test.ts`     | **Yeni.** 8 test — gerçek WDQS yanıtından kırpılmış fixture'larla eleme kuralları                                                                                            |
  | `src/data/data.test.ts`        | "REKORLAR bütünlüğü" — 9 test                                                                                                                                                |
  | `Dokumanlar/MIMARI.md`         | §14 Rekorlar Kasası eklendi; `Bolumler.tsx` satırı 6 → 7; "Yeni bölüm" yönergesindeki `App.tsx` → `BolumNav.tsx` düzeltmesi (T-13'ten kalma hata); `content-visibility` notu |
  | `Dokumanlar/BAGLAM.md`         | Dosya ağacına 4 yeni dosya; "altı bölüm" → yedi (3 yer)                                                                                                                      |
  | `Dokumanlar/ICERIK-SABLONU.md` | §8 — rekor yazma kuralları, `value`/`date`/`status`/`official` disiplini                                                                                                     |
  | `README.md`                    | "Altı bölüm" → "Yedi bölüm"; Rekorlar Kasası maddesi; `npm run rekor-avi` satırı                                                                                             |
  | `CHANGELOG.md`                 | `[Yayımlanmamış]` bölümü                                                                                                                                                     |

- **Kanıt:**

  | Ölçüm               | Sonuç                                                             |
  | ------------------- | ----------------------------------------------------------------- |
  | `npm run kontrol`   | ✅ typecheck + lint (0 hata) + 239 test + build                   |
  | Test sayısı         | 203 → **239** (+36)                                               |
  | Bölüm tarayıcıda    | ✅ 5 Ağustos ve 16 Ağustos'ta doğrulandı, konsol hatası yok       |
  | Gün sabitleme       | ✅ 5 Ağustos'ta Duplantis listenin **başında**, "Bugün" rozetiyle |
  | Rotasyon            | ✅ 16 Ağustos farklı üçlü gösteriyor; her takvim günü dolu (test) |
  | Wikidata şeridi     | ✅ 16 Ağustos → Usain Bolt (2009) dahil 6 satır                   |
  | Sohbet Kartları     | ✅ Rekor kartları Yayın Modu'na akıyor (5 kart, 10 dk)            |
  | `npm run rekor-avi` | ✅ 124 aday, 76 kayıt çöp filtresiyle elendi                      |
  | Paket boyutu        | 362,28 kB → **362,49 kB** (+0,21 kB; gzip +0,07 kB)               |

- **Yol boyunca düzeltilen iki içerik hatası:**

  1. **Duplantis kaydı bayat çıkıyordu.** `value` alanına önce rakam yerine
     "Olimpiyat finalinde kırıldı" yazılmıştı. Wikidata'daki P1000 kayıtları
     kontrol edilince rekorun 2024 Ağustos'tan sonra da defalarca kırıldığı
     görüldü. Kayıt `6,25 m` + `status: "KIRILDI"` + `brokenBy: "Yine kendisi"`
     olarak düzeltildi — rakam artık o akşamın ölçümü olduğu belli.
  2. **Wikidata şeridi kullanılamaz satırlar üretiyordu.** 16 Ağustos'ta
     "Israel Olatunde — national record" gibi hiçbir şey anlatmayan kayıtlar ve
     aynı yüzücünün iki mesafeden iki satırı çıkıyordu. `normalize()`'a jenerik ad
     eleme + kişi başına tek satır + 6 satır sınırı eklendi; önbellek anahtarı
     `ty-wdrec-` → `ty-wdrec2-` sürümlendi ki eski elemeyle yazılmış kayıtlar
     7 günlük TTL boyunca ekranda kalmasın.

- **Bilinçli olarak yapılmayanlar:**

  | Konu                                             | Neden                                                                                                                                                                          |
  | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | GWR verisinin doğrudan çekilmesi                 | Kullanım şartları yasaklıyor (yukarıda)                                                                                                                                        |
  | Havuzun 100+ kayda çıkarılması                   | Elle yazım işi. Rotasyon sayesinde 17 kayıt yılın tamamını dolu gösteriyor; havuz kullanıcının kendi araştırmasıyla büyüyecek                                                  |
  | Rekorlar için ayrı rota (`/5-agustos/rekor/...`) | PLAN-02 §2 aynı kararı olaylar için vermişti — yerinde panel tercih edildi                                                                                                     |
  | Wikidata şeridinin Türkçeleştirilmesi            | Etiket TR'de yoksa çeviri uydurmak olurdu; EN etiket olduğu gibi gösteriliyor                                                                                                  |
  | Ekran görüntüsüyle görsel kanıt                  | Tarayıcı aracının screenshot'ı sayfanın alt bölümlerinde boş kare döndürdü (sayfa başında çalışıyor). Doğrulama DOM + `getComputedStyle` (opacity 1) + `innerText` ile yapıldı |

- **Sonraki adım için not:** Kullanıcıya üç promptluk bir araştırma seti verildi
  (eklenti tasarımı / rekor avı / sağlama). Havuz bu setle toplanacak kayıtlarla
  büyütülecek. Yeni kayıt eklerken `ICERIK-SABLONU.md` §8 okunmalı — özellikle
  `value` alanının "yalnızca kaynakta açıkça geçen rakam" kuralı.
