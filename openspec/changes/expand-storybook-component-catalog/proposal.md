## Why

The shared UI package has Storybook wired up, but it currently documents only a small set of form and layout primitives. That leaves the package without a clear information architecture for future stories and makes Storybook less useful as a design-system entry point for contributors who need common building blocks grouped by use case.

## What Changes

- Expand the shared UI package with additional basic components that cover common Storybook starter needs beyond the current card and form primitives.
- Organize Storybook stories under a consistent category taxonomy: Layout, Element, Form, Data, Navigation, Overlay, Page, Dashboard, AI Chat, Editor, Content, Color Mode, and i18n.
- Add representative stories for each new or updated component category so Storybook shows realistic states instead of only minimal happy paths.
- Update the shared UI package exports and Storybook story metadata so the component catalog stays discoverable and aligned with the intended category structure.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `shared-ui-package`: Extend the documented shared component system so Storybook exposes a broader set of reusable components grouped under a stable category taxonomy.

## Impact

- Affected areas: `packages/ui/src/components/`, `packages/ui/src/index.ts`, and Storybook story files in the shared UI package.
- Existing shared UI package consumers are unaffected at runtime if new components are additive, but story titles and documentation structure will change for Storybook users.
- This change increases the surface area of the shared UI package and establishes expectations for how future component stories should be categorized.