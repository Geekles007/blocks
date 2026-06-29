# blocks

Copy-paste UI **blocks** — composite, ready-to-ship sections (hero, pricing,
auth, dashboards…) distributed as **registry-as-code**. No database, no backend:
the CLI copies source straight into your project, and you own it from there.

> Status: **scaffold only**. No blocks yet — this repo currently holds the
> monorepo configuration, tooling, and workspace skeleton.

## Workspaces

| Path             | Package          | Role                                                        |
| ---------------- | ---------------- | ---------------------------------------------------------- |
| `packages/core`  | `blocks-core`    | Registry schema, content hashing, shared helpers.          |
| `packages/cli`   | `blocks`         | CLI to add blocks into a project from the registry.        |
| `registry`       | `blocks-registry`| Block definitions + builder that emits static registry JSON.|
| `apps/*`         | —                | Docs/showcase site (`blocks-www`), added later.            |

## Getting started

```bash
pnpm install
pnpm build       # turbo: builds every workspace
pnpm typecheck
pnpm test
pnpm lint        # biome
```

## Tooling

- **pnpm** workspaces + **Turborepo** for the task graph
- **Biome** for lint/format
- **tsup** for package builds, **Vitest** for tests
- **Changesets** for versioning & npm publish (`blocks-core`, `blocks`)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for how the pieces fit together and
[docs/WORKFLOW.md](./docs/WORKFLOW.md) for the day-to-day dev/release flow.

## License

MIT © Geekles007
