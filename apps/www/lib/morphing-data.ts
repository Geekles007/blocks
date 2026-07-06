/**
 * Single source of truth for the /morphing showcase. Pure data only (no React):
 * the section renderer and the live demos read from here, so a component is added
 * by fleshing out its entry (details + code) and wiring its demo in
 * `components/morphing/demos.tsx`.
 *
 * Honesty rule: only real, shipped components carry `whatMorphs`, `timing` and
 * `code`. Entries that aren't built yet are just a title + description (a public
 * roadmap) and render as "à venir" — no fabricated API, timings or code.
 */

import type { Locale } from './i18n';
import { type AddCommand, addCommands } from './install-command';

/**
 * The real ibirdui primitives a morph is built from. Each id is an actual
 * registry item (ui.ibird.dev/r/<id>.json) you install and compose — not an
 * abstract technique. The union grows as shipped morphs pull in more primitives.
 */
export type MorphComponentId =
  | 'button'
  | 'card'
  | 'block-motion'
  | 'input'
  | 'data-list'
  | 'badge'
  | 'separator'
  | 'avatar';

export interface MorphComponent {
  id: MorphComponentId;
  /** Registry / display name shown on tags and in the legend, e.g. "Button". */
  name: string;
  /** How this primitive is used across the morphs. */
  blurb: string;
  /** Tailwind background class for the legend / tag dot (theme-adapted). */
  dot: string;
}

// Each ibirdui primitive gets a distinct theme hue for its legend/tag dot.
export const MORPH_COMPONENTS: MorphComponent[] = [
  { id: 'button', name: 'Button', blurb: 'the collapsed trigger', dot: 'bg-primary' },
  { id: 'card', name: 'Card', blurb: 'the expanded surface', dot: 'bg-success' },
  { id: 'block-motion', name: 'block-motion', blurb: 'reduced-motion springs', dot: 'bg-warning' },
  { id: 'input', name: 'Input', blurb: 'the search field', dot: 'bg-destructive' },
  { id: 'data-list', name: 'DataList', blurb: 'the results list', dot: 'bg-muted-foreground' },
  { id: 'badge', name: 'Badge', blurb: 'per-result labels', dot: 'bg-foreground' },
  { id: 'separator', name: 'Separator', blurb: 'the section rule', dot: 'bg-border' },
  { id: 'avatar', name: 'Avatar', blurb: 'the profile trigger', dot: 'bg-accent-foreground' },
];

/** Look up an ibirdui primitive by id (for tags). */
export const morphComponent = (id: MorphComponentId): MorphComponent =>
  // biome-ignore lint/style/noNonNullAssertion: MORPH_COMPONENTS is a non-empty literal.
  MORPH_COMPONENTS.find((c) => c.id === id) ?? MORPH_COMPONENTS[0]!;

/**
 * The single command that installs a shipped morph *as a registry block*: the
 * block file plus every ibirdui primitive it composes (button, card,
 * block-motion, …) are resolved cross-registry and copied into your project in
 * one shot — you never list primitives by hand. Returned once per package
 * manager (npx / pnpm dlx / bunx) so the UI can offer a toggle. Empty for
 * roadmap entries (no block shipped yet), so the honesty rule holds.
 */
export function installVariants(entry: MorphEntry): AddCommand[] {
  if (!entry.registryKey) return [];
  return addCommands(`blocks.ibird.dev/r/${entry.registryKey}`);
}

/**
 * The one npm package the CLI can't copy for you: it prints framer-motion as a
 * follow-up rather than installing it, so we surface the same line. Every
 * shipped morph drives its animation with it. Empty for roadmap entries.
 */
export function runtimeInstall(entry: MorphEntry): string | null {
  return entry.registryKey ? 'npm install framer-motion' : null;
}

export interface MorphEntry {
  /** Zero-padded index, e.g. "01". Also the demo registry key. */
  n: string;
  /**
   * The registry block this morph ships as — its item name at
   * blocks.ibird.dev/r/<registryKey>.json. Present only for shipped entries;
   * `ibirdui add` this to pull the block plus every ibirdui primitive it
   * composes in one command. Roadmap entries omit it.
   */
  registryKey?: string;
  title: string;
  description: string;
  /** The ibirdui primitives this morph is built from — only for shipped entries. */
  tags: MorphComponentId[];
  /** The "What morphs" explainer — present only for shipped components. */
  whatMorphs?: string;
  /** Timing chips — present only for shipped components. */
  timing?: string[];
  /** React usage snippet for the code drawer — present only for shipped components. */
  code?: string;
}

export const MORPH_ENTRIES: MorphEntry[] = [
  {
    n: '01',
    registryKey: 'morph-button-card',
    title: 'Morph Button → Floating Card',
    description: 'A CTA built on the ibirdui Button that expands into a floating plan card.',
    tags: ['button', 'card', 'block-motion'],
    whatMorphs:
      'The surface springs between two sizes while the ibirdui Button and the card swap through AnimatePresence — so both get real enter and exit. The card contents stagger in on open and reverse-stagger out on close. Built with the ibirdui Button + block-motion + framer-motion, so it honours prefers-reduced-motion.',
    timing: ['framer-motion', 'layout spring', 'stagger 60ms'],
    code: `import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { MotionProvider, springs } from "@/lib/block-motion";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useState } from "react";

// The floating plan surface is the ibirdui Card, made animatable so it keeps
// the crossfade/stagger variants. Card supplies the border, bg-card and
// text-card-foreground; we only override radius + shadow below.
const MotionCard = motion.create(Card);

// Card: fades as a whole and staggers its children — forwards on enter,
// reversed on exit. Children inherit "show" / "exit" via variant propagation.
const cardReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.18, staggerChildren: 0.035, staggerDirection: -1 } },
};
const listReveal: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

/** A CTA built on the ibirdui Button that morphs into a floating plan card. */
export function UpgradeCard() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 360 : 186, height: open ? 272 : 52 }}
        transition={springs.layout}
      >
        {/* closed — the Button, mounted only while collapsed */}
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
              <Button onClick={toggle} className="h-full w-full gap-2 rounded-full text-[15px] shadow-lg shadow-primary/40">
                Upgrade plan
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
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
              // Card supplies border + bg-card; radius/shadow go through style
              // because the primitive joins classes without tailwind-merge.
              style={{ borderRadius: 22, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.1)" }}
              className="absolute inset-0 flex flex-col overflow-hidden p-6"
            >
              <motion.div variants={item} className="mb-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-primary/12">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" className="text-primary" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
              </motion.div>
              {/* a div, not a heading — must not force a heading level */}
              <motion.div variants={item} className="font-semibold text-[17px] tracking-tight text-foreground">
                Pro plan
              </motion.div>
              <motion.p variants={item} className="mt-1 text-[13.5px] leading-snug text-muted-foreground">
                Unlimited projects, advanced analytics and priority support.
              </motion.p>
              <motion.ul variants={listReveal} className="mt-auto mb-auto flex flex-col gap-2 pt-3.5 text-[13px] font-medium text-foreground/80">
                <motion.li variants={item} className="flex items-center gap-2.5"><Check /> Unlimited seats</motion.li>
                <motion.li variants={item} className="flex items-center gap-2.5"><Check /> Priority support</motion.li>
              </motion.ul>
              <motion.div variants={item}>
                <Button size="lg" className="w-full">Upgrade — $24/mo</Button>
              </motion.div>
            </MotionCard>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionProvider>
  );
}

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.4" className="text-primary" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}`,
  },

  {
    n: '02',
    registryKey: 'morph-search-panel',
    title: 'Search Icon → Search Panel',
    description:
      'A search icon that expands into a command menu — search field, suggestions and filter chips.',
    tags: ['button', 'input', 'data-list', 'separator', 'badge'],
    whatMorphs:
      'The surface springs between the icon and the full command menu while the ibirdui Button and the panel swap through AnimatePresence — both get real enter and exit. Inside, the ibirdui Input, a DataList of suggestions (first row highlighted), a Separator and a row of Badge filter chips stagger in on open and reverse-stagger out on close. Animated with plain framer-motion; MotionConfig honours prefers-reduced-motion.',
    timing: ['framer-motion', 'layout spring', 'stagger 60ms'],
    code: `import { Badge, type BadgeVariant } from "@/components/badge";
import { Button } from "@/components/button";
import { DataList } from "@/components/data-list";
import { Input } from "@/components/input";
import { Separator } from "@/components/separator";
import { success } from "@/lib/async-state";
import { AnimatePresence, motion, MotionConfig, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Plain framer-motion: a local layout spring drives the size morph and the panel
// sections stagger in on open, reverse-stagger out on close.
const spring = { type: "spring", stiffness: 320, damping: 34, mass: 0.9 } as const;
const panelReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.18, staggerChildren: 0.035, staggerDirection: -1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 30 } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

interface Suggestion { id: string; title: string; kind: "project" | "person" | "file" }
const SUGGESTIONS: Suggestion[] = [
  { id: "design-system", title: "Design system revamp", kind: "project" },
  { id: "mira-chen", title: "Mira Chen", kind: "person" },
  { id: "q3-roadmap", title: "Q3 roadmap.pdf", kind: "file" },
];
// The active chip isn't distinguished by colour alone: it carries aria-current
// plus a visually-hidden "(selected)" label.
const FILTERS: { label: string; variant: BadgeVariant; active?: boolean }[] = [
  { label: "All", variant: "default", active: true },
  { label: "Projects", variant: "secondary" },
  { label: "People", variant: "secondary" },
  { label: "Files", variant: "secondary" },
];
const chipStyle = { padding: "4px 12px", fontSize: "12.5px" } as const;

/** A search icon that morphs into a command menu: field, suggestions, filters. */
export function SearchPanel() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  // On open, move focus to the field like a command menu would (preventScroll so
  // it doesn't yank the page to the demo).
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 424 : 52, height: open ? 332 : 52 }}
        transition={spring}
      >
        {/* closed — the Button as a search-icon trigger */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.div key="closed" className="absolute inset-0 overflow-hidden rounded-full"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <Button onClick={toggle} size="icon" aria-label="Open search"
                className="h-full w-full rounded-full shadow-lg shadow-primary/40">
                <Search className="h-[18px] w-[18px]" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* open — the command menu */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div key="panel" variants={panelReveal} initial="hidden" animate="show" exit="exit"
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[18px] border border-border bg-card p-3.5 shadow-2xl shadow-black/10">
              {/* search field — Input softened into a filled search box */}
              <motion.div variants={item} className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Search className="h-[18px] w-[18px]" />
                </span>
                <Input ref={inputRef} placeholder="Search projects, people, files…" aria-label="Search"
                  style={{ height: 46, borderRadius: 12, paddingLeft: "2.75rem", fontSize: "14.5px", background: "hsl(var(--muted) / 0.6)" }} />
              </motion.div>

              {/* suggestions — borderless DataList, first row selected */}
              <motion.div variants={item} className="mt-4 min-h-0 flex-1 overflow-auto">
                <div className="mb-1.5 px-1 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                  Suggestions
                </div>
                <DataList state={success(SUGGESTIONS)} getKey={(s) => s.id} label="Suggestions"
                  className="list-none border-0 divide-y-0 rounded-none pl-0">
                  {(s, i) => (
                    // "selected" isn't colour-only: aria-current + a hidden label.
                    <div aria-current={i === 0 || undefined}
                      className={cx("-mx-2 -my-1.5 flex items-center gap-3 rounded-[10px] px-2 py-1.5", i === 0 && "bg-primary/10")}>
                      <span className={cx("flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px]",
                        i === 0 ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>
                        <KindIcon kind={s.kind} />
                      </span>
                      <span className={cx("truncate text-[14px]", i === 0 ? "font-medium text-foreground" : "text-foreground/90")}>
                        {s.title}
                        {i === 0 && <span className="sr-only"> (selected)</span>}
                      </span>
                    </div>
                  )}
                </DataList>
              </motion.div>

              {/* filters — a Separator splits the suggestions from the chips */}
              <motion.div variants={item} className="mt-3">
                <Separator decorative={false} />
                <div role="group" aria-label="Filters" className="mt-3 flex items-center gap-2">
                  {FILTERS.map((f) => (
                    <Badge key={f.label} variant={f.variant} style={chipStyle} aria-current={f.active || undefined}>
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

function Search({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function KindIcon({ kind }: { kind: Suggestion["kind"] }) {
  const p = { viewBox: "0 0 24 24", className: "h-[15px] w-[15px]", fill: "none", stroke: "currentColor",
    strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (kind === "person")
    return <svg {...p}><circle cx="12" cy="8" r="3.2" /><path d="M5.5 19a6.5 6.5 0 0 1 13 0" /></svg>;
  if (kind === "file")
    return <svg {...p}><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M6 3h8l5 5v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /></svg>;
  return <svg {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 9v11" /></svg>;
}`,
  },

  // ── Roadmap ────────────────────────────────────────────────────────────────
  // Not built yet: title + description only. No tags — the primitive list is
  // only known once the demo ships — and no fabricated "what morphs"/timing/code.
  {
    n: '03',
    registryKey: 'morph-avatar-profile',
    title: 'Avatar → Profile Card',
    description: 'A circular avatar expands into a detailed profile card.',
    tags: ['avatar', 'card', 'badge', 'button', 'separator', 'block-motion'],
    whatMorphs:
      'The ibirdui Avatar is a single persistent element: it travels and scales from the collapsed circle into the card header — a real shared-element move, not a crossfade — while the Card springs in through AnimatePresence around it. The name + role, a Pro Badge, a bio, a Separator-split stats row and a Follow/Message Button pair stagger in on open and reverse-stagger out on close. Built with the ibirdui Avatar + block-motion + framer-motion, so it honours prefers-reduced-motion.',
    timing: ['framer-motion', 'layout spring', 'stagger 60ms'],
    code: `import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Separator } from "@/components/separator";
import { MotionProvider, springs } from "@/lib/block-motion";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Fragment, useState } from "react";

// The expanded surface is the ibirdui Card, made animatable so it keeps the
// crossfade/stagger variants. Card supplies border + bg-card; we only override
// radius + shadow below.
const MotionCard = motion.create(Card);

// No src, so the Avatar renders its initials fallback ("AL") — offline + stable.
const PERSON = {
  name: "Ada Lovelace",
  role: "Design Engineer",
  handle: "@ada",
  bio: "Building the morphing block collection. Occasional poet of analytical engines.",
  stats: [
    { label: "Followers", value: "1.2k" },
    { label: "Following", value: "312" },
    { label: "Projects", value: "48" },
  ],
} as const;

// The avatar is 52px collapsed and 56px in the card header — scaling one element
// keeps it continuous. CARD_PAD (p-5 = 20px) is where it comes to rest.
const AVATAR = 52;
const AVATAR_OPEN_SCALE = 56 / AVATAR;
const CARD_PAD = 20;

// Card fades as a whole and staggers its children — forwards on enter, reversed
// on exit. Children inherit "show" / "exit" via variant propagation.
const cardReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.18, staggerChildren: 0.035, staggerDirection: -1 } },
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

/** A circular Avatar that morphs into a detailed profile card. */
export function ProfileCard() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
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
            <MotionCard
              key="card"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              // Card supplies border + bg-card; radius/shadow go through style
              // because the primitive joins classes without tailwind-merge.
              style={{ borderRadius: 22, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.1)" }}
              className="absolute inset-0 flex flex-col overflow-hidden p-5"
            >
              {/* header — a spacer reserves the avatar's slot + a labelled close */}
              <motion.div variants={item} className="flex items-start gap-3.5">
                <div className="h-14 w-14 flex-none" aria-hidden="true" />
                <div className="min-w-0 flex-1 pt-0.5">
                  {/* a div, not a heading — must not force a heading level */}
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-[16px] tracking-tight text-foreground">
                      {PERSON.name}
                    </span>
                    <Badge style={{ padding: "2px 8px", fontSize: "11px" }}>Pro</Badge>
                  </div>
                  <div className="mt-0.5 text-[13px] text-muted-foreground">
                    {PERSON.role} · {PERSON.handle}
                  </div>
                </div>
                <button type="button" onClick={toggle} aria-label="Close profile"
                  className="-mr-1 -mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>

              <motion.p variants={item} className="mt-3.5 text-[13.5px] leading-relaxed text-foreground/70">
                {PERSON.bio}
              </motion.p>

              <motion.div variants={item} className="mt-4">
                <Separator />
              </motion.div>

              {/* stats — three columns that cascade in */}
              <motion.div variants={rowReveal} className="mt-4 flex items-stretch">
                {PERSON.stats.map((s, i) => (
                  <Fragment key={s.label}>
                    {i > 0 && <Separator orientation="vertical" className="mx-1" />}
                    <motion.div variants={item} className="flex flex-1 flex-col items-center">
                      <span className="font-semibold text-[16px] tracking-tight text-foreground">{s.value}</span>
                      <span className="mt-0.5 text-[11.5px] text-muted-foreground">{s.label}</span>
                    </motion.div>
                  </Fragment>
                ))}
              </motion.div>

              {/* actions — Follow (primary) + Message (secondary) */}
              <motion.div variants={item} className="mt-auto flex gap-2 pt-4">
                <Button className="flex-1">Follow</Button>
                <Button variant="secondary" className="flex-1">Message</Button>
              </motion.div>
            </MotionCard>
          )}
        </AnimatePresence>

        {/* The single, persistent Avatar. Because it never unmounts, it *travels*
            and scales between the collapsed circle and its header slot on the same
            layout spring — no crossfade. Collapsed it's the trigger; open it's
            decorative, so it's disabled + hidden from assistive tech. */}
        <motion.button
          type="button"
          onClick={open ? undefined : toggle}
          disabled={open}
          tabIndex={open ? -1 : 0}
          aria-hidden={open || undefined}
          aria-label={open ? undefined : \`View \${PERSON.name}'s profile\`}
          aria-expanded={open}
          className="absolute top-0 left-0 z-20 inline-flex p-0 rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          style={{ transformOrigin: "top left", pointerEvents: open ? "none" : "auto" }}
          initial={false}
          animate={{
            x: open ? CARD_PAD : 0,
            y: open ? CARD_PAD : 0,
            scale: open ? AVATAR_OPEN_SCALE : 1,
            boxShadow: open
              ? "0 10px 25px -5px rgba(163, 230, 53, 0)"
              : "0 10px 25px -5px rgba(163, 230, 53, 0.45)",
          }}
          transition={springs.layout}
        >
          <Avatar name={PERSON.name} size={AVATAR} aria-hidden="true"
            className="bg-primary/15 font-semibold text-primary" />
        </motion.button>
      </motion.div>
    </MotionProvider>
  );
}`,
  },
  {
    n: '04',
    registryKey: 'morph-product-detail',
    title: 'Product Card → Product Detail',
    description: 'A product preview morphs into a complete product page.',
    tags: ['card', 'button', 'badge', 'separator', 'block-motion'],
    whatMorphs:
      'The product image is a single persistent element: it resizes from a 56px thumbnail into a full-width hero — a real shared-element move, not a crossfade — while the preview text swaps out through AnimatePresence and the Card detail springs in around it. Name + rating, price, a description, a row of Badge size chips and an Add-to-cart Button pair stagger in on open and reverse-stagger out on close. Built with the ibirdui Card + block-motion + framer-motion, so it honours prefers-reduced-motion.',
    timing: ['framer-motion', 'layout spring', 'stagger 60ms'],
    code: `import { Badge, type BadgeVariant } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Separator } from "@/components/separator";
import { MotionProvider, springs } from "@/lib/block-motion";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useState } from "react";

// The detail surface is the ibirdui Card, made animatable so it keeps the
// crossfade/stagger variants.
const MotionCard = motion.create(Card);

// No real photo — a lime-tinted gradient tile stands in, so the block is offline
// and deterministic.
const PRODUCT = {
  name: "Trailblazer Runner",
  price: "$129",
  rating: "4.8",
  reviews: "128",
  description:
    "A featherweight trail shoe with a responsive foam midsole and a grippy all-terrain outsole. Built to go the distance.",
  sizes: [{ label: "40" }, { label: "41", active: true }, { label: "42" }, { label: "43" }] as {
    label: string;
    active?: boolean;
  }[],
};

// 56px square thumbnail collapsed → full-width hero open, anchored at the p-4 pad.
const IMG = 56;
const IMG_OPEN_W = 308; // container 340 − 2×16 padding
const IMG_OPEN_H = 140;
const PAD = 16;

const cardReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.18, staggerChildren: 0.035, staggerDirection: -1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};
const chipStyle = { padding: "5px 12px", fontSize: "12.5px" } as const;

/** A compact product card that morphs into a full product-detail page. */
export function ProductDetail() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 340 : 244, height: open ? 424 : 88 }}
        transition={springs.layout}
      >
        {/* collapsed — the product preview card, and the trigger (image slot is a
            spacer; the persistent image below sits on top of it) */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.button
              key="closed"
              type="button"
              onClick={toggle}
              aria-label={\`View \${PRODUCT.name} details\`}
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
                  <Badge style={{ padding: "2px 8px", fontSize: "10.5px" }}>New</Badge>
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* open — the product-detail card (top spacer = where the hero grows in) */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionCard
              key="card"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{ borderRadius: 20, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.1)" }}
              className="absolute inset-0 flex flex-col overflow-hidden p-4"
            >
              <div className="h-[140px] flex-none" aria-hidden="true" />

              {/* name + rating, price on the right */}
              <motion.div variants={item} className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {/* a div, not a heading — must not force a heading level */}
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

              <motion.p variants={item} className="mt-3 text-[13px] leading-relaxed text-foreground/70">
                {PRODUCT.description}
              </motion.p>

              {/* size chips — the active one isn't colour-only: aria-current + label */}
              <motion.div variants={item} className="mt-4">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.09em] text-muted-foreground">
                  Size
                </div>
                <div role="group" aria-label="Size" className="mt-2 flex gap-2">
                  {PRODUCT.sizes.map((s) => {
                    const variant: BadgeVariant = s.active ? "default" : "secondary";
                    return (
                      <Badge key={s.label} variant={variant} style={chipStyle}
                        aria-current={s.active || undefined}>
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
              <motion.button variants={item} type="button" onClick={toggle}
                aria-label="Close product details"
                className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-foreground shadow-sm outline-none backdrop-blur hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                <CloseIcon />
              </motion.button>
            </MotionCard>
          )}
        </AnimatePresence>

        {/* The single, persistent product image: it resizes from the 56px
            thumbnail into the full-width hero on the same layout spring — no
            crossfade. Decorative (a gradient photo stand-in), never the click
            target, so aria-hidden + pointer-events none. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-4 left-4 z-10 flex items-center justify-center overflow-hidden bg-primary/10 bg-gradient-to-br from-primary/30 to-transparent"
          initial={false}
          animate={{
            width: open ? IMG_OPEN_W : IMG,
            height: open ? IMG_OPEN_H : IMG,
            borderRadius: open ? 14 : 12,
          }}
          style={{ left: PAD, top: PAD }}
          transition={springs.layout}
        >
          <motion.div className="text-primary/45" initial={false}
            animate={{ width: open ? 44 : 26, height: open ? 44 : 26 }} transition={springs.layout}>
            <BagIcon />
          </motion.div>
        </motion.div>
      </motion.div>
    </MotionProvider>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[14px] w-[14px] text-primary" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.9l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95z" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.8 7.8 7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}`,
  },
  {
    n: '05',
    registryKey: 'morph-notification-center',
    title: 'Notification Dot → Center',
    description: 'A small badge transforms into a notification drawer.',
    tags: ['button', 'badge', 'card', 'block-motion'],
    whatMorphs:
      'The surface springs between the bell and the full drawer while the ibirdui Button and the Card swap through AnimatePresence — both get real enter and exit. Inside, a header (bell, title and a filled unread pill), a list of notifications with tinted semantic icon tiles — the latest unread carrying a highlight surface — and a centred Mark-all-as-read link stagger in on open and reverse-stagger out on close. Built with block-motion + framer-motion, so it honours prefers-reduced-motion.',
    timing: ['framer-motion', 'layout spring', 'stagger 60ms'],
    code: `import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { MotionProvider, springs } from "@/lib/block-motion";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { type CSSProperties, useState } from "react";

const MotionCard = motion.create(Card);
const cx = (...p: Array<string | false | undefined>) => p.filter(Boolean).join(" ");

type Tile = "mc" | "check" | "warning" | "dollar";
interface Note { id: string; tile: Tile; lead?: string; title: string; meta: string; unread?: boolean; highlighted?: boolean }
const NOTES: Note[] = [
  { id: "mira", tile: "mc", lead: "Mira Chen", title: "assigned you a task", meta: "Design review · 2m ago", unread: true, highlighted: true },
  { id: "deploy", tile: "check", title: "Deploy to production succeeded", meta: "CI/CD · 18m ago", unread: true },
  { id: "storage", tile: "warning", title: "Storage nearing 80% of limit", meta: "Billing · 1h ago", unread: true },
  { id: "payout", tile: "dollar", title: "You received a $240 payout", meta: "Payments · 3h ago" },
];
const NEW = NOTES.filter((n) => n.unread).length;

// Each notification kind gets a tinted tile using a semantic theme token.
const TILE: Record<Tile, string> = {
  mc: "bg-primary text-primary-foreground",
  check: "bg-muted text-foreground/80",
  warning: "bg-warning/15 text-warning",
  dollar: "bg-success/15 text-success",
};

const cardReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.18, staggerChildren: 0.035, staggerDirection: -1 } },
};
const listReveal: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

// Inline styles override the Badge's own classes reliably (it joins classNames
// without tailwind-merge).
const countStyle: CSSProperties = {
  position: "absolute", top: -2, right: -2, height: 20, minWidth: 20, padding: "0 5px",
  borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center",
  fontSize: "11px", fontVariantNumeric: "tabular-nums",
};

/** A notification bell with an unread dot that morphs into a notification centre. */
export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
    <MotionProvider>
      <motion.div className="relative" initial={false}
        animate={{ width: open ? 380 : 52, height: open ? 428 : 52 }} transition={springs.layout}>
        {/* closed — the bell Button + an unread-count Badge, the trigger */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.div key="closed" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}>
              <Button onClick={toggle} size="icon" aria-expanded={open}
                aria-label={\`Open notifications (\${NEW} unread)\`}
                className="h-full w-full rounded-full shadow-lg shadow-primary/40">
                <BellIcon className="h-[21px] w-[21px]" />
              </Button>
              <Badge variant="destructive" aria-hidden="true" style={countStyle}>{NEW}</Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* open — the notification centre */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionCard key="card" variants={cardReveal} initial="hidden" animate="show" exit="exit"
              style={{ borderRadius: 22, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.1)" }}
              className="absolute inset-0 flex flex-col overflow-hidden">
              {/* header — the bell (also the close control) + title + "N new" pill */}
              <motion.div variants={item} className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <button type="button" onClick={toggle} aria-label="Close notifications"
                    className="relative flex-none rounded-full text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <BellIcon className="h-[18px] w-[18px]" />
                    <span aria-hidden="true"
                      className="absolute -top-1.5 -right-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-destructive px-1 font-semibold text-[10px] text-destructive-foreground">
                      {NEW}
                    </span>
                  </button>
                  {/* a div, not a heading — must not force a heading level */}
                  <div className="font-semibold text-[16px] tracking-tight text-foreground">Notifications</div>
                </div>
                <Badge style={{ borderRadius: 999, padding: "3px 11px", fontSize: "12px" }}>{NEW} new</Badge>
              </motion.div>

              {/* list — custom rows with tinted icon tiles, latest unread highlighted */}
              <motion.div variants={listReveal} className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-auto px-3">
                {NOTES.map((n) => (
                  <motion.div key={n.id} variants={item}
                    className={cx("flex items-center gap-3 rounded-2xl px-3 py-2.5", n.highlighted && "bg-primary/[0.07]")}>
                    <span aria-hidden="true"
                      className={cx("flex h-10 w-10 flex-none items-center justify-center rounded-xl font-semibold text-[13px]", TILE[n.tile])}>
                      <TileIcon tile={n.tile} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] text-foreground">
                        {n.lead ? (
                          <>
                            <span className="font-semibold">{n.lead}</span>{" "}
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
                <Button variant="link" className="w-full bg-transparent">Mark all as read</Button>
              </motion.div>
            </MotionCard>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionProvider>
  );
}

function TileIcon({ tile }: { tile: Tile }) {
  if (tile === "mc") return <>MC</>;
  if (tile === "check")
    return <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>;
  if (tile === "warning")
    return <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v4.5" /><path d="M12 16h.01" /></svg>;
  return <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="1.5" x2="12" y2="22.5" /><path d="M17 5.5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}`,
  },
  {
    n: '06',
    registryKey: 'morph-fab-menu',
    title: 'FAB → Action Menu',
    description: 'A floating action button expands into multiple quick actions.',
    tags: ['card', 'button', 'separator', 'block-motion'],
    whatMorphs:
      'The FAB is a single persistent element: it travels and scales from the collapsed circle into the menu header while its plus rotates into a close (×) — a real shared-element move, not a crossfade — as the Card menu springs in around it. A title, a Separator and a cascade of ghost-Button actions (icon tile, label and keyboard shortcut) stagger in on open and reverse-stagger out on close. Built with the ibirdui Card + block-motion + framer-motion, so it honours prefers-reduced-motion.',
    timing: ['framer-motion', 'layout spring', 'stagger 50ms'],
    code: `import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Separator } from "@/components/separator";
import { MotionProvider, springs } from "@/lib/block-motion";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { type CSSProperties, type ReactNode, useState } from "react";

const MotionCard = motion.create(Card);

interface Action { id: string; label: string; shortcut: string; icon: ReactNode }
const ACTIONS: Action[] = [
  { id: "doc", label: "New document", shortcut: "⌘N", icon: <DocIcon /> },
  { id: "task", label: "New task", shortcut: "⌘T", icon: <TaskIcon /> },
  { id: "invite", label: "Invite people", shortcut: "⌘I", icon: <InviteIcon /> },
  { id: "upload", label: "Upload file", shortcut: "⌘U", icon: <UploadIcon /> },
];

// The FAB is 56px collapsed and shrinks to 40px in the menu header.
const FAB = 56;
const FAB_OPEN_SCALE = 40 / FAB;
const CARD_PAD = 16;

const cardReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.05, delayChildren: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.18, staggerChildren: 0.03, staggerDirection: -1 } },
};
const listReveal: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

// The action row's ghost Button is left-aligned via inline style (the primitive
// joins classes without tailwind-merge).
const rowStyle: CSSProperties = {
  height: "auto", width: "100%", justifyContent: "flex-start", gap: 12, padding: "7px 8px",
};

/** A floating action button that morphs into a quick-actions menu. */
export function ActionMenu() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
    <MotionProvider>
      <motion.div className="relative" initial={false}
        animate={{ width: open ? 248 : 56, height: open ? 292 : 56 }} transition={springs.layout}>
        {/* open — the menu card (its header leaves a spacer where the FAB rests) */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionCard key="card" variants={cardReveal} initial="hidden" animate="show" exit="exit"
              style={{ borderRadius: 20, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.1)" }}
              className="absolute inset-0 flex flex-col overflow-hidden p-4">
              {/* header — a spacer holds the FAB's slot + the menu title */}
              <motion.div variants={item} className="flex items-center gap-3">
                <div className="h-10 w-10 flex-none" aria-hidden="true" />
                {/* a div, not a heading — must not force a heading level */}
                <div className="font-semibold text-[15px] tracking-tight text-foreground">Create</div>
              </motion.div>

              <motion.div variants={item} className="mt-3">
                <Separator />
              </motion.div>

              {/* actions — ibirdui ghost Buttons, cascaded in */}
              <motion.div variants={listReveal} role="group" aria-label="Quick actions"
                className="mt-2 flex flex-col gap-0.5">
                {ACTIONS.map((a) => (
                  <motion.div key={a.id} variants={item}>
                    <Button variant="ghost" className="bg-transparent" style={rowStyle}>
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-primary/12 text-primary">
                        {a.icon}
                      </span>
                      <span className="flex-1 text-left font-medium text-[13.5px] text-foreground">{a.label}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{a.shortcut}</span>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </MotionCard>
          )}
        </AnimatePresence>

        {/* The single, persistent FAB — travels + scales from the collapsed circle
            into the menu header while its plus rotates into a close (×), on the
            same layout spring. It stays the toggle in both states. */}
        <motion.button type="button" onClick={toggle}
          aria-label={open ? "Close actions" : "Open actions"} aria-expanded={open}
          className="absolute top-0 left-0 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          style={{ transformOrigin: "top left" }}
          initial={false}
          animate={{ x: open ? CARD_PAD : 0, y: open ? CARD_PAD : 0, scale: open ? FAB_OPEN_SCALE : 1, rotate: open ? 45 : 0 }}
          transition={springs.layout}>
          <PlusIcon />
        </motion.button>
      </motion.div>
    </MotionProvider>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
const glyph = {
  viewBox: "0 0 24 24", className: "h-[18px] w-[18px]", fill: "none", stroke: "currentColor",
  strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
} as const;
function DocIcon() {
  return <svg {...glyph} aria-hidden="true"><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M6 3h8l5 5v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /></svg>;
}
function TaskIcon() {
  return <svg {...glyph} aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 12l3 3 5-6" /></svg>;
}
function InviteIcon() {
  return <svg {...glyph} aria-hidden="true"><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M19 8v6M22 11h-6" /></svg>;
}
function UploadIcon() {
  return <svg {...glyph} aria-hidden="true"><path d="M12 15V4" /><path d="M8 8l4-4 4 4" /><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>;
}`,
  },
  {
    n: '07',
    registryKey: 'morph-kpi-dashboard',
    title: 'KPI Widget → Dashboard',
    description: 'A compact KPI widget expands into a full analytics dashboard.',
    tags: ['card', 'button', 'badge', 'separator', 'block-motion'],
    whatMorphs:
      'The surface springs between the compact widget and the full dashboard while the KPI trigger and the Card swap through AnimatePresence — both get real enter and exit. Inside, a header with a period Badge, a row of KPI stat tiles with coloured trend deltas, a bar chart whose columns grow from the baseline, a Separator and a report-link Button stagger in on open and reverse-stagger out on close. Built with the ibirdui Card + block-motion + framer-motion, so it honours prefers-reduced-motion.',
    timing: ['framer-motion', 'layout spring', 'stagger 60ms'],
    code: `import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Separator } from "@/components/separator";
import { MotionProvider, springs } from "@/lib/block-motion";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { type CSSProperties, useState } from "react";

// The expanded surface is the ibirdui Card, made animatable so it keeps the
// crossfade/stagger variants. Card supplies border + bg-card; we only override
// radius + shadow below.
const MotionCard = motion.create(Card);
const cx = (...p: Array<string | false | undefined>) => p.filter(Boolean).join(" ");

interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  // Arrow direction; "good" decides the colour so "down is good" reads right.
  trend: "up" | "down";
  good: boolean;
}
const KPIS: Kpi[] = [
  { id: "revenue", label: "Revenue", value: "$84.3k", delta: "+12.4%", trend: "up", good: true },
  { id: "signups", label: "Signups", value: "3,240", delta: "+8.1%", trend: "up", good: true },
  { id: "churn", label: "Churn", value: "1.9%", delta: "-0.4%", trend: "down", good: true },
];

// Seven days of relative bar heights; the tallest is highlighted in full primary.
const BARS = [
  { d: "Mon", h: 0.42 },
  { d: "Tue", h: 0.6 },
  { d: "Wed", h: 0.5 },
  { d: "Thu", h: 0.78 },
  { d: "Fri", h: 0.64 },
  { d: "Sat", h: 1 },
  { d: "Sun", h: 0.72 },
];
const PEAK = Math.max(...BARS.map((b) => b.h));
// A five-bar sparkline stands in for the collapsed widget's trend.
const SPARK = [
  { id: "s1", h: 0.4 },
  { id: "s2", h: 0.68 },
  { id: "s3", h: 0.54 },
  { id: "s4", h: 0.82 },
  { id: "s5", h: 1 },
];

const cardReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.18, staggerChildren: 0.035, staggerDirection: -1 } },
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
    background: good ? "hsl(var(--success) / 0.15)" : "hsl(var(--destructive) / 0.15)",
    color: good ? "hsl(var(--success))" : "hsl(var(--destructive))",
    borderRadius: 999,
    padding: "2px 7px",
    fontSize: "11px",
    fontVariantNumeric: "tabular-nums",
  };
}

/** A compact KPI widget that morphs into a full analytics dashboard. */
export function MorphKpiDashboard() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);
  const primary = KPIS[0];

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
    <MotionProvider>
      <motion.div className="relative" initial={false}
        animate={{ width: open ? 400 : 220, height: open ? 372 : 104 }} transition={springs.layout}>
        {/* collapsed — the KPI widget, and the trigger */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.button key="closed" type="button" onClick={toggle}
              aria-label="Open analytics dashboard" aria-expanded={open}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-lg shadow-black/5 outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div className="min-w-0 flex-1">
                <div className="text-[12px] text-muted-foreground">{primary.label}</div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="font-semibold text-[22px] tracking-tight text-foreground tabular-nums">
                    {primary.value}
                  </span>
                  <Badge style={trendStyle(primary.good)} aria-hidden="true">{primary.delta}</Badge>
                </div>
              </div>
              {/* mini sparkline — decorative */}
              <div aria-hidden="true" className="flex h-9 flex-none items-end gap-[3px]">
                {SPARK.map((s) => (
                  <span key={s.id} className="w-[5px] rounded-full bg-primary/30"
                    style={{ height: \`\${s.h * 100}%\` }} />
                ))}
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* open — the analytics dashboard */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionCard key="card" variants={cardReveal} initial="hidden" animate="show" exit="exit"
              style={{ borderRadius: 22, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.1)" }}
              className="absolute inset-0 flex flex-col overflow-hidden p-5">
              {/* header — title + period pill + a labelled close */}
              <motion.div variants={item} className="flex items-center justify-between">
                <div className="min-w-0">
                  {/* a div, not a heading — must not force a heading level */}
                  <div className="font-semibold text-[16px] tracking-tight text-foreground">Analytics</div>
                  <div className="mt-0.5 text-[12px] text-muted-foreground">Last 7 days</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" style={{ borderRadius: 999, padding: "3px 10px", fontSize: "11.5px" }}>
                    Live
                  </Badge>
                  <button type="button" onClick={toggle} aria-label="Close dashboard"
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </motion.div>

              {/* KPI tiles — three stats that cascade in */}
              <motion.div variants={rowReveal} role="group" aria-label="Key metrics"
                className="mt-4 grid grid-cols-3 gap-2.5">
                {KPIS.map((k) => (
                  <motion.div key={k.id} variants={item}
                    className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <div className="truncate text-[11px] text-muted-foreground">{k.label}</div>
                    <div className="mt-1 font-semibold text-[16px] tracking-tight text-foreground tabular-nums">
                      {k.value}
                    </div>
                    <span className="mt-1.5 inline-flex items-center gap-1 font-medium text-[11px] tabular-nums"
                      style={{ color: k.good ? "hsl(var(--success))" : "hsl(var(--destructive))" }}>
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
                <motion.div variants={rowReveal} role="img"
                  aria-label="Revenue by day over the last 7 days, trending up with a peak on Saturday"
                  className="flex h-[92px] items-end gap-2">
                  {BARS.map((b) => (
                    <motion.span key={b.d} variants={bar} style={{ height: \`\${b.h * 100}%\`, transformOrigin: "bottom" }}
                      className={cx("flex-1 rounded-t-[5px]", b.h === PEAK ? "bg-primary" : "bg-primary/25")} />
                  ))}
                </motion.div>
              </motion.div>

              {/* footer — a Separator rules off the report link */}
              <motion.div variants={item} className="mt-auto pt-4">
                <Separator />
                <Button variant="ghost" className="mt-2 w-full justify-center gap-1.5 bg-transparent">
                  View full report
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

function TrendArrow({ dir }: { dir: "up" | "down" }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === "up" ? <path d="M6 15l6-6 6 6" /> : <path d="M6 9l6 6 6-6" />}
    </svg>
  );
}`,
  },
  {
    n: '08',
    title: 'Calendar Day → Event Details',
    description: 'A single calendar cell transforms into an event detail panel.',
    tags: [],
  },
  {
    n: '09',
    title: 'Message Bubble → Conversation',
    description: 'A chat preview morphs into a complete messaging interface.',
    tags: [],
  },
  {
    n: '10',
    title: 'Mini Player → Full Player',
    description: 'A compact music player expands into a full music experience.',
    tags: [],
  },
];

// ── i18n overlay ────────────────────────────────────────────────────────────
// The MORPH_ENTRIES prose above is the canonical English copy. This is the French
// overlay keyed by entry number; `morphText(entry, locale)` resolves the right
// language for the section renderer. `code` / `timing` / `tags` are
// language-neutral and stay shared.
export interface MorphText {
  title: string;
  description: string;
  whatMorphs?: string;
}

const MORPH_TEXT_FR: Record<string, MorphText> = {
  '01': {
    title: 'Bouton → Carte flottante',
    description:
      'Un CTA construit sur le Button ibirdui qui se déploie en carte de plan flottante.',
    whatMorphs:
      'La surface oscille entre deux tailles pendant que le Button ibirdui et la carte s’échangent via AnimatePresence — les deux ont une vraie entrée et sortie. Le contenu de la carte apparaît en cascade à l’ouverture et repart en cascade inverse à la fermeture. Construit avec le Button ibirdui + block-motion + framer-motion, donc il respecte prefers-reduced-motion.',
  },
  '02': {
    title: 'Icône de recherche → Panneau de recherche',
    description:
      'Une icône de recherche qui se déploie en menu de commandes — champ de recherche, suggestions et filtres.',
    whatMorphs:
      'La surface oscille entre l’icône et le menu de commandes complet pendant que le Button ibirdui et le panneau s’échangent via AnimatePresence — les deux ont une vraie entrée et sortie. À l’intérieur, l’Input ibirdui, une DataList de suggestions (première ligne en surbrillance), un Separator et une rangée de Badges de filtres apparaissent en cascade à l’ouverture et repartent en cascade inverse à la fermeture. Animé en framer-motion pur ; MotionConfig respecte prefers-reduced-motion.',
  },
  '03': {
    title: 'Avatar → Carte de profil',
    description: 'Un avatar circulaire se déploie en carte de profil détaillée.',
    whatMorphs:
      'L’Avatar ibirdui est un seul élément persistant : il se déplace et s’agrandit du cercle replié vers l’en-tête de la carte — un vrai mouvement shared-element, pas un crossfade — pendant que la Card entre en ressort via AnimatePresence autour de lui. Le nom + le rôle, un Badge Pro, une bio, une rangée de stats séparée et une paire de Buttons Suivre/Message apparaissent en cascade à l’ouverture et repartent en cascade inverse à la fermeture. Construit avec l’Avatar ibirdui + block-motion + framer-motion, donc il respecte prefers-reduced-motion.',
  },
  '04': {
    title: 'Carte produit → Fiche produit',
    description: 'Un aperçu produit se transforme en page produit complète.',
    whatMorphs:
      'L’image produit est un seul élément persistant : elle passe d’une vignette de 56px à un hero pleine largeur — un vrai mouvement shared-element, pas un crossfade — pendant que le texte d’aperçu s’efface via AnimatePresence et que la fiche Card entre en ressort autour d’elle. Le nom + la note, le prix, une description, une rangée de Badges de tailles et une paire de Buttons Ajouter au panier apparaissent en cascade à l’ouverture et repartent en cascade inverse à la fermeture. Construit avec la Card ibirdui + block-motion + framer-motion, donc il respecte prefers-reduced-motion.',
  },
  '05': {
    title: 'Cloche de notification → Centre',
    description: 'Un petit badge se transforme en tiroir de notifications.',
    whatMorphs:
      'La surface oscille entre la cloche et le tiroir complet pendant que le Button ibirdui et la Card s’échangent via AnimatePresence — les deux ont une vraie entrée et sortie. À l’intérieur, un en-tête (cloche, titre et pastille de non-lus remplie), une liste de notifications avec des tuiles d’icônes sémantiques teintées — la plus récente non-lue portant une surface de surbrillance — et un lien « Tout marquer comme lu » centré apparaissent en cascade à l’ouverture et repartent en cascade inverse à la fermeture. Construit avec block-motion + framer-motion, donc il respecte prefers-reduced-motion.',
  },
  '06': {
    title: 'FAB → Menu d’actions',
    description: 'Un bouton d’action flottant se déploie en plusieurs actions rapides.',
    whatMorphs:
      'Le FAB est un seul élément persistant : il se déplace et se met à l’échelle du cercle replié vers l’en-tête du menu pendant que son plus pivote en fermeture (×) — un vrai mouvement shared-element, pas un crossfade — tandis que la Card du menu entre en ressort autour de lui. Un titre, un Separator et une cascade de Buttons ghost (tuile d’icône, libellé et raccourci clavier) apparaissent en cascade à l’ouverture et repartent en cascade inverse à la fermeture. Construit avec la Card ibirdui + block-motion + framer-motion, donc il respecte prefers-reduced-motion.',
  },
  '07': {
    title: 'Widget KPI → Tableau de bord',
    description: 'Un widget KPI compact se déploie en tableau de bord analytique complet.',
    whatMorphs:
      'La surface oscille entre le widget compact et le tableau de bord complet pendant que le déclencheur KPI et la Card s’échangent via AnimatePresence — les deux ont une vraie entrée et sortie. À l’intérieur, un en-tête avec un Badge de période, une rangée de tuiles KPI aux variations colorées, un graphique en barres dont les colonnes poussent depuis la base, un Separator et un Button de lien vers le rapport apparaissent en cascade à l’ouverture et repartent en cascade inverse à la fermeture. Construit avec la Card ibirdui + block-motion + framer-motion, donc il respecte prefers-reduced-motion.',
  },
  '08': {
    title: 'Jour de calendrier → Détails de l’événement',
    description: 'Une cellule de calendrier se transforme en panneau de détails d’événement.',
  },
  '09': {
    title: 'Bulle de message → Conversation',
    description: 'Un aperçu de chat se transforme en interface de messagerie complète.',
  },
  '10': {
    title: 'Mini lecteur → Lecteur complet',
    description: 'Un lecteur de musique compact se déploie en expérience musicale complète.',
  },
};

/** Resolve an entry's prose in the active locale (English is the canonical fallback). */
export function morphText(entry: MorphEntry, locale: Locale): MorphText {
  const base: MorphText = {
    title: entry.title,
    description: entry.description,
    whatMorphs: entry.whatMorphs,
  };
  return locale === 'fr' ? (MORPH_TEXT_FR[entry.n] ?? base) : base;
}

// French blurbs for the primitive legend on the collection masthead.
const MORPH_BLURB_FR: Record<MorphComponentId, string> = {
  button: 'le déclencheur replié',
  card: 'la surface dépliée',
  'block-motion': 'ressorts reduced-motion',
  input: 'le champ de recherche',
  'data-list': 'la liste de résultats',
  badge: 'étiquettes par résultat',
  separator: 'le trait de section',
  avatar: 'le déclencheur de profil',
};

/** Resolve a primitive's legend blurb in the active locale. */
export function morphBlurb(c: MorphComponent, locale: Locale): string {
  return locale === 'fr' ? (MORPH_BLURB_FR[c.id] ?? c.blurb) : c.blurb;
}
