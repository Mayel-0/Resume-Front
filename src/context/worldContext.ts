import { createContext, useContext } from "react";

// Vrai quand la page est rendue en « monde » (caméra + ligne) ;
// faux en mouvement réduit : page classique, une colonne.
export const WorldContext = createContext(false);

export const useWorldActive = (): boolean => useContext(WorldContext);
