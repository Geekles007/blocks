'use client';

// Skeleton "illustrations" shown on catalogue / landing cards. We deliberately
// do NOT mount the real block here — the live component is reserved for the
// detail page. Each shape is an abstract, shimmering wireframe of the block's
// OWN layout, so a card reads as its block at a glance. Themed via the
// --ib-skel-* vars set on the root.
import type * as React from 'react';
import { type CSS, h } from '~/lib/h';
import type { Tok } from '~/lib/tokens';

/* ---------------------------------------------------------------- toolkit */

function bar(w: CSS['width'], height: number, opts: { radius?: number; opacity?: number } = {}) {
  return h('div', {
    className: 'ib-skel',
    style: { width: w, height, borderRadius: opts.radius ?? 7, opacity: opts.opacity ?? 1 },
  });
}

/** Accent-tinted "button" pill so the illustration reads as a real CTA. */
function pill(t: Tok, w: number, accent: boolean, height = 30) {
  return h('div', {
    style: {
      width: w,
      height,
      borderRadius: 999,
      background: accent ? t.accentSoft : 'transparent',
      border: `1px solid ${accent ? t.accentRing : t.borderStrong}`,
    },
  });
}

/** The accent eyebrow chip. */
function eyebrow(t: Tok, w = 92) {
  return h('div', {
    style: {
      width: w,
      height: 18,
      borderRadius: 999,
      background: t.accentSoft2,
      border: `1px solid ${t.accentRing}`,
    },
  });
}

function col(align: CSS['alignItems'], gap: number, kids: React.ReactNode[], extra: CSS = {}) {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: align,
        gap,
        width: '100%',
        ...extra,
      },
    },
    ...kids,
  );
}

function row(gap: number, kids: React.ReactNode[], extra: CSS = {}) {
  return h('div', { style: { display: 'flex', gap, ...extra } }, ...kids);
}

/** A bordered surface — panels, cards, media frames. */
function frame(t: Tok, style: CSS, kids: React.ReactNode[] = []) {
  return h(
    'div',
    {
      style: {
        border: `1px solid ${t.borderStrong}`,
        borderRadius: 12,
        background: t.panel2,
        ...style,
      },
    },
    ...kids,
  );
}

function dot(color: string, size = 10) {
  return h('div', { style: { width: size, height: size, borderRadius: 999, background: color } });
}

const wrap = (max: number, kids: React.ReactNode[], extra: CSS = {}) =>
  h('div', { style: { width: '100%', maxWidth: max, ...extra } }, ...kids);

/* ---------------------------------------------------------------- shapes */

// Centred marketing hero: eyebrow, two title bars, subtitle, CTA pair.
function HeroSkeleton({ t }: { t: Tok }) {
  return wrap(
    320,
    [
      col(
        'center',
        14,
        [
          eyebrow(t),
          col('center', 9, [bar('72%', 20, { radius: 8 }), bar('52%', 20, { radius: 8 })]),
          col('center', 7, [bar('58%', 10, { opacity: 0.7 }), bar('44%', 10, { opacity: 0.7 })]),
          row(10, [pill(t, 104, true), pill(t, 86, false)], { marginTop: 4 }),
        ],
        { alignItems: 'center' },
      ),
    ],
    { display: 'flex', justifyContent: 'center' },
  );
}

// Terminal: copy left, terminal window right.
function TerminalSkeleton({ t }: { t: Tok }) {
  const line = (w: string, accent = false) =>
    row(6, [dot(accent ? t.accent : t.faint, 7), bar(w, 8, { opacity: accent ? 1 : 0.7 })], {
      alignItems: 'center',
      width: '100%',
    });
  return row(
    16,
    [
      col(
        'flex-start',
        10,
        [
          bar('88%', 16, { radius: 8 }),
          bar('60%', 16, { radius: 8 }),
          bar('92%', 9, { opacity: 0.6 }),
          row(8, [pill(t, 78, true), pill(t, 58, false)], { marginTop: 4 }),
        ],
        { flex: 1 },
      ),
      frame(t, { flex: 1, overflow: 'hidden', background: t.bg2 }, [
        row(6, [dot(t.faint, 7), dot(t.faint, 7), dot(t.faint, 7)], {
          alignItems: 'center',
          padding: '8px 10px',
          borderBottom: `1px solid ${t.border}`,
        }),
        col('flex-start', 8, [line('70%', true), line('84%'), line('56%'), line('64%')], {
          padding: 12,
        }),
      ]),
    ],
    { width: '100%', maxWidth: 360, alignItems: 'center' },
  );
}

// Fintech: copy left, account card (balance + trust figures) right.
function FintechSkeleton({ t }: { t: Tok }) {
  const fig = () =>
    col('flex-start', 5, [bar(30, 10, { radius: 4 }), bar(40, 6, { opacity: 0.6 })]);
  return row(
    16,
    [
      col(
        'flex-start',
        10,
        [
          eyebrow(t, 66),
          bar('88%', 16, { radius: 8 }),
          bar('62%', 16, { radius: 8 }),
          row(8, [pill(t, 80, true), pill(t, 58, false)], { marginTop: 4 }),
        ],
        { flex: 1 },
      ),
      frame(
        t,
        {
          flex: 1,
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: t.panel,
        },
        [
          row(
            0,
            [bar('44%', 8, { opacity: 0.6 }), h('div', { style: { flex: 1 } }), dot(t.accent, 8)],
            { alignItems: 'center', width: '100%' },
          ),
          bar('58%', 22, { radius: 6 }),
          row(10, [fig(), fig(), fig()], { marginTop: 2 }),
        ],
      ),
    ],
    { width: '100%', maxWidth: 360, alignItems: 'center' },
  );
}

// Agency: oversized left title + a thin meta rail (asymmetric).
function AgencySkeleton({ t }: { t: Tok }) {
  return row(
    16,
    [
      col(
        'flex-start',
        10,
        [
          bar('96%', 24, { radius: 8 }),
          bar('80%', 24, { radius: 8 }),
          bar('88%', 24, { radius: 8 }),
          h('div', {
            style: { width: 54, height: 6, borderRadius: 999, background: t.accent, marginTop: 4 },
          }),
        ],
        { flex: 3 },
      ),
      col(
        'flex-start',
        8,
        [
          bar('100%', 7, { opacity: 0.55 }),
          bar('70%', 7, { opacity: 0.55 }),
          bar('90%', 7, { opacity: 0.55 }),
          bar('60%', 7, { opacity: 0.55 }),
        ],
        { flex: 1, paddingTop: 6 },
      ),
    ],
    { width: '100%', maxWidth: 340, alignItems: 'flex-start' },
  );
}

/** A full-width CTA bar for pricing skeletons — accent-filled when featured. */
function ctaBar(t: Tok, featured: boolean, height = 22) {
  return h('div', {
    style: {
      width: '100%',
      height,
      borderRadius: 8,
      background: featured ? t.accentSoft : 'transparent',
      border: `1px solid ${featured ? t.accentRing : t.borderStrong}`,
    },
  });
}

/** One abstract plan card: name, price, CTA, feature lines. */
function planCard(t: Tok, featured: boolean) {
  return frame(
    t,
    {
      flex: 1,
      minWidth: 0,
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 9,
      background: featured ? t.accentSoft2 : t.panel2,
      borderColor: featured ? t.accentRing : t.borderStrong,
    },
    [
      bar('46%', 8, { opacity: 0.8 }),
      bar('62%', 18, { radius: 6 }),
      ctaBar(t, featured),
      col('flex-start', 6, [
        bar('92%', 6, { opacity: 0.6 }),
        bar('80%', 6, { opacity: 0.6 }),
        bar('86%', 6, { opacity: 0.6 }),
      ]),
    ],
  );
}

// Pricing: a title over a row of three plan cards, the middle one featured.
function PricingSkeleton({ t }: { t: Tok }) {
  return wrap(360, [
    col(
      'center',
      12,
      [
        col('center', 6, [bar('44%', 11, { radius: 6 }), bar('64%', 7, { opacity: 0.6 })]),
        row(8, [planCard(t, false), planCard(t, true), planCard(t, false)], {
          width: '100%',
          alignItems: 'stretch',
        }),
      ],
      { alignItems: 'center' },
    ),
  ]);
}

// Pricing Toggle: a centred month/year switch above two plan cards.
function PricingToggleSkeleton({ t }: { t: Tok }) {
  const toggle = h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      },
    },
    bar(40, 7, { opacity: 0.6 }),
    h('div', {
      style: {
        width: 34,
        height: 18,
        borderRadius: 999,
        background: t.accentSoft,
        border: `1px solid ${t.accentRing}`,
        position: 'relative',
      },
    }),
    bar(34, 7, { opacity: 0.6 }),
  );
  return wrap(340, [
    col(
      'center',
      12,
      [
        bar('52%', 11, { radius: 6 }),
        toggle,
        row(10, [planCard(t, true), planCard(t, false)], {
          width: '100%',
          alignItems: 'stretch',
        }),
      ],
      { alignItems: 'center' },
    ),
  ]);
}

// Pricing Single: one wide card, big price + two feature columns + CTA.
function PricingSingleSkeleton({ t }: { t: Tok }) {
  const featureCol = () =>
    col('flex-start', 7, [
      bar('90%', 6, { opacity: 0.6 }),
      bar('75%', 6, { opacity: 0.6 }),
      bar('82%', 6, { opacity: 0.6 }),
    ]);
  return wrap(360, [
    col('center', 10, [
      bar('50%', 11, { radius: 6 }),
      frame(t, { width: '100%', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }, [
        row(20, [featureCol(), featureCol()], { width: '100%', alignItems: 'flex-start' }),
        h('div', {
          style: { height: 1, width: '100%', background: t.border },
        }),
        col('center', 9, [bar('38%', 22, { radius: 6 }), ctaBar(t, true, 26)], {
          alignItems: 'center',
        }),
      ]),
    ]),
  ]);
}

// Pricing Compare: a comparison table — plan header row over feature rows.
function PricingCompareSkeleton({ t }: { t: Tok }) {
  const headerCell = (accent: boolean) =>
    col('flex-start', 5, [bar('70%', 7, { opacity: 0.8 }), bar('50%', 12, { radius: 5 })], {
      flex: 1,
      minWidth: 0,
      padding: '0 4px',
      ...(accent
        ? { borderRadius: 6, background: t.accentSoft2, paddingTop: 4, paddingBottom: 4 }
        : {}),
    });
  const featureRow = () =>
    row(
      0,
      [
        h('div', { style: { flex: 1.3, minWidth: 0 } }, bar('80%', 6, { opacity: 0.7 })),
        ...[false, true, false].map((accent, c) =>
          h(
            'div',
            {
              key: c,
              style: {
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                padding: '5px 0',
                background: accent ? t.accentSoft2 : 'transparent',
              },
            },
            dot(accent ? t.accent : t.faint, 8),
          ),
        ),
      ],
      { width: '100%', alignItems: 'center', borderTop: `1px solid ${t.border}` },
    );
  return wrap(360, [
    col('center', 10, [
      bar('46%', 11, { radius: 6 }),
      frame(t, { width: '100%', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }, [
        row(
          0,
          [
            h('div', { style: { flex: 1.3 } }),
            headerCell(false),
            headerCell(true),
            headerCell(false),
          ],
          {
            width: '100%',
            alignItems: 'flex-end',
          },
        ),
        col('flex-start', 0, [featureRow(), featureRow(), featureRow(), featureRow()]),
      ]),
    ]),
  ]);
}

/* ---------------------------------------------- SaaS-landing block shapes */

/** The ibirdui blocks 2×2 mark: three neutral tiles + one accent tile. */
function brandMark(t: Tok, tile = 6) {
  const sq = (c: string) =>
    h('div', { style: { width: tile, height: tile, borderRadius: 2, background: c } });
  return h(
    'div',
    { style: { display: 'grid', gridTemplateColumns: `${tile}px ${tile}px`, gap: 2 } },
    sq(t.text),
    sq(t.text),
    sq(t.text),
    sq(t.accent),
  );
}

// Features: a centred header over a row of three icon-tile feature cards.
function FeaturesSkeleton({ t }: { t: Tok }) {
  const tile = () =>
    h('div', {
      style: {
        width: 26,
        height: 26,
        borderRadius: 8,
        background: t.accentSoft,
        border: `1px solid ${t.accentRing}`,
      },
    });
  const card = () =>
    frame(
      t,
      { flex: 1, minWidth: 0, padding: 12, display: 'flex', flexDirection: 'column', gap: 9 },
      [
        tile(),
        bar('70%', 9, { radius: 5 }),
        col('flex-start', 5, [bar('92%', 6, { opacity: 0.6 }), bar('76%', 6, { opacity: 0.6 })]),
      ],
    );
  return wrap(360, [
    col(
      'center',
      14,
      [
        col('center', 8, [
          eyebrow(t, 80),
          bar('56%', 14, { radius: 7 }),
          bar('42%', 7, { opacity: 0.6 }),
        ]),
        row(9, [card(), card(), card()], { width: '100%', alignItems: 'stretch' }),
      ],
      { alignItems: 'center' },
    ),
  ]);
}

// Testimonials: a centred header over a row of three quote cards.
function TestimonialsSkeleton({ t }: { t: Tok }) {
  const card = () =>
    frame(
      t,
      { flex: 1, minWidth: 0, padding: 12, display: 'flex', flexDirection: 'column', gap: 9 },
      [
        row(3, [
          dot(t.accent, 6),
          dot(t.accent, 6),
          dot(t.accent, 6),
          dot(t.accent, 6),
          dot(t.accent, 6),
        ]),
        col('flex-start', 5, [
          bar('95%', 6, { opacity: 0.7 }),
          bar('88%', 6, { opacity: 0.7 }),
          bar('68%', 6, { opacity: 0.7 }),
        ]),
        row(
          7,
          [
            dot(t.faint, 20),
            col('flex-start', 4, [bar(46, 6, { opacity: 0.8 }), bar(60, 5, { opacity: 0.5 })]),
          ],
          {
            alignItems: 'center',
            marginTop: 2,
          },
        ),
      ],
    );
  return wrap(360, [
    col(
      'center',
      14,
      [
        col('center', 8, [
          eyebrow(t, 70),
          bar('54%', 14, { radius: 7 }),
          bar('44%', 7, { opacity: 0.6 }),
        ]),
        row(9, [card(), card(), card()], { width: '100%', alignItems: 'stretch' }),
      ],
      { alignItems: 'center' },
    ),
  ]);
}

// CTA: a centred heading, subtitle and two buttons on an accent panel.
function CtaSkeleton({ t }: { t: Tok }) {
  return wrap(360, [
    frame(
      t,
      {
        width: '100%',
        padding: '22px 18px',
        display: 'flex',
        justifyContent: 'center',
        background: t.accentSoft,
        borderColor: t.accentRing,
      },
      [
        col(
          'center',
          10,
          [
            h('div', {
              style: {
                width: 64,
                height: 15,
                borderRadius: 999,
                border: `1px solid ${t.accentRing}`,
              },
            }),
            col('center', 7, [bar('68%', 13, { radius: 7 }), bar('48%', 13, { radius: 7 })]),
            bar('58%', 7, { opacity: 0.6 }),
            row(
              8,
              [
                h('div', {
                  style: { width: 96, height: 26, borderRadius: 999, background: t.panel },
                }),
                h('div', {
                  style: {
                    width: 72,
                    height: 26,
                    borderRadius: 999,
                    border: `1px solid ${t.accentRing}`,
                  },
                }),
              ],
              { marginTop: 2 },
            ),
          ],
          { alignItems: 'center', width: '100%' },
        ),
      ],
    ),
  ]);
}

// FAQ: a centred header over a stack of bordered question cards, the first open.
function FaqSkeleton({ t }: { t: Tok }) {
  const qCard = (w: CSS['width'], accent = false) =>
    frame(
      t,
      {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 14px',
        background: accent ? t.accentSoft2 : t.panel2,
        borderColor: accent ? t.accentRing : t.borderStrong,
      },
      [
        h('div', { style: { flex: 1 } }, bar(w, 8, { radius: 5 })),
        h('div', {
          style: {
            width: 16,
            height: 16,
            borderRadius: 999,
            background: accent ? t.accentSoft : 'transparent',
            border: `1px solid ${accent ? t.accentRing : t.borderStrong}`,
          },
        }),
      ],
    );
  return wrap(320, [
    col(
      'center',
      11,
      [
        col('center', 7, [bar('56%', 12, { radius: 6 }), bar('44%', 7, { opacity: 0.6 })]),
        col('stretch', 8, [qCard('62%', true), qCard('74%'), qCard('52%')], { width: '100%' }),
      ],
      { alignItems: 'center' },
    ),
  ]);
}

// Footer: a brand block + link columns, a rule, then a bottom bar.
function FooterSkeleton({ t }: { t: Tok }) {
  const column = () =>
    col(
      'flex-start',
      7,
      [
        bar(40, 6, { opacity: 0.8 }),
        bar('82%', 5, { opacity: 0.5 }),
        bar('64%', 5, { opacity: 0.5 }),
        bar('72%', 5, { opacity: 0.5 }),
      ],
      { flex: 1, minWidth: 0 },
    );
  return wrap(360, [
    col(
      'stretch',
      12,
      [
        row(
          16,
          [
            col(
              'flex-start',
              8,
              [
                row(6, [brandMark(t), bar(56, 8, { radius: 4 })], { alignItems: 'center' }),
                bar('92%', 5, { opacity: 0.5 }),
                row(5, [dot(t.faint, 14), dot(t.faint, 14)], { marginTop: 2 }),
              ],
              { flex: 1.4, minWidth: 0 },
            ),
            row(12, [column(), column(), column()], { flex: 2, minWidth: 0 }),
          ],
          { width: '100%', alignItems: 'flex-start' },
        ),
        h('div', { style: { height: 1, width: '100%', background: t.border } }),
        row(
          8,
          [
            bar('40%', 6, { opacity: 0.5 }),
            h('div', { style: { flex: 1 } }),
            bar(30, 5, { opacity: 0.5 }),
            bar(30, 5, { opacity: 0.5 }),
          ],
          {
            width: '100%',
            alignItems: 'center',
          },
        ),
      ],
      { alignItems: 'stretch' },
    ),
  ]);
}

// Navbar: a header bar — brand, nav links, and two actions.
function NavbarSkeleton({ t }: { t: Tok }) {
  return wrap(380, [
    frame(
      t,
      {
        width: '100%',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: t.panel,
      },
      [
        row(6, [brandMark(t), bar(52, 8, { radius: 4 })], { alignItems: 'center' }),
        row(
          10,
          [
            bar(40, 6, { opacity: 0.6 }),
            bar(46, 6, { opacity: 0.6 }),
            bar(52, 6, { opacity: 0.6 }),
            bar(38, 6, { opacity: 0.6 }),
          ],
          { alignItems: 'center', marginLeft: 6 },
        ),
        h('div', { style: { flex: 1 } }),
        row(8, [pill(t, 42, false, 22), pill(t, 66, true, 22)], { alignItems: 'center' }),
      ],
    ),
  ]);
}

const SHAPES: Record<string, ({ t }: { t: Tok }) => React.ReactElement> = {
  hero: HeroSkeleton,
  'hero-terminal': TerminalSkeleton,
  'hero-fintech': FintechSkeleton,
  'hero-agency': AgencySkeleton,
  features: FeaturesSkeleton,
  testimonials: TestimonialsSkeleton,
  cta: CtaSkeleton,
  faq: FaqSkeleton,
  navbar: NavbarSkeleton,
  footer: FooterSkeleton,
  pricing: PricingSkeleton,
  'pricing-toggle': PricingToggleSkeleton,
  'pricing-single': PricingSingleSkeleton,
  'pricing-compare': PricingCompareSkeleton,
};

/** Card illustration for a block, keyed by its `preview` id. */
export function CardSkeleton({ t, kind }: { t: Tok; kind: string }) {
  const Shape = SHAPES[kind] ?? HeroSkeleton;
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
