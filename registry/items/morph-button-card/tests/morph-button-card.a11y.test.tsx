// Resolved via the vitest alias (registry/vitest.config.ts). The primitives it
// composes (`button`, `card`) and the `block-motion` lib resolve to their real
// sources fetched into `.primitives/` — exactly what the CLI installs.
import { MorphButtonCard } from '@/components/blocks/morph-button-card';
import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

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

describe('MorphButtonCard', () => {
  it('renders the collapsed trigger as a labelled button', () => {
    render(<MorphButtonCard />);
    expect(screen.getByRole('button', { name: /upgrade plan/i })).toBeInTheDocument();
  });

  it('expands into the plan card and exposes a labelled close control', () => {
    render(<MorphButtonCard />);
    fireEvent.click(screen.getByRole('button', { name: /upgrade plan/i }));
    expect(screen.getByText('Pro plan')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close plan card/i })).toBeInTheDocument();
  });

  it('has no axe violations collapsed or expanded', async () => {
    const { container } = render(<MorphButtonCard />);
    await expectNoViolations(container);
    fireEvent.click(screen.getByRole('button', { name: /upgrade plan/i }));
    await expectNoViolations(container);
  });
});
