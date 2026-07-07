// Resolved via the vitest alias (registry/vitest.config.ts). The `button` styles
// and the `block-motion` lib resolve to their real sources fetched into
// `.primitives/` — exactly what the CLI installs.
import { Navbar } from '@/components/blocks/navbar';
import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

const LINKS = [
  { id: 'catalogue', label: 'Catalogue', href: '/catalogue' },
  { id: 'guide', label: 'Guide', href: '/guide' },
];

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      region: { enabled: false },
    },
  });
  expect(results.violations).toEqual([]);
}

describe('Navbar', () => {
  it('renders a banner with a labelled primary nav and a linked brand', () => {
    render(<Navbar brand={<span>ibirdui</span>} brandHref="/" links={LINKS} />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Catalogue' })).toHaveAttribute('href', '/catalogue');
  });

  it('toggles the mobile disclosure and reveals the links', () => {
    render(<Navbar brand={<span>ibirdui</span>} links={LINKS} />);
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('navigation', { name: 'Main (mobile)' })).toBeInTheDocument();
  });

  it('renders an action with an href as a link, without one as a button', () => {
    render(
      <Navbar
        brand={<span>ibirdui</span>}
        links={LINKS}
        primaryAction={{ label: 'Get started', href: '/docs' }}
        secondaryAction={{ label: 'Sign in' }}
      />,
    );
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/docs');
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <Navbar
        brand={<span>ibirdui blocks</span>}
        brandHref="/"
        links={LINKS}
        primaryAction={{ label: 'Get started', href: '/docs' }}
        secondaryAction={{ label: 'GitHub', href: 'https://github.com' }}
      />,
    );
    await expectNoViolations(container);
  });
});
