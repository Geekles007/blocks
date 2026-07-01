'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type * as React from 'react';
import { h } from '~/lib/h';
import { ROUTES } from '~/lib/routes';
import type { Tok } from '~/lib/tokens';
import { useUI } from '~/lib/ui-context';
import { Badge, Icon, Kbd } from './primitives';

// Primary nav. `href` drives navigation; `soon` renders a disabled item with a
// "Bientôt" badge (Templates is announced but not shipped yet).
interface NavItem {
  label: string;
  href?: string;
  soon?: boolean;
  /** Extra path prefixes that should also light this item as active. */
  match?: string[];
}
const NAV: NavItem[] = [
  { label: 'Catalogue', href: ROUTES.catalogue, match: ['/blocks'] },
  { label: 'Primitives', href: ROUTES.primitives },
  { label: 'Docs' },
  { label: 'Templates', soon: true },
];

// Normalise away the trailing slash that `trailingSlash: true` adds, then treat
// a nav item as active on its own route and any nested route (e.g. /blocks/hero
// lights "Catalogue" via its `match` prefix).
const norm = (s: string) => s.replace(/\/+$/, '') || '/';
function isActive(item: NavItem, pathname: string): boolean {
  if (!item.href) return false;
  const p = norm(pathname);
  const prefixes = [item.href, ...(item.match ?? [])].map(norm);
  return prefixes.some((base) => p === base || (base !== '/' && p.startsWith(`${base}/`)));
}

function NavLink({ item, t, pathname }: { item: NavItem; t: Tok; pathname: string }) {
  const baseStyle = {
    font: "500 13.5px 'Geist',sans-serif",
    padding: '6px 2px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
  } as const;

  if (item.soon) {
    return h(
      'span',
      {
        title: 'Bientôt disponible',
        style: { ...baseStyle, color: t.faint, cursor: 'default' },
      },
      item.label,
      h(Badge, { t, tone: 'accent' }, 'Bientôt'),
    );
  }
  if (!item.href) {
    // Announced-but-unrouted entry (e.g. Docs / Primitives): inert for now.
    return h('span', { style: { ...baseStyle, color: t.muted, cursor: 'default' } }, item.label);
  }
  const active = isActive(item, pathname);
  return h(
    Link,
    {
      href: item.href,
      style: { ...baseStyle, color: active ? t.text : t.muted, textDecoration: 'none' },
    },
    item.label,
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { t, theme, openPalette, toggleTheme } = useUI();
  const pathname = usePathname() ?? '/';
  return h(
    'div',
    { style: { display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' } },
    h(
      'header',
      {
        className: 'ib-header',
        style: {
          position: 'sticky',
          top: 0,
          zIndex: 30,
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          padding: '0 20px',
          borderBottom: `1px solid ${t.border}`,
          background: `${t.bg}cc`,
          backdropFilter: 'blur(10px)',
        },
      },
      h(
        Link,
        {
          href: ROUTES.home,
          style: {
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px',
            textDecoration: 'none',
          },
        },
        h(
          'span',
          {
            style: { font: "700 15px 'Geist',sans-serif", letterSpacing: '-.02em', color: t.text },
          },
          'ibirdui',
        ),
        h('span', { style: { font: "600 15px 'Geist',sans-serif", color: t.accent } }, 'blocks'),
      ),
      h(
        'nav',
        { className: 'ib-navlinks', style: { display: 'flex', gap: '16px', marginLeft: '8px' } },
        ...NAV.map((item) => h(NavLink, { key: item.label, item, t, pathname })),
      ),
      h('div', { style: { flex: 1 } }),
      h(
        'button',
        {
          onClick: openPalette,
          'aria-label': 'Rechercher',
          className: 'ib-search',
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '9px',
            background: t.panel2,
            border: `1px solid ${t.border}`,
            borderRadius: '9px',
            padding: '7px 10px',
            cursor: 'pointer',
            color: t.faint,
            font: "400 13px 'Geist',sans-serif",
            minWidth: '190px',
          },
        },
        h(Icon, { name: 'search', size: 15 }),
        h(
          'span',
          { className: 'ib-search-label', style: { flex: 1, textAlign: 'left' } },
          'Rechercher…',
        ),
        h(
          'span',
          { className: 'ib-search-kbd', style: { display: 'flex', gap: '3px' } },
          h(Kbd, { t }, '⌘'),
          h(Kbd, { t }, 'K'),
        ),
      ),
      h(
        'button',
        {
          onClick: toggleTheme,
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: t.panel2,
            border: `1px solid ${t.border}`,
            cursor: 'pointer',
            color: t.muted,
          },
        },
        h(Icon, { name: theme === 'dark' ? 'sun' : 'moon', size: 17 }),
      ),
      h(
        'a',
        {
          href: 'https://github.com/Geekles007/ibirdui',
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: t.panel2,
            border: `1px solid ${t.border}`,
            color: t.muted,
          },
        },
        h(Icon, { name: 'github', size: 17 }),
      ),
    ),
    h('div', { style: { flex: 1 } }, children),
    h(Footer, null),
  );
}

function Footer() {
  const { t } = useUI();
  const col = (title: string, items: string[]) =>
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '9px' } },
      h(
        'div',
        { style: { font: "600 12px 'Geist',sans-serif", color: t.text, marginBottom: '2px' } },
        title,
      ),
      ...items.map((i) =>
        h(
          'a',
          {
            key: i,
            href: '#',
            style: { color: t.faint, fontSize: '13px', textDecoration: 'none' },
          },
          i,
        ),
      ),
    );
  return h(
    'footer',
    {
      style: {
        borderTop: `1px solid ${t.border}`,
        padding: '36px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '40px',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      },
    },
    h(
      'div',
      { style: { maxWidth: '260px' } },
      h(
        'div',
        { style: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '10px' } },
        h('span', { style: { font: "700 15px 'Geist',sans-serif", color: t.text } }, 'ibirdui'),
        h('span', { style: { font: "600 15px 'Geist',sans-serif", color: t.accent } }, 'blocks'),
      ),
      h(
        'p',
        { style: { margin: 0, color: t.faint, fontSize: '13px', lineHeight: 1.55 } },
        'Blocks open-source construits sur les primitives ibirdui. MIT.',
      ),
    ),
    h(
      'div',
      { style: { display: 'flex', gap: '48px', flexWrap: 'wrap' } },
      col('Produit', ['Catalogue', 'Primitives', 'block-motion', 'Changelog']),
      col('Ressources', ['Docs', 'Guide d’install', 'Thèmes']),
      col('Communauté', ['GitHub', 'Discord', 'X']),
    ),
  );
}
