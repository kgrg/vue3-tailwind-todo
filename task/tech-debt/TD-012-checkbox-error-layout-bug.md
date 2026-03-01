# TD-012: BaseCheckbox error message layout issue

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | TD-012                                         |
| **Priority**| P2                                             |
| **Type**    | Tech Debt — Layout / Component Quality         |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | `src/core/components/BaseCheckbox.vue`       |

## Problem

BaseCheckbox renders two error indicators simultaneously when `error` is set:

1. An `ExclamationCircleIcon` inline next to the checkbox (inside the flex row)
2. A `<p>` error text message below (outside the flex container)

Additionally, the `<p>` tag is a **sibling** of the `<div class="flex items-center">`, not nested inside a shared wrapper. Since Vue components need a single root, these two sibling elements cause:
- A layout shift where the error text appears below the flex container but outside the component's visual boundary
- Redundant error indication (both icon and text)

## Current Code

```vue
<template>
  <div class="flex items-center">
    <input ... />
    <label ...>{{ label }}</label>
    <div v-if="error" class="ml-2">
      <ExclamationCircleIcon class="h-5 w-5 text-red-500" />
    </div>
  </div>
  <!-- This <p> is a sibling, not nested -->
  <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
</template>
```

## Recommended Fix

Wrap both elements in a single `<div>` root, and remove the redundant inline icon (the text message is sufficient and consistent with BaseInput/BaseTextarea/BaseSelect):

```vue
<template>
  <div>
    <div class="flex items-center">
      <input
        :id="id"
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        :required="required"
        :disabled="disabled"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        :class="[
          error ? 'border-red-300' : '',
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        ]"
      />
      <label v-if="label" :for="id" class="ml-2 block text-sm text-gray-900">
        {{ label }}
      </label>
    </div>
    <p v-if="error" :id="`${id}-error`" role="alert" class="mt-1 ml-6 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>
```

## Acceptance Criteria

- [ ] Single root wrapper element
- [ ] Only one error indicator (text, not icon — consistent with other Base* components)
- [ ] Error text is left-aligned with the label (not the checkbox)
- [ ] `aria-describedby` links error to input (overlaps with TD-004)

## Effort Estimate

~10 minutes
