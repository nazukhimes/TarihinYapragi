import { Modal } from "./ui";

const ANA_SAYFA_KISAYOLLARI: [string, string][] = [
  ["←", "Önceki gün"],
  ["→", "Sonraki gün"],
  ["T", "Bugüne dön"],
  ["/", "Arama kutusuna odaklan"],
  ["?", "Bu yardımı aç"],
  ["Esc", "Yardımı/modalı kapat"],
];

const YAYIN_MODU_KISAYOLLARI: [string, string][] = [
  ["←", "Önceki kart"],
  ["→ / Boşluk", "Sonraki kart"],
  ["Esc", "Yayın Modunu kapat"],
];

export function KisayolYardimi({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} titleId="kisayol-modal-baslik">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h3 id="kisayol-modal-baslik" className="font-display font-bold text-2xl text-ink">
            Klavye Kısayolları
          </h3>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="w-9 h-9 grid place-items-center rounded-sm border border-line text-ink-dim hover:text-brand hover:border-brand transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-gold mb-3">
          Ana sayfa
        </p>
        <dl className="space-y-2.5 mb-7">
          {ANA_SAYFA_KISAYOLLARI.map(([key, desc]) => (
            <div key={key} className="flex items-center gap-3">
              <dt>
                <kbd className="inline-block min-w-[2.5rem] text-center px-2 py-1 rounded-sm border border-line bg-panel-2 font-mono text-[12px] text-gold">
                  {key}
                </kbd>
              </dt>
              <dd className="text-[14px] text-ink-dim">{desc}</dd>
            </div>
          ))}
        </dl>

        <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-gold mb-3">
          Yayın Modu
        </p>
        <dl className="space-y-2.5">
          {YAYIN_MODU_KISAYOLLARI.map(([key, desc]) => (
            <div key={key} className="flex items-center gap-3">
              <dt>
                <kbd className="inline-block min-w-[2.5rem] text-center px-2 py-1 rounded-sm border border-line bg-panel-2 font-mono text-[12px] text-gold">
                  {key}
                </kbd>
              </dt>
              <dd className="text-[14px] text-ink-dim">{desc}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Modal>
  );
}
