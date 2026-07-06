'use client';

import type * as React from 'react';
import { useUI } from '~/lib/ui-context';

/** Soft placeholder shown in a stage whose live demo hasn't been built yet. */
function StagePlaceholder() {
  const { m } = useUI();
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="h-14 w-14 animate-pulse rounded-2xl border border-dashed border-border bg-muted/50" />
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
        {m.morphing.comingSoon}
      </span>
    </div>
  );
}

/**
 * The 500px interactive stage — a dotted, theme-aware surface that hosts one
 * morphing demo (or a placeholder while it's still on the way). Purely
 * presentational: it knows nothing about which component it holds.
 */
export function MorphStage({ id, children }: { id?: string; children?: React.ReactNode }) {
  return (
    <div
      id={id}
      className="relative flex h-[420px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-[22px] border border-border bg-card/40 sm:h-[500px]"
      style={{
        backgroundImage: 'radial-gradient(hsl(var(--foreground) / 0.05) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {children ?? <StagePlaceholder />}
    </div>
  );
}
