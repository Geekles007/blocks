'use client';

import * as React from 'react';
import type { MorphEntry } from '~/lib/morphing-data';

/**
 * Slide-in code panel. Always dark (the code surface keeps its own identity),
 * driven entirely by the `entry` prop — `null` closes it. Owns only the "copied"
 * micro-state; the open/close state lives in the parent view.
 */
export function CodeDrawer({ entry, onClose }: { entry: MorphEntry | null; onClose: () => void }) {
  const [copied, setCopied] = React.useState(false);
  const open = entry !== null;

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

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
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: decorative backdrop; keyboard close is handled by Escape and the ✕ button. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
      />
      <aside
        aria-hidden={!open}
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
            <span className="truncate font-semibold text-[14.5px] text-zinc-50">
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
        <pre className="m-0 min-h-0 flex-1 overflow-auto p-5 font-mono text-[12.5px] leading-[1.75] text-zinc-300">
          {entry?.code ?? ''}
        </pre>
      </aside>
    </>
  );
}
