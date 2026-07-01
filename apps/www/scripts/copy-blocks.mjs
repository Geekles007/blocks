/**
 * Builds the live-preview surface for the blocks site.
 *
 * Every block is, by design, a COMPOSITION of ibirdui primitives — so to mount a
 * block live we need the block's own source plus the source of every primitive
 * (and the shared block-motion lib) it pulls in.
 *
 * Block sources are local: they live in this repo's `registry/items/`. The
 * ibirdui primitives are NOT — this repo is decoupled from ibirdui, so their
 * source is fetched over HTTP from the published registry (ui.ibird.dev) by
 * `scripts/fetch-primitives.mjs`. Both are written into `registry-preview/`
 * using each item's own target path (e.g. `components/badge.tsx`,
 * `lib/block-motion.tsx`, `components/blocks/hero.tsx`).
 *
 * Because those paths line up with the `@/...` imports the items ship with, the
 * preview's `@/* -> registry-preview/*` alias makes everything resolve exactly
 * as it would in a consumer's project — the real files, never a mock-up.
 */
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchPrimitivesInto } from '../../../scripts/fetch-primitives.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..', '..');
const BLOCK_ITEMS = join(repoRoot, 'registry', 'items');
const OUT = join(here, '..', 'registry-preview');

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

/** Load the local block items: name -> { dir, files }. */
async function loadBlocks() {
  const blocks = new Map();
  let entries;
  try {
    entries = await readdir(BLOCK_ITEMS, { withFileTypes: true });
  } catch {
    return blocks;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const dir = join(BLOCK_ITEMS, entry.name);
    const meta = await readJson(join(dir, 'meta.json'));
    blocks.set(meta.name, { dir, files: meta.files ?? [] });
  }
  return blocks;
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  // 1) ibirdui primitives (+ their transitive deps) — fetched from ui.ibird.dev.
  //    `theme` isn't a block dependency but the site needs its Tailwind preset +
  //    token CSS to render previews exactly as a consumer's app would.
  const { written: primitiveFiles, names: primitiveNames } = await fetchPrimitivesInto(OUT, {
    extra: ['theme'],
  });

  // 2) local block sources — copied straight from this repo's registry.
  const blocks = await loadBlocks();
  let blockFiles = 0;
  for (const [, block] of blocks) {
    for (const file of block.files) {
      const from = join(block.dir, file.from);
      await stat(from); // fail loudly if a source file is missing
      const dest = join(OUT, file.path);
      await mkdir(dirname(dest), { recursive: true });
      await cp(from, dest);
      blockFiles += 1;
    }
  }

  // A tiny barrel so the site can import every block by a stable path.
  const blockNames = [...blocks.keys()];
  const blockExports = blockNames
    .map((name) => {
      const file = blocks.get(name).files[0];
      const noExt = file.path.replace(/\.(tsx|ts)$/, '');
      return `export * from './${noExt}';`;
    })
    .join('\n');
  await writeFile(join(OUT, 'blocks.ts'), `${blockExports}\n`);

  console.log(
    `[copy-blocks] ${blockFiles} block file(s) for ${blockNames.length} block(s) [${blockNames.join(', ')}] + ` +
      `${primitiveFiles} primitive file(s) [${primitiveNames.join(', ')}] -> registry-preview/`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
