import PageLoader from "../components/pagesLoader";
import { useState } from "react";
import useProjects from "../hooks/useProject.js";
import useProjectsTags from "../hooks/useProjectsTags.js";
import useProjectsStack from "../hooks/useprojectsStack.js";
import ProjectArticle from "../components/projectArticle.jsx";

function ProjectPage() {
  const { projects, loading: loadingProjects } = useProjects();
  const { projectsTags, loading: loadingProjectsTags } = useProjectsTags();
  const { projectsStack, loading: loadingProjectsStack } = useProjectsStack();
  const loading = [loadingProjects, loadingProjectsTags, loadingProjectsStack].some(Boolean)

  const FILTERS = ["All", "Public", "Privé"];
  const [filtreActive, setFiltreActive] = useState("All");

  const filteredProjects = projects.filter((project) =>
    filtreActive === "All" || project.visibility === filtreActive
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
            <div className="shell projetD__list">
              {filteredProjects.map((project) => (
                <ProjectArticle key={project.id} projects={project} projectsTags={projectsTags} projectsStack={projectsStack} />
              ))}
            </div>
          </section>
        </main>
      </PageLoader>
    </div>
  );
}

export default ProjectPage;
