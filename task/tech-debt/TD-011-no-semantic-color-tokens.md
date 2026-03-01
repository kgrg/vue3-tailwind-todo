# TD-011: No semantic color tokens — raw utility classes everywhere

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | TD-011                                         |
| **Priority**| P2                                             |
| **Type**    | Tech Debt — Design Tokens / Theming            |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | Global (all components and pages)            |

## Problem

Colors are used as raw Tailwind utility classes throughout the codebase (e.g., `text-gray-900`, `text-red-600`, `bg-gray-50`). There is no semantic mapping from **intent** to **color**.

This means:
- Changing the "error" color from red-600 to something else requires a global find-and-replace across dozens of files.
- Adding dark mode requires overriding every single utility class.
- There's no guarantee that all "error" states use the same shade of red.

## Examples of Current Usage

| Intent | Classes Used | Files |
|---|---|---|
| Primary text | `text-gray-900` | DashboardView, TodayView, ActivityListView, BaseInput, etc. |
| Secondary text | `text-gray-500` | Nearly all components |
| Error text | `text-red-600` | BaseInput, BaseTextarea, BaseSelect, BaseCheckbox |
| Error border | `border-red-300` | BaseInput, BaseTextarea, BaseSelect |
| Success text | `text-green-600` | ActivityCard ("Completed") |
| Surface bg | `bg-white` | BaseCard, ActivityListView, DashboardLayout |
| Muted bg | `bg-gray-50` | BaseListItem, AuthLayout, MainLayout |

## Recommended Fix

Add CSS custom properties in `src/styles/main.css`:

```css
@import "tailwindcss";

@theme {
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-500);
  --color-text-muted: var(--color-gray-400);
  --color-text-error: var(--color-red-600);
  --color-text-success: var(--color-green-600);
  --color-text-warning: var(--color-yellow-600);

  --color-bg-surface: var(--color-white);
  --color-bg-muted: var(--color-gray-50);
  --color-bg-error: var(--color-red-50);

  --color-border-default: var(--color-gray-200);
  --color-border-error: var(--color-red-300);
  --color-border-focus: var(--color-primary-500);
}
```

Then gradually migrate components to use semantic tokens:
```vue
<!-- Before -->
<p class="text-red-600">{{ error }}</p>

<!-- After -->
<p class="text-text-error">{{ error }}</p>
```

This also unlocks dark mode with a single override block.

## Acceptance Criteria

- [ ] Semantic color tokens defined in CSS custom properties
- [ ] At least Base* form components migrated to use semantic tokens
- [ ] Dark mode can be enabled by swapping token values (future)

## Effort Estimate

~30 minutes (define tokens) + ~2 hours (migrate components incrementally)
