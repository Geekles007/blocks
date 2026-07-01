import { PrimitivesCatalogue } from '~/components/views/primitives-catalogue';

export const metadata = {
  title: 'Primitives — ibirdui blocks',
  description:
    'Les primitives ibirdui : chaque composant, ses designs (déclinaisons) et leurs variants, rendus live et prêts à installer.',
};

export default function Page() {
  return <PrimitivesCatalogue />;
}
