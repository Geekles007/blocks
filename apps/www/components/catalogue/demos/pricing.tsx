'use client';

import { Pricing } from '@/components/blocks/pricing';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import { type PreviewProps, headline, pick } from './_shared';

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

export function PricingReal({ locale }: PreviewProps) {
  const c = pick(locale, PRICING);
  return h(Pricing, {
    eyebrow: c.eyebrow,
    title: headline(c.title),
    subtitle: c.subtitle,
    plans: c.plans,
  });
}
