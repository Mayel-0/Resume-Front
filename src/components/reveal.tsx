import { Children, useCallback, useRef, type HTMLAttributes, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { useTransition } from "../context/transitionContext";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  /** Balise du conteneur */
  as?: "div" | "section" | "article" | "aside" | "ul";
  /** Sélecteur des éléments à animer (par défaut : enfants directs) */
  target?: string;
  /** Décalage vertical de départ (px) */
  y?: number;
  /** Délai entre chaque élément (s) */
  stagger?: number;
  duration?: number;
  /** Délai global avant la cascade (s) */
  delay?: number;
  /** Point de déclenchement ScrollTrigger */
  start?: string;
  /** false : l'animation se rejoue à l'envers quand on remonte */
  once?: boolean;
  children?: ReactNode;
}

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
}: RevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  // La balise varie (div, ul…) : une fonction qui accepte n'importe quel
  // élément HTML convient à toutes, contrairement à un ref typé sur une seule.
  const setContainer = useCallback((node: HTMLElement | null) => {
    containerRef.current = node;
  }, []);
  const { revealed } = useTransition();
  const count = Children.count(children);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root || prefersReducedMotion()) return;

      const els = target
        ? gsap.utils.toArray<HTMLElement>(target, root)
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
    <Tag ref={setContainer} className={className} {...rest}>
      {children}
    </Tag>
  );
}

export default Reveal;
