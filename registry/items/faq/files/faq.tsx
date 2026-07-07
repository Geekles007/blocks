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

function Chevron({ open, className }: { open: boolean; className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={cn('h-4 w-4 flex-none transition-colors', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      initial={false}
      animate={{ rotate: open ? 180 : 0 }}
      transition={springs.smooth}
    >
      <path d="M6 9l6 6 6-6" />
    </motion.svg>
  );
}

/**
 * An FAQ accordion: an optional eyebrow, an h2 + subtitle, then a list of
 * Separator-divided question rows that expand to reveal their answer.
 *
 *   <Faq
 *     title="Frequently asked questions"
 *     items={[{ question: 'Do I own the code?', answer: 'Yes — you copy the source.' }]}
 *   />
 *
 * Follows the WAI-ARIA accordion pattern: each question is a `button` inside an
 * `h3`, carrying `aria-expanded` and `aria-controls`; the answer is a labelled
 * region that mounts on open. The section heading is an `h2` that labels the
 * landmark. Built on the ibirdui `badge` and `separator` primitives; the
 * height/rotate motion runs through `MotionProvider`, so it collapses to an
 * instant toggle under `prefers-reduced-motion`.
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

          <motion.div
            variants={revealItem}
            className="mx-auto mt-10 max-w-2xl divide-y divide-border divide-solid overflow-hidden rounded-2xl border border-border border-solid bg-card text-card-foreground"
          >
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
                      className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    >
                      <span className="font-medium text-[15px] text-foreground leading-snug sm:text-base">
                        {item.question}
                      </span>
                      <Chevron
                        open={isOpen}
                        className={
                          isOpen
                            ? 'text-foreground'
                            : 'text-muted-foreground group-hover:text-foreground'
                        }
                      />
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
                        <div className="px-6 pb-5 text-[15px] text-muted-foreground leading-relaxed">
                          {item.answer}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>
    </MotionProvider>
  );
}
