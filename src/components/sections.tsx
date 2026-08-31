import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CATEGORIES,
  CASE_LABELS,
  type CategoryId,
  type CaseFile,
  type ScienceMilestone,
} from "../data";
import { classifyItem, type OtdItem } from "../lib/wiki";
import { IconArrow, IconExternal, IconSkull, Modal, Reveal } from "./ui";

const trLower = (s: string) => s.toLocaleLowerCase("tr-TR");

export function matchQuery(q: string, ...texts: (string | undefined)[]): boolean {
  if (!q.trim()) return true;
  const needle = trLower(q.trim());
  return texts.some((t) => t && trLower(t).includes(needle));
}

export function formatYear(y: number): string {
  return y < 0 ? `MÖ ${Math.abs(y)}` : `${y}`;
}

function centuryOf(y: number): string {
  const c = Math.floor((Math.abs(y) - 1) / 100) + 1;
  return `${y < 0 ? "MÖ " : ""}${c}. yüzyıl`;
}

/* ================= ZAMAN TÜNELİ ================= */

export interface MergedEvent {
  id: string;
  year: number;
  text: string;
  detail?: string;
  category: CategoryId;
  curated: boolean;
  page?: { title: string; extract?: string; url?: string };
}

export function TimelineSection({
  events,
  matched,
}: {
  events: MergedEvent[];
  /** Arama sonucuyla eşleşen alt küme — üst düzeyde (useAramaSonuclari) tek seferde
   * hesaplanır; burada yalnızca kimlik karşılaştırması yapılır, metin taraması
   * tekrarlanmaz (T-13 Adım 8). Arama yokken tüm `events` ile aynıdır. */
  matched: MergedEvent[];
}) {
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const matchedIds = useMemo(() => new Set(matched.map((e) => e.id)), [matched]);

  const visible = useMemo(
    () => events.filter((e) => (cat === "all" || e.category === cat) && matchedIds.has(e.id)),
    [events, cat, matchedIds]
  );

  const presentCats = useMemo(() => {
    const set = new Set<CategoryId>();
    events.forEach((e) => set.add(e.category));
    return Array.from(set);
  }, [events]);

  return (
    <div>
      {/* kategori filtresi */}
      <div className="flex flex-wrap gap-2 mb-8">
        <CatChip
          active={cat === "all"}
          color="#e8b04b"
          label={`Tümü · ${events.length}`}
          onClick={() => setCat("all")}
        />
        {presentCats.map((c) => {
          const n = events.filter((e) => e.category === c).length;
          return (
            <CatChip
              key={c}
              active={cat === c}
              color={CATEGORIES[c].color}
              label={`${CATEGORIES[c].label} · ${n}`}
              onClick={() => setCat(cat === c ? "all" : c)}
            />
          );
        })}
      </div>

      {visible.length === 0 ? (
        <EmptyNote text="Bu filtrede kayıt yok — başka bir kategori ya da arama deneyin." />
      ) : (
        <ol className="relative border-l border-line ml-2 md:ml-4">
          {visible.map((e, i) => {
            const prev = visible[i - 1];
            const showCentury = !prev || centuryOf(prev.year) !== centuryOf(e.year);
            const open = openId === e.id;
            const catInfo = CATEGORIES[e.category];
            return (
              <li key={e.id}>
                {showCentury && (
                  <Reveal className="relative pl-8 md:pl-12 pt-8 pb-2">
                    <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-ink-faint">
                      {centuryOf(e.year).toUpperCase()}
                    </span>
                  </Reveal>
                )}
                <Reveal delay={Math.min(i * 40, 240)} className="relative pl-8 md:pl-12 pb-6 group">
                  <span
                    className="absolute -left-[7px] top-2.5 w-3.5 h-3.5 rounded-full border-2 border-night transition-transform duration-300 group-hover:scale-125"
                    style={{ background: catInfo.color }}
                  />
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span
                      className="font-mono font-bold text-lg tabular-nums"
                      style={{ color: catInfo.color }}
                    >
                      {formatYear(e.year)}
                    </span>
                    <span
                      className="font-mono text-[10px] tracking-[0.18em] uppercase px-2 py-0.5 rounded-sm"
                      style={{
                        color: catInfo.color,
                        background: `${catInfo.color}1f`,
                        border: `1px solid ${catInfo.color}44`,
                      }}
                    >
                      {catInfo.label}
                    </span>
                    {e.curated && (
                      <span className="font-mono text-[10px] tracking-[0.18em] uppercase px-2 py-0.5 rounded-sm text-paper bg-inkpaper/80 border border-inkpaper">
                        Editör notu
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-ink/92 max-w-3xl">
                    {e.text}
                  </p>

                  {(e.detail || e.page?.extract || e.page?.url) && (
                    <div className="mt-2.5 flex items-center gap-4">
                      <button
                        onClick={() => setOpenId(open ? null : e.id)}
                        className="inline-flex items-center gap-1.5 font-mono text-[12px] tracking-wider uppercase text-gold transition-colors duration-200 hover:text-paper cursor-pointer"
                      >
                        <span className="underline decoration-gold/40 underline-offset-4 hover:decoration-paper">
                          {open ? "Gizle" : "Detayı aç"}
                        </span>
                        <IconArrow dir={open ? "up" : "down"} className="w-3 h-3" />
                      </button>
                      {e.page?.url && (
                        <a
                          href={e.page.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[12px] tracking-wider uppercase text-ink-faint hover:text-sky transition-colors"
                        >
                          Vikipedi <IconExternal className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  {open && (
                    <div
                      className="rise-in mt-3 max-w-3xl border-l-2 pl-4 py-1 text-[14.5px] leading-relaxed text-ink-dim"
                      style={{ borderColor: catInfo.color }}
                    >
                      {e.detail || e.page?.extract}
                    </div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function CatChip({
  active,
  color,
  label,
  onClick,
}: {
  active: boolean;
  color: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="px-3.5 py-1.5 rounded-sm font-mono text-[12px] tracking-wide transition-all duration-200 cursor-pointer border"
      style={
        active
          ? {
              background: color,
              color: "#12161d",
              borderColor: color,
              boxShadow: `0 6px 16px ${color}44`,
            }
          : { color: "#a8a99f", borderColor: "#28303f", background: "transparent" }
      }
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.borderColor = `${color}88`;
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.borderColor = "#28303f";
      }}
    >
      {label}
    </button>
  );
}

export function EmptyNote({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-line rounded-sm px-6 py-10 text-center font-mono text-[13px] text-ink-faint">
      {text}
    </div>
  );
}

/* ================= DOĞANLAR / KAYBETTİKLERİMİZ ================= */

export interface PersonCard {
  id: string;
  name: string;
  year: number;
  years?: string;
  category: CategoryId;
  description?: string;
  extract?: string;
  thumb?: string;
  url?: string;
  lang: "tr" | "en";
}

export function itemToPeople(items: OtdItem[], kind: "births" | "deaths"): PersonCard[] {
  const out: PersonCard[] = [];
  for (const it of items) {
    const p = it.pages?.[0];
    if (!p) continue;
    const probe = `${p.title} ${p.description || ""} ${p.extract || ""} ${it.text}`;
    out.push({
      id: `${kind}-${it.id}`,
      name: p.normalizedtitle || p.title,
      year: it.year,
      category: classifyItem(probe),
      description: p.description,
      extract: p.extract,
      thumb: p.thumbnail?.source,
      url: p.content_urls?.desktop?.page,
      lang: it.lang,
    });
  }
  return out;
}

const MONOGRAM_COLORS = ["#d23b2e", "#e8b04b", "#43a08f", "#6f9fd8", "#c08bc9", "#dd8552"];

export function PeopleRow({
  people,
  matched,
  accentLabel,
  accentColor,
  emptyText,
}: {
  people: PersonCard[];
  /** bkz. TimelineSection'daki `matched` notu. */
  matched: PersonCard[];
  accentLabel: string;
  accentColor: string;
  emptyText: string;
}) {
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [modal, setModal] = useState<PersonCard | null>(null);

  const presentCats = useMemo(() => {
    const set = new Set<CategoryId>();
    people.forEach((p) => set.add(p.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [people]);

  const matchedIds = useMemo(() => new Set(matched.map((p) => p.id)), [matched]);

  const visible = useMemo(
    () => people.filter((p) => (cat === "all" || p.category === cat) && matchedIds.has(p.id)),
    [people, cat, matchedIds]
  );

  if (people.length === 0) {
    return <EmptyNote text={emptyText} />;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        <CatChip
          active={cat === "all"}
          color={accentColor}
          label={`Tümü · ${people.length}`}
          onClick={() => setCat("all")}
        />
        {presentCats.map((c) => (
          <CatChip
            key={c}
            active={cat === c}
            color={CATEGORIES[c].color}
            label={CATEGORIES[c].label}
            onClick={() => setCat(cat === c ? "all" : c)}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyNote text="Bu filtrede kişi yok." />
      ) : (
        <div className="row-scroll flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 snap-x">
          {visible.map((p, i) => {
            const monoColor = MONOGRAM_COLORS[(p.name.length + i) % MONOGRAM_COLORS.length];
            const catInfo = CATEGORIES[p.category];
            return (
              <Reveal
                key={p.id}
                delay={Math.min(i * 50, 300)}
                className="snap-start shrink-0 w-[248px] group cursor-pointer"
              >
                <button
                  onClick={() => setModal(p)}
                  className="w-full h-full text-left rounded-sm border border-line bg-panel hover:border-gold/50 hover:-translate-y-1.5 hover:shadow-[0_20px_44px_rgba(0,0,0,0.45)] transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="relative h-[132px] overflow-hidden bg-panel-2">
                    {p.thumb ? (
                      <img
                        src={p.thumb}
                        alt={p.name}
                        loading="lazy"
                        width={248}
                        height={132}
                        decoding="async"
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-108"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `${monoColor}22` }}
                      >
                        <span
                          className="font-display font-black text-5xl"
                          style={{ color: monoColor }}
                        >
                          {p.name
                            .replace(/[.*_"”“]/g, "")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span
                      className="absolute top-2.5 left-2.5 font-mono text-[11px] font-bold px-2 py-0.5 rounded-sm bg-night/80 backdrop-blur-sm"
                      style={{ color: accentColor }}
                    >
                      {formatYear(p.year)}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: catInfo.color }}
                      />
                      <span
                        className="font-mono text-[10px] tracking-[0.16em] uppercase"
                        style={{ color: catInfo.color }}
                      >
                        {catInfo.label}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-[17px] leading-snug text-ink group-hover:text-gold transition-colors duration-200">
                      {p.name}
                    </h3>
                    {p.description && (
                      <p className="mt-1 text-[12px] leading-snug text-ink-faint line-clamp-2">
                        {p.description}
                      </p>
                    )}
                    {p.extract && (
                      <p className="mt-2 text-[13px] leading-relaxed text-ink-dim line-clamp-3">
                        {p.extract}
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase text-ink-faint group-hover:text-gold transition-colors">
                      Dosya <IconArrow dir="right" className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal onClose={() => setModal(null)} titleId={`person-modal-${modal.id}`}>
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-5">
              <span
                className="font-mono text-[11px] tracking-[0.24em] uppercase"
                style={{ color: accentColor }}
              >
                {accentLabel} · {formatYear(modal.year)}
              </span>
              <button
                onClick={() => setModal(null)}
                className="w-9 h-9 grid place-items-center rounded-sm border border-line text-ink-dim hover:text-brand hover:border-brand transition-colors cursor-pointer"
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-5 items-start">
              {modal.thumb && (
                <img
                  src={modal.thumb}
                  alt={modal.name}
                  width={96}
                  height={112}
                  className="w-24 h-28 object-cover object-top rounded-sm border border-line shrink-0"
                />
              )}
              <div>
                <h3
                  id={`person-modal-${modal.id}`}
                  className="font-display font-bold text-2xl md:text-3xl leading-tight text-ink"
                >
                  {modal.name}
                </h3>
                <span
                  className="mt-2 inline-block font-mono text-[10.5px] tracking-[0.16em] uppercase px-2 py-1 rounded-sm"
                  style={{
                    color: CATEGORIES[modal.category].color,
                    background: `${CATEGORIES[modal.category].color}1c`,
                    border: `1px solid ${CATEGORIES[modal.category].color}44`,
                  }}
                >
                  {CATEGORIES[modal.category].label}
                </span>
              </div>
            </div>
            {modal.extract && (
              <p className="mt-5 text-[15px] leading-relaxed text-ink-dim">{modal.extract}</p>
            )}
            {modal.url && (
              <a
                href={modal.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-gold text-night font-mono text-[12px] tracking-[0.18em] uppercase font-semibold hover:bg-paper transition-colors duration-200"
              >
                Vikipedi'de oku <IconExternal className="w-3.5 h-3.5" />
              </a>
            )}
            <p className="mt-4 font-mono text-[11px] text-ink-faint">
              Kaynak: {modal.lang === "tr" ? "Türkçe" : "İngilizce"} Vikipedi arşivi
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= KARANLIK DOSYALAR ================= */

const CASES_LIMIT = 6;

export function CasesSection({
  cases,
  matched,
}: {
  cases: CaseFile[];
  /** bkz. TimelineSection'daki `matched` notu. */
  matched: CaseFile[];
}) {
  const [openId, setOpenId] = useState<string | null>(cases[0]?.id ?? null);
  const [hepsi, setHepsi] = useState(false);

  useEffect(() => {
    setOpenId(cases[0]?.id ?? null);
    setHepsi(false);
  }, [cases]);

  const matchedIds = useMemo(() => new Set(matched.map((c) => c.id)), [matched]);
  const visible = cases.filter((c) => matchedIds.has(c.id));
  const gosterilecek = hepsi ? visible : visible.slice(0, CASES_LIMIT);

  if (cases.length === 0) {
    return (
      <div className="flex items-start gap-4 border border-dashed border-line rounded-sm px-6 py-8">
        <IconSkull className="w-6 h-6 text-ink-faint mt-1" />
        <div>
          <p className="font-display italic text-lg text-ink-dim">
            Bu gün için arşivde karanlık dosya yok.
          </p>
          <p className="mt-1.5 text-[13.5px] text-ink-faint leading-relaxed max-w-xl">
            Her gün karanlık değil — ama ölümler bölümündeki suikast, infaz ve felaket kayıtları
            otomatik olarak burada listelenir. Editörün özel dosyaları ise işaretli tarihlerde
            açılır.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {visible.length === 0 && (
        <div className="md:col-span-2">
          <EmptyNote text="Aramanla eşleşen dosya yok." />
        </div>
      )}
      {gosterilecek.map((c, i) => {
        const open = openId === c.id;
        return (
          <Reveal key={c.id} delay={Math.min(i * 70, 280)}>
            <article
              className={`relative h-full rounded-sm border transition-all duration-300 overflow-hidden group ${
                open
                  ? "border-brand/70 bg-[#1c1318]"
                  : "border-line bg-panel hover:border-brand/50 hover:-translate-y-1"
              }`}
            >
              {/* dosya üst bandı */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-line/80 bg-night/40">
                <div className="flex items-center gap-3">
                  <IconSkull className="w-4.5 h-4.5 text-brand" />
                  <span className="font-mono text-[12px] font-bold tracking-[0.2em] text-brand">
                    {CASE_LABELS[c.type]}
                  </span>
                </div>
                <span className="font-mono text-[12px] tabular-nums text-ink-faint">
                  DOSYA {formatYear(c.year)}
                </span>
              </div>

              <div className="p-5 relative">
                {/* damga */}
                <span
                  className={`stamp-in pointer-events-none absolute top-4 right-4 select-none font-mono text-[10px] font-bold tracking-[0.22em] px-2.5 py-1 border-2 rounded-sm ${
                    c.status === "FAİLİ MEÇHUL"
                      ? "text-brand border-brand/80"
                      : c.status === "SÜRÜYOR"
                        ? "text-gold border-gold/80"
                        : "text-ink-faint border-ink-faint/60"
                  }`}
                  style={{ transform: "rotate(-8deg)" }}
                >
                  {c.status}
                </span>

                <h3 className="font-display font-bold text-[21px] leading-snug text-ink pr-24 group-hover:text-gold/95 transition-colors duration-200">
                  {c.title}
                </h3>
                <p className="mt-1 font-mono text-[11.5px] tracking-wide text-copper">
                  {c.location}
                </p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-dim">{c.summary}</p>

                {open && (
                  <div className="rise-in mt-4 pt-4 border-t border-dashed border-line">
                    <p className="text-[14px] leading-relaxed text-ink-dim">{c.detail}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10.5px] px-2 py-0.5 rounded-sm bg-night/60 border border-line text-ink-faint"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setOpenId(open ? null : c.id)}
                    className="inline-flex items-center gap-1.5 font-mono text-[12px] tracking-widest uppercase text-brand hover:text-paper transition-colors cursor-pointer"
                  >
                    {open ? "Dosyayı kapat" : "Dosyayı aç"}
                    <IconArrow dir={open ? "up" : "down"} className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
      {!hepsi && visible.length > CASES_LIMIT && (
        <button
          onClick={() => setHepsi(true)}
          className="md:col-span-2 border border-dashed border-line rounded-sm py-4
                     font-mono text-[12px] tracking-widest uppercase text-ink-faint
                     hover:text-brand hover:border-brand/60 transition-colors cursor-pointer"
        >
          {visible.length - CASES_LIMIT} dosya daha göster
        </button>
      )}
    </div>
  );
}

/* ================= BİLİM & KEŞİF ================= */

const SCIENCE_LIMIT = 3;

export function ScienceSection({
  items,
  matched,
}: {
  items: (ScienceMilestone & { curated?: boolean })[];
  /** bkz. TimelineSection'daki `matched` notu. */
  matched: (ScienceMilestone & { curated?: boolean })[];
}) {
  const [hepsi, setHepsi] = useState(false);
  const matchedIds = useMemo(() => new Set(matched.map((s) => s.id)), [matched]);
  const visible = items.filter((s) => matchedIds.has(s.id));
  const gosterilecek = hepsi ? visible : visible.slice(0, SCIENCE_LIMIT);

  useEffect(() => {
    setHepsi(false);
  }, [items]);

  if (visible.length === 0) {
    return (
      <EmptyNote text="Bu gün için bilim kaydına rastlanmadı — takvimi çevir, evren bir yerde konuşuyor." />
    );
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
      {gosterilecek.map((s, i) => (
        <Reveal key={s.id} delay={Math.min(i * 70, 280)}>
          <article className="group h-full rounded-sm border border-line bg-panel p-5 hover:border-teal/60 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(0,0,0,0.4)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute -top-6 -right-4 font-display font-black text-[86px] leading-none outline-num select-none">
              {formatYear(s.year).slice(0, 4)}
            </div>
            <div className="relative">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-8 h-8 grid place-items-center rounded-sm border border-teal/50 text-teal">
                  <AtomMini />
                </span>
                <span className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-teal">
                  {s.field}
                </span>
                {s.curated && (
                  <span className="ml-auto font-mono text-[9.5px] tracking-[0.18em] uppercase px-1.5 py-0.5 rounded-sm bg-gold/15 text-gold border border-gold/40">
                    Editör
                  </span>
                )}
              </div>
              <p className="font-mono font-bold text-lg text-gold tabular-nums">
                {formatYear(s.year)}
              </p>
              <h3 className="mt-1.5 font-display font-semibold text-[19px] leading-snug text-ink group-hover:text-teal transition-colors duration-200">
                {s.title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-dim">{s.summary}</p>
            </div>
          </article>
        </Reveal>
      ))}
      {!hepsi && visible.length > SCIENCE_LIMIT && (
        <button
          onClick={() => setHepsi(true)}
          className="md:col-span-2 xl:col-span-3 border border-dashed border-line rounded-sm py-4
                     font-mono text-[12px] tracking-widest uppercase text-ink-faint
                     hover:text-teal hover:border-teal/60 transition-colors cursor-pointer"
        >
          {visible.length - SCIENCE_LIMIT} kayıt daha göster
        </button>
      )}
    </div>
  );
}

function AtomMini() {
  return (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.4" stroke="currentColor" strokeWidth="1.4" />
      <ellipse
        cx="12"
        cy="12"
        rx="8.5"
        ry="3.4"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="8.5"
        ry="3.4"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(-60 12 12)"
      />
    </svg>
  );
}

/* ================= genel yardımcı: bölüm kabuğu ================= */
export function SectionShell({
  children,
  id,
  labelledBy,
}: {
  children: ReactNode;
  id: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className="section-shell relative scroll-mt-28">
      {children}
    </section>
  );
}
