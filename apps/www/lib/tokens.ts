/**
 * Design-handoff tokens. The site chrome is hand-styled inline from this token
 * object (light/dark + a single accent), mirroring `Ibirdui Blocks.dc.html`.
 */
export const ACCENT = '#84cc16';

export function tok(theme: 'dark' | 'light', accent: string = ACCENT) {
  const a = accent || ACCENT;
  const soft = `${a}1f`;
  const soft2 = `${a}12`;
  const ring = `${a}55`;
  if (theme === 'light')
    return {
      bg: '#ffffff',
      bg2: '#fafafa',
      panel: '#ffffff',
      panel2: '#f4f4f5',
      border: 'rgba(9,9,11,.10)',
      borderStrong: 'rgba(9,9,11,.16)',
      text: '#09090b',
      muted: '#52525b',
      faint: '#a1a1aa',
      accent: a,
      accentSoft: soft,
      accentSoft2: soft2,
      accentRing: ring,
      accentFg: '#1a2e05',
      shadow: '0 1px 2px rgba(9,9,11,.06),0 16px 40px rgba(9,9,11,.10)',
      shadowSm: '0 1px 2px rgba(9,9,11,.06)',
      skelBase: '#e8e8ec',
      skelHi: '#f6f6f8',
    };
  return {
    bg: '#09090b',
    bg2: '#0b0b0e',
    panel: '#111114',
    panel2: '#18181b',
    border: 'rgba(255,255,255,.09)',
    borderStrong: 'rgba(255,255,255,.16)',
    text: '#fafafa',
    muted: '#a1a1aa',
    faint: '#6b6b73',
    accent: a,
    accentSoft: soft,
    accentSoft2: soft2,
    accentRing: ring,
    accentFg: '#fff',
    shadow: '0 1px 2px rgba(0,0,0,.5),0 20px 50px rgba(0,0,0,.6)',
    shadowSm: '0 1px 2px rgba(0,0,0,.4)',
    skelBase: '#1c1c20',
    skelHi: '#2c2c33',
  };
}

export type Theme = 'dark' | 'light';
export type Tok = ReturnType<typeof tok>;
