/**
 * Task Migration Utilities
 * Handles migration of existing tasks to include labelIds array
 */

import {
  LabelError,
  MigrationError,
  createErrorContext,
  handleAsyncOperation,
} from '../utils/error-handler'
import { tasksRepository } from '../repositories/tasks.repository'

export interface MigrationResult {
  success: boolean
  migratedTasks: number
  errors: string[]
  timestamp: string
}

export interface TaskMigrationOptions {
  dryRun?: boolean
  backup?: boolean
  force?: boolean
}

/**
 * Migrates existing tasks to include labelIds array
 */
export async function migrateTasksToIncludeLabelIds(
  options: TaskMigrationOptions = {}
): Promise<MigrationResult> {
  return handleAsyncOperation(async () => {
    const context = createErrorContext('migrate_tasks_to_include_label_ids')
    const result: MigrationResult = {
      success: false,
      migratedTasks: 0,
      errors: [],
      timestamp: new Date().toISOString(),
    }

    try {
      // Check if migration is needed
      const needsMigration = await checkIfMigrationNeeded()

      if (!needsMigration && !options.force) {
        result.success = true
        return result
      }

      if (options.backup) {
        await createBackup()
      }

      if (!options.dryRun) {
        await tasksRepository.migrateTasksToIncludeLabelIds()
      }

      // Count migrated tasks
      const allTasks = await tasksRepository.getTasksByLabelIds([])
      result.migratedTasks = allTasks.length
      result.success = true

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown migration error'
      result.errors.push(errorMessage)

      if (error instanceof LabelError) {
        throw error
      }

      throw new MigrationError(errorMessage, context)
    }
  }, createErrorContext('migrate_tasks_to_include_label_ids'))!
}

/**
 * Checks if migration is needed
 */
async function checkIfMigrationNeeded(): Promise<boolean> {
  try {
    const data = localStorage.getItem('tasks')
    if (!data) {
      return false // No tasks to migrate
    }

    const parsed = JSON.parse(data)
    if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
      return false // Invalid data structure
    }

    // Check if any task is missing labelIds
    return parsed.tasks.some((task: any) => !task.labelIds)
  } catch (error) {
    return false // If we can't parse, assume no migration needed
  }
}

/**
 * Creates a backup of current task data
 */
async function createBackup(): Promise<void> {
  try {
    const data = localStorage.getItem('tasks')
    if (data) {
      const backupKey = `tasks_backup_${Date.now()}`
      localStorage.setItem(backupKey, data)
    }
  } catch (error) {
    const context = createErrorContext('create_backup')
    throw new MigrationError('Failed to create backup', context)
  }
}

/**
 * Validates migrated data integrity
 */
export async function validateMigrationIntegrity(): Promise<{
  isValid: boolean
  issues: string[]
}> {
  return (
    handleAsyncOperation(async () => {
      const issues: string[] = []

      try {
        const data = localStorage.getItem('tasks')
        if (!data) {
          return { isValid: true, issues: [] }
        }

        const parsed = JSON.parse(data)
        if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
          issues.push('Invalid task data structure')
          return { isValid: false, issues }
        }

        // Check each task for required fields
        parsed.tasks.forEach((task: any, index: number) => {
          if (!task.id) {
            issues.push(`Task at index ${index} missing ID`)
          }

          if (!Array.isArray(task.labelIds)) {
            issues.push(`Task ${task.id} has invalid labelIds format`)
          }

          if (task.labelIds && task.labelIds.length > 12) {
            issues.push(`Task ${task.id} has too many labels (${task.labelIds.length})`)
          }
        })

        return {
          isValid: issues.length === 0,
          issues,
        }
      } catch (error) {
        issues.push('Failed to validate migration integrity')
        return { isValid: false, issues }
      }
    }, createErrorContext('validate_migration_integrity')) || {
      isValid: false,
      issues: ['Validation failed'],
    }
  )
}

/**
 * Rolls back migration using backup
 */
export async function rollbackMigration(backupKey: string): Promise<void> {
  return handleAsyncOperation(async () => {
    try {
      const backupData = localStorage.getItem(backupKey)
      if (!backupData) {
        throw new Error(`Backup ${backupKey} not found`)
      }

      localStorage.setItem('tasks', backupData)
    } catch (error) {
      const context = createErrorContext('rollback_migration')
      throw new MigrationError('Failed to rollback migration', context)
    }
  }, createErrorContext('rollback_migration'))!
}

/**
 * Gets migration status
 */
export async function getMigrationStatus(): Promise<{
  needsMigration: boolean
  hasBackup: boolean
  lastMigration?: string
}> {
  return (
    handleAsyncOperation(async () => {
      const needsMigration = await checkIfMigrationNeeded()

      // Check for backup files
      const hasBackup = Object.keys(localStorage).some(key => key.startsWith('tasks_backup_'))

      // Get last migration timestamp from storage
      const lastMigration = localStorage.getItem('last_migration')

      return {
        needsMigration,
        hasBackup,
        lastMigration: lastMigration || undefined,
      }
    }, createErrorContext('get_migration_status')) || { needsMigration: false, hasBackup: false }
  )
}

/**
 * Cleans up old backup files
 */
export async function cleanupOldBackups(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
  return handleAsyncOperation(async () => {
    const now = Date.now()
    const keysToRemove: string[] = []

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('tasks_backup_')) {
        const timestamp = parseInt(key.replace('tasks_backup_', ''))
        if (now - timestamp > maxAge) {
          keysToRemove.push(key)
        }
      }
    })

    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })
  }, createErrorContext('cleanup_old_backups'))!
}

/**
 * Initializes migration on app startup
 */
export async function initializeMigration(): Promise<MigrationResult> {
  return handleAsyncOperation(async () => {
    const status = await getMigrationStatus()

    if (status.needsMigration) {
      return await migrateTasksToIncludeLabelIds({
        backup: true,
        force: false,
      })
    }

    return {
      success: true,
      migratedTasks: 0,
      errors: [],
      timestamp: new Date().toISOString(),
    }
  }, createErrorContext('initialize_migration'))!
}
