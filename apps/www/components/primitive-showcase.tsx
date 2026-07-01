'use client';

// Live primitive showcases. Each entry mounts the REAL ibirdui component synced
// into registry-preview — so the Primitives catalogue proves the actual,
// installable primitives, with the same a11y the design system is tested for.
import { Alert, AlertDescription, AlertTitle } from '@/components/alert';
import { Avatar } from '@/components/avatar';
import { Badge, type BadgeVariant } from '@/components/badge';
import { Button, type ButtonVariant } from '@/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { Checkbox } from '@/components/checkbox';
import { Input } from '@/components/input';
import { Progress } from '@/components/progress';
import { Radio, RadioGroup } from '@/components/radio-group';
import { Select } from '@/components/select';
import { Separator } from '@/components/separator';
import { Skeleton, SkeletonText } from '@/components/skeleton';
import { Slider } from '@/components/slider';
import { Switch } from '@/components/switch';
import { Textarea } from '@/components/textarea';
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

/** Vertical stack for stacked variants. */
function col(className: string, ...children: React.ReactNode[]) {
  return h('div', { className: `flex flex-col gap-3 ${className}` }, ...children);
}

/** A control paired with a clickable text label (checkbox / switch / radio). */
function labeled(control: React.ReactNode, text: string, key?: string | number) {
  return h(
    'label',
    { key, className: 'inline-flex cursor-pointer items-center gap-2 text-sm text-foreground' },
    control,
    text,
  );
}

/** A caption above a form control (not a <label> — used for non-labelable demos too). */
function cap(caption: string, control: React.ReactNode, key?: string | number) {
  return h(
    'div',
    { key, className: 'flex flex-col gap-1.5' },
    h('span', { className: 'text-xs text-muted-foreground' }, caption),
    control,
  );
}

/* ── Input ─────────────────────────────────────────────────────────────── */
function inputDesign(designKey: string) {
  if (designKey === 'affix') {
    const affix = (side: 'left' | 'right', name: string, control: React.ReactNode) =>
      h(
        'div',
        { className: 'relative' },
        h(
          'span',
          {
            className: `pointer-events-none absolute ${
              side === 'left' ? 'left-3' : 'right-3'
            } top-1/2 -translate-y-1/2 text-muted-foreground`,
          },
          h(Icon, { name, size: 16 }),
        ),
        control,
      );
    return col(
      'max-w-xs',
      affix('left', 'search', h(Input, { className: 'pl-9', placeholder: 'Rechercher…' })),
      affix('right', 'check', h(Input, { className: 'pr-9', defaultValue: 'ibird.dev' })),
    );
  }
  return col(
    'max-w-xs',
    cap('Default', h(Input, { placeholder: 'jane@ibird.dev', 'aria-label': 'Email' })),
    cap(
      'Invalide',
      h(Input, {
        defaultValue: 'not-an-email',
        'aria-invalid': true,
        'aria-label': 'Email invalide',
      }),
    ),
    cap(
      'Désactivé',
      h(Input, { defaultValue: 'read-only', disabled: true, 'aria-label': 'Champ désactivé' }),
    ),
  );
}

/* ── Textarea ──────────────────────────────────────────────────────────── */
function textareaDesign(_designKey: string) {
  return col(
    'max-w-xs',
    cap(
      'Default',
      h(Textarea, { rows: 3, placeholder: 'Votre message…', 'aria-label': 'Message' }),
    ),
    cap(
      'Invalide',
      h(Textarea, {
        rows: 3,
        defaultValue: 'Trop court',
        'aria-invalid': true,
        'aria-label': 'Message invalide',
      }),
    ),
    cap(
      'Désactivé',
      h(Textarea, {
        rows: 3,
        defaultValue: '—',
        disabled: true,
        'aria-label': 'Message désactivé',
      }),
    ),
  );
}

/* ── Checkbox ──────────────────────────────────────────────────────────── */
function checkboxDesign(_designKey: string) {
  const indeterminate = (el: HTMLInputElement | null) => {
    if (el) el.indeterminate = true;
  };
  return h(
    'div',
    { className: 'flex flex-col gap-3' },
    labeled(h(Checkbox, {}), 'Non coché', 'off'),
    labeled(h(Checkbox, { defaultChecked: true }), 'Coché', 'on'),
    labeled(h(Checkbox, { ref: indeterminate }), 'Indéterminé', 'ind'),
    labeled(h(Checkbox, { defaultChecked: true, disabled: true }), 'Désactivé', 'dis'),
  );
}

/* ── Switch ────────────────────────────────────────────────────────────── */
function switchDesign(_designKey: string) {
  return h(
    'div',
    { className: 'flex flex-col gap-3' },
    labeled(h(Switch, {}), 'Désactivée', 'off'),
    labeled(h(Switch, { defaultChecked: true }), 'Activée', 'on'),
    labeled(h(Switch, { defaultChecked: true, disabled: true }), 'Verrouillée', 'dis'),
  );
}

/* ── Radio group ───────────────────────────────────────────────────────── */
function radioDesign(designKey: string) {
  const opts: Array<[string, string]> = [
    ['comfortable', 'Comfortable'],
    ['compact', 'Compact'],
    ['spacious', 'Spacious'],
  ];
  const horizontal = designKey === 'horizontal';
  return h(
    RadioGroup,
    { name: `density-${designKey}`, className: horizontal ? 'flex-row flex-wrap gap-4' : '' },
    ...opts.map(([value, label], i) =>
      labeled(h(Radio, { value, defaultChecked: i === 0 }), label, value),
    ),
  );
}

/* ── Select ────────────────────────────────────────────────────────────── */
function selectOptions() {
  return [
    h('option', { key: 'm', value: 'member' }, 'Member'),
    h('option', { key: 'a', value: 'admin' }, 'Admin'),
    h('option', { key: 'o', value: 'owner' }, 'Owner'),
  ];
}
function selectDesign(_designKey: string) {
  return col(
    'max-w-xs',
    cap('Default', h(Select, { defaultValue: 'member', 'aria-label': 'Rôle' }, ...selectOptions())),
    cap(
      'Invalide',
      h(
        Select,
        { defaultValue: 'admin', 'aria-invalid': true, 'aria-label': 'Rôle invalide' },
        ...selectOptions(),
      ),
    ),
    cap(
      'Désactivé',
      h(
        Select,
        { defaultValue: 'member', disabled: true, 'aria-label': 'Rôle désactivé' },
        ...selectOptions(),
      ),
    ),
  );
}

/* ── Alert ─────────────────────────────────────────────────────────────── */
function alertDesign(designKey: string) {
  const variant = designKey === 'destructive' ? 'destructive' : 'default';
  const title = variant === 'destructive' ? 'Échec du paiement' : 'Mise à jour disponible';
  const body =
    variant === 'destructive'
      ? 'Votre carte a été refusée. Vérifiez vos informations et réessayez.'
      : 'La version 1.2 est prête. Redémarrez pour appliquer les changements.';
  return h(
    'div',
    { className: 'max-w-md' },
    h(Alert, { variant }, h(AlertTitle, {}, title), h(AlertDescription, {}, body)),
  );
}

/* ── Progress ──────────────────────────────────────────────────────────── */
function progressDesign(designKey: string) {
  if (designKey === 'indeterminate') {
    return h('div', { className: 'max-w-sm' }, h(Progress, { label: 'Chargement en cours' }));
  }
  return col(
    'max-w-sm',
    ...[0, 25, 50, 100].map((v) =>
      cap(`${v}%`, h(Progress, { value: v, label: `${v} pour cent` }), v),
    ),
  );
}

/* ── Slider ────────────────────────────────────────────────────────────── */
function sliderDesign(_designKey: string) {
  return col(
    'max-w-sm',
    cap('Default (40)', h(Slider, { defaultValue: 40, 'aria-label': 'Volume' })),
    cap(
      'Désactivé (70)',
      h(Slider, { defaultValue: 70, disabled: true, 'aria-label': 'Volume désactivé' }),
    ),
  );
}

/* ── Separator ─────────────────────────────────────────────────────────── */
function separatorDesign(designKey: string) {
  if (designKey === 'vertical') {
    return h(
      'div',
      { className: 'flex h-8 items-center gap-4 text-sm text-muted-foreground' },
      'Accueil',
      h(Separator, { orientation: 'vertical' }),
      'Docs',
      h(Separator, { orientation: 'vertical' }),
      'Blog',
    );
  }
  return h(
    'div',
    { className: 'max-w-sm space-y-3 text-sm text-muted-foreground' },
    h('div', {}, 'Section précédente'),
    h(Separator, {}),
    h('div', {}, 'Section suivante'),
  );
}

/* ── Skeleton ──────────────────────────────────────────────────────────── */
function skeletonDesign(designKey: string) {
  if (designKey === 'text') {
    return h('div', { className: 'max-w-sm' }, h(SkeletonText, { lines: 4 }));
  }
  return h(
    'div',
    { className: 'flex max-w-sm items-center gap-4' },
    h(Skeleton, { className: 'h-12 w-12 rounded-full' }),
    h(
      'div',
      { className: 'flex flex-1 flex-col gap-2' },
      h(Skeleton, { className: 'h-4 w-3/4' }),
      h(Skeleton, { className: 'h-4 w-1/2' }),
    ),
  );
}

/* ── Card ──────────────────────────────────────────────────────────────── */
function cardDesign(designKey: string) {
  if (designKey === 'stat') {
    return h(
      Card,
      { className: 'max-w-xs' },
      h(CardHeader, {}, h(CardDescription, {}, 'Revenu mensuel')),
      h(CardContent, { className: 'font-semibold text-2xl' }, '48 210 €'),
      h(CardFooter, { className: 'text-muted-foreground text-sm' }, '+12% vs. mois dernier'),
    );
  }
  return h(
    Card,
    { className: 'max-w-sm' },
    h(
      CardHeader,
      {},
      h(CardTitle, {}, 'Inviter votre équipe'),
      h(CardDescription, {}, 'Ajoutez des membres pour collaborer sur ce projet.'),
    ),
    h(
      CardContent,
      { className: 'text-muted-foreground text-sm' },
      'Chaque membre reçoit un e-mail d’invitation.',
    ),
    h(
      CardFooter,
      { className: 'gap-2' },
      h(Button, { variant: 'default', size: 'sm' }, 'Inviter'),
      h(Button, { variant: 'ghost', size: 'sm' }, 'Plus tard'),
    ),
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
  input: {
    Card: () =>
      h(
        'div',
        { className: 'w-full max-w-[220px]' },
        h(Input, { placeholder: 'jane@ibird.dev', 'aria-label': 'Email' }),
      ),
    renderDesign: inputDesign,
  },
  textarea: {
    Card: () =>
      h(
        'div',
        { className: 'w-full max-w-[220px]' },
        h(Textarea, { rows: 3, placeholder: 'Votre message…', 'aria-label': 'Message' }),
      ),
    renderDesign: textareaDesign,
  },
  checkbox: {
    Card: () =>
      row(
        { justifyContent: 'center' },
        labeled(h(Checkbox, { defaultChecked: true }), 'React', 'a'),
        labeled(h(Checkbox, {}), 'Vue', 'b'),
      ),
    renderDesign: checkboxDesign,
  },
  switch: {
    Card: () =>
      row(
        { justifyContent: 'center' },
        labeled(h(Switch, { defaultChecked: true }), 'Notifications'),
      ),
    renderDesign: switchDesign,
  },
  'radio-group': {
    Card: () =>
      h(
        RadioGroup,
        { name: 'card-density' },
        labeled(h(Radio, { value: 'comfortable', defaultChecked: true }), 'Comfortable', 'a'),
        labeled(h(Radio, { value: 'compact' }), 'Compact', 'b'),
      ),
    renderDesign: radioDesign,
  },
  select: {
    Card: () =>
      h(
        'div',
        { className: 'w-full max-w-[220px]' },
        h(Select, { defaultValue: 'member', 'aria-label': 'Rôle' }, ...selectOptions()),
      ),
    renderDesign: selectDesign,
  },
  alert: {
    Card: () =>
      h(
        'div',
        { className: 'w-full max-w-[260px]' },
        h(
          Alert,
          {},
          h(AlertTitle, {}, 'Mise à jour disponible'),
          h(AlertDescription, {}, 'La version 1.2 est prête.'),
        ),
      ),
    renderDesign: alertDesign,
  },
  progress: {
    Card: () =>
      h(
        'div',
        { className: 'w-full max-w-[220px]' },
        h(Progress, { value: 60, label: 'Progression' }),
      ),
    renderDesign: progressDesign,
  },
  slider: {
    Card: () =>
      h(
        'div',
        { className: 'w-full max-w-[220px]' },
        h(Slider, { defaultValue: 50, 'aria-label': 'Volume' }),
      ),
    renderDesign: sliderDesign,
  },
  separator: {
    Card: () =>
      h(
        'div',
        { className: 'flex h-6 items-center gap-3 text-muted-foreground text-sm' },
        'Accueil',
        h(Separator, { orientation: 'vertical' }),
        'Docs',
      ),
    renderDesign: separatorDesign,
  },
  skeleton: {
    Card: () =>
      h(
        'div',
        { className: 'flex w-full max-w-[220px] items-center gap-3' },
        h(Skeleton, { className: 'h-10 w-10 rounded-full' }),
        h(
          'div',
          { className: 'flex flex-1 flex-col gap-2' },
          h(Skeleton, { className: 'h-3 w-3/4' }),
          h(Skeleton, { className: 'h-3 w-1/2' }),
        ),
      ),
    renderDesign: skeletonDesign,
  },
  card: {
    Card: () =>
      h(
        Card,
        { className: 'w-full max-w-[220px]' },
        h(CardHeader, {}, h(CardDescription, {}, 'Revenu mensuel')),
        h(CardContent, { className: 'font-semibold text-xl' }, '48 210 €'),
      ),
    renderDesign: cardDesign,
  },
};

export function renderPrimitiveCard(key: string): React.ReactNode {
  return SHOWCASES[key]?.Card() ?? null;
}

export function renderPrimitiveDesign(key: string, designKey: string): React.ReactNode {
  return SHOWCASES[key]?.renderDesign(designKey) ?? null;
}
