import { PricingSingle } from '@/components/blocks/pricing-single';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  expect(results.violations).toEqual([]);
}

const BASE = {
  title: 'Un seul prix',
  planName: 'Licence à vie',
  price: '199 €',
  features: ['Mises à jour à vie', 'Support par e-mail', 'Licence commerciale'],
} as const;

describe('PricingSingle', () => {
  it('exposes the section title as an h2 and the plan name as an h3', () => {
    render(<PricingSingle {...BASE} primaryAction={{ label: 'Acheter', href: '/checkout' }} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Un seul prix' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Licence à vie' })).toBeInTheDocument();
  });

  it('renders the CTA with an href as a link', () => {
    render(<PricingSingle {...BASE} primaryAction={{ label: 'Acheter', href: '/checkout' }} />);
    expect(screen.getByRole('link', { name: 'Acheter' })).toHaveAttribute('href', '/checkout');
  });

  it('renders the CTA without an href as a button', () => {
    render(<PricingSingle {...BASE} primaryAction={{ label: 'Acheter' }} />);
    expect(screen.getByRole('button', { name: 'Acheter' })).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <PricingSingle
        eyebrow="Offre de lancement"
        {...BASE}
        subtitle="Tout compris, pour toujours."
        period="paiement unique"
        primaryAction={{ label: 'Acheter', href: '/checkout' }}
        note="Garantie 30 jours"
      />,
    );
    await expectNoViolations(container);
  });
});
