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

export interface PricingAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PricingPlan {
  /** Plan name, e.g. "Pro". Rendered as the card heading. */
  name: string;
  /** Headline price, already formatted (e.g. "$29"). */
  price: React.ReactNode;
  /** Muted unit after the price (e.g. "/ mo"). */
  period?: React.ReactNode;
  /** One-line pitch under the price. */
  description?: React.ReactNode;
  /** Bulleted list of what's included. */
  features: React.ReactNode[];
  /** The plan's call to action. */
  action: PricingAction;
  /** Highlight this plan (ring, filled CTA, "popular" badge). */
  featured?: boolean;
  /** Optional label shown on the featured plan (defaults to "Popular"). */
  badge?: React.ReactNode;
}

export interface PricingProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  plans: PricingPlan[];
}

/**
 * A restrained tier grid where only the recommended plan carries the accent —
 * ring, filled CTA and a "Popular" badge. Everything else stays neutral so the
 * eye lands on a single plan. The grid goes from one column on mobile to as many
 * columns as there are plans on desktop, each card keeping its full height so the
 * CTAs align at the bottom. The section title is an `h2` (a pricing section rarely
 * lives at the top of the page) and names the landmark via `aria-labelledby`; each
 * plan name is an `h3`. Composed on the ibirdui `badge` and `button` primitives.
 */
export function Pricing({ eyebrow, title, subtitle, plans, className, ...rest }: PricingProps) {
  const headingId = React.useId();
  const cols =
    plans.length >= 4 ? 'lg:grid-cols-4' : plans.length === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2';
  return (
    <MotionProvider>
      <section aria-labelledby={headingId} className={cn('bg-background', className)} {...rest}>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
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
            variants={reveal}
            initial="hidden"
            animate="visible"
            className={cn('mt-14 grid grid-cols-1 items-stretch gap-6', cols)}
          >
            {plans.map((plan, i) => (
              <PlanCard key={`${plan.name}-${i}`} plan={plan} />
            ))}
          </motion.div>
        </div>
      </section>
    </MotionProvider>
  );
}

function PlanCard({ plan }: { plan: PricingPlan }) {
  const nameId = React.useId();
  return (
    <motion.div
      variants={revealItem}
      className={cn(
        'relative flex h-full flex-col rounded-2xl border bg-card p-6 text-card-foreground sm:p-8',
        plan.featured
          ? 'border-primary shadow-lg shadow-primary/10 ring-1 ring-primary'
          : 'border-border shadow-sm',
      )}
    >
      {plan.featured ? (
        <div className="absolute top-0 right-6 -translate-y-1/2">
          <Badge className="shadow-sm">{plan.badge ?? 'Popular'}</Badge>
        </div>
      ) : null}

      <h3 id={nameId} className="font-semibold text-lg text-foreground">
        {plan.name}
      </h3>
      {plan.description ? (
        <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">{plan.description}</p>
      ) : null}

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="font-semibold text-4xl text-foreground tabular-nums tracking-tight">
          {plan.price}
        </span>
        {plan.period ? <span className="text-muted-foreground text-sm">{plan.period}</span> : null}
      </div>

      <Cta
        action={plan.action}
        variant={plan.featured ? 'default' : 'outline'}
        describedBy={nameId}
      />

      <ul className="mt-8 flex flex-col gap-3 text-sm">
        {plan.features.map((feature, i) => (
          <li key={`${plan.name}-${i}`} className="flex items-start gap-3">
            <CheckIcon />
            <span className="text-muted-foreground leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function Cta({
  action,
  variant,
  describedBy,
}: {
  action: PricingAction;
  variant: 'default' | 'outline';
  describedBy: string;
}) {
  const className = buttonClasses({ variant, size: 'lg', className: 'mt-6 w-full' });
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
