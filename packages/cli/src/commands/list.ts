import { Command } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import { loadProjectConfig, getToken } from '../utils/config';

export const listCommand = new Command('list')
  .description('List components of an organization')
  .argument('[org]', 'Organization name (prefix with @ for public listing)')
  .action(async (orgArg) => {
    console.log('DEBUG: orgArg received:', orgArg);
    try {
      const config = await loadProjectConfig();
      const token = await getToken();
      
      let org = orgArg;
      let isPublicOnly = false;

      // Determine org and mode
      if (orgArg) {
          if (orgArg.startsWith('@')) {
              org = orgArg.substring(1);
              isPublicOnly = true;
          }
      } else {
          // Default to config org
          if (config && config.org) {
              org = config.org;
          } else {
              console.error(chalk.red('No organization specified and no project config found.'));
              console.log('Usage: tricox list @org');
              process.exit(1);
          }
      }

      console.log(chalk.blue(`Fetching components for ${org}${isPublicOnly ? ' (Public only)' : ''}...`));

      const API_URL = process.env.TRICOX_API_URL || 'http://localhost:3000';
      
      // Pass token if we have it (for private access if not explicitly public mode)
      const headers: any = {};
      if (token) headers['Authorization'] = token;

      const response = await axios.get(`${API_URL}/components/${org}`, {
          params: { public: String(isPublicOnly) },
          headers
      });

      const components = response.data;
      if (components.length === 0) {
          console.log(chalk.yellow('No components found.'));
      } else {
          console.log('');
          components.forEach((c: any) => {
              const visibility = c.isPublic ? chalk.green('[Public]') : chalk.gray('[Private]');
              console.log(`${chalk.bold(c.name)} ${chalk.dim(`v${c.latestVersion}`)} ${visibility}`);
          });
          console.log('');
      }

    } catch (error: any) {
      if (error.response?.status === 404) {
          console.error(chalk.red('Organization not found.'));
      } else {
          console.error(chalk.red('Failed to list components:'), error.message);
      }
      process.exit(1);
    }
  });
