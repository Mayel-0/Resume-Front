import portraitImg from '../assets/images/portrait.png';
import { MoveRight } from "lucide-react";

const icons = {
  linkedin: {
    viewBox: "0 0 26 24",
    path: "M3.32003 2.67041e-05C4.20408 -0.00350952 5.05333 0.344289 5.68095 0.966909C6.30858 1.58953 6.66316 2.43597 6.66669 3.32003C6.67023 4.20408 6.32243 5.05333 5.69981 5.68095C5.07719 6.30858 4.23075 6.66316 3.34669 6.66669C2.46264 6.67023 1.61339 6.32243 0.985765 5.69981C0.358144 5.07719 0.00356292 4.23075 2.67041e-05 3.34669C-0.00350952 2.46264 0.344289 1.61339 0.966909 0.985765C1.58953 0.358144 2.43597 0.00356292 3.32003 2.67041e-05ZM0.680027 7.33336H6.01336V23.3334H0.680027V7.33336ZM8.68003 7.33336H13.7467V9.60003H13.8134C14.52 8.26669 16.2667 6.86669 18.88 6.86669C24.2934 6.86669 25.28 10.4267 25.28 15V23.3334H19.9467V16.1334C19.9467 14.4 19.92 12.1334 17.4134 12.1334C14.88 12.1334 14.48 14 14.48 16V23.3334H8.68003V7.33336Z",
  },
  github: {
    viewBox: "0 0 32 31",
    path: "M15.3333 0C6.86667 0 0 6.86667 0 15.3333C0 22.1333 4.4 27.8667 10.5333 29.8667C11.3333 30 11.6 29.6 11.6 29.2V26.5333C7.33333 27.4667 6.4 24.5333 6.4 24.5333C5.73333 22.9333 4.8 22.4 4.8 22.4C3.46667 21.4667 4.93333 21.4667 4.93333 21.4667C6.4 21.6 7.2 22.9333 7.2 22.9333C8.53333 23.0667 8.13333 25.3333 10.9333 24.6667C11.0667 23.6 11.4667 22.9333 11.8667 22.5333C8.4 22.1333 4.66667 20.8 4.66667 14.6667C4.66667 12.9333 5.33333 11.4667 6.26667 10.2667C6.13333 9.86667 5.6 8.26667 6.4 6.13333C6.4 6.13333 7.73333 5.73333 10.9333 7.73333C12.2667 7.33333 13.7333 7.2 15.2 7.2C16.6667 7.2 18.1333 7.33333 19.4667 7.73333C22.6667 5.6 24 6.13333 24 6.13333C24.8 8.26667 24.2667 9.86667 24.1333 10.2667C25.0667 11.4667 25.7333 12.9333 25.7333 14.6667C25.7333 20.8 22 22.1333 18.4 22.5333C18.9333 22.9333 19.4667 23.8667 19.4667 25.3333V29.4667C19.4667 29.8667 19.7333 30.2667 20.5333 30.1333C26.6667 28.1333 31.0667 22.2667 31.0667 15.6C30.6667 6.86667 23.8 0 15.3333 0Z",
  },
  mail: {
    viewBox: "0 0 27 22",
    path: "M2.66667 0H24C24.7072 0 25.3855 0.280951 25.8856 0.781048C26.3857 1.28115 26.6667 1.95942 26.6667 2.66667V18.6667C26.6667 19.3739 26.3857 20.0522 25.8856 20.5523C25.3855 21.0524 24.7072 21.3333 24 21.3333H2.66667C1.95942 21.3333 1.28115 21.0524 0.781048 20.5523C0.280951 20.0522 0 19.3739 0 18.6667V2.66667C0 1.95942 0.280951 1.28115 0.781048 0.781048C1.28115 0.280951 1.95942 0 2.66667 0ZM2.66667 2.66667V2.68L13.3333 12L24 2.68V2.66667H2.66667ZM24 18.6667V6.66667L13.3333 14.6667L2.66667 6.66667V18.6667H24Z",
  },
};

function Hero() {
  return (
    <section className="Hero" id="hero">
      <div className="shell hero__inner">
        <div className="hero__text">
          <span className="location">Bordeaux, France</span>
          <h1>
            Maël<br />
            <span>LLADO</span>
          </h1>
          <p className="hero__role">Étudiant en informatique · Full Stack Développeur</p>
          <p className="hero__tagline">Développeur curieux et polyvalent, du front-end en Vue.js au back-end en Go, avec une sensibilité cybersécurité.</p>

          <div className="hero__actions">
            <a className="btn btn--accent" href="#projets">Voir mes projets
              <MoveRight size={24} aria-hidden="true" />
            </a>
            <a className="btn" href="/fichiers/CV_Mael_LLADO_V3.pdf" download>Télécharger le CV</a>
            <a className="btn btn--ghost" href="/fichiers/PortfolioMaelLLADO.pdf" download>Portfolio</a>
          </div>

          <ul>
            <li>
              <a href="https://www.linkedin.com/in/llado-mael-54008a384/" target="_blank" rel="noopener noreferrer" aria-label="Linkedin">
                {/* LinkedinIcon */}
              </a>
            </li>
            <li>
              <a href="https://github.com/Mayel-0" target="_blank" rel="noopener noreferrer" aria-label="Github">
                {/* GithubIcon */}
              </a>
            </li>
            <li>
              <a href="mailto:llado.mael33@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Gmail">
                {/* MailIcon */}
              </a>
            </li>
          </ul>
        </div>

        <div className="hero__portrait">
          <div className="hero__glow" aria-hidden="true"></div>
          <img src={portraitImg} alt="Portrait de Maël LLADO" />
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

