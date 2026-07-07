// Resolved via the vitest alias (registry/vitest.config.ts). The primitives it
// composes (`card`, `badge`) and the `block-motion` lib resolve to their real
// sources fetched into `.primitives/` — exactly what the CLI installs.
import { Features } from '@/components/blocks/features';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

const FEATURES = [
  { id: 'fast', title: 'Fast by default', description: 'No runtime, no lock-in.' },
  { id: 'themable', title: 'Themable', description: 'Reads your semantic tokens.' },
  { id: 'a11y', title: 'Accessible', description: 'AA-tested out of the box.' },
];

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      // jsdom has no layout engine; colour-contrast can't be evaluated here.
      'color-contrast': { enabled: false },
      // A block is rendered in isolation, not as a full page with landmarks.
      region: { enabled: false },
    },
  });
  expect(results.violations).toEqual([]);
}

describe('Features', () => {
  it('exposes the title as an h2 that labels the section', () => {
    render(<Features title="Everything you need to ship" features={FEATURES} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Everything you need to ship');
    const section = heading.closest('section');
    expect(section).toHaveAttribute('aria-labelledby', heading.id);
  });

  it('renders each feature as an h3 with its description', () => {
    render(<Features title="Features" features={FEATURES} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Fast by default' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Accessible' })).toBeInTheDocument();
    expect(screen.getByText('No runtime, no lock-in.')).toBeInTheDocument();
  });

  it('renders the eyebrow and subtitle when provided', () => {
    render(
      <Features
        eyebrow="Why teams switch"
        title="Features"
        subtitle="Composed on ibirdui primitives."
        features={FEATURES}
      />,
    );
    expect(screen.getByText('Why teams switch')).toBeInTheDocument();
    expect(screen.getByText('Composed on ibirdui primitives.')).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <Features
        eyebrow="Why teams switch"
        title="Everything you need to ship"
        subtitle="Composed on the ibirdui primitives — accessible and themable by default."
        columns={3}
        features={FEATURES.map((f) => ({ ...f, icon: <span aria-hidden="true">★</span> }))}
      />,
    );
    await expectNoViolations(container);
  });
});
