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

/** The five morph *techniques* a component can be tagged with (not installable primitives). */
export type MorphPrimitiveId = 'surface' | 'anchor' | 'reveal' | 'stagger' | 'crossfade';

export interface MorphPrimitive {
  id: MorphPrimitiveId;
  /** Technique name shown on tags and in the legend, e.g. "Surface". */
  name: string;
  /** One-line role shown in the header legend. */
  blurb: string;
  /** Tailwind background class for the legend / tag dot (theme-adapted). */
  dot: string;
}

// Each technique gets a distinct theme hue for its legend/tag dot.
export const MORPH_PRIMITIVES: MorphPrimitive[] = [
  { id: 'surface', name: 'Surface', blurb: 'morphing container', dot: 'bg-primary' },
  { id: 'anchor', name: 'Anchor', blurb: 'persistent shared element', dot: 'bg-success' },
  { id: 'reveal', name: 'Reveal', blurb: 'fade + rise on expand', dot: 'bg-warning' },
  { id: 'stagger', name: 'Stagger', blurb: 'sequenced children', dot: 'bg-destructive' },
  { id: 'crossfade', name: 'Cross-fade', blurb: 'swap two states', dot: 'bg-muted-foreground' },
];

/** Look up a technique by id (for tags). */
export const morphPrimitive = (id: MorphPrimitiveId): MorphPrimitive =>
  // biome-ignore lint/style/noNonNullAssertion: MORPH_PRIMITIVES is a non-empty literal.
  MORPH_PRIMITIVES.find((p) => p.id === id) ?? MORPH_PRIMITIVES[0]!;

export interface MorphEntry {
  /** Zero-padded index, e.g. "01". Also the demo registry key. */
  n: string;
  title: string;
  description: string;
  /** Techniques this component uses (built) or will use (planned). */
  tags: MorphPrimitiveId[];
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
    tags: ['surface', 'anchor', 'crossfade', 'reveal'],
    whatMorphs:
      'The surface springs between two sizes while the ibirdui Button and the card swap through AnimatePresence — so both get real enter and exit. The card contents stagger in on open and reverse-stagger out on close. Built with the ibirdui Button + block-motion + framer-motion, so it honours prefers-reduced-motion.',
    timing: ['framer-motion', 'layout spring', 'stagger 60ms'],
    code: `import { Button } from "@/components/button";
import { MotionProvider, springs } from "@/lib/block-motion";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useState } from "react";

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
            <motion.div
              key="card"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[22px] border border-border bg-card p-6 shadow-2xl shadow-black/10"
            >
              <motion.div variants={item} className="mb-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-primary/12">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" className="text-primary" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
              </motion.div>
              <motion.h3 variants={item} className="font-semibold text-[17px] tracking-tight text-foreground">
                Pro plan
              </motion.h3>
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
            </motion.div>
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

  // ── Roadmap ────────────────────────────────────────────────────────────────
  // Not built yet: title + description + intended techniques only. No fabricated
  // "what morphs", timings or code — each fills in when its demo ships.
  {
    n: '02',
    title: 'Search Icon → Search Panel',
    description: 'A tiny search icon transforms into a complete search interface.',
    tags: ['surface', 'anchor', 'reveal', 'stagger'],
  },
  {
    n: '03',
    title: 'Avatar → Profile Card',
    description: 'A circular avatar expands into a detailed profile card.',
    tags: ['surface', 'anchor', 'reveal'],
  },
  {
    n: '04',
    title: 'Product Card → Product Detail',
    description: 'A product preview morphs into a complete product page.',
    tags: ['surface', 'anchor', 'crossfade', 'reveal'],
  },
  {
    n: '05',
    title: 'Notification Dot → Center',
    description: 'A small badge transforms into a notification drawer.',
    tags: ['surface', 'anchor', 'stagger'],
  },
  {
    n: '06',
    title: 'FAB → Action Menu',
    description: 'A floating action button expands into multiple quick actions.',
    tags: ['surface', 'anchor', 'stagger'],
  },
  {
    n: '07',
    title: 'KPI Widget → Dashboard',
    description: 'A compact KPI widget expands into a full analytics dashboard.',
    tags: ['surface', 'anchor', 'reveal'],
  },
  {
    n: '08',
    title: 'Calendar Day → Event Details',
    description: 'A single calendar cell transforms into an event detail panel.',
    tags: ['surface', 'anchor', 'crossfade', 'reveal'],
  },
  {
    n: '09',
    title: 'Message Bubble → Conversation',
    description: 'A chat preview morphs into a complete messaging interface.',
    tags: ['surface', 'anchor', 'stagger'],
  },
  {
    n: '10',
    title: 'Mini Player → Full Player',
    description: 'A compact music player expands into a full music experience.',
    tags: ['surface', 'anchor', 'reveal'],
  },
];
