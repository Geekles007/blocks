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
