import { CORE_VERSION } from 'blocks-core';
import { Command } from 'commander';

// Minimal entrypoint. Commands (`add`, `list`, ...) land here once the registry
// is populated — see ARCHITECTURE.md.
const program = new Command();

program
  .name('blocks')
  .description('Add copy-paste UI blocks into your project from the registry.')
  .version(CORE_VERSION);

program.parse();
