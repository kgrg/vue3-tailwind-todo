---
applyTo: "src/**/*.vue,src/**/*.ts,src/**/*.js,vite.config.ts,tailwind.config.ts,tsconfig.json,tsconfig.node.json"
---

# Vue Frontend Rules

Apply these rules to application code in `src/` and the frontend toolchain.

## Architecture

1. Treat this repo as a frontend-first application with no production backend layer in the workspace.
2. Preserve the current layering:
   - `src/pages/` composes features and shared UI.
   - `src/layouts/` owns route shells and navigation structure.
   - `src/modules/` owns feature behavior.
   - `src/core/` owns reusable primitives and shared infrastructure.
3. Prefer extending an existing module over creating a new top-level architectural concept.
4. Do not create cross-module imports between feature folders unless the design explicitly introduces a shared abstraction in `src/core/`.

## Vue and TypeScript

1. Use `script setup` with `lang="ts"` for new Vue components unless the surrounding file pattern clearly requires otherwise.
2. Prefer explicit prop and emit typing.
3. Keep component state local unless it is shared, persisted, or route-level. Shared state belongs in Pinia.
4. Prefer computed state and simple methods over watcher-heavy logic.

## Stores, Types, and Routing

1. Default store pattern is Pinia Option API with typed state to match the repo convention.
2. The tasks module already contains a Composition API store. Do not spread that pattern into unrelated modules without a clear reason.
3. Keep store types in the owning module’s `types/` directory.
4. Register routes in `src/router/index.ts` under the correct layout.
5. Use route names that describe user-visible behavior, not implementation detail.

## Imports and File Placement

1. Use the `@/` alias for imports into `src/`.
2. Shared base components belong in `src/core/components/`.
3. Feature-specific components belong in `src/modules/<feature>/components/`.
4. New route-level screens belong in `src/pages/` unless they are explicitly auth-only pages that already live in a module.

## Tooling Constraints

1. Do not assume a test runner, linter, formatter, API client, or server framework exists.
2. If a requested change genuinely needs new tooling, call that out explicitly and keep the setup small and verifiable.