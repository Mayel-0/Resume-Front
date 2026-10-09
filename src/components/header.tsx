import { Download, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { useTransition } from "../context/transitionContext";
import { CV_URL, CV_FILENAME } from "../lib/api";
import TransitionLink from "./transitionLink";

const SECTIONS = [
  { id: "apropos", label: "À propos" },
  { id: "parcours", label: "Parcours" },
  { id: "competences", label: "Compétences" },
  { id: "projets", label: "Projets" },
  { id: "contact", label: "Contact" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();
  const { revealed } = useTransition();
  const isHomePage = location.pathname === "/";
  const isProjectsPage = location.pathname.toLowerCase() === "/projectsd";
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);
  const menuOpenRef = useRef(false);
  const hideRef = useRef<gsap.core.Tween | null>(null);
  // Juste après une levée de rideau, le header reste affiché même si
  // la page vient de sauter vers une ancre.
  const lockedUntil = useRef(0);

  useEffect(() => {
    menuOpenRef.current = isMenuOpen;
  }, [isMenuOpen]);

  // Entrée du header à chaque levée de rideau
  useGSAP(
    () => {
      if (!revealed || prefersReducedMotion()) return;
      lockedUntil.current = performance.now() + 900;
      hideRef.current?.reverse();
      gsap.fromTo(
        ".header__inner",
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 }
      );
    },
    { scope: headerRef, dependencies: [revealed] }
  );

  // Barre de progression + header qui s'efface quand on descend
  useGSAP(
    () => {
      const header = headerRef.current;

      gsap.to(".header__progress span", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      ScrollTrigger.create({
        start: 24,
        end: "max",
        toggleClass: { targets: header, className: "header--scrolled" },
      });

      if (prefersReducedMotion()) return;

      const hide = gsap.to(header, {
        yPercent: -100,
        duration: 0.45,
        ease: "power3.inOut",
        paused: true,
      });
      hideRef.current = hide;

      // Jamais masqué en haut de page : sur une page courte, le trigger
      // peut se déclencher alors qu'on n'a pas encore scrollé.
      const HIDE_AFTER = 220;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (menuOpenRef.current || performance.now() < lockedUntil.current) return;
          if (self.direction === 1 && self.scroll() > HIDE_AFTER) hide.play();
          else hide.reverse();
        },
      });
    },
    { scope: headerRef }
  );

  // Menu mobile : ouverture en cascade GSAP
  useGSAP(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      const links = navRef.current?.querySelectorAll("a");
      if (!links?.length) return;

      if (isMenuOpen) {
        gsap.fromTo(
          links,
          { opacity: 0, y: -14, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.05,
            ease: "back.out(1.7)",
            overwrite: true,
          }
        );
        gsap.fromTo(
          navRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", overwrite: true }
        );
      }
    },
    { scope: headerRef, dependencies: [isMenuOpen] }
  );

  // Reset de la section active quand on quitte la home — ajustement
  // pendant le render, pas dans l'effet.
  const [prevIsHomePage, setPrevIsHomePage] = useState(isHomePage);
  if (prevIsHomePage !== isHomePage) {
    setPrevIsHomePage(isHomePage);
    if (!isHomePage) setActiveSection("");
  }

  useEffect(() => {
    if (!isHomePage) {
      return undefined;
    }

    let frameId: number | undefined;

    const updateActiveSection = () => {
      const activationLine = Math.min(window.innerHeight * 0.35, 260);
      const currentSection = SECTIONS.map(({ id }) => document.getElementById(id))
        .filter((section): section is HTMLElement => section !== null)
        .find((section) => {
          const { top, bottom } = section.getBoundingClientRect();
          return top <= activationLine && bottom > activationLine;
        });

      setActiveSection(currentSection?.id ?? "");
      frameId = undefined;
    };

    const handleScroll = () => {
      if (frameId === undefined) {
        frameId = window.requestAnimationFrame(updateActiveSection);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
    };
  }, [isHomePage]);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <header className="header" ref={headerRef}>
      <div className="header__inner">
        <TransitionLink className="header__brand" to="/" onClick={() => setIsMenuOpen(false)}>
          <span>ML</span>
          <span>Maël LLADO</span>
        </TransitionLink>

        <nav ref={navRef} id="main-navigation" className={`header__nav${isMenuOpen ? " header__nav--open" : ""}`} aria-label="Navigation principale">
          {SECTIONS.map(({ id, label }) => {
            const isActive = isHomePage && activeSection === id;
            return (
              <TransitionLink
                key={id}
                to={`/#${id}`}
                className={isActive ? "is-active" : ""}
                aria-current={isActive ? "location" : undefined}
                onClick={() => handleNavClick(id)}
              >
                {label}
              </TransitionLink>
            );
          })}
          <TransitionLink
            to="/ProjectsD"
            className={isProjectsPage ? "is-active" : ""}
            aria-current={isProjectsPage ? "page" : undefined}
            onClick={() => setIsMenuOpen(false)}
          >
            Détail des projets
          </TransitionLink>
        </nav>

        <div>
          <a className="header__cv" href={CV_URL} download={CV_FILENAME} data-magnetic="0.25">
            <Download size={16} aria-hidden="true" />
            Télécharger le CV
          </a>

          <button
            className="header__menu"
            type="button"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className="header__progress" aria-hidden="true">
        <span />
      </div>
    </header>
  );
}

export default Header;
