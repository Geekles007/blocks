'use client';

import * as React from 'react';
import { type CSS, h } from './h';

const { useRef, useEffect, useLayoutEffect } = React;
const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const SPRINGS = {
  smooth: { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' },
  snappy: { duration: 360, easing: 'cubic-bezier(.34,1.4,.5,1)' },
  layout: { duration: 480, easing: 'cubic-bezier(.22,1,.36,1)' },
};

/** Staggered enter animation: each direct child fades/rises in sequence. */
export function Reveal({
  reduced,
  stagger = 64,
  y = 12,
  delay = 0,
  trigger = 'mount',
  style,
  className,
  children,
}: {
  reduced: boolean;
  stagger?: number;
  y?: number;
  delay?: number;
  trigger?: 'mount' | 'view';
  style?: CSS;
  className?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const kids = Array.from(el.children);
    const run = () =>
      kids.forEach((c, i) => {
        if (reduced)
          c.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 300,
            delay: delay + i * 20,
            fill: 'backwards',
          });
        else
          c.animate(
            [
              { opacity: 0, transform: `translateY(${y}px)` },
              { opacity: 1, transform: 'none' },
            ],
            { ...SPRINGS.smooth, delay: delay + i * stagger, fill: 'backwards' },
          );
      });
    if (trigger === 'view') {
      const io = new IntersectionObserver(
        (e) => {
          for (const en of e) {
            if (en.isIntersecting) {
              run();
              io.disconnect();
            }
          }
        },
        { threshold: 0.15 },
      );
      io.observe(el);
      return () => io.disconnect();
    }
    run();
  }, []);
  return h('div', { ref, style, className }, children);
}

/** Shared "magic" highlight that FLIP-morphs behind the active item. */
export function useMagic(active: string, reduced: boolean) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hlRef = useRef<HTMLDivElement>(null);
  const items = useRef<Record<string, HTMLElement>>({});
  const prev = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const setItem = (k: string) => (el: HTMLElement | null) => {
    if (el) items.current[k] = el;
  };
  useIso(() => {
    const wrap = wrapRef.current;
    const hl = hlRef.current;
    const tg = items.current[active];
    if (!wrap || !hl || !tg) {
      if (hl) hl.style.opacity = '0';
      return;
    }
    const wr = wrap.getBoundingClientRect();
    const tr = tg.getBoundingClientRect();
    const nx = tr.left - wr.left;
    const ny = tr.top - wr.top;
    const nw = tr.width;
    const nh = tr.height;
    hl.style.width = `${nw}px`;
    hl.style.height = `${nh}px`;
    hl.style.transform = `translate(${nx}px,${ny}px)`;
    hl.style.opacity = '1';
    const p = prev.current;
    if (p && !reduced) {
      const dx = p.x - nx;
      const dy = p.y - ny;
      const sx = p.w / nw || 1;
      const sy = p.h / nh || 1;
      hl.animate(
        [
          {
            transform: `translate(${nx + dx}px,${ny + dy}px) scale(${sx},${sy})`,
            transformOrigin: 'top left',
          },
          { transform: `translate(${nx}px,${ny}px) scale(1,1)`, transformOrigin: 'top left' },
        ],
        { ...SPRINGS.layout },
      );
    }
    prev.current = { x: nx, y: ny, w: nw, h: nh };
  });
  return { wrapRef, hlRef, setItem };
}

export { useIso };
