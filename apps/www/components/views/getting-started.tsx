'use client';

import Link from 'next/link';
import type * as React from 'react';
import { h } from '~/lib/h';
import { ROUTES } from '~/lib/routes';
import type { Tok } from '~/lib/tokens';
import { useUI } from '~/lib/ui-context';
import { Button, Icon, SectionLabel } from '../primitives';

/** A monospace command row with a copy button — mirrors the block-detail install box. */
function CommandRow({
  t,
  reduced,
  copy,
  cmd,
  label,
}: {
  t: Tok;
  reduced: boolean;
  copy: (text: string, msg?: string) => void;
  cmd: string;
  label: string;
}) {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: t.panel,
        border: `1px solid ${t.border}`,
        borderRadius: '11px',
        padding: '12px 14px',
      },
    },
    h(
      'span',
      {
        style: {
          font: "600 11px 'Geist',sans-serif",
          letterSpacing: '.05em',
          textTransform: 'uppercase',
          color: t.faint,
          flex: 'none',
        },
      },
      label,
    ),
    h(
      'code',
      {
        style: {
          flex: 1,
          fontFamily: "'Geist Mono',monospace",
          fontSize: '13px',
          color: t.text,
          overflow: 'auto',
          whiteSpace: 'nowrap',
        },
      },
      cmd,
    ),
    h(
      Button,
      {
        t,
        reduced,
        size: 'sm',
        variant: 'soft',
        leftIcon: 'copy',
        onClick: () => copy(cmd, 'Commande copiée'),
      },
      'Copier',
    ),
  );
}

/** A syntax-neutral code sample block. */
function CodeBlock({ t, code }: { t: Tok; code: string }) {
  return h(
    'div',
    {
      style: {
        background: t.panel,
        border: `1px solid ${t.border}`,
        borderRadius: '12px',
        overflow: 'hidden',
      },
    },
    h(
      'pre',
      {
        style: {
          margin: 0,
          padding: '18px 20px',
          overflow: 'auto',
          fontFamily: "'Geist Mono',monospace",
          fontSize: '13px',
          lineHeight: 1.7,
          color: t.text,
        },
      },
      code,
    ),
  );
}

/** A titled section with an eyebrow label. */
function Section(
  t: Tok,
  label: string,
  title: string,
  ...children: React.ReactNode[]
): React.ReactElement {
  return h(
    'section',
    { style: { marginTop: '46px' } },
    h(SectionLabel, { t, style: { padding: '0 0 8px' } }, label),
    h(
      'h2',
      {
        style: {
          margin: '0 0 14px',
          font: "650 22px 'Geist',sans-serif",
          letterSpacing: '-.01em',
          color: t.text,
        },
      },
      title,
    ),
    ...children,
  );
}

const p = (t: Tok, ...children: React.ReactNode[]) =>
  h(
    'p',
    { style: { margin: '0 0 12px', color: t.muted, fontSize: '14.5px', lineHeight: 1.65 } },
    ...children,
  );

const strong = (t: Tok, text: string) =>
  h('span', { style: { color: t.text, fontWeight: 600 } }, text);

const code = (t: Tok, text: string) =>
  h(
    'code',
    {
      style: {
        fontFamily: "'Geist Mono',monospace",
        fontSize: '12.5px',
        color: t.text,
        background: t.panel2,
        border: `1px solid ${t.border}`,
        borderRadius: '6px',
        padding: '1px 6px',
      },
    },
    text,
  );

function Bullets(t: Tok, items: React.ReactNode[]) {
  return h(
    'ul',
    { style: { margin: '0 0 4px', paddingLeft: '18px', display: 'grid', gap: '8px' } },
    ...items.map((it, i) =>
      h(
        'li',
        {
          key: i,
          style: { color: t.muted, fontSize: '14.5px', lineHeight: 1.6 },
        },
        it,
      ),
    ),
  );
}

const USAGE = `import { Hero } from "@/components/blocks/hero";

export default function Page() {
  return (
    <Hero
      title="Des blocks qui bougent juste."
      subtitle="Compositions accessibles, animées, prêtes à coller."
      primaryAction={{ label: "Commencer", href: "/signup" }}
      secondaryAction={{ label: "GitHub", href: "https://github.com" }}
    />
  );
}`;

export function GettingStarted() {
  const { t, reduced, copy } = useUI();

  const nextCard = (href: string, icon: string, title: string, body: string) =>
    h(
      Link,
      {
        key: title,
        href,
        style: {
          display: 'block',
          textDecoration: 'none',
          background: t.panel,
          border: `1px solid ${t.border}`,
          borderRadius: '14px',
          padding: '18px 18px 16px',
        },
      },
      h(
        'div',
        {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: t.accentSoft,
            color: t.accent,
            marginBottom: '10px',
          },
        },
        h(Icon, { name: icon, size: 16 }),
      ),
      h(
        'div',
        { style: { font: "650 15px 'Geist',sans-serif", color: t.text, marginBottom: '4px' } },
        title,
      ),
      h('div', { style: { color: t.faint, fontSize: '13px', lineHeight: 1.5 } }, body),
    );

  return h(
    'div',
    {
      style: {
        maxWidth: '760px',
        margin: '0 auto',
        width: '100%',
        padding: '48px 24px 40px',
      },
    },

    // ── Header ────────────────────────────────────────────────────────────
    h(SectionLabel, { t, style: { padding: '0 0 10px' } }, 'Guide'),
    h(
      'h1',
      {
        style: {
          margin: '0 0 14px',
          font: "700 clamp(30px, 5vw, 42px) 'Geist',sans-serif",
          letterSpacing: '-.02em',
          color: t.text,
          lineHeight: 1.1,
        },
      },
      'Prise en main',
    ),
    h(
      'p',
      { style: { margin: 0, color: t.muted, fontSize: '16px', lineHeight: 1.6, maxWidth: '58ch' } },
      'Les blocks ibirdui sont des sections complètes, accessibles et animées, distribuées en registry-as-code : pas de dépendance runtime, vous copiez le code source dans votre projet et il vous appartient.',
    ),

    // ── 1. Prérequis ──────────────────────────────────────────────────────
    Section(
      t,
      'Étape 1',
      'Prérequis',
      p(t, 'Avant d’ajouter un block, assurez-vous d’avoir :'),
      Bullets(t, [
        h(
          'span',
          null,
          strong(t, 'Node.js 20+'),
          ' et un gestionnaire de paquets (pnpm, npm ou yarn).',
        ),
        h(
          'span',
          null,
          'Un projet ',
          strong(t, 'React'),
          ' — Next.js, Remix ou Vite — avec ',
          strong(t, 'Tailwind CSS'),
          ' configuré.',
        ),
        h(
          'span',
          null,
          'L’alias d’import ',
          code(t, '@/*'),
          ' pointant vers votre dossier source (les blocks importent leurs primitives via ',
          code(t, '@/components/*'),
          ').',
        ),
        h(
          'span',
          null,
          strong(t, 'framer-motion'),
          ' — les blocks orchestrent leurs animations avec.',
        ),
      ]),
    ),

    // ── 2. Ajouter un block ───────────────────────────────────────────────
    Section(
      t,
      'Étape 2',
      'Ajouter un block',
      p(
        t,
        'Chaque block se récupère par son URL de registry avec la CLI ibirdui. Le block et toutes les primitives ibirdui qu’il compose sont résolus et copiés dans votre projet en une commande :',
      ),
      CommandRow({
        t,
        reduced,
        copy,
        label: 'Terminal',
        cmd: 'npx ibirdui add blocks.ibird.dev/r/hero',
      }),
      h('div', { style: { height: '10px' } }),
      p(
        t,
        'Remplacez ',
        code(t, 'hero'),
        ' par n’importe quelle clé du catalogue (',
        code(t, 'pricing-toggle'),
        ', ',
        code(t, 'morph-button-card'),
        ', ',
        code(t, 'morph-search-panel'),
        ', …). Les primitives sont tirées automatiquement de ',
        code(t, 'ui.ibird.dev'),
        ' — vous n’avez rien d’autre à installer.',
      ),
    ),

    // ── 3. Thème & tokens ─────────────────────────────────────────────────
    Section(
      t,
      'Étape 3',
      'Thème & tokens',
      p(
        t,
        'Les blocks s’habillent avec des tokens sémantiques (',
        code(t, '--primary'),
        ', ',
        code(t, '--card'),
        ', ',
        code(t, '--muted'),
        ', ',
        code(t, '--border'),
        ', …) en HSL, plus l’accent lime d’ibirdui. Ajoutez le preset Tailwind et les variables CSS du thème ibirdui à votre projet pour que les blocks rendent exactement comme dans le catalogue — en clair comme en sombre.',
      ),
      p(
        t,
        'Tant que ces tokens existent, un block adopte instantanément votre charte : changez ',
        code(t, '--primary'),
        ' et tous les accents suivent.',
      ),
    ),

    // ── 4. Utiliser un block ──────────────────────────────────────────────
    Section(
      t,
      'Étape 4',
      'Utiliser un block',
      p(t, 'Importez le composant et passez-lui vos données. Exemple avec le block Hero :'),
      CodeBlock({ t, code: USAGE }),
    ),

    // ── Étapes suivantes ──────────────────────────────────────────────────
    h(
      'section',
      { style: { marginTop: '48px', borderTop: `1px solid ${t.border}`, paddingTop: '30px' } },
      h(SectionLabel, { t, style: { padding: '0 0 12px' } }, 'Étapes suivantes'),
      h(
        'div',
        {
          style: {
            display: 'grid',
            gap: '12px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          },
        },
        nextCard(
          ROUTES.catalogue,
          'sparkles',
          'Parcourir le catalogue',
          'Tous les blocks par catégorie : Marketing, Pricing, Morphing.',
        ),
        nextCard(
          ROUTES.morphing,
          'command',
          'Voir le Morphing',
          'Les transitions shared-element, expliquées et démontrées en direct.',
        ),
      ),
    ),
  );
}
