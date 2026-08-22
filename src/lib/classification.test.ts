import { describe, it, expect } from "vitest";
import { classifyItem, detectDarkItem } from "./classification";
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

describe("detectDarkItem — doğru pozitifler", () => {
  const gercekler = ORNEKLER.filter((o) => o.karanlik !== null);
  it.each(gercekler)("$text → karanlık tema bulunur", ({ text }) => {
    expect(detectDarkItem(text)).not.toBeNull();
  });
});

describe("detectDarkItem — genel kesinlik ≥ %90 (T-11 ölçütü)", () => {
  it("yanlış pozitif 0, kesinlik ≥ %90", () => {
    let tp = 0;
    let fp = 0;
    for (const o of ORNEKLER) {
      const beklenenKaranlik = o.karanlik !== null;
      const bulunanKaranlik = detectDarkItem(o.text) !== null;
      if (beklenenKaranlik && bulunanKaranlik) tp++;
      else if (!beklenenKaranlik && bulunanKaranlik) fp++;
    }
    const kesinlik = tp + fp > 0 ? tp / (tp + fp) : 1;
    expect(fp).toBe(0);
    expect(kesinlik).toBeGreaterThanOrEqual(0.9);
  });
});
