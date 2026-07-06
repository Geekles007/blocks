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
    render(<HeroFintech title="The bank that plays it straight" />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('The bank that plays it straight');
  });

  it('renders an action with an href as a link', () => {
    render(
      <HeroFintech title="Title" primaryAction={{ label: 'Open an account', href: '/signup' }} />,
    );
    expect(screen.getByRole('link', { name: 'Open an account' })).toHaveAttribute(
      'href',
      '/signup',
    );
  });

  it('renders an action without an href as a button', () => {
    render(<HeroFintech title="Title" secondaryAction={{ label: 'See pricing' }} />);
    expect(screen.getByRole('button', { name: 'See pricing' })).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <HeroFintech
        eyebrow="FDIC insured"
        title="The bank that plays it straight"
        subtitle="Zero hidden fees, insured deposits, end-to-end encryption."
        primaryAction={{ label: 'Open an account', href: '/signup' }}
        secondaryAction={{ label: 'See pricing', href: '/pricing' }}
        assurance="Deposits insured up to $100,000"
      />,
    );
    await expectNoViolations(container);
  });
});
