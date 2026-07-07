import { notFound } from 'next/navigation';
import { TemplateDetail } from '~/components/views/template-detail';
import { TEMPLATES, getTemplate, isShipped } from '~/lib/templates-data';

// Static export: pre-render one detail page per *shipped* template (roadmap
// entries have no live page yet), and 404 on anything else.
export const dynamicParams = false;

export function generateStaticParams() {
  return TEMPLATES.filter(isShipped).map((tpl) => ({ key: tpl.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const tpl = getTemplate(key);
  if (!tpl) return {};
  return {
    title: `${tpl.name} — Templates ibirdui`,
    description: `Template ${tpl.name} : aperçu live, blocks composés et commande d’installation. Une page complète bâtie sur les blocks ibirdui.`,
  };
}

export default async function Page({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const tpl = getTemplate(key);
  if (!tpl || !isShipped(tpl)) notFound();
  return <TemplateDetail templateKey={key} />;
}
