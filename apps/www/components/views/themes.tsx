'use client';

import { useRouter } from 'next/navigation';
import type * as React from 'react';
import { h } from '~/lib/h';
import { ROUTES } from '~/lib/routes';
import type { Tok } from '~/lib/tokens';
import { useUI } from '~/lib/ui-context';
import { PageContainer, PageHeader } from '../page';
import { Badge, Button, Icon, SectionLabel } from '../primitives';

// Swatch groups — each key is a real token on `Tok`, so the chips update live
// when the visitor flips the theme.
type Swatch = { key: keyof Tok; role: string };
const SURFACES: Swatch[] = [
  { key: 'bg', role: 'Fond de page' },
  { key: 'bg2', role: 'Fond secondaire' },
  { key: 'panel', role: 'Panneau / carte' },
  { key: 'panel2', role: 'Panneau surélevé' },
  { key: 'border', role: 'Bordure' },
  { key: 'borderStrong', role: 'Bordure marquée' },
];
const INK: Swatch[] = [
  { key: 'text', role: 'Texte principal' },
  { key: 'muted', role: 'Texte atténué' },
  { key: 'faint', role: 'Texte discret' },
];
const ACCENTS: Swatch[] = [
  { key: 'accent', role: 'Accent (--primary)' },
  { key: 'accentSoft', role: 'Accent — voile' },
  { key: 'accentSoft2', role: 'Accent — voile 2' },
  { key: 'accentRing', role: 'Halo de focus' },
  { key: 'accentFg', role: 'Texte sur accent' },
];

// The semantic CSS variables blocks actually consume — mirrored from the ibirdui
// theme. Listed so consumers know exactly what to define.
const CSS_TOKENS: { name: string; role: string }[] = [
  { name: '--background / --foreground', role: 'Surface de page et texte' },
  { name: '--card / --card-foreground', role: 'Cartes et panneaux' },
  { name: '--primary / --primary-foreground', role: 'L’accent lime et son texte' },
  { name: '--secondary / --secondary-foreground', role: 'Actions et surfaces secondaires' },
  { name: '--muted / --muted-foreground', role: 'Zones et textes atténués' },
  { name: '--accent / --accent-foreground', role: 'Survols et états subtils' },
  { name: '--border · --input · --ring', role: 'Bordures, champs et halo de focus' },
  { name: '--destructive · --success · --warning', role: 'États sémantiques' },
];

/** One colour chip + its token name, role and current value. */
function SwatchTile({ t, s }: { t: Tok; s: Swatch }) {
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
        s.role,
      ),
    ),
  );
}

function SwatchGrid({ t, items }: { t: Tok; items: Swatch[] }) {
  return h(
    'div',
    {
      style: {
        display: 'grid',
        gap: '10px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      },
    },
    ...items.map((s) => h(SwatchTile, { key: String(s.key), t, s })),
  );
}

export function Themes() {
  const { t, reduced, theme, toggleTheme } = useUI();
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
      kicker: 'Thèmes',
      title: [
        'Un thème, deux modes, ',
        h('span', { style: { color: t.accent } }, 'un accent'),
        '.',
      ],
      subtitle: [
        'Les blocks ne codent jamais une couleur en dur : ils lisent des tokens sémantiques en HSL. Le même block s’habille de votre charte en clair comme en sombre, et changer ',
        mono('--primary'),
        ' redéfinit tous les accents d’un coup.',
      ],
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
          theme === 'dark' ? 'Passer en clair' : 'Passer en sombre',
        ),
        h(
          'span',
          {
            style: { alignSelf: 'center', color: t.faint, fontSize: '13px' },
          },
          'Basculez et regardez les échantillons ci-dessous se recolorer.',
        ),
      ],
    }),

    // ── Surfaces ────────────────────────────────────────────────────────────
    h(
      'section',
      { style: { marginTop: '48px' } },
      h(SectionLabel, { t, style: { padding: '0 0 10px' } }, 'Surfaces & encre'),
      h2('La palette neutre'),
      lead(
        'Fonds, panneaux, bordures et niveaux de texte. Ces tokens portent toute la structure ; l’accent n’intervient qu’en touches.',
      ),
      h('div', { style: { height: '20px' } }),
      h(SwatchGrid, { t, items: SURFACES }),
      h('div', { style: { height: '10px' } }),
      h(SwatchGrid, { t, items: INK }),
    ),

    // ── Accent ──────────────────────────────────────────────────────────────
    h(
      'section',
      { style: { marginTop: '48px' } },
      h(SectionLabel, { t, style: { padding: '0 0 10px' } }, 'Accent'),
      h2('Un seul point d’attention'),
      lead(
        'L’accent par défaut est le lime ibirdui. Il porte les CTA, les états actifs et les halos de focus — dérivé en un voile et un anneau pour rester lisible partout.',
      ),
      h('div', { style: { height: '20px' } }),
      h(SwatchGrid, { t, items: ACCENTS }),
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
        h(Button, { t, reduced, rightIcon: 'arrow' }, 'Bouton primaire'),
        h(Badge, { t, tone: 'accent', dot: true }, 'Badge accent'),
        h(
          'a',
          {
            href: '#',
            style: { color: t.accent, fontSize: '14px', fontWeight: 600, textDecoration: 'none' },
          },
          'Lien accentué',
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
      h(SectionLabel, { t, style: { padding: '0 0 10px' } }, 'Tokens'),
      h2('Les variables que vous définissez'),
      lead(
        'Les blocks consomment ce jeu de variables sémantiques, calqué sur le thème ibirdui. Fournissez-les dans votre CSS (le www garde son propre miroir dans ',
        mono('app/globals.css'),
        ' et ',
        mono('lib/tokens.ts'),
        ') et tout s’aligne.',
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
        ...CSS_TOKENS.map((row, i) =>
          h(
            'div',
            {
              key: row.name,
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
              row.name,
            ),
            h('span', { style: { color: t.faint, fontSize: '13px' } }, row.role),
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
          'Prêt à brancher le thème ? Le guide détaille le preset Tailwind et les variables CSS à ajouter.',
        ),
        h(
          Button,
          { t, reduced, rightIcon: 'arrow', onClick: () => router.push(ROUTES.gettingStarted) },
          'Prise en main',
        ),
      ),
    ),
  );
}
