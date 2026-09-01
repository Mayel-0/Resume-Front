import ProjectCard from "./projectCard";
import eldoria from "../assets/images/Eldoria.webp";
import faceRecognition from "../assets/images/FaceRecognition.webp";
import ctf from "../assets/images/CTF.webp";
import onePieceDle from "../assets/images/onepiecedle.png";
import cloudPerso from "../assets/images/cloudperso.png";
import techTalk from "../assets/images/tecktalk.png";

import { MoveRight } from "lucide-react";
import { useState, useEffect } from "react";

const getProjects = async () => {
    try {
    const repsonse = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
    if (!repsonse.ok) throw new Error("Erreur projects");
    const data = await repsonse.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function Projets() {
  const [projects, setProjects] = useState(null);
  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  if (!projects) return <p>Chargement...</p>;

  return (
    <section id="projets" className="projects section shell">
      <div className="section__head">
        <span className="section__index">04</span>
        <h2>Projets</h2>
      </div>
      <p className="section__lead">
        Une sélection de projets d'école et personnels, du jeu CLI en Go au cloud auto-hébergé.
      </p>

      <div className="projects__grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="projects__more">
        <a className="btn btn--accent" href="/projet">
          Voir tous les détails techniques
          <MoveRight size={24} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export default Projets;
