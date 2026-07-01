'use client';

import * as React from 'react';
import type { Theme, Tok } from './tokens';

/**
 * Global, route-spanning UI state: theme, reduced-motion, the ⌘K palette and
 * the copy toast. Per-route state (catalogue filter, viewer variant/breakpoint)
 * stays local to its page — only what must survive navigation lives here.
 */
export interface UI {
  t: Tok;
  theme: Theme;
  reduced: boolean;
  accent: string;
  paletteOpen: boolean;
  toggleTheme: () => void;
  openPalette: () => void;
  closePalette: () => void;
  copy: (text: string, msg?: string) => void;
}

export const UIContext = React.createContext<UI | null>(null);

export function useUI(): UI {
  const ctx = React.useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within <BlocksProvider>');
  return ctx;
}
