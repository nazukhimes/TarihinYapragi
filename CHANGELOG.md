# Değişiklik Günlüğü

Bu dosya, sürümler arasında kullanıcıya ve geliştiriciye yansıyan değişiklikleri
kaydeder. Ayrıntılı gerekçeler için ilgili talimatın Tamamlanma Kaydı'na bakın:
[`Talimatlar/Tamamlandı/`](Talimatlar/Tamamland%C4%B1/).

Biçim [Keep a Changelog](https://keepachangelog.com/tr/1.1.0/) yaklaşımını izler.

---

## [Yayımlanmamış]

### Eklenen

- **"Yapay zekâya sor"** — bir olayın, dosyanın ya da kişinin detay panelinde
  artık serbest soru kutusu var: model, panelin gösterdiği Vikipedi metnini
  açıklıyor ya da o metin hakkındaki sorunuzu yanıtlıyor. Sayfadan ayrılmadan
  "bu tam olarak ne demek?" diye sorulabiliyor. İstek **yalnızca düğmeye
  basılınca** gider; sayfa yüklenirken hiçbir çağrı yapılmaz (T-20)
- **Yapay zekâ ayarları** — üst bardaki kıvılcım düğmesinden kendi Gemini
  anahtarınızı giriyorsunuz. Anahtar **yalnızca sizin tarayıcınızda** duruyor;
  sunucumuz yok, hiçbir yere gönderilmiyor ve aynı ekrandan silinebiliyor.
  Anahtar yoksa panel sizi ayarlara yönlendiriyor, çökmüyor (T-20)
- **"YZ ÜRETİMİ" rozeti** — modelin ürettiği metin leylak bir rozet ve kalıcı
  bir uyarı satırıyla çıkıyor: kaynağın Vikipedi özeti olduğu ve yayında
  kullanmadan önce doğrulanması gerektiği yazıyor. Editör (altın) ve Otomatik
  (nötr) rozetlerinden bilerek farklı renkte — üretilmiş metin, derlenmiş metin
  gibi görünmüyor (T-20)
- **Tek bir detay paneli** — Zaman Tüneli'nin "Detayı aç"ı, Karanlık Dosyalar'ın
  "Dosyayı aç"ı ve kişi kartı modalı bugüne kadar aynı işi üç ayrı biçimde
  yapıyordu. Üçü de artık aynı paneli açıyor: kaynak rozeti, görsel, özet metni,
  kaynak çipleri ve "Vikipedi'de ara" çıkışı her yerde aynı. Dosya panelinde ve
  kişi modalında bunların çoğu hiç yoktu (T-19)
- **Panel görseli** — özeti veren Vikipedi maddesinin küçük görseli metnin yanında
  çıkıyor. Görseli olmayan kayıtlarda boş kutu bırakılmıyor (T-19)
- **Özetin künyesi** — panel metninin altında `Özet · İngiltere` gibi bir satır
  var ve maddeye bağlanıyor. Besleme, olay metninde geçen ilk varlığın özetini
  veriyor; bu satır olmadan 1814 kaydının paneli "Washington Yangını" çipinin
  yanında İngiltere'nin coğrafyasını anlatıyor gibi görünüyordu (T-19)
- **"Daha fazlasını oku"** — olayın kendi Vikipedi maddesi bulunabilmişse, o
  maddenin özeti **düğmeye basılınca** getiriliyor. 24 Ağustos 1814'te bu,
  "Washington Yangını" maddesinin olayı anlatan özetidir. Sayfa yüklenirken
  hiçbir istek çıkmaz; aynı özet ikinci kez istendiğinde ağa gidilmez (T-19)
- **Karanlık Dosyalar ve kişi kartlarında "Vikipedi'de ara"** — araştırma çıkışı
  artık yalnızca Zaman Tüneli'nde değil (T-19)
- **Otomatik kayıtlarda kaynak rozeti** — Vikipedi taramasından gelen olaylar ve
  kişi kartları detayları açıldığında "Otomatik" rozeti taşıyor; editör kayıtları
  zaten "Editör notu" çipiyle ayrılıyordu (T-19)
- **Olayın tüm ilgili sayfaları çip olarak** — Zaman Tüneli'nde bir olayın detayı
  açıldığında Vikipedi'nin o olay için verdiği sayfaların **hepsi** açıklamalarıyla
  listeleniyor. Eskiden yalnızca ilki gösteriliyordu ve bu genellikle olayın
  kendisi değil, içinde geçen ilk ülke ya da şehirdi: 24 Ağustos 1814 kaydı
  ("İngiliz Birlikleri, Washington'u işgal etti…") "İngiltere" maddesine
  gidiyordu. Artık Beyaz Saray ve Washington, DC de listede — hangisinin açılacağına
  kullanıcı karar veriyor (T-18)
- **"Vikipedi'de ara" çıkışı** — her olayda, olay metniyle Vikipedi'nin gerçek
  arama sayfasını açan bir düğme var. Hiçbir sayfanın olayın kendisi olmadığı
  kayıtlarda (1958 Bursa Kapalı Çarşı yangını → yalnızca "Bursa" sayfası) tek
  dürüst çıkış budur. Editör kayıtlarında da çıkar (T-18)
- **"Bu olay hakkında" çipi** — İngilizce besleme aynı gün için daha zengin ve olay
  makalelerine doğrudan bağlanıyor. O makalenin Türkçe karşılığı `langlinks` ile
  çözülüp çiplerin başına alınıyor: `Burning of Washington` → **Washington
  Yangını**. Emin olunamayan hiçbir durumda çip basılmıyor — 6 günlük ölçümde
  233 olayın 18'inde (%7,7) çalıştı, kalanında sessiz kaldı (T-18)
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

### Düzeltilen

- **"Model bulunamadı" hatası kaynak kodu düzenlemeden geçmiyordu** — model adı
  `gemini.ts` içinde tek bir sabitti; Google'ın ücretsiz katmanında bir model
  emekliye ayrıldığında ya da yeniden adlandırıldığında uygulama `404` alıp
  kilitleniyor, onarımı kaynak kodu düzenlemeyi gerektiriyordu. Artık sıralı
  bir aday zinciri var: `404`'te kullanıcı hiçbir şey görmeden sıradaki model
  denenir, çalışan model tarayıcıya kaydedilip bir sonraki soruda doğrudan
  kullanılır — sabitlenen model de emekliye ayrılırsa zincir yeniden devreye
  girer. Ayarlar ekranı artık kullanılan modeli gösteriyor, anahtarın gördüğü
  modelleri listeleyip elle seçtiriyor ve anahtar/kota/model/ağ durumlarını
  ayrı ayrı raporlayan bir "Bağlantıyı sına" düğmesi taşıyor (T-24)
- **Geçerli anahtarla "Bağlantı kurulamadı." hatası** — anahtarı Google AI
  Studio'dan kopyalarken araya karışan görünmez karakterler (sıfır genişlikli
  boşluk, bayt sırası imi, yumuşak tire, satır sonu) anahtarla birlikte
  kaydediliyordu. `trim()` bunları temizlemiyor — Unicode'da "boşluk" değil
  "biçim" karakteri sayılıyorlar ve zaten dizgenin ortasındakini hiçbir `trim`
  almıyor. Sonuç: anahtar kayıtlı görünüyor, "Sor" düğmesi açılıyor, ama
  tarayıcı böyle bir değeri HTTP başlığına koyamadığı için istek **ağa hiç
  çıkmadan** düşüyor ve ekranda ağ hatası beliriyordu. Artık anahtar hem
  kaydedilirken hem okunurken her yerinden temizleniyor; daha önce kirli
  kaydedilmiş anahtarlar da yeniden yapıştırılmadan düzeliyor
- **Yanıtın düşünme bütçesine kurban gitmesi** — çıktı sınırı 900 jetondu;
  `gemini-2.5-flash` düşünen bir model olduğu ve düşünme jetonları da aynı
  bütçeden yendiği için model bütçeyi düşünmeye harcayıp metinsiz kapanabiliyordu.
  Sınır 2048'e çıkarıldı ve bu durum artık "yanıt üretmedi" yerine "yanıt
  kesildi, tekrar deneyin" diyor
- **Yanıltıcı hata mesajları** — 404 (model emekliye ayrılmış) "Bağlantı
  kurulamadı." diyordu; oysa bağlantı kurulmuştu, bulunamayan şey modeldi.
  Artık ayrı bir mesajı var. Beklenmeyen hataların ham hâli de yutulmak yerine
  konsola yazılıyor: reklam engelleyicinin kestiği istek, güvenlik duvarı ve
  gerçek çevrimdışılık ekranda aynı görünse de konsolda ayrışıyor
- **Yıl maddeleri artık kaynak listesine karışmıyor** — besleme, olay metnindeki
  yıl sayısı için de bir madde döndürüyor (`1985 · "yıl"`). Tek sayfa gösterilirken
  görünmüyorlardı; tüm sayfalar listelenince doğrudan çöp bağlantıya dönüşeceklerdi.
  Başlığı salt yıl **ve** açıklaması yıl maddesi kalıbında olan sayfalar eleniyor
  (T-18)
- **Bir olayda saklanan sayfa sayısı 3'ten 5'e çıktı** — sınır artık kullanıcının
  gördüğü seçenek sayısı olduğu için yeniden değerlendirildi. 233 olayluk canlı
  örnekte 3 sınırı olayların %15'ini kırpıyordu, 5 sınırı %4,3'ünü (T-18)
- **Satır sonları depo genelinde LF'e sabitlendi** — `npm run format:check`, hiç
  dokunulmamış dosyalar dahil tüm kaynak dosyalarında düşüyordu. Depodaki içerik
  zaten LF'ti; Windows'taki `core.autocrlf=true` ayarı checkout sırasında CRLF'e
  çeviriyordu. `.gitattributes` (`* text=auto eol=lf`) bunu makineden bağımsız
  olarak sabitliyor. `*.bat` CRLF kalır
- **Yeşil kapı biçim denetimini de içeriyor** — `npm run kontrol` artık
  `format:check` ile başlıyor; aynı adım CI iş akışına da eklendi (iş akışı
  `kontrol`u çağırmıyor, adımları tek tek çalıştırıyor). Satır sonu gürültüsü
  temizlenince ortaya çıkan 5 dosyadaki biçim borcu kapatıldı
- **ESLint derleme ve önbellek dizinlerini artık taramıyor** — `.vite`, `build`,
  `dev-dist` ve `.claude` yok sayılanlara eklendi. `npm run dev` çalıştırılmış bir
  kopyada `eslint .`, `.vite/deps` altındaki paketlenmiş React kaynağı yüzünden
  yüzlerce hata veriyordu
- **Biçim denetimi tüm ağacı kapsıyor** — `format` ve `format:check` artık glob
  listesi yerine `prettier .` çalıştırıyor; istisnalar `.prettierignore`'da. Daha
  önce `index.html`, `vite.config.ts`, `scripts/*.mjs` ve `Dokumanlar/`,
  `Talimatlar/` altındaki 32 belge hiç denetlenmiyordu. İki betiğin globlarının
  birbirinden ayrışması da artık yapısal olarak mümkün değil
- **Vitest yalnızca `src/` altını tarıyor** — `.claude/worktrees/` altında bir
  çalışma kopyası varken testler iki kez toplanıyordu (9 yerine 18 dosya)

### Not

**Yapay zekâ katmanı `ICERIK-SABLONU.md` §0 yasağını kaldırmaz.** Depoya hiçbir
yapay zekâ metni yazılmaz; `src/data/gunler/*` dosyaları elle derlenmeye devam
eder. Üretim geçicidir, isteğe bağlıdır, kullanıcının kendi anahtarıyla ve kendi
tıklamasıyla olur ve ekranda kaynağıyla birlikte, "YZ ÜRETİMİ" rozetiyle durur.
Model kendi hafızasından değil, önüne konan Vikipedi metninden konuşur; metin
yoksa bölüm hiç görünmez.

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
