import { MORPH_PRIMITIVES } from '~/lib/morphing-data';

function FeatureChip({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-medium text-[12.5px] text-muted-foreground">
      {swatch}
      {label}
    </div>
  );
}

/** The collection masthead: logo, title, intro, feature chips and the primitive legend. */
export function MorphHeader() {
  return (
    <header className="mx-auto max-w-[1180px] px-6 pt-14 pb-5 sm:px-10">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/40">
          <div className="h-[9px] w-[9px] rounded-[3px] bg-primary-foreground" />
        </div>
        <span className="font-semibold text-[15px] tracking-tight text-foreground">
          ibird<span className="text-primary">UI</span>
        </span>
      </div>

      <div className="mb-3.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-primary">
        Component Collection · work in progress
      </div>
      <h1 className="max-w-[720px] font-semibold text-[34px] leading-[1.05] tracking-tight text-foreground sm:text-[40px]">
        Morphing UI — shared-element transitions
      </h1>
      <p className="mt-3.5 max-w-[620px] text-[17px] leading-relaxed text-muted-foreground">
        Components where one object evolves into another — built on ibirdui primitives and animated
        with framer-motion. The first is live; the rest are on the way. Every element preserves
        visual continuity — nothing disappears, everything morphs.
      </p>

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
          Morph techniques — each component is tagged with the ones it uses
        </div>
        <div className="flex flex-wrap gap-x-7 gap-y-2.5">
          {MORPH_PRIMITIVES.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <span className={`h-[9px] w-[9px] flex-none rounded-[3px] ${p.dot}`} />
              <span className="font-mono font-semibold text-[12.5px] text-foreground">
                {p.name}
              </span>
              <span className="text-[12.5px] text-muted-foreground">{p.blurb}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
