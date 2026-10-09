/**
 * Élément le plus proche de la cible d'un événement qui correspond au
 * sélecteur. La cible d'un événement n'est pas forcément un élément
 * (ça peut être le document) : on le vérifie avant d'appeler closest().
 */
export function closestFromEvent(event: Event, selector: string): HTMLElement | null {
  return event.target instanceof Element ? event.target.closest<HTMLElement>(selector) : null;
}
