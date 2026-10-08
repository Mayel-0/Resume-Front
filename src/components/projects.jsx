import ProjectCard from "./projectCard";
import Reveal from "./reveal";
import SplitHeading from "./splitHeading";

import { MoveRight } from "lucide-react";

function Projets({projects = [], projectsTags = []}) {
  return (
    <section id="projets" className="projects section shell">
      <Reveal className="section__head" y={24} stagger={0.12}>
        <span className="section__index">04</span>
        <SplitHeading as="h2">Projets</SplitHeading>
      </Reveal>
      <Reveal y={30}>
        <p className="section__lead">
          Une sélection de projets d'école et personnels, du jeu CLI en Go au cloud auto-hébergé.
        </p>
      </Reveal>

      <Reveal className="projects__grid" y={60} stagger={0.12} start="top 80%">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} projectsTags={projectsTags} />
        ))}
      </Reveal>

      <Reveal className="projects__more" y={30} start="top 92%">
        <a className="btn btn--accent" href="/ProjectsD" data-magnetic="0.3">
          Voir tous les détails techniques
          <MoveRight size={24} aria-hidden="true" />
        </a>
      </Reveal>
    </section>
  );
}

export default Projets;
