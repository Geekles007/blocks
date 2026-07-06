'use client';

import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Separator } from '@/components/separator';
import { MotionProvider, springs } from '@/lib/block-motion';
import { AnimatePresence, type Variants, motion } from 'framer-motion';
import * as React from 'react';

// The expanded surface is the ibirdui Card, made animatable so it keeps the
// crossfade/stagger variants. Card supplies the border, bg-card and
// text-card-foreground; the demo only overrides radius + shadow below. The cast
// to `typeof motion.div` gives it a valid JSX/motion type (motion.create's
// inferred type doesn't compose cleanly with a forwardRef primitive under React
// 18 types).
const MotionCard = motion.create(Card) as typeof motion.div;

// The person shown in the card. No `src`, so the Avatar renders its initials
// fallback ("AL") — deterministic and offline, exactly what the tests assert.
const PERSON = {
  name: 'Ada Lovelace',
  role: 'Design Engineer',
  handle: '@ada',
  bio: 'Building the morphing block collection. Occasional poet of analytical engines.',
  stats: [
    { label: 'Followers', value: '1.2k' },
    { label: 'Following', value: '312' },
    { label: 'Projects', value: '48' },
  ],
} as const;

// The avatar is 52px collapsed and 56px in the card header — scaling the single
// element up rather than swapping in a bigger one keeps it continuous.
const AVATAR = 52;
const AVATAR_OPEN_SCALE = 56 / AVATAR;
// Card padding (p-5 = 20px): where the travelling avatar comes to rest, matching
// the header's reserved slot.
const CARD_PAD = 20;

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
// Nested stagger for the stats row — no own fade, just cascades its columns.
const rowReveal: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

/** A circular Avatar that morphs into a detailed profile card. */
export function MorphAvatarProfile() {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 336 : 52, height: open ? 316 : 52 }}
        transition={springs.layout}
      >
        {/* open — the profile card, mounted only while expanded (real enter + exit).
            Its header leaves a spacer where the travelling avatar comes to rest. */}
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
              className="absolute inset-0 flex flex-col overflow-hidden p-5"
            >
              {/* header — a spacer reserves the avatar's slot + a labelled close */}
              <motion.div variants={item} className="flex items-start gap-3.5">
                <div className="h-14 w-14 flex-none" aria-hidden="true" />
                <div className="min-w-0 flex-1 pt-0.5">
                  {/* a div, not a heading — must not force a heading level */}
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-[16px] tracking-tight text-foreground">
                      {PERSON.name}
                    </span>
                    <Badge style={{ padding: '2px 8px', fontSize: '11px' }}>Pro</Badge>
                  </div>
                  <div className="mt-0.5 text-[13px] text-muted-foreground">
                    {PERSON.role} · {PERSON.handle}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggle}
                  aria-label="Close profile"
                  className="-mr-1 -mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>

              <motion.p
                variants={item}
                className="mt-3.5 text-[13.5px] leading-relaxed text-foreground/70"
              >
                {PERSON.bio}
              </motion.p>

              <motion.div variants={item} className="mt-4">
                <Separator />
              </motion.div>

              {/* stats — three columns that cascade in */}
              <motion.div variants={rowReveal} className="mt-4 flex items-stretch">
                {PERSON.stats.map((s, i) => (
                  <React.Fragment key={s.label}>
                    {i > 0 && <Separator orientation="vertical" className="mx-1" />}
                    <motion.div variants={item} className="flex flex-1 flex-col items-center">
                      <span className="font-semibold text-[16px] tracking-tight text-foreground">
                        {s.value}
                      </span>
                      <span className="mt-0.5 text-[11.5px] text-muted-foreground">{s.label}</span>
                    </motion.div>
                  </React.Fragment>
                ))}
              </motion.div>

              {/* actions — Follow (primary) + Message (secondary) */}
              <motion.div variants={item} className="mt-auto flex gap-2 pt-4">
                <Button className="flex-1">Follow</Button>
                <Button variant="secondary" className="flex-1">
                  Message
                </Button>
              </motion.div>
            </MotionCard>
          )}
        </AnimatePresence>

        {/* The single, persistent Avatar. Because it never unmounts, it *travels*
            and scales between the collapsed circle (x/y 0, scale 1) and its header
            slot (x/y = card padding, scale 56/52) on the same layout spring — no
            crossfade. Collapsed it's the interactive trigger; open it's decorative
            (the card's close control + text take over), so it's disabled + hidden
            from assistive tech to stay out of the tab order and a11y tree. */}
        <motion.button
          type="button"
          onClick={open ? undefined : toggle}
          disabled={open}
          tabIndex={open ? -1 : 0}
          aria-hidden={open || undefined}
          aria-label={open ? undefined : `View ${PERSON.name}'s profile`}
          aria-expanded={open}
          className="absolute top-0 left-0 z-20 inline-flex p-0 rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          style={{ transformOrigin: 'top left', pointerEvents: open ? 'none' : 'auto' }}
          initial={false}
          animate={{
            x: open ? CARD_PAD : 0,
            y: open ? CARD_PAD : 0,
            scale: open ? AVATAR_OPEN_SCALE : 1,
            // A lime glow that fades out as the avatar settles into the card.
            boxShadow: open
              ? '0 10px 25px -5px rgba(163, 230, 53, 0)'
              : '0 10px 25px -5px rgba(163, 230, 53, 0.45)',
          }}
          transition={springs.layout}
        >
          <Avatar
            name={PERSON.name}
            size={AVATAR}
            aria-hidden="true"
            className="bg-primary/15 font-semibold text-primary"
          />
        </motion.button>
      </motion.div>
    </MotionProvider>
  );
}
