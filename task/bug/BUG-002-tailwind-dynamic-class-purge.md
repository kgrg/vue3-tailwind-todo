# BUG-002: Dynamic Tailwind classes are purged in production builds

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | BUG-002                                        |
| **Severity**| Critical                                       |
| **Type**    | Bug                                            |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | `src/core/components/BaseTag.vue`, `src/core/components/NavItem.vue` |
| **Affects** | All tags, all colored nav items in sidebar     |

## Description

`BaseTag.vue` and `NavItem.vue` build Tailwind class names using JavaScript string interpolation:

```vue
<!-- BaseTag.vue -->
:class="`bg-${color}-100 text-${color}-800`"

<!-- NavItem.vue -->
:class="color ? `text-${color}-500` : 'text-gray-500'"
```

Tailwind CSS 4 (and v3 with JIT) scans source files for **complete class name strings** at build time. Interpolated names like `bg-${color}-100` never appear as complete strings, so they are **not included in the production CSS bundle**. These components render with no background/text color in production.

## Steps to Reproduce

1. Run `pnpm build`.
2. Serve the `dist/` folder with `pnpm preview`.
3. Navigate to any page with tags (ActivityListView) or colored nav items (sidebar).
4. Observe that tags have no background color and nav items have no color indicator.

## Expected Behaviour

Tags display with the correct `bg-{color}-100 text-{color}-800` classes. Nav items display colored icons.

## Current Code

```vue
<!-- src/core/components/BaseTag.vue -->
<span
  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
  :class="`bg-${color}-100 text-${color}-800`"
>
  <slot></slot>
</span>
```

```vue
<!-- src/core/components/NavItem.vue -->
<component
  :is="icon"
  class="w-5 h-5 sm:w-4 sm:h-4 mr-3 sm:mr-2 flex-shrink-0"
  :class="[
    color ? `text-${color}-500` : 'text-gray-500',
    active ? 'text-gray-900' : ''
  ]"
/>
```

## Recommended Fix

Replace dynamic interpolation with a static lookup map so all class names appear as complete strings in source:

```ts
// src/core/utils/colorClasses.ts
export const tagColorClasses: Record<string, string> = {
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  purple: 'bg-purple-100 text-purple-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  gray: 'bg-gray-100 text-gray-800',
}

export const iconColorClasses: Record<string, string> = {
  red: 'text-red-500',
  blue: 'text-blue-500',
  green: 'text-green-500',
  purple: 'text-purple-500',
  gray: 'text-gray-500',
}
```

Then use in components:
```vue
<!-- BaseTag.vue -->
<span :class="[baseClasses, tagColorClasses[color] ?? tagColorClasses.gray]">
```

## Impact

- **Users affected:** All users in production build
- **Visual:** Tags appear unstyled (plain text, no background); sidebar nav items lose color coding
- **Dev vs Prod:** Bug is invisible during `pnpm dev` (Vite dev server doesn't purge) — only manifests after `pnpm build`
