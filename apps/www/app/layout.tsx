import './globals.css';
import type { ReactNode } from 'react';
import { BlocksProvider } from '~/components/blocks-provider';
import { Shell } from '~/components/shell';

// Static-export metadata can't vary per-locale (no server); English is the
// default. The active locale + <html lang> are set client-side in BlocksProvider.
export const metadata = {
  title: 'ibirdui blocks — copy one command, it’s yours',
  description:
    'A catalogue of complete, morph-animated, accessible UI blocks built on the ibirdui primitives. Install them with one command, keep the code.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BlocksProvider>
          <Shell>{children}</Shell>
        </BlocksProvider>
      </body>
    </html>
  );
}
