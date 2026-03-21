## 1. Inventory and migration decisions

- [x] 1.1 Inventory every `Base*` component, Storybook story, export, and import affected in `packages/ui` and `apps/web`.
- [x] 1.2 Decide and document whether the rename will use temporary `Base*` compatibility aliases or a one-pass breaking rename.
- [x] 1.3 Decide and document how app-local primitives such as `BaseListItem` and `BaseTag` will be handled in this change versus deferred follow-up work.

## 2. Rename shared package primitives

- [x] 2.1 Rename shared package component files and internal story references from `Base*` names to plain component names.
- [x] 2.2 Update `packages/ui/src/index.ts` and any package-local imports to expose the plain-name component API consistently.
- [x] 2.3 Update Storybook titles, story metadata, and story templates so the shared component catalog presents plain component names as the canonical API.

## 3. Update app consumers and guidance

- [x] 3.1 Update `apps/web` imports from `@taskflow/ui` to consume the renamed plain-name shared components.
- [x] 3.2 Update repository documentation and any implementation notes that currently describe shared primitives with `Base*` names.
- [x] 3.3 Add or update migration guidance for any temporary aliases or deferred app-local primitive renames.

## 4. Validate the rename

- [x] 4.1 Verify the shared UI package still builds after the rename.
- [x] 4.2 Verify Storybook still starts and presents the renamed component catalog.
- [x] 4.3 Verify the web app still builds after its shared component imports are updated.