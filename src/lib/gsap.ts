import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

// Enregistrement unique des plugins pour toute l'app
gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, useGSAP);

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Vrai curseur (souris / trackpad) : pas d'effets de survol sur tactile
export const canHover = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export { gsap, ScrollTrigger, useGSAP };
