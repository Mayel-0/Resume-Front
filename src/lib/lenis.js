// Instance Lenis partagée : créée par useSmoothScroll, lue par les
// transitions de page et les liens d'ancre.
let instance = null;

export const setLenis = (lenis) => {
  instance = lenis;
};

export const getLenis = () => instance;

// Position dans la page calculée sur la mise en page, sans les transforms :
// un élément en cours d'animation d'entrée (décalé en y) donne la bonne cible.
function layoutTop(el) {
  let top = 0;
  for (let node = el; node; node = node.offsetParent) top += node.offsetTop;
  return top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
}

/**
 * Défile vers une position (nombre) ou une ancre ("#id").
 * Passe par Lenis s'il est actif, sinon par le scroll natif.
 */
export function scrollToTarget(target, { immediate = false } = {}) {
  let destination = target;

  if (typeof target === "string") {
    destination = document.getElementById(decodeURIComponent(target.replace(/^#/, "")));
    if (!destination) return;
    // Saut direct (arrivée sur une page) : les éléments n'ont pas encore
    // joué leur entrée, on vise donc leur position finale.
    if (immediate) destination = Math.max(0, layoutTop(destination));
  }

  if (instance) {
    // Lenis met ses dimensions en cache : après un changement de page, la
    // hauteur connue est encore l'ancienne et borne la cible. On la recalcule.
    if (immediate) instance.resize();
    // force : le scroll doit passer même quand Lenis est en pause (transition)
    instance.scrollTo(destination, { immediate, force: true });
    return;
  }

  const behavior = immediate ? "auto" : "smooth";
  if (typeof destination === "number") {
    window.scrollTo({ top: destination, behavior });
  } else {
    destination.scrollIntoView({ behavior, block: "start" });
  }
}
