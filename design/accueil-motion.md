# Motion v5 : « Le tracé », projets en hélice, hero « Les quatre fils » (MAEL-211, MAEL-216, MAEL-217)

Prototype : `design/accueil-motion.html`. Le hero (MAEL-217) est décrit à part dans `design/hero-handoff.md` ; `design/hero.html` le montre seul. Depuis `Resume-Front/`, lancer `python3 -m http.server 8765` (le port 8000 est pris par Docker), puis ouvrir `http://localhost:8765/design/accueil-motion.html`.
Le thème suit le réglage clair ou sombre de l'ordinateur ; `?fond=clair` ou `?fond=ardoise` le force, `?reduced=1` montre la version sans mouvement, `?vue=projets-2` (ou `a-propos`, `parcours`, `carte`, `contact`, ou un temps comme `8.2`) ouvre directement sur un arrêt de caméra. Les versions écartées sont rangées dans `design/archive/` (la v3 sans hélice : `archive/accueil-motion-v3.html`).

## Le principe

Le site est une carte. Une ligne en quatre couleurs serpente d'un chapitre à l'autre, et le scroll fait avancer la caméra le long de cette ligne : elle glisse, prend du recul dans les virages, se pose sur chaque chapitre. Les contenus apparaissent quand la ligne les atteint. Avant le contact, la caméra recule jusqu'à montrer tout le trajet d'un coup, puis plonge vers le bouton « M'écrire », que la ligne entoure.

Ce qui change par rapport à la v2 : plus de sol quadrillé, plus de lucioles ni de halos. Le fond est neutre, la ligne fait des boucles et des vagues, et la couleur vient de la ligne et des ombres.

Ce qui change en v4 (MAEL-216) : dans Projets, on ne voit plus deux colonnes de vignettes mais **un projet à la fois**. La ligne s'enroule en hélice, et à chaque cran de défilement la caméra tourne autour d'elle pour amener le projet suivant de face. C'est le seul passage en 3D du site.

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

Chaque chapitre a sa couleur. On la retrouve dans l'ombre de ses cartes et dans la barre de progression en bas à gauche. L'ombre colorée a trois couches : un très grand flou décalé vers le bas (`0 50px 160px -40px`, couleur du chapitre à 62 % en ardoise, 52 % en clair), une ombre courte et douce qui pose la carte (`0 18px 60px -22px`, 34 % / 28 %) et un filet d'1 px à 18 %. Aucun bord d'ombre ne doit se voir (MAEL-216) : le `clip-path` qui sert à l'apparition des panneaux garde une marge de 260 px, plus large que l'ombre ; sinon il la coupe net.

**Clair ou ardoise** : on garde les deux. Le site suit `prefers-color-scheme` ; un bouton pour forcer l'un ou l'autre reste à décider à l'intégration.

## La ligne

- Quatre brins : lagon (3 px), mandarine et menthe (2 px), soleil (1,5 px). Les trois brins secondaires s'écartent du principal en ondulant (amplitudes de 22 à 38 px, longueurs d'onde différentes), puis se resserrent tous avant le contact, où ils ne font plus qu'une ligne.
- Le tracé principal passe par des points choisis à la main sur desktop : il souligne le bas de l'accueil, fait le tour de la carte À propos, passe par la pastille de chaque étape du parcours, slalome entre les projets, puis boucle autour du bouton de contact. Sur mobile, les points sont calculés : la ligne traverse l'écran d'un bord à l'autre entre deux chapitres.
- L'épaisseur reste la même à tous les zooms (`vector-effect: non-scaling-stroke`). Avec cette option, les tirets qui dessinent la ligne se mesurent en pixels d'écran : `stroke-dasharray` et `stroke-dashoffset` doivent être multipliés par le zoom de la caméra à chaque image. Sans ça, la ligne paraît entière quand la caméra recule, puis se recoupe d'un coup (bug vu par Maël, corrigé dans le prototype).
- La ligne passe toujours sous les cartes et les titres (ils ont un fond), donc jamais à travers un texte.

## Storyboard

Une unité = un écran de défilement (0,9 sur mobile). Total : 16,25 unités avec 6 projets (chaque projet ajoute 1,3).

| t | Séquence | Mouvement | Courbe |
| --- | --- | --- | --- |
| chargement | Intro (≈ 3 s) | LLADO monte lettre par lettre, le portrait se découvre de bas en haut, les quatre fils du hero se tracent et allument chacun sa couche dans la liste ; à 1,6 s la ligne de la carte part du pied de la liste vers la droite. | `expo.out`, `power4.inOut`, `power2.inOut` |
| 0 → 0,35 | Accueil | Lecture. | |
| 0,35 → 1,5 | Vers À propos | La caméra part en diagonale, recule à 72 % au milieu du trajet, puis se pose. La ligne fait le tour de la carte. | `power2.inOut`, recul `sine` |
| 1,5 → 2,6 | À propos | Le texte s'allume mot par mot. | linéaire |
| 2,6 → 3,75 | Vers Parcours | Retour vers la gauche, en contrebas. | idem |
| 3,75 → 4,85 | Parcours | La ligne passe par les quatre pastilles, et chaque étape apparaît quand elle la touche. | linéaire |
| 4,85 → 6,0 | Vers Projets | Montée vers la droite ; la ligne passe sous le titre puis plonge dans l'hélice. | idem |
| 6,0 → 6,5 | Projet 1 de face | Titre « Ce que j'ai construit » au-dessus, fiche complète. | |
| + 0,8 par projet | Rotation | La caméra tourne de 60° autour de l'hélice en descendant d'un étage ; la fiche quittée pivote et s'efface, la suivante arrive de face. | `power2.inOut` |
| + 0,5 par projet | Projet de face | Pause, la fiche est lisible et cliquable. | |
| 12,5 → 13,65 | Vue d'ensemble | Recul jusqu'à voir toute la carte, hélice comprise. | `power3.inOut` |
| 13,65 → 14,2 | Pause | Le trajet entier est à l'écran. | |
| 14,2 → 15,35 | Vers Contact | Plongée vers le bouton. | `power3.inOut` |
| 15,35 → 16,25 | Contact | La ligne se referme autour de « M'écrire ». | |

Les liens du menu font voyager jusqu'au chapitre (2 s). Remonter rejoue tout à l'envers.

## Projets en hélice (MAEL-216)

**L'idée** : en arrivant aux projets, on change de rythme. On ne survole plus, on s'arrête sur chaque projet. La ligne lagon devient l'axe d'une hélice ; chaque fiche est accrochée sur la ligne, tournée vers l'extérieur ; la caméra tourne autour.

**La ligne garde ses courbes** :
- l'axe de l'hélice ondule (une vague en S sur toute la hauteur, ±5 % de l'écran) ;
- le rayon respire (±14 %) ;
- entre deux projets, la ligne fait un tour complet de plus que la caméra, donc on voit des boucles et pas un simple tire-bouchon tendu ;
- les trois brins secondaires se tressent autour du brin lagon (écart de rayon et d'angle qui ondule), et se resserrent à l'entrée et à la sortie de l'hélice, comme avant le contact ;
- la caméra regarde un peu d'en haut (plongée de 0,2) : chaque tour se lit comme une ellipse, le côté arrière passe derrière les fiches en plus pâle (32 %).

**La fiche projet** (de face) : image à gauche, puis année, titre, description courte, technos, lien. Tout vient de l'API, rien d'inventé : `year`, `title`, `intro`, les tags (`project_tags`), `linkLabel` + `githubUrl` ou `liveUrl`, `imageUrl`. Les technos sont écrites en mandarine, séparées par des points, sans pastilles.

**Pendant la rotation** :
- la fiche pivote avec l'hélice (`rotateY`, perspective 1600 px), sa face arrière n'est jamais visible ;
- l'opacité suit l'angle : pleine de face, nulle de profil ;
- la description, les technos et le lien ne s'affichent que sur la fiche de face (`--focus`, de 0 à 1 sur les 30 derniers degrés). De côté on lit seulement l'image, l'année et le titre ;
- la ligne avance avec le défilement : elle s'arrête juste après le projet en cours, la fiche suivante apparaît quand la ligne l'atteint.

**Clic** : un clic sur une fiche de côté fait tourner la caméra jusqu'à elle (même voyage de 2 s que les liens du menu). Sur la fiche de face, le lien ouvre le projet.

**HUD** : « Projets · *nom du projet de face* ».

**Nombre de projets variable** : l'angle entre deux projets vaut 360° / n (60° pour 6), au minimum 120°. La hauteur de l'hélice et la longueur du défilement suivent n.

**Mobile** : même principe, fiche en colonne (image 16/9 au-dessus), rayon 30 % de la largeur, 0,66 écran entre deux projets. Vérifié en 500 × 745 : la fiche de face tient à l'écran avec le HUD.

## Apparition des contenus

Un panneau apparaît quand la ligne arrive à sa hauteur : il se découvre de haut en bas (`clip-path`), en montant de 28 px, sur 0,9 s. Il reste visible en remontant tant que la ligne ne repasse pas en arrière.

## Transport vers un lien (MAEL-219)

Un clic sur un lien du menu (À propos, Parcours, Projets, Contact, logo) ne fait plus défiler la page : c'est un fondu, puis un saut de caméra, puis une réapparition dans un ordre fixe. Les lignes colorées reviennent toujours en premier, les contenus après.

| Temps | Ce qui se passe | Courbe |
| --- | --- | --- |
| 0 → 0,35 s | Tout s'efface (contenus et lignes) | `power2.in` |
| 0,35 s | La caméra saute à l'arrêt visé, sans trajet visible ; les panneaux sont retenus cachés | |
| 0,35 → 0,9 s | **Les lignes colorées** reviennent en fondu, seules sur le fond | `power2.out` |
| 1,0 s → | Les panneaux se découvrent un à un (même révélation que d'habitude : de haut en bas, 0,9 s), du plus central au plus éloigné, un toutes les 0,16 s | `cubic-bezier(.22,1,.36,1)` |

Durée totale : environ 2 s pour 3 panneaux à l'écran, moins pour une page peu chargée. Entrée impossible pendant le transport (un second clic est ignoré). Mouvement réduit : pas de transport, la page est classique. Un clic sur une fiche projet de côté garde la rotation de caméra (on reste dans Projets).

Pour l'intégration (Paul) : un état « retenu » par panneau (classe), un fondu GSAP des lignes puis un `delayedCall` par panneau ; constantes `WARP` du prototype.

## Textes

Les textes du prototype sont des propositions à saisir dans l'admin si Maël les valide. Le site ne contient aucun texte en dur.

| Où | Avant | Proposé |
| --- | --- | --- |
| Accueil | (voir v4) | Textes du hero v5 : tableau dans `hero-handoff.md` |
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
- **Structure** : pas de hero centré ni de rangée de 3 cartes. Une carte à parcourir, des formats différents selon le contenu : nom-affiche avec le portrait détouré devant, grande carte À propos aux coins arrondis, étapes en escalier, projets un par un autour de l'hélice, contact sans cadre.
- **3D** : une seule, pour une raison : montrer que les projets sont tous accrochés au même fil. Pas de décor 3D, pas de rotation libre à la souris.
- **Décor retiré** : petits labels en capitales, numérotation 01/02/03, halos, lucioles, sol quadrillé.
- **Animation** : un seul mouvement de caméra pour tout le site ; le reste (apparitions, mots) dépend de la ligne.

## Garde-fous

- **Mouvement réduit ou sans JavaScript** : la page s'affiche comme une page classique, une colonne lisible, sans ligne ni mouvement.
- **Performance** : pas de WebGL. La « 3D » de l'hélice est calculée à la main : 4 brins de 360 à 480 points projetés à chaque image, et des fiches en `transform` CSS (`rotateY`). Hors de l'hélice, rien ne change : la ligne est un SVG dont seule la `viewBox` bouge, les panneaux hors écran sont masqués. À mesurer sur un téléphone moyen à l'intégration ; si ça rame, réduire à 200 points par brin.
- **Mouvement réduit** : pas d'hélice. Les projets s'affichent les uns sous les autres, en fiches complètes (image + texte).
- **Mobile** : vérifié en 390 × 844. Chaque chapitre tient dans l'écran (le parcours se dézoome si besoin), pas de débordement horizontal, scroll tactile natif.
- **Contraste** : encre et encre douce passent AA sur fond et surface, dans les deux variantes.

## Coût d'intégration (estimation)

Environ 6,5 jours : moteur de caméra et de ligne (2 j), hélice des projets (rotation, fiches en 3D CSS, clic) (1,5 j), placement à partir des données de l'API avec un nombre variable d'étapes et de projets (1,5 j), mobile et mouvement réduit (1 j), recette sur iPhone et Android (0,5 j). Pas de WebGL : le risque Safari porte surtout sur `rotateY` + `backface-visibility`, à tester tôt.

Motion à valider par Maël. Après validation : Paul — intégration de `design/accueil-motion` (skill web-animation).
