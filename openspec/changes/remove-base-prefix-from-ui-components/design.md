## Context

The repository currently uses `Base*` to label reusable primitives in two places: the shared package exported from `@taskflow/ui` and a smaller set of app-local primitives under `apps/web/src/core/components`. That naming convention was easier to justify before the shared package existed, because it helped distinguish generic primitives from feature-owned components inside the web app.

Now the package boundary already carries most of that meaning. Consumers importing from `@taskflow/ui` know they are using shared primitives, and the `Base` prefix makes the package API and Storybook catalog noisier than the feature component surface. This rename is cross-cutting because it touches package exports, component filenames, Storybook entries, app imports, documentation, and the transition plan for app-local primitives that still use `Base*`.

## Goals / Non-Goals

**Goals:**
- Define a cleaner plain-name public API for reusable shared UI components.
- Keep the package, Storybook, and web-app adoption points aligned on one naming convention.
- Prevent a long-lived mixed state where both `BaseButton` and `Button` appear equally canonical.
- Make an intentional decision about the remaining app-local `Base*` primitives so the repo naming story stays coherent.

**Non-Goals:**
- Redesign the components or change their product behavior.
- Rename unrelated feature components such as `ActivityCard` or `HabitCard`.
- Expand the shared UI package with additional components beyond what is needed for naming alignment.

## Decisions

### Use plain component names as the shared package public API
The shared package should expose components as `Button`, `Card`, `Input`, and similar plain names, because the package boundary already communicates that they are reusable primitives.

Alternative considered: keep `Base*` forever. Rejected because it keeps the package API verbose while providing limited extra semantic value once the shared package is the ownership boundary.

### Treat this as a coordinated naming migration, not ad hoc cleanup
The rename should be planned across filenames, exports, imports, and Storybook titles rather than allowing both naming styles to drift in parallel indefinitely.

Alternative considered: rename files opportunistically as components are touched. Rejected because it creates a long period of mixed conventions and makes it harder for contributors to know which names are canonical.

### Decide compatibility aliases intentionally
The implementation should explicitly choose between temporary alias exports such as `export { default as BaseButton } from './Button.vue'` and a single-pass breaking rename. Either can work, but the repo should pick one documented migration strategy.

Alternative considered: silently keep aliases forever. Rejected because permanent aliases dilute the goal of simplifying the API and leave the naming contract ambiguous.

### Keep app-local primitive naming in scope as a migration concern
Even if the first code change focuses on `packages/ui`, the design should account for app-local primitives such as `BaseListItem` and `BaseTag`, because package-level cleanup alone leaves the repo with two competing conventions.

Alternative considered: ignore app-local primitives entirely. Rejected because it solves only the package API while leaving the broader component taxonomy inconsistent.

## Risks / Trade-offs

- [Risk] A breaking rename can touch many imports across the web app. → Mitigation: inventory all current `@taskflow/ui` and local `Base*` usage before implementation and decide whether temporary aliases are worth the extra code.
- [Risk] Temporary aliases can linger and weaken the new naming convention. → Mitigation: if aliases are added, pair them with explicit follow-up removal tasks and documentation.
- [Risk] Renaming package exports without touching Storybook and docs leaves contributors with conflicting guidance. → Mitigation: update exports, story titles, story templates, and documentation in the same change.
- [Risk] The app-local primitives may not belong in `@taskflow/ui` yet, which complicates the end-state naming story. → Mitigation: document whether they stay local with plain names or move to the package later, but do not leave that decision implicit.

## Migration Plan

1. Inventory every `Base*` component in `packages/ui` and `apps/web/src/core/components`, plus all imports and Storybook entries that reference them.
2. Rename the shared package component files, exports, story titles, and story templates to plain names.
3. Update `apps/web` imports from `@taskflow/ui` to use the plain-name exports.
4. Apply the chosen compatibility strategy: either temporary aliases with documented removal steps or a one-pass breaking rename.
5. Rename or explicitly defer app-local primitives such as `BaseListItem` and `BaseTag` so the repository naming convention remains understandable.
6. Validate package build, Storybook startup, and web-app build behavior after the rename.

Rollback is straightforward if the rename is done in one pass: restore the prior filenames, exports, imports, and Storybook titles. If aliases are used, rollback also requires restoring the original canonical names in documentation.

## Open Questions

- Should the implementation include temporary `Base*` alias exports in `@taskflow/ui`, or is a direct breaking rename preferable in this monorepo?
- Should app-local primitives be renamed in the same change, or should the proposal only require an explicit defer decision and follow-up plan?
- Should Storybook titles drop the `Base` segment immediately even if temporary aliases exist for code imports during migration?