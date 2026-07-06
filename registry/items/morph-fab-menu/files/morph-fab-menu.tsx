'use client';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Separator } from '@/components/separator';
import { MotionProvider, springs } from '@/lib/block-motion';
import { AnimatePresence, type Variants, motion } from 'framer-motion';
import * as React from 'react';

// The menu surface is the ibirdui Card, made animatable so it keeps the
// crossfade/stagger variants. The cast to `typeof motion.div` gives it a valid
// JSX/motion type (motion.create's inferred type doesn't compose cleanly with a
// forwardRef primitive under React 18 types).
const MotionCard = motion.create(Card) as typeof motion.div;

interface Action {
  id: string;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
}

const ACTIONS: Action[] = [
  { id: 'doc', label: 'New document', shortcut: '⌘N', icon: <DocIcon /> },
  { id: 'task', label: 'New task', shortcut: '⌘T', icon: <TaskIcon /> },
  { id: 'invite', label: 'Invite people', shortcut: '⌘I', icon: <InviteIcon /> },
  { id: 'upload', label: 'Upload file', shortcut: '⌘U', icon: <UploadIcon /> },
];

// The FAB is 56px collapsed and shrinks to 40px in the menu header — scaling the
// single element rather than swapping in a smaller one keeps it continuous.
const FAB = 56;
const FAB_OPEN_SCALE = 40 / FAB;
const CARD_PAD = 16;

// Card: fades as a whole and staggers its children — forwards on enter, reversed
// on exit. Children inherit "show" / "exit" via variant propagation.
const cardReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.05, delayChildren: 0.08 } },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, staggerChildren: 0.03, staggerDirection: -1 },
  },
};
// Nested stagger for the action rows — no own fade, just cascades them.
const listReveal: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

// The action row's ghost Button is left-aligned via inline style (the primitive
// joins classes without tailwind-merge, so a `justify-*` className would lose to
// the Button's own `justify-center`).
const rowStyle: React.CSSProperties = {
  height: 'auto',
  width: '100%',
  justifyContent: 'flex-start',
  gap: 12,
  padding: '7px 8px',
};

/** A floating action button that morphs into a quick-actions menu. */
export function MorphFabMenu() {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 248 : 56, height: open ? 292 : 56 }}
        transition={springs.layout}
      >
        {/* open — the menu card, mounted only while expanded (real enter + exit).
            Its header leaves a spacer where the FAB comes to rest. */}
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
              style={{ borderRadius: 20, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
              className="absolute inset-0 flex flex-col overflow-hidden p-4"
            >
              {/* header — a spacer holds the FAB's slot + the menu title */}
              <motion.div variants={item} className="flex items-center gap-3">
                <div className="h-10 w-10 flex-none" aria-hidden="true" />
                {/* a div, not a heading — must not force a heading level */}
                <div className="font-semibold text-[15px] tracking-tight text-foreground">
                  Create
                </div>
              </motion.div>

              <motion.div variants={item} className="mt-3">
                <Separator />
              </motion.div>

              {/* actions — ibirdui ghost Buttons, cascaded in */}
              <motion.div
                variants={listReveal}
                role="group"
                aria-label="Quick actions"
                className="mt-2 flex flex-col gap-0.5"
              >
                {ACTIONS.map((a) => (
                  <motion.div key={a.id} variants={item}>
                    <Button variant="ghost" className="bg-transparent" style={rowStyle}>
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-primary/12 text-primary">
                        {a.icon}
                      </span>
                      <span className="flex-1 text-left font-medium text-[13.5px] text-foreground">
                        {a.label}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {a.shortcut}
                      </span>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </MotionCard>
          )}
        </AnimatePresence>

        {/* The single, persistent FAB. It never unmounts, so it *travels* and
            scales from the collapsed circle into the menu header while its plus
            rotates into a close (×) on the same layout spring — no crossfade.
            It stays the toggle in both states. */}
        <motion.button
          type="button"
          onClick={toggle}
          aria-label={open ? 'Close actions' : 'Open actions'}
          aria-expanded={open}
          className="absolute top-0 left-0 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          style={{ transformOrigin: 'top left' }}
          initial={false}
          animate={{
            x: open ? CARD_PAD : 0,
            y: open ? CARD_PAD : 0,
            scale: open ? FAB_OPEN_SCALE : 1,
            rotate: open ? 45 : 0,
          }}
          transition={springs.layout}
        >
          <PlusIcon />
        </motion.button>
      </motion.div>
    </MotionProvider>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

const glyph = {
  viewBox: '0 0 24 24',
  className: 'h-[18px] w-[18px]',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function DocIcon() {
  return (
    <svg {...glyph} aria-hidden="true">
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M6 3h8l5 5v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}
function TaskIcon() {
  return (
    <svg {...glyph} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
}
function InviteIcon() {
  return (
    <svg {...glyph} aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg {...glyph} aria-hidden="true">
      <path d="M12 15V4" />
      <path d="M8 8l4-4 4 4" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}
