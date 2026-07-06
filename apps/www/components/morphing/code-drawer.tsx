'use client';

import * as React from 'react';
import { type MorphEntry, installVariants, morphText, runtimeInstall } from '~/lib/morphing-data';
import { useUI } from '~/lib/ui-context';

/**
 * Slide-in code panel, implemented as a modal dialog: `role="dialog"` +
 * `aria-modal`, focus is moved into the panel on open and trapped inside it,
 * Escape / ✕ / the backdrop all close it, and focus returns to whatever opened
 * it. While closed the panel is `inert`, so its buttons never linger in the tab
 * order off-screen. Driven entirely by `entry` (`null` = closed); owns only the
 * "copied" micro-state.
 */
export function CodeDrawer({ entry, onClose }: { entry: MorphEntry | null; onClose: () => void }) {
  const { m, locale } = useUI();
  const [copied, setCopied] = React.useState(false);
  const [copiedCmd, setCopiedCmd] = React.useState<string | null>(null);
  const [pm, setPm] = React.useState('npm');
  const open = entry !== null;
  const titleId = React.useId();
  // One `ibirdui add` per package manager (npm/pnpm/bun) — installs the block
  // and every ibirdui primitive it composes in one shot — plus the framer-motion
  // follow-up the CLI can't run for you. Both empty for roadmap entries.
  const variants = entry ? installVariants(entry) : [];
  const runtime = entry ? runtimeInstall(entry) : null;
  const activeCmd = (variants.find((v) => v.pm === pm) ?? variants[0])?.cmd ?? '';

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

  const copyCmd = (cmd: string) => {
    try {
      navigator.clipboard.writeText(cmd);
      setCopiedCmd(cmd);
      setTimeout(() => setCopiedCmd((c) => (c === cmd ? null : c)), 1400);
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
              {m.codeDrawer.eyebrow}
            </span>
            <span id={titleId} className="truncate font-semibold text-[14.5px] text-zinc-50">
              {entry ? morphText(entry, locale).title : ''}
            </span>
          </div>
          <div className="flex flex-none gap-2">
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-xs text-zinc-200 hover:bg-white/10"
            >
              {copied ? m.codeDrawer.copied : m.codeDrawer.copy}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={m.codeDrawer.close}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-zinc-400 hover:bg-white/10"
            >
              ✕
            </button>
          </div>
        </div>
        {variants.length > 0 ? (
          <div className="border-b border-white/10 px-5 py-4">
            <div className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.09em] text-primary">
              {m.codeDrawer.step1}
            </div>
            <p className="mb-3 text-[12.5px] leading-relaxed text-zinc-400">
              {m.codeDrawer.installBlurb}
            </p>
            {/* Package-manager toggle — the command is the same `ibirdui add`, run through
                each PM's dlx. */}
            <div
              role="tablist"
              aria-label={m.codeDrawer.packageManager}
              className="mb-2 inline-flex gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1"
            >
              {variants.map((v) => (
                <button
                  key={v.pm}
                  type="button"
                  role="tab"
                  aria-selected={pm === v.pm}
                  onClick={() => setPm(v.pm)}
                  className={`rounded-md px-3 py-1 font-medium text-[11.5px] ${
                    pm === v.pm ? 'bg-white/10 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {v.pm}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] py-2 pr-2 pl-3">
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[12px] text-zinc-200">
                <span className="mr-2 select-none text-zinc-500">$</span>
                {activeCmd}
              </code>
              <button
                type="button"
                onClick={() => copyCmd(activeCmd)}
                aria-label={m.codeDrawer.copyCmd(activeCmd)}
                className="flex-none rounded-md border border-white/15 bg-white/5 px-2.5 py-1 font-medium text-[11px] text-zinc-200 hover:bg-white/10"
              >
                {copiedCmd === activeCmd ? m.codeDrawer.copied : m.codeDrawer.copy}
              </button>
            </div>
            {runtime ? (
              <div className="mt-4">
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-500">
                  {m.codeDrawer.runtimeLabel}
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] py-2 pr-2 pl-3">
                  <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[12px] text-zinc-200">
                    <span className="mr-2 select-none text-zinc-500">$</span>
                    {runtime}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyCmd(runtime)}
                    aria-label={m.codeDrawer.copyCmd(runtime)}
                    className="flex-none rounded-md border border-white/15 bg-white/5 px-2.5 py-1 font-medium text-[11px] text-zinc-200 hover:bg-white/10"
                  >
                    {copiedCmd === runtime ? m.codeDrawer.copied : m.codeDrawer.copy}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        {variants.length > 0 ? (
          <div className="px-5 pt-4 font-mono text-[10.5px] uppercase tracking-[0.09em] text-primary">
            {m.codeDrawer.step2}
          </div>
        ) : null}
        <pre
          aria-label={m.codeDrawer.sourceLabel}
          className="m-0 min-h-0 flex-1 overflow-auto p-5 font-mono text-[12.5px] leading-[1.75] text-zinc-300"
        >
          {entry?.code ?? ''}
        </pre>
      </aside>
    </>
  );
}
