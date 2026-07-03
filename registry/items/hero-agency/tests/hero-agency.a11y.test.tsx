import { HeroAgency } from '@/components/blocks/hero-agency';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  expect(results.violations).toEqual([]);
}

describe('HeroAgency', () => {
  it('exposes the title as the single top-level heading', () => {
    render(<HeroAgency title="On donne une voix aux marques qui osent" />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('On donne une voix aux marques qui osent');
  });

  it('renders an action with an href as a link', () => {
    render(
      <HeroAgency title="Titre" primaryAction={{ label: 'Voir les projets', href: '/work' }} />,
    );
    expect(screen.getByRole('link', { name: 'Voir les projets' })).toHaveAttribute('href', '/work');
  });

  it('renders an action without an href as a button', () => {
    render(<HeroAgency title="Titre" primaryAction={{ label: 'Nous écrire' }} />);
    expect(screen.getByRole('button', { name: 'Nous écrire' })).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <HeroAgency
        eyebrow="Studio créatif — Est. 2016"
        title="On donne une voix aux marques qui osent"
        subtitle="Identité, produits numériques et motion pour les équipes ambitieuses."
        primaryAction={{ label: 'Voir les projets', href: '/work' }}
      />,
    );
    await expectNoViolations(container);
  });
});
