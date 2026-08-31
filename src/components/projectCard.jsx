import { MoveRight } from "lucide-react";

function ProjectCard({ project }) {
  return (
    <article className="project-card card">
      <a
        className="project-card__media"
        href={`/projet#${project.id}`}
        aria-label={`Voir le détail du projet ${project.title}`}
      >
        <img
          src={project.image}
          alt={`Aperçu du projet ${project.title}`}
          loading="lazy"
        />
      </a>

      <div className="project-card__body">
        <div className="project-card__top">
          <h3>{project.title}</h3>
          <span className={`status${project.visibility === "Privé" ? " status--private" : ""}`}>
            {project.visibility}
          </span>
        </div>

        <p className="project-card__intro">{project.intro}</p>

        <div className="tag-list">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <div className="project-card__actions">
          <a className="btn btn--sm" href={`/projet#${project.id}`}>
            Détails
            <MoveRight size={16} aria-hidden="true" />
          </a>
          <a
            className="btn btn--sm btn--ghost"
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            >
            {project.linkLabel}
          </a>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
