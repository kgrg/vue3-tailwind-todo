## Why

The web app currently owns all reusable UI primitives inside `apps/web/src/core/components`, which makes those components hard to share, document, and evolve independently. Creating a dedicated UI package with Storybook documentation gives the repo a clearer design-system boundary and a repeatable way to adopt shared components across the web app.

## What Changes

- Add a new shared workspace package for reusable UI components, styles, and exports.
- Move or recreate selected web UI primitives in the shared package and consume them from the web app.
- Add Storybook to document shared UI components and their supported states, usage, and visual behavior.
- Update workspace configuration and package scripts so the shared package and Storybook fit the existing `pnpm` workspace structure.

## Capabilities

### New Capabilities
- `shared-ui-package`: Defines a reusable workspace UI package with documented components that can be consumed by the web app.

### Modified Capabilities
- None.

## Impact

- Affected areas: `pnpm-workspace.yaml`, root package scripts or package metadata, new `packages/ui/` workspace files, and `apps/web/` component imports.
- New dependencies are likely required for Storybook and package build or type support.
- The initial migration changes component ownership and import paths for the web app, but should not change product behavior when executed correctly.