'use client';

import { h } from '~/lib/h';
import { Reveal } from '~/lib/motion';
import type { Tok } from '~/lib/tokens';
import { useUI } from '~/lib/ui-context';
import { Badge, SectionLabel } from '../primitives';

// Change categories, each with a distinct hue for its chip dot — so the kind of
// change reads at a glance down the timeline.
type Kind = 'Ajout' | 'Amélioration' | 'Correctif' | 'Infra' | 'Retrait';
const KIND_COLOR: Record<Kind, string> = {
  Ajout: '#22c55e',
  Amélioration: '#84cc16',
  Correctif: '#f59e0b',
  Infra: '#8b8b94',
  Retrait: '#f43f5e',
};

interface Change {
  kind: Kind;
  text: string;
}
interface Release {
  date: string; // ISO, drives the displayed French date
  tag: string; // short version label
  title: string;
  changes: Change[];
}

// Honest history, sourced from the git log + registry item versions. Newest first.
const RELEASES: Release[] = [
  {
    date: '2026-07-04',
    tag: 'v0.4',
    title: 'Morphing & prise en main',
    changes: [
      {
        kind: 'Ajout',
        text: 'Deux blocks Morphing installables : morph-button-card et morph-search-panel, avec tests d’accessibilité.',
      },
      {
        kind: 'Ajout',
        text: 'Page Prise en main (guide d’installation) et entrée « Guide » dans la navigation.',
      },
      { kind: 'Ajout', text: 'Catégorie Morphing dans le catalogue.' },
      { kind: 'Amélioration', text: 'Vitrine Morphing enrichie et accessibilité corrigée.' },
      {
        kind: 'Amélioration',
        text: 'Logo de marque blocks et catalogue resserré sur les blocks livrés.',
      },
      { kind: 'Correctif', text: 'Favicon visible sur tous les onglets de navigateur.' },
    ],
  },
  {
    date: '2026-07-03',
    tag: 'v0.3',
    title: 'Blocks & vitrine Morphing',
    changes: [
      { kind: 'Ajout', text: 'Famille Hero : hero, hero-terminal, hero-fintech, hero-agency.' },
      {
        kind: 'Ajout',
        text: 'Famille Pricing : pricing, pricing-toggle, pricing-single, pricing-compare.',
      },
      {
        kind: 'Ajout',
        text: 'Vitrine Morphing : des transitions shared-element expliquées et démontrées en direct.',
      },
      {
        kind: 'Retrait',
        text: 'Catalogue de primitives et nav Docs retirés — recentrage sur les blocks.',
      },
    ],
  },
  {
    date: '2026-07-02',
    tag: 'v0.2',
    title: 'Accent lime',
    changes: [
      {
        kind: 'Amélioration',
        text: 'Bascule de l’accent du site de l’indigo vers le lime ibirdui, aligné sur le thème des primitives.',
      },
    ],
  },
  {
    date: '2026-07-01',
    tag: 'v0.1',
    title: 'Fondations',
    changes: [
      {
        kind: 'Ajout',
        text: 'Portage des blocks depuis le monorepo ibirdui, en registry-as-code.',
      },
      { kind: 'Ajout', text: 'Catalogue de primitives Foundation exposé sur /primitives.' },
      {
        kind: 'Infra',
        text: 'Workflow GitHub Actions de déploiement FTP (lftp/FTPS, réutilisation de session TLS).',
      },
      {
        kind: 'Correctif',
        text: 'Les sources de primitives externes ne sont plus type-checkées dans ce repo.',
      },
    ],
  },
  {
    date: '2026-06-29',
    tag: 'v0.0',
    title: 'Genèse',
    changes: [
      {
        kind: 'Ajout',
        text: 'Scaffold du monorepo blocks (registry-as-code) : registry, www, CI.',
      },
    ],
  },
];

const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];
function frDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`;
}

/** A category chip: coloured dot + label, tinted to the change kind. */
function KindChip({ t, kind }: { t: Tok; kind: Kind }) {
  const c = KIND_COLOR[kind];
  return h(
    'span',
    {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        flex: 'none',
        padding: '3px 9px',
        borderRadius: '999px',
        background: `${c}1a`,
        border: `1px solid ${c}33`,
        font: "600 11px 'Geist',sans-serif",
        color: t.text,
        whiteSpace: 'nowrap',
      },
    },
    h('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: c } }),
    kind,
  );
}

export function Changelog() {
  const { t, reduced } = useUI();

  return h(
    'div',
    { style: { maxWidth: '820px', margin: '0 auto', width: '100%', padding: '52px 24px 64px' } },

    // ── Header ──────────────────────────────────────────────────────────────
    h(SectionLabel, { t, style: { padding: '0 0 10px' } }, 'Changelog'),
    h(
      'h1',
      {
        style: {
          margin: '0 0 14px',
          font: "700 clamp(30px,5vw,44px) 'Geist',sans-serif",
          letterSpacing: '-.02em',
          color: t.text,
          lineHeight: 1.1,
        },
      },
      'Ce qui a changé',
    ),
    h(
      'p',
      { style: { margin: 0, color: t.muted, fontSize: '16px', lineHeight: 1.6, maxWidth: '58ch' } },
      'Chaque livraison de blocks, amélioration et correctif — la plus récente en premier. Les blocks sont versionnés individuellement dans le registry ; cette page suit l’évolution du catalogue.',
    ),

    // ── Legend ────────────────────────────────────────────────────────────
    h(
      'div',
      { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '22px 0 6px' } },
      ...(Object.keys(KIND_COLOR) as Kind[]).map((k) => h(KindChip, { key: k, t, kind: k })),
    ),

    // ── Timeline ──────────────────────────────────────────────────────────
    h(
      Reveal,
      { reduced, trigger: 'view', stagger: 70, y: 16, style: { marginTop: '18px' } },
      ...RELEASES.map((r, i) =>
        h(
          'div',
          {
            key: r.date,
            style: {
              position: 'relative',
              paddingLeft: '26px',
              paddingBottom: i === RELEASES.length - 1 ? '0' : '30px',
              // Connector line running through the timeline dots.
              borderLeft:
                i === RELEASES.length - 1 ? '1px solid transparent' : `1px solid ${t.border}`,
              marginLeft: '4px',
            },
          },
          // Timeline node
          h('span', {
            style: {
              position: 'absolute',
              left: '-5px',
              top: '4px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: i === 0 ? t.accent : t.panel,
              border: `2px solid ${i === 0 ? t.accent : t.borderStrong}`,
              boxShadow: i === 0 ? `0 0 0 4px ${t.accentRing}` : 'none',
            },
          }),
          // Release header
          h(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } },
            h(
              'span',
              { style: { font: "650 12px 'Geist Mono',monospace", color: t.faint } },
              frDate(r.date),
            ),
            h(Badge, { t, tone: i === 0 ? 'accent' : 'neutral' }, r.tag),
          ),
          h(
            'h2',
            {
              style: {
                margin: '8px 0 14px',
                font: "700 20px 'Geist',sans-serif",
                letterSpacing: '-.01em',
                color: t.text,
              },
            },
            r.title,
          ),
          // Change list
          h(
            'ul',
            { style: { listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '10px' } },
            ...r.changes.map((c, ci) =>
              h(
                'li',
                {
                  key: ci,
                  style: {
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    background: t.bg2,
                    border: `1px solid ${t.border}`,
                    borderRadius: '11px',
                    padding: '11px 13px',
                  },
                },
                h(KindChip, { t, kind: c.kind }),
                h(
                  'span',
                  { style: { color: t.muted, fontSize: '14px', lineHeight: 1.55 } },
                  c.text,
                ),
              ),
            ),
          ),
        ),
      ),
    ),

    // ── Footnote ──────────────────────────────────────────────────────────
    h(
      'p',
      {
        style: {
          margin: '34px 0 0',
          paddingTop: '20px',
          borderTop: `1px solid ${t.border}`,
          color: t.faint,
          fontSize: '13px',
          lineHeight: 1.6,
        },
      },
      'Les blocks sont versionnés individuellement : les numéros détaillés vivent dans chaque meta.json du registry.',
    ),
  );
}
