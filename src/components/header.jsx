import { Download, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isProjectsPage = location.pathname === "/ProjectsD";
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const isFirstRender = useRef(true);

  // Entrée du header au chargement de l'app
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(headerRef.current, {
        y: -80,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.1,
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
  // pendant le render (voir aussi PageLoader), pas dans l'effet.
  const [prevIsHomePage, setPrevIsHomePage] = useState(isHomePage);
  if (prevIsHomePage !== isHomePage) {
    setPrevIsHomePage(isHomePage);
    if (!isHomePage) setActiveSection("");
  }

  useEffect(() => {
    if (!isHomePage) {
      return undefined;
    }

    const sections = ["apropos", "parcours", "competences", "projets", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    let frameId;

    const updateActiveSection = () => {
      const activationLine = Math.min(window.innerHeight * 0.35, 260);
      const currentSection = sections.find((section) => {
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

    updateActiveSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
    };
  }, [isHomePage]);

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

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
    <header className="header" ref={headerRef}>
      <div className="header__inner">
        <a className="header__brand" href="/">
          <span>ML</span>
          <span>Maël LLADO</span>
        </a>

        <nav ref={navRef} id="main-navigation" className={`header__nav${isMenuOpen ? " header__nav--open" : ""}`} aria-label="Navigation principale">
          <a
          href="/#apropos"
          className={isHomePage && activeSection === "apropos" ? "is-active" : ""}
          aria-current={isHomePage && activeSection === "apropos" ? "location" : undefined}
          onClick={() => handleNavClick("apropos")}
          >À propos</a>
          <a
            href="/#parcours"
            className={isHomePage && activeSection === "parcours" ? "is-active" : ""}
            aria-current={isHomePage && activeSection === "parcours" ? "location" : undefined}
            onClick={() => handleNavClick("parcours")}
          >Parcours</a>
          <a
            href="/#competences"
            className={isHomePage && activeSection === "competences" ? "is-active" : ""}
            aria-current={isHomePage && activeSection === "competences" ? "location" : undefined}
            onClick={() => handleNavClick("competences")}
          >Compétences</a>
          <a
            href="/#projets"
            className={isHomePage && activeSection === "projets" ? "is-active" : ""}
            aria-current={isHomePage && activeSection === "projets" ? "location" : undefined}
            onClick={() => handleNavClick("projets")}
          >Projets</a>
          <a
            href="/#contact"
            className={isHomePage && activeSection === "contact" ? "is-active" : ""}
            aria-current={isHomePage && activeSection === "contact" ? "location" : undefined}
            onClick={() => handleNavClick("contact")}
          >Contact</a>
          <a
            href="/ProjectsD"
            className={isProjectsPage ? "is-active" : ""}
            aria-current={isProjectsPage ? "page" : undefined}
            onClick={() => handleNavClick("projectsD")}
          >Détail des projets</a>
        </nav>

        <div>
          <a className="header__cv" onClick={handleDownload} aria-label="..." data-magnetic="0.25">
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
    </header>
  );
}

export default Header;
