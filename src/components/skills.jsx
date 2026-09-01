import { useState, useEffect } from "react";

const getSkillCategories = async () => {
  try {
    const repsonse = await fetch(`${import.meta.env.VITE_API_URL}/api/skill-categories`);
    if (!repsonse.ok) throw new Error("Erreur skill-categories");
    const data = await repsonse.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const getSkills = async () => {
  try {
    const repsonse = await fetch(`${import.meta.env.VITE_API_URL}/api/skill-items`);
    if (!repsonse.ok) throw new Error("Erreur skill-items");
    const data = await repsonse.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function Skills() {

  const [skillCategories, setSkillCatgeories] = useState(null);
  const [skillItems, setSkillItems] = useState(null);

  useEffect(() => {
    getSkillCategories().then(setSkillCatgeories);
    getSkills().then(setSkillItems);
  }, []);

  if (!skillCategories || !skillItems) return <p>Chargement...</p>;

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
        {skillCategories.map((category) => (
          <article className="card" key={category.order}>
            <h3>{category.title}</h3>
            <div className="tag-list">
              {skillItems
                .filter((item) => item.categoryId === category.id)
                .map((item) => (
                  <span className="tag" key={item.id}>
                    {item.label}
                  </span>
                ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Skills;
