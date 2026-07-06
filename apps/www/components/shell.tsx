'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type * as React from 'react';
import { useEffect, useState } from 'react';
import { h } from '~/lib/h';
import type { Locale, Messages } from '~/lib/i18n';
import { ROUTES } from '~/lib/routes';
import type { Tok } from '~/lib/tokens';
import { useUI } from '~/lib/ui-context';
import { BlocksLockup } from './logo';
import { Badge, Icon, Kbd } from './primitives';

// Primary nav. `href` drives navigation; `soon` renders a disabled item with a
// "Soon" badge (Templates is announced but not shipped yet). `id` keys the label
// into the message dictionary (`m.nav[id]`).
type NavId = 'catalogue' | 'morphing' | 'guide' | 'templates';
interface NavItem {
  id: NavId;
  href?: string;
  soon?: boolean;
  /** Extra path prefixes that should also light this item as active. */
  match?: string[];
}
const NAV: NavItem[] = [
  { id: 'catalogue', href: ROUTES.catalogue, match: ['/blocks'] },
  { id: 'morphing', href: ROUTES.morphing },
  { id: 'guide', href: ROUTES.gettingStarted },
  { id: 'templates', soon: true },
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

function NavLink({
  item,
  t,
  m,
  pathname,
}: { item: NavItem; t: Tok; m: Messages; pathname: string }) {
  const baseStyle = {
    font: "500 13.5px 'Geist',sans-serif",
    padding: '6px 2px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
  } as const;
  const label = m.nav[item.id];

  if (item.soon) {
    return h(
      'span',
      {
        title: m.nav.soonTitle,
        style: { ...baseStyle, color: t.faint, cursor: 'default' },
      },
      label,
      h(Badge, { t, tone: 'accent' }, m.common.soon),
    );
  }
  if (!item.href) {
    // Announced-but-unrouted entry: inert for now.
    return h('span', { style: { ...baseStyle, color: t.muted, cursor: 'default' } }, label);
  }
  const active = isActive(item, pathname);
  return h(
    Link,
    {
      href: item.href,
      style: { ...baseStyle, color: active ? t.text : t.muted, textDecoration: 'none' },
    },
    label,
  );
}

/** Compact EN/FR segmented toggle for the header and the mobile menu. */
function LangToggle({
  t,
  locale,
  setLocale,
  m,
}: { t: Tok; locale: Locale; setLocale: (l: Locale) => void; m: Messages }) {
  const opt = (code: Locale, label: string) => {
    const active = locale === code;
    return h(
      'button',
      {
        key: code,
        type: 'button',
        onClick: () => setLocale(code),
        'aria-pressed': active,
        style: {
          font: "600 12px 'Geist',sans-serif",
          padding: '5px 9px',
          borderRadius: '7px',
          border: 'none',
          cursor: 'pointer',
          background: active ? t.accentSoft2 : 'transparent',
          color: active ? t.accent : t.muted,
        },
      },
      label,
    );
  };
  return h(
    'div',
    {
      role: 'group',
      'aria-label': m.lang.label,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        padding: '2px',
        borderRadius: '9px',
        background: t.panel2,
        border: `1px solid ${t.border}`,
      },
    },
    opt('en', m.lang.en),
    opt('fr', m.lang.fr),
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { t, m, locale, setLocale, theme, openPalette, toggleTheme, reduced } = useUI();
  const pathname = usePathname() ?? '/';
  const [menuOpen, setMenuOpen] = useState(false);
  // Close the mobile drawer on Escape and whenever the route changes.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: close the drawer when navigation lands.
  useEffect(() => setMenuOpen(false), [pathname]);
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
        'button',
        {
          onClick: () => setMenuOpen(true),
          'aria-label': m.header.openMenu,
          'aria-expanded': menuOpen,
          className: 'ib-menubtn',
          style: {
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
        h(
          'svg',
          {
            width: 18,
            height: 18,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
          },
          h('path', { d: 'M4 7h16M4 12h16M4 17h16' }),
        ),
      ),
      h(
        Link,
        {
          href: ROUTES.home,
          'aria-label': m.header.home,
          style: {
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          },
        },
        h(BlocksLockup, { t, size: 30 }),
      ),
      h(
        'nav',
        { className: 'ib-navlinks', style: { display: 'flex', gap: '16px', marginLeft: '8px' } },
        ...NAV.map((item) => h(NavLink, { key: item.id, item, t, m, pathname })),
      ),
      h('div', { style: { flex: 1 } }),
      h(
        'button',
        {
          onClick: openPalette,
          'aria-label': m.header.search,
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
          m.header.searchPlaceholder,
        ),
        h(
          'span',
          { className: 'ib-search-kbd', style: { display: 'flex', gap: '3px' } },
          h(Kbd, { t }, '⌘'),
          h(Kbd, { t }, 'K'),
        ),
      ),
      h(LangToggle, { t, locale, setLocale, m }),
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
          href: 'https://github.com/Geekles007/blocks',
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
    h(MobileMenu, {
      open: menuOpen,
      onClose: () => setMenuOpen(false),
      pathname,
      t,
      m,
      locale,
      setLocale,
      reduced,
    }),
  );
}

/**
 * Mobile navigation drawer — a bottom sheet holding the nav links that the
 * header hides on narrow screens (≤920px). Backdrop + Escape close it; tapping a
 * link navigates and closes. Only rendered while open.
 */
function MobileMenu({
  open,
  onClose,
  pathname,
  t,
  m,
  locale,
  setLocale,
  reduced,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  t: Tok;
  m: Messages;
  locale: Locale;
  setLocale: (l: Locale) => void;
  reduced: boolean;
}) {
  if (!open) return null;
  const rowBase = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '13px 14px',
    borderRadius: '12px',
    font: "500 15px 'Geist',sans-serif",
    textDecoration: 'none',
  } as const;
  const renderRow = (item: NavItem) => {
    const label = m.nav[item.id];
    if (item.soon) {
      return h(
        'div',
        { key: item.id, style: { ...rowBase, color: t.faint, cursor: 'default' } },
        label,
        h(Badge, { t, tone: 'accent' }, m.common.soon),
      );
    }
    if (!item.href) {
      return h(
        'div',
        { key: item.id, style: { ...rowBase, color: t.muted, cursor: 'default' } },
        label,
      );
    }
    const active = isActive(item, pathname);
    return h(
      Link,
      {
        key: item.id,
        href: item.href,
        onClick: onClose,
        style: {
          ...rowBase,
          color: active ? t.text : t.muted,
          background: active ? t.panel2 : 'transparent',
        },
      },
      label,
      active
        ? h('span', {
            style: { width: '7px', height: '7px', borderRadius: '999px', background: t.accent },
          })
        : null,
    );
  };
  return h(
    'div',
    {
      onClick: onClose,
      className: 'ib-fade',
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        background: 'rgba(0,0,0,.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'flex-end',
      },
    },
    h(
      'div',
      {
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        className: reduced ? 'ib-fade' : 'ib-sheet',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': m.header.menu,
        style: {
          width: '100%',
          background: t.panel,
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          borderTop: `1px solid ${t.borderStrong}`,
          boxShadow: t.shadow,
          padding: '10px 10px calc(env(safe-area-inset-bottom, 0px) + 16px)',
        },
      },
      h('div', {
        style: {
          width: '40px',
          height: '4px',
          borderRadius: '999px',
          background: t.borderStrong,
          margin: '2px auto 10px',
        },
      }),
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
        ...NAV.map(renderRow),
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '12px 6px 2px',
            borderTop: `1px solid ${t.border}`,
            marginTop: '8px',
          },
        },
        h(LangToggle, { t, locale, setLocale, m }),
      ),
    ),
  );
}

function Footer() {
  const { t, m } = useUI();
  // Each item is a label, or a [label, href] tuple for the ones that route
  // somewhere real. Internal routes use next/link; the rest stay inert (#).
  const linkStyle = { color: t.faint, fontSize: '13px', textDecoration: 'none' } as const;
  const col = (title: string, items: Array<string | [string, string]>) =>
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '9px' } },
      h(
        'div',
        { style: { font: "600 12px 'Geist',sans-serif", color: t.text, marginBottom: '2px' } },
        title,
      ),
      ...items.map((entry) => {
        const [label, href] = Array.isArray(entry) ? entry : [entry, undefined];
        if (href?.startsWith('/')) {
          return h(Link, { key: label, href, style: linkStyle }, label);
        }
        return h('a', { key: label, href: href ?? '#', style: linkStyle }, label);
      }),
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
      h('div', { style: { marginBottom: '12px' } }, h(BlocksLockup, { t, size: 28 })),
      h(
        'p',
        { style: { margin: 0, color: t.faint, fontSize: '13px', lineHeight: 1.55 } },
        m.footer.tagline,
      ),
    ),
    h(
      'div',
      { style: { display: 'flex', gap: '48px', flexWrap: 'wrap' } },
      col(m.footer.product, [
        [m.nav.catalogue, ROUTES.catalogue],
        [m.nav.morphing, ROUTES.morphing],
        ['block-motion', ROUTES.blockMotion],
        ['Changelog', ROUTES.changelog],
      ]),
      col(m.footer.resources, [
        [m.footer.installGuide, ROUTES.gettingStarted],
        [m.footer.themes, ROUTES.themes],
        m.footer.docs,
      ]),
      col(m.footer.community, [
        ['GitHub', 'https://github.com/Geekles007/blocks'],
        ['Reddit', 'https://www.reddit.com/user/ProfessionalPage7174/'],
        ['X', 'https://x.com/Leesan30Lee'],
      ]),
    ),
  );
}
