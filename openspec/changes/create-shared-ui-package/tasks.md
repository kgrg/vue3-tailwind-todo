## 1. Prepare workspace support

- [x] 1.1 Expand the `pnpm` workspace configuration to include a new `packages/*` workspace path.
- [x] 1.2 Define the initial `packages/ui` package structure, package metadata, and source entrypoints for shared Vue components.

## 2. Add shared UI package and documentation tooling

- [x] 2.1 Configure the shared UI package so it can host reusable Vue components and exports that the web app can consume.
- [x] 2.2 Add Storybook configuration and scripts for the shared UI package so component documentation can be developed locally.

## 3. Migrate initial reusable components

- [x] 3.1 Identify the first set of app-agnostic primitives in `apps/web/src/core/components` to move into the shared package.
- [x] 3.2 Create Storybook stories for the migrated components covering key states and usage examples.

## 4. Adopt shared components in the web app

- [x] 4.1 Update `apps/web` to import the migrated shared components from the new UI package.
- [x] 4.2 Remove or reduce duplicated local component implementations once the shared imports are in use.

## 5. Validate and document the new workflow

- [x] 5.1 Verify the web app still builds with the shared package in place.
- [x] 5.2 Verify Storybook configuration works for the shared UI package and document any new supported commands or workflow guidance.