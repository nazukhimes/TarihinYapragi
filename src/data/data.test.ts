import { describe, it, expect } from "vitest";
import {
  CURATED,
  CATEGORIES,
  CASE_LABELS,
  REKORLAR,
  RECORD_SCOPES,
  RECORD_STATUS_LABELS,
} from "./index";
import { daysInMonth } from "../lib/date";

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
      g.events?.forEach((e) => expect(e.matchKeys.length, `${k}/${e.id}`).toBeGreaterThanOrEqual(2))
    );
  });

  it("science matchKeys yazılmışsa boş değil ve küçük harfli", () => {
    // Eşleşme `trLower(metin).includes(trLower(anahtar))` ile yapılıyor; büyük
    // harfli bir anahtar da çalışır ama editör dosyalarında yazım tek biçim
    // kalsın diye küçük harf şart koşuluyor (O-12). Alan İSTEĞE BAĞLI: yalnızca
    // Vikipedi'de gerçekten otomatik karşılığı çıkan kayıtlara yazılır.
    gunler.forEach(([k, g]) =>
      g.science.forEach((s) => {
        if (s.matchKeys === undefined) return;
        expect(s.matchKeys.length, `${k}/${s.id}`).toBeGreaterThan(0);
        s.matchKeys.forEach((anahtar) => {
          expect(anahtar.trim(), `${k}/${s.id}`).not.toBe("");
          expect(anahtar, `${k}/${s.id}`).toBe(anahtar.toLocaleLowerCase("tr-TR"));
        });
      })
    );
  });

  it("geçerli kategori ve dosya türleri", () => {
    gunler.forEach(([k, g]) => {
      g.events?.forEach((e) => expect(Object.keys(CATEGORIES), k).toContain(e.category));
      g.cases.forEach((c) => expect(Object.keys(CASE_LABELS), k).toContain(c.type));
    });
  });

  // Not: bu talimatın taslağında burada "OZEL_GUNLER" adlı ayrı bir dizinle
  // CURATED'ın uyumu kontrol ediliyordu. Gerçek kodda öyle bir dışa aktarım
  // yok — App.tsx "özel dosyalı günler" listesini doğrudan Object.keys(CURATED)
  // üzerinden üretiyor (App.tsx:639), yani CURATED zaten kendi tek doğruluk
  // kaynağı. Bu alt test onun yerine CURATED'ın kendi iç tutarlılığını
  // (T-10 hedefi ≥60 gün, her anahtarın geçerli bir takvim günü olması) sınar.
  it("en az 60 gün içeriyor (T-10 hedefi)", () => {
    expect(gunler.length).toBeGreaterThanOrEqual(60);
  });

  it("tüm anahtarlar geçerli takvim günleri", () => {
    gunler.forEach(([k]) => {
      const [ay, gun] = k.split("-").map(Number);
      expect(gun, k).toBeLessThanOrEqual(daysInMonth(ay));
      expect(gun, k).toBeGreaterThanOrEqual(1);
    });
  });
});

describe("REKORLAR bütünlüğü", () => {
  it("tüm id'ler benzersiz", () => {
    const idler = REKORLAR.map((r) => r.id);
    expect(new Set(idler).size).toBe(idler.length);
  });

  it("geçerli kapsam ve durum değerleri", () => {
    REKORLAR.forEach((r) => {
      expect(Object.keys(RECORD_SCOPES), r.id).toContain(r.scope);
      expect(Object.keys(RECORD_STATUS_LABELS), r.id).toContain(r.status);
    });
  });

  it("zorunlu metin alanları dolu", () => {
    REKORLAR.forEach((r) => {
      expect(r.title.trim().length, r.id).toBeGreaterThan(0);
      expect(r.holder.trim().length, r.id).toBeGreaterThan(0);
      expect(r.value.trim().length, r.id).toBeGreaterThan(0);
      expect(r.summary.trim().length, r.id).toBeGreaterThan(0);
      expect(r.tags.length, r.id).toBeGreaterThan(0);
    });
  });

  it("story en az 3 cümle (ICERIK-SABLONU kalite ölçütü)", () => {
    REKORLAR.forEach((r) => {
      const cumleler = r.story.split(/[.!?]\s/).filter((c) => c.trim().length > 10);
      expect(cumleler.length, r.id).toBeGreaterThanOrEqual(3);
    });
  });

  it("date verilmişse MM-DD ve geçerli takvim günü", () => {
    REKORLAR.filter((r) => r.date).forEach((r) => {
      expect(r.date, r.id).toMatch(/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/);
      const [ay, gun] = r.date!.split("-").map(Number);
      expect(gun, r.id).toBeLessThanOrEqual(daysInMonth(ay));
    });
  });

  it("KIRILDI olan her rekorda brokenBy var", () => {
    REKORLAR.filter((r) => r.status === "KIRILDI").forEach((r) => {
      expect(r.brokenBy, r.id).toBeTruthy();
    });
  });

  it("sourceUrl verilmişse geçerli bir https adresi", () => {
    REKORLAR.filter((r) => r.sourceUrl).forEach((r) => {
      expect(r.sourceUrl, r.id).toMatch(/^https:\/\//);
    });
  });

  it("yayın açılışı soru işaretiyle bitmez (ICERIK-SABLONU kuralı)", () => {
    REKORLAR.filter((r) => r.opener).forEach((r) => {
      expect(r.opener!.trim().endsWith("?"), r.id).toBe(false);
    });
  });

  it("rotasyonun anlamlı olması için havuz yeterince büyük", () => {
    expect(REKORLAR.length).toBeGreaterThanOrEqual(12);
  });
});
