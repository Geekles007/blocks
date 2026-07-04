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
  | 'separator';

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
];

/** Look up an ibirdui primitive by id (for tags). */
export const morphComponent = (id: MorphComponentId): MorphComponent =>
  // biome-ignore lint/style/noNonNullAssertion: MORPH_COMPONENTS is a non-empty literal.
  MORPH_COMPONENTS.find((c) => c.id === id) ?? MORPH_COMPONENTS[0]!;

/** One copy-paste-able install command, with a short label for the UI. */
export interface InstallStep {
  label: string;
  cmd: string;
}

/**
 * The commands that install everything a shipped morph imports: the ibirdui
 * primitives it's tagged with (pulled from ui.ibird.dev in one `ibirdui add`,
 * copied into your codebase — you own them), plus framer-motion, which every
 * shipped morph imports directly. Empty for roadmap entries (no code yet), so
 * the honesty rule holds: no fabricated install steps for unbuilt morphs.
 */
export function installSteps(entry: MorphEntry): InstallStep[] {
  if (!entry.code) return [];
  const steps: InstallStep[] = [];
  if (entry.tags.length > 0) {
    const items = entry.tags.map((id) => `ui.ibird.dev/r/${id}`).join(' ');
    steps.push({ label: 'ibirdui primitives', cmd: `npx ibirdui add ${items}` });
  }
  steps.push({ label: 'Animation runtime', cmd: 'npm install framer-motion' });
  return steps;
}

export interface MorphEntry {
  /** Zero-padded index, e.g. "01". Also the demo registry key. */
  n: string;
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
    title: 'Avatar → Profile Card',
    description: 'A circular avatar expands into a detailed profile card.',
    tags: [],
  },
  {
    n: '04',
    title: 'Product Card → Product Detail',
    description: 'A product preview morphs into a complete product page.',
    tags: [],
  },
  {
    n: '05',
    title: 'Notification Dot → Center',
    description: 'A small badge transforms into a notification drawer.',
    tags: [],
  },
  {
    n: '06',
    title: 'FAB → Action Menu',
    description: 'A floating action button expands into multiple quick actions.',
    tags: [],
  },
  {
    n: '07',
    title: 'KPI Widget → Dashboard',
    description: 'A compact KPI widget expands into a full analytics dashboard.',
    tags: [],
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
