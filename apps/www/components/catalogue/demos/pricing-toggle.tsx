'use client';

import { PricingToggle } from '@/components/blocks/pricing-toggle';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import { type PreviewProps, headline, pick } from './_shared';

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

export function PricingToggleReal({ locale }: PreviewProps) {
  const c = pick(locale, PRICING_TOGGLE);
  return h(PricingToggle, {
    title: headline(c.title),
    subtitle: c.subtitle,
    annualHint: c.annualHint,
    plans: c.plans,
  });
}
