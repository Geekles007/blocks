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

// Catalogue = blocks that actually exist in the registry. Marketing ships the
// full hero family; Pricing lists only `pricing-toggle` for now. The Morphing
// blocks are installable registry items too, but they live in their own
// showcase (/morphing) and are intentionally NOT listed in the catalogue.
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
    key: 'pricing-toggle',
    name: 'Pricing Toggle',
    preview: 'pricing-toggle',
    icon: 'gauge',
    prims: ['Switch', 'Button'],
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
  'hero-terminal': {
    concept:
      'Hero developer-first : accroche produit à gauche, terminal décoratif à droite qui montre la commande d’install — parler aux devs par la preuve, pas la promesse.',
    primitives: ['Badge', 'Button', 'block-motion'],
    composition: [
      'Badge d’eyebrow (outline, mono) + titre + sous-titre + duo de Button (default / outline)',
      'Terminal décoratif : barre de titre à 3 pastilles, lignes mono typées (comment / command / output) et curseur clignotant',
      'Terminal `aria-hidden` — purement illustratif, il n’entre pas dans le contraste du texte',
    ],
    structure:
      'Grille 2 colonnes centrée (max-w-6xl, md:grid-cols-2, gap 12→16, py 20→28). Colonne texte max-w-xl à gauche ; carte terminal rounded-xl bg-card à shadow-2xl à droite.',
    responsive: [
      { bp: 'Mobile', txt: 'Colonnes empilées, titre text-4xl, CTA pleine largeur.' },
      { bp: 'Tablette', txt: '≥ sm : titre text-5xl, CTA passent en ligne.' },
      { bp: 'Desktop', txt: '≥ md : 2 colonnes côte à côte, terminal à droite.' },
    ],
    choreography:
      'Colonne texte : reveal en cascade (eyebrow → titre → sous-titre → CTA, lift 12px, spring smooth, stagger 60ms, delay 40ms). Le terminal dérive séparément (y 24→0, spring gentle, delay 150ms). Curseur en pulse continu.',
    fallback: 'Fondu d’opacité seul via MotionProvider, aucun translate (prefers-reduced-motion).',
    variants: [
      'eyebrow?',
      'lines[] (command | comment | output)',
      'terminalTitle',
      'primary / secondaryAction',
    ],
  },
  'hero-fintech': {
    concept:
      'Hero fintech tourné confiance : copie rassurante à gauche, carte de compte « posée » à droite avec un solde en chiffres tabulaires et une bande de garanties. Le neutre porte tout, l’accent ne souligne que la sécurité.',
    primitives: ['Badge', 'Button', 'block-motion'],
    composition: [
      'Badge secondary + icône bouclier en eyebrow, titre, sous-titre, duo de Button, ligne d’assurance avec cadenas',
      'Panneau de compte décoratif : carte à numéro masqué + halo accent, solde tabulaire, bande de 3 métriques divisée',
      'Panneau `aria-hidden` — décoratif, hors contraste du texte',
    ],
    structure:
      'Grille asymétrique (max-w-6xl, md:grid-cols-[1.1fr_0.9fr], gap 12→16, py 20→28). Panneau rounded-3xl bg-card contenant une carte rounded-2xl secondary et une grille de métriques divide-x.',
    responsive: [
      { bp: 'Mobile', txt: 'Empilé, titre text-4xl, CTA pleine largeur, panneau sous la copie.' },
      { bp: 'Tablette', txt: '≥ sm : titre text-5xl, CTA en ligne, assurance visible.' },
      { bp: 'Desktop', txt: '≥ md : 2 colonnes 1.1/0.9, panneau de compte à droite.' },
    ],
    choreography:
      'Copie en cascade (eyebrow → titre → sous-titre → CTA → assurance, lift 12px, spring smooth, stagger 60ms). Le panneau dérive à part (y 24→0, spring gentle, delay 150ms).',
    fallback: 'Fondu d’opacité seul via MotionProvider, aucun translate (prefers-reduced-motion).',
    variants: [
      'eyebrow?',
      'assurance?',
      'balance { value, label }',
      'metrics[] (3)',
      'cardHolder / cardNumber',
    ],
  },
  'hero-agency': {
    concept:
      'Hero agence créative : titre démesuré qui déborde la grille, aligné à gauche, avec un rail de méta discret qui casse la symétrie. L’audace vient de l’échelle et du vide, pas de la couleur.',
    primitives: ['Button', 'block-motion'],
    composition: [
      'Eyebrow uppercase tracké précédé d’un trait décoratif (aria-hidden)',
      'Titre géant (jusqu’à text-8xl, max-w-14ch, break-words) qui déborde',
      'Rangée basse : sous-titre + CTA à flèche à gauche, rail de méta (dl divide-y) à droite',
    ],
    structure:
      'Colonne unique max-w-6xl (py 20→28). Titre leading 0.95→0.9, tracking -0.04em. Rangée basse en grille md:grid-cols-[1.4fr_0.6fr] alignée en bas ; rail de méta bordé en haut.',
    responsive: [
      { bp: 'Mobile', txt: 'Titre text-5xl, méta empilée sous la copie.' },
      { bp: 'Tablette', txt: 'sm text-6xl → md text-7xl, rail de méta à droite.' },
      { bp: 'Desktop', txt: '≥ lg : titre text-8xl pleine échelle.' },
    ],
    choreography:
      'makeReveal(stagger 80ms, delay 50ms) : eyebrow → titre → (sous-titre + CTA) → méta montent de 12px en fade (spring smooth). La flèche du CTA glisse au hover.',
    fallback: 'Fondu d’opacité seul via MotionProvider, aucun translate (prefers-reduced-motion).',
    variants: ['eyebrow?', 'subtitle?', 'meta[] { label, value }', 'primaryAction'],
  },
  'pricing-toggle': {
    concept:
      'Grille tarifaire avec un Switch mensuel/annuel qui bascule tous les prix d’un même geste ; le chiffre se remplace en fondu vertical sans jamais bousculer la mise en page. Un seul plan porte l’accent.',
    primitives: ['Switch', 'Button', 'block-motion'],
    composition: [
      'En-tête centré (h2 + sous-titre) + groupe de bascule : label Mensuel, Switch, label Annuel, pastille de remise',
      'Cartes de plan : h3, description, prix tabulaire qui se remplace, mention de facturation, CTA, liste de features à coches',
      'Plan `featured` : bordure + ring + shadow accent',
    ],
    structure:
      'Section max-w-6xl (py 20→28), en-tête max-w-2xl centré. Grille grid-cols-1 qui s’ouvre selon le nombre de plans (sm:2 / md:3 / lg:4). Cartes rounded-2xl bg-card à hauteur égale.',
    responsive: [
      { bp: 'Mobile', txt: 'Une colonne, cartes empilées, titre text-3xl.' },
      { bp: 'Tablette', txt: '≥ sm/md : 2–3 colonnes selon le nombre de plans.' },
      { bp: 'Desktop', txt: '≥ lg : jusqu’à 4 colonnes, titre text-4xl.' },
    ],
    choreography:
      'En-tête + grille en reveal (stagger 60ms). À la bascule, chaque prix se remplace via spring snappy (y 8→0 en fondu, keyé sur la valeur) — les chiffres tabulaires gardent la mise en page fixe.',
    fallback:
      'La transition de prix retombe sur un simple fondu ; entrée en fondu seul (prefers-reduced-motion).',
    variants: [
      'plans[] { monthlyPrice, annualPrice, featured, features[] }',
      'monthly / annualLabel',
      'annualHint?',
      'defaultAnnual',
    ],
  },
};
