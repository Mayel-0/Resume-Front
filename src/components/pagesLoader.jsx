import { useState, useEffect } from "react";

export default function PageLoader({ loading, children }) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false);

  // Reset du state quand `loading` repasse à true — ajustement
  // pendant le render (pattern React recommandé, pas dans un effet).
  const [prevLoading, setPrevLoading] = useState(loading);
  if (prevLoading !== loading) {
    setPrevLoading(loading);
    if (loading) {
      setIsOverlayVisible(true);
      setIsContentVisible(false);
    }
  }

  useEffect(() => {
    if (loading) return undefined;

    const contentTimer = setTimeout(() => setIsContentVisible(true), 350);
    const overlayTimer = setTimeout(() => setIsOverlayVisible(false), 1300);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(overlayTimer);
    };
  }, [loading]);

  return (
    <div className="page-container">
      {/* 1. L'overlay de chargement */}
      {isOverlayVisible && (
        <div className={`loader-overlay ${!loading ? "fade-out" : ""}`}>
          <div className="spinner"></div>
        </div>
      )}

      {/* 2. Le contenu de la page */}
      <main className={`page-content ${isContentVisible ? "visible" : ""}`}>
        {children}
      </main>
    </div>
  );
}
