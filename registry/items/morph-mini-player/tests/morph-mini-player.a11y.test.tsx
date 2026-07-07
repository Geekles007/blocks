// Resolved via the vitest alias (registry/vitest.config.ts). The primitives it
// composes (`card`, `button`, `separator`) and the `block-motion` lib resolve to
// their real sources fetched into `.primitives/` — exactly what the CLI installs.
import { MorphMiniPlayer } from '@/components/blocks/morph-mini-player';
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

describe('MorphMiniPlayer', () => {
  it('renders the collapsed mini bar as a labelled toggle', () => {
    render(<MorphMiniPlayer />);
    expect(screen.getByRole('button', { name: /open player/i })).toBeInTheDocument();
  });

  it('expands into the full player with transport, a progressbar and a minimize control', () => {
    render(<MorphMiniPlayer />);
    fireEvent.click(screen.getByRole('button', { name: /open player/i }));
    expect(screen.getByRole('button', { name: /minimize player/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /playback controls/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /playback position/i })).toBeInTheDocument();
    // starts playing, so the main control offers Pause; clicking flips it to Play
    const playPause = screen.getByRole('button', { name: /pause/i });
    fireEvent.click(playPause);
    expect(screen.getByRole('button', { name: /^play$/i })).toBeInTheDocument();
  });

  it('has no axe violations collapsed or expanded', async () => {
    const { container } = render(<MorphMiniPlayer />);
    await expectNoViolations(container);
    fireEvent.click(screen.getByRole('button', { name: /open player/i }));
    await expectNoViolations(container);
  });
});
