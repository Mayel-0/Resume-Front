// Ancres du « monde » (accueil, À propos, Parcours) : le moteur de caméra y
// enregistre la position de défilement de chaque arrêt, scrollToTarget la lit.
let targets: Record<string, number> = {};

export const setWorldTargets = (next: Record<string, number>): void => {
  targets = next;
};

export const getWorldTarget = (id: string): number | undefined => targets[id];
