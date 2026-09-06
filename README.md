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
Cloudflare  ◄─── CDN, DDoS protection, SSL, masquage IP
  │
  ▼
Oracle Cloud (Ubuntu)
  │
  Nginx ─── Reverse Proxy
  │         ├── mael-llado.com        → Frontend (dist Vite statique)
  │         ├── mael-llado.com/api    → Backend Node.js
  │         └── admin.mael-llado.com  → Panel Admin
  │
  └── MySQL  ◄─── Toutes les données (textes, projets, images, documents)
```

> Le client ne communique jamais directement avec le serveur Oracle.
> Cloudflare intercepte chaque requête et la relaie, ce qui masque l'IP réelle du serveur
> (un `ping mael-llado.com` renvoie une IP Cloudflare, pas l'IP Oracle).

---

## Frontend — Resume-Front

### Présentation

Interface React du portfolio. Elle consomme l'API backend pour récupérer **l'intégralité des données dynamiques** (textes, projets, images, documents PDF) et les affiche via des composants organisés par section.

Le site expose deux routes publiques :

| Route        | Page                                         |
| ------------ | -------------------------------------------- |
| `/`          | `HomePage` — présentation générale           |
| `/projectsD` | `ProjectsPage` — liste et détail des projets |

---

## Stack technique

| Catégorie     | Technologie            | Version |
| ------------- | ---------------------- | ------- |
| Framework UI  | React                  | 19      |
| Bundler       | Vite                   | 8       |
| Routing       | React Router DOM       | 7       |
| Animations    | GSAP + `@gsap/react`   | 3.15    |
| Scroll smooth | Lenis                  | 1.3     |
| Icônes        | Lucide React           | 1.37    |
| CSS           | Sass (SCSS)            | 1.103   |
| Linting       | ESLint + plugins React | 10      |

---

## Architecture du projet

```
Resume-Front/
├── public/                  # Assets statiques (favicon, etc.)
├── src/
│   ├── main.jsx             # Point d'entrée React + Router
│   ├── pages/
│   │   ├── HomePage.jsx     # Page "/" — orchestre les hooks et passe les données en props
│   │   └── ProjectsPage.jsx # Page "/projectsD"
│   ├── components/          # Composants UI par section (Hero, About, Parcours, Contact…)
│   ├── hooks/               # Hooks personnalisés — appels API centralisés
│   └── assets/              # Images locales, fonts
├── .env                     # Variables d'environnement (développement)
├── .env.production          # Variables d'environnement (production)
├── vite.config.js
├── eslint.config.js
└── index.html
```

### Logique parent → enfant

Chaque **page** agit comme un orchestrateur :

1. Elle appelle les **hooks personnalisés** (`useProjets`, `useSkills`, etc.) qui font les requêtes vers l'API.
2. Un composant `PageLoader` gère l'état de chargement global.
3. Une fois les données prêtes, elles sont transmises en **props** aux composants enfants (sections).
4. Les composants affichent les données via `.map()` et `.filter()` — aucun composant enfant ne fait d'appel réseau directement.

```
Page (HomePage / ProjectsPage)
  ├── appelle les hooks → fetch vers mael-llado.com/api
  ├── PageLoader (gère loading / error)
  └── transmet les données en props
        ├── <Hero data={hero} />
        ├── <About data={about} />
        ├── <Parcours data={parcours} />
        ├── <Projects data={projects} />
        └── <Contact data={contact} />
```

---

## Styles & conventions CSS

Méthodologie **BEM** (Block Element Modifier) appliquée sur l'ensemble des fichiers SCSS.

```scss
/* Exemple de nommage BEM */
.hero {
} /* Block */
.hero__title {
} /* Element */
.hero__title--highlight {
} /* Modifier */
```

Organisation des fichiers — un fichier SCSS dédié par page et par composant :

```
src/
├── pages/
│   ├── HomePage.scss
│   └── ProjectsPage.scss
└── components/
    ├── Hero.scss
    ├── About.scss
    ├── Parcours.scss
    └── Contact.scss
```

Compilé via le plugin **Sass** de Vite, sans aucun framework CSS externe.

---

## Animations

- **GSAP ScrollTrigger** — animations déclenchées au scroll (entrées de sections, révélations)
- **Lenis** — scroll smooth natif, remplace le scroll navigateur par défaut

> Le site est prévu pour évoluer vers une expérience très animée dans une prochaine itération.

---

## Variables d'environnement

Créer un fichier `.env` à la racine avant de lancer le projet :

```dotenv
VITE_API_URL=https://mael-llado.com/api
```

| Variable       | Description                  |
| -------------- | ---------------------------- |
| `VITE_API_URL` | URL de base de l'API backend |

> En production, le fichier `.env.production` est utilisé automatiquement par Vite lors du `build`.

---

## Installation & développement

```bash
# Cloner le repo
git clone https://github.com/Mayel-0/Resume-Front.git
cd Resume-Front

# Installer les dépendances
npm install

# Créer le fichier d'environnement
cp .env.example .env
# puis renseigner VITE_API_URL

# Lancer le serveur de développement
npm run dev
```

## Scripts disponibles

| Commande          | Description                             |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Serveur de développement Vite avec HMR  |
| `npm run build`   | Build de production → dossier `dist/`   |
| `npm run preview` | Prévisualisation du build de production |
| `npm run lint`    | Analyse statique ESLint                 |

---

## Déploiement

Le build de production est généré avec Vite et servi **statiquement** par Nginx sur la machine Oracle Cloud.

```bash
npm run build
# → génère dist/

# Copier dist/ vers le répertoire servi par Nginx
# ex: /var/www/mael-llado.com/html/
```

Nginx est configuré pour servir `dist/index.html` sur toutes les routes (SPA fallback) et router `/api` vers le backend Node.js.

---

## SEO & métadonnées

Le `index.html` embarque les balises meta essentielles :

- `description` — résumé du profil
- `author`
- **Open Graph** — aperçu lors du partage du lien (`og:title`, `og:description`, `og:url`)
- `lang="fr"`

---

## Auteur

**Maël Llado** — Développeur Full Stack
[mael-llado.com](https://mael-llado.com) · Bordeaux, France
