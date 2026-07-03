import { HeroTerminal } from '@/components/blocks/hero-terminal';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  expect(results.violations).toEqual([]);
}

describe('HeroTerminal', () => {
  it('exposes the title as the single top-level heading', () => {
    render(<HeroTerminal title="Your components, one command away" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Your components, one command away',
    );
  });

  it('renders an action with an href as a link', () => {
    render(
      <HeroTerminal title="Title" primaryAction={{ label: 'Read the docs', href: '/docs' }} />,
    );
    expect(screen.getByRole('link', { name: 'Read the docs' })).toHaveAttribute('href', '/docs');
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <HeroTerminal
        eyebrow="CLI · v1"
        title="Your components, one command away"
        subtitle="Copy-paste blocks you own."
        primaryAction={{ label: 'Read the docs', href: '/docs' }}
        secondaryAction={{ label: 'GitHub', href: '#' }}
      />,
    );
    await expectNoViolations(container);
  });
});
