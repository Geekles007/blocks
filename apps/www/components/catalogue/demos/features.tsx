'use client';

import { Features } from '@/components/blocks/features';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import { type PreviewProps, headline, pick, svg } from './_shared';

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
    subtitle:
      'Real, composable sections built on the ibirdui primitives — install one, keep the source.',
    items: [
      {
        title: 'One-command install',
        description:
          '“ibirdui add” copies the block and every primitive it composes straight into your repo.',
      },
      {
        title: 'Accessible by default',
        description:
          'Real landmarks, keyboard support and reduced-motion — tested to WCAG AA on every block.',
      },
      {
        title: 'Themed with your tokens',
        description:
          'Blocks read semantic HSL tokens, so they wear your brand in light or dark with zero edits.',
      },
    ],
  },
  fr: {
    eyebrow: 'Pourquoi elles changent',
    title: { lead: 'Tout ce qu’il faut pour ', accent: 'livrer', tail: '.' },
    subtitle:
      'De vraies sections composables bâties sur les primitives ibirdui — installes-en une, garde la source.',
    items: [
      {
        title: 'Installation en une commande',
        description:
          '« ibirdui add » copie le block et chaque primitive qu’il compose direct dans ton repo.',
      },
      {
        title: 'Accessible par défaut',
        description:
          'Landmarks réels, support clavier et reduced-motion — testés WCAG AA sur chaque block.',
      },
      {
        title: 'Thémé avec tes tokens',
        description:
          'Les blocks lisent des tokens HSL sémantiques : ta charte en clair ou sombre, sans une seule édition.',
      },
    ],
  },
} satisfies Record<Locale, unknown>;

export function FeaturesReal({ locale }: PreviewProps) {
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
