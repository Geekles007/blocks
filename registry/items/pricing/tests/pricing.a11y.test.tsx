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
    price: '$0',
    period: '/ mo',
    description: 'To get started',
    features: ['1 project', '2 members'],
    action: { label: 'Get started', href: '/signup' },
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/ mo',
    featured: true,
    features: ['Unlimited projects', 'Priority support'],
    action: { label: 'Choose Pro', href: '/signup' },
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['SSO', 'SLA'],
    action: { label: 'Contact us' },
  },
];

describe('Pricing', () => {
  it('exposes the section title as an h2 and each plan name as an h3', () => {
    render(<Pricing title="Our plans" plans={PLANS} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Our plans' })).toBeInTheDocument();
    const h3s = screen.getAllByRole('heading', { level: 3 });
    expect(h3s.map((h) => h.textContent)).toEqual(['Starter', 'Pro', 'Enterprise']);
  });

  it('renders an action with an href as a link and one without as a button', () => {
    render(<Pricing title="Our plans" plans={PLANS} />);
    expect(screen.getByRole('link', { name: 'Choose Pro' })).toHaveAttribute('href', '/signup');
    expect(screen.getByRole('button', { name: 'Contact us' })).toBeInTheDocument();
  });

  it('renders each plan features inside a list', () => {
    render(<Pricing title="Our plans" plans={PLANS} />);
    expect(screen.getAllByRole('list')).toHaveLength(PLANS.length);
    expect(screen.getByText('Unlimited projects')).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <Pricing eyebrow="Pricing" title="Our plans" subtitle="Simple and clear." plans={PLANS} />,
    );
    await expectNoViolations(container);
  });
});
