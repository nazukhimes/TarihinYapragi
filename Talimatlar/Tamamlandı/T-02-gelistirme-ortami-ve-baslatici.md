# T-02 · Geliştirme Ortamı ve Başlatıcı

| Alan | Değer |
|---|---|
| **Faz** | FAZ 0 — Temizlik ve Zemin |
| **Öncelik** | 🟠 Yüksek |
| **Tahmini süre** | ~1,5 saat |
| **Bağımlılık** | **T-01 tamamlanmış olmalı** (`vite.config.ts` ve betikler) |
| **İlgili bulgu** | — (proje hijyeni) |
| **Durum** | ✅ Tamamlandı — 2026-08-21 |

---

## 🎯 Amaç

Projeye bir kez dokunan herkesin (yeni geliştirici, editör, kendi gelecekteki hâlin)
aynı ortamda, aynı sonuçları alarak çalışmasını sağlamak. Başlatıcıyı T-01 sonrası
duruma göre sadeleştirmek, editör ayarlarını sabitlemek ve `.env` iskeletini kurmak.

---

## 📍 Mevcut Durum

- `başlat.bat` var ve çalışıyor; ancak `strictPort: false` gelmeden önce yazıldığı için
  **PowerShell ile elle boş port arıyor.** T-01 sonrası bu iş Vite'a devredilebilir.
- Editör ayarı yok: `.editorconfig` yok, `.vscode/` yok. Farklı makinelerde farklı
  satır sonu ve girinti üretilmesi kaçınılmaz.
- `.nvmrc` yok — Node sürümü sözleşmesi yalnızca `package.json > engines`'de.
- `.env.example` yok. Şu an gizli anahtar gerekmiyor ama API tabanı (`API` sabiti)
  koda gömülü; ortama göre değiştirilebilir olması gerekiyor.
- macOS/Linux kullanan biri için başlatma betiği yok.

---

## ✅ Yapılacaklar

### Adım 1 — `başlat.bat` sadeleştir

T-01'den sonra Vite boş portu kendi buluyor. PowerShell çağrısı gereksizleşti.

Şu bloğu **kaldır**:

```bat
set "PORT="
for /f "delims=" %%p in ('powershell -NoProfile ... Get-NetTCPConnection ...') do set "PORT=%%p"
if "!PORT!"=="" set "PORT=3000"
```

Yerine doğrudan npm betiklerini çağır:

| Menü | Yeni komut |
|---|---|
| 1 — Geliştirme | `call npm run dev -- --open` |
| 2 — Önizleme | `call npm run build` sonra `call npm run preview -- --open` |
| 3 — Build | `call npm run build` |
| 4 — Tip kontrolü | `call npm run typecheck` |

**Korunacak davranışlar:**

- `chcp 65001` ve `cd /d "%~dp0"` satırları kalsın
- Node.js yoksa anlaşılır hata + `pause`
- `node_modules` yoksa otomatik `npm install`
- Menüde Enter = seçenek 1
- Dosya **UTF-8 BOM'suz + CRLF** kalmalı, içeriği **ASCII** (Türkçe karakter yok —
  eski konsollarda bozuluyor)

### Adım 2 — `baslat.sh` ekle (macOS / Linux)

```sh
#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

command -v node >/dev/null || { echo "HATA: Node.js bulunamadi -> https://nodejs.org"; exit 1; }
[ -d node_modules ] || npm install

echo "1) dev   2) preview   3) build   4) typecheck"
read -rp "Seciminiz [1]: " mod
case "${mod:-1}" in
  2) npm run build && npm run preview -- --open ;;
  3) npm run build ;;
  4) npm run typecheck ;;
  *) npm run dev -- --open ;;
esac
```

Çalıştırma izni:

```bash
chmod +x baslat.sh
```

### Adım 3 — `.editorconfig`

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[*.bat]
end_of_line = crlf
```

> `*.bat` için `crlf` satırı **zorunlu** — LF satır sonlu batch dosyaları
> `goto` ve etiketlerde beklenmedik davranır.

### Adım 4 — `.nvmrc`

```
20
```

### Adım 5 — `.vscode/extensions.json`

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "editorconfig.editorconfig"
  ]
}
```

### Adım 6 — `.vscode/settings.json`

```json
{
  "files.encoding": "utf8",
  "files.eol": "\n",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["className=\"([^\"]*)", "([a-zA-Z0-9\\-:\\[\\]\\.\\/]+)"]
  ]
}
```

### Adım 7 — `.env.example` ve `src/lib/config.ts`

`.env.example`:

```
# Wikimedia REST API tabanı. Boş bırakılırsa varsayılan kullanılır.
VITE_WIKI_API_BASE=https://api.wikimedia.org/feed/v1/wikipedia
```

`src/lib/config.ts` (yeni dosya):

```ts
export const WIKI_API_BASE =
  import.meta.env.VITE_WIKI_API_BASE ?? "https://api.wikimedia.org/feed/v1/wikipedia";
```

`src/lib/wiki.ts` içindeki sabiti bununla değiştir:

```diff
-const API = "https://api.wikimedia.org/feed/v1/wikipedia";
+import { WIKI_API_BASE as API } from "./config";
```

> Bu, T-12'de API'yi sahte (mock) sunucuya yönlendirerek test yazmayı mümkün kılar.

### Adım 8 — `src/vite-env.d.ts`

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WIKI_API_BASE?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 🚫 Kapsam Dışı

| Dokunma | Neden / Hangi talimat |
|---|---|
| ESLint / Prettier yapılandırması | T-12 (`extensions.json`'a yazmak yeterli, kurma) |
| CI / GitHub Actions | T-12 |
| `wiki.ts` içinde API sabitinden başka hiçbir şey | T-05 |
| Dağıtım (deploy) yapılandırması | T-14 |
| Docker | Kapsam dışı |

---

## ☑️ Kabul Kriterleri

- [x] `başlat.bat` PowerShell port taraması olmadan çalışıyor, 4 menü seçeneği de doğru
- [x] `başlat.bat` hâlâ UTF-8 **BOM'suz** ve **CRLF**; içeriğinde Türkçe karakter yok
- [x] `baslat.sh` var ve çalıştırılabilir
- [x] `.editorconfig`, `.nvmrc`, `.vscode/extensions.json`, `.vscode/settings.json` var
- [x] `.env.example` var; `.env` `.gitignore`'da (T-01'den geliyor)
- [x] `src/lib/config.ts` ve `src/vite-env.d.ts` var
- [x] `wiki.ts` API tabanını `config.ts`'ten alıyor, koda gömülü URL kalmadı
- [x] `npm run typecheck` hatasız
- [x] `npm run build` hatasız
- [x] `.env` **olmadan** uygulama varsayılan API ile normal çalışıyor

---

## 🧪 Doğrulama

### 1. BOM ve satır sonu kontrolü

```bash
head -c 3 "başlat.bat" | od -c | head -1
```

Beklenen: `@ e c` — `357 273 277` (BOM) **görülmemeli**.

```bash
file "başlat.bat"
```

Beklenen çıktıda `CRLF` geçmeli.

### 2. Başlatıcı menüsü

`başlat.bat`'a çift tıkla, dört seçeneği de sırayla dene. Her biri hatasız çalışmalı,
`4` seçeneği tip kontrolünü çalıştırıp `pause` ile beklemeli.

### 3. `.env` geçersiz kılma testi

Geçici olarak `.env` oluştur:

```
VITE_WIKI_API_BASE=https://ornek-yok.invalid/feed/v1/wikipedia
```

`npm run dev` → uygulama *"Arşive şu an ulaşılamıyor"* çevrimdışı ekranını
göstermeli (yani ortam değişkeni gerçekten okunuyor). Testten sonra `.env`'i **sil**.

### 4. Varsayılan davranış

`.env` yokken uygulama normal veri çekmeli.

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-08-21

- **Değişen dosyalar:**

  | Dosya | İşlem |
  |---|---|
  | `başlat.bat` | PowerShell port tarama bloğu kaldırıldı, 4 menü seçeneği doğrudan npm betiklerine bağlandı; BOM'suz + CRLF + ASCII korundu |
  | `baslat.sh` | Yeni — macOS/Linux başlatıcı, `chmod +x` uygulandı |
  | `.editorconfig` | Yeni |
  | `.nvmrc` | Yeni — `20` |
  | `.vscode/extensions.json` | Yeni |
  | `.vscode/settings.json` | Yeni |
  | `.gitignore` | `!.vscode/settings.json` istisnası eklendi (aşağıya bakın — sapma) |
  | `.env.example` | Yeni |
  | `src/lib/config.ts` | Yeni — `WIKI_API_BASE` |
  | `src/vite-env.d.ts` | Yeni — `ImportMetaEnv` tipi |
  | `src/lib/wiki.ts` | Gömülü `API` sabiti kaldırıldı, `config.ts`'ten `WIKI_API_BASE as API` içe aktarılıyor |

- **Sapmalar / notlar:**

  1. **`.gitignore` talimatta yazılı olmayan bir değişiklik gerektirdi.** T-01'den gelen
     kural `.vscode/*` içindeki her şeyi yok sayıp yalnızca `extensions.json`'ı istisna
     tutuyordu. Adım 6'da istenen `.vscode/settings.json` bu kuralla **repoya hiç
     girmeyecekti** — talimatın "ortak ortam" amacına aykırı olurdu. `!.vscode/settings.json`
     istisnası eklendi; `git check-ignore` ile hem `extensions.json` hem `settings.json`'ın
     artık izlenebilir olduğu doğrulandı.
  2. **Menüdeki port referansları düzeltildi.** Adım 1 yalnızca dev/typecheck komutlarını
     örnekliyordu; `!PORT!` değişkeni önizleme (mod 2) ve normal çalıştırma (mod 1) satırlarında
     da kullanılıyordu. `!PORT!` tanımı kaldırıldığı için bu iki satır da `npm run preview -- --open`
     ve `npm run dev -- --open` olarak güncellendi — Adım 1 tablosuyla birebir.
  3. `başlat.bat` içinde tek bir açıklama satırı (`rem  Bos portu Vite kendi buluyor...`)
     bilinçli olarak bırakıldı; kod değil, kaldırılan PowerShell bloğunun yerine neden
     ihtiyaç kalmadığını belgeliyor.

- **Doğrulama kanıtları:**

  | Test | Sonuç |
  |---|---|
  | BOM kontrolü | `head -c 3` → `@ e c`, BOM baytı yok |
  | Satır sonu | 118 satırın 118'i de CRLF (`\r` sayısı = `\n` sayısı = 118) |
  | ASCII saflığı | `LC_ALL=C grep '[^ -~]'` → CR dışında eşleşme yok |
  | Menü — mod 4 | Gerçek çalıştırma (`cmd /c başlat.bat` + piped `4`): `npm run typecheck` başarıyla tamamlandı, `pause` ile bekledi |
  | Menü — mod 3 | Gerçek çalıştırma: `npm run build` başarıyla tamamlandı, `dist` yoluyla bitti |
  | Menü — mod 1/2 mantığı | Statik incelemeyle doğrulandı (`npm run dev -- --open` / `npm run build` + `npm run preview -- --open`); ayrıca mod 1'in eşdeğeri olan `npm run dev`, Browser pane üzerinden ayrıca canlı test edildi (aşağıya bakın) |
  | `npm run typecheck` | Temiz, hata yok |
  | `npm run build` | Temiz, `dist/` üretti |
  | Gömülü URL taraması | `grep "api.wikimedia.org" src/**/*.ts(x)` → yalnızca `config.ts` içinde, başka yerde yok |
  | `.env` geçersiz kılma (canlı) | `.env`'e geçersiz `VITE_WIKI_API_BASE` yazıldı → `npm run dev` çalışırken Browser pane'de **"Arşive şu an ulaşılamıyor"** çevrimdışı ekranı göründü → env değişkeninin gerçekten okunduğu kanıtlandı |
  | Varsayılan davranış (canlı) | `.env` silindi → Vite `.env changed, restarting server...` ile kendini yeniden başlattı → sayfa yeniden yüklendiğinde `kaynak: TR Vikipedi`, 23 kayıt, 1680–2008 aralığı ile normal veri geldi |
  | Build çıktısı temizliği | `.env` kaldırıldıktan sonra yeniden `build` alındı; pakette ne geçersiz URL ne de sızıntı kaldı |

- **Sonraki talimata not:**

  - **T-03/T-04/T-05 →** `src/lib/wiki.ts` artık `API` sabitini `./config`'ten alıyor;
    bu dosyaya dokunacak sonraki talimatlar `WIKI_API_BASE as API` import satırının
    üstüne eklenmeli, sabiti yeniden tanımlamamalı.
  - **T-12 →** `.env.example` + `src/lib/config.ts` sayesinde testte API'yi sahte
    sunucuya yönlendirme artık mümkün; `VITE_WIKI_API_BASE` test ortamında override
    edilebilir. `.vscode/extensions.json` zaten ESLint/Prettier eklentilerini öneriyor,
    kurulum T-12'de yapılacak.
  - **T-14 →** `.nvmrc` (`20`) ve `.env.example` dokümantasyonda (`KULLANIM-KILAVUZU.md`,
    `README.md`) kurulum adımlarına yansıtılmalı.
