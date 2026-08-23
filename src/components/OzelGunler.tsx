import { CURATED, type CuratedDay } from "../data";
import { MONTHS_TR } from "./leaf";
import { Reveal } from "./ui";

export function OzelGunler({
  day,
  month,
  curated,
  setDate,
}: {
  day: number;
  month: number;
  curated: CuratedDay | undefined;
  setDate: (d: number, m: number) => void;
}) {
  return (
    <Reveal delay={200} className="lg:col-span-2 mt-2 lg:mt-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="font-mono text-[11px] tracking-[0.26em] uppercase text-ink-faint mr-1">
          Özel dosyalı günler
        </span>
        {Object.keys(CURATED)
          .sort()
          .map((k) => {
            const [m, d] = k.split("-").map(Number);
            const active = d === day && m === month;
            return (
              <button
                key={k}
                onClick={() => {
                  setDate(d, m);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-3 py-1.5 rounded-sm font-mono text-[11.5px] tracking-wide transition-all duration-200 cursor-pointer border ${
                  active
                    ? "bg-gold text-night border-gold font-semibold shadow-[0_8px_18px_rgba(232,176,75,0.3)]"
                    : "border-line text-ink-dim hover:border-gold/60 hover:text-gold hover:-translate-y-0.5"
                }`}
              >
                {d} {MONTHS_TR[m - 1].slice(0, 3)}
              </button>
            );
          })}
        {curated && (
          <span className="rise-in font-mono text-[11px] tracking-[0.2em] uppercase text-gold ml-1">
            ◆ dosya açık
          </span>
        )}
      </div>
    </Reveal>
  );
}
