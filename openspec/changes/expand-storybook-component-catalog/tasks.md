## 1. Normalize Storybook structure

- [x] 1.1 Audit the existing `packages/ui` stories and rename their `title` metadata so current stories align with the target category taxonomy.
- [x] 1.2 Decide which requested categories are backed by exported reusable components versus Storybook-only demo components, and document that split in the implementation notes while coding.

## 2. Add starter shared UI components

- [x] 2.1 Implement a first batch of small reusable components in `packages/ui/src/components/` that expands coverage beyond the current card and form primitives.
- [x] 2.2 Export any reusable new components from `packages/ui/src/index.ts` while keeping demo-only category helpers internal to Storybook when they do not warrant public package API surface.

## 3. Expand Storybook coverage by category

- [x] 3.1 Add or update Storybook stories so `Layout`, `Element`, `Form`, `Data`, `Navigation`, `Overlay`, `Page`, `Dashboard`, `AI Chat`, `Editor`, `Content`, `Color Mode`, and `i18n` each have at least one entry.
- [x] 3.2 Ensure each new story demonstrates representative states or variants such as active, empty, disabled, selected, or populated usage rather than only a default render.

## 4. Validate package-safe behavior

- [x] 4.1 Verify Storybook stories for package-safe categories such as `AI Chat`, `Editor`, `Color Mode`, and `i18n` render without app-specific stores, routing, or backend dependencies.
- [x] 4.2 Validate the supported shared UI workflows with the existing commands needed for this change, including package build and Storybook startup checks.