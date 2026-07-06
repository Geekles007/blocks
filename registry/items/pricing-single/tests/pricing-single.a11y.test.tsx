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
  title: 'One price',
  planName: 'Lifetime license',
  price: '$199',
  features: ['Lifetime updates', 'Email support', 'Commercial license'],
} as const;

describe('PricingSingle', () => {
  it('exposes the section title as an h2 and the plan name as an h3', () => {
    render(<PricingSingle {...BASE} primaryAction={{ label: 'Buy now', href: '/checkout' }} />);
    expect(screen.getByRole('heading', { level: 2, name: 'One price' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Lifetime license' })).toBeInTheDocument();
  });

  it('renders the CTA with an href as a link', () => {
    render(<PricingSingle {...BASE} primaryAction={{ label: 'Buy now', href: '/checkout' }} />);
    expect(screen.getByRole('link', { name: 'Buy now' })).toHaveAttribute('href', '/checkout');
  });

  it('renders the CTA without an href as a button', () => {
    render(<PricingSingle {...BASE} primaryAction={{ label: 'Buy now' }} />);
    expect(screen.getByRole('button', { name: 'Buy now' })).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <PricingSingle
        eyebrow="Launch offer"
        {...BASE}
        subtitle="Everything included, forever."
        period="one-time payment"
        primaryAction={{ label: 'Buy now', href: '/checkout' }}
        note="30-day guarantee"
      />,
    );
    await expectNoViolations(container);
  });
});
