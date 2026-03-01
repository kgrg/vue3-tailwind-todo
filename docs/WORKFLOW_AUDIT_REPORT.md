# Workflow Audit Report

> Generated: 2026-03-01 | Action: `create` | Generator: `workflow-manager.prompt.md`

---

## 1. Repo Summary

| Field | Value |
|---|---|
| **Name** | justdo-vue (TaskFlow) |
| **Version** | 0.0.0 |
| **Type** | Single-package Vue 3 application |
| **Package Manager** | pnpm (>= 8.6.12) |
| **Build Tool** | Vite 5 |
| **Framework** | Vue 3.4 + Pinia 2.1 + Vue Router 4.5 |
| **Styling** | Tailwind CSS 4.1 (via @tailwindcss/vite plugin) |
| **Language** | TypeScript (mixed — some JS files remain) |
| **CI/CD** | None configured |
| **Test Runner** | None installed |
| **Linter/Formatter** | None configured |

### Verified Commands (from `package.json`)

| Command | Underlying | Evidence |
|---|---|---|
| `pnpm dev` | `vite` | `package.json` scripts |
| `pnpm build` | `vite build` | `package.json` scripts |
| `pnpm preview` | `vite preview` | `package.json` scripts |

> **Note:** `document/framework/testing.md` lists `test`, `test:watch`, `test:coverage`, `test:unit`, `test:verbose` scripts — these do **not** exist in `package.json` and are aspirational only.

---

## 2. Kit Completeness

**15 / 15 target kit files exist → 100%** (after `action=create` run)

| # | Target File | Status |
|---|---|---|
| 1 | `.github/copilot-instructions.md` | :white_check_mark: Created |
| 2 | `.github/agents/planner.agent.md` | :white_check_mark: Created |
| 3 | `.github/agents/implementer.agent.md` | :white_check_mark: Created |
| 4 | `.github/agents/reviewer.agent.md` | :white_check_mark: Created |
| 5 | `.github/agents/test-writer.agent.md` | :white_check_mark: Created |
| 6 | `.github/agents/release.agent.md` | :white_check_mark: Created |
| 7 | `.github/prompts/plan-feature.prompt.md` | :white_check_mark: Created |
| 8 | `.github/prompts/implement-feature.prompt.md` | :white_check_mark: Created |
| 9 | `.github/prompts/review-changes.prompt.md` | :white_check_mark: Created |
| 10 | `.github/prompts/generate-tests.prompt.md` | :white_check_mark: Created |
| 11 | `.github/prompts/prepare-release.prompt.md` | :white_check_mark: Created |
| 12 | `docs/REPO_MAP.md` | :white_check_mark: Created |
| 13 | `docs/BUILD_MATRIX.md` | :white_check_mark: Created |
| 14 | `docs/DEPENDENCY_GRAPH.md` | :white_check_mark: Created |
| 15 | `docs/ARCH_SUMMARY.md` | :white_check_mark: Created |

Also updated:
- `artifacts/repo_facts.json` — overwritten with latest scan
- `docs/WORKFLOW_AUDIT_REPORT.md` — this file

---

## 3. Findings (Repo-Level Risks & Gaps)

| # | Scope | Severity | Issue | Description | Evidence |
|---|---|---|---|---|---|
| 1 | Repo | **High** | No CI/CD | No `.github/workflows/` directory or files. All builds/tests/deploys are manual. | `.github/` directory scan |
| 2 | Repo | **High** | No test runner | `package.json` has no test scripts. No jest/vitest/@vue/test-utils installed. `document/framework/testing.md` describes jest but it's aspirational. | `package.json`, `document/framework/testing.md` |
| 3 | Repo | **High** | No linting/formatting | No ESLint or Prettier config found. No lint/format scripts in `package.json`. | `package.json` |
| 4 | Repo | **Medium** | `ts-node` misplaced | `ts-node@10.9.2` listed as runtime dependency; should be devDependency. | `package.json` |
| 5 | Repo | **Medium** | Page naming inconsistency | Both `TodayPage.vue` and `TodayView.vue` exist in `src/pages/`. Convention unclear. | `src/pages/TodayPage.vue`, `src/pages/TodayView.vue` |
| 6 | Repo | **Medium** | Legacy store not migrated | `src/stores/todoStore.js` (plain JS) coexists with typed `src/modules/tasks/stores/todoStore.ts`. | `src/stores/todoStore.js`, `src/modules/tasks/stores/todoStore.ts` |
| 7 | Repo | **Medium** | ActivityListView overloaded | Same component serves 6 routes (upcoming, activities, categories, tags, completed, settings) with no differentiation. | `src/router/index.ts` |
| 8 | Repo | **Low** | Redundant `heroicons` dep | `heroicons@2.2.0` installed alongside `@heroicons/vue@2.2.0`; base package unnecessary. | `package.json` |
| 9 | Repo | **Low** | Chart.js tree-shaking | `Chart.register(...registerables)` in `main.ts` loads all chart types. | `src/main.ts` |

---

## 4. Recommended Actions

### High Priority (repo health)

1. **Set up a test runner.** Install vitest + @vue/test-utils and add test scripts to `package.json`. The test-writer agent and generate-tests prompt are ready but blocked by this.

2. **Add ESLint + Prettier.** Configure `eslint` with `@vue/eslint-config-typescript` and `prettier` for consistent code quality.

3. **Create a CI pipeline.** Add `.github/workflows/ci.yml` with: install → lint → type-check → build. Add test step once a runner is configured.

### Medium Priority

4. **Resolve page naming convention.** Pick `*View.vue` (recommended) and remove `TodayPage.vue`.

5. **Clean up legacy stores.** Remove `src/stores/todoStore.js` since `src/modules/tasks/stores/todoStore.ts` is the replacement.

6. **Move `ts-node` to devDependencies.** It's a tooling dependency, not a runtime one.

7. **Create route-specific components** for settings, completed, and analytics instead of reusing `ActivityListView.vue`.

### Low Priority

8. **Remove `heroicons`** base package from dependencies (keep only `@heroicons/vue`).

9. **Register only needed Chart.js components** instead of `...registerables`.

---

## Appendix: Files Created/Updated in This Run

| File | Action |
|---|---|
| `.github/copilot-instructions.md` | Created (overwrite) |
| `.github/agents/planner.agent.md` | Created |
| `.github/agents/implementer.agent.md` | Created |
| `.github/agents/reviewer.agent.md` | Created |
| `.github/agents/test-writer.agent.md` | Created |
| `.github/agents/release.agent.md` | Created |
| `.github/prompts/plan-feature.prompt.md` | Created |
| `.github/prompts/implement-feature.prompt.md` | Created |
| `.github/prompts/review-changes.prompt.md` | Created |
| `.github/prompts/generate-tests.prompt.md` | Created |
| `.github/prompts/prepare-release.prompt.md` | Created |
| `docs/REPO_MAP.md` | Created |
| `docs/BUILD_MATRIX.md` | Created |
| `docs/DEPENDENCY_GRAPH.md` | Created |
| `docs/ARCH_SUMMARY.md` | Created |
| `artifacts/repo_facts.json` | Updated (overwrite) |
| `docs/WORKFLOW_AUDIT_REPORT.md` | Updated (this file) |

## Appendix: Files Read

| Path | Purpose |
|---|---|
| `package.json` | Manifest: scripts, deps |
| `vite.config.ts` | Build config |
| `src/main.ts` | App entry point |
| `src/router/index.ts` | Route definitions |
| `src/App.vue` | Root component |
| `src/modules/activities/store/activities.store.ts` | Activity store pattern |
| `src/modules/activities/types/activity.types.ts` | Activity types |
| `src/modules/auth/store/auth.store.ts` | Auth store pattern |
| `src/modules/habits/store/habits.store.ts` | Habit store pattern |
| `src/modules/tasks/stores/todoStore.ts` | Task store (Composition API) |
| `src/pages/*.vue` | All page components |
| `src/layouts/*.vue` | All layout components |
| `src/modules/activities/components/*.vue` | Activity components |
| `index.html` | HTML entry |
| `README.md` | Project overview |
| `document/framework/*.md` | Internal documentation |

> Full repo facts: [`artifacts/repo_facts.json`](../artifacts/repo_facts.json)
