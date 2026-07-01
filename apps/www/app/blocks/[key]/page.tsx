import { notFound } from 'next/navigation';
import { BlockDetail } from '~/components/views/block-detail';
import { BLOCKS, getBlock } from '~/lib/blocks-data';

// Static export: pre-render one page per known block, 404 on anything else.
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOCKS.map((b) => ({ key: b.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const b = getBlock(key);
  if (!b) return {};
  return {
    title: `${b.name} — ibirdui blocks`,
    description: `Block ${b.name} (${b.cat}) : preview live, code et commande d’installation. Composé sur les primitives ibirdui.`,
  };
}

export default async function Page({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!getBlock(key)) notFound();
  return <BlockDetail blockKey={key} />;
}
