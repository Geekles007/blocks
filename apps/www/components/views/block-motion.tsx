'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { h } from '~/lib/h';
import { Reveal } from '~/lib/motion';
import { ROUTES } from '~/lib/routes';
import type { Tok } from '~/lib/tokens';
import { useUI } from '~/lib/ui-context';
import { Badge, Button, Icon, SectionLabel } from '../primitives';

const INSTALL_CMD = 'npx ibirdui add ui.ibird.dev/r/block-motion';

// The catalogue's four shared spring "feels" — the exact configs shipped in
// block-motion, restated here so the demos animate with the real values.
type Spring = { type: 'spring'; stiffness: number; damping: number; mass?: number };
const SPRINGS: { name: string; use: string; cfg: Spring }[] = [
  {
    name: 'smooth',
    use: 'Défaut équilibré — entrées, changements de layout.',
    cfg: { type: 'spring', stiffness: 260, damping: 30 },
  },
  {
    name: 'snappy',
    use: 'Vif et net — hovers, toggles, micro-interactions.',
    cfg: { type: 'spring', stiffness: 420, damping: 32 },
  },
  {
    name: 'gentle',
    use: 'Doux et lent — reveals de hero, grandes surfaces.',
    cfg: { type: 'spring', stiffness: 150, damping: 24 },
  },
  {
    name: 'layout',
    use: 'Morphs shared-layout — réordonnancements, pills, kanban.',
    cfg: { type: 'spring', stiffness: 320, damping: 34, mass: 0.9 },
  },
];

/** A play button that flings a knob across a track with one of the springs. */
function SpringPlayer({ t, cfg }: { t: Tok; cfg: Spring }) {
  const [on, setOn] = React.useState(false);
  return h(
    'div',
    { style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px' } },
    h(
      'button',
      {
        type: 'button',
        onClick: () => setOn((v) => !v),
        'aria-label': 'Rejouer le spring',
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
  const [run, setRun] = React.useState(0);
  const chips = ['Badge', 'Titre', 'Sous-titre', 'CTA', 'Preuve sociale'];
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
        'Cascade au mount · stagger 60 ms',
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
        'Rejouer',
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

const REVEAL_SNIPPET = `import { MotionProvider, reveal, revealItem } from "@/lib/block-motion";
import { motion } from "framer-motion";

<MotionProvider>
  <motion.div variants={reveal} initial="hidden" animate="visible">
    <motion.h1 variants={revealItem}>Titre</motion.h1>
    <motion.p  variants={revealItem}>Sous-titre</motion.p>
    <motion.div variants={revealItem}>{/* CTA */}</motion.div>
  </motion.div>
</MotionProvider>`;

export function BlockMotion() {
  const { t, reduced, copy } = useUI();
  const router = useRouter();

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
        Reveal,
        {
          reduced,
          stagger: 80,
          y: 18,
          style: { maxWidth: '820px', margin: '0 auto', padding: '76px 24px 60px' },
        },
        h(
          'div',
          { style: { marginBottom: '18px' } },
          h(Badge, { t, tone: 'accent', dot: true }, 'Fondation · Motion'),
        ),
        h(
          'h1',
          {
            style: {
              margin: '0 0 16px',
              font: "700 clamp(32px,6vw,52px)/1.05 'Geist',sans-serif",
              letterSpacing: '-.03em',
              color: t.text,
              maxWidth: '16ch',
            },
          },
          'Une seule grammaire de ',
          h('span', { style: { color: t.accent } }, 'mouvement'),
          '.',
        ),
        h(
          'p',
          {
            style: {
              margin: '0 0 26px',
              color: t.muted,
              fontSize: 'clamp(15px,2.2vw,18px)',
              lineHeight: 1.6,
              maxWidth: '58ch',
            },
          },
          'Tous les blocks partagent block-motion : un jeu de springs cohérents, des reveals en cascade et des morphs shared-layout — et chaque animation respecte automatiquement ',
          h(
            'code',
            { style: { fontFamily: "'Geist Mono',monospace", fontSize: '.9em', color: t.text } },
            'prefers-reduced-motion',
          ),
          '. Rien à accorder à la main : le mouvement est cohérent d’un block à l’autre.',
        ),
        h(
          'button',
          {
            onClick: () => copy(INSTALL_CMD, 'Commande copiée'),
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
            },
          },
          h('span', { style: { color: t.faint } }, '$'),
          h('span', {}, INSTALL_CMD),
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
        ),
      ),
    ),

    // ── Springs ───────────────────────────────────────────────────────────
    h(
      'section',
      { style: { maxWidth: '960px', margin: '0 auto', padding: '64px 24px 8px' } },
      h(SectionLabel, { t, style: { padding: '0 0 10px' } }, 'Springs'),
      h2('Un vocabulaire de quatre ressorts'),
      lead(
        'Pas de durées magiques disséminées dans le code : quatre springs nommés couvrent tout. Choisissez l’intention, pas des chiffres. Cliquez pour sentir la différence.',
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
              s.use,
            ),
            h(SpringPlayer, { t, cfg: s.cfg }),
          ),
        ),
      ),
    ),

    // ── Reveal ────────────────────────────────────────────────────────────
    h(
      'section',
      { style: { maxWidth: '960px', margin: '0 auto', padding: '56px 24px 8px' } },
      h(SectionLabel, { t, style: { padding: '0 0 10px' } }, 'Reveal'),
      h2('Des entrées en cascade'),
      lead(
        'Posez ',
        h(
          'code',
          { style: { fontFamily: "'Geist Mono',monospace", fontSize: '.9em', color: t.text } },
          'reveal',
        ),
        ' sur le conteneur et ',
        h(
          'code',
          { style: { fontFamily: "'Geist Mono',monospace", fontSize: '.9em', color: t.text } },
          'revealItem',
        ),
        ' sur chaque enfant : le parent orchestre le timing, les enfants montent et se fondent en place. Au mount ou à l’entrée dans le viewport.',
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
        codeBox(t, REVEAL_SNIPPET),
      ),
    ),

    // ── Shared-layout + reduced-motion ────────────────────────────────────
    h(
      'section',
      { style: { maxWidth: '960px', margin: '0 auto', padding: '56px 24px 8px' } },
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
            'Morphs shared-layout',
          ),
          h(
            'p',
            { style: { margin: '0 0 16px', color: t.muted, fontSize: '14px', lineHeight: 1.6 } },
            'Deux éléments qui partagent un layoutId se transforment l’un dans l’autre au lieu d’apparaître/disparaître. C’est le moteur des transitions de la vitrine Morphing.',
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
            'Voir le Morphing',
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
            'Reduced-motion, par défaut',
          ),
          h(
            'p',
            { style: { margin: 0, color: t.muted, fontSize: '14px', lineHeight: 1.6 } },
            'Enveloppez un block dans MotionProvider et toute animation imbriquée respecte prefers-reduced-motion : les translations et scales tombent en simples fondus, les boucles se figent. L’accessibilité n’est pas une option à cocher — elle est le comportement par défaut.',
          ),
        ),
      ),
    ),

    // ── Footer note ───────────────────────────────────────────────────────
    h(
      'section',
      { style: { maxWidth: '960px', margin: '0 auto', padding: '40px 24px 64px' } },
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
          'block-motion est une primitive ibirdui : installez-la une fois, tous vos blocks partagent la même signature de mouvement.',
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
