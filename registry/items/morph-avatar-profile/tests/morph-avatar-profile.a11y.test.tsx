// Resolved via the vitest alias (registry/vitest.config.ts). The primitives it
// composes (`avatar`, `card`, `badge`, `button`, `separator`) and the
// `block-motion` lib resolve to their real sources fetched into `.primitives/` —
// exactly what the CLI installs. (`avatar` pulls in `skeleton` transitively.)
import { MorphAvatarProfile } from '@/components/blocks/morph-avatar-profile';
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

describe('MorphAvatarProfile', () => {
  it('renders the collapsed trigger as a labelled profile button', () => {
    render(<MorphAvatarProfile />);
    expect(
      screen.getByRole('button', { name: /view ada lovelace's profile/i }),
    ).toBeInTheDocument();
  });

  it('expands into a profile card with a labelled close control', () => {
    render(<MorphAvatarProfile />);
    fireEvent.click(screen.getByRole('button', { name: /view ada lovelace's profile/i }));
    expect(screen.getByRole('button', { name: /close profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^follow$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^message$/i })).toBeInTheDocument();
  });

  it('has no axe violations collapsed or expanded', async () => {
    const { container } = render(<MorphAvatarProfile />);
    await expectNoViolations(container);
    fireEvent.click(screen.getByRole('button', { name: /view ada lovelace's profile/i }));
    await expectNoViolations(container);
  });
});
