# 🚀 TRICOX - Premium Component Registry

Tricox is a high-performance, private component registry designed for modern frontend teams. It allows you to synchronize, version, and manage React components across multiple projects using source-code delivery.

## 📁 1. Project Setup (Monorepo)

The project is structured as a monorepo using **Turborepo** and **npm workspaces**.

### Initial Installation
From the root directory:
```bash
npm install
```

### Starting Development
```bash
npm run dev
```
- **Web App**: http://localhost:3001
- **API Server**: http://localhost:3000

---

## 🏗️ 2. CLI Setup & Build (Important)

The Tricox CLI is the primary bridge between your local development and the registry.

### Build and Install CLI
To use the `tricox` command globally:
```bash
# 1. Navigate to the CLI package
cd packages/cli

# 2. Build the CLI source code (using TypeScript compiler)
npm run build

# 3. Link the package globally
npm link
```
*Now you can run the `tricox` command from any directory on your computer.*

---

## 🛠️ 3. CLI Commands Reference

Tricox CLI provides a powerful set of commands to manage your component lifecycle.

| Command | Usage | Description |
|:--- |:--- |:--- |
| **`auth`** | `tricox auth --token=<token>` | Securely authenticate your local machine. |
| **`ship`** | `tricox ship <path> [options]` | Upload a component to your organization registry. |
| **`dock`** | `tricox dock <org>/<name>` | Download and install a component into your project. |
| **`list`** | `tricox list` | Display all components in your current organization. |
| **`info`** | `tricox info` | View details about your current session and active org. |
| **`launch`** | `tricox launch` | Start the local CLI interface context. |
| **`switch`** | `tricox switch` | Quickly change between different organizations. |
| **`update`** | `tricox update <component>` | Update an existing component to a new version. |

---

## 🗄️ 4. Database Setup

Tricox uses **Prisma** with **SQLite** for a lightweight yet powerful database layer.

1. **Initialize Database**:
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma db push
   ```
2. **First-Time Admin Access**:
   Log in with the following credentials to auto-seed the Admin account:
   - **Email**: `admin@gmail.com`
   - **Password**: `123456`
3. **Inspect Data**:
   ```bash
   npx prisma studio
   ```

---

## 🔐 5. Environment Setup (ENV)

Create the following files in their respective directories:

### Backend (`apps/api/.env`)
```env
DATABASE_URL="file:./dev.db"

# GitHub OAuth
GITHUB_CLIENT_ID="your_client_id"
GITHUB_CLIENT_SECRET="your_client_secret"
```
---
## 🌐 6. GitHub OAuth Setup

To enable "Login with GitHub", configure your OAuth App:

1. **Homepage URL**: `http://localhost:3001`
2. **Callback URL**: `http://localhost:3001/auth/callback`
3. **Credentials**: Once registered, copy the **Client ID** and **Client Secret** into the `.env` files above.

---

## 📦 7. Production Build

To build the entire ecosystem (Web, API, CLI) at once:
```bash
npm run build
```

The production assets will be generated in each package's `dist` or `.next` folder.
