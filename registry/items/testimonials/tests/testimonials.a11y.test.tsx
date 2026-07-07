// Resolved via the vitest alias (registry/vitest.config.ts). The primitives it
// composes (`card`, `avatar`, `badge`) and the `block-motion` lib resolve to
// their real sources fetched into `.primitives/` — exactly what the CLI installs.
import { Testimonials } from '@/components/blocks/testimonials';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

const ITEMS = [
  {
    id: 'ada',
    quote: 'Shipped our marketing site in a weekend.',
    rating: 5,
    author: { name: 'Ada Reyes', role: 'Head of Design, Northwind' },
  },
  {
    id: 'tom',
    quote: 'The accessibility is done for us out of the box.',
    author: { name: 'Tom Iverson', role: 'Staff Engineer' },
  },
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

describe('Testimonials', () => {
  it('exposes the title as an h2 that labels the section', () => {
    render(<Testimonials title="Loved by product teams" testimonials={ITEMS} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Loved by product teams');
    expect(heading.closest('section')).toHaveAttribute('aria-labelledby', heading.id);
  });

  it('renders each quote with its labelled author avatar', () => {
    render(<Testimonials title="Reviews" testimonials={ITEMS} />);
    expect(screen.getByText('Shipped our marketing site in a weekend.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Ada Reyes' })).toBeInTheDocument();
    expect(screen.getByText('Head of Design, Northwind')).toBeInTheDocument();
  });

  it('exposes a rating as a visually-hidden label, not colour alone', () => {
    render(<Testimonials title="Reviews" testimonials={ITEMS} />);
    expect(screen.getByText('Rated 5 out of 5')).toBeInTheDocument();
  });

  it('has no axe violations in its fullest form', async () => {
    const { container } = render(
      <Testimonials
        eyebrow="Social proof"
        title="Loved by product teams"
        subtitle="Teams of every size ship faster with ibirdui blocks."
        testimonials={ITEMS}
      />,
    );
    await expectNoViolations(container);
  });
});
