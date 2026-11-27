import type { ReactNode } from "react";
import { useWorldActive } from "../context/worldContext";

interface WorldPanelProps {
  kind: "hero" | "about" | "title" | "step";
  /** Position sur la carte, en écrans (bureau) : "x,y" */
  d?: string;
  label: string;
  /** Couleur du chapitre : lagon, menthe, mandarine ou soleil */
  tone: string;
  /** Identifiant d'ancre du menu */
  anchor: string;
  className?: string;
  children: ReactNode;
}

/** Un panneau de la carte. En page classique, ce n'est qu'un conteneur sans effet. */
function WorldPanel({ kind, d, label, tone, anchor, className = "", children }: WorldPanelProps) {
  const world = useWorldActive();
  if (!world) return <>{children}</>;
  return (
    <div
      className={`panel p-${kind} ${className}`.trim()}
      data-panel={kind}
      data-d={d}
      data-label={label}
      data-tone={tone}
      data-anchor={anchor}
    >
      <div className="panel__in">{children}</div>
    </div>
  );
}

export default WorldPanel;
