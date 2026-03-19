---
applyTo: "src/**/*.vue,src/styles/**/*.css,src/core/components/**/*.vue,src/layouts/**/*.vue,src/pages/**/*.vue,src/modules/**/*.vue"
---

# UI And Accessibility Rules

Apply these rules to all user-facing Vue components and styles.

## UI Consistency

1. Preserve the existing visual language unless the task is explicitly a redesign.
2. Prefer reusable styling patterns over repeating one-off utility combinations across features.
3. Avoid new ad hoc color literals when an existing semantic or repeated pattern can be reused.
4. Avoid dynamic Tailwind class generation unless the full class set is statically represented in code or mapped through a fixed token object.

## Accessibility

1. Forms need visible labels or a valid accessible-name strategy.
2. Keep input error text connected with `aria-describedby` when validation is shown.
3. Preserve keyboard access and visible focus states.
4. Use accessible dialog and transition primitives that are already present in the repo, especially `@headlessui/vue` for modals.
5. Touch targets and interactive controls should remain usable on mobile layouts.

## Product Experience Baseline

1. Empty states, loading states, and error states matter in this product because users are managing attention and workload.
2. Avoid UI changes that increase cognitive load, hide key actions, or overload the sidebar and primary screens.
3. Charts and metrics should always remain understandable without relying on color alone.

## Change Heuristics

1. Prefer small, legible components over very large page templates.
2. If a control or pattern is repeated across modules, consider whether it belongs in `src/core/components/`.
3. When editing forms or modals, check reset behavior, validation messaging, and cancel flows.