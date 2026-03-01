# TD-013: Interactive touch targets below 44×44px minimum on mobile

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | TD-013                                         |
| **Priority**| P1                                             |
| **Type**    | Tech Debt — Accessibility / Mobile UX          |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | Multiple                                     |

## Problem

Several interactive elements are smaller than the recommended 44×44px minimum touch target (WCAG 2.5.8, Apple HIG, Material Design guidelines). Small targets cause mis-taps, frustration, and especially impact users with motor impairments.

## Affected Elements

| Element | File | Current Size | Actual px (approx) |
|---|---|---|---|
| Task complete circle button | `src/modules/tasks/components/TaskItem.vue` (~L4–14) | `w-5 h-5` | 20×20px |
| Delete button (TaskItem) | `src/modules/tasks/components/TaskItem.vue` (~L63–67) | `p-1` + 20px icon | ~28×28px |
| Star/important toggle | `src/modules/tasks/components/TaskItem.vue` (~L45–55) | `p-1` + 20px icon | ~28×28px |
| Edit button (TaskItem) | `src/modules/tasks/components/TaskItem.vue` (~L56–62) | `p-1` + 20px icon | ~28×28px |
| Toggle complete (TodayView) | `src/pages/TodayView.vue` (~L43–55) | `p-2` + 20px icon | ~36×36px |
| Delete button (TodayView) | `src/pages/TodayView.vue` (~L56–62) | `p-2` + 20px icon | ~36×36px |

## Recommended Fix

Ensure all interactive elements meet 44×44px minimum. Two approaches:

### Option A — Increase padding

Change `p-1` to `p-2.5` and `p-2` to `p-3` on mobile:

```vue
<button class="p-2.5 sm:p-1 ...">
  <TrashIcon class="w-5 h-5" />
</button>
```

### Option B — Invisible hit area expansion

Keep visual size compact but expand the tap target with a pseudo-element:

```css
.touch-target-expand {
  position: relative;
}
.touch-target-expand::after {
  content: '';
  position: absolute;
  inset: -8px; /* expand by 8px in all directions */
}
```

### For the task complete circle specifically:

The `w-5 h-5` (20px) circle is visually small. Increase to `w-8 h-8` (32px) visually, with a tap target of 44px via padding or pseudo-element.

## Acceptance Criteria

- [ ] All interactive buttons meet 44×44px minimum on mobile viewports
- [ ] Visual appearance may remain compact on desktop
- [ ] Verified with Chrome DevTools "show tap targets" or manual measurement

## Effort Estimate

~30 minutes
