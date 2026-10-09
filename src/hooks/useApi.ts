import { useEffect, useState } from "react";
import { fetchApi, getCached } from "../lib/api";
import type { ApiEndpoint, ApiEndpoints } from "../models";

export interface ApiState<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

// Tous les endpoints renvoient une liste : un tableau vide convient à chacun
const EMPTY: never[] = [];

const toError = (error: unknown): Error =>
  error instanceof Error ? error : new Error(String(error));

/**
 * useApi — lit un endpoint du back avec cache partagé.
 * Retourne { data, loading, error } ; data vaut [] tant que rien n'est arrivé.
 * Le type de `data` est déduit de l'endpoint (voir models/ApiEndpoints).
 */
export default function useApi<E extends ApiEndpoint>(endpoint: E): ApiState<ApiEndpoints[E]> {
  const [state, setState] = useState<ApiState<ApiEndpoints[E]>>(() => {
    const cached = getCached(endpoint);
    return cached
      ? { data: cached, loading: false, error: null }
      : { data: EMPTY, loading: true, error: null };
  });

  useEffect(() => {
    let alive = true;

    fetchApi(endpoint)
      .then((data) => {
        if (alive) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (alive) setState({ data: EMPTY, loading: false, error: toError(error) });
      });

    return () => {
      alive = false;
    };
  }, [endpoint]);

  return state;
}
