'use client';

import { Badge } from '@/components/badge';
import { MotionProvider, makeReveal, revealItem, springs } from '@/lib/block-motion';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';

/** Minimal className joiner so the block carries no extra dependency. */
function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface FaqItem {
  /** Stable key for the list; falls back to the index when omitted. */
  id?: string;
  question: React.ReactNode;
  answer: React.ReactNode;
}

export interface FaqProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Small pill above the heading. Omit to hide. */
  eyebrow?: React.ReactNode;
  /** Section heading, rendered as an h2 that labels the section landmark. */
  title: React.ReactNode;
  /** Supporting line under the heading. */
  subtitle?: React.ReactNode;
  /** The question / answer pairs. */
  items: FaqItem[];
  /** Allow several answers open at once. Defaults to false (single-open accordion). */
  allowMultiple?: boolean;
}

/** A hairline rule, drawn with a coloured 1px box so it renders without a CSS reset. */
function Rule() {
  return <div aria-hidden="true" className="h-px w-full bg-border" />;
}

/**
 * A thin circle enclosing a plus that morphs into a minus when open — the vertical
 * stroke rotates onto the horizontal one. Decorative; the button state is conveyed
 * by `aria-expanded`.
 */
function ToggleIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative flex h-7 w-7 flex-none items-center justify-center rounded-full border border-solid transition-colors',
        open
          ? 'border-foreground/30 text-foreground'
          : 'border-border text-muted-foreground group-hover:border-foreground/40 group-hover:text-foreground',
      )}
    >
      <span className="absolute h-px w-3 rounded-full bg-current" />
      <motion.span
        className="absolute h-3 w-px rounded-full bg-current"
        initial={false}
        animate={{ rotate: open ? 90 : 0 }}
        transition={springs.smooth}
      />
    </span>
  );
}

/**
 * An FAQ accordion styled as a clean, borderless list: an optional eyebrow, an
 * h2 + subtitle, then hairline-divided question rows that expand to reveal their
 * answer, each with a plus/minus toggle.
 *
 *   <Faq
 *     title="Frequently asked questions"
 *     items={[{ question: 'Do I own the code?', answer: 'Yes — you copy the source.' }]}
 *   />
 *
 * Follows the WAI-ARIA accordion pattern: each question is a `button` inside an
 * `h3`, carrying `aria-expanded` and `aria-controls`; the answer is a labelled
 * region that mounts on open. The section heading is an `h2` that labels the
 * landmark. Built on the ibirdui `badge` primitive; the height and plus→minus
 * motion run through `MotionProvider`, so they collapse to an instant toggle
 * under `prefers-reduced-motion`. Themed with semantic tokens, so it reads the
 * same in light and dark.
 */
export function Faq({
  eyebrow,
  title,
  subtitle,
  items,
  allowMultiple = false,
  className,
  ...rest
}: FaqProps) {
  const headingId = React.useId();
  const [open, setOpen] = React.useState<string[]>([]);
  const keyOf = (item: FaqItem, i: number) => item.id ?? `faq-${i}`;
  const toggle = (k: string) =>
    setOpen((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : allowMultiple ? [...prev, k] : [k],
    );

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

          <motion.div variants={revealItem} className="mx-auto mt-10 max-w-2xl">
            <Rule />
            {items.map((item, i) => {
              const k = keyOf(item, i);
              const isOpen = open.includes(k);
              const btnId = `${headingId}-q-${i}`;
              const panelId = `${headingId}-a-${i}`;
              return (
                <div key={k}>
                  <h3 className="m-0">
                    <button
                      type="button"
                      id={btnId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(k)}
                      className="group flex w-full appearance-none items-center justify-between gap-4 rounded-lg border-0 bg-transparent py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="pr-2 font-semibold text-[15px] text-foreground leading-snug sm:text-base">
                        {item.question}
                      </span>
                      <ToggleIcon open={isOpen} />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="panel"
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={springs.smooth}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="pr-10 pb-6 text-[15px] text-muted-foreground leading-relaxed">
                          {item.answer}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                  <Rule />
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>
    </MotionProvider>
  );
}
