/**
 * Publishes the built blocks registry into the static site.
 *
 * The registry JSON (`registry/public/r/*.json`) is what a consumer's CLI reads
 * to install a block — but Next's static export only serves files under
 * `apps/www/public/`. So we copy the registry into `apps/www/public/r/`, and the
 * export then serves it at `blocks.ibird.dev/r/<name>.json` exactly as the
 * install commands on the site advertise.
 *
 * Timing: in CI / `turbo run build`, the `blocks-registry` package builds first
 * (turbo `^build`), so `registry/public/r` already exists here. When it doesn't
 * (a bare local `next build`), we build it on the fly so `/r` is never empty.
 *
 * The destination is gitignored (`**​/public/r/`) — it's generated output.
 */
import { spawnSync } from 'node:child_process';
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..', '..');
const REGISTRY_DIR = join(repoRoot, 'registry');
const SRC = join(REGISTRY_DIR, 'public', 'r');
const DEST = join(here, '..', 'public', 'r');

async function jsonCount(dir) {
  try {
    return (await readdir(dir)).filter((f) => f.endsWith('.json')).length;
  } catch {
    return 0;
  }
}

async function main() {
  // Build the registry if it hasn't been built yet (bare local `next build`).
  if ((await jsonCount(SRC)) === 0) {
    console.log('[copy-registry] registry not built yet — building it…');
    const res = spawnSync('npx', ['tsx', 'build.ts'], {
      cwd: REGISTRY_DIR,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    if (res.status !== 0) {
      throw new Error('[copy-registry] failed to build the registry.');
    }
  }

  await rm(DEST, { recursive: true, force: true });
  await mkdir(DEST, { recursive: true });
  await cp(SRC, DEST, { recursive: true });

  const count = await jsonCount(DEST);
  console.log(`[copy-registry] published ${count} registry file(s) -> apps/www/public/r/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
