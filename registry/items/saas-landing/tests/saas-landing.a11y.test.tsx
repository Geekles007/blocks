// Resolved via the vitest alias (registry/vitest.config.ts). Every block it
// composes (navbar, hero, features, testimonials, pricing-toggle, faq, cta,
// footer) and their primitives resolve to their real sources — exactly what the
// CLI installs when you `add` this template.
import { SaasLanding } from '@/components/blocks/saas-landing';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      // jsdom has no layout engine; colour-contrast can't be evaluated here.
      'color-contrast': { enabled: false },
    },
  });
  expect(results.violations).toEqual([]);
}

describe('SaasLanding', () => {
  it('has exactly one h1 (the hero) leading the outline', () => {
    render(<SaasLanding />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
  });

  it('brackets the page with banner and contentinfo landmarks around a main', () => {
    render(<SaasLanding />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('composes the key sections (features, testimonials, pricing, faq, cta)', () => {
    render(<SaasLanding />);
    expect(
      screen.getByRole('heading', { name: /everything you need to ship/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /loved by product teams/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /frequently asked questions/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ready to ship faster/i })).toBeInTheDocument();
  });

  it('has no axe violations for the full page', async () => {
    const { container } = render(<SaasLanding />);
    await expectNoViolations(container);
  });
});
