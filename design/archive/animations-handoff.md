# Passation intégration : « Le fil » (après validation de Maël)

Source de vérité : `design/animations.html` (le script de fin de fichier est la référence de comportement). Direction et liste garder/supprimer : `design/animations-direction.md`.

## Composants proposés

| Élément | Nom BEM / fichier | Rôle |
| --- | --- | --- |
| Segment SVG par section | `<ThreadSegment>` → `svg.thread` > `path.thread__base` + `path.thread__line` | Calcule son tracé à partir de la boîte de la section ; `stroke-dashoffset` piloté par un ScrollTrigger `top center → bottom center` |
| Tête lumineuse | `.thread-head` (+ `.thread-head__hint`), un seul exemplaire monté dans `App` | `position: fixed`, placée via `getPointAtLength` du segment actif |
| Logique partagée | `lib/thread.ts` : `makePath`, `draw(seg, p)`, `scrubSegment` | Reprendre les fonctions de la maquette telles quelles |
| Repère de section | `.mark` > `.mark__tick` + `.mark__idx` | S'allume (`.is-lit`) quand son haut passe le centre de l'écran |
| Point du parcours | `.timeline__dot` sur `li.is-lit` | Remplace la ligne actuelle animée dans `parcours.tsx` |
| Bouton de contact | `.contact.is-closed .contact__cta` | Lueur quand la boucle est fermée |

## Tracés par section

- **Hero** : `heroA` (sous `.hero__last`, de droite à gauche, puis courbe vers la marge) est joué par la timeline d'entrée ; `heroB` (de la marge jusqu'au bas du hero) est en scrub `top top → bottom center`.
- **Bandeau, À propos, Parcours** : une droite verticale en `x = --gx`.
- **Projets (≥ 1024 px)** : `projA` en vertical (`top center → top top`), `projB` en rail horizontal piloté par le ScrollTrigger de l'épinglage existant, `projC` en vertical à droite après l'épinglage. **< 1024 px** : vertical uniquement.
- **Contact** : le fil longe le bord (jamais à travers le texte), arrive à la hauteur du bouton et en fait le contour en pilule. Fin du trigger : `endTrigger: cta, end: "clamp(center center)"`.

## États

- Normal : le fil se trace avec le scroll et la tête pulse.
- `prefers-reduced-motion` : tous les chemins à `dashoffset 0`, `opacity .45`, `.is-lit` posé partout, pas de tête, pas de Lenis. Le contenu doit rester entièrement visible.
- Chargement : rien ne se dessine avant la levée du rideau (`revealed` dans `transitionContext`) ni avant `document.fonts.ready`.
- Resize / changement de route : `ctx.revert()` puis on reconstruit (les tracés dépendent de la mise en page). Appeler `ScrollTrigger.sort()` avant `refresh()` : les triggers placés sous les projets doivent tenir compte de l'espace ajouté par l'épinglage.
- Pas de focus clavier sur le fil (`aria-hidden`, `pointer-events: none`).

## Responsive

- 360 px : `--gx` = 8 px, projets empilés, contour du bouton par la gauche.
- 768 px : idem.
- ≥ 1024 px : `--gx` = bord gauche du shell − 28 px, rail horizontal dans les projets, contour du bouton par la droite.

## Tokens à ajouter à `_variables.scss`

`--thread-w: 1.5px`, `--thread-idle: rgba(255,255,255,.07)`, `--thread-glow: 0 0 12px 2px color-mix(in srgb, var(--accent) 70%, transparent), 0 0 40px 8px color-mix(in srgb, var(--accent) 25%, transparent)`.

## Points ouverts

- Pages projet (`ProjectD`) : le fil n'est pas prévu pour l'instant. À décider avec Maël : un fil court sur l'article, ou rien.
- L'en-tête de la maquette (`.mk-bar`, `.mk-moment`) n'existe que dans la maquette : ne pas l'intégrer.
