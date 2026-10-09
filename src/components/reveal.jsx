import { Children, useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { useTransition } from "../context/transitionContext";

/**
 * Reveal — révélation au scroll, réutilisable partout.
 *
 * Anime ses enfants directs en cascade (stagger) dès que le
 * conteneur entre dans le viewport. Fallback : si GSAP n'est
 * pas disponible, le contenu reste visible (pas de opacity:0
 * en dur dans le CSS).
 *
 * L'animation est recréée quand le nombre d'enfants change
 * (listes chargées depuis l'API) et attend que le rideau de
 * transition soit levé.
 *
 * @param {string}  as        — balise JSX du conteneur (div, section, ul…)
 * @param {string}  className — classes appliquées au conteneur
 * @param {string}  target    — sélecteur des éléments à animer
 *                              (par défaut : enfants directs)
 * @param {number}  y         — décalage vertical de départ (px)
 * @param {number}  stagger   — délai entre chaque élément (s)
 * @param {string}  start     — point de déclenchement ScrollTrigger
 * @param {number}  delay     — délai global avant la cascade (s)
 */
function Reveal({
  as: Tag = "div",
  className = "",
  target,
  y = 40,
  stagger = 0.09,
  duration = 0.9,
  delay = 0,
  start = "top 82%",
  once = true,
  children,
  ...rest
}) {
  const containerRef = useRef(null);
  const { revealed } = useTransition();
  const count = Children.count(children);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root || prefersReducedMotion()) return;

      const els = target
        ? gsap.utils.toArray(target, root)
        : Array.from(root.children);

      if (!els.length) return;

      // Rideau encore baissé : on masque, l'animation partira ensuite
      if (!revealed) {
        gsap.set(els, { opacity: 0 });
        return;
      }

      gsap.fromTo(
        els,
        { opacity: 0, y, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          stagger,
          // On nettoie les styles inline à la fin : les hovers
          // CSS (transform) doivent reprendre la main.
          clearProps: "transform,opacity,willChange",
          scrollTrigger: {
            trigger: root,
            start,
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef, dependencies: [revealed, count], revertOnUpdate: true }
  );

  return (
    <Tag ref={containerRef} className={className} {...rest}>
      {children}
    </Tag>
  );
}

export default Reveal;
