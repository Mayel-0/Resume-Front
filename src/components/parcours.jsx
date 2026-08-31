function Parcours() {
  return (
    <section id="parcours" className="section shell">
      <div className="section__head">
        <span className="section__index">02</span>
        <h2>Parcours et expériences</h2>
      </div>

      <ol className="timeline">
        <li>
          <span className="timeline__period">Aujourd'hui</span>
          <div className="timeline__body">
            <h3>Ynov Campus Bordeaux</h3>
            <p className="timeline__subtitle">Étudiant en informatique</p>
            <p>Cursus informatique : développement web, algorithmique, Golang, projets d'équipe et Ydays.</p>
          </div>
        </li>
        <li>
          <span className="timeline__period">Baccalauréat</span>
          <div className="timeline__body">
            <h3>Bac Pro SN option RISC</h3>
            <p className="timeline__subtitle">Lycée Jean-Monnet, Libourne — Mention Très Bien</p>
            <p>Systèmes numériques, réseaux, installation et sécurité informatique.</p>
          </div>
        </li>
        <li>
          <span className="timeline__period">Stages</span>
          <div className="timeline__body">
            <h3>Snark Factory</h3>
            <p className="timeline__subtitle">Développement web</p>
            <p>Découverte du développement web : HTML, CSS, SCSS, JavaScript et réalisation de sites en Vue.js.</p>
          </div>
        </li>
        <li>
          <span className="timeline__period">Stages</span>
          <div className="timeline__body">
            <h3>Maintenance & boutique spécialisée</h3>
            <p className="timeline__subtitle">Support et matériel informatique</p>
            <p>Maintenance informatique et conseil en boutique, pour élargir mes compétences techniques.</p>
          </div>
        </li>
      </ol>

      <div className="narrative">
        <article id="apropos" className="card narrative__card">
          <span className="section__index">01</span>
          <h3>À propos de moi</h3>
          <p>Bonjour, je m'appelle <strong>Maël LLADO.</strong> Je suis actuellement étudiant à l'école privée <strong>Ynov Campus Bordeaux</strong>, après avoir obtenu mon <strong>Baccalauréat Professionnel SN (Systèmes Numériques), option RISC</strong>, avec la <strong>mention Très Bien</strong>, au lycée polyvalent Jean-Monnet de Libourne.</p>
        </article>
        <article id="parcours-detail" className="card narrative__card">
          <span className="section__index">02</span>
          <h3>Parcours et expériences</h3>
          <p>Passionné d'informatique depuis le collège, j'ai orienté mon parcours vers la programmation. Lors de mes stages chez <strong>Snark Factory</strong>, j'ai découvert le développement web et appris le <strong>HTML, CSS, SCSS et le JavaScript</strong>, en réalisant plusieurs sites en <strong>Vue.js.</strong></p>
        </article>
        <article id="projets-perso" className="card narrative__card">
          <span className="section__index">03</span>
          <h3>Projets personnels</h3>
          <p>En autodidacte, j'ai appris le <strong>Python</strong> et développé un de mes plus gros projets : un logiciel de <strong>reconnaissance faciale</strong>, présenté à l'oral de mon Bac.</p>
        </article>
        <article id="objectifs" className="card narrative__card">
          <span className="section__index">04</span>
          <h3>Objectifs</h3>
          <p>Mon objectif est de continuer à apprendre et à acquérir de l'expérience dans différents domaines de l'informatique. Je souhaite devenir <strong>polyvalent</strong>, aussi bien en <strong>développement web, full-stack</strong> qu'en <strong>programmation de jeux vidéo.</strong></p>
        </article>
      </div>
    </section>
  );
}

export default Parcours;
