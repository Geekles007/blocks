// Resolved via the vitest alias (registry/vitest.config.ts). The primitives it
// composes (`card`, `button`, `badge`, `separator`) and the `block-motion` lib
// resolve to their real sources fetched into `.primitives/` — exactly what the
// CLI installs.
import { MorphProductDetail } from '@/components/blocks/morph-product-detail';
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

describe('MorphProductDetail', () => {
  it('renders the collapsed preview as a labelled button', () => {
    render(<MorphProductDetail />);
    expect(
      screen.getByRole('button', { name: /view trailblazer runner details/i }),
    ).toBeInTheDocument();
  });

  it('expands into a detail page with a labelled close control and Add-to-cart', () => {
    render(<MorphProductDetail />);
    fireEvent.click(screen.getByRole('button', { name: /view trailblazer runner details/i }));
    expect(screen.getByRole('button', { name: /close product details/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^add to cart$/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /size/i })).toBeInTheDocument();
  });

  it('has no axe violations collapsed or expanded', async () => {
    const { container } = render(<MorphProductDetail />);
    await expectNoViolations(container);
    fireEvent.click(screen.getByRole('button', { name: /view trailblazer runner details/i }));
    await expectNoViolations(container);
  });
});
