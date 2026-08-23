export const NAV = [
  { id: "tunel", label: "Zaman Tüneli" },
  { id: "doganlar", label: "Doğanlar" },
  { id: "kaybettiklerimiz", label: "Kaybettiklerimiz" },
  { id: "karanlik", label: "Karanlık Dosyalar" },
  { id: "bilim", label: "Bilim & Keşif" },
  { id: "sohbet", label: "Sohbet Kartları" },
];

/** Yapışkan bölüm navigasyonu. Arama sonuçsuz kaldığında (tüm bölümler gizliyken)
 * gösterilmez. */
export function BolumNav({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <nav
      aria-label="Bölümler"
      className="sticky top-0 sm:top-16 z-[55] border-b border-line/80 bg-night/85 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex gap-1 overflow-x-auto row-scroll">
        {NAV.map((n, i) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="shrink-0 px-4 py-3.5 font-mono text-[12px] tracking-[0.14em] uppercase text-ink-faint hover:text-gold border-b-2 border-transparent hover:border-gold transition-all duration-200"
          >
            <span className="text-brand mr-1.5">{String(i + 1).padStart(2, "0")}</span>
            {n.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
