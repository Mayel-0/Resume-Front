function Skills() {
  return (
    <section id="competences" className="section shell">
      <div className="section__head">
        <span className="section__index">03</span>
        <h2>Compétences</h2>
      </div>
      <p className="section__lead">
        Les technologies que j'utilise au quotidien dans mes projets d'école et personnels.
      </p>

      <div className="skills">
        <article className="card">
          <h3>Langages</h3>
          <div className="tag-list">
            <span className="tag">Golang</span>
            <span className="tag">Python</span>
            <span className="tag">JavaScript</span>
            <span className="tag">HTML</span>
            <span className="tag">CSS / SCSS</span>
            <span className="tag">SQL</span>
          </div>
        </article>

        <article className="card">
          <h3>Front-end</h3>
          <div className="tag-list">
            <span className="tag">Vue.js</span>
            <span className="tag">React</span>
            <span className="tag">Vite</span>
            <span className="tag">GSAP</span>
            <span className="tag">Responsive design</span>
          </div>
        </article>

        <article className="card">
          <h3>Back-end & données</h3>
          <div className="tag-list">
            <span className="tag">Go (net/http)</span>
            <span className="tag">Node.js</span>
            <span className="tag">PostgreSQL</span>
            <span className="tag">APIs REST</span>
            <span className="tag">Authentification A2F</span>
          </div>
        </article>

        <article className="card">
          <h3>Autres</h3>
          <div className="tag-list">
            <span className="tag">Git & GitHub</span>
            <span className="tag">Cybersécurité / CTF</span>
            <span className="tag">Linux</span>
            <span className="tag">Nginx / PM2</span>
            <span className="tag">Raspberry Pi / NAS</span>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Skills;
