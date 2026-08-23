import type { CuratedDay } from "../data";
import type { DayData } from "../lib/wiki";
import type { GunVerisi } from "../hooks/useGunVerisi";
import { CalendarLeaf, Ticker } from "./leaf";
import { GunOzeti } from "./GunOzeti";
import { OzelGunler } from "./OzelGunler";
import { formatYear } from "./sections";
import { IconShare, Reveal } from "./ui";

/** Açılış bölümü: dev ambiyans yılları + takvim yaprağı + paylaş düğmesi +
 * günün özeti (GunOzeti) + özel dosyalı günler (OzelGunler) + haber bandı. */
export function AcilisBolumu({
  day,
  month,
  year,
  onChangeDay,
  onOpenPicker,
  pickerOpen,
  isToday,
  shareDay,
  dayLabel,
  loading,
  data,
  gecikti,
  reload,
  bugüneDön,
  curated,
  setDate,
  veri,
}: {
  day: number;
  month: number;
  year: number;
  onChangeDay: (d: number, m: number) => void;
  onOpenPicker: () => void;
  pickerOpen: boolean;
  isToday: boolean;
  shareDay: () => void;
  dayLabel: string;
  loading: boolean;
  data: DayData | null;
  gecikti: boolean;
  reload: () => void;
  bugüneDön: () => void;
  curated: CuratedDay | undefined;
  setDate: (d: number, m: number) => void;
  veri: GunVerisi;
}) {
  return (
    <section className="relative overflow-hidden">
      {/* dev ambiyans yılları */}
      {veri.ambientYears.map((y, i) => (
        <span
          key={`${y}-${i}`}
          className={`absolute font-display font-black outline-num select-none pointer-events-none leading-none ${i % 2 === 0 ? "drift-slow" : "drift-slower"}`}
          style={{
            fontSize: "clamp(9rem, 22vw, 20rem)",
            right: i === 1 ? undefined : `${6 + i * 22}%`,
            left: i === 1 ? "-4%" : undefined,
            top: `${8 + i * 26}%`,
          }}
        >
          {formatYear(y)}
        </span>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-12 grid lg:grid-cols-[400px_1fr] gap-10 lg:gap-16 items-start">
        {/* yaprak */}
        <Reveal className="max-w-[400px] w-full mx-auto lg:mx-0">
          <CalendarLeaf
            day={day}
            month={month}
            year={year}
            onChangeDay={onChangeDay}
            onOpenPicker={onOpenPicker}
            pickerOpen={pickerOpen}
            isToday={isToday}
          />
          <div className="mt-3 flex justify-center">
            <button
              onClick={shareDay}
              aria-label={`${dayLabel} gününü paylaş`}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-line bg-panel/60 text-ink-faint hover:text-gold hover:border-gold/60 transition-all duration-200 cursor-pointer"
            >
              <IconShare className="w-3.5 h-3.5 group-hover:text-gold transition-colors" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase">Paylaş</span>
            </button>
          </div>
        </Reveal>

        {/* günün özeti */}
        <GunOzeti
          loading={loading}
          data={data}
          gecikti={gecikti}
          dayLabel={dayLabel}
          isToday={isToday}
          mergedEvents={veri.mergedEvents}
          births={veri.births}
          deaths={veri.deaths}
          allCases={veri.allCases}
          spotlight={veri.spotlight}
          reload={reload}
          bugüneDön={bugüneDön}
        />

        {/* özel dosyalı günler */}
        <OzelGunler day={day} month={month} curated={curated} setDate={setDate} />
      </div>

      {/* haber bandı */}
      {!loading && veri.tickerItems.length > 0 && <Ticker items={veri.tickerItems} />}
    </section>
  );
}
