// Resolved via the vitest alias (registry/vitest.config.ts). The primitives it
// composes (`card`, `button`, `avatar`, `input`, `badge`, `separator`) and the
// `block-motion` lib resolve to their real sources fetched into `.primitives/` —
// exactly what the CLI installs.
import { MorphMessageConversation } from '@/components/blocks/morph-message-conversation';
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

describe('MorphMessageConversation', () => {
  it('renders the collapsed preview as a labelled toggle', () => {
    render(<MorphMessageConversation />);
    expect(screen.getByRole('button', { name: /open conversation with/i })).toBeInTheDocument();
  });

  it('expands into the conversation with a close control, message log and composer', () => {
    render(<MorphMessageConversation />);
    fireEvent.click(screen.getByRole('button', { name: /open conversation with/i }));
    expect(screen.getByRole('button', { name: /close conversation/i })).toBeInTheDocument();
    expect(screen.getByRole('log', { name: /conversation with/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('has no axe violations collapsed or expanded', async () => {
    const { container } = render(<MorphMessageConversation />);
    await expectNoViolations(container);
    fireEvent.click(screen.getByRole('button', { name: /open conversation with/i }));
    await expectNoViolations(container);
  });
});
