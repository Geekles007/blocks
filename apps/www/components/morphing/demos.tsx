'use client';

import { Avatar } from '@/components/avatar';
import { Badge, type BadgeVariant } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { DataList } from '@/components/data-list';
import { Input } from '@/components/input';
import { Separator } from '@/components/separator';
import { success } from '@/lib/async-state';
import { MotionProvider, springs } from '@/lib/block-motion';
import { AnimatePresence, MotionConfig, type Variants, motion } from 'framer-motion';
import * as React from 'react';

// The floating plan surface is the ibirdui `Card`, made animatable so it still
// carries the crossfade/stagger variants. Card supplies the border, bg-card and
// text-card-foreground; the demo only overrides radius + shadow below.
const MotionCard = motion.create(Card);

/**
 * Every demo is *controlled*: the owning section holds the expanded state and
 * passes it down, so both the "Click to expand" button and a click on the stage
 * drive the same morph. Mirrors the handoff API (`expanded` + `onToggle`).
 */
export interface MorphDemoProps {
  expanded: boolean;
  onToggle: () => void;
}

/**
 * Live morphing demos, keyed by the entry number in `morphing-data`. This is the
 * seam the collection grows through: build a component, register it here, and it
 * lights up its stage. Entries with no demo yet fall back to the stage
 * placeholder — nothing else in the page needs to change.
 */
export const MORPH_DEMOS: Record<string, React.ComponentType<MorphDemoProps>> = {
  '01': UpgradeCard,
  '02': SearchPanel,
  '03': ProfileCard,
  '04': ProductDetail,
  '05': NotificationCenter,
  '06': ActionMenu,
  '07': KpiDashboard,
};

// Card container: fades as a whole and orchestrates its children — staggered
// forwards on enter, reversed on exit (so the card unbuilds in the order it
// built). Children inherit the "show" / "exit" state via variant propagation.
const cardReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, staggerChildren: 0.035, staggerDirection: -1 },
  },
};

// Nested stagger for the feature list — no own fade, just cascades its rows.
const listReveal: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

// One revealing element: rises + fades in on enter, drops + fades on exit.
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px] text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/**
 * 01 · Morph Button → Floating Card. The ibirdui `Button` and the plan card each
 * mount/unmount through `AnimatePresence`, so both get real enter *and* exit
 * animations; the card's contents stagger in on open and reverse-stagger out on
 * close. The surface itself springs between the two sizes (block-motion's layout
 * spring), all under `MotionProvider` so it honours prefers-reduced-motion.
 */
function UpgradeCard({ expanded: open, onToggle }: MorphDemoProps) {
  return (
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 360 : 186, height: open ? 272 : 52 }}
        transition={springs.layout}
      >
        {/* closed — the ibirdui Button, mounted only while collapsed */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.div
              key="closed"
              className="absolute inset-0 overflow-hidden rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Button
                onClick={onToggle}
                className="h-full w-full gap-2 font-semibold rounded-full text-[15px] shadow-lg shadow-primary/40"
              >
                Upgrade plan
                <ArrowIcon />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* open — the plan card, mounted only while expanded (real enter + exit) */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionCard
              key="card"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              // Card supplies border + bg-card; radius/shadow go through `style`
              // because the primitive joins classes without tailwind-merge, so a
              // `rounded-*`/`shadow-*` className would lose to Card's own defaults.
              style={{ borderRadius: 22, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
              className="absolute inset-0 flex flex-col overflow-hidden p-6"
            >
              <motion.div
                variants={item}
                className="mb-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-primary/15"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[19px] w-[19px] text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
              </motion.div>
              {/* A div, not a heading: like ibirdui's CardTitle it must not force
                  a heading level onto the page (the section already owns the h3). */}
              <motion.div
                variants={item}
                className="font-semibold text-[17px] tracking-tight text-foreground"
              >
                Pro plan
              </motion.div>
              <motion.p
                variants={item}
                className="mt-1 text-[13.5px] leading-snug text-muted-foreground"
              >
                Unlimited projects, advanced analytics and priority support.
              </motion.p>
              <motion.ul
                variants={listReveal}
                className="mt-auto mb-auto flex flex-col gap-2 pt-3.5 pl-0 font-medium text-[13px] text-foreground/80"
              >
                <motion.li variants={item} className="flex items-center gap-2.5">
                  <CheckIcon />
                  Unlimited seats
                </motion.li>
                <motion.li variants={item} className="flex items-center gap-2.5">
                  <CheckIcon />
                  Priority support
                </motion.li>
              </motion.ul>
              <motion.div variants={item}>
                <Button size="lg" className="w-full">
                  Upgrade — $24/mo
                </Button>
              </motion.div>
            </MotionCard>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionProvider>
  );
}

// ── 02 · Search Icon → Search Panel ─────────────────────────────────────────
// Built with the ibirdui Input, DataList, Button and Badge, animated with plain
// framer-motion (no block-motion): a local layout spring drives the size morph,
// `MotionConfig reducedMotion="user"` keeps it accessible, and the panel's
// sections stagger in on open / reverse-stagger out on close.
const panelSpring = { type: 'spring', stiffness: 320, damping: 34, mass: 0.9 } as const;

const panelItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 30 } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

// Tiny class joiner for the conditional (selected) row styling.
const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

type SuggestionKind = 'project' | 'person' | 'file';
interface Suggestion {
  id: string;
  title: string;
  kind: SuggestionKind;
}

const SUGGESTIONS: Suggestion[] = [
  { id: 'design-system', title: 'Design system revamp', kind: 'project' },
  { id: 'mira-chen', title: 'Mira Chen', kind: 'person' },
  { id: 'q3-roadmap', title: 'Q3 roadmap.pdf', kind: 'file' },
];

// The filter chips under the list — rendered as ibirdui Badges. The active chip
// is the default (accent) variant; the rest are the quiet `secondary` pill. The
// active state must not rely on colour alone, so it also carries `aria-current`
// plus a visually-hidden "(selected)" label.
const FILTERS: { label: string; variant: BadgeVariant; active?: boolean }[] = [
  { label: 'All', variant: 'default', active: true },
  { label: 'Projects', variant: 'secondary' },
  { label: 'People', variant: 'secondary' },
  { label: 'Files', variant: 'secondary' },
];
const chipStyle = { padding: '4px 12px', fontSize: '12.5px' } as const;

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

// One glyph per suggestion kind, drawn inside the row's rounded tile.
function KindIcon({ kind }: { kind: SuggestionKind }) {
  const common = {
    viewBox: '0 0 24 24',
    className: 'h-[15px] w-[15px]',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;
  if (kind === 'person') {
    return (
      <svg {...common} aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
      </svg>
    );
  }
  if (kind === 'file') {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M6 3h8l5 5v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 9v11" />
    </svg>
  );
}

/**
 * 02 · Search Icon → Floating Search Panel. The collapsed state is the ibirdui
 * Button (icon size) as a search trigger; on open it morphs into a command-menu
 * panel: an ibirdui Input, a DataList of suggestions (first row highlighted) and
 * a row of Badge filter chips. The surface springs between the two sizes and the
 * panel's sections stagger in.
 */
function SearchPanel({ expanded: open, onToggle }: MorphDemoProps) {
  // On open, move focus to the search field like a real command menu would —
  // `preventScroll` so it doesn't yank the page to the mid-page demo.
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 424 : 52, height: open ? 332 : 52 }}
        transition={panelSpring}
      >
        {/* closed — the ibirdui Button as a search-icon trigger */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.div
              key="closed"
              className="absolute inset-0 overflow-hidden rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Button
                onClick={onToggle}
                size="icon"
                aria-label="Open search"
                className="h-full w-full rounded-full shadow-lg shadow-primary/40"
              >
                <SearchIcon className="h-[18px] w-[18px]" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* open — the search panel, mounted only while expanded (real enter + exit) */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="panel"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[18px] border border-border bg-card p-3.5 shadow-2xl shadow-black/10"
            >
              {/* search field — the ibirdui Input, softened into a filled search box */}
              <motion.div variants={panelItem} className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground">
                  <SearchIcon className="h-[18px] w-[18px]" />
                </span>
                <Input
                  ref={inputRef}
                  placeholder="Search projects, people, files…"
                  aria-label="Search"
                  style={{
                    height: 46,
                    borderRadius: 12,
                    paddingLeft: '2.75rem',
                    fontSize: '14.5px',
                    background: 'hsl(var(--muted) / 0.6)',
                  }}
                />
              </motion.div>

              {/* suggestions — the ibirdui DataList, borderless, first row selected */}
              <motion.div variants={panelItem} className="mt-4 min-h-0 flex-1 overflow-auto">
                <div className="mb-1.5 px-1 font-semibold text-[10.5px] text-muted-foreground uppercase tracking-[0.09em]">
                  Suggestions
                </div>
                <DataList
                  state={success(SUGGESTIONS)}
                  getKey={(s) => s.id}
                  label="Suggestions"
                  className="list-none divide-y-0 rounded-none border-0 pl-0"
                >
                  {(s, i) => (
                    // The highlighted row's "selected" state must not be colour-only:
                    // it also carries aria-current + a visually-hidden label.
                    <div
                      aria-current={i === 0 || undefined}
                      className={cx(
                        '-my-1.5 -mx-2 flex items-center gap-3 rounded-[10px] px-2 py-2',
                        i === 0 && 'bg-primary/10',
                      )}
                    >
                      <span
                        className={cx(
                          'flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px]',
                          i === 0 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <KindIcon kind={s.kind} />
                      </span>
                      <span
                        className={cx(
                          'truncate text-[14px]',
                          i === 0 ? 'font-medium text-foreground' : 'text-foreground/90',
                        )}
                      >
                        {s.title}
                        {i === 0 && <span className="sr-only"> (selected)</span>}
                      </span>
                    </div>
                  )}
                </DataList>
              </motion.div>

              {/* filters — an ibirdui Separator splits suggestions from the chips */}
              <motion.div variants={panelItem} className="mt-3">
                <Separator decorative={false} />
                <div role="group" aria-label="Filters" className="mt-3 flex items-center gap-2">
                  {FILTERS.map((f) => (
                    <Badge
                      key={f.label}
                      variant={f.variant}
                      style={chipStyle}
                      aria-current={f.active || undefined}
                    >
                      {f.label}
                      {f.active && <span className="sr-only"> (selected)</span>}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  );
}

// ── 03 · Avatar → Profile Card ──────────────────────────────────────────────
// Built with the ibirdui Avatar, Card, Badge, Button and Separator, animated via
// block-motion (MotionProvider + layout spring) so it honours prefers-reduced-
// motion. The collapsed Avatar and the expanded Card each mount/unmount through
// AnimatePresence (real enter + exit); the card's sections stagger in on open.
const MotionCardBlock = motion.create(Card) as typeof motion.div;

// No src, so Avatar renders its initials fallback ("AL") — offline and stable.
const PERSON = {
  name: 'Ada Lovelace',
  role: 'Design Engineer',
  handle: '@ada',
  bio: 'Building the morphing block collection. Occasional poet of analytical engines.',
  stats: [
    { label: 'Followers', value: '1.2k' },
    { label: 'Following', value: '312' },
    { label: 'Projects', value: '48' },
  ],
} as const;

// The avatar is 52px collapsed and 56px in the card header — scaling the single
// element up rather than swapping in a bigger one keeps it continuous.
const AVATAR = 52;
const AVATAR_OPEN_SCALE = 56 / AVATAR;
// Card padding (p-5 = 20px): where the travelling avatar comes to rest, matching
// the header's reserved slot.
const CARD_PAD = 20;

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/**
 * 03 · Avatar → Profile Card. The collapsed state is the ibirdui Avatar as a
 * profile trigger; on open it morphs into a profile card — the name + role, a Pro
 * Badge, a bio, a Separator-split stats row and a Follow/Message Button pair. The
 * avatar itself is a *single, persistent* element that travels and scales from
 * the collapsed circle into its slot in the card header (shared-element style, no
 * crossfade); the surface springs between the two sizes and the card's sections
 * stagger in around it.
 */
function ProfileCard({ expanded: open, onToggle }: MorphDemoProps) {
  return (
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 336 : 52, height: open ? 316 : 52 }}
        transition={springs.layout}
      >
        {/* open — the profile card, mounted only while expanded (real enter + exit).
            Its header leaves a spacer where the travelling avatar comes to rest. */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionCardBlock
              key="card"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{ borderRadius: 22, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
              className="absolute inset-0 flex flex-col overflow-hidden p-5"
            >
              {/* header — a spacer reserves the avatar's slot + a labelled close */}
              <motion.div variants={item} className="flex items-start gap-3.5">
                <div className="h-14 w-14 flex-none" aria-hidden="true" />
                <div className="min-w-0 flex-1 pt-0.5">
                  {/* A div, not a heading: it must not force a heading level onto
                      the page (the section already owns the h3). */}
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-[16px] tracking-tight text-foreground">
                      {PERSON.name}
                    </span>
                    <Badge style={{ padding: '2px 8px', fontSize: '11px' }}>Pro</Badge>
                  </div>
                  <div className="mt-0.5 text-[13px] text-muted-foreground">
                    {PERSON.role} · {PERSON.handle}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onToggle}
                  aria-label="Close profile"
                  className="-mr-1 -mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CloseIcon />
                </button>
              </motion.div>

              <motion.p
                variants={item}
                className="mt-3.5 text-[13.5px] leading-relaxed text-foreground/70"
              >
                {PERSON.bio}
              </motion.p>

              <motion.div variants={item} className="mt-4">
                <Separator />
              </motion.div>

              {/* stats — three columns that cascade in */}
              <motion.div variants={listReveal} className="mt-4 flex items-stretch">
                {PERSON.stats.map((s, i) => (
                  <React.Fragment key={s.label}>
                    {i > 0 && <Separator orientation="vertical" className="mx-1" />}
                    <motion.div variants={item} className="flex flex-1 flex-col items-center">
                      <span className="font-semibold text-[16px] tracking-tight text-foreground">
                        {s.value}
                      </span>
                      <span className="mt-0.5 text-[11.5px] text-muted-foreground">{s.label}</span>
                    </motion.div>
                  </React.Fragment>
                ))}
              </motion.div>

              {/* actions — Follow (primary) + Message (secondary) */}
              <motion.div variants={item} className="mt-auto flex gap-2 pt-4">
                <Button className="flex-1">Follow</Button>
                <Button variant="secondary" className="flex-1">
                  Message
                </Button>
              </motion.div>
            </MotionCardBlock>
          )}
        </AnimatePresence>

        {/* The single, persistent Avatar. Because it never unmounts, it *travels*
            and scales between the collapsed circle (x/y 0, scale 1) and its header
            slot (x/y = card padding, scale 56/52) on the same layout spring — no
            crossfade. Collapsed it's the interactive trigger; open it's decorative
            (the card's close control + text take over), so it's disabled + hidden
            from assistive tech to stay out of the tab order and a11y tree. */}
        <motion.button
          type="button"
          onClick={open ? undefined : onToggle}
          disabled={open}
          tabIndex={open ? -1 : 0}
          aria-hidden={open || undefined}
          aria-label={open ? undefined : `View ${PERSON.name}'s profile`}
          aria-expanded={open}
          className="absolute top-0 left-0 z-20 inline-flex p-0 rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          style={{ transformOrigin: 'top left', pointerEvents: open ? 'none' : 'auto' }}
          initial={false}
          animate={{
            x: open ? CARD_PAD : 0,
            y: open ? CARD_PAD : 0,
            scale: open ? AVATAR_OPEN_SCALE : 1,
            // A lime glow that fades out as the avatar settles into the card.
            boxShadow: open
              ? '0 10px 25px -5px rgba(163, 230, 53, 0)'
              : '0 10px 25px -5px rgba(163, 230, 53, 0.45)',
          }}
          transition={springs.layout}
        >
          <Avatar
            name={PERSON.name}
            size={AVATAR}
            aria-hidden="true"
            className="bg-primary/15 font-semibold text-primary"
          />
        </motion.button>
      </motion.div>
    </MotionProvider>
  );
}

// ── 04 · Product Card → Product Detail ──────────────────────────────────────
// Built with the ibirdui Card, Button, Badge and Separator, animated via
// block-motion (MotionProvider + layout spring) so it honours prefers-reduced-
// motion. The product image is a single persistent element that resizes from a
// 56px thumbnail into a full-width hero (shared-element style, no crossfade); the
// preview text swaps through AnimatePresence and the detail sections stagger in.
const PRODUCT = {
  name: 'Trailblazer Runner',
  price: '$129',
  rating: '4.8',
  reviews: '128',
  description:
    'A featherweight trail shoe with a responsive foam midsole and a grippy all-terrain outsole. Built to go the distance.',
  sizes: [{ label: '40' }, { label: '41', active: true }, { label: '42' }, { label: '43' }] as {
    label: string;
    active?: boolean;
  }[],
};

// 56px square thumbnail collapsed → full-width hero open, anchored at the p-4 pad.
const IMG = 56;
const IMG_OPEN_W = 308; // container 340 − 2×16 padding
const IMG_OPEN_H = 140;
const PROD_PAD = 16;
const prodChipStyle = { padding: '5px 12px', fontSize: '12.5px' } as const;

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[14px] w-[14px] text-primary"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.9l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.8 7.8 7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-full w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

/**
 * 04 · Product Card → Product Detail. The collapsed state is a compact product
 * preview (thumbnail + name + price) that is itself the trigger; on open it
 * morphs into a full detail page — hero image, name + rating, price, description,
 * a row of Badge size chips and an Add-to-cart Button. The product image is a
 * single persistent element that resizes from the thumbnail into the hero (no
 * crossfade); the surface springs between the two sizes and the sections stagger.
 */
function ProductDetail({ expanded: open, onToggle }: MorphDemoProps) {
  return (
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 340 : 244, height: open ? 424 : 88 }}
        transition={springs.layout}
      >
        {/* collapsed — the product preview card, and the trigger */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.button
              key="closed"
              type="button"
              onClick={onToggle}
              aria-label={`View ${PRODUCT.name} details`}
              aria-expanded={open}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-lg shadow-black/5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="h-14 w-14 flex-none" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-[14.5px] text-foreground">
                  {PRODUCT.name}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-semibold text-[13px] text-primary">{PRODUCT.price}</span>
                  <Badge style={{ padding: '2px 8px', fontSize: '10.5px' }}>New</Badge>
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* open — the product-detail card (top spacer = where the hero grows in) */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionCardBlock
              key="card"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{ borderRadius: 20, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
              className="absolute inset-0 flex flex-col overflow-hidden p-4"
            >
              <div className="h-[140px] flex-none" aria-hidden="true" />

              {/* name + rating, price on the right */}
              <motion.div variants={item} className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {/* A div, not a heading: it must not force a heading level onto
                      the page (the section already owns the h3). */}
                  <div className="truncate font-semibold text-[16px] tracking-tight text-foreground">
                    {PRODUCT.name}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                    <StarIcon />
                    <span className="font-medium text-foreground">{PRODUCT.rating}</span>
                    <span>· {PRODUCT.reviews} reviews</span>
                  </div>
                </div>
                <div className="flex-none font-semibold text-[17px] tracking-tight text-foreground">
                  {PRODUCT.price}
                </div>
              </motion.div>

              <motion.p
                variants={item}
                className="mt-3 text-[13px] leading-relaxed text-foreground/70"
              >
                {PRODUCT.description}
              </motion.p>

              {/* size chips — the active one isn't colour-only: aria-current + label */}
              <motion.div variants={item} className="mt-4">
                <div className="font-mono text-[10.5px] text-muted-foreground uppercase tracking-[0.09em]">
                  Size
                </div>
                <div role="group" aria-label="Size" className="mt-2 flex gap-2">
                  {PRODUCT.sizes.map((s) => {
                    const variant: BadgeVariant = s.active ? 'default' : 'secondary';
                    return (
                      <Badge
                        key={s.label}
                        variant={variant}
                        style={prodChipStyle}
                        aria-current={s.active || undefined}
                      >
                        {s.label}
                        {s.active && <span className="sr-only"> (selected)</span>}
                      </Badge>
                    );
                  })}
                </div>
              </motion.div>

              {/* actions — a Separator rules off the Add-to-cart row */}
              <motion.div variants={item} className="mt-auto pt-4">
                <Separator />
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1">Add to cart</Button>
                  <Button variant="outline" size="icon" aria-label="Save to wishlist">
                    <HeartIcon />
                  </Button>
                </div>
              </motion.div>

              {/* close — floats over the hero, above the image (z-20) */}
              <motion.button
                variants={item}
                type="button"
                onClick={onToggle}
                aria-label="Close product details"
                className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-foreground shadow-sm outline-none backdrop-blur hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CloseIcon />
              </motion.button>
            </MotionCardBlock>
          )}
        </AnimatePresence>

        {/* The single, persistent product image — resizes from thumbnail to hero
            on the same layout spring, no crossfade. Decorative + non-interactive. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-4 left-4 z-10 flex items-center justify-center overflow-hidden bg-primary/10 bg-gradient-to-br from-primary/30 to-transparent"
          initial={false}
          animate={{
            width: open ? IMG_OPEN_W : IMG,
            height: open ? IMG_OPEN_H : IMG,
            borderRadius: open ? 14 : 12,
          }}
          style={{ left: PROD_PAD, top: PROD_PAD }}
          transition={springs.layout}
        >
          <motion.div
            className="text-primary/45"
            initial={false}
            animate={{ width: open ? 44 : 26, height: open ? 44 : 26 }}
            transition={springs.layout}
          >
            <BagIcon />
          </motion.div>
        </motion.div>
      </motion.div>
    </MotionProvider>
  );
}

// ── 05 · Notification Dot → Center ──────────────────────────────────────────
// Built with the ibirdui Button, Badge and Card, animated via block-motion. The
// bell Button and the drawer Card swap through AnimatePresence (real enter +
// exit); the drawer's header, notification rows and footer stagger in on open.
type Tile = 'mc' | 'check' | 'warning' | 'dollar';
interface Note {
  id: string;
  tile: Tile;
  /** Optional bold lead (a name), rendered before the regular-weight title. */
  lead?: string;
  title: string;
  meta: string;
  unread?: boolean;
  /** The one row that carries the highlight surface (the latest unread). */
  highlighted?: boolean;
}
const NOTES: Note[] = [
  {
    id: 'mira',
    tile: 'mc',
    lead: 'Mira Chen',
    title: 'assigned you a task',
    meta: 'Design review · 2m ago',
    unread: true,
    highlighted: true,
  },
  {
    id: 'deploy',
    tile: 'check',
    title: 'Deploy to production succeeded',
    meta: 'CI/CD · 18m ago',
    unread: true,
  },
  {
    id: 'storage',
    tile: 'warning',
    title: 'Storage nearing 80% of limit',
    meta: 'Billing · 1h ago',
    unread: true,
  },
  { id: 'payout', tile: 'dollar', title: 'You received a $240 payout', meta: 'Payments · 3h ago' },
];
const NEW = NOTES.filter((n) => n.unread).length;

// Each notification kind gets a tinted tile using a semantic theme token, so the
// whole thing re-themes with the host palette.
const TILE: Record<Tile, string> = {
  mc: 'bg-primary text-primary-foreground',
  check: 'bg-muted text-foreground/80',
  warning: 'bg-warning/15 text-warning',
  dollar: 'bg-success/15 text-success',
};

// Inline styles override the Badge's own classes reliably (it joins classNames
// without tailwind-merge).
const countStyle: React.CSSProperties = {
  position: 'absolute',
  top: -2,
  right: -2,
  height: 20,
  minWidth: 20,
  padding: '0 5px',
  borderRadius: 999,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontVariantNumeric: 'tabular-nums',
};

function TileIcon({ tile }: { tile: Tile }) {
  if (tile === 'mc') return <>MC</>;
  if (tile === 'check') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  if (tile === 'warning') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4.5" />
        <path d="M12 16h.01" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="1.5" x2="12" y2="22.5" />
      <path d="M17 5.5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

/**
 * 05 · Notification Dot → Center. The collapsed state is the ibirdui Button (bell)
 * with an unread-count Badge; on open it morphs into a notification centre — a
 * header (bell doubling as the close control, title, filled unread pill), a list
 * of rows with tinted semantic icon tiles (the latest unread highlighted) and a
 * centred Mark-all-as-read link. The surface springs between the two sizes and
 * the drawer's sections stagger in.
 */
function NotificationCenter({ expanded: open, onToggle }: MorphDemoProps) {
  return (
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 380 : 52, height: open ? 428 : 52 }}
        transition={springs.layout}
      >
        {/* closed — the bell Button + an unread-count Badge, the trigger */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.div
              key="closed"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Button
                onClick={onToggle}
                size="icon"
                aria-expanded={open}
                aria-label={`Open notifications (${NEW} unread)`}
                className="h-full w-full rounded-full shadow-lg shadow-primary/40"
              >
                <BellIcon className="h-[21px] w-[21px]" />
              </Button>
              <Badge variant="destructive" aria-hidden="true" style={countStyle}>
                {NEW}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* open — the notification centre */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionCardBlock
              key="card"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{ borderRadius: 22, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
              className="absolute inset-0 flex flex-col overflow-hidden"
            >
              {/* header — the bell (also the close control) + title + "N new" pill */}
              <motion.div
                variants={item}
                className="flex items-center justify-between px-5 pt-5 pb-3"
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onToggle}
                    aria-label="Close notifications"
                    className="relative flex-none rounded-full text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <BellIcon className="h-[18px] w-[18px]" />
                    <span
                      aria-hidden="true"
                      className="absolute -top-1.5 -right-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-destructive px-1 font-semibold text-[10px] text-destructive-foreground"
                    >
                      {NEW}
                    </span>
                  </button>
                  {/* A div, not a heading: it must not force a heading level onto
                      the page (the section already owns the h3). */}
                  <div className="font-semibold text-[16px] tracking-tight text-foreground">
                    Notifications
                  </div>
                </div>
                <Badge style={{ borderRadius: 999, padding: '3px 11px', fontSize: '12px' }}>
                  {NEW} new
                </Badge>
              </motion.div>

              {/* list — custom rows with tinted icon tiles, latest unread highlighted */}
              <motion.div
                variants={listReveal}
                className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-auto px-3"
              >
                {NOTES.map((n) => (
                  <motion.div
                    key={n.id}
                    variants={item}
                    className={cx(
                      'flex items-center gap-3 rounded-2xl px-3 py-2.5',
                      n.highlighted && 'bg-primary/[0.07]',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cx(
                        'flex h-10 w-10 flex-none items-center justify-center rounded-xl font-semibold text-[13px]',
                        TILE[n.tile],
                      )}
                    >
                      <TileIcon tile={n.tile} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] text-foreground">
                        {n.lead ? (
                          <>
                            <span className="font-semibold">{n.lead}</span>{' '}
                            <span className="text-foreground/80">{n.title}</span>
                          </>
                        ) : (
                          <span className="font-semibold">{n.title}</span>
                        )}
                        {n.unread && <span className="sr-only"> (unread)</span>}
                      </div>
                      <div className="mt-0.5 text-[12px] text-muted-foreground">{n.meta}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* footer — a centred "Mark all as read" link */}
              <motion.div variants={item} className="px-3 pt-2 pb-4">
                <Button variant="link" className="w-full bg-transparent">
                  Mark all as read
                </Button>
              </motion.div>
            </MotionCardBlock>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionProvider>
  );
}

// ── 06 · FAB → Action Menu ──────────────────────────────────────────────────
// Built with the ibirdui Card, Button and Separator, animated via block-motion.
// The FAB persists and rotates +→× while travelling into the menu header; the
// menu Card springs in through AnimatePresence and its actions stagger in.
interface FabAction {
  id: string;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
}
const FAB = 56;
const FAB_OPEN_SCALE = 40 / FAB;
const FAB_PAD = 16;
const fabRowStyle: React.CSSProperties = {
  height: 'auto',
  width: '100%',
  justifyContent: 'flex-start',
  gap: 12,
  padding: '7px 8px',
};

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
const fabGlyph = {
  viewBox: '0 0 24 24',
  className: 'h-[18px] w-[18px]',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;
function DocIcon() {
  return (
    <svg {...fabGlyph} aria-hidden="true">
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M6 3h8l5 5v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}
function TaskIcon() {
  return (
    <svg {...fabGlyph} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
}
function InviteIcon() {
  return (
    <svg {...fabGlyph} aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg {...fabGlyph} aria-hidden="true">
      <path d="M12 15V4" />
      <path d="M8 8l4-4 4 4" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}
const FAB_ACTIONS: FabAction[] = [
  { id: 'doc', label: 'New document', shortcut: '⌘N', icon: <DocIcon /> },
  { id: 'task', label: 'New task', shortcut: '⌘T', icon: <TaskIcon /> },
  { id: 'invite', label: 'Invite people', shortcut: '⌘I', icon: <InviteIcon /> },
  { id: 'upload', label: 'Upload file', shortcut: '⌘U', icon: <UploadIcon /> },
];

/**
 * 06 · FAB → Action Menu. The collapsed state is a lime FAB (+); on open it
 * morphs into a quick-actions menu — a title, a Separator and a cascade of
 * ghost-Button actions. The FAB is a single persistent element that travels and
 * scales into the menu header while its plus rotates into a close (×).
 */
function ActionMenu({ expanded: open, onToggle }: MorphDemoProps) {
  return (
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 248 : 56, height: open ? 292 : 56 }}
        transition={springs.layout}
      >
        {/* open — the menu card (its header leaves a spacer where the FAB rests) */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionCardBlock
              key="card"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{ borderRadius: 20, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
              className="absolute inset-0 flex flex-col overflow-hidden p-4"
            >
              {/* header — a spacer holds the FAB's slot + the menu title */}
              <motion.div variants={item} className="flex items-center gap-3">
                <div className="h-10 w-10 flex-none" aria-hidden="true" />
                {/* A div, not a heading: it must not force a heading level onto
                    the page (the section already owns the h3). */}
                <div className="font-semibold text-[15px] tracking-tight text-foreground">
                  Create
                </div>
              </motion.div>

              <motion.div variants={item} className="mt-3">
                <Separator />
              </motion.div>

              {/* actions — ibirdui ghost Buttons, cascaded in */}
              <motion.div
                variants={listReveal}
                role="group"
                aria-label="Quick actions"
                className="mt-2 flex flex-col gap-0.5"
              >
                {FAB_ACTIONS.map((a) => (
                  <motion.div key={a.id} variants={item}>
                    <Button variant="ghost" className="bg-transparent" style={fabRowStyle}>
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-primary/12 text-primary">
                        {a.icon}
                      </span>
                      <span className="flex-1 text-left font-medium text-[13.5px] text-foreground">
                        {a.label}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {a.shortcut}
                      </span>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </MotionCardBlock>
          )}
        </AnimatePresence>

        {/* The single, persistent FAB — travels + scales into the menu header
            while its plus rotates into a close (×). It stays the toggle. */}
        <motion.button
          type="button"
          onClick={onToggle}
          aria-label={open ? 'Close actions' : 'Open actions'}
          aria-expanded={open}
          className="absolute top-0 left-0 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          style={{ transformOrigin: 'top left' }}
          initial={false}
          animate={{
            x: open ? FAB_PAD : 0,
            y: open ? FAB_PAD : 0,
            scale: open ? FAB_OPEN_SCALE : 1,
            rotate: open ? 45 : 0,
          }}
          transition={springs.layout}
        >
          <PlusIcon />
        </motion.button>
      </motion.div>
    </MotionProvider>
  );
}

// ── 07 · KPI Widget → Dashboard ─────────────────────────────────────────────
// Built with the ibirdui Card, Button, Badge and Separator, animated via
// block-motion. The collapsed KPI widget and the dashboard Card swap through
// AnimatePresence (real enter + exit); the header, KPI tiles, chart and footer
// stagger in on open, and the chart's columns grow from the baseline.
interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  /** Arrow direction; `good` decides the colour so "down is good" reads right. */
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

// Chart columns grow from the baseline rather than sliding in.
const barReveal: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  show: { scaleY: 1, opacity: 1, transition: springs.smooth },
  exit: { scaleY: 0, opacity: 0, transition: { duration: 0.15 } },
};

// The trend chip is an ibirdui Badge tinted per good/bad through inline style
// (the primitive joins classes without tailwind-merge, so style wins reliably).
function trendStyle(good: boolean): React.CSSProperties {
  return {
    background: good ? 'hsl(var(--success) / 0.15)' : 'hsl(var(--destructive) / 0.15)',
    color: good ? 'hsl(var(--success))' : 'hsl(var(--destructive))',
    borderRadius: 999,
    padding: '2px 7px',
    fontSize: '11px',
    fontVariantNumeric: 'tabular-nums',
  };
}

function TrendArrow({ dir }: { dir: 'up' | 'down' }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === 'up' ? <path d="M6 15l6-6 6 6" /> : <path d="M6 9l6 6 6-6" />}
    </svg>
  );
}

/**
 * 07 · KPI Widget → Dashboard. The collapsed state is a compact KPI widget
 * (label, value, trend chip + sparkline) that is itself the trigger; on open it
 * morphs into an analytics dashboard — a header with a period Badge, a row of KPI
 * stat tiles with coloured trend deltas, a bar chart whose columns grow from the
 * baseline, a Separator and a report-link Button. The surface springs between the
 * two sizes and the sections stagger in.
 */
function KpiDashboard({ expanded: open, onToggle }: MorphDemoProps) {
  // biome-ignore lint/style/noNonNullAssertion: KPIS is a non-empty literal.
  const primary = KPIS[0]!;
  return (
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
              onClick={onToggle}
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
            <MotionCardBlock
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
                  {/* A div, not a heading: it must not force a heading level onto
                      the page (the section already owns the h3). */}
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
                    onClick={onToggle}
                    aria-label="Close dashboard"
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </motion.div>

              {/* KPI tiles — three stats that cascade in */}
              <motion.div
                variants={listReveal}
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
                  <div className="font-mono text-[10.5px] text-muted-foreground uppercase tracking-[0.09em]">
                    Revenue
                  </div>
                  <div className="text-[11px] text-muted-foreground">Mon–Sun</div>
                </div>
                <motion.div
                  variants={listReveal}
                  role="img"
                  aria-label="Revenue by day over the last 7 days, trending up with a peak on Saturday"
                  className="flex h-[92px] items-end gap-2"
                >
                  {BARS.map((b) => (
                    <motion.span
                      key={b.d}
                      variants={barReveal}
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
                  <ArrowIcon />
                </Button>
              </motion.div>
            </MotionCardBlock>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionProvider>
  );
}
