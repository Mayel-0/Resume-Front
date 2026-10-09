import type { ApiEndpoint, ApiEndpoints } from "../models";

export const API_URL = import.meta.env.VITE_API_URL;

// Fichiers servis par le back (/images, /documents…)
export const assetUrl = (path: string | null | undefined): string | undefined =>
  path ? `${API_URL}${path}` : undefined;

export const CV_URL = `${API_URL}/documents/Cv_Mael_llado.pdf`;
export const CV_FILENAME = "CV_Mael_Llado.pdf";

// Cache mémoire : une seule requête par endpoint, partagée entre les pages.
const pending = new Map<ApiEndpoint, Promise<unknown>>();
const resolved: Partial<ApiEndpoints> = {};

export const getCached = <E extends ApiEndpoint>(endpoint: E): ApiEndpoints[E] | undefined =>
  resolved[endpoint];

export function fetchApi<E extends ApiEndpoint>(endpoint: E): Promise<ApiEndpoints[E]> {
  // Seul fetchApi écrit dans `pending`, toujours avec la promesse de
  // l'endpoint qui sert de clé : la conversion de type est donc sûre.
  const cached = pending.get(endpoint) as Promise<ApiEndpoints[E]> | undefined;
  if (cached) return cached;

  const request = fetch(`${API_URL}${endpoint}`)
    .then((res) => {
      if (!res.ok) throw new Error(`Erreur ${res.status} sur ${endpoint}`);
      // Le contrat avec le back est porté par les modèles : la réponse
      // n'est pas revalidée côté navigateur.
      return res.json() as Promise<ApiEndpoints[E]>;
    })
    .then((data) => {
      resolved[endpoint] = data;
      return data;
    })
    .catch((error: unknown) => {
      // On ne garde pas un échec en cache : la prochaine visite réessaie
      pending.delete(endpoint);
      throw error;
    });

  pending.set(endpoint, request);
  return request;
}
