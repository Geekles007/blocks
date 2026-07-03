import { Pricing, type PricingPlan } from '@/components/blocks/pricing';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  expect(results.violations).toEqual([]);
}

const PLANS: PricingPlan[] = [
  {
    name: 'Starter',
    price: '0 €',
    period: '/ mois',
    description: 'Pour démarrer',
    features: ['1 projet', '2 membres'],
    action: { label: 'Commencer', href: '/signup' },
  },
  {
    name: 'Pro',
    price: '29 €',
    period: '/ mois',
    featured: true,
    features: ['Projets illimités', 'Support prioritaire'],
    action: { label: 'Choisir Pro', href: '/signup' },
  },
  {
    name: 'Entreprise',
    price: 'Sur devis',
    features: ['SSO', 'SLA'],
    action: { label: 'Nous contacter' },
  },
];

describe('Pricing', () => {
  it('exposes the section title as an h2 and each plan name as an h3', () => {
    render(<Pricing title="Nos offres" plans={PLANS} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Nos offres' })).toBeInTheDocument();
    const h3s = screen.getAllByRole('heading', { level: 3 });
    expect(h3s.map((h) => h.textContent)).toEqual(['Starter', 'Pro', 'Entreprise']);
  });

  it('renders an action with an href as a link and one without as a button', () => {
    render(<Pricing title="Nos offres" plans={PLANS} />);
    expect(screen.getByRole('link', { name: 'Choisir Pro' })).toHaveAttribute('href', '/signup');
    expect(screen.getByRole('button', { name: 'Nous contacter' })).toBeInTheDocument();
  });

  it('renders each plan features inside a list', () => {
    render(<Pricing title="Nos offres" plans={PLANS} />);
    expect(screen.getAllByRole('list')).toHaveLength(PLANS.length);
    expect(screen.getByText('Projets illimités')).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <Pricing eyebrow="Tarifs" title="Nos offres" subtitle="Simple et clair." plans={PLANS} />,
    );
    await expectNoViolations(container);
  });
});
