'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { BLOCKS } from '~/lib/blocks-data';
import { h } from '~/lib/h';
import { Reveal, useMagic } from '~/lib/motion';
import { ROUTES } from '~/lib/routes';
import { useUI } from '~/lib/ui-context';
import { Badge, Icon, Kbd } from './primitives';

const { useState, useEffect } = React;

/** ⌘K command palette: fuzzy-filter blocks and navigate to their detail page. */
export function Palette() {
  const { t, reduced, closePalette } = useUI();
  const router = useRouter();
  const [q, setQ] = useState('');
  const list = BLOCKS.filter(
    (b) =>
      b.name.toLowerCase().includes(q.toLowerCase()) ||
      b.cat.toLowerCase().includes(q.toLowerCase()),
  );
  const order = list.map((b) => b.key);
  const [active, setActive] = useState(order[0] ?? '');
  useEffect(() => {
    if (!order.includes(active)) setActive(order[0] ?? '');
  }, [q]);
  const M = useMagic(active, reduced);
  const openActive = () => {
    if (!active) return;
    closePalette();
    router.push(ROUTES.block(active));
  };
  const onKey = (e: React.KeyboardEvent) => {
    const i = order.indexOf(active);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(order[(i + 1) % order.length] ?? '');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(order[(i - 1 + order.length) % order.length] ?? '');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      openActive();
    }
  };
  return h(
    'div',
    {
      onClick: closePalette,
      className: 'ib-fade',
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(0,0,0,.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '12vh 16px 16px',
      },
    },
    h(
      'div',
      {
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        className: reduced ? 'ib-fade' : 'ib-pop',
        style: {
          width: '100%',
          maxWidth: '560px',
          background: t.panel,
          border: `1px solid ${t.borderStrong}`,
          borderRadius: '15px',
          boxShadow: t.shadow,
          overflow: 'hidden',
        },
      },
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 16px',
            borderBottom: `1px solid ${t.border}`,
          },
        },
        h(Icon, { name: 'search', size: 18, style: { color: t.faint } }),
        h('input', {
          autoFocus: true,
          value: q,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value),
          onKeyDown: onKey,
          placeholder: 'Rechercher un block…',
          style: {
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            font: "400 15px 'Geist',sans-serif",
            color: t.text,
          },
        }),
        h(Kbd, { t }, 'esc'),
      ),
      h(
        'div',
        {
          ref: M.wrapRef,
          className: 'ib-scroll',
          style: { position: 'relative', maxHeight: '52vh', overflow: 'auto', padding: '6px' },
        },
        h('div', {
          ref: M.hlRef,
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: '9px',
            background: t.accentSoft,
            border: `1px solid ${t.accentRing}`,
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0,
          },
        }),
        h(
          Reveal,
          { key: q, reduced, stagger: 26, y: 6, style: { position: 'relative', zIndex: 1 } },
          ...list.map((b) =>
            h(
              'div',
              {
                key: b.key,
                ref: M.setItem(b.key),
                onMouseEnter: () => setActive(b.key),
                onClick: openActive,
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  padding: '9px 11px',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  color: active === b.key ? t.text : t.muted,
                  position: 'relative',
                },
              },
              h(
                'span',
                {
                  style: {
                    display: 'inline-flex',
                    width: '26px',
                    height: '26px',
                    borderRadius: '7px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: t.panel2,
                    color: active === b.key ? t.accent : t.faint,
                  },
                },
                h(Icon, { name: b.icon || 'grid', size: 15 }),
              ),
              h(
                'span',
                { style: { flex: 1, fontSize: '14px', fontWeight: active === b.key ? 600 : 500 } },
                b.name,
              ),
              h(Badge, { t }, b.cat),
            ),
          ),
        ),
        list.length === 0 &&
          h(
            'div',
            { style: { padding: '28px', textAlign: 'center', color: t.faint, fontSize: '14px' } },
            'Aucun block',
          ),
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            gap: '14px',
            padding: '9px 14px',
            borderTop: `1px solid ${t.border}`,
            background: t.panel2,
            color: t.faint,
            fontSize: '12px',
          },
        },
        h(
          'span',
          { style: { display: 'flex', gap: '5px', alignItems: 'center' } },
          h(Kbd, { t }, '↑'),
          h(Kbd, { t }, '↓'),
          'naviguer',
        ),
        h(
          'span',
          { style: { display: 'flex', gap: '5px', alignItems: 'center' } },
          h(Kbd, { t }, '↵'),
          'ouvrir',
        ),
      ),
    ),
  );
}
