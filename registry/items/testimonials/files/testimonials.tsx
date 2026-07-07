'use client';

import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Card } from '@/components/card';
import { MotionProvider, makeReveal, revealItem } from '@/lib/block-motion';
import { motion } from 'framer-motion';
import * as React from 'react';

/** Minimal className joiner so the block carries no extra dependency. */
function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface TestimonialAuthor {
  /** Drives the avatar initials and its accessible label. */
  name: string;
  /** Role / company line under the name. */
  role?: React.ReactNode;
  /** Optional avatar image; falls back to initials when absent or on error. */
  src?: string;
}

export interface Testimonial {
  /** Stable key for the list; falls back to the index when omitted. */
  id?: string;
  /** The testimonial body. */
  quote: React.ReactNode;
  author: TestimonialAuthor;
  /** Optional star rating (1–5); renders a decorative row plus an sr-only label. */
  rating?: number;
}

export interface TestimonialsProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Small pill above the heading. Omit to hide. */
  eyebrow?: React.ReactNode;
  /** Section heading, rendered as an h2 that labels the section landmark. */
  title: React.ReactNode;
  /** Supporting line under the heading. */
  subtitle?: React.ReactNode;
  /** The testimonial cards. */
  testimonials: Testimonial[];
  /** Columns from the `lg` breakpoint up (mobile is 1, `sm` is 2). Defaults to 3. */
  columns?: 2 | 3;
}

const LG_COLS: Record<2 | 3, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
};

function Stars({ rating }: { rating: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="mb-4 flex items-center gap-0.5">
      <span className="sr-only">{`Rated ${rounded} out of 5`}</span>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          // biome-ignore lint/suspicious/noArrayIndexKey: five fixed star slots, order never changes
          key={i}
          viewBox="0 0 24 24"
          className={cn('h-4 w-4', i < rounded ? 'text-primary' : 'text-muted-foreground/30')}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.9l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * A testimonials section: an optional eyebrow, an h2 + subtitle, then a responsive
 * grid of quote cards. Each card is a semantic figure — a blockquote and a
 * figcaption with the author's avatar, name and role — plus an optional star row.
 *
 *   <Testimonials
 *     title="Loved by product teams"
 *     testimonials={[
 *       { quote: 'Shipped our marketing site in a weekend.', rating: 5,
 *         author: { name: 'Ada Reyes', role: 'Head of Design, Northwind' } },
 *     ]}
 *   />
 *
 * Built on the ibirdui `card`, `avatar` and `badge` primitives. The heading is an
 * `h2` that labels the section landmark; each quote uses a `figure`/`blockquote`/
 * `figcaption` so screen readers announce the quote and its attribution together,
 * and the avatar is exposed as a labelled image. Wrapped in `MotionProvider`, the
 * staggered entrance collapses to a plain fade under `prefers-reduced-motion`.
 */
export function Testimonials({
  eyebrow,
  title,
  subtitle,
  testimonials,
  columns = 3,
  className,
  ...rest
}: TestimonialsProps) {
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
            {testimonials.map((tm, i) => (
              <motion.div
                key={tm.id ?? `testimonial-${i}`}
                variants={revealItem}
                className="h-full"
              >
                <Card className="flex h-full flex-col p-6">
                  <figure className="flex h-full flex-col">
                    {typeof tm.rating === 'number' ? <Stars rating={tm.rating} /> : null}
                    <blockquote className="text-pretty text-[15px] text-foreground/90 leading-relaxed">
                      {tm.quote}
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 pt-2">
                      <Avatar name={tm.author.name} src={tm.author.src} size={40} />
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-[14px] text-foreground">
                          {tm.author.name}
                        </div>
                        {tm.author.role ? (
                          <div className="truncate text-[12.5px] text-muted-foreground">
                            {tm.author.role}
                          </div>
                        ) : null}
                      </div>
                    </figcaption>
                  </figure>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </MotionProvider>
  );
}
