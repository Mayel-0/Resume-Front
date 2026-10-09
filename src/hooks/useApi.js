import { useEffect, useState } from "react";
import { fetchApi, getCached, hasCached } from "../lib/api";

const EMPTY = [];

/**
 * useApi — lit un endpoint du back avec cache partagé.
 * Retourne { data, loading, error } ; data vaut [] tant que rien n'est arrivé.
 */
export default function useApi(endpoint) {
  const [state, setState] = useState(() =>
    hasCached(endpoint)
      ? { data: getCached(endpoint), loading: false, error: null }
      : { data: EMPTY, loading: true, error: null }
  );

  useEffect(() => {
    let alive = true;

    fetchApi(endpoint)
      .then((data) => {
        if (alive) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (alive) setState({ data: EMPTY, loading: false, error });
      });

    return () => {
      alive = false;
    };
  }, [endpoint]);

  return state;
}
