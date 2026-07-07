import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Separator } from '@/components/separator';
import { MotionProvider, springs } from '@/lib/block-motion';
import { AnimatePresence, type Variants, motion } from 'framer-motion';
import { useState } from 'react';

// The expanded surface is the ibirdui Card, made animatable so it keeps the
// crossfade/stagger variants. Card supplies border + bg-card; we only override
// radius + shadow below. Cast to `typeof motion.div` because motion.create's
// inferred type doesn't compose cleanly with a forwardRef component as JSX.
const MotionCard = motion.create(Card) as typeof motion.div;

const TRACK = {
  title: 'Neon Skyline',
  artist: 'The Midnight Hours',
  elapsed: '1:12',
  total: '3:45',
  progress: 0.32,
};

// The album art is 48px collapsed → a full-width hero open, anchored at the p-3
// pad. Scaling one persistent element keeps it continuous (no crossfade).
const ART = 48;
const ART_OPEN_W = 316; // container 340 − 2×12 padding
const ART_OPEN_H = 190;
const PAD = 12;

const cardReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, staggerChildren: 0.035, staggerDirection: -1 },
  },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

/** A compact music player that morphs into a full player. */
export function MorphMiniPlayer() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const toggle = () => setOpen((v) => !v);
  const togglePlay = () => setPlaying((v) => !v);
  const pct = `${TRACK.progress * 100}%`;

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 340 : 300, height: open ? 428 : 72 }}
        transition={springs.layout}
      >
        {/* collapsed — the mini player bar, and the trigger (art slot is a spacer;
            the persistent art below sits on top of it) */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.button
              key="closed"
              type="button"
              onClick={toggle}
              aria-label={`Open player: ${TRACK.title} by ${TRACK.artist}`}
              aria-expanded={open}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-lg shadow-black/5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="h-12 w-12 flex-none" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-[14px] text-foreground">
                  {TRACK.title}
                </div>
                <div className="truncate text-[12.5px] text-muted-foreground">{TRACK.artist}</div>
              </div>
              {/* decorative play glyph — the real control lives in the full player */}
              <span
                aria-hidden="true"
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary/12 text-primary"
              >
                <PlayPauseIcon playing={playing} />
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* open — the full player (top spacer = where the hero art grows in) */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionCard
              key="card"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{ borderRadius: 22, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
              className="absolute inset-0 flex flex-col overflow-hidden p-3"
            >
              <div className="h-[190px] flex-none" aria-hidden="true" />

              {/* title + artist */}
              <motion.div variants={item} className="mt-4 px-1">
                {/* a div, not a heading — must not force a heading level */}
                <div className="truncate font-semibold text-[18px] tracking-tight text-foreground">
                  {TRACK.title}
                </div>
                <div className="mt-0.5 truncate text-[13.5px] text-muted-foreground">
                  {TRACK.artist}
                </div>
              </motion.div>

              {/* progress — a labelled progressbar with elapsed / total */}
              <motion.div variants={item} className="mt-4 px-1">
                {/* biome-ignore lint/a11y/useFocusableInteractive: a progressbar is a read-only status indicator, not a focusable control */}
                <div
                  role="progressbar"
                  aria-label="Playback position"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(TRACK.progress * 100)}
                  aria-valuetext={`${TRACK.elapsed} of ${TRACK.total}`}
                  className="relative h-1.5 rounded-full bg-muted"
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary"
                    style={{ width: pct }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary shadow"
                    style={{ left: `calc(${pct} - 6px)` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground tabular-nums">
                  <span>{TRACK.elapsed}</span>
                  <span>{TRACK.total}</span>
                </div>
              </motion.div>

              {/* transport — prev / play-pause / next */}
              <motion.div
                variants={item}
                role="group"
                aria-label="Playback controls"
                className="mt-auto flex items-center justify-center gap-2 pt-4"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Previous track"
                  className="rounded-full"
                >
                  <PrevIcon />
                </Button>
                <Button
                  size="icon"
                  onClick={togglePlay}
                  aria-label={playing ? 'Pause' : 'Play'}
                  className="h-12 w-12 rounded-full"
                >
                  <PlayPauseIcon playing={playing} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Next track"
                  className="rounded-full"
                >
                  <NextIcon />
                </Button>
              </motion.div>

              <motion.div variants={item} className="pt-3">
                <Separator />
                <div className="flex items-center justify-between px-1 pt-2.5 text-muted-foreground">
                  <button
                    type="button"
                    aria-label="Shuffle"
                    className="rounded-md p-1 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ShuffleIcon />
                  </button>
                  <button
                    type="button"
                    aria-label="Repeat"
                    className="rounded-md p-1 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <RepeatIcon />
                  </button>
                </div>
              </motion.div>

              {/* minimize — floats over the hero, above the art (z-20) */}
              <motion.button
                variants={item}
                type="button"
                onClick={toggle}
                aria-label="Minimize player"
                className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-foreground shadow-sm outline-none backdrop-blur hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronDownIcon />
              </motion.button>
            </MotionCard>
          )}
        </AnimatePresence>

        {/* The single, persistent album art — resizes from the 48px thumbnail into
            the full-width hero on the same layout spring, no crossfade. Decorative
            (a gradient cover stand-in), never the click target, so aria-hidden +
            pointer-events none. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 flex items-center justify-center overflow-hidden bg-primary/10 bg-gradient-to-br from-primary/40 to-primary/5"
          initial={false}
          animate={{
            width: open ? ART_OPEN_W : ART,
            height: open ? ART_OPEN_H : ART,
            borderRadius: open ? 16 : 12,
          }}
          style={{ left: PAD, top: PAD }}
          transition={springs.layout}
        >
          <motion.div
            className="text-primary/50"
            initial={false}
            animate={{ width: open ? 52 : 24, height: open ? 52 : 24 }}
            transition={springs.layout}
          >
            <NoteIcon />
          </motion.div>
        </motion.div>
      </motion.div>
    </MotionProvider>
  );
}

function PlayPauseIcon({ playing }: { playing: boolean }) {
  if (playing) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 translate-x-[1px]"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M6 6h2v12H6zM20 6v12L9 12z" />
    </svg>
  );
}
function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M16 6h2v12h-2zM4 6l11 6-11 6z" />
    </svg>
  );
}
function NoteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-full w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function ShuffleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
  );
}
function RepeatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
