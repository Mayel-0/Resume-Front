import { clamp01, STRANDS, type Point } from "./strands";

const SVG_NS = "http://www.w3.org/2000/svg";

/** Écart au rayon, à l'angle et fréquence de la tresse de chaque brin (même ordre que STRANDS ; le lagon est l'axe). */
const BRAIDS = [
  { dr: 0.17, dth: 0.3, k: 2.2, ph: 0 },
  { dr: -0.13, dth: -0.22, k: 1.6, ph: 2.1 },
  { dr: 0.27, dth: 0.14, k: 2.8, ph: 4.0 },
  { dr: 0, dth: 0, k: 0, ph: 0 },
] as const;

/** Part de l'hélice qui sert à entrer et à sortir (le rayon y passe de 0 à R) */
const RAMP = 0.08;
/** La caméra regarde l'hélice un peu d'en haut : le cercle devient une ellipse */
const TILT = 0.2;
const MIN_STEP_DIVISOR = 3;
const POINTS_DESKTOP = 480;
const POINTS_MOBILE = 360;
/** Rapport entre la distance de la caméra et le rayon (perspective) */
const CAMERA_DISTANCE = 4.2;

export type Point3 = [number, number, number];

export interface Projected {
  x: number;
  y: number;
  z: number;
  k: number;
}

export interface HelixLayout {
  cx: number;
  yTop: number;
  yBottom: number;
  entry: Point;
  /** Angle de la caméra entre deux projets */
  step: number;
  uOf: (i: number) => number;
  theta: (u: number) => number;
  point3: (u: number, strand: number) => Point3;
  project: (p: Point3, phi: number) => Projected;
}

interface LayoutInput {
  W: number;
  H: number;
  mobile: boolean;
  count: number;
  /** Bas du titre « Projets » : l'hélice commence juste dessous */
  titleBottom: number;
}

export function helixLayout({ W, H, mobile, count, titleBottom }: LayoutInput): HelixLayout {
  const cx = mobile ? W / 2 : W * 1.76;
  const R = mobile ? W * 0.3 : Math.min(W * 0.24, 360);
  const drop = mobile ? H * 0.66 : H * 0.46;
  const sway = mobile ? W * 0.04 : W * 0.05;
  const distance = R * CAMERA_DISTANCE;
  const step = (Math.PI * 2) / Math.max(count, MIN_STEP_DIVISOR);
  const span = ((count - 1) * drop) / (1 - 2 * RAMP);
  const yTop = titleBottom + H * 0.04;

  const uOf = (i: number) => RAMP + (count > 1 ? i / (count - 1) : 0.5) * (1 - 2 * RAMP);
  const ramp = (u: number) => (1 - Math.cos(Math.PI * clamp01(Math.min(u, 1 - u) / RAMP))) / 2;
  // Entre deux projets la ligne fait un tour complet de plus que la caméra : on voit des boucles
  const theta = (u: number) => Math.PI / 2 + ((u - RAMP) / (1 - 2 * RAMP)) * (count - 1) * (step + Math.PI * 2);

  const point3 = (u: number, strand: number): Point3 => {
    const b = BRAIDS[strand] ?? BRAIDS[3];
    const e = ramp(u);
    const w = Math.sin(Math.PI * 2 * b.k * u + b.ph);
    const r = R * e * (1 + 0.14 * Math.sin(Math.PI * 3 * u)) * (1 + b.dr * e * w);
    const th = theta(u) + b.dth * e * w;
    return [sway * Math.sin(Math.PI * 2 * u) + r * Math.cos(th), yTop + u * span, r * Math.sin(th)];
  };

  const project = ([dx, Y, Z]: Point3, phi: number): Projected => {
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    const x1 = dx * c + Z * s;
    const z1 = Z * c - dx * s;
    const k = (distance - R) / (distance - z1);
    return { x: cx + x1 * k, y: Y + z1 * TILT, z: z1, k };
  };

  return { cx, yTop, yBottom: yTop + span, entry: [cx, yTop], step, uOf, theta, point3, project };
}

export interface HelixPaths {
  /** Un chemin « derrière » (sous les fiches) et un « devant » par brin */
  strands: { back: SVGPathElement; front: SVGPathElement }[];
  /** Nombre de points par brin */
  samples: number;
}

/** Crée les brins : le côté éloigné dans `backSvg`, le côté caméra dans `frontSvg`. */
export function createHelixPaths(backSvg: SVGSVGElement, frontSvg: SVGSVGElement, mobile: boolean): HelixPaths {
  frontSvg.replaceChildren();
  const make = (parent: SVGSVGElement, cfg: (typeof STRANDS)[number], back: boolean) => {
    const el = document.createElementNS(SVG_NS, "path");
    el.style.stroke = `var(${cfg.color})`;
    el.style.strokeWidth = String((mobile ? 0.8 : 1) * cfg.width);
    if (back) el.classList.add("is-back");
    parent.append(el);
    return el;
  };
  return {
    strands: STRANDS.map((cfg) => ({ back: make(backSvg, cfg, true), front: make(frontSvg, cfg, false) })),
    samples: mobile ? POINTS_MOBILE : POINTS_DESKTOP,
  };
}

/** Dessine l'hélice jusqu'à `u`, vue sous l'angle `phi`. */
export function drawHelix(layout: HelixLayout, paths: HelixPaths, u: number, phi: number): void {
  const last = Math.floor(u * paths.samples);
  const us = Array.from({ length: last + 1 }, (_, i) => i / paths.samples);
  if (u * paths.samples > last) us.push(u);
  paths.strands.forEach(({ back, front }, j) => {
    const d = { back: "", front: "" };
    let side: "back" | "front" | null = null;
    let prev: Projected | null = null;
    if (u > 0) {
      us.forEach((value) => {
        const p = layout.project(layout.point3(value, j), phi);
        const s = p.z >= 0 ? "front" : "back";
        if (s !== side) {
          const o = prev ?? p;
          d[s] += `M ${o.x.toFixed(1)} ${o.y.toFixed(1)} `;
          side = s;
        }
        d[s] += `L ${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
        prev = p;
      });
    }
    back.setAttribute("d", d.back);
    front.setAttribute("d", d.front);
  });
}
