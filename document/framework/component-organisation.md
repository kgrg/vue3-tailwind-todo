# Component Organisation

This guide outlines how to structure, name, and compose Vue components so the codebase stays scalable and predictable as the application grows.

## Directory Structure

Follow a feature-first hierarchy under `src/components` whenever possible:

```txt
src/
└── components/
    ├── inbox/
    │   ├── InboxHeader.vue
    │   ├── InboxList.vue
    │   ├── InboxMessage.vue
    │   └── __tests__/InboxList.spec.ts
    ├── layout/
    │   ├── AppShell.vue
    │   └── Sidebar.vue
    └── shared/
        ├── BaseButton.vue
        └── EmptyState.vue
```

- **Feature folders**: Group components that implement a user-facing feature (e.g., `inbox`). Include child components, stores, and tests alongside the feature.
- **Layout folder**: Collect global layout primitives such as shells, headers, footers, and navigation.
- **Shared folder**: Centralise re-usable UI primitives (buttons, modals, form controls). Keep these presentation-only.

## Naming Conventions

- Use **PascalCase** for component filenames and exports: `InboxMessage.vue`, `BaseButton.vue`.
- Prefix global UI primitives with `Base` or `App` to signal their intent (`BaseInput`, `AppLogo`).
- For feature-specific subcomponents, prefix the feature name: `InboxFilters`, `InboxMessageCard`.
- Mirror the folder hierarchy inside the component name when nesting deeply (e.g., `InboxMessage/Avatar` becomes `InboxMessageAvatar`).

## Component Types

Separate components by responsibility:

| Type            | Purpose                                          | Location                    |
|-----------------|--------------------------------------------------|-----------------------------|
| **Page**        | Route-level containers handling data fetching    | `src/pages/<feature>/`      |
| **Feature**     | Components that implement business logic         | `src/components/<feature>/` |
| **Layout**      | Structural components shared across pages        | `src/components/layout/`    |
| **Presentational** | Pure UI components with no side effects       | `src/components/shared/`    |
| **Utility**     | Renderless utilities such as slots or providers  | `src/components/shared/`    |

## Composition Best Practices

1. **Single Responsibility** – each component should own one concern. When it grows beyond ~200 lines or requires multiple responsibilities, break it into child components.
2. **Colocation** – keep tests (`__tests__`), composables, and styles next to the component they relate to. This makes refactors faster.
3. **Prop Contracts** – define clear, typed props with defaults where possible. Avoid optional props that change behaviour drastically; prefer explicit variants or slots.
4. **Emit Contracts** – declare emitted events with TypeScript interfaces to ensure consumers handle them correctly.
5. **Composable Extraction** – move complex logic into composables (`useInboxFilters`) instead of bloating components.

## Styling Guidelines

- Scope component styles by default using `<style scoped>`. Promote shared styles into Tailwind utility classes or shared CSS modules.
- Prefer utility classes for layout and spacing; reserve custom CSS for complex patterns not covered by Tailwind.
- Keep Tailwind class strings organised: layout → spacing → typography → state.

## Testing Strategy

- Write component tests alongside the component inside `__tests__` directories.
- Focus on user-observable behaviour (rendered text, aria attributes) rather than implementation details.
- Snapshot tests are acceptable for highly static presentational components; avoid them for dynamic features.

## Documentation & Discoverability

- Add a short JSDoc-style comment at the top of complex components describing the primary use-case and key props.
- Update Storybook or component catalog entries when adding or modifying shared components.
- Record architectural decisions in the `/document` folder when a new pattern is introduced.

## Checklist

Use this checklist before committing a component:

- [ ] Component name follows PascalCase and folder hierarchy
- [ ] Props and emits are fully typed
- [ ] Side effects moved into composables or services
- [ ] Tests cover critical paths and user flows
- [ ] Documentation or stories updated

Adhering to these guidelines keeps the component library approachable, encourages reuse, and reduces the cost of future refactors.
