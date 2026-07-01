'use client';

// Live primitive showcases. Each entry mounts the REAL ibirdui component synced
// into registry-preview — so the Primitives catalogue proves the actual,
// installable primitives, with the same a11y the design system is tested for.
import { Avatar } from '@/components/avatar';
import { Badge, type BadgeVariant } from '@/components/badge';
import { Button, type ButtonVariant } from '@/components/button';
import * as React from 'react';
import { type CSS, h } from '~/lib/h';
import { Icon } from './primitives';

/** Flex-wrap row used to lay a design's variants side by side. */
function row(style: CSS, ...children: React.ReactNode[]) {
  return h(
    'div',
    { style: { display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', ...style } },
    ...children,
  );
}

const withIcon = (name: string, label: string) =>
  h(React.Fragment, null, h(Icon, { name, size: 16 }), label);

export interface PrimitiveShowcase {
  /** Compact preview for the catalogue grid card. */
  Card: () => React.ReactElement;
  /** Live variants for one design (déclinaison) on the detail page. */
  renderDesign: (designKey: string) => React.ReactNode;
}

/* ── Button ──────────────────────────────────────────────────────────────── */
function buttonDesign(designKey: string) {
  const variant = designKey as ButtonVariant;
  return row(
    {},
    h(Button, { variant, size: 'sm' }, 'Small'),
    h(Button, { variant, size: 'md' }, 'Medium'),
    h(Button, { variant, size: 'lg' }, 'Large'),
    h(Button, { variant, size: 'md' }, withIcon('arrow', 'Avec icône')),
    h(Button, { variant, size: 'md', disabled: true }, 'Désactivé'),
    h(
      Button,
      { variant, size: 'icon', 'aria-label': 'Ajouter' },
      h(Icon, { name: 'plus', size: 16 }),
    ),
  );
}

/* ── Badge ───────────────────────────────────────────────────────────────── */
function badgeDesign(designKey: string) {
  const variant = designKey as BadgeVariant;
  return row(
    {},
    h(Badge, { variant }, 'Label'),
    h(Badge, { variant }, 'Nouveau'),
    h(Badge, { variant }, 'v1.1'),
  );
}

/* ── Avatar ──────────────────────────────────────────────────────────────── */
const AVATAR_SIZES = [28, 40, 56];
const PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#6366f1'/><stop offset='1' stop-color='#ec4899'/></linearGradient></defs><rect width='64' height='64' fill='url(%23g)'/></svg>",
)}`;
function avatarDesign(designKey: string) {
  return row(
    {},
    ...AVATAR_SIZES.map((size) => {
      if (designKey === 'image')
        return h(Avatar, { key: size, src: PHOTO, name: 'Ada Lovelace', size });
      if (designKey === 'initials') return h(Avatar, { key: size, name: 'Ada Lovelace', size });
      return h(Avatar, { key: size, size });
    }),
  );
}

export const SHOWCASES: Record<string, PrimitiveShowcase> = {
  button: {
    Card: () =>
      row(
        { justifyContent: 'center' },
        h(Button, { variant: 'default', size: 'md' }, 'Button'),
        h(Button, { variant: 'outline', size: 'md' }, 'Outline'),
        h(
          Button,
          { variant: 'ghost', size: 'icon', 'aria-label': 'Plus' },
          h(Icon, { name: 'plus', size: 16 }),
        ),
      ),
    renderDesign: buttonDesign,
  },
  badge: {
    Card: () =>
      row(
        { justifyContent: 'center' },
        h(Badge, { variant: 'default' }, 'New'),
        h(Badge, { variant: 'secondary' }, 'Draft'),
        h(Badge, { variant: 'outline' }, 'Tag'),
      ),
    renderDesign: badgeDesign,
  },
  avatar: {
    Card: () =>
      h(
        'div',
        { className: '-space-x-2.5 flex items-center' },
        h(Avatar, {
          src: PHOTO,
          name: 'Ada Lovelace',
          size: 40,
          className: 'ring-2 ring-background',
        }),
        h(Avatar, { name: 'Grace Hopper', size: 40, className: 'ring-2 ring-background' }),
        h(Avatar, { size: 40, className: 'ring-2 ring-background' }),
      ),
    renderDesign: avatarDesign,
  },
};

export function renderPrimitiveCard(key: string): React.ReactNode {
  return SHOWCASES[key]?.Card() ?? null;
}

export function renderPrimitiveDesign(key: string, designKey: string): React.ReactNode {
  return SHOWCASES[key]?.renderDesign(designKey) ?? null;
}
