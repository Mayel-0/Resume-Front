import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
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
  }, []);

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
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
          href="#apropos"
          className={activeSection === "apropos" ? "is-active" : ""}
          aria-current={activeSection === "apropos" ? "location" : undefined}
          onClick={() => handleNavClick("apropos")}
          >À propos</a>
          <a
            href="#parcours"
            className={activeSection === "parcours" ? "is-active" : ""}
            aria-current={activeSection === "parcours" ? "location" : undefined}
            onClick={() => handleNavClick("parcours")}
          >Parcours</a>
          <a
            href="#competences"
            className={activeSection === "competences" ? "is-active" : ""}
            aria-current={activeSection === "competences" ? "location" : undefined}
            onClick={() => handleNavClick("competences")}
          >Compétences</a>
          <a
            href="#projets"
            className={activeSection === "projets" ? "is-active" : ""}
            aria-current={activeSection === "projets" ? "location" : undefined}
            onClick={() => handleNavClick("projets")}
          >Projets</a>
          <a
            href="#contact"
            className={activeSection === "contact" ? "is-active" : ""}
            aria-current={activeSection === "contact" ? "location" : undefined}
            onClick={() => handleNavClick("contact")}
          >Contact</a>
          <a href="#Dprojets" onClick={() => handleNavClick("Dprojets")}>Détail des projets</a>
        </nav>

        <div>
          <a className="header__cv" href={`${import.meta.env.VITE_API_URL}/documents/Cv_Mael_llado.pdf`} download>
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
