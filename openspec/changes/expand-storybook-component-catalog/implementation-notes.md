# Implementation Notes

## Story Category Audit

- Existing stories already matched the target taxonomy for `Layout` and `Form`, so their `title` metadata stayed unchanged.

## Exported Reusable Components

- `Layout`: `BaseCard`
- `Element`: `BaseButton`
- `Form`: `BaseCheckbox`, `BaseInput`, `BaseSelect`, `BaseTextarea`
- `Navigation`: `BaseTabs`
- `Overlay`: `BaseModal`
- `Page`: `BasePageHeader`
- `Data`: `BaseStatCard`
- `Content`: `BaseEmptyState`

## Storybook-only Demo Categories

- `Dashboard`: dashboard composition preview using exported primitives only
- `AI Chat`: static conversation preview with serializable message data
- `Editor`: toolbar shell preview with plain text content
- `Color Mode`: token preview with local story args only
- `i18n`: locale switcher preview with static copy objects only

All demo-only categories remain package-safe and avoid web-app stores, router dependencies, backend APIs, and localization runtime setup.