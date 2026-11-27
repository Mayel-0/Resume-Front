const SVG_NS = "http://www.w3.org/2000/svg";

export type Point = [number, number];

export const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

/** Les quatre brins de la ligne. Ordre de dessin : le lagon passe devant. */
const STRANDS = [
  { color: "--soleil", width: 1.5, amp: 30, wave: 760, phase: 0 },
  { color: "--menthe", width: 2, amp: 22, wave: 1150, phase: 2.1 },
  { color: "--mandarine", width: 2, amp: 38, wave: 940, phase: 4 },
  { color: "--lagon", width: 3, amp: 0, wave: 1, phase: 0 },
] as const;

const SAMPLES_DESKTOP = 900;
const SAMPLES_MOBILE = 600;

/** Point d'index borné aux extrémités du tableau. */
const pointAt = (points: Point[], i: number): Point => points[Math.min(points.length - 1, Math.max(0, i))] ?? [0, 0];

/** Courbe lisse passant par tous les points (Catmull-Rom → Bézier). */
export function smoothPath(points: Point[]): string {
  const [startX, startY] = pointAt(points, 0);
  let d = `M ${startX} ${startY}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = pointAt(points, i - 1);
    const p1 = pointAt(points, i);
    const p2 = pointAt(points, i + 1);
    const p3 = pointAt(points, i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export interface Strand {
  el: SVGPathElement;
  length: number;
}

export interface DrawnLine {
  strands: Strand[];
  /** Part (0 à 1) du tracé la plus proche d'un point de la carte */
  fracOf: (point: Point) => number;
}

/**
 * Échantillonne un tracé et dessine les quatre brins dans `svg` :
 * le principal et trois qui ondulent autour, resserrés aux deux bouts.
 */
export function drawStrands(svg: SVGSVGElement, d: string, mobile: boolean): DrawnLine {
  const probe = document.createElementNS(SVG_NS, "path");
  probe.setAttribute("d", d);
  svg.append(probe);
  const total = probe.getTotalLength();
  const count = mobile ? SAMPLES_MOBILE : SAMPLES_DESKTOP;
  const samples: Point[] = Array.from({ length: count + 1 }, (_, i) => {
    const p = probe.getPointAtLength((total * i) / count);
    return [p.x, p.y];
  });
  probe.remove();

  const fracOf = ([x, y]: Point): number => {
    let best = 0;
    let bestDist = Infinity;
    samples.forEach((s, i) => {
      const dist = (s[0] - x) ** 2 + (s[1] - y) ** 2;
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best / count;
  };

  const strands = STRANDS.map((cfg) => {
    let path = d;
    if (cfg.amp) {
      const amp = cfg.amp * (mobile ? 0.6 : 1);
      path = samples
        .map((s, i) => {
          const a = pointAt(samples, i - 1);
          const b = pointAt(samples, i + 1);
          const dx = b[0] - a[0];
          const dy = b[1] - a[1];
          const len = Math.hypot(dx, dy) || 1;
          const t = i / count;
          const envelope = Math.min(1, t / 0.03) * clamp01((1 - t) / 0.03);
          const offset = amp * envelope * Math.sin(((t * total) / cfg.wave) * Math.PI * 2 + cfg.phase);
          return `${i ? "L" : "M"} ${(s[0] - (dy / len) * offset).toFixed(1)} ${(s[1] + (dx / len) * offset).toFixed(1)}`;
        })
        .join(" ");
    }
    const el = document.createElementNS(SVG_NS, "path");
    el.setAttribute("d", path);
    el.style.stroke = `var(${cfg.color})`;
    el.style.strokeWidth = String((mobile ? 0.8 : 1) * cfg.width);
    svg.append(el);
    return { el, length: el.getTotalLength() };
  });

  return { strands, fracOf };
}
