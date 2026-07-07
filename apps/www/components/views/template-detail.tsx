'use client';

import Link from 'next/link';
import * as React from 'react';
import { getBlock } from '~/lib/blocks-data';
import { h } from '~/lib/h';
import { addCommands } from '~/lib/install-command';
import { ROUTES } from '~/lib/routes';
import { getTemplate, isShipped, templateText } from '~/lib/templates-data';
import { useUI } from '~/lib/ui-context';
import { PreviewFrame } from '../preview-frame';
import { renderTemplatePreview } from '../previews';
import { Badge, Icon } from '../primitives';

const { useState } = React;

/** Detail page for one template: header, composed blocks, install, live preview. */
export function TemplateDetail({ templateKey }: { templateKey: string }) {
  const { t, m, reduced, theme, locale, copy } = useUI();
  const tpl = getTemplate(templateKey);
  const [pm, setPm] = useState(0);

  if (!tpl) return null; // the route already 404s on unknown keys
  const text = templateText(tpl, locale);
  const shipped = isShipped(tpl);
  const cmds =
    shipped && tpl.registryKey ? addCommands(`blocks.ibird.dev/r/${tpl.registryKey}`) : [];
  const cmd = cmds[pm]?.cmd ?? '';

  return h(
    'div',
    { style: { maxWidth: '1180px', margin: '0 auto', width: '100%', padding: '8px 24px 0' } },

    // back link
    h(
      Link,
      {
        href: ROUTES.templates,
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: t.muted,
          textDecoration: 'none',
          font: "500 13px 'Geist',sans-serif",
          padding: '18px 0 10px',
        },
      },
      h('span', { 'aria-hidden': true }, '←'),
      m.templates.detailBack,
    ),

    // header
    h(
      'div',
      { style: { padding: '2px 0 22px' } },
      h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } },
        h(
          'h1',
          {
            style: {
              margin: 0,
              font: "700 26px 'Geist',sans-serif",
              letterSpacing: '-.02em',
              color: t.text,
            },
          },
          text.name,
        ),
        shipped
          ? h(Badge, { t, tone: 'success', dot: true }, m.templates.ready)
          : h(Badge, { t, tone: 'neutral' }, m.common.soon),
        h(Badge, { t, tone: 'neutral' }, tpl.cat),
      ),
      h(
        'p',
        {
          style: {
            margin: '10px 0 0',
            maxWidth: '640px',
            color: t.muted,
            fontSize: '14.5px',
            lineHeight: 1.6,
          },
        },
        text.description,
      ),
    ),

    // composed of
    tpl.blocks && tpl.blocks.length > 0
      ? h(
          'div',
          { style: { marginBottom: '22px' } },
          h(
            'div',
            {
              style: {
                font: "600 11px 'Geist',sans-serif",
                letterSpacing: '.05em',
                textTransform: 'uppercase',
                color: t.faint,
                marginBottom: '9px',
              },
            },
            m.templates.composedOf,
          ),
          h(
            'div',
            { style: { display: 'flex', flexWrap: 'wrap', gap: '7px' } },
            ...tpl.blocks.map((bk) =>
              h(
                Link,
                {
                  key: bk,
                  href: ROUTES.block(bk),
                  style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 11px',
                    borderRadius: '999px',
                    border: `1px solid ${t.border}`,
                    background: t.panel2,
                    color: t.muted,
                    textDecoration: 'none',
                    font: "500 12.5px 'Geist',sans-serif",
                  },
                },
                getBlock(bk)?.name ?? bk,
              ),
            ),
          ),
        )
      : null,

    // install
    shipped
      ? h(
          'div',
          {
            style: {
              border: `1px solid ${t.border}`,
              borderRadius: '14px',
              background: t.panel,
              padding: '16px 16px 18px',
              marginBottom: '22px',
            },
          },
          h(
            'div',
            { style: { font: "600 14px 'Geist',sans-serif", color: t.text } },
            m.templates.install,
          ),
          h(
            'p',
            {
              style: {
                margin: '5px 0 12px',
                color: t.faint,
                fontSize: '13px',
                lineHeight: 1.5,
                maxWidth: '640px',
              },
            },
            m.templates.installBlurb,
          ),
          // pm tabs
          h(
            'div',
            {
              style: {
                display: 'inline-flex',
                gap: '2px',
                padding: '3px',
                borderRadius: '9px',
                background: t.panel2,
                border: `1px solid ${t.border}`,
                marginBottom: '10px',
              },
            },
            ...cmds.map((c, i) =>
              h(
                'button',
                {
                  key: c.pm,
                  type: 'button',
                  onClick: () => setPm(i),
                  style: {
                    font: "600 12px 'Geist Mono',monospace",
                    padding: '5px 11px',
                    borderRadius: '7px',
                    border: 'none',
                    cursor: 'pointer',
                    background: pm === i ? t.accentSoft2 : 'transparent',
                    color: pm === i ? t.accent : t.muted,
                  },
                },
                c.pm,
              ),
            ),
          ),
          // command row
          h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: t.bg2,
                border: `1px solid ${t.border}`,
                borderRadius: '10px',
                padding: '10px 12px',
              },
            },
            h(
              'span',
              {
                'aria-hidden': true,
                style: { color: t.faint, fontFamily: "'Geist Mono',monospace", fontSize: '13px' },
              },
              '$',
            ),
            h(
              'code',
              {
                style: {
                  flex: 1,
                  minWidth: 0,
                  overflowX: 'auto',
                  color: t.text,
                  fontFamily: "'Geist Mono',monospace",
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                },
              },
              cmd,
            ),
            h(
              'button',
              {
                type: 'button',
                onClick: () => copy(cmd, m.common.copied),
                'aria-label': m.codeDrawer.copyCmd(cmd),
                style: {
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: `1px solid ${t.border}`,
                  background: t.panel2,
                  color: t.muted,
                  cursor: 'pointer',
                  font: "600 12px 'Geist',sans-serif",
                },
              },
              h(Icon, { name: 'copy', size: 14 }),
              m.common.copy,
            ),
          ),
        )
      : h(
          'p',
          { style: { color: t.faint, fontSize: '13.5px', marginBottom: '22px' } },
          m.templates.soonHint,
        ),

    // live preview
    h(
      'div',
      { style: { marginBottom: '40px' } },
      h(
        'div',
        {
          style: {
            font: "600 11px 'Geist',sans-serif",
            letterSpacing: '.05em',
            textTransform: 'uppercase',
            color: t.faint,
            marginBottom: '10px',
          },
        },
        m.templates.livePreview,
      ),
      h(
        'div',
        {
          style: {
            border: `1px solid ${t.border}`,
            borderRadius: '14px',
            overflow: 'hidden',
            background: t.bg,
          },
        },
        h(
          PreviewFrame,
          { key: tpl.key, theme, reduced, minHeight: 600 },
          renderTemplatePreview(tpl.registryKey ?? tpl.key),
        ),
      ),
    ),
  );
}
