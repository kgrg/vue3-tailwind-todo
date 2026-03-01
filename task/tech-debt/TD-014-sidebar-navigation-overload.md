# TD-014: Sidebar navigation contains too many items (Hick's Law)

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | TD-014                                         |
| **Priority**| P2                                             |
| **Type**    | Tech Debt — Information Architecture / UX      |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | `src/layouts/AppSidebar.vue`                 |

## Problem

The sidebar displays **15+ navigation items** across 4 sections all visible at once:

| Section | Items | Count |
|---|---|---|
| Top Nav | Dashboard, Today, Upcoming, All Activities | 4 |
| Lists | Work, Personal, Health & Fitness, Learning | 4 |
| Tags | Priority, Meetings, Deadlines, Errands | 4 |
| Bottom | Completed, Analytics, Settings | 3 |
| **Total** | | **15** |

Hick's Law: decision time increases logarithmically with the number of options. With 15 visible items, users take measurably longer to navigate — especially new users who haven't developed muscle memory.

Miller's Law suggests ~7 visible items is ideal for quick scanning.

## Current State

All 15 items are visible simultaneously in a flat list. The section headings ("Lists", "Tags") provide some grouping but items are not collapsible.

## Recommended Changes

### 1. Make Lists and Tags sections collapsible (default collapsed)

```vue
<div>
  <button @click="listsExpanded = !listsExpanded" class="flex items-center justify-between w-full ...">
    <h3 class="text-sm font-semibold text-gray-500 px-3">Lists</h3>
    <ChevronDownIcon :class="{ 'rotate-180': listsExpanded }" class="w-4 h-4" />
  </button>
  <nav v-show="listsExpanded" class="space-y-1">
    <!-- NavItems -->
  </nav>
</div>
```

This reduces visible items from 15 to **7** at rest (4 top + 3 bottom), within Miller's Law range.

### 2. Consider relocating Settings

Move "Settings" to a user avatar menu in the header. This is a standard pattern and reduces sidebar noise.

### 3. Active section auto-expands

If the user is on `/categories/work`, the "Lists" section should auto-expand so they see their current location.

## Acceptance Criteria

- [ ] Lists and Tags sections are collapsible
- [ ] Default state shows ≤7 visible nav items
- [ ] Active section auto-expands based on current route
- [ ] Collapse state persists during session (optional: across sessions via localStorage)

## Effort Estimate

~45 minutes
