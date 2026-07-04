'use client';

import type * as React from 'react';
import { type CSS, h } from '~/lib/h';
import { Reveal } from '~/lib/motion';
import type { Tok } from '~/lib/tokens';
import { Icon, SectionLabel } from './primitives';

/**
 * Shared page-layout primitives. Every route view used to hand-roll its own
 * centred container (with a slightly different max-width + padding) and its own
 * masthead (kicker + h1 + subtitle, each with a subtly different type scale).
 * That duplication is what made the header look different from route to route.
 *
 * These two components own that responsibility instead, so a view only describes
 * *what* goes in the header, never *how* it is sized or spaced. Add a new page by
 * composing `PageContainer` + `PageHeader`; the type scale and rhythm come along
 * for free and stay identical across the site.
 */

// The canonical content widths. `prose` is the reading column for doc pages,
// `wide` the roomier column for showcase sections, `full` the catalogue grid.
export const PAGE_WIDTH = { prose: 820, wide: 960, full: 1200 } as const;
export type PageWidth = keyof typeof PAGE_WIDTH;

export function PageContainer({
  as = 'div',
  width = 'prose',
  pad = '52px 24px 64px',
  style,
  className,
  children,
}: {
  /** Element tag — use `'section'` for semantic content sections. */
  as?: 'div' | 'section';
  width?: PageWidth;
  /** Vertical/horizontal padding, or `false` to opt out (e.g. flush layouts). */
  pad?: string | false;
  style?: CSS;
  className?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  return h(
    as,
    {
      className,
      style: {
        maxWidth: `${PAGE_WIDTH[width]}px`,
        margin: '0 auto',
        width: '100%',
        ...(pad ? { padding: pad } : null),
        ...style,
      },
    },
    children,
  );
}

/**
 * The `$ npx ibirdui add …` copy button shared by the landing and block-motion
 * heroes (and anywhere else a one-liner install prompt belongs). Clicking copies
 * the command; the label is the command itself, monospaced.
 */
export function InstallCommand({
  t,
  cmd,
  onCopy,
  style,
}: {
  t: Tok;
  cmd: string;
  onCopy: (text: string, msg?: string) => void;
  style?: CSS;
}): React.ReactElement {
  return h(
    'button',
    {
      type: 'button',
      onClick: () => onCopy(cmd, 'Commande copiée'),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        background: t.panel,
        border: `1px solid ${t.border}`,
        borderRadius: '11px',
        padding: '11px 14px',
        cursor: 'pointer',
        fontFamily: "'Geist Mono',monospace",
        fontSize: '13px',
        color: t.text,
        ...style,
      },
    },
    h('span', { style: { color: t.faint } }, '$'),
    h('span', {}, cmd),
    h(
      'span',
      {
        style: {
          color: t.faint,
          display: 'flex',
          borderLeft: `1px solid ${t.border}`,
          paddingLeft: '12px',
        },
      },
      h(Icon, { name: 'copy', size: 15 }),
    ),
  );
}

// Spread array props into positional children so React doesn't demand keys on
// the pieces of a composed title/subtitle/actions list.
const toChildren = (node: React.ReactNode): React.ReactNode[] =>
  Array.isArray(node) ? node : [node];

// Two title scales: `md` for document mastheads, `lg` for landing/showcase heroes.
const TITLE_FONT = {
  md: "700 clamp(30px,5vw,44px)/1.1 'Geist',sans-serif",
  lg: "700 clamp(34px,6vw,56px)/1.04 'Geist',sans-serif",
} as const;

export function PageHeader({
  t,
  reduced = false,
  kicker,
  title,
  titleMaxWidth,
  subtitle,
  actions,
  children,
  align = 'left',
  size = 'md',
}: {
  t: Tok;
  reduced?: boolean;
  /** A string renders as the standard uppercase kicker; pass a node (e.g. a Badge) for anything else. */
  kicker?: React.ReactNode;
  title: React.ReactNode;
  /** Constrain the h1 measure (e.g. `'16ch'`) to control where it wraps. Defaults to `16ch` when centered. */
  titleMaxWidth?: string;
  subtitle?: React.ReactNode;
  /** Buttons/CTA row rendered under the subtitle. */
  actions?: React.ReactNode;
  /** Anything extra below the header proper (feature chips, legends…). */
  children?: React.ReactNode;
  align?: 'left' | 'center';
  size?: 'md' | 'lg';
}): React.ReactElement {
  const centered = align === 'center';
  const titleWidth = titleMaxWidth ?? (centered ? '16ch' : undefined);
  return h(
    Reveal,
    {
      reduced,
      stagger: 70,
      y: 16,
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: centered ? 'center' : 'flex-start',
        textAlign: centered ? 'center' : 'left',
        gap: '16px',
      },
    },
    kicker == null
      ? null
      : typeof kicker === 'string'
        ? h(SectionLabel, { t, style: { padding: 0 } }, kicker)
        : kicker,
    h(
      'h1',
      {
        style: {
          margin: 0,
          font: TITLE_FONT[size],
          letterSpacing: size === 'lg' ? '-.03em' : '-.02em',
          color: t.text,
          ...(titleWidth ? { maxWidth: titleWidth } : null),
        },
      },
      ...toChildren(title),
    ),
    subtitle == null
      ? null
      : h(
          'p',
          {
            style: {
              margin: 0,
              color: t.muted,
              fontSize: size === 'lg' ? 'clamp(15px,2.2vw,18px)' : '16px',
              lineHeight: 1.6,
              maxWidth: centered ? '56ch' : '60ch',
            },
          },
          ...toChildren(subtitle),
        ),
    actions == null
      ? null
      : h(
          'div',
          {
            style: {
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginTop: '4px',
              ...(centered ? { justifyContent: 'center' } : null),
            },
          },
          ...toChildren(actions),
        ),
    children ?? null,
  );
}
