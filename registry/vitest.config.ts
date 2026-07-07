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
      '@/components/input': primitiveFile('components/input.tsx'),
      '@/components/switch': primitiveFile('components/switch.tsx'),
      '@/components/skeleton': primitiveFile('components/skeleton.tsx'),
      '@/components/card': primitiveFile('components/card.tsx'),
      '@/components/separator': primitiveFile('components/separator.tsx'),
      '@/components/data-list': primitiveFile('components/data-list.tsx'),
      '@/components/state-boundary': primitiveFile('components/state-boundary.tsx'),
      '@/lib/block-motion': primitiveFile('lib/block-motion.tsx'),
      '@/lib/async-state': primitiveFile('lib/async-state.ts'),
      // blocks
      '@/components/blocks/hero': blockFile('hero/files/hero.tsx'),
      '@/components/blocks/features': blockFile('features/files/features.tsx'),
      '@/components/blocks/testimonials': blockFile('testimonials/files/testimonials.tsx'),
      '@/components/blocks/cta': blockFile('cta/files/cta.tsx'),
      '@/components/blocks/faq': blockFile('faq/files/faq.tsx'),
      '@/components/blocks/footer': blockFile('footer/files/footer.tsx'),
      '@/components/blocks/navbar': blockFile('navbar/files/navbar.tsx'),
      '@/components/blocks/hero-terminal': blockFile('hero-terminal/files/hero-terminal.tsx'),
      '@/components/blocks/hero-fintech': blockFile('hero-fintech/files/hero-fintech.tsx'),
      '@/components/blocks/hero-agency': blockFile('hero-agency/files/hero-agency.tsx'),
      '@/components/blocks/pricing': blockFile('pricing/files/pricing.tsx'),
      '@/components/blocks/pricing-toggle': blockFile('pricing-toggle/files/pricing-toggle.tsx'),
      '@/components/blocks/pricing-single': blockFile('pricing-single/files/pricing-single.tsx'),
      '@/components/blocks/pricing-compare': blockFile('pricing-compare/files/pricing-compare.tsx'),
      '@/components/blocks/morph-button-card': blockFile(
        'morph-button-card/files/morph-button-card.tsx',
      ),
      '@/components/blocks/morph-search-panel': blockFile(
        'morph-search-panel/files/morph-search-panel.tsx',
      ),
      '@/components/blocks/morph-avatar-profile': blockFile(
        'morph-avatar-profile/files/morph-avatar-profile.tsx',
      ),
      '@/components/blocks/morph-product-detail': blockFile(
        'morph-product-detail/files/morph-product-detail.tsx',
      ),
      '@/components/blocks/morph-notification-center': blockFile(
        'morph-notification-center/files/morph-notification-center.tsx',
      ),
      '@/components/blocks/morph-fab-menu': blockFile('morph-fab-menu/files/morph-fab-menu.tsx'),
      '@/components/blocks/morph-kpi-dashboard': blockFile(
        'morph-kpi-dashboard/files/morph-kpi-dashboard.tsx',
      ),
      '@/components/blocks/morph-calendar-event': blockFile(
        'morph-calendar-event/files/morph-calendar-event.tsx',
      ),
      '@/components/blocks/morph-message-conversation': blockFile(
        'morph-message-conversation/files/morph-message-conversation.tsx',
      ),
      '@/components/blocks/morph-mini-player': blockFile(
        'morph-mini-player/files/morph-mini-player.tsx',
      ),
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
