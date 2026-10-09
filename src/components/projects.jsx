import { useRef } from "react";
import { MoveRight } from "lucide-react";
import { gsap, useGSAP } from "../lib/gsap";
import ProjectCard from "./projectCard";
import Reveal from "./reveal";
import SplitHeading from "./splitHeading";
import TransitionLink from "./transitionLink";

// Doit rester identique à la media query de _projects.scss
const MEDIA = {
  horizontal:
    "(min-width: 1025px) and (min-height: 820px) and (prefers-reduced-motion: no-preference)",
  grid:
    "(max-width: 1024px) and (prefers-reduced-motion: no-preference), (max-height: 819px) and (prefers-reduced-motion: no-preference)",
};

const pad = (n) => String(n).padStart(2, "0");

function Projets({projects = [], projectsTags = []}) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const currentRef = useRef(null);
  const barRef = useRef(null);

  useGSAP(
    () => {
      if (!projects.length) return;

      const section = sectionRef.current;
      const track = trackRef.current;
      const mm = gsap.matchMedia();

      mm.add(MEDIA, (context) => {
        const cards = gsap.utils.toArray(".project-card", track);

        // --- Mobile / tablette : grille classique, entrée en cascade
        if (!context.conditions.horizontal) {
          gsap.from(cards, {
            opacity: 0,
            y: 60,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: track, start: "top 82%", once: true },
          });
          return;
        }

        // --- Desktop : la section se fige et les cartes défilent
        // à l'horizontale pendant que l'on scrolle verticalement.
        const distance = () =>
          Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

        const scrollTween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Rafraîchi avant les sections situées plus bas (contact,
            // footer) pour qu'elles tiennent compte de l'espace du pin.
            refreshPriority: 1,
            onUpdate: (self) => {
              gsap.set(barRef.current, { scaleX: self.progress });
              currentRef.current.textContent = pad(
                Math.min(cards.length, Math.floor(self.progress * cards.length) + 1)
              );
            },
          },
        });

        // Parallaxe interne : l'image glisse dans son cadre
        cards.forEach((card) => {
          const img = card.querySelector(".project-card__media img");
          if (!img) return;
          gsap.fromTo(
            img,
            { xPercent: -3.5, scale: 1.08 },
            {
              xPercent: 3.5,
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });

        // Entrée : les cartes arrivent en éventail avant le pin
        gsap.from(cards, {
          opacity: 0,
          y: 110,
          rotateZ: 4,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: section, start: "top 60%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [projects.length], revertOnUpdate: true }
  );

  return (
    <section id="projets" className="projects section" ref={sectionRef}>
      <div className="shell projects__head">
        <div>
          <Reveal className="section__head" y={24} stagger={0.12}>
            <span className="section__index">04</span>
            <SplitHeading as="h2">Projets</SplitHeading>
          </Reveal>
          <Reveal y={30}>
            <p className="section__lead">
              Une sélection de projets d'école et personnels, du jeu CLI en Go au cloud auto-hébergé.
            </p>
          </Reveal>
        </div>

        <div className="projects__progress" aria-hidden="true">
          <span ref={currentRef}>01</span>
          <div className="projects__bar">
            <span ref={barRef} />
          </div>
          <span>{pad(projects.length)}</span>
        </div>
      </div>

      <div className="projects__track" ref={trackRef}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} projectsTags={projectsTags} />
        ))}

        <div className="projects__more">
          <TransitionLink className="projects__all" to="/ProjectsD" data-magnetic="0.3">
            <span>Voir tous les détails techniques</span>
            <MoveRight size={28} aria-hidden="true" />
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}

export default Projets;
