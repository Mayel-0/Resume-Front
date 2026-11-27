import type Lenis from "lenis";
import { getWorldTarget } from "./world/targets";
import { isWarping, warpTo } from "./world/warp";

// Instance Lenis partagée : créée par useSmoothScroll, lue par les
// transitions de page et les liens d'ancre.
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null): void => {
  instance = lenis;
};

export const getLenis = (): Lenis | null => instance;

// Position dans la page calculée sur la mise en page, sans les transforms :
// un élément en cours d'animation d'entrée (décalé en y) donne la bonne cible.
function layoutTop(el: HTMLElement): number {
  let top = 0;
  for (let node: Element | null = el; node instanceof HTMLElement; node = node.offsetParent) {
    top += node.offsetTop;
  }
  return top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
}

interface ScrollOptions {
  /** Saut direct, sans animation */
  immediate?: boolean;
}

/**
 * Défile vers une position (nombre) ou une ancre ("#id").
 * Passe par Lenis s'il est actif, sinon par le scroll natif.
 */
export function scrollToTarget(target: number | string, { immediate = false }: ScrollOptions = {}): void {
  let destination: number | HTMLElement;
  const worldTarget = typeof target === "string" ? getWorldTarget(decodeURIComponent(target.replace(/^#/, ""))) : undefined;

  // Haut de page sur la carte (logo) : on repart de l'accueil
  const heroTarget = target === 0 && !immediate ? getWorldTarget("hero") : undefined;

  if (isWarping()) return; // transport en cours : un second clic est ignoré

  if (worldTarget !== undefined || heroTarget !== undefined) {
    // Arrêt de la carte : transport (fondu, saut de caméra, réapparition) ; direct à l'arrivée sur la page
    destination = (worldTarget ?? heroTarget) as number;
    if (!immediate) {
      warpTo(destination);
      return;
    }
  } else if (typeof target === "string") {
    const element = document.getElementById(decodeURIComponent(target.replace(/^#/, "")));
    if (!element) return;
    // Saut direct (arrivée sur une page) : les éléments n'ont pas encore
    // joué leur entrée, on vise donc leur position finale.
    destination = immediate ? Math.max(0, layoutTop(element)) : element;
  } else {
    destination = target;
  }

  if (instance) {
    // Lenis met ses dimensions en cache : après un changement de page, la
    // hauteur connue est encore l'ancienne et borne la cible. On la recalcule.
    if (immediate) instance.resize();
    // force : le scroll doit passer même quand Lenis est en pause (transition)
    instance.scrollTo(destination, { immediate, force: true });
    return;
  }

  const behavior: ScrollBehavior = immediate ? "auto" : "smooth";
  if (typeof destination === "number") {
    window.scrollTo({ top: destination, behavior });
  } else {
    destination.scrollIntoView({ behavior, block: "start" });
  }
}
