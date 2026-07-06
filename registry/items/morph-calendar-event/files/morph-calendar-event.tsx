import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Separator } from '@/components/separator';
import { MotionProvider, springs } from '@/lib/block-motion';
import { AnimatePresence, type Variants, motion } from 'framer-motion';
import { type ReactNode, useState } from 'react';

// The expanded surface is the ibirdui Card, made animatable so it keeps the
// crossfade/stagger variants. Card supplies border + bg-card; we only override
// radius + shadow below. Cast to `typeof motion.div` because motion.create's
// inferred type doesn't compose cleanly with a forwardRef component as JSX.
const MotionCard = motion.create(Card) as typeof motion.div;

const EVENT = {
  weekday: 'Wed',
  day: '24',
  month: 'Jul',
  title: 'Design review',
  kind: 'Meeting',
  dateLong: 'Wednesday, July 24',
  time: '2:00 – 3:00 PM',
  location: 'Studio · Room 4',
  note: 'Walk through the morphing block set and lock the launch scope.',
};
// No src, so each Avatar renders its initials fallback — offline + stable.
const ATTENDEES = [
  { id: 'ada', name: 'Ada Lovelace' },
  { id: 'mira', name: 'Mira Chen' },
  { id: 'kojo', name: 'Kojo Boateng' },
];
const GOING = 5;

// The date tile is 76px collapsed and rests at 52px in the card header — scaling
// the single element keeps it continuous. CARD_PAD (p-5 = 20px) is where it lands.
const CELL = 76;
const CELL_OPEN_SCALE = 52 / CELL;
const CARD_PAD = 20;

// Card fades as a whole and staggers its children — forwards on enter, reversed
// on exit. Children inherit "show" / "exit" via variant propagation.
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

/** A calendar day cell that morphs into an event-detail panel. */
export function MorphCalendarEvent() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 360 : CELL, height: open ? 344 : CELL }}
        transition={springs.layout}
      >
        {/* open — the event-detail card, mounted only while expanded (real enter +
            exit). Its header leaves a spacer where the travelling tile comes to rest. */}
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
              {/* header — a spacer reserves the tile's slot + a labelled close */}
              <motion.div variants={item} className="flex items-start gap-3.5">
                <div className="h-[52px] w-[52px] flex-none" aria-hidden="true" />
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center gap-2">
                    {/* a div, not a heading — must not force a heading level */}
                    <span className="truncate font-semibold text-[16px] tracking-tight text-foreground">
                      {EVENT.title}
                    </span>
                    <Badge variant="secondary" style={{ padding: '2px 8px', fontSize: '11px' }}>
                      {EVENT.kind}
                    </Badge>
                  </div>
                  <div className="mt-0.5 text-[13px] text-muted-foreground">{EVENT.dateLong}</div>
                </div>
                <button
                  type="button"
                  onClick={toggle}
                  aria-label="Close event details"
                  className="-mr-1 -mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CloseIcon />
                </button>
              </motion.div>

              {/* details — time + location rows with tinted icon tiles */}
              <motion.div variants={item} className="mt-4 flex flex-col gap-2.5">
                <DetailRow icon={<ClockIcon />}>{EVENT.time}</DetailRow>
                <DetailRow icon={<PinIcon />}>{EVENT.location}</DetailRow>
              </motion.div>

              {/* attendees — an Avatar stack + a going count */}
              <motion.div
                variants={item}
                role="group"
                aria-label={`Attendees, ${GOING} going`}
                className="mt-4 flex items-center gap-3"
              >
                <div className="flex items-center">
                  {ATTENDEES.map((a, i) => (
                    <Avatar
                      key={a.id}
                      name={a.name}
                      size={30}
                      aria-hidden="true"
                      className="bg-muted font-medium text-[11px] text-foreground/70 ring-2 ring-card"
                      style={{ marginLeft: i === 0 ? 0 : -10 }}
                    />
                  ))}
                  <span
                    aria-hidden="true"
                    className="-ml-[10px] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-primary/12 font-semibold text-[11px] text-primary ring-2 ring-card"
                  >
                    +{GOING - ATTENDEES.length}
                  </span>
                </div>
                <span className="text-[12.5px] text-muted-foreground">{GOING} going</span>
              </motion.div>

              <motion.div variants={item} className="mt-4">
                <Separator />
              </motion.div>

              <motion.p
                variants={item}
                className="mt-4 text-[13px] leading-relaxed text-foreground/70"
              >
                {EVENT.note}
              </motion.p>

              {/* actions — Accept (primary) + Maybe (outline) */}
              <motion.div variants={item} className="mt-auto flex gap-2 pt-4">
                <Button className="flex-1">Accept</Button>
                <Button variant="outline" className="flex-1">
                  Maybe
                </Button>
              </motion.div>
            </MotionCard>
          )}
        </AnimatePresence>

        {/* The single, persistent date tile. Because it never unmounts, it *travels*
            and scales between the collapsed cell and its header slot on the same
            layout spring — no crossfade. Collapsed it's the trigger; open it's
            decorative (the card's close control + text take over), so it's disabled
            + hidden from assistive tech to stay out of the tab order and a11y tree. */}
        <motion.button
          type="button"
          onClick={open ? undefined : toggle}
          disabled={open}
          tabIndex={open ? -1 : 0}
          aria-hidden={open || undefined}
          aria-label={
            open
              ? undefined
              : `View event: ${EVENT.title}, ${EVENT.weekday} ${EVENT.month} ${EVENT.day}`
          }
          aria-expanded={open}
          className="absolute top-0 left-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-primary/10 outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          style={{
            width: CELL,
            height: CELL,
            transformOrigin: 'top left',
            pointerEvents: open ? 'none' : 'auto',
          }}
          initial={false}
          animate={{
            x: open ? CARD_PAD : 0,
            y: open ? CARD_PAD : 0,
            scale: open ? CELL_OPEN_SCALE : 1,
            boxShadow: open
              ? '0 10px 25px -5px rgba(163, 230, 53, 0)'
              : '0 10px 25px -5px rgba(163, 230, 53, 0.35)',
          }}
          transition={springs.layout}
        >
          <span className="font-medium text-[11px] uppercase tracking-wide text-primary/70">
            {EVENT.weekday}
          </span>
          <span className="font-semibold text-[26px] leading-none tracking-tight text-primary tabular-nums">
            {EVENT.day}
          </span>
          {/* event dot — fades out as the tile settles into the header */}
          <motion.span
            aria-hidden="true"
            className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary"
            initial={false}
            animate={{ opacity: open ? 0 : 1 }}
            transition={springs.layout}
          />
        </motion.button>
      </motion.div>
    </MotionProvider>
  );
}

function DetailRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[13.5px] text-foreground/85">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-muted text-muted-foreground"
      >
        {icon}
      </span>
      {children}
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.4" />
    </svg>
  );
}
function CloseIcon() {
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
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
