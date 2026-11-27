import { gsap, ScrollTrigger } from "../gsap";
import { getLenis } from "../lenis";
import { createHelixPaths, drawHelix, helixLayout, type HelixLayout } from "./helix";
import { clamp01, drawStrands, smoothPath, type DrawnLine, type Point } from "./strands";

/** Durée d'un trajet entre deux chapitres (en écrans de défilement) */
const MOVE = 1.15;
const MOBILE_BREAKPOINT = 900;
const MOBILE_SCROLL_RATIO = 0.9;
/** Largeur de la pastille de l'étape : son centre sert de point de passage */
const STEP_DOT_X = 20;
/** Durée de la rotation d'un projet au suivant, et pause sur chaque projet (en écrans de défilement) */
const TURN = 0.8;
const PROJECT_HOLD = 0.5;
/** Voyage jusqu'à une fiche cliquée, en secondes */
const CARD_TRAVEL_S = 2;
/** Au-delà de cet écart de focus, une fiche est « de face » */
const FACING_MIN = 0.12;
const FACING_FULL = 0.45;
const PERSPECTIVE = 1600;

interface Geo {
  el: HTMLElement;
  w: number;
  h: number;
  x: number;
  y: number;
  /** Seuil d'avancée de la ligne à partir duquel le panneau apparaît */
  on: number;
  shown: boolean | null;
}

interface Stop {
  id: string;
  c: Point;
  s: number;
  hold: number;
  at: number;
  end?: number;
  /** Hélice : jusqu'où elle est dessinée, angle de la caméra, et rotation entre deux projets */
  hu?: number;
  phi?: number;
  turn?: boolean;
}

interface CardGeo extends Geo {
  index: number;
  u: number;
  theta: number;
  anchor: [number, number, number];
  phi: number;
}

export interface WorldElements {
  wrapper: HTMLElement;
  stage: HTMLElement;
  svg: SVGSVGElement;
  helixSvg: SVGSVGElement;
  hudLabel: HTMLElement;
  hudBar: HTMLElement;
}

export interface WorldHandle {
  /** Redessine (utilisé par l'intro, qui fait avancer la ligne) */
  render: () => void;
  /** Avancement de l'intro : 0 = ligne cachée, 1 = ligne visible */
  intro: { k: number };
  /** Position de défilement de chaque arrêt, par identifiant d'ancre */
  targets: () => Record<string, number>;
  progress: () => number;
  /** Position de défilement correspondant à un avancement (0 à 1) */
  scrollAt: (progress: number) => number;
}

const must = <T,>(value: T | undefined): T => {
  if (value === undefined) throw new Error("world : panneau ou point manquant");
  return value;
};

const byKind = (panels: HTMLElement[], kind: string) => panels.filter((p) => p.dataset.panel === kind);

/** Mesure les panneaux à plat, sans transformation. */
function measure(stage: HTMLElement, panels: HTMLElement[]): Map<HTMLElement, Geo> {
  stage.classList.add("measuring");
  panels.forEach((el) => { el.style.transform = "none"; });
  const geo = new Map<HTMLElement, Geo>();
  panels.forEach((el) => geo.set(el, { el, w: el.offsetWidth, h: el.offsetHeight, x: 0, y: 0, on: 0, shown: null }));
  return geo;
}

/** Place les panneaux sur la carte : positions en écrans (bureau) ou empilés (mobile). */
function place(panels: HTMLElement[], geo: Map<HTMLElement, Geo>, W: number, H: number, mobile: boolean): void {
  const [hero] = byKind(panels, "hero");
  const steps = byKind(panels, "step");
  if (mobile) {
    let y = H;
    let previous = "hero";
    panels.forEach((el) => {
      const g = geo.get(el) as Geo;
      g.x = W / 2;
      if (el === hero) { g.y = H / 2; return; }
      const kind = el.dataset.panel ?? "";
      const gap = kind === "step" && previous === "step" ? H * 0.07 : H * 0.3;
      g.y = y + gap + g.h / 2;
      y = g.y + g.h / 2;
      previous = kind;
    });
    return;
  }
  panels.forEach((el) => {
    const g = geo.get(el) as Geo;
    const [u = 0.5, v = 0.5] = (el.dataset.d ?? "").split(",").map(Number);
    g.x = u * W;
    g.y = v * H;
  });
  // Les étapes dessinent un escalier, quel que soit leur nombre
  const title = must(geo.get(must(byKind(panels, "title")[0])));
  steps.forEach((el, i) => {
    const g = geo.get(el) as Geo;
    g.x = title.x - title.w / 2 + g.w / 2 + 0.05 * W + i * 0.26 * W;
    g.y = title.y + 0.4 * H + (i % 2) * 0.22 * H;
  });
}

interface Route {
  points: Point[];
  key: { hero: number; aboutIn: number; aboutOut: number; step1: number; stepN: number };
}

/** Les points de passage de la ligne : sous l'accueil, autour de À propos, par chaque pastille. */
function routeFor(panels: HTMLElement[], geo: Map<HTMLElement, Geo>, W: number, H: number, mobile: boolean, helix: HelixLayout | null): Route {
  const g = (el: HTMLElement) => geo.get(el) as Geo;
  const hero = g(must(byKind(panels, "hero")[0]));
  const about = g(must(byKind(panels, "about")[0]));
  const title = g(must(byKind(panels, "title")[0]));
  const steps = byKind(panels, "step").map(g);
  const dot = (s: Geo): Point => [s.x - s.w / 2 + STEP_DOT_X, s.y - s.h / 2];
  const foot: Point = [hero.x + hero.w / 2 - 14, hero.y + hero.h / 2 - H * 0.14];
  const points: Point[] = [foot];
  const key = { hero: 1, aboutIn: 0, aboutOut: 0, step1: 0, stepN: 0 };

  if (mobile) {
    points.push([W * 0.55, foot[1] + 4], [W * 1.05, H * 1.0]);
    key.aboutIn = points.length;
    points.push([W * 0.08, about.y - about.h / 2 - H * 0.04]);
    points.push([W * 0.92, about.y + about.h / 2 + H * 0.04]);
    key.aboutOut = points.length - 1;
    points.push([W * 0.1, title.y]);
  } else {
    const hw = about.w / 2 + 70;
    const hh = about.h / 2 + 70;
    points.push([foot[0] + W * 0.012, foot[1] + H * 0.05]);
    key.aboutIn = points.length;
    points.push(
      [about.x - hw - W * 0.08, about.y - hh * 0.6],
      [about.x - hw * 0.5, about.y - hh - 40],
      [about.x + hw * 0.4, about.y - hh - 60],
      [about.x + hw + 60, about.y - hh * 0.3],
      [about.x + hw + 40, about.y + hh * 0.6],
      [about.x + hw * 0.2, about.y + hh + 70],
      [about.x - hw * 0.7, about.y + hh + 40],
    );
    key.aboutOut = points.length - 1;
    points.push([title.x - title.w / 2 - 60, title.y + title.h]);
  }
  key.step1 = points.length;
  steps.forEach((s) => points.push(dot(s)));
  key.stepN = points.length - 1;
  const last = steps[steps.length - 1] ?? title;
  if (!helix) points.push([last.x + W * 0.12, last.y + H * 0.35]);
  else if (mobile) points.push(helix.entry);
  else points.push([last.x + W * 0.12, last.y + H * 0.35], [helix.cx + W * 0.03, helix.yTop - H * 0.2], helix.entry);
  return { points, key };
}

const groupBox = (geos: Geo[], W: number, H: number) => {
  const x0 = Math.min(...geos.map((g) => g.x - g.w / 2));
  const x1 = Math.max(...geos.map((g) => g.x + g.w / 2));
  const y0 = Math.min(...geos.map((g) => g.y - g.h / 2));
  const y1 = Math.max(...geos.map((g) => g.y + g.h / 2));
  return { c: [(x0 + x1) / 2, (y0 + y1) / 2] as Point, s: Math.min(1, (W * 0.9) / (x1 - x0), (H * 0.8) / (y1 - y0)) };
};

/** Place le titre « Projets » et les fiches sur l'hélice. */
function placeHelix(layout: HelixLayout, title: Geo, cards: CardGeo[], mobile: boolean): void {
  const first = cards[0];
  if (first && !mobile) title.x = layout.cx - first.w / 2 + title.w / 2;
  cards.forEach((g, i) => {
    g.index = i;
    g.u = layout.uOf(i);
    g.theta = layout.theta(g.u);
    g.anchor = layout.point3(g.u, 3);
    g.phi = i * layout.step;
    g.on = g.u - 0.05;
  });
}

export function buildWorld(els: WorldElements): WorldHandle | null {
  const { wrapper, stage, svg, helixSvg, hudLabel, hudBar } = els;
  const W = window.innerWidth;
  const H = window.innerHeight;
  const mobile = W < MOBILE_BREAKPOINT;
  const everyPanel = [...stage.querySelectorAll<HTMLElement>("[data-panel]")];
  const panels = everyPanel.filter((p) => p.dataset.panel !== "card");
  const cardEls = byKind(everyPanel, "card");
  if (!["hero", "about", "title"].every((kind) => byKind(panels, kind).length > 0)) return null;
  const geo = measure(stage, everyPanel);
  place(panels, geo, W, H, mobile);
  const projectsTitle = byKind(panels, "ptitle")[0];
  const cards = cardEls.map((el) => geo.get(el) as CardGeo);
  let helix: HelixLayout | null = null;
  if (projectsTitle && cards.length > 0) {
    const tg = geo.get(projectsTitle) as Geo;
    helix = helixLayout({ W, H, mobile, count: cards.length, titleBottom: tg.y + tg.h / 2 });
    placeHelix(helix, tg, cards, mobile);
  }
  const route = routeFor(panels, geo, W, H, mobile, helix);
  stage.classList.remove("measuring");

  svg.replaceChildren();
  const line: DrawnLine = drawStrands(svg, smoothPath(route.points), mobile);
  const helixPaths = helix ? createHelixPaths(svg, helixSvg, mobile) : null;
  const frac = (i: number) => line.fracOf(must(route.points[i]));
  const F = { hero: frac(route.key.hero), aboutIn: frac(route.key.aboutIn), aboutOut: frac(route.key.aboutOut), step1: frac(route.key.step1), stepN: frac(route.key.stepN) };

  const flat = panels.map((el) => geo.get(el) as Geo);
  flat.forEach((g, i) => {
    g.on = i === 0 ? 0 : Math.max(0, line.fracOf([g.x, g.y]) - 0.025);
    if (g.el.dataset.panel === "about") g.on = Math.max(0, F.aboutIn - 0.02);
  });

  const cam = { x: 0, y: 0, s: 1 };
  const prog = { p: F.hero };
  const hx = { u: 0, phi: 0 };
  const intro = { k: 0 };
  let focused = 0;

  const renderCards = (h: HelixLayout) => {
    let best = -2;
    cards.forEach((g) => {
      const q = h.project(g.anchor, hx.phi);
      const angle = Math.PI / 2 - (g.theta - hx.phi);
      const facing = Math.cos(angle);
      if (facing > best) {
        best = facing;
        focused = g.index;
      }
      const sx = (q.x - cam.x) * cam.s + W / 2;
      const sy = (q.y - cam.y) * cam.s + H / 2;
      const scale = cam.s * q.k;
      const hw = (g.w * scale) / 2;
      const hh = (g.h * scale) / 2;
      const offscreen = sx + hw < -200 || sx - hw > W + 200 || sy + hh < -200 || sy - hh > H + 200;
      g.el.style.visibility = facing < FACING_MIN || offscreen ? "hidden" : "visible";
      g.el.style.transform = `translate3d(${(sx - g.w / 2).toFixed(1)}px, ${(sy - g.h / 2).toFixed(1)}px, 0) scale(${scale.toFixed(4)}) perspective(${PERSPECTIVE}px) rotateY(${angle.toFixed(4)}rad)`;
      g.el.style.zIndex = q.z >= 0 ? "3" : "1";
      g.el.style.opacity = clamp01((facing - FACING_MIN) / FACING_FULL).toFixed(3);
      g.el.style.setProperty("--focus", clamp01((facing - 0.84) / 0.14).toFixed(3));
      const on = hx.u >= g.on;
      if (on !== g.shown) {
        g.shown = on;
        g.el.classList.toggle("is-on", on);
      }
    });
  };

  const render = () => {
    const p = prog.p * intro.k;
    line.strands.forEach(({ el, length }) => {
      // non-scaling-stroke : les tirets se mesurent en pixels écran, donc à l'échelle de la caméra
      const scaled = length * cam.s;
      el.style.strokeDasharray = `${scaled} ${scaled + 10}`;
      el.style.strokeDashoffset = String(scaled * (1 - p));
    });
    const viewBox = `${cam.x - W / 2 / cam.s} ${cam.y - H / 2 / cam.s} ${W / cam.s} ${H / cam.s}`;
    svg.setAttribute("viewBox", viewBox);
    if (helix && helixPaths) {
      helixSvg.setAttribute("viewBox", viewBox);
      drawHelix(helix, helixPaths, hx.u, hx.phi);
      renderCards(helix);
    }
    flat.forEach((g) => {
      const sx = (g.x - cam.x) * cam.s + W / 2;
      const sy = (g.y - cam.y) * cam.s + H / 2;
      const hidden = sx + (g.w * cam.s) / 2 < -200 || sx - (g.w * cam.s) / 2 > W + 200 || sy + (g.h * cam.s) / 2 < -200 || sy - (g.h * cam.s) / 2 > H + 200;
      g.el.style.visibility = hidden ? "hidden" : "visible";
      g.el.style.transform = `translate3d(${(sx - g.w / 2).toFixed(1)}px, ${(sy - g.h / 2).toFixed(1)}px, 0) scale(${cam.s.toFixed(4)})`;
      const on = p >= g.on;
      if (on !== g.shown) {
        g.shown = on;
        g.el.classList.toggle("is-on", on);
      }
    });
  };

  const heroEl = must(byKind(panels, "hero")[0]);
  const aboutEl = must(byKind(panels, "about")[0]);
  const titleEl = must(byKind(panels, "title")[0]);
  const steps = byKind(panels, "step").map((el) => geo.get(el) as Geo);
  const parc = groupBox([geo.get(titleEl) as Geo, ...steps], W, H);
  const heroGeo = geo.get(heroEl) as Geo;
  const aboutGeo = geo.get(aboutEl) as Geo;
  const stops: Stop[] = [
    { id: "accueil", c: [heroGeo.x, heroGeo.y], s: 1, hold: 0.35, at: F.hero },
    { id: "a-propos", c: [aboutGeo.x, aboutGeo.y], s: mobile ? Math.min(1, (H * 0.84) / aboutGeo.h) : 1, hold: 1.1, at: F.aboutIn, end: F.aboutOut },
    { id: "parcours", c: parc.c, s: parc.s, hold: 1.1, at: F.step1 - 0.01, end: F.stepN + 0.005 },
  ];
  if (helix) {
    const front = (g: CardGeo): Point => {
      const q = helix.project(g.anchor, g.phi);
      return [q.x, q.y];
    };
    cards.forEach((g, i) => {
      const [fx, fy] = front(g);
      stops.push({ id: `projets-${i}`, c: i ? [fx, fy] : [fx, fy - H * 0.06], s: 1, hold: PROJECT_HOLD, turn: i > 0, at: 1, hu: Math.min(1, g.u + 0.02), phi: g.phi });
    });
  }

  const firstStop = must(stops[0]);
  Object.assign(cam, { x: firstStop.c[0], y: firstStop.c[1], s: 1 });
  const tl = gsap.timeline({ defaults: { ease: "none", immediateRender: false } });
  let t = 0;
  stops.forEach((stop, i) => {
    if (i > 0) {
      const prev = must(stops[i - 1]);
      const d = stop.turn ? TURN : MOVE;
      tl.fromTo(cam, { x: prev.c[0], y: prev.c[1] }, { x: stop.c[0], y: stop.c[1], duration: d, ease: "power2.inOut" }, t);
      if (!stop.turn) {
        const dip = Math.min(prev.s, stop.s) * (mobile ? 0.82 : 0.72);
        tl.fromTo(cam, { s: prev.s }, { s: dip, duration: d / 2, ease: "sine.out" }, t)
          .to(cam, { s: stop.s, duration: d / 2, ease: "sine.in" }, t + d / 2);
      }
      tl.fromTo(prog, { p: prev.end ?? prev.at }, { p: stop.at, duration: d, ease: "power1.inOut" }, t);
      if (helix) tl.fromTo(hx, { u: prev.hu ?? 0, phi: prev.phi ?? 0 }, { u: stop.hu ?? 0, phi: stop.phi ?? 0, duration: d, ease: "power2.inOut" }, t);
      t += d;
    }
    tl.addLabel(stop.id, t);
    if (stop.end !== undefined) tl.fromTo(prog, { p: stop.at }, { p: stop.end, duration: stop.hold, ease: "none" }, t);
    if (stop.id === "a-propos") {
      tl.fromTo(stage.querySelectorAll("[data-lit] .word"), { opacity: 0.22 }, { opacity: 1, stagger: 0.025, duration: 0.25 }, t + 0.05);
    }
    t += stop.hold;
  });
  tl.set({}, {}, t);

  const marks = stops.map((s) => ({ at: tl.labels[s.id] ?? 0, stop: s.id }));
  const panelOf = (stopId: string): HTMLElement =>
    stopId.startsWith("projets") ? must(projectsTitle) : must({ accueil: heroEl, "a-propos": aboutEl, parcours: titleEl }[stopId]);
  tl.eventCallback("onUpdate", () => {
    render();
    const now = tl.time();
    const current = marks.reduce((cur, m) => (now >= m.at - MOVE / 2 ? m : cur), must(marks[0]));
    const panel = panelOf(current.stop);
    const cardTitle = cardEls[focused]?.querySelector("h3")?.textContent;
    hudLabel.textContent = current.stop.startsWith("projets") && cardTitle ? `${panel.dataset.label ?? ""} · ${cardTitle}` : (panel.dataset.label ?? "");
    hudBar.parentElement?.style.setProperty("--tone", `var(--${panel.dataset.tone ?? "lagon"})`);
    hudBar.style.transform = `scaleX(${now / t})`;
    stage.dataset.stop = panel.dataset.anchor ?? "";
  });

  wrapper.style.height = `${t * H * (mobile ? MOBILE_SCROLL_RATIO : 1) + H}px`;
  const st = ScrollTrigger.create({ trigger: wrapper, start: "top top", end: "bottom bottom", scrub: 0.8, animation: tl });
  render();

  const scrollOfLabel = (label: string) => st.start + ((tl.labels[label] ?? 0) / tl.duration()) * (st.end - st.start);

  // Clic sur une fiche de côté : la caméra tourne jusqu'à elle. Sur la fiche de face, le lien agit normalement.
  cards.forEach((g) => {
    g.el.onclick = (event) => {
      if (focused === g.index) return;
      event.preventDefault();
      event.stopPropagation();
      const destination = scrollOfLabel(`projets-${g.index}`);
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(destination, { duration: CARD_TRAVEL_S });
      else window.scrollTo({ top: destination, behavior: "smooth" });
    };
  });

  const targets = () => ({ hero: scrollOfLabel("accueil"), apropos: scrollOfLabel("a-propos"), parcours: scrollOfLabel("parcours"), ...(helix ? { projets: scrollOfLabel("projets-0") } : {}) });
  return { render, intro, targets, progress: () => clamp01(st.progress), scrollAt: (p) => st.start + p * (st.end - st.start) };
}
