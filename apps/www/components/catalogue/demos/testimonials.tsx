'use client';

import { Testimonials } from '@/components/blocks/testimonials';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import { type PreviewProps, headline, pick } from './_shared';

const TESTIMONIALS = {
  en: {
    eyebrow: 'Social proof',
    title: { lead: 'Loved by ', accent: 'product teams', tail: '.' },
    subtitle: 'Designers and engineers ship their marketing and app UI faster with ibirdui blocks.',
    items: [
      {
        quote:
          '“The hero, pricing and FAQ blocks dropped straight into our app — I had a launch page live before lunch, motion and all.”',
        role: 'Design Engineer · Cadence',
        rating: 5,
      },
      {
        quote:
          '“One command and the source is mine. No black-box components, no upgrade dread — I read it, tweak it, ship it.”',
        role: 'Founder · Fathom',
        rating: 5,
      },
      {
        quote:
          '“Accessibility used to eat a whole sprint. With ibirdui the landmarks, focus and reduced-motion are already there.”',
        role: 'Frontend Lead · Northwind',
        rating: 5,
      },
    ],
  },
  fr: {
    eyebrow: 'Preuve sociale',
    title: { lead: 'Adoré par les ', accent: 'équipes produit', tail: '.' },
    subtitle:
      'Designers et devs livrent leur UI marketing et app plus vite avec les blocks ibirdui.',
    items: [
      {
        quote:
          '« Les blocks hero, pricing et FAQ se sont posés direct dans notre app — page de lancement en ligne avant midi, animations comprises. »',
        role: 'Design Engineer · Cadence',
        rating: 5,
      },
      {
        quote:
          '« Une commande et la source est à moi. Pas de composant boîte noire, pas de stress de mise à jour — je lis, j’ajuste, je livre. »',
        role: 'Founder · Fathom',
        rating: 5,
      },
      {
        quote:
          '« L’accessibilité mangeait un sprint entier. Avec ibirdui, landmarks, focus et reduced-motion sont déjà là. »',
        role: 'Frontend Lead · Northwind',
        rating: 5,
      },
    ],
  },
} satisfies Record<Locale, unknown>;

export function TestimonialsReal({ locale }: PreviewProps) {
  const c = pick(locale, TESTIMONIALS);
  const names = ['Mara Voss', 'Diego Herrera', 'Priya Nair'];
  return h(Testimonials, {
    eyebrow: c.eyebrow,
    title: headline(c.title),
    subtitle: c.subtitle,
    columns: 3,
    testimonials: c.items.map((it, i) => ({
      id: String(i),
      quote: it.quote,
      rating: it.rating,
      author: { name: names[i] ?? 'Anon', role: it.role },
    })),
  });
}
