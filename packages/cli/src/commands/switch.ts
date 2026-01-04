import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

export const switchCommand = new Command('switch')
  .description('Switch the active organization in config')
  .argument('<org>', 'Organization name to switch to')
  .action(async (org) => {
    const configPath = path.join(process.cwd(), '.tricox', 'config.json');

    if (!fs.existsSync(configPath)) {
        console.error(chalk.red('Config file not found. Run "tricox launch" first.'));
        process.exit(1);
    }

    try {
        const config = await fs.readJson(configPath);
        config.org = org;
        await fs.writeJson(configPath, config, { spaces: 2 });
        console.log(chalk.green(`Successfully switched to organization: ${org}`));
    } catch (error) {
        console.error(chalk.red('Failed to update config:'), error);
        process.exit(1);
    }
  });
