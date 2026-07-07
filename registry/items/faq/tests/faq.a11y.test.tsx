// Resolved via the vitest alias (registry/vitest.config.ts). The primitives it
// composes (`badge`, `separator`) and the `block-motion` lib resolve to their
// real sources fetched into `.primitives/` — exactly what the CLI installs.
import { Faq } from '@/components/blocks/faq';
import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

const ITEMS = [
  {
    id: 'own',
    question: 'Do I own the code?',
    answer: 'Yes — you copy the source into your repo.',
  },
  { id: 'runtime', question: 'Is there a runtime?', answer: 'No runtime and no lock-in.' },
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

describe('Faq', () => {
  it('exposes the title as an h2 that labels the section', () => {
    render(<Faq title="Frequently asked questions" items={ITEMS} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Frequently asked questions');
    expect(heading.closest('section')).toHaveAttribute('aria-labelledby', heading.id);
  });

  it('renders each question collapsed as a button, and reveals its answer on click', () => {
    render(<Faq title="FAQ" items={ITEMS} />);
    const q = screen.getByRole('button', { name: 'Do I own the code?' });
    expect(q).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(q);
    expect(q).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Yes — you copy the source into your repo.')).toBeInTheDocument();
  });

  it('keeps a single answer open by default', () => {
    render(<Faq title="FAQ" items={ITEMS} />);
    fireEvent.click(screen.getByRole('button', { name: 'Do I own the code?' }));
    fireEvent.click(screen.getByRole('button', { name: 'Is there a runtime?' }));
    expect(screen.getByRole('button', { name: 'Do I own the code?' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Is there a runtime?' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('has no axe violations with a panel open', async () => {
    const { container } = render(
      <Faq eyebrow="Support" title="Frequently asked questions" items={ITEMS} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Do I own the code?' }));
    await expectNoViolations(container);
  });
});
