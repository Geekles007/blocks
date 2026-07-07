// Coherence guard between the registry and the site's surface lists.
//
// Every item under registry/items/ is published and installable. The site
// exposes those items through three hand-maintained lists, and nothing may fall
// through the cracks in either direction:
//
//   registry/items/<key>/   ⇄   lib/blocks-data.ts   (BLOCKS  → catalogue)
//                            ⇄   lib/morphing-data.ts (MORPH   → /morphing)
//                            ⇄   lib/templates-data.ts(TEMPLATES → /templates)
//
// A published item missing from all three is invisible (its /blocks/<key> page
// 404s while `ibirdui add` still works — the pricing-block drift). A surfaced
// key with no registry item ships a broken install command. Either is a bug, so
// this runs in CI via `pnpm test` and exits non-zero on any mismatch.
//
// Keys are read from the raw source, not by importing the modules: the data
// files pull in React/framer-motion and i18n, and a text scan is both cheaper
// and immune to that. The literals are simple, so the patterns below are exact:
//   - BLOCKS entries:            key: '<key>'
//   - shipped MORPH/TEMPLATE:    registryKey: '<key>'   (roadmap entries omit it)

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url)); // apps/www/scripts
const www = resolve(here, '..'); // apps/www
const repoRoot = resolve(www, '..', '..'); // repo root

/** All key literals matched by `re` (first capture group) in a source file. */
function keysFrom(relPath, re) {
  const src = readFileSync(resolve(www, relPath), 'utf8');
  const keys = new Set();
  for (const m of src.matchAll(re)) keys.add(m[1]);
  return keys;
}

// Source of truth: one directory per published registry item.
const published = new Set(
  readdirSync(resolve(repoRoot, 'registry/items'), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name),
);

// What the site actually surfaces, by tier.
const blocks = keysFrom('lib/blocks-data.ts', /key:\s*'([^']+)'/g);
const morph = keysFrom('lib/morphing-data.ts', /registryKey:\s*'([^']+)'/g);
const templates = keysFrom('lib/templates-data.ts', /registryKey:\s*'([^']+)'/g);
const surfaced = new Set([...blocks, ...morph, ...templates]);

const hiddenFromSite = [...published].filter((k) => !surfaced.has(k)).sort();
const missingFromRegistry = [...surfaced].filter((k) => !published.has(k)).sort();

if (hiddenFromSite.length === 0 && missingFromRegistry.length === 0) {
  console.log(
    `✓ catalogue coherent: ${published.size} registry items, all surfaced ` +
      `(${blocks.size} blocks, ${morph.size} morphing, ${templates.size} templates).`,
  );
  process.exit(0);
}

const bullets = (keys) => keys.map((k) => `    - ${k}`).join('\n');
if (hiddenFromSite.length > 0) {
  console.error(
    `✗ Published registry items with no site entry (invisible; /blocks/<key> would 404).
  Add each to BLOCKS (lib/blocks-data.ts), MORPH_ENTRIES (lib/morphing-data.ts)
  or TEMPLATES (lib/templates-data.ts), or delete the registry item:
${bullets(hiddenFromSite)}`,
  );
}
if (missingFromRegistry.length > 0) {
  console.error(
    `✗ Site keys with no registry/items/<key>/ (broken \`ibirdui add\` command).
  Create the registry item or remove the stale key:
${bullets(missingFromRegistry)}`,
  );
}
process.exit(1);
