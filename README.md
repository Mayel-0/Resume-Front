# mael-llado.com — Portfolio Frontend

> Site vitrine personnel de **Maël Llado**, développeur Full Stack basé à Bordeaux.
> Accessible à l'adresse : [mael-llado.com](https://mael-llado.com)

Ce dépôt est la **partie frontend** d'un projet découpé en trois repos distincts :

| Repo                         | Rôle                        | URL                    |
| ---------------------------- | --------------------------- | ---------------------- |
| **Resume-Front** _(ce repo)_ | Interface utilisateur React | `mael-llado.com`       |
| Resume-Back                  | API REST Node.js / Express  | `mael-llado.com/api`   |
| Resume-Admin                 | Panneau d'administration    | `admin.mael-llado.com` |

### Architecture globale

```
Client
  │
  ▼
Cloudflare  ◄─── CDN, protection DDoS, SSL, masquage IP
  │
  ▼
Oracle Cloud (Ubuntu)
  │
  Nginx ─── Reverse proxy vers les conteneurs Docker
  │         ├── mael-llado.com        → conteneur front  (build Vite servi par Nginx)  ◄── ce repo
  │         ├── mael-llado.com/api    → conteneur back   (Node.js)
  │         └── admin.mael-llado.com  → conteneur admin  (build Vite servi par Nginx)
  │
  └── conteneur db ─── PostgreSQL 17, données dans un volume Docker
```

> Le client ne communique jamais directement avec le serveur Oracle.
> Cloudflare intercepte chaque requête et la relaie, ce qui masque l'IP réelle du serveur.

---

## Présentation

Interface **React 19** écrite en **TypeScript** (mode `strict`). Elle récupère tout son contenu dynamique auprès de l'API (textes, projets, images, CV) et le met en scène avec des animations **GSAP** synchronisées sur un scroll fluide **Lenis**.

| Route        | Page                                                  |
| ------------ | ----------------------------------------------------- |
| `/`          | `HomePage` — présentation, parcours, projets, contact |
| `/ProjectsD` | `ProjectD` — détail de chaque projet, avec filtres    |
| `*`          | `NotFound` — page 404                                 |

---

## Stack technique

| Catégorie        | Technologie                     | Version |
| ---------------- | ------------------------------- | ------- |
| Langage          | TypeScript (strict)             | 6       |
| Framework UI     | React                           | 19      |
| Bundler          | Vite                            | 8       |
| Routing          | React Router DOM                | 7       |
| Animations       | GSAP + `@gsap/react`            | 3.15    |
| Scroll fluide    | Lenis                           | 1.3     |
| Découpe de texte | SplitType                       | 0.3     |
| Icônes           | Lucide React                    | 1.37    |
| CSS              | Sass (SCSS)                     | 1.103   |
| Linting          | ESLint + typescript-eslint      | 10      |
| Conteneurisation | Docker (build Vite → Nginx)     | —       |

---

## Architecture du projet

```
Resume-Front/
├── public/                  # Fichiers statiques (favicon, robots.txt, sitemap.xml)
├── src/
│   ├── main.tsx             # Point d'entrée : routeur + rideau de transition
│   ├── App.tsx              # Header, routes, footer, effets globaux
│   ├── pages/               # HomePage, ProjectD, NotFound
│   ├── components/          # Sections (hero, about, projects…) et briques d'animation
│   ├── context/             # Preloader et transitions entre les pages
│   ├── hooks/               # useApi, useSmoothScroll, useMagnetic, useTilt
│   ├── lib/                 # Appels API avec cache, instance Lenis, plugins GSAP
│   ├── models/              # Types des données renvoyées par l'API
│   ├── styles/              # SCSS : abstracts/, base/, components/, pages/
│   └── assets/              # Polices et images
├── index.html
├── nginx.conf               # Configuration du Nginx embarqué dans l'image Docker
├── Dockerfile
├── tsconfig.json
└── vite.config.ts
```

### Des données typées de bout en bout

Les modèles de `src/models/` décrivent ce que renvoie chaque endpoint. Le hook `useApi` en déduit son type de retour à partir de l'URL :

```ts
const projects = useApi("/api/projects"); // → { data: Project[], loading, error }
const socials = useApi("/api/socials"); //   → { data: Social[],  loading, error }

useApi("/api/projets"); // ✗ ne compile pas : l'endpoint n'existe pas
```

Les réponses sont mises en cache en mémoire : chaque endpoint n'est appelé qu'une fois, même en naviguant d'une page à l'autre.

### Logique parent → enfant

Chaque **page** orchestre le chargement, les composants ne font aucun appel réseau :

```
Page (HomePage / ProjectD)
  ├── useApi(...)            → données typées, en cache
  ├── usePageReady(...)      → signale que la page peut être révélée
  └── transmet les données en props
        ├── <Hero profil socials />
        ├── <About briefs />
        ├── <Parcours timeline sections />
        ├── <Skills skillCategories skillsItems />
        ├── <Projects projects projectsTags />
        └── <Contacts socials />
```

Si l'API ne répond pas, une page d'erreur avec un bouton « Réessayer » remplace le contenu.

---

## Animations

| Effet                    | Description                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| Preloader                | Rideau en cinq volets avec compteur, levé quand les données sont prêtes                        |
| Transitions de page      | Le même rideau recouvre l'écran entre deux pages, sans rechargement                            |
| Hero                     | Prénom en « scramble », nom lettre par lettre en 3D, halos réactifs à la souris, parallaxe     |
| Bandeaux défilants       | Compétences en boucle infinie, accélérées par la vitesse du scroll                             |
| À propos                 | Le texte s'allume mot par mot au rythme du scroll                                              |
| Parcours                 | La ligne de la timeline se dessine pendant le défilement                                       |
| Projets                  | Section figée et défilement horizontal des cartes (desktop), grille classique sur mobile       |
| Cartes                   | Halo lumineux qui suit le curseur, inclinaison 3D                                              |
| Curseur                  | Point et anneau avec inertie, libellé contextuel sur les projets                               |
| Header                   | Barre de progression de lecture, masquage à la descente                                        |

**Organisation du code d'animation :**

- `context/TransitionProvider.tsx` pilote le rideau et indique aux pages quand lancer leurs entrées (`revealed`).
- `components/reveal.tsx` et `components/splitHeading.tsx` sont les briques réutilisables de révélation au scroll.
- `hooks/useSmoothScroll.ts` branche Lenis sur le ticker GSAP : une seule boucle d'animation, `ScrollTrigger` toujours synchronisé.
- `components/transitionLink.tsx` remplace les liens internes : transition vers une autre page, ou scroll vers une ancre.

**Accessibilité** — avec `prefers-reduced-motion`, toutes les animations sont désactivées : pas de rideau animé, pas de scroll fluide, pas de section figée, et le contenu reste entièrement lisible. Les effets de survol ne s'activent que sur les appareils dotés d'un vrai curseur.

---

## Styles & conventions CSS

Méthodologie **BEM** sur l'ensemble des fichiers SCSS, sans framework CSS externe.

```scss
.hero {
} /* Block */
.hero__title {
} /* Element */
.btn--accent {
} /* Modifier */
```

```
src/styles/
├── main.scss            # Point d'entrée, importe tout le reste
├── abstracts/           # Variables (couleurs, breakpoints), keyframes partagés
├── base/                # Reset, typographie, utilitaires (.btn, .card, .tag)
├── components/          # Un fichier par composant (_hero.scss, _projects.scss…)
└── pages/               # Un fichier par page
```

---

## Variables d'environnement

Créer un fichier `.env` à la racine :

```dotenv
VITE_API_URL=https://mael-llado.com
```

| Variable       | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `VITE_API_URL` | URL de base du back, **sans** `/api` (le code l'ajoute)       |

> Pour développer avec un back local : `VITE_API_URL=http://localhost:3000`.
> La valeur est figée dans le bundle au moment du build.

---

## Installation & développement

```bash
git clone https://github.com/Mayel-0/Resume-Front.git
cd Resume-Front
npm install

# Créer le fichier .env (voir ci-dessus), puis :
npm run dev
```

## Scripts disponibles

| Commande            | Description                                             |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Serveur de développement Vite avec HMR                  |
| `npm run build`     | Vérification des types, puis build → `dist/`            |
| `npm run typecheck` | Vérification des types seule                            |
| `npm run lint`      | Analyse statique ESLint                                 |
| `npm run preview`   | Prévisualisation du build de production                 |

---

## Déploiement

Le site est livré dans une **image Docker** construite en deux étapes : build Vite, puis Nginx qui sert le dossier `dist/`.

```bash
docker build -t resume-front .
docker run -d -p 127.0.0.1:8080:80 resume-front

# Autre URL d'API :
docker build --build-arg VITE_API_URL=https://exemple.com -t resume-front .
```

Le Nginx embarqué (`nginx.conf`) renvoie `index.html` pour toutes les routes (React Router prend le relais), met les fichiers hashés en cache pour un an et ne met jamais `index.html` en cache, pour qu'un nouveau déploiement soit visible immédiatement.

En production, un `docker-compose.yml` lance ce conteneur avec l'API, le panneau admin et la base de données. Le Nginx du serveur relaie `mael-llado.com` vers lui.

---

## SEO & métadonnées

Le `index.html` embarque les balises essentielles : `description`, `author`, **Open Graph** (`og:title`, `og:description`, `og:url`) et `lang="fr"`. `robots.txt` et `sitemap.xml` sont servis depuis `public/`.

---

## Auteur

**Maël Llado** — Développeur Full Stack
[mael-llado.com](https://mael-llado.com) · Bordeaux, France
