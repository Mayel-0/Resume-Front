import { MoveRight } from "lucide-react";
import { assetUrl } from "../lib/api";
import TransitionLink from "./transitionLink";
import type { Project, ProjectTag } from "../models";
import useSiteTexts from "../hooks/useSiteTexts";

interface ProjectCardProps {
  project: Project;
  projectsTags?: ProjectTag[];
}

function ProjectCard({ project, projectsTags = [] }: ProjectCardProps) {
  const { t } = useSiteTexts();
  return (
    <article className="project-card card" data-tilt>
      <TransitionLink
        className="project-card__media"
        to={`/ProjectsD#${project.slug}`}
        aria-label={t("projects.cardLabel", { title: project.title })}
        data-cursor="Voir"
      >
        <img
          src={assetUrl(project.imageUrl)}
          alt={t("projects.imageAlt", { title: project.title })}
          loading="lazy"
        />
      </TransitionLink>

      <div className="project-card__body">
        <div className="project-card__top">
          <h3>{project.title}</h3>
          <span className={`status${project.visibility === "Privé" ? " status--private" : ""}`}>
            {project.visibility}
          </span>
        </div>

        <p className="project-card__intro">{project.intro}</p>

        <div className="tag-list project-card__tags">
          {projectsTags
            .filter((item) => item.projectId === project.id)
            .map((item) => (
              <span className="tag" key={item.id}>
                {item.tag}
              </span>
            ))}
        </div>

        <div className="project-card__actions">
          <TransitionLink className="btn btn--sm" to={`/ProjectsD#${project.slug}`}>
            {t("cta.details")}
            <MoveRight size={16} aria-hidden="true" />
          </TransitionLink>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              className="btn btn--sm btn--accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.linkLabel}
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              className="btn btn--sm btn--accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.linkLabel}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
