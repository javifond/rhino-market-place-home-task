# Rhino Marketplace Monorepo

A high-performance, white-label marketplace monorepo built with **Next.js 16.1**, **Turborepo**, **pnpm 10**, and **Playwright**.

This project demonstrates a multi-brand architecture where multiple frontend applications share a common UI kit, types, and logic while maintaining distinct visual identities and feature sets.

## Quick Start

### Prerequisites

- Node.js 20.9+
- pnpm 10+
- Docker & Docker Compose (optional, for containerized deployment)

### Installation

```bash
pnpm install
pnpm simple-git-hooks  # Setup pre-commit hooks (once after install)
```

### Environment Setup

Create `.env.local` in each app directory:

```bash
# apps/project-a/.env.local
JWT_SECRET=your-secret-must-be-at-least-32-characters-long
NEXT_PUBLIC_APP_NAME=Project A
```

```bash
# apps/project-b/.env.local
JWT_SECRET=your-secret-must-be-at-least-32-characters-long
NEXT_PUBLIC_APP_NAME=Project B
```

### Running Development Server

```bash
pnpm dev              # Start all apps (project-a: 3000, project-b: 3001)
pnpm dev:project-a    # Start only Brand A (port 3000)
pnpm dev:project-b    # Start only Brand B (port 3001)
```

## Project Overview

### Brands

| Brand | Port | Theme | Nav Position | Card Layout | Categories |
|-------|------|-------|--------------|-------------|------------|
| project-a | 3000 | Green (#16a34a) | Top | Vertical | Hidden |
| project-b | 3001 | Red (#dc2626) | Side | Horizontal | Shown |

### Monorepo Structure

```
rhino-monorepo/
├── apps/
│   ├── project-a/          # Brand A Next.js app
│   └── project-b/          # Brand B Next.js app
├── packages/
│   ├── ui/                 # @repo/ui — Shared components + CSS tokens
│   ├── types/              # @repo/types — TypeScript interfaces
│   ├── constants/          # @repo/constants — Routes, markets, feature flags
│   ├── typescript-config/  # @repo/typescript-config — Shared tsconfig presets
│   └── e2e/                # @repo/e2e — Playwright E2E tests
├── biome.json              # Root Biome config (replaces ESLint + Prettier)
├── turbo.json              # Turborepo pipeline
├── docker-compose.yml      # Docker orchestration
└── pnpm-workspace.yaml     # Workspace configuration
```

## Available Scripts

### Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm dev:project-a` | Start Brand A only (port 3000) |
| `pnpm dev:project-b` | Start Brand B only (port 3001) |

### Build

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all apps for production |
| `pnpm build:project-a` | Build Brand A only |
| `pnpm build:project-b` | Build Brand B only |

### Code Quality

| Command | Description |
|---------|-------------|
| `pnpm check-types` | TypeScript type checking across workspace |
| `pnpm lint` | Lint with Biome (auto-fix) |
| `pnpm check` | Lint + format with Biome (auto-fix) |
| `pnpm check:ci` | Lint + format (CI mode, no fixes) |

### Testing

| Command | Description |
|---------|-------------|
| `pnpm test` | Run all Jest unit tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm --filter project-a test` | Run tests for specific app |
| `pnpm --filter @repo/ui test` | Run tests for specific package |

### Docker

| Command | Description |
|---------|-------------|
| `pnpm docker:build` | Build both brand Docker images |
| `pnpm docker:build:a` | Build project-a image only |
| `pnpm docker:build:b` | Build project-b image only |
| `pnpm docker:up` | Start both containers (detached) |
| `pnpm docker:down` | Stop and remove containers |
| `pnpm docker:logs` | Tail logs from both containers |

## Testing

### Unit Tests (Jest)

```bash
pnpm test                        # All unit tests
pnpm --filter project-a test     # App-specific tests
pnpm --filter @repo/ui test      # Package-specific tests
```

### E2E Tests (Playwright)

```bash
pnpm test:e2e                    # Run full suite (both brands)
```

Playwright tests both apps in parallel:
- `project-a` on port 3000
- `project-b` on port 3001

Tests cover: authentication flows, product listing, product detail, and brand-specific rendering.

## Docker Deployment

### Quick Start

```bash
# Build and run both brands
docker-compose up --build

# Or use pnpm scripts
pnpm docker:build && pnpm docker:up
```

### Individual Brand Deployment

```bash
# Build and run only Brand A
pnpm docker:build:a && pnpm docker:up:a

# Build and run only Brand B
pnpm docker:build:b && pnpm docker:up:b
```

### Environment Variables for Docker

Set in `docker-compose.override.yml` (gitignored) or via environment:

```yaml
services:
  project-a:
    environment:
      - JWT_SECRET=your-production-secret-min-32-chars
```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `JWT_SECRET` | Yes | JWT signing key (min 32 chars) | `your-secret-min-32-chars...` |
| `NEXT_PUBLIC_APP_NAME` | No | Brand display name | `Project A` |
| `NODE_ENV` | Auto | Environment mode | `production` |

## Test Credentials

| Brand | Email | Password |
|-------|-------|----------|
| project-a | `user@project-a.com` | `password123` |
| project-a | `admin@project-a.com` | `password123` |
| project-b | `user@project-b.com` | `password123` |
| project-b | `admin@project-b.com` | `password123` |

## Further Reading

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Detailed architecture decisions, diagrams, and patterns

## License

Private — Rhino Entertainment Group
