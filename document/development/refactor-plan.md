# Architecture Review & Refactor Plan

This document captures a high-level review of the current Vue 3 app architecture and a phased plan to refactor it as a solo founder. The goal is to make the app easier to evolve, safer to change, and more predictable for future features.

## Current Architecture Snapshot

- **App bootstrap**: `main.ts` initializes Vue, Pinia, the router, global CSS, and registers Chart.js globally. This central setup is clear but mixes framework bootstrapping with chart configuration concerns. 
- **Layouts & pages**: Routes render a `DashboardLayout` for the main app and an `AuthLayout` for login, with many dashboard-style pages under `/pages`. This provides a good high-level split but pages contain a lot of UI/data logic inline. 
- **Modules**: Feature modules live under `src/modules` (auth, activities, habits, tasks) with stores, components, and types grouped together. This is good, but usage is uneven (some pages consume module components directly, others access store logic inline). 
- **Stores**: Some stores are TypeScript (activities, habits, auth), while `todoStore` is still JavaScript and uses a different store style. This inconsistency introduces extra cognitive overhead. 
- **Domain data**: The activity store relies on mock data directly inside the store. This is convenient for demos, but it will be a blocker once real persistence is added. 
- **UI composition**: Pages like `DashboardView.vue` contain lots of UI sections, computed state, and chart data in one file. This is fast to build but hard to scale. 

## Key Findings

1. **Mixed store patterns and languages**: Composition API stores and Options API stores coexist, plus JS and TS files in the same domain. This makes cross-feature improvements harder. 
2. **Pages doing too much**: Dashboard and Today pages handle layout, data access, derived stats, and chart configuration in one place. They should delegate to feature-focused components/composables. 
3. **Global configuration leakage**: Chart.js is registered in `main.ts`, but used by only a subset of views. This is a cross-cutting concern that deserves its own plugin/composable. 
4. **Routing drift**: Routes contain placeholder pages (settings, analytics) pointing to reused views. This makes navigation misleading and complicates future expansion. 
5. **Design system is split**: There is a `core/components` library, but pages still implement repeated layout patterns and buttons locally, leading to inconsistency.

## Refactor Goals

- Establish a consistent module architecture and data flow.
- Reduce page complexity by extracting UI sections, charts, and stats into focused components.
- Unify store conventions and TypeScript usage.
- Prepare for backend integration with a clear data access layer.
- Create a small but consistent design system for buttons, cards, and layout primitives.

## Phased Refactor Plan

### Phase 1 — Architecture Alignment (1–2 days)
- Convert the tasks/todo store under `src/modules/tasks/` to TypeScript and align it with the same pattern used in other stores.
- Introduce a `src/plugins/chart.ts` (or `src/core/plugins/chart.ts`) to encapsulate Chart.js registration.
- Normalize naming: align page names (`TodayView` vs `TodayPage`) and create a single convention (e.g., `*View.vue`).
- Add a lightweight `src/core/ui` folder and migrate reusable buttons/cards from inline page usage.

### Phase 2 — Page Decomposition (2–4 days)
- Break `DashboardView.vue` into feature sections:
  - `DashboardStatsGrid`
  - `DashboardTrends`
  - `DashboardRecentActivities`
- Extract chart configs into composables (`useActivityCharts`) or dedicated components that accept data props only.
- Reduce direct store access in pages: move activity stats and derived metrics into the activities store or composables.

### Phase 3 — Data & Domain Layer (3–5 days)
- Replace mock data in the activities store with a local repository layer (`src/modules/activities/api` or `repository`).
- Create a consistent domain model for activities, habits, and tasks (shared types + validators).
- Add an API service wrapper (Axios or Fetch) with typed request/response helpers.

### Phase 4 — Routing & Feature Ownership (2–3 days)
- Create placeholder views for routes like `analytics`, `settings`, and `completed` with explicit ownership, rather than reusing `ActivityListView`.
- Add route-level metadata and guards per feature (e.g., `requiresAuth`) with consistent naming.
- Consider feature-based route modules (`routes/activities.routes.ts`) to keep router/index.ts small.

### Phase 5 — UX Consistency & Testing (ongoing)
- Centralize UI primitives in `core/components` and enforce them in views.
- Add a shared layout grid system (e.g., `DashboardSection` component).
- Introduce component tests for the decomposed dashboard sections and store logic.
- Add linting/prettier rules to enforce the same patterns across modules.

## Suggested Metrics for Progress

- **Page complexity**: target max 150–200 lines per view file.
- **Store consistency**: 100% TypeScript and unified store style.
- **UI reuse**: reduce unique button styles to 1–2 variants.
- **Test coverage**: start with critical stores and UI sections.

## Next Steps

1. Approve the phase plan and decide on a time budget.
2. Start with Phase 1 for consistency and quick wins.
3. Iterate: ship small refactors without breaking layouts.

---

**Owner**: Solo founder 
**Status**: Draft plan
