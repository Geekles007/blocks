import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

/**
 * Runs the a11y tests that ship inside each block. The `@/...` aliases mirror the
 * import paths a consumer gets after `blocks add`:
 *
 *  - block sources live locally, in this workspace's `items/`.
 *  - the ibirdui primitives a block composes are NOT vendored here — the
 *    `pretest` step fetches their source from the published registry
 *    (https://ui.ibird.dev/r/*.json) into `.primitives/`, so the tests exercise
 *    the exact primitive files a consumer would install cross-registry.
 */
const blockFile = (p: string) => fileURLToPath(new URL(`./items/${p}`, import.meta.url));
const primitiveFile = (p: string) => fileURLToPath(new URL(`./.primitives/${p}`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      // ibirdui primitives + shared animation lib (fetched into .primitives by pretest)
      '@/components/button': primitiveFile('components/button.tsx'),
      '@/components/badge': primitiveFile('components/badge.tsx'),
      '@/components/avatar': primitiveFile('components/avatar.tsx'),
      '@/components/skeleton': primitiveFile('components/skeleton.tsx'),
      '@/lib/block-motion': primitiveFile('lib/block-motion.tsx'),
      // blocks
      '@/components/blocks/hero': blockFile('hero/files/hero.tsx'),
    },
  },
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['items/**/tests/**/*.test.{ts,tsx}'],
  },
});
