'use client';

import { Badge, type BadgeVariant } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { DataList } from '@/components/data-list';
import { Input } from '@/components/input';
import { Separator } from '@/components/separator';
import { success } from '@/lib/async-state';
import { MotionProvider, springs } from '@/lib/block-motion';
import { AnimatePresence, MotionConfig, type Variants, motion } from 'framer-motion';
import * as React from 'react';

// The floating plan surface is the ibirdui `Card`, made animatable so it still
// carries the crossfade/stagger variants. Card supplies the border, bg-card and
// text-card-foreground; the demo only overrides radius + shadow below.
const MotionCard = motion.create(Card);

/**
 * Every demo is *controlled*: the owning section holds the expanded state and
 * passes it down, so both the "Click to expand" button and a click on the stage
 * drive the same morph. Mirrors the handoff API (`expanded` + `onToggle`).
 */
export interface MorphDemoProps {
  expanded: boolean;
  onToggle: () => void;
}

/**
 * Live morphing demos, keyed by the entry number in `morphing-data`. This is the
 * seam the collection grows through: build a component, register it here, and it
 * lights up its stage. Entries with no demo yet fall back to the stage
 * placeholder — nothing else in the page needs to change.
 */
export const MORPH_DEMOS: Record<string, React.ComponentType<MorphDemoProps>> = {
  '01': UpgradeCard,
  '02': SearchPanel,
};

// Card container: fades as a whole and orchestrates its children — staggered
// forwards on enter, reversed on exit (so the card unbuilds in the order it
// built). Children inherit the "show" / "exit" state via variant propagation.
const cardReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, staggerChildren: 0.035, staggerDirection: -1 },
  },
};

// Nested stagger for the feature list — no own fade, just cascades its rows.
const listReveal: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

// One revealing element: rises + fades in on enter, drops + fades on exit.
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px] text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/**
 * 01 · Morph Button → Floating Card. The ibirdui `Button` and the plan card each
 * mount/unmount through `AnimatePresence`, so both get real enter *and* exit
 * animations; the card's contents stagger in on open and reverse-stagger out on
 * close. The surface itself springs between the two sizes (block-motion's layout
 * spring), all under `MotionProvider` so it honours prefers-reduced-motion.
 */
function UpgradeCard({ expanded: open, onToggle }: MorphDemoProps) {
  return (
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 360 : 186, height: open ? 272 : 52 }}
        transition={springs.layout}
      >
        {/* closed — the ibirdui Button, mounted only while collapsed */}
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
                onClick={onToggle}
                className="h-full w-full gap-2 font-semibold rounded-full text-[15px] shadow-lg shadow-primary/40"
              >
                Upgrade plan
                <ArrowIcon />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* open — the plan card, mounted only while expanded (real enter + exit) */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionCard
              key="card"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              // Card supplies border + bg-card; radius/shadow go through `style`
              // because the primitive joins classes without tailwind-merge, so a
              // `rounded-*`/`shadow-*` className would lose to Card's own defaults.
              style={{ borderRadius: 22, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
              className="absolute inset-0 flex flex-col overflow-hidden p-6"
            >
              <motion.div
                variants={item}
                className="mb-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-primary/15"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[19px] w-[19px] text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
              </motion.div>
              {/* A div, not a heading: like ibirdui's CardTitle it must not force
                  a heading level onto the page (the section already owns the h3). */}
              <motion.div
                variants={item}
                className="font-semibold text-[17px] tracking-tight text-foreground"
              >
                Pro plan
              </motion.div>
              <motion.p
                variants={item}
                className="mt-1 text-[13.5px] leading-snug text-muted-foreground"
              >
                Unlimited projects, advanced analytics and priority support.
              </motion.p>
              <motion.ul
                variants={listReveal}
                className="mt-auto mb-auto flex flex-col gap-2 pt-3.5 pl-0 font-medium text-[13px] text-foreground/80"
              >
                <motion.li variants={item} className="flex items-center gap-2.5">
                  <CheckIcon />
                  Unlimited seats
                </motion.li>
                <motion.li variants={item} className="flex items-center gap-2.5">
                  <CheckIcon />
                  Priority support
                </motion.li>
              </motion.ul>
              <motion.div variants={item}>
                <Button size="lg" className="w-full">
                  Upgrade — $24/mo
                </Button>
              </motion.div>
            </MotionCard>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionProvider>
  );
}

// ── 02 · Search Icon → Search Panel ─────────────────────────────────────────
// Built with the ibirdui Input, DataList, Button and Badge, animated with plain
// framer-motion (no block-motion): a local layout spring drives the size morph,
// `MotionConfig reducedMotion="user"` keeps it accessible, and the panel's
// sections stagger in on open / reverse-stagger out on close.
const panelSpring = { type: 'spring', stiffness: 320, damping: 34, mass: 0.9 } as const;

const panelItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 30 } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

// Tiny class joiner for the conditional (selected) row styling.
const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

type SuggestionKind = 'project' | 'person' | 'file';
interface Suggestion {
  id: string;
  title: string;
  kind: SuggestionKind;
}

const SUGGESTIONS: Suggestion[] = [
  { id: 'design-system', title: 'Design system revamp', kind: 'project' },
  { id: 'mira-chen', title: 'Mira Chen', kind: 'person' },
  { id: 'q3-roadmap', title: 'Q3 roadmap.pdf', kind: 'file' },
];

// The filter chips under the list — rendered as ibirdui Badges. The active chip
// is the default (accent) variant; the rest are the quiet `secondary` pill. The
// active state must not rely on colour alone, so it also carries `aria-current`
// plus a visually-hidden "(selected)" label.
const FILTERS: { label: string; variant: BadgeVariant; active?: boolean }[] = [
  { label: 'All', variant: 'default', active: true },
  { label: 'Projects', variant: 'secondary' },
  { label: 'People', variant: 'secondary' },
  { label: 'Files', variant: 'secondary' },
];
const chipStyle = { padding: '4px 12px', fontSize: '12.5px' } as const;

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

// One glyph per suggestion kind, drawn inside the row's rounded tile.
function KindIcon({ kind }: { kind: SuggestionKind }) {
  const common = {
    viewBox: '0 0 24 24',
    className: 'h-[15px] w-[15px]',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;
  if (kind === 'person') {
    return (
      <svg {...common} aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
      </svg>
    );
  }
  if (kind === 'file') {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M6 3h8l5 5v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 9v11" />
    </svg>
  );
}

/**
 * 02 · Search Icon → Floating Search Panel. The collapsed state is the ibirdui
 * Button (icon size) as a search trigger; on open it morphs into a command-menu
 * panel: an ibirdui Input, a DataList of suggestions (first row highlighted) and
 * a row of Badge filter chips. The surface springs between the two sizes and the
 * panel's sections stagger in.
 */
function SearchPanel({ expanded: open, onToggle }: MorphDemoProps) {
  // On open, move focus to the search field like a real command menu would —
  // `preventScroll` so it doesn't yank the page to the mid-page demo.
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
        transition={panelSpring}
      >
        {/* closed — the ibirdui Button as a search-icon trigger */}
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
                onClick={onToggle}
                size="icon"
                aria-label="Open search"
                className="h-full w-full rounded-full shadow-lg shadow-primary/40"
              >
                <SearchIcon className="h-[18px] w-[18px]" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* open — the search panel, mounted only while expanded (real enter + exit) */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="panel"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[18px] border border-border bg-card p-3.5 shadow-2xl shadow-black/10"
            >
              {/* search field — the ibirdui Input, softened into a filled search box */}
              <motion.div variants={panelItem} className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground">
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

              {/* suggestions — the ibirdui DataList, borderless, first row selected */}
              <motion.div variants={panelItem} className="mt-4 min-h-0 flex-1 overflow-auto">
                <div className="mb-1.5 px-1 font-semibold text-[10.5px] text-muted-foreground uppercase tracking-[0.09em]">
                  Suggestions
                </div>
                <DataList
                  state={success(SUGGESTIONS)}
                  getKey={(s) => s.id}
                  label="Suggestions"
                  className="list-none divide-y-0 rounded-none border-0 pl-0"
                >
                  {(s, i) => (
                    // The highlighted row's "selected" state must not be colour-only:
                    // it also carries aria-current + a visually-hidden label.
                    <div
                      aria-current={i === 0 || undefined}
                      className={cx(
                        '-my-1.5 -mx-2 flex items-center gap-3 rounded-[10px] px-2 py-2',
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

              {/* filters — an ibirdui Separator splits suggestions from the chips */}
              <motion.div variants={panelItem} className="mt-3">
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
