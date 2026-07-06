// Resolved via the vitest alias (registry/vitest.config.ts). The primitives it
// composes (`card`, `button`, `badge`, `avatar`, `separator`) and the
// `block-motion` lib resolve to their real sources fetched into `.primitives/` —
// exactly what the CLI installs.
import { MorphCalendarEvent } from '@/components/blocks/morph-calendar-event';
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

describe('MorphCalendarEvent', () => {
  it('renders the collapsed day cell as a labelled toggle', () => {
    render(<MorphCalendarEvent />);
    expect(screen.getByRole('button', { name: /view event/i })).toBeInTheDocument();
  });

  it('expands into the event panel with a close control and grouped attendees', () => {
    render(<MorphCalendarEvent />);
    fireEvent.click(screen.getByRole('button', { name: /view event/i }));
    expect(screen.getByRole('button', { name: /close event details/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /attendees/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^accept$/i })).toBeInTheDocument();
  });

  it('has no axe violations collapsed or expanded', async () => {
    const { container } = render(<MorphCalendarEvent />);
    await expectNoViolations(container);
    fireEvent.click(screen.getByRole('button', { name: /view event/i }));
    await expectNoViolations(container);
  });
});
