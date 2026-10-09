import { RotateCw, WifiOff } from "lucide-react";

// Affiché quand l'API ne répond pas, à la place d'une page vide
function ApiError() {
  return (
    <main className="not-found" aria-labelledby="api-error-title">
      <div className="not-found__content">
        <span className="not-found__icon" aria-hidden="true">
          <WifiOff size={28} strokeWidth={1.6} />
        </span>
        <p className="eyebrow">Connexion interrompue</p>
        <h1 id="api-error-title">Le contenu n’a pas pu être chargé.</h1>
        <p className="not-found__message">
          Le serveur ne répond pas pour le moment. Réessayez dans quelques instants.
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
