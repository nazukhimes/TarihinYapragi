# T-01 · Proje Kimliği ve Bağımlılık Temizliği

| Alan             | Değer                       |
| ---------------- | --------------------------- |
| **Faz**          | FAZ 0 — Temizlik ve Zemin   |
| **Öncelik**      | 🔴 Kritik                   |
| **Tahmini süre** | ~2 saat                     |
| **Bağımlılık**   | Yok — **bu ilk talimattır** |
| **İlgili bulgu** | O-1, O-2, O-3, K-4, m-2     |
| **Durum**        | ✅ Tamamlandı — 2026-08-21  |

---

## 🎯 Amaç

Projeyi iskelet şablonundan devraldığı kimliksiz durumdan çıkarmak: gerçek bir ad,
sürüm ve betik seti vermek; hiç kullanılmayan 10 bağımlılığı kaldırmak; Vite
yapılandırmasını TypeScript'e taşıyıp HMR'ı bozan sabit port ayarını düzeltmek.

Bu talimat bittiğinde `npm install` belirgin biçimde hızlanacak, HMR her portta
çalışacak ve sonraki tüm talimatlar temiz bir zeminden başlayacak.

---

## 📍 Mevcut Durum

### 1. `package.json` iskelet şablonundan kalma

```json
{
  "name": "sandbox-workspace",     ← proje adı değil
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "typecheck": "tsc --noEmit"    ← preview / lint / format / test yok
  },
```

`version`, `description`, `license`, `repository`, `engines` alanları hiç yok.

### 2. Hiç kullanılmayan 10 bağımlılık

`grep -rl` ile `src/` altında **hepsi 0 eşleşme** verdi:

```
@dnd-kit/core        @dnd-kit/sortable    @dnd-kit/utilities
@supabase/supabase-js    canvas-confetti      date-fns
framer-motion        lucide-react         recharts
uuid
```

Ayrıca bunların tip paketleri: `@types/canvas-confetti`, `@types/uuid`.

> ⚠️ **`react-router-dom` LİSTEDE DEĞİL — SİLMEYİN.** T-06 talimatında
> yönlendirme için kullanılacak.

### 3. `vite.config.js` — HMR sabit porta bağlı (K-4)

```js
server: {
  host: "0.0.0.0",
  port: 3000,
  strictPort: true,      // ← 3000 meşguls Vite hiç başlamıyor
  hmr: { port: 3000 },   // ← sunucu başka porttaysa WebSocket kopuyor
}
```

**Canlı kanıt** (sunucu 5177'de çalışırken tarayıcı konsolu):

```
WebSocket connection to 'ws://localhost:3000/?token=...' failed
[vite] failed to connect to websocket
```

### 4. `.gitignore` yanlış çatıya ait

```
node_modules/
.next/          ← Next.js şablonundan kalma, bu proje Vite
dist/
build/
*.log
```

---

## ✅ Yapılacaklar

### Adım 1 — Kullanılmayan bağımlılıkları kaldır

```bash
npm uninstall @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @supabase/supabase-js canvas-confetti date-fns framer-motion lucide-react recharts uuid @types/canvas-confetti @types/uuid
```

Sonra doğrula — çıktı **boş** olmalı:

```bash
grep -rE "dnd-kit|supabase|canvas-confetti|date-fns|framer-motion|lucide-react|recharts|from \"uuid\"" src/
```

### Adım 2 — `package.json` kimliğini doldur

```json
{
  "name": "tarih-yapragi",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Seçtiğin gün için tarihteki olaylar, doğanlar, kaybettiklerimiz, karanlık dosyalar ve bilim dönüm noktaları — yayıncılar için hazır sohbet kartlarıyla.",
  "license": "MIT",
  "engines": { "node": ">=18" },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  }
}
```

> `lint`, `format`, `test` betikleri **T-12'de** eklenecek — şimdi ekleme.
> `repository` alanını GitHub adresini biliyorsan doldur, bilmiyorsan atla.

### Adım 3 — `vite.config.js` → `vite.config.ts`

Dosyayı yeniden adlandır ve içeriği şununla değiştir:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // ağdaki diğer cihazlardan erişim
    port: 3000, // tercih edilen port
    strictPort: false, // meşgulse bir sonrakine geç
  },
});
```

**Kritik değişiklikler:**

| Değişiklik                           | Neden                                                      |
| ------------------------------------ | ---------------------------------------------------------- |
| `hmr: { port: 3000 }` **kaldırıldı** | Vite otomatik olarak sunucu portunu kullanır — K-4 çözülür |
| `strictPort: false`                  | 3000 meşgulse 3001'e geçer, hata verip çıkmaz              |
| `host: "0.0.0.0"` → `host: true`     | Aynı davranış, Vite'ın önerdiği yazım                      |

Eski `vite.config.js` dosyasını **sil**.

### Adım 4 — `.gitignore` düzelt

```gitignore
# bağımlılıklar
node_modules/

# derleme çıktıları
dist/
build/

# Vite
.vite/
*.local

# günlükler
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# editör / işletim sistemi
.vscode/*
!.vscode/extensions.json
.idea/
.DS_Store
Thumbs.db

# ortam değişkenleri
.env
.env.*
!.env.example
```

`.next/` satırını kaldır.

### Adım 5 — Temiz kurulum ve doğrulama

```bash
rm -rf node_modules package-lock.json && npm install
```

---

## 🚫 Kapsam Dışı

| Dokunma                              | Neden / Hangi talimat            |
| ------------------------------------ | -------------------------------- |
| `react-router-dom` paketi            | T-06'da kullanılacak — **silme** |
| `lint` / `format` / `test` betikleri | T-12                             |
| `src/` altındaki hiçbir dosya        | Bu talimat yalnızca yapılandırma |
| `başlat.bat`                         | T-02                             |
| `index.html` içeriği                 | T-08                             |
| `README.md`                          | T-14                             |
| Yeni bağımlılık **ekleme**           | Her talimat kendi paketini ekler |

---

## ☑️ Kabul Kriterleri

- [x] `package.json` içinde `"name": "tarih-yapragi"` ve `version`, `description`, `license`, `engines` dolu — ayrıca `repository` de dolduruldu
- [x] `preview` betiği eklendi, `npm run preview` çalışıyor — `http://localhost:4173` üzerinde üretim derlemesi servis edildi ve doğrulandı
- [x] 12 paket (`@dnd-kit/*` ×3, supabase, confetti ×2, date-fns, framer-motion, lucide-react, recharts, uuid ×2) `package.json`'dan kalktı — `npm uninstall` bağımlılıklarıyla birlikte 60 paket sildi
- [x] `react-router-dom` **hâlâ duruyor**
- [x] `vite.config.ts` var, `vite.config.js` **yok**
- [x] `vite.config.ts` içinde `hmr` bloğu **yok**, `strictPort: false`
- [x] `.gitignore` içinde `.next/` **yok**, `.vite/` ve `.env` **var**
- [x] `npm run typecheck` hatasız
- [x] `npm run build` hatasız
- [x] Üretim paketi boyutu **artmadı** — JS 253.623 B → **253.623 B** (bayt bayt aynı), CSS 50.776 B → **50.776 B**. Kontrollü deneyde derleme, temizlik öncesiyle **aynı dosya adlarını** (`index-B-Hpy04e.js` / `index-BaNBOqcK.css`) üretti. Ayrıntı için aşağıdaki _Sapmalar_ maddesine bakın.

---

## 🧪 Doğrulama

### 1. Bağımlılık sayımı

```bash
node -e "const p=require('./package.json');console.log('deps:',Object.keys(p.dependencies).length,'| dev:',Object.keys(p.devDependencies).length)"
```

Beklenen: `deps: 3` (react, react-dom, react-router-dom) · `dev: 7`

### 2. Kullanılmayan import kalmadı

```bash
grep -rnE "dnd-kit|supabase|canvas-confetti|date-fns|framer-motion|lucide-react|recharts" src/ index.html
```

Beklenen: **boş çıktı**

### 3. HMR düzeldi mi — K-4 doğrulaması

```bash
npm run dev -- --port 5199
```

1. Tarayıcıda `http://localhost:5199` aç, geliştirici konsolunu aç.
2. Konsolda `WebSocket connection to 'ws://localhost:3000'` hatası **olmamalı**.
3. `src/App.tsx` içindeki bir metni değiştir, kaydet.
4. Sayfa **elle yenilemeden** güncellenmeli.

### 4. strictPort düzeldi mi

3000 portunda başka bir şey çalışırken:

```bash
npm run dev
```

Vite hata vermeden 3001'e (veya boş ilk porta) geçmeli.

### 5. Derleme karşılaştırması

```bash
npm run build
```

Çıktıdaki `dist/assets/index-*.js` boyutu 253 kB civarında kalmalı — artmışsa yanlış bir şey silinmiştir.

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-08-21

- **Değişen dosyalar:**

  | Dosya               | İşlem                                                                         |
  | ------------------- | ----------------------------------------------------------------------------- |
  | `package.json`      | Kimlik alanları dolduruldu, `preview` betiği eklendi, 12 bağımlılık çıkarıldı |
  | `package-lock.json` | Sıfırdan yeniden üretildi (temiz kurulum)                                     |
  | `vite.config.js`    | **Silindi**                                                                   |
  | `vite.config.ts`    | **Yeni** — `hmr` bloğu yok, `strictPort: false`, `host: true`                 |
  | `.gitignore`        | Yeniden yazıldı; `.next/` çıktı, Vite/editör/ortam blokları girdi             |

  `src/` altındaki hiçbir dosyaya dokunulmadı — HMR testi için `App.tsx`'e atılan geçici
  satır geri alındı ve dosya `git show HEAD:src/App.tsx` ile **bayt bayt** karşılaştırılarak
  özdeş olduğu doğrulandı.

- **Kaldırılan paket sayısı:** doğrudan 12 giriş (`package.json`), bağımlılıklarıyla
  birlikte **60 paket**. `dependencies` 13 → 3, `devDependencies` 9 → 7.

- **`node_modules` boyut farkı:** 130,7 MB / 15.304 dosya → **83,6 MB / 2.728 dosya**
  (−47,1 MB · **−%36 boyut**, −12.576 dosya · **−%82 dosya sayısı**).

- **Sapmalar / notlar:**

  1. **`repository` alanı dolduruldu.** Talimat "biliyorsan doldur" diyordu;
     `git remote` üzerinden GitHub adresi teyit edilip yazıldı.
  2. **Üretim CSS'i ilk bakışta 50,78 → 52,50 kB büyümüş göründü.** Kontrollü deneyle
     nedeni bulundu: Tailwind v4'ün otomatik kaynak keşfi, `.gitignore`'da olmayan
     `Dokumanlar/` ve `Talimatlar/` klasörlerindeki Markdown belgelerini de tarıyor.
     Bu iki klasör geçici olarak dışarı alınıp derleme tekrarlandığında çıktı, temizlik
     öncesiyle **aynı dosya adlarını** üretti (`index-B-Hpy04e.js` / `index-BaNBOqcK.css`)
     — yani T-01'in paket boyutuna etkisi **tam olarak sıfır**. Artış, T-01'den önce
     eklenen belge klasörlerinden geliyor. Düzeltmesi `src/index.css` gerektirdiği için
     kapsam dışı bırakıldı ve **T-13 · Adım 10** olarak yazıldı.
  3. **`npm audit`** temiz kurulum sonrası 2 orta seviye uyarı bildiriyor. `audit fix --force`
     kırıcı sürüm yükseltmesi istediği için dokunulmadı — bu bir bağımlılık _bakımı_ konusu,
     T-01'in kapsamı olan _temizlik_ değil.
  4. **Doğrulama için `.claude/launch.json`'a** geçici sunucu tanımları eklendi
     (HMR-5199, port çakışması, preview); iş bitince dosya orijinal hâline geri yüklendi.

- **Doğrulama kanıtları:**

  | Test                          | Sonuç                                                                                                                                                                                                          |
  | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Bağımlılık sayımı             | `deps: 3 · dev: 7` — beklenenle birebir                                                                                                                                                                        |
  | Kullanılmayan import taraması | `grep` çıktısı boş (`src/` + `index.html`)                                                                                                                                                                     |
  | K-4 · HMR                     | Sunucu 5199'da: konsolda `[vite] connected.`, `ws://localhost:3000` hatası **yok**. `/@vite/client` içinde `hmrPort = null`, soket sayfanın kendi portunu kullanıyor (tek "3000" geçişi `hmrTimeout = 30000`). |
  | K-4 · canlı HMR               | `App.tsx` metni değiştirildi → tarayıcı **elle yenilenmeden** güncellendi; sayfada önceden tanımlanan `window` değişkeni hayatta kaldı, yani tam sayfa yenilemesi olmadı.                                      |
  | `strictPort: false`           | 3000 doluyken `Port 3000 is in use, trying another one...` → 3001'de açıldı, hata vermedi. Bu, K-4'ün **orijinal arıza senaryosu**; o portta da WebSocket hatası çıkmadı.                                      |
  | `host: true`                  | Vite 3 ağ adresi yayımladı (192.168.x.x)                                                                                                                                                                       |
  | `npm run preview`             | 4173'te üretim derlemesi servis edildi, sayfa doğru açıldı                                                                                                                                                     |
  | Görsel tur (3 gün)            | **29 Ekim** (özel dosya · 32 kayıt, kategori dağılımı doğru), **7 Mart** (sıradan gün), **29 Şubat** (kenar durum) — üçünde de 6 bölüm eksiksiz, konsolda hata yok                                             |

- **Sonraki talimata not:**

  - **T-02 →** `vite.config.ts` artık boş portu kendi buluyor (`strictPort: false`,
    canlı olarak doğrulandı). `başlat.bat` içindeki PowerShell port arama bloğu artık
    tamamen gereksiz — güvenle kaldırılabilir. `preview` betiği hazır, menünün 2. seçeneği doğrudan `npm run preview` çağırabilir.
  - **T-03 →** Doğrulama sırasında görüldü: Şubat takvimi **2026'da (artık yıl değil)
    29 gün** gösteriyor ve 29 Şubat "Yılın 60. günü / PAZAR" olarak açılıyor. Bu K-1'in
    canlı görünümü — düzeltirken 366 günlük arşiv mantığının bilinçli mi yoksa hata mı
    olduğuna karar verilmeli.
  - **T-06 →** `react-router-dom@^6.8.0` kurulu ve dokunulmadı, kullanıma hazır.
  - **T-12 →** `lint` / `format` / `test` betikleri bilerek eklenmedi; `package.json`
    `scripts` bloğu bunları eklemek için temiz.
  - **T-13 →** Tailwind kaynak taraması bulgusu **Adım 10** olarak talimata işlendi;
    boyut ölçümlerinden **önce** yapılmalı, yoksa ölçümler yanıltıcı olur.
