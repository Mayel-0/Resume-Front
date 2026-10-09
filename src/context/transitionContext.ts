import { createContext, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface TransitionContextValue {
  /** Le rideau est levé : les animations d'entrée peuvent partir */
  revealed: boolean;
  /** Navigation avec transition (ou scroll si c'est la même page) */
  go: (to: string) => void;
  /** Signale que la page affichée à ce chemin a ses données */
  markReady: (pathname: string) => void;
}

export const TransitionContext = createContext<TransitionContextValue>({
  revealed: true,
  go: () => {},
  markReady: () => {},
});

export const useTransition = (): TransitionContextValue => useContext(TransitionContext);

/**
 * À appeler dans chaque page : signale que ses données sont prêtes,
 * ce qui autorise le rideau à se lever.
 */
export function usePageReady(ready: boolean): void {
  const { markReady } = useTransition();
  const { pathname } = useLocation();

  useEffect(() => {
    if (ready) markReady(pathname);
  }, [ready, pathname, markReady]);
}
