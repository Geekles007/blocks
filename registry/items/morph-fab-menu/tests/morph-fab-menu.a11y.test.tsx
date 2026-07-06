// Resolved via the vitest alias (registry/vitest.config.ts). The primitives it
// composes (`card`, `button`, `separator`) and the `block-motion` lib resolve to
// their real sources fetched into `.primitives/` — exactly what the CLI installs.
import { MorphFabMenu } from '@/components/blocks/morph-fab-menu';
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

describe('MorphFabMenu', () => {
  it('renders the collapsed FAB as a labelled toggle', () => {
    render(<MorphFabMenu />);
    expect(screen.getByRole('button', { name: /open actions/i })).toBeInTheDocument();
  });

  it('expands into a menu of actions and flips the toggle label', () => {
    render(<MorphFabMenu />);
    fireEvent.click(screen.getByRole('button', { name: /open actions/i }));
    expect(screen.getByRole('button', { name: /close actions/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /quick actions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new document/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /invite people/i })).toBeInTheDocument();
  });

  it('has no axe violations collapsed or expanded', async () => {
    const { container } = render(<MorphFabMenu />);
    await expectNoViolations(container);
    fireEvent.click(screen.getByRole('button', { name: /open actions/i }));
    await expectNoViolations(container);
  });
});
