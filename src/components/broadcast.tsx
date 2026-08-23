import { useCallback, useEffect, useState } from "react";
import type { TalkCard } from "../data";
import { copyText, IconArrow, IconCopy, toast } from "./ui";
import { catColor } from "./talk";

/* ================= YAYIN MODU (teleprompter) ================= */
/* Ayrı dosyada: BroadcastMode nadiren açılıyor (çoğu kullanıcı hiç açmıyor),
   bu yüzden App.tsx'te React.lazy ile yalnızca düğmeye basılınca yüklenir. */

export function BroadcastMode({
  cards,
  dayLabel,
  onClose,
}: {
  cards: TalkCard[];
  dayLabel: string;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const card = cards[Math.min(idx, cards.length - 1)];

  const next = useCallback(() => setIdx((i) => Math.min(cards.length - 1, i + 1)), [cards.length]);
  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [next, prev, onClose]);

  const doCopy = async () => {
    const ok = await copyText(`${card.hook}\n\n${card.body}`);
    toast(ok ? "Kart panoya kopyalandı" : "Kopyalanamadı");
  };

  return (
    <div className="fixed inset-0 z-[85] bg-[#0a0d12] flex flex-col">
      <div className="absolute inset-0 glowfield opacity-60 pointer-events-none" />
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* üst bar */}
      <header className="relative flex items-center justify-between px-5 md:px-10 py-4 border-b border-line/70 bg-night/70 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="live-dot w-2.5 h-2.5 rounded-full bg-brand" />
          <span className="font-mono text-[12px] tracking-[0.26em] uppercase text-ink">
            Yayın Modu
          </span>
          <span className="font-mono text-[12px] text-ink-faint hidden sm:inline">
            · {dayLabel}
          </span>
        </div>
        <div className="flex items-center gap-3 md:gap-5">
          <span className="font-mono text-[13px] text-gold tabular-nums">
            {String(idx + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm border border-line text-ink-dim font-mono text-[11.5px] tracking-[0.2em] uppercase hover:text-brand hover:border-brand transition-colors cursor-pointer"
          >
            Kapat · ESC
          </button>
        </div>
      </header>

      {/* ilerleme */}
      <div className="relative h-[3px] bg-line/50">
        <div
          className="h-full bg-brand transition-all duration-500 ease-out"
          style={{ width: `${((idx + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* kart */}
      <main className="relative flex-1 flex items-center justify-center px-5 md:px-14 overflow-y-auto row-scroll">
        <div key={card.id} className="leaf-flip max-w-4xl w-full py-10">
          <div className="flex items-center gap-4 mb-7">
            <span
              className="font-mono text-[11px] tracking-[0.24em] uppercase font-semibold px-3 py-1 rounded-sm border"
              style={{
                color: catColor(card.category),
                borderColor: `${catColor(card.category)}66`,
                background: `${catColor(card.category)}14`,
              }}
            >
              {card.category}
            </span>
            <span className="font-mono text-[12px] text-ink-faint">≈ {card.minutes} dakika</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-[3.4rem] leading-[1.12] text-ink">
            {card.hook}
          </h2>
          <p className="mt-8 text-lg sm:text-xl md:text-[1.45rem] leading-[1.75] text-ink-dim">
            {card.body}
          </p>
        </div>
      </main>

      {/* alt bar */}
      <footer className="relative flex items-center justify-between gap-4 px-5 md:px-10 py-4 border-t border-line/70 bg-night/70 backdrop-blur-sm">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border border-line text-ink-dim font-mono text-[12px] tracking-[0.16em] uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:text-ink hover:border-gold/60 hover:-translate-x-0.5 transition-all duration-200 cursor-pointer"
        >
          <IconArrow dir="left" className="w-4 h-4" /> Önceki
        </button>

        <div className="flex items-center gap-1.5">
          {cards.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setIdx(i)}
              aria-label={`Kart ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === idx ? "w-7 bg-brand" : "w-2 bg-line hover:bg-ink-faint"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={doCopy}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border border-line text-ink-dim font-mono text-[12px] tracking-[0.16em] uppercase hover:text-teal hover:border-teal/60 transition-all duration-200 cursor-pointer"
          >
            <IconCopy className="w-3.5 h-3.5" /> Kopyala
          </button>
          <button
            onClick={next}
            disabled={idx === cards.length - 1}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-brand text-paper font-mono text-[12px] tracking-[0.16em] uppercase font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-deep hover:translate-x-0.5 transition-all duration-200 cursor-pointer"
          >
            Sonraki <IconArrow dir="right" className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
