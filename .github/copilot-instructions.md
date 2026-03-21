# Copilot Instructions — TaskFlow

This file is the repository-wide source of truth for Copilot behavior in this repo.
Use it together with path-scoped instructions in `.github/instructions/`.

## Repo Profile

- Product type: `pnpm` workspace with separate web and API apps.
- Product focus: activity, habit, and task planning with an emphasis on focus, realism, and reducing overwhelm.
- Stack: Vue 3, Vite 5, Pinia, Vue Router, Tailwind CSS 4, TypeScript on the web app; Express with TypeScript on the API app.
- Architecture: frontend code lives under `apps/web/src/` with feature modules in `modules/`, shared UI in `core/`, route-level views in `pages/`, and layouts in `layouts/`. API routes and in-memory data live under `apps/api/src/`. Shared reusable UI package code lives under `packages/ui/`.

## Verified Commands

Only reference commands that exist today:

```bash
pnpm install
pnpm dev
pnpm build
pnpm dev:web
pnpm dev:api
pnpm dev:storybook
pnpm build:web
pnpm build:api
pnpm build:storybook
pnpm build:ui
```

Do not invent `pnpm test`, `pnpm lint`, formatter, or preview commands at the repo root. No test runner, linter, or CI pipeline is configured yet.

## Global Codebase Rules

1. Prefer live code and `package.json` over stale documentation when they disagree.
2. Keep module boundaries clean. Code in `apps/web/src/modules/<feature>/` may depend on `apps/web/src/core/` but should not import from other feature modules unless the existing architecture already does so and the change is intentional.
3. Shared reusable UI primitives may live in `packages/ui/` when they are intended to be reused across app boundaries or documented in Storybook. App-specific shared UI belongs in `apps/web/src/core/components/`.
4. New pages should use the `View.vue` suffix. Layouts should use the `Layout.vue` suffix.
5. Prefer TypeScript for new code and keep types close to the owning module.
6. Use the `@/` alias for imports into `apps/web/src/`.
7. Preserve the current product reality: the web app is frontend-first and the API app uses in-memory data unless the user explicitly asks for deeper backend work.
8. Treat `apps/web/src/pages/TodayPage.vue` as a legacy hotspot. Avoid extending it unless the change is explicitly about migration.

## Quality Expectations

1. Fix root causes, not only symptoms.
2. Keep diffs focused. Do not mix product changes with workflow customization changes unless the task requires both.
3. When working in the UI, account for accessibility, mobile layout, loading and empty states, and form error handling.
4. Avoid brittle Tailwind patterns such as dynamic class construction that cannot be statically discovered without an explicit safelist or token map.
5. When review feedback is requested, use the repository review taxonomy:
	- `blocker`
	- `high`
	- `medium`
	- `low`
	- `nit`
	- `praise`

## Customization Layout

The current customization system is organized as follows:

- `.github/copilot-instructions.md`: repo-wide rules.
- `.github/instructions/tech/*.instructions.md`: technology and implementation rules.
- `.github/instructions/domains/*.instructions.md`: product and domain rules.
- `.github/prompts/opsx-*.prompt.md`: OpenSpec workflow entry points.
- `.github/skills/openspec-*`: OpenSpec workflow skills.

## Primary Context Sources

Use these in priority order when relevant:

1. `package.json`
2. `apps/web/package.json`
3. `apps/api/package.json`
4. `apps/web/src/`
5. `apps/api/src/`
6. `.github/instructions/`
7. `openspec/changes/`
8. `artifacts/repo_facts.json`

## Workflow Guidance

1. Use `/opsx:new` or `/opsx:propose` to create a new OpenSpec change.
2. Use `/opsx:explore` for investigation and option analysis without implementation.
3. Use `/opsx:apply` to implement approved OpenSpec tasks.
4. Use `/opsx:archive` after all change tasks are complete.
5. When workflows mention validation, they must explicitly reflect the lack of automated tests and linting in this repo.
