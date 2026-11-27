# Direction d'animation : « Le fil » (MAEL-211)

## Le principe en une phrase

**Un seul fil de lumière, tiré par le scroll, relie tout le site : il naît sous le nom, descend de section en section en allumant chaque repère qu'il croise, et se referme autour du bouton de contact.**

Aujourd'hui, chaque effet a son propre déclencheur, sa durée et son easing. Avec cette règle, il n'y a plus qu'**un seul moteur visible**, le scroll, et **une seule chose qui avance**, le fil. Tous les effets se règlent sur lui. C'est ce qui donne la continuité : il n'y a jamais de moment immobile, puisque le fil avance dès qu'on défile, et la page se lit comme un parcours, ce qui colle à un portfolio d'alternance.

Maquette : `design/animations.html`. Ouvrir avec un petit serveur local (`npx serve` ou `python3 -m http.server` depuis `Resume-Front/`). Ajouter `?reduced=1` pour voir le mode sans animation.

## Les trois moments

1. **Entrée.** Une seule timeline de 1,8 s, contre 2,6 s et plus aujourd'hui. Le nom monte, le portrait se dévoile en rideau, puis le fil se trace sous « LLADO » et se replie dans la marge gauche. Sa tête lumineuse y pulse avec « Faites défiler » : c'est elle qui remplace l'actuel indicateur de scroll.
2. **Transition.** La tête du fil reste au **centre de l'écran**. Quand elle croise un repère, il s'allume et le reste : numéro de section en cyan, petit trait jusqu'au titre, points du parcours. La ligne de la timeline du parcours *est* le fil. Le contenu apparaît **avant** que le fil n'arrive, donc la lecture n'attend jamais l'animation.
3. **Moment fort.** Dans la section Projets épinglée, le fil devient le **rail horizontal** sous les cartes : il remplace la barre de progression. Il redescend ensuite et vient **entourer le bouton « Écrire à Maël »**, qui s'illumine. La boucle se ferme et la tête s'éteint. C'est la fin du récit, et c'est sur l'action principale.

## Lien avec le style

- **Couleurs : la palette ne change pas.** Le cyan `--accent` devient la couleur réservée au fil et à ce qu'il allume. On retire donc les halos cyan et violets du hero : la lumière du site, c'est le fil.
- **Typographie et espacements : aucun changement.** Seule exigence : garder une marge gauche d'environ 28 px entre le fil et le contenu, ce que le `--shell` actuel permet déjà au-dessus de 1024 px.
- **Nouveaux tokens** : `--thread-w` (1,5 px), `--thread-idle`, `--thread-glow`.

## Garder / retravailler / supprimer

| Animation actuelle | Verdict | Pourquoi |
| --- | --- | --- |
| Lenis (scroll fluide) | **Garder** | C'est la base du ressenti continu. |
| Rideau / preloader + transitions de page | **Garder** | Il se lève déjà proprement ; le fil démarre juste après. |
| Prénom en scramble, nom lettre par lettre en 3D | **Garder**, raccourcis | Ce sont la signature de l'entrée. Ils durent 1 s au lieu de 1,9 s. |
| Sortie du hero au scroll (texte qui recule, portrait en profondeur) | **Garder** | C'est déjà piloté par le scroll, donc cohérent. |
| Parallaxe du portrait à la souris | **Garder** | C'est discret. |
| Bandeau qui accélère et s'inverse avec le scroll | **Garder** | C'est le même principe que le fil. |
| « À propos » qui s'allume mot par mot | **Garder** | C'est le même principe que le fil. |
| Projets épinglés en défilement horizontal + parallaxe des images | **Garder** | La barre de progression est remplacée par le rail du fil. |
| Nom géant du footer qui monte au scroll | **Garder** | C'est le point final. |
| Curseur perso, boutons magnétiques | **Garder** | Ce sont des micro-interactions ; on retire seulement le rebond élastique au relâchement. |
| Ligne de la timeline du parcours | **Retravailler** | Elle devient un morceau du fil, et ses points s'allument au passage de la tête. |
| Timeline d'entrée du hero (10 étapes) | **Retravailler** | Une seule séquence courte, avec le fil en dernier. |
| `Reveal` / `SplitHeading` | **Retravailler** | Un seul préréglage (y 32, 0,9 s, `power3.out`, déclenché à 85 %) au lieu de 8 variantes (y 24 à 60, déclenchés de 78 à 85 %). |
| Easings `back.out` / `elastic.out` | **Retravailler** | On ne garde qu'une famille (`power3/power4.out`) ; les rebonds donnent l'effet « bricolé ». |
| Halos + orbes du hero, flottement du portrait, respiration du halo | **Supprimer** | Trois boucles ambiantes qui se concurrencent. Il n'en reste qu'une : la pulsation de la tête du fil. |
| Barre de progression du header | **Supprimer** | Elle fait doublon : le fil *est* la progression. |
| Barre de progression des projets | **Supprimer** | Elle est remplacée par le rail. |
| Inclinaison (tilt) de la carte « À propos » | **Supprimer** | Un gadget isolé, hors du principe. |

## Contraintes vérifiées dans la maquette

- **`prefers-reduced-motion`** : le fil est affiché entièrement tracé, en statique et atténué. Pas de tête, pas de Lenis, aucun ScrollTrigger, et tout le contenu est visible.
- **Mobile (< 1024 px)** : le fil reste vertical dans une marge de 8 px, les projets sont empilés sans épinglage, puis le fil contourne le bouton de contact par la gauche. Pas de débordement horizontal.
- **Performance** : on anime uniquement `stroke-dashoffset` et des `transform`. Aucun `filter: blur` sur le SVG ; la lueur de la tête est un `box-shadow` sur une `div`.
- **SEO et contenu** : le fil est décoratif (`aria-hidden`) et rien dans le DOM ne change. Les tracés sont recalculés à partir du contenu réel, donc tout texte venant de l'API fonctionne.

## Ce que ça coûte à intégrer (estimation)

| Tâche | Charge |
| --- | --- |
| Système du fil : `lib/thread.ts` + `<ThreadSegment>` + tête, recalcul au resize et au changement de route | 1 à 1,5 j |
| Hero : timeline courte, suppression des halos et orbes | 0,5 j |
| Unification de `Reveal` / `SplitHeading` + allumage des sections | 0,5 j |
| Projets (rail à la place de la barre) + contact (boucle) | 0,5 j |
| Recette mobile / mouvement réduit / Safari | 0,5 j |
| **Total** | **≈ 3 à 3,5 jours** |

## Alternative écartée

**« Sections empilées »** : chaque section glisse par-dessus la précédente, qui recule. C'est moins cher (≈ 1,5 j), mais très répandu, ça entre en conflit avec l'épinglage horizontal des projets, et ça n'apporte pas de fil conducteur visible. Je recommande « Le fil ».
