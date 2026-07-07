import type { Locale } from './i18n';

/**
 * Single source of truth for the /templates gallery. Templates are the tier above
 * blocks: a *complete page* composed of several blocks (which are themselves
 * composed of ibirdui primitives). The gallery grid and any future detail route
 * read from here, so a template is added by appending one entry — nothing else in
 * the page changes.
 *
 * Honesty rule (same as the morphing collection): only *shipped* templates carry
 * a `registryKey` (installable) and a real `blocks` composition. Roadmap entries
 * are name + description + shape only, and render as "coming soon" — no fabricated
 * install command or block list.
 */

/** Drives the wireframe silhouette shown in each card's browser frame. */
export type TemplateShape = 'landing' | 'pricing' | 'dashboard' | 'auth';

export interface Template {
  /** URL / registry key, stable and unique. */
  key: string;
  name: string;
  description: string;
  /** Catalogue category — must be one of TEMPLATE_CATS. */
  cat: string;
  /** Wireframe silhouette for the card preview. */
  shape: TemplateShape;
  /**
   * The block keys this page composes. Present only for shipped templates — the
   * exact composition is only pinned down once the page is built.
   */
  blocks?: string[];
  /**
   * The registry item this template ships as, at
   * blocks.ibird.dev/r/<registryKey>.json. Present only for shipped entries;
   * `ibirdui add` this to pull the page plus every block and primitive it
   * composes in one command. Roadmap entries omit it.
   */
  registryKey?: string;
}

// Only categories with at least one template are listed. Grows as templates land.
export const TEMPLATE_CATS = ['Marketing', 'Commerce', 'Application', 'Auth'] as const;

// The public roadmap. Everything is a roadmap entry for now (no registryKey), so
// the honesty rule holds: the gallery is populated and scannable, but nothing
// claims to be installable until its page is actually built.
export const TEMPLATES: Template[] = [
  {
    key: 'saas-landing',
    name: 'SaaS Landing',
    description: 'Hero, feature grid, social proof and pricing — a complete product landing.',
    cat: 'Marketing',
    shape: 'landing',
    registryKey: 'saas-landing',
    blocks: [
      'navbar',
      'hero',
      'features',
      'testimonials',
      'pricing-toggle',
      'faq',
      'cta',
      'footer',
    ],
  },
  {
    key: 'startup-launch',
    name: 'Startup Launch',
    description: 'A focused single-product launch page with a bold hero and a waitlist CTA.',
    cat: 'Marketing',
    shape: 'landing',
  },
  {
    key: 'agency-portfolio',
    name: 'Agency Portfolio',
    description: 'An oversized editorial hero over a project grid and a contact band.',
    cat: 'Marketing',
    shape: 'landing',
  },
  {
    key: 'pricing-page',
    name: 'Pricing Page',
    description: 'A monthly/annual pricing grid with a comparison, an FAQ and a conversion CTA.',
    cat: 'Commerce',
    shape: 'pricing',
  },
  {
    key: 'storefront',
    name: 'Storefront',
    description: 'A product catalogue grid with filters and a featured collection.',
    cat: 'Commerce',
    shape: 'dashboard',
  },
  {
    key: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'A sidebar app shell with KPI tiles, a chart panel and a data table.',
    cat: 'Application',
    shape: 'dashboard',
  },
  {
    key: 'settings',
    name: 'Settings',
    description: 'A settings layout with a section nav and grouped form panels.',
    cat: 'Application',
    shape: 'dashboard',
  },
  {
    key: 'sign-in',
    name: 'Sign In',
    description: 'A centred auth card with social login beside a branded panel.',
    cat: 'Auth',
    shape: 'auth',
  },
  {
    key: 'sign-up',
    name: 'Sign Up',
    description: 'A multi-field sign-up card with a benefits sidebar.',
    cat: 'Auth',
    shape: 'auth',
  },
];

/** Look up a template by its URL/data key. */
export function getTemplate(key: string): Template | undefined {
  return TEMPLATES.find((tpl) => tpl.key === key);
}

/** A shipped template is one that actually installs (has a registry key). */
export function isShipped(tpl: Template): boolean {
  return Boolean(tpl.registryKey);
}

/** Count of templates in a category, or the whole collection for `'all'`. */
export function countTemplates(cat: string): number {
  return cat === 'all' ? TEMPLATES.length : TEMPLATES.filter((tpl) => tpl.cat === cat).length;
}

// French overlay for the card prose. Keyed by template key; `templateText` merges
// it for the active locale (English is the canonical fallback). Categories and
// shapes are language-neutral and stay shared.
interface TemplateText {
  name: string;
  description: string;
}
const TEMPLATE_TEXT_FR: Record<string, TemplateText> = {
  'saas-landing': {
    name: 'Landing SaaS',
    description:
      'Hero, grille de features, preuve sociale et pricing — une landing produit complète.',
  },
  'startup-launch': {
    name: 'Lancement Startup',
    description: 'Une page de lancement mono-produit avec un hero franc et un CTA liste d’attente.',
  },
  'agency-portfolio': {
    name: 'Portfolio Agence',
    description:
      'Un hero éditorial démesuré au-dessus d’une grille de projets et d’une bande contact.',
  },
  'pricing-page': {
    name: 'Page Pricing',
    description: 'Une grille tarifaire mensuel/annuel avec comparatif, FAQ et CTA de conversion.',
  },
  storefront: {
    name: 'Boutique',
    description: 'Une grille catalogue produits avec filtres et une collection mise en avant.',
  },
  'analytics-dashboard': {
    name: 'Tableau de bord',
    description: 'Un shell d’app à sidebar avec tuiles KPI, panneau graphique et table de données.',
  },
  settings: {
    name: 'Réglages',
    description:
      'Une mise en page de réglages avec nav de sections et panneaux de formulaire groupés.',
  },
  'sign-in': {
    name: 'Connexion',
    description: 'Une carte d’auth centrée avec connexion sociale à côté d’un panneau de marque.',
  },
  'sign-up': {
    name: 'Inscription',
    description: 'Une carte d’inscription multi-champs avec une barre latérale d’avantages.',
  },
};

/** Resolve a template's prose in the active locale (English is the fallback). */
export function templateText(tpl: Template, locale: Locale): TemplateText {
  const base: TemplateText = { name: tpl.name, description: tpl.description };
  return locale === 'fr' ? (TEMPLATE_TEXT_FR[tpl.key] ?? base) : base;
}
