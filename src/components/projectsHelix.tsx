import { MoveRight } from "lucide-react";
import { assetUrl } from "../lib/api";
import WorldPanel from "./worldPanel";
import TransitionLink from "./transitionLink";
import { useWorldActive } from "../context/worldContext";
import type { Project, ProjectTag } from "../models";

interface ProjectsHelixProps {
  projects?: Project[];
  projectsTags?: ProjectTag[];
}

/** Les projets autour de l'hélice, dans le monde. Hors du monde, la section classique prend le relais. */
function ProjectsHelix({ projects = [], projectsTags = [] }: ProjectsHelixProps) {
  const world = useWorldActive();
  if (!world) return null;

  return (
    <>
      <WorldPanel kind="ptitle" d="1.62,3.62" label="Projets" tone="mandarine" anchor="projets">
        <h2 className="chapter" id="projets">Ce que j'ai construit</h2>
      </WorldPanel>
      {projects.map((project) => {
        const tags = projectsTags.filter((item) => item.projectId === project.id).map((item) => item.tag);
        const externalUrl = project.githubUrl ?? project.liveUrl;
        return (
          <WorldPanel key={project.id} kind="card" label="Projets" tone="mandarine" anchor="projets">
            <article className="fiche card">
              <div className="fiche__media">
                {project.imageUrl && <img src={assetUrl(project.imageUrl)} alt={`Aperçu du projet ${project.title}`} />}
              </div>
              <div className="fiche__body">
                {project.year && <p className="fiche__when">{project.year}</p>}
                <h3>{project.title}</h3>
                <div className="fiche__more">
                  {project.intro && <p className="fiche__intro">{project.intro}</p>}
                  {tags.length > 0 && <p className="fiche__tags">{tags.join(" · ")}</p>}
                  <div className="fiche__links">
                    <TransitionLink className="fiche__link" to={`/ProjectsD#${project.slug}`}>
                      Détails <MoveRight size={16} aria-hidden="true" />
                    </TransitionLink>
                    {externalUrl && (
                      <a className="fiche__link" href={externalUrl} target="_blank" rel="noopener noreferrer">
                        {project.linkLabel ?? "Voir le projet"}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </WorldPanel>
        );
      })}
    </>
  );
}

export default ProjectsHelix;
