import Reveal from "./reveal";
import SplitHeading from "./splitHeading";

function About({briefs = []}) {
  return (
    <section id="apropos" className="section shell">
      <Reveal className="section__head" y={24} stagger={0.12}>
        <span className="section__index">01</span>
        <SplitHeading as="h2">À propos de moi</SplitHeading>
      </Reveal>
      <Reveal className="about" y={50} stagger={0.15} start="top 78%">
        <p className="about__text">Bonjour, je m’appelle Maël LLADO. Je suis actuellement étudiant à l’école privée Ynov Campus Bordeaux, après avoir obtenu mon Baccalauréat Professionnel SN (Systèmes Numériques), option RISC, avec la mention Très Bien, au lycée polyvalent Jean-Monnet de Libourne.</p>
        <aside className="about__aside card">
          <h3>En bref</h3>
          <dl>
            {briefs.map((brief) => (
              <div key={brief.title}><dt>{brief.title}</dt><dd>{brief.subtitle}</dd></div>
            ))}
          </dl>
        </aside>
      </Reveal>
    </section>
  );
}

export default About;
