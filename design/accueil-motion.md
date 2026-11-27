# Motion v3 : « Le tracé » (MAEL-211)

Prototype : `design/accueil-motion.html`. Depuis `Resume-Front/`, lancer `python3 -m http.server 8765` (le port 8000 est pris par Docker), puis ouvrir `http://localhost:8765/design/accueil-motion.html`.
Le thème suit le réglage clair ou sombre de l'ordinateur ; `?fond=clair` ou `?fond=ardoise` le force, `?reduced=1` montre la version sans mouvement. Les versions écartées sont rangées dans `design/archive/`.

## Le principe

Le site est une carte. Une ligne en quatre couleurs serpente d'un chapitre à l'autre, et le scroll fait avancer la caméra le long de cette ligne : elle glisse, prend du recul dans les virages, se pose sur chaque chapitre. Les contenus apparaissent quand la ligne les atteint. Avant le contact, la caméra recule jusqu'à montrer tout le trajet d'un coup, puis plonge vers le bouton « M'écrire », que la ligne entoure.

Ce qui change par rapport à la v2 : plus de sol quadrillé ni de 3D, plus de lucioles ni de halos. Le fond est neutre, la ligne fait des boucles et des vagues, et la couleur vient de la ligne et des ombres.

## Palette

| Nom | Ardoise (défaut) | Clair | Rôle |
| --- | --- | --- | --- |
| fond | `#1c1e22` | `#e7e6e2` | Gris neutre, sans teinte bleue ni crème |
| surface | `#25282d` | `#f7f6f3` | Cartes posées sur le fond |
| encre | `#edebe7` | `#17191c` | Texte principal |
| encre douce | `#b3b6bc` | `#4b5058` | Texte secondaire (contraste AA) |
| lagon | `#33c4f2` | `#0b93c6` | Accueil, À propos, brin principal de la ligne |
| menthe | `#44d6a0` | `#0e9a6c` | Parcours |
| mandarine | `#ff8b42` | `#e2621a` | Projets |
| soleil | `#ffd04d` | `#d39e00` | Contact |

Chaque chapitre a sa couleur. On la retrouve dans l'ombre de ses cartes et dans la barre de progression en bas à gauche. L'ombre colorée a trois couches : un grand flou décalé vers le bas (`0 46px 90px -34px`, couleur du chapitre à 85 % en ardoise, 70 % en clair), une ombre courte qui pose la carte (50 % / 42 %) et un filet d'1 px à 18 %.

**Clair ou ardoise** : on garde les deux. Le site suit `prefers-color-scheme` ; un bouton pour forcer l'un ou l'autre reste à décider à l'intégration.

## La ligne

- Quatre brins : lagon (3 px), mandarine et menthe (2 px), soleil (1,5 px). Les trois brins secondaires s'écartent du principal en ondulant (amplitudes de 22 à 38 px, longueurs d'onde différentes), puis se resserrent tous avant le contact, où ils ne font plus qu'une ligne.
- Le tracé principal passe par des points choisis à la main sur desktop : il souligne le bas de l'accueil, fait le tour de la carte À propos, passe par la pastille de chaque étape du parcours, slalome entre les projets, puis boucle autour du bouton de contact. Sur mobile, les points sont calculés : la ligne traverse l'écran d'un bord à l'autre entre deux chapitres.
- L'épaisseur reste la même à tous les zooms (`vector-effect: non-scaling-stroke`). Avec cette option, les tirets qui dessinent la ligne se mesurent en pixels d'écran : `stroke-dasharray` et `stroke-dashoffset` doivent être multipliés par le zoom de la caméra à chaque image. Sans ça, la ligne paraît entière quand la caméra recule, puis se recoupe d'un coup (bug vu par Maël, corrigé dans le prototype).
- La ligne passe toujours sous les cartes et les titres (ils ont un fond), donc jamais à travers un texte.

## Storyboard

Une unité = un écran de défilement (0,9 sur mobile). Total : 12,35 unités.

| t | Séquence | Mouvement | Courbe |
| --- | --- | --- | --- |
| chargement | Intro (≈ 2 s) | Le nom monte lettre par lettre, le portrait se découvre de bas en haut, la ligne entre par la gauche et passe sous le texte. | `power4.out`, `power2.inOut` |
| 0 → 0,35 | Accueil | Lecture. | |
| 0,35 → 1,5 | Vers À propos | La caméra part en diagonale, recule à 72 % au milieu du trajet, puis se pose. La ligne fait le tour de la carte. | `power2.inOut`, recul `sine` |
| 1,5 → 2,6 | À propos | Le texte s'allume mot par mot. | linéaire |
| 2,6 → 3,75 | Vers Parcours | Retour vers la gauche, en contrebas. | idem |
| 3,75 → 4,85 | Parcours | La ligne passe par les quatre pastilles, et chaque étape apparaît quand elle la touche. | linéaire |
| 4,85 → 6,0 | Vers Projets | Montée vers la droite. | idem |
| 6,0 → 8,6 | Projets | La caméra descend entre deux colonnes de projets, la ligne slalome au milieu. | `sine.inOut` |
| 8,6 → 9,75 | Vue d'ensemble | Recul jusqu'à voir toute la carte (zoom ≈ 0,15). | `power3.inOut` |
| 9,75 → 10,3 | Pause | Le trajet entier est à l'écran. | |
| 10,3 → 11,45 | Vers Contact | Plongée vers le bouton. | `power3.inOut` |
| 11,45 → 12,35 | Contact | La ligne se referme autour de « M'écrire ». | |

Les liens du menu font voyager jusqu'au chapitre (2 s). Remonter rejoue tout à l'envers.

## Apparition des contenus

Un panneau apparaît quand la ligne arrive à sa hauteur : il se découvre de haut en bas (`clip-path`), en montant de 28 px, sur 0,9 s. Il reste visible en remontant tant que la ligne ne repasse pas en arrière.

## Textes

Les textes du prototype sont des propositions à saisir dans l'admin si Maël les valide. Le site ne contient aucun texte en dur.

| Où | Avant | Proposé |
| --- | --- | --- |
| Accueil, accroche | « Développeur Full Stack curieux et polyvalent, je conçois des solutions de bout en bout… » | « Je développe des applications web en entier : l'interface, l'API, la base de données, puis la mise en ligne sur mon propre serveur. » |
| Accueil, sur-titre | « Bordeaux, France » | « Basé à Bordeaux, je cherche une alternance en développement web. » |
| Accueil, rôle | « Étudiant en informatique · Développeur Full Stack » | « Étudiant en 2ᵉ année à Ynov Bordeaux, développeur full stack » |
| À propos, titre | « À propos de moi » | « Qui je suis » |
| À propos, texte | (fiches seules) | Paragraphe sur le passage des réseaux au web et sur l'hébergement du site (faits tirés du projet) |
| Parcours, titre | « Parcours et expériences » | « Mon parcours » |
| Projets, titre | « Projets personnels » | « Ce que j'ai construit » |
| Contact, titre | « Discutons de votre projet » | « Vous recrutez un alternant en développement web ? » |
| Boutons | « Me contacter », « Voir les projets » | « M'écrire », « Voir mes projets » |

À compléter : la date de début d'alternance (`[À PRÉCISER]`).

## Choix anti-générique

- **Police** : on garde Clash Display (titres) et Supreme (texte), déjà dans le projet. Pas d'Inter, pas de serif « éditorial ».
- **Palette** : fond gris neutre, sans dégradé violet ni noir à accent néon. Quatre couleurs, une par chapitre, qui servent à s'orienter.
- **Structure** : pas de hero centré ni de rangée de 3 cartes. Une carte à parcourir, des formats différents selon le contenu : portrait découpé en biais, grande carte À propos aux coins arrondis, étapes en escalier, projets en deux colonnes décalées, contact sans cadre.
- **Décor retiré** : petits labels en capitales, numérotation 01/02/03, halos, lucioles, sol quadrillé.
- **Animation** : un seul mouvement de caméra pour tout le site ; le reste (apparitions, mots) dépend de la ligne.

## Garde-fous

- **Mouvement réduit ou sans JavaScript** : la page s'affiche comme une page classique, une colonne lisible, sans ligne ni mouvement.
- **Performance** : aucune 3D, aucun calque géant. La ligne est un SVG dont seule la `viewBox` change ; les 15 panneaux bougent en `transform` ; les panneaux hors écran sont masqués.
- **Mobile** : vérifié en 390 × 844. Chaque chapitre tient dans l'écran (le parcours se dézoome si besoin), pas de débordement horizontal, scroll tactile natif.
- **Contraste** : encre et encre douce passent AA sur fond et surface, dans les deux variantes.

## Coût d'intégration (estimation)

Environ 5 jours : moteur de caméra et de ligne (2 j), placement à partir des données de l'API avec un nombre variable d'étapes et de projets (1,5 j), mobile et mouvement réduit (1 j), recette sur iPhone et Android (0,5 j). Plus simple que la v2 côté navigateur : pas de 3D, donc moins de risques sur Safari.

Motion à valider par Maël. Après validation : Paul — intégration de `design/accueil-motion` (skill web-animation).
