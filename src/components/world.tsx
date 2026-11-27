import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";
import { getLenis } from "../lib/lenis";
import { buildWorld, type WorldHandle } from "../lib/world/buildWorld";
import { setWorldTargets } from "../lib/world/targets";
import { killWarp } from "../lib/world/warp";
import { useTransition } from "../context/transitionContext";
import { WorldContext } from "../context/worldContext";

const RESIZE_DELAY_MS = 250;
const INTRO_DELAY_S = 2.5;
const INTRO_DURATION_S = 1.3;

interface WorldProps {
  /** Vrai quand les données sont chargées : les panneaux ont leur taille définitive */
  ready: boolean;
  children: ReactNode;
}

/**
 * World — accueil, À propos et Parcours posés sur une carte. Une ligne à quatre
 * brins serpente de l'un à l'autre, le scroll fait avancer la caméra (viewBox du SVG).
 * Mouvement réduit : les mêmes enfants s'affichent en page classique, sans ligne.
 */
function World({ ready, children }: WorldProps) {
  const [active] = useState(() => !prefersReducedMotion());
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const helixSvgRef = useRef<SVGSVGElement>(null);
  const hudLabelRef = useRef<HTMLSpanElement>(null);
  const hudBarRef = useRef<HTMLSpanElement>(null);
  const [handle, setHandle] = useState<WorldHandle | null>(null);
  const { revealed } = useTransition();

  useEffect(() => {
    if (!active || !ready) return undefined;
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    const svg = svgRef.current;
    const helixSvg = helixSvgRef.current;
    const hudLabel = hudLabelRef.current;
    const hudBar = hudBarRef.current;
    if (!wrapper || !stage || !svg || !helixSvg || !hudLabel || !hudBar) return undefined;

    let ctx: gsap.Context | undefined;
    let current: WorldHandle | null = null;
    let disposed = false;
    let timer: number | undefined;
    let lastWidth = window.innerWidth;

    const start = (progress = 0) => {
      ctx = gsap.context(() => {
        current = buildWorld({ wrapper, stage, svg, helixSvg, hudLabel, hudBar });
      });
      ScrollTrigger.refresh();
      setWorldTargets(current?.targets() ?? {});
      if (progress > 0 && current) getLenis()?.scrollTo(current.scrollAt(progress), { immediate: true, force: true });
      setHandle(current ?? null);
    };
    const clear = () => {
      killWarp();
      ctx?.revert();
      stage.querySelectorAll<HTMLElement>("[data-panel]").forEach((el) => {
        el.style.transform = "";
        el.style.visibility = "";
        el.style.opacity = "";
        el.style.zIndex = "";
        el.style.removeProperty("--focus");
        el.onclick = null;
        el.classList.remove("is-on", "is-hold", "is-release");
      });
      wrapper.style.height = "";
    };

    void document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        if (!disposed) start();
      });
    });

    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const progress = current?.progress() ?? 0;
        clear();
        start(progress);
      }, RESIZE_DELAY_MS);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      clear();
      setWorldTargets({});
      setHandle(null);
    };
  }, [active, ready]);

  // La ligne de la carte part du pied de l'accueil une fois le rideau levé
  useEffect(() => {
    if (!handle || !revealed) return undefined;
    const tween = gsap.to(handle.intro, {
      k: 1,
      duration: INTRO_DURATION_S,
      delay: INTRO_DELAY_S,
      ease: "power2.inOut",
      onUpdate: handle.render,
    });
    return () => {
      tween.kill();
    };
  }, [handle, revealed]);

  return (
    <WorldContext.Provider value={active}>
      <div className={`world${active ? " is-world" : ""}`} ref={wrapperRef}>
        <div className="world__stage" ref={stageRef}>
          {active && <svg className="world__trace" ref={svgRef} aria-hidden="true" focusable="false" />}
          {active && <svg className="world__helix" ref={helixSvgRef} aria-hidden="true" focusable="false" />}
          {children}
          {active && (
            <div className="world__hud" aria-hidden="true">
              <span ref={hudLabelRef} />
              <div className="world__bar"><span ref={hudBarRef} /></div>
            </div>
          )}
        </div>
      </div>
    </WorldContext.Provider>
  );
}

export default World;
