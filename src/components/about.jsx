import { useRef } from "react";
import SplitType from "split-type";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import Reveal from "./reveal";
import SplitHeading from "./splitHeading";

function About({briefs = []}) {
  const textRef = useRef(null);

  // Le paragraphe s'allume mot par mot, au rythme du scroll
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const split = new SplitType(textRef.current, { types: "words" });

      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 82%",
            end: "bottom 55%",
            scrub: 0.4,
          },
        }
      );

      return () => split.revert();
    },
    { scope: textRef }
  );

  return (
    <section id="apropos" className="section shell">
      <Reveal className="section__head" y={24} stagger={0.12}>
        <span className="section__index">01</span>
        <SplitHeading as="h2">À propos de moi</SplitHeading>
      </Reveal>
      <div className="about">
        <p className="about__text" ref={textRef}>Bonjour, je m’appelle Maël LLADO. Je suis actuellement étudiant à l’école privée Ynov Campus Bordeaux, après avoir obtenu mon Baccalauréat Professionnel SN (Systèmes Numériques), option RISC, avec la mention Très Bien, au lycée polyvalent Jean-Monnet de Libourne.</p>
        <Reveal as="aside" className="about__aside card" y={50} stagger={0.12} start="top 78%" data-tilt>
          <h3>En bref</h3>
          <dl>
            {briefs.map((brief) => (
              <div key={brief.id}><dt>{brief.title}</dt><dd>{brief.subtitle}</dd></div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

export default About;
