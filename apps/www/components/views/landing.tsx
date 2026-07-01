'use client';

import { useRouter } from 'next/navigation';
import type * as React from 'react';
import { BLOCKS } from '~/lib/blocks-data';
import { h } from '~/lib/h';
import { Reveal } from '~/lib/motion';
import { ROUTES } from '~/lib/routes';
import { useUI } from '~/lib/ui-context';
import { CardSkeleton } from '../card-skeleton';
import { Badge, Button, Icon } from '../primitives';

// Only shipped blocks are featured. Sourced from BLOCKS so the landing can
// never advertise a block that isn't actually in the catalogue.
const FEATURED = BLOCKS;
const INSTALL_CMD = 'npx ibirdui add blocks.ibird.dev/r/hero';

export function Landing() {
  const { t, reduced, copy } = useUI();
  const router = useRouter();
  return h(
    'div',
    {},
    h(
      'section',
      {
        style: { position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${t.border}` },
      },
      h(
        'div',
        { style: { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' } },
        h('div', {
          className: 'ib-float1',
          style: {
            position: 'absolute',
            top: '-160px',
            left: '10%',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            filter: 'blur(90px)',
            opacity: 0.22,
            background: t.accent,
          },
        }),
        h('div', {
          className: 'ib-float2',
          style: {
            position: 'absolute',
            top: '-120px',
            right: '8%',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            filter: 'blur(90px)',
            opacity: 0.16,
            background: '#ec4899',
          },
        }),
      ),
      h(
        Reveal,
        {
          reduced,
          stagger: 80,
          y: 18,
          style: {
            position: 'relative',
            maxWidth: '820px',
            margin: '0 auto',
            padding: '88px 24px 64px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '20px',
          },
        },
        h('div', {}, h(Badge, { t, tone: 'accent', dot: true }, 'Compatible shadcn · MIT')),
        h(
          'h1',
          {
            style: {
              margin: 0,
              font: "700 clamp(34px,7vw,64px)/1.03 'Geist',sans-serif",
              letterSpacing: '-.04em',
              color: t.text,
              maxWidth: '15ch',
            },
          },
          'Copie une commande. ',
          h('span', { style: { color: t.accent } }, 'C’est à toi.'),
        ),
        h(
          'p',
          {
            style: {
              margin: 0,
              color: t.muted,
              fontSize: 'clamp(15px,2.4vw,19px)',
              lineHeight: 1.55,
              maxWidth: '56ch',
            },
          },
          'Un catalogue de blocks UI complets, animés au morphing et accessibles — construits sur les primitives ibirdui. Installe-les en une commande, garde le code.',
        ),
        h(
          'div',
          { style: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' } },
          h(
            Button,
            { t, reduced, rightIcon: 'arrow', onClick: () => router.push(ROUTES.catalogue) },
            'Parcourir le catalogue',
          ),
          h(Button, { t, reduced, variant: 'outline', leftIcon: 'github' }, 'Star on GitHub'),
        ),
        h(
          'button',
          {
            onClick: () => copy(INSTALL_CMD, 'Commande copiée'),
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '8px',
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
    h(
      'section',
      { style: { maxWidth: '1080px', margin: '0 auto', padding: '56px 24px' } },
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '22px',
            gap: '16px',
            flexWrap: 'wrap',
          },
        },
        h(
          'div',
          {},
          h(
            'h2',
            {
              style: {
                margin: '0 0 6px',
                font: "700 24px 'Geist',sans-serif",
                letterSpacing: '-.02em',
                color: t.text,
              },
            },
            'Blocks vedettes',
          ),
          h(
            'p',
            { style: { margin: 0, color: t.faint, fontSize: '14px' } },
            'Rendus live. Survole, clique, change de thème.',
          ),
        ),
        h(
          Button,
          {
            t,
            reduced,
            variant: 'soft',
            rightIcon: 'arrow',
            onClick: () => router.push(ROUTES.catalogue),
          },
          'Tout voir',
        ),
      ),
      h(
        Reveal,
        { reduced, trigger: 'view', stagger: 90, y: 20, className: 'ib-featgrid' },
        ...FEATURED.map((f) =>
          h(
            'div',
            {
              key: f.key,
              onClick: () => router.push(ROUTES.block(f.key)),
              style: {
                cursor: 'pointer',
                background: t.bg2,
                border: `1px solid ${t.border}`,
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'border-color .2s',
              },
              onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.borderColor = t.accentRing;
              },
              onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.borderColor = t.border;
              },
            },
            h(
              'div',
              {
                style: {
                  height: '300px',
                  padding: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  background: 'radial-gradient(var(--ib-border) 1px,transparent 1px)',
                  backgroundSize: '20px 20px',
                },
              },
              h(CardSkeleton, { t, kind: f.preview }),
            ),
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 16px',
                  borderTop: `1px solid ${t.border}`,
                },
              },
              h(
                'div',
                { style: { display: 'flex', alignItems: 'center', gap: '9px' } },
                h(
                  'span',
                  { style: { font: "600 14px 'Geist',sans-serif", color: t.text } },
                  f.name,
                ),
                h(Badge, { t }, f.cat),
              ),
              h(
                'span',
                {
                  style: {
                    color: t.faint,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12.5px',
                  },
                },
                'Ouvrir',
                h(Icon, { name: 'arrow', size: 14 }),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
