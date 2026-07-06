'use client';

import type * as React from 'react';
import { type Block, resolveSpec } from '~/lib/blocks-data';
import { type CSS, h } from '~/lib/h';
import type { Tok } from '~/lib/tokens';
import { useUI } from '~/lib/ui-context';

/** Dev-facing spec (composition, structure, responsive, choreography) shown
 *  below the live preview on a block's detail page. */
export function SpecGrid({ t, b }: { t: Tok; b: Block }) {
  const { m, locale } = useUI();
  const spec = resolveSpec(b.key, locale);
  const primitives = spec?.primitives ?? b.prims;
  const variants = spec?.variants ?? b.variants;
  const cardStyle: CSS = {
    background: t.panel,
    border: `1px solid ${t.border}`,
    borderRadius: '14px',
    padding: '16px 17px',
    boxShadow: t.shadowSm,
  };
  const headStyle: CSS = {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '.04em',
    textTransform: 'uppercase',
    color: t.faint,
    marginBottom: '10px',
  };
  const pillStyle: CSS = {
    fontFamily: "'Geist Mono',monospace",
    fontSize: '11px',
    color: t.accent,
    background: t.accentSoft2,
    border: `1px solid ${t.accentRing}`,
    borderRadius: '6px',
    padding: '3px 7px',
  };
  const bpStyle: CSS = {
    fontSize: '11px',
    fontWeight: 600,
    color: t.text,
    background: t.panel2,
    border: `1px solid ${t.border}`,
    borderRadius: '6px',
    padding: '2px 7px',
    flexShrink: 0,
    minWidth: '56px',
    textAlign: 'center',
  };
  const rmStyle: CSS = {
    fontFamily: "'Geist Mono',monospace",
    fontSize: '10.5px',
    color: t.muted,
    background: t.panel2,
    border: `1px solid ${t.border}`,
    borderRadius: '5px',
    padding: '2px 6px',
    flexShrink: 0,
  };
  const codeStyle: CSS = {
    fontFamily: "'Geist Mono',monospace",
    fontSize: '12px',
    color: t.text,
    background: t.panel2,
    border: `1px solid ${t.border}`,
    borderRadius: '7px',
    padding: '4px 9px',
  };
  const card = (head: string, ...children: React.ReactNode[]) =>
    h('div', { style: cardStyle }, h('div', { style: headStyle }, head), ...children);

  return h(
    'section',
    { style: { marginTop: '26px', borderTop: `1px solid ${t.border}`, paddingTop: '24px' } },
    h(
      'h2',
      {
        style: {
          margin: '8px 0 6px',
          font: "600 19px 'Geist',sans-serif",
          letterSpacing: '-.02em',
          color: t.text,
        },
      },
      m.spec.title,
    ),
    spec?.concept
      ? h(
          'p',
          {
            style: {
              margin: '0 0 18px',
              color: t.muted,
              fontSize: '14px',
              lineHeight: 1.55,
              maxWidth: '70ch',
            },
          },
          spec.concept,
        )
      : h(
          'p',
          {
            style: {
              margin: '0 0 18px',
              color: t.muted,
              fontSize: '14px',
              lineHeight: 1.55,
              maxWidth: '70ch',
            },
          },
          m.spec.fallbackConcept(b.name),
        ),
    h(
      'div',
      { className: 'bm-specgrid' },
      card(
        m.spec.composition,
        h(
          'div',
          {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: spec?.composition?.length ? '11px' : 0,
            },
          },
          ...primitives.map((p) => h('span', { key: p, style: pillStyle }, p)),
        ),
        spec?.composition?.length
          ? h(
              'ul',
              {
                style: {
                  margin: 0,
                  paddingLeft: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                },
              },
              ...spec.composition.map((c) =>
                h(
                  'li',
                  { key: c, style: { color: t.muted, fontSize: '13px', lineHeight: 1.5 } },
                  c,
                ),
              ),
            )
          : null,
      ),
      spec?.structure
        ? card(
            m.spec.structure,
            h(
              'p',
              { style: { margin: 0, color: t.muted, fontSize: '13px', lineHeight: 1.55 } },
              spec.structure,
            ),
          )
        : null,
      spec?.responsive?.length
        ? card(
            m.spec.responsive,
            h(
              'div',
              { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
              ...spec.responsive.map((r) =>
                h(
                  'div',
                  { key: r.bp, style: { display: 'flex', gap: '9px', alignItems: 'baseline' } },
                  h('span', { style: bpStyle }, r.bp),
                  h(
                    'span',
                    { style: { color: t.muted, fontSize: '13px', lineHeight: 1.5 } },
                    r.txt,
                  ),
                ),
              ),
            ),
          )
        : null,
      spec?.choreography
        ? card(
            m.spec.choreography,
            h(
              'p',
              { style: { margin: '0 0 10px', color: t.muted, fontSize: '13px', lineHeight: 1.55 } },
              spec.choreography,
            ),
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                  paddingTop: '9px',
                  borderTop: `1px solid ${t.border}`,
                },
              },
              h('span', { style: rmStyle }, 'reduced-motion'),
              h(
                'span',
                { style: { color: t.faint, fontSize: '12.5px', lineHeight: 1.5 } },
                spec.fallback,
              ),
            ),
          )
        : null,
      h(
        'div',
        { style: { ...cardStyle, gridColumn: '1 / -1' } },
        h('div', { style: headStyle }, m.spec.variants),
        h(
          'div',
          { style: { display: 'flex', flexWrap: 'wrap', gap: '7px' } },
          ...variants.map((v) => h('code', { key: v, style: codeStyle }, v)),
        ),
      ),
    ),
  );
}
