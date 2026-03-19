/**
 * Static Tailwind color class maps.
 *
 * Tailwind CSS 4 (and v3 JIT) requires class names to appear as complete
 * strings in source so the compiler can detect and include them.
 * Dynamic interpolation like `bg-${color}-100` is invisible to the scanner
 * and the classes are purged in production builds.
 *
 * These maps keep every class name as a full literal string.
 *
 * @see BUG-002
 */

export type ColorKey =
  | 'red'
  | 'blue'
  | 'green'
  | 'purple'
  | 'yellow'
  | 'orange'
  | 'pink'
  | 'indigo'
  | 'teal'
  | 'gray'

/** Background + text classes used by BaseTag */
export const tagColorClasses: Record<ColorKey, string> = {
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  purple: 'bg-purple-100 text-purple-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  orange: 'bg-orange-100 text-orange-800',
  pink: 'bg-pink-100 text-pink-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  teal: 'bg-teal-100 text-teal-800',
  gray: 'bg-gray-100 text-gray-800',
}

/** Icon text-color classes used by NavItem */
export const iconColorClasses: Record<ColorKey, string> = {
  red: 'text-red-500',
  blue: 'text-blue-500',
  green: 'text-green-500',
  purple: 'text-purple-500',
  yellow: 'text-yellow-500',
  orange: 'text-orange-500',
  pink: 'text-pink-500',
  indigo: 'text-indigo-500',
  teal: 'text-teal-500',
  gray: 'text-gray-500',
}

/** Hover text-color classes used by NavItem label */
export const hoverColorClasses: Record<ColorKey, string> = {
  red: 'group-hover:text-red-600',
  blue: 'group-hover:text-blue-600',
  green: 'group-hover:text-green-600',
  purple: 'group-hover:text-purple-600',
  yellow: 'group-hover:text-yellow-600',
  orange: 'group-hover:text-orange-600',
  pink: 'group-hover:text-pink-600',
  indigo: 'group-hover:text-indigo-600',
  teal: 'group-hover:text-teal-600',
  gray: 'group-hover:text-gray-600',
}

const DEFAULT_TAG_CLASSES = tagColorClasses.gray
const DEFAULT_ICON_CLASSES = iconColorClasses.gray
// Intentionally gray-900 (not gray-600) to match the original NavItem
// hover behavior when no color prop is provided.
const DEFAULT_HOVER_CLASSES = 'group-hover:text-gray-900'

function isColorKey(value: string): value is ColorKey {
  return Object.hasOwn(tagColorClasses, value)
}

export function getTagClasses(color: string): string {
  return isColorKey(color) ? tagColorClasses[color] : DEFAULT_TAG_CLASSES
}

export function getIconClasses(color: string | undefined): string {
  if (!color) return DEFAULT_ICON_CLASSES
  return isColorKey(color) ? iconColorClasses[color] : DEFAULT_ICON_CLASSES
}

export function getHoverClasses(color: string | undefined): string {
  if (!color) return DEFAULT_HOVER_CLASSES
  return isColorKey(color) ? hoverColorClasses[color] : DEFAULT_HOVER_CLASSES
}
