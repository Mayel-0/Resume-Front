import { MoveRight } from "lucide-react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useRef } from "react";

// Enregistrer UNIQUEMENT les plugins officiels GSAP
gsap.registerPlugin(ScrambleTextPlugin, TextPlugin, ScrollTrigger, useGSAP);

function Hero({ profil = {}, socials = [] , isReady = false}) {
  const containerHero = useRef();
  const firstNameHero = useRef();
  const HeroPortrait = useRef();
  const lastNameHero = useRef();
  const locationRef = useRef();

  useGSAP(
    () => {
      const root = containerHero.current;
      if (!root || !isReady || !profil?.firstName || !profil?.lastName) return;

      // Accessibilité : si l'utilisateur préfère moins de mouvement,
      // on n'applique aucun état "from" → le contenu reste visible tel quel.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // --- Découpe du texte -----------------------------------
      const lastSplit = new SplitType(lastNameHero.current, { types: "chars" });
      const locationSplit = new SplitType(locationRef.current, { types: "words" });

      // --- Éléments ciblés ------------------------------------
      const socialItems = root.querySelectorAll(".hero__socials li");
      const actionBtns = root.querySelectorAll(".hero__actions .btn");
      const role = root.querySelector(".hero__role");
      const tagline = root.querySelector(".hero__tagline");
      const counters = Array.from(
        root.querySelectorAll(".hero__highlights strong")
      ).filter((el) => /^\d+$/.test(el.textContent.trim()));

      // --- Timeline d'ouverture cinématique -------------------
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Localisation — les mots entrent en cascade
      tl.fromTo(
        locationSplit.words,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.06 },
        0.15
      );

      // 2. Prénom en scramble
      tl.fromTo(
        firstNameHero.current,
        { scrambleText: { text: "", chars: "upperCase" } },
        {
          duration: 1.9,
          scrambleText: {
            text: profil.firstName,
            chars: "upperCase",
            revealDelay: 0.4,
            speed: 0.45,
          },
          ease: "none",
        },
        0.3
      );

      // 3. Nom de famille — chars qui tombent en 3D
      tl.fromTo(
        lastSplit.chars,
        { opacity: 0, yPercent: 120, rotateX: -80 },
        {
          opacity: 1,
          yPercent: 0,
          rotateX: 0,
          duration: 0.9,
          ease: "back.out(1.6)",
          stagger: 0.05,
        },
        0.75
      );

      // 4. Portrait : entrée ample, puis halo
      tl.fromTo(
        HeroPortrait.current,
        { opacity: 0, y: 70, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power4.out" },
        0.9
      );
      tl.fromTo(
        ".hero__glow",
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" },
        1.1
      );

      // 5. Rôle + tagline
      tl.fromTo(role, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.7 }, 1.25);
      tl.fromTo(tagline, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.7 }, 1.4);

      // 6. Boutons d'action
      tl.fromTo(
        actionBtns,
        { opacity: 0, y: 24, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.8)" },
        1.55
      );

      // 7. Réseaux sociaux
      tl.fromTo(
        socialItems,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" },
        1.75
      );

      // 8. Highlights (stats) — le bloc apparaît, puis les textes
      // en cascade (les cellules gardent leur fond, pas de flash)
      const highlights = root.querySelector(".hero__highlights");
      tl.fromTo(
        highlights,
        { opacity: 0, y: 44 },
        { opacity: 1, y: 0, duration: 0.75 },
        1.9
      );
      const highlightTexts = root.querySelectorAll(
        ".hero__highlights li strong, .hero__highlights li span"
      );
      tl.fromTo(
        highlightTexts,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.05,
          ease: "power2.out",
        },
        2.0
      );

      // 9. Compteurs numériques (11 projets, 8 langages…)
      counters.forEach((el) => {
        const target = parseInt(el.textContent.trim(), 10);
        const state = { value: 0 };
        el.textContent = "0";
        tl.to(
          state,
          {
            value: target,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(state.value));
            },
          },
          2.1
        );
      });

      // --- Flottement continu du portrait + halo ----------------
      tl.add(() => {
        gsap.to(HeroPortrait.current, {
          y: -14,
          duration: 2.8,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        const glowEl = root.querySelector(".hero__glow");
        if (glowEl) {
          gsap.to(glowEl, {
            scale: 1.07,
            opacity: 0.9,
            duration: 3.2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
        }
      });

      // --- Parallaxe à la souris (portrait + halo) -------------
      const portraitImg = root.querySelector(".hero__portrait img");
      const glow = root.querySelector(".hero__glow");
      const canHover = window.matchMedia("(hover: hover)").matches;

      let onPointerMove;
      if (canHover && portraitImg) {
        const toImgX = gsap.quickTo(portraitImg, "x", { duration: 0.8, ease: "power3.out" });
        const toImgY = gsap.quickTo(portraitImg, "y", { duration: 0.8, ease: "power3.out" });
        const toGlowX = glow
          ? gsap.quickTo(glow, "xPercent", { duration: 1.2, ease: "power3.out" })
          : null;

        onPointerMove = (e) => {
          const rect = root.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          toImgX(nx * 26);
          toImgY(ny * 18);
          toGlowX?.(nx * 6);
        };
        root.addEventListener("pointermove", onPointerMove);
      }

      return () => {
        if (onPointerMove) root.removeEventListener("pointermove", onPointerMove);
        lastSplit.revert();
        locationSplit.revert();
      };
    },
    { scope: containerHero, dependencies: [isReady, profil?.firstName, profil?.lastName] }
  );

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
            <a className="btn btn--accent" href="#projets" data-magnetic="0.3">
              Voir mes projets
              <MoveRight size={24} aria-hidden="true" />
            </a>
            <a className="btn" onClick={handleDownload} aria-label="Télécharger le CV" data-magnetic="0.3">
              Télécharger le CV
            </a>
          </div>

          <ul className="hero__socials">
            {socials.map((social) => (
              <li key={social.order}>
                <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} data-magnetic="0.4">
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
