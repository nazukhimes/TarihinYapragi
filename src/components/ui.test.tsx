import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { CountUp } from "./ui";

/**
 * jsdom'un requestAnimationFrame'i, geri çağrıya window oluşturulma anına göre
 * sıfırlanmış bir zaman damgası verir (`performance.now() - windowInitialized`);
 * ama `CountUp`'ın `t0 = performance.now()` çağrısı bu sıfırlamayı görmez —
 * ikisi farklı saatlerde akar (gerçek tarayıcılarda ikisi HER ZAMAN aynı
 * saattir, spesifikasyon gereği). Sonuç: ilk `tick`te `t - t0` devasa negatif
 * bir sayı oluyor (gözlemlendi: -948188758289), kübik yumuşatma patlıyor —
 * bileşen hatası değil, jsdom'a özgü bir ortam kısıtı. rAF'ı tek bir saate
 * (performance.now, doğrudan) bağlayan senkron bir kukla ile bu atlanıyor.
 */
beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback): number => {
    return setTimeout(() => cb(performance.now()), 0) as unknown as number;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("CountUp — K-2 regresyonu", () => {
  it("to değişince yeni değere geçer", async () => {
    const { rerender } = render(<CountUp to={23} duration={10} />);
    await waitFor(() => expect(screen.getByText("23")).toBeInTheDocument());

    rerender(<CountUp to={18} duration={10} />);
    await waitFor(() => expect(screen.getByText("18")).toBeInTheDocument());
  });
});
