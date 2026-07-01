import './globals.css';
import type { ReactNode } from 'react';
import { BlocksProvider } from '~/components/blocks-provider';
import { Shell } from '~/components/shell';

export const metadata = {
  title: 'ibirdui blocks — copie une commande, c’est à toi',
  description:
    'Un catalogue de blocks UI complets, animés au morphing et accessibles, construits sur les primitives ibirdui. Installe-les en une commande, garde le code.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <BlocksProvider>
          <Shell>{children}</Shell>
        </BlocksProvider>
      </body>
    </html>
  );
}
