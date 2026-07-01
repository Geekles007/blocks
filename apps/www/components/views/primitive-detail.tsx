'use client';

import { useRouter } from 'next/navigation';
import { h } from '~/lib/h';
import { PRIMITIVES, type Primitive, getPrimitive } from '~/lib/primitives-data';
import { ROUTES } from '~/lib/routes';
import { useUI } from '~/lib/ui-context';
import { renderPrimitiveDesign } from '../primitive-showcase';
import { Badge, Button, Icon, SectionLabel } from '../primitives';

export function PrimitiveDetail({ primitiveKey }: { primitiveKey: string }) {
  const { t, reduced, copy } = useUI();
  const router = useRouter();
  const p = (getPrimitive(primitiveKey) ?? PRIMITIVES[0]) as Primitive;
  const siblings = PRIMITIVES.filter((x) => x.category === p.category);
  const cmd = `npx ibirdui add ${p.key}`;

  return h(
    'div',
    {
      className: 'ib-viewwrap',
      style: { maxWidth: '1280px', margin: '0 auto', width: '100%', minHeight: '74vh' },
    },
    h(
      'aside',
      {
        className: 'ib-side',
        style: { borderRight: `1px solid ${t.border}`, padding: '22px 14px' },
      },
      h(
        'button',
        {
          onClick: () => router.push(ROUTES.primitives),
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: t.faint,
            font: "500 12.5px 'Geist',sans-serif",
            marginBottom: '16px',
          },
        },
        h(Icon, { name: 'arrow', size: 14, style: { transform: 'rotate(180deg)' } }),
        'Primitives',
      ),
      h(SectionLabel, { t }, p.category),
      h(
        'nav',
        { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
        ...siblings.map((s) => {
          const a = s.key === p.key;
          return h(
            'button',
            {
              key: s.key,
              onClick: () => router.push(ROUTES.primitive(s.key)),
              style: {
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
            s.name,
          );
        }),
      ),
      h('div', { style: { height: '1px', background: t.border, margin: '16px 0' } }),
      h(SectionLabel, { t }, 'Designs'),
      h(
        'nav',
        { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
        ...p.designs.map((d) =>
          h(
            'a',
            {
              key: d.key,
              href: `#design-${d.key}`,
              className: 'ib-anchor',
              style: {
                color: t.muted,
                textDecoration: 'none',
                borderRadius: '8px',
                padding: '6px 10px',
                font: "500 13px 'Geist',sans-serif",
              },
            },
            d.name,
          ),
        ),
      ),
    ),
    h(
      'main',
      { style: { padding: '22px 24px', minWidth: 0 } },
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '4px',
            flexWrap: 'wrap',
          },
        },
        h(
          'h1',
          {
            style: {
              margin: 0,
              font: "700 24px 'Geist',sans-serif",
              letterSpacing: '-.02em',
              color: t.text,
            },
          },
          p.name,
        ),
        h(Badge, { t }, p.category),
      ),
      h(
        'p',
        {
          style: {
            margin: '0 0 16px',
            color: t.muted,
            fontSize: '14px',
            lineHeight: 1.55,
            maxWidth: '70ch',
          },
        },
        p.description,
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '28px',
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
            },
          },
          'Install',
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
      ),
      // One section per design (déclinaison), rendering its live variants.
      ...p.designs.map((d) =>
        h(
          'section',
          {
            key: d.key,
            id: `design-${d.key}`,
            style: {
              borderTop: `1px solid ${t.border}`,
              paddingTop: '22px',
              marginBottom: '22px',
              scrollMarginTop: '72px',
            },
          },
          h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '4px',
              },
            },
            h(
              'h2',
              {
                style: {
                  margin: 0,
                  font: "600 17px 'Geist',sans-serif",
                  letterSpacing: '-.01em',
                  color: t.text,
                },
              },
              d.name,
            ),
            h(
              'code',
              {
                style: {
                  fontFamily: "'Geist Mono',monospace",
                  fontSize: '11.5px',
                  color: t.faint,
                },
              },
              `variant="${d.key}"`,
            ),
          ),
          h(
            'p',
            {
              style: {
                margin: '0 0 16px',
                color: t.muted,
                fontSize: '13.5px',
                lineHeight: 1.5,
                maxWidth: '70ch',
              },
            },
            d.description,
          ),
          h(
            'div',
            {
              style: {
                border: `1px solid ${t.border}`,
                borderRadius: '12px',
                padding: '24px 22px',
                background: 'radial-gradient(var(--ib-border) 1px,transparent 1px)',
                backgroundSize: '20px 20px',
              },
            },
            renderPrimitiveDesign(p.key, d.key),
          ),
        ),
      ),
    ),
  );
}
