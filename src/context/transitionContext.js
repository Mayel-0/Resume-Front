import { createContext, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const TransitionContext = createContext({
  revealed: true,
  go: () => {},
  markReady: () => {},
});

/**
 * - revealed : le rideau est levé, les animations d'entrée peuvent partir
 * - go(to)   : navigation avec transition (ou scroll si même page)
 */
export const useTransition = () => useContext(TransitionContext);

/**
 * À appeler dans chaque page : signale que ses données sont prêtes,
 * ce qui autorise le rideau à se lever.
 */
export function usePageReady(ready) {
  const { markReady } = useTransition();
  const { pathname } = useLocation();

  useEffect(() => {
    if (ready) markReady(pathname);
  }, [ready, pathname, markReady]);
}
