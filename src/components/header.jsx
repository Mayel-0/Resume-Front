import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isProjectsPage = location.pathname === "/ProjectsD";

  useEffect(() => {
    if (!isHomePage) {
      setActiveSection("");
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
    <header className="header">
      <div className="header__inner">
        <a className="header__brand" href="/">
          <span>ML</span>
          <span>Maël LLADO</span>
        </a>

        <nav id="main-navigation" className={`header__nav${isMenuOpen ? " header__nav--open" : ""}`} aria-label="Navigation principale">
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
          <a className="header__cv" onClick={handleDownload} aria-label="...">
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
