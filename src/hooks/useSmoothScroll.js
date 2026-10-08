import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * useSmoothScroll — Lenis (scroll smooth) synchronisé avec GSAP.
 *
 * - Lenis pilote le défilement à la place du scroll natif.
 * - Chaque frame Lenis met à jour ScrollTrigger pour que les
 *   animations de scroll restent parfaitement synchronisées.
 * - Respecte prefers-reduced-motion : dans ce cas, on garde le
 *   scroll natif du navigateur.
 * - Les liens d'ancre (#section) sont gérés par Lenis.
 */
export default function useSmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    });

    // Lenis → ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Boucle rAF pilotée par le ticker GSAP (une seule boucle au total)
    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}
