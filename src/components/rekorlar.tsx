import { useEffect, useMemo, useState } from "react";
import {
  RECORD_SCOPES,
  RECORD_STATUS_LABELS,
  type RecordScope,
  type WorldRecord,
} from "../data/types";
import { rekorMetni } from "../lib/rekor";
import type { WikidataRekor } from "../lib/wikidata";
import { copyText, IconArrow, IconCopy, IconExternal, Reveal, toast } from "./ui";
import { EmptyNote, formatYear } from "./sections";

/* ================= REKORLAR KASASI ================= */

/**
 * Bölüm iki kaynaktan beslenir ve ikisi görsel olarak ayrılır (ürün ilkesi 3,
 * "kaynağı gizleme"): editör havuzu altın "Editör" rozetiyle, Wikidata'dan
 * canlı gelen kayıtlar ayrı bir şeritte ve "Wikidata" etiketiyle.
 */

export function RekorlarSection({
  records,
  matched,
  wikidata,
  wikidataLoading,
}: {
  records: WorldRecord[];
  /** Arama sonucuyla eşleşen alt küme — bkz. TimelineSection'daki `matched` notu. */
  matched: WorldRecord[];
  wikidata: WikidataRekor[];
  wikidataLoading: boolean;
}) {
  const [kapsam, setKapsam] = useState<RecordScope | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const matchedIds = useMemo(() => new Set(matched.map((r) => r.id)), [matched]);

  useEffect(() => {
    setKapsam("all");
    setOpenId(null);
  }, [records]);

  const gorunur = useMemo(
    () => records.filter((r) => (kapsam === "all" || r.scope === kapsam) && matchedIds.has(r.id)),
    [records, kapsam, matchedIds]
  );

  /** Yalnızca bu günde gerçekten bulunan kapsamlar çip olarak gösterilir. */
  const kapsamlar = useMemo(() => {
    const set = new Set<RecordScope>();
    records.filter((r) => matchedIds.has(r.id)).forEach((r) => set.add(r.scope));
    return [...set];
  }, [records, matchedIds]);

  if (records.length === 0) {
    return <EmptyNote text="Rekor kasası bu gün için boş kaldı — takvimi çevir." />;
  }

  return (
    <div>
      {kapsamlar.length > 1 && (
        <Reveal className="mb-6">
          <div className="flex gap-2 flex-wrap">
            <FiltreCipi
              aktif={kapsam === "all"}
              onClick={() => setKapsam("all")}
              renk="#dd8552"
              label="Tümü"
            />
            {kapsamlar.map((s) => (
              <FiltreCipi
                key={s}
                aktif={kapsam === s}
                onClick={() => setKapsam(s)}
                renk={RECORD_SCOPES[s].color}
                label={RECORD_SCOPES[s].label}
              />
            ))}
          </div>
        </Reveal>
      )}

      {gorunur.length === 0 ? (
        <EmptyNote text="Aramanla eşleşen rekor yok." />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {gorunur.map((r, i) => (
            <RekorKarti
              key={r.id}
              r={r}
              index={i}
              open={openId === r.id}
              onToggle={() => setOpenId(openId === r.id ? null : r.id)}
            />
          ))}
        </div>
      )}

      <WikidataSeridi items={wikidata} loading={wikidataLoading} />
    </div>
  );
}

function FiltreCipi({
  aktif,
  onClick,
  renk,
  label,
}: {
  aktif: boolean;
  onClick: () => void;
  renk: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={aktif}
      className="px-3.5 py-1.5 rounded-sm border font-mono text-[11px] tracking-[0.16em] uppercase transition-colors duration-200 cursor-pointer"
      style={
        aktif
          ? { borderColor: renk, color: renk, background: `${renk}1a` }
          : { borderColor: "#28303f", color: "#8b909c" }
      }
    >
      {label}
    </button>
  );
}

function RekorKarti({
  r,
  index,
  open,
  onToggle,
}: {
  r: WorldRecord;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const renk = RECORD_SCOPES[r.scope].color;
  const sabit = !!r.date;

  const kopyala = async () => {
    const ok = await copyText(
      `${r.opener ? r.opener + "\n\n" : ""}${r.title} — ${r.holder} (${r.value}, ${formatYear(r.year)})\n\n${rekorMetni(r)}`
    );
    toast(ok ? "Rekor kartı panoya kopyalandı" : "Kopyalanamadı");
  };

  return (
    <Reveal delay={Math.min(index * 70, 280)}>
      <article
        className={`relative h-full rounded-sm border transition-all duration-300 overflow-hidden group ${
          open ? "border-copper/70 bg-[#1b1611]" : "border-line bg-panel hover:-translate-y-1"
        }`}
        style={open ? undefined : { borderColor: undefined }}
      >
        {/* üst bant: kapsam + kaynak rozeti */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-line/80 bg-night/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <IconMadalya className="w-4.5 h-4.5 shrink-0" style={{ color: renk }} />
            <span
              className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase truncate"
              style={{ color: renk }}
            >
              {RECORD_SCOPES[r.scope].label}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {sabit && (
              <span className="font-mono text-[9.5px] tracking-[0.16em] uppercase px-1.5 py-0.5 rounded-sm bg-copper/15 text-copper border border-copper/40">
                Bugün
              </span>
            )}
            <span className="font-mono text-[9.5px] tracking-[0.18em] uppercase px-1.5 py-0.5 rounded-sm bg-gold/15 text-gold border border-gold/40">
              Editör
            </span>
          </div>
        </div>

        <div className="p-5 relative">
          {/* durum damgası */}
          <span
            className={`stamp-in pointer-events-none absolute top-4 right-4 select-none font-mono text-[9.5px] font-bold tracking-[0.18em] px-2.5 py-1 border-2 rounded-sm ${
              r.status === "GÜNCEL"
                ? "text-leaf border-leaf/70"
                : r.status === "KIRILDI"
                  ? "text-ink-faint border-ink-faint/60"
                  : "text-brand border-brand/70"
            }`}
            style={{ transform: "rotate(-8deg)" }}
          >
            {RECORD_STATUS_LABELS[r.status]}
          </span>

          {/* rekorun rakamı — kartın yıldızı */}
          <p
            className="font-display font-black text-[30px] leading-none tabular-nums pr-28"
            style={{ color: renk }}
          >
            {r.value}
          </p>

          <h3 className="mt-2.5 font-display font-bold text-[20px] leading-snug text-ink">
            {r.title}
          </h3>

          <p className="mt-1 font-mono text-[11.5px] tracking-wide text-copper">
            {r.holder}
            {r.place ? ` · ${r.place}` : ""} · {formatYear(r.year)}
          </p>

          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-dim">{r.summary}</p>

          {r.status === "KIRILDI" && r.brokenBy && (
            <p className="mt-2 font-mono text-[11.5px] text-ink-faint">
              Rekoru devralan: <span className="text-ink-dim">{r.brokenBy}</span>
            </p>
          )}

          {open && (
            <div className="rise-in mt-4 pt-4 border-t border-dashed border-line space-y-3">
              <p className="text-[14px] leading-relaxed text-ink-dim">{r.story}</p>

              {r.compare && (
                <p className="text-[14px] leading-relaxed text-ink pl-3 border-l-2 border-copper/60">
                  {r.compare}
                </p>
              )}

              {r.opener && (
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-1">
                    Yayın açılışı
                  </p>
                  <p className="font-display italic text-[15px] leading-relaxed text-gold">
                    “{r.opener}”
                  </p>
                </div>
              )}

              {r.question && (
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-1">
                    Sohbeti açan soru
                  </p>
                  <p className="text-[14px] leading-relaxed text-ink-dim">{r.question}</p>
                </div>
              )}

              {!r.official && (
                <p className="font-mono text-[11px] text-copper leading-relaxed">
                  Bu unvan resmen onaylanmış değil — “en”i tartışmalı bir kayıt.
                </p>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex flex-wrap gap-1.5">
              {r.tags.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[10.5px] px-2 py-0.5 rounded-sm bg-night/60 border border-line text-ink-faint"
                >
                  #{t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3.5">
              {open && (
                <>
                  <button
                    onClick={kopyala}
                    className="inline-flex items-center gap-1.5 font-mono text-[11.5px] tracking-widest uppercase text-ink-faint hover:text-gold transition-colors cursor-pointer"
                  >
                    <IconCopy className="w-3.5 h-3.5" />
                    Kopyala
                  </button>
                  {r.sourceUrl && (
                    <a
                      href={r.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[11.5px] tracking-widest uppercase text-ink-faint hover:text-teal transition-colors"
                    >
                      <IconExternal className="w-3.5 h-3.5" />
                      Kaynak
                    </a>
                  )}
                </>
              )}
              <button
                onClick={onToggle}
                className="inline-flex items-center gap-1.5 font-mono text-[12px] tracking-widest uppercase text-copper hover:text-paper transition-colors cursor-pointer"
              >
                {open ? "Kapat" : "Rekoru aç"}
                <IconArrow dir={open ? "up" : "down"} className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ---------------- Wikidata şeridi ---------------- */

/**
 * Seçili günde kırılmış, tarihi doğrulanmış rekorlar. Editör kartlarından ayrı
 * durur ve sade tutulur: buradaki metinler otomatik gelir, editör hükmü taşımaz.
 * Çoğu günde boş döner — o zaman hiç gösterilmez, boş bir başlık bırakmaz.
 */
function WikidataSeridi({ items, loading }: { items: WikidataRekor[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="mt-8 rounded-sm border border-dashed border-line px-5 py-4">
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-faint">
          Bugün kırılan rekorlar aranıyor…
        </p>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <Reveal className="mt-10">
      <div className="rounded-sm border border-sky/40 bg-sky/[0.05] px-5 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-sky">
            Bugün kırılan rekorlar
          </p>
          <span className="font-mono text-[9.5px] tracking-[0.18em] uppercase px-1.5 py-0.5 rounded-sm bg-sky/15 text-sky border border-sky/40">
            Wikidata
          </span>
        </div>

        <ul className="space-y-2.5">
          {items.map((w) => (
            <li key={w.id} className="text-[14px] text-ink-dim leading-relaxed flex gap-2.5">
              <span className="text-sky shrink-0 font-mono tabular-nums">{w.year}</span>
              <span>
                <span className="text-ink">{w.holder}</span> — {w.record}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-3 font-mono text-[10.5px] text-ink-faint leading-relaxed">
          Bu satırlar Wikidata&apos;dan otomatik gelir; editör derlemesi değildir.
        </p>
      </div>
    </Reveal>
  );
}

/* ---------------- ikon ---------------- */

function IconMadalya({
  className = "w-5 h-5",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" aria-hidden>
      <circle cx="12" cy="14.5" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 9 5.5 2.5M15 9 18.5 2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m12 11.5 1.1 2.2 2.4.35-1.75 1.7.4 2.4-2.15-1.15-2.15 1.15.4-2.4-1.75-1.7 2.4-.35z"
        fill="currentColor"
      />
    </svg>
  );
}
