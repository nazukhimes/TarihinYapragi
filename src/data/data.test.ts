import { describe, it, expect } from "vitest";
import { CURATED, CATEGORIES, CASE_LABELS } from "./index";
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
