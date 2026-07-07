'use client';

import { HeroAgency } from '@/components/blocks/hero-agency';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import { type PreviewProps, pick } from './_shared';

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

export function HeroAgencyReal({ locale }: PreviewProps) {
  const c = pick(locale, HERO_AGENCY);
  return h(HeroAgency, {
    eyebrow: c.eyebrow,
    title: c.title,
    subtitle: c.subtitle,
    primaryAction: { label: c.primary, href: '#' },
    meta: c.meta,
  });
}
