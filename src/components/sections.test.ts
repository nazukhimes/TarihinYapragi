import { describe, it, expect } from "vitest";
import { matchQuery, formatYear } from "./sections";

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
