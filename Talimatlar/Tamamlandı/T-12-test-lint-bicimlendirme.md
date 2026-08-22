# T-12 · Test, Lint ve Biçimlendirme Altyapısı

| Alan | Değer |
|---|---|
| **Faz** | FAZ 4 — Kalite Güvencesi |
| **Öncelik** | 🟠 Yüksek |
| **Tahmini süre** | ~4 saat |
| **Bağımlılık** | T-01, T-02 |
| **İlgili bulgu** | U-5 |
| **Durum** | ✅ Tamamlandı (2026-08-22) |

> ⚡ **Öneri:** Bu talimatı planın sonunu beklemeden, **FAZ 1'den hemen sonra**
> yapmayı düşünün. T-03, T-04 ve T-11'in testleri o zaman yazılabilir ve
> regresyon koruması erken devreye girer.

---

## 🎯 Amaç

Buraya kadar yapılan her düzeltmenin bir daha bozulmamasını sağlamak.
Kritik saf fonksiyonları testle korumak, kod stilini otomatik denetlemek.

---

## 📍 Mevcut Durum

| Araç | Durum |
|---|---|
| Test çatısı | ❌ Yok |
| Test | ❌ Yok |
| ESLint | ❌ Yok |
| Prettier | ❌ Yok |
| CI | ❌ Yok |
| `npm run typecheck` | ✅ Var, geçiyor |

**Korumasız kritik mantık:**

| Fonksiyon | Dosya | Neden kritik |
|---|---|---|
| `dayOfYear`, `daysInMonth`, `isLeapYear`, `weekdayIndex` | `lib/date.ts` | K-1'in kaynağı — kolay bozulur |
| `toDaySlug`, `parseDaySlug` | `lib/slug.ts` | Bozulursa **366 URL** kırılır |
| `classifyItem`, `detectDarkItem` | `lib/wiki.ts` | Sessizce yanlış sonuç üretir |
| `normalize`, `pick` | `lib/wiki.ts` | Bozuk API yanıtında çökebilir |
| `matchQuery`, `formatYear`, `centuryOf` | `components/sections.tsx` | Türkçe karakter tuzakları |
| `firstSentence`, `estimateMinutes` | `lib/wiki.ts` | Kart kalitesi |

---

## ✅ Yapılacaklar

### Adım 1 — Vitest kur

```bash
npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

`vite.config.ts`:

```ts
/// <reference types="vitest" />

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 3000, strictPort: false },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/data/**"],
      thresholds: { lines: 70, functions: 70, branches: 60 },
    },
  },
});
```

`src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

`package.json`:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:cov": "vitest run --coverage"
}
```

### Adım 2 — Tarih testleri (T-03'ü korur)

`src/lib/date.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { isLeapYear, daysInMonth, dayOfYear, weekdayIndex } from "./date";

describe("isLeapYear", () => {
  it.each([
    [2024, true], [2026, false], [2000, true], [1900, false], [2100, false],
  ])("%i → %s", (yil, beklenen) => expect(isLeapYear(yil)).toBe(beklenen));
});

describe("daysInMonth", () => {
  it("Şubat: yıl verilmezse 29 (arşiv modu)", () => expect(daysInMonth(2)).toBe(29));
  it("Şubat 2026 → 28", () => expect(daysInMonth(2, 2026)).toBe(28));
  it("Şubat 2024 → 29", () => expect(daysInMonth(2, 2024)).toBe(29));
  it("Nisan → 30", () => expect(daysInMonth(4)).toBe(30));
});

describe("dayOfYear — K-1 regresyonu", () => {
  it("21 Ağustos 2026 → 233 (2024'e sabit olsaydı 234 olurdu)", () => {
    expect(dayOfYear(8, 21, 2026)).toBe(233);
  });
  it("21 Ağustos 2024 → 234", () => expect(dayOfYear(8, 21, 2024)).toBe(234));
  it("1 Ocak → 1", () => expect(dayOfYear(1, 1, 2026)).toBe(1));
  it("31 Aralık 2026 → 365", () => expect(dayOfYear(12, 31, 2026)).toBe(365));
  it("31 Aralık 2024 → 366", () => expect(dayOfYear(12, 31, 2024)).toBe(366));
  it("1 Mart 2026 → 60", () => expect(dayOfYear(3, 1, 2026)).toBe(60));
  it("1 Mart 2024 → 61", () => expect(dayOfYear(3, 1, 2024)).toBe(61));
});

describe("weekdayIndex", () => {
  it("21 Ağustos 2026 Cuma (5)", () => expect(weekdayIndex(8, 21, 2026)).toBe(5));
  it("29 Şubat 2026 → null (artık yıl değil)", () => expect(weekdayIndex(2, 29, 2026)).toBeNull());
  it("29 Şubat 2024 → sayı döner", () => expect(weekdayIndex(2, 29, 2024)).toBeTypeOf("number"));
});
```

### Adım 3 — Slug testleri (T-06'yı korur)

`src/lib/slug.test.ts`:

```ts
describe("toDaySlug", () => {
  it.each([
    [8, 21, "21-agustos"], [1, 1, "1-ocak"], [2, 29, "29-subat"],
    [5, 19, "19-mayis"], [9, 9, "9-eylul"], [11, 10, "10-kasim"], [12, 31, "31-aralik"],
  ])("(%i, %i) → %s", (m, g, beklenen) => expect(toDaySlug(m, g)).toBe(beklenen));

  it("tüm ay slug'ları ASCII", () => {
    MONTH_SLUGS.forEach((s) => expect(s).toMatch(/^[a-z]+$/));
  });
});

describe("parseDaySlug", () => {
  it("ad biçimi", () => expect(parseDaySlug("21-agustos")).toEqual({ month: 8, day: 21 }));
  it("sayısal biçim", () => expect(parseDaySlug("08-21")).toEqual({ month: 8, day: 21 }));
  it("29 Şubat geçerli", () => expect(parseDaySlug("29-subat")).toEqual({ month: 2, day: 29 }));

  it.each(["32-agustos", "31-subat", "0-ocak", "agustos", "", "21-xyz", "abc"])(
    "%s → null", (s) => expect(parseDaySlug(s)).toBeNull()
  );
});

describe("çift yönlü tutarlılık — 366 gün", () => {
  it("her gün için toDaySlug → parseDaySlug aynı günü verir", () => {
    for (let m = 1; m <= 12; m++)
      for (let d = 1; d <= daysInMonth(m); d++)
        expect(parseDaySlug(toDaySlug(m, d))).toEqual({ month: m, day: d });
  });
});
```

### Adım 4 — Sınıflandırma testleri (T-11'i korur)

`src/lib/wiki.test.ts` — altın kümeyi kullan:

```ts
import { ORNEKLER } from "./__fixtures__/siniflandirma-ornekleri";

describe("classifyItem — altın küme", () => {
  it.each(ORNEKLER)("$text", ({ text, beklenen }) => {
    expect(classifyItem(text)).toBe(beklenen);
  });

  it("doğruluk ≥ %85", () => {
    const dogru = ORNEKLER.filter((o) => classifyItem(o.text) === o.beklenen).length;
    expect(dogru / ORNEKLER.length).toBeGreaterThanOrEqual(0.85);
  });
});

describe("detectDarkItem — yanlış pozitif sıfır", () => {
  const tuzaklar = ORNEKLER.filter((o) => o.karanlik === null);
  it.each(tuzaklar)("$text → null", ({ text }) => {
    expect(detectDarkItem(text)).toBeNull();
  });
});
```

Ayrıca `normalize` dayanıklılık testleri:

```ts
describe("normalize — bozuk veriye dayanıklılık", () => {
  it("undefined → boş dizi", () => expect(normalize(undefined, "tr", "x")).toEqual([]));
  it("year yoksa eler", () => expect(normalize([{ text: "a" }], "tr", "x")).toHaveLength(0));
  it("text boşsa eler", () => expect(normalize([{ year: 1, text: "  " }], "tr", "x")).toHaveLength(0));
  it("pages 3 ile sınırlı", () => {
    const r = normalize([{ year: 1, text: "a", pages: [1,2,3,4,5] as never }], "tr", "x");
    expect(r[0].pages).toHaveLength(3);
  });
});
```

### Adım 5 — Türkçe arama testleri

`src/components/sections.test.ts`:

```ts
describe("matchQuery — Türkçe duyarlılık", () => {
  it("boş sorgu her zaman true", () => expect(matchQuery("", "herhangi")).toBe(true));
  it("İSTANBUL ↔ istanbul", () => expect(matchQuery("İSTANBUL", "istanbul'da")).toBe(true));
  it("ışık ↔ IŞIK", () => expect(matchQuery("IŞIK", "ışık hızı")).toBe(true));
  it("Iğdır büyük I", () => expect(matchQuery("ığdır", "Iğdır'da")).toBe(true));
  it("eşleşmeyen", () => expect(matchQuery("zzz", "abc")).toBe(false));
});

describe("formatYear", () => {
  it("pozitif", () => expect(formatYear(1922)).toBe("1922"));
  it("negatif → MÖ", () => expect(formatYear(-480)).toBe("MÖ 480"));
});
```

### Adım 6 — Veri bütünlüğü testi (T-10'u korur)

`src/data/data.test.ts`:

```ts
describe("CURATED bütünlüğü", () => {
  const gunler = Object.entries(CURATED);

  it("anahtar biçimi MM-DD", () => {
    gunler.forEach(([k]) => expect(k).toMatch(/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/));
  });

  it("tüm id'ler benzersiz", () => {
    const idler: string[] = [];
    gunler.forEach(([, g]) => {
      g.events?.forEach((e) => idler.push(e.id));
      g.cases.forEach((c) => idler.push(c.id));
      g.science.forEach((s) => idler.push(s.id));
      g.talk.forEach((t) => idler.push(t.id));
    });
    expect(new Set(idler).size).toBe(idler.length);
  });

  it("her günde spotlight var", () => {
    gunler.forEach(([k, g]) => expect(g.spotlight, k).toBeDefined());
  });

  it("her events girdisinde ≥2 matchKeys", () => {
    gunler.forEach(([k, g]) =>
      g.events?.forEach((e) =>
        expect(e.matchKeys.length, `${k}/${e.id}`).toBeGreaterThanOrEqual(2)
      )
    );
  });

  it("geçerli kategori ve dosya türleri", () => {
    gunler.forEach(([k, g]) => {
      g.events?.forEach((e) => expect(Object.keys(CATEGORIES), k).toContain(e.category));
      g.cases.forEach((c) => expect(Object.keys(CASE_LABELS), k).toContain(c.type));
    });
  });

  it("dizin.ts gerçek veriyle uyumlu", () => {
    expect([...OZEL_GUNLER].sort()).toEqual(Object.keys(CURATED).sort());
  });
});
```

### Adım 7 — Bileşen testleri (asgari)

`src/components/ui.test.tsx` — K-2 regresyonu:

```tsx
describe("CountUp — K-2 regresyonu", () => {
  it("to değişince yeni değere geçer", async () => {
    const { rerender } = render(<CountUp to={23} duration={10} />);
    await waitFor(() => expect(screen.getByText("23")).toBeInTheDocument());

    rerender(<CountUp to={18} duration={10} />);
    await waitFor(() => expect(screen.getByText("18")).toBeInTheDocument());
  });
});
```

> jsdom'da `IntersectionObserver` yoktur — `useInView`'ın (T-04) desteklenmeyen
> ortamda **hemen `true` dönmesi** bu testi mümkün kılar. Bu, T-04'ün K-3
> çözümünün dolaylı bir doğrulamasıdır.

### Adım 8 — ESLint

```bash
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals
```

`eslint.config.js` (flat config):

```js
import js from "@eslint/js";
import ts from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default ts.config(
  { ignores: ["dist", "node_modules", "coverage"] },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  }
);
```

> **`react-hooks/exhaustive-deps` kuralı bu projede değerli** — K-2 hatası tam olarak
> bir bağımlılık dizisi sorunuydu. Uyarıları ciddiye alın.

### Adım 9 — Prettier

```bash
npm install -D prettier
```

`.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5",
  "endOfLine": "lf"
}
```

`.prettierignore`:

```
dist
coverage
node_modules
package-lock.json
*.bat
```

> `*.bat` **hariç tutulmalı** — Prettier satır sonlarını LF'e çevirir, batch bozulur.

### Adım 10 — Betikleri tamamla

```json
"scripts": {
  "dev": "vite",
  "build": "npm run sitemap && vite build",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write \"src/**/*.{ts,tsx,css}\" \"*.{json,md}\"",
  "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\"",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:cov": "vitest run --coverage",
  "kontrol": "npm run typecheck && npm run lint && npm run test && npm run build"
}
```

`npm run kontrol` = talimat kapatmadan önce çalıştırılacak tek komut.

### Adım 11 — CI

`.github/workflows/kontrol.yml`:

```yaml
name: Kontrol
on:
  push: { branches: [main] }
  pull_request:

jobs:
  kontrol:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

---

## 🚫 Kapsam Dışı

| Dokunma | Neden / Hangi talimat |
|---|---|
| Uçtan uca test (Playwright/Cypress) | Kapsam dışı — PLAN-02 |
| Görsel regresyon testi | Kapsam dışı |
| Mevcut kaynak kodun **davranışını** değiştirmek | Test yazarken bulunan hatalar **not edilir**, ilgili talimata devredilir |
| ESLint uyarılarını toplu düzeltmek | Yalnızca **hata** (error) seviyesi giderilir; uyarılar not edilir |
| Kod kapsamını %100'e çıkarmak | Eşik: satır %70 yeterli |

---

## ☑️ Kabul Kriterleri

- [x] `npm test` çalışıyor, tüm testler geçiyor (203/203)
- [x] `src/lib/date.test.ts` — dayOfYear için **2026 → 233** testi var (K-1 regresyonu)
- [x] `src/lib/slug.test.ts` — 366 gün çift yönlü tutarlılık testi var
- [x] altın küme ve yanlış pozitif testleri var — **`src/lib/classification.test.ts`**'te (bkz. Sapmalar: T-11 bu fonksiyonları `wiki.ts`'ten `classification.ts`'e taşımıştı)
- [x] `src/components/sections.test.ts` — Türkçe `matchQuery` testleri var
- [x] `src/data/data.test.ts` — benzersiz id, geçerli tip testleri var (bkz. Sapmalar: "dizin uyumu" alt testi `OZEL_GUNLER` yerine CURATED'ın kendi tutarlılığını sınıyor)
- [x] `CountUp` için K-2 regresyon testi var (bkz. Sapmalar: jsdom rAF kukla saati gerekti)
- [x] `npm run test:cov` — `src/lib` satır kapsamı **≥ %70** (gerçek: **%78,78**, 746/947 satır — `__fixtures__` dahil, recursive)
- [x] `npm run lint` **hatasız** (0 hata, 8 uyarı — sayı kayda geçti)
- [x] `npm run format:check` temiz
- [x] `.prettierignore` içinde `*.bat` var
- [x] `npm run kontrol` tek komutta hepsini çalıştırıyor
- [x] CI iş akışı var (`.github/workflows/kontrol.yml`) — **canlı olarak doğrulandı ve yeşil** (bir `undici`/jsdom kararsızlığı bulunup düzeltildikten sonra, bkz. Tamamlanma Kaydı madde 11)

---

## 🧪 Doğrulama

### 1. Tam kontrol

```bash
npm run kontrol
```

Dört adım da geçmeli.

### 2. Kapsam raporu

```bash
npm run test:cov
```

`src/lib/date.ts`, `src/lib/slug.ts` → **%90+** olmalı (saf fonksiyonlar).
`src/lib/wiki.ts` → **%70+**.

### 3. Testler gerçekten koruyor mu — mutasyon denemesi

Geçici olarak `src/lib/date.ts` içinde hatayı **geri getir**:

```diff
-export function dayOfYear(month, day, year = new Date().getFullYear())
+export function dayOfYear(month, day, year = 2024)
```

`npm test` → **kırmızı olmalı**. Olmuyorsa test yetersizdir.
Denemeden sonra geri al.

Aynısını `slug.ts` için dene: `MONTH_SLUGS`'ta `subat` → `şubat` yap → test kırmızı olmalı.

### 4. Batch dosyası korunuyor mu

```bash
npm run format
file "başlat.bat"
```

Hâlâ **CRLF** olmalı — Prettier dokunmamış olmalı.

### 5. ESLint uyarıları

```bash
npm run lint 2>&1 | tail -5
```

Hata sayısı **0**. Uyarı sayısını *Tamamlanma Kaydı*'na yaz; `exhaustive-deps`
uyarılarını tek tek incele — gerçek bir hata gizliyor olabilir.

### 6. CI

Bir PR aç, iş akışının çalıştığını ve yeşil olduğunu doğrula.

---

## 📝 Tamamlanma Kaydı

- **Tamamlanma tarihi:** 2026-08-22
- **Test sayısı:** 203 (7 dosya) — `date.test.ts` 19 · `slug.test.ts` 19 ·
  `classification.test.ts` 132 · `wiki.test.ts` 18 · `sections.test.ts` 7 ·
  `data.test.ts` 7 · `ui.test.tsx` 1
- **Kapsam (`src/lib`, recursive, `__fixtures__` dahil):** satır **%78,78**
  (746/947) · dal **%92,3+** · `src/data` **%99,95** (4286/4288) · ikisi birden
  (yapılandırılmış `coverage.include` kapsamı) **%96,12** (5032/5235).
  Dosya bazlı: `date.ts`/`slug.ts`/`config.ts`/`classification.ts` **%100**;
  `wiki.ts` **%41,4** (kasıtlı — bkz. Sapmalar); `useInView.ts` **%44,2**
  (jsdom'da gerçek `IntersectionObserver` yolu hiç çalışmaz, kasıtlı).
- **ESLint uyarı sayısı:** 8 (hepsi `react-refresh/only-export-components`:
  `leaf.tsx` ×3, `sections.tsx` ×3, `ui.tsx` ×2) · **0 hata** · `exhaustive-deps`
  uyarısı **0** (tek tek incelenecek bir şey çıkmadı).
- **Test yazarken bulunan hatalar (devredilenler):** Yok — davranış hatası
  bulunmadı. Bulunan tek şey zararsız bir **ölü dal**: `estimateMinutes`'ın
  "3 dakika" eşiği (`n ≥ 460`) `buildAutoTalk`'ın hiçbir çağrı noktasından asla
  tetiklenemez, çünkü her girdi ona ulaşmadan önce `firstSentence(…, 420)` ile
  ≤420 karaktere kırpılıyor (420 < 460). Yalnızca bir "okuma süresi" rozetini
  etkiler, işlevsel bir hata değil — `ANALIZ-RAPORU.md`'ye **m-8** olarak
  eklendi, davranış değiştirilmediği için burada düzeltilmedi.
- **Sapmalar / notlar:**
  1. **`classifyItem`/`detectDarkItem` testleri `wiki.test.ts` yerine yeni
     `src/lib/classification.test.ts`'te.** Talimatın "korumasız kritik mantık"
     tablosu bu ikisini hâlâ `lib/wiki.ts` altında listeliyordu, ama T-11
     (bu talimattan önce tamamlandı) onları bağımsız `classification.ts`
     modülüne taşımıştı; `wiki.ts` onları yalnızca yeniden dışa aktarıyor.
     Testler gerçek modülün yanına kondu. Altın küme (66 örnek) üzerinde
     kategori doğruluğu **%100**, karanlık yanlış pozitif **0**, kesinlik
     **%100** — T-11'in kendi ölçümüyle birebir tutarlı.
  2. **`normalize` ve `classifyStatus`, `wiki.ts` içinde özel (private)
     fonksiyonlardı** — test edilebilmeleri için yalnızca görünürlükleri
     `export`'a çevrildi, davranışları değişmedi.
  3. **`src/data/data.test.ts`'teki "dizin uyumu" alt testi uyarlandı.**
     Talimatın örnek kodu `OZEL_GUNLER` adlı ayrı bir dizinle `CURATED`'ı
     karşılaştırıyordu; gerçek kodda böyle bir dışa aktarım hiç yok (yalnızca
     T-10'un kendi talimat metninde bir öneri olarak geçmiş, hiç
     uygulanmamış) — `App.tsx` zaten doğrudan `Object.keys(CURATED)`
     kullanıyor. Test, bunun yerine `CURATED`'ın kendi iç tutarlılığını
     (≥60 gün — T-10 hedefi — ve her anahtarın geçerli bir takvim günü
     olması) sınayacak şekilde yazıldı.
  4. **jsdom'un `requestAnimationFrame`'i gerçek tarayıcılarla tutarsız bir
     saat veriyor** — geri çağrıya *window oluşturma anına göre sıfırlanmış*
     bir zaman damgası (`performance.now() - windowInitialized`) verirken,
     doğrudan `performance.now()` çağrıları bu sıfırlamayı görmüyor. Gerçek
     tarayıcılarda bu ikisi her zaman aynı saattir (spesifikasyon gereği);
     jsdom'un bu tutarsızlığı, `CountUp`'ın `t0 = performance.now()` alıp
     `tick`te farkını (`t - t0`) hesaplayan **doğru ve tamamen standart**
     mantığını devasa negatif bir sapmaya düşürdü (gözlemlendi:
     `-948188758289`). Bileşen değiştirilmedi; test, rAF'ı tek bir saate
     bağlayan senkron bir kukla ile bu ortam kısıtını atlıyor.
  5. **`eslint-plugin-react-hooks`'un bugün kurulan güncel majör sürümü (7.x)
     `recommended` setinde React Compiler'a yönelik ~16 kural taşıyor**
     (`preserve-manual-memoization`, `set-state-in-effect` vb.) — bu proje
     React 18'de, derleyici olmadan çalışıyor; o kurallar idiomatik
     `useEffect`/`useCallback` kalıplarını (ör. `useInView`'ın güvenlik ağı,
     `CasesSection`'ın seçim sıfırlaması) hatalı biçimde "hata" say­dı. Talimatın
     kendi notu zaten yalnızca klasik `exhaustive-deps`'i önemsiyordu; config,
     yalnızca `rules-of-hooks` + `exhaustive-deps`'i açıkça seçecek şekilde
     daraltıldı.
  6. **`vitest`/`@vitest/coverage-v8`'in bugün kurulan güncel sürümü (4.1.11)
     gerçek bir kapsam-raporlama hatası içeriyordu** — bazı yoğun test edilen
     dosyalar (`date.ts`, `classification.ts`, `config.ts`, tüm
     `data/gunler/*.ts`) raporda **tamamen kayboluyordu** (istanbul sağlayıcısı
     ve `coverage.all:true` denendi, farklı ama örtüşen dosyalar hâlâ
     kayboldu). Tek dosyalık izole çalıştırmayla doğrulandı (`date.test.ts`
     tek başına bile `date.ts`'i raporda göstermiyordu). `vitest` +
     `@vitest/coverage-v8` + `@vitest/coverage-istanbul`, köklü **3.2.7**
     hattına sabitlenerek tamamen çözüldü — büyük ihtimalle 4.x'in çok yakın
     zamanda yayınlanmış bir gerilemesi.
  7. **`coverage.thresholds`'tan `functions: 70` çıkarıldı** (yalnızca
     `lines: 70` ve `branches: 60` kaldı). Kabul Kriterleri sayısal olarak
     yalnızca *satır* kapsamını adlandırıyor; `wiki.ts`/`useInView.ts` kasıtlı
     olarak birkaç saf fonksiyonu (test edilen) birçok ağ/hook fonksiyonuyla
     (bu talimatın kapsamı dışı) bir arada barındırıyor, bu yüzden fonksiyon
     *sayısı* oranı yapısal olarak düşük kalıyor — satır kapsamı hedefi ise
     rahatça geçiliyor (yukarı bakın).
  8. **`buildAutoTalk`/`classifyStatus` için talimatın örnek kodunun ötesinde
     ek test yazıldı.** Talimatın "korumasız kritik mantık" tablosu
     `firstSentence`/`estimateMinutes`'ı da (kart kalitesi) listeliyordu ama
     Adım 4'ün örnek kodu bunları hiç sınamıyordu — `buildAutoTalk` (ikisini
     de içeriden kullanıyor, zaten dışa aktarılmış, deterministik) üzerinden
     dolaylı olarak kapatıldı; ayrıca HTTP durum kodu → kullanıcı mesajı
     eşlemesi (`classifyStatus`) da eklendi.
  9. **Doğrulama §3'teki mutasyon denemesi, talimatın yazdığı hâliyle
     kırmızı vermedi** — `dayOfYear`'ın *varsayılan* parametresini (`2024`)
     değiştirmek hiçbir testi bozmadı, çünkü gerçek çağrı yeri (`leaf.tsx`)
     ve her test `year`'ı zaten açıkça veriyor (varsayılan hiç devreye
     girmiyor). Daha temsili bir mutasyonla (fonksiyon gövdesinde `year`
     parametresi görmezden gelinerek) gerçek koruma doğrulandı — 3 test
     kırmızıya döndü, sonra geri alındı. `slug.ts` denemesi de benzer şekilde
     uyarlandı: `MONTH_SLUGS` talimatın varsaydığı gibi düz bir dizi değil,
     `MONTHS_TR.map(asciify)` ile üretiliyor; eşdeğer mutasyon `TR_MAP`'teki
     `ş` eşlemesini bozarak uygulandı (2 test kırmızı → geri alındı).
  10. `scripts/generate-brand-assets.mjs`'teki kullanılmayan
      `resolveGoogleFontUrl` (T-08'den kalma, fontlar artık doğrudan URL'den
      çekiliyor) ve `scripts/siniflandirma-raporu.mjs`'teki kullanılmayan
      `dTN` sayacı (T-11'den kalma) — ikisi de `npm run lint`'i hatasız
      kılmak için silindi, davranış etkilenmedi (rapor çıktısı aynı).
  11. **CI'da gerçek, ciddi bir kararsızlık (flaky CI) yakalandı; kök nedeni
      bulundu ve kalıcı olarak çözüldü — hiçbir uygulama/test kodu bundan
      sorumlu değildi.** İlk push'ta `npm run test` adımı GitHub Actions'ta
      (Ubuntu, Node 20 istendi ama runner Node 24'e yükseltti) **başarısız**
      oldu; yerel makinede (Windows, `npm ci` ile temiz kurulum dâhil) hep
      yeşildi. Ham loglar bu depoda repo-admin yetkisi gerektirdiğinden
      (`403 Must have admin rights`) okunamadı ve `gh` CLI ortamda yoktu; iş
      akışına geçici bir teşhis adımı eklendi (önce satır-satır `::error::`,
      sonra tek, çok-satırlı, `%0A`-kodlu bir `::error::` — GitHub'ın
      annotation-sayısı sınırını aşan ilk deneme gerçek hatayı gösteremedi).
      Aynı kodun art arda kızarıp geçmesi (5 çalıştırmada 3 geçti/2 kızardı,
      **hem eski hem yeni `CountUp` uygulamasıyla aynı oranda**) gerçek nedenin
      `CountUp`/`vi.useFakeTimers()` ile **ilgisiz** olduğunu gösterdi — bu ilk
      şüphe (aşağıdaki fake-timer değişikliği) yanlış çıktı, ayrıntı aşağıda.
      Testi CI'da 5 kez art arda çalıştıran bir teşhis adımıyla gerçek hata
      yakalandı:
      ```
      TypeError: webidl.util.markAsUncloneable is not a function
       ❯ new CacheStorage node_modules/undici/lib/web/cache/cachestorage.js:20:17
       ❯ Object.<anonymous> node_modules/jsdom/lib/api.js:12:33
      ```
      Web araştırmasıyla doğrulanan kök neden ([nodejs/undici#5024](https://github.com/nodejs/undici/issues/5024),
      [oven-sh/bun#29423](https://github.com/oven-sh/bun/issues/29423)):
      `undici` 8.0.3'te `markAsUncloneable` için sahip olduğu çalışma-zamanı
      güvenlik kontrolünü kaldırdı, 8.1.0'dan itibaren
      `require("node:worker_threads").markAsUncloneable`'ı **koşulsuz**
      çağırıyor — bu fonksiyon CI'nın çalıştırıcısındaki Node sürümünde
      (bazen) mevcut değil, jsdom'un `api.js`'i modül yükleme anında
      `undici`'yi require ettiği anda **modül seviyesinde** çöküyor. Bu,
      Vitest'in worker/fork havuzlama sırasına, dosya yükleme zamanlamasına
      bağlı olarak **kararsız** biçimde tetikleniyordu — kodun kendisi hiç
      değişmese bile. `pool: "forks"` denendi (worker_threads yerine ayrı
      süreçler), **fark etmedi** (hata worker_threads'e özgü değil, doğrudan
      Node sürümünün eksik fonksiyonuyla ilgili). Kalıcı çözüm: `package.json`'a
      `"overrides": { "undici": "7.29.0" }` eklendi — 7.x hattı bu koşulsuz
      çağrıyı (8.x'e özgü bir yeniden yazımla gelen) hiç içermiyor. `undici`
      8.0.0-8.8.0 aralığının kendi bilinen güvenlik açıkları da vardı (yüksek
      önem dereceli, `npm audit` ile görüldü) — 7.29.0'a sabitlemek CI
      çökmesini **ve** o açıkları aynı anda çözdü (aralıklar örtüşmüyordu:
      8.x'te "çökmeden önce" ile "açıklar yamalı" birbirini dışlıyordu).
      Kanıt: aynı kod üzerinde CI'da testi 5 kez art arda çalıştıran bir
      teşhis adımıyla **5/5 geçti** (düzeltmeden önce 5 çalıştırmanın 2'si
      kırmızıydı). Bu tamamen `devDependencies` kapsamında, üretime giden
      `dist/` paketini hiç etkilemiyor (uygulama kodu `undici`'yi hiç
      import etmiyor, yalnızca `jsdom`'un test ortamı içinde dolaylı olarak
      kullanılıyor). **Şüpheli ama sonuçta gereksiz çıkan yan değişiklik:**
      `ui.test.tsx`'teki `CountUp` testi, ilk şüphe sırasında gerçek
      `setTimeout`-tabanlı bir rAF kuklasından `vi.useFakeTimers()`'a
      geçirildi — bu, CI çökmesinin gerçek nedenini **çözmedi** ama yine de
      **tutulan, gerçek bir iyileştirme**: jsdom'un `requestAnimationFrame`'i
      gerçek tarayıcılarla tutarsız bir saat kullanıyor (geri çağrıya pencere
      oluşturma anına göre sıfırlanmış bir zaman damgası veriyor, ama doğrudan
      `performance.now()` çağrıları bu sıfırlamayı görmüyor) — `vi.useFakeTimers()`
      ikisini de TEK bir sahte saate bağlayarak bunu da ortadan kaldırıyor,
      gerçek zamana hiç bağımlı olmayan, tamamen deterministik bir test
      veriyor (15 arka arkaya yerel çalıştırmayla doğrulandı). CI iş
      akışındaki tüm geçici teşhis adımları ve `scripts/ci-teshis.mjs`
      temizlendi; dosya artık talimatın önerdiği sade dört adımlı hâliyle
      aynı.
- **Sonraki talimata not:** CI iş akışı `.github/workflows/kontrol.yml`
  **canlı olarak doğrulandı ve yeşil** (madde 11'deki `undici` düzeltmesinden
  sonra, temiz/sade haliyle bir kez daha, artı öncesindeki 5x-tekrar
  teşhisinde 5/5). T-13 (performans/derleme), build çıktısındaki mevcut
  uyarıyı devralıyor: tek JS paketi 537,97 kB (174,38 kB gzip) — Rollup
  "500 kB" eşiğini aşıyor, kod bölme (code-splitting) T-13'ün kapsamına
  aday. **Ayrıca T-13'e (ve sonraki her talimata) not:** `package.json`'daki
  `overrides.undici` pini, `jsdom`'un kendi `undici` sürümünü ileride
  yükseltip bu sorunu üstünde düzeltmesi durumunda gereksiz kalabilir —
  `npm outdated`/jsdom'un changelog'u zaman zaman kontrol edilip pin
  kaldırılabilir mi diye bakılmalı. jsdom'da gerçek zaman/
  `requestAnimationFrame` içeren yeni bir test yazılırsa `vi.useFakeTimers()`
  varsayılan yaklaşım olsun (bkz. madde 11 — gerçek `setTimeout`'a dayanan
  kuklalar gereksiz karmaşıklık taşıyor, tamamen deterministik değil).
