'use client';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { MotionProvider, springs } from '@/lib/block-motion';
import { AnimatePresence, type Variants, motion } from 'framer-motion';
import * as React from 'react';

// The floating plan surface is the ibirdui Card, made animatable so it keeps
// the crossfade/stagger variants. Card supplies the border, bg-card and
// text-card-foreground; we only override radius + shadow below. The cast to
// `typeof motion.div` gives it a valid JSX/motion type (motion.create's inferred
// type doesn't compose cleanly with a forwardRef primitive under React 18 types).
const MotionCard = motion.create(Card) as typeof motion.div;

// Card: fades as a whole and staggers its children — forwards on enter,
// reversed on exit. Children inherit "show" / "exit" via variant propagation.
const cardReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, staggerChildren: 0.035, staggerDirection: -1 },
  },
};
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

/** A CTA built on the ibirdui Button that morphs into a floating plan card. */
export function MorphButtonCard() {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 360 : 186, height: open ? 272 : 52 }}
        transition={springs.layout}
      >
        {/* closed — the Button, mounted only while collapsed */}
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
                className="h-full w-full gap-2 rounded-full text-[15px] shadow-lg shadow-primary/40"
              >
                Upgrade plan
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
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
              // Card supplies border + bg-card; radius/shadow go through style
              // because the primitive joins classes without tailwind-merge.
              style={{ borderRadius: 22, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
              className="absolute inset-0 flex flex-col overflow-hidden p-6"
            >
              <motion.button
                type="button"
                onClick={toggle}
                aria-label="Close plan card"
                variants={item}
                className="mb-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-primary/12"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
              </motion.button>
              {/* a div, not a heading — must not force a heading level */}
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
                className="mt-auto mb-auto flex flex-col gap-2 pt-3.5 text-[13px] font-medium text-foreground/80"
              >
                <motion.li variants={item} className="flex items-center gap-2.5">
                  <Check /> Unlimited seats
                </motion.li>
                <motion.li variants={item} className="flex items-center gap-2.5">
                  <Check /> Priority support
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

function Check() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      className="text-primary"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
