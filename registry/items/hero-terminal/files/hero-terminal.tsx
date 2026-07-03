'use client';

import { Badge } from '@/components/badge';
import { buttonClasses } from '@/components/button';
import { MotionProvider, reveal, revealItem, springs } from '@/lib/block-motion';
import { motion } from 'framer-motion';
import * as React from 'react';

/** Minimal className joiner so the block carries no extra dependency. */
function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface HeroTerminalAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface HeroTerminalLine {
  /** A shell prompt line (rendered with a "$" prompt) or plain output. */
  text: string;
  kind?: 'command' | 'comment' | 'output';
}

export interface HeroTerminalProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryAction?: HeroTerminalAction;
  secondaryAction?: HeroTerminalAction;
  /** Filename shown in the terminal title bar. */
  terminalTitle?: string;
  /** Lines rendered inside the decorative terminal. */
  lines?: HeroTerminalLine[];
}

const DEFAULT_LINES: HeroTerminalLine[] = [
  { text: 'add a block to your app', kind: 'comment' },
  { text: 'npx ibirdui add hero', kind: 'command' },
  { text: '✓ resolved 4 primitives', kind: 'output' },
  { text: '✓ wrote components/blocks/hero.tsx', kind: 'output' },
];

/**
 * A developer-first, two-column hero: copy on the left, a decorative terminal on
 * the right showing an install command. Stacks on mobile. The terminal is purely
 * illustrative (`aria-hidden`); the headline is the page's single `h1` and
 * labels the section landmark. Built on the ibirdui `badge` and `button`
 * primitives.
 */
export function HeroTerminal({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  terminalTitle = 'zsh — ibirdui',
  lines = DEFAULT_LINES,
  className,
  ...rest
}: HeroTerminalProps) {
  const headingId = React.useId();
  return (
    <MotionProvider>
      <section aria-labelledby={headingId} className={cn('bg-background', className)} {...rest}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:gap-16 md:py-28">
          <motion.div variants={reveal} initial="hidden" animate="visible" className="max-w-xl">
            {eyebrow ? (
              <motion.div variants={revealItem} className="mb-6">
                <Badge variant="outline" className="font-mono">
                  {eyebrow}
                </Badge>
              </motion.div>
            ) : null}
            <motion.h1
              id={headingId}
              variants={revealItem}
              className="text-balance font-semibold text-4xl text-foreground leading-[1.05] tracking-tight sm:text-5xl"
            >
              {title}
            </motion.h1>
            {subtitle ? (
              <motion.p
                variants={revealItem}
                className="mt-6 max-w-md text-pretty text-lg text-muted-foreground"
              >
                {subtitle}
              </motion.p>
            ) : null}
            {primaryAction || secondaryAction ? (
              <motion.div
                variants={revealItem}
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                {primaryAction ? <Cta action={primaryAction} variant="default" /> : null}
                {secondaryAction ? <Cta action={secondaryAction} variant="outline" /> : null}
              </motion.div>
            ) : null}
          </motion.div>

          {/* Decorative terminal — purely illustrative. */}
          <motion.figure
            aria-hidden="true"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.gentle, delay: 0.15 }}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/10"
          >
            <div className="flex items-center gap-2 border-border/70 border-b bg-muted/50 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-destructive/70" />
              <span className="h-3 w-3 rounded-full bg-warning/70" />
              <span className="h-3 w-3 rounded-full bg-success/70" />
              <span className="ml-2 font-mono text-muted-foreground text-xs">{terminalTitle}</span>
            </div>
            <div className="space-y-2 p-5 font-mono text-sm leading-relaxed">
              {lines.map((line, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static illustrative lines
                  key={i}
                  className={cn(
                    'flex gap-2',
                    line.kind === 'comment' && 'text-muted-foreground/70',
                    line.kind === 'output' && 'text-success',
                    (!line.kind || line.kind === 'command') && 'text-card-foreground',
                  )}
                >
                  {line.kind === 'command' ? <span className="text-primary">$</span> : null}
                  {line.kind === 'comment' ? (
                    <span className="text-muted-foreground/60">#</span>
                  ) : null}
                  <span>{line.text}</span>
                </div>
              ))}
              <div className="flex gap-2 text-card-foreground">
                <span className="text-primary">$</span>
                <span className="inline-block h-4 w-2 animate-pulse bg-foreground/70" />
              </div>
            </div>
          </motion.figure>
        </div>
      </section>
    </MotionProvider>
  );
}

function Cta({
  action,
  variant,
}: {
  action: HeroTerminalAction;
  variant: 'default' | 'outline';
}) {
  const className = buttonClasses({ variant, size: 'lg', className: 'w-full sm:w-auto' });
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
