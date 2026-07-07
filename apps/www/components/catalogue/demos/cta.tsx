'use client';

import { Cta } from '@/components/blocks/cta';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import { ArrowIcon, type PreviewProps, pick } from './_shared';

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

export function CtaReal({ locale }: PreviewProps) {
  const c = pick(locale, CTA);
  return h(Cta, {
    eyebrow: c.eyebrow,
    title: c.title,
    subtitle: c.subtitle,
    primaryAction: { label: c.primary, href: '#', icon: ArrowIcon },
    secondaryAction: { label: c.secondary, href: '#' },
  });
}
