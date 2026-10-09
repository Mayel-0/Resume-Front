import { useRef } from "react";
import SplitType from "split-type";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { CV_URL, CV_FILENAME } from "../lib/api";

function Footer() {
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const giantRef = useRef<HTMLParagraphElement>(null);

  // Le nom géant monte lettre par lettre en arrivant en bas de page
  useGSAP(
    () => {
      const giant = giantRef.current;
      if (!giant || prefersReducedMotion()) return;

      const split = new SplitType(giant, { types: "chars" });

      gsap.fromTo(
        split.chars,
        { yPercent: 110 },
        {
          yPercent: 0,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 96%",
            end: "bottom bottom",
            scrub: 0.6,
          },
        }
      );

      return () => split.revert();
    },
    { scope: footerRef }
  );

  return (
    <footer className="footer" ref={footerRef}>
      <p className="footer__giant" ref={giantRef} aria-hidden="true">Maël Llado</p>

      <div className="footer__inner">
        <p>© {year} Maël LLADO — Bordeaux, France</p>
        <div className="footer__links">
          <a href="https://www.linkedin.com/in/llado-mael-54008a384/" target="_blank" rel="noopener noreferrer">Linkedin</a>
          <a href="https://github.com/Mayel-0" target="_blank" rel="noopener noreferrer">Github</a>
          <a href="mailto:llado.mael33@gmail.com">Gmail</a>
          <a href={CV_URL} download={CV_FILENAME}>CV</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
