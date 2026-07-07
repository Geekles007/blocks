'use client';

import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { buttonClasses } from '@/components/button';
import { MotionProvider, reveal, revealItem } from '@/lib/block-motion';
import { motion } from 'framer-motion';
import * as React from 'react';

/** Minimal className joiner so the block carries no extra dependency. */
function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface HeroAction {
  /** Visible label. */
  label: string;
  /** When set, the action renders as a link; otherwise as a button. */
  href?: string;
  onClick?: () => void;
  /** Optional decorative icon (rendered `aria-hidden`). */
  icon?: React.ReactNode;
  /** Side the icon sits on, relative to the label. Defaults to `'end'`. */
  iconPosition?: 'start' | 'end';
}

export interface HeroPerson {
  /** Drives the avatar initials and its accessible label. */
  name: string;
  /** Optional avatar image; falls back to initials when absent or on error. */
  src?: string;
}

export interface HeroSocialProof {
  /** People shown as an overlapping avatar stack. */
  people: HeroPerson[];
  /** Caption beside the stack, e.g. "Loved by 2,000+ teams". */
  caption: React.ReactNode;
}

export interface HeroProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Small pill above the title (e.g. "New · v2.0"). Omit to hide. */
  eyebrow?: React.ReactNode;
  /** The headline. */
  title: React.ReactNode;
  /** Supporting line under the title. */
  subtitle?: React.ReactNode;
  /** Primary call to action (filled). */
  primaryAction?: HeroAction;
  /** Secondary call to action (outline). */
  secondaryAction?: HeroAction;
  /** Optional social proof: an avatar stack + caption under the CTAs. */
  socialProof?: HeroSocialProof;
}

/**
 * A centred landing hero: eyebrow pill, headline, subtitle, up to two CTAs and
 * optional social proof. The content reveals in a gentle upward stagger on mount.
 *
 *   <Hero
 *     eyebrow="New · v2.0"
 *     title="Ship accessible UI, fast"
 *     subtitle="Designed, animated blocks built on ibirdui primitives."
 *     primaryAction={{ label: 'Get started', href: '/docs' }}
 *     secondaryAction={{ label: 'GitHub', href: 'https://github.com' }}
 *     socialProof={{
 *       people: [{ name: 'Ada Lovelace' }, { name: 'Tim Iverson' }],
 *       caption: 'Loved by 2,000+ product teams',
 *     }}
 *   />
 *
 * Built entirely on ibirdui primitives — `badge` for the eyebrow, `button`
 * (via `buttonClasses`) for the CTAs and `avatar` for the social-proof stack,
 * so each piece ships the same a11y guarantees the design system is tested for.
 * The headline is the page's single `h1` and labels the section landmark; the
 * CTA icons are decorative and hidden from assistive tech.
 * Wrapped in `MotionProvider`, the entrance animation collapses to a plain fade
 * under `prefers-reduced-motion`. Fully responsive: CTAs stack on small screens
 * and sit inline from `sm` up.
 */
export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  socialProof,
  className,
  ...rest
}: HeroProps) {
  const headingId = React.useId();
  const hasActions = Boolean(primaryAction || secondaryAction);
  const hasProof = Boolean(socialProof && socialProof.people.length > 0);

  return (
    <MotionProvider>
      <section aria-labelledby={headingId} className={cn(className)} {...rest}>
        <motion.div
          variants={reveal}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          {eyebrow ? (
            <motion.div variants={revealItem} className="mb-5">
              <Badge variant="secondary" className="border border-primary border-solid py-1">
                {eyebrow}
              </Badge>
            </motion.div>
          ) : null}

          <motion.h1
            id={headingId}
            variants={revealItem}
            className="text-balance font-semibold text-4xl text-foreground leading-[1.05] tracking-[-0.03em] sm:text-6xl"
          >
            {title}
          </motion.h1>

          {subtitle ? (
            <motion.p
              variants={revealItem}
              className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl"
            >
              {subtitle}
            </motion.p>
          ) : null}

          {hasActions ? (
            <motion.div
              variants={revealItem}
              className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
            >
              {primaryAction ? <Cta action={primaryAction} variant="default" /> : null}
              {secondaryAction ? <Cta action={secondaryAction} variant="outline" /> : null}
            </motion.div>
          ) : null}

          {hasProof && socialProof ? (
            <motion.div
              variants={revealItem}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
            >
              <div className="-space-x-2.5 flex items-center">
                {socialProof.people.map((person, i) => (
                  <Avatar
                    key={`${person.name}-${i}`}
                    name={person.name}
                    src={person.src}
                    size={34}
                    className="ring-2 ring-background"
                  />
                ))}
              </div>
              <p className="text-pretty text-muted-foreground text-sm tabular-nums">
                {socialProof.caption}
              </p>
            </motion.div>
          ) : null}
        </motion.div>
      </section>
    </MotionProvider>
  );
}

/** A CTA that renders as a styled link when it has an href, else a button. */
function Cta({ action, variant }: { action: HeroAction; variant: 'default' | 'outline' }) {
  const className = buttonClasses({ variant, size: 'lg', className: 'w-full sm:w-auto' });
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
