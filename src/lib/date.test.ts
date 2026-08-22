import { describe, it, expect } from "vitest";
import { isLeapYear, daysInMonth, dayOfYear, weekdayIndex } from "./date";

describe("isLeapYear", () => {
  it.each([
    [2024, true],
    [2026, false],
    [2000, true],
    [1900, false],
    [2100, false],
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
