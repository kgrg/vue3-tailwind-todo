# Copilot Instructions — TaskFlow

This file is the repository-wide source of truth for Copilot behavior in this repo.
Use it together with path-scoped instructions in `.github/instructions/`.

## Repo Profile

- Product type: single-package Vue 3 application, not a monorepo.
- Product focus: activity, habit, and task planning with an emphasis on focus, realism, and reducing overwhelm.
- Stack: Vue 3, Vite 5, Pinia, Vue Router, Tailwind CSS 4, TypeScript with some legacy JS.
- Architecture: feature modules under `src/modules/`, shared UI and infrastructure under `src/core/`, route-level views under `src/pages/`, layouts under `src/layouts/`.

## Verified Commands

Only reference commands that exist today:

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

Do not invent `pnpm test`, `pnpm lint`, or formatter commands. No test runner, linter, or CI pipeline is configured yet.

## Global Codebase Rules

1. Prefer live code and `package.json` over stale documentation when they disagree.
2. Keep module boundaries clean. Code in `src/modules/<feature>/` may depend on `src/core/` but should not import from other feature modules unless the existing architecture already does so and the change is intentional.
3. Shared UI belongs in `src/core/components/`. Feature-specific UI belongs in the owning module.
4. New pages should use the `View.vue` suffix. Layouts should use the `Layout.vue` suffix.
5. Prefer TypeScript for new code and keep types close to the owning module.
6. Use the `@/` alias for imports into `src/`.
7. Preserve the current product reality: client-side data, no backend integration, no hidden service layer assumptions unless the user explicitly asks for that work.
8. Treat `src/stores/todoStore.js` and `src/pages/TodayPage.vue` as legacy hotspots. Avoid extending them unless the change is explicitly about migration.

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
- `.github/agent/*.agent.md`: durable workflow agents and specialist reviewers.
- `.github/skills/*`: reusable operational workflows such as GitHub PR publishing.

Legacy files under `.github/agents/` and `.github/prompts/` may still exist. Do not add new source-of-truth files there.

## Primary Context Sources

Use these in priority order when relevant:

1. `package.json`
2. `src/`
3. `docs/ARCH_SUMMARY.md`
4. `docs/REPO_MAP.md`
5. `docs/DEPENDENCY_GRAPH.md`
6. `docs/WORKFLOW_AUDIT_REPORT.md`
7. `document/development/`
8. `document/product/`

## Workflow Guidance

1. Planning agents should produce implementation-ready scopes with exact files and acceptance criteria.
2. Implementation agents should stay within approved scope and call out missing tooling rather than inventing it.
3. Review agents should separate analysis from GitHub publishing. They report findings; the publisher skill posts them.
4. Release workflows must explicitly mention the lack of automated tests and linting.
