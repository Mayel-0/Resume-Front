import { useEffect } from "react";
import gsap from "gsap";

/**
 * useMagnetic — effet magnétique sur tous les éléments marqués
 * data-magnetic ( boutons, liens… ).
 *
 * Au survol, l'élément est attiré vers le curseur ; en sortant,
 * il rebondit doucement à sa place. Géré en delegation sur le
 * document pour fonctionner même avec les éléments montés après
 * chargement des données (cards, hero…).
 *
 * Désactivé si l'utilisateur préfère moins de mouvement.
 */
export default function useMagnetic() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Pas d'effet sur écran tactile : le curseur n'existe pas
    if (prefersReduced || !window.matchMedia("(hover: hover)").matches) {
      return undefined;
    }

    const STATE = new WeakMap();

    const getProps = (el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.35;
      return { strength };
    };

    const onEnter = (e) => {
      const el = e.target.closest?.("[data-magnetic]");
      if (!el || STATE.has(el)) return;

      const { strength } = getProps(el);
      const setters = {
        x: gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" }),
      };
      STATE.set(el, { setters, strength });
      gsap.to(el, { scale: 1.06, duration: 0.35, ease: "power3.out" });
    };

    const onMove = (e) => {
      const el = e.target.closest?.("[data-magnetic]");
      if (!el) return;
      const state = STATE.get(el);
      if (!state) return;

      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;

      state.setters.x(relX * state.strength);
      state.setters.y(relY * state.strength);
    };

    const onLeave = (e) => {
      const el = e.target.closest?.("[data-magnetic]");
      if (!el) return;
      STATE.delete(el);
      gsap.to(el, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "elastic.out(1, 0.4)",
      });
    };

    document.addEventListener("pointerover", onEnter);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerout", onLeave);

    return () => {
      document.removeEventListener("pointerover", onEnter);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave);
      STATE.clear();
    };
  }, []);
}