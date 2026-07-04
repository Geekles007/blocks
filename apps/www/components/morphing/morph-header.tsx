'use client';

import { MORPH_COMPONENTS } from '~/lib/morphing-data';
import { useUI } from '~/lib/ui-context';
import { PageHeader } from '../page';
import { Badge } from '../primitives';

function FeatureChip({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-medium text-[12.5px] text-muted-foreground">
      {swatch}
      {label}
    </div>
  );
}

/**
 * The collection masthead. It renders the shared `PageHeader` (same kicker/title
 * type scale as every other route) so /morphing no longer diverges from the rest
 * of the site — then adds the feature chips and primitive legend beneath it.
 */
export function MorphHeader() {
  const { t, reduced } = useUI();
  return (
    <header className="mx-auto max-w-[1180px] px-6 pt-14 pb-5 sm:px-10">
      <PageHeader
        t={t}
        reduced={reduced}
        size="lg"
        titleMaxWidth="18ch"
        kicker={
          <Badge t={t} tone="accent" dot>
            Collection · en cours
          </Badge>
        }
        title={
          <>
            Un objet qui <span style={{ color: t.accent }}>se transforme</span> en un autre.
          </>
        }
        subtitle="Des composants où un élément évolue vers un autre — construits sur les primitives ibirdui et animés avec framer-motion. Chaque élément préserve la continuité visuelle : rien ne disparaît, tout se transforme."
      />

      <div className="mt-6 flex flex-wrap gap-2.5">
        <FeatureChip
          swatch={<span className="h-2 w-2 rounded-sm bg-primary" />}
          label="Shared layout identity"
        />
        <FeatureChip
          swatch={<span className="h-2 w-2 rounded-full border-2 border-muted-foreground" />}
          label="Cross-fade"
        />
        <FeatureChip
          swatch={
            <span className="h-2 w-3.5 rounded-sm bg-gradient-to-r from-primary to-primary/30" />
          }
          label="Scale & reposition"
        />
      </div>

      <div className="mt-7 border-t border-border pt-6">
        <div className="mb-3.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">
          ibirdui primitives — each morph is tagged with the components it’s built from
        </div>
        <div className="flex flex-wrap gap-x-7 gap-y-2.5">
          {MORPH_COMPONENTS.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <span className={`h-[9px] w-[9px] flex-none rounded-[3px] ${c.dot}`} />
              <span className="font-mono font-semibold text-[12.5px] text-foreground">
                {c.name}
              </span>
              <span className="text-[12.5px] text-muted-foreground">{c.blurb}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
