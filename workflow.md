# TRICOX - ADVANCED PROJECT WORKFLOW & ARCHITECTURE

Tricox is a private component registry designed for modern frontend teams. This document provides a deep dive into the architecture, security models, and operational lifecycle of the platform.

---

## 🏗️ 1. CORE ARCHITECTURE

The project is managed as a **Monorepo** using **Turborepo** and **npm workspaces**. This ensures type safety and shared logic across the CLI, Frontend, and Backend.

### Project Breakdown
- **`apps/web`**: A Next.js 14+ application using the App Router. It serves as the management dashboard where users can browse, preview, and manage their component registry visually.
- **`apps/api`**: A NestJS-based REST API providing the business logic, authentication, and data persistence layer.
- **`packages/cli`**: A Node.js CLI tool that developers use locally. It handles the extraction of source code and synchronization with the registry.
- **`packages/shared`**: A internal package containing shared TypeScript definitions to ensure consistency between the API and CLI.

---

## � 2. AUTHENTICATION & SECURITY MODEL

Tricox uses a robust, JWT-less authentication system optimized for both Web and CLI interactions.

### Personal Access Tokens (PAT)
- **Generation**: Users generate tokens in the **Dashboard Settings**.
- **Storage**: Tokens are stored as **SHA-256 hashes** in the database (`PersonalAccessToken` table).
- **Web Auth**: Uses standard session-based or token-based logic stored in `localStorage`.
- **CLI Auth**: Uses the `tricox auth` command to store a raw token locally (user's home dir). Every subsequent API request from the CLI sends this token in the `Authorization` header.
- **Validation**: The API receives the raw token, hashes it, and compares it against the database to identify the user and their organization permissions.

---

## 📊 3. DATA MODEL (PRISMA SCHEMA)

The database (SQLite for development) is structured into four primary models:

1.  **User**: Stores identity and credentials.
2.  **Organization**: Acts as the namespace for components. A User "owns" an organization.
3.  **Component**: Represents a logical unit of UI code (e.g., `Button`). Tied to an Organization.
4.  **Version**: A snapshot of the component's source code at a specific point in time. 
    *   *Note: In this development setup, source code is stored directly in the `s3Key` field for simplicity.*

---

## 🚢 4. COMPONENT LIFECYCLE (WORKFLOWS)

### A. The "Shipping" Flow (Publishing)
1. **Local Identification**: The developer runs `tricox ship path/to/Component.tsx`.
2. **Metadata Extraction**: The CLI reads the file and prepares a `multipart/form-data` request.
3. **API Processing**:
   - Validates the user's token and organization ownership.
   - Creates the `Component` record if it doesn't exist.
   - Generates a new `Version` record (timestamp-based versioning).
   - Stores the raw source code in the database.

### B. The "Docking" Flow (Consumption)
1. **Requirement**: A developer needs a component from the registry: `tricox dock @org/Component`.
2. **API Fetch**: The CLI requests the latest version of the component source code.
3. **Download Tracking**: The API increments the `downloads` counter on the Component record for analytics.
4. **Local Sync**: The CLI receives the source code and writes it to the developer's local file system (defaulting to `src/components`).

---

## � 5. DETAILED SETUP & COMMANDS

### Environment Configuration
The project is designed to be zero-config for the frontend, utilizing a **single environment file** in the API:
- **Location**: `apps/api/.env`
- **Required Keys**: `DATABASE_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`.

### CLI Installation & Build
**CRITICAL**: You must build the CLI before you can use the commands globally.
```bash
cd packages/cli
npm run build
npm link
```

### Full Command Reference
| Command | Action |
|:--- |:--- |
| **`tricox auth --token=<t>`** | Authenticates the local machine for registry access. |
| **`tricox ship <path>`** | Uploads the specified file/folder as a new component version. |
| **`tricox dock <org>/<name>`** | Pulls the latest source code of a component into your local project. |
| **`tricox list`** | Shows all components available within your organization. |
| **`tricox switch`** | Interactive menu to switch between organizations you belong to. |
| **`tricox update <name>`** | Checks for a newer version of a docked component and updates it. |
| **`tricox info`** | Displays currently logged-in user, organization, and token health. |

---

## 🌐 6. PRODUCTION CONSIDERATIONS

- **Storage**: For production, the `s3Key` field in the `Version` model should be updated to point to a real S3/Object Storage bucket instead of storing source code as text in SQLite.
- **Database**: While SQLite is used for local dev, the Prisma schema is compatible with PostgreSQL/MySQL for high-traffic environments.
- **Build**: Running `npm run build` from the root will concurrently compile the Next.js app, the NestJS API, and the TypeScript CLI source code.
