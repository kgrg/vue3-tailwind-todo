/**
 * Label Validation Schemas and Functions
 * Provides validation for label data using Zod schemas
 */

import { z } from 'zod'
import type {
  Label,
  CreateLabelRequest,
  UpdateLabelRequest,
  LabelValidationResult,
  LabelError,
} from '../../types/label.types'

// Label creation schema
export const labelCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Label name is required')
    .max(32, 'Label name must be 32 characters or less')
    .trim()
    .refine(name => name.length > 0, 'Label name cannot be empty'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{3,6}$/, 'Please enter a valid hex color like #AABBCC')
    .refine(
      color => color.length === 4 || color.length === 7,
      'Color must be 3 or 6 digit hex format'
    ),
})

// Label update schema
export const labelUpdateSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Label name is required')
      .max(32, 'Label name must be 32 characters or less')
      .trim()
      .optional(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{3,6}$/, 'Please enter a valid hex color like #AABBCC')
      .refine(
        color => color.length === 4 || color.length === 7,
        'Color must be 3 or 6 digit hex format'
      )
      .optional(),
  })
  .refine(
    data => data.name !== undefined || data.color !== undefined,
    'At least one field must be provided for update'
  )

// Label assignment schema
export const labelAssignmentSchema = z.object({
  taskId: z.string().uuid('Invalid task ID format'),
  labelIds: z
    .array(z.string().uuid('Invalid label ID format'))
    .max(12, 'Maximum 12 labels per task')
    .refine(ids => new Set(ids).size === ids.length, 'Duplicate label IDs not allowed'),
})

// Label filter schema
export const labelFilterSchema = z.object({
  labelIds: z
    .array(z.string().uuid('Invalid label ID format'))
    .min(1, 'At least one label must be selected'),
  operator: z.enum(['AND', 'OR']).default('OR'),
})

/**
 * Validates label creation data
 */
export function validateLabelCreate(data: CreateLabelRequest): LabelValidationResult {
  try {
    labelCreateSchema.parse(data)
    return { isValid: true, errors: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: LabelError[] = error.errors.map(err => ({
        code: err.code,
        message: err.message,
        field: err.path.join('.'),
      }))
      return { isValid: false, errors }
    }
    return { isValid: false, errors: [{ code: 'UNKNOWN_ERROR', message: 'Validation failed' }] }
  }
}

/**
 * Validates label update data
 */
export function validateLabelUpdate(data: UpdateLabelRequest): LabelValidationResult {
  try {
    labelUpdateSchema.parse(data)
    return { isValid: true, errors: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: LabelError[] = error.errors.map(err => ({
        code: err.code,
        message: err.message,
        field: err.path.join('.'),
      }))
      return { isValid: false, errors }
    }
    return { isValid: false, errors: [{ code: 'UNKNOWN_ERROR', message: 'Validation failed' }] }
  }
}

/**
 * Validates label assignment data
 */
export function validateLabelAssignment(data: {
  taskId: string
  labelIds: string[]
}): LabelValidationResult {
  try {
    labelAssignmentSchema.parse(data)
    return { isValid: true, errors: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: LabelError[] = error.errors.map(err => ({
        code: err.code,
        message: err.message,
        field: err.path.join('.'),
      }))
      return { isValid: false, errors }
    }
    return { isValid: false, errors: [{ code: 'UNKNOWN_ERROR', message: 'Validation failed' }] }
  }
}

/**
 * Validates label filter data
 */
export function validateLabelFilter(data: {
  labelIds: string[]
  operator?: 'AND' | 'OR'
}): LabelValidationResult {
  try {
    labelFilterSchema.parse(data)
    return { isValid: true, errors: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: LabelError[] = error.errors.map(err => ({
        code: err.code,
        message: err.message,
        field: err.path.join('.'),
      }))
      return { isValid: false, errors }
    }
    return { isValid: false, errors: [{ code: 'UNKNOWN_ERROR', message: 'Validation failed' }] }
  }
}

/**
 * Validates label name uniqueness
 */
export function validateLabelNameUnique(
  name: string,
  existingLabels: Label[],
  excludeId?: string
): boolean {
  const trimmedName = name.trim().toLowerCase()
  return !existingLabels.some(
    label => label.id !== excludeId && label.name.toLowerCase() === trimmedName
  )
}

/**
 * Validates color contrast for accessibility
 */
export function validateColorContrast(backgroundColor: string): {
  textColor: 'black' | 'white'
  contrast: number
} {
  // Remove # if present
  const hex = backgroundColor.replace('#', '')

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Determine text color based on background luminance
  const textColor = luminance > 0.5 ? 'black' : 'white'

  // Calculate contrast ratio
  const textLuminance = textColor === 'black' ? 0 : 1
  const contrast =
    (Math.max(luminance, textLuminance) + 0.05) / (Math.min(luminance, textLuminance) + 0.05)

  return { textColor, contrast }
}

/**
 * Sanitizes label name for safe display
 */
export function sanitizeLabelName(name: string): string {
  return name.trim().replace(/[<>]/g, '') // Remove potential HTML tags
}

/**
 * Normalizes hex color format
 */
export function normalizeHexColor(color: string): string {
  const hex = color.replace('#', '')
  if (hex.length === 3) {
    // Convert 3-digit hex to 6-digit
    return (
      '#' +
      hex
        .split('')
        .map(char => char + char)
        .join('')
    )
  }
  return '#' + hex
}
