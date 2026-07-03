'use client';

import * as React from 'react';
import type { MorphEntry } from '~/lib/morphing-data';
import type { MorphDemoProps } from './demos';
import { MorphStage } from './morph-stage';
import { PrimitiveTag } from './primitive-tag';

/**
 * One collection row: a fixed meta column (number, title, tags, "what morphs",
 * "Click to expand" + view-code) beside the interactive stage. Owns the single
 * bit of local state — whether this demo is expanded — and shares it between the
 * button and the stage so either can drive the morph.
 */
export function MorphSection({
  entry,
  Demo,
  onViewCode,
}: {
  entry: MorphEntry;
  Demo?: React.ComponentType<MorphDemoProps>;
  onViewCode: () => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const toggle = React.useCallback(() => setExpanded((v) => !v), []);
  const stageId = React.useId();
  const hasDemo = Boolean(Demo);

  return (
    <section className="flex flex-col gap-8 border-t border-border py-[52px] lg:flex-row lg:items-start lg:gap-[52px]">
      <div className="w-full flex-none lg:w-[296px]">
        <div className="font-mono text-xs font-medium tracking-[0.08em] text-muted-foreground">
          {entry.n}
        </div>
        <h3 className="mt-2.5 font-semibold text-xl leading-tight tracking-tight text-foreground">
          {entry.title}
        </h3>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted-foreground">
          {entry.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {entry.tags.map((t) => (
            <PrimitiveTag key={t} id={t} />
          ))}
        </div>

        {entry.whatMorphs ? (
          <div className="mt-[18px] rounded-2xl border border-border bg-card p-4">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">
              What morphs
            </div>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-foreground/70">
              {entry.whatMorphs}
            </p>
            {entry.timing ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {entry.timing.map((x) => (
                  <span
                    key={x}
                    className="rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground"
                  >
                    {x}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-3.5 flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            disabled={!hasDemo}
            aria-expanded={hasDemo ? expanded : undefined}
            aria-controls={hasDemo ? stageId : undefined}
            className="inline-flex items-center gap-1 font-medium text-[12.5px] bg-transparent text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {hasDemo ? (
              <>
                {expanded ? 'Click to collapse' : 'Click to expand'}
                <span aria-hidden="true">↔</span>
              </>
            ) : (
              'Bientôt jouable'
            )}
          </button>
          {entry.code ? (
            <button
              type="button"
              onClick={onViewCode}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 font-medium text-xs text-foreground shadow-sm hover:bg-accent"
            >
              <span className="font-mono text-[11px] text-primary">&lt;/&gt;</span>
              View code
            </button>
          ) : null}
        </div>
      </div>

      <MorphStage id={stageId}>
        {Demo ? <Demo expanded={expanded} onToggle={toggle} /> : undefined}
      </MorphStage>
    </section>
  );
}
