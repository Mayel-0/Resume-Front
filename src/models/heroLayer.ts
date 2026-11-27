/** Ligne « couche + outils » de la liste du hero, déjà triée par `order`. */
export interface HeroLayer {
  id: number;
  layer: string;
  tools: string;
  order: number;
}
