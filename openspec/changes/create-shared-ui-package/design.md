## Context

TaskFlow is currently a `pnpm` workspace with only `apps/web` and `apps/api`. Reusable Vue components already exist, but they live directly inside the web app at `apps/web/src/core/components`, which couples the component library to one application and leaves no dedicated surface for package-level reuse or documentation. The requested change introduces a shared UI package and requires Storybook-based component documentation, which adds both a new workspace package and a new developer workflow.

This is a cross-cutting workspace change because it touches package boundaries, dependency management, component ownership, and frontend documentation. It also introduces new tooling that must coexist with the existing Vite-based setup.

## Goals / Non-Goals

**Goals:**
- Create a dedicated workspace UI package for reusable Vue components.
- Establish Storybook as the component documentation surface for that package.
- Migrate an initial set of reusable web components so `apps/web` consumes them from the shared package.
- Keep the first migration focused on primitives and shared building blocks rather than a full design-system rewrite.

**Non-Goals:**
- Rewrite all web UI in one pass.
- Change the visual design language beyond what is needed to package and document components.
- Build a multi-framework component library or publish the package outside the monorepo in this change.

## Decisions

### Introduce a `packages/ui` workspace package
The shared library should live in a dedicated workspace package, rather than inside `apps/web`, so ownership and imports become explicit and future app reuse remains possible.

Alternative considered: keep components in `apps/web` and add Storybook there. Rejected because it documents the components but does not create an actual shared package boundary.

### Start with existing reusable primitives from `apps/web/src/core/components`
The first adoption slice should focus on components already behaving like shared primitives, such as base form and card components, instead of feature-owned UI.

Alternative considered: start with feature components. Rejected because feature components carry tighter page and store coupling, making the first migration riskier.

### Use Storybook for package-level documentation and visual states
Storybook should live alongside the shared UI package so component docs, examples, and states are maintained close to the source package.

Alternative considered: generate static markdown docs only. Rejected because the user explicitly asked for Storybook and interactive component states are more useful for UI primitives.

### Keep package adoption incremental
The web app should consume migrated components from the package as they are proven, rather than moving every component at once.

Alternative considered: full immediate migration. Rejected because it increases blast radius and makes it harder to isolate packaging issues from runtime regressions.

## Risks / Trade-offs

- [Risk] Storybook tooling may need extra Vite or Vue integration work in this repo. → Mitigation: keep Storybook setup explicit and scoped to the shared package workflow.
- [Risk] Some current base components may rely on app-local aliases or styles. → Mitigation: start with components that have the cleanest dependency surface and normalize imports during migration.
- [Risk] Package extraction can break web imports or style resolution. → Mitigation: migrate incrementally and validate `apps/web` build behavior after each adoption step.
- [Risk] Workspace scripts may become inconsistent if Storybook commands are added casually. → Mitigation: define package-local scripts clearly and only expose root scripts that are intentionally supported.

## Migration Plan

1. Expand the workspace to include `packages/*`.
2. Scaffold `packages/ui` with Vue-compatible package metadata, source entrypoints, and shared component exports.
3. Add Storybook configuration and stories for the shared UI package.
4. Move or recreate a first batch of reusable primitives in the package.
5. Update `apps/web` to import those shared primitives from the package.
6. Validate build behavior and Storybook startup, then continue incremental migration in later changes if needed.

Rollback can be done by reverting the workspace and package changes and restoring imports back to `apps/web/src/core/components`.

## Open Questions

- Which exact initial component set should be moved in the first slice.
- Whether the shared package needs its own build step immediately or can rely on source consumption within the workspace at first.
- Whether Storybook should be run from the package directory only or also exposed through root scripts.