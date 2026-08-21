# PLAN-01 · Temel Düzeltme ve Tamamlama

| Alan | Değer |
|---|---|
| **Oluşturulma** | 2026-08-21 |
| **Durum** | 🟡 Aktif — 4 / 14 tamamlandı |
| **Son hareket** | 2026-08-21 · T-04 tamamlandı |
| **Talimat sayısı** | 14 (T-01 … T-14) |
| **Faz sayısı** | 5 |
| **Dayanak** | [`../Dokumanlar/ANALIZ-RAPORU.md`](../Dokumanlar/ANALIZ-RAPORU.md) |
| **İş akışı** | [`../Dokumanlar/CALISMA-SISTEMI.md`](../Dokumanlar/CALISMA-SISTEMI.md) |

---

## 1. Planın Amacı

Tarih Yaprağı bugün **çalışan ama yarım** bir uygulama. Bu plan onu
**yayınlanabilir, bakımı yapılabilir ve içerik olarak dolu** bir ürüne taşır.

Plan bittiğinde:

- Görünen hiçbir bilgi yanlış olmayacak (takvim, sayaçlar).
- Her gün paylaşılabilir bir adrese sahip olacak.
- Uygulama sosyal medyada düzgün önizlenecek, telefona kurulabilecek.
- Bir hata tüm sayfayı çökertmeyecek.
- Kritik mantık testlerle korunacak.
- Editör içeriği 10 günden anlamlı bir kapsama çıkacak ve **büyütülebilir** olacak.

## 2. Kapsam Dışı (bu planda yapılmayacak)

| Konu | Neden | Ne zaman |
|---|---|---|
| Backend / veritabanı | Ürün istemci taraflı çalışıyor, ihtiyaç yok | Kullanıcı hesabı gerekirse |
| Kullanıcı hesabı, favori, not | Ürün henüz bunu gerektirmiyor | PLAN-02+ |
| Çoklu dil arayüzü (i18n) | Hedef kitle Türkçe | PLAN-02+ |
| Tasarım dilinin değiştirilmesi | Mevcut tasarım güçlü, korunacak | — |
| Yapay zekâ ile içerik üretimi | Editör kalitesi korunmalı | Ayrı değerlendirme |

---

## 3. Fazlar ve Talimatlar

### FAZ 0 — Temizlik ve Zemin
*Sonraki her işin üzerine basacağı düz zemin. Önce burası.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| ~~T-01~~ ✅ | [Proje kimliği ve bağımlılık temizliği](Tamamland%C4%B1/T-01-proje-kimligi-ve-bagimlilik-temizligi.md) | 🔴 Kritik | O-1, O-2, O-3, K-4, m-2 | ~2 sa |
| ~~T-02~~ ✅ | [Geliştirme ortamı ve başlatıcı](Tamamland%C4%B1/T-02-gelistirme-ortami-ve-baslatici.md) | 🟠 Yüksek | — | ~1,5 sa |

### FAZ 1 — Kritik Hata Düzeltmeleri
*Kullanıcının gördüğü yanlış bilgiler. Doğruluk her şeyden önce gelir.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| ~~T-03~~ ✅ | [Takvim ve tarih doğruluğu](Tamamland%C4%B1/T-03-takvim-tarih-dogrulugu.md) | 🔴 Kritik | K-1 | ~2 sa |
| ~~T-04~~ ✅ | [Sayaç ve görünürlük hataları](Tamamland%C4%B1/T-04-sayac-ve-gorunurluk-hatalari.md) | 🔴 Kritik | K-2, K-3 | ~2,5 sa |
| T-05 | [Ağ katmanı sağlamlaştırma](T-05-ag-katmani-saglamlastirma.md) | 🟠 Yüksek | O-4, O-8 | ~3 sa |

### FAZ 2 — Ürün Kabuğu
*Uygulamayı "web sitesi" yapan katman: paylaşım, simge, hata dayanıklılığı, erişilebilirlik.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| T-06 | [Yönlendirme ve paylaşılabilir bağlantı](T-06-yonlendirme-ve-paylasilabilir-baglanti.md) | 🔴 Kritik | U-1 | ~4 sa |
| T-07 | [Erişilebilirlik ve klavye](T-07-erisilebilirlik-ve-klavye.md) | 🟠 Yüksek | O-6, O-7 | ~3,5 sa |
| T-08 | [Site kimliği: favicon, SEO, PWA](T-08-site-kimligi-favicon-seo-pwa.md) | 🟠 Yüksek | U-4 | ~3 sa |
| T-09 | [Hata sınırı ve durum ekranları](T-09-hata-siniri-ve-durum-ekranlari.md) | 🟠 Yüksek | O-5, O-9, m-3, m-6 | ~3 sa |

### FAZ 3 — İçerik
*Uygulamanın asıl değeri. En uzun soluklu faz.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| T-10 | [İçerik mimarisi ve kapsam genişletme](T-10-icerik-mimarisi-ve-kapsam.md) | 🟠 Yüksek | U-2 | ~6 sa+ |
| T-11 | [Sınıflandırma doğruluğu](T-11-siniflandirma-dogrulugu.md) | 🟡 Orta | U-3 | ~4 sa |

### FAZ 4 — Kalite Güvencesi
*Buraya kadar yapılan her şeyi koruyan çit.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| T-12 | [Test, lint ve biçimlendirme altyapısı](T-12-test-lint-bicimlendirme.md) | 🟠 Yüksek | U-5 | ~4 sa |
| T-13 | [Performans ve derleme iyileştirmesi](T-13-performans-ve-derleme.md) | 🟡 Orta | m-4, m-5, perf | ~3 sa |

### FAZ 5 — Kapanış
*Belgeleri gerçeğe eşitle, yayına al.*

| # | Talimat | Öncelik | Bulgu | Süre |
|---|---|---|---|---|
| T-14 | [Dokümantasyon güncelleme ve yayın](T-14-dokumantasyon-ve-yayin.md) | 🟠 Yüksek | — | ~2,5 sa |

**Toplam tahmini süre:** ~44 saat

---

## 4. Bağımlılık Haritası

```
T-01 ──┬─► T-02
       │
       ├─► T-03 ──┐
       ├─► T-04 ──┤
       └─► T-05 ──┤
                  │
                  ├─► T-06 ──┬─► T-08
                  ├─► T-07 ──┤
                  └─► T-09 ──┘
                             │
              T-10 ──────────┤   (T-01 sonrası her an başlanabilir)
              T-11 ──────────┤   (T-10 ile paralel yürüyebilir)
                             │
                             ├─► T-12 ──► T-13
                             │
                             └───────────► T-14  (EN SON)
```

### Kesin kurallar

- ~~**T-01 ilk sırada.**~~ ✅ **2026-08-21'de tamamlandı.** Zemin hazır: `vite.config.ts`
  boş portu kendi buluyor, HMR her portta çalışıyor, kullanılmayan 12 bağımlılık kalktı.
  Artık T-02 ve T-03/T-04/T-05 açık.
- ~~**T-02.**~~ ✅ **2026-08-21'de tamamlandı.** `başlat.bat` sadeleştirildi, `baslat.sh`
  eklendi, editör/ortam sözleşmeleri (`.editorconfig`, `.nvmrc`, `.vscode/*`) kuruldu,
  `wiki.ts`'teki gömülü API URL'si `src/lib/config.ts` + `.env.example` üzerinden
  ortam değişkenine taşındı. Artık T-03/T-04/T-05 açık.
- ~~**T-03.**~~ ✅ **2026-08-21'de tamamlandı.** `src/lib/date.ts` eklendi
  (`isLeapYear`, `daysInMonth`, `dayOfYear`, `weekdayIndex`); `leaf.tsx`'teki 2024
  referans sabiti tamamen kaldırıldı. K-1 çözüldü. **Yeni bulgu:** doğrulama
  sırasında gün gezinme düğmelerinin (Önceki/Sonraki/Bugüne dön) bir CSS yığılım
  hatası yüzünden gerçek tıklamayla tetiklenemediği keşfedildi (K-5,
  `ANALIZ-RAPORU.md`'ye eklendi, henüz bir talimata atanmadı — T-04 önerilir).
- ~~**T-04.**~~ ✅ **2026-08-21'de tamamlandı.** Yeni `src/lib/useInView.ts`:
  181 ayrı `IntersectionObserver` yerine tek paylaşılan gözlemci + `setTimeout`
  güvenlik ağı. `Reveal` ve `CountUp` bu hook'u kullanacak şekilde yeniden
  yazıldı (dışa aktarılan props değişmedi). K-2 (sayaçların gün değişiminde
  donması) ve K-3 (sekme arka plandayken sayfanın tamamen boş görünmesi)
  çözüldü. K-5'e **bilinçli olarak dokunulmadı** — kapsamı yalnızca K-2/K-3
  idi, K-5 ayrı bir CSS yığılım hatası (bkz. T-03 notu yukarıda), hâlâ hiçbir
  talimata atanmadı. Artık T-05 açık.
- **T-14 en sonda.** Belgeler ancak her şey bitince gerçeğe eşitlenebilir.
- **T-06 → T-08 sırası zorunlu.** SEO meta etiketleri gün bazlı URL'lere bağlıdır.
- **T-10 ve T-11 paralel yürüyebilir** ama T-11 tamamlanmadan T-10'un otomatik
  içerik kalitesi ölçülemez.
- **T-12 mümkün olduğunca erken.** T-03, T-04, T-11 testleri T-12 sonrası yazılırsa
  regresyon koruması gecikir. Zaman varsa T-12'yi FAZ 1'den sonra öne alın.

---

## 5. İlerleme Tablosu

> Bir talimat bitince buradaki durumu `✅ Tamamlandı` yapın ve tarih girin.

| # | Talimat | Durum | Tamamlanma | Not |
|---|---|---|---|---|
| T-01 | Proje kimliği ve bağımlılık temizliği | ✅ Tamamlandı | 2026-08-21 | 60 paket kaldırıldı · `node_modules` −47,1 MB · K-4 çözüldü · üretim paketi büyümedi. Tailwind kaynak taraması bulgusu → T-13 Adım 10 |
| T-02 | Geliştirme ortamı ve başlatıcı | ✅ Tamamlandı | 2026-08-21 | `başlat.bat` sadeleşti (PowerShell port taraması kalktı) · `baslat.sh` eklendi · `.editorconfig`/`.nvmrc`/`.vscode/*` kuruldu · API tabanı `config.ts` + `.env.example` üzerinden ortam değişkenine taşındı |
| T-03 | Takvim ve tarih doğruluğu | ✅ Tamamlandı | 2026-08-21 | `src/lib/date.ts` eklendi · 2024 sabiti kaldırıldı · "Yılın 233. günü" doğrulandı · Yeni bulgu K-5 (gezinme düğmeleri tıklanamıyor) → `ANALIZ-RAPORU.md` |
| T-04 | Sayaç ve görünürlük hataları | ✅ Tamamlandı | 2026-08-21 | `src/lib/useInView.ts` eklendi (tek paylaşılan gözlemci + `setTimeout` güvenlik ağı) · gözlemci sayısı 181→1 · `Reveal`/`CountUp` bu hook'u kullanıyor, props değişmedi · K-2 ve K-3 çözüldü · K-5'e bilinçli olarak dokunulmadı (kapsam dışı) |
| T-05 | Ağ katmanı sağlamlaştırma | ⬜ Bekliyor | | |
| T-06 | Yönlendirme ve paylaşılabilir bağlantı | ⬜ Bekliyor | | |
| T-07 | Erişilebilirlik ve klavye | ⬜ Bekliyor | | |
| T-08 | Site kimliği: favicon, SEO, PWA | ⬜ Bekliyor | | |
| T-09 | Hata sınırı ve durum ekranları | ⬜ Bekliyor | | |
| T-10 | İçerik mimarisi ve kapsam genişletme | ⬜ Bekliyor | | |
| T-11 | Sınıflandırma doğruluğu | ⬜ Bekliyor | | |
| T-12 | Test, lint ve biçimlendirme altyapısı | ⬜ Bekliyor | | |
| T-13 | Performans ve derleme iyileştirmesi | ⬜ Bekliyor | | |
| T-14 | Dokümantasyon güncelleme ve yayın | ⬜ Bekliyor | | |

**İlerleme:** 4 / 14 · `██████░░░░░░░░░░░░░░` %29

---

## 6. Başarı Ölçütleri

Plan ancak aşağıdakilerin tamamı doğruysa kapatılabilir:

### Doğruluk
- [x] "Yılın X. günü" değeri her yıl ve her gün için doğru
- [x] Sayaçlar gün değişiminde doğru güncelleniyor
- [x] 29 Şubat dahil hiçbir kenar durumda yanlış bilgi yok

### Sağlamlık
- [x] Sekme arka planda açılsa bile içerik görünüyor
- [ ] Bir bileşen hata verse bile sayfa çökmüyor, kullanıcı mesaj görüyor
- [ ] Hızlı gün değiştirmede eski istekler iptal ediliyor
- [ ] Çevrimdışı yedek TTL'li çalışıyor

### Ürün
- [ ] Her gün için paylaşılabilir bir URL var (örn. `/21-agustos`)
- [ ] Tarayıcı geri/ileri tuşu gün geçişinde çalışıyor
- [ ] Bağlantı sosyal medyada başlık + görselle önizleniyor
- [ ] Favicon var, telefona uygulama olarak eklenebiliyor
- [ ] Klavye ile tam gezinme mümkün, ekran okuyucu bildirimleri duyuyor

### İçerik
- [ ] Editör içeriği en az 60 günde mevcut
- [ ] İçerik dosya yapısı 366 güne ölçekleniyor
- [ ] Sınıflandırma doğruluğu test edilmiş ve ölçülü

### Kalite
- [ ] `npm run typecheck` yeşil
- [ ] `npm run build` yeşil
- [ ] `npm run lint` yeşil
- [ ] `npm test` yeşil, kritik saf fonksiyonlar kapsanmış
- [ ] Lighthouse: Performans ≥ 90, Erişilebilirlik ≥ 95, SEO ≥ 95

### Belge
- [ ] `BAGLAM.md` gerçeği yansıtıyor
- [ ] `KULLANIM-KILAVUZU.md` yeni özellikleri içeriyor
- [ ] `README.md` dolu

---

## 7. Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| Wikimedia API'si değişir / hız sınırı uygular | Düşük | Yüksek | T-05'te TTL'li önbellek ve zarif düşüş; API sözleşmesi tek dosyada (`wiki.ts`) izole |
| İçerik yazımı (T-10) tahminden çok uzun sürer | **Yüksek** | Orta | T-10 partilere bölündü; her parti bağımsız teslim edilebilir |
| Yönlendirme (T-06) mevcut durum akışını bozar | Orta | Yüksek | Önce T-03/T-04 bitmeli; URL yalnızca `day`/`month` state'ini yansıtsın, ikinci doğruluk kaynağı olmasın |
| Sınıflandırma iyileştirmesi (T-11) mevcut doğru eşleşmeleri bozar | Orta | Orta | T-12'nin test altyapısı önce kurulmalı; anlık görüntü (snapshot) testi ile korunmalı |
| Kapsam kayması — "bir de şunu yapayım" | **Yüksek** | Yüksek | Her talimatta *Kapsam Dışı* bölümü zorunlu |

---

## 8. Kapanış Özeti

> Plan tamamlandığında doldurulacak.

- **Kapanış tarihi:**
- **Gerçekleşen süre:**
- **Tamamlanan talimatlar:** / 14
- **Kapsam dışı bırakılanlar ve gerekçesi:**
- **PLAN-02'ye devredilen konular:**
- **Öğrenilenler:**
