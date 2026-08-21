# BAĞLAM DOSYASI — Tarih Yaprağı

> Bu dosya projeye yeni katılan bir geliştiricinin (veya bir yapay zekâ asistanının)
> **ilk okuyacağı** dosyadır. Kodu okumadan önce projenin ne olduğunu, nasıl çalıştığını
> ve hangi kurallara uyulduğunu buradan öğren.
>
> **Son güncelleme:** 2026-08-21 · **Sürüm:** 0.1.0 (geliştirme aşaması)

---

## 1. Proje Nedir?

**Tarih Yaprağı**, klasik duvar takvimi yapraklarından ilham alan bir "bugün tarihte ne oldu?"
web uygulamasıdır. Kullanıcı yılın herhangi bir gününü seçer; uygulama o güne düşen
tarihî olayları, doğanları, kaybettiklerimizi, karanlık dosyaları ve bilim dönüm
noktalarını tek sayfada sunar.

**Ayırt edici özellik:** İçerik yalnızca "listelenmez"; **yayıncılar için hazır konuşma
malzemesine** dönüştürülür. *Sohbet Kartları* ve *Yayın Modu* (teleprompter) bölümleri
bu amaca hizmet eder.

### Hedef kitle

| Kitle | Beklentisi |
|---|---|
| Genel ziyaretçi | Günün ilginç tarihini hızlıca okumak |
| İçerik üreticisi / YouTuber / podcast'çi | Yayında okunacak, kanca cümleli hazır kart |
| Öğrenci / meraklı | Kaynağa (Vikipedi) hızlı sıçrama |

### Ürün ilkeleri

1. **Gün merkezli.** Her şey seçili günün etrafında döner; global arama ikincildir.
2. **Kâğıt hissi.** Takvim yaprağı, yırtık kenar, daktilo tipografisi — dijital ama nostaljik.
3. **Kaynağı gizleme.** Otomatik derlenen içerik ile editör derlemesi görsel olarak ayrılır
   ("Editör notu" rozeti). Kullanıcı neyin nereden geldiğini bilir.
4. **Boş gün yoktur.** Editör içeriği olmasa bile Vikipedi arşivi devreye girer.

---

## 2. Teknoloji Yığını

| Katman | Seçim | Not |
|---|---|---|
| Çatı | React 18 + TypeScript 5.7 (`strict: true`) | Sınıf bileşeni yok, hepsi fonksiyon + hook |
| Derleyici | Vite 6 | `npm run dev` / `build` / `preview` / `typecheck` · yapılandırma `vite.config.ts` |
| Stil | Tailwind CSS **v4** (`@tailwindcss/vite`) | Config dosyası **yok**; tema `src/index.css` içindeki `@theme` bloğunda |
| Yönlendirme | *(yok)* | `react-router-dom` kurulu ama henüz kullanılmıyor; T-01'in bağımlılık temizliğinde **bilerek korundu** — bkz. T-06 |
| Durum yönetimi | React `useState` / `useMemo` | Redux/Zustand yok, gerek de yok |
| Veri | Wikimedia REST "On this day" API | Sunucu/backend **yok**, tamamen istemci taraflı |
| Kalıcılık | `localStorage` (çevrimdışı yedek) + bellek içi `Map` | Veritabanı yok |

> **Önemli:** Bu proje **backend'siz, statik bir SPA**'dır. Derleme çıktısı (`dist/`)
> herhangi bir statik sunucuya konulabilir. Gizli anahtar gerektiren bir `.env` yoktur;
> `.env` yalnızca isteğe bağlı olarak Wikimedia API tabanını değiştirmek için var
> (`VITE_WIKI_API_BASE` → `src/lib/config.ts`, örnek: `.env.example`).

### Tailwind v4 uyarısı

`tailwind.config.js` **aramayın, yok.** Renkler ve fontlar `src/index.css` içindeki
`@theme { ... }` bloğunda CSS değişkeni olarak tanımlıdır. Yeni bir renk eklemek =
oraya `--color-xxx` eklemek. `w-4.5`, `pl-13`, `scale-108` gibi "standart dışı görünen"
sınıflar Tailwind v4'ün dinamik ölçek motoru sayesinde geçerlidir; **silmeyin.**

---

## 3. Veri Kaynağı ve Akışı

```
Kullanıcı bir gün seçer  (day, month)
          │
          ▼
   useDayData(month, day)            ← src/lib/wiki.ts
          │
          ├─ TR Vikipedi  ──┐
          │                 ├─ Promise.all → normalize → DayData
          └─ EN Vikipedi  ──┘        (TR boşsa EN'e düşer)
          │
          │  ağ hatası → localStorage yedeği → o da yoksa offline:true
          ▼
   App.tsx  useMemo katmanı
          │
          ├─ mergedEvents  = CURATED.events  +  API events   (mükerrer ayıklanır)
          ├─ births/deaths = API → PersonCard
          ├─ allCases      = CURATED.cases   +  detectDarkItem() taraması
          ├─ allScience    = CURATED.science +  classifyItem() === bilim|kesif
          └─ talkCards     = CURATED.talk    +  buildAutoTalk()
          ▼
      Bölüm bileşenleri (sections.tsx / talk.tsx / leaf.tsx)
```

**API adresi:** `https://api.wikimedia.org/feed/v1/wikipedia/{tr|en}/onthisday/all/{MM}/{DD}`
Kimlik doğrulama gerektirmez, ücretsizdir, ancak **hız sınırı** vardır. Taban adres
`src/lib/config.ts` içindeki `WIKI_API_BASE`'den gelir; `VITE_WIKI_API_BASE` ortam
değişkeniyle geçersiz kılınabilir (bkz. `.env.example`). Koda gömülü URL **yok**.

### İki içerik türü — asla karıştırma

| Tür | Kaynak | Rozet | Dosya |
|---|---|---|---|
| **Editör içeriği** | Elle yazılır, güvenilir | `Editör notu` / `Editör` | `src/data/curated.ts` |
| **Otomatik içerik** | Vikipedi + regex sınıflandırma | rozet yok | `src/lib/wiki.ts` |

Otomatik sınıflandırma anahtar kelime tabanlıdır ve **yanılabilir**. Bu yüzden
alt bilgide bir uyarı notu vardır ve her karta Vikipedi bağlantısı konur.

---

## 4. Dosya Haritası

```
TarihinYapragi/
├── başlat.bat              ← Windows tek tıkla başlatıcı (menülü, BOM'suz + CRLF)
├── baslat.sh               ← macOS/Linux başlatıcı (chmod +x)
├── .editorconfig           ← satır sonu / girinti sözleşmesi (*.bat hariç LF)
├── .nvmrc                  ← Node sürümü (20)
├── .env.example            ← VITE_WIKI_API_BASE örneği (gerçek .env git'e girmez)
├── .vscode/
│   ├── extensions.json     ← önerilen eklentiler (Tailwind, ESLint, Prettier, EditorConfig)
│   └── settings.json       ← format-on-save, tabSize 2, Tailwind sınıf regex'i
├── index.html              ← Giriş noktası, meta etiketler, Google Fonts
├── vite.config.ts          ← Sunucu portu + eklentiler (strictPort: false, HMR portu otomatik)
├── tsconfig.json           ← strict TypeScript
├── package.json
│
├── src/
│   ├── main.tsx            ← ReactDOM.createRoot — 6 satır
│   ├── App.tsx             ← TEK sayfa. Tüm veri birleştirme (useMemo) burada. ~660 satır
│   ├── index.css           ← Tailwind v4 @theme + tüm özel animasyon/doku sınıfları
│   ├── vite-env.d.ts       ← `ImportMetaEnv` tipi (VITE_WIKI_API_BASE)
│   │
│   ├── data/
│   │   └── curated.ts      ← Tip tanımları + CURATED sözlüğü (şu an 10 gün)
│   │
│   ├── lib/
│   │   ├── config.ts       ← WIKI_API_BASE (ortam değişkeninden, varsayılanlı)
│   │   ├── date.ts         ← Artık yıl / gün sayısı / haftanın günü — saf fonksiyonlar
│   │   ├── useInView.ts    ← Paylaşılan IntersectionObserver + setTimeout güvenlik ağı (T-04)
│   │   └── wiki.ts         ← API çağrısı, önbellek, sınıflandırma, otomatik kart üretimi
│   │
│   └── components/
│       ├── leaf.tsx        ← Takvim yaprağı, mini takvim, canlı saat, haber bandı
│       ├── sections.tsx    ← Zaman tüneli, kişi kartları, karanlık dosyalar, bilim
│       ├── talk.tsx        ← Sohbet kartları + Yayın Modu (teleprompter)
│       └── ui.tsx          ← Reveal, CountUp, Modal, Toaster, copyText, tüm SVG ikonlar
│
├── Dokumanlar/             ← BU KLASÖR — proje belgeleri
│   ├── BAGLAM.md           ← (bu dosya)
│   ├── MIMARI.md           ← teknik mimari, modül sorumlulukları
│   ├── KULLANIM-KILAVUZU.md← son kullanıcı kılavuzu
│   ├── ANALIZ-RAPORU.md    ← mevcut durum eksik/hata analizi
│   └── CALISMA-SISTEMI.md  ← plan → talimat → tamamlandı iş akışı
│
└── Talimatlar/             ← İŞ AKIŞI klasörü
    ├── PLAN-01-*.md        ← aktif plan
    ├── T-03-*.md ...       ← aktif talimatlar
    ├── Tamamlandı/         ← biten talimatlar buraya taşınır (T-01, T-02)
    └── Plan/               ← tamamen biten planlar buraya taşınır
```

### Nerede ne var? (hızlı referans)

| Ne yapmak istiyorum | Hangi dosya |
|---|---|
| Yeni bir güne özel dosya eklemek | `src/data/curated.ts` → `CURATED["MM-DD"]` |
| Yeni renk / font eklemek | `src/index.css` → `@theme` bloğu |
| Yeni bölüm eklemek | `src/App.tsx` → `NAV` dizisi + `SectionShell` |
| Sınıflandırma kuralı değiştirmek | `src/lib/wiki.ts` → `RULES` / `DARK_THEMES` |
| Yeni ikon eklemek | `src/components/ui.tsx` → `IconXxx` fonksiyonu |
| Yayın modunu değiştirmek | `src/components/talk.tsx` → `BroadcastMode` |
| API tabanını değiştirmek | `.env` içine `VITE_WIKI_API_BASE=...` (örnek: `.env.example`) |

---

## 5. Kod Konvansiyonları

- **Dil:** Arayüz metinleri, yorumlar ve commit mesajları **Türkçe**. Kod tanımlayıcıları
  (değişken/fonksiyon adları) **İngilizce**. Bu bilinçli bir karardır, bozmayın.
- **Küçük harfe çevirme:** Asla `toLowerCase()` kullanma. Her zaman
  `toLocaleLowerCase("tr-TR")` — projede `trLower` yardımcısı olarak tekrarlanır.
  (Sebebi: `I → ı`, `İ → i` dönüşümü.)
- **Yıl biçimi:** Negatif yıllar için `formatYear()` kullan → `MÖ 480`.
- **Bileşen dosyaları:** Tek dosyada birden çok `export function` olabilir; her dosya bir
  *tema* (bölümler, kâğıt/takvim, yayın, temel UI) etrafında toplanır.
- **Animasyon:** CSS sınıfları (`reveal`, `leaf-flip`, `rise-in`, `stamp-in`) `index.css`
  içinde. JS animasyon kütüphanesi kullanılmıyor.
- **Erişilebilirlik:** `prefers-reduced-motion` desteklenir (`index.css` sonu).
- **Renk kullanımı:** Kategoriye göre renk `CATEGORIES[cat].color`'dan gelir; sabit hex
  kodunu bileşene gömmek yerine oradan al.

---

## 6. Komutlar

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run preview
```

```bash
npm run typecheck
```

Windows'ta bunların hepsi `başlat.bat` menüsünden de yapılabilir (çift tık → 1-4 seç).
macOS/Linux'ta aynı menü `./baslat.sh` ile gelir.

> Port 3000 meşgulse Vite hata vermeden bir sonraki boş porta geçer
> (`strictPort: false`) ve HMR o portu izler.

> Node sürümü `.nvmrc` ile sabitlenir (`20`). `nvm use` çalıştırırsan otomatik geçer.
> Editör satır sonu / girinti kuralları `.editorconfig`'te; VS Code kullanıyorsan
> `.vscode/extensions.json` önerilen eklentileri, `.vscode/settings.json` format-on-save'i
> otomatik kurar.

---

## 7. Mevcut Durum — Dürüst Özet

> **Plan ilerlemesi:** PLAN-01 · 4 / 14 talimat tamamlandı (T-01, T-02, T-03, T-04 · 2026-08-21).
> Ayrıntı → [`../Talimatlar/PLAN-01-temel-duzeltme-ve-tamamlama.md`](../Talimatlar/PLAN-01-temel-duzeltme-ve-tamamlama.md)

**Çalışan:** Takvim yaprağı ve gün geçişi, Vikipedi entegrasyonu (TR→EN yedeği),
zaman tüneli + kategori filtresi, kişi kartları + modal, karanlık dosya kartları,
bilim kartları, sohbet kartları + kopyalama, Yayın Modu (klavye destekli),
arama, çevrimdışı yedek, tip kontrolü ve üretim derlemesi. Geliştirme ortamı artık
tek satırlık başlatıcılarla (`başlat.bat` / `baslat.sh`) ve sabit editör ayarlarıyla
(`.editorconfig`, `.nvmrc`, `.vscode/*`) herkes için aynı. İstatistik sayaçları ve
sayfa görünürlüğü artık tek paylaşılan bir `useInView` gözlemcisine ve
`setTimeout` güvenlik ağına dayanıyor (`src/lib/useInView.ts`).

**Eksik / hatalı:** Ayrıntılı liste ve kanıtlar için → [`ANALIZ-RAPORU.md`](ANALIZ-RAPORU.md)
Özet başlıklar:

- ~~Takvimde artık yıl kaynaklı gün-sayısı hatası~~ ✅ **T-03 ile çözüldü**
- ~~Gün değişince sayaçların güncellenmemesi~~ ✅ **T-04 ile çözüldü**
- ~~Sekme arka planda açıldığında sayfanın tamamen boş görünmesi~~ ✅ **T-04 ile çözüldü**
- **Bulgu (T-03 sırasında keşfedildi, hâlâ açık):** "Önceki gün" / "Sonraki gün" /
  "Bugüne dön" düğmeleri, dekoratif bir arka plan katmanının üzerlerini
  kaplaması yüzünden gerçek bir tıklamayla tetiklenemiyor (K-5, henüz bir
  talimata atanmadı — T-04 bilinçli olarak bunun dışında kaldı, kapsamı yalnızca
  K-2/K-3 idi) → ayrıntı [`ANALIZ-RAPORU.md`](ANALIZ-RAPORU.md#6-t-03-sırasında-keşfedilen-yeni-bulgu-2026-08-21)
- ~~HMR WebSocket'inin sabit porta bağlı olması~~ ✅ **T-01 ile çözüldü**
- ~~Kullanılmayan 10 bağımlılık (paket boyutu ve kurulum süresi)~~ ✅ **T-01 ile çözüldü**
- ~~`başlat.bat`'ın PowerShell ile elle port araması~~ ✅ **T-02 ile çözüldü**
- ~~Editör ayarı / `.env` iskeleti / macOS-Linux başlatıcı yokluğu~~ ✅ **T-02 ile çözüldü**
- Paylaşılabilir URL / yönlendirme yok
- Favicon, PWA, SEO meta eksik
- Editör içeriği 366 günün yalnızca 10'unda
- Test, lint, format altyapısı yok

**Çalışma planı:** [`../Talimatlar/`](../Talimatlar/) klasöründe. İş akışı için
→ [`CALISMA-SISTEMI.md`](CALISMA-SISTEMI.md)

---

## 8. Yapay Zekâ Asistanı İçin Notlar

Bu projede çalışırken:

1. **Önce bu dosyayı, sonra `ANALIZ-RAPORU.md`'yi oku.**
2. Görev al: `Talimatlar/` klasöründeki bir `T-xx-*.md` dosyası senin görev tanımındır.
   Talimatın **Kabul Kriterleri** bölümünü karşılamadan bitmiş sayma.
3. Bitirince talimat dosyasını `Talimatlar/Tamamlandı/` klasörüne taşı ve dosyanın
   sonundaki *Tamamlanma Kaydı* bölümünü doldur.
4. Türkçe karakterleri bozma. Dosyaları UTF-8 (BOM'suz) yaz. `.bat` dosyaları CRLF olmalı.
5. `npm run typecheck` ve `npm run build` yeşil kalmadan hiçbir talimatı kapatma.
6. Bir talimat başka bir talimatın işine giriyorsa **girme** — kapsamı koru, notu
   ilgili talimata düş.
