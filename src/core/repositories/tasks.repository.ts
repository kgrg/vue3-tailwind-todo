/**
 * Tasks Repository
 * Provides localStorage persistence for task-label associations
 */

import type { TaskLabelRepository } from '../../types/label.types'
import {
  LabelError,
  StorageError,
  NotFoundError,
  createErrorContext,
  handleAsyncOperation,
} from '../utils/error-handler'
import { validateLabelAssignment } from '../validation/label.validation'

const TASKS_STORAGE_KEY = 'tasks'
const MAX_LABELS_PER_TASK = 12

interface StoredTasks {
  tasks: Task[]
  lastUpdated: string
}

interface Task {
  id: string
  title: string
  completed?: boolean
  createdAt?: string
  updatedAt?: string
  labelIds: string[]
}

export class TasksRepositoryImpl implements TaskLabelRepository {
  private getStorageData(): StoredTasks {
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY)
      if (!stored) {
        return {
          tasks: [],
          lastUpdated: new Date().toISOString(),
        }
      }

      const data = JSON.parse(stored) as StoredTasks
      return data
    } catch (error) {
      const context = createErrorContext('get_tasks_storage_data')
      throw new StorageError('Failed to read tasks from storage', context)
    }
  }

  private setStorageData(data: StoredTasks): void {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      const context = createErrorContext('set_tasks_storage_data')
      throw new StorageError('Failed to save tasks to storage', context)
    }
  }

  async updateLabelIds(taskId: string, labelIds: string[]): Promise<void> {
    return handleAsyncOperation(async () => {
      // Validate input
      const validation = validateLabelAssignment({ taskId, labelIds })
      if (!validation.isValid) {
        const context = createErrorContext('update_task_labels')
        throw new LabelError(
          validation.errors[0]?.message || 'Validation failed',
          validation.errors[0]?.code || 'VALIDATION_ERROR',
          context,
          validation.errors[0]?.field
        )
      }

      // Check label limit
      if (labelIds.length > MAX_LABELS_PER_TASK) {
        const context = createErrorContext('update_task_labels')
        throw new LabelError(
          `Maximum ${MAX_LABELS_PER_TASK} labels per task`,
          'TOO_MANY_LABELS',
          context
        )
      }

      const data = this.getStorageData()
      const taskIndex = data.tasks.findIndex(t => t.id === taskId)

      if (taskIndex === -1) {
        const context = createErrorContext('update_task_labels')
        throw new NotFoundError('Task', taskId, context)
      }

      // Update task with new label IDs
      const updatedTasks = [...data.tasks]
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        labelIds: [...labelIds], // Create new array to avoid reference issues
        updatedAt: new Date().toISOString(),
      }

      const updatedData: StoredTasks = {
        ...data,
        tasks: updatedTasks,
        lastUpdated: new Date().toISOString(),
      }

      this.setStorageData(updatedData)
    }, createErrorContext('update_task_labels'))!
  }

  async getTasksByLabelIds(labelIds: string[], operator: 'AND' | 'OR' = 'OR'): Promise<any[]> {
    return (
      handleAsyncOperation(async () => {
        if (labelIds.length === 0) {
          return []
        }

        const data = this.getStorageData()

        if (operator === 'AND') {
          // Tasks must have ALL specified labels
          return data.tasks.filter(task =>
            labelIds.every(labelId => task.labelIds.includes(labelId))
          )
        } else {
          // Tasks must have ANY of the specified labels
          return data.tasks.filter(task =>
            labelIds.some(labelId => task.labelIds.includes(labelId))
          )
        }
      }, createErrorContext('get_tasks_by_labels')) || []
    )
  }

  async removeLabelFromAllTasks(labelId: string): Promise<void> {
    return handleAsyncOperation(async () => {
      const data = this.getStorageData()

      // Remove label from all tasks
      const updatedTasks = data.tasks.map(task => ({
        ...task,
        labelIds: task.labelIds.filter(id => id !== labelId),
        updatedAt: new Date().toISOString(),
      }))

      const updatedData: StoredTasks = {
        ...data,
        tasks: updatedTasks,
        lastUpdated: new Date().toISOString(),
      }

      this.setStorageData(updatedData)
    }, createErrorContext('remove_label_from_all_tasks'))!
  }

  /**
   * Gets tasks that have specific labels
   */
  async getTasksWithLabels(labelIds: string[]): Promise<any[]> {
    return (
      handleAsyncOperation(async () => {
        const data = this.getStorageData()
        return data.tasks.filter(task => task.labelIds.some(labelId => labelIds.includes(labelId)))
      }, createErrorContext('get_tasks_with_labels')) || []
    )
  }

  /**
   * Gets tasks without any labels
   */
  async getTasksWithoutLabels(): Promise<any[]> {
    return (
      handleAsyncOperation(async () => {
        const data = this.getStorageData()
        return data.tasks.filter(task => task.labelIds.length === 0)
      }, createErrorContext('get_tasks_without_labels')) || []
    )
  }

  /**
   * Gets label usage statistics
   */
  async getLabelUsageStats(): Promise<Record<string, number>> {
    return (
      handleAsyncOperation(async () => {
        const data = this.getStorageData()
        const stats: Record<string, number> = {}

        data.tasks.forEach(task => {
          task.labelIds.forEach(labelId => {
            stats[labelId] = (stats[labelId] || 0) + 1
          })
        })

        return stats
      }, createErrorContext('get_label_usage_stats')) || {}
    )
  }

  /**
   * Gets tasks by single label ID
   */
  async getTasksByLabelId(labelId: string): Promise<any[]> {
    return (
      handleAsyncOperation(async () => {
        const data = this.getStorageData()
        return data.tasks.filter(task => task.labelIds.includes(labelId))
      }, createErrorContext('get_tasks_by_label_id')) || []
    )
  }

  /**
   * Adds a label to a task
   */
  async addLabelToTask(taskId: string, labelId: string): Promise<void> {
    return handleAsyncOperation(async () => {
      const data = this.getStorageData()
      const taskIndex = data.tasks.findIndex(t => t.id === taskId)

      if (taskIndex === -1) {
        const context = createErrorContext('add_label_to_task')
        throw new NotFoundError('Task', taskId, context)
      }

      const task = data.tasks[taskIndex]

      // Check if label is already assigned
      if (task.labelIds.includes(labelId)) {
        return // Already assigned, no need to update
      }

      // Check label limit
      if (task.labelIds.length >= MAX_LABELS_PER_TASK) {
        const context = createErrorContext('add_label_to_task')
        throw new LabelError(
          `Maximum ${MAX_LABELS_PER_TASK} labels per task`,
          'TOO_MANY_LABELS',
          context
        )
      }

      // Add label to task
      const updatedTasks = [...data.tasks]
      updatedTasks[taskIndex] = {
        ...task,
        labelIds: [...task.labelIds, labelId],
        updatedAt: new Date().toISOString(),
      }

      const updatedData: StoredTasks = {
        ...data,
        tasks: updatedTasks,
        lastUpdated: new Date().toISOString(),
      }

      this.setStorageData(updatedData)
    }, createErrorContext('add_label_to_task'))!
  }

  /**
   * Removes a label from a task
   */
  async removeLabelFromTask(taskId: string, labelId: string): Promise<void> {
    return handleAsyncOperation(async () => {
      const data = this.getStorageData()
      const taskIndex = data.tasks.findIndex(t => t.id === taskId)

      if (taskIndex === -1) {
        const context = createErrorContext('remove_label_from_task')
        throw new NotFoundError('Task', taskId, context)
      }

      const task = data.tasks[taskIndex]

      // Remove label from task
      const updatedTasks = [...data.tasks]
      updatedTasks[taskIndex] = {
        ...task,
        labelIds: task.labelIds.filter(id => id !== labelId),
        updatedAt: new Date().toISOString(),
      }

      const updatedData: StoredTasks = {
        ...data,
        tasks: updatedTasks,
        lastUpdated: new Date().toISOString(),
      }

      this.setStorageData(updatedData)
    }, createErrorContext('remove_label_from_task'))!
  }

  /**
   * Migrates existing tasks to include labelIds array
   */
  async migrateTasksToIncludeLabelIds(): Promise<void> {
    return handleAsyncOperation(async () => {
      const data = this.getStorageData()
      let needsMigration = false

      const migratedTasks = data.tasks.map(task => {
        if (!task.labelIds) {
          needsMigration = true
          return {
            ...task,
            labelIds: [],
            updatedAt: new Date().toISOString(),
          }
        }
        return task
      })

      if (needsMigration) {
        const updatedData: StoredTasks = {
          ...data,
          tasks: migratedTasks,
          lastUpdated: new Date().toISOString(),
        }
        this.setStorageData(updatedData)
      }
    }, createErrorContext('migrate_tasks_label_ids'))!
  }
}

// Export singleton instance
export const tasksRepository = new TasksRepositoryImpl()
