import { MoveRight } from "lucide-react";
import SplitType from "split-type";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion, canHover } from "../lib/gsap";
import { useTransition } from "../context/transitionContext";
import { assetUrl, CV_URL, CV_FILENAME } from "../lib/api";
import TransitionLink from "./transitionLink";

function Hero({ profil = {}, socials = [] }) {
  const containerHero = useRef();
  const firstNameHero = useRef();
  const HeroPortrait = useRef();
  const lastNameHero = useRef();
  const locationRef = useRef();
  const { revealed } = useTransition();

  useGSAP(
    () => {
      const root = containerHero.current;
      // On attend les données ET la levée du rideau
      if (!root || !revealed || !profil?.firstName || !profil?.lastName) return;

      // Accessibilité : si l'utilisateur préfère moins de mouvement,
      // on n'applique aucun état "from" → le contenu reste visible tel quel.
      if (prefersReducedMotion()) return;

      // --- Découpe du texte -----------------------------------
      const lastSplit = new SplitType(lastNameHero.current, { types: "chars" });
      const locationSplit = new SplitType(locationRef.current, { types: "words" });

      // --- Éléments ciblés ------------------------------------
      const socialItems = root.querySelectorAll(".hero__socials li");
      const actionBtns = root.querySelectorAll(".hero__actions .btn");
      const role = root.querySelector(".hero__role");
      const tagline = root.querySelector(".hero__tagline");
      // La valeur cible est mémorisée : le texte passe à 0 pendant l'animation
      const counters = Array.from(
        root.querySelectorAll(".hero__highlights strong")
      ).filter((el) => {
        el.dataset.count ??= el.textContent.trim();
        return /^\d+$/.test(el.dataset.count);
      });

      // --- Timeline d'ouverture cinématique -------------------
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 0. Décor : la grille et les halos s'installent
      tl.fromTo(
        ".hero__bg",
        { opacity: 0, scale: 1.12 },
        { opacity: 1, scale: 1, duration: 2.2, ease: "power2.out" },
        0
      );

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
        const target = parseInt(el.dataset.count, 10);
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

      // 10. Invitation à scroller
      tl.fromTo(".hero__scroll", { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.6 }, 2.6);

      // --- Flottement continu du portrait + halo ----------------
      const float = gsap.to(HeroPortrait.current, {
        y: -14,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        paused: true,
      });
      const breathe = gsap.to(".hero__glow", {
        scale: 1.07,
        opacity: 0.9,
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        paused: true,
      });
      tl.add(() => {
        float.play();
        breathe.play();
      });

      // --- Sortie au scroll : le texte s'efface, le portrait
      // descend moins vite que la page (profondeur) --------------
      gsap.to(".hero__text", {
        yPercent: -16,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero__portrait-wrap", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero__bg", {
        yPercent: 22,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      // --- Parallaxe à la souris (portrait + halo) -------------
      const portraitImg = root.querySelector(".hero__portrait img");
      const glow = root.querySelector(".hero__glow");

      let onPointerMove;
      if (canHover() && portraitImg) {
        const toImgX = gsap.quickTo(portraitImg, "x", { duration: 0.8, ease: "power3.out" });
        const toImgY = gsap.quickTo(portraitImg, "y", { duration: 0.8, ease: "power3.out" });
        const toGlowX = glow
          ? gsap.quickTo(glow, "xPercent", { duration: 1.2, ease: "power3.out" })
          : null;
        const toOrbsX = gsap.quickTo(".hero__orbs", "x", { duration: 1.6, ease: "power3.out" });
        const toOrbsY = gsap.quickTo(".hero__orbs", "y", { duration: 1.6, ease: "power3.out" });

        onPointerMove = (e) => {
          const rect = root.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          toImgX(nx * 26);
          toImgY(ny * 18);
          toGlowX?.(nx * 6);
          toOrbsX(nx * -60);
          toOrbsY(ny * -40);
        };
        root.addEventListener("pointermove", onPointerMove);
      }

      return () => {
        if (onPointerMove) root.removeEventListener("pointermove", onPointerMove);
        lastSplit.revert();
        locationSplit.revert();
      };
    },
    {
      scope: containerHero,
      dependencies: [revealed, profil?.firstName, profil?.lastName],
      revertOnUpdate: true,
    }
  );

  return (
    <section className="hero" id="hero" ref={containerHero}>
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <div className="hero__orbs">
          <span className="hero__orb hero__orb--a" />
          <span className="hero__orb hero__orb--b" />
        </div>
      </div>

      <div className="shell hero__inner">
        <div className="hero__text">
          <span ref={locationRef} className="hero__location">{profil.location}</span>
          <h1>
            <span ref={firstNameHero} className="hero__first">{profil.firstName}</span><br />
            <span ref={lastNameHero} className="hero__last">{profil.lastName}</span>
          </h1>
          <p className="hero__role">{profil.role}</p>
          <p className="hero__tagline">{profil.tagline}</p>

          <div className="hero__actions">
            <TransitionLink className="btn btn--accent" to="/#projets" data-magnetic="0.3">
              Voir mes projets
              <MoveRight size={24} aria-hidden="true" />
            </TransitionLink>
            <a className="btn" href={CV_URL} download={CV_FILENAME} data-magnetic="0.3">
              Télécharger le CV
            </a>
          </div>

          <ul className="hero__socials">
            {socials.map((social) => (
              <li key={social.id}>
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

        {/* Deux niveaux : le wrap suit le scroll, le portrait flotte */}
        <div className="hero__portrait-wrap">
          <div ref={HeroPortrait} className="hero__portrait">
            <div className="hero__glow" aria-hidden="true"></div>
            {profil.portraitUrl && (
              <img
                src={assetUrl(profil.portraitUrl)}
                alt={`Portrait de ${profil.firstName} ${profil.lastName}`}
                onLoad={() => ScrollTrigger.refresh()}
              />
            )}
          </div>
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

        <div className="hero__scroll" aria-hidden="true">
          <span />
          Scroll
        </div>
      </div>
    </section>
  );
}

export default Hero;
