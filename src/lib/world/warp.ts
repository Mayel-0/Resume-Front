import { gsap, ScrollTrigger } from "../gsap";
import { getLenis } from "../lenis";

// Constantes du prototype (design/accueil-motion.html) : fondu sortant · retour des
// lignes · pause · décalage entre deux panneaux, en secondes.
const WARP = { out: 0.35, lines: 0.55, gap: 0.1, stagger: 0.16, settle: 1.1 };
const SAME_SPOT_RATIO = 0.004;

let timeline: gsap.core.Timeline | null = null;
const stageOf = () => document.querySelector<HTMLElement>(".world__stage");

const release = (panel: HTMLElement) => {
  panel.classList.add("is-release");
  panel.classList.remove("is-hold");
};

// Panneaux visibles, du plus central au plus éloigné ; les autres sont libérés d'emblée
function releaseInOrder(panels: HTMLElement[]): void {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const seen = panels
    .filter((p) => p.style.visibility !== "hidden")
    .map((panel) => {
      const r = panel.getBoundingClientRect();
      const onScreen = r.right > 0 && r.left < window.innerWidth && r.bottom > 0 && r.top < window.innerHeight;
      return { panel, onScreen, distance: Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy) };
    });
  panels.filter((p) => !seen.some((s) => s.panel === p)).forEach(release);
  seen.filter((s) => !s.onScreen).forEach((s) => release(s.panel));
  seen
    .filter((s) => s.onScreen)
    .sort((a, b) => a.distance - b.distance)
    .forEach((s, i) => gsap.delayedCall(i * WARP.stagger, () => release(s.panel)));
}

function jumpCamera(destination: number): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.start(); // Lenis ignore scrollTo tant qu'il est arrêté
    lenis.scrollTo(destination, { immediate: true, force: true });
    lenis.stop();
  } else {
    window.scrollTo({ top: destination, behavior: "auto" });
  }
  ScrollTrigger.update();
  // Le scrub rattrape la caméra tout de suite : pas de trajet visible
  ScrollTrigger.getAll().forEach((st) => {
    if (st.trigger instanceof HTMLElement && st.trigger.classList.contains("world")) st.getTween()?.progress(1);
  });
}

export const isWarping = (): boolean => timeline !== null;

/** Remet le décor dans son état normal (démontage, redimensionnement) */
export function killWarp(): void {
  if (!timeline) return;
  timeline.kill();
  timeline = null;
  const stage = stageOf();
  gsap.set(stage, { clearProps: "opacity" });
  gsap.set(stage?.querySelectorAll(".world__trace, .world__helix") ?? [], { clearProps: "opacity" });
  stage?.querySelectorAll("[data-panel]").forEach((p) => p.classList.remove("is-hold", "is-release"));
  getLenis()?.start();
}

/**
 * Transport vers un arrêt de la carte : tout s'efface, la caméra saute, les lignes
 * colorées reviennent d'abord, puis les panneaux un à un. Un second appel est ignoré.
 */
export function warpTo(destination: number): void {
  const stage = stageOf();
  if (!stage || timeline) return;
  const maxScroll = ScrollTrigger.maxScroll(window);
  if (Math.abs((getLenis()?.scroll ?? window.scrollY) - destination) < maxScroll * SAME_SPOT_RATIO) return;

  const lines = Array.from(stage.querySelectorAll<SVGSVGElement>(".world__trace, .world__helix"));
  const panels = Array.from(stage.querySelectorAll<HTMLElement>("[data-panel]"));
  getLenis()?.stop();

  timeline = gsap
    .timeline({
      onComplete: () => {
        panels.forEach((p) => p.classList.remove("is-release"));
        gsap.set([stage, ...lines], { clearProps: "opacity" });
        timeline = null;
        getLenis()?.start();
      },
    })
    .to([stage, ...lines], { opacity: 0, duration: WARP.out, ease: "power2.in" })
    .add(() => {
      panels.forEach((p) => p.classList.add("is-hold"));
      jumpCamera(destination);
      gsap.set(stage, { opacity: 1 });
    })
    .to(lines, { opacity: 1, duration: WARP.lines, ease: "power2.out" })
    .add(() => releaseInOrder(panels), `+=${WARP.gap}`)
    .set({}, {}, `+=${WARP.settle}`);
}
