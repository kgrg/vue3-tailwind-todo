# BUG-003: NewActivityModal form data persists after cancel

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | BUG-003                                        |
| **Severity**| Medium                                         |
| **Type**    | Bug                                            |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | `src/modules/activities/components/NewActivityModal.vue` |
| **Affects** | All pages that use NewActivityModal (Dashboard, Today, ActivityList) |

## Description

When a user partially fills the "New Activity" modal form and clicks **Cancel** (or clicks the overlay to close), the form data is **not reset**. The next time the user opens the modal, stale data from the previous session is still populated.

The form is only reset after a **successful submit** — not on cancel/close.

## Steps to Reproduce

1. Click "New Activity" on any page.
2. Type a title like "Test Activity" and select a category.
3. Click "Cancel" to close the modal.
4. Click "New Activity" again.
5. Observe that "Test Activity" and the previously selected category are still filled in.

## Expected Behaviour

The form should reset to default values every time the modal is opened or closed without submitting.

## Current Code

```ts
// src/modules/activities/components/NewActivityModal.vue, line ~133
const closeModal = () => {
  emit('close')
  // ❌ No form reset here
}

const handleSubmit = () => {
  activityStore.addActivity(form.value)
  closeModal()
  // ✅ Form reset only happens after submit
  form.value = {
    title: '',
    description: '',
    category: 'Work',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    location: ''
  }
}
```

## Recommended Fix

Extract a `resetForm()` helper and call it in `closeModal()`:

```ts
const defaultForm = (): NewActivityForm => ({
  title: '',
  description: '',
  category: 'Work',
  date: new Date().toISOString().split('T')[0],
  time: '12:00',
  location: ''
})

const resetForm = () => {
  form.value = defaultForm()
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const handleSubmit = () => {
  activityStore.addActivity(form.value)
  closeModal()
}
```

## Impact

- **Users affected:** All users who cancel the modal after partially filling it
- **Data risk:** Low — no data loss, but creates confusion
- **Fix effort:** ~5 minutes
