'use client';

import { h } from '~/lib/h';
import { useUI } from '~/lib/ui-context';
import { Icon } from './primitives';

export function Toast({ msg }: { msg: string }) {
  const { t, reduced } = useUI();
  return h(
    'div',
    {
      className: reduced ? 'ib-fade' : 'ib-pop',
      style: {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 80,
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        background: t.text,
        color: t.bg,
        borderRadius: '10px',
        padding: '10px 15px',
        boxShadow: t.shadow,
        font: "600 13px 'Geist',sans-serif",
      },
    },
    h(Icon, { name: 'check', size: 16 }),
    msg,
  );
}
