// Resolved via the vitest alias (registry/vitest.config.ts). The `button` styles
// and the `block-motion` lib resolve to their real sources fetched into
// `.primitives/` — exactly what the CLI installs.
import { Cta } from '@/components/blocks/cta';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      region: { enabled: false },
    },
  });
  expect(results.violations).toEqual([]);
}

describe('Cta', () => {
  it('exposes the title as an h2 that labels the section', () => {
    render(<Cta title="Ready to ship faster?" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Ready to ship faster?');
    expect(heading.closest('section')).toHaveAttribute('aria-labelledby', heading.id);
  });

  it('renders an action with an href as a link, without one as a button', () => {
    render(
      <Cta
        title="Ready?"
        primaryAction={{ label: 'Get started', href: '/docs' }}
        secondaryAction={{ label: 'Contact sales' }}
      />,
    );
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/docs');
    expect(screen.getByRole('button', { name: 'Contact sales' })).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <Cta
        eyebrow="Start today"
        title="Ready to ship faster?"
        subtitle="Copy your first block in under a minute — you own the source."
        primaryAction={{ label: 'Get started', href: '/docs' }}
        secondaryAction={{ label: 'Talk to us', href: '/contact' }}
      />,
    );
    await expectNoViolations(container);
  });
});
