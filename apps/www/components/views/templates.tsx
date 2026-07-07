'use client';

import * as React from 'react';
import { h } from '~/lib/h';
import type { Locale, Messages } from '~/lib/i18n';
import { Reveal } from '~/lib/motion';
import {
  TEMPLATES,
  TEMPLATE_CATS,
  type Template,
  type TemplateShape,
  countTemplates,
  isShipped,
  templateText,
} from '~/lib/templates-data';
import type { Tok } from '~/lib/tokens';
import { useUI } from '~/lib/ui-context';
import { Badge, Icon } from '../primitives';

const { useState } = React;

// ── Wireframe previews ──────────────────────────────────────────────────────
// A lightweight browser-framed silhouette per template shape. These are honest
// placeholders (bars, not fake screenshots): they suggest the page's structure
// without claiming content that isn't built yet. All fills read from tokens so
// they re-theme with the site.
function bar(t: Tok, w: string | number, height: number, extra: React.CSSProperties = {}) {
  return h('div', {
    style: { width: w, height: `${height}px`, borderRadius: '4px', background: t.panel2, ...extra },
  });
}

function shapeContent(t: Tok, shape: TemplateShape): React.ReactNode {
  const col = (children: React.ReactNode[], style: React.CSSProperties = {}) =>
    h('div', { style: { display: 'flex', flexDirection: 'column', ...style } }, ...children);
  const row = (children: React.ReactNode[], style: React.CSSProperties = {}) =>
    h('div', { style: { display: 'flex', alignItems: 'center', ...style } }, ...children);
  const accentBar = (w: string | number, height: number, extra: React.CSSProperties = {}) =>
    bar(t, w, height, { background: t.accent, ...extra });

  if (shape === 'landing') {
    return col(
      [
        row([
          bar(t, 30, 8),
          h('div', { style: { flex: 1 } }),
          row([bar(t, 16, 6), bar(t, 16, 6), bar(t, 16, 6)], { gap: '5px' }),
        ]),
        col(
          [
            bar(t, '68%', 9),
            bar(t, '44%', 7),
            row([accentBar(38, 12), bar(t, 30, 12)], { gap: '6px', marginTop: '2px' }),
          ],
          { alignItems: 'center', gap: '6px', margin: '4px 0' },
        ),
        row([bar(t, '100%', 34), bar(t, '100%', 34), bar(t, '100%', 34)], {
          gap: '7px',
          alignItems: 'stretch',
        }),
      ],
      { gap: '11px' },
    );
  }

  if (shape === 'pricing') {
    return col(
      [
        col([bar(t, '46%', 8), bar(t, '30%', 6)], {
          alignItems: 'center',
          gap: '5px',
          marginBottom: '2px',
        }),
        row(
          [
            bar(t, '100%', 84, { alignSelf: 'flex-end' }),
            h('div', {
              style: {
                width: '100%',
                height: '100px',
                borderRadius: '6px',
                background: t.accentSoft2,
                border: `1px solid ${t.accentRing}`,
              },
            }),
            bar(t, '100%', 84, { alignSelf: 'flex-end' }),
          ],
          { gap: '8px', alignItems: 'flex-end' },
        ),
      ],
      { gap: '10px' },
    );
  }

  if (shape === 'dashboard') {
    const tile = () => bar(t, '100%', 26);
    return row(
      [
        bar(t, 30, 136, { alignSelf: 'stretch', height: 'auto' }),
        col(
          [
            row([bar(t, '40%', 8), h('div', { style: { flex: 1 } }), bar(t, 18, 8)]),
            h(
              'div',
              {
                style: {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '7px',
                },
              },
              tile(),
              tile(),
              tile(),
              tile(),
            ),
            bar(t, '100%', 34),
          ],
          { flex: 1, gap: '9px' },
        ),
      ],
      { gap: '9px', alignItems: 'stretch', height: '100%' },
    );
  }

  // auth
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      },
    },
    col(
      [
        bar(t, '54%', 8, { margin: '0 auto' }),
        bar(t, '100%', 12),
        bar(t, '100%', 12),
        bar(t, '100%', 12, { background: t.accent, marginTop: '2px' }),
      ],
      {
        width: '66%',
        gap: '9px',
        padding: '16px',
        borderRadius: '10px',
        background: t.panel,
        border: `1px solid ${t.border}`,
      },
    ),
  );
}

function TemplateFrame({ t, shape }: { t: Tok; shape: TemplateShape }) {
  const dot = () =>
    h('span', {
      style: { width: '7px', height: '7px', borderRadius: '50%', background: t.border },
    });
  return h(
    'div',
    { style: { height: '100%', display: 'flex', flexDirection: 'column' } },
    // browser chrome
    h(
      'div',
      {
        style: {
          height: '26px',
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '0 10px',
          borderBottom: `1px solid ${t.border}`,
          background: t.panel,
        },
      },
      dot(),
      dot(),
      dot(),
      h('div', {
        style: {
          flex: 1,
          maxWidth: '150px',
          height: '10px',
          borderRadius: '999px',
          background: t.panel2,
          marginLeft: '6px',
        },
      }),
    ),
    // page silhouette
    h('div', { style: { flex: 1, padding: '12px', overflow: 'hidden' } }, shapeContent(t, shape)),
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export function Templates() {
  const { t, m, reduced, locale } = useUI();
  const [cur, setCur] = useState('all');
  const [q, setQ] = useState('');
  const catLabel = (c: string) => (c === 'all' ? m.templates.all : c);

  const list = TEMPLATES.filter((tpl) => {
    const inCat = cur === 'all' || tpl.cat === cur;
    const text = templateText(tpl, locale);
    return inCat && `${text.name} ${tpl.cat}`.toLowerCase().includes(q.toLowerCase());
  });

  return h(
    'div',
    { style: { maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '8px 24px 0' } },
    // header
    h(
      'div',
      { style: { padding: '20px 0 26px' } },
      h(Badge, { t, tone: 'accent', dot: true }, m.templates.kicker),
      h(
        'h1',
        {
          style: {
            margin: '14px 0 0',
            font: "700 30px 'Geist',sans-serif",
            letterSpacing: '-.03em',
            color: t.text,
            lineHeight: 1.1,
          },
        },
        m.templates.titleLead,
        h('span', { style: { color: t.accent } }, m.templates.titleAccent),
      ),
      h(
        'p',
        {
          style: {
            margin: '12px 0 0',
            maxWidth: '640px',
            color: t.muted,
            fontSize: '15px',
            lineHeight: 1.6,
          },
        },
        m.templates.subtitle,
      ),
    ),

    // toolbar: category chips + search
    h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          flexWrap: 'wrap',
          borderTop: `1px solid ${t.border}`,
          paddingTop: '18px',
          marginBottom: '20px',
        },
      },
      h(
        'div',
        { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
        ...['all', ...TEMPLATE_CATS].map((c) => {
          const a = cur === c;
          return h(
            'button',
            {
              key: c,
              type: 'button',
              onClick: () => setCur(c),
              style: {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                background: a ? t.text : 'transparent',
                border: `1px solid ${a ? t.text : t.border}`,
                color: a ? t.bg : t.muted,
                borderRadius: '999px',
                padding: '5px 12px',
                cursor: 'pointer',
                font: "500 12.5px 'Geist',sans-serif",
              },
            },
            catLabel(c),
            h(
              'span',
              {
                style: {
                  fontFamily: "'Geist Mono',monospace",
                  fontSize: '11px',
                  color: a ? t.bg : t.faint,
                  opacity: a ? 0.7 : 1,
                },
              },
              String(countTemplates(c)),
            ),
          );
        }),
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
          placeholder: m.templates.filter,
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

    // grid
    h(
      Reveal,
      { key: cur + q, reduced, stagger: 50, y: 14, className: 'ib-catgrid' },
      ...list.map((tpl) => card(t, m, tpl, locale)),
      list.length === 0 &&
        h(
          'div',
          { style: { padding: '60px', textAlign: 'center', color: t.faint } },
          m.templates.empty,
        ),
    ),

    // footer note
    h(
      'p',
      {
        style: {
          margin: '30px 0 0',
          paddingTop: '18px',
          borderTop: `1px solid ${t.border}`,
          color: t.faint,
          fontSize: '13px',
        },
      },
      m.templates.footerNote,
    ),
  );
}

// A single template card: framed silhouette + name/description + category, plus a
// "Soon" badge for roadmap entries (the honest default until a template ships).
function card(t: Tok, m: Messages, tpl: Template, locale: Locale) {
  const shipped = isShipped(tpl);
  const text = templateText(tpl, locale);
  return h(
    'div',
    {
      key: tpl.key,
      style: {
        background: t.bg2,
        border: `1px solid ${t.border}`,
        borderRadius: '14px',
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
          height: '186px',
          overflow: 'hidden',
          position: 'relative',
          borderBottom: `1px solid ${t.border}`,
          background: 'radial-gradient(var(--ib-border) 1px,transparent 1px)',
          backgroundSize: '18px 18px',
        },
      },
      h(TemplateFrame, { t, shape: tpl.shape }),
    ),
    h(
      'div',
      { style: { padding: '13px 15px' } },
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          },
        },
        h('div', { style: { font: "600 14.5px 'Geist',sans-serif", color: t.text } }, text.name),
        shipped
          ? h(Badge, { t, tone: 'success', dot: true }, m.templates.ready)
          : h(Badge, { t, tone: 'neutral' }, m.common.soon),
      ),
      h(
        'p',
        {
          style: {
            margin: '5px 0 0',
            color: t.faint,
            fontSize: '12.5px',
            lineHeight: 1.5,
          },
        },
        text.description,
      ),
      h('div', { style: { marginTop: '11px' } }, h(Badge, { t, tone: 'neutral' }, tpl.cat)),
    ),
  );
}
