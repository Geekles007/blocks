'use client';

import * as React from 'react';
import type { MorphEntry } from '~/lib/morphing-data';

/**
 * Slide-in code panel, implemented as a modal dialog: `role="dialog"` +
 * `aria-modal`, focus is moved into the panel on open and trapped inside it,
 * Escape / ✕ / the backdrop all close it, and focus returns to whatever opened
 * it. While closed the panel is `inert`, so its buttons never linger in the tab
 * order off-screen. Driven entirely by `entry` (`null` = closed); owns only the
 * "copied" micro-state.
 */
export function CodeDrawer({ entry, onClose }: { entry: MorphEntry | null; onClose: () => void }) {
  const [copied, setCopied] = React.useState(false);
  const open = entry !== null;
  const titleId = React.useId();

  const asideRef = React.useRef<HTMLElement>(null);
  // Keep the latest onClose without re-running the focus-trap effect (the parent
  // passes a fresh closure each render).
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;
  const returnFocusRef = React.useRef<HTMLElement | null>(null);

  // Toggle `inert` imperatively so it behaves the same across React versions —
  // inert removes the closed panel from both the tab order and the a11y tree.
  React.useEffect(() => {
    const el = asideRef.current;
    if (!el) return;
    if (open) el.removeAttribute('inert');
    else el.setAttribute('inert', '');
  }, [open]);

  // Modal behaviour while open: move focus in, trap Tab, Escape closes, and
  // focus returns to the trigger when it closes.
  React.useEffect(() => {
    if (!open) return;
    const aside = asideRef.current;
    if (!aside) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(
        aside.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled'));

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      returnFocusRef.current?.focus?.();
    };
  }, [open]);

  React.useEffect(() => setCopied(false), []);

  const copy = () => {
    if (!entry?.code) return;
    try {
      navigator.clipboard.writeText(entry.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: decorative backdrop; keyboard close is Escape + the ✕ button inside the dialog. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
      />
      <aside
        ref={asideRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-y-0 right-0 z-50 flex w-[560px] max-w-[92vw] flex-col bg-[#0e0e12] shadow-2xl"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(101%)',
          transition: 'transform .46s cubic-bezier(.32,.72,0,1)',
        }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-mono text-[10.5px] tracking-[0.06em] text-primary">
              REACT · IBIRDUI PRIMITIVES
            </span>
            <span id={titleId} className="truncate font-semibold text-[14.5px] text-zinc-50">
              {entry?.title ?? ''}
            </span>
          </div>
          <div className="flex flex-none gap-2">
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-xs text-zinc-200 hover:bg-white/10"
            >
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close code panel"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-zinc-400 hover:bg-white/10"
            >
              ✕
            </button>
          </div>
        </div>
        <pre
          aria-label="Source code"
          className="m-0 min-h-0 flex-1 overflow-auto p-5 font-mono text-[12.5px] leading-[1.75] text-zinc-300"
        >
          {entry?.code ?? ''}
        </pre>
      </aside>
    </>
  );
}
