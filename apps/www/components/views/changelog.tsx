'use client';

import { h } from '~/lib/h';
import type { Messages } from '~/lib/i18n';
import { Reveal } from '~/lib/motion';
import type { Tok } from '~/lib/tokens';
import { useUI } from '~/lib/ui-context';
import { PageContainer, PageHeader } from '../page';
import { Badge } from '../primitives';

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

/** A string in both locales. */
interface LS {
  en: string;
  fr: string;
}
interface Change {
  kind: Kind;
  text: LS;
}
interface Release {
  date: string; // ISO, drives the displayed localized date
  tag: string; // short version label
  title: LS;
  changes: Change[];
}

// Honest history, sourced from the git log + registry item versions. Newest first.
const RELEASES: Release[] = [
  {
    date: '2026-07-07',
    tag: 'v0.5',
    title: { en: 'Templates, morphing & i18n', fr: 'Templates, morphing & i18n' },
    changes: [
      {
        kind: 'Ajout',
        text: {
          en: 'saas-landing template — a full landing page composed from blocks (navbar, hero, features, testimonials, pricing, FAQ, CTA, footer).',
          fr: 'Template saas-landing — une landing page complète composée de blocks (navbar, hero, features, témoignages, pricing, FAQ, CTA, footer).',
        },
      },
      {
        kind: 'Ajout',
        text: {
          en: 'Five more Morphing blocks: FAB → Action Menu, KPI Widget → Dashboard, Calendar Day → Event, Message Bubble → Conversation, Mini Player → Full Player.',
          fr: 'Cinq blocks Morphing de plus : FAB → Menu d’actions, Widget KPI → Dashboard, Jour de calendrier → Événement, Bulle de message → Conversation, Mini-lecteur → Lecteur complet.',
        },
      },
      {
        kind: 'Ajout',
        text: {
          en: 'English/French i18n across the whole site.',
          fr: 'Internationalisation EN/FR sur tout le site.',
        },
      },
      {
        kind: 'Ajout',
        text: {
          en: 'One-command install for Morphing blocks, with an npm/pnpm/bun toggle.',
          fr: 'Installation en une commande des blocks Morphing, avec bascule npm/pnpm/bun.',
        },
      },
      {
        kind: 'Amélioration',
        text: {
          en: 'Fullscreen and truly responsive block previews, with per-block specs.',
          fr: 'Aperçus de blocks en plein écran et vraiment responsives, avec specs par block.',
        },
      },
      {
        kind: 'Amélioration',
        text: {
          en: 'The navbar mobile menu button now uses the ibirdui button styles, with themed hover and press states.',
          fr: 'Le bouton du menu mobile de la navbar utilise désormais les styles du bouton ibirdui, avec états hover et press thémés.',
        },
      },
      {
        kind: 'Correctif',
        text: {
          en: 'morph-fab-menu action rows are transparent in dark mode.',
          fr: 'Les lignes d’action de morph-fab-menu sont transparentes en mode sombre.',
        },
      },
    ],
  },
  {
    date: '2026-07-04',
    tag: 'v0.4',
    title: { en: 'Morphing & onboarding', fr: 'Morphing & prise en main' },
    changes: [
      {
        kind: 'Ajout',
        text: {
          en: 'Two installable Morphing blocks: morph-button-card and morph-search-panel, with accessibility tests.',
          fr: 'Deux blocks Morphing installables : morph-button-card et morph-search-panel, avec tests d’accessibilité.',
        },
      },
      {
        kind: 'Ajout',
        text: {
          en: 'Getting-started page (install guide) and a “Guide” entry in the navigation.',
          fr: 'Page Prise en main (guide d’installation) et entrée « Guide » dans la navigation.',
        },
      },
      {
        kind: 'Ajout',
        text: {
          en: 'Morphing category in the catalogue.',
          fr: 'Catégorie Morphing dans le catalogue.',
        },
      },
      {
        kind: 'Amélioration',
        text: {
          en: 'Richer Morphing showcase and fixed accessibility.',
          fr: 'Vitrine Morphing enrichie et accessibilité corrigée.',
        },
      },
      {
        kind: 'Amélioration',
        text: {
          en: 'blocks brand logo and catalogue tightened to shipped blocks.',
          fr: 'Logo de marque blocks et catalogue resserré sur les blocks livrés.',
        },
      },
      {
        kind: 'Correctif',
        text: {
          en: 'Favicon visible across all browser tabs.',
          fr: 'Favicon visible sur tous les onglets de navigateur.',
        },
      },
    ],
  },
  {
    date: '2026-07-03',
    tag: 'v0.3',
    title: { en: 'Blocks & Morphing showcase', fr: 'Blocks & vitrine Morphing' },
    changes: [
      {
        kind: 'Ajout',
        text: {
          en: 'Hero family: hero, hero-terminal, hero-fintech, hero-agency.',
          fr: 'Famille Hero : hero, hero-terminal, hero-fintech, hero-agency.',
        },
      },
      {
        kind: 'Ajout',
        text: {
          en: 'Pricing family: pricing, pricing-toggle, pricing-single, pricing-compare.',
          fr: 'Famille Pricing : pricing, pricing-toggle, pricing-single, pricing-compare.',
        },
      },
      {
        kind: 'Ajout',
        text: {
          en: 'Morphing showcase: shared-element transitions explained and demonstrated live.',
          fr: 'Vitrine Morphing : des transitions shared-element expliquées et démontrées en direct.',
        },
      },
      {
        kind: 'Retrait',
        text: {
          en: 'Primitives catalogue and Docs nav removed — refocused on blocks.',
          fr: 'Catalogue de primitives et nav Docs retirés — recentrage sur les blocks.',
        },
      },
    ],
  },
  {
    date: '2026-07-02',
    tag: 'v0.2',
    title: { en: 'Lime accent', fr: 'Accent lime' },
    changes: [
      {
        kind: 'Amélioration',
        text: {
          en: 'Switched the site accent from indigo to the ibirdui lime, aligned with the primitives’ theme.',
          fr: 'Bascule de l’accent du site de l’indigo vers le lime ibirdui, aligné sur le thème des primitives.',
        },
      },
    ],
  },
  {
    date: '2026-07-01',
    tag: 'v0.1',
    title: { en: 'Foundations', fr: 'Fondations' },
    changes: [
      {
        kind: 'Ajout',
        text: {
          en: 'Ported the blocks from the ibirdui monorepo, as registry-as-code.',
          fr: 'Portage des blocks depuis le monorepo ibirdui, en registry-as-code.',
        },
      },
      {
        kind: 'Ajout',
        text: {
          en: 'Foundation primitives catalogue exposed at /primitives.',
          fr: 'Catalogue de primitives Foundation exposé sur /primitives.',
        },
      },
      {
        kind: 'Infra',
        text: {
          en: 'GitHub Actions FTP deploy workflow (lftp/FTPS, TLS session reuse).',
          fr: 'Workflow GitHub Actions de déploiement FTP (lftp/FTPS, réutilisation de session TLS).',
        },
      },
      {
        kind: 'Correctif',
        text: {
          en: 'External primitive sources are no longer type-checked in this repo.',
          fr: 'Les sources de primitives externes ne sont plus type-checkées dans ce repo.',
        },
      },
    ],
  },
  {
    date: '2026-06-29',
    tag: 'v0.0',
    title: { en: 'Genesis', fr: 'Genèse' },
    changes: [
      {
        kind: 'Ajout',
        text: {
          en: 'Scaffolded the blocks monorepo (registry-as-code): registry, www, CI.',
          fr: 'Scaffold du monorepo blocks (registry-as-code) : registry, www, CI.',
        },
      },
    ],
  },
];

/** A category chip: coloured dot + label, tinted to the change kind. */
function KindChip({ t, m, kind }: { t: Tok; m: Messages; kind: Kind }) {
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
    m.changelog.kinds[kind],
  );
}

export function Changelog() {
  const { t, m, locale, reduced } = useUI();
  const fmtDate = (iso: string) => {
    const [y, mo, d] = iso.split('-').map(Number);
    return m.changelog.formatDate(d ?? 1, m.changelog.months[(mo ?? 1) - 1] ?? '', y ?? 0);
  };

  return h(
    PageContainer,
    { width: 'prose' },

    // ── Header ──────────────────────────────────────────────────────────────
    h(PageHeader, {
      t,
      reduced,
      kicker: m.changelog.kicker,
      title: m.changelog.title,
      subtitle: m.changelog.subtitle,
    }),

    // ── Legend ────────────────────────────────────────────────────────────
    h(
      'div',
      { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '22px 0 6px' } },
      ...(Object.keys(KIND_COLOR) as Kind[]).map((k) => h(KindChip, { key: k, t, m, kind: k })),
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
              fmtDate(r.date),
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
            r.title[locale],
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
                h(KindChip, { t, m, kind: c.kind }),
                h(
                  'span',
                  { style: { color: t.muted, fontSize: '14px', lineHeight: 1.55 } },
                  c.text[locale],
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
      m.changelog.footnote,
    ),
  );
}
