import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import Reveal from "./reveal";
import SplitHeading from "./splitHeading";
import WorldPanel from "./worldPanel";
import { useWorldActive } from "../context/worldContext";
import type { Section, TimelineItem } from "../models";
import useSiteTexts from "../hooks/useSiteTexts";

interface ParcoursProps {
  timeline?: TimelineItem[];
}

function Parcours({ timeline = [] }: ParcoursProps) {
  const { t } = useSiteTexts();
  const containerRef = useRef<HTMLOListElement>(null);
  const world = useWorldActive();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container || world || !timeline.length) return;

      if (prefersReducedMotion()) return;

      // 1. La ligne de la timeline se DÉSSINE au fil du scroll (scrub)
      const line = container.querySelector(".timeline__line");
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top 70%",
              end: "bottom 75%",
              scrub: 0.6,
            },
          }
        );
      }

      // 2. Chaque étape entre en scène + son point s'allume
      gsap.utils.toArray<HTMLElement>(".timeline__item", container).forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: 70 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 68%",
              toggleActions: "play none none reverse",
              markers: false,
              onEnter: () => item.classList.add("is-lit"),
              onLeaveBack: () => item.classList.remove("is-lit"),
            },
          }
        );

        // Le point pulse quand il s'allume
        const dot = item.querySelector(".timeline__dot");
        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.6,
              ease: "back.out(2.5)",
              scrollTrigger: {
                trigger: item,
                start: "top 68%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    },
    { scope: containerRef, dependencies: [timeline, world], revertOnUpdate: true }
  );

  if (world) {
    return (
      <>
        <WorldPanel kind="title" d="0.42,2.55" label={t("parcours.panelLabel")} tone="menthe" anchor="parcours">
          <h2 className="chapter" id="parcours">{t("parcours.title")}</h2>
        </WorldPanel>
        {timeline.map((item, i) => (
          <WorldPanel key={item.id} kind="step" d="0.27,2.95" label={t("parcours.panelLabel")} tone="menthe" anchor="parcours" className={i % 2 ? "is-low" : ""}>
            <div className="step card">
              <span className="step__dot" aria-hidden="true" />
              <span className="step__when">{item.period}</span>
              <h3>{item.title}</h3>
              {item.subtitle && <p>{item.subtitle}</p>}
            </div>
          </WorldPanel>
        ))}
      </>
    );
  }

  return (
    <section id="parcours" className="section shell">
      <Reveal className="section__head" y={24} stagger={0.12}>
        <span className="section__index">02</span>
        <SplitHeading as="h2">{t("parcours.title")}</SplitHeading>
      </Reveal>

      <ol className="timeline" ref={containerRef}>
        {/* Ligne continue animée en scrub (remplace ::before statique) */}
        <span className="timeline__line" aria-hidden="true" />
        {timeline.map((item) => (
          <li className="timeline__item" key={item.id}>
            <span className="timeline__dot" aria-hidden="true" />
            <span className="timeline__period">{item.period}</span>
            <div className="timeline__body">
              <h3>{item.title}</h3>
              <p className="timeline__subtitle">{item.subtitle}</p>
              <p>{item.text}</p>
            </div>
          </li>
        ))}
      </ol>

    </section>
  );
}

/** Blocs de texte libre sous le parcours, saisis dans l'admin. */
export function ParcoursNarrative({ sections = [] }: { sections?: Section[] }) {
  return (
    <section className="section shell">
      <Reveal className="narrative" y={54} stagger={0.13} start="top 80%">
          {sections.map((section) => (
            <article
              id={section.sectionId}
              className="card narrative__card"
              key={section.id}
              data-tilt
            >
              <span className="section__index">{section.index}</span>
              <h3>{section.title}</h3>
              <div className="narrative__text" dangerouslySetInnerHTML={{ __html: section.html }} />
            </article>
          ))}
        </Reveal>
    </section>
  );
}

export default Parcours;
