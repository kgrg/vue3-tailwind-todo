# TD-005: Page views have no loading or error states

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | TD-005                                         |
| **Priority**| P1                                             |
| **Type**    | Tech Debt — UX / Forward Compatibility         |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | `src/pages/DashboardView.vue`, `src/pages/TodayView.vue`, `src/pages/ActivityListView.vue` |

## Problem

The activity store defines `loading: boolean` and `error: string | null` state properties, but **no page view reads or displays them**. All pages render data directly from `activityStore.activities` with no handling for:

- Loading state (while data is being fetched)
- Error state (if fetch fails)
- Retry mechanism

Currently, the store uses hardcoded mock data so this isn't visible. But when the app connects to an API, users will see:
- A blank/empty screen during loading
- No feedback on network errors
- No way to retry

## Affected Pages

| Page | File | Loading Handling | Error Handling |
|---|---|---|---|
| DashboardView | `src/pages/DashboardView.vue` | None | None |
| TodayView | `src/pages/TodayView.vue` | None | None |
| ActivityListView | `src/pages/ActivityListView.vue` | None | None |

## Recommended Implementation

### 1. Create a loading skeleton component

```vue
<!-- src/core/components/BaseLoadingSkeleton.vue -->
<template>
  <div class="animate-pulse space-y-4" role="status" aria-label="Loading">
    <div v-for="i in lines" :key="i" class="h-4 bg-gray-200 rounded" :class="widthClasses[i % 3]"></div>
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ lines?: number }>()
const widthClasses = ['w-3/4', 'w-1/2', 'w-5/6']
</script>
```

### 2. Create an error state component

```vue
<!-- src/core/components/BaseErrorState.vue -->
<template>
  <div class="text-center py-8">
    <p class="text-red-600 mb-2">{{ message }}</p>
    <button @click="$emit('retry')" class="text-primary-500 hover:text-primary-600 font-medium">
      Try again
    </button>
  </div>
</template>
```

### 3. Wire up in page views

```vue
<BaseLoadingSkeleton v-if="activityStore.loading" :lines="6" />
<BaseErrorState v-else-if="activityStore.error" :message="activityStore.error" @retry="fetchData" />
<div v-else>
  <!-- actual content -->
</div>
```

## Acceptance Criteria

- [ ] Loading skeleton displayed while `store.loading` is true
- [ ] Error state displayed with retry button when `store.error` is set
- [ ] Loading skeleton has `role="status"` and `aria-label="Loading"` for accessibility
- [ ] All three page views handle loading + error states

## Effort Estimate

~1 hour (create 2 components + wire up 3 pages)
