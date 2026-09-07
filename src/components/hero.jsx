import { MoveRight } from "lucide-react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import SplitType from "split-type";
import { useRef, useEffect } from "react";

// Enregistrer UNIQUEMENT les plugins officiels GSAP
gsap.registerPlugin(ScrambleTextPlugin, TextPlugin);

function Hero({ profil = {}, socials = [] , isReady = false}) {
  const containerHero = useRef();
  const firstNameHero = useRef();
  const HeroPortrait = useRef();
  const lastNameHero = useRef();
  const locationRef = useRef();

  useEffect(() => {
    if (!isReady || !profil?.firstName || !profil?.lastName) return;

    const ctx = gsap.context(() => {
      const split = new SplitType(lastNameHero.current, { types: "chars" });
      const socialItems = containerHero.current.querySelectorAll(".hero__socials li");
      const locationSplit = new SplitType(locationRef.current, { types: "words" });
      const tl = gsap.timeline();

      tl.fromTo(
        firstNameHero.current,
        {
          scrambleText: { text: "", chars: "upperCase" },
        },
        {
          duration: 2,
          scrambleText: {
            text: profil.firstName,
            chars: "upperCase",
            revealDelay: 0.5,
            speed: 0.4,
          },
        }
      )
      .fromTo(
        split.chars,
        {
          opacity: 0,
          y: 50,
          duration: 0.5,
          stagger: 0.08,
        },
        {
          delay: 0.8,
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.08,
        },
        "<"
      )
      .fromTo(HeroPortrait.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 2,
        },
        "<"
      )
      .fromTo(socialItems,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
      )
    }, containerHero); // On englobe le composant entier

    return () => ctx.revert();
  }, [isReady, profil?.firstName, profil?.lastName]);

  const handleDownload = async () => {
    const url = `${import.meta.env.VITE_API_URL}/documents/Cv_Mael_llado.pdf`;
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "CV_Mael_Llado.pdf";
    a.click();

    URL.revokeObjectURL(blobUrl);
  };

  return (
    <section className="hero" id="hero" ref={containerHero}>
      <div className="shell hero__inner">
        <div className="hero__text">
          <span ref={locationRef} className="hero__location">{profil.location}</span>
          <h1>
            <label ref={firstNameHero}>{profil.firstName}</label><br />
            <span ref={lastNameHero}>{profil.lastName}</span>
          </h1>
          <p className="hero__role">{profil.role}</p>
          <p className="hero__tagline">{profil.tagline}</p>

          <div className="hero__actions">
            <a className="btn btn--accent" href="#projets">
              Voir mes projets
              <MoveRight size={24} aria-hidden="true" />
            </a>
            <a className="btn" onClick={handleDownload} aria-label="Télécharger le CV">
              Télécharger le CV
            </a>
          </div>

          <ul className="hero__socials">
            {socials.map((social) => (
              <li key={social.order}>
                <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                  <svg
                    viewBox={social.viewBox || social.viewbox}
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div ref={HeroPortrait} className="hero__portrait">
          <div className="hero__glow" aria-hidden="true"></div>
          <img src={`${import.meta.env.VITE_API_URL}${profil.portraitUrl}`} alt={`Portrait de ${profil.firstName} ${profil.lastName}`} />
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
