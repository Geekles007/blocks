/** Centralised route table so links and `router.push` never drift apart. */
export const ROUTES = {
  home: '/',
  catalogue: '/catalogue',
  block: (key: string) => `/blocks/${key}`,
  morphing: '/morphing',
  templates: '/templates',
  template: (key: string) => `/templates/${key}`,
  gettingStarted: '/getting-started',
  blockMotion: '/block-motion',
  changelog: '/changelog',
  themes: '/themes',
} as const;
