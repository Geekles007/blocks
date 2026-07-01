import { notFound } from 'next/navigation';
import { PrimitiveDetail } from '~/components/views/primitive-detail';
import { getPrimitive, PRIMITIVES } from '~/lib/primitives-data';

// Static export: pre-render one page per primitive, 404 on anything else.
export const dynamicParams = false;

export function generateStaticParams() {
  return PRIMITIVES.map((p) => ({ key: p.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const p = getPrimitive(key);
  if (!p) return {};
  return {
    title: `${p.name} — Primitives ibirdui`,
    description: `${p.name} : ${p.designs.length} designs (déclinaisons) et leurs variants, rendus live. ${p.description}`,
  };
}

export default async function Page({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!getPrimitive(key)) notFound();
  return <PrimitiveDetail primitiveKey={key} />;
}
