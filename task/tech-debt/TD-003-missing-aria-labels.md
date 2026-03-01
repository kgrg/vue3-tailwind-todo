# TD-003: Icon-only buttons missing accessible names (WCAG 4.1.2)

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | TD-003                                         |
| **Priority**| P0                                             |
| **Type**    | Tech Debt — Accessibility                      |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | Multiple                                     |

## Problem

Several buttons contain only an icon (SVG) and no text label. Without `aria-label`, screen readers announce them as just "button" with no indication of what they do. This violates WCAG 2.1 SC 4.1.2 (Name, Role, Value).

## Affected Elements

| Element | File | Current | Needed `aria-label` |
|---|---|---|---|
| Task complete toggle | `src/modules/tasks/components/TaskItem.vue` (~L4–14) | No label | `"Mark as complete"` / `"Mark as incomplete"` |
| Star/important toggle | `src/modules/tasks/components/TaskItem.vue` (~L45–55) | No label | `"Mark as important"` / `"Remove importance"` |
| Edit button | `src/modules/tasks/components/TaskItem.vue` (~L56–62) | No label | `"Edit task"` |
| Delete button (Task) | `src/modules/tasks/components/TaskItem.vue` (~L63–67) | No label | `"Delete task"` |
| Toggle complete (Today) | `src/pages/TodayView.vue` (~L43–55) | No label | `"Mark as complete"` |
| Delete button (Today) | `src/pages/TodayView.vue` (~L56–62) | No label | `"Delete activity"` |
| Toggle complete (List) | `src/pages/ActivityListView.vue` (~L119–125) | No label | `"Mark as complete"` |
| Delete button (List) | `src/pages/ActivityListView.vue` (~L126–131) | No label | `"Delete activity"` |

## Recommended Fix

Add `aria-label` to each icon-only button. For toggle buttons, also add `aria-pressed`:

```html
<!-- Toggle example -->
<button
  type="button"
  :aria-label="isCompleted ? 'Mark as incomplete' : 'Mark as complete'"
  :aria-pressed="isCompleted"
  @click="$emit('toggle-complete')"
>
  <CheckIcon ... />
</button>

<!-- Destructive example -->
<button
  type="button"
  aria-label="Delete activity"
  @click="deleteActivity(activity.id)"
>
  <TrashIcon ... />
</button>
```

## Acceptance Criteria

- [ ] Every icon-only button has a descriptive `aria-label`
- [ ] Toggle buttons communicate current state via `aria-pressed`
- [ ] Screen reader testing (VoiceOver / NVDA) confirms labels are announced

## Effort Estimate

~15 minutes
