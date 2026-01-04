import { Command } from 'commander';
import { getToken } from '../utils/config';
import chalk from 'chalk';
import axios from 'axios';

export const infoCommand = new Command('info')
  .description('Show logged in user information')
  .action(async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.log(chalk.yellow('Not logged in. Run `tricox auth` to login.'));
        return;
      }

      const API_URL = process.env.TRICOX_API_URL || 'http://localhost:3000';
      
      try {
          const response = await axios.get(`${API_URL}/auth/me`, {
              headers: { Authorization: token }
          });
          
          const user = response.data;
          console.log(chalk.green('✅ Logged in successfully!'));
          console.log(`User: ${chalk.bold(user.email)}`);
          if (user.ownedOrgs && user.ownedOrgs.length > 0) {
             console.log(`Primary Org: ${chalk.blue(user.ownedOrgs[0].name)}`);
          }
          console.log(`User ID: ${user.id}`);

      } catch (err: any) {
          if (err.response && err.response.status === 401) {
              console.log(chalk.red('Token is invalid or expired. Please login again.'));
          } else {
              console.log(chalk.red('Failed to fetch user info:'), err.message);
          }
      }

    } catch (error) {
      console.error(chalk.red('Error:'), error);
    }
  });
