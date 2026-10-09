import { useEffect } from "react";
import { gsap, prefersReducedMotion, canHover } from "../lib/gsap";
import { closestFromEvent } from "../lib/dom";

const MAX_ANGLE = 6;

/**
 * useTilt — deux effets de survol gérés en delegation :
 *
 * - toutes les .card reçoivent --mx / --my (position du curseur),
 *   utilisés en CSS pour le halo lumineux qui suit la souris ;
 * - les éléments data-tilt s'inclinent en 3D vers le curseur.
 */
export default function useTilt(): void {
  useEffect(() => {
    if (prefersReducedMotion() || !canHover()) return undefined;

    let active: HTMLElement | null = null;

    const reset = (el: HTMLElement) => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.6)",
        overwrite: "auto",
      });
    };

    const onMove = (e: PointerEvent) => {
      const card = closestFromEvent(e, ".card");
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }

      const el = closestFromEvent(e, "[data-tilt]");
      if (active && active !== el) reset(active);
      active = el;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(el, {
        rotateY: px * MAX_ANGLE * 2,
        rotateX: -py * MAX_ANGLE * 2,
        transformPerspective: 1000,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onLeaveWindow = () => {
      if (active) reset(active);
      active = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      if (active) gsap.set(active, { clearProps: "transform" });
    };
  }, []);
}
