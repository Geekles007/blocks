'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { h } from '~/lib/h';
import { Reveal } from '~/lib/motion';
import { ROUTES } from '~/lib/routes';
import type { Tok } from '~/lib/tokens';
import { useUI } from '~/lib/ui-context';
import { InstallCommand, PageContainer, PageHeader } from '../page';
import { Badge, Button, Icon, SectionLabel } from '../primitives';

const INSTALL_CMD = 'npx ibirdui add ui.ibird.dev/r/block-motion';

// The catalogue's four shared spring "feels" — the exact configs shipped in
// block-motion, restated here so the demos animate with the real values. The
// usage blurb is resolved per-locale by `springUse`.
type Spring = { type: 'spring'; stiffness: number; damping: number; mass?: number };
const SPRINGS: { name: string; cfg: Spring }[] = [
  { name: 'smooth', cfg: { type: 'spring', stiffness: 260, damping: 30 } },
  { name: 'snappy', cfg: { type: 'spring', stiffness: 420, damping: 32 } },
  { name: 'gentle', cfg: { type: 'spring', stiffness: 150, damping: 24 } },
  { name: 'layout', cfg: { type: 'spring', stiffness: 320, damping: 34, mass: 0.9 } },
];
const springUse = (fr: boolean): Record<string, string> =>
  fr
    ? {
        smooth: 'Défaut équilibré — entrées, changements de layout.',
        snappy: 'Vif et net — hovers, toggles, micro-interactions.',
        gentle: 'Doux et lent — reveals de hero, grandes surfaces.',
        layout: 'Morphs shared-layout — réordonnancements, pills, kanban.',
      }
    : {
        smooth: 'Balanced default — entrances, layout changes.',
        snappy: 'Crisp and sharp — hovers, toggles, micro-interactions.',
        gentle: 'Soft and slow — hero reveals, large surfaces.',
        layout: 'Shared-layout morphs — reorders, pills, kanban.',
      };

/** A play button that flings a knob across a track with one of the springs. */
function SpringPlayer({ t, cfg }: { t: Tok; cfg: Spring }) {
  const { locale } = useUI();
  const [on, setOn] = React.useState(false);
  return h(
    'div',
    { style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px' } },
    h(
      'button',
      {
        type: 'button',
        onClick: () => setOn((v) => !v),
        'aria-label': locale === 'fr' ? 'Rejouer le spring' : 'Replay the spring',
        style: {
          flex: 'none',
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: t.panel2,
          border: `1px solid ${t.border}`,
          color: t.text,
          cursor: 'pointer',
        },
      },
      h(Icon, { name: 'ret', size: 14 }),
    ),
    h(
      'div',
      {
        style: {
          position: 'relative',
          flex: 1,
          height: '10px',
          borderRadius: '999px',
          background: t.panel2,
          border: `1px solid ${t.border}`,
        },
      },
      h(motion.div, {
        // Percentage `left` + a -100% self-offset keeps the knob flush at both
        // ends of a fluid track without measuring its width.
        animate: { left: on ? '100%' : '0%', x: on ? '-100%' : '0%' },
        transition: cfg,
        style: {
          position: 'absolute',
          top: '-4px',
          left: 0,
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: t.accent,
          boxShadow: `0 2px 8px ${t.accentRing}`,
        },
      }),
    ),
  );
}

/** A replayable staggered reveal — the reveal / revealItem pattern, live. */
function RevealDemo({ t, reduced }: { t: Tok; reduced: boolean }) {
  const { locale } = useUI();
  const fr = locale === 'fr';
  const [run, setRun] = React.useState(0);
  const chips = fr
    ? ['Badge', 'Titre', 'Sous-titre', 'CTA', 'Preuve sociale']
    : ['Badge', 'Title', 'Subtitle', 'CTA', 'Social proof'];
  return h(
    'div',
    {
      style: {
        background: t.bg2,
        border: `1px solid ${t.border}`,
        borderRadius: '16px',
        padding: '22px',
      },
    },
    h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        },
      },
      h(
        'span',
        { style: { font: "600 13px 'Geist',sans-serif", color: t.faint } },
        fr ? 'Cascade au mount · stagger 60 ms' : 'Cascade on mount · stagger 60 ms',
      ),
      h(
        Button,
        {
          t,
          reduced,
          size: 'sm',
          variant: 'soft',
          leftIcon: 'ret',
          onClick: () => setRun((v) => v + 1),
        },
        fr ? 'Rejouer' : 'Replay',
      ),
    ),
    h(
      Reveal,
      {
        // Re-keying remounts the children so the staggered entrance replays.
        key: run,
        reduced,
        stagger: 70,
        y: 16,
        style: { display: 'flex', flexWrap: 'wrap', gap: '9px' },
      },
      ...chips.map((c) =>
        h(
          'span',
          {
            key: c,
            style: {
              padding: '8px 13px',
              borderRadius: '10px',
              background: t.panel,
              border: `1px solid ${t.border}`,
              font: "600 13px 'Geist',sans-serif",
              color: t.text,
            },
          },
          c,
        ),
      ),
    ),
  );
}

const codeBox = (t: Tok, code: string) =>
  h(
    'div',
    {
      style: {
        background: t.panel,
        border: `1px solid ${t.border}`,
        borderRadius: '12px',
        overflow: 'hidden',
        marginTop: '16px',
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
          fontSize: '12.5px',
          lineHeight: 1.7,
          color: t.text,
        },
      },
      code,
    ),
  );

const revealSnippet = (
  fr: boolean,
) => `import { MotionProvider, reveal, revealItem } from "@/lib/block-motion";
import { motion } from "framer-motion";

<MotionProvider>
  <motion.div variants={reveal} initial="hidden" animate="visible">
    <motion.h1 variants={revealItem}>${fr ? 'Titre' : 'Title'}</motion.h1>
    <motion.p  variants={revealItem}>${fr ? 'Sous-titre' : 'Subtitle'}</motion.p>
    <motion.div variants={revealItem}>{/* CTA */}</motion.div>
  </motion.div>
</MotionProvider>`;

export function BlockMotion() {
  const { t, locale, reduced, copy } = useUI();
  const fr = locale === 'fr';
  const router = useRouter();
  const uses = springUse(fr);

  const h2 = (title: string) =>
    h(
      'h2',
      {
        style: {
          margin: '0 0 8px',
          font: "700 24px 'Geist',sans-serif",
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
        style: { margin: 0, color: t.muted, fontSize: '15px', lineHeight: 1.65, maxWidth: '64ch' },
      },
      ...children,
    );

  return h(
    'div',
    {},

    // ── Hero ──────────────────────────────────────────────────────────────
    h(
      'section',
      { style: { borderBottom: `1px solid ${t.border}`, background: t.bg2 } },
      h(
        PageContainer,
        { width: 'prose', pad: '76px 24px 60px' },
        h(PageHeader, {
          t,
          reduced,
          size: 'lg',
          titleMaxWidth: '16ch',
          kicker: h(
            Badge,
            { t, tone: 'accent', dot: true },
            fr ? 'Fondation · Motion' : 'Foundation · Motion',
          ),
          title: [
            fr ? 'Une seule grammaire de ' : 'A single grammar of ',
            h('span', { style: { color: t.accent } }, fr ? 'mouvement' : 'motion'),
            '.',
          ],
          subtitle: [
            fr
              ? 'Tous les blocks partagent block-motion : un jeu de springs cohérents, des reveals en cascade et des morphs shared-layout — et chaque animation respecte automatiquement '
              : 'Every block shares block-motion: a set of consistent springs, cascading reveals and shared-layout morphs — and every animation automatically respects ',
            h(
              'code',
              { style: { fontFamily: "'Geist Mono',monospace", fontSize: '.9em', color: t.text } },
              'prefers-reduced-motion',
            ),
            fr
              ? '. Rien à accorder à la main : le mouvement est cohérent d’un block à l’autre.'
              : '. Nothing to tune by hand: motion is consistent from one block to the next.',
          ],
          actions: h(InstallCommand, { t, cmd: INSTALL_CMD, onCopy: copy }),
        }),
      ),
    ),

    // ── Springs ───────────────────────────────────────────────────────────
    h(
      PageContainer,
      { as: 'section', width: 'wide', pad: '64px 24px 8px' },
      h(SectionLabel, { t, style: { padding: '0 0 10px' } }, 'Springs'),
      h2(fr ? 'Un vocabulaire de quatre ressorts' : 'A vocabulary of four springs'),
      lead(
        fr
          ? 'Pas de durées magiques disséminées dans le code : quatre springs nommés couvrent tout. Choisissez l’intention, pas des chiffres. Cliquez pour sentir la différence.'
          : 'No magic durations scattered through the code: four named springs cover everything. Pick the intent, not numbers. Click to feel the difference.',
      ),
      h(
        Reveal,
        {
          reduced,
          trigger: 'view',
          stagger: 80,
          y: 18,
          className: 'ib-bm-springs',
          style: {
            marginTop: '26px',
            display: 'grid',
            gap: '14px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          },
        },
        ...SPRINGS.map((s) =>
          h(
            'div',
            {
              key: s.name,
              style: {
                background: t.bg2,
                border: `1px solid ${t.border}`,
                borderRadius: '14px',
                padding: '18px',
              },
            },
            h(
              'div',
              { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
              h(
                'code',
                { style: { font: "650 15px 'Geist Mono',monospace", color: t.accent } },
                `springs.${s.name}`,
              ),
              h(
                'span',
                { style: { font: "500 11px 'Geist Mono',monospace", color: t.faint } },
                `${s.cfg.stiffness}/${s.cfg.damping}`,
              ),
            ),
            h(
              'p',
              { style: { margin: '8px 0 0', color: t.muted, fontSize: '13px', lineHeight: 1.5 } },
              uses[s.name] ?? '',
            ),
            h(SpringPlayer, { t, cfg: s.cfg }),
          ),
        ),
      ),
    ),

    // ── Reveal ────────────────────────────────────────────────────────────
    h(
      PageContainer,
      { as: 'section', width: 'wide', pad: '56px 24px 8px' },
      h(SectionLabel, { t, style: { padding: '0 0 10px' } }, 'Reveal'),
      h2(fr ? 'Des entrées en cascade' : 'Cascading entrances'),
      lead(
        fr ? 'Posez ' : 'Put ',
        h(
          'code',
          { style: { fontFamily: "'Geist Mono',monospace", fontSize: '.9em', color: t.text } },
          'reveal',
        ),
        fr ? ' sur le conteneur et ' : ' on the container and ',
        h(
          'code',
          { style: { fontFamily: "'Geist Mono',monospace", fontSize: '.9em', color: t.text } },
          'revealItem',
        ),
        fr
          ? ' sur chaque enfant : le parent orchestre le timing, les enfants montent et se fondent en place. Au mount ou à l’entrée dans le viewport.'
          : ' on each child: the parent orchestrates the timing, the children rise and fade into place. On mount or on entering the viewport.',
      ),
      h(
        'div',
        {
          className: 'ib-bm-reveal',
          style: {
            marginTop: '26px',
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            alignItems: 'start',
          },
        },
        h(RevealDemo, { t, reduced }),
        codeBox(t, revealSnippet(fr)),
      ),
    ),

    // ── Shared-layout + reduced-motion ────────────────────────────────────
    h(
      PageContainer,
      { as: 'section', width: 'wide', pad: '56px 24px 8px' },
      h(
        'div',
        {
          className: 'ib-bm-duo',
          style: {
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          },
        },
        h(
          'div',
          {
            style: {
              background: t.bg2,
              border: `1px solid ${t.border}`,
              borderRadius: '16px',
              padding: '24px',
            },
          },
          h(
            'div',
            {
              style: {
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: t.accentSoft,
                color: t.accent,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              },
            },
            h(Icon, { name: 'sparkles', size: 18 }),
          ),
          h(
            'h3',
            { style: { margin: '0 0 8px', font: "650 17px 'Geist',sans-serif", color: t.text } },
            fr ? 'Morphs shared-layout' : 'Shared-layout morphs',
          ),
          h(
            'p',
            { style: { margin: '0 0 16px', color: t.muted, fontSize: '14px', lineHeight: 1.6 } },
            fr
              ? 'Deux éléments qui partagent un layoutId se transforment l’un dans l’autre au lieu d’apparaître/disparaître. C’est le moteur des transitions de la vitrine Morphing.'
              : 'Two elements sharing a layoutId transform into one another instead of appearing/disappearing. It’s the engine behind the Morphing showcase transitions.',
          ),
          h(
            Button,
            {
              t,
              reduced,
              size: 'sm',
              variant: 'soft',
              rightIcon: 'arrow',
              onClick: () => router.push(ROUTES.morphing),
            },
            fr ? 'Voir le Morphing' : 'See Morphing',
          ),
        ),
        h(
          'div',
          {
            style: {
              background: t.bg2,
              border: `1px solid ${t.border}`,
              borderRadius: '16px',
              padding: '24px',
            },
          },
          h(
            'div',
            {
              style: {
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: t.accentSoft,
                color: t.accent,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              },
            },
            h(Icon, { name: 'check', size: 18 }),
          ),
          h(
            'h3',
            { style: { margin: '0 0 8px', font: "650 17px 'Geist',sans-serif", color: t.text } },
            fr ? 'Reduced-motion, par défaut' : 'Reduced-motion, by default',
          ),
          h(
            'p',
            { style: { margin: 0, color: t.muted, fontSize: '14px', lineHeight: 1.6 } },
            fr
              ? 'Enveloppez un block dans MotionProvider et toute animation imbriquée respecte prefers-reduced-motion : les translations et scales tombent en simples fondus, les boucles se figent. L’accessibilité n’est pas une option à cocher — elle est le comportement par défaut.'
              : 'Wrap a block in MotionProvider and every nested animation respects prefers-reduced-motion: translates and scales fall back to plain fades, loops freeze. Accessibility isn’t an opt-in checkbox — it’s the default behaviour.',
          ),
        ),
      ),
    ),

    // ── Footer note ───────────────────────────────────────────────────────
    h(
      PageContainer,
      { as: 'section', width: 'wide', pad: '40px 24px 64px' },
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
          { style: { color: t.text, fontSize: '14.5px', fontWeight: 500, maxWidth: '52ch' } },
          fr
            ? 'block-motion est une primitive ibirdui : installez-la une fois, tous vos blocks partagent la même signature de mouvement.'
            : 'block-motion is an ibirdui primitive: install it once, and all your blocks share the same motion signature.',
        ),
        h(
          Button,
          { t, reduced, rightIcon: 'arrow', onClick: () => router.push(ROUTES.gettingStarted) },
          fr ? 'Prise en main' : 'Getting started',
        ),
      ),
    ),
  );
}
