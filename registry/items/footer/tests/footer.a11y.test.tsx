// Resolved via the vitest alias (registry/vitest.config.ts). The `separator`
// primitive resolves to its real source fetched into `.primitives/` — exactly
// what the CLI installs.
import { Footer } from '@/components/blocks/footer';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

const COLUMNS = [
  { id: 'product', title: 'Product', links: [{ label: 'Catalogue', href: '/catalogue' }] },
  { id: 'company', title: 'Company', links: [{ label: 'About', href: '/about' }] },
];

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      // The footer *is* the contentinfo landmark, so keep region checks off.
      region: { enabled: false },
    },
  });
  expect(results.violations).toEqual([]);
}

describe('Footer', () => {
  it('renders a contentinfo landmark with the brand and columns', () => {
    render(<Footer brand={<span>ibirdui</span>} columns={COLUMNS} />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Product' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Catalogue' })).toHaveAttribute('href', '/catalogue');
  });

  it('gives icon-only social links an accessible name', () => {
    render(
      <Footer
        brand={<span>ibirdui</span>}
        columns={COLUMNS}
        social={[{ label: 'GitHub', href: 'https://github.com', icon: <span>★</span> }]}
      />,
    );
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com',
    );
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <Footer
        brand={<span>ibirdui blocks</span>}
        description="Blocks you own, built on ibirdui."
        columns={COLUMNS}
        social={[{ label: 'GitHub', href: 'https://github.com', icon: <span>★</span> }]}
        copyright="© 2025 ibirdui"
        legal={[{ label: 'Privacy', href: '/privacy' }]}
      />,
    );
    await expectNoViolations(container);
  });
});
