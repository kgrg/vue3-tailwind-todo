# Implementation Notes

## Inventory Summary

- Shared package primitives renamed in this change: `BaseButton`, `BaseCard`, `BaseCheckbox`, `BaseEmptyState`, `BaseInput`, `BaseModal`, `BasePageHeader`, `BaseSelect`, `BaseStatCard`, `BaseTabs`, `BaseTextarea`
- Storybook category demos updated to consume the renamed plain-name primitives: `Dashboard`, `Page`, `Content`, `Overlay`, `Element`, `Data`, `Navigation`, `Form`, `Layout`
- Web app imports updated in `activities`, `auth`, `habits`, and `ActivityListView`

## Migration Strategy

- Chosen approach: one coordinated breaking rename inside the monorepo
- Temporary `Base*` compatibility aliases were not added to `@taskflow/ui`
- Canonical shared package API is now the plain-name surface exported from `@taskflow/ui`

## Deferred Local Primitives

- `apps/web/src/core/components/BaseListItem.vue` remains local and unchanged in this change
- `apps/web/src/core/components/BaseTag.vue` remains local and unchanged in this change

These two app-local primitives are intentionally deferred because they are not part of the `@taskflow/ui` public API yet. Leaving them unchanged avoids mixing a package API rename with a broader local-component reorganization in the same implementation pass.