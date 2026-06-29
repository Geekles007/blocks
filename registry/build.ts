import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Minimal registry builder. Scans `items/` for block definitions and emits a
// static index under `public/r/`. Item discovery is a placeholder until the
// first blocks land — see ARCHITECTURE.md.

const here = dirname(fileURLToPath(import.meta.url));
const itemsDir = join(here, 'items');
const outDir = join(here, 'public', 'r');

async function listItems(): Promise<string[]> {
  try {
    const entries = await readdir(itemsDir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

async function main(): Promise<void> {
  const names = await listItems();
  await mkdir(outDir, { recursive: true });
  const index = {
    $schema: 'https://blocks.dev/schema/registry.json',
    version: '0.0.0',
    generatedAt: new Date().toISOString(),
    items: names,
  };
  await writeFile(join(outDir, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);
  console.log(`Registry built: ${names.length} item(s) → public/r/index.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
