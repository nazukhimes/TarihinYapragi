import { Component, type ErrorInfo, type ReactNode } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function ErrorCard({ hata, tamSayfa }: { hata: Error; tamSayfa: boolean }) {
  return (
    <div
      className={`paper paper-grain torn-edge rounded-sm text-center max-w-lg mx-auto ${
        tamSayfa ? "p-10" : "p-6"
      }`}
    >
      <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-brand">
        Arşivde bir sorun çıktı
      </p>
      <h1
        className={`font-display font-bold text-inkpaper mt-4 ${
          tamSayfa ? "text-3xl" : "text-xl"
        }`}
      >
        Yaprak yırtıldı
      </h1>
      <p className="mt-3 text-inkpaper-dim text-[15px] leading-relaxed">
        {tamSayfa
          ? "Beklenmeyen bir hata oluştu. Sayfayı yenilemek çoğu zaman yeterli olur."
          : "Bu bölüm yüklenirken beklenmeyen bir hata oluştu. Diğer bölümler etkilenmedi."}
      </p>

      <div className="mt-7 flex gap-3 justify-center flex-wrap">
        <button
          onClick={() => location.reload()}
          className="px-5 py-3 rounded-sm bg-brand text-paper font-mono text-[12px]
                     tracking-[0.2em] uppercase font-semibold hover:bg-brand-deep
                     transition-colors cursor-pointer"
        >
          Sayfayı yenile
        </button>
        <button
          onClick={() => {
            localStorage.clear();
            location.reload();
          }}
          className="px-5 py-3 rounded-sm border border-inkpaper-dim/50 text-inkpaper
                     font-mono text-[12px] tracking-[0.2em] uppercase hover:text-brand
                     hover:border-brand/60 transition-colors cursor-pointer"
        >
          Önbelleği temizle
        </button>
      </div>

      {import.meta.env.DEV && (
        <pre className="mt-6 text-left text-[11px] text-brand-deep overflow-auto
                        max-h-40 p-3 bg-paper-2 rounded-sm">
          {hata.stack}
        </pre>
      )}
    </div>
  );
}

interface Props {
  children: ReactNode;
  /** "page" (varsayılan): tam ekran, kök hata sınırı için. "section": bölüm içine sığan, düzeni bozmayan kompakt kart. */
  variant?: "page" | "section";
}
interface State {
  hata: Error | null;
}

/**
 * React'in kendi hata sınırı — yalnızca sınıf bileşeniyle yazılabilir.
 * "page" varyantı `main.tsx`'te kök sarmalayıcı olarak kalır (react-router'ın
 * kendi rota render'ı DIŞINDA oluşan hatalar için son çare); rota elemanlarının
 * (ör. <App/>) kendi render'ında fırlattığı hatalar `createBrowserRouter`'ın
 * `errorElement` mekanizmasıyla `RouteErrorFallback`'e gider — bkz. o bileşenin
 * üstündeki not.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hata: null };

  static getDerivedStateFromError(hata: Error): State {
    return { hata };
  }

  componentDidCatch(hata: Error, bilgi: ErrorInfo) {
    console.error("[Tarih Yaprağı] beklenmeyen hata:", hata, bilgi.componentStack);
  }

  render() {
    if (!this.state.hata) return this.props.children;

    const tamSayfa = (this.props.variant ?? "page") === "page";
    const kart = <ErrorCard hata={this.state.hata} tamSayfa={tamSayfa} />;

    if (!tamSayfa) return kart;

    return (
      <div className="glowfield min-h-screen grid place-items-center px-6">
        {kart}
      </div>
    );
  }
}

/**
 * `react-router-dom`'un `createBrowserRouter` ile kurulan veri yönlendiricileri
 * (v6.4+), her rota elemanını KENDİ dahili hata sınırıyla sarar; bu, o rotanın
 * render'ında (ör. <App/>'in kendisinde) oluşan bir hatayı yukarıdaki sınıf
 * tabanlı `ErrorBoundary`'ye ULAŞMADAN önce yakalar (React en yakın hata
 * sınırını kullanır) ve react-router'ın kendi İngilizce/jenerik "Unexpected
 * Application Error" ekranını gösterir. Bu bileşen, her rotaya `errorElement`
 * olarak verilerek aynı görsel kimliği (torn-paper kart + iki düğme) o katmana
 * da taşır — `main.tsx`'teki kök `ErrorBoundary` yalnızca react-router'ın
 * kendisinin dışında kalan (rota render'ından önceki/sonraki) bir hata için
 * son bir güvenlik ağı olarak kalır.
 */
export function RouteErrorFallback() {
  const err = useRouteError();
  console.error("[Tarih Yaprağı] beklenmeyen hata (rota):", err);

  const hata =
    err instanceof Error
      ? err
      : new Error(
          isRouteErrorResponse(err) ? `${err.status} ${err.statusText}` : "Bilinmeyen hata"
        );

  return (
    <div className="glowfield min-h-screen grid place-items-center px-6">
      <ErrorCard hata={hata} tamSayfa />
    </div>
  );
}
