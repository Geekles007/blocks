'use client';

// Live previews for shipped blocks. Each entry mounts the REAL ibirdui block
// synced into registry-preview — there are no design mockups here, so the
// catalogue only ever shows blocks that actually exist.
import { Hero } from '@/components/blocks/hero';
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
    title: h(
      React.Fragment,
      null,
      'Des blocks qui ',
      h(
        'span',
        { className: 'bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent' },
        'bougent',
      ),
      ' juste.',
    ),
    subtitle:
      'Compositions accessibles, animées au morphing, prêtes à coller. Construites sur les primitives ibirdui, orchestrées par une seule grammaire de mouvement.',
    primaryAction: { label: 'Parcourir les blocks', href: '#', icon: ArrowIcon },
    secondaryAction: { label: 'Copier le code', href: '#', icon: CopyIcon, iconPosition: 'start' },
    socialProof: {
      people: [
        { name: 'Ada Reyes' },
        { name: 'Tom Iverson' },
        { name: 'Lou Park' },
        { name: 'Kit Mara' },
      ],
      caption: 'Adopté par 2 000+ équipes produit',
    },
  });
}

const PREVIEWS: Record<string, (p: PreviewProps) => React.ReactElement> = {
  hero: HeroReal,
};

/** Render the live preview for a block key, or `null` if none is registered. */
export function renderPreview(key: string, props: PreviewProps): React.ReactElement | null {
  const Cmp = PREVIEWS[key];
  return Cmp ? h(Cmp, props) : null;
}
