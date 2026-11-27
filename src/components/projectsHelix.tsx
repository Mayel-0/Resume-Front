import { MoveRight } from "lucide-react";
import { assetUrl } from "../lib/api";
import WorldPanel from "./worldPanel";
import TransitionLink from "./transitionLink";
import { useWorldActive } from "../context/worldContext";
import type { Project, ProjectTag } from "../models";
import useSiteTexts from "../hooks/useSiteTexts";

interface ProjectsHelixProps {
  projects?: Project[];
  projectsTags?: ProjectTag[];
}

/** Les projets autour de l'hélice, dans le monde. Hors du monde, la section classique prend le relais. */
function ProjectsHelix({ projects = [], projectsTags = [] }: ProjectsHelixProps) {
  const world = useWorldActive();
  const { t } = useSiteTexts();
  if (!world) return null;

  return (
    <>
      <WorldPanel kind="ptitle" d="1.62,3.62" label={t("projects.panelLabel")} tone="mandarine" anchor="projets">
        <h2 className="chapter" id="projets">{t("projects.helixTitle")}</h2>
      </WorldPanel>
      {projects.map((project) => {
        const tags = projectsTags.filter((item) => item.projectId === project.id).map((item) => item.tag);
        const externalUrl = project.githubUrl ?? project.liveUrl;
        return (
          <WorldPanel key={project.id} kind="card" label={t("projects.panelLabel")} tone="mandarine" anchor="projets">
            <article className="fiche card">
              <div className="fiche__media">
                {project.imageUrl && <img src={assetUrl(project.imageUrl)} alt={t("projects.imageAlt", { title: project.title })} />}
              </div>
              <div className="fiche__body">
                {project.year && <p className="fiche__when">{project.year}</p>}
                <h3>{project.title}</h3>
                <div className="fiche__more">
                  {project.intro && <p className="fiche__intro">{project.intro}</p>}
                  {tags.length > 0 && <p className="fiche__tags">{tags.join(" · ")}</p>}
                  <div className="fiche__links">
                    <TransitionLink className="fiche__link" to={`/ProjectsD#${project.slug}`}>
                      {t("cta.details")} <MoveRight size={16} aria-hidden="true" />
                    </TransitionLink>
                    {externalUrl && (
                      <a className="fiche__link" href={externalUrl} target="_blank" rel="noopener noreferrer">
                        {project.linkLabel ?? t("cta.viewProject")}
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
