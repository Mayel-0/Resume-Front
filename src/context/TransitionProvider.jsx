import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { getLenis, scrollToTarget } from "../lib/lenis";
import { TransitionContext } from "./transitionContext";

const PANELS = [0, 1, 2, 3, 4];
// Durée minimale du preloader (s) : même si l'API répond tout de suite,
// on laisse le temps de lire le nom et de voir le compteur tourner.
const MIN_INTRO = 1.7;

/**
 * TransitionProvider — rideau plein écran qui sert à la fois de
 * preloader (premier chargement, avec compteur) et de transition
 * entre les pages.
 *
 * Phases : intro → idle → leaving → entering → idle
 */
export default function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Chemin de la page dont les données sont prêtes
  const [readyFor, setReadyFor] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const pageReady = readyFor === pathname;

  const rootRef = useRef(null);
  const countRef = useRef(null);
  const barRef = useRef(null);
  const phase = useRef("intro");
  const pendingHash = useRef(window.location.hash);
  const progress = useRef({ value: 0 });
  const startedAt = useRef(0);

  const renderProgress = () => {
    const value = Math.round(progress.current.value);
    if (countRef.current) countRef.current.textContent = String(value).padStart(3, "0");
    if (barRef.current) barRef.current.style.transform = `scaleX(${value / 100})`;
  };

  // Recalcule les ScrollTrigger puis place le scroll (ancre ou haut de page)
  const settle = () => {
    ScrollTrigger.refresh();
    const hash = pendingHash.current;
    pendingHash.current = "";
    if (hash) scrollToTarget(hash, { immediate: true });
    else if (phase.current !== "intro") scrollToTarget(0, { immediate: true });
  };

  const finish = () => {
    phase.current = "idle";
    gsap.set(rootRef.current, { autoAlpha: 0 });
  };

  // Le rideau commence à se lever : les pages lancent leurs entrées
  const open = () => {
    settle();
    flushSync(() => setRevealed(true));
  };

  // Preloader : le compteur avance pendant que l'API répond
  useGSAP(
    () => {
      startedAt.current = performance.now();
      if (prefersReducedMotion()) return;
      gsap.from(".curtain__line > *", {
        yPercent: 110,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.08,
      });
      gsap.to(progress.current, {
        value: 85,
        duration: 2.4,
        ease: "power2.out",
        onUpdate: renderProgress,
      });
    },
    { scope: rootRef }
  );

  // La page est prête : on lève le rideau
  useGSAP(
    () => {
      if (!pageReady) return;

      if (phase.current === "idle") {
        // Navigation sans transition (précédent / suivant du navigateur)
        requestAnimationFrame(() => ScrollTrigger.refresh());
        return;
      }

      if (prefersReducedMotion()) {
        settle();
        setRevealed(true);
        finish();
        return;
      }

      const tl = gsap.timeline({ onComplete: finish });

      if (phase.current === "intro") {
        const elapsed = (performance.now() - startedAt.current) / 1000;
        tl.to(progress.current, {
          value: 100,
          duration: Math.max(0.6, MIN_INTRO - elapsed),
          ease: "power2.inOut",
          overwrite: true,
          onUpdate: renderProgress,
        })
          .to(
            ".curtain__line > *",
            { yPercent: -110, duration: 0.6, ease: "power3.in", stagger: 0.05 },
            "+=0.15"
          )
          .to(".curtain__bar", { autoAlpha: 0, duration: 0.3 }, "<")
          .add(open)
          .to(".curtain__panel", {
            yPercent: -100,
            duration: 1,
            ease: "power4.inOut",
            stagger: 0.07,
          });
      } else {
        tl.add(open, 0.05)
          .to(".curtain__mark", { autoAlpha: 0, scale: 0.8, duration: 0.3 }, 0.05)
          .to(
            ".curtain__panel",
            { yPercent: -100, duration: 0.85, ease: "power4.inOut", stagger: 0.06 },
            0.1
          );
      }
    },
    { scope: rootRef, dependencies: [pageReady] }
  );

  // Pas de scroll tant que le rideau est baissé
  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    if (revealed) lenis.start();
    else lenis.stop();
  }, [revealed]);

  // Précédent / suivant du navigateur : on repart du haut de la page
  useEffect(() => {
    if (phase.current === "idle") scrollToTarget(0, { immediate: true });
  }, [pathname]);

  const go = useCallback(
    (to) => {
      const url = new URL(to, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.assign(url.href);
        return;
      }
      if (phase.current !== "idle") return;

      // Même page : simple défilement vers l'ancre
      if (url.pathname === window.location.pathname) {
        scrollToTarget(url.hash || 0);
        return;
      }

      const target = url.pathname + url.search + url.hash;
      pendingHash.current = url.hash;

      if (prefersReducedMotion()) {
        phase.current = "entering";
        navigate(target);
        return;
      }

      phase.current = "leaving";
      gsap.set(rootRef.current, { autoAlpha: 1 });
      gsap.set(".curtain__inner", { autoAlpha: 0 });

      gsap
        .timeline({
          onComplete: () => {
            phase.current = "entering";
            flushSync(() => setRevealed(false));
            navigate(target);
          },
        })
        .fromTo(
          ".curtain__panel",
          { yPercent: 100 },
          { yPercent: 0, duration: 0.7, ease: "power4.inOut", stagger: 0.06 }
        )
        .fromTo(
          ".curtain__mark",
          { autoAlpha: 0, scale: 0.6 },
          { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
          "-=0.35"
        );
    },
    [navigate]
  );

  const value = useMemo(
    () => ({ revealed, go, markReady: setReadyFor }),
    [revealed, go]
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}

      <div className="curtain" ref={rootRef} aria-hidden="true">
        <div className="curtain__panels">
          {PANELS.map((panel) => (
            <span className="curtain__panel" key={panel} />
          ))}
        </div>

        <div className="curtain__inner">
          <p className="curtain__line curtain__eyebrow">
            <span>Portfolio — Développeur Full Stack</span>
          </p>
          <div className="curtain__meta">
            <p className="curtain__line curtain__name">
              <span>
                Maël <em>Llado</em>
              </span>
            </p>
            <p className="curtain__line curtain__count">
              <span ref={countRef}>000</span>
            </p>
          </div>
          <div className="curtain__bar">
            <span ref={barRef} />
          </div>
        </div>

        <span className="curtain__mark">ML</span>
      </div>
    </TransitionContext.Provider>
  );
}
