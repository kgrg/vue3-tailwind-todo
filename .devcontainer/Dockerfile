FROM node:22-bookworm

RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

# Dev-time OS packages
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       git curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
