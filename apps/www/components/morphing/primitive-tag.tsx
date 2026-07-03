import { type MorphPrimitiveId, morphPrimitive } from '~/lib/morphing-data';

/** A single morph-technique chip (e.g. "Surface") shown under a section title. */
export function PrimitiveTag({ id }: { id: MorphPrimitiveId }) {
  const p = morphPrimitive(id);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 font-mono text-[11px] font-medium text-foreground/80">
      <span className={`h-1.5 w-1.5 rounded-sm ${p.dot}`} />
      {p.name}
    </span>
  );
}
