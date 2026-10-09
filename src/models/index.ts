// Modèles des données renvoyées par l'API (miroir de Resume-Back/src/models).
import type { Brief } from "./brief";
import type { Profile } from "./profile";
import type { Project, ProjectTag, ProjectTechStack } from "./project";
import type { Section } from "./section";
import type { SkillCategory, SkillItem } from "./skill";
import type { Social } from "./social";
import type { TimelineItem } from "./timeline";

export type { Brief } from "./brief";
export type { Profile } from "./profile";
export type { Project, ProjectTag, ProjectTechStack, TechType, Visibility } from "./project";
export type { Section } from "./section";
export type { SkillCategory, SkillItem } from "./skill";
export type { Social } from "./social";
export type { TimelineItem } from "./timeline";

/**
 * Ce que renvoie chaque endpoint public. `useApi("/api/projects")` en
 * déduit son type de retour, et une faute de frappe dans l'URL ne compile pas.
 */
export interface ApiEndpoints {
  "/api/profil": Profile[];
  "/api/socials": Social[];
  "/api/timeline": TimelineItem[];
  "/api/sections": Section[];
  "/api/projects": Project[];
  "/api/project-tags": ProjectTag[];
  "/api/project-tech-stack": ProjectTechStack[];
  "/api/skill-categories": SkillCategory[];
  "/api/skill-items": SkillItem[];
  "/api/briefs": Brief[];
}

export type ApiEndpoint = keyof ApiEndpoints;
