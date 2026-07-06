'use client';

import { buttonClasses } from '@/components/button';
import { MotionProvider, makeReveal, revealItem } from '@/lib/block-motion';
import { motion } from 'framer-motion';
import * as React from 'react';

/** Minimal className joiner so the block carries no extra dependency. */
function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface HeroAgencyAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface HeroAgencyMeta {
  /** Left label, e.g. "Based in". */
  label: string;
  /** Right value, e.g. "Paris, FR". */
  value: React.ReactNode;
}

export interface HeroAgencyProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Small index / kicker, e.g. "Creative studio — Est. 2016". */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryAction?: HeroAgencyAction;
  /** Meta rows shown in the side rail (services, location, year…). */
  meta?: HeroAgencyMeta[];
}

const DEFAULT_META: HeroAgencyMeta[] = [
  { label: 'Services', value: 'Brand · Web · Motion' },
  { label: 'Based in', value: 'Paris, FR' },
  { label: 'Since', value: '2016' },
];

/**
 * A big-type-without-apology hero: an oversized title that spills past the grid,
 * left-aligned, with a quiet meta rail that breaks the symmetry — the boldness
 * comes from scale and whitespace, not colour. The accent touches only one
 * underlined word and the CTA arrow. The decorative rule is aria-hidden; the
 * title is the sole `h1` and names the section landmark. Composed on the ibirdui
 * `button` primitive.
 */
export function HeroAgency({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  meta = DEFAULT_META,
  className,
  ...rest
}: HeroAgencyProps) {
  const headingId = React.useId();
  return (
    <MotionProvider>
      <section
        aria-labelledby={headingId}
        className={cn('overflow-hidden bg-background', className)}
        {...rest}
      >
        <motion.div
          variants={makeReveal(0.08, 0.05)}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-6xl px-6 py-20 md:py-28"
        >
          {eyebrow ? (
            <motion.div
              variants={revealItem}
              className="flex items-center gap-3 font-medium text-muted-foreground text-sm uppercase tracking-[0.18em]"
            >
              <span aria-hidden="true" className="h-px w-10 bg-foreground/30" />
              {eyebrow}
            </motion.div>
          ) : null}

          <motion.h1
            id={headingId}
            variants={revealItem}
            className="mt-8 max-w-[14ch] text-balance break-words font-bold text-5xl text-foreground leading-[0.95] tracking-[-0.04em] sm:text-6xl sm:leading-[0.9] md:text-7xl lg:text-8xl"
          >
            {title}
          </motion.h1>

          <div className="mt-12 grid gap-10 md:grid-cols-[1.4fr_0.6fr] md:items-end">
            <motion.div variants={revealItem} className="max-w-xl">
              {subtitle ? (
                <p className="text-pretty text-muted-foreground text-xl leading-relaxed">
                  {subtitle}
                </p>
              ) : null}
              {primaryAction ? (
                <div className="mt-8">
                  <Cta action={primaryAction} />
                </div>
              ) : null}
            </motion.div>

            {meta.length > 0 ? (
              <motion.dl
                variants={revealItem}
                className="divide-y divide-border border-border border-t"
              >
                {meta.map((m, i) => (
                  <div key={`${m.label}-${i}`} className="flex items-baseline justify-between py-3">
                    <dt className="text-muted-foreground text-sm">{m.label}</dt>
                    <dd className="text-right font-medium text-foreground text-sm">{m.value}</dd>
                  </div>
                ))}
              </motion.dl>
            ) : null}
          </div>
        </motion.div>
      </section>
    </MotionProvider>
  );
}

function Cta({ action }: { action: HeroAgencyAction }) {
  const className = buttonClasses({
    variant: 'default',
    size: 'lg',
    className: 'group gap-2',
  });
  const content = (
    <>
      {action.label}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
      </svg>
    </>
  );
  return action.href ? (
    <a href={action.href} onClick={action.onClick} className={className}>
      {content}
    </a>
  ) : (
    <button type="button" onClick={action.onClick} className={className}>
      {content}
    </button>
  );
}
