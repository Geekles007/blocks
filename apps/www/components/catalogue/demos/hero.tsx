'use client';

import { Hero } from '@/components/blocks/hero';
import * as React from 'react';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import { ArrowIcon, CopyIcon, type PreviewProps, headline, pick } from './_shared';

const PEOPLE = [
  { name: 'Ada Reyes' },
  { name: 'Tom Iverson' },
  { name: 'Lou Park' },
  { name: 'Kit Mara' },
];

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

export function HeroReal({ locale }: PreviewProps) {
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
