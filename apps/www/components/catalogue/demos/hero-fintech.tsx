'use client';

import { HeroFintech } from '@/components/blocks/hero-fintech';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import { type PreviewProps, headline, pick } from './_shared';

const HERO_FINTECH = {
  en: {
    eyebrow: 'FDIC insured',
    title: { lead: 'The bank that plays it ', accent: 'straight', tail: '.' },
    subtitle:
      'Zero hidden fees, insured deposits, end-to-end encryption. Open an account in five minutes.',
    primary: 'Open an account',
    secondary: 'See pricing',
    assurance: 'Deposits insured up to $100,000',
    cardHolder: 'Checking account',
    balance: { value: '$12,480.50', label: 'Available balance' },
    metrics: [
      { value: '$0', label: 'Hidden fees' },
      { value: '$100k', label: 'Deposits insured' },
      { value: 'AES-256', label: 'Encryption' },
    ],
  },
  fr: {
    eyebrow: 'Agréé ACPR',
    title: { lead: 'La banque qui joue ', accent: 'franc jeu', tail: '.' },
    subtitle:
      'Zéro frais caché, dépôts garantis, chiffrement de bout en bout. Ouvrez un compte en cinq minutes.',
    primary: 'Ouvrir un compte',
    secondary: 'Voir les tarifs',
    assurance: 'Dépôts garantis jusqu’à 100 000 €',
    cardHolder: 'Compte courant',
    balance: { value: '12 480,50 €', label: 'Solde disponible' },
    metrics: [
      { value: '0 €', label: 'Frais cachés' },
      { value: '100 k€', label: 'Dépôts garantis' },
      { value: 'AES-256', label: 'Chiffrement' },
    ],
  },
} satisfies Record<Locale, unknown>;

export function HeroFintechReal({ locale }: PreviewProps) {
  const c = pick(locale, HERO_FINTECH);
  return h(HeroFintech, {
    eyebrow: c.eyebrow,
    title: headline(c.title),
    subtitle: c.subtitle,
    primaryAction: { label: c.primary, href: '#' },
    secondaryAction: { label: c.secondary, href: '#' },
    assurance: c.assurance,
    cardHolder: c.cardHolder,
    cardNumber: '•••• •••• •••• 4021',
    balance: c.balance,
    metrics: c.metrics,
  });
}
