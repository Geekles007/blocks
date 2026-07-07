import type { Locale } from './i18n';

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
    cat: 'Marketing',
    key: 'features',
    name: 'Features',
    preview: 'features',
    icon: 'grid',
    prims: ['Card', 'Badge'],
    variants: ['default'],
  },
  {
    cat: 'Marketing',
    key: 'testimonials',
    name: 'Testimonials',
    preview: 'testimonials',
    icon: 'star',
    prims: ['Card', 'Avatar', 'Badge'],
    variants: ['default'],
  },
  {
    cat: 'Marketing',
    key: 'cta',
    name: 'CTA Band',
    preview: 'cta',
    icon: 'send',
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

/** Count of blocks in a category, or the whole catalogue for the `'all'` sentinel. */
export function countInCat(cat: string): number {
  return cat === 'all' ? BLOCKS.length : BLOCKS.filter((b) => b.cat === cat).length;
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
    concept: 'A landing page hero: grab attention in under 2s and push toward the CTA.',
    primitives: ['Badge', 'Button', 'Avatar', 'Separator'],
    composition: [
      'Announcement Badge + a pair of Buttons (primary / outline) over an animated gradient background',
      'Avatar stack + caption as social proof',
      'Optional Separator before a logo bar',
    ],
    structure:
      'Centred vertical stack: badge → title clamp(30–52px) → subtitle 52ch → 2 CTAs → social proof. Background = 2 blurred accent blobs drifting + panel veil.',
    responsive: [
      { bp: 'Mobile', txt: 'Stacked, title ~30px, full-width CTAs, 3 avatars max.' },
      { bp: 'Tablet', txt: 'Title ~40px, inline CTAs, 32 side padding.' },
      { bp: 'Desktop', txt: 'Title ~52px, content max 720px, amplified blobs.' },
    ],
    choreography:
      'Signature reveal: on mount, badge → title → subtitle → CTA → social proof rise 18px with a fade (smooth spring, 80ms stagger). The blobs drift on a loop. Primary CTA: snappy micro-lift on hover.',
    fallback: 'Opacity fade only (22ms stagger), blobs frozen, no translate or scale.',
    variants: ['align: center | left', 'withSocialProof: bool', 'blobs: 1–3', 'themed accent'],
  },
  'hero-terminal': {
    concept:
      'A developer-first hero: product pitch on the left, a decorative terminal on the right showing the install command — speak to devs with proof, not promises.',
    primitives: ['Badge', 'Button', 'block-motion'],
    composition: [
      'Eyebrow Badge (outline, mono) + title + subtitle + a pair of Buttons (default / outline)',
      'Decorative terminal: title bar with 3 dots, typed mono lines (comment / command / output) and a blinking cursor',
      'Terminal is `aria-hidden` — purely illustrative, it stays out of the text contrast',
    ],
    structure:
      'Centred 2-column grid (max-w-6xl, md:grid-cols-2, gap 12→16, py 20→28). Text column max-w-xl on the left; rounded-xl bg-card terminal card with shadow-2xl on the right.',
    responsive: [
      { bp: 'Mobile', txt: 'Stacked columns, text-4xl title, full-width CTAs.' },
      { bp: 'Tablet', txt: '≥ sm: text-5xl title, CTAs go inline.' },
      { bp: 'Desktop', txt: '≥ md: 2 columns side by side, terminal on the right.' },
    ],
    choreography:
      'Text column: cascading reveal (eyebrow → title → subtitle → CTA, 12px lift, smooth spring, 60ms stagger, 40ms delay). The terminal drifts separately (y 24→0, gentle spring, 150ms delay). Cursor pulses continuously.',
    fallback: 'Opacity fade only via MotionProvider, no translate (prefers-reduced-motion).',
    variants: [
      'eyebrow?',
      'lines[] (command | comment | output)',
      'terminalTitle',
      'primary / secondaryAction',
    ],
  },
  'hero-fintech': {
    concept:
      'A trust-focused fintech hero: reassuring copy on the left, an account card "resting" on the right with a balance in tabular figures and a strip of guarantees. The neutrals carry everything, the accent underlines only security.',
    primitives: ['Badge', 'Button', 'block-motion'],
    composition: [
      'Secondary Badge + shield icon as eyebrow, title, subtitle, a pair of Buttons, an assurance line with a padlock',
      'Decorative account panel: masked-number card + accent glow, tabular balance, a divided strip of 3 metrics',
      'Panel is `aria-hidden` — decorative, out of the text contrast',
    ],
    structure:
      'Asymmetric grid (max-w-6xl, md:grid-cols-[1.1fr_0.9fr], gap 12→16, py 20→28). rounded-3xl bg-card panel holding a rounded-2xl secondary card and a divide-x metrics grid.',
    responsive: [
      { bp: 'Mobile', txt: 'Stacked, text-4xl title, full-width CTAs, panel below the copy.' },
      { bp: 'Tablet', txt: '≥ sm: text-5xl title, inline CTAs, assurance visible.' },
      { bp: 'Desktop', txt: '≥ md: 2 columns 1.1/0.9, account panel on the right.' },
    ],
    choreography:
      'Cascading copy (eyebrow → title → subtitle → CTA → assurance, 12px lift, smooth spring, 60ms stagger). The panel drifts separately (y 24→0, gentle spring, 150ms delay).',
    fallback: 'Opacity fade only via MotionProvider, no translate (prefers-reduced-motion).',
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
      'A creative-agency hero: an oversized title that spills past the grid, left-aligned, with a quiet meta rail that breaks the symmetry. The boldness comes from scale and whitespace, not colour.',
    primitives: ['Button', 'block-motion'],
    composition: [
      'Tracked uppercase eyebrow preceded by a decorative rule (aria-hidden)',
      'Giant title (up to text-8xl, max-w-14ch, break-words) that overflows',
      'Bottom row: subtitle + arrow CTA on the left, meta rail (dl divide-y) on the right',
    ],
    structure:
      'Single column max-w-6xl (py 20→28). Title leading 0.95→0.9, tracking -0.04em. Bottom row in a md:grid-cols-[1.4fr_0.6fr] grid aligned to the bottom; meta rail bordered on top.',
    responsive: [
      { bp: 'Mobile', txt: 'text-5xl title, meta stacked below the copy.' },
      { bp: 'Tablet', txt: 'sm text-6xl → md text-7xl, meta rail on the right.' },
      { bp: 'Desktop', txt: '≥ lg: text-8xl title at full scale.' },
    ],
    choreography:
      'makeReveal(80ms stagger, 50ms delay): eyebrow → title → (subtitle + CTA) → meta rise 12px with a fade (smooth spring). The CTA arrow slides on hover.',
    fallback: 'Opacity fade only via MotionProvider, no translate (prefers-reduced-motion).',
    variants: ['eyebrow?', 'subtitle?', 'meta[] { label, value }', 'primaryAction'],
  },
  'pricing-toggle': {
    concept:
      'A pricing grid with a monthly/annual Switch that flips every price in one gesture; the figure swaps with a vertical fade without ever jostling the layout. A single plan carries the accent.',
    primitives: ['Switch', 'Button', 'block-motion'],
    composition: [
      'Centred header (h2 + subtitle) + toggle group: Monthly label, Switch, Annual label, discount pill',
      'Plan cards: h3, description, swapping tabular price, billing note, CTA, checked feature list',
      '`featured` plan: border + ring + accent shadow',
    ],
    structure:
      'max-w-6xl section (py 20→28), centred max-w-2xl header. grid-cols-1 grid that opens up by plan count (sm:2 / md:3 / lg:4). Equal-height rounded-2xl bg-card cards.',
    responsive: [
      { bp: 'Mobile', txt: 'One column, stacked cards, text-3xl title.' },
      { bp: 'Tablet', txt: '≥ sm/md: 2–3 columns by plan count.' },
      { bp: 'Desktop', txt: '≥ lg: up to 4 columns, text-4xl title.' },
    ],
    choreography:
      'Header + grid reveal (60ms stagger). On toggle, each price swaps via a snappy spring (y 8→0 with a fade, keyed on the value) — the tabular figures keep the layout fixed.',
    fallback:
      'The price transition falls back to a plain fade; fade-only entrance (prefers-reduced-motion).',
    variants: [
      'plans[] { monthlyPrice, annualPrice, featured, features[] }',
      'monthly / annualLabel',
      'annualHint?',
      'defaultAnnual',
    ],
  },
};

// French overlay for the spec prose. `primitives` and `variants` are
// language-neutral (they stay shared from SPECS); everything else has a French
// counterpart here. `resolveSpec` merges the two for the active locale.
type SpecText = Pick<
  Spec,
  'concept' | 'composition' | 'structure' | 'responsive' | 'choreography' | 'fallback'
>;

const SPECS_FR: Record<string, SpecText> = {
  hero: {
    concept:
      'Section d’accroche d’une landing : capter l’attention en moins de 2s et pousser vers le CTA.',
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
  },
  'hero-terminal': {
    concept:
      'Hero developer-first : accroche produit à gauche, terminal décoratif à droite qui montre la commande d’install — parler aux devs par la preuve, pas la promesse.',
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
  },
  'hero-fintech': {
    concept:
      'Hero fintech tourné confiance : copie rassurante à gauche, carte de compte « posée » à droite avec un solde en chiffres tabulaires et une bande de garanties. Le neutre porte tout, l’accent ne souligne que la sécurité.',
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
  },
  'hero-agency': {
    concept:
      'Hero agence créative : titre démesuré qui déborde la grille, aligné à gauche, avec un rail de méta discret qui casse la symétrie. L’audace vient de l’échelle et du vide, pas de la couleur.',
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
  },
  'pricing-toggle': {
    concept:
      'Grille tarifaire avec un Switch mensuel/annuel qui bascule tous les prix d’un même geste ; le chiffre se remplace en fondu vertical sans jamais bousculer la mise en page. Un seul plan porte l’accent.',
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
  },
};

/** Resolve a block's spec in the active locale (English is the canonical fallback). */
export function resolveSpec(key: string, locale: Locale): Spec | undefined {
  const en = SPECS[key];
  if (!en || locale !== 'fr') return en;
  const fr = SPECS_FR[key];
  return fr ? { ...en, ...fr } : en;
}
