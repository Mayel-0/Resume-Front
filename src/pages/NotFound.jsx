import { ArrowLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

function Notfound() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".not-found__icon", {
        scale: 0,
        rotate: -180,
        duration: 0.9,
        ease: "back.out(1.8)",
      })
        .from(".not-found .eyebrow", { opacity: 0, y: 20, duration: 0.5 }, "-=0.4")
        .from(
          "#not-found-title",
          { opacity: 0, y: 44, duration: 0.8 },
          "-=0.25"
        )
        .from(
          ".not-found__message",
          { opacity: 0, y: 26, duration: 0.6 },
          "-=0.4"
        )
        .from(
          ".not-found .btn",
          { opacity: 0, y: 20, scale: 0.94, duration: 0.55, ease: "back.out(1.8)" },
          "-=0.3"
        );

      // La boussole tourne lentement en continu
      gsap.to(".not-found__icon", {
        rotate: 360,
        duration: 18,
        repeat: -1,
        ease: "none",
        delay: 1.2,
      });
    },
    { scope: containerRef }
  );

  return (
    <main className="not-found" aria-labelledby="not-found-title" ref={containerRef}>
      <div className="not-found__content">
        <span className="not-found__icon" aria-hidden="true">
          <Compass size={28} strokeWidth={1.6} />
        </span>
        <p className="eyebrow">Erreur 404</p>
        <h1 id="not-found-title">Cette page a pris un autre chemin.</h1>
        <p className="not-found__message">
          L’adresse demandée n’existe pas ou n’est plus disponible. Revenez à
          l’accueil pour poursuivre votre visite.
        </p>
        <Link className="btn btn--accent" to="/" data-magnetic="0.3">
          <ArrowLeft size={17} aria-hidden="true" />
          Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}

export default Notfound;
