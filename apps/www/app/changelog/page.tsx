import { Changelog } from '~/components/views/changelog';

export const metadata = {
  title: 'Changelog — ibirdui blocks',
  description:
    'L’historique des blocks ibirdui : nouveaux blocks, améliorations, correctifs et travaux d’infrastructure, version par version.',
};

export default function Page() {
  return <Changelog />;
}
