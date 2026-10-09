import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, canHover } from "../lib/gsap";
import { closestFromEvent } from "../lib/dom";

/**
 * Cursor — point + anneau qui suivent la souris avec inertie.
 * L'anneau grossit sur les éléments cliquables et affiche un libellé
 * sur les éléments data-cursor="Texte". Le curseur natif reste visible.
 */
function Cursor() {
  const [enabled] = useState(() => canHover() && !prefersReducedMotion());
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const label = labelRef.current;
    if (!enabled || !root || !label) return undefined;

    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      root.classList.remove("is-hidden");
    };

    const onOver = (e: PointerEvent) => {
      const labelled = closestFromEvent(e, "[data-cursor]");
      const interactive = closestFromEvent(e, "a, button");
      label.textContent = labelled?.dataset.cursor ?? "";
      root.classList.toggle("has-label", Boolean(labelled));
      root.classList.toggle("is-hover", !labelled && Boolean(interactive));
    };

    const onDown = () => root.classList.add("is-down");
    const onUp = () => root.classList.remove("is-down");
    const onLeave = () => root.classList.add("is-hidden");

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor is-hidden" ref={rootRef} aria-hidden="true">
      <span className="cursor__ring" ref={ringRef}>
        <span className="cursor__label" ref={labelRef} />
      </span>
      <span className="cursor__dot" ref={dotRef} />
    </div>
  );
}

export default Cursor;
