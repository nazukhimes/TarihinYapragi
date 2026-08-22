import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { CountUp } from "./ui";

/**
 * jsdom'un requestAnimationFrame'i, geri çağrıya window oluşturulma anına göre
 * sıfırlanmış bir zaman damgası verir (`performance.now() - windowInitialized`);
 * ama `CountUp`'ın `t0 = performance.now()` çağrısı bu sıfırlamayı görmez —
 * ikisi farklı saatlerde akar (gerçek tarayıcılarda ikisi HER ZAMAN aynı
 * saattir, spesifikasyon gereği). Sonuç: ilk `tick`te `t - t0` devasa negatif
 * bir sayı oluyor (gözlemlendi: -948188758289), kübik yumuşatma patlıyor —
 * bileşen hatası değil, jsdom'a özgü bir ortam kısıtı.
 *
 * İlk düzeltme (gerçek `setTimeout` ile senkronize edilmiş bir rAF kuklası)
 * CI'da ara sıra kırmızı veriyordu (gerçek duvar-saati zamanlamasına bağlıydı,
 * paylaşımlı/yavaş bir çalıştırıcıda tekrar denemeden geçti) — kök neden aynı
 * kaldığı için giderilmedi, yalnızca belirsizlik kaynağı taşındı. Kalıcı çözüm:
 * `vi.useFakeTimers()` — bu, `performance.now()` VE `requestAnimationFrame`'i
 * TEK bir sahte saate bağlar (gerçek zamana hiç bağımlı değil), hem orijinal
 * jsdom saat tutarsızlığını hem de olası zamanlama kararsızlığını kökten
 * ortadan kaldırır.
 */
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("CountUp — K-2 regresyonu", () => {
  it("to değişince yeni değere geçer", () => {
    const { rerender } = render(<CountUp to={23} duration={10} />);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByText("23")).toBeInTheDocument();

    rerender(<CountUp to={18} duration={10} />);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByText("18")).toBeInTheDocument();
  });
});
