# ── Stage 1: Install + Build ──────────────────────────────────
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

WORKDIR /app

# Copy workspace root manifests first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy app manifests (needed for pnpm install --frozen-lockfile)
COPY apps/web/package.json apps/web/
COPY apps/api/package.json  apps/api/

RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/web/ apps/web/
COPY vite.config.ts ./

RUN pnpm --filter @taskflow/web build

# ── Stage 2: Serve with Nginx ────────────────────────────────
FROM nginx:stable-alpine

COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
