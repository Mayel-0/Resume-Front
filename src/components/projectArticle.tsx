import { assetUrl } from "../lib/api";
import type { Project, ProjectTag, ProjectTechStack } from "../models";

interface ProjectArticleProps {
  project: Project;
  projectsTags?: ProjectTag[];
  projectsStack?: ProjectTechStack[];
}

function ProjectArticle({ project, projectsTags = [], projectsStack = [] }: ProjectArticleProps) {
  const stack = projectsStack.filter((item) => item.projectId === project.id);

  return (
    <article id={project.slug} className="card projectD-article">
      <div className="projectD-article__grid">
        <div className="projectD-article__media">
          <img src={assetUrl(project.imageUrl)} alt={`${project.title}`} loading="lazy" />
        </div>
        <div className="projectD-article__intro">
          <div className="projectD-article__top">
            <h2>{project.title}</h2>
            <span className={`status${project.visibility === "Privé" ? " status--private" : ""}`} >{project.visibility}</span>
          </div>
          <div className="tag-list projectD-article__tags">
            <span className="projectD-article__tag">{project.year}</span>
            {projectsTags.filter((item) => item.projectId === project.id).map((item) => (
              <span className="projectD-article__tag" key={item.id}>{item.tag}</span>
            ))}
          </div>
          <p>{project.intro}</p>
          <h3>{project.contextTitle}</h3>
          <p>{project.context}</p>
        </div>
      </div>
      <div className="projectD-article__readme">
        <p>{project.readme}</p>
        <span className="projectD-article__caption">Voici un extrait du README</span>
        {project.note && <p className="projectD-article__note">{project.note}</p>}
      </div>

      <div className="projectD-article__stack">
        <div>
          <h3>Langage</h3>
          <div className="projectD-article__tag-list">
            {stack.filter((item) => item.type === "language").map((item) => (
              <span className="projectD-article__tag" key={item.id}>{item.label}</span>
            ))}
          </div>
        </div>
        <div>
          <h3>Frameworks & bibliothèques</h3>
          <div className="projectD-article__tag-list">
            {stack.filter((item) => item.type === "framework").map((item) => (
              <span className="projectD-article__tag" key={item.id}>{item.label}</span>
            ))}
          </div>
        </div>
      </div>
      {project.githubUrl && <a href={project.githubUrl} className="btn btn--accent projectD-article__link" target="_blank" rel="noopener noreferrer" data-magnetic="0.2">{project.linkLabel}</a>}
      {project.liveUrl && <a href={project.liveUrl} className="btn btn--accent projectD-article__link" target="_blank" rel="noopener noreferrer" data-magnetic="0.2">{project.linkLabel}</a>}
    </article>
  );
}

export default ProjectArticle;
