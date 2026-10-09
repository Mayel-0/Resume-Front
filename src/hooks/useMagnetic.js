import { useEffect } from "react";
import { gsap, prefersReducedMotion, canHover } from "../lib/gsap";

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
    // Pas d'effet sur écran tactile : le curseur n'existe pas
    if (prefersReducedMotion() || !canHover()) return undefined;

    const STATE = new WeakMap();
    // WeakMap n'étant pas itérable, on suit les éléments dans un Set
    // pour pouvoir tout réinitialiser au démontage du hook.
    const tracked = new Set();

    const onEnter = (e) => {
      const el = e.target.closest?.("[data-magnetic]");
      if (!el || STATE.has(el)) return;

      const strength = parseFloat(el.dataset.magnetic) || 0.35;
      const setters = {
        x: gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" }),
      };
      STATE.set(el, { setters, strength });
      tracked.add(el);
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
      // pointerout se déclenche aussi entre deux enfants : on ignore
      if (!el || el.contains(e.relatedTarget)) return;
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
      // WeakMap n'a pas de .clear() : on vide via un Set de suivi
      tracked.forEach((el) => {
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: "transform,scale" });
      });
      tracked.clear();
    };
  }, []);
}
