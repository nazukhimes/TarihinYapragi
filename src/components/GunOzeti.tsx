import type { DayData, DayErrorKind } from "../lib/wiki";
import type { MergedEvent, PersonCard } from "./sections";
import { formatYear } from "./sections";
import type { CaseFile } from "../data";
import type { Spotlight } from "../hooks/useGunVerisi";
import { CountUp, IconDossier, IconLeafMark, IconQuill, IconSkull, Reveal } from "./ui";

const HATA_BASLIK: Record<DayErrorKind, string> = {
  network: "İnternet bağlantısı yok.",
  notfound: "Bu gün için kayıt bulunamadı.",
  ratelimit: "Arşiv şu an çok yoğun.",
  server: "Arşiv sunucusu yanıt vermiyor.",
  unknown: "Beklenmeyen bir sorun oluştu.",
};

/** Spotlight başlığı, sayaçlar ve zaman aralığı — açılış bölümünün sağ sütunu.
 * Yükleniyor/hata durumlarını da (T-09) burada gösterir. */
export function GunOzeti({
  loading,
  data,
  gecikti,
  dayLabel,
  isToday,
  mergedEvents,
  births,
  deaths,
  allCases,
  spotlight,
  reload,
  bugüneDön,
}: {
  loading: boolean;
  data: DayData | null;
  gecikti: boolean;
  dayLabel: string;
  isToday: boolean;
  mergedEvents: MergedEvent[];
  births: PersonCard[];
  deaths: PersonCard[];
  allCases: CaseFile[];
  spotlight: Spotlight | null;
  reload: () => void;
  bugüneDön: () => void;
}) {
  const stats = [
    {
      hedef: "tunel",
      label: "Tarihî olay",
      value: mergedEvents.length,
      color: "#e8b04b",
      icon: <IconQuill className="w-4.5 h-4.5" />,
    },
    {
      hedef: "doganlar",
      label: "Bugün doğan",
      value: births.length,
      color: "#8fbf6a",
      icon: <IconLeafMark className="w-4.5 h-4.5" />,
    },
    {
      hedef: "kaybettiklerimiz",
      label: "Kaybettiklerimiz",
      value: deaths.length,
      color: "#6f9fd8",
      icon: <IconSkull className="w-4.5 h-4.5" />,
    },
    {
      hedef: "karanlik",
      label: "Karanlık dosya",
      value: allCases.length,
      color: "#e05b4b",
      icon: <IconDossier className="w-4.5 h-4.5" />,
    },
  ];

  return (
    <div className="pt-2">
      <Reveal>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-gold">
            {isToday ? "Bugünün arşivi" : "Seçili günün arşivi"}
          </span>
          <span className="h-px flex-1 bg-line" />
          {data && !loading && (
            <span
              className={`font-mono text-[11px] ${data.stale ? "text-copper" : "text-ink-faint"}`}
            >
              {data.offline
                ? "çevrimdışı önbellek"
                : data.stale
                  ? "önbellekten · 24 saatten eski"
                  : `kaynak: ${data.sources.events === "tr" ? "TR" : "EN"} Vikipedi`}
            </span>
          )}
        </div>
      </Reveal>

      {loading ? (
        <div className="py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-44 bg-panel-2 rounded-sm" />
            <div className="h-14 w-full max-w-xl bg-panel-2 rounded-sm" />
            <div className="h-4 w-3/4 max-w-lg bg-panel-2 rounded-sm" />
            <div className="h-4 w-2/3 max-w-md bg-panel-2 rounded-sm" />
          </div>
          <p className="mt-6 font-mono text-[13px] text-ink-faint">
            Arşiv taranıyor · {dayLabel} için kayıtlar getiriliyor…
          </p>
          {gecikti && (
            <p className="mt-3 font-mono text-[12px] text-copper">
              Arşiv beklenenden yavaş yanıt veriyor…
            </p>
          )}
        </div>
      ) : data?.error && mergedEvents.length === 0 ? (
        <div className="py-8">
          <p className="font-display italic text-2xl text-ink">{HATA_BASLIK[data.error.kind]}</p>
          <p className="mt-3 text-ink-dim max-w-xl text-[15px] leading-relaxed">
            {data.error.message}
          </p>
          <div className="mt-6 flex gap-3 flex-wrap">
            {data.error.retryable && (
              <button
                onClick={reload}
                className="px-5 py-3 rounded-sm bg-gold text-night font-mono text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-paper transition-colors cursor-pointer"
              >
                Yeniden dene
              </button>
            )}
            <button
              onClick={bugüneDön}
              className="px-5 py-3 rounded-sm border border-line text-ink-dim hover:text-gold hover:border-gold/60 font-mono text-[12px] tracking-[0.2em] uppercase transition-colors cursor-pointer"
            >
              Bugüne dön
            </button>
          </div>
        </div>
      ) : (
        <>
          <Reveal delay={80}>
            <h1 className="font-display font-bold text-3xl md:text-[2.9rem] leading-[1.1] text-ink max-w-2xl">
              {spotlight?.title}
            </h1>
            {spotlight && "text" in spotlight && spotlight.text && (
              <p className="mt-4 text-[15.5px] md:text-base leading-relaxed text-ink-dim max-w-2xl">
                {spotlight.text}
              </p>
            )}
            <p className="mt-3 font-mono text-[11.5px] tracking-[0.2em] uppercase text-ink-faint">
              {spotlight?.kicker} · {dayLabel}
            </p>
          </Reveal>

          {/* sayaçlar */}
          <Reveal delay={160} className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {stats.map((s) => (
              <a
                key={s.label}
                href={`#${s.hedef}`}
                className="group rounded-sm border border-line bg-panel/70 px-4 py-3.5 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.35)] transition-all duration-300"
                style={{ borderColor: undefined }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${s.color}77`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <div className="flex items-center justify-between" style={{ color: s.color }}>
                  <span className="font-display font-black text-3xl tabular-nums text-ink group-hover:text-gold transition-colors">
                    <CountUp to={s.value} />
                  </span>
                  <span className="opacity-80">{s.icon}</span>
                </div>
                <p className="mt-1.5 font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-faint">
                  {s.label}
                </p>
              </a>
            ))}
          </Reveal>

          {mergedEvents.length > 1 && (
            <Reveal delay={240} className="mt-8 max-w-2xl">
              <p className="font-mono text-[12px] text-ink-faint leading-relaxed">
                <span className="text-gold">Zaman aralığı:</span> {formatYear(mergedEvents[0].year)}{" "}
                — {formatYear(mergedEvents[mergedEvents.length - 1].year)} ·{" "}
                {mergedEvents[mergedEvents.length - 1].year - mergedEvents[0].year} yıla yayılan{" "}
                {mergedEvents.length} kayıt
              </p>
            </Reveal>
          )}
        </>
      )}
    </div>
  );
}
