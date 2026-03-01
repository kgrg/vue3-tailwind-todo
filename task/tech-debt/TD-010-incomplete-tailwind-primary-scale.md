# TD-010: Incomplete primary color scale in Tailwind config

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **ID**      | TD-010                                         |
| **Priority**| P2                                             |
| **Type**    | Tech Debt — Design Tokens                      |
| **Status**  | Open                                           |
| **Created** | 2026-03-01                                     |
| **Component** | `tailwind.config.ts`                         |

## Problem

The Tailwind config defines only 3 primary color shades:

```ts
// tailwind.config.ts
primary: {
  500: '#2564CF',
  600: '#215ABB',
  700: '#1B4C9E'
}
```

Standard Tailwind usage expects shades from 50–950. Missing shades cause failures when using:
- `bg-primary-50` (light backgrounds)
- `bg-primary-100` (hover backgrounds, badges)
- `border-primary-200` (borders)
- `text-primary-400` (placeholder/muted text)
- `text-primary-800` (text on light bg)
- `text-primary-900` (headings)
- `ring-primary-500` (focus rings — this one works)

Components and form fields reference `focus:ring-primary-500` and `focus:border-primary-500` which work, but there's no flexibility for lighter/darker usage.

## Recommended Fix

Generate a full scale from the base color `#2564CF` (use https://uicolors.app or similar):

```ts
// tailwind.config.ts
primary: {
  50:  '#EEF4FC',
  100: '#D9E6F9',
  200: '#B3CEF3',
  300: '#80ADE9',
  400: '#4D8CDF',
  500: '#2564CF',  // base
  600: '#215ABB',
  700: '#1B4C9E',
  800: '#153B7A',
  900: '#0F2B57',
  950: '#091A36',
}
```

Also consider adding a no-semantic-alias layer in CSS custom properties for theming:

```css
:root {
  --color-primary: theme('colors.primary.500');
  --color-primary-hover: theme('colors.primary.600');
  --color-primary-light: theme('colors.primary.50');
}
```

## Acceptance Criteria

- [ ] Full 50–950 primary scale defined in tailwind.config.ts
- [ ] Existing usages of `primary-500`, `primary-600`, `primary-700` remain unchanged
- [ ] New shades match the visual identity of `#2564CF`

## Effort Estimate

~10 minutes
