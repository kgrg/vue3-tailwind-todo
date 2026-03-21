## Why

The shared UI package currently exposes reusable primitives with a `Base` prefix, which made sense when those components lived beside feature UI in the web app. Now that the primitives live behind the `@taskflow/ui` package boundary, the prefix adds API noise without adding much clarity, and it leaves the design-system surface less idiomatic than the feature component surface.

## What Changes

- **BREAKING** Rename shared UI package component files, exports, Storybook titles, and adoption points from `Base*` to plain component names such as `Button`, `Card`, and `Input`.
- Add a migration plan for the remaining app-local primitives that still use the `Base` prefix so the repo does not get stuck with mixed naming systems.
- Update documentation and Storybook examples so contributors see the plain-name shared component API as the primary convention.
- Decide whether temporary compatibility aliases are needed during migration or whether the rename should be completed in one coordinated pass.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `shared-ui-package`: Change the shared UI package component naming contract from `Base*` exports to plain component names and align documentation, stories, and adoption guidance with that API.

## Impact

- Affected areas: `packages/ui/src/components/`, `packages/ui/src/index.ts`, Storybook stories in `packages/ui/src/components/*.stories.ts`, `apps/web` imports from `@taskflow/ui`, and supporting documentation that currently describes reusable primitives as `Base*` components.
- This is a breaking change for the package API and for any in-repo imports using the current names.
- The repo may need a temporary compatibility strategy or a tightly coordinated rename to avoid prolonged mixed naming across package and app-local primitives.