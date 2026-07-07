/**
 * Fetches the ibirdui primitive sources that the local blocks compose, from the
 * published primitives registry (https://ui.ibird.dev/r/*.json), and writes each
 * file's source to `<outDir>/<file.path>`.
 *
 * Blocks are, by design, compositions of ibirdui primitives — but this repo is
 * decoupled from the ibirdui monorepo. So to run a block's a11y test or mount it
 * in a live preview we need the primitives' *source*, which we pull over HTTP
 * from the same static registry a real consumer installs from. Nothing is
 * vendored: the fetched files land in gitignored caches
 * (`registry/.primitives`, `apps/www/registry-preview`).
 *
 * The roots are every `registryDependencies` entry declared by the blocks under
 * `registry/items/`; their transitive registry deps are followed too, so a
 * primitive that itself composes another primitive resolves correctly.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REGISTRY_ITEMS = join(HERE, '..', 'registry', 'items');
export const DEFAULT_BASE = 'https://ui.ibird.dev';

const normalizeBaseUrl = (u) => u.replace(/\/+$/, '');
const isAbsoluteUrl = (ref) => /^https?:\/\//i.test(ref);
// This *is* the blocks registry, so a dep pointing back at it (a template that
// composes local blocks) resolves from `registry/items`, not over HTTP — skip it
// here; each composed block's own primitive deps are already collected as roots.
const isSelfRegistryRef = (ref) => /(^|\/\/)blocks\.ibird\.dev\b/i.test(ref);
const itemUrl = (base, name) => `${normalizeBaseUrl(base)}/r/${name}.json`;
const baseUrlFromItemUrl = (url) => url.replace(/\/r\/[^/]+\.json$/, '');

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

// Fetched primitive sources are an external dependency (their canonical home +
// CI is the ibirdui repo). We resolve them for imports and run them in tests /
// previews, but we don't type-check their internals here — otherwise a typing
// quirk in a published primitive would redden this repo's CI. `@ts-nocheck`
// suppresses errors inside the file while still exporting its (inferred) types
// to consumers, so blocks that compose it stay fully type-checked.
const TS_NOCHECK =
  '// @ts-nocheck — fetched external primitive source (ui.ibird.dev); not type-checked in this repo\n';

function markExternal(path, content) {
  return /\.tsx?$/.test(path) ? `${TS_NOCHECK}${content}` : content;
}

/** Every `registryDependencies` ref declared by the blocks in `registry/items`. */
async function rootDeps() {
  const deps = new Set();
  let entries;
  try {
    entries = await readdir(REGISTRY_ITEMS, { withFileTypes: true });
  } catch {
    return [];
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const meta = await readJson(join(REGISTRY_ITEMS, entry.name, 'meta.json'));
    for (const dep of meta.registryDependencies ?? []) {
      if (isSelfRegistryRef(dep)) continue;
      deps.add(dep);
    }
  }
  return [...deps];
}

async function fetchItem(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch registry item at ${url} (${res.status}).`);
  return res.json();
}

/**
 * Fetch the transitive closure of primitives referenced by the local blocks and
 * write every file to `<outDir>/<file.path>`. Returns what was written.
 */
export async function fetchPrimitivesInto(outDir, { base = DEFAULT_BASE, roots, extra = [] } = {}) {
  const rootRefs = [...(roots ?? (await rootDeps())), ...extra];
  const seen = new Map(); // canonical URL -> item

  async function visit(ref, fromBase) {
    const url = isAbsoluteUrl(ref) ? ref : itemUrl(fromBase, ref);
    if (seen.has(url)) return;
    const item = await fetchItem(url);
    seen.set(url, item);
    // A cross-registry item's name-based deps resolve against its own origin.
    const childBase = isAbsoluteUrl(ref) ? baseUrlFromItemUrl(url) : fromBase;
    for (const dep of item.registryDependencies ?? []) {
      if (isSelfRegistryRef(dep)) continue;
      await visit(dep, childBase);
    }
  }

  for (const ref of rootRefs) await visit(ref, normalizeBaseUrl(base));

  let written = 0;
  const names = [];
  for (const item of seen.values()) {
    names.push(item.name);
    for (const file of item.files ?? []) {
      const dest = join(outDir, file.path);
      await mkdir(dirname(dest), { recursive: true });
      await writeFile(dest, markExternal(file.path, file.content ?? ''));
      written += 1;
    }
  }
  return { written, names: names.sort() };
}

// CLI: node scripts/fetch-primitives.mjs <outDir> [baseUrl]
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const outArg = process.argv[2] ?? '.primitives';
  const base = process.argv[3] ?? DEFAULT_BASE;
  const outDir = isAbsolute(outArg) ? outArg : resolve(process.cwd(), outArg);
  fetchPrimitivesInto(outDir, { base })
    .then(({ written, names }) =>
      console.log(
        `[fetch-primitives] wrote ${written} file(s) for ${names.length} primitive(s): ${names.join(', ')}`,
      ),
    )
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
