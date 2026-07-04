'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

const { useState, useEffect } = React;

/**
 * Renders a live block inside an isolated `<iframe>` so its Tailwind viewport
 * breakpoints (`sm:` / `md:` / `lg:` …) resolve against the *frame* width — not
 * the whole page. That's what makes the desktop / tablet / mobile switch
 * actually reflow the block instead of just letterboxing it.
 *
 * The frame is a bare same-origin `about:blank` document: we clone the parent's
 * stylesheets into it (Tailwind + tokens + Geist), mirror `data-theme` /
 * `data-reduced`, portal the React `children` into its body, and track content
 * height with a `ResizeObserver` so the frame is exactly as tall as the block.
 */
export function PreviewFrame({
  theme,
  reduced,
  minHeight,
  children,
}: {
  theme: string;
  reduced: boolean;
  minHeight?: number;
  children?: React.ReactNode;
}): React.ReactElement {
  const [frame, setFrame] = useState<HTMLIFrameElement | null>(null);
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [height, setHeight] = useState(minHeight ?? 0);

  // Build the frame document once we have the element, and keep its stylesheets
  // in sync with anything the app adds later (dev HMR, lazily-loaded chunks).
  useEffect(() => {
    if (!frame) return;
    let raf = 0;
    let obs: MutationObserver | null = null;

    // Copy every parent stylesheet into the frame. Cloning nodes is not enough:
    // Next's dev server injects Tailwind through `<style>` tags with an EMPTY
    // textContent (rules live only in the CSSOM), so we serialise `cssRules`
    // instead and fall back to a same-origin `<link>` re-fetch when a sheet is
    // cross-origin and can't be read (e.g. the Google Fonts import target).
    const syncStyles = (doc: Document) => {
      for (const n of doc.head.querySelectorAll('[data-ib-copied]')) n.remove();

      // Mirror the font/antialiasing the app applies inline on its root <div>
      // (blocks-provider) — the frame has no such ancestor, so without this the
      // block falls back to the browser's default serif instead of Geist.
      const base = doc.createElement('style');
      base.setAttribute('data-ib-copied', '');
      base.textContent =
        'html,body{margin:0;padding:0;background:transparent;' +
        "font-family:'Geist',system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}";
      doc.head.appendChild(base);

      for (const sheet of Array.from(document.styleSheets)) {
        const owner = sheet.ownerNode as Element | null;
        if (owner?.tagName === 'LINK') {
          const link = doc.createElement('link');
          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('href', (owner as HTMLLinkElement).href);
          link.setAttribute('data-ib-copied', '');
          doc.head.appendChild(link);
          continue;
        }
        let cssText = '';
        try {
          cssText = Array.from(sheet.cssRules)
            .map((r) => r.cssText)
            .join('\n');
        } catch {
          cssText = owner?.textContent ?? '';
        }
        if (!cssText) continue;
        const style = doc.createElement('style');
        style.setAttribute('data-ib-copied', '');
        style.textContent = cssText;
        doc.head.appendChild(style);
      }
    };

    const setup = () => {
      const doc = frame.contentDocument;
      if (!doc || !doc.body) {
        raf = requestAnimationFrame(setup);
        return;
      }
      // Reset (guards against React StrictMode double-invocation).
      doc.body.replaceChildren();
      syncStyles(doc);

      doc.documentElement.setAttribute('data-theme', theme);
      doc.documentElement.setAttribute('data-reduced', reduced ? '1' : '0');

      const node = doc.createElement('div');
      doc.body.appendChild(node);
      setMount(node);

      // Re-sync when the app's stylesheets change (dev HMR / late chunks). The
      // rebuild is synchronous, so the browser never paints a bare frame.
      obs = new MutationObserver(() => syncStyles(doc));
      obs.observe(document.head, { childList: true });
    };

    setup();
    return () => {
      cancelAnimationFrame(raf);
      obs?.disconnect();
    };
  }, [frame]);

  // Keep theme / reduced-motion flags on the frame in sync after setup.
  useEffect(() => {
    const doc = frame?.contentDocument;
    if (!doc?.documentElement) return;
    doc.documentElement.setAttribute('data-theme', theme);
    doc.documentElement.setAttribute('data-reduced', reduced ? '1' : '0');
  }, [frame, theme, reduced, mount]);

  // Size the frame to its content.
  useEffect(() => {
    if (!mount) return;
    const measure = () => {
      const h = Math.ceil(mount.getBoundingClientRect().height || mount.scrollHeight);
      if (h > 0) setHeight(Math.max(h, minHeight ?? 0));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(mount);
    measure();
    return () => ro.disconnect();
  }, [mount, minHeight]);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement('iframe', {
      ref: setFrame,
      title: 'Aperçu du block',
      scrolling: 'no',
      style: {
        display: 'block',
        width: '100%',
        height: height ? `${height}px` : undefined,
        minHeight: minHeight ? `${minHeight}px` : undefined,
        border: 0,
        background: 'transparent',
        colorScheme: theme === 'dark' ? 'dark' : 'light',
        transition: reduced ? 'none' : 'height .25s ease',
      },
    }),
    mount ? createPortal(children, mount) : null,
  );
}
