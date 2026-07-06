'use client';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { MotionProvider, springs } from '@/lib/block-motion';
import { AnimatePresence, type Variants, motion } from 'framer-motion';
import * as React from 'react';

// The drawer surface is the ibirdui Card, made animatable so it keeps the
// crossfade/stagger variants. The cast to `typeof motion.div` gives it a valid
// JSX/motion type (motion.create's inferred type doesn't compose cleanly with a
// forwardRef primitive under React 18 types).
const MotionCard = motion.create(Card) as typeof motion.div;

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

type Tile = 'mc' | 'check' | 'warning' | 'dollar';
interface Note {
  id: string;
  tile: Tile;
  /** Optional bold lead (a name), rendered before the regular-weight title. */
  lead?: string;
  title: string;
  meta: string;
  unread?: boolean;
  /** The one row that carries the highlight surface (the latest unread). */
  highlighted?: boolean;
}

const NOTES: Note[] = [
  {
    id: 'mira',
    tile: 'mc',
    lead: 'Mira Chen',
    title: 'assigned you a task',
    meta: 'Design review · 2m ago',
    unread: true,
    highlighted: true,
  },
  {
    id: 'deploy',
    tile: 'check',
    title: 'Deploy to production succeeded',
    meta: 'CI/CD · 18m ago',
    unread: true,
  },
  {
    id: 'storage',
    tile: 'warning',
    title: 'Storage nearing 80% of limit',
    meta: 'Billing · 1h ago',
    unread: true,
  },
  { id: 'payout', tile: 'dollar', title: 'You received a $240 payout', meta: 'Payments · 3h ago' },
];
const NEW = NOTES.filter((n) => n.unread).length;

// Each notification kind gets a tinted tile using a semantic theme token, so the
// whole thing re-themes with the host palette.
const TILE: Record<Tile, string> = {
  mc: 'bg-primary text-primary-foreground',
  check: 'bg-muted text-foreground/80',
  warning: 'bg-warning/15 text-warning',
  dollar: 'bg-success/15 text-success',
};

// Card: fades as a whole and staggers its children — forwards on enter, reversed
// on exit. Children inherit "show" / "exit" via variant propagation.
const cardReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, staggerChildren: 0.035, staggerDirection: -1 },
  },
};
// Nested stagger for the rows — no own fade, just cascades them.
const listReveal: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

// The unread count pill on the collapsed bell. Inline styles override the Badge
// primitive's own classes reliably (it joins classNames without tailwind-merge).
const countStyle: React.CSSProperties = {
  position: 'absolute',
  top: -2,
  right: -2,
  height: 20,
  minWidth: 20,
  padding: '0 5px',
  borderRadius: 999,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontVariantNumeric: 'tabular-nums',
};

/** A notification bell with an unread dot that morphs into a notification centre. */
export function MorphNotificationCenter() {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 380 : 52, height: open ? 428 : 52 }}
        transition={springs.layout}
      >
        {/* closed — the bell Button + an unread-count Badge, the trigger */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.div
              key="closed"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Button
                onClick={toggle}
                size="icon"
                aria-label={`Open notifications (${NEW} unread)`}
                aria-expanded={open}
                className="h-full w-full rounded-full shadow-lg shadow-primary/40"
              >
                <BellIcon className="h-[21px] w-[21px]" />
              </Button>
              <Badge variant="destructive" aria-hidden="true" style={countStyle}>
                {NEW}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* open — the notification centre */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionCard
              key="card"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              // Card supplies border + bg-card; radius/shadow go through style
              // because the primitive joins classes without tailwind-merge.
              style={{ borderRadius: 22, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
              className="absolute inset-0 flex flex-col overflow-hidden"
            >
              {/* header — the bell (also the close control) + title + "N new" pill */}
              <motion.div
                variants={item}
                className="flex items-center justify-between px-5 pt-5 pb-3"
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={toggle}
                    aria-label="Close notifications"
                    className="relative flex-none rounded-full text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <BellIcon className="h-[18px] w-[18px]" />
                    <span
                      aria-hidden="true"
                      className="absolute -top-1.5 -right-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-destructive px-1 font-semibold text-[10px] text-destructive-foreground"
                    >
                      {NEW}
                    </span>
                  </button>
                  {/* a div, not a heading — must not force a heading level */}
                  <div className="font-semibold text-[16px] tracking-tight text-foreground">
                    Notifications
                  </div>
                </div>
                <Badge style={{ borderRadius: 999, padding: '3px 11px', fontSize: '12px' }}>
                  {NEW} new
                </Badge>
              </motion.div>

              {/* list — custom rows with tinted icon tiles, latest unread highlighted */}
              <motion.div
                variants={listReveal}
                className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-auto px-3"
              >
                {NOTES.map((n) => (
                  <motion.div
                    key={n.id}
                    variants={item}
                    className={cx(
                      'flex items-center gap-3 rounded-2xl px-3 py-2.5',
                      n.highlighted && 'bg-primary/[0.07]',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cx(
                        'flex h-10 w-10 flex-none items-center justify-center rounded-xl font-semibold text-[13px]',
                        TILE[n.tile],
                      )}
                    >
                      <TileIcon tile={n.tile} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] text-foreground">
                        {n.lead ? (
                          <>
                            <span className="font-semibold">{n.lead}</span>{' '}
                            <span className="text-foreground/80">{n.title}</span>
                          </>
                        ) : (
                          <span className="font-semibold">{n.title}</span>
                        )}
                        {n.unread && <span className="sr-only"> (unread)</span>}
                      </div>
                      <div className="mt-0.5 text-[12px] text-muted-foreground">{n.meta}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* footer — a centred "Mark all as read" link */}
              <motion.div variants={item} className="px-3 pt-2 pb-4">
                <Button variant="link" className="w-full bg-transparent">
                  Mark all as read
                </Button>
              </motion.div>
            </MotionCard>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionProvider>
  );
}

function TileIcon({ tile }: { tile: Tile }) {
  if (tile === 'mc') return <>MC</>;
  if (tile === 'check') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  if (tile === 'warning') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4.5" />
        <path d="M12 16h.01" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="1.5" x2="12" y2="22.5" />
      <path d="M17 5.5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
