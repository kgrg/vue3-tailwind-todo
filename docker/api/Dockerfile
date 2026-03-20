# ── Stage 1: Install + Build ──────────────────────────────────
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

WORKDIR /app

# Copy workspace root manifests first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy app manifests
COPY apps/web/package.json apps/web/
COPY apps/api/package.json  apps/api/

RUN pnpm install --frozen-lockfile

# Copy API source
COPY apps/api/ apps/api/
COPY vite.config.ts ./

RUN pnpm --filter @taskflow/api build

# ── Stage 2: Production runtime ──────────────────────────────
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/

RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/apps/api/dist apps/api/dist

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "apps/api/dist/index.mjs"]
