import * as React from 'react';

/**
 * Shared `React.createElement` alias. The whole blocks site is authored in this
 * hyperscript style (faithful to the design handoff) rather than JSX, so every
 * module imports the single `h` from here instead of re-aliasing it.
 */
export const h = React.createElement;

export type CSS = React.CSSProperties;
