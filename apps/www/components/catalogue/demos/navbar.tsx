'use client';

import { Navbar } from '@/components/blocks/navbar';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import { BlocksLockup } from '../../logo';
import { type PreviewProps, pick } from './_shared';

const NAVBAR = {
  en: {
    links: ['Catalogue', 'Morphing', 'Templates', 'Guide'],
    signIn: 'Sign in',
    cta: 'Get started',
  },
  fr: {
    links: ['Catalogue', 'Morphing', 'Templates', 'Guide'],
    signIn: 'Connexion',
    cta: 'Commencer',
  },
} satisfies Record<Locale, unknown>;

export function NavbarReal({ t, locale }: PreviewProps) {
  const c = pick(locale, NAVBAR);
  return h(Navbar, {
    brand: h(BlocksLockup, { t, size: 26 }),
    brandHref: '#',
    sticky: false,
    links: c.links.map((label, i) => ({ id: String(i), label, href: `#${label}` })),
    secondaryAction: { label: c.signIn, href: '#signin' },
    primaryAction: { label: c.cta, href: '#start' },
  });
}
