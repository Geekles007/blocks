'use client';

import Link from 'next/link';
import type * as React from 'react';
import { h } from '~/lib/h';
import { ROUTES } from '~/lib/routes';
import type { Tok } from '~/lib/tokens';
import { useUI } from '~/lib/ui-context';
import { PageContainer, PageHeader } from '../page';
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

/** A small sub-heading inside a section, above a code sample. */
const subhead = (t: Tok, ...children: React.ReactNode[]) =>
  h(
    'div',
    {
      style: {
        margin: '18px 0 8px',
        font: "600 13.5px 'Geist',sans-serif",
        color: t.text,
      },
    },
    ...children,
  );

/** An accent-tinted callout — used for the "colours stripped" troubleshooting tip. */
const Note = (t: Tok, ...children: React.ReactNode[]) =>
  h(
    'div',
    {
      style: {
        display: 'flex',
        gap: '10px',
        margin: '16px 0 4px',
        padding: '12px 14px',
        background: t.accentSoft,
        border: `1px solid ${t.border}`,
        borderRadius: '11px',
      },
    },
    h(
      'span',
      { style: { flex: 'none', color: t.accent, marginTop: '1px' } },
      h(Icon, { name: 'help', size: 15 }),
    ),
    h(
      'p',
      { style: { margin: 0, color: t.muted, fontSize: '13.5px', lineHeight: 1.6 } },
      ...children,
    ),
  );

// The Tailwind v4 wiring: v4 ignores JS presets, so the ibirdui tokens are
// registered as v4 theme colours. `inline` keeps them pointing at the CSS vars
// from theme.css, so dark mode + opacity modifiers keep working.
const THEME_V4 = `/* app/globals.css (ou src/styles.css) */
@import "tailwindcss";
@import "./styles/theme.css";   /* les variables --primary, --card… installées ci-dessus */

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-success: hsl(var(--success));
  --color-success-foreground: hsl(var(--success-foreground));
  --color-warning: hsl(var(--warning));
  --color-warning-foreground: hsl(var(--warning-foreground));
}`;

// The Tailwind v3 wiring: the preset shipped by the theme item maps every token
// to a colour utility. Import theme.css once in your global stylesheet too.
const THEME_V3 = `// tailwind.config.ts
import ibirdui from "./tailwind.preset";

export default {
  presets: [ibirdui],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
};

// puis, une fois, dans votre CSS global :
// @import "./styles/theme.css";`;

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
    PageContainer,
    { width: 'prose' },

    // ── Header ────────────────────────────────────────────────────────────
    h(PageHeader, {
      t,
      reduced,
      kicker: 'Guide',
      title: 'Prise en main',
      subtitle:
        'Les blocks ibirdui sont des sections complètes, accessibles et animées, distribuées en registry-as-code : pas de dépendance runtime, vous copiez le code source dans votre projet et il vous appartient.',
    }),

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
        'Les blocks n’utilisent que des classes ',
        strong(t, 'sémantiques'),
        ' (',
        code(t, 'bg-primary'),
        ', ',
        code(t, 'text-primary-foreground'),
        ', ',
        code(t, 'bg-card'),
        ', ',
        code(t, 'border-input'),
        ', …) qui pointent vers des variables CSS. Sans le layer de tokens, ces classes ne résolvent aucune couleur : c’est l’étape à ne pas sauter. Installez-le une fois :',
      ),
      CommandRow({
        t,
        reduced,
        copy,
        label: 'Terminal',
        cmd: 'npx ibirdui add ui.ibird.dev/r/theme',
      }),
      h('div', { style: { height: '10px' } }),
      p(
        t,
        'Ça écrit deux fichiers : ',
        code(t, 'styles/theme.css'),
        ' (les variables ',
        code(t, '--primary'),
        ', ',
        code(t, '--card'),
        ', … en clair et en sombre) et ',
        code(t, 'tailwind.preset.ts'),
        ' (le mapping vers les utilitaires Tailwind). Câblez-les selon votre version de Tailwind.',
      ),

      subhead(t, 'Tailwind v4 ', code(t, '(@tailwindcss/vite, @import "tailwindcss")')),
      p(
        t,
        'Tailwind v4 ',
        strong(t, 'ignore les presets JS'),
        ' : importez ',
        code(t, 'theme.css'),
        ' puis déclarez les tokens en couleurs v4 avec ',
        code(t, '@theme inline'),
        ' (le mot-clé ',
        code(t, 'inline'),
        ' garde le lien vers les variables, donc le mode sombre et les opacités comme ',
        code(t, 'bg-primary/90'),
        ' continuent de marcher) :',
      ),
      CodeBlock({ t, code: THEME_V4 }),

      subhead(t, 'Tailwind v3 ', code(t, '(tailwind.config.ts)')),
      p(t, 'Ajoutez le preset fourni et importez ', code(t, 'theme.css'), ' une fois :'),
      CodeBlock({ t, code: THEME_V3 }),

      subhead(t, 'Mode sombre'),
      p(
        t,
        'Basculez le thème en posant ',
        code(t, 'data-theme="dark"'),
        ' (ou la classe ',
        code(t, '.dark'),
        ') sur ',
        code(t, '<html>'),
        '. Changez ',
        code(t, '--primary'),
        ' dans ',
        code(t, 'theme.css'),
        ' et tous les accents suivent — le block adopte instantanément votre charte.',
      ),

      Note(
        t,
        strong(t, 'Dispositions correctes mais couleurs absentes ?'),
        ' C’est le signe que le layer de tokens n’est pas câblé : ',
        code(t, 'bg-primary'),
        ' & co ne résolvent rien tandis que la mise en page (flex, padding) tient. Vérifiez que ',
        code(t, 'theme.css'),
        ' est bien importé et — en Tailwind v4 — que le bloc ',
        code(t, '@theme inline'),
        ' est présent.',
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
