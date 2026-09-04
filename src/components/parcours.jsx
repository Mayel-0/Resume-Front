import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Parcours({timeline = [], sections = []}) {
  const containerRef = useRef();

  useGSAP(
    () => {
      if (!timeline.length) return;

      gsap.utils.toArray(".timeline__item").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: 100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 65%",
              toggleActions: "play none none reverse",
              markers: false,
            },
          }
        );
      });
    },
    { scope: containerRef, dependencies: [timeline] }
  );

  return (
    <section id="parcours" className="section shell">
      <div className="section__head">
        <span className="section__index">02</span>
        <h2>Parcours et expériences</h2>
      </div>

      <ol className="timeline" ref={containerRef}>
        {timeline.map((item) => (
          <li className="timeline__item" key={item.order}>
            <span className="timeline__period">{item.period}</span>
            <div className="timeline__body">
              <h3>{item.title}</h3>
              <p className="timeline__subtitle">{item.subtitle}</p>
              <p>{item.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="narrative">
        {sections.map((section) => (
          <article
            id={section.sectionId}
            className="card narrative__card"
            key={section.order}
          >
            <span className="section__index">{section.index}</span>
            <h3>{section.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: section.html }} />
          </article>
        ))}
      </div>
    </section>
  );
}

export default Parcours;
