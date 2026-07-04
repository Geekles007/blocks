'use client';

import { Badge, type BadgeVariant } from '@/components/badge';
import { Button } from '@/components/button';
import { DataList } from '@/components/data-list';
import { Input } from '@/components/input';
import { Separator } from '@/components/separator';
import { success } from '@/lib/async-state';
import { AnimatePresence, MotionConfig, type Variants, motion } from 'framer-motion';
import * as React from 'react';

// Plain framer-motion: a local layout spring drives the size morph and the panel
// sections stagger in on open, reverse-stagger out on close.
const spring = { type: 'spring', stiffness: 320, damping: 34, mass: 0.9 } as const;
const panelReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, staggerChildren: 0.035, staggerDirection: -1 },
  },
};
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 30 } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

interface Suggestion {
  id: string;
  title: string;
  kind: 'project' | 'person' | 'file';
}
const SUGGESTIONS: Suggestion[] = [
  { id: 'design-system', title: 'Design system revamp', kind: 'project' },
  { id: 'mira-chen', title: 'Mira Chen', kind: 'person' },
  { id: 'q3-roadmap', title: 'Q3 roadmap.pdf', kind: 'file' },
];
// The active chip isn't distinguished by colour alone: it carries aria-current
// plus a visually-hidden "(selected)" label.
const FILTERS: { label: string; variant: BadgeVariant; active?: boolean }[] = [
  { label: 'All', variant: 'default', active: true },
  { label: 'Projects', variant: 'secondary' },
  { label: 'People', variant: 'secondary' },
  { label: 'Files', variant: 'secondary' },
];
const chipStyle = { padding: '4px 12px', fontSize: '12.5px' } as const;

/** A search icon that morphs into a command menu: field, suggestions, filters. */
export function MorphSearchPanel() {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((v) => !v);

  // On open, move focus to the field like a command menu would (preventScroll so
  // it doesn't yank the page to the demo).
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 424 : 52, height: open ? 332 : 52 }}
        transition={spring}
      >
        {/* closed — the Button as a search-icon trigger */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.div
              key="closed"
              className="absolute inset-0 overflow-hidden rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Button
                onClick={toggle}
                size="icon"
                aria-label="Open search"
                className="h-full w-full rounded-full shadow-lg shadow-primary/40"
              >
                <SearchIcon className="h-[18px] w-[18px]" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* open — the command menu (Escape closes it, like a real command menu) */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="panel"
              variants={panelReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false);
              }}
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[18px] border border-border bg-card p-3.5 shadow-2xl shadow-black/10"
            >
              {/* search field — Input softened into a filled search box */}
              <motion.div variants={item} className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <SearchIcon className="h-[18px] w-[18px]" />
                </span>
                <Input
                  ref={inputRef}
                  placeholder="Search projects, people, files…"
                  aria-label="Search"
                  style={{
                    height: 46,
                    borderRadius: 12,
                    paddingLeft: '2.75rem',
                    fontSize: '14.5px',
                    background: 'hsl(var(--muted) / 0.6)',
                  }}
                />
              </motion.div>

              {/* suggestions — borderless DataList, first row selected */}
              <motion.div variants={item} className="mt-4 min-h-0 flex-1 overflow-auto">
                <div className="mb-1.5 px-1 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                  Suggestions
                </div>
                <DataList
                  state={success(SUGGESTIONS)}
                  getKey={(s) => s.id}
                  label="Suggestions"
                  className="list-none border-0 divide-y-0 rounded-none pl-0"
                >
                  {(s, i) => (
                    // "selected" isn't colour-only: aria-current + a hidden label.
                    <div
                      aria-current={i === 0 || undefined}
                      className={cx(
                        '-mx-2 -my-1.5 flex items-center gap-3 rounded-[10px] px-2 py-1.5',
                        i === 0 && 'bg-primary/10',
                      )}
                    >
                      <span
                        className={cx(
                          'flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px]',
                          i === 0 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <KindIcon kind={s.kind} />
                      </span>
                      <span
                        className={cx(
                          'truncate text-[14px]',
                          i === 0 ? 'font-medium text-foreground' : 'text-foreground/90',
                        )}
                      >
                        {s.title}
                        {i === 0 && <span className="sr-only"> (selected)</span>}
                      </span>
                    </div>
                  )}
                </DataList>
              </motion.div>

              {/* filters — a Separator splits the suggestions from the chips */}
              <motion.div variants={item} className="mt-3">
                <Separator decorative={false} />
                <div role="group" aria-label="Filters" className="mt-3 flex items-center gap-2">
                  {FILTERS.map((f) => (
                    <Badge
                      key={f.label}
                      variant={f.variant}
                      style={chipStyle}
                      aria-current={f.active || undefined}
                    >
                      {f.label}
                      {f.active && <span className="sr-only"> (selected)</span>}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function KindIcon({ kind }: { kind: Suggestion['kind'] }) {
  // aria-hidden is set literally on each <svg> (not only via the spread) so the
  // a11y linter can see these icons are decorative.
  const p = {
    viewBox: '0 0 24 24',
    className: 'h-[15px] w-[15px]',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;
  if (kind === 'person')
    return (
      <svg {...p} aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
      </svg>
    );
  if (kind === 'file')
    return (
      <svg {...p} aria-hidden="true">
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M6 3h8l5 5v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      </svg>
    );
  return (
    <svg {...p} aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 9v11" />
    </svg>
  );
}
