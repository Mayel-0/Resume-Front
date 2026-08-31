import ProjectCard from "./projectCard";
import eldoria from "../assets/images/Eldoria.webp";
import faceRecognition from "../assets/images/FaceRecognition.webp";
import ctf from "../assets/images/CTF.webp";
import onePieceDle from "../assets/images/onepiecedle.png";
import cloudPerso from "../assets/images/cloudperso.png";
import techTalk from "../assets/images/tecktalk.png";

import { MoveRight } from "lucide-react";


const projects = [
  { id: "eldoria", title: "Projet_Red: Eldoria", image: eldoria, visibility: "Public",
    intro: "Jeu d'aventure textuel CLI réalisé en une semaine en Golang lors de la B1 à Ynov.", tags: ["Golang", "CLI", "Jeu"],
    link: "https://github.com/StarWeizz/projet-red_Eldoria", linkLabel: "Voir sur GitHub" },
  { id: "face-recognition", title: "Face Recognition", image: faceRecognition, visibility: "Public",
    intro: "Logiciel de reconnaissance faciale en Python présenté à l'oral du Bac Pro SN.", tags: ["Python", "Vision", "OpenCV"],
    link: "https://github.com/Mayel-0/projet-chef-doeuvre-2024", linkLabel: "Voir sur GitHub" },
  { id: "ctf", title: "CTF", image: ctf, visibility: "Privé",
    intro: "Participation au CTF 2025 Root Me — entraînement au hacking éthique.", tags: ["Cybersécurité", "Root Me", "Web"],
    link: "https://github.com/Mayel-0/CTF-Entrainement-et-Realisation", linkLabel: "Voir sur GitHub" },
  { id: "one-piece-dle", title: "One Piece DLE", image: onePieceDle, visibility: "Public",
    intro: "Fan game basé sur l'univers de One Piece, mode classique et fruits du démon.", tags: ["Vue.js", "Jeu", "Front-end"],
    link: "https://one-piece-dle-game.vercel.app/", linkLabel: "Voir le site" },
  { id: "cloud-perso", title: "Cloud Perso", image: cloudPerso, visibility: "Public",
    intro: "Cloud self-hosted full Golang avec gestion multi-utilisateurs, A2F et backups.", tags: ["Golang", "MySQL", "Self-hosted"],
    link: "https://github.com/Mayel-0/Cloud_perso", linkLabel: "Voir sur GitHub" },
  { id: "tech-talk", title: "Tech Talk", image: techTalk, visibility: "Privé",
    intro: "Plateforme de podcasts étudiants sur la tech et l'impact de l'IA sur nos métiers.", tags: ["Web", "Podcast", "En cours"],
    link: "https://github.com/Mayel-0/Tech_Talk-Remaster-JS", linkLabel: "Voir sur GitHub" },
];

function Projets() {
  return (
    <section id="projets" className="projects section shell">
      <div className="section__head">
        <span className="section__index">06</span>
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
