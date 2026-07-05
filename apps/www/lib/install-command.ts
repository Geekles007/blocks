/**
 * The three package-manager flavours of one `ibirdui add <ref>` — the same CLI
 * command run through each PM's dlx (npx / pnpm dlx / bunx). `ref` is a registry
 * item URL or path, e.g. "blocks.ibird.dev/r/hero"; the CLI resolves the block
 * and every ibirdui primitive it composes from there. Shared by the catalogue
 * detail view and the morphing showcase so both offer the same toggle.
 */
export interface AddCommand {
  /** Tab label, e.g. "npm" / "pnpm" / "bun". */
  pm: string;
  /** The `ibirdui add` command run through that package manager's dlx. */
  cmd: string;
}

export function addCommands(ref: string): AddCommand[] {
  return [
    { pm: 'npm', cmd: `npx ibirdui add ${ref}` },
    { pm: 'pnpm', cmd: `pnpm dlx ibirdui add ${ref}` },
    { pm: 'bun', cmd: `bunx ibirdui add ${ref}` },
  ];
}
