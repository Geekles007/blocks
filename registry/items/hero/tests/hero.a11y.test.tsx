// Resolved via the vitest alias (blocks/vitest.config.ts). The primitives it
// composes (`badge`, `button`) and the `block-motion` lib resolve to their real
// sources in the sibling registry workspace — exactly what the CLI installs.
import { Hero } from '@/components/blocks/hero';
import { render, screen } from '@testing-library/react';
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

describe('Hero', () => {
  it('exposes the title as the single top-level heading', () => {
    render(<Hero title="Ship accessible UI, fast" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Ship accessible UI, fast');
  });

  it('renders an action with an href as a link, without one as a button', () => {
    render(
      <Hero
        title="Title"
        primaryAction={{ label: 'Get started', href: '/docs' }}
        secondaryAction={{ label: 'Open dialog' }}
      />,
    );
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/docs');
    expect(screen.getByRole('button', { name: 'Open dialog' })).toBeInTheDocument();
  });

  it('renders the eyebrow and subtitle when provided', () => {
    render(<Hero eyebrow="New · v2.0" title="Title" subtitle="A supporting line." />);
    expect(screen.getByText('New · v2.0')).toBeInTheDocument();
    expect(screen.getByText('A supporting line.')).toBeInTheDocument();
  });

  it('exposes each social-proof person as a labelled avatar', () => {
    render(
      <Hero
        title="Title"
        socialProof={{
          people: [{ name: 'Ada Lovelace' }, { name: 'Tim Iverson' }],
          caption: 'Loved by 2,000+ teams',
        }}
      />,
    );
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Tim Iverson' })).toBeInTheDocument();
    expect(screen.getByText('Loved by 2,000+ teams')).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <Hero
        eyebrow="New"
        title="Ship accessible UI, fast"
        subtitle="Designed, animated blocks built on ibirdui primitives."
        primaryAction={{ label: 'Get started', href: '/docs', icon: <span>→</span> }}
        secondaryAction={{ label: 'View on GitHub', href: 'https://github.com' }}
        socialProof={{
          people: [{ name: 'Ada Lovelace' }, { name: 'Tim Iverson' }],
          caption: 'Loved by 2,000+ product teams',
        }}
      />,
    );
    await expectNoViolations(container);
  });
});
