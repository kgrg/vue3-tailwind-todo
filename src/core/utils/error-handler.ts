/**
 * Error Handling Utilities
 * Provides centralized error handling for the labels feature
 */

import type { LabelError } from '../../types/label.types'

export interface ErrorContext {
  operation: string
  component?: string
  userId?: string
  timestamp: string
}

export class LabelError extends Error {
  public readonly code: string
  public readonly field?: string
  public readonly context: ErrorContext

  constructor(message: string, code: string, context: ErrorContext, field?: string) {
    super(message)
    this.name = 'LabelError'
    this.code = code
    this.field = field
    this.context = context
  }
}

export class ValidationError extends LabelError {
  constructor(message: string, field: string, context: ErrorContext) {
    super(message, 'VALIDATION_ERROR', context, field)
    this.name = 'ValidationError'
  }
}

export class StorageError extends LabelError {
  constructor(message: string, context: ErrorContext) {
    super(message, 'STORAGE_ERROR', context)
    this.name = 'StorageError'
  }
}

export class MigrationError extends LabelError {
  constructor(message: string, context: ErrorContext) {
    super(message, 'MIGRATION_ERROR', context)
    this.name = 'MigrationError'
  }
}

export class NotFoundError extends LabelError {
  constructor(resource: string, id: string, context: ErrorContext) {
    super(`${resource} with ID '${id}' not found`, 'NOT_FOUND', context)
    this.name = 'NotFoundError'
  }
}

export class DuplicateError extends LabelError {
  constructor(field: string, value: string, context: ErrorContext) {
    super(`A label with ${field} '${value}' already exists`, 'DUPLICATE_ERROR', context, field)
    this.name = 'DuplicateError'
  }
}

/**
 * Error codes and their corresponding user-friendly messages
 */
export const ERROR_MESSAGES: Record<string, string> = {
  LABEL_NAME_REQUIRED: 'Label name is required',
  LABEL_NAME_TOO_LONG: 'Label name must be 32 characters or less',
  LABEL_NAME_DUPLICATE: 'A label with this name already exists',
  LABEL_COLOR_INVALID: 'Please enter a valid hex color like #AABBCC',
  TOO_MANY_LABELS: 'Maximum 12 labels per task',
  STORAGE_ERROR: 'Unable to save labels. Please try again.',
  MIGRATION_ERROR: 'Unable to load existing tasks. Please refresh the page.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested label was not found.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
}

/**
 * Creates a user-friendly error message
 */
export function createErrorMessage(error: LabelError): string {
  return ERROR_MESSAGES[error.code] || ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * Logs error with context for debugging
 */
export function logError(error: LabelError, additionalContext?: Record<string, any>): void {
  console.error('Label Error:', {
    name: error.name,
    message: error.message,
    code: error.code,
    field: error.field,
    context: error.context,
    additionalContext,
    stack: error.stack,
  })
}

/**
 * Handles async operations with error catching
 */
export async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  context: ErrorContext,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await operation()
  } catch (error) {
    if (error instanceof LabelError) {
      logError(error)
      throw error
    }

    // Handle unexpected errors
    const labelError = new LabelError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'UNKNOWN_ERROR',
      context
    )
    logError(labelError)

    if (fallback !== undefined) {
      return fallback
    }

    throw labelError
  }
}

/**
 * Creates error context for operations
 */
export function createErrorContext(operation: string, component?: string): ErrorContext {
  return {
    operation,
    component,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Validates error recovery strategies
 */
export function canRecoverFromError(error: LabelError): boolean {
  const recoverableErrors = ['STORAGE_ERROR', 'VALIDATION_ERROR']

  return recoverableErrors.includes(error.code)
}

/**
 * Gets retry delay based on error type
 */
export function getRetryDelay(error: LabelError, attempt: number): number {
  const baseDelay = 1000 // 1 second
  const maxDelay = 10000 // 10 seconds
  const delay = baseDelay * Math.pow(2, attempt - 1)
  return Math.min(delay, maxDelay)
}

/**
 * Error boundary for React-like error handling in Vue
 */
export function createErrorBoundary(componentName: string) {
  return {
    catchError: (error: unknown, context: Record<string, any>) => {
      const errorContext = createErrorContext('component_error', componentName)
      const labelError = new LabelError(
        error instanceof Error ? error.message : 'Component error',
        'COMPONENT_ERROR',
        errorContext
      )

      logError(labelError, context)
      return labelError
    },
  }
}
