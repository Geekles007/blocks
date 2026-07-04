// Resolved via the vitest alias (registry/vitest.config.ts). The primitives it
// composes (`button`, `input`, `data-list`, `separator`, `badge`) and the
// `async-state`/`block-motion` libs resolve to their real sources fetched into
// `.primitives/` — exactly what the CLI installs.
import { MorphSearchPanel } from '@/components/blocks/morph-search-panel';
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

describe('MorphSearchPanel', () => {
  it('renders the collapsed trigger as a labelled icon button', () => {
    render(<MorphSearchPanel />);
    expect(screen.getByRole('button', { name: /open search/i })).toBeInTheDocument();
  });

  it('expands into a command menu with a labelled search field', () => {
    render(<MorphSearchPanel />);
    fireEvent.click(screen.getByRole('button', { name: /open search/i }));
    expect(screen.getByRole('textbox', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByText('Design system revamp')).toBeInTheDocument();
  });

  it('has no axe violations collapsed or expanded', async () => {
    const { container } = render(<MorphSearchPanel />);
    await expectNoViolations(container);
    fireEvent.click(screen.getByRole('button', { name: /open search/i }));
    await expectNoViolations(container);
  });
});
