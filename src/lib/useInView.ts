import { useEffect, useRef, useState } from "react";

type Cb = (visible: boolean) => void;
let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, Cb>();

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            callbacks.get(e.target)?.(true);
            observer?.unobserve(e.target);
            callbacks.delete(e.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
  }
  return observer;
}

/**
 * Eleman görünür olduğunda true döner.
 * IntersectionObserver yoksa veya belirlenen süre içinde ateşlenmezse
 * güvenlik ağı olarak yine true döner — içerik asla gizli kalmaz.
 */
export function useInView<T extends Element>(fallbackMs = 1200) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = getObserver();
    if (!obs) {
      setInView(true); // gözlemci desteklenmiyor → hemen göster
      return;
    }

    callbacks.set(el, () => setInView(true));
    obs.observe(el);

    // GÜVENLİK AĞI: gözlemci ateşlenmezse (gizli sekme, prerender) yine de göster
    const timer = window.setTimeout(() => setInView(true), fallbackMs);

    return () => {
      window.clearTimeout(timer);
      obs.unobserve(el);
      callbacks.delete(el);
    };
  }, [fallbackMs]);

  return { ref, inView };
}
