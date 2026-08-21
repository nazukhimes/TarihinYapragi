# T-14 · Dokümantasyon Güncelleme ve Yayın

| Alan | Değer |
|---|---|
| **Faz** | FAZ 5 — Kapanış |
| **Öncelik** | 🟠 Yüksek |
| **Tahmini süre** | ~2,5 saat |
| **Bağımlılık** | **T-01 … T-13'ün tamamı** |
| **İlgili bulgu** | — (kapanış) |
| **Durum** | ⬜ Bekliyor |

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

| Belge | Neden eskimiş olacak |
|---|---|
| `BAGLAM.md` | Bağımlılıklar, dosya haritası, "Mevcut Durum" bölümü |
| `MIMARI.md` | Yeni dosyalar (`date.ts`, `slug.ts`, `useInView.ts`, `ErrorBoundary`), yönlendirme, veri klasörü |
| `KULLANIM-KILAVUZU.md` | URL'ler, klavye kısayolları, PWA kurulumu, düzelen "bilinen sorunlar" |
| `ANALIZ-RAPORU.md` | Çözülen bulgular işaretlenmemiş |

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
Diğer:   `npm install && npm run dev`

## Belgeler
| Belge | İçerik |
|---|---|
| [Bağlam](Dokumanlar/BAGLAM.md) | Projeyi tanı — buradan başla |
| [Mimari](Dokumanlar/MIMARI.md) | Teknik derinlik |
| [Kullanım Kılavuzu](Dokumanlar/KULLANIM-KILAVUZU.md) | Son kullanıcı rehberi |
| [Çalışma Sistemi](Dokumanlar/CALISMA-SISTEMI.md) | Plan → talimat iş akışı |

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

| Bölüm | Yapılacak |
|---|---|
| Başlık | Tarihi ve sürümü güncelle |
| §2 Teknoloji Yığını | Yönlendirme satırı: *(yok)* → **react-router-dom v6, `/GG-ayadi`** |
| §4 Dosya Haritası | Yeni dosyaların hepsi eklensin |
| §6 Komutlar | `lint`, `format`, `test`, `kontrol`, `sitemap`, `analyze` |
| §7 Mevcut Durum | **Tamamen yeniden yaz** — çözülenler "Çalışan"a taşınsın |

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

| Bölüm | Yapılacak |
|---|---|
| §1 Başlatma | Yeni `başlat.bat` menüsü, `baslat.sh` |
| §3 Gün Seçme | **Adres çubuğu** satırı: "desteklenmiyor" → **destekleniyor**, örneklerle |
| §5 Yayın Modu | Değişmedi (kontrol et) |
| §7 Klavye Kısayolları | `←` `→` `T` `/` `?` eklendi |
| **§ YENİ** | "Günü paylaşma" bölümü |
| **§ YENİ** | "Telefona uygulama olarak ekleme" bölümü |
| §8 SSS | Çevrimdışı cevabı güncelle (service worker) |
| §9 Sorun Giderme | **K-1…K-4 "bilinen sorun" satırlarını sil** — hepsi çözüldü |

> Sorun giderme tablosundaki "bilinen sorun" satırlarının silinmesi, bu planın
> en somut çıktısıdır. Silinecek satır kalmadıysa iyi iş çıkarılmış demektir.

#### Adım A5 — `Dokumanlar/ANALIZ-RAPORU.md` kapat

Her bulguya durum işareti ekle:

```markdown
### K-1 · Takvim yaprağındaki "Yılın X. günü" artık yıl hatası
**Durum:** ✅ Çözüldü — T-03 · 2026-XX-XX
```

Sona bir özet tablo ekle:

| Kod | Bulgu | Durum | Talimat |
|---|---|---|---|
| K-1 | Artık yıl hatası | ✅ | T-03 |
| … | … | … | … |

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

| Seçenek | Artı | Eksi |
|---|---|---|
| **Cloudflare Pages** | Ücretsiz, hızlı, `_redirects` doğrudan çalışır | — |
| **Netlify** | `_redirects` yerleşik, kolay | Ücretsiz katman sınırlı |
| **Vercel** | `vercel.json` hazır | SPA için fazla |
| **GitHub Pages** | Ücretsiz | SPA fallback zor, alt yol sorunu |

**Öneri:** Cloudflare Pages veya Netlify. `public/_redirects` T-06'da hazırlandı.

#### Adım B2 — Ortam değişkenlerini kesinleştir

Alan adı belli olunca güncelle:

| Yer | Ne |
|---|---|
| `index.html` | `og:image` → mutlak URL |
| `index.html` | `og:url` ekle |
| `public/robots.txt` | `Sitemap:` mutlak URL |
| `scripts/sitemap.mjs` | `SITE_URL` ortam değişkeni |
| `App.tsx` | canonical zaten `location.origin` kullanıyor ✅ |

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

| Dokunma | Neden |
|---|---|
| Yeni kod özelliği | Bu talimat **yalnızca belge + yayın** |
| Hata düzeltme | Bulunan hatalar PLAN-02'ye not edilir |
| PLAN-02'yi yazmak | Ayrı bir analiz turu gerektirir |
| Ücretli hizmet / alan adı satın alma | Kullanıcı kararı |
| Sosyal medya hesabı, tanıtım | Ürün kararı |

---

## ☑️ Kabul Kriterleri

### Belgeler

- [ ] `README.md` dolu; ekran görüntüsü, hızlı başlangıç, belge bağlantıları var
- [ ] `BAGLAM.md` güncel — dosya haritası gerçek yapıyla birebir
- [ ] `MIMARI.md` güncel — Yönlendirme ve Test Stratejisi bölümleri eklendi
- [ ] `KULLANIM-KILAVUZU.md` güncel — Sorun Giderme'de çözülen "bilinen sorun" satırı **kalmadı**
- [ ] `ANALIZ-RAPORU.md` — her bulgu ✅ / ⏭️ işaretli, özet tablo var
- [ ] `LICENSE` var
- [ ] `CHANGELOG.md` var, `0.2.0` girdisi dolu
- [ ] `package.json` sürümü `0.2.0`

### Yayın

- [ ] Uygulama gerçek bir adreste çalışıyor
- [ ] Gün adresleri doğrudan açılıyor (SPA fallback)
- [ ] Sosyal medya önizlemesi çıkıyor
- [ ] PWA kurulabiliyor
- [ ] `sitemap.xml` yayında, 366 adres
- [ ] Search Console'a gönderildi
- [ ] Lighthouse (gerçek adres): Perf ≥ 90, Erişilebilirlik ≥ 95, SEO ≥ 95

### Plan kapanışı

- [ ] `Talimatlar/` kökünde `T-*.md` **kalmadı**
- [ ] `Talimatlar/Tamamlandı/` içinde **14** talimat var
- [ ] `PLAN-01` ilerleme tablosu 14/14, Kapanış Özeti dolu
- [ ] `PLAN-01` → `Talimatlar/Plan/` klasörüne taşındı
- [ ] `v0.2.0` etiketi atıldı

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

- **Tamamlanma tarihi:**
- **Yayın adresi:**
- **Barındırma:**
- **Lighthouse (gerçek adres):** Perf __ · Erişilebilirlik __ · SEO __ · En iyi uygulamalar __
- **Sürüm etiketi:**
- **PLAN-02'ye devredilen konular:**
- **Sapmalar / notlar:**
