'use client';

import { Badge, type BadgeVariant } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Separator } from '@/components/separator';
import { MotionProvider, springs } from '@/lib/block-motion';
import { AnimatePresence, type Variants, motion } from 'framer-motion';
import * as React from 'react';

// The detail surface is the ibirdui Card, made animatable so it keeps the
// crossfade/stagger variants. The cast to `typeof motion.div` gives it a valid
// JSX/motion type (motion.create's inferred type doesn't compose cleanly with a
// forwardRef primitive under React 18 types).
const MotionCard = motion.create(Card) as typeof motion.div;

// The product. No real photo — a lime-tinted gradient tile stands in, so the
// block is offline and deterministic (what the tests assert against).
const PRODUCT = {
  name: 'Trailblazer Runner',
  price: '$129',
  rating: '4.8',
  reviews: '128',
  description:
    'A featherweight trail shoe with a responsive foam midsole and a grippy all-terrain outsole. Built to go the distance.',
  sizes: [{ label: '40' }, { label: '41', active: true }, { label: '42' }, { label: '43' }] as {
    label: string;
    active?: boolean;
  }[],
};

// The image is a 56px square thumbnail collapsed and a full-width hero open.
const IMG = 56;
const IMG_OPEN_W = 308; // container 340 − 2×16 padding
const IMG_OPEN_H = 140;
// Card padding (p-4 = 16px): where the image is anchored in both states.
const PAD = 16;

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
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

const chipStyle = { padding: '5px 12px', fontSize: '12.5px' } as const;

/** A compact product card that morphs into a full product-detail page. */
export function MorphProductDetail() {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 340 : 244, height: open ? 424 : 88 }}
        transition={springs.layout}
      >
        {/* collapsed — the product preview card, and the trigger. Its image slot
            is a spacer; the persistent image (below) sits on top of it. */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.button
              key="closed"
              type="button"
              onClick={toggle}
              aria-label={`View ${PRODUCT.name} details`}
              aria-expanded={open}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-lg shadow-black/5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="h-14 w-14 flex-none" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-[14.5px] text-foreground">
                  {PRODUCT.name}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-semibold text-[13px] text-primary">{PRODUCT.price}</span>
                  <Badge style={{ padding: '2px 8px', fontSize: '10.5px' }}>New</Badge>
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* open — the product-detail card. Its top leaves a spacer where the
            image grows into the hero. */}
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
              {/* hero image slot — the persistent image (below) fills it */}
              <div className="h-[140px] flex-none" aria-hidden="true" />

              {/* name + rating, price on the right */}
              <motion.div variants={item} className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {/* a div, not a heading — must not force a heading level */}
                  <div className="truncate font-semibold text-[16px] tracking-tight text-foreground">
                    {PRODUCT.name}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                    <StarIcon />
                    <span className="font-medium text-foreground">{PRODUCT.rating}</span>
                    <span>· {PRODUCT.reviews} reviews</span>
                  </div>
                </div>
                <div className="flex-none font-semibold text-[17px] tracking-tight text-foreground">
                  {PRODUCT.price}
                </div>
              </motion.div>

              <motion.p
                variants={item}
                className="mt-3 text-[13px] leading-relaxed text-foreground/70"
              >
                {PRODUCT.description}
              </motion.p>

              {/* size chips — the active one isn't colour-only: aria-current + label */}
              <motion.div variants={item} className="mt-4">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.09em] text-muted-foreground">
                  Size
                </div>
                <div role="group" aria-label="Size" className="mt-2 flex gap-2">
                  {PRODUCT.sizes.map((s) => {
                    const variant: BadgeVariant = s.active ? 'default' : 'secondary';
                    return (
                      <Badge
                        key={s.label}
                        variant={variant}
                        style={chipStyle}
                        aria-current={s.active || undefined}
                      >
                        {s.label}
                        {s.active && <span className="sr-only"> (selected)</span>}
                      </Badge>
                    );
                  })}
                </div>
              </motion.div>

              {/* actions — a Separator rules off the Add-to-cart row */}
              <motion.div variants={item} className="mt-auto pt-4">
                <Separator />
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1">Add to cart</Button>
                  <Button variant="outline" size="icon" aria-label="Save to wishlist">
                    <HeartIcon />
                  </Button>
                </div>
              </motion.div>

              {/* close — floats over the hero, above the image (z-20) */}
              <motion.button
                variants={item}
                type="button"
                onClick={toggle}
                aria-label="Close product details"
                className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-foreground shadow-sm outline-none backdrop-blur hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CloseIcon />
              </motion.button>
            </MotionCard>
          )}
        </AnimatePresence>

        {/* The single, persistent product image. Because it never unmounts it
            *resizes* from the 56px thumbnail into the full-width hero on the same
            layout spring — no crossfade. Decorative (a gradient stand-in for a
            photo) and never the click target, so it's aria-hidden + pointer-events
            none; the collapsed card behind it takes the clicks. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-4 left-4 z-10 flex items-center justify-center overflow-hidden bg-primary/10 bg-gradient-to-br from-primary/30 to-transparent"
          initial={false}
          animate={{
            width: open ? IMG_OPEN_W : IMG,
            height: open ? IMG_OPEN_H : IMG,
            borderRadius: open ? 14 : 12,
          }}
          style={{ left: PAD, top: PAD }}
          transition={springs.layout}
        >
          <motion.div
            className="text-primary/45"
            initial={false}
            animate={{ width: open ? 44 : 26, height: open ? 44 : 26 }}
            transition={springs.layout}
          >
            <BagIcon />
          </motion.div>
        </motion.div>
      </motion.div>
    </MotionProvider>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[14px] w-[14px] text-primary"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.9l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95z" />
    </svg>
  );
}

function HeartIcon() {
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
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.8 7.8 7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-full w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
