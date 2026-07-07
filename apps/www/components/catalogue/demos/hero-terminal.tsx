'use client';

import { HeroTerminal } from '@/components/blocks/hero-terminal';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import { type PreviewProps, headline, pick } from './_shared';

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

export function HeroTerminalReal({ locale }: PreviewProps) {
  const c = pick(locale, HERO_TERMINAL);
  return h(HeroTerminal, {
    eyebrow: 'npx ibirdui',
    title: headline(c.title),
    subtitle: c.subtitle,
    primaryAction: { label: c.primary, href: '#' },
    secondaryAction: { label: 'GitHub', href: '#' },
  });
}
