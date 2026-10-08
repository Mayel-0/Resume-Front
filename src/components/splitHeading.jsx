import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

  useGSAP(
    () => {
      const el = headingRef.current;
      if (!el || !el.textContent?.trim()) return;

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
    { scope: headingRef }
  );

  return (
    <Tag ref={headingRef} className={className}>
      {children}
    </Tag>
  );
}

export default SplitHeading;
