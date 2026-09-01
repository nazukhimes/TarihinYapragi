import type { RefObject } from "react";
import type { AramaSonuclari } from "../hooks/useGunVerisi";
import { LiveClock } from "./leaf";
import { IconLeafMark, IconMic, IconSearch, IconSpark } from "./ui";
import { yzAyarlariniAc } from "./YzAyarlari";

export function UstBar({
  query,
  setQuery,
  dayLabel,
  talkCardsVar,
  onBroadcast,
  aramaRef,
  aramaMobilRef,
  searching,
  toplamSonuc,
  arama,
}: {
  query: string;
  setQuery: (q: string) => void;
  dayLabel: string;
  talkCardsVar: boolean;
  onBroadcast: () => void;
  aramaRef: RefObject<HTMLInputElement>;
  aramaMobilRef: RefObject<HTMLInputElement>;
  searching: boolean;
  toplamSonuc: number;
  arama: AramaSonuclari;
}) {
  return (
    <>
      <header className="sm:sticky sm:top-0 z-[60] border-b border-line/80 bg-night/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center gap-4">
          <a href="#top" className="flex items-center gap-3 shrink-0 group">
            <span className="text-brand group-hover:scale-110 transition-transform duration-300">
              <IconLeafMark className="w-7 h-7" />
            </span>
            <span className="leading-none">
              <span className="block font-display font-bold text-lg tracking-wide text-ink group-hover:text-gold transition-colors">
                TARİH YAPRAĞI
              </span>
              <span className="block font-mono text-[9.5px] tracking-[0.3em] uppercase text-ink-faint mt-1">
                her güne bir arşiv
              </span>
            </span>
          </a>

          <div className="flex-1 flex justify-center">
            <label className="relative w-full max-w-md hidden sm:block">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
                <IconSearch className="w-4 h-4" />
              </span>
              <input
                ref={aramaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                aria-label={`${dayLabel} arşivinde ara`}
                placeholder={`${dayLabel} arşivinde ara: olay, kişi, dosya…`}
                className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-panel border border-line text-[14px] text-ink placeholder:text-ink-faint outline-none focus:border-gold/70 focus:shadow-[0_0_0_3px_rgba(232,176,75,0.12)] transition-all duration-200"
              />
              {searching && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-brand hover:text-paper cursor-pointer"
                >
                  ✕ temizle
                </button>
              )}
            </label>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <LiveClock />
            {/* Yapay zekâ anahtarı ayarları (T-20). Sağlayıcıya değil, kullanıcının
                kendi anahtarına ait bir ayar olduğu için genel bir dişli değil,
                katmanın kendi kıvılcım simgesiyle duruyor. */}
            <button
              onClick={yzAyarlariniAc}
              aria-label="Yapay zekâ ayarları"
              title="Yapay zekâ ayarları"
              className="w-9 h-9 grid place-items-center rounded-sm border border-line text-ink-faint hover:text-lilac hover:border-lilac/60 transition-colors cursor-pointer"
            >
              <IconSpark className="w-4 h-4" />
            </button>
            <button
              onClick={onBroadcast}
              disabled={!talkCardsVar}
              aria-label="Yayın Modu"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-brand text-paper font-mono text-[11.5px] tracking-[0.18em] uppercase font-semibold hover:bg-brand-deep hover:shadow-[0_10px_26px_rgba(210,59,46,0.4)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <IconMic className="w-4 h-4" />
              <span className="hidden md:inline">Yayın Modu</span>
            </button>
          </div>
        </div>

        {/* mobil arama */}
        <div className="sm:hidden px-4 pb-3">
          <label className="relative block">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
              <IconSearch className="w-4 h-4" />
            </span>
            <input
              ref={aramaMobilRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              aria-label={`${dayLabel} arşivinde ara`}
              placeholder="Arşivde ara…"
              className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-panel border border-line text-[14px] text-ink placeholder:text-ink-faint outline-none focus:border-gold/70 transition-colors"
            />
          </label>
        </div>
      </header>
      <p className="sr-only" role="status" aria-live="polite">
        {searching ? (toplamSonuc > 0 ? `${toplamSonuc} sonuç bulundu` : "sonuç yok") : ""}
      </p>

      {searching && (
        <div
          className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex items-center gap-3 flex-wrap
                        border-b border-line/60 font-mono text-[12px]"
        >
          <span className="text-gold">&quot;{query}&quot;</span>
          <span className="text-ink-dim">
            {toplamSonuc > 0 ? `${toplamSonuc} sonuç` : "sonuç yok"}
          </span>
          {toplamSonuc > 0 && (
            <span className="text-ink-faint">
              {arama.olay.length} olay · {arama.dogum.length} doğum · {arama.vefat.length} vefat ·{" "}
              {arama.dosya.length} dosya · {arama.bilim.length} bilim
            </span>
          )}
          <button
            onClick={() => setQuery("")}
            className="ml-auto font-mono text-[11px] text-brand hover:text-paper cursor-pointer"
          >
            ✕ temizle
          </button>
        </div>
      )}
    </>
  );
}
