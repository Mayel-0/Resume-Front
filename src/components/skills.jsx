import Reveal from "./reveal";
import SplitHeading from "./splitHeading";

function Skills({skillCategories = [], skillsItems = []}) {
  return (
    <section id="competences" className="section shell">
      <Reveal className="section__head" y={24} stagger={0.12}>
        <span className="section__index">03</span>
        <SplitHeading as="h2">Compétences</SplitHeading>
      </Reveal>
      <Reveal y={30}>
        <p className="section__lead">
          Les technologies que j'utilise au quotidien dans mes projets d'école et personnels.
        </p>
      </Reveal>

      <div className="skills">
        {skillCategories.map((category, i) => (
          <Reveal
            as="article"
            className="card"
            key={category.order}
            y={44}
            delay={i * 0.08}
            start="top 85%"
          >
            <h3>{category.title}</h3>
            <div className="tag-list">
              {skillsItems
                .filter((item) => item.categoryId === category.id)
                .map((item) => (
                  <span className="tag" key={item.id}>
                    {item.label}
                  </span>
                ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Skills;
