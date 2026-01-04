import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { loadProjectConfig } from '../utils/config';

export const dockCommand = new Command('dock')
  .description('Dock (install) a component into your project')
  .argument('<component>', 'Component identifier (e.g. @user/Button or Button)')
  .option('-p, --path <path>', 'Custom path to dock the component', 'src/components')
  .action(async (componentStr, options) => {
    try {
      const config = await loadProjectConfig();
      // org might be inferred from config if not provided in componentStr
      // format: @org/component or just component (use config.org)
      
      let org = config?.org;
      let componentName = componentStr;

      if (componentStr.startsWith('@')) {
          const parts = componentStr.substring(1).split('/');
          org = parts[0];
          componentName = parts[1];
      }

      if (!org) {
          console.error(chalk.red('Organization not specified and no config found. Use @org/component format.'));
          process.exit(1);
      }

      console.log(chalk.blue(`Docking ${org}/${componentName}...`));

      const API_URL = process.env.TRICOX_API_URL || 'http://localhost:3000';
      
      try {
        const response = await axios.get(`${API_URL}/components/dock/${org}/${componentName}`);
        const data = response.data;
        // data: { org, component, version, url, metadata, content? }
        // For mock, let's assume content is returned or we download from url.
        // Simplified: API returns content directly for now.
        
        // TODO: In real version, download from S3 URL
        const content = data.content || "// Mock content for " + componentName; 
        
        const targetDir = path.resolve(process.cwd(), options.path);
        const targetPath = path.join(targetDir, `${componentName}.tsx`);
        await fs.ensureDir(path.dirname(targetPath));
        await fs.writeFile(targetPath, content, 'utf-8');

        console.log(chalk.green(`✓ Component docked at ${options.path}/${componentName}.tsx`));

        // Install dependencies
        const deps = data.metadata?.deps || [];
        if (deps.length > 0) {
            console.log(chalk.yellow('Installing dependencies:'), deps.join(', '));
            execSync(`npm install ${deps.join(' ')}`, { stdio: 'inherit' });
        }

      } catch (err: any) {
          console.error(chalk.red('Failed to dock component:'), err.response?.data || err.message);
      }

    } catch (err) {
      console.error(chalk.red('Error docking component:'), err);
    }
  });
