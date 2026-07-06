// Resolved via the vitest alias (registry/vitest.config.ts). The primitives it
// composes (`button`, `badge`, `card`) and the `block-motion` lib resolve to
// their real sources fetched into `.primitives/` — exactly what the CLI installs.
import { MorphNotificationCenter } from '@/components/blocks/morph-notification-center';
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

describe('MorphNotificationCenter', () => {
  it('renders the collapsed trigger as a labelled bell button with the unread count', () => {
    render(<MorphNotificationCenter />);
    expect(
      screen.getByRole('button', { name: /open notifications \(3 unread\)/i }),
    ).toBeInTheDocument();
  });

  it('expands into a notification centre with a bell close control and a mark-all-read action', () => {
    render(<MorphNotificationCenter />);
    fireEvent.click(screen.getByRole('button', { name: /open notifications/i }));
    expect(screen.getByRole('button', { name: /close notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mark all as read/i })).toBeInTheDocument();
    expect(screen.getByText('Mira Chen')).toBeInTheDocument();
    expect(screen.getByText('Deploy to production succeeded')).toBeInTheDocument();
  });

  it('has no axe violations collapsed or expanded', async () => {
    const { container } = render(<MorphNotificationCenter />);
    await expectNoViolations(container);
    fireEvent.click(screen.getByRole('button', { name: /open notifications/i }));
    await expectNoViolations(container);
  });
});
