'use client';

import { buttonClasses } from '@/components/button';
import { MotionProvider, reveal, revealItem } from '@/lib/block-motion';
import { motion } from 'framer-motion';
import * as React from 'react';

/** Minimal className joiner so the block carries no extra dependency. */
function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface CtaAction {
  label: string;
  /** When set, the action renders as a link; otherwise as a button. */
  href?: string;
  onClick?: () => void;
  /** Optional decorative icon (rendered aria-hidden). */
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

export interface CtaProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Small pill above the title. Omit to hide. */
  eyebrow?: React.ReactNode;
  /** The heading, rendered as an h2 that labels the section landmark. */
  title: React.ReactNode;
  /** Supporting line under the title. */
  subtitle?: React.ReactNode;
  /** Primary call to action. */
  primaryAction?: CtaAction;
  /** Secondary call to action. */
  secondaryAction?: CtaAction;
}

/**
 * A closing call-to-action band: a centred eyebrow, heading, subtitle and up to
 * two CTAs on a solid accent panel — the last push before the footer.
 *
 *   <Cta
 *     title="Ready to ship faster?"
 *     subtitle="Copy your first block in under a minute."
 *     primaryAction={{ label: 'Get started', href: '/docs' }}
 *     secondaryAction={{ label: 'Talk to us', href: '/contact' }}
 *   />
 *
 * The panel uses the `primary` token for its fill and `primary-foreground` for its
 * ink, so it re-themes with your brand. The heading is an `h2` that labels the
 * section landmark, the CTAs render as real links (or buttons) via the ibirdui
 * `button` styles, and the entrance collapses to a plain fade under
 * `prefers-reduced-motion`. Responsive: CTAs stack on mobile, inline from `sm` up.
 */
export function Cta({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  className,
  ...rest
}: CtaProps) {
  const headingId = React.useId();
  const hasActions = Boolean(primaryAction || secondaryAction);

  return (
    <MotionProvider>
      <section aria-labelledby={headingId} className={cn(className)} {...rest}>
        <motion.div
          variants={reveal}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 sm:py-16"
        >
          {/* decorative wash so the panel isn't a flat slab */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)]"
          />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center">
            {eyebrow ? (
              <motion.div
                variants={revealItem}
                className="mb-4 inline-flex items-center rounded-full border border-primary-foreground/30 px-3 py-1 font-medium text-[12.5px] text-primary-foreground/90"
              >
                {eyebrow}
              </motion.div>
            ) : null}

            <motion.h2
              id={headingId}
              variants={revealItem}
              className="text-balance font-semibold text-3xl tracking-tight sm:text-4xl"
            >
              {title}
            </motion.h2>

            {subtitle ? (
              <motion.p
                variants={revealItem}
                className="mt-4 max-w-xl text-pretty text-[15px] text-primary-foreground/80 sm:text-lg"
              >
                {subtitle}
              </motion.p>
            ) : null}

            {hasActions ? (
              <motion.div
                variants={revealItem}
                className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
              >
                {primaryAction ? <CtaButton action={primaryAction} emphasis="solid" /> : null}
                {secondaryAction ? <CtaButton action={secondaryAction} emphasis="quiet" /> : null}
              </motion.div>
            ) : null}
          </div>
        </motion.div>
      </section>
    </MotionProvider>
  );
}

/** A CTA that renders as a styled link when it has an href, else a button. */
function CtaButton({ action, emphasis }: { action: CtaAction; emphasis: 'solid' | 'quiet' }) {
  // On the accent panel the `secondary` (light) button reads as the primary
  // action; the quiet action is a light text link that keeps contrast on the
  // fill. Both pick colours that pair with `primary-foreground`, so no fragile
  // override of the button primitive's own variant classes is needed.
  const className =
    emphasis === 'solid'
      ? buttonClasses({ variant: 'secondary', size: 'lg', className: 'w-full sm:w-auto' })
      : // Hand-rolled (not the ghost variant) so the light ink is unambiguous on
        // the accent fill — matches the `lg` height/shape of the solid button.
        'inline-flex h-10 w-full items-center justify-center gap-2 rounded-md px-6 font-medium text-primary-foreground text-sm no-underline outline-none transition-colors hover:bg-primary-foreground/10 focus-visible:ring-[3px] focus-visible:ring-primary-foreground/50 sm:w-auto';
  const position = action.iconPosition ?? 'end';
  const icon = action.icon ? (
    <span aria-hidden="true" className="inline-flex shrink-0">
      {action.icon}
    </span>
  ) : null;
  const content = (
    <>
      {position === 'start' ? icon : null}
      {action.label}
      {position === 'end' ? icon : null}
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
