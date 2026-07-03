'use client';

// Live previews for shipped blocks. Each entry mounts the REAL ibirdui block
// synced into registry-preview — there are no design mockups here, so the
// catalogue only ever shows blocks that actually exist.
import { Hero } from '@/components/blocks/hero';
import { HeroAgency } from '@/components/blocks/hero-agency';
import { HeroFintech } from '@/components/blocks/hero-fintech';
import { HeroTerminal } from '@/components/blocks/hero-terminal';
import { Pricing } from '@/components/blocks/pricing';
import { PricingCompare } from '@/components/blocks/pricing-compare';
import { PricingSingle } from '@/components/blocks/pricing-single';
import { PricingToggle } from '@/components/blocks/pricing-toggle';
import * as React from 'react';
import { h } from '~/lib/h';
import type { Tok } from '~/lib/tokens';

export interface PreviewProps {
  t: Tok;
  reduced: boolean;
  v?: number;
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

const PEOPLE = [
  { name: 'Ada Reyes' },
  { name: 'Tom Iverson' },
  { name: 'Lou Park' },
  { name: 'Kit Mara' },
];

function HeroReal(_props: PreviewProps) {
  return h(Hero, {
    eyebrow: h(
      React.Fragment,
      null,
      h('span', {
        className: 'mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle',
      }),
      'Nouveau · block-motion v1',
    ),
    title: h(React.Fragment, null, 'Des blocks qui ', accentWord('bougent'), ' juste.'),
    subtitle:
      'Compositions accessibles, animées au morphing, prêtes à coller. Construites sur les primitives ibirdui, orchestrées par une seule grammaire de mouvement.',
    primaryAction: { label: 'Parcourir les blocks', href: '#', icon: ArrowIcon },
    secondaryAction: { label: 'Copier le code', href: '#', icon: CopyIcon, iconPosition: 'start' },
    socialProof: { people: PEOPLE, caption: 'Adopté par 2 000+ équipes produit' },
  });
}

function HeroTerminalReal(_props: PreviewProps) {
  return h(HeroTerminal, {
    eyebrow: 'npx ibirdui',
    title: h(React.Fragment, null, 'Vos composants, à une ', accentWord('commande'), '.'),
    subtitle: 'Copiez-collez des blocks que vous possédez. Pas de lock-in, pas de runtime.',
    primaryAction: { label: 'Lire la doc', href: '#' },
    secondaryAction: { label: 'GitHub', href: '#' },
  });
}

function HeroFintechReal(_props: PreviewProps) {
  return h(HeroFintech, {
    eyebrow: 'Agréé ACPR',
    title: h(React.Fragment, null, 'La banque qui joue ', accentWord('franc jeu'), '.'),
    subtitle:
      'Zéro frais caché, dépôts garantis, chiffrement de bout en bout. Ouvrez un compte en cinq minutes.',
    primaryAction: { label: 'Ouvrir un compte', href: '#' },
    secondaryAction: { label: 'Voir les tarifs', href: '#' },
    assurance: 'Dépôts garantis jusqu’à 100 000 €',
    cardHolder: 'Compte courant',
    cardNumber: '•••• •••• •••• 4021',
    balance: { value: '12 480,50 €', label: 'Solde disponible' },
    metrics: [
      { value: '0 €', label: 'Frais cachés' },
      { value: '100 k€', label: 'Dépôts garantis' },
      { value: 'AES-256', label: 'Chiffrement' },
    ],
  });
}

function HeroAgencyReal(_props: PreviewProps) {
  return h(HeroAgency, {
    eyebrow: 'Studio créatif — Est. 2016',
    title: 'On donne une voix aux marques qui osent.',
    subtitle:
      'Identité, produits numériques et motion pour les équipes ambitieuses. Peu de clients, beaucoup d’attention.',
    primaryAction: { label: 'Voir les projets', href: '#' },
    meta: [
      { label: 'Services', value: 'Marque · Web · Motion' },
      { label: 'Basé à', value: 'Paris, FR' },
      { label: 'Depuis', value: '2016' },
    ],
  });
}

function PricingReal(_props: PreviewProps) {
  return h(Pricing, {
    eyebrow: 'Tarifs',
    title: h(React.Fragment, null, 'Un prix ', accentWord('simple'), ', sans surprise.'),
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
  });
}

function PricingToggleReal(_props: PreviewProps) {
  return h(PricingToggle, {
    title: h(React.Fragment, null, 'Payez au mois ou à ', accentWord('l’année'), '.'),
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
  });
}

function PricingSingleReal(_props: PreviewProps) {
  return h(PricingSingle, {
    eyebrow: 'Offre de lancement',
    title: h(React.Fragment, null, 'Un seul prix, ', accentWord('tout compris'), '.'),
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
    primaryAction: { label: 'Acheter maintenant', href: '#' },
    note: 'Garantie 30 jours satisfait ou remboursé.',
  });
}

function PricingCompareReal(_props: PreviewProps) {
  return h(PricingCompare, {
    title: h(React.Fragment, null, 'Comparez ', accentWord('les offres'), '.'),
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
      {
        name: 'Entreprise',
        price: 'Sur mesure',
        action: { label: 'Nous contacter' },
      },
    ],
    rows: [
      { label: 'Projets', values: ['1', 'Illimité', 'Illimité'] },
      { label: 'Membres', values: ['2', '10', 'Illimité'] },
      { label: 'Stockage', values: ['1 Go', '50 Go', '1 To'] },
      { label: 'Support prioritaire', values: [false, true, true] },
      { label: 'SSO & SAML', values: [false, false, true] },
      { label: 'SLA garanti', values: [false, false, true] },
    ],
  });
}

const PREVIEWS: Record<string, (p: PreviewProps) => React.ReactElement> = {
  hero: HeroReal,
  'hero-terminal': HeroTerminalReal,
  'hero-fintech': HeroFintechReal,
  'hero-agency': HeroAgencyReal,
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
