'use client';

import * as React from 'react';
import { MORPH_ENTRIES, type MorphEntry } from '~/lib/morphing-data';
import { CodeDrawer } from './code-drawer';
import { MORPH_DEMOS } from './demos';
import { MorphHeader } from './morph-header';
import { MorphSection } from './morph-section';

/**
 * Composition root for /morphing. Owns the single piece of page-level state (which
 * section's code the drawer shows) and wires the data registry to the section
 * renderer and the demo registry. Adding a component touches only the data + demo
 * registries, never this file.
 */
export function MorphingView() {
  const [codeFor, setCodeFor] = React.useState<MorphEntry | null>(null);

  return (
    <div className="morph-page min-h-screen bg-background pb-24 text-foreground">
      <MorphHeader />

      <div className="mx-auto max-w-[1180px] px-6 sm:px-10">
        {MORPH_ENTRIES.map((entry) => (
          <MorphSection
            key={entry.n}
            entry={entry}
            Demo={MORPH_DEMOS[entry.n]}
            onViewCode={() => setCodeFor(entry)}
          />
        ))}
      </div>

      <div className="mx-auto mt-9 flex max-w-[1180px] flex-wrap items-center justify-between gap-3 border-t border-border px-6 pt-7 sm:px-10">
        <span className="text-[13px] text-muted-foreground">
          ibirdUI · Morphing UI — a growing collection of shared-element transitions
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          Continuity over disappearance
        </span>
      </div>

      <CodeDrawer entry={codeFor} onClose={() => setCodeFor(null)} />
    </div>
  );
}
