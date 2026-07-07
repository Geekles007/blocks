'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { BLOCKS, CATS, countInCat } from '~/lib/blocks-data';
import { h } from '~/lib/h';
import { Reveal } from '~/lib/motion';
import { ROUTES } from '~/lib/routes';
import { useUI } from '~/lib/ui-context';
import { CardSkeleton } from '../card-skeleton';
import { Badge, Icon, SectionLabel } from '../primitives';

const { useState } = React;

export function Catalogue() {
  const { t, m, reduced } = useUI();
  const router = useRouter();
  const [cur, setCur] = useState('all');
  const [q, setQ] = useState('');
  const catLabel = (c: string) => (c === 'all' ? m.catalogue.all : c);
  const list = BLOCKS.filter(
    (b) => (cur === 'all' || b.cat === cur) && b.name.toLowerCase().includes(q.toLowerCase()),
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
      h(SectionLabel, { t, style: { padding: '0 8px 8px' } }, m.catalogue.categories),
      h(
        'nav',
        { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
        ...['all', ...CATS].map((c) => {
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
            catLabel(c),
            h(
              'span',
              { style: { color: t.faint, fontSize: '11px', fontFamily: "'Geist Mono',monospace" } },
              String(countInCat(c)),
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
          {},
          h(
            'h1',
            {
              style: {
                margin: '0 0 4px',
                font: "700 22px 'Geist',sans-serif",
                letterSpacing: '-.02em',
                color: t.text,
              },
            },
            catLabel(cur),
          ),
          h(
            'p',
            { style: { margin: 0, color: t.faint, fontSize: '13.5px' } },
            m.catalogue.summary(
              list.length,
              list.reduce((a, b) => a + b.variants.length, 0),
            ),
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
            placeholder: m.catalogue.filter,
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
        ...list.map((b) =>
          h(
            'div',
            {
              key: b.key,
              onClick: () => router.push(ROUTES.block(b.key)),
              style: {
                cursor: 'pointer',
                background: t.bg2,
                border: `1px solid ${t.border}`,
                borderRadius: '14px',
                overflow: 'hidden',
                transition: 'border-color .2s,transform .2s',
              },
              onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.borderColor = t.accentRing;
                if (!reduced) e.currentTarget.style.transform = 'translateY(-2px)';
              },
              onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.borderColor = t.border;
                e.currentTarget.style.transform = 'none';
              },
            },
            h(
              'div',
              {
                style: {
                  height: '186px',
                  overflow: 'hidden',
                  position: 'relative',
                  borderBottom: `1px solid ${t.border}`,
                  background: 'radial-gradient(var(--ib-border) 1px,transparent 1px)',
                  backgroundSize: '18px 18px',
                },
              },
              h(CardSkeleton, { t, kind: b.preview }),
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
                h('div', { style: { font: "600 14px 'Geist',sans-serif", color: t.text } }, b.name),
                h(
                  'div',
                  { style: { color: t.faint, fontSize: '12px', marginTop: '2px' } },
                  m.catalogue.variants(b.variants.length),
                ),
              ),
              h(Badge, { t, tone: 'neutral' }, b.cat),
            ),
          ),
        ),
        list.length === 0 &&
          h(
            'div',
            { style: { padding: '60px', textAlign: 'center', color: t.faint } },
            m.catalogue.empty,
          ),
      ),
    ),
  );
}
