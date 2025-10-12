# Utility Functions

## Overview

Utility functions are reusable, pure functions that perform common operations throughout your Vue 3 application. This guide covers best practices for creating and organizing utility functions.

## Guiding Principles

1. **Pure Functions**: No side effects, same input = same output
2. **Single Responsibility**: Each function does one thing well
3. **Type Safety**: Leverage TypeScript for type checking
4. **Testability**: Easy to test in isolation
5. **Reusability**: Can be used across the application

## Utility Structure

```bash
src/utils/
  ├── index.ts              # Export all utilities
  ├── date.ts               # Date utilities
  ├── format.ts             # Formatting utilities
  ├── validation.ts         # Validation utilities
  ├── string.ts             # String utilities
  ├── number.ts             # Number utilities
  ├── array.ts              # Array utilities
  ├── object.ts             # Object utilities
  ├── storage.ts            # LocalStorage/SessionStorage utilities
  ├── url.ts                # URL utilities
  └── helpers.ts            # General helpers
```

## Date Utilities

**File**: `src/utils/date.ts`

```typescript
// src/utils/date.ts

/**
 * Format date to readable string
 */
export function formatDate(
  date: Date | string | number,
  format: 'short' | 'long' | 'full' = 'short'
): string {
  const d = new Date(date)
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date'
  }

  const options: Intl.DateTimeFormatOptions = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
  }[format]

  return d.toLocaleDateString('en-US', options)
}

/**
 * Format date and time
 */
export function formatDateTime(
  date: Date | string | number,
  includeSeconds = false
): string {
  const d = new Date(date)
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date'
  }

  const dateStr = formatDate(d, 'short')
  const timeStr = formatTime(d, includeSeconds)
  
  return `${dateStr} ${timeStr}`
}

/**
 * Format time
 */
export function formatTime(
  date: Date | string | number,
  includeSeconds = false
): string {
  const d = new Date(date)
  
  if (isNaN(d.getTime())) {
    return 'Invalid Time'
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' })
  }

  return d.toLocaleTimeString('en-US', options)
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string | number): string {
  const d = new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${pluralize('minute', diffInMinutes)} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${pluralize('hour', diffInHours)} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} ${pluralize('day', diffInDays)} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} ${pluralize('month', diffInMonths)} ago`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} ${pluralize('year', diffInYears)} ago`
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string | number): boolean {
  const d = new Date(date)
  const today = new Date()
  
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date | string | number): boolean {
  const d = new Date(date)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  return d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
}

/**
 * Get start of day
 */
export function startOfDay(date: Date | string | number): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get end of day
 */
export function endOfDay(date: Date | string | number): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Add days to date
 */
export function addDays(date: Date | string | number, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/**
 * Add months to date
 */
export function addMonths(date: Date | string | number, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

/**
 * Get date range
 */
export function getDateRange(
  start: Date | string | number,
  end: Date | string | number
): Date[] {
  const dates: Date[] = []
  const startDate = new Date(start)
  const endDate = new Date(end)
  
  let currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}

/**
 * Format duration in milliseconds to human readable
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  }
  return `${seconds}s`
}

// Helper function for pluralization
function pluralize(word: string, count: number): string {
  return count === 1 ? word : `${word}s`
}
```

## Format Utilities

**File**: `src/utils/format.ts`

```typescript
// src/utils/format.ts

/**
 * Format number as currency
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * Format number with commas
 */
export function formatNumber(
  num: number,
  decimals = 0,
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num)
}

/**
 * Format bytes to human readable size
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  total: number,
  decimals = 2
): string {
  if (total === 0) return '0%'
  const percentage = (value / total) * 100
  return `${percentage.toFixed(decimals)}%`
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  return phone
}

/**
 * Format credit card number
 */
export function formatCreditCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '')
  const groups = cleaned.match(/.{1,4}/g)
  return groups ? groups.join(' ') : cardNumber
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) return str
  return str.slice(0, length - suffix.length) + suffix
}

/**
 * Format initials from name
 */
export function getInitials(name: string, maxLength = 2): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('')
}

/**
 * Format full name
 */
export function formatFullName(
  firstName: string,
  lastName: string,
  middleName?: string
): string {
  const parts = [firstName, middleName, lastName].filter(Boolean)
  return parts.join(' ')
}
```

## Validation Utilities

**File**: `src/utils/validation.ts`

```typescript
// src/utils/validation.ts

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate phone number (US format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  return phoneRegex.test(phone)
}

/**
 * Validate credit card number (Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '')
  
  if (!/^\d+$/.test(cleaned)) return false
  
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i))
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  strength: 'weak' | 'medium' | 'strong'
  errors: string[]
} {
  const errors: string[] = []
  let strength: 'weak' | 'medium' | 'strong' = 'weak'

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain numbers')
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain special characters')
  }

  // Determine strength
  if (errors.length === 0) {
    strength = 'strong'
  } else if (errors.length <= 2) {
    strength = 'medium'
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors
  }
}

/**
 * Validate required field
 */
export function isRequired(value: any): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Validate min length
 */
export function minLength(value: string, min: number): boolean {
  return value.length >= min
}

/**
 * Validate max length
 */
export function maxLength(value: string, max: number): boolean {
  return value.length <= max
}

/**
 * Validate number range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Validate date is in the future
 */
export function isFutureDate(date: Date | string): boolean {
  return new Date(date) > new Date()
}

/**
 * Validate date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  return new Date(date) < new Date()
}
```

## String Utilities

**File**: `src/utils/string.ts`

```typescript
// src/utils/string.ts

/**
 * Convert to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^[A-Z]/, char => char.toLowerCase())
}

/**
 * Convert to PascalCase
 */
export function toPascalCase(str: string): string {
  const camel = toCamelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

/**
 * Convert to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Convert to snake_case
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Capitalize each word
 */
export function titleCase(str: string): string {
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Generate random string
 */
export function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * Generate slug from string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Remove HTML tags
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Escape HTML
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  
  return str.replace(/[&<>"']/g, char => htmlEscapes[char])
}
```

## Array Utilities

**File**: `src/utils/array.ts`

```typescript
// src/utils/array.ts

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key])
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {} as Record<string, T[]>)
}

/**
 * Sort array by key
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  
  return chunks
}

/**
 * Shuffle array
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

/**
 * Get random item from array
 */
export function sample<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Flatten nested array
 */
export function flatten<T>(array: any[]): T[] {
  return array.reduce(
    (flat, item) => flat.concat(Array.isArray(item) ? flatten(item) : item),
    []
  )
}
```

## Object Utilities

**File**: `src/utils/object.ts`

```typescript
// src/utils/object.ts

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target

  const source = sources.shift()
  if (!source) return target

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key] as any, source[key] as any)
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

/**
 * Check if value is object
 */
export function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Pick keys from object
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  
  return result
}

/**
 * Omit keys from object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  
  keys.forEach(key => {
    delete result[key]
  })
  
  return result
}

/**
 * Check if objects are equal (deep comparison)
 */
export function isEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

/**
 * Get nested property value
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * Set nested property value
 */
export function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {}
    return current[key]
  }, obj)
  
  target[lastKey] = value
}
```

## Storage Utilities

**File**: `src/utils/storage.ts`

```typescript
// src/utils/storage.ts

/**
 * Set item in localStorage with JSON serialization
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

/**
 * Get item from localStorage with JSON parsing
 */
export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : (defaultValue ?? null)
  } catch (error) {
    console.error('Failed to read from localStorage:', error)
    return defaultValue ?? null
  }
}

/**
 * Remove item from localStorage
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to remove from localStorage:', error)
  }
}

/**
 * Clear all localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}

// SessionStorage utilities (same pattern)
export function setSessionStorage<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to sessionStorage:', error)
  }
}

export function getSessionStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : (defaultValue ?? null)
  } catch (error) {
    console.error('Failed to read from sessionStorage:', error)
    return defaultValue ?? null
  }
}
```

## Export All Utilities

**File**: `src/utils/index.ts`

```typescript
// src/utils/index.ts
export * from './date'
export * from './format'
export * from './validation'
export * from './string'
export * from './array'
export * from './object'
export * from './storage'
export * from './url'
export * from './helpers'
```

## Usage Examples

```vue
<script setup lang="ts">
import { 
  formatDate, 
  formatCurrency, 
  isValidEmail,
  truncate 
} from '@/utils'

const date = new Date()
const formattedDate = formatDate(date, 'long')
// Output: "December 25, 2023"

const price = 1234.56
const formattedPrice = formatCurrency(price)
// Output: "$1,234.56"

const email = 'user@example.com'
const isValid = isValidEmail(email)
// Output: true

const longText = 'This is a very long text that needs to be truncated'
const short = truncate(longText, 30)
// Output: "This is a very long text th..."
</script>
```

## Testing Utilities

```typescript
// src/utils/date.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate, getRelativeTime, addDays } from './date'

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date in short format', () => {
      const date = new Date('2023-12-25')
      expect(formatDate(date, 'short')).toBe('Dec 25, 2023')
    })

    it('should handle invalid dates', () => {
      expect(formatDate('invalid')).toBe('Invalid Date')
    })
  })

  describe('addDays', () => {
    it('should add days to date', () => {
      const date = new Date('2023-12-25')
      const result = addDays(date, 5)
      expect(result.getDate()).toBe(30)
    })
  })
})
```

## Best Practices

### DO ✅

- Write pure functions without side effects
- Add comprehensive TypeScript types
- Include JSDoc comments for complex functions
- Test all utility functions
- Keep functions focused and small
- Use descriptive names
- Handle edge cases
- Export utilities through index file

### DON'T ❌

- Don't modify input parameters
- Don't access global state
- Don't make API calls in utilities
- Don't create circular dependencies
- Don't forget error handling
- Don't make assumptions about input
- Don't duplicate existing libraries

---

[← Back to Logging](./logging.md) | [Next: Middleware →](./milddware.md)

