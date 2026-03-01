# BUG-004: Primary action buttons use inconsistent colors across pages

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | BUG-004                                        |
| **Severity**| Medium                                         |
| **Type**    | Bug (Visual)                                   |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | Multiple pages                               |
| **Affects** | DashboardView, TodayView, ActivityListView, NewActivityModal |

## Description

The primary call-to-action ("New Activity") button uses different blue color values across pages, despite serving the same function:

| Page | Color Used | Hex Value |
|---|---|---|
| DashboardView | `bg-[#2564CF]` hover `bg-[#215ABB]` | `#2564CF` |
| TodayView | `bg-[#2564CF]` hover `bg-[#215ABB]` | `#2564CF` |
| ActivityListView | `bg-blue-600` hover `bg-blue-700` | `#2563EB` (Tailwind default) |
| Empty state CTA | `bg-blue-600` hover `bg-blue-700` | `#2563EB` |
| NewActivityModal submit | `bg-[#2564CF]` | `#2564CF` |

The Tailwind config defines `primary-500: '#2564CF'` but not all files use it.

## Steps to Reproduce

1. Navigate to DashboardView — observe "New Activity" button color.
2. Navigate to ActivityListView — observe "New Activity" button color.
3. The two blues are slightly different (`#2564CF` vs `#2563EB`).

## Expected Behaviour

All primary buttons should use the same color: `bg-primary-500 hover:bg-primary-600`.

## Files to Update

- `src/pages/DashboardView.vue` (line ~12): Replace `bg-[#2564CF]` → `bg-primary-500`
- `src/pages/TodayView.vue` (line ~11): Replace `bg-[#2564CF]` → `bg-primary-500`
- `src/pages/ActivityListView.vue` (line ~11): Replace `bg-blue-600` → `bg-primary-500`
- `src/pages/ActivityListView.vue` (line ~61): Replace `bg-blue-600` → `bg-primary-500`
- `src/modules/activities/components/NewActivityModal.vue` (line ~90): Replace `bg-[#2564CF]` → `bg-primary-500`

## Prerequisites

Add missing shades to `tailwind.config.ts`:

```ts
primary: {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#2564CF',
  600: '#215ABB',
  700: '#1B4C9E',
  800: '#153B7A',
  900: '#0F2B57',
  950: '#091A36',
}
```

## Impact

- **Users affected:** All users — visual inconsistency reduces brand trust
- **Fix effort:** ~15 minutes (config + find-replace)
