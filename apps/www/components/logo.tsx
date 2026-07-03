'use client';

import { h } from '~/lib/h';
import type { Tok } from '~/lib/tokens';

/**
 * The brand lime — the exact accent of the logo asset (public/…-logo.svg and the
 * favicon), kept fixed so the in-app mark, the SVG and the tab icon all match.
 */
const BRAND_LIME = '#a3e635';

/**
 * The ibirdui blocks mark: a 2×2 grid of rounded "blocks", the bottom-right one
 * in the brand lime. Same geometry as public/ibirdui-blocks-logo.svg and the
 * favicon. The three neutral tiles use `t.text` so the mark reads on both light
 * and dark surfaces (in dark that is exactly the asset's #fafafa).
 */
export function BlocksMark({ t, size = 32 }: { t: Tok; size?: number }) {
  const tile = (x: number, y: number, fill: string) =>
    h('rect', { x, y, width: 162.47, height: 162.47, rx: 43.55, fill });
  return h(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 512 512',
      xmlns: 'http://www.w3.org/2000/svg',
      'aria-hidden': true,
      style: { display: 'block', flexShrink: 0 },
    },
    tile(81.92, 81.92, t.text),
    tile(267.61, 81.92, t.text),
    tile(81.92, 267.61, t.text),
    tile(267.61, 267.61, BRAND_LIME),
  );
}

/** The mark paired with the "ibirdui blocks" wordmark. */
export function BlocksLockup({ t, size = 30 }: { t: Tok; size?: number }) {
  const word = `${size * 0.5}px`;
  return h(
    'div',
    { style: { display: 'flex', alignItems: 'center', gap: `${size * 0.34}px` } },
    h(BlocksMark, { t, size }),
    h(
      'div',
      { style: { display: 'flex', alignItems: 'baseline', gap: '6px', lineHeight: 1 } },
      h(
        'span',
        {
          style: { font: `700 ${word} 'Geist',sans-serif`, letterSpacing: '-.03em', color: t.text },
        },
        'ibirdui',
      ),
      h(
        'span',
        {
          style: {
            font: `600 ${word} 'Geist',sans-serif`,
            letterSpacing: '-.03em',
            color: BRAND_LIME,
          },
        },
        'blocks',
      ),
    ),
  );
}
