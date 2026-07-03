/**
 * Single source of truth for the catalogue. Both the catalogue grid and the
 * per-block detail route read from here, so the URL `key` is also the stable
 * data key. Specs are the dev-facing handoff notes shown under each preview.
 */
export interface Block {
  cat: string;
  key: string;
  name: string;
  preview: string;
  icon: string;
  prims: string[];
  variants: string[];
}

// Only categories with at least one shipped block are listed. As real blocks
// land (Application, Auth, …) add their category here and an entry to BLOCKS.
export const CATS = ['Marketing', 'Pricing'];

// Catalogue = blocks that actually exist in the registry. `hero` is the only
// shipped block today; the rest of the design handoff is intentionally not
// listed until each block is built for real.
export const BLOCKS: Block[] = [
  {
    cat: 'Marketing',
    key: 'hero',
    name: 'Hero',
    preview: 'hero',
    icon: 'sparkles',
    prims: ['Badge', 'Button', 'Avatar'],
    variants: ['hero'],
  },
  {
    cat: 'Marketing',
    key: 'hero-terminal',
    name: 'Hero Terminal',
    preview: 'hero-terminal',
    icon: 'command',
    prims: ['Badge', 'Button'],
    variants: ['default'],
  },
  {
    cat: 'Marketing',
    key: 'hero-fintech',
    name: 'Hero Fintech',
    preview: 'hero-fintech',
    icon: 'lock',
    prims: ['Badge', 'Button'],
    variants: ['default'],
  },
  {
    cat: 'Marketing',
    key: 'hero-agency',
    name: 'Hero Agency',
    preview: 'hero-agency',
    icon: 'zap',
    prims: ['Button'],
    variants: ['default'],
  },
  {
    cat: 'Pricing',
    key: 'pricing',
    name: 'Pricing',
    preview: 'pricing',
    icon: 'card',
    prims: ['Badge', 'Button'],
    variants: ['default'],
  },
  {
    cat: 'Pricing',
    key: 'pricing-toggle',
    name: 'Pricing Toggle',
    preview: 'pricing-toggle',
    icon: 'gauge',
    prims: ['Switch', 'Button'],
    variants: ['default'],
  },
  {
    cat: 'Pricing',
    key: 'pricing-single',
    name: 'Pricing Single',
    preview: 'pricing-single',
    icon: 'star',
    prims: ['Badge', 'Button'],
    variants: ['default'],
  },
  {
    cat: 'Pricing',
    key: 'pricing-compare',
    name: 'Pricing Compare',
    preview: 'pricing-compare',
    icon: 'table',
    prims: ['Button'],
    variants: ['default'],
  },
];

/** Look up a block by its URL/data key. */
export function getBlock(key: string): Block | undefined {
  return BLOCKS.find((b) => b.key === key);
}

/** Blocks in the same category as `block` (used by the detail-page sidebar). */
export function siblingsOf(block: Block): Block[] {
  return BLOCKS.filter((b) => b.cat === block.cat);
}

/** Count of blocks in a category, or the whole catalogue for `'Tous'`. */
export function countInCat(cat: string): number {
  return cat === 'Tous' ? BLOCKS.length : BLOCKS.filter((b) => b.cat === cat).length;
}

// Dev-facing spec for a block, shown below the live preview on its detail page.
// Sourced from the design handoff (Ibirdui Blocks.dc.html).
export interface Spec {
  concept: string;
  primitives: string[];
  composition: string[];
  structure: string;
  responsive: { bp: string; txt: string }[];
  choreography: string;
  fallback: string;
  variants: string[];
}

export const SPECS: Record<string, Spec> = {
  hero: {
    concept:
      'Section d’accroche d’une landing : capter l’attention en moins de 2s et pousser vers le CTA.',
    primitives: ['Badge', 'Button', 'Avatar', 'Separator'],
    composition: [
      'Badge d’annonce + duo de Button (primaire / outline) au-dessus d’un fond gradient animé',
      'Pile d’Avatar + caption en preuve sociale',
      'Separator optionnel avant une barre de logos',
    ],
    structure:
      'Pile verticale centrée : badge → titre clamp(30–52px) → sous-titre 52ch → 2 CTA → preuve sociale. Fond = 2 blobs accent floutés en dérive + voile du panneau.',
    responsive: [
      { bp: 'Mobile', txt: 'Empilé, titre ~30px, CTA pleine largeur, 3 avatars max.' },
      { bp: 'Tablette', txt: 'Titre ~40px, CTA en ligne, padding latéral 32.' },
      { bp: 'Desktop', txt: 'Titre ~52px, contenu max 720px, blobs amplifiés.' },
    ],
    choreography:
      'Signature reveal : au mount, badge → titre → sous-titre → CTA → preuve sociale montent de 18px en fade (spring smooth, stagger 80ms). Les blobs dérivent en boucle. CTA primaire : micro lift snappy au hover.',
    fallback: 'Fade d’opacité seul (stagger 22ms), blobs figés, aucun translate ni scale.',
    variants: ['align: center | left', 'withSocialProof: bool', 'blobs: 1–3', 'accent thématique'],
  },
};
