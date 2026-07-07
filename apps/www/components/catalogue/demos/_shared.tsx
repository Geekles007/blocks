'use client';

// Shared helpers for the per-block catalogue demos. Each demo file imports what
// it needs from here so the block-specific files stay focused on their content.
import * as React from 'react';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import type { Tok } from '~/lib/tokens';

export interface PreviewProps {
  t: Tok;
  reduced: boolean;
  v?: number;
  /** Active locale for the demo copy. Defaults to English. */
  locale?: Locale;
}

export const svg = (...children: React.ReactNode[]) =>
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
export const ArrowIcon = svg(h('path', { d: 'M5 12h14' }), h('path', { d: 'm13 6 6 6-6 6' }));
export const CopyIcon = svg(
  h('rect', { x: 9, y: 9, width: 11, height: 11, rx: 2 }),
  h('path', { d: 'M5 15V5a2 2 0 0 1 2-2h10' }),
);

/** A word painted with the accent → violet gradient, for headline emphasis. */
export const accentWord = (text: string) =>
  h(
    'span',
    { className: 'bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent' },
    text,
  );

/** Pick a locale's demo content (English is the fallback). */
export const pick = <T,>(locale: Locale | undefined, content: Record<Locale, T>): T =>
  content[locale ?? 'en'];

// A headline split into lead + accented word + tail, so the gradient emphasis
// survives translation.
export interface Headline {
  lead: string;
  accent: string;
  tail: string;
}
export const headline = (hl: Headline) =>
  h(React.Fragment, null, hl.lead, accentWord(hl.accent), hl.tail);
