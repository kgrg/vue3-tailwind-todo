# TD-008: Category color mapping duplicated in 3+ files

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | TD-008                                         |
| **Priority**| P2                                             |
| **Type**    | Tech Debt — DRY / Maintainability              |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | Multiple                                     |

## Problem

The mapping from activity category to Tailwind color class is hardcoded in at least 3 places:

### 1. `src/modules/activities/components/ActivityCard.vue` (~L5–12)
```vue
:class="{
  'bg-blue-500': category === 'Work',
  'bg-green-500': category === 'Personal',
  'bg-purple-500': category === 'Learning',
  'bg-red-500': category === 'Health',
  'bg-gray-500': category === 'Other'
}"
```

### 2. `src/pages/ActivityListView.vue` (~L82–89)
```vue
:class="{
  'bg-blue-500': activity.category === 'Work',
  'bg-green-500': activity.category === 'Personal',
  'bg-purple-500': activity.category === 'Learning',
  'bg-red-500': activity.category === 'Health',
  'bg-gray-500': activity.category === 'Other'
}"
```

### 3. `src/layouts/AppSidebar.vue` (~L150–170) — category list items implicitly map categories to icons and paths.

Adding a new category (e.g., "Social") requires editing all 3+ files and remembering the correct color.

## Recommended Fix

Create a shared utility:

```ts
// src/core/utils/categoryColors.ts
import type { ActivityCategory } from '@/modules/activities/types/activity.types'

export const categoryDotClass: Record<ActivityCategory, string> = {
  Work: 'bg-blue-500',
  Personal: 'bg-green-500',
  Learning: 'bg-purple-500',
  Health: 'bg-red-500',
  Other: 'bg-gray-500',
}
```

Then in templates:
```vue
<span class="w-2 h-2 rounded-full" :class="categoryDotClass[category]"></span>
```

## Acceptance Criteria

- [ ] Single source of truth for category → color mapping
- [ ] All existing usages import from the shared utility
- [ ] Adding a new category requires changing only 1 file

## Effort Estimate

~20 minutes
