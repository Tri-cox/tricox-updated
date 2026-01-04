#!/usr/bin/env node
import { Command } from 'commander';
const program = new Command();

program
  .name('tricox')
  .description('Tricox CLI')
  .version('0.1.0');

import { authCommand } from './commands/auth';
import { launchCommand } from './commands/launch';
import { shipCommand } from './commands/ship';
import { dockCommand } from './commands/dock';
import { switchCommand } from './commands/switch';
import { updateCommand } from './commands/update';
import { infoCommand } from './commands/info';
import { listCommand } from './commands/list';

program
  .name('tricox')
  .description('Tricox CLI')
  .version('0.1.0');

program.addCommand(authCommand);
program.addCommand(launchCommand);
program.addCommand(shipCommand);
program.addCommand(dockCommand);
program.addCommand(switchCommand);
program.addCommand(updateCommand);
program.addCommand(infoCommand);
program.addCommand(listCommand);




program.parse(process.argv);
