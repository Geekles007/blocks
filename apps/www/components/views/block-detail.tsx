'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { BLOCKS, type Block, getBlock, siblingsOf } from '~/lib/blocks-data';
import { h } from '~/lib/h';
import { ROUTES } from '~/lib/routes';
import { useUI } from '~/lib/ui-context';
import { PreviewFrame } from '../preview-frame';
import { renderPreview } from '../previews';
import { Badge, Button, Icon, PrimPill, SectionLabel } from '../primitives';
import { SpecGrid } from '../spec-grid';

const { useState } = React;

type Bp = 'desktop' | 'tablet' | 'mobile';
type Tab = 'preview' | 'code';

export function BlockDetail({ blockKey }: { blockKey: string }) {
  const { t, reduced, theme, copy, toggleTheme } = useUI();
  const router = useRouter();
  const b = (getBlock(blockKey) ?? BLOCKS[0]) as Block;
  const [variant, setVariant] = useState(0);
  const [bp, setBp] = useState<Bp>('desktop');
  const [tab, setTab] = useState<Tab>('preview');
  const [fullscreen, setFullscreen] = useState(false);

  // Close the fullscreen overlay on Escape, and lock body scroll while it's open.
  React.useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [fullscreen, setFullscreen]);

  const siblings = siblingsOf(b);
  const width = bp === 'mobile' ? '390px' : bp === 'tablet' ? '768px' : '100%';
  const vid = b.variants[variant] ?? b.variants[0] ?? '';
  const compName = b.name.replace(/[^A-Za-z]/g, '');
  // The install command and import path key off the registry item name (b.key,
  // e.g. "pricing-toggle") — NOT the variant id (which is usually "default").
  // The CLI writes the block to components/blocks/<key>.tsx.
  const code = `import { ${compName} } from "@/components/blocks/${b.key}"\n\nexport default function Page() {\n  return <${compName} />\n}`;
  const cmd = `npx ibirdui add blocks.ibird.dev/r/${b.key}`;
  const bpBtn = (id: Bp, icon: string) =>
    h(
      'button',
      {
        onClick: () => setBp(id),
        title: id,
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '30px',
          height: '30px',
          borderRadius: '7px',
          cursor: 'pointer',
          border: `1px solid ${bp === id ? t.border : 'transparent'}`,
          background: bp === id ? t.panel : 'transparent',
          color: bp === id ? t.text : t.faint,
        },
      },
      h(Icon, { name: icon, size: 16 }),
    );
  const tabBtn = (id: Tab, label: string) =>
    h(
      'button',
      {
        onClick: () => setTab(id),
        style: {
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 4px',
          font: "600 13px 'Geist',sans-serif",
          color: tab === id ? t.text : t.faint,
        },
      },
      label,
      tab === id &&
        h('span', {
          style: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '-9px',
            height: '2px',
            background: t.accent,
            borderRadius: '2px',
          },
        }),
    );
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
          onClick: () => router.push(ROUTES.catalogue),
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
        'Catalogue',
      ),
      h(SectionLabel, { t }, b.cat),
      h(
        'nav',
        { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
        ...siblings.map((s) => {
          const a = s.key === b.key;
          return h(
            'button',
            {
              key: s.key,
              onClick: () => {
                setVariant(0);
                router.push(ROUTES.block(s.key));
              },
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
      h(SectionLabel, { t }, 'Primitives ibirdui'),
      h(
        'div',
        { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '0 4px' } },
        ...b.prims.map((p) => h(PrimPill, { key: p, t }, p)),
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
              font: "700 22px 'Geist',sans-serif",
              letterSpacing: '-.02em',
              color: t.text,
            },
          },
          b.name,
        ),
        h(Badge, { t }, b.cat),
      ),
      h(
        'p',
        { style: { margin: '0 0 16px', color: t.faint, fontSize: '13.5px' } },
        'Variante ',
        h('code', { style: { fontFamily: "'Geist Mono',monospace", color: t.muted } }, vid),
        ` · composé sur ${b.prims.length} primitives`,
      ),
      h(
        'div',
        { style: { display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' } },
        ...b.variants.map((vv, i) =>
          h(
            'button',
            {
              key: vv,
              onClick: () => setVariant(i),
              style: {
                background: variant === i ? t.panel : 'transparent',
                border: `1px solid ${variant === i ? t.borderStrong : t.border}`,
                color: variant === i ? t.text : t.muted,
                borderRadius: '8px',
                padding: '6px 11px',
                cursor: 'pointer',
                fontFamily: "'Geist Mono',monospace",
                fontSize: '12px',
              },
            },
            vv,
          ),
        ),
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            padding: '8px 10px',
            border: `1px solid ${t.border}`,
            borderRadius: '11px 11px 0 0',
            background: t.panel,
            flexWrap: 'wrap',
          },
        },
        h(
          'div',
          { style: { display: 'flex', gap: '14px', alignItems: 'center' } },
          h(
            'div',
            { style: { display: 'flex', gap: '2px' } },
            tabBtn('preview', 'Preview'),
            h('span', { style: { width: '14px' } }),
            tabBtn('code', 'Code'),
          ),
        ),
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
          h(
            'div',
            {
              style: {
                display: 'flex',
                gap: '2px',
                background: t.bg2,
                borderRadius: '8px',
                padding: '2px',
              },
            },
            bpBtn('desktop', 'monitor'),
            bpBtn('tablet', 'tablet'),
            bpBtn('mobile', 'phone'),
          ),
          h('span', {
            style: { width: '1px', height: '20px', background: t.border, margin: '0 4px' },
          }),
          h(
            'button',
            {
              onClick: toggleTheme,
              title: 'Thème',
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '7px',
                border: `1px solid ${t.border}`,
                background: t.bg2,
                color: t.muted,
                cursor: 'pointer',
              },
            },
            h(Icon, { name: theme === 'dark' ? 'sun' : 'moon', size: 15 }),
          ),
          h(
            'button',
            {
              onClick: () => {
                setTab('preview');
                setFullscreen(true);
              },
              title: 'Plein écran',
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '7px',
                border: `1px solid ${t.border}`,
                background: t.bg2,
                color: t.muted,
                cursor: 'pointer',
              },
            },
            h(Icon, { name: 'maximize', size: 15 }),
          ),
        ),
      ),
      tab === 'preview'
        ? h(
            'div',
            {
              style: {
                border: `1px solid ${t.border}`,
                borderTop: 'none',
                borderRadius: '0 0 11px 11px',
                padding: '30px 20px',
                display: 'flex',
                justifyContent: 'center',
                background: 'radial-gradient(var(--ib-border) 1px,transparent 1px)',
                backgroundSize: '22px 22px',
                minHeight: '420px',
                alignItems: 'center',
              },
            },
            h(
              'div',
              {
                style: {
                  width,
                  maxWidth: '100%',
                  transition: reduced ? 'none' : 'width .5s cubic-bezier(.22,1,.36,1)',
                },
              },
              h(
                PreviewFrame,
                { key: b.preview, theme, reduced, minHeight: 360 },
                h(
                  'div',
                  { key: b.key + variant + bp },
                  renderPreview(b.preview, { t, reduced, v: variant }),
                ),
              ),
            ),
          )
        : h(
            'div',
            {
              style: {
                border: `1px solid ${t.border}`,
                borderTop: 'none',
                borderRadius: '0 0 11px 11px',
                background: t.panel,
                position: 'relative',
              },
            },
            h(
              'button',
              {
                onClick: () => copy(code, 'Code copié'),
                style: {
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: t.bg2,
                  border: `1px solid ${t.border}`,
                  borderRadius: '8px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  color: t.muted,
                  font: "500 12px 'Geist',sans-serif",
                },
              },
              h(Icon, { name: 'copy', size: 14 }),
              'Copier',
            ),
            h(
              'pre',
              {
                style: {
                  margin: 0,
                  padding: '20px',
                  overflow: 'auto',
                  fontFamily: "'Geist Mono',monospace",
                  fontSize: '13px',
                  lineHeight: 1.7,
                  color: t.text,
                },
              },
              code,
            ),
          ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '16px',
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
      h(SpecGrid, { t, b }),
    ),
    fullscreen &&
      h(
        'div',
        {
          role: 'dialog',
          'aria-modal': true,
          'aria-label': `${b.name} — aperçu plein écran`,
          onClick: () => setFullscreen(false),
          style: {
            position: 'fixed',
            inset: 0,
            zIndex: 90,
            display: 'flex',
            flexDirection: 'column',
            background: t.bg,
          },
        },
        h(
          'div',
          {
            onClick: (e: React.MouseEvent) => e.stopPropagation(),
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '10px 16px',
              borderBottom: `1px solid ${t.border}`,
              background: t.panel,
              flexWrap: 'wrap',
            },
          },
          h(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
            h('span', { style: { font: "600 14px 'Geist',sans-serif", color: t.text } }, b.name),
            h(Badge, { t }, b.cat),
            h(
              'code',
              { style: { fontFamily: "'Geist Mono',monospace", fontSize: '12px', color: t.faint } },
              vid,
            ),
          ),
          h(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  gap: '2px',
                  background: t.bg2,
                  borderRadius: '8px',
                  padding: '2px',
                },
              },
              bpBtn('desktop', 'monitor'),
              bpBtn('tablet', 'tablet'),
              bpBtn('mobile', 'phone'),
            ),
            h('span', {
              style: { width: '1px', height: '20px', background: t.border, margin: '0 4px' },
            }),
            h(
              'button',
              {
                onClick: toggleTheme,
                title: 'Thème',
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '30px',
                  height: '30px',
                  borderRadius: '7px',
                  border: `1px solid ${t.border}`,
                  background: t.bg2,
                  color: t.muted,
                  cursor: 'pointer',
                },
              },
              h(Icon, { name: theme === 'dark' ? 'sun' : 'moon', size: 15 }),
            ),
            h(
              'button',
              {
                onClick: () => setFullscreen(false),
                title: 'Quitter le plein écran (Échap)',
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '30px',
                  height: '30px',
                  borderRadius: '7px',
                  border: `1px solid ${t.border}`,
                  background: t.bg2,
                  color: t.muted,
                  cursor: 'pointer',
                },
              },
              h(Icon, { name: 'close', size: 15 }),
            ),
          ),
        ),
        h(
          'div',
          {
            onClick: (e: React.MouseEvent) => e.stopPropagation(),
            style: {
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: '40px 24px',
              background: 'radial-gradient(var(--ib-border) 1px,transparent 1px)',
              backgroundSize: '22px 22px',
            },
          },
          h(
            'div',
            {
              style: {
                width,
                maxWidth: '100%',
                transition: reduced ? 'none' : 'width .5s cubic-bezier(.22,1,.36,1)',
              },
            },
            h(
              PreviewFrame,
              { key: `fs-${b.preview}`, theme, reduced, minHeight: 360 },
              h(
                'div',
                { key: b.key + variant + bp },
                renderPreview(b.preview, { t, reduced, v: variant }),
              ),
            ),
          ),
        ),
      ),
  );
}
