import { IconLeafMark } from "./ui";

export function AltBilgi() {
  return (
    <footer className="relative border-t border-line/80 bg-night-2/80">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-brand">
              <IconLeafMark className="w-6 h-6" />
            </span>
            <span className="font-display font-bold text-lg text-ink">TARİH YAPRAĞI</span>
          </div>
          <p className="text-[13.5px] leading-relaxed text-ink-dim max-w-xs">
            Her gün koparılacak bir yaprak, her yaprakta bir arşiv. Duvar takvimlerinden yayın
            stüdyolarına: bugünün tarihi, konuşmaya hazır.
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-ink-faint mb-4">
            Kaynaklar
          </p>
          <ul className="space-y-2.5 text-[13.5px] text-ink-dim">
            <li>
              · Tarihî olaylar, doğum ve vefatlar:{" "}
              <span className="text-sky">Wikimedia REST API</span> (TR + EN Vikipedi)
            </li>
            <li>
              · Karanlık dosyalar ve bilim seçkisi:{" "}
              <span className="text-gold">editör derlemesi</span>
            </li>
            <li>
              · Sohbet kartları: derleme +{" "}
              <span className="text-teal">arşiv özetlerinden otomatik üretim</span>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-ink-faint mb-4">
            Not
          </p>
          <p className="text-[13.5px] leading-relaxed text-ink-dim">
            Otomatik sınıflandırmalar anahtar kelime taramasıyla yapılır; nadiren yanılabilir.
            Kesin bilgi için kartlardaki Vikipedi bağlantılarını izleyin. Takvim, Miladi takvim
            esas alır.
          </p>
          <p className="mt-6 font-mono text-[11px] text-ink-faint">
            © {new Date().getFullYear()} Tarih Yaprağı · 366 gün, tek arşiv
          </p>
          <p className="mt-2 font-mono text-[11px] text-ink-faint">
            Kısayollar için{" "}
            <kbd className="px-1.5 py-0.5 rounded-sm border border-line bg-panel-2 text-gold">
              ?
            </kbd>{" "}
            tuşuna basın
          </p>
        </div>
      </div>
    </footer>
  );
}
