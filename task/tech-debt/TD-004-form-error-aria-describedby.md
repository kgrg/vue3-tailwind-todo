# TD-004: Form error messages not linked with `aria-describedby`

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | TD-004                                         |
| **Priority**| P1                                             |
| **Type**    | Tech Debt — Accessibility                      |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | Base form components                          |

## Problem

When an `error` prop is provided to `BaseInput`, `BaseTextarea`, `BaseSelect`, or `BaseCheckbox`, the error message text renders visually below the field. However, it is **not programmatically associated** with the input element.

Screen readers will not announce the error when the user focuses the field, meaning blind users may not know their input has a validation error.

## Affected Components

| Component | File |
|---|---|
| BaseInput | `src/core/components/BaseInput.vue` |
| BaseTextarea | `src/core/components/BaseTextarea.vue` |
| BaseSelect | `src/core/components/BaseSelect.vue` |
| BaseCheckbox | `src/core/components/BaseCheckbox.vue` |

## Recommended Fix

For each component:

1. Generate a unique error ID from the `id` prop.
2. Add `aria-describedby` on the input pointing to the error element.
3. Add `role="alert"` on the error `<p>` for live announcements.
4. Add `aria-invalid="true"` on the input when error is present.

### Example (BaseInput.vue)

```vue
<input
  :id="id"
  :aria-invalid="!!error"
  :aria-describedby="error ? `${id}-error` : undefined"
  ...
/>
<p
  v-if="error"
  :id="`${id}-error`"
  role="alert"
  class="mt-2 text-sm text-red-600"
>
  {{ error }}
</p>
```

### Prerequisite

Ensure every form field instance passes an `id` prop. If `id` is optional and not provided, auto-generate one:

```ts
import { useId } from 'vue' // Vue 3.5+ or use a composable
const fieldId = computed(() => props.id ?? useId())
```

## Acceptance Criteria

- [ ] All four Base form components link error text via `aria-describedby`
- [ ] `aria-invalid="true"` is set when error is present
- [ ] Error `<p>` has `role="alert"` for live region announcement
- [ ] Visually no change — purely semantic improvement

## Effort Estimate

~20 minutes
