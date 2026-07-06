'use client';

import * as React from 'react';
import { type CSS, h } from '~/lib/h';
import { DICTS, LOCALE_KEY, type Locale, detectLocale } from '~/lib/i18n';
import { ACCENT, type Theme, tok } from '~/lib/tokens';
import { type UI, UIContext } from '~/lib/ui-context';
import { Palette } from './palette';
import { Toast } from './toast';

const { useState, useRef, useEffect } = React;

/**
 * Owns the global UI state (theme / reduced-motion / ⌘K palette / toast),
 * exposes it through `UIContext`, and paints the themed root that the real
 * preview blocks read via `data-theme`. The page tree is rendered as children
 * so each route slots between the shared header and footer.
 */
export function BlocksProvider({ children }: { children: React.ReactNode }) {
  const accent = ACCENT;
  const [reduced, setReduced] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [locale, setLocaleState] = useState<Locale>('en');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resolve the real locale on mount (localStorage → browser language). Starting
  // from 'en' keeps the static-export markup deterministic, then this switches to
  // the visitor's preference — same pattern as the theme default.
  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  const setLocale = React.useCallback(
    (l: Locale) => {
      setLocaleState(l);
      try {
        window.localStorage.setItem(LOCALE_KEY, l);
      } catch {
        /* noop */
      }
    },
    [setLocaleState],
  );

  // Keep the document language in sync (mount-detect and manual switch alike).
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      mq.removeEventListener('change', apply);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const t = tok(theme, accent);
  const m = DICTS[locale];
  const fireToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  };

  const ui: UI = {
    t,
    theme,
    reduced,
    accent,
    paletteOpen,
    locale,
    m,
    setLocale,
    toggleTheme: () => setTheme((th) => (th === 'dark' ? 'light' : 'dark')),
    openPalette: () => setPaletteOpen(true),
    closePalette: () => setPaletteOpen(false),
    copy: (text, msg) => {
      try {
        navigator.clipboard.writeText(text);
      } catch {
        /* noop */
      }
      fireToast(msg || m.common.copied);
    },
  };

  const rootStyle = {
    '--ib-border': t.border,
    '--ib-ring': t.accent,
    '--ib-accent-soft': t.accentSoft2,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Geist',system-ui,sans-serif",
    background: t.bg,
    color: t.text,
    WebkitFontSmoothing: 'antialiased',
  } as CSS;

  return h(
    UIContext.Provider,
    { value: ui },
    h(
      'div',
      {
        'data-theme': theme,
        'data-reduced': reduced ? '1' : '0',
        style: rootStyle,
      } as React.HTMLAttributes<HTMLDivElement>,
      children,
      paletteOpen && h(Palette),
      toast && h(Toast, { msg: toast }),
    ),
  );
}
