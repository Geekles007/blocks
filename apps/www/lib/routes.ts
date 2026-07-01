/** Centralised route table so links and `router.push` never drift apart. */
export const ROUTES = {
  home: '/',
  catalogue: '/catalogue',
  block: (key: string) => `/blocks/${key}`,
  primitives: '/primitives',
  primitive: (key: string) => `/primitives/${key}`,
} as const;
