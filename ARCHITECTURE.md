# Architecture

`blocks` is a **registry-as-code** monorepo. It distributes composite UI
sections ("blocks") the same way shadcn distributes components: there is no
runtime package to depend on — the CLI copies vetted source into the consumer's
repo, and they own and edit it from then on.

## Principles

- **Own the source.** Blocks are copied in, not imported. No lock-in.
- **Static registry.** The registry compiles to plain JSON + files served over
  HTTP (e.g. GitHub Pages). No database, no server at runtime.
- **Content-addressed.** Each block/file is hashed so the CLI can detect local
  edits and offer safe upgrades.
- **Composite over atomic.** A block is a section (hero, pricing, auth form),
  assembled from primitives — not a single button.

## Workspaces

```
blocks/
├─ packages/
│  ├─ core/        blocks-core     — registry schema (zod), hashing, helpers
│  └─ cli/         blocks          — `add` / `list` / `upgrade` commands
├─ registry/       blocks-registry — block sources + builder → public/r/*.json
└─ apps/
   └─ www/         blocks-www      — docs & live showcase (added later)
```

### `packages/core` (`blocks-core`)

The shared contract. Owns the registry **schema** (item shape, files, deps),
**content hashing**, and any pure helpers used by both the CLI and the registry
builder. Published to npm. Currently exposes only `CORE_VERSION`.

### `packages/cli` (`blocks`)

The user-facing tool. Reads the static registry over HTTP, resolves an item and
its dependencies, and writes files into the target project. Built with
`commander`. Currently a stub that wires up `--version` against `blocks-core`.

### `registry` (`blocks-registry`)

Source of truth for the blocks themselves. `build.ts` scans `items/`, validates
each against the `core` schema, and emits a static index + per-item payloads
under `public/r/`. Private (not published) — its output is what ships.

### `apps/www` (`blocks-www`)

Documentation and a live gallery of every block. Not scaffolded yet; the
`apps/*` workspace glob is reserved for it.

## Data flow

```
author writes registry/items/<block>/  ──build──►  registry/public/r/*.json
                                                          │  (served over HTTP)
                                                          ▼
                                   `blocks add <block>`  ──►  user's project
```

## Versioning & release

`blocks-core` and `blocks` are published via **Changesets**. `blocks-registry`
and `blocks-www` are in the `ignore` list — they ship as a static site, not npm
packages. See [docs/WORKFLOW.md](./docs/WORKFLOW.md).

## Conventions

- TypeScript strict everywhere (`tsconfig.base.json`); ESM-only.
- Biome for lint/format (single quotes, trailing commas, 2-space, width 100).
- Turborepo task graph: `build` → `typecheck`/`test` depend on upstream builds.
