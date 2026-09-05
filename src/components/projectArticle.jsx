import { useRef } from "react";

function ProjectArticle({projects = [], projectsTags = [], projectsStack = []}) {
  return (
    <article className="card projectD-article">
      <div className="projectD-article__grid">
        <div className="projectD-article__media">
          <img src={`${import.meta.env.VITE_API_URL}${projects.imageUrl}`} alt={`${projects.title}`} />
        </div>
        <div className="projectD-article__intro">
          <div className="projectD-article__top">
            <h2>{projects.title}</h2>
            <span className={`status${projects.visibility === "Privé" ? " status--private" : ""}`} >{projects.visibility}</span>
          </div>
          <div className="tag-list projectD-article__tags">
            <span className="projectD-article__tag">{projects.year}</span>
            {projectsTags.filter((item) => item.projectId === projects.id).map((item) => (
              <span className="projectD-article__tag">{item.tag}</span>
            ))}
          </div>
          <p>{projects.intro}</p>
          <h3>{projects.contextTitle}</h3>
          <p>{projects.context}</p>
        </div>
      </div>
      <div className="projectD-article__readme">
        <p>{projects.readme}</p>
        <span className="projectD-article__caption">Voici un extrait du README</span>
        {projects.note && <p className="projectD-article__note">{projects.note}</p>}
      </div>

      <div className="projectD-article__stack">
        <div>
          <h3>Langage</h3>
          <div className="projectD-article__tag-list">
            {projectsStack.filter((item) => item.projectId === projects.id && item.type === "language").map((item) => (
              <span className="projectD-article__tag">{item.label}</span>
            ))}
          </div>
        </div>
        <div>
          <h3>Frameworks & bibliothèques</h3>
          <div className="projectD-article__tag-list">
            {projectsStack.filter((item) => item.projectId === projects.id && item.type === "framework").map((item) => (
              <span className="projectD-article__tag">{item.label}</span>
            ))}
          </div>
        </div>
      </div>
      {projects.githubUrl && <a href={projects.githubUrl} className="btn btn--accent projectD-article__link">{projects.linkLabel}</a>}
      {projects.liveUrl && <a href={projects.liveUrl} className="btn btn--accent projectD-article__link">{projects.linkLabel}</a>}
    </article>
  );
}

export default ProjectArticle;
