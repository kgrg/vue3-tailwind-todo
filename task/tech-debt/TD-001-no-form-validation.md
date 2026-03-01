# TD-001: No form validation in NewActivityModal

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | TD-001                                         |
| **Priority**| P0 (Critical)                                  |
| **Type**    | Tech Debt — Missing Feature                    |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | `src/modules/activities/components/NewActivityModal.vue` |

## Problem

The `handleSubmit()` function in NewActivityModal submits the form directly to the store with **zero validation**. There is no check for:

- Empty or whitespace-only title
- Title length limits
- Missing category selection
- Past dates (if that's not intended)
- Valid time format

The `BaseInput`, `BaseSelect`, and `BaseTextarea` components all support an `error` prop for displaying inline validation messages, but this prop is **never used** in the modal form.

## Current Code

```ts
// NewActivityModal.vue, line ~137
const handleSubmit = () => {
  activityStore.addActivity(form.value)  // No validation
  closeModal()
  form.value = { ... }
}
```

## Recommended Implementation

```ts
const errors = ref<Partial<Record<keyof NewActivityForm, string>>>({})

const validate = (): boolean => {
  errors.value = {}

  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
  } else if (form.value.title.length > 100) {
    errors.value.title = 'Title must be 100 characters or less'
  }

  if (!form.value.category) {
    errors.value.category = 'Please select a category'
  }

  if (!form.value.date) {
    errors.value.date = 'Date is required'
  }

  if (!form.value.time) {
    errors.value.time = 'Time is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validate()) return
  activityStore.addActivity(form.value)
  closeModal()
}
```

Then wire up errors in the template:
```vue
<BaseInput v-model="form.title" label="Title" :error="errors.title" ... />
```

## Acceptance Criteria

- [ ] Title field has non-empty + max-length validation
- [ ] Category field has required validation
- [ ] Date and time fields have required validation
- [ ] Inline error messages appear below each invalid field
- [ ] Submit button is blocked when validation fails
- [ ] Errors clear when the user corrects the field

## Effort Estimate

~30 minutes
