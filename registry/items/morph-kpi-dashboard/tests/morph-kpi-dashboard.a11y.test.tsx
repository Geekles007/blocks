// Resolved via the vitest alias (registry/vitest.config.ts). The primitives it
// composes (`card`, `button`, `badge`, `separator`) and the `block-motion` lib
// resolve to their real sources fetched into `.primitives/` — exactly what the
// CLI installs.
import { MorphKpiDashboard } from '@/components/blocks/morph-kpi-dashboard';
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

describe('MorphKpiDashboard', () => {
  it('renders the collapsed widget as a labelled toggle', () => {
    render(<MorphKpiDashboard />);
    expect(screen.getByRole('button', { name: /open analytics dashboard/i })).toBeInTheDocument();
  });

  it('expands into the dashboard with a close control and grouped KPIs', () => {
    render(<MorphKpiDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /open analytics dashboard/i }));
    expect(screen.getByRole('button', { name: /close dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /key metrics/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /revenue by day/i })).toBeInTheDocument();
  });

  it('has no axe violations collapsed or expanded', async () => {
    const { container } = render(<MorphKpiDashboard />);
    await expectNoViolations(container);
    fireEvent.click(screen.getByRole('button', { name: /open analytics dashboard/i }));
    await expectNoViolations(container);
  });
});
