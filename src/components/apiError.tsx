import { RotateCw, WifiOff } from "lucide-react";
import { ApiRequestError } from "../lib/api";

// Affiché quand l'API ne répond pas, à la place d'une page vide
function ApiError({ error }: { error?: Error | null }) {
  // Route absente (404) : le serveur répond, c'est le contenu qui manque
  const routeMissing = error instanceof ApiRequestError && error.status === 404;
  const message = routeMissing
    ? "Le serveur répond, mais une partie du contenu est introuvable. Une mise à jour est peut-être en cours : réessayez dans quelques minutes."
    : "Le serveur ne répond pas pour le moment. Réessayez dans quelques instants.";

  return (
    <main className="not-found" aria-labelledby="api-error-title">
      <div className="not-found__content">
        <span className="not-found__icon" aria-hidden="true">
          <WifiOff size={28} strokeWidth={1.6} />
        </span>
        <p className="eyebrow">Connexion interrompue</p>
        <h1 id="api-error-title">Le contenu n’a pas pu être chargé.</h1>
        <p className="not-found__message">
          {message}
        </p>
        <button className="btn btn--accent" type="button" onClick={() => window.location.reload()}>
          <RotateCw size={17} aria-hidden="true" />
          Réessayer
        </button>
      </div>
    </main>
  );
}

export default ApiError;
