import PageLoader from "../components/pagesLoader";
import { useState, useRef } from "react";
import useProjects from "../hooks/useProject";
import useProjectsTags from "../hooks/useProjectsTags";
import useProjectsStack from "../hooks/useProjectsStack";
import ProjectArticle from "../components/projectArticle";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function ProjectPage() {
  const { projects, loading: loadingProjects } = useProjects();
  const { projectsTags, loading: loadingProjectsTags } = useProjectsTags();
  const { projectsStack, loading: loadingProjectsStack } = useProjectsStack();
  const loading = [loadingProjects, loadingProjectsTags, loadingProjectsStack].some(Boolean);

  const FILTERS = ["All", "Public", "Privé"];
  const [filtreActive, setFiltreActive] = useState("All");

  const filteredProjects = projects.filter(
    (project) => filtreActive === "All" || project.visibility === filtreActive
  );

  const containerRef = useRef();

  useGSAP(
    () => {
      if (loading || !filteredProjects.length) return;

      const items = gsap.utils.toArray(".project");

      items.forEach((project) => {
        gsap.fromTo(
          project,
          {
            opacity: 0,
            x: 100
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: project,
              start: "top 80%",
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

  return (
    <div>
      <PageLoader loading={loading}>
        <main>
          <section id="projectsD" className="projectD">
            <div className="projetD__head shell">
              <span className="eyebrow">Portfolio</span>
              <h1>Détail des projets</h1>
              <p className="section__lead">
                Chaque projet est présenté avec son contexte, un extrait du README, les langages et les
                bibliothèques utilisées.
              </p>
              <div className="projetD__filters" role="tablist" aria-label="Filtrer les projets">
                {FILTERS.map((filter) => (
                  <button
                    className={`btn btn--sm${filtreActive === filter ? " btn--accent" : ""}`}
                    key={filter}
                    type="button"
                    role="tab"
                    aria-selected={filtreActive === filter}
                    onClick={() => setFiltreActive(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

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
