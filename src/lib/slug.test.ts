import { describe, it, expect } from "vitest";
import { toDaySlug, parseDaySlug, MONTH_SLUGS } from "./slug";
import { daysInMonth } from "./date";

describe("toDaySlug", () => {
  it.each([
    [8, 21, "21-agustos"],
    [1, 1, "1-ocak"],
    [2, 29, "29-subat"],
    [5, 19, "19-mayis"],
    [9, 9, "9-eylul"],
    [11, 10, "10-kasim"],
    [12, 31, "31-aralik"],
  ])("(%i, %i) → %s", (m, g, beklenen) => expect(toDaySlug(m, g)).toBe(beklenen));

  it("tüm ay slug'ları ASCII", () => {
    MONTH_SLUGS.forEach((s) => expect(s).toMatch(/^[a-z]+$/));
  });
});

describe("parseDaySlug", () => {
  it("ad biçimi", () => expect(parseDaySlug("21-agustos")).toEqual({ month: 8, day: 21 }));
  it("sayısal biçim", () => expect(parseDaySlug("08-21")).toEqual({ month: 8, day: 21 }));
  it("29 Şubat geçerli", () => expect(parseDaySlug("29-subat")).toEqual({ month: 2, day: 29 }));

  it.each(["32-agustos", "31-subat", "0-ocak", "agustos", "", "21-xyz", "abc"])("%s → null", (s) =>
    expect(parseDaySlug(s)).toBeNull()
  );
});

describe("çift yönlü tutarlılık — 366 gün", () => {
  it("her gün için toDaySlug → parseDaySlug aynı günü verir", () => {
    for (let m = 1; m <= 12; m++)
      for (let d = 1; d <= daysInMonth(m); d++)
        expect(parseDaySlug(toDaySlug(m, d))).toEqual({ month: m, day: d });
  });
});
