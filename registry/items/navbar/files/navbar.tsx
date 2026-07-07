'use client';

import { buttonClasses } from '@/components/button';
import { MotionProvider, springs } from '@/lib/block-motion';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';

/** Minimal className joiner so the block carries no extra dependency. */
function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface NavLink {
  /** Stable key; falls back to the index when omitted. */
  id?: string;
  label: React.ReactNode;
  href: string;
}

export interface NavAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Brand lockup / logo shown at the start (e.g. your wordmark). */
  brand: React.ReactNode;
  /** When set, the brand is wrapped in a link to this href. */
  brandHref?: string;
  /** The primary navigation links. */
  links: NavLink[];
  /** Filled call-to-action at the end. */
  primaryAction?: NavAction;
  /** Quiet action beside the CTA (e.g. "Sign in"). */
  secondaryAction?: NavAction;
  /** Stick to the top of the viewport with a blurred backdrop. Defaults to true. */
  sticky?: boolean;
  /** Accessible name for the primary nav. Defaults to "Main". */
  label?: string;
}

function ActionLink({ action, variant }: { action: NavAction; variant: 'default' | 'ghost' }) {
  const className = buttonClasses({ variant, size: variant === 'default' ? 'md' : 'sm' });
  return action.href ? (
    <a href={action.href} onClick={action.onClick} className={className}>
      {action.label}
    </a>
  ) : (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
}

/** Full-width action for the mobile panel — a link with an href, else a button. */
function MobileAction({ action, variant }: { action: NavAction; variant: 'default' | 'outline' }) {
  const className = buttonClasses({ variant, className: 'w-full' });
  return action.href ? (
    <a href={action.href} onClick={action.onClick} className={className}>
      {action.label}
    </a>
  ) : (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
}

/**
 * A responsive site header: a brand lockup, a row of navigation links and up to
 * two actions, collapsing to a hamburger-toggled panel on mobile.
 *
 *   <Navbar
 *     brand={<Logo />}
 *     links={[{ label: 'Catalogue', href: '/catalogue' }]}
 *     primaryAction={{ label: 'Get started', href: '/docs' }}
 *   />
 *
 * Renders a `header` with a labelled `nav`; the mobile disclosure button carries
 * `aria-expanded`/`aria-controls` and its panel is a second labelled nav that
 * mounts on open. CTAs render as real links (or buttons) via the ibirdui `button`
 * styles. Sticky with a blurred backdrop by default; the panel's height motion
 * runs through `MotionProvider`, collapsing to an instant toggle under
 * `prefers-reduced-motion`.
 */
export function Navbar({
  brand,
  brandHref,
  links,
  primaryAction,
  secondaryAction,
  sticky = true,
  label = 'Main',
  className,
  ...rest
}: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  const mobileId = React.useId();
  const hasActions = Boolean(primaryAction || secondaryAction);
  const brandNode = brandHref ? (
    <a href={brandHref} className="flex items-center outline-none focus-visible:opacity-80">
      {brand}
    </a>
  ) : (
    <span className="flex items-center">{brand}</span>
  );

  return (
    <MotionProvider>
      <header
        className={cn(
          'border-border border-b bg-background/80 backdrop-blur',
          sticky && 'sticky top-0 z-40',
          className,
        )}
        {...rest}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          {brandNode}

          <nav aria-label={label} className="hidden items-center gap-1 md:flex">
            {links.map((l, i) => (
              <a
                key={l.id ?? `link-${i}`}
                href={l.href}
                className="rounded-md px-3 py-2 font-medium text-[14px] text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex-1" />

          {hasActions ? (
            <div className="hidden items-center gap-2 md:flex">
              {secondaryAction ? <ActionLink action={secondaryAction} variant="ghost" /> : null}
              {primaryAction ? <ActionLink action={primaryAction} variant="default" /> : null}
            </div>
          ) : null}

          {/* mobile disclosure */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls={mobileId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {/* mobile panel */}
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="mobile"
              id={mobileId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={springs.smooth}
              style={{ overflow: 'hidden' }}
              className="border-border border-t md:hidden"
            >
              <nav aria-label={`${label} (mobile)`} className="flex flex-col gap-1 px-4 py-3">
                {links.map((l, i) => (
                  <a
                    key={l.id ?? `m-link-${i}`}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 font-medium text-[15px] text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {l.label}
                  </a>
                ))}
                {hasActions ? (
                  <div className="mt-2 flex flex-col gap-2 border-border border-t pt-3">
                    {secondaryAction ? (
                      <MobileAction action={secondaryAction} variant="outline" />
                    ) : null}
                    {primaryAction ? (
                      <MobileAction action={primaryAction} variant="default" />
                    ) : null}
                  </div>
                ) : null}
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
    </MotionProvider>
  );
}
