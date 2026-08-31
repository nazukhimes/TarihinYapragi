# Değişiklik Günlüğü

Bu dosya, sürümler arasında kullanıcıya ve geliştiriciye yansıyan değişiklikleri
kaydeder. Ayrıntılı gerekçeler için ilgili talimatın Tamamlanma Kaydı'na bakın:
[`Talimatlar/Tamamlandı/`](Talimatlar/Tamamland%C4%B1/).

Biçim [Keep a Changelog](https://keepachangelog.com/tr/1.1.0/) yaklaşımını izler.

---

## [Yayımlanmamış]

### Eklenen

- **Rekorlar Kasası (7. bölüm)** — dünyanın "en"leri için editör havuzundan
  günlük seçki. Her kayıtta rekorun hikâyesi, rakamı hayal edilebilir kılan bir
  kıyas cümlesi ve yayında okunacak bir açılış cümlesi var. Kapsam çipleriyle
  süzülebiliyor, arama bölüme dahil (T-23)
- **Rekor rotasyonu** — havuzu 365 güne tamamlamak gerekmiyor: tarihi doğrulanmış
  rekorlar kendi gününde "Bugün" rozetiyle çıkıyor, gerisi yıl boyunca dönen
  deterministik bir rotasyondan geliyor. Aynı gün her zaman aynı seçkiyi verir,
  paylaşılan bağlantı yıl değişince başka içerik göstermez (T-23)
- **"Bugün kırılan rekorlar" şeridi** — seçili günde kırılmış, tarihi doğrulanmış
  rekorlar Wikidata'dan (CC0) canlı geliyor. Editör kartlarından ayrı şeritte,
  "Wikidata" rozetiyle. Çoğu gün boş döner; o zaman hiç gösterilmez (T-23)
- **Rekor kartları Sohbet Kartları'na akıyor** — `opener` alanı yazılmış rekorlar
  Yayın Modu'nda (teleprompter) da çıkıyor, ayrı bir ekran gerekmiyor (T-23)
- **`npm run rekor-avi`** — Vikipedi'yi `insource:` aramasıyla tarayıp rekor adayı
  listesi çıkaran editör aracı. Depoya hiçbir şey yazmaz; çıktı
  `Dokumanlar/rekor-adaylari.md` (T-23)

### Not

Guinness World Records'ın halka açık bir API'si yok ve kullanım şartları içeriğinin
kopyalanmasını yasaklıyor. Kasadaki her kayıt elle, kendi cümlelerimizle yazıldı;
`official` alanı yalnızca GWR'ın o unvanı onaylayıp onaylamadığını söyler. Otomatik
katman tamamen CC0 lisanslı Wikidata'ya dayanır (bkz. `Dokumanlar/MIMARI.md` §14.1).

---

## [0.2.0] — 2026-08-24

PLAN-01 (_Temel Düzeltme ve Tamamlama_) tamamlandı — 15 talimat, 5 faz.
Uygulama "çalışan ama yarım" durumdan **bakımı yapılabilir ve içerik olarak dolu**
bir ürüne taşındı.

### Eklenen

- **Paylaşılabilir gün adresleri** — her günün kendi adresi var (`/21-agustos`);
  adres çubuğuna doğrudan yazılabilir, yer imine eklenebilir, tarayıcı geri/ileri
  tuşu çalışır. Sayısal biçim (`/08-21`) kanonik ada yönlendirilir (T-06)
- **Paylaş düğmesi** — mobilde sistemin paylaşım penceresi, masaüstünde panoya
  kopyalama (T-06)
- **Klavye kısayolları** — `←` `→` (gün değiştir), `T` (bugüne dön), `/` (aramaya
  odaklan), `?` (kısayol yardımı), `Esc` (kapat) (T-07)
- **Erişilebilirlik** — "Ana içeriğe atla" bağlantısı, modal odak tuzağı ve odak
  iadesi, `aria-live` bildirimleri, AA kontrast düzeltmeleri (T-07)
- **Site kimliği** — favicon, apple-touch-icon, PWA simgeleri, sosyal medya
  önizleme kartı, JSON-LD, gün bazlı dinamik `<title>`/canonical (T-08)
- **PWA desteği** — service worker; telefona uygulama olarak eklenebilir,
  daha önce açılmış günler çevrimdışı görüntülenir (T-08)
- **366 adresli `sitemap.xml`** — `npm run build` sırasında üretilir (T-08)
- **Hata sınırı ve durum ekranları** — bir bölüm çökse bile sayfanın geri kalanı
  ayakta kalır; hata türüne göre (404 / hız sınırı / sunucu / ağ) ayrı mesaj (T-09)
- **"Bugünün anlamı" şeridi** — daha önce çekilip kullanılmayan `holidays`
  verisi artık gösteriliyor (T-09)
- **Arama sonuç sayacı** — toplam ve bölüm bazlı; sonuç yoksa tek bir boş durum
  ekranı (T-09)
- **Editör içeriği 10 günden 60 güne çıkarıldı**; içerik 12 ay dosyasına bölündü,
  366 güne ölçeklenebilir hâle geldi (T-10)
- **Sınıflandırma ölçüm altyapısı** — 66 örneklik altın küme + `npm run siniflandirma`
  (T-11)
- **Test, lint ve biçimlendirme altyapısı** — Vitest (203 test), ESLint, Prettier,
  tek komutluk `npm run kontrol`, GitHub Actions iş akışı (T-12)
- **Yayın Modu ayrı parçaya alındı** — yalnızca açıldığında indiriliyor (T-13)
- `npm run analyze` — paket içeriği görselleştirmesi (T-13)
- Bu `CHANGELOG.md` ve `LICENSE` (T-14)

### Düzeltilen

- **Takvimdeki "Yılın X. günü" artık yıl hatası** — sabit 2024 referansı kaldırıldı,
  her yıl ve her gün için doğru (K-1 · T-03)
- **Gün değişince güncellenmeyen sayaçlar** (K-2 · T-04)
- **Arka planda açılan sekmede sayfanın tamamen boş kalması** — 181 ayrı
  `IntersectionObserver` yerine tek paylaşılan gözlemci + zaman aşımı güvenlik ağı
  (K-3 · T-04)
- **HMR WebSocket'inin sabit 3000 portuna bağlı olması** (K-4 · T-01)
- **Gün gezinme düğmelerinin (Önceki/Sonraki/Bugüne dön) dekoratif katman yüzünden
  hem görünmemesi hem tıklanamaması** (K-5 · T-15)
- **Ağ katmanı** — hızlı gün değişiminde eski istekler iptal ediliyor, çevrimdışı
  yedek 24 saatlik TTL taşıyor, önbellek sınırlandı, hatalar türüne göre
  sınıflandırılıyor (O-4, O-8 · T-05)
- **Sınıflandırma doğruluğu** — "ilk eşleşen kazanır" yerine puanlama; Türkçe
  harflerin (ç/ğ/ı/ö/ş/ü) JS `\b` sınırında kelime sayılmaması yüzünden hiç
  eşleşmeyen kurallar düzeltildi (U-3 · T-11)
- **Performans** — `App.tsx` 1.079 satırdan 244 satıra indi; font isteği daraltıldı,
  mobilde ağır animasyonlar kapatıldı. Lighthouse (üretim derlemesi):
  Performans 92 · Erişilebilirlik 96 · SEO 100 (T-13)

### Kaldırılan

- Kullanılmayan 10 bağımlılık (`node_modules` −47,1 MB) (T-01)
- `başlat.bat` içindeki elle PowerShell port taraması — Vite portu kendi bulur (T-02)
- Karanlık Dosyalar ve Bilim & Keşif bölümlerindeki sabit kayıt sınırları;
  yerine "N … daha göster" düğmesi (T-09)

### Bilinen sınırlar

- Uygulama **yayına alınmadı** — internette herkese açık bir adreste çalışmıyor.
  Bu bilinçli bir karar (PLAN-01 · T-14 · Bölüm B). Paylaşılabilir adresler, sosyal
  medya önizlemesi ve PWA kurulumu teknik olarak hazır, yalnızca herkese açık bir
  adrese ihtiyaç duyuyorlar.
- Editör içeriği 366 günün 60'ında (%16,4) — mimari geri kalanı için hazır.
- Açık kalan bulgular: O-10, O-11, O-12, O-13, m-7, m-8 →
  [`Dokumanlar/ANALIZ-RAPORU.md`](Dokumanlar/ANALIZ-RAPORU.md)

---

## [0.1.0] — 2026-08-21

İlk çalışan sürüm. PLAN-01 öncesi durum: Wikimedia REST API'sinden günün olayları,
doğanlar, kaybettiklerimiz; 10 gün editör içeriği; takvim yaprağı, mini takvim,
arama ve Yayın Modu.
