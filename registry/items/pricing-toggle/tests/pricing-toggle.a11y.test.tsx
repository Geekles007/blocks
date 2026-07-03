import { PricingToggle, type PricingTogglePlan } from '@/components/blocks/pricing-toggle';
import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  expect(results.violations).toEqual([]);
}

const PLANS: PricingTogglePlan[] = [
  {
    name: 'Pro',
    monthlyPrice: '29 €',
    annualPrice: '24 €',
    featured: true,
    features: ['Projets illimités', 'Support prioritaire'],
    action: { label: 'Choisir Pro', href: '/signup' },
  },
  {
    name: 'Team',
    monthlyPrice: '59 €',
    annualPrice: '49 €',
    features: ['SSO', 'Rôles avancés'],
    action: { label: 'Choisir Team' },
  },
];

describe('PricingToggle', () => {
  it('exposes the section title as an h2 and the billing switch as a labelled switch', () => {
    render(<PricingToggle title="Nos offres" plans={PLANS} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Nos offres' })).toBeInTheDocument();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('swaps every price from monthly to annual when the switch is toggled', () => {
    render(<PricingToggle title="Nos offres" plans={PLANS} />);
    expect(screen.getByText('29 €')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('24 €')).toBeInTheDocument();
  });

  it('renders an action with an href as a link and one without as a button', () => {
    render(<PricingToggle title="Nos offres" plans={PLANS} />);
    expect(screen.getByRole('link', { name: 'Choisir Pro' })).toHaveAttribute('href', '/signup');
    expect(screen.getByRole('button', { name: 'Choisir Team' })).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <PricingToggle
        title="Nos offres"
        subtitle="Payez au mois ou à l'année."
        annualHint="−20 %"
        plans={PLANS}
      />,
    );
    await expectNoViolations(container);
  });
});
