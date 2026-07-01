# ibirdui — Brief design des primitives

Liste des composants ibirdui dont on créera des **primitives** dans le catalogue
`blocks.ibird.dev/primitives`. À designer par Claude design.

## Contexte
- **ibirdui** = design system open-source (React + Tailwind, tokens sémantiques,
  light/dark + un accent). Chaque composant est *state-complete* et accessible
  (WCAG AA, vérifié axe-core).
- **Modèle du catalogue** : une **catégorie = un composant** (Button, Badge…).
  Une catégorie contient plusieurs **designs** (déclinaisons = traitements
  visuels), et chaque design rend ses **variants** (tailles / états) en montant
  le vrai composant.

## À couvrir pour CHAQUE composant
- **États interactifs** : default, hover, focus-visible (anneau toujours
  visible), active/pressed, disabled.
- **États data** (composants liés à des données) : loading (skeleton),
  empty (message + action), error (message + retry), success/contenu.
- **Tailles** quand applicable : sm / md / lg (+ icon).
- **Thème** : light **et** dark, un seul accent.
- **Tokens** : background, surface, foreground, muted-foreground, border,
  primary, destructive, success, warning. Jamais de couleur en dur.
- **Rayon / ombre / typo** : un seul système d'échelle, cohérent partout.

Légende : ✅ = design déjà fait dans le catalogue.

---

## Foundation
- **button** ✅ — variants : default, secondary, outline, ghost, destructive, link · tailles sm/md/lg/icon · + icône, disabled.
- **badge** ✅ — tons : default, secondary, outline, destructive · + avec point/dot.
- **skeleton** — formes : ligne, texte multi-lignes, cercle (avatar), rectangle (carte), animation shimmer.
- **card** — parts : header, title, description, content, footer · designs : neutre, interactive (hover), avec média.
- **input** — états : default, focus, invalid (aria-invalid), disabled · + préfixe/suffixe (icône), placeholder.
- **separator** — orientations : horizontal, vertical · + avec label centré.
- **checkbox** — états : off, on, indeterminate, disabled, focus.
- **switch** — états : off, on, disabled, focus.
- **radio-group** — états : non sélectionné, sélectionné, disabled, focus · layout vertical/horizontal.
- **textarea** — états : default, focus, invalid, disabled · + auto-resize.
- **select** — états : default, focus, disabled, invalid · chevron décoratif.
- **alert** — variants : default, destructive · avec icône + titre + description.
- **progress** — déterminé (0/25/50/100 %) + indéterminé.
- **slider** — états : default, focus, disabled · piste remplie + thumb · single + range.

## State primitives
- **async-button** — états : idle, pending (spinner + aria-busy), success, error.
- **state-boundary** — les 4 slots : loading / empty / error / success (cadre orchestrateur).
- **empty-state** — icône + titre + description + action primaire.
- **error-state** — message + bouton Retry + disclosure « détails techniques ».

## Data display
- **avatar** ✅ — sources : photo, initiales, glyphe · tailles · + anneau de statut, pile.
- **data-list** — designs : loading (skeletons), empty, error+retry, success (liste).
- **data-table** — loading (lignes skeleton), empty, error, success · colonnes triables (aria-sort).
- **card-collection** — galerie de cartes : loading, empty, error, success.
- **detail-view** — fiche : loading (skeleton), not-found (empty), error, success.

## Fetching inputs
- **async-combobox** — fermé + ouvert (listbox) avec loading / empty / error / résultats · item actif.
- **command-palette** — ⌘K : input + groupes, item actif (highlight), raccourcis Kbd, empty, footer hints.
- **file-upload** — dropzone idle / hover / dragover · barre de progression par fichier · error+retry · success.

## Feedback & overlays
- **toast** — tons : success, error, loading, info · empilés · entrée/sortie.
- **confirm-dialog** — dialog : action default + destructive · état pending sur le bouton.
- **sheet** — panneau slide-over : 4 bords (top/right/bottom/left) · overlay + handle.

## Navigation
- **pagination** — pager numéroté avec ellipses, page courante · + bouton « Load more » (busy).
- **infinite-list** — liste + footer « chargement… » + sentinelle.
- **tabs** — onglets horizontaux : onglet actif, panneau · + variante underline/pill.

## Forms
- **field** — label + contrôle + description + erreur · états valide / invalide.
- **async-form** — erreur au niveau form (role=alert) + erreurs de champ + submit pending.
- **multi-select** — trigger (résumé de sélection) + popover de cases à cocher.
- **tag-input** — tags + input · ajout (Enter/virgule), suppression (✕/Backspace).
- **date-picker** — trigger + calendrier (grille de jours) : aujourd'hui, sélectionné, désactivé, hors-mois.

## Realtime
- **streaming-list** — lignes qui arrivent en direct · loading / empty / error · annonce des nouvelles.
- **presence** — pile d'avatars superposés + compteur live + chip « +N ».
- **offline-banner** — états : hors-ligne (apparaît), retour en ligne (se referme).
- **optimistic-toggle** — like/favori : off, on · feedback instantané + rollback.

## Overlays & menus
- **dropdown-menu** — trigger + menu : items, séparateurs, item destructif, item disabled, (sous-menu).
- **popover** — trigger + panneau flottant + flèche · placements.
- **tooltip** — au survol ET au focus · placements (top/right/bottom/left).
- **accordion** — items disclosure : replié / déplié · single + multiple.
- **stepper** — étapes : courante / faite / à venir · busy sur Next · état erreur.

---

**Total : 46 composants** (3 déjà designés : button, badge, avatar → 43 à créer).

### Ordre suggéré
1. **Foundation** (les plus réutilisés) — input, card, checkbox, switch, radio-group, select, textarea, alert, slider, progress, separator, skeleton.
2. **Overlays & menus** — dropdown-menu, popover, tooltip, accordion, tabs.
3. **Forms** — field, multi-select, tag-input, date-picker.
4. **Data display + State primitives** — empty-state, error-state, async-button, data-list, data-table…
5. **Feedback, Fetching, Realtime, Navigation** — le reste.
