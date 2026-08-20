import { useCallback, useEffect, useState } from "react";
import type { TalkCard } from "../data/curated";
import { copyText, IconArrow, IconCopy, IconMic, IconPlay, Reveal, toast } from "./ui";

const CAT_COLOR: Record<string, string> = {
  "Karanlık Tarih": "#e05b4b",
  Gizem: "#e05b4b",
  Bilim: "#43a08f",
  Teknoloji: "#43a08f",
  Uzay: "#e8b04b",
  "Keşif": "#e8b04b",
  "Gökyüzü": "#e8b04b",
  Kültür: "#c08bc9",
  Edebiyat: "#c08bc9",
  Tarih: "#6f9fd8",
  Dünya: "#6f9fd8",
  Ekonomi: "#dd8552",
  Havacılık: "#8fbf6a",
};

function catColor(c: string): string {
  return CAT_COLOR[c] || "#e8b04b";
}

/* ================= SOHBET KARTLARI ================= */

export function TalkSection({
  cards,
  dayLabel,
  onBroadcast,
}: {
  cards: TalkCard[];
  dayLabel: string;
  onBroadcast: () => void;
}) {
  if (cards.length === 0) return null;

  return (
    <div>
      {/* yayıncı bandı */}
      <Reveal className="mb-8">
        <div className="relative overflow-hidden rounded-sm border border-brand-deep/70 bg-gradient-to-r from-[#241318] via-[#1c1318] to-panel px-6 py-5 flex flex-wrap items-center gap-5">
          <div className="absolute inset-0 scanlines pointer-events-none" />
          <span className="w-11 h-11 grid place-items-center rounded-sm bg-brand text-paper shrink-0">
            <IconMic className="w-5.5 h-5.5" />
          </span>
          <div className="flex-1 min-w-[240px]">
            <p className="font-display font-semibold text-xl text-ink">Yayıncı kiti hazır</p>
            <p className="mt-0.5 text-[13.5px] text-ink-dim">
              {cards.length} kart · {cards.reduce((a, c) => a + c.minutes, 0)} dakikalık konuşma malzemesi · {dayLabel}
            </p>
          </div>
          <button
            onClick={onBroadcast}
            className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-sm bg-brand text-paper font-mono text-[12.5px] tracking-[0.18em] uppercase font-semibold hover:bg-brand-deep hover:shadow-[0_14px_34px_rgba(210,59,46,0.4)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            <IconPlay className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
            Yayın modunu başlat
          </button>
        </div>
      </Reveal>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {cards.map((c, i) => (
          <Reveal key={c.id} delay={Math.min(i * 70, 320)}>
            <TalkCardView card={c} index={i + 1} dayLabel={dayLabel} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function TalkCardView({ card, index, dayLabel }: { card: TalkCard; index: number; dayLabel: string }) {
  const [copied, setCopied] = useState(false);
  const color = catColor(card.category);

  const doCopy = async () => {
    const ok = await copyText(`${card.hook}\n\n${card.body}\n\n— Tarih Yaprağı arşivi · ${dayLabel}`);
    if (ok) {
      setCopied(true);
      toast("Kart panoya kopyalandı — yayına hazır");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast("Kopyalanamadı — tarayıcı izin vermedi");
    }
  };

  return (
    <article className="group h-full paper paper-grain relative rounded-sm overflow-hidden shadow-[0_16px_40px_rgba(4,6,10,0.4)] hover:-translate-y-1.5 hover:rotate-[0.4deg] hover:shadow-[0_26px_56px_rgba(4,6,10,0.55)] transition-all duration-300">
      {/* kırmızı kenar çizgisi */}
      <span className="absolute left-9 top-0 bottom-0 w-px bg-brand/45" />
      <div className="relative pl-13 pr-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase font-semibold px-2 py-0.5 rounded-sm" style={{ color, background: `${color}1f`, border: `1px solid ${color}55` }}>
            {card.category}
          </span>
          <span className="font-mono text-[10.5px] text-inkpaper-dim">KART {String(index).padStart(2, "0")}</span>
        </div>

        <h3 className="font-display font-bold text-[19px] leading-snug text-inkpaper">{card.hook}</h3>

        <div className="ruled mt-3">
          <p className="text-[13.5px] leading-[28px] text-inkpaper/85 min-h-[84px]">{card.body}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-dashed border-inkpaper-dim/40 flex items-center justify-between">
          <span className="font-mono text-[11px] text-inkpaper-dim">≈ {card.minutes} dk konuşma</span>
          <button
            onClick={doCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-mono text-[11px] tracking-widest uppercase transition-all duration-200 cursor-pointer ${
              copied
                ? "bg-teal text-night"
                : "border border-inkpaper-dim/50 text-inkpaper hover:border-brand hover:text-brand hover:bg-brand/10"
            }`}
          >
            <IconCopy className="w-3.5 h-3.5" />
            {copied ? "Kopyalandı" : "Kopyala"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ================= YAYIN MODU (teleprompter) ================= */

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
          <span className="font-mono text-[12px] tracking-[0.26em] uppercase text-ink">Yayın Modu</span>
          <span className="font-mono text-[12px] text-ink-faint hidden sm:inline">· {dayLabel}</span>
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
              style={{ color: catColor(card.category), borderColor: `${catColor(card.category)}66`, background: `${catColor(card.category)}14` }}
            >
              {card.category}
            </span>
            <span className="font-mono text-[12px] text-ink-faint">≈ {card.minutes} dakika</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-[3.4rem] leading-[1.12] text-ink">
            {card.hook}
          </h2>
          <p className="mt-8 text-lg sm:text-xl md:text-[1.45rem] leading-[1.75] text-ink-dim">{card.body}</p>
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
