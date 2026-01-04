import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.tricox');
const TOKEN_PATH = path.join(CONFIG_DIR, 'token');
const CONFIG_PATH = path.join(process.cwd(), '.tricox', 'config.json');

export async function saveToken(token: string): Promise<void> {
  await fs.ensureDir(CONFIG_DIR);
  await fs.writeFile(TOKEN_PATH, token, 'utf-8');
}

export async function getToken(): Promise<string | null> {
  if (await fs.pathExists(TOKEN_PATH)) {
    return fs.readFile(TOKEN_PATH, 'utf-8');
  }
  return null;
}

export async function loadProjectConfig(): Promise<any> {
    if (await fs.pathExists(CONFIG_PATH)) {
        return fs.readJSON(CONFIG_PATH);
    }
    return null;
}


export async function createProjectConfig(config: any): Promise<void> {
    const dir = path.dirname(CONFIG_PATH);
    await fs.ensureDir(dir);
    await fs.writeJSON(CONFIG_PATH, config, { spaces: 2 });
}

export async function updateProjectConfig(updates: any): Promise<void> {
    if (await fs.pathExists(CONFIG_PATH)) {
        const config = await fs.readJSON(CONFIG_PATH);
        const newConfig = { ...config, ...updates };
        await fs.writeJSON(CONFIG_PATH, newConfig, { spaces: 2 });
    }
}
