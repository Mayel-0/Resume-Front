import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, canHover } from "../lib/gsap";

/**
 * Cursor — point + anneau qui suivent la souris avec inertie.
 * L'anneau grossit sur les éléments cliquables et affiche un libellé
 * sur les éléments data-cursor="Texte". Le curseur natif reste visible.
 */
function Cursor() {
  const [enabled] = useState(() => canHover() && !prefersReducedMotion());
  const rootRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const root = rootRef.current;
    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      root.classList.remove("is-hidden");
    };

    const onOver = (e) => {
      const labelled = e.target.closest?.("[data-cursor]");
      const interactive = e.target.closest?.("a, button");
      labelRef.current.textContent = labelled?.dataset.cursor ?? "";
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
