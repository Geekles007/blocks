import { BlockMotion } from '~/components/views/block-motion';

export const metadata = {
  title: 'block-motion — ibirdui blocks',
  description:
    'La grammaire de mouvement partagée par tous les blocks : springs cohérents, reveals en cascade, morphs shared-layout et respect systématique de prefers-reduced-motion.',
};

export default function Page() {
  return <BlockMotion />;
}
