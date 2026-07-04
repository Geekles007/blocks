'use client';

// Design-system primitives, hand-styled from the token object. Pure and
// presentational — they take `t` (tokens) and never touch global state.
import * as React from 'react';
import { type CSS, h } from '~/lib/h';
import type { Tok } from '~/lib/tokens';

const P = (d: string) =>
  h('path', {
    d,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  });

export function Icon({ name, size = 18, style }: { name: string; size?: number; style?: CSS }) {
  const m: Record<string, React.ReactNode[]> = {
    search: [
      P('M11 11l3.5 3.5'),
      h('circle', {
        cx: 7.5,
        cy: 7.5,
        r: 4.5,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
      }),
    ],
    command: [
      P(
        'M6 6h3a3 3 0 1 0-3-3v3zM6 6v3a3 3 0 1 1-3 3h3zM6 6h6M6 6v6m6-6h3a3 3 0 1 1-3 3V6zm0 0V3a3 3 0 1 1 3 3h-3zm0 0v6',
      ),
    ],
    ret: [P('M15 5v3a3 3 0 0 1-3 3H4m0 0l3-3m-3 3l3 3')],
    arrow: [P('M4 10h11m0 0l-4-4m4 4l-4 4')],
    chev: [P('M8 5l5 5-5 5')],
    sparkles: [
      P(
        'M9 3l1.4 3.6L14 8l-3.6 1.4L9 13l-1.4-3.6L4 8l3.6-1.4L9 3zM15 12l.8 2 2 .8-2 .8L15 18l-.8-2.4-2-.8 2-.8L15 12z',
      ),
    ],
    copy: [
      h('rect', {
        x: 7,
        y: 7,
        width: 9,
        height: 9,
        rx: 2,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
      }),
      P('M4 13V5a1 1 0 0 1 1-1h8'),
    ],
    check: [P('M4 10.5l4 4 8-9')],
    sun: [
      h('circle', {
        cx: 10,
        cy: 10,
        r: 3.5,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
      }),
      P(
        'M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5l1.4 1.4M14.1 14.1l1.4 1.4M15.5 4.5l-1.4 1.4M5.9 14.1l-1.4 1.4',
      ),
    ],
    moon: [P('M16 11.5A6 6 0 1 1 8.5 4a5 5 0 0 0 7.5 7.5z')],
    monitor: [
      h('rect', {
        x: 3,
        y: 4,
        width: 14,
        height: 9,
        rx: 1.5,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
      }),
      P('M7 17h6M10 13v4'),
    ],
    tablet: [
      h('rect', {
        x: 5,
        y: 3,
        width: 10,
        height: 14,
        rx: 1.5,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
      }),
      P('M10 14h.01'),
    ],
    phone: [
      h('rect', {
        x: 6,
        y: 3,
        width: 8,
        height: 14,
        rx: 1.5,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
      }),
      P('M10 14h.01'),
    ],
    maximize: [
      P(
        'M7 3H4a1 1 0 0 0-1 1v3M13 3h3a1 1 0 0 1 1 1v3M7 17H4a1 1 0 0 1-1-1v-3M13 17h3a1 1 0 0 0 1-1v-3',
      ),
    ],
    github: [
      P(
        'M7.5 16c-3 1-3-1.5-4-2m8 4v-2.2c0-.6.2-1 .5-1.4-2.6-.3-4-1.3-4-4 0-1 .3-1.8.8-2.4-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.6 1a8 8 0 0 1 4 0c1.8-1.3 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.6.5.6.8 1.4.8 2.4 0 2.7-1.4 3.7-4 4 .3.4.5.9.5 1.6V18',
      ),
    ],
    star: [P('M10 2.5l2.1 4.6 4.9.5-3.7 3.3 1.1 4.9L10 13.8 5.6 16l1.1-4.9L3 7.7l4.9-.5L10 2.5z')],
    bell: [P('M6 8a4 4 0 0 1 8 0c0 4 1.5 5 1.5 5h-11S6 12 6 8zM8.5 16a1.5 1.5 0 0 0 3 0')],
    zap: [P('M11 2L4 11h5l-1 7 7-9h-5l1-7z')],
    layers: [P('M10 3l7 3.5-7 3.5-7-3.5L10 3zM3 11l7 3.5L17 11M3 14.5L10 18l7-3.5')],
    gauge: [
      h('circle', { cx: 10, cy: 10, r: 7, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7 }),
      P('M10 10l3-2.5'),
    ],
    file: [P('M5 3h6l4 4v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z'), P('M11 3v4h4')],
    user: [
      h('circle', { cx: 10, cy: 7, r: 3, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7 }),
      P('M4.5 16a5.5 5.5 0 0 1 11 0'),
    ],
    send: [P('M4 10l13-6-6 13-2.2-4.8L4 10z')],
    grid: [P('M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z')],
    globe: [
      h('circle', { cx: 10, cy: 10, r: 7, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7 }),
      P('M3 10h14M10 3c2.5 2 2.5 12 0 14M10 3c-2.5 2-2.5 12 0 14'),
    ],
    card: [
      h('rect', {
        x: 3,
        y: 5,
        width: 14,
        height: 10,
        rx: 2,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
      }),
      P('M3 8h14'),
    ],
    table: [
      h('rect', {
        x: 3,
        y: 4,
        width: 14,
        height: 12,
        rx: 1.5,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
      }),
      P('M3 8h14M8 8v8'),
    ],
    lock: [
      h('rect', {
        x: 4,
        y: 9,
        width: 12,
        height: 8,
        rx: 1.5,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
      }),
      P('M7 9V7a3 3 0 0 1 6 0v2'),
    ],
    plus: [P('M10 4v12M4 10h12')],
    inbox: [P('M3 11l2.5-6h9L17 11v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4zM3 11h4l1 2h4l1-2h4')],
    help: [
      h('circle', { cx: 10, cy: 10, r: 7, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7 }),
      P('M8 8a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6 1V11M10 14h.01'),
    ],
    close: [P('M5 5l10 10M15 5L5 15')],
    minimize: [
      P(
        'M8 3H5a2 2 0 0 0-2 2v3M12 3h3a2 2 0 0 1 2 2v3M8 17H5a2 2 0 0 1-2-2v-3M12 17h3a2 2 0 0 0 2-2v-3',
      ),
    ],
  };
  return h(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 20 20',
      style: { display: 'block', flexShrink: 0, ...style },
    },
    ((m[name] || m.file) as React.ReactElement[]).map((el, i) =>
      // biome-ignore lint/suspicious/noArrayIndexKey: static SVG path list, never reordered
      React.cloneElement(el, { key: i }),
    ),
  );
}

export function Button({
  t,
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  style,
  leftIcon,
  rightIcon,
  reduced,
}: {
  t: Tok;
  variant?: 'primary' | 'outline' | 'soft' | 'ghost';
  size?: 'sm' | 'md';
  children?: React.ReactNode;
  onClick?: () => void;
  style?: CSS;
  leftIcon?: string;
  rightIcon?: string;
  reduced?: boolean;
}): React.ReactElement {
  const base: CSS = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    font: `600 ${size === 'sm' ? '13px' : '14px'} 'Geist',sans-serif`,
    cursor: 'pointer',
    borderRadius: '9px',
    padding: size === 'sm' ? '7px 12px' : '9px 15px',
    transition: 'transform .15s,background .15s,box-shadow .15s',
    whiteSpace: 'nowrap',
    border: '1px solid transparent',
  };
  const v: CSS =
    variant === 'primary'
      ? { background: t.accent, color: t.accentFg }
      : variant === 'outline'
        ? { background: 'transparent', color: t.text, border: `1px solid ${t.borderStrong}` }
        : variant === 'soft'
          ? { background: t.panel2, color: t.text, border: `1px solid ${t.border}` }
          : { background: 'transparent', color: t.muted };
  return h(
    'button',
    {
      onClick,
      style: { ...base, ...v, ...style },
      onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!reduced) e.currentTarget.style.transform = 'translateY(-1px)';
      },
      onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'none';
      },
      onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'scale(.97)';
      },
      onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = reduced ? 'none' : 'translateY(-1px)';
      },
    },
    leftIcon && h(Icon, { name: leftIcon, size: size === 'sm' ? 15 : 16 }),
    children,
    rightIcon && h(Icon, { name: rightIcon, size: size === 'sm' ? 15 : 16 }),
  );
}

export function Badge({
  t,
  children,
  tone = 'neutral',
  dot,
}: {
  t: Tok;
  children?: React.ReactNode;
  tone?: 'neutral' | 'accent' | 'success';
  dot?: boolean;
}) {
  const x =
    tone === 'accent'
      ? { c: t.accent, bg: t.accentSoft2, b: t.accentRing }
      : tone === 'success'
        ? { c: '#22c55e', bg: 'rgba(34,197,94,.12)', b: 'rgba(34,197,94,.3)' }
        : { c: t.muted, bg: t.panel2, b: t.border };
  return h(
    'span',
    {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        font: "600 11px 'Geist',sans-serif",
        color: x.c,
        background: x.bg,
        border: `1px solid ${x.b}`,
        borderRadius: '999px',
        padding: '2px 8px',
      },
    },
    dot &&
      h('span', { style: { width: '5px', height: '5px', borderRadius: '50%', background: x.c } }),
    children,
  );
}

export function Kbd({ t, children }: { t: Tok; children?: React.ReactNode }) {
  return h(
    'kbd',
    {
      style: {
        fontFamily: "'Geist Mono',monospace",
        fontSize: '11px',
        color: t.muted,
        background: t.panel2,
        border: `1px solid ${t.border}`,
        borderRadius: '5px',
        padding: '1px 5px',
        display: 'inline-block',
        lineHeight: 1.4,
      },
    },
    children,
  );
}

export function Avatar({
  t,
  name,
  size = 32,
  accent,
}: {
  t: Tok;
  name?: string;
  size?: number;
  accent?: boolean;
}) {
  const init = (name || '?')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const hue = (name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return h(
    'span',
    {
      style: {
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        font: `600 ${size * 0.38}px 'Geist',sans-serif`,
        color: '#fff',
        background: accent ? t.accent : `hsl(${hue} 50% 52%)`,
      },
    },
    init,
  );
}

export function Field({
  t,
  label,
  ph,
  type,
}: {
  t: Tok;
  label?: string;
  ph?: string;
  type?: string;
}) {
  return h(
    'label',
    { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
    label && h('span', { style: { font: "500 12.5px 'Geist',sans-serif", color: t.muted } }, label),
    h('input', {
      type: type || 'text',
      placeholder: ph,
      style: {
        border: `1px solid ${t.border}`,
        outline: 'none',
        background: t.bg,
        borderRadius: '9px',
        padding: '9px 12px',
        font: "400 14px 'Geist',sans-serif",
        color: t.text,
      },
      onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = t.accent;
      },
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = t.border;
      },
    }),
  );
}

/** Small uppercase section label used in sidebars (catalogue + detail). */
export function SectionLabel({
  t,
  children,
  style,
}: {
  t: Tok;
  children?: React.ReactNode;
  style?: CSS;
}): React.ReactElement {
  return h(
    'div',
    {
      style: {
        font: "600 11px 'Geist',sans-serif",
        letterSpacing: '.05em',
        textTransform: 'uppercase',
        color: t.faint,
        padding: '0 6px 8px',
        ...style,
      },
    },
    children,
  );
}

/** Monospace accent pill for a primitive name (sidebar + spec grid). */
export function PrimPill({ t, children }: { t: Tok; children?: React.ReactNode }) {
  return h(
    'code',
    {
      style: {
        fontFamily: "'Geist Mono',monospace",
        fontSize: '11px',
        color: t.accent,
        background: t.accentSoft2,
        border: `1px solid ${t.accentRing}`,
        borderRadius: '6px',
        padding: '3px 7px',
      },
    },
    children,
  );
}
