/**
 * Catalogue of ibirdui PRIMITIVES, the foundation the blocks are composed from.
 *
 * Model: each primitive is a *category* (Button, Badge, …). A category holds
 * several *designs* (the "déclinaisons" — visual treatments), and each design
 * renders its own *variants* (sizes / states) live from the REAL ibirdui
 * component. This file is the pure, server-safe source of truth (names,
 * descriptions, install command); the live rendering lives in the client
 * `primitive-showcase` registry, keyed by the same `key` / design `key`.
 */
export interface PrimitiveDesign {
  /** Stable key, also the design's registry/variant id. */
  key: string;
  /** Display name of the design (déclinaison). */
  name: string;
  /** One line on what this design is for and how its variants behave. */
  description: string;
}

export interface Primitive {
  /** URL + data key (matches the registry item name). */
  key: string;
  /** Display name. */
  name: string;
  /** Grouping shown in the catalogue sidebar (mirrors the docs layer names). */
  category: string;
  /** Icon name from the shared Icon set. */
  icon: string;
  /** One-line summary. */
  description: string;
  /** The designs (déclinaisons) this primitive ships. */
  designs: PrimitiveDesign[];
}

export const PRIMITIVES: Primitive[] = [
  {
    key: 'button',
    name: 'Button',
    category: 'Foundation',
    icon: 'zap',
    description:
      'Le bouton primitif : un design par intention, chacun décliné en tailles et états (icône, désactivé).',
    designs: [
      {
        key: 'default',
        name: 'Solid',
        description:
          'Action principale, fond accent plein. Variants : tailles sm/md/lg, icône, désactivé.',
      },
      {
        key: 'secondary',
        name: 'Soft',
        description: 'Action secondaire sur fond muted, pour ne pas concurrencer le CTA principal.',
      },
      {
        key: 'outline',
        name: 'Outline',
        description: 'Contour seul — actions tertiaires et barres d’outils discrètes.',
      },
      {
        key: 'ghost',
        name: 'Ghost',
        description: 'Aucun fond au repos, surface au survol — idéal en icône dans une toolbar.',
      },
      {
        key: 'destructive',
        name: 'Destructive',
        description: 'Action irréversible (supprimer) — couleur destructive + libellé explicite.',
      },
      {
        key: 'link',
        name: 'Link',
        description:
          'Bouton qui ressemble à un lien, souligné au survol — actions inline dans du texte.',
      },
    ],
  },
  {
    key: 'badge',
    name: 'Badge',
    category: 'Foundation',
    icon: 'star',
    description: 'Pastille de statut / label. Un design par ton sémantique, déclinés en libellés.',
    designs: [
      {
        key: 'default',
        name: 'Default',
        description: 'Ton accent plein — mise en avant neutre (nouveau, actif).',
      },
      {
        key: 'secondary',
        name: 'Soft',
        description: 'Ton muted discret — métadonnées et états calmes (brouillon).',
      },
      {
        key: 'outline',
        name: 'Outline',
        description: 'Contour seul — tags légers qui ne tirent pas l’œil.',
      },
      {
        key: 'destructive',
        name: 'Destructive',
        description: 'Statut d’erreur / échec — couleur destructive, libellé accessible.',
      },
    ],
  },
  {
    key: 'avatar',
    name: 'Avatar',
    category: 'Data display',
    icon: 'user',
    description:
      'Image de profil qui se dégrade proprement. Un design par source, décliné en tailles.',
    designs: [
      {
        key: 'image',
        name: 'Photo',
        description: 'Image chargée avec skeleton pendant le chargement, alt = nom de la personne.',
      },
      {
        key: 'initials',
        name: 'Initiales',
        description:
          'Repli sur les initiales quand il n’y a pas de photo — exposé en image labellisée.',
      },
      {
        key: 'fallback',
        name: 'Glyphe',
        description: 'Sans nom ni photo : glyphe neutre décoratif, masqué aux lecteurs d’écran.',
      },
    ],
  },
  {
    key: 'input',
    name: 'Input',
    category: 'Foundation',
    icon: 'file',
    description:
      'Le champ texte : anneau de focus visible, état invalide destructif, et préfixe/suffixe icône.',
    designs: [
      {
        key: 'field',
        name: 'États',
        description:
          'Default, invalide (aria-invalid → bordure destructive) et désactivé, avec placeholder.',
      },
      {
        key: 'affix',
        name: 'Préfixe / suffixe',
        description: 'Icône en tête (recherche) ou en pied (validation), composée autour du champ.',
      },
    ],
  },
  {
    key: 'textarea',
    name: 'Textarea',
    category: 'Foundation',
    icon: 'file',
    description: 'La zone de texte multi-lignes, mêmes états et anneau de focus que l’input.',
    designs: [
      {
        key: 'field',
        name: 'États',
        description: 'Default, invalide et désactivé — bordure et anneau destructifs en erreur.',
      },
    ],
  },
  {
    key: 'checkbox',
    name: 'Checkbox',
    category: 'Foundation',
    icon: 'check',
    description:
      'Case native : dans l’ordre de tabulation, bascule à l’espace, état indéterminé exposé.',
    designs: [
      {
        key: 'states',
        name: 'États',
        description: 'Non coché, coché, indéterminé et désactivé — teinte accent, anneau au focus.',
      },
    ],
  },
  {
    key: 'switch',
    name: 'Switch',
    category: 'Foundation',
    icon: 'bell',
    description:
      'Interrupteur role=switch : bascule immédiate, contrôlé ou non, contrepartie de l’async-toggle.',
    designs: [
      {
        key: 'states',
        name: 'États',
        description:
          'Désactivée, activée et verrouillée (disabled) — piste teintée + thumb qui glisse.',
      },
    ],
  },
  {
    key: 'radio-group',
    name: 'Radio group',
    category: 'Foundation',
    icon: 'grid',
    description:
      'Choix unique parmi plusieurs options, radios natifs partageant un name, role=radiogroup.',
    designs: [
      {
        key: 'vertical',
        name: 'Vertical',
        description: 'Options empilées — le layout par défaut, une sélection par défaut.',
      },
      {
        key: 'horizontal',
        name: 'Horizontal',
        description: 'Mêmes options en ligne (flex-wrap) pour les jeux de choix courts.',
      },
    ],
  },
  {
    key: 'select',
    name: 'Select',
    category: 'Foundation',
    icon: 'chev',
    description:
      'Select natif thémé + chevron décoratif — liste OS, tactile et lecteur d’écran gratis.',
    designs: [
      {
        key: 'states',
        name: 'États',
        description: 'Default, invalide (aria-invalid) et désactivé — options passées en enfants.',
      },
    ],
  },
  {
    key: 'alert',
    name: 'Alert',
    category: 'Foundation',
    icon: 'help',
    description: 'Encart de message avec titre + description ; ton neutre ou destructif.',
    designs: [
      {
        key: 'default',
        name: 'Default',
        description: 'Information neutre — bordure et fond de surface, titre + description.',
      },
      {
        key: 'destructive',
        name: 'Destructive',
        description: 'Erreur ou action à risque — teinte destructive sur tout l’encart.',
      },
    ],
  },
  {
    key: 'progress',
    name: 'Progress',
    category: 'Foundation',
    icon: 'gauge',
    description: 'Barre de progression ARIA (role=progressbar) : déterminée ou indéterminée.',
    designs: [
      {
        key: 'determinate',
        name: 'Déterminé',
        description: 'Valeur connue (0/25/50/100 %) — aria-valuenow reflète l’avancement.',
      },
      {
        key: 'indeterminate',
        name: 'Indéterminé',
        description: 'Valeur inconnue — barre animée, pas de aria-valuenow.',
      },
    ],
  },
  {
    key: 'slider',
    name: 'Slider',
    category: 'Foundation',
    icon: 'gauge',
    description:
      'Curseur sur input range natif : role=slider, clavier et drag gratis, piste teintée.',
    designs: [
      {
        key: 'states',
        name: 'États',
        description: 'Default et désactivé — thumb sur piste remplie, anneau de focus visible.',
      },
    ],
  },
  {
    key: 'separator',
    name: 'Separator',
    category: 'Foundation',
    icon: 'layers',
    description: 'Filet de séparation, décoratif par défaut (masqué aux lecteurs d’écran).',
    designs: [
      {
        key: 'horizontal',
        name: 'Horizontal',
        description: 'Trait pleine largeur entre deux blocs de contenu.',
      },
      {
        key: 'vertical',
        name: 'Vertical',
        description:
          'Trait vertical pleine hauteur — séparer des éléments en ligne (barres d’outils).',
      },
    ],
  },
  {
    key: 'skeleton',
    name: 'Skeleton',
    category: 'Foundation',
    icon: 'layers',
    description:
      'Placeholders de chargement (aria-hidden) : formes libres + texte multi-lignes, shimmer.',
    designs: [
      {
        key: 'shapes',
        name: 'Formes',
        description: 'Cercle (avatar) + lignes — un en-tête de carte média en cours de chargement.',
      },
      {
        key: 'text',
        name: 'Texte',
        description: 'SkeletonText : n lignes, la dernière plus courte, animation shimmer.',
      },
    ],
  },
  {
    key: 'card',
    name: 'Card',
    category: 'Foundation',
    icon: 'card',
    description:
      'Conteneur de surface et ses parties (header/title/description/content/footer) — pure mise en page.',
    designs: [
      {
        key: 'neutral',
        name: 'Neutre',
        description: 'Carte complète : en-tête, contenu et pied avec actions.',
      },
      {
        key: 'stat',
        name: 'Stat',
        description: 'Tuile de statistique : label, valeur et variation.',
      },
    ],
  },
];

/** Look up a primitive by its URL/data key. */
export function getPrimitive(key: string): Primitive | undefined {
  return PRIMITIVES.find((p) => p.key === key);
}

/** Ordered list of categories that actually have a primitive. */
export function primitiveCategories(): string[] {
  return [...new Set(PRIMITIVES.map((p) => p.category))];
}

/** Count of primitives in a category, or the whole catalogue for `'Tous'`. */
export function countInPrimitiveCat(cat: string): number {
  return cat === 'Tous' ? PRIMITIVES.length : PRIMITIVES.filter((p) => p.category === cat).length;
}
