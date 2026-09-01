import { useState, useEffect } from "react";

const getTimeline = async () => {
  try {
    const repsonse = await fetch(`${import.meta.env.VITE_API_URL}/api/timeline`);
    if (!repsonse.ok) throw new Error("Erreur timeline");
    const data = await repsonse.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getSection = async () => {
  try {
    const repsonse = await fetch(`${import.meta.env.VITE_API_URL}/api/sections`);
    if (!repsonse.ok) throw new Error("Erreur sections");
    const data = await repsonse.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function Parcours() {
  const [Timeline, setTimeline] = useState(null);
  const [Sections, setSections] = useState(null);

  useEffect(() => {
    getTimeline().then(setTimeline);
    getSection().then(setSections);
  }, []);

  if (!Timeline || !Sections) return <p>Chargement...</p>;

  return (
    <section id="parcours" className="section shell">
      <div className="section__head">
        <span className="section__index">02</span>
        <h2>Parcours et expériences</h2>
      </div>

      <ol className="timeline">
        {Timeline.map((body) => (
          <li key={body.id}>
            <span className="timeline__period">{body.period}</span>
            <div className="timeline__body">
              <h3>{body.title}</h3>
              <p className="timeline__subtitle">{body.subtitle}</p>
              <p>{body.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="narrative">
        {Sections.map((items) => (
        <article id="apropos" className="card narrative__card" key={items.order}>
          <span className="section__index">{items.index}</span>
          <h3>{items.title}</h3>
          <p dangerouslySetInnerHTML={{ __html: items.html }} />
        </article>
        ))}
      </div>
    </section>
  );
}

export default Parcours;
