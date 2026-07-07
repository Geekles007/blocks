'use client';

import { buttonClasses } from '@/components/button';
import { Switch } from '@/components/switch';
import { MotionProvider, reveal, revealItem, springs } from '@/lib/block-motion';
import { motion } from 'framer-motion';
import * as React from 'react';

/** Minimal className joiner so the block carries no extra dependency. */
function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface PricingToggleAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PricingTogglePlan {
  name: string;
  /** Formatted monthly price (e.g. "$29"). */
  monthlyPrice: string;
  /** Formatted annual (per-month) price (e.g. "$24"). */
  annualPrice: string;
  description?: React.ReactNode;
  features: React.ReactNode[];
  action: PricingToggleAction;
  featured?: boolean;
}

export interface PricingToggleProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  plans: PricingTogglePlan[];
  /** Label for the monthly option (default "Monthly"). */
  monthlyLabel?: React.ReactNode;
  /** Label for the annual option (default "Annual"). */
  annualLabel?: React.ReactNode;
  /** Savings hint shown next to the annual label (e.g. "−20%"). */
  annualHint?: React.ReactNode;
  /** Ribbon shown on the featured plan. Defaults to "Most popular"; pass null to hide. */
  featuredLabel?: React.ReactNode;
  /** Start on the annual tab. */
  defaultAnnual?: boolean;
}

/**
 * A single plan carries the accent, and a monthly/annual `Switch` flips every
 * price in one gesture. The figure swaps with a vertical fade so the toggle is
 * felt without ever jostling the layout. The toggle row is a real labelled group
 * (`role="group"`) and the `Switch` carries an explicit `aria-label`; the section
 * title is an `h2` and each plan name an `h3`. Under `prefers-reduced-motion`, the
 * price transition falls back to a plain fade. Composed on the ibirdui `switch`
 * primitive.
 */
export function PricingToggle({
  title,
  subtitle,
  plans,
  monthlyLabel = 'Monthly',
  annualLabel = 'Annual',
  annualHint,
  featuredLabel = 'Most popular',
  defaultAnnual = false,
  className,
  ...rest
}: PricingToggleProps) {
  const headingId = React.useId();
  const groupId = React.useId();
  const [annual, setAnnual] = React.useState(defaultAnnual);
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

            <motion.div
              variants={revealItem}
              role="group"
              aria-labelledby={groupId}
              className="mt-8 inline-flex flex-wrap items-center justify-center gap-3"
            >
              <span id={groupId} className="sr-only">
                Billing period
              </span>
              <span
                className={cn(
                  'text-sm transition-colors',
                  annual ? 'text-muted-foreground' : 'font-medium text-foreground',
                )}
              >
                {monthlyLabel}
              </span>
              <Switch
                checked={annual}
                onCheckedChange={setAnnual}
                aria-label={`${annual ? 'Annual' : 'Monthly'} billing`}
              />
              <span
                className={cn(
                  'text-sm transition-colors',
                  annual ? 'font-medium text-foreground' : 'text-muted-foreground',
                )}
              >
                {annualLabel}
              </span>
              {annualHint ? (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs">
                  {annualHint}
                </span>
              ) : null}
            </motion.div>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            animate="visible"
            className={cn('mt-14 grid grid-cols-1 items-stretch gap-6', cols)}
          >
            {plans.map((plan, i) => (
              <PlanCard
                key={`${plan.name}-${i}`}
                plan={plan}
                annual={annual}
                featuredLabel={featuredLabel}
              />
            ))}
          </motion.div>
        </div>
      </section>
    </MotionProvider>
  );
}

function PlanCard({
  plan,
  annual,
  featuredLabel,
}: {
  plan: PricingTogglePlan;
  annual: boolean;
  featuredLabel?: React.ReactNode;
}) {
  const nameId = React.useId();
  const price = annual ? plan.annualPrice : plan.monthlyPrice;
  const showRibbon = plan.featured && featuredLabel != null;
  return (
    // The animated wrapper carries the reveal (Framer writes an inline `transform`
    // here), so the featured card's static `lg` lift lives on the inner element —
    // otherwise the reveal's transform would override the class and the lift is lost.
    <motion.div variants={revealItem} className="h-full">
      <div
        className={cn(
          'relative flex h-full flex-col rounded-2xl border bg-card p-6 text-card-foreground sm:p-8',
          plan.featured
            ? 'border-primary shadow-primary/10 shadow-xl ring-1 ring-primary lg:-translate-y-2'
            : 'border-border shadow-sm',
        )}
      >
        {showRibbon ? (
          <span className="-top-3 -translate-x-1/2 absolute left-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 font-semibold text-[11px] text-primary-foreground uppercase tracking-wide shadow-sm">
            {featuredLabel}
          </span>
        ) : null}
        <h3 id={nameId} className="font-semibold text-lg text-foreground">
          {plan.name}
        </h3>
        {plan.description ? (
          <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">{plan.description}</p>
        ) : null}

        <div className="mt-6 flex items-baseline gap-1.5">
          <motion.span
            key={price}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={springs.snappy}
            className="font-semibold text-4xl text-foreground tabular-nums tracking-tight"
          >
            {price}
          </motion.span>
          <span className="text-muted-foreground text-sm">/ mo</span>
        </div>
        <p className="mt-1 text-muted-foreground text-xs">
          {annual ? 'billed annually' : 'billed monthly'}
        </p>

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
      </div>
    </motion.div>
  );
}

function Cta({
  action,
  variant,
  describedBy,
}: {
  action: PricingToggleAction;
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
