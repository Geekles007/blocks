import { en } from './en';
import { fr } from './fr';

/** The two supported locales. */
export type Locale = 'en' | 'fr';

/**
 * The message shape, derived from the English dictionary. `fr.ts` is typed
 * `Messages`, so the compiler guarantees both locales carry the same keys with
 * compatible value types (plain strings and interpolation functions).
 */
export type Messages = typeof en;

export const DICTS: Record<Locale, Messages> = { en, fr };

export const LOCALE_KEY = 'ib-locale';

/**
 * Resolve the initial locale: a persisted choice wins, otherwise the browser
 * language (fr* ⇒ French), otherwise English. Safe to call during SSR/export
 * (returns 'en' when there is no `window`).
 */
export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = window.localStorage.getItem(LOCALE_KEY);
    if (stored === 'en' || stored === 'fr') return stored;
  } catch {
    /* localStorage unavailable — fall through to browser language */
  }
  const nav = (navigator.language || '').toLowerCase();
  return nav.startsWith('fr') ? 'fr' : 'en';
}
