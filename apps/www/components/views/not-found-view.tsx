'use client';

import Link from 'next/link';
import { h } from '~/lib/h';
import { ROUTES } from '~/lib/routes';
import { useUI } from '~/lib/ui-context';
import { Icon } from '../primitives';

export function NotFoundView() {
  const { t, m } = useUI();
  return h(
    'div',
    {
      style: {
        minHeight: '64vh',
        maxWidth: '520px',
        margin: '0 auto',
        padding: '80px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '14px',
      },
    },
    h(
      'span',
      {
        style: {
          fontFamily: "'Geist Mono',monospace",
          fontSize: '12px',
          letterSpacing: '.12em',
          color: t.accent,
          background: t.accentSoft2,
          border: `1px solid ${t.accentRing}`,
          borderRadius: '999px',
          padding: '4px 12px',
        },
      },
      '404',
    ),
    h(
      'h1',
      {
        style: {
          margin: '6px 0 0',
          font: "700 28px 'Geist',sans-serif",
          letterSpacing: '-.02em',
          color: t.text,
          textWrap: 'balance',
        },
      },
      m.notFound.title,
    ),
    h(
      'p',
      {
        style: { margin: 0, color: t.muted, fontSize: '15px', lineHeight: 1.55, maxWidth: '40ch' },
      },
      m.notFound.body,
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '6px',
        },
      },
      h(
        Link,
        {
          href: ROUTES.home,
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            font: "600 14px 'Geist',sans-serif",
            textDecoration: 'none',
            borderRadius: '10px',
            padding: '10px 16px',
            background: t.accent,
            color: t.accentFg,
          },
        },
        m.notFound.home,
      ),
      h(
        Link,
        {
          href: ROUTES.catalogue,
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            font: "600 14px 'Geist',sans-serif",
            textDecoration: 'none',
            borderRadius: '10px',
            padding: '10px 16px',
            background: 'transparent',
            color: t.text,
            border: `1px solid ${t.borderStrong}`,
          },
        },
        m.nav.catalogue,
        h(Icon, { name: 'arrow', size: 15 }),
      ),
    ),
  );
}
