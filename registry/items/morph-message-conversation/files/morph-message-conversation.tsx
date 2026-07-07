import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import { Separator } from '@/components/separator';
import { MotionProvider, springs } from '@/lib/block-motion';
import { AnimatePresence, type Variants, motion } from 'framer-motion';
import { useState } from 'react';

// The expanded surface is the ibirdui Card, made animatable so it keeps the
// crossfade/stagger variants. Card supplies border + bg-card; we only override
// radius + shadow below. Cast to `typeof motion.div` because motion.create's
// inferred type doesn't compose cleanly with a forwardRef component as JSX.
const MotionCard = motion.create(Card) as typeof motion.div;
const cx = (...p: Array<string | false | undefined>) => p.filter(Boolean).join(' ');

// No src, so the Avatar renders its initials fallback ("MC") — offline + stable.
const PERSON = { name: 'Mira Chen', role: 'Product designer' };
interface Message {
  id: string;
  from: 'them' | 'me';
  text: string;
}
const MESSAGES: Message[] = [
  { id: 'm1', from: 'them', text: 'Did you get a chance to look at the morph specs?' },
  { id: 'm2', from: 'me', text: 'Yes — pushing the last two blocks today.' },
  { id: 'm3', from: 'them', text: 'Amazing. The FAB one looks so good.' },
  { id: 'm4', from: 'me', text: 'Calendar + KPI just merged too.' },
];
const UNREAD = 2;
// biome-ignore lint/style/noNonNullAssertion: MESSAGES is a non-empty literal.
const PREVIEW = MESSAGES[MESSAGES.length - 1]!.text;

const cardReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, staggerChildren: 0.035, staggerDirection: -1 },
  },
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
// Bubbles rise from their own side rather than all from the bottom.
const bubble: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: springs.smooth },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
};

/** A chat preview that morphs into a full conversation. */
export function MorphMessageConversation() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    // MotionProvider makes every animation honour prefers-reduced-motion.
    <MotionProvider>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: open ? 380 : 280, height: open ? 440 : 68 }}
        transition={springs.layout}
      >
        {/* collapsed — the chat preview row, and the trigger */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.button
              key="closed"
              type="button"
              onClick={toggle}
              aria-label={`Open conversation with ${PERSON.name}, ${UNREAD} unread`}
              aria-expanded={open}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-lg shadow-black/5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar
                name={PERSON.name}
                size={40}
                aria-hidden="true"
                className="flex-none bg-primary/15 font-semibold text-primary"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-[14px] text-foreground">
                  {PERSON.name}
                </div>
                <div className="truncate text-[12.5px] text-muted-foreground">{PREVIEW}</div>
              </div>
              <Badge
                aria-hidden="true"
                style={{
                  flex: 'none',
                  minWidth: 20,
                  height: 20,
                  padding: '0 6px',
                  borderRadius: 999,
                  fontSize: '11px',
                }}
              >
                {UNREAD}
              </Badge>
            </motion.button>
          )}
        </AnimatePresence>

        {/* open — the conversation */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionCard
              key="card"
              variants={cardReveal}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{ borderRadius: 22, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
              className="absolute inset-0 flex flex-col overflow-hidden"
            >
              {/* header — avatar + name + online status, and a labelled close */}
              <motion.div variants={item} className="flex items-center gap-3 px-4 pt-4 pb-3">
                <Avatar
                  name={PERSON.name}
                  size={38}
                  aria-hidden="true"
                  className="flex-none bg-primary/15 font-semibold text-primary"
                />
                <div className="min-w-0 flex-1">
                  {/* a div, not a heading — must not force a heading level */}
                  <div className="truncate font-semibold text-[15px] tracking-tight text-foreground">
                    {PERSON.name}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-success" />
                    Online
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggle}
                  aria-label="Close conversation"
                  className="-mr-1 flex h-8 w-8 flex-none items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CloseIcon />
                </button>
              </motion.div>

              <motion.div variants={item}>
                <Separator />
              </motion.div>

              {/* messages — incoming (left, muted) and outgoing (right, accent) bubbles */}
              <motion.div
                variants={listReveal}
                role="log"
                aria-label={`Conversation with ${PERSON.name}`}
                className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto px-4 py-3.5"
              >
                {MESSAGES.map((m) => (
                  <motion.div
                    key={m.id}
                    variants={bubble}
                    className={cx('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cx(
                        'max-w-[78%] rounded-2xl px-3.5 py-2 text-[13.5px] leading-snug',
                        m.from === 'me'
                          ? 'rounded-br-md bg-primary text-primary-foreground'
                          : 'rounded-bl-md bg-muted text-foreground',
                      )}
                    >
                      {/* keeps the sender clear for assistive tech, not colour-only */}
                      <span className="sr-only">
                        {m.from === 'me' ? 'You: ' : `${PERSON.name}: `}
                      </span>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* composer — an Input + a round send Button */}
              <motion.div
                variants={item}
                className="flex items-center gap-2 border-border border-t px-3 py-3"
              >
                <Input
                  placeholder="Message…"
                  aria-label="Message"
                  style={{ height: 40, borderRadius: 999, fontSize: '14px' }}
                />
                <Button
                  size="icon"
                  aria-label="Send message"
                  className="h-10 w-10 flex-none rounded-full"
                >
                  <SendIcon />
                </Button>
              </motion.div>
            </MotionCard>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionProvider>
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
function SendIcon() {
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
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
