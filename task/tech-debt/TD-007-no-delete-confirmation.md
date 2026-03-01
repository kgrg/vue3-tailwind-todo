# TD-007: Destructive actions (delete) have no confirmation or undo

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | TD-007                                         |
| **Priority**| P1                                             |
| **Type**    | Tech Debt — UX / Data Safety                   |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | `src/pages/TodayView.vue`, `src/pages/ActivityListView.vue` |

## Problem

Delete buttons call `activityStore.deleteActivity(id)` immediately on click with:
- No confirmation dialog
- No undo mechanism
- No toast notification

A single accidental tap (especially on mobile) permanently removes data with no recovery path.

## Affected Files

| File | Line(s) |
|---|---|
| `src/pages/TodayView.vue` | ~59–61 (`@click="deleteActivity(activity.id)"`) |
| `src/pages/ActivityListView.vue` | ~127–130 (`@click="deleteActivity(activity.id)"`) |

## Recommended Fix

### Option A — Undo toast (preferred, lower friction)

Instead of deleting immediately:
1. Remove the item from the visible list (optimistic UI).
2. Show a toast: "Activity deleted. [Undo]" with a 5-second timer.
3. If "Undo" is clicked, restore the item.
4. After timeout, commit the actual delete.

This requires a simple notification/toast system (which doesn't exist yet — could be a follow-up).

### Option B — Confirmation dialog (simpler to implement now)

```ts
const deleteActivity = (id: string) => {
  if (window.confirm('Delete this activity? This cannot be undone.')) {
    activityStore.deleteActivity(id)
  }
}
```

This is a minimal safeguard. Replace `window.confirm` with a headless-ui Dialog for a more polished experience.

## Acceptance Criteria

- [ ] User must confirm before an activity is permanently deleted
- [ ] Either a confirmation dialog or undo toast is shown
- [ ] Accidental single taps do not cause data loss

## Effort Estimate

~15 minutes (Option B), ~1–2 hours (Option A with toast system)
