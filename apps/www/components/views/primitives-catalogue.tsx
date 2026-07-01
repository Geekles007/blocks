'use client';

import Link from 'next/link';
import * as React from 'react';
import { h } from '~/lib/h';
import { Reveal } from '~/lib/motion';
import { PRIMITIVES, countInPrimitiveCat, primitiveCategories } from '~/lib/primitives-data';
import { ROUTES } from '~/lib/routes';
import { useUI } from '~/lib/ui-context';
import { renderPrimitiveCard } from '../primitive-showcase';
import { Badge, Icon, SectionLabel } from '../primitives';

const { useState } = React;

export function PrimitivesCatalogue() {
  const { t, reduced } = useUI();
  const [cur, setCur] = useState('Tous');
  const [q, setQ] = useState('');
  const cats = primitiveCategories();
  const list = PRIMITIVES.filter(
    (p) => (cur === 'Tous' || p.category === cur) && p.name.toLowerCase().includes(q.toLowerCase()),
  );
  return h(
    'div',
    {
      className: 'ib-catwrap',
      style: { maxWidth: '1200px', margin: '0 auto', width: '100%', minHeight: '70vh' },
    },
    h(
      'aside',
      {
        className: 'ib-side',
        style: { borderRight: `1px solid ${t.border}`, padding: '24px 14px' },
      },
      h(SectionLabel, { t, style: { padding: '0 8px 8px' } }, 'Catégories'),
      h(
        'nav',
        { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
        ...['Tous', ...cats].map((c) => {
          const a = cur === c;
          return h(
            'button',
            {
              key: c,
              onClick: () => setCur(c),
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                textAlign: 'left',
                background: a ? t.accentSoft : 'transparent',
                border: `1px solid ${a ? t.border : 'transparent'}`,
                color: a ? t.text : t.muted,
                borderRadius: '8px',
                padding: '7px 10px',
                cursor: 'pointer',
                font: "500 13.5px 'Geist',sans-serif",
              },
            },
            c,
            h(
              'span',
              { style: { color: t.faint, fontSize: '11px', fontFamily: "'Geist Mono',monospace" } },
              String(countInPrimitiveCat(c)),
            ),
          );
        }),
      ),
    ),
    h(
      'main',
      { style: { padding: '24px' } },
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          },
        },
        h(
          'div',
          { style: { maxWidth: '54ch' } },
          h(
            'h1',
            {
              style: {
                margin: '0 0 6px',
                font: "700 22px 'Geist',sans-serif",
                letterSpacing: '-.02em',
                color: t.text,
                textWrap: 'balance',
              },
            },
            'Primitives',
          ),
          h(
            'p',
            { style: { margin: '0 0 6px', color: t.muted, fontSize: '14px', lineHeight: 1.5 } },
            'Les fondations sur lesquelles les blocks sont composés. Chaque composant, ses designs et leurs variants — rendus live.',
          ),
          h(
            'p',
            {
              style: {
                margin: 0,
                color: t.faint,
                fontSize: '13px',
                fontVariantNumeric: 'tabular-nums',
              },
            },
            (() => {
              const np = list.length;
              const nd = list.reduce((a, p) => a + p.designs.length, 0);
              return `${np} primitive${np > 1 ? 's' : ''} · ${nd} design${nd > 1 ? 's' : ''}`;
            })(),
          ),
        ),
        h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: t.panel,
              border: `1px solid ${t.border}`,
              borderRadius: '9px',
              padding: '8px 11px',
              minWidth: '200px',
            },
          },
          h(Icon, { name: 'search', size: 15, style: { color: t.faint } }),
          h('input', {
            value: q,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value),
            placeholder: 'Filtrer…',
            style: {
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              font: "400 13.5px 'Geist',sans-serif",
              color: t.text,
            },
          }),
        ),
      ),
      h(
        Reveal,
        { key: cur + q, reduced, stagger: 55, y: 14, className: 'ib-catgrid' },
        ...list.map((p) =>
          h(
            'article',
            {
              key: p.key,
              className: 'ib-card',
              style: {
                background: t.bg2,
                border: `1px solid ${t.border}`,
                borderRadius: '14px',
                overflow: 'hidden',
              },
            },
            // Decorative live sample — inert so its real controls never steal
            // focus or clicks from the card link.
            h(
              'div',
              {
                'aria-hidden': true,
                inert: true,
                style: {
                  height: '160px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  borderBottom: `1px solid ${t.border}`,
                  background: 'radial-gradient(var(--ib-border) 1px,transparent 1px)',
                  backgroundSize: '18px 18px',
                },
              } as React.HTMLAttributes<HTMLDivElement>,
              renderPrimitiveCard(p.key),
            ),
            h(
              'div',
              {
                style: {
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              },
              h(
                'div',
                {},
                h(
                  Link,
                  {
                    href: ROUTES.primitive(p.key),
                    className: 'ib-cardlink',
                    style: {
                      display: 'block',
                      font: "600 14px 'Geist',sans-serif",
                      color: t.text,
                    },
                  },
                  p.name,
                ),
                h(
                  'div',
                  {
                    style: {
                      color: t.faint,
                      fontSize: '12px',
                      marginTop: '2px',
                      fontVariantNumeric: 'tabular-nums',
                    },
                  },
                  `${p.designs.length} design${p.designs.length > 1 ? 's' : ''}`,
                ),
              ),
              h(Badge, { t, tone: 'neutral' }, p.category),
            ),
          ),
        ),
        list.length === 0 &&
          h(
            'div',
            { style: { padding: '60px', textAlign: 'center', color: t.faint } },
            'Aucune primitive',
          ),
      ),
    ),
  );
}
