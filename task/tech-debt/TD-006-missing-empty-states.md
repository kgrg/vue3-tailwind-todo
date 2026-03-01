# TD-006: TodayView and DashboardView have no empty states

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | TD-006                                         |
| **Priority**| P1                                             |
| **Type**    | Tech Debt — UX                                 |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | `src/pages/TodayView.vue`, `src/pages/DashboardView.vue` |

## Problem

When there are no activities, users see:

| Page | Current Empty State | Issue |
|---|---|---|
| ActivityListView | Icon + "No activities" message + CTA button | ✅ Good |
| TodayView | Empty container with no content | ❌ No guidance |
| DashboardView | All stats show "0", empty recent activities list | ❌ No onboarding |

New users land on DashboardView and see a page full of zeroes with no clear path to first value. This hurts activation rate.

## Recommended Fix

### TodayView empty state

Add after the `<div class="divide-y divide-gray-200">` block:

```vue
<div v-if="todayActivities.length === 0" class="text-center py-12">
  <CalendarDaysIcon class="mx-auto h-12 w-12 text-gray-400" />
  <h3 class="mt-2 text-sm font-medium text-gray-900">No activities for today</h3>
  <p class="mt-1 text-sm text-gray-500">Plan your day by adding your first activity.</p>
  <div class="mt-6">
    <button
      @click="isNewActivityModalOpen = true"
      class="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
    >
      <PlusIcon class="h-5 w-5 mr-2" />
      Add Activity
    </button>
  </div>
</div>
```

### DashboardView empty state

Wrap the stats grid + recent activities in a conditional. When `activityStore.activities.length === 0`, show a welcome/onboarding card instead:

```vue
<div v-if="activityStore.activities.length === 0" class="text-center py-16">
  <h2 class="text-xl font-semibold text-gray-900">Welcome to TaskFlow</h2>
  <p class="mt-2 text-gray-500">Start tracking your activities to see stats and trends here.</p>
  <button @click="isNewActivityModalOpen = true" class="mt-6 ...">
    Create your first activity
  </button>
</div>
```

## Acceptance Criteria

- [ ] TodayView shows an empty state with icon + message + CTA when no activities exist for today
- [ ] DashboardView shows a welcome/onboarding CTA when the store has 0 activities
- [ ] Empty states include a single clear call-to-action

## Effort Estimate

~20 minutes
