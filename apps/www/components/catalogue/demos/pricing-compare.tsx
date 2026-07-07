'use client';

import { PricingCompare } from '@/components/blocks/pricing-compare';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import { type PreviewProps, headline, pick } from './_shared';

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

export function PricingCompareReal({ locale }: PreviewProps) {
  const c = pick(locale, PRICING_COMPARE);
  return h(PricingCompare, {
    title: headline(c.title),
    subtitle: c.subtitle,
    plans: c.plans,
    rows: c.rows,
  });
}
