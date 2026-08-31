# T-14 · Dokümantasyon Güncelleme ve Yayın

| Alan             | Değer                                                      |
| ---------------- | ---------------------------------------------------------- |
| **Faz**          | FAZ 5 — Kapanış                                            |
| **Öncelik**      | 🟠 Yüksek                                                  |
| **Tahmini süre** | ~2,5 saat                                                  |
| **Bağımlılık**   | **T-01 … T-13'ün tamamı**                                  |
| **İlgili bulgu** | — (kapanış)                                                |
| **Durum**        | ✅ Tamamlandı — 2026-08-24 (Bölüm B kapsam dışı bırakıldı) |

> ⛔ **Bu talimat en sonda yapılır.** Belgeler ancak her şey bittiğinde gerçeğe
> eşitlenebilir. Erken yapılırsa yanlış bilgi üretir.

---

## 🎯 Amaç

İki iş:

1. **Belgeleri gerçeğe eşitle** — 13 talimat boyunca değişen her şeyi
   `Dokumanlar/` altındaki dosyalara işle.
2. **Yayına al** — uygulamayı gerçek bir adreste çalışır hâle getir.

---

## 📍 Mevcut Durum

`README.md` — **iki satır**:

```markdown
# TarihinYapragi

Bugünün Tarihi ve Bilimsel Gelişmeler
```

`Dokumanlar/` altındaki dört belge **2026-08-21 tarihli** — yani T-01 öncesi
duruma göre yazıldı. 13 talimat sonrası hepsi eskimiş olacak:

| Belge                  | Neden eskimiş olacak                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `BAGLAM.md`            | Bağımlılıklar, dosya haritası, "Mevcut Durum" bölümü                                             |
| `MIMARI.md`            | Yeni dosyalar (`date.ts`, `slug.ts`, `useInView.ts`, `ErrorBoundary`), yönlendirme, veri klasörü |
| `KULLANIM-KILAVUZU.md` | URL'ler, klavye kısayolları, PWA kurulumu, düzelen "bilinen sorunlar"                            |
| `ANALIZ-RAPORU.md`     | Çözülen bulgular işaretlenmemiş                                                                  |

Ayrıca yayın için hiçbir şey yok: dağıtım yapılandırması, alan adı, LICENSE.

---

## ✅ Yapılacaklar

### BÖLÜM A — Belgeler

#### Adım A1 — `README.md`

Kapsam:

```markdown
# Tarih Yaprağı

[ekran görüntüsü]

Her güne bir arşiv — [tarihyapragi.xyz](https://...)

## Ne yapar

[3-4 cümle + özellik listesi]

## Hızlı başlangıç

Windows: `başlat.bat` çift tıkla
Diğer: `npm install && npm run dev`

## Belgeler

| Belge                                                | İçerik                       |
| ---------------------------------------------------- | ---------------------------- |
| [Bağlam](Dokumanlar/BAGLAM.md)                       | Projeyi tanı — buradan başla |
| [Mimari](Dokumanlar/MIMARI.md)                       | Teknik derinlik              |
| [Kullanım Kılavuzu](Dokumanlar/KULLANIM-KILAVUZU.md) | Son kullanıcı rehberi        |
| [Çalışma Sistemi](Dokumanlar/CALISMA-SISTEMI.md)     | Plan → talimat iş akışı      |

## Komutlar

[betik tablosu]

## Teknoloji

[yığın tablosu]

## Kaynaklar ve teşekkür

Wikimedia REST API · Google Fonts

## Lisans

MIT
```

#### Adım A2 — `Dokumanlar/BAGLAM.md` güncelle

| Bölüm               | Yapılacak                                                          |
| ------------------- | ------------------------------------------------------------------ |
| Başlık              | Tarihi ve sürümü güncelle                                          |
| §2 Teknoloji Yığını | Yönlendirme satırı: _(yok)_ → **react-router-dom v6, `/GG-ayadi`** |
| §4 Dosya Haritası   | Yeni dosyaların hepsi eklensin                                     |
| §6 Komutlar         | `lint`, `format`, `test`, `kontrol`, `sitemap`, `analyze`          |
| §7 Mevcut Durum     | **Tamamen yeniden yaz** — çözülenler "Çalışan"a taşınsın           |

#### Adım A3 — `Dokumanlar/MIMARI.md` güncelle

Eklenecek/değişecek:

- §1 Genel Şema → `RouterProvider` → `ErrorBoundary` → `App` zinciri
- §2 Veri Katmanı → `AbortController`, TTL, `DayError` (T-05)
- §3 Veri Modeli → `src/data/` klasör yapısı (T-10)
- §4 Sunum → `useGunVerisi`, bölünen bileşenler (T-13)
- **§ YENİ: Yönlendirme** — URL şeması, slug mantığı, 404
- **§ YENİ: Test Stratejisi** — neyi test ediyoruz, neden
- §7 Performans → yeni ölçümler
- §8 Teknik Borç → çözülenleri sil, **kalan** borcu yaz

#### Adım A4 — `Dokumanlar/KULLANIM-KILAVUZU.md` güncelle

| Bölüm                 | Yapılacak                                                                 |
| --------------------- | ------------------------------------------------------------------------- |
| §1 Başlatma           | Yeni `başlat.bat` menüsü, `baslat.sh`                                     |
| §3 Gün Seçme          | **Adres çubuğu** satırı: "desteklenmiyor" → **destekleniyor**, örneklerle |
| §5 Yayın Modu         | Değişmedi (kontrol et)                                                    |
| §7 Klavye Kısayolları | `←` `→` `T` `/` `?` eklendi                                               |
| **§ YENİ**            | "Günü paylaşma" bölümü                                                    |
| **§ YENİ**            | "Telefona uygulama olarak ekleme" bölümü                                  |
| §8 SSS                | Çevrimdışı cevabı güncelle (service worker)                               |
| §9 Sorun Giderme      | **K-1…K-4 "bilinen sorun" satırlarını sil** — hepsi çözüldü               |

> Sorun giderme tablosundaki "bilinen sorun" satırlarının silinmesi, bu planın
> en somut çıktısıdır. Silinecek satır kalmadıysa iyi iş çıkarılmış demektir.

#### Adım A5 — `Dokumanlar/ANALIZ-RAPORU.md` kapat

Her bulguya durum işareti ekle:

```markdown
### K-1 · Takvim yaprağındaki "Yılın X. günü" artık yıl hatası

**Durum:** ✅ Çözüldü — T-03 · 2026-XX-XX
```

Sona bir özet tablo ekle:

| Kod | Bulgu            | Durum | Talimat |
| --- | ---------------- | ----- | ------- |
| K-1 | Artık yıl hatası | ✅    | T-03    |
| …   | …                | …     | …       |

Çözülmeyenler `⏭️ PLAN-02'ye devredildi` işaretiyle kalsın, gerekçesiyle.

#### Adım A6 — `LICENSE`

MIT lisans metni, telif satırı: `Copyright (c) 2026 <ad>`

#### Adım A7 — `CHANGELOG.md`

```markdown
# Değişiklik Günlüğü

## [0.2.0] — 2026-XX-XX

İlk yayın sürümü. PLAN-01 tamamlandı.

### Eklenen

- Paylaşılabilir gün adresleri (`/21-agustos`)
- Klavye kısayolları (← → T / ?)
- PWA desteği — telefona kurulabilir, çevrimdışı çalışır
- "Bugünün anlamı" şeridi
- Arama sonuç sayacı
- Hata sınırı ve durum ekranları
- Editör içeriği 10 → 60 gün

### Düzeltilen

- Takvimde "Yılın X. günü" artık yıl hatası (K-1)
- Gün değişince güncellenmeyen sayaçlar (K-2)
- Arka plan sekmede görünmeyen içerik (K-3)
- HMR WebSocket bağlantı hatası (K-4)

### Kaldırılan

- 10 kullanılmayan bağımlılık
```

---

### BÖLÜM B — Yayın

#### Adım B1 — Barındırma seç

| Seçenek              | Artı                                           | Eksi                             |
| -------------------- | ---------------------------------------------- | -------------------------------- |
| **Cloudflare Pages** | Ücretsiz, hızlı, `_redirects` doğrudan çalışır | —                                |
| **Netlify**          | `_redirects` yerleşik, kolay                   | Ücretsiz katman sınırlı          |
| **Vercel**           | `vercel.json` hazır                            | SPA için fazla                   |
| **GitHub Pages**     | Ücretsiz                                       | SPA fallback zor, alt yol sorunu |

**Öneri:** Cloudflare Pages veya Netlify. `public/_redirects` T-06'da hazırlandı.

#### Adım B2 — Ortam değişkenlerini kesinleştir

Alan adı belli olunca güncelle:

| Yer                   | Ne                                              |
| --------------------- | ----------------------------------------------- |
| `index.html`          | `og:image` → mutlak URL                         |
| `index.html`          | `og:url` ekle                                   |
| `public/robots.txt`   | `Sitemap:` mutlak URL                           |
| `scripts/sitemap.mjs` | `SITE_URL` ortam değişkeni                      |
| `App.tsx`             | canonical zaten `location.origin` kullanıyor ✅ |

Dağıtım ortamında: `SITE_URL=https://alan-adi.com`

#### Adım B3 — Dağıtım öncesi kontrol

```bash
npm run kontrol
```

Sonra üretim önizlemesi:

```bash
npm run build && npm run preview
```

Kontrol listesi:

- [ ] `/` bugüne yönleniyor
- [ ] `/29-ekim` doğrudan açılıyor (SPA fallback)
- [ ] `/olmayan` 404
- [ ] Favicon görünüyor
- [ ] `robots.txt` ve `sitemap.xml` erişilebilir
- [ ] Service worker kayıtlı
- [ ] Konsol **temiz** — hata yok

#### Adım B4 — Yayınla ve doğrula

Yayından sonra gerçek adreste:

- [ ] Ana sayfa açılıyor
- [ ] Rastgele 5 gün adresi doğrudan açılıyor
- [ ] WhatsApp/Telegram'a bağlantı at → önizleme kartı çıkıyor
- [ ] Telefonda "Ana ekrana ekle" çalışıyor
- [ ] Lighthouse (gerçek adres, mobil): Performans ≥ 90, Erişilebilirlik ≥ 95, SEO ≥ 95
- [ ] `https://alan-adi.com/sitemap.xml` 366 adres

#### Adım B5 — Arama motoruna bildir

- Google Search Console: siteyi ekle, `sitemap.xml`'i gönder
- Bing Webmaster Tools: aynısı

---

### BÖLÜM C — Plan Kapanışı

#### Adım C1 — Talimatları arşivle

Tüm talimatların `Tamamlandı/` klasöründe olduğunu doğrula:

```bash
ls Talimatlar/T-*.md 2>/dev/null && echo "HÂLÂ AÇIK TALİMAT VAR" || echo "Tüm talimatlar tamamlandı"
ls "Talimatlar/Tamamlandı/" | wc -l    # → 14
```

#### Adım C2 — Planı kapat

`PLAN-01` içinde:

- İlerleme tablosunda **14/14 ✅**
- **Başarı Ölçütleri** kontrol listesini tek tek işaretle
- **Kapanış Özeti** bölümünü doldur

#### Adım C3 — Planı arşive taşı

```bash
git mv "Talimatlar/PLAN-01-temel-duzeltme-ve-tamamlama.md" "Talimatlar/Plan/"
```

#### Adım C4 — Sürüm etiketi

```bash
git tag -a v0.2.0 -m "PLAN-01 tamamlandı — ilk yayın sürümü"
```

---

## 🚫 Kapsam Dışı

| Dokunma                              | Neden                                 |
| ------------------------------------ | ------------------------------------- |
| Yeni kod özelliği                    | Bu talimat **yalnızca belge + yayın** |
| Hata düzeltme                        | Bulunan hatalar PLAN-02'ye not edilir |
| PLAN-02'yi yazmak                    | Ayrı bir analiz turu gerektirir       |
| Ücretli hizmet / alan adı satın alma | Kullanıcı kararı                      |
| Sosyal medya hesabı, tanıtım         | Ürün kararı                           |

---

## ☑️ Kabul Kriterleri

### Belgeler

- [x] `README.md` dolu; ekran görüntüsü, hızlı başlangıç, belge bağlantıları var
- [x] `BAGLAM.md` güncel — dosya haritası gerçek yapıyla birebir
- [x] `MIMARI.md` güncel — Yönlendirme ve Test Stratejisi bölümleri eklendi
- [x] `KULLANIM-KILAVUZU.md` güncel — Sorun Giderme'de çözülen "bilinen sorun" satırı **kalmadı**
- [x] `ANALIZ-RAPORU.md` — her bulgu ✅ / ⏭️ işaretli, özet tablo var
- [x] `LICENSE` var
- [x] `CHANGELOG.md` var, `0.2.0` girdisi dolu
- [x] `package.json` sürümü `0.2.0`

### Yayın — 🚫 **KAPSAM DIŞI BIRAKILDI (proje sahibinin kararı, 2026-08-24)**

> Proje sahibi, uygulamanın bir web sitesi olarak yayınlanmayacağını, **yerel
> çalıştırılan normal bir uygulama** olarak kullanılacağını bildirdi. Barındırma
> hesabı, alan adı ve arama motoru kaydı bu yüzden yapılmadı. Aşağıdaki maddeler
> teknik olarak **hazır** ama herkese açık bir adres olmadan doğrulanamaz:

- [—] Uygulama gerçek bir adreste çalışıyor — _yayınlanmadı_
- [x] Gün adresleri doğrudan açılıyor (SPA fallback) — _yerelde doğrulandı; `_redirects` + `vercel.json` hazır_
- [—] Sosyal medya önizlemesi çıkıyor — _`og:*`/`twitter:*` etiketleri hazır, herkese açık adres gerekiyor_
- [—] PWA kurulabiliyor — _service worker üretiliyor (17 girdi), gerçek tarayıcıda kayıt doğrulanmadı_
- [x] `sitemap.xml` 366 adres — _`npm run build` her derlemede üretiyor_
- [—] Search Console'a gönderildi — _yayın olmadığı için geçersiz_
- [x] Lighthouse: Perf ≥ 90, Erişilebilirlik ≥ 95, SEO ≥ 95 — _T-13'te üretim derlemesine karşı 92 / 96 / 100_

### Plan kapanışı

- [x] `Talimatlar/` kökünde `T-*.md` **kalmadı**
- [x] `Talimatlar/Tamamlandı/` içinde **15** talimat var _(plan yürürken T-15 eklendi)_
- [x] `PLAN-01` ilerleme tablosu **15/15**, Kapanış Özeti dolu
- [x] `PLAN-01` → `Talimatlar/Plan/` klasörüne taşındı
- [x] `v0.2.0` etiketi atıldı

---

## 🧪 Doğrulama

### 1. Belge doğruluğu — çapraz kontrol

`BAGLAM.md`'deki dosya haritasını gerçekle karşılaştır:

```bash
find src -type f | sort
```

Haritada olmayan dosya veya haritada olup gerçekte olmayan dosya kalmamalı.

Komut listesini karşılaştır:

```bash
node -e "console.log(Object.keys(require('./package.json').scripts).join('\n'))"
```

### 2. Bağlantı kontrolü

Tüm `.md` dosyalarındaki göreli bağlantıları test et:

```bash
grep -rhoE '\]\(([^)h][^)]*)\)' README.md Dokumanlar/*.md \
  | sed -E 's/^\]\(|\)$//g' | sed 's/#.*//' | sort -u \
  | while read -r f; do [ -e "$f" ] || [ -e "Dokumanlar/$f" ] || echo "KIRIK: $f"; done
```

Beklenen: **boş çıktı**

### 3. Yeni geliştirici testi

Depoyu **temiz bir klasöre** klonla ve yalnızca `README.md`'yi izleyerek çalıştır:

```bash
git clone <url> test-klasoru && cd test-klasoru
```

README'de yazan adımlarla uygulama ayağa kalkmalı. Kalkmıyorsa README eksiktir.

### 4. Kullanım kılavuzu testi

Kılavuzdaki her özelliği sırayla dene. Anlatılan bir şey çalışmıyorsa
**kılavuz değil uygulama** yanlıştır — hatayı PLAN-02'ye not et.

### 5. Yayın doğrulaması

```bash
curl -sI https://alan-adi.com/29-ekim | head -1        # → 200
curl -s  https://alan-adi.com/robots.txt
curl -s  https://alan-adi.com/sitemap.xml | grep -c "<url>"   # → 366
curl -s  https://alan-adi.com/ | grep -E 'og:image|og:title'
```

### 6. Arşiv yapısı

```bash
ls Talimatlar/                     # → yalnızca Plan/ ve Tamamlandı/
ls Talimatlar/Plan/                # → PLAN-01-*.md
ls Talimatlar/Tamamlandı/ | wc -l  # → 14
```

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-08-24
- **Yayın adresi:** — (yayına alınmadı, aşağıdaki _Sapmalar_ maddesi 1)
- **Barındırma:** — (aynı gerekçe)
- **Lighthouse (gerçek adres):** — · _yerel üretim derlemesinde (T-13):
  Performans 92 · Erişilebilirlik 96 · SEO 100_
- **Sürüm etiketi:** `v0.2.0`
- **PLAN-02'ye devredilen konular:** O-10, O-11, O-12, O-13, m-7, m-8 + otomatik
  tıklama (hit-test) denetimi + içerik tembel yüklemesi + kalan 306 günün editör
  içeriği. Gerekçeleriyle birlikte → `ANALIZ-RAPORU.md` §11.

- **Değişen dosyalar:**

  | Dosya                                      | İşlem                                                                                                                                                                                                                                                                                                                                                          |
  | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `README.md`                                | Baştan yazıldı — ekran görüntüsü, "Ne yapar", hızlı başlangıç (Windows/macOS/Linux/elle), belge tablosu, 13 satırlık komut tablosu, teknoloji tablosu, kaynaklar, lisans                                                                                                                                                                                       |
  | `LICENSE`                                  | Yeni — MIT, `Copyright (c) 2026 Tarih Yaprağı`                                                                                                                                                                                                                                                                                                                 |
  | `CHANGELOG.md`                             | Yeni — `0.2.0` girdisi (Eklenen / Düzeltilen / Kaldırılan / Bilinen sınırlar) + geriye dönük `0.1.0`                                                                                                                                                                                                                                                           |
  | `package.json`                             | Sürüm `0.1.0` → `0.2.0`                                                                                                                                                                                                                                                                                                                                        |
  | `Dokumanlar/gorseller/ekran-goruntusu.png` | Yeni — README görseli, gerçek uygulamadan (29 Ekim, başsız Chrome, 1280×745)                                                                                                                                                                                                                                                                                   |
  | `Dokumanlar/BAGLAM.md`                     | §4 dosya haritasına test dosyaları, `src/test/setup.ts`, README/CHANGELOG/LICENSE/eslint/prettier/CI ve `gorseller/` eklendi; `Talimatlar/` ağacı gerçek duruma çekildi; §6'ya `kontrol`/`lint`/`format`/`test`/`sitemap`/`icons`/`analyze` tablosu eklendi; §7 plan durumu 15/15 + T-14 cümlesi + yayın kararı; sürüm 0.2.0                                   |
  | `Dokumanlar/MIMARI.md`                     | §1 şemasına `ErrorBoundary`/`errorElement` zinciri ve neden kök sarmalayıcının yetmediği notu; **§12 Yönlendirme** (URL şeması, slug mantığı, 29 Şubat kararı, `errorElement`, SPA fallback) ve **§13 Test Stratejisi** (neyi/neden test ediyoruz tablosu, yapılandırma, `pool: forks` + `undici` override gerekçesi, jsdom'un iki tuzağı, yeşil kapı) eklendi |
  | `Dokumanlar/KULLANIM-KILAVUZU.md`          | §9'daki dört çözülmüş "bilinen sorun" satırı **silindi** (K-1, K-2, K-3, K-5); K-4 satırı kullanıcı diline çevrildi; tablo altındaki not "çözülmemiş bilinen sorun kalmadı"a güncellendi; adres örneği `localhost:3000` olarak düzeltildi; sürüm 0.2.0                                                                                                         |
  | `Dokumanlar/ANALIZ-RAPORU.md`              | **§11 Bulgu Durum Tablosu** eklendi (31 bulgu, dört kategori, toplam tablosu, devredilenlerin tek tek gerekçesi, doğrulanamamış iki madde); O-10…O-13 başlıkları `⏭️ PLAN-02'YE DEVREDİLDİ` işaretlendi; §0 sağlık tablosu ve derleme rakamları güncellendi; kapanış hükmü eklendi                                                                             |
  | `Talimatlar/PLAN-01-*.md`                  | 15/15, başarı ölçütlerinin tamamı işaretli, Kapanış Özeti dolduruldu, `Plan/` klasörüne taşındı                                                                                                                                                                                                                                                                |
  | `Talimatlar/T-14-*.md`                     | Bu dosya — kriterler işaretlendi, Bölüm B kapsam dışı olarak kayda geçirildi, `Tamamlandı/`ya taşındı                                                                                                                                                                                                                                                          |

- **Sapmalar / notlar:**

  1. **Bölüm B (Yayın) bütünüyle yapılmadı — proje sahibinin açık kararı.** Talimat,
     uygulamanın herkese açık bir adrese alınmasını, sosyal medya önizlemesinin ve
     PWA kurulumunun gerçek adreste doğrulanmasını, `sitemap.xml`'in Search
     Console'a gönderilmesini öngörüyordu. Sorulduğunda proje sahibi bunun bir web
     sitesi değil, **yerel çalıştırılan normal bir uygulama** olarak kullanılacağını
     belirtti. Barındırma hesabı açmak, alan adı almak ve arama motoruna kayıt
     yaptırmak bu yüzden yapılmadı. Yayınla ilgili her şey (SPA fallback
     yapılandırmaları, `og:*`/`twitter:*`, manifest, service worker, 366 adresli
     `sitemap.xml`) depoda **hazır durumda** duruyor; gelecekte bir adres
     seçilirse yalnızca mutlak URL'lerin doldurulması gerekir
     (`index.html` `og:image`/`og:url`, `public/robots.txt` `Sitemap:`,
     `scripts/sitemap.mjs` `SITE_URL`). Talimatın Adım B2'si de bu yüzden
     uygulanmadı — doldurulacak bir alan adı yok.
  2. **Talimatın öngördüğü belge işlerinin bir kısmı zaten yapılmıştı.** T-04'ten
     T-15'e kadar her talimat kendi Tamamlanma Kaydı'nda `BAGLAM.md`/`MIMARI.md`/
     `KULLANIM-KILAVUZU.md`'yi güncel tutmuştu; bu yüzden A2/A3/A4'ün "tamamen
     yeniden yaz" maddeleri yerine **gerçekten eskimiş olan** kısımlar düzeltildi
     (dosya haritasındaki eksik test dosyaları, `Talimatlar/` ağacı, komut listesi,
     çözülmüş "bilinen sorun" satırları). A3'ün istediği iki **yeni** bölüm
     (Yönlendirme, Test Stratejisi) gerçekten eksikti ve sıfırdan yazıldı.
  3. **Kabul kriterlerindeki sayılar 14 değil 15.** Talimat yazıldığında plan 14
     talimattı; K-5 için plan yürürken T-15 eklendi (bkz. T-15 Tamamlanma Kaydı).
     `Tamamlandı/` klasöründe 15 dosya var, ilerleme tablosu 15/15.
  4. **Doğrulama adımı 3 ("yeni geliştirici testi") tam olarak uygulanmadı** —
     depo temiz bir klasöre klonlanıp README yalnızca onun adımlarıyla
     çalıştırılmadı. README'deki komutlar mevcut çalışma kopyasında tek tek
     doğrulandı (`npm run dev` ayakta, `npm run kontrol` yeşil, betik tablosu
     `package.json` ile birebir karşılaştırıldı) ama bu, gerçekten temiz bir
     klonda `npm install`'un sorunsuz geçtiğini kanıtlamaz.
  5. **Belge bağlantıları makine ile denetlendi:** tüm `.md` dosyalarındaki göreli
     bağlantılar yüzde kodlaması çözülerek kontrol edildi, kırık bağlantı yok.

- **Sonraki talimata not:**

  PLAN-01 kapandı; sıradaki adım `CALISMA-SISTEMI.md` §9'a göre **yeni bir analiz
  turu ve PLAN-02**'dir. PLAN-02'ye hazır bekleyen konular:

  1. Açık bulgular: O-10 (kontrast), O-11 (`holidays` çöp kayıt), O-12 (Bilim &
     Keşif mükerrer), O-13 (`react-router` 6→7 güvenlik yükseltmesi), m-7
     (yazdırma stili), m-8 (ölü eşik).
  2. **Otomatik tıklama (hit-test) denetimi** — K-5'in 10 talimat boyunca
     gözden kaçmasının kök nedeni; gerçek bir tarayıcı sürücüsü gerektirir.
  3. **İçerik tembel yüklemesi** — T-13'ün ≥%15 paket küçülme hedefinin
     karşılanamamasının tek nedeni.
  4. **Editör içeriğini 60 günden ileriye taşımak** — mimari 366 güne hazır.
  5. Doğrulanamamış iki madde (service worker canlı kaydı, `content-visibility`
     etkisi) gerçek bir tarayıcıda kontrol edilmeli.
