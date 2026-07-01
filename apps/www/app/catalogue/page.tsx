import { Catalogue } from '~/components/views/catalogue';

export const metadata = {
  title: 'Catalogue — ibirdui blocks',
  description:
    'Parcours tous les blocks ibirdui par catégorie : Marketing, Application, Auth, Commerce, AI, Feedback.',
};

export default function Page() {
  return <Catalogue />;
}
