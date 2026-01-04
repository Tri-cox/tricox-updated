import { Command } from 'commander';
import { shipComponent } from '../logic/ship';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export const updateCommand = new Command('update')
  .description('Update an existing component')
  .argument('<componentOrFile>', 'Path to file OR Component ID (e.g. @org/Button)')
  .option('-p, --path <path>', 'Path where component is located (if using ID)')
  .option('--public', 'Make component public')
  .action(async (arg, options) => {
      let fileToShip = arg;

      // Check if it looks like a component ID (@org/comp) or we have a path option
      if (options.path) {
           // User provided a path, assuming arg is ID or name
           // If arg is @org/Button, we want Button.tsx in path
           let name = arg;
           if (arg.includes('/')) {
               const parts = arg.split('/');
               name = parts[parts.length - 1]; // Get last part (Button)
           }
           
           // Construct full path
           // User gave -p src/test/test2
           // We look for src/test/test2/Button.tsx
           const possibleFile = path.join(options.path, `${name}.tsx`);
           if (await fs.pathExists(possibleFile)) {
               fileToShip = possibleFile;
           } else {
               // Try .ts, .js, .jsx
               const ext = ['.ts', '.js', '.jsx'].find(e => fs.existsSync(path.join(options.path, `${name}${e}`)));
               if (ext) {
                   fileToShip = path.join(options.path, `${name}${ext}`);
               } else {
                   // Maybe options.path IS the file?
                   if (await fs.pathExists(options.path) && (await fs.stat(options.path)).isFile()) {
                        fileToShip = options.path;
                   } else {
                       console.error(chalk.red(`Could not find component file for '${name}' in '${options.path}'`));
                       return;
                   }
               }
           }
      }

      console.log(chalk.blue(`Updating ${fileToShip}...`));
      await shipComponent(fileToShip, options);
  });
