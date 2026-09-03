import { Download, Menu, X } from "lucide-react";
import { useState } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          onClick={() => setIsMenuOpen(false)}
          >À propos</a>
          <a href="#parcours" onClick={() => setIsMenuOpen(false)}>Parcours</a>
          <a href="#competences" onClick={() => setIsMenuOpen(false)}>Compétences</a>
          <a href="#projets" onClick={() => setIsMenuOpen(false)}>Projets</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
          <a href="#Dprojets" onClick={() => setIsMenuOpen(false)}>Détail des projets</a>
        </nav>

        <div>
          <a className="header__cv" href="/fichiers/CV_Mael_LLADO_V3.pdf" download>
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
