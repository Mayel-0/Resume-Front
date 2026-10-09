import { useMemo, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "../lib/gsap";

const MIN_ITEMS = 12;

/**
 * Marquee — bandeau de texte en défilement infini.
 * Il accélère avec la vitesse du scroll et change de sens quand
 * on remonte la page.
 *
 * @param {string[]} items    — libellés à faire défiler
 * @param {number}   duration — durée d'une boucle (s)
 * @param {boolean}  reverse  — sens de défilement inversé
 */
function Marquee({ items = [], duration = 40, reverse = false, className = "" }) {
  const rootRef = useRef(null);

  // Chaque piste doit être plus large que l'écran : on répète les libellés
  const list = useMemo(() => {
    if (!items.length) return [];
    const out = [];
    while (out.length < MIN_ITEMS) out.push(...items);
    return out;
  }, [items]);

  useGSAP(
    () => {
      if (!list.length || prefersReducedMotion()) return;

      const base = reverse ? -1 : 1;
      const loop = gsap.to(".marquee__track", {
        xPercent: -100,
        repeat: -1,
        duration,
        ease: "none",
      });
      // On démarre loin de zéro pour pouvoir jouer à l'envers sans butée
      loop.totalTime(duration * 50).timeScale(base);

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          if (Math.abs(velocity) < 5) return;
          const direction = (velocity < 0 ? -1 : 1) * base;
          const boost = 1 + Math.min(Math.abs(velocity) / 400, 5);

          gsap.to(loop, {
            timeScale: direction * boost,
            duration: 0.25,
            overwrite: true,
            onComplete: () => {
              gsap.to(loop, { timeScale: direction, duration: 0.9, overwrite: true });
            },
          });
        },
      });

      return () => gsap.killTweensOf(loop);
    },
    {
      scope: rootRef,
      dependencies: [list.length, duration, reverse],
      revertOnUpdate: true,
    }
  );

  if (!list.length) return null;

  // Deux pistes identiques côte à côte : la boucle est invisible
  return (
    <div className={`marquee ${className}`} ref={rootRef} aria-hidden="true">
      <div className="marquee__inner">
        {[0, 1].map((track) => (
          <div className="marquee__track" key={track}>
            {list.map((item, i) => (
              <span className="marquee__item" key={i}>
                {item}
                <span className="marquee__sep">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
