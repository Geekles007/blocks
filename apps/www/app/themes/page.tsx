import { Themes } from '~/components/views/themes';

export const metadata = {
  title: 'Thèmes — ibirdui blocks',
  description:
    'Le système de thème des blocks : des tokens sémantiques en HSL, deux modes clair/sombre et un seul accent. Changez --primary et tout suit.',
};

export default function Page() {
  return <Themes />;
}
