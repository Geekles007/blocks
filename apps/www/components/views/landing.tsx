'use client';

import { useRouter } from 'next/navigation';
import type * as React from 'react';
import { BLOCKS } from '~/lib/blocks-data';
import { h } from '~/lib/h';
import { Reveal } from '~/lib/motion';
import { ROUTES } from '~/lib/routes';
import { useUI } from '~/lib/ui-context';
import { CardSkeleton } from '../card-skeleton';
import { InstallCommand, PageContainer, PageHeader } from '../page';
import { Badge, Button, Icon } from '../primitives';

// Only shipped blocks are featured. Sourced from BLOCKS so the landing can
// never advertise a block that isn't actually in the catalogue.
const FEATURED = BLOCKS;
const INSTALL_CMD = 'npx ibirdui add blocks.ibird.dev/r/hero';

export function Landing() {
  const { t, m, reduced, copy } = useUI();
  const router = useRouter();
  return h(
    'div',
    {},
    h(
      'section',
      {
        style: { position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${t.border}` },
      },
      h(
        'div',
        { style: { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' } },
        h('div', {
          className: 'ib-float1',
          style: {
            position: 'absolute',
            top: '-160px',
            left: '10%',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            filter: 'blur(90px)',
            opacity: 0.22,
            background: t.accent,
          },
        }),
        h('div', {
          className: 'ib-float2',
          style: {
            position: 'absolute',
            top: '-120px',
            right: '8%',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            filter: 'blur(90px)',
            opacity: 0.16,
            background: '#ec4899',
          },
        }),
      ),
      h(
        PageContainer,
        { width: 'prose', pad: '88px 24px 64px', style: { position: 'relative' } },
        h(PageHeader, {
          t,
          reduced,
          align: 'center',
          size: 'lg',
          titleMaxWidth: '15ch',
          kicker: h(Badge, { t, tone: 'accent', dot: true }, 'Compatible shadcn · MIT'),
          title: [
            m.landing.titleLead,
            h('span', { style: { color: t.accent } }, m.landing.titleAccent),
          ],
          subtitle: m.landing.subtitle,
          actions: [
            h(
              Button,
              { t, reduced, rightIcon: 'arrow', onClick: () => router.push(ROUTES.catalogue) },
              m.landing.browse,
            ),
            h(Button, { t, reduced, variant: 'outline', leftIcon: 'github' }, m.landing.starGithub),
          ],
          children: h(InstallCommand, {
            t,
            cmd: INSTALL_CMD,
            onCopy: copy,
            style: { marginTop: '8px' },
          }),
        }),
      ),
    ),
    h(
      'section',
      { style: { maxWidth: '1080px', margin: '0 auto', padding: '56px 24px' } },
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '22px',
            gap: '16px',
            flexWrap: 'wrap',
          },
        },
        h(
          'div',
          {},
          h(
            'h2',
            {
              style: {
                margin: '0 0 6px',
                font: "700 24px 'Geist',sans-serif",
                letterSpacing: '-.02em',
                color: t.text,
              },
            },
            m.landing.featuredTitle,
          ),
          h('p', { style: { margin: 0, color: t.faint, fontSize: '14px' } }, m.landing.featuredSub),
        ),
        h(
          Button,
          {
            t,
            reduced,
            variant: 'soft',
            rightIcon: 'arrow',
            onClick: () => router.push(ROUTES.catalogue),
          },
          m.landing.seeAll,
        ),
      ),
      h(
        Reveal,
        { reduced, trigger: 'view', stagger: 90, y: 20, className: 'ib-featgrid' },
        ...FEATURED.map((f) =>
          h(
            'div',
            {
              key: f.key,
              onClick: () => router.push(ROUTES.block(f.key)),
              style: {
                cursor: 'pointer',
                background: t.bg2,
                border: `1px solid ${t.border}`,
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'border-color .2s',
              },
              onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.borderColor = t.accentRing;
              },
              onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.borderColor = t.border;
              },
            },
            h(
              'div',
              {
                style: {
                  height: '300px',
                  padding: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  background: 'radial-gradient(var(--ib-border) 1px,transparent 1px)',
                  backgroundSize: '20px 20px',
                },
              },
              h(CardSkeleton, { t, kind: f.preview }),
            ),
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 16px',
                  borderTop: `1px solid ${t.border}`,
                },
              },
              h(
                'div',
                { style: { display: 'flex', alignItems: 'center', gap: '9px' } },
                h(
                  'span',
                  { style: { font: "600 14px 'Geist',sans-serif", color: t.text } },
                  f.name,
                ),
                h(Badge, { t }, f.cat),
              ),
              h(
                'span',
                {
                  style: {
                    color: t.faint,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12.5px',
                  },
                },
                m.landing.open,
                h(Icon, { name: 'arrow', size: 14 }),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
