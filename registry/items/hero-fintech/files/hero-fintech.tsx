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

export interface HeroFintechAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface HeroFintechTrust {
  /** Big figure, e.g. "0,00 €". */
  value: string;
  /** Muted caption under the figure. */
  label: string;
}

export interface HeroFintechProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryAction?: HeroFintechAction;
  secondaryAction?: HeroFintechAction;
  /** Reassurance line under the CTAs (e.g. regulation, deposit protection). */
  assurance?: React.ReactNode;
  /** Card holder line shown on the account panel. */
  cardHolder?: React.ReactNode;
  /** Masked card number shown on the account panel. */
  cardNumber?: React.ReactNode;
  /** Available-balance figure on the account panel. */
  balance?: HeroFintechTrust;
  /** Three small trust figures shown under the panel. */
  metrics?: HeroFintechTrust[];
}

const DEFAULT_METRICS: HeroFintechTrust[] = [
  { value: '0 €', label: 'Frais cachés' },
  { value: '100 000 €', label: 'Dépôts garantis' },
  { value: 'AES-256', label: 'Chiffrement' },
];

/**
 * Parti pris : la confiance par la sobriété. Une colonne de copie rassurante à
 * gauche, une carte bancaire « posée » à droite avec un solde en chiffres
 * tabulaires et une bande de garanties chiffrées dessous — le neutre porte tout,
 * l'accent ne souligne que la sécurité. La carte est décorative (`aria-hidden`) ;
 * le titre est l'unique `h1` et nomme le repère de section. Composé sur les
 * primitives ibirdui `badge` et `button`.
 */
export function HeroFintech({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  assurance,
  cardHolder = 'Compte courant',
  cardNumber = '•••• •••• •••• 4021',
  balance = { value: '12 480,50 €', label: 'Solde disponible' },
  metrics = DEFAULT_METRICS,
  className,
  ...rest
}: HeroFintechProps) {
  const headingId = React.useId();
  return (
    <MotionProvider>
      <section aria-labelledby={headingId} className={cn('bg-background', className)} {...rest}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:py-28">
          <motion.div variants={reveal} initial="hidden" animate="visible" className="max-w-xl">
            {eyebrow ? (
              <motion.div variants={revealItem} className="mb-6">
                <Badge
                  variant="secondary"
                  className="gap-1.5 font-medium text-secondary-foreground"
                >
                  <ShieldIcon />
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
                className="mt-6 max-w-md text-pretty text-lg text-muted-foreground leading-relaxed"
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
            {assurance ? (
              <motion.p
                variants={revealItem}
                className="mt-6 flex items-center gap-2 text-muted-foreground text-sm"
              >
                <LockIcon />
                {assurance}
              </motion.p>
            ) : null}
          </motion.div>

          {/* Decorative account panel — purely visual. */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.gentle, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/5">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary p-5">
                <div className="-right-8 -top-8 absolute h-28 w-28 rounded-full bg-primary/25 blur-2xl" />
                <div className="flex items-start justify-between">
                  <span className="font-medium text-secondary-foreground text-sm">
                    {cardHolder}
                  </span>
                  <span className="h-7 w-10 rounded-md bg-primary/80" />
                </div>
                <div className="mt-10 font-medium text-lg text-secondary-foreground tracking-[0.2em] tabular-nums">
                  {cardNumber}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-muted-foreground text-xs">{balance.label}</p>
                <div className="mt-1 font-semibold text-4xl text-card-foreground tabular-nums tracking-tight">
                  {balance.value}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-xl border border-border">
                {metrics.map((m, i) => (
                  <div key={`${m.label}-${i}`} className="px-3 py-3 text-center">
                    <div className="font-semibold text-card-foreground text-sm tabular-nums">
                      {m.value}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground leading-tight">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionProvider>
  );
}

function Cta({ action, variant }: { action: HeroFintechAction; variant: 'default' | 'outline' }) {
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

function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
