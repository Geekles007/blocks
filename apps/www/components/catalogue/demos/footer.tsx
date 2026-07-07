'use client';

import { Footer } from '@/components/blocks/footer';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import { BlocksLockup } from '../../logo';
import { type PreviewProps, pick } from './_shared';

const socialSvg = (d: string) =>
  h(
    'svg',
    { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true },
    h('path', { d }),
  );
const GithubIcon = socialSvg(
  'M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.71 1.03 1.62 1.03 2.74 0 3.92-2.34 4.79-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.48A10.2 10.2 0 0 0 22 12.2C22 6.58 17.52 2 12 2z',
);
const XIcon = socialSvg(
  'M18.9 2H22l-7.5 8.57L23 22h-6.8l-5.32-6.96L4.8 22H1.66l8.03-9.17L1 2h6.98l4.8 6.36L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z',
);

const FOOTER = {
  en: {
    description:
      'Blocks you own, built on the ibirdui primitives. Copy one command, keep the code.',
    columns: [
      {
        title: 'Product',
        links: ['Catalogue', 'Morphing', 'Templates', 'Changelog'],
      },
      { title: 'Resources', links: ['Guide', 'Themes', 'block-motion'] },
      { title: 'Company', links: ['About', 'Blog', 'Careers'] },
    ],
    copyright: '© 2025 ibirdui — MIT licensed',
    legal: ['Privacy', 'Terms'],
  },
  fr: {
    description:
      'Des blocks que tu possèdes, sur les primitives ibirdui. Une commande, garde le code.',
    columns: [
      { title: 'Produit', links: ['Catalogue', 'Morphing', 'Templates', 'Changelog'] },
      { title: 'Ressources', links: ['Guide', 'Thèmes', 'block-motion'] },
      { title: 'Société', links: ['À propos', 'Blog', 'Carrières'] },
    ],
    copyright: '© 2025 ibirdui — licence MIT',
    legal: ['Confidentialité', 'Conditions'],
  },
} satisfies Record<Locale, unknown>;

export function FooterReal({ t, locale }: PreviewProps) {
  const c = pick(locale, FOOTER);
  return h(Footer, {
    brand: h(BlocksLockup, { t, size: 24 }),
    description: c.description,
    columns: c.columns.map((col, i) => ({
      id: String(i),
      title: col.title,
      links: col.links.map((label) => ({ label, href: `#${label}` })),
    })),
    social: [
      { label: 'GitHub', href: '#github', icon: GithubIcon },
      { label: 'X', href: '#x', icon: XIcon },
    ],
    copyright: c.copyright,
    legal: c.legal.map((label) => ({ label, href: `#${label}` })),
  });
}
