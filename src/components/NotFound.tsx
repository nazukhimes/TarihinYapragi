import { Link } from "react-router-dom";
import { toDaySlug } from "../lib/slug";

export function NotFound() {
  const today = new Date();
  return (
    <div className="glowfield min-h-screen grid place-items-center px-6">
      <div className="paper paper-grain torn-edge rounded-sm p-10 max-w-md text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-brand">
          Yaprak bulunamadı
        </p>
        <p
          className="font-display font-black text-inkpaper leading-none my-4"
          style={{ fontSize: "clamp(5rem, 14vw, 8rem)" }}
        >
          404
        </p>
        <p className="text-inkpaper-dim text-[15px] leading-relaxed">
          Bu takvimde böyle bir gün yok. Yaprak yırtılmış olabilir.
        </p>
        <Link
          to={`/${toDaySlug(today.getMonth() + 1, today.getDate())}`}
          className="mt-6 inline-block px-5 py-3 rounded-sm bg-brand text-paper font-mono text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-brand-deep transition-colors"
        >
          Bugüne dön
        </Link>
      </div>
    </div>
  );
}
