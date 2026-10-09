import { useRef } from "react";
import SplitType from "split-type";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { useTransition } from "../context/transitionContext";

/**
 * SplitHeading — titre révélé mot par mot au scroll.
 *
 * SplitType découpe le texte en mots, puis GSAP les fait monter
 * depuis un masque avec une légère rotation. Le DOM est restauré
 * au démontage (split.revert()) pour rester compatible avec
 * React StrictMode.
 *
 * @param {string}  as     — niveau de titre (h1, h2, h3)
 * @param {string}  className
 * @param {string}  start  — déclenchement ScrollTrigger
 * @param {number}  stagger — délai entre chaque mot (s)
 */
function SplitHeading({
  as: Tag = "h2",
  className = "",
  start = "top 85%",
  stagger = 0.05,
  duration = 1,
  delay = 0,
  children,
}) {
  const headingRef = useRef(null);
  const { revealed } = useTransition();

  useGSAP(
    () => {
      const el = headingRef.current;
      if (!el || !el.textContent?.trim() || prefersReducedMotion()) return;

      // Rideau encore baissé : on masque, l'animation partira ensuite
      if (!revealed) {
        gsap.set(el, { opacity: 0 });
        return;
      }

      const split = new SplitType(el, { types: "words" });
      const words = split.words;
      if (!words.length) return;

      gsap.fromTo(
        words,
        {
          opacity: 0,
          yPercent: 110,
          rotateX: -45,
        },
        {
          opacity: 1,
          yPercent: 0,
          rotateX: 0,
          duration,
          delay,
          ease: "power4.out",
          stagger,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
          },
        }
      );

      return () => split.revert();
    },
    { scope: headingRef, dependencies: [revealed], revertOnUpdate: true }
  );

  return (
    <Tag ref={headingRef} className={`split-heading ${className}`}>
      {children}
    </Tag>
  );
}

export default SplitHeading;
