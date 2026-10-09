export const API_URL = import.meta.env.VITE_API_URL;

// Fichiers servis par le back (/images, /documents…)
export const assetUrl = (path) => (path ? `${API_URL}${path}` : undefined);

export const CV_URL = `${API_URL}/documents/Cv_Mael_llado.pdf`;
export const CV_FILENAME = "CV_Mael_Llado.pdf";

// Cache mémoire : une seule requête par endpoint, partagée entre les pages.
const pending = new Map();
const resolved = new Map();

export const getCached = (endpoint) => resolved.get(endpoint);
export const hasCached = (endpoint) => resolved.has(endpoint);

export function fetchApi(endpoint) {
  if (!pending.has(endpoint)) {
    const request = fetch(`${API_URL}${endpoint}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status} sur ${endpoint}`);
        return res.json();
      })
      .then((data) => {
        resolved.set(endpoint, data);
        return data;
      })
      .catch((error) => {
        // On ne garde pas un échec en cache : la prochaine visite réessaie
        pending.delete(endpoint);
        throw error;
      });
    pending.set(endpoint, request);
  }
  return pending.get(endpoint);
}
