import { Command } from 'commander';
import { saveToken } from '../utils/config';
import chalk from 'chalk';

export const authCommand = new Command('auth')
  .description('Authenticate with Tricox using a Personal Access Token')
  .requiredOption('-t, --token <token>', 'Your Personal Access Token')
  .action(async (options) => {
    try {
      const token = options.token;
      if (!token) {
        console.error(chalk.red('Token is required.'));
        process.exit(1);
      }
      
      // Save token first
      await saveToken(token);

      // Verify token and fetch user details
      const API_URL = process.env.TRICOX_API_URL || 'http://localhost:3000';
      try {
          const { default: axios } = await import('axios');
          const { updateProjectConfig } = await import('../utils/config');
          
          const response = await axios.get(`${API_URL}/auth/me`, {
              headers: { Authorization: token }
          });
          
          const user = response.data;
          console.log(chalk.green('Successfully authenticated! Token saved.'));
          console.log(`Logged in as: ${chalk.bold(user.email)}`);

          if (user.ownedOrgs && user.ownedOrgs.length > 0) {
              const primaryOrg = user.ownedOrgs[0].name;
              await updateProjectConfig({ org: primaryOrg });
              console.log(chalk.blue(`Active organization updated to: ${primaryOrg}`));
          } else {
             console.log(chalk.yellow('No organizations found for this user.'));
          }

      } catch (e: any) {
          console.warn(chalk.yellow('Token saved, but failed to fetch user info or update config:'), e.message);
      }

    } catch (error) {
      console.error(chalk.red('Failed to save token:'), error);
      process.exit(1);
    }
  });
