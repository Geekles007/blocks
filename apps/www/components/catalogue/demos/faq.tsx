'use client';

import { Faq } from '@/components/blocks/faq';
import { h } from '~/lib/h';
import type { Locale } from '~/lib/i18n';
import { type PreviewProps, pick } from './_shared';

const FAQ = {
  en: {
    eyebrow: 'Support',
    title: 'Frequently asked questions',
    subtitle: 'Everything you might want to know before you copy your first block.',
    items: [
      {
        question: 'Do I own the code?',
        answer:
          'Yes. One command copies the block and every primitive it composes into your repo — you keep and edit the source, with no runtime dependency.',
      },
      {
        question: 'Is it accessible out of the box?',
        answer:
          'Every block is AA-tested: real landmarks and headings, keyboard support, and prefers-reduced-motion respected.',
      },
      {
        question: 'Can I use my own theme?',
        answer:
          'Blocks read semantic HSL tokens, so they wear your brand in light or dark by changing a few CSS variables — no block edits needed.',
      },
      {
        question: 'How do updates work?',
        answer:
          'Blocks are versioned individually in the registry; re-run the add command to pull a newer version whenever you want.',
      },
    ],
  },
  fr: {
    eyebrow: 'Support',
    title: 'Questions fréquentes',
    subtitle: 'Tout ce que tu peux vouloir savoir avant de copier ton premier block.',
    items: [
      {
        question: 'Est-ce que je possède le code ?',
        answer:
          'Oui. Une commande copie le block et chaque primitive qu’il compose dans ton repo — tu gardes et édites la source, sans dépendance runtime.',
      },
      {
        question: 'Est-ce accessible d’emblée ?',
        answer:
          'Chaque block est testé AA : landmarks et titres réels, support clavier, et prefers-reduced-motion respecté.',
      },
      {
        question: 'Puis-je utiliser mon propre thème ?',
        answer:
          'Les blocks lisent des tokens HSL sémantiques : ils s’habillent de ta charte en clair ou sombre en changeant quelques variables CSS, sans toucher au block.',
      },
      {
        question: 'Comment marchent les mises à jour ?',
        answer:
          'Les blocks sont versionnés individuellement dans le registre ; relance la commande add pour récupérer une version plus récente.',
      },
    ],
  },
} satisfies Record<Locale, unknown>;

export function FaqReal({ locale }: PreviewProps) {
  const c = pick(locale, FAQ);
  return h(Faq, {
    eyebrow: c.eyebrow,
    title: c.title,
    subtitle: c.subtitle,
    items: c.items.map((it, i) => ({ id: String(i), question: it.question, answer: it.answer })),
  });
}
