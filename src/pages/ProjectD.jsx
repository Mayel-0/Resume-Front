import { useState, useRef } from "react";
import useApi from "../hooks/useApi";
import { usePageReady } from "../context/transitionContext";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import ProjectArticle from "../components/projectArticle";
import ApiError from "../components/apiError";
import Reveal from "../components/reveal";
import SplitHeading from "../components/splitHeading";

const FILTERS = ["All", "Public", "Privé"];

function ProjectPage() {
  const projects = useApi("/api/projects");
  const projectsTags = useApi("/api/project-tags");
  const projectsStack = useApi("/api/project-tech-stack");
  const requests = [projects, projectsTags, projectsStack];
  const loading = requests.some((request) => request.loading);
  const hasError = requests.some((request) => request.error);

  const [filtreActive, setFiltreActive] = useState("All");

  const filteredProjects = projects.data.filter(
    (project) => filtreActive === "All" || project.visibility === filtreActive
  );

  // Le rideau se lève (et scrolle vers l'ancre du projet) une fois prêt
  usePageReady(!loading);

  const containerRef = useRef();

  useGSAP(
    () => {
      if (loading || !filteredProjects.length) return;
      if (prefersReducedMotion()) return;

      const items = gsap.utils.toArray(".project", containerRef.current);

      items.forEach((project) => {
        gsap.fromTo(
          project,
          {
            opacity: 0,
            y: 80,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top 82%",
              toggleActions: "play none none reverse",
              markers: false,
            },
          }
        );

        // L'image dézoome et glisse dans son cadre pendant le scroll
        const img = project.querySelector(".projectD-article__media img");
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.25, yPercent: -6 },
            {
              scale: 1.05,
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: project,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });
    },
    {
      scope: containerRef,
      dependencies: [loading, filteredProjects.length, filtreActive],
      revertOnUpdate: true,
    }
  );

  // Filtres : micro-animation à chaque changement de filtre
  const filtersRef = useRef(null);
  const isFirstFilter = useRef(true);
  useGSAP(
    () => {
      // Pas au montage : l'entrée est déjà gérée par Reveal
      if (isFirstFilter.current) {
        isFirstFilter.current = false;
        return;
      }
      if (!filtersRef.current || prefersReducedMotion()) return;
      const buttons = filtersRef.current.querySelectorAll("button");
      gsap.fromTo(
        buttons,
        { scale: 0.9, opacity: 0.4 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: "back.out(2)",
          overwrite: true,
        }
      );
    },
    { scope: filtersRef, dependencies: [filtreActive] }
  );

  if (hasError) return <ApiError />;

  return (
    <main>
      <section id="projectsD" className="projectD">
        <Reveal className="projectD__head shell" y={40} stagger={0.1}>
          <span className="eyebrow">Portfolio</span>
          <SplitHeading as="h1">Détail des projets</SplitHeading>
          <p className="section__lead">
            Chaque projet est présenté avec son contexte, un extrait du README, les langages et les
            bibliothèques utilisées.
          </p>
          <div className="projectD__filters" role="group" aria-label="Filtrer les projets" ref={filtersRef}>
            {FILTERS.map((filter) => (
              <button
                className={`btn btn--sm${filtreActive === filter ? " btn--accent" : ""}`}
                key={filter}
                type="button"
                aria-pressed={filtreActive === filter}
                data-magnetic="0.2"
                onClick={() => setFiltreActive(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Le ref est placé ici */}
        <div className="shell projectD__list" ref={containerRef}>
          {filteredProjects.map((project) => (
            /* VRAIE BALISE HTML avec la classe .project */
            <div className="project" key={project.id}>
              <ProjectArticle
                projects={project}
                projectsTags={projectsTags.data}
                projectsStack={projectsStack.data}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ProjectPage;
