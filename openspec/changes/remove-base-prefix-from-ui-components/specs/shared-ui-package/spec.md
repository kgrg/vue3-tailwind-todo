## ADDED Requirements

### Requirement: Shared UI naming migration is explicit
The shared UI package SHALL define an explicit migration path for moving from `Base*` component names to plain component names so contributors do not have to guess which names are canonical.

#### Scenario: Contributor updates existing imports
- **WHEN** a contributor migrates code that currently imports `BaseButton` or `BaseCard` from `@taskflow/ui`
- **THEN** the repository provides documented guidance on whether to use temporary aliases or complete the rename in one coordinated pass

## MODIFIED Requirements

### Requirement: Shared UI components are documented in Storybook
The shared UI package SHALL provide Storybook-based component documentation for the components it owns, and Storybook SHALL present the primary shared component API using plain component names without the `Base` prefix.

#### Scenario: Contributor needs component usage guidance
- **WHEN** a contributor opens the shared UI documentation workflow
- **THEN** Storybook presents component stories that demonstrate supported states, variants, and usage of the shared UI components using the plain-name API

### Requirement: Web app can consume migrated shared UI components
The web app SHALL be able to import and use migrated shared UI components from the shared package using plain component names instead of `Base*` package exports while preserving intended user-facing behavior.

#### Scenario: A reusable primitive is renamed in the package
- **WHEN** the web app renders a component that has been renamed from `Base*` to a plain component name in the shared UI package
- **THEN** the web app imports that component from the shared package using the plain component name and preserves the intended user-facing behavior