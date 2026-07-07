'use client';

import { Badge } from '@/components/badge';
import { Card } from '@/components/card';
import { MotionProvider, makeReveal, revealItem } from '@/lib/block-motion';
import { motion } from 'framer-motion';
import * as React from 'react';

/** Minimal className joiner so the block carries no extra dependency. */
function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface Feature {
  /** Stable key for the list; falls back to the index when omitted. */
  id?: string;
  /** Decorative leading icon, rendered aria-hidden inside a tinted tile. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
}

export interface FeaturesProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Small pill above the heading. Omit to hide. */
  eyebrow?: React.ReactNode;
  /** Section heading, rendered as an h2 that labels the section landmark. */
  title: React.ReactNode;
  /** Supporting line under the heading. */
  subtitle?: React.ReactNode;
  /** The feature cards. */
  features: Feature[];
  /** Columns from the `lg` breakpoint up (mobile is 1, `sm` is 2). Defaults to 3. */
  columns?: 2 | 3 | 4;
}

const LG_COLS: Record<2 | 3 | 4, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
};

/**
 * A feature section: an optional eyebrow, an h2 + subtitle, then a responsive
 * grid of feature cards (tinted icon tile, title and description).
 *
 *   <Features
 *     eyebrow="Why teams switch"
 *     title="Everything you need to ship"
 *     subtitle="Composed on the ibirdui primitives — accessible and themable by default."
 *     features={[
 *       { icon: <BoltIcon />, title: 'Fast by default', description: 'No runtime, no lock-in.' },
 *       // …
 *     ]}
 *   />
 *
 * Built on the ibirdui `card` (each tile) and `badge` (the eyebrow) primitives, so
 * every piece ships the design system's a11y guarantees. The heading is an `h2`
 * that labels the section landmark; the icon tiles are decorative and hidden from
 * assistive tech. Wrapped in `MotionProvider`, the staggered entrance collapses to
 * a plain fade under `prefers-reduced-motion`. Fully responsive: 1 → 2 → N columns.
 */
export function Features({
  eyebrow,
  title,
  subtitle,
  features,
  columns = 3,
  className,
  ...rest
}: FeaturesProps) {
  const headingId = React.useId();

  return (
    <MotionProvider>
      <section aria-labelledby={headingId} className={cn(className)} {...rest}>
        <motion.div variants={makeReveal(0.05)} initial="hidden" animate="visible">
          <div className="mx-auto max-w-2xl text-center">
            {eyebrow ? (
              <motion.div variants={revealItem} className="mb-4 flex justify-center">
                <Badge variant="secondary" className="border border-primary/40 border-solid">
                  {eyebrow}
                </Badge>
              </motion.div>
            ) : null}
            <motion.h2
              id={headingId}
              variants={revealItem}
              className="text-balance font-semibold text-3xl text-foreground tracking-tight sm:text-4xl"
            >
              {title}
            </motion.h2>
            {subtitle ? (
              <motion.p
                variants={revealItem}
                className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground sm:text-lg"
              >
                {subtitle}
              </motion.p>
            ) : null}
          </div>

          <div
            className={cn(
              'mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2',
              LG_COLS[columns],
            )}
          >
            {features.map((f, i) => (
              <motion.div key={f.id ?? `feature-${i}`} variants={revealItem} className="h-full">
                <Card className="h-full p-6">
                  {f.icon ? (
                    <div
                      aria-hidden="true"
                      className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    >
                      {f.icon}
                    </div>
                  ) : null}
                  <h3 className="font-semibold text-[17px] text-foreground tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </MotionProvider>
  );
}
