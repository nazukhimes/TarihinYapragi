import { describe, it, expect } from "vitest";
import { matchQuery, formatYear, dosyaDetayiVar } from "./sections";

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

/* T-17 / O-15: "Dosyayı aç" düğmesi kullanıcıyı aynı metni ikinci kez okumaya
   çağırmamalı. Vikipedi `extract`i boş döndüğünde `detail`, `summary`nin
   kaynağı olan ham metne düşüyor — o durumda detay bölümü hiç açılmaz. */
describe("dosyaDetayiVar", () => {
  it("detay boşsa yok", () =>
    expect(dosyaDetayiVar({ detail: "", summary: "Bir olay." })).toBe(false));

  it("detay özetin aynısıysa yok", () =>
    expect(dosyaDetayiVar({ detail: "Bir olay oldu.", summary: "Bir olay oldu." })).toBe(false));

  it("yalnızca boşlukla ayrılıyorsa yine yok", () =>
    expect(dosyaDetayiVar({ detail: "Bir  olay\n oldu. ", summary: "Bir olay oldu." })).toBe(
      false
    ));

  it("özet truncate'in üç noktasıyla bitiyorsa yine yok", () =>
    expect(dosyaDetayiVar({ detail: "Bir olay oldu.", summary: "Bir olay oldu.…" })).toBe(false));

  it("detay gerçekten yeni metinse var", () =>
    expect(
      dosyaDetayiVar({
        detail: "Olayın ardındaki dava 1974'e kadar sürdü.",
        summary: "Bir olay oldu.",
      })
    ).toBe(true));

  it("özet kırpılmış, detay tam metinse var (okunacak fazlası kalmış)", () =>
    expect(
      dosyaDetayiVar({ detail: "Bir olay oldu ve dava açıldı.", summary: "Bir olay oldu…" })
    ).toBe(true));
});
