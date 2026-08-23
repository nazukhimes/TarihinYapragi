import { useEffect, type RefObject } from "react";

/** Ana sayfa klavye kısayolları (←/→/T///?/Esc) — arama kutusunda, herhangi bir
 * `input`/`textarea`'da ve `aktif=false` iken (Yayın Modu açıkken) devre dışı (O-7). */
export function useKlavyeKisayollari({
  aktif,
  gunKaydir,
  bugüneDön,
  aramaRef,
  aramaMobilRef,
  setKisayolYardimi,
}: {
  aktif: boolean;
  gunKaydir: (delta: number) => void;
  bugüneDön: () => void;
  aramaRef: RefObject<HTMLInputElement>;
  aramaMobilRef: RefObject<HTMLInputElement>;
  setKisayolYardimi: (v: boolean) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!aktif) return;
      if (document.querySelector('[aria-modal="true"]')) return; // açık bir Modal varken odak tuzağını atlama

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          gunKaydir(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          gunKaydir(1);
          break;
        case "t":
        case "T":
          e.preventDefault();
          bugüneDön();
          break;
        case "/":
          e.preventDefault();
          (aramaRef.current?.offsetParent ? aramaRef.current : aramaMobilRef.current)?.focus();
          break;
        case "?":
          setKisayolYardimi(true);
          break;
        case "Escape":
          setKisayolYardimi(false);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aktif, gunKaydir, bugüneDön, aramaRef, aramaMobilRef, setKisayolYardimi]);
}
