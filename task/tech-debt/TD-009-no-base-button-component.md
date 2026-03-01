# TD-009: No shared BaseButton component — 5 button variants hardcoded inline

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | TD-009                                         |
| **Priority**| P1                                             |
| **Type**    | Tech Debt — Component Architecture             |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | Missing: `src/core/components/BaseButton.vue` |

## Problem

There is no `BaseButton` component. Every page creates buttons inline with varying, inconsistent class strings. At least 5 distinct button variants exist across the codebase:

| Variant | Example Classes | Used In |
|---|---|---|
| Primary | `bg-[#2564CF] text-white rounded-lg px-4 py-2` | DashboardView, TodayView, NewActivityModal |
| Primary (alt) | `bg-blue-600 text-white rounded-lg px-4 py-2` | ActivityListView, empty state CTA |
| Secondary | `border border-gray-300 text-gray-700 rounded-lg px-4 py-2` | NewActivityModal Cancel |
| Destructive ghost | `text-gray-400 hover:text-red-500` | Delete buttons |
| Text/ghost | `text-sm font-medium text-gray-500` | ActivityCard "Mark Complete" |

Changing the primary button style (e.g., border-radius, padding, color) requires editing **every file individually**.

## Recommended Implementation

```vue
<!-- src/core/components/BaseButton.vue -->
<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
      sizeClasses[size],
      variantClasses[variant],
      (disabled || loading) && 'opacity-50 cursor-not-allowed'
    ]"
    v-bind="$attrs"
  >
    <slot name="leading-icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}>()

const variantClasses: Record<string, string> = {
  primary: 'bg-primary-500 text-white rounded-lg hover:bg-primary-600',
  secondary: 'border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50',
  destructive: 'bg-red-600 text-white rounded-lg hover:bg-red-700',
  ghost: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}
</script>
```

### Usage

```vue
<BaseButton variant="primary" @click="openModal">
  <template #leading-icon><PlusIcon class="w-5 h-5 mr-2" /></template>
  New Activity
</BaseButton>

<BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
```

## Acceptance Criteria

- [ ] `BaseButton.vue` supports: primary, secondary, destructive, ghost variants
- [ ] `BaseButton.vue` supports: sm, md, lg sizes
- [ ] `BaseButton.vue` supports: disabled, loading props
- [ ] Built-in focus-visible styles (addresses TD-002 for buttons)
- [ ] Existing inline buttons migrated to use BaseButton (at least primary + secondary)

## Effort Estimate

~1 hour (create component) + ~30 minutes (migrate existing buttons)
