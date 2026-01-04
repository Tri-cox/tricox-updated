import { Command } from 'commander';
import { shipComponent } from '../logic/ship';

export const shipCommand = new Command('ship')
  .description('Ship a component to Tricox')
  .argument('<file>', 'Path to the component file')
  .option('--public', 'Make the component public')
  .action(async (file, options) => {
      await shipComponent(file, options);
  });
