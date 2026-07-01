import type { Config } from 'tailwindcss';
// Ship the same Tailwind preset a real consumer uses, so blocks render in the
// preview exactly as they will in a user's app. Fetched from the published
// ibirdui `theme` item into registry-preview by scripts/copy-blocks.mjs.
import preset from './registry-preview/tailwind.preset';

export default {
  presets: [preset],
  // The blocks themselves (synced into registry-preview) plus the site surfaces
  // that render previews or use utility classes. Preflight is off (below), so
  // the hand-styled chrome is never reset.
  content: [
    './registry-preview/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  corePlugins: { preflight: false },
} satisfies Config;
