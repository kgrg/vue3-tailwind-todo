# TD-002: Missing visible focus styles on interactive elements (WCAG 2.4.7)

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | TD-002                                         |
| **Priority**| P0                                             |
| **Type**    | Tech Debt — Accessibility                      |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | Multiple                                     |

## Problem

Multiple interactive elements across the app have no visible focus indicator. Keyboard-only users cannot determine which element is currently focused. This is a WCAG 2.1 Level AA violation (Success Criterion 2.4.7).

## Affected Components

| Component | File | Line(s) |
|---|---|---|
| "Mark Complete" button | `src/modules/activities/components/ActivityCard.vue` | ~19–24 |
| "New Activity" button | `src/pages/DashboardView.vue` | ~11–14 |
| "New Activity" button | `src/pages/TodayView.vue` | ~10–14 |
| "New Activity" button | `src/pages/ActivityListView.vue` | ~10–14 |
| Toggle complete / Delete buttons | `src/pages/TodayView.vue` | ~43–64 |
| Toggle complete / Delete buttons | `src/pages/ActivityListView.vue` | ~119–131 |
| NavItem router-link | `src/core/components/NavItem.vue` | ~3–5 |
| Task complete circle | `src/modules/tasks/components/TaskItem.vue` | ~4–14 |
| Star / Edit / Delete buttons | `src/modules/tasks/components/TaskItem.vue` | ~45–67 |

## Recommended Fix

### Option A — Global base layer (preferred)

Add to `src/styles/main.css`:

```css
@import "tailwindcss";

@layer base {
  button, a, input, select, textarea, [role="button"] {
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-sm;
  }
}
```

### Option B — Per-component

Add to each interactive element:
```
focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
```

## Acceptance Criteria

- [ ] All buttons show a visible ring when focused via keyboard (Tab key)
- [ ] All links show a visible ring when focused via keyboard
- [ ] Focus ring does not appear on mouse click (use `focus-visible`, not `focus`)
- [ ] Ring color uses `primary-500` for brand consistency

## Effort Estimate

~5 minutes for Option A, ~30 minutes for Option B
