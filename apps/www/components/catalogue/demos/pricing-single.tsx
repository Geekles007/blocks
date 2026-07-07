'use client';

import { PricingSingle } from '@/components/blocks/pricing-single';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import { type PreviewProps, headline, pick } from './_shared';

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

export function PricingSingleReal({ locale }: PreviewProps) {
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
