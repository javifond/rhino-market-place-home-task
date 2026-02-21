# Base image with pnpm support
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Build stage
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install turbo
RUN npm install -g turbo

# Copy the entire monorepo
COPY . .

# Generate a pruned version of the monorepo for the target app
ARG APP_NAME
RUN turbo prune --scope=$APP_NAME --docker

# Final Build stage
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
ARG APP_NAME

# Copy pruned files from builder
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the pruned source
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/turbo.json ./turbo.json

# Build the app
RUN pnpm turbo build --filter=$APP_NAME

# Production Runner
FROM base AS runner
WORKDIR /app
ARG APP_NAME
ARG PORT=3000

ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOSTNAME="0.0.0.0"
ENV APP_NAME=$APP_NAME

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
# Next.js standalone mode bundles everything needed into .next/standalone
COPY --from=installer /app/apps/$APP_NAME/package.json .
COPY --from=installer /app/apps/$APP_NAME/next.config.ts .
COPY --from=installer --chown=nextjs:nodejs /app/apps/$APP_NAME/.next/standalone ./

# Static assets are not in standalone and must be copied manually
COPY --from=installer --chown=nextjs:nodejs /app/apps/$APP_NAME/.next/static ./apps/$APP_NAME/.next/static

# Note: public directory is skipped as it is not present in this project

USER nextjs
EXPOSE $PORT

CMD ["sh", "-c", "node apps/${APP_NAME}/server.js"]
