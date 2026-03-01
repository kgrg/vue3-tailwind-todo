# BUG-001: List item actions are invisible and inaccessible on mobile

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | BUG-001                                        |
| **Severity**| Critical                                       |
| **Type**    | Bug                                            |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | `src/core/components/BaseListItem.vue`       |
| **Affects** | ActivityListView, TaskItem — any consumer of BaseListItem |

## Description

`BaseListItem.vue` hides its `#actions` slot behind `opacity-0 group-hover:opacity-100`. On touch devices there is no hover event, so **action buttons (delete, complete, edit) are permanently invisible and unreachable** for 100% of mobile users.

Keyboard-only users are also affected — the buttons receive focus, but remain visually hidden (`opacity-0`) so users cannot see what is focused.

## Steps to Reproduce

1. Open ActivityListView (`/activities`) on a mobile device or Chrome DevTools mobile emulator.
2. Observe that each list item shows title, description, timestamps — but no action buttons.
3. Tap the list item — nothing happens. There is no way to complete or delete an activity.

## Expected Behaviour

Action buttons should be visible and tappable on all devices.

## Current Code

```vue
<!-- src/core/components/BaseListItem.vue, line ~21 -->
<div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
  <slot name="actions"></slot>
</div>
```

## Recommended Fix

**Option A — Always visible:** Remove `opacity-0 group-hover:opacity-100` entirely. Actions are always visible.

**Option B — Responsive:** Keep the hover reveal on desktop, show always on mobile:
```vue
<div class="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
  <slot name="actions"></slot>
</div>
```

**Option C — Overflow menu:** Replace inline actions with a `...` overflow menu button (always visible) that opens a dropdown. Best for space-constrained rows.

## Impact

- **Users affected:** All mobile users, all keyboard-only users
- **Data at risk:** Users cannot delete or manage activities on mobile
- **Workaround:** None currently — desktop only
