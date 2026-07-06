import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Separator } from '@/components/separator';
import { MotionProvider, springs } from '@/lib/block-motion';
import { AnimatePresence, type Variants, motion } from 'framer-motion';
import { type CSSProperties, useState } from 'react';

// The expanded surface is the ibirdui Card, made animatable so it keeps the
// crossfade/stagger variants. Card supplies border + bg-card; we only override
// radius + shadow below. Cast to `typeof motion.div` because motion.create's
// inferred type doesn't compose cleanly with a forwardRef component as JSX.
const MotionCard = motion.create(Card) as typeof motion.div;
const cx = (...p: Array<string | false | undefined>) => p.filter(Boolean).join(' ');

interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  /** Arrow direction; "good" decides the colour so "down is good" reads right. */
  trend: 'up' | 'down';
  good: boolean;
}
const KPIS: Kpi[] = [
  { id: 'revenue', label: 'Revenue', value: '$84.3k', delta: '+12.4%', trend: 'up', good: true },
  { id: 'signups', label: 'Signups', value: '3,240', delta: '+8.1%', trend: 'up', good: true },
  { id: 'churn', label: 'Churn', value: '1.9%', delta: '-0.4%', trend: 'down', good: true },
];

// Seven days of relative bar heights; the tallest is highlighted in full primary.
const BARS = [
  { d: 'Mon', h: 0.42 },
  { d: 'Tue', h: 0.6 },
  { d: 'Wed', h: 0.5 },
  { d: 'Thu', h: 0.78 },
  { d: 'Fri', h: 0.64 },
  { d: 'Sat', h: 1 },
  { d: 'Sun', h: 0.72 },
];
const PEAK = Math.max(...BARS.map((b) => b.h));
// A five-bar sparkline stands in for the collapsed widget's trend.
const SPARK = [
  { id: 's1', h: 0.4 },
  { id: 's2', h: 0.68 },
  { id: 's3', h: 0.54 },
  { id: 's4', h: 0.82 },
  { id: 's5', h: 1 },
];

const cardReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, staggerChildren: 0.035, staggerDirection: -1 },
  },
};
const rowReveal: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};
// Chart columns grow from the baseline rather than sliding in.
const bar: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  show: { scaleY: 1, opacity: 1, transition: springs.smooth },
  exit: { scaleY: 0, opacity: 0, transition: { duration: 0.15 } },
};

// The trend chip is an ibirdui Badge tinted per good/bad through inline style
// (the primitive joins classes without tailwind-merge, so style wins reliably).
function trendStyle(good: boolean): CSSProperties {
  return {
    background: good ? 'hsl(var(--success) / 0.15)' : 'hsl(var(--destructive) / 0.15)',
    color: good ? 'hsl(var(--success))' : 'hsl(var(--destructive))',
    borderRadius: 999,
    padding: '2px 7px',
    fontSize: '11px',
    fontVariantNumeric: 'tabular-nums',
  };
}

/** A compact KPI widget that morphs into a full analytics dashboard. */
export function MorphKpiDashboard() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);
  // biome-ignore lint/style/noNonNullAssertion: KPIS is a non-empty literal.
  const primary = KPIS[0]!;

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 400 : 220, height: open ? 372 : 104 }}
        transition={springs.layout}
      >
        {/* collapsed — the KPI widget, and the trigger */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.button
              key="closed"
              type="button"
              onClick={toggle}
              aria-label="Open analytics dashboard"
              aria-expanded={open}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-lg shadow-black/5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[12px] text-muted-foreground">{primary.label}</div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="font-semibold text-[22px] tracking-tight text-foreground tabular-nums">
                    {primary.value}
                  </span>
                  <Badge style={trendStyle(primary.good)} aria-hidden="true">
                    {primary.delta}
                  </Badge>
                </div>
              </div>
              {/* mini sparkline — decorative */}
              <div aria-hidden="true" className="flex h-9 flex-none items-end gap-[3px]">
                {SPARK.map((s) => (
                  <span
                    key={s.id}
                    className="w-[5px] rounded-full bg-primary/30"
                    style={{ height: `${s.h * 100}%` }}
                  />
                ))}
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* open — the analytics dashboard */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionCard
              key="card"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{ borderRadius: 22, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
              className="absolute inset-0 flex flex-col overflow-hidden p-5"
            >
              {/* header — title + period pill + a labelled close */}
              <motion.div variants={item} className="flex items-center justify-between">
                <div className="min-w-0">
                  {/* a div, not a heading — must not force a heading level */}
                  <div className="font-semibold text-[16px] tracking-tight text-foreground">
                    Analytics
                  </div>
                  <div className="mt-0.5 text-[12px] text-muted-foreground">Last 7 days</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    style={{ borderRadius: 999, padding: '3px 10px', fontSize: '11.5px' }}
                  >
                    Live
                  </Badge>
                  <button
                    type="button"
                    onClick={toggle}
                    aria-label="Close dashboard"
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </motion.div>

              {/* KPI tiles — three stats that cascade in */}
              <motion.div
                variants={rowReveal}
                role="group"
                aria-label="Key metrics"
                className="mt-4 grid grid-cols-3 gap-2.5"
              >
                {KPIS.map((k) => (
                  <motion.div
                    key={k.id}
                    variants={item}
                    className="rounded-xl border border-border bg-muted/40 px-3 py-2.5"
                  >
                    <div className="truncate text-[11px] text-muted-foreground">{k.label}</div>
                    <div className="mt-1 font-semibold text-[16px] tracking-tight text-foreground tabular-nums">
                      {k.value}
                    </div>
                    <span
                      className="mt-1.5 inline-flex items-center gap-1 font-medium text-[11px] tabular-nums"
                      style={{ color: k.good ? 'hsl(var(--success))' : 'hsl(var(--destructive))' }}
                    >
                      <TrendArrow dir={k.trend} />
                      {k.delta}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* chart — decorative bars, summarised for assistive tech */}
              <motion.div variants={item} className="mt-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.09em] text-muted-foreground">
                    Revenue
                  </div>
                  <div className="text-[11px] text-muted-foreground">Mon–Sun</div>
                </div>
                <motion.div
                  variants={rowReveal}
                  role="img"
                  aria-label="Revenue by day over the last 7 days, trending up with a peak on Saturday"
                  className="flex h-[92px] items-end gap-2"
                >
                  {BARS.map((b) => (
                    <motion.span
                      key={b.d}
                      variants={bar}
                      style={{ height: `${b.h * 100}%`, transformOrigin: 'bottom' }}
                      className={cx(
                        'flex-1 rounded-t-[5px]',
                        b.h === PEAK ? 'bg-primary' : 'bg-primary/25',
                      )}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* footer — a Separator rules off the report link */}
              <motion.div variants={item} className="mt-auto pt-4">
                <Separator />
                <Button
                  variant="ghost"
                  className="mt-2 w-full justify-center gap-1.5 bg-transparent"
                >
                  View full report
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Button>
              </motion.div>
            </MotionCard>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionProvider>
  );
}

function TrendArrow({ dir }: { dir: 'up' | 'down' }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === 'up' ? <path d="M6 15l6-6 6 6" /> : <path d="M6 9l6 6 6-6" />}
    </svg>
  );
}
