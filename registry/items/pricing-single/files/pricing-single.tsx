'use client';

import { Badge } from '@/components/badge';
import { buttonClasses } from '@/components/button';
import { MotionProvider, reveal, revealItem } from '@/lib/block-motion';
import { motion } from 'framer-motion';
import * as React from 'react';

/** Minimal className joiner so the block carries no extra dependency. */
function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface PricingSingleAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PricingSingleProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Plan name shown on the card (e.g. "Lifetime license"). */
  planName: React.ReactNode;
  /** Formatted headline price (e.g. "$199"). */
  price: React.ReactNode;
  /** Muted unit after the price (e.g. "one-time payment"). */
  period?: React.ReactNode;
  /** Everything included, laid out in two columns on wide screens. */
  features: React.ReactNode[];
  primaryAction: PricingSingleAction;
  /** Reassurance line under the CTA (e.g. "30-day guarantee"). */
  note?: React.ReactNode;
}

/**
 * A single offer, set in the centre, with nothing to prove against other columns.
 * The price dominates, the list of benefits unfolds across two columns on desktop
 * and falls back to one on mobile, and a single full-width CTA closes the card.
 * The section title is an `h2`, the plan name an `h3`; the list is a real `ul`.
 * Composed on the ibirdui `badge` and `button` primitives.
 */
export function PricingSingle({
  eyebrow,
  title,
  subtitle,
  planName,
  price,
  period,
  features,
  primaryAction,
  note,
  className,
  ...rest
}: PricingSingleProps) {
  const headingId = React.useId();
  const planId = React.useId();
  return (
    <MotionProvider>
      <section aria-labelledby={headingId} className={cn('bg-background', className)} {...rest}>
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          <motion.div
            variants={reveal}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-2xl text-center"
          >
            {eyebrow ? (
              <motion.div variants={revealItem} className="mb-5 flex justify-center">
                <Badge variant="secondary" className="font-medium">
                  {eyebrow}
                </Badge>
              </motion.div>
            ) : null}
            <motion.h2
              id={headingId}
              variants={revealItem}
              className="text-balance font-semibold text-3xl text-foreground leading-[1.1] tracking-tight sm:text-4xl"
            >
              {title}
            </motion.h2>
            {subtitle ? (
              <motion.p
                variants={revealItem}
                className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed"
              >
                {subtitle}
              </motion.p>
            ) : null}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-12 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm"
          >
            <div className="grid gap-8 p-8 sm:p-10 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
              <div>
                <h3 id={planId} className="font-semibold text-foreground text-xl">
                  {planName}
                </h3>
                <ul className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  {features.map((feature, i) => (
                    <li key={`${String(feature)}-${i}`} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-muted-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-start gap-5 md:items-center md:border-border md:border-l md:pl-10 md:text-center">
                <div>
                  <div className="font-semibold text-5xl text-foreground tabular-nums tracking-tight">
                    {price}
                  </div>
                  {period ? (
                    <div className="mt-1.5 text-muted-foreground text-sm">{period}</div>
                  ) : null}
                </div>
                <Cta action={primaryAction} describedBy={planId} />
                {note ? <p className="text-muted-foreground text-xs">{note}</p> : null}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionProvider>
  );
}

function Cta({ action, describedBy }: { action: PricingSingleAction; describedBy: string }) {
  const className = buttonClasses({
    variant: 'default',
    size: 'lg',
    className: 'w-full md:w-auto md:px-8',
  });
  return action.href ? (
    <a
      href={action.href}
      onClick={action.onClick}
      aria-describedby={describedBy}
      className={className}
    >
      {action.label}
    </a>
  ) : (
    <button
      type="button"
      onClick={action.onClick}
      aria-describedby={describedBy}
      className={className}
    >
      {action.label}
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
