# T-12 · Test, Lint ve Biçimlendirme Altyapısı

| Alan | Değer |
|---|---|
| **Faz** | FAZ 4 — Kalite Güvencesi |
| **Öncelik** | 🟠 Yüksek |
| **Tahmini süre** | ~4 saat |
| **Bağımlılık** | T-01, T-02 |
| **İlgili bulgu** | U-5 |
| **Durum** | ⬜ Bekliyor |

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

- [ ] `npm test` çalışıyor, tüm testler geçiyor
- [ ] `src/lib/date.test.ts` — dayOfYear için **2026 → 233** testi var (K-1 regresyonu)
- [ ] `src/lib/slug.test.ts` — 366 gün çift yönlü tutarlılık testi var
- [ ] `src/lib/wiki.test.ts` — altın küme ve yanlış pozitif testleri var
- [ ] `src/components/sections.test.ts` — Türkçe `matchQuery` testleri var
- [ ] `src/data/data.test.ts` — benzersiz id, geçerli tip, dizin uyumu testleri var
- [ ] `CountUp` için K-2 regresyon testi var
- [ ] `npm run test:cov` — `src/lib` satır kapsamı **≥ %70**
- [ ] `npm run lint` **hatasız** (uyarı olabilir, sayısı kayda geçer)
- [ ] `npm run format:check` temiz
- [ ] `.prettierignore` içinde `*.bat` var
- [ ] `npm run kontrol` tek komutta hepsini çalıştırıyor
- [ ] CI iş akışı var ve yeşil

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

- **Tamamlanma tarihi:**
- **Test sayısı:**
- **Kapsam (`src/lib`):**
- **ESLint uyarı sayısı:**
- **Test yazarken bulunan hatalar (devredilenler):**
- **Sapmalar / notlar:**
- **Sonraki talimata not:**
