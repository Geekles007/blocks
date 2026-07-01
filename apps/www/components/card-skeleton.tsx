'use client';

// Skeleton "illustrations" shown on catalogue / landing cards. We deliberately
// do NOT mount the real block here — the live component is reserved for the
// detail page. Each shape is an abstract, shimmering wireframe of the block's
// layout, themed via the --ib-skel-* vars set on the root.
import type * as React from 'react';
import { type CSS, h } from '~/lib/h';
import type { Tok } from '~/lib/tokens';

function bar(w: CSS['width'], height: number, opts: { radius?: number; opacity?: number } = {}) {
  return h('div', {
    className: 'ib-skel',
    style: {
      width: w,
      height,
      borderRadius: opts.radius ?? 7,
      opacity: opts.opacity ?? 1,
    },
  });
}

/** Accent-tinted "button" pill so the illustration reads as a real CTA. */
function pill(t: Tok, w: number, accent: boolean) {
  return h('div', {
    style: {
      width: w,
      height: 30,
      borderRadius: 999,
      background: accent ? t.accentSoft : 'transparent',
      border: `1px solid ${accent ? t.accentRing : t.borderStrong}`,
    },
  });
}

// Centred marketing-hero wireframe: eyebrow pill, two title bars, subtitle,
// and a primary/secondary CTA pair.
function HeroSkeleton({ t }: { t: Tok }) {
  return h(
    'div',
    {
      style: {
        width: '100%',
        maxWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
      },
    },
    h('div', {
      style: {
        width: '92px',
        height: '18px',
        borderRadius: 999,
        background: t.accentSoft2,
        border: `1px solid ${t.accentRing}`,
      },
    }),
    h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '9px',
          width: '100%',
        },
      },
      bar('72%', 20, { radius: 8 }),
      bar('52%', 20, { radius: 8 }),
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '7px',
          width: '100%',
        },
      },
      bar('58%', 10, { opacity: 0.7 }),
      bar('44%', 10, { opacity: 0.7 }),
    ),
    h(
      'div',
      { style: { display: 'flex', gap: '10px', marginTop: '4px' } },
      pill(t, 104, true),
      pill(t, 86, false),
    ),
  );
}

// Generic card wireframe (header row + text lines) for blocks without a
// dedicated illustration yet.
function GenericSkeleton({ t }: { t: Tok }) {
  return h(
    'div',
    {
      style: {
        width: '100%',
        maxWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      },
    },
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
      h('div', {
        className: 'ib-skel',
        style: { width: '34px', height: '34px', borderRadius: '10px' },
      }),
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 } },
        bar('60%', 11),
        bar('40%', 9, { opacity: 0.7 }),
      ),
    ),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '7px' } },
      bar('100%', 10, { opacity: 0.7 }),
      bar('92%', 10, { opacity: 0.7 }),
      bar('70%', 10, { opacity: 0.7 }),
    ),
    h('div', { style: { marginTop: '2px' } }, pill(t, 96, true)),
  );
}

const SHAPES: Record<string, ({ t }: { t: Tok }) => React.ReactElement> = {
  hero: HeroSkeleton,
};

/** Card illustration for a block, keyed by its `preview` id. */
export function CardSkeleton({ t, kind }: { t: Tok; kind: string }) {
  const Shape = SHAPES[kind] ?? GenericSkeleton;
  return h(
    'div',
    {
      style: {
        '--ib-skel-base': t.skelBase,
        '--ib-skel-hi': t.skelHi,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      } as CSS,
    },
    h(Shape, { t }),
  );
}
