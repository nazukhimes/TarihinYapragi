import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "../lib/useInView";

/* ---------- scroll reveal ---------- */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${inView ? "in-view" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ---------- sayaç ---------- */
export function CountUp({ to, duration = 900 }: { to: number; duration?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [val, setVal] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    if (!inView) return;

    const from = prev.current; // önceki değerden yenisine yumuşak geçiş
    const t0 = performance.now();
    let raf = 0;

    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [to, duration, inView]); // ← to değişince YENİDEN çalışır

  return <span ref={ref}>{val}</span>;
}

/* ---------- bölüm başlığı ---------- */
export function SectionHead({
  index,
  kicker,
  title,
  desc,
  accent = "#e8b04b",
  right,
}: {
  index: string;
  kicker: string;
  title: string;
  desc?: string;
  accent?: string;
  right?: ReactNode;
}) {
  return (
    <Reveal className="mb-8">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[11px] tracking-[0.28em] text-ink-faint">
              BÖLÜM {index}
            </span>
            <span className="h-px w-10" style={{ background: accent }} />
            <span
              className="font-mono text-[11px] tracking-[0.22em] uppercase"
              style={{ color: accent }}
            >
              {kicker}
            </span>
          </div>
          <h2 id={`baslik-${index}`} className="font-display font-semibold text-3xl md:text-[2.6rem] leading-[1.05] text-ink">
            {title}
          </h2>
          {desc && <p className="mt-3 text-ink-dim max-w-xl text-[15px] leading-relaxed">{desc}</p>}
        </div>
        {right && <div className="mb-1">{right}</div>}
      </div>
    </Reveal>
  );
}

/* ---------- modal ---------- */
export function Modal({
  onClose,
  children,
  titleId,
}: {
  onClose: () => void;
  children: ReactNode;
  titleId?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const oncekiOdak = useRef<HTMLElement | null>(null);

  useEffect(() => {
    oncekiOdak.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;

      const odaklanabilir = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!odaklanabilir?.length) return;

      const ilk = odaklanabilir[0];
      const son = odaklanabilir[odaklanabilir.length - 1];

      if (e.shiftKey && document.activeElement === ilk) { e.preventDefault(); son.focus(); }
      else if (!e.shiftKey && document.activeElement === son) { e.preventDefault(); ilk.focus(); }
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      oncekiOdak.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        aria-label="Kapat"
        className="absolute inset-0 bg-night/85 backdrop-blur-[3px] cursor-default"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="modal-in relative w-full sm:max-w-2xl max-h-[86vh] overflow-y-auto row-scroll rounded-t-xl sm:rounded-md border border-line bg-panel shadow-[0_40px_90px_rgba(0,0,0,0.6)]"
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- toast ---------- */
type ToastEvt = CustomEvent<{ msg: string }>;

export function toast(msg: string) {
  window.dispatchEvent(new CustomEvent("ty-toast", { detail: { msg } }) as ToastEvt);
}

export function Toaster() {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const { msg } = (e as ToastEvt).detail;
      const id = Date.now() + Math.random();
      setItems((xs) => [...xs.slice(-2), { id, msg }]);
      setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 2600);
    };
    window.addEventListener("ty-toast", onToast);
    return () => window.removeEventListener("ty-toast", onToast);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex flex-col items-center gap-2 pointer-events-none"
    >
      {items.map((t) => (
        <div
          key={t.id}
          className="rise-in px-5 py-2.5 rounded-sm border border-gold/40 bg-[#1e1a10] text-gold font-mono text-[13px] shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ---------- kopyala ---------- */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

/* ---------- özel ikonlar (elle çizim) ---------- */
const ic = "inline-block shrink-0";

export function IconLeafMark({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${ic} ${className}`} fill="none" aria-hidden>
      <path
        d="M4 4h16v12H4z"
        fill="currentColor"
        opacity="0.16"
      />
      <path d="M4 4h16v5H4z" fill="currentColor" />
      <path d="M4 9v11l2-1.4 2 1.4 2-1.4 2 1.4 2-1.4 2 1.4 2-1.4 2 1.4V9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 6.5h.01M12 6.5h.01" stroke="#f2ead9" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconArrow({ dir = "right", className = "w-4 h-4" }: { dir?: "left" | "right" | "up" | "down"; className?: string }) {
  const rot = { right: 0, down: 90, left: 180, up: 270 }[dir];
  return (
    <svg viewBox="0 0 24 24" className={`${ic} ${className}`} fill="none" style={{ transform: `rotate(${rot}deg)` }} aria-hidden>
      <path d="M4 12h15M13 5.5 19.5 12 13 18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconQuill({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${ic} ${className}`} fill="none" aria-hidden>
      <path d="M20 4c-6.5.6-11 3.5-13.2 8.8L5 20l7.2-1.8C17.5 16 19.4 11.5 20 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M5 20C8.5 13.5 13 9.5 18 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconDossier({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${ic} ${className}`} fill="none" aria-hidden>
      <path d="M5 4h9l3 3v13H5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 4v3h3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.5 12h5M8.5 15h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="15.5" cy="15.5" r="3.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconAtom({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${ic} ${className}`} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="currentColor" strokeWidth="1.4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="currentColor" strokeWidth="1.4" transform="rotate(-60 12 12)" />
    </svg>
  );
}

export function IconMic({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${ic} ${className}`} fill="none" aria-hidden>
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconPlay({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${ic} ${className}`} fill="currentColor" aria-hidden>
      <path d="M7 4.8v14.4L19.2 12 7 4.8Z" />
    </svg>
  );
}

export function IconCopy({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${ic} ${className}`} fill="none" aria-hidden>
      <rect x="8.5" y="8.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.5 5.5v-1a1.5 1.5 0 0 0-1.5-1.5H5.5A1.5 1.5 0 0 0 4 4.5V13a1.5 1.5 0 0 0 1.5 1.5h1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function IconSearch({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${ic} ${className}`} fill="none" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m15.6 15.6 4.4 4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconShare({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${ic} ${className}`} fill="none" aria-hidden>
      <circle cx="18" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.2 10.7 15.8 6.8M8.2 13.3l7.6 3.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconExternal({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${ic} ${className}`} fill="none" aria-hidden>
      <path d="M10 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13.5 4.5H19.5V10.5M19 5l-8.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconClock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${ic} ${className}`} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5.2l3.4 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSkull({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${ic} ${className}`} fill="none" aria-hidden>
      <path d="M12 3.5c-4.4 0-7.5 3.2-7.5 7.4 0 2.5 1.2 4.4 2.9 5.7v3.4a1.5 1.5 0 0 0 1.5 1.5h6.2a1.5 1.5 0 0 0 1.5-1.5v-3.4c1.7-1.3 2.9-3.2 2.9-5.7 0-4.2-3.1-7.4-7.5-7.4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="9" cy="11.5" r="1.7" fill="currentColor" />
      <circle cx="15" cy="11.5" r="1.7" fill="currentColor" />
      <path d="M12 14.5v1.6M10 21.5v-1.8M14 21.5v-1.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
