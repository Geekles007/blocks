'use client';

import { Button } from '@/components/button';
import { MotionProvider, springs } from '@/lib/block-motion';
import { AnimatePresence, type Variants, motion } from 'framer-motion';
import type * as React from 'react';

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
                className="h-full w-full gap-2 rounded-full text-[15px] shadow-lg shadow-primary/40"
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
            <motion.div
              key="card"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[22px] border border-border bg-card p-6 shadow-2xl shadow-black/10"
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
              <motion.h3
                variants={item}
                className="font-semibold text-[17px] tracking-tight text-foreground"
              >
                Pro plan
              </motion.h3>
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionProvider>
  );
}
