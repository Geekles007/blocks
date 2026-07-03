import { HeroFintech } from '@/components/blocks/hero-fintech';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  expect(results.violations).toEqual([]);
}

describe('HeroFintech', () => {
  it('exposes the title as the single top-level heading', () => {
    render(<HeroFintech title="La banque qui joue franc jeu" />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('La banque qui joue franc jeu');
  });

  it('renders an action with an href as a link', () => {
    render(
      <HeroFintech title="Titre" primaryAction={{ label: 'Ouvrir un compte', href: '/signup' }} />,
    );
    expect(screen.getByRole('link', { name: 'Ouvrir un compte' })).toHaveAttribute(
      'href',
      '/signup',
    );
  });

  it('renders an action without an href as a button', () => {
    render(<HeroFintech title="Titre" secondaryAction={{ label: 'Voir les tarifs' }} />);
    expect(screen.getByRole('button', { name: 'Voir les tarifs' })).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <HeroFintech
        eyebrow="Agréé ACPR"
        title="La banque qui joue franc jeu"
        subtitle="Zéro frais caché, dépôts garantis, chiffrement de bout en bout."
        primaryAction={{ label: 'Ouvrir un compte', href: '/signup' }}
        secondaryAction={{ label: 'Voir les tarifs', href: '/pricing' }}
        assurance="Dépôts garantis jusqu'à 100 000 €"
      />,
    );
    await expectNoViolations(container);
  });
});
