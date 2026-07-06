'use client';

import Link from 'next/link';
import type * as React from 'react';
import { h } from '~/lib/h';
import type { Messages } from '~/lib/i18n';
import { ROUTES } from '~/lib/routes';
import type { Tok } from '~/lib/tokens';
import { useUI } from '~/lib/ui-context';
import { PageContainer, PageHeader } from '../page';
import { Button, Icon, SectionLabel } from '../primitives';

/** A monospace command row with a copy button — mirrors the block-detail install box. */
function CommandRow({
  t,
  m,
  reduced,
  copy,
  cmd,
  label,
}: {
  t: Tok;
  m: Messages;
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
        onClick: () => copy(cmd, m.blockDetail.cmdCopied),
      },
      m.common.copy,
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
const themeV4 = (fr: boolean) => `/* app/globals.css (${fr ? 'ou' : 'or'} src/styles.css) */
@import "tailwindcss";
@import "./styles/theme.css";   /* ${fr ? 'les variables --primary, --card… installées ci-dessus' : 'the --primary, --card… variables installed above'} */

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
const themeV3 = (fr: boolean) => `// tailwind.config.ts
import ibirdui from "./tailwind.preset";

export default {
  presets: [ibirdui],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
};

// ${fr ? 'puis, une fois, dans votre CSS global :' : 'then, once, in your global stylesheet:'}
// @import "./styles/theme.css";`;

const usage = (fr: boolean) => `import { Hero } from "@/components/blocks/hero";

export default function Page() {
  return (
    <Hero
      title="${fr ? 'Des blocks qui bougent juste.' : 'Blocks that move just right.'}"
      subtitle="${fr ? 'Compositions accessibles, animées, prêtes à coller.' : 'Accessible, animated compositions, ready to paste.'}"
      primaryAction={{ label: "${fr ? 'Commencer' : 'Get started'}", href: "/signup" }}
      secondaryAction={{ label: "GitHub", href: "https://github.com" }}
    />
  );
}`;

export function GettingStarted() {
  const { t, m, locale, reduced, copy } = useUI();
  const fr = locale === 'fr';

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
      kicker: m.nav.guide,
      title: fr ? 'Prise en main' : 'Getting started',
      subtitle: fr
        ? 'Les blocks ibirdui sont des sections complètes, accessibles et animées, distribuées en registry-as-code : pas de dépendance runtime, vous copiez le code source dans votre projet et il vous appartient.'
        : 'ibirdui blocks are complete, accessible, animated sections shipped as registry-as-code: no runtime dependency — you copy the source into your project and it’s yours.',
    }),

    // ── 1. Prerequisites ──────────────────────────────────────────────────
    Section(
      t,
      fr ? 'Étape 1' : 'Step 1',
      fr ? 'Prérequis' : 'Prerequisites',
      p(
        t,
        fr
          ? 'Avant d’ajouter un block, assurez-vous d’avoir :'
          : 'Before adding a block, make sure you have:',
      ),
      Bullets(t, [
        h(
          'span',
          null,
          strong(t, 'Node.js 20+'),
          fr
            ? ' et un gestionnaire de paquets (pnpm, npm ou yarn).'
            : ' and a package manager (pnpm, npm or yarn).',
        ),
        h(
          'span',
          null,
          fr ? 'Un projet ' : 'A ',
          strong(t, 'React'),
          fr ? ' — Next.js, Remix ou Vite — avec ' : ' project — Next.js, Remix or Vite — with ',
          strong(t, 'Tailwind CSS'),
          fr ? ' configuré.' : ' configured.',
        ),
        h(
          'span',
          null,
          fr ? 'L’alias d’import ' : 'The ',
          code(t, '@/*'),
          fr
            ? ' pointant vers votre dossier source (les blocks importent leurs primitives via '
            : ' import alias pointing at your source folder (blocks import their primitives via ',
          code(t, '@/components/*'),
          ').',
        ),
        h(
          'span',
          null,
          strong(t, 'framer-motion'),
          fr
            ? ' — les blocks orchestrent leurs animations avec.'
            : ' — blocks orchestrate their animations with it.',
        ),
      ]),
    ),

    // ── 2. Add a block ────────────────────────────────────────────────────
    Section(
      t,
      fr ? 'Étape 2' : 'Step 2',
      fr ? 'Ajouter un block' : 'Add a block',
      p(
        t,
        fr
          ? 'Chaque block se récupère par son URL de registry avec la CLI ibirdui. Le block et toutes les primitives ibirdui qu’il compose sont résolus et copiés dans votre projet en une commande :'
          : 'Each block is fetched by its registry URL with the ibirdui CLI. The block and every ibirdui primitive it composes are resolved and copied into your project in one command:',
      ),
      CommandRow({
        t,
        m,
        reduced,
        copy,
        label: 'Terminal',
        cmd: 'npx ibirdui add blocks.ibird.dev/r/hero',
      }),
      h('div', { style: { height: '10px' } }),
      p(
        t,
        fr ? 'Remplacez ' : 'Replace ',
        code(t, 'hero'),
        fr ? ' par n’importe quelle clé du catalogue (' : ' with any catalogue key (',
        code(t, 'pricing-toggle'),
        ', ',
        code(t, 'morph-button-card'),
        ', ',
        code(t, 'morph-search-panel'),
        fr
          ? ', …). Les primitives sont tirées automatiquement de '
          : ', …). Primitives are pulled automatically from ',
        code(t, 'ui.ibird.dev'),
        fr ? ' — vous n’avez rien d’autre à installer.' : ' — you have nothing else to install.',
      ),
    ),

    // ── 3. Theme & tokens ─────────────────────────────────────────────────
    Section(
      t,
      fr ? 'Étape 3' : 'Step 3',
      fr ? 'Thème & tokens' : 'Theme & tokens',
      p(
        t,
        fr ? 'Les blocks n’utilisent que des classes ' : 'Blocks only use ',
        strong(t, fr ? 'sémantiques' : 'semantic'),
        fr ? ' (' : ' classes (',
        code(t, 'bg-primary'),
        ', ',
        code(t, 'text-primary-foreground'),
        ', ',
        code(t, 'bg-card'),
        ', ',
        code(t, 'border-input'),
        fr
          ? ', …) qui pointent vers des variables CSS. Sans le layer de tokens, ces classes ne résolvent aucune couleur : c’est l’étape à ne pas sauter. Installez-le une fois :'
          : ', …) that point at CSS variables. Without the token layer these classes resolve no colour: that’s the step not to skip. Install it once:',
      ),
      CommandRow({
        t,
        m,
        reduced,
        copy,
        label: 'Terminal',
        cmd: 'npx ibirdui add ui.ibird.dev/r/theme',
      }),
      h('div', { style: { height: '10px' } }),
      p(
        t,
        fr ? 'Ça écrit deux fichiers : ' : 'It writes two files: ',
        code(t, 'styles/theme.css'),
        fr ? ' (les variables ' : ' (the ',
        code(t, '--primary'),
        ', ',
        code(t, '--card'),
        fr ? ', … en clair et en sombre) et ' : ', … variables in light and dark) and ',
        code(t, 'tailwind.preset.ts'),
        fr
          ? ' (le mapping vers les utilitaires Tailwind). Câblez-les selon votre version de Tailwind.'
          : ' (the mapping to Tailwind utilities). Wire them up per your Tailwind version.',
      ),

      subhead(t, 'Tailwind v4 ', code(t, '(@tailwindcss/vite, @import "tailwindcss")')),
      p(
        t,
        'Tailwind v4 ',
        strong(t, fr ? 'ignore les presets JS' : 'ignores JS presets'),
        fr ? ' : importez ' : ': import ',
        code(t, 'theme.css'),
        fr
          ? ' puis déclarez les tokens en couleurs v4 avec '
          : ' then declare the tokens as v4 colours with ',
        code(t, '@theme inline'),
        fr ? ' (le mot-clé ' : ' (the ',
        code(t, 'inline'),
        fr
          ? ' garde le lien vers les variables, donc le mode sombre et les opacités comme '
          : ' keyword keeps the link to the variables, so dark mode and opacities like ',
        code(t, 'bg-primary/90'),
        fr ? ' continuent de marcher) :' : ' keep working):',
      ),
      CodeBlock({ t, code: themeV4(fr) }),

      subhead(t, 'Tailwind v3 ', code(t, '(tailwind.config.ts)')),
      p(
        t,
        fr ? 'Ajoutez le preset fourni et importez ' : 'Add the shipped preset and import ',
        code(t, 'theme.css'),
        fr ? ' une fois :' : ' once:',
      ),
      CodeBlock({ t, code: themeV3(fr) }),

      subhead(t, fr ? 'Mode sombre' : 'Dark mode'),
      p(
        t,
        fr ? 'Basculez le thème en posant ' : 'Flip the theme by setting ',
        code(t, 'data-theme="dark"'),
        fr ? ' (ou la classe ' : ' (or the ',
        code(t, '.dark'),
        fr ? ') sur ' : ' class) on ',
        code(t, '<html>'),
        fr ? '. Changez ' : '. Change ',
        code(t, '--primary'),
        fr ? ' dans ' : ' in ',
        code(t, 'theme.css'),
        fr
          ? ' et tous les accents suivent — le block adopte instantanément votre charte.'
          : ' and every accent follows — the block instantly adopts your brand.',
      ),

      Note(
        t,
        strong(
          t,
          fr
            ? 'Dispositions correctes mais couleurs absentes ?'
            : 'Layouts right but colours missing?',
        ),
        fr
          ? ' C’est le signe que le layer de tokens n’est pas câblé : '
          : ' That’s the sign the token layer isn’t wired: ',
        code(t, 'bg-primary'),
        fr
          ? ' & co ne résolvent rien tandis que la mise en page (flex, padding) tient. Vérifiez que '
          : ' & co resolve nothing while the layout (flex, padding) holds. Check that ',
        code(t, 'theme.css'),
        fr
          ? ' est bien importé et — en Tailwind v4 — que le bloc '
          : ' is imported and — on Tailwind v4 — that the ',
        code(t, '@theme inline'),
        fr ? ' est présent.' : ' block is present.',
      ),
    ),

    // ── 4. Use a block ────────────────────────────────────────────────────
    Section(
      t,
      fr ? 'Étape 4' : 'Step 4',
      fr ? 'Utiliser un block' : 'Use a block',
      p(
        t,
        fr
          ? 'Importez le composant et passez-lui vos données. Exemple avec le block Hero :'
          : 'Import the component and pass it your data. Example with the Hero block:',
      ),
      CodeBlock({ t, code: usage(fr) }),
    ),

    // ── Next steps ────────────────────────────────────────────────────────
    h(
      'section',
      { style: { marginTop: '48px', borderTop: `1px solid ${t.border}`, paddingTop: '30px' } },
      h(
        SectionLabel,
        { t, style: { padding: '0 0 12px' } },
        fr ? 'Étapes suivantes' : 'Next steps',
      ),
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
          fr ? 'Parcourir le catalogue' : 'Browse the catalogue',
          fr
            ? 'Tous les blocks par catégorie : Marketing, Pricing, Morphing.'
            : 'All blocks by category: Marketing, Pricing, Morphing.',
        ),
        nextCard(
          ROUTES.morphing,
          'command',
          fr ? 'Voir le Morphing' : 'See Morphing',
          fr
            ? 'Les transitions shared-element, expliquées et démontrées en direct.'
            : 'Shared-element transitions, explained and demonstrated live.',
        ),
      ),
    ),
  );
}
