import Reveal from "./reveal";
import SplitHeading from "./splitHeading";
import type { SkillCategory, SkillItem } from "../models";

interface SkillsProps {
  skillCategories?: SkillCategory[];
  skillsItems?: SkillItem[];
}

function Skills({ skillCategories = [], skillsItems = [] }: SkillsProps) {
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

      <Reveal className="skills" y={60} stagger={0.1} start="top 85%">
        {skillCategories.map((category) => (
          <article className="card" key={category.id} data-tilt>
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
          </article>
        ))}
      </Reveal>
    </section>
  );
}

export default Skills;
