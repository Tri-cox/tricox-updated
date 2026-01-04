import { Command } from 'commander';
import { createProjectConfig } from '../utils/config';
import inquirer from 'inquirer';
import chalk from 'chalk';

export const launchCommand = new Command('launch')
  .description('Initialize a Tricox project')
  .action(async () => {
    // Interactive prompts
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'org',
        message: 'What is your organization name?',
      },
      {
        type: 'list',
        name: 'framework',
        message: 'Which framework are you using?',
        choices: ['react', 'vue', 'svelte', 'other'],
      },
       {
        type: 'list',
        name: 'language',
        message: 'Which language?',
        choices: ['typescript', 'javascript'],
      },
    ]);

    try {
      await createProjectConfig(answers);
      console.log(chalk.green('Tricox project initialized successfully!'));
      console.log(chalk.blue('Created .tricox/config.json'));
    } catch (err) {
      console.error(chalk.red('Failed to initialize project:'), err);
    }
  });
