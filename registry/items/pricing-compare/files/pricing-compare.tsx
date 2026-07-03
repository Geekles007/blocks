'use client';

import { buttonClasses } from '@/components/button';
import { MotionProvider, reveal, revealItem } from '@/lib/block-motion';
import { motion } from 'framer-motion';
import * as React from 'react';

/** Minimal className joiner so the block carries no extra dependency. */
function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface PricingCompareAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PricingComparePlan {
  name: string;
  /** Formatted price (e.g. "29 €"). */
  price: React.ReactNode;
  /** Muted unit under the price (e.g. "/ mois"). */
  period?: React.ReactNode;
  action: PricingCompareAction;
  /** Highlight this plan's column. */
  featured?: boolean;
}

/** One comparison row. Each `values` entry maps to the plan at the same index. */
export interface PricingCompareRow {
  label: React.ReactNode;
  /** `true`/`false` render a check/dash; a string renders as-is. */
  values: Array<boolean | string>;
}

export interface PricingCompareProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  plans: PricingComparePlan[];
  rows: PricingCompareRow[];
  /** Header label above the feature column (default "Fonctionnalités"). */
  featureLabel?: React.ReactNode;
}

/**
 * Parti pris : une vraie table sémantique qui met les plans en colonnes et les
 * fonctionnalités en lignes, pour une comparaison scannable d'un coup d'œil. La
 * colonne recommandée est teintée à l'accent ; les cases cochées portent un
 * libellé lisible par lecteur d'écran (« Inclus » / « Non inclus »). En dessous
 * de la largeur disponible, la table défile horizontalement dans son cadre
 * plutôt que de déborder de la page — la première colonne reste collée pour
 * garder le contexte. Le titre de section est un `h2`. Composé sur la primitive
 * ibirdui `button`.
 */
export function PricingCompare({
  title,
  subtitle,
  plans,
  rows,
  featureLabel = 'Fonctionnalités',
  className,
  ...rest
}: PricingCompareProps) {
  const headingId = React.useId();
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-12 overflow-x-auto rounded-2xl border border-border"
          >
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">
                Comparaison des offres et de leurs fonctionnalités
              </caption>
              <thead>
                <tr className="border-border border-b">
                  <th
                    scope="col"
                    className="sticky left-0 z-10 bg-background p-4 align-bottom font-medium text-muted-foreground text-sm sm:p-5"
                  >
                    {featureLabel}
                  </th>
                  {plans.map((plan, i) => (
                    <th
                      key={`${plan.name}-${i}`}
                      scope="col"
                      className={cn('p-4 align-bottom sm:p-5', plan.featured && 'bg-primary/5')}
                    >
                      <div className="font-semibold text-base text-foreground">{plan.name}</div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="font-semibold text-2xl text-foreground tabular-nums tracking-tight">
                          {plan.price}
                        </span>
                        {plan.period ? (
                          <span className="text-muted-foreground text-xs">{plan.period}</span>
                        ) : null}
                      </div>
                      <Cta action={plan.action} variant={plan.featured ? 'default' : 'outline'} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, r) => (
                  <tr
                    key={`${String(row.label)}-${r}`}
                    className="border-border border-b last:border-b-0"
                  >
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-background p-4 font-normal text-foreground text-sm sm:p-5"
                    >
                      {row.label}
                    </th>
                    {plans.map((plan, c) => (
                      <td
                        key={`${plan.name}-${c}`}
                        className={cn(
                          'p-4 text-muted-foreground text-sm tabular-nums sm:p-5',
                          plan.featured && 'bg-primary/5',
                        )}
                      >
                        <Cell value={row.values[c]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>
    </MotionProvider>
  );
}

function Cell({ value }: { value: boolean | string | undefined }) {
  if (typeof value === 'string') return <span>{value}</span>;
  if (value) {
    return (
      <>
        <span className="sr-only">Inclus</span>
        <CheckIcon />
      </>
    );
  }
  return (
    <>
      <span className="sr-only">Non inclus</span>
      <span aria-hidden="true" className="inline-block h-px w-3 bg-border align-middle" />
    </>
  );
}

function Cta({
  action,
  variant,
}: {
  action: PricingCompareAction;
  variant: 'default' | 'outline';
}) {
  const className = buttonClasses({ variant, size: 'sm', className: 'mt-3 w-full' });
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

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 text-primary"
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
