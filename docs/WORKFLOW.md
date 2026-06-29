# Workflow

Day-to-day development and release flow for `blocks`.

## Prerequisites

- Node `>=20`
- pnpm `11.x` (pinned via `packageManager`)

```bash
pnpm install
```

## Common tasks

| Command            | What it does                                             |
| ------------------ | -------------------------------------------------------- |
| `pnpm dev`         | Watch-build every workspace (turbo `dev`).               |
| `pnpm build`       | Build all packages + registry (turbo `build`).           |
| `pnpm typecheck`   | `tsc --noEmit` across workspaces.                        |
| `pnpm test`        | Vitest across workspaces.                                |
| `pnpm lint`        | Biome check (no writes).                                 |
| `pnpm check`       | Biome check **with** autofix.                            |
| `pnpm format`      | Biome format-write.                                      |
| `pnpm registry:build` | Build just the registry (`public/r/*.json`).          |

## Branching

- Branch off `main`; open a PR.
- CI (`.github/workflows/ci.yml`) runs lint → typecheck → test → build on every
  push to `main` and every PR.

## Adding a changeset

Any change that should bump `blocks-core` or `blocks`:

```bash
pnpm changeset        # pick packages + bump type, write a summary
```

Commit the generated file in `.changeset/` with your PR.

## Releasing

Handled by `.github/workflows/release.yml` (Changesets action):

1. Merging changesets to `main` opens/updates a **"Version Packages"** PR.
2. Merging that PR bumps versions, updates changelogs, and publishes to npm.

> Requires an `NPM_TOKEN` repository secret. Until it is set, the publish step
> is inert and nothing is released.

## Adding a block (future)

Once components land: create `registry/items/<block>/`, run
`pnpm registry:build`, and verify the emitted `registry/public/r/index.json`.
See [../ARCHITECTURE.md](../ARCHITECTURE.md).
