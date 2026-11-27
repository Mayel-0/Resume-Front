# Hero v5 : « Les quatre fils » (MAEL-217)

Maquette : `design/hero.html`. Depuis `Resume-Front/`, `python3 -m http.server 8765`, puis `http://localhost:8765/design/hero.html`.
Paramètres : `?fond=clair`, `?reduced=1` (état final sans mouvement), `?vue=mobile` (aperçu 390 × 844 à côté). Captures : `design/captures/v5-hero-*.png`.

Ce hero est intégré au prototype complet `design/accueil-motion.html` (validé par Maël) : c'est la référence pour l'intégration. Palette, polices et épaisseurs de ligne sont celles de la v4.

Dans le prototype complet :
- desktop : chaque couche a une seconde pastille à droite (`.stack__row::after`). Les quatre fils arrivent à la pastille de gauche, puis repartent de celle de droite, de l'autre côté des textes, se rejoignent près du bord droit du hero et deviennent la ligne de la carte qui file vers À propos. Au survol d'une couche, ses deux fils (entrée et sortie) s'épaississent ensemble. Mobile : pas de pastille de droite, le départ de la ligne reste sous la liste ;
- les fils sont calculés dans le repère du hero, donc justes quand la caméra le déplace ou le réduit ;
- écran d'ordinateur de 800 px de haut ou moins : le texte court est masqué (il est repris dans À propos), la phrase principale rétrécit ;
- mobile en mode tracé : tout tient dans un écran, le portrait prend la place qui reste, le texte court est masqué, la liste passe en 2 × 2 sans les outils ;
- page classique (sans JS ou mouvement réduit) : le hero sort du conteneur de 1 180 px et prend toute la largeur.

## L'idée

Le hero dit qui est Maël en un écran : son nom en très grand, son visage devant, et ce qu'il sait faire, montré par le site lui-même. Les quatre brins de la ligne v4 naissent ici : chacun entre par la gauche, passe derrière le portrait et rejoint une couche de ce site (interface, API, données, serveur). À l'intégration, ces mêmes brins partent ensuite vers À propos et deviennent la ligne de la carte.

Trois plans, de l'arrière vers l'avant : le nom LLADO sur toute la largeur, un cran plus clair que le fond ; les quatre fils ; le portrait détouré ; les textes.

## Textes proposés (à saisir dans l'admin)

| Où | Champ | Texte |
| --- | --- | --- |
| Haut gauche | `location` (ou nouveau champ) | « À Bordeaux, en 2ᵉ année à Ynov. **Je cherche une alternance en développement web** à partir de [À PRÉCISER]. » |
| Nom | `firstName`, `lastName` | Maël / LLADO |
| Phrase principale | `role` réutilisé, ou nouveau `headline` | « Je construis des applications web en entier, de l'écran jusqu'au serveur qui les fait tourner. » |
| Texte court | `tagline` | « J'ai commencé par les réseaux et la sécurité en bac pro SN, mention très bien. Depuis, je code pour le web, et je mets en ligne ce que je fais. » |
| Titre de la liste | nouveau | « Ce site, je l'ai fait de bout en bout : » |
| Liste | nouveau (4 lignes : couche + outils) | L'interface : React, TypeScript, GSAP. L'API : Node.js, Express, Zod. Les données : PostgreSQL, Drizzle. Le serveur : Docker, Nginx, Oracle Cloud. |
| Boutons | | « Voir mes projets » (plein), « Télécharger mon CV » |
| Liens | `socials` | GitHub, LinkedIn en texte souligné (plus de ronds d'icônes) |

Retirés du hero : les quatre cases « Ynov / Bac Pro / 11 projets / 8 langages » avec compteurs animés (les chiffres passent dans À propos s'ils sont gardés), le mot « Scroll », la grille et les halos de fond.

## Composants (BEM)

- `.hero` : grille 12 colonnes desktop, `min-height: 100svh`, `overflow: hidden`.
- `.hero__where` (col. 1-6), `.hero__links` (col. 9-12, aligné à droite).
- `.hero__name` > `.hero__first` + `.hero__last` (une `span` par lettre, `display: flex; justify-content: space-between`, `font-size: 25.5vw`, couleur `--name`). `aria-label="Llado"` sur `.hero__last` pour que les lecteurs d'écran ne lisent pas lettre par lettre.
- `.hero__fils` (`.fils` dans la maquette) : un `<svg>` plein cadre, `aria-hidden`, quatre `<path>` calculés en JS depuis la position du nom et des pastilles (fonction `pathFor` de la maquette), recalculés au redimensionnement.
- `.hero__portrait` : `portraitUrl`, ancré en bas, `height: min(76svh, 820px)`, centré à 50 % décalé de -46 %, fondu en bas par `mask` (22 %).
- `.hero__intro` (col. 1-5) : `.hero__statement`, `.hero__bio`, `.hero__actions`.
- `.stack` (col. 9-12, 390 px max, calé à droite) : `.stack__title`, `.stack__row` (modificateurs `--menthe`, `--mandarine`, `--soleil`), `.stack__layer`, `.stack__tools`.

## États

- Ligne de la liste au survol ou au focus clavier : son fil s'épaissit de 2 px, les trois autres tombent à 18 % d'opacité, les outils passent en encre principale. Les lignes ont `tabindex="0"` dans la maquette ; à l'intégration, un simple survol sans tabindex suffit si ce n'est pas un lien (à trancher avec Paul).
- Boutons : comme la v4 (plein ↔ contour au survol, focus lagon 2 px).
- Chargement (API pas encore là) : nom et textes vides, pas de fils. Les fils se tracent une fois les données et les polices chargées (`document.fonts.ready`).
- Erreur API : le composant `apiError` existant.

## Mouvement

Un seul moment orchestré, environ 2,6 s, après la levée du rideau (`revealed`) :

| t (s) | Quoi | Courbe |
| --- | --- | --- |
| 0 | Phrase du haut monte de 16 px | `cubic-bezier(.22,1,.36,1)` |
| 0,10 | LLADO monte lettre par lettre (décalage 0,06 s, 1 s) | `cubic-bezier(.16,1,.3,1)` |
| 0,35 | Portrait découvert de bas en haut (`clip-path`) et montée de 40 px, 1,3 s | `cubic-bezier(.77,0,.18,1)` |
| 0,55 | Les 4 fils se tracent (`stroke-dashoffset`), 1,5 s chacun, décalés de 0,14 s ; chaque ligne de la liste passe de 20 % à 100 % quand son fil l'atteint | `cubic-bezier(.65,0,.35,1)` |
| 1,50 | Phrase principale, texte, boutons, liens, titre de liste | comme la ligne 0 |

Pas de flottement en boucle, pas de parallaxe souris, pas de compteur. Au scroll, la caméra de la v4 prend le relais. En GSAP, une timeline suffit avec les durées ci-dessus.

Mouvement réduit : tout est en place, fils déjà tracés, aucune animation.

## Comportement

- **1280 px et plus** : la maquette telle quelle (captures 1440 × 900).
- **900 à 1279 px** : même grille ; vérifier que `.stack` ne passe pas sous le portrait (sinon portrait à `70svh`).
- **899 px et moins** : une colonne. Phrase du haut, Maël, LLADO en encre pleine (24,5vw), portrait centré qui remonte sur le nom, phrase principale qui chevauche le bas du portrait, boutons pleine largeur, puis la liste. Les fils passent sous le nom et derrière le portrait puis sortent à droite ; ils ne descendent jamais sur les textes. Liens GitHub et LinkedIn masqués (ils sont dans le contact et le footer).
- **360 px** : LLADO tient sur une ligne ; zones tactiles de 44 px minimum.

## Assets

- Portrait : `src/assets/images/portrait.png` (2096 × 2560, détouré). Il garde un halo noir flou autour de la silhouette : invisible sur ardoise, visible en gris sur fond clair (capture `v5-hero-clair.png`).
- Polices : Clash Display et Supreme, déjà dans `src/assets/fonts/`.
- Aucune icône.

## Tokens

Ceux de `design/accueil-motion.md` (palette ardoise et clair). Un seul ajout : `--name` (`#2e3137` en ardoise, `#d6d5d0` en clair), couleur du nom géant derrière le portrait. Il est décoratif, donc hors exigence de contraste ; le nom lisible reste dans le logo et dans `.hero__first`.

## Choix anti-générique

- **Structure** : pas de hero « texte à gauche, photo à droite, quatre stats dessous ». Un nom-affiche sur toute la largeur, le portrait posé devant, et une preuve propre à Maël : le site lui-même, couche par couche.
- **Police** : Clash Display pour le nom et la phrase, Supreme pour le reste, comme la v4.
- **Couleur** : les quatre couleurs de la ligne v4 prennent un sens dès le premier écran (une par couche) ; pas de dégradé, pas de halo, pas de grille de fond.
- **Texte** : à la première personne, des faits vérifiables (bac pro SN mention très bien, Ynov 2ᵉ année, la stack réelle du site), aucun chiffre inventé.

## Points ouverts

1. Date de début de l'alternance : `[À PRÉCISER]`.
2. URL LinkedIn : à reprendre dans les `socials` de l'API.
3. Back : il faut un champ pour la phrase principale et un pour la liste « couche + outils » (4 lignes éditables dans l'admin). Sinon deux textes seraient en dur, ce que le projet interdit.
4. Double sens des couleurs : dans le hero, une couleur = une couche ; dans le reste du site, une couleur = un chapitre. Je le trouve lisible (les fils partent vers la suite). L'alternative : les quatre fils en lagon dans le hero.
5. Portrait sur fond clair : le re-détourer sans halo.
6. Le plugin ScrambleText n'est plus utilisé dans le prototype (le prénom apparaît en fondu) : il peut sortir du bundle.

Validé par Maël. Paul — intégration du hero avec `design/accueil-motion` (skill web-animation).
