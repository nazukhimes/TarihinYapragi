import { useEffect, useMemo, useState } from "react";
import { IconArrow } from "./ui";

export const MONTHS_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
export const WEEKDAYS_TR = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
export const WEEKDAYS_SHORT = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];

export function dayOfYear(month: number, day: number): number {
  const d = new Date(2024, month - 1, day);
  const start = new Date(2024, 0, 1);
  return Math.floor((d.getTime() - start.getTime()) / 86400000) + 1;
}

export function daysInMonth(month: number): number {
  return new Date(2024, month, 0).getDate();
}

/* ---------- canlı saat ---------- */
export function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="hidden md:flex items-center gap-2.5 font-mono text-[13px] text-ink-dim">
      <span className="live-dot w-2 h-2 rounded-full bg-brand" />
      <span className="tabular-nums">
        {pad(now.getHours())}:{pad(now.getMinutes())}:<span className="text-gold">{pad(now.getSeconds())}</span>
      </span>
    </div>
  );
}

/* ---------- takvim yaprağı ---------- */
export function CalendarLeaf({
  day,
  month,
  year,
  onChangeDay,
  onOpenPicker,
  pickerOpen,
  isToday,
}: {
  day: number;
  month: number;
  year: number;
  onChangeDay: (d: number, m: number) => void;
  onOpenPicker: () => void;
  pickerOpen: boolean;
  isToday: boolean;
}) {
  // yaprak: varsayılan 2024 referanslı (artık yıl) — hafta günü gerçek yıldan
  const weekday = useMemo(() => {
    const refYear = new Date().getFullYear();
    return WEEKDAYS_TR[new Date(refYear, month - 1, day).getDay()];
  }, [day, month]);

  const total = daysInMonth(month);
  const prev = () => onChangeDay(day === 1 ? daysInMonth(month === 1 ? 12 : month - 1) : day - 1, day === 1 ? (month === 1 ? 12 : month - 1) : month);
  const next = () => onChangeDay(day === total ? 1 : day + 1, day === total ? (month === 12 ? 1 : month + 1) : month);

  return (
    <div className="relative" style={{ perspective: "1400px" }}>
      {/* arkadaki yapraklar */}
      <div className="absolute inset-0 translate-y-3 translate-x-2 rounded-sm bg-paper-2/70 rotate-2" />
      <div className="absolute inset-0 translate-y-1.5 translate-x-1 rounded-sm bg-paper-2 rotate-1" />

      <div className="paper torn-edge relative w-full rounded-sm shadow-[0_30px_70px_rgba(4,6,10,0.55)] overflow-visible select-none">
        {/* zımba delikleri */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 flex gap-24 z-10">
          <span className="w-3 h-3 rounded-full bg-night shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
          <span className="w-3 h-3 rounded-full bg-night shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
        </div>

        {/* kırmızı bant */}
        <div className="bg-brand text-paper pt-7 pb-3 px-6 text-center relative">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-paper/50" />
            <p className="font-mono text-[11px] tracking-[0.32em] uppercase">Tarih Yaprağı · {year}</p>
            <span className="h-px w-8 bg-paper/50" />
          </div>
        </div>

        {/* gövde — tarih değişince çevrilir */}
        <div key={`${day}-${month}`} className="leaf-flip relative px-6 pt-5 pb-7 text-center">
          <div className="paper-grain absolute inset-0 pointer-events-none" />
          <p className="font-mono text-[12px] tracking-[0.3em] uppercase text-brand font-semibold">
            {weekday}
          </p>
          <p className="font-display font-black leading-none mt-1 text-inkpaper" style={{ fontSize: "clamp(6.5rem, 18vw, 11rem)" }}>
            {day}
          </p>
          <p className="font-display italic font-medium text-2xl md:text-3xl text-inkpaper/85 -mt-1">
            {MONTHS_TR[month - 1]}
          </p>

          <div className="mt-5 pt-4 border-t border-dashed border-inkpaper-dim/40 flex items-center justify-between font-mono text-[11px] text-inkpaper-dim">
            <span>Yılın {dayOfYear(month, day)}. günü</span>
            <span>{month}. ay</span>
          </div>

          <button
            onClick={onOpenPicker}
            className={`mt-5 w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-sm border transition-all duration-200 cursor-pointer ${
              pickerOpen
                ? "border-brand bg-brand text-paper shadow-[0_8px_20px_rgba(210,59,46,0.35)]"
                : "border-inkpaper-dim/50 text-inkpaper hover:border-brand hover:text-brand hover:shadow-[0_6px_18px_rgba(210,59,46,0.18)]"
            }`}
          >
            <span className="font-mono text-[12px] tracking-[0.18em] uppercase">{MONTHS_TR[month - 1]} takvimi</span>
            <IconArrow dir={pickerOpen ? "up" : "down"} className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* yaprak navigasyonu */}
      <div className="flex items-center justify-between mt-7">
        <button
          onClick={prev}
          aria-label="Önceki gün"
          className="group flex items-center gap-2 px-4 py-2.5 rounded-sm border border-line bg-panel text-ink-dim hover:text-ink hover:border-gold/60 hover:-translate-x-0.5 transition-all duration-200 cursor-pointer"
        >
          <IconArrow dir="left" className="w-4 h-4 group-hover:text-gold transition-colors" />
          <span className="font-mono text-[12px] tracking-widest uppercase">Önceki gün</span>
        </button>
        {isToday ? (
          <span className="flex items-center gap-2 font-mono text-[12px] tracking-[0.2em] uppercase text-gold">
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-gold" /> Bugün
          </span>
        ) : (
          <button
            onClick={() => {
              const t = new Date();
              onChangeDay(t.getDate(), t.getMonth() + 1);
            }}
            className="px-4 py-2.5 rounded-sm border border-gold/50 text-gold font-mono text-[12px] tracking-[0.2em] uppercase hover:bg-gold hover:text-night transition-all duration-200 cursor-pointer"
          >
            Bugüne dön
          </button>
        )}
        <button
          onClick={next}
          aria-label="Sonraki gün"
          className="group flex items-center gap-2 px-4 py-2.5 rounded-sm border border-line bg-panel text-ink-dim hover:text-ink hover:border-gold/60 hover:translate-x-0.5 transition-all duration-200 cursor-pointer"
        >
          <span className="font-mono text-[12px] tracking-widest uppercase">Sonraki gün</span>
          <IconArrow dir="right" className="w-4 h-4 group-hover:text-gold transition-colors" />
        </button>
      </div>

      <MiniCalendar
        open={pickerOpen}
        day={day}
        month={month}
        onPick={onChangeDay}
      />
    </div>
  );
}

/* ---------- ay ızgarası ---------- */
function MiniCalendar({
  open,
  day,
  month,
  onPick,
}: {
  open: boolean;
  day: number;
  month: number;
  onPick: (d: number, m: number) => void;
}) {
  const [viewMonth, setViewMonth] = useState(month);
  useEffect(() => {
    if (open) setViewMonth(month);
  }, [open, month]);

  if (!open) return null;

  const total = daysInMonth(viewMonth);
  const firstOffset = (new Date(2024, viewMonth - 1, 1).getDay() + 6) % 7; // Pzt başlangıç
  const today = new Date();

  return (
    <div className="rise-in mt-4 paper paper-grain relative rounded-sm p-5 shadow-[0_24px_60px_rgba(4,6,10,0.5)] border border-paper-2">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewMonth((m) => (m === 1 ? 12 : m - 1))}
          className="p-2 rounded-sm text-inkpaper-dim hover:text-brand hover:bg-brand/10 transition-colors cursor-pointer"
          aria-label="Önceki ay"
        >
          <IconArrow dir="left" className="w-4 h-4" />
        </button>
        <span className="font-display font-semibold text-xl text-inkpaper">{MONTHS_TR[viewMonth - 1]}</span>
        <button
          onClick={() => setViewMonth((m) => (m === 12 ? 1 : m + 1))}
          className="p-2 rounded-sm text-inkpaper-dim hover:text-brand hover:bg-brand/10 transition-colors cursor-pointer"
          aria-label="Sonraki ay"
        >
          <IconArrow dir="right" className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS_SHORT.map((w) => (
          <span key={w} className="text-center font-mono text-[10px] tracking-widest text-inkpaper-dim uppercase py-1">
            {w}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstOffset }).map((_, i) => (
          <span key={`x-${i}`} />
        ))}
        {Array.from({ length: total }).map((_, i) => {
          const d = i + 1;
          const selected = d === day && viewMonth === month;
          const isTodayCell =
            d === today.getDate() && viewMonth === today.getMonth() + 1;
          return (
            <button
              key={d}
              onClick={() => onPick(d, viewMonth)}
              className={`relative aspect-square rounded-sm font-mono text-[13px] transition-all duration-150 cursor-pointer ${
                selected
                  ? "bg-brand text-paper font-bold shadow-[0_6px_14px_rgba(210,59,46,0.4)]"
                  : "text-inkpaper hover:bg-brand/15 hover:text-brand hover:-translate-y-px"
              } ${isTodayCell && !selected ? "ring-1 ring-gold text-brand" : ""}`}
            >
              {d}
            </button>
          );
        })}
      </div>
      <p className="mt-4 font-mono text-[10.5px] text-inkpaper-dim text-center tracking-wide">
        Bir güne dokun — arşiv o güne çevrilir
      </p>
    </div>
  );
}

/* ---------- haber bandı ---------- */
export function Ticker({ items }: { items: { year: number; text: string }[] }) {
  if (items.length === 0) return null;
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-brand-deep/60 bg-[#1a1014] py-2.5 group">
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-brand pl-4 pr-5 shadow-[14px_0_24px_rgba(10,6,8,0.5)]">
        <span className="font-mono text-[11px] tracking-[0.24em] uppercase text-paper font-semibold whitespace-nowrap">
          Bugün Tarihte
        </span>
      </div>
      <div className="absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-[#1a1014] to-transparent pointer-events-none" />
      <div className="ticker-track flex items-center gap-10 whitespace-nowrap w-max">
        {loop.map((it, i) => (
          <span key={i} className="inline-flex items-center gap-3 text-[13.5px] text-ink/85">
            <span className="font-mono font-bold text-gold">{it.year}</span>
            <span className="text-brand">◆</span>
            <span className="max-w-[520px] truncate">{it.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
