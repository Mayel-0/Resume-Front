import { MoveRight } from "lucide-react";
import { useState, useEffect } from "react";

const getProfile = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profil`);
    if (!response.ok) throw new Error("Erreur profil");
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getSocials = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/socials`);
    if (!response.ok) throw new Error("Erreur socials");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

function Hero() {

  const [Profil, setProfil] = useState(null);
  const [Socials, setSocials] = useState(null);

  useEffect(() => {
    getProfile().then(setProfil);
    getSocials().then(setSocials);
  }, []);

  if (!Profil || !Socials) return <p>Chargement...</p>;

  return (
    <section className="Hero" id="hero">
      <div className="shell hero__inner">
        <div className="hero__text">
          <span className="location">{Profil.location}</span>
          <h1>
            {Profil.firstName}<br />
            <span>{Profil.lastName}</span>
          </h1>
          <p className="hero__role">{Profil.role}</p>
          <p className="hero__tagline">{Profil.tagline}</p>

          <div className="hero__actions">
            <a className="btn btn--accent" href="#projets">Voir mes projets
              <MoveRight size={24} aria-hidden="true" />
            </a>
            <a className="btn" href="/fichiers/CV_Mael_LLADO_V3.pdf" download>Télécharger le CV</a>
            <a className="btn btn--ghost" href="/fichiers/PortfolioMaelLLADO.pdf" download>Portfolio</a>
          </div>

          <ul className="hero__socials">
            {Socials.map((socials) => (
              <li key={socials.order}>
                <a href={socials.href} target="_blank" rel="noopener noreferrer" aria-label={socials.label}>
                  <svg
                    viewBox={socials.viewBox || socials.viewbox}
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d={socials.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__portrait">
          <div className="hero__glow" aria-hidden="true"></div>
          <img src={`${import.meta.env.VITE_API_URL}${Profil.portraitUrl}`} alt={`Portrait de ${Profil.firstName} ${Profil.lastName}`} />
        </div>
      </div>

      <div className="shell">
        <ul className="hero__highlights">
          <li>
            <strong>Ynov campus</strong>
            <span>Informatique</span>
          </li>
          <li>
            <strong>Bac Pro SN</strong>
            <span>option RISC — mention Très Bien (MDP)</span>
          </li>
          <li>
            <strong>11</strong>
            <span>projets réalisés</span>
          </li>
          <li>
            <strong>8</strong>
            <span>langages utilisés</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Hero;

