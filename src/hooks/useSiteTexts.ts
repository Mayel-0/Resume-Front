import { useEffect, useState } from "react";
import { fetchApi, getCached } from "../lib/api";
import type { SiteTexts } from "../models";

const ENDPOINT = "/api/site-texts";

export type Translate = (key: string, vars?: Record<string, string | number>) => string;

export interface SiteTextsState {
  /** Texte de la clé, `{nom}` est remplacé par vars.nom ; vide si la clé est inconnue */
  t: Translate;
  loading: boolean;
  error: Error | null;
}

const makeTranslate = (texts: SiteTexts): Translate => (key, vars = {}) =>
  (texts[key] ?? "").replace(/\{(\w+)\}/g, (match, name: string) => String(vars[name] ?? match));

/**
 * useSiteTexts — les textes de l'interface (boutons, titres, libellés),
 * modifiables depuis l'admin. Même cache que useApi : une seule requête.
 */
export default function useSiteTexts(): SiteTextsState {
  const [state, setState] = useState(() => {
    const cached = getCached(ENDPOINT);
    return { texts: cached ?? {}, loading: !cached, error: null as Error | null };
  });

  useEffect(() => {
    let alive = true;

    fetchApi(ENDPOINT)
      .then((texts) => {
        if (alive) setState({ texts, loading: false, error: null });
      })
      .catch((error: unknown) => {
        const err = error instanceof Error ? error : new Error(String(error));
        if (alive) setState({ texts: {}, loading: false, error: err });
      });

    return () => {
      alive = false;
    };
  }, []);

  return { t: makeTranslate(state.texts), loading: state.loading, error: state.error };
}
