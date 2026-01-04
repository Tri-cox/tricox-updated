import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { getToken, loadProjectConfig } from '../utils/config';
import chalk from 'chalk';

const parser = require('@babel/parser').default || require('@babel/parser');
const traverseFn = require('@babel/traverse').default || require('@babel/traverse');

export async function shipComponent(file: string, options: { public?: boolean }) {
    try {
      const token = await getToken();
      if (!token) {
        console.error(chalk.red('Not authenticated. Run `tricox auth` first.'));
        process.exit(1);
      }

      // Determine Organization
  let org = '';
  const config = await loadProjectConfig();
  
  if (config && config.org) {
      org = config.org;
  } else {
      // Fallback to authenticated user's primary org
      console.log(chalk.yellow('No local config found. Attempting to use primary organization from auth...'));
      // token is already defined at the top of the function
      if (!token) { 
          console.error(chalk.red('Not authenticated and no project config found. Run `tricox launch` or `tricox auth`.'));
          process.exit(1);
      }
      
      try {
          const API_URL = process.env.TRICOX_API_URL || 'http://localhost:3000';
          // axios is already imported at the top of the file
          const res = await axios.get(`${API_URL}/auth/me`, { headers: { Authorization: token } });
          const user = res.data;
          if (user.ownedOrgs && user.ownedOrgs.length > 0) {
              org = user.ownedOrgs[0].name;
              console.log(chalk.blue(`Using organization: ${org}`));
          } else {
              console.error(chalk.red('No organizations found for your account.'));
              process.exit(1);
          }
      } catch (err: any) {
          console.error(chalk.red('Failed to fetch user info for fallback:'), err.message);
          process.exit(1);
      }
  }
      const filePath = path.resolve(process.cwd(), file);
      if (!await fs.pathExists(filePath)) {
        console.error(chalk.red(`File not found: ${file}`));
        return;
      }

      const content = await fs.readFile(filePath, 'utf-8');
      
      // Parse AST to find imports
      let ast;
      try {
          ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx'],
          });
      } catch (e) {
          console.warn(chalk.yellow('Failed to parse AST (skipping dependency check):'), e);
          ast = null;
      }

      const dependencies: string[] = [];
      const localImports: string[] = [];

      if (ast) {
          traverseFn(ast, {
            ImportDeclaration({ node }: { node: any }) {
              const source = node.source.value;
              if (source.startsWith('.')) {
                localImports.push(source);
              } else {
                dependencies.push(source);
              }
            },
          });
      }

      console.log(chalk.blue('Detected external dependencies:'), dependencies);
      console.log(chalk.yellow('Detected local imports (warning: strictly local imports might not work unless shipped):'), localImports);

      // Prepare upload
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      form.append('name', path.basename(file, path.extname(file)));
      form.append('org', org); // Use the resolved variable
      form.append('dependencies', JSON.stringify(dependencies));
      form.append('isPublic', String(!!options.public));

      // Upload to API
      const API_URL = process.env.TRICOX_API_URL || 'http://localhost:3000';
      
      try {
        const response = await axios.post(`${API_URL}/components/ship`, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': token
            }
        });
        console.log(chalk.green('🚀 Component shipped successfully!'));
      } catch (apiError: any) {
         console.error(chalk.red('Failed to upload component:'), apiError.response?.data?.message || apiError.message);
      }

    } catch (err: any) {
      console.error(chalk.red('Error shipping component:'), err);
    }
}
