import PageLoader from "../components/pagesLoader";
import { useEffect, useState, useRef } from "react";
import useProjects from "../hooks/useProject";
import useProjectsTags from "../hooks/useProjectsTags";
import useProjectsStack from "../hooks/useProjectsStack";
import ProjectArticle from "../components/projectArticle";
import Reveal from "../components/reveal";
import SplitHeading from "../components/splitHeading";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function ProjectPage() {
  const { projects, loading: loadingProjects } = useProjects();
  const { projectsTags, loading: loadingProjectsTags } = useProjectsTags();
  const { projectsStack, loading: loadingProjectsStack } = useProjectsStack();
  const loading = [loadingProjects, loadingProjectsTags, loadingProjectsStack].some(Boolean);
  const location = useLocation();

  const FILTERS = ["All", "Public", "Privé"];
  const [filtreActive, setFiltreActive] = useState("All");

  const filteredProjects = projects.filter(
    (project) => filtreActive === "All" || project.visibility === filtreActive
  );

  useEffect(() => {
    if (loading || !location.hash) return undefined;

    const timer = window.setTimeout(() => {
      const project = document.getElementById(location.hash.slice(1));
      project?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [loading, location.hash, filteredProjects.length]);

  const containerRef = useRef();

  useGSAP(
    () => {
      if (loading || !filteredProjects.length) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
      });

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => clearTimeout(timer);
    },
    {
      scope: containerRef,
      dependencies: [loading, filteredProjects, filtreActive],
    }
  );

  // Filtres : micro-animation à chaque changement de filtre
  const filtersRef = useRef(null);
  useGSAP(
    () => {
      if (!filtersRef.current) return;
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

  return (
    <div>
      <PageLoader loading={loading}>
        <main>
          <section id="projectsD" className="projectD">
            <Reveal className="projetD__head shell" y={40} stagger={0.1}>
              <span className="eyebrow">Portfolio</span>
              <SplitHeading as="h1">Détail des projets</SplitHeading>
              <p className="section__lead">
                Chaque projet est présenté avec son contexte, un extrait du README, les langages et les
                bibliothèques utilisées.
              </p>
              <div className="projetD__filters" role="tablist" aria-label="Filtrer les projets" ref={filtersRef}>
                {FILTERS.map((filter) => (
                  <button
                    className={`btn btn--sm${filtreActive === filter ? " btn--accent" : ""}`}
                    key={filter}
                    type="button"
                    role="tab"
                    aria-selected={filtreActive === filter}
                    data-magnetic="0.2"
                    onClick={() => setFiltreActive(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </Reveal>

            {/* Le ref est placé ici */}
            <div className="shell projetD__list" ref={containerRef}>
              {filteredProjects.map((project) => (
                /* VRAIE BALISE HTML avec la classe .project */
                <div className="project" key={project.id}>
                  <ProjectArticle
                    projects={project}
                    projectsTags={projectsTags}
                    projectsStack={projectsStack}
                  />
                </div>
              ))}
            </div>
          </section>
        </main>
      </PageLoader>
    </div>
  );
}

export default ProjectPage;
