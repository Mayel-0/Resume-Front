function About({briefs = []}) {
  return (
    <section id="apropos" className="section shell">
      <div className="section__head">
        <span className="section__index">01</span>
        <h2>À propos de moi</h2>
      </div>
      <div className="about">
        <p className="about__text">Bonjour, je m’appelle Maël LLADO. Je suis actuellement étudiant à l’école privée Ynov Campus Bordeaux, après avoir obtenu mon Baccalauréat Professionnel SN (Systèmes Numériques), option RISC, avec la mention Très Bien, au lycée polyvalent Jean-Monnet de Libourne.</p>
        <aside className="about__aside card">
          <h3>En bref</h3>
          <dl>
            {briefs.map((brief) => (
              <div><dt>{brief.title}</dt><dd>{brief.subtitle}</dd></div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}

export default About;
