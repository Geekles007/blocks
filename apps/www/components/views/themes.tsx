'use client';

import { useRouter } from 'next/navigation';
import type * as React from 'react';
import { h } from '~/lib/h';
import type { Messages } from '~/lib/i18n';
import { ROUTES } from '~/lib/routes';
import type { Tok } from '~/lib/tokens';
import { useUI } from '~/lib/ui-context';
import { PageContainer, PageHeader } from '../page';
import { Badge, Button, Icon, SectionLabel } from '../primitives';

// Swatch groups — each key is a real token on `Tok`, so the chips update live
// when the visitor flips the theme. The role label is resolved from the message
// dictionary (`m.themes.roles[key]`).
type Swatch = { key: keyof Tok };
const SURFACES: Swatch[] = [
  { key: 'bg' },
  { key: 'bg2' },
  { key: 'panel' },
  { key: 'panel2' },
  { key: 'border' },
  { key: 'borderStrong' },
];
const INK: Swatch[] = [{ key: 'text' }, { key: 'muted' }, { key: 'faint' }];
const ACCENTS: Swatch[] = [
  { key: 'accent' },
  { key: 'accentSoft' },
  { key: 'accentSoft2' },
  { key: 'accentRing' },
  { key: 'accentFg' },
];

// The semantic CSS variables blocks actually consume — mirrored from the ibirdui
// theme. The role for each is `m.themes.cssRoles[i]`.
const CSS_TOKEN_NAMES = [
  '--background / --foreground',
  '--card / --card-foreground',
  '--primary / --primary-foreground',
  '--secondary / --secondary-foreground',
  '--muted / --muted-foreground',
  '--accent / --accent-foreground',
  '--border · --input · --ring',
  '--destructive · --success · --warning',
];

/** One colour chip + its token name, role and current value. */
function SwatchTile({ t, m, s }: { t: Tok; m: Messages; s: Swatch }) {
  const value = t[s.key] as string;
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: t.bg2,
        border: `1px solid ${t.border}`,
        borderRadius: '12px',
        padding: '11px 12px',
      },
    },
    h('span', {
      style: {
        flex: 'none',
        width: '38px',
        height: '38px',
        borderRadius: '9px',
        background: value,
        border: `1px solid ${t.borderStrong}`,
        boxShadow: 'inset 0 0 0 1px rgba(127,127,127,.06)',
      },
    }),
    h(
      'div',
      { style: { minWidth: 0 } },
      h(
        'div',
        { style: { font: "650 12.5px 'Geist Mono',monospace", color: t.text } },
        String(s.key),
      ),
      h(
        'div',
        {
          style: {
            color: t.faint,
            fontSize: '11.5px',
            marginTop: '1px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        },
        m.themes.roles[String(s.key)] ?? String(s.key),
      ),
    ),
  );
}

function SwatchGrid({ t, m, items }: { t: Tok; m: Messages; items: Swatch[] }) {
  return h(
    'div',
    {
      style: {
        display: 'grid',
        gap: '10px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      },
    },
    ...items.map((s) => h(SwatchTile, { key: String(s.key), t, m, s })),
  );
}

export function Themes() {
  const { t, m, reduced, theme, toggleTheme } = useUI();
  const router = useRouter();

  const h2 = (title: string) =>
    h(
      'h2',
      {
        style: {
          margin: '0 0 8px',
          font: "700 23px 'Geist',sans-serif",
          letterSpacing: '-.02em',
          color: t.text,
        },
      },
      title,
    );
  const lead = (...children: React.ReactNode[]) =>
    h(
      'p',
      {
        style: { margin: 0, color: t.muted, fontSize: '15px', lineHeight: 1.65, maxWidth: '62ch' },
      },
      ...children,
    );
  const mono = (text: string) =>
    h(
      'code',
      { style: { fontFamily: "'Geist Mono',monospace", fontSize: '.9em', color: t.text } },
      text,
    );

  return h(
    PageContainer,
    { width: 'prose' },

    // ── Header ──────────────────────────────────────────────────────────────
    h(PageHeader, {
      t,
      reduced,
      kicker: m.themes.kicker,
      title: [
        m.themes.titleLead,
        h('span', { style: { color: t.accent } }, m.themes.titleAccent),
        m.themes.titleTail,
      ],
      subtitle: [m.themes.subtitleLead, mono('--primary'), m.themes.subtitleTail],
      actions: [
        h(
          Button,
          {
            t,
            reduced,
            variant: 'soft',
            leftIcon: theme === 'dark' ? 'sun' : 'moon',
            onClick: toggleTheme,
          },
          theme === 'dark' ? m.themes.toLight : m.themes.toDark,
        ),
        h(
          'span',
          {
            style: { alignSelf: 'center', color: t.faint, fontSize: '13px' },
          },
          m.themes.toggleHint,
        ),
      ],
    }),

    // ── Surfaces ────────────────────────────────────────────────────────────
    h(
      'section',
      { style: { marginTop: '48px' } },
      h(SectionLabel, { t, style: { padding: '0 0 10px' } }, m.themes.surfaces),
      h2(m.themes.surfacesTitle),
      lead(m.themes.surfacesLead),
      h('div', { style: { height: '20px' } }),
      h(SwatchGrid, { t, m, items: SURFACES }),
      h('div', { style: { height: '10px' } }),
      h(SwatchGrid, { t, m, items: INK }),
    ),

    // ── Accent ──────────────────────────────────────────────────────────────
    h(
      'section',
      { style: { marginTop: '48px' } },
      h(SectionLabel, { t, style: { padding: '0 0 10px' } }, m.themes.accent),
      h2(m.themes.accentTitle),
      lead(m.themes.accentLead),
      h('div', { style: { height: '20px' } }),
      h(SwatchGrid, { t, m, items: ACCENTS }),
      // Live accent sample
      h(
        'div',
        {
          style: {
            marginTop: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '14px',
            background: t.bg2,
            border: `1px solid ${t.border}`,
            borderRadius: '14px',
            padding: '18px 20px',
          },
        },
        h(Button, { t, reduced, rightIcon: 'arrow' }, m.themes.samplePrimary),
        h(Badge, { t, tone: 'accent', dot: true }, m.themes.sampleBadge),
        h(
          'a',
          {
            href: '#',
            style: { color: t.accent, fontSize: '14px', fontWeight: 600, textDecoration: 'none' },
          },
          m.themes.sampleLink,
        ),
        h(
          'span',
          {
            style: {
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: t.accentSoft,
              color: t.accent,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          },
          h(Icon, { name: 'sparkles', size: 17 }),
        ),
      ),
    ),

    // ── Tokens CSS ──────────────────────────────────────────────────────────
    h(
      'section',
      { style: { marginTop: '48px' } },
      h(SectionLabel, { t, style: { padding: '0 0 10px' } }, m.themes.tokens),
      h2(m.themes.tokensTitle),
      lead(
        m.themes.tokensLeadLead,
        mono('app/globals.css'),
        m.themes.tokensLeadMid,
        mono('lib/tokens.ts'),
        m.themes.tokensLeadTail,
      ),
      h(
        'div',
        {
          style: {
            marginTop: '20px',
            border: `1px solid ${t.border}`,
            borderRadius: '14px',
            overflow: 'hidden',
          },
        },
        ...CSS_TOKEN_NAMES.map((name, i) =>
          h(
            'div',
            {
              key: name,
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px 16px',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                padding: '13px 16px',
                background: i % 2 ? t.bg2 : t.panel,
                borderTop: i === 0 ? 'none' : `1px solid ${t.border}`,
              },
            },
            h(
              'code',
              {
                style: { fontFamily: "'Geist Mono',monospace", fontSize: '12.5px', color: t.text },
              },
              name,
            ),
            h('span', { style: { color: t.faint, fontSize: '13px' } }, m.themes.cssRoles[i] ?? ''),
          ),
        ),
      ),
    ),

    // ── Footer note ───────────────────────────────────────────────────────
    h(
      'section',
      { style: { marginTop: '44px' } },
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            background: t.accentSoft,
            border: `1px solid ${t.accentRing}`,
            borderRadius: '16px',
            padding: '20px 22px',
          },
        },
        h(
          'span',
          { style: { color: t.text, fontSize: '14.5px', fontWeight: 500, maxWidth: '54ch' } },
          m.themes.footerNote,
        ),
        h(
          Button,
          { t, reduced, rightIcon: 'arrow', onClick: () => router.push(ROUTES.gettingStarted) },
          m.nav.guide,
        ),
      ),
    ),
  );
}
