# Rhino Marketplace Monorepo

A high-performance, white-label marketplace monorepo built with **Next.js 15**, **Turborepo**, **pnpm**, and **Playwright**.

This project demonstrates a multi-brand architecture where multiple frontend applications share a common UI kit, types, and logic while maintaining distinct visual identities and feature sets.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker & Docker Compose (optional)

### Installation
```bash
pnpm install
```

### Development
Start all applications and packages in development mode:
```bash
pnpm dev
```

Target specific brands:
```bash
npm run dev:project-a # Port 3000
npm run dev:project-b # Port 3001
```

## 🏗 Architecture

The monorepo is structured as follows:

- `apps/`
  - `project-a`: Next.js app for Brand A (Green theme, vertical layout).
  - `project-b`: Next.js app for Brand B (Red theme, horizontal layout).
- `packages/`
  - `@repo/ui`: Shared React component library (Client & Server components).
  - `@repo/types`: Shared TypeScript definitions.
  - `@repo/constants`: Shared configuration, routes, and feature flags.
  - `@repo/e2e`: Playwright E2E test suite.
  - `@repo/typescript-config`: Shared TS configurations.

## 🎨 White-Labeling & Branding

Branding is handled via **CSS Custom Properties** and **Component Overrides**.

1. **Theming**: Each app defines its own design tokens in `app/globals.css`.
2. **Feature Flags**: Controlled in `packages/constants/src/featureFlags.ts` with brand-level overrides.
3. **Layouts**: Apps use the same `@repo/ui` components but configure them via props (e.g., `navPosition`).

## 🧪 Testing

### E2E Tests (Playwright)
Run the full test suite across both brands:
```bash
npm run test:e2e
```

### Unit Tests (Jest)
Run unit tests for all packages and apps:
```bash
pnpm test
```

## 🐳 Docker Deployment

The project is optimized for containerization using Next.js **standalone mode**.

### Standard Setup
```bash
docker-compose up --build
```

### Legacy Hardware (No buildx 0.17 support)
If your system doesn't support the latest buildx features:
```bash
npm run docker:build
npm run docker:up
```

## 🛠 Project CLI

We provide targeted scripts in the root `package.json` for common brand workflows:

- `build:project-a` / `build:project-b`
- `dev:project-a` / `dev:project-b`
- `docker:build` / `docker:up`

## 🛡 Security

Authentication is implemented using **JWT (JSON Web Tokens)** stored in secure, http-only cookies.
Session validation happens at the **Middleware** layer for high-performance route protection.
