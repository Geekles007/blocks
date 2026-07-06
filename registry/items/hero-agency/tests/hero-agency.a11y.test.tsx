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
    render(<HeroAgency title="We give a voice to brands that dare" />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('We give a voice to brands that dare');
  });

  it('renders an action with an href as a link', () => {
    render(<HeroAgency title="Title" primaryAction={{ label: 'View work', href: '/work' }} />);
    expect(screen.getByRole('link', { name: 'View work' })).toHaveAttribute('href', '/work');
  });

  it('renders an action without an href as a button', () => {
    render(<HeroAgency title="Title" primaryAction={{ label: 'Contact us' }} />);
    expect(screen.getByRole('button', { name: 'Contact us' })).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <HeroAgency
        eyebrow="Creative studio — Est. 2016"
        title="We give a voice to brands that dare"
        subtitle="Identity, digital products and motion for ambitious teams."
        primaryAction={{ label: 'View work', href: '/work' }}
      />,
    );
    await expectNoViolations(container);
  });
});
