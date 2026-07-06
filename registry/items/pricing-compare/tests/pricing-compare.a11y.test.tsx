import {
  PricingCompare,
  type PricingComparePlan,
  type PricingCompareRow,
} from '@/components/blocks/pricing-compare';
import { render, screen, within } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  expect(results.violations).toEqual([]);
}

const PLANS: PricingComparePlan[] = [
  { name: 'Starter', price: '$0', period: '/ mo', action: { label: 'Get started', href: '/s' } },
  {
    name: 'Pro',
    price: '$29',
    period: '/ mo',
    featured: true,
    action: { label: 'Choose Pro' },
  },
];

const ROWS: PricingCompareRow[] = [
  { label: 'Projects', values: ['3', 'Unlimited'] },
  { label: 'Priority support', values: [false, true] },
];

describe('PricingCompare', () => {
  it('exposes the section title as an h2', () => {
    render(<PricingCompare title="Compare plans" plans={PLANS} rows={ROWS} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Compare plans' })).toBeInTheDocument();
  });

  it('renders a real table with column and row headers', () => {
    render(<PricingCompare title="Compare" plans={PLANS} rows={ROWS} />);
    const table = screen.getByRole('table');
    expect(within(table).getByRole('columnheader', { name: /Pro/ })).toBeInTheDocument();
    expect(within(table).getByRole('rowheader', { name: 'Projects' })).toBeInTheDocument();
  });

  it('labels boolean cells for assistive tech', () => {
    render(<PricingCompare title="Compare" plans={PLANS} rows={ROWS} />);
    expect(screen.getByText('Included')).toBeInTheDocument();
    expect(screen.getByText('Not included')).toBeInTheDocument();
  });

  it('renders an action with an href as a link and one without as a button', () => {
    render(<PricingCompare title="Compare" plans={PLANS} rows={ROWS} />);
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/s');
    expect(screen.getByRole('button', { name: 'Choose Pro' })).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <PricingCompare
        title="Compare plans"
        subtitle="Everything, line by line."
        plans={PLANS}
        rows={ROWS}
      />,
    );
    await expectNoViolations(container);
  });
});
