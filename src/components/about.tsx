import { useLayoutEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import Reveal from "./reveal";
import SplitHeading from "./splitHeading";
import WorldPanel from "./worldPanel";
import { useWorldActive } from "../context/worldContext";
import type { Brief } from "../models";
import useSiteTexts from "../hooks/useSiteTexts";

function About({ briefs = [] }: { briefs?: Brief[] }) {
  const { t } = useSiteTexts();
  const textRef = useRef<HTMLParagraphElement>(null);
  const world = useWorldActive();

  // Dans le monde, la caméra allume les mots : on les découpe seulement
  useLayoutEffect(() => {
    const text = textRef.current;
    if (!world || !text) return undefined;
    const split = new SplitType(text, { types: "words" });
    return () => split.revert();
  }, [world]);

  // Le paragraphe s'allume mot par mot, au rythme du scroll
  useGSAP(
    () => {
      const text = textRef.current;
      if (!text || world || prefersReducedMotion()) return;

      const split = new SplitType(text, { types: "words" });

      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: text,
            start: "top 82%",
            end: "bottom 55%",
            scrub: 0.4,
          },
        }
      );

      return () => split.revert();
    },
    { scope: textRef, dependencies: [world] }
  );

  const text = t("about.text");

  if (world) {
    return (
      <WorldPanel kind="about" d="1.6,1.75" label={t("about.panelLabel")} tone="lagon" anchor="apropos">
        <div id="apropos" className="about-card card">
          <h2>{t("about.title")}</h2>
          <p className="about__text" data-lit ref={textRef}>{text}</p>
          <dl className="about-card__facts">
            {briefs.map((brief) => (
              <div key={brief.id}><dt>{brief.title}</dt><dd>{brief.subtitle}</dd></div>
            ))}
          </dl>
        </div>
      </WorldPanel>
    );
  }

  return (
    <section id="apropos" className="section shell">
      <Reveal className="section__head" y={24} stagger={0.12}>
        <span className="section__index">01</span>
        <SplitHeading as="h2">{t("about.title")}</SplitHeading>
      </Reveal>
      <div className="about">
        <p className="about__text" ref={textRef}>{text}</p>
        <Reveal as="aside" className="about__aside card" y={50} stagger={0.12} start="top 78%" data-tilt>
          <h3>{t("about.brief")}</h3>
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
