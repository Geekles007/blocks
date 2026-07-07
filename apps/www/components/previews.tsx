'use client';

// Live previews for shipped blocks. Each entry mounts the REAL ibirdui block
// synced into registry-preview — there are no design mockups here, so the
// catalogue only ever shows blocks that actually exist. The demo copy is
// bilingual: each block reads its content from a locale-keyed object.
import { Cta } from '@/components/blocks/cta';
import { Faq } from '@/components/blocks/faq';
import { Features } from '@/components/blocks/features';
import { Footer } from '@/components/blocks/footer';
import { Hero } from '@/components/blocks/hero';
import { HeroAgency } from '@/components/blocks/hero-agency';
import { HeroFintech } from '@/components/blocks/hero-fintech';
import { HeroTerminal } from '@/components/blocks/hero-terminal';
import { Pricing } from '@/components/blocks/pricing';
import { PricingCompare } from '@/components/blocks/pricing-compare';
import { PricingSingle } from '@/components/blocks/pricing-single';
import { PricingToggle } from '@/components/blocks/pricing-toggle';
import { Testimonials } from '@/components/blocks/testimonials';
import * as React from 'react';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import type { Tok } from '~/lib/tokens';
import { BlocksLockup } from './logo';

export interface PreviewProps {
  t: Tok;
  reduced: boolean;
  v?: number;
  /** Active locale for the demo copy. Defaults to English. */
  locale?: Locale;
}

const svg = (...children: React.ReactNode[]) =>
  h(
    'svg',
    {
      width: 18,
      height: 18,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    ...children,
  );
const ArrowIcon = svg(h('path', { d: 'M5 12h14' }), h('path', { d: 'm13 6 6 6-6 6' }));
const CopyIcon = svg(
  h('rect', { x: 9, y: 9, width: 11, height: 11, rx: 2 }),
  h('path', { d: 'M5 15V5a2 2 0 0 1 2-2h10' }),
);

/** A word painted with the accent → violet gradient, for headline emphasis. */
const accentWord = (text: string) =>
  h(
    'span',
    { className: 'bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent' },
    text,
  );

/** Pick a locale's demo content (English is the fallback). */
const pick = <T,>(locale: Locale | undefined, content: Record<Locale, T>): T =>
  content[locale ?? 'en'];

const PEOPLE = [
  { name: 'Ada Reyes' },
  { name: 'Tom Iverson' },
  { name: 'Lou Park' },
  { name: 'Kit Mara' },
];

// A headline split into lead + accented word + tail, so the gradient emphasis
// survives translation.
interface Headline {
  lead: string;
  accent: string;
  tail: string;
}
const headline = (hl: Headline) => h(React.Fragment, null, hl.lead, accentWord(hl.accent), hl.tail);

const HERO = {
  en: {
    eyebrow: 'New · block-motion v1',
    title: { lead: 'Blocks that ', accent: 'move', tail: ' just right.' },
    subtitle:
      'Accessible, morph-animated compositions, ready to paste. Built on ibirdui primitives, orchestrated by a single motion grammar.',
    primary: 'Browse blocks',
    secondary: 'Copy the code',
    caption: 'Trusted by 2,000+ product teams',
  },
  fr: {
    eyebrow: 'Nouveau · block-motion v1',
    title: { lead: 'Des blocks qui ', accent: 'bougent', tail: ' juste.' },
    subtitle:
      'Compositions accessibles, animées au morphing, prêtes à coller. Construites sur les primitives ibirdui, orchestrées par une seule grammaire de mouvement.',
    primary: 'Parcourir les blocks',
    secondary: 'Copier le code',
    caption: 'Adopté par 2 000+ équipes produit',
  },
} satisfies Record<Locale, unknown>;

function HeroReal({ locale }: PreviewProps) {
  const c = pick(locale, HERO);
  return h(Hero, {
    eyebrow: h(
      React.Fragment,
      null,
      h('span', {
        className: 'mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle',
      }),
      c.eyebrow,
    ),
    title: headline(c.title),
    subtitle: c.subtitle,
    primaryAction: { label: c.primary, href: '#', icon: ArrowIcon },
    secondaryAction: { label: c.secondary, href: '#', icon: CopyIcon, iconPosition: 'start' },
    socialProof: { people: PEOPLE, caption: c.caption },
  });
}

const HERO_TERMINAL = {
  en: {
    title: { lead: 'Your components, one ', accent: 'command', tail: ' away.' },
    subtitle: 'Copy-paste blocks you own. No lock-in, no runtime.',
    primary: 'Read the docs',
  },
  fr: {
    title: { lead: 'Vos composants, à une ', accent: 'commande', tail: '.' },
    subtitle: 'Copiez-collez des blocks que vous possédez. Pas de lock-in, pas de runtime.',
    primary: 'Lire la doc',
  },
} satisfies Record<Locale, unknown>;

function HeroTerminalReal({ locale }: PreviewProps) {
  const c = pick(locale, HERO_TERMINAL);
  return h(HeroTerminal, {
    eyebrow: 'npx ibirdui',
    title: headline(c.title),
    subtitle: c.subtitle,
    primaryAction: { label: c.primary, href: '#' },
    secondaryAction: { label: 'GitHub', href: '#' },
  });
}

const HERO_FINTECH = {
  en: {
    eyebrow: 'FDIC insured',
    title: { lead: 'The bank that plays it ', accent: 'straight', tail: '.' },
    subtitle:
      'Zero hidden fees, insured deposits, end-to-end encryption. Open an account in five minutes.',
    primary: 'Open an account',
    secondary: 'See pricing',
    assurance: 'Deposits insured up to $100,000',
    cardHolder: 'Checking account',
    balance: { value: '$12,480.50', label: 'Available balance' },
    metrics: [
      { value: '$0', label: 'Hidden fees' },
      { value: '$100k', label: 'Deposits insured' },
      { value: 'AES-256', label: 'Encryption' },
    ],
  },
  fr: {
    eyebrow: 'Agréé ACPR',
    title: { lead: 'La banque qui joue ', accent: 'franc jeu', tail: '.' },
    subtitle:
      'Zéro frais caché, dépôts garantis, chiffrement de bout en bout. Ouvrez un compte en cinq minutes.',
    primary: 'Ouvrir un compte',
    secondary: 'Voir les tarifs',
    assurance: 'Dépôts garantis jusqu’à 100 000 €',
    cardHolder: 'Compte courant',
    balance: { value: '12 480,50 €', label: 'Solde disponible' },
    metrics: [
      { value: '0 €', label: 'Frais cachés' },
      { value: '100 k€', label: 'Dépôts garantis' },
      { value: 'AES-256', label: 'Chiffrement' },
    ],
  },
} satisfies Record<Locale, unknown>;

function HeroFintechReal({ locale }: PreviewProps) {
  const c = pick(locale, HERO_FINTECH);
  return h(HeroFintech, {
    eyebrow: c.eyebrow,
    title: headline(c.title),
    subtitle: c.subtitle,
    primaryAction: { label: c.primary, href: '#' },
    secondaryAction: { label: c.secondary, href: '#' },
    assurance: c.assurance,
    cardHolder: c.cardHolder,
    cardNumber: '•••• •••• •••• 4021',
    balance: c.balance,
    metrics: c.metrics,
  });
}

const HERO_AGENCY = {
  en: {
    eyebrow: 'Creative studio — Est. 2016',
    title: 'We give a voice to brands that dare.',
    subtitle:
      'Identity, digital products and motion for ambitious teams. Few clients, lots of attention.',
    primary: 'View work',
    meta: [
      { label: 'Services', value: 'Brand · Web · Motion' },
      { label: 'Based in', value: 'Paris, FR' },
      { label: 'Since', value: '2016' },
    ],
  },
  fr: {
    eyebrow: 'Studio créatif — Est. 2016',
    title: 'On donne une voix aux marques qui osent.',
    subtitle:
      'Identité, produits numériques et motion pour les équipes ambitieuses. Peu de clients, beaucoup d’attention.',
    primary: 'Voir les projets',
    meta: [
      { label: 'Services', value: 'Marque · Web · Motion' },
      { label: 'Basé à', value: 'Paris, FR' },
      { label: 'Depuis', value: '2016' },
    ],
  },
} satisfies Record<Locale, unknown>;

function HeroAgencyReal({ locale }: PreviewProps) {
  const c = pick(locale, HERO_AGENCY);
  return h(HeroAgency, {
    eyebrow: c.eyebrow,
    title: c.title,
    subtitle: c.subtitle,
    primaryAction: { label: c.primary, href: '#' },
    meta: c.meta,
  });
}

const PRICING = {
  en: {
    eyebrow: 'Pricing',
    title: { lead: 'A ', accent: 'simple', tail: ' price, no surprises.' },
    subtitle: 'Start free, scale when you’re ready.',
    plans: [
      {
        name: 'Starter',
        price: '$0',
        period: '/ mo',
        description: 'To get going.',
        features: ['1 project', '2 members', 'Basic analytics'],
        action: { label: 'Get started', href: '#' },
      },
      {
        name: 'Pro',
        price: '$19',
        period: '/ mo',
        featured: true,
        description: 'For growing teams.',
        features: [
          'Unlimited projects',
          'Unlimited members',
          'Priority support',
          'Advanced exports',
        ],
        action: { label: 'Choose Pro', href: '#' },
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For large organizations.',
        features: ['SSO & SAML', 'Guaranteed SLA', 'Dedicated account manager'],
        action: { label: 'Contact us' },
      },
    ],
  },
  fr: {
    eyebrow: 'Tarifs',
    title: { lead: 'Un prix ', accent: 'simple', tail: ', sans surprise.' },
    subtitle: 'Commencez gratuitement, passez à l’échelle quand vous êtes prêt.',
    plans: [
      {
        name: 'Starter',
        price: '0 €',
        period: '/ mois',
        description: 'Pour se lancer.',
        features: ['1 projet', '2 membres', 'Analytics de base'],
        action: { label: 'Commencer', href: '#' },
      },
      {
        name: 'Pro',
        price: '19 €',
        period: '/ mois',
        featured: true,
        description: 'Pour les équipes qui grandissent.',
        features: [
          'Projets illimités',
          'Membres illimités',
          'Support prioritaire',
          'Exports avancés',
        ],
        action: { label: 'Choisir Pro', href: '#' },
      },
      {
        name: 'Entreprise',
        price: 'Sur mesure',
        description: 'Pour les grandes organisations.',
        features: ['SSO & SAML', 'SLA garanti', 'Account manager dédié'],
        action: { label: 'Nous contacter' },
      },
    ],
  },
} satisfies Record<Locale, unknown>;

function PricingReal({ locale }: PreviewProps) {
  const c = pick(locale, PRICING);
  return h(Pricing, {
    eyebrow: c.eyebrow,
    title: headline(c.title),
    subtitle: c.subtitle,
    plans: c.plans,
  });
}

const PRICING_TOGGLE = {
  en: {
    title: { lead: 'Pay monthly or ', accent: 'yearly', tail: '.' },
    subtitle: 'Two months free on annual billing.',
    annualHint: '−20%',
    plans: [
      {
        name: 'Personal',
        monthlyPrice: '$9',
        annualPrice: '$7',
        description: 'For individual use.',
        features: ['3 projects', 'Basic analytics'],
        action: { label: 'Choose', href: '#' },
      },
      {
        name: 'Pro',
        monthlyPrice: '$19',
        annualPrice: '$15',
        featured: true,
        description: 'The team favorite.',
        features: ['Unlimited projects', 'Priority support', 'Advanced exports'],
        action: { label: 'Choose Pro', href: '#' },
      },
      {
        name: 'Business',
        monthlyPrice: '$49',
        annualPrice: '$39',
        description: 'For organizations.',
        features: ['SSO & SAML', 'Advanced roles', 'Guaranteed SLA'],
        action: { label: 'Choose', href: '#' },
      },
    ],
  },
  fr: {
    title: { lead: 'Payez au mois ou à ', accent: 'l’année', tail: '.' },
    subtitle: 'Deux mois offerts sur la facturation annuelle.',
    annualHint: '−20 %',
    plans: [
      {
        name: 'Perso',
        monthlyPrice: '9 €',
        annualPrice: '7 €',
        description: 'Pour un usage individuel.',
        features: ['3 projets', 'Analytics de base'],
        action: { label: 'Choisir', href: '#' },
      },
      {
        name: 'Pro',
        monthlyPrice: '19 €',
        annualPrice: '15 €',
        featured: true,
        description: 'Le choix des équipes.',
        features: ['Projets illimités', 'Support prioritaire', 'Exports avancés'],
        action: { label: 'Choisir Pro', href: '#' },
      },
      {
        name: 'Business',
        monthlyPrice: '49 €',
        annualPrice: '39 €',
        description: 'Pour les organisations.',
        features: ['SSO & SAML', 'Rôles avancés', 'SLA garanti'],
        action: { label: 'Choisir', href: '#' },
      },
    ],
  },
} satisfies Record<Locale, unknown>;

function PricingToggleReal({ locale }: PreviewProps) {
  const c = pick(locale, PRICING_TOGGLE);
  return h(PricingToggle, {
    title: headline(c.title),
    subtitle: c.subtitle,
    annualHint: c.annualHint,
    plans: c.plans,
  });
}

const PRICING_SINGLE = {
  en: {
    eyebrow: 'Launch offer',
    title: { lead: 'One price, ', accent: 'all included', tail: '.' },
    subtitle: 'Pay once, keep it forever.',
    planName: 'Lifetime license',
    price: '$199',
    period: 'one-time payment',
    features: [
      'Lifetime updates',
      'Email support',
      'Commercial license',
      'Unlimited projects',
      'Source code included',
      'No subscription',
    ],
    primary: 'Buy now',
    note: '30-day money-back guarantee.',
  },
  fr: {
    eyebrow: 'Offre de lancement',
    title: { lead: 'Un seul prix, ', accent: 'tout compris', tail: '.' },
    subtitle: 'Payez une fois, gardez-le pour toujours.',
    planName: 'Licence à vie',
    price: '199 €',
    period: 'paiement unique',
    features: [
      'Mises à jour à vie',
      'Support par e-mail',
      'Licence commerciale',
      'Projets illimités',
      'Code source inclus',
      'Sans abonnement',
    ],
    primary: 'Acheter maintenant',
    note: 'Garantie 30 jours satisfait ou remboursé.',
  },
} satisfies Record<Locale, unknown>;

function PricingSingleReal({ locale }: PreviewProps) {
  const c = pick(locale, PRICING_SINGLE);
  return h(PricingSingle, {
    eyebrow: c.eyebrow,
    title: headline(c.title),
    subtitle: c.subtitle,
    planName: c.planName,
    price: c.price,
    period: c.period,
    features: c.features,
    primaryAction: { label: c.primary, href: '#' },
    note: c.note,
  });
}

const PRICING_COMPARE = {
  en: {
    title: { lead: 'Compare ', accent: 'plans', tail: '.' },
    subtitle: 'Everything, line by line, so you can choose with confidence.',
    plans: [
      { name: 'Starter', price: '$0', period: '/ mo', action: { label: 'Get started', href: '#' } },
      {
        name: 'Pro',
        price: '$19',
        period: '/ mo',
        featured: true,
        action: { label: 'Choose Pro', href: '#' },
      },
      { name: 'Enterprise', price: 'Custom', action: { label: 'Contact us' } },
    ],
    rows: [
      { label: 'Projects', values: ['1', 'Unlimited', 'Unlimited'] },
      { label: 'Members', values: ['2', '10', 'Unlimited'] },
      { label: 'Storage', values: ['1 GB', '50 GB', '1 TB'] },
      { label: 'Priority support', values: [false, true, true] },
      { label: 'SSO & SAML', values: [false, false, true] },
      { label: 'Guaranteed SLA', values: [false, false, true] },
    ],
  },
  fr: {
    title: { lead: 'Comparez ', accent: 'les offres', tail: '.' },
    subtitle: 'Tout, ligne par ligne, pour choisir en confiance.',
    plans: [
      {
        name: 'Starter',
        price: '0 €',
        period: '/ mois',
        action: { label: 'Commencer', href: '#' },
      },
      {
        name: 'Pro',
        price: '19 €',
        period: '/ mois',
        featured: true,
        action: { label: 'Choisir Pro', href: '#' },
      },
      { name: 'Entreprise', price: 'Sur mesure', action: { label: 'Nous contacter' } },
    ],
    rows: [
      { label: 'Projets', values: ['1', 'Illimité', 'Illimité'] },
      { label: 'Membres', values: ['2', '10', 'Illimité'] },
      { label: 'Stockage', values: ['1 Go', '50 Go', '1 To'] },
      { label: 'Support prioritaire', values: [false, true, true] },
      { label: 'SSO & SAML', values: [false, false, true] },
      { label: 'SLA garanti', values: [false, false, true] },
    ],
  },
} satisfies Record<Locale, unknown>;

function PricingCompareReal({ locale }: PreviewProps) {
  const c = pick(locale, PRICING_COMPARE);
  return h(PricingCompare, {
    title: headline(c.title),
    subtitle: c.subtitle,
    plans: c.plans,
    rows: c.rows,
  });
}

// ── Features ────────────────────────────────────────────────────────────────
const BoltIcon = svg(h('path', { d: 'M13 2 3 14h7l-1 8 10-12h-7l1-8z' }));
const ShieldIcon = svg(h('path', { d: 'M12 3l7 3v5c0 4.4-3 7.3-7 8-4-.7-7-3.6-7-8V6z' }));
const SwatchIcon = svg(
  h('circle', { cx: 12, cy: 12, r: 3 }),
  h('path', {
    d: 'M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4',
  }),
);
const FEATURE_ICONS = [BoltIcon, ShieldIcon, SwatchIcon];

const FEATURES = {
  en: {
    eyebrow: 'Why teams switch',
    title: { lead: 'Everything you need to ', accent: 'ship', tail: '.' },
    subtitle: 'Composed on the ibirdui primitives — accessible, themable and animated by default.',
    items: [
      {
        title: 'Fast by default',
        description: 'No runtime and no lock-in — copy the source, own it forever.',
      },
      {
        title: 'Themable',
        description: 'Every block reads your semantic tokens, in light or dark.',
      },
      {
        title: 'Accessible',
        description: 'AA-tested, keyboard-ready, and it respects reduced motion.',
      },
    ],
  },
  fr: {
    eyebrow: 'Pourquoi elles changent',
    title: { lead: 'Tout ce qu’il faut pour ', accent: 'livrer', tail: '.' },
    subtitle: 'Composé sur les primitives ibirdui — accessible, thémable et animé par défaut.',
    items: [
      {
        title: 'Rapide par défaut',
        description: 'Pas de runtime ni de lock-in — copie la source, elle est à toi.',
      },
      {
        title: 'Thémable',
        description: 'Chaque block lit tes tokens sémantiques, en clair ou en sombre.',
      },
      {
        title: 'Accessible',
        description: 'Testé AA, prêt au clavier, et respecte le reduced-motion.',
      },
    ],
  },
} satisfies Record<Locale, unknown>;

function FeaturesReal({ locale }: PreviewProps) {
  const c = pick(locale, FEATURES);
  return h(Features, {
    eyebrow: c.eyebrow,
    title: headline(c.title),
    subtitle: c.subtitle,
    columns: 3,
    features: c.items.map((it, i) => ({
      id: String(i),
      icon: FEATURE_ICONS[i],
      title: it.title,
      description: it.description,
    })),
  });
}

// ── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = {
  en: {
    eyebrow: 'Social proof',
    title: { lead: 'Loved by ', accent: 'product teams', tail: '.' },
    subtitle: 'Teams of every size ship their marketing and app UI faster with ibirdui blocks.',
    items: [
      {
        quote: '“We shipped our whole marketing site in a weekend. The blocks just drop in.”',
        role: 'Head of Design, Northwind',
        rating: 5,
      },
      {
        quote: '“Accessibility is handled for us — keyboard, focus, reduced motion, all of it.”',
        role: 'Staff Engineer, Lumen',
        rating: 5,
      },
      {
        quote: '“One command and I own the source. No runtime, no lock-in, no surprises.”',
        role: 'Founder, Parcel',
        rating: 5,
      },
    ],
  },
  fr: {
    eyebrow: 'Preuve sociale',
    title: { lead: 'Adoré par les ', accent: 'équipes produit', tail: '.' },
    subtitle:
      'Des équipes de toute taille livrent leur UI marketing et app plus vite avec ibirdui.',
    items: [
      {
        quote: '« On a livré tout notre site en un week-end. Les blocks s’intègrent tout seuls. »',
        role: 'Head of Design, Northwind',
        rating: 5,
      },
      {
        quote: '« L’accessibilité est gérée pour nous — clavier, focus, reduced-motion, tout. »',
        role: 'Staff Engineer, Lumen',
        rating: 5,
      },
      {
        quote: '« Une commande et je possède la source. Pas de runtime, pas de lock-in. »',
        role: 'Founder, Parcel',
        rating: 5,
      },
    ],
  },
} satisfies Record<Locale, unknown>;

function TestimonialsReal({ locale }: PreviewProps) {
  const c = pick(locale, TESTIMONIALS);
  const names = ['Ada Reyes', 'Tom Iverson', 'Lou Park'];
  return h(Testimonials, {
    eyebrow: c.eyebrow,
    title: headline(c.title),
    subtitle: c.subtitle,
    columns: 3,
    testimonials: c.items.map((it, i) => ({
      id: String(i),
      quote: it.quote,
      rating: it.rating,
      author: { name: names[i] ?? 'Anon', role: it.role },
    })),
  });
}

// ── CTA band ─────────────────────────────────────────────────────────────────
const CTA = {
  en: {
    eyebrow: 'Start today',
    title: 'Ready to ship faster?',
    subtitle: 'Copy your first block in under a minute — accessible, animated, and yours to keep.',
    primary: 'Get started',
    secondary: 'Browse blocks',
  },
  fr: {
    eyebrow: 'Commence aujourd’hui',
    title: 'Prêt à livrer plus vite ?',
    subtitle: 'Copie ton premier block en moins d’une minute — accessible, animé, et à toi.',
    primary: 'Commencer',
    secondary: 'Parcourir les blocks',
  },
} satisfies Record<Locale, unknown>;

function CtaReal({ locale }: PreviewProps) {
  const c = pick(locale, CTA);
  return h(Cta, {
    eyebrow: c.eyebrow,
    title: c.title,
    subtitle: c.subtitle,
    primaryAction: { label: c.primary, href: '#', icon: ArrowIcon },
    secondaryAction: { label: c.secondary, href: '#' },
  });
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ = {
  en: {
    eyebrow: 'Support',
    title: 'Frequently asked questions',
    subtitle: 'Everything you might want to know before you copy your first block.',
    items: [
      {
        question: 'Do I own the code?',
        answer:
          'Yes. One command copies the block and every primitive it composes into your repo — you keep and edit the source, with no runtime dependency.',
      },
      {
        question: 'Is it accessible out of the box?',
        answer:
          'Every block is AA-tested: real landmarks and headings, keyboard support, and prefers-reduced-motion respected.',
      },
      {
        question: 'Can I use my own theme?',
        answer:
          'Blocks read semantic HSL tokens, so they wear your brand in light or dark by changing a few CSS variables — no block edits needed.',
      },
      {
        question: 'How do updates work?',
        answer:
          'Blocks are versioned individually in the registry; re-run the add command to pull a newer version whenever you want.',
      },
    ],
  },
  fr: {
    eyebrow: 'Support',
    title: 'Questions fréquentes',
    subtitle: 'Tout ce que tu peux vouloir savoir avant de copier ton premier block.',
    items: [
      {
        question: 'Est-ce que je possède le code ?',
        answer:
          'Oui. Une commande copie le block et chaque primitive qu’il compose dans ton repo — tu gardes et édites la source, sans dépendance runtime.',
      },
      {
        question: 'Est-ce accessible d’emblée ?',
        answer:
          'Chaque block est testé AA : landmarks et titres réels, support clavier, et prefers-reduced-motion respecté.',
      },
      {
        question: 'Puis-je utiliser mon propre thème ?',
        answer:
          'Les blocks lisent des tokens HSL sémantiques : ils s’habillent de ta charte en clair ou sombre en changeant quelques variables CSS, sans toucher au block.',
      },
      {
        question: 'Comment marchent les mises à jour ?',
        answer:
          'Les blocks sont versionnés individuellement dans le registre ; relance la commande add pour récupérer une version plus récente.',
      },
    ],
  },
} satisfies Record<Locale, unknown>;

function FaqReal({ locale }: PreviewProps) {
  const c = pick(locale, FAQ);
  return h(Faq, {
    eyebrow: c.eyebrow,
    title: c.title,
    subtitle: c.subtitle,
    items: c.items.map((it, i) => ({ id: String(i), question: it.question, answer: it.answer })),
  });
}

// ── Footer ───────────────────────────────────────────────────────────────────
const socialSvg = (d: string) =>
  h(
    'svg',
    { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true },
    h('path', { d }),
  );
const GithubIcon = socialSvg(
  'M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.71 1.03 1.62 1.03 2.74 0 3.92-2.34 4.79-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.48A10.2 10.2 0 0 0 22 12.2C22 6.58 17.52 2 12 2z',
);
const XIcon = socialSvg(
  'M18.9 2H22l-7.5 8.57L23 22h-6.8l-5.32-6.96L4.8 22H1.66l8.03-9.17L1 2h6.98l4.8 6.36L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z',
);

const FOOTER = {
  en: {
    description:
      'Blocks you own, built on the ibirdui primitives. Copy one command, keep the code.',
    columns: [
      {
        title: 'Product',
        links: ['Catalogue', 'Morphing', 'Templates', 'Changelog'],
      },
      { title: 'Resources', links: ['Guide', 'Themes', 'block-motion'] },
      { title: 'Company', links: ['About', 'Blog', 'Careers'] },
    ],
    copyright: '© 2025 ibirdui — MIT licensed',
    legal: ['Privacy', 'Terms'],
  },
  fr: {
    description:
      'Des blocks que tu possèdes, sur les primitives ibirdui. Une commande, garde le code.',
    columns: [
      { title: 'Produit', links: ['Catalogue', 'Morphing', 'Templates', 'Changelog'] },
      { title: 'Ressources', links: ['Guide', 'Thèmes', 'block-motion'] },
      { title: 'Société', links: ['À propos', 'Blog', 'Carrières'] },
    ],
    copyright: '© 2025 ibirdui — licence MIT',
    legal: ['Confidentialité', 'Conditions'],
  },
} satisfies Record<Locale, unknown>;

function FooterReal({ t, locale }: PreviewProps) {
  const c = pick(locale, FOOTER);
  return h(Footer, {
    brand: h(BlocksLockup, { t, size: 24 }),
    description: c.description,
    columns: c.columns.map((col, i) => ({
      id: String(i),
      title: col.title,
      links: col.links.map((label) => ({ label, href: `#${label}` })),
    })),
    social: [
      { label: 'GitHub', href: '#github', icon: GithubIcon },
      { label: 'X', href: '#x', icon: XIcon },
    ],
    copyright: c.copyright,
    legal: c.legal.map((label) => ({ label, href: `#${label}` })),
  });
}

const PREVIEWS: Record<string, (p: PreviewProps) => React.ReactElement> = {
  hero: HeroReal,
  'hero-terminal': HeroTerminalReal,
  'hero-fintech': HeroFintechReal,
  'hero-agency': HeroAgencyReal,
  features: FeaturesReal,
  testimonials: TestimonialsReal,
  cta: CtaReal,
  faq: FaqReal,
  footer: FooterReal,
  pricing: PricingReal,
  'pricing-toggle': PricingToggleReal,
  'pricing-single': PricingSingleReal,
  'pricing-compare': PricingCompareReal,
};

/** Render the live preview for a block key, or `null` if none is registered. */
export function renderPreview(key: string, props: PreviewProps): React.ReactElement | null {
  const Cmp = PREVIEWS[key];
  return Cmp ? h(Cmp, props) : null;
}
