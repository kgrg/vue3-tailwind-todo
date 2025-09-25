/**
 * Tasks Store (Extended)
 * Pinia store for managing tasks with label associations
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task } from '@/types/task.types'
import { tasksRepository } from '@/core/repositories/tasks.repository'
import { createErrorContext } from '@/core/utils/error-handler'

export interface TaskWithLabels extends Task {
  labelIds: string[]
}

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref<TaskWithLabels[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const labelFilters = ref<string[]>([])
  const filterOperator = ref<'AND' | 'OR'>('OR')

  // Getters
  const filteredTasks = computed(() => {
    if (labelFilters.value.length === 0) {
      return tasks.value
    }

    if (filterOperator.value === 'AND') {
      // Tasks must have ALL selected labels
      return tasks.value.filter(task =>
        labelFilters.value.every(labelId => task.labelIds.includes(labelId))
      )
    } else {
      // Tasks must have ANY of the selected labels
      return tasks.value.filter(task =>
        labelFilters.value.some(labelId => task.labelIds.includes(labelId))
      )
    }
  })

  const tasksByLabel = computed(() => {
    const map = new Map<string, TaskWithLabels[]>()

    tasks.value.forEach(task => {
      task.labelIds.forEach(labelId => {
        if (!map.has(labelId)) {
          map.set(labelId, [])
        }
        map.get(labelId)!.push(task)
      })
    })

    return map
  })

  const tasksWithoutLabels = computed(() => {
    return tasks.value.filter(task => task.labelIds.length === 0)
  })

  const labelUsageStats = computed(() => {
    const stats = new Map<string, number>()

    tasks.value.forEach(task => {
      task.labelIds.forEach(labelId => {
        stats.set(labelId, (stats.get(labelId) || 0) + 1)
      })
    })

    return stats
  })

  // Actions
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (value: string | null) => {
    error.value = value
  }

  const clearError = () => {
    error.value = null
  }

  const loadTasks = async () => {
    try {
      setLoading(true)
      clearError()

      const context = createErrorContext('load_tasks')
      // This would typically load from a tasks repository
      // For now, we'll use the existing localStorage approach
      const storedTasks = localStorage.getItem('tasks')
      if (storedTasks) {
        const parsed = JSON.parse(storedTasks)
        tasks.value = parsed.tasks || []
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks'
      setError(errorMessage)
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const addLabelToTask = async (taskId: string, labelId: string) => {
    try {
      setLoading(true)
      clearError()

      const context = createErrorContext('add_label_to_task')
      await tasksRepository.addLabelToTask(taskId, labelId)

      const task = tasks.value.find(t => t.id === taskId)
      if (task && !task.labelIds.includes(labelId)) {
        task.labelIds.push(labelId)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add label to task'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeLabelFromTask = async (taskId: string, labelId: string) => {
    try {
      setLoading(true)
      clearError()

      const context = createErrorContext('remove_label_from_task')
      await tasksRepository.removeLabelFromTask(taskId, labelId)

      const task = tasks.value.find(t => t.id === taskId)
      if (task) {
        task.labelIds = task.labelIds.filter(id => id !== labelId)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove label from task'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTaskLabels = async (taskId: string, labelIds: string[]) => {
    try {
      setLoading(true)
      clearError()

      const context = createErrorContext('update_task_labels')
      await tasksRepository.updateLabelIds(taskId, labelIds)

      const task = tasks.value.find(t => t.id === taskId)
      if (task) {
        task.labelIds = [...labelIds]
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task labels'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeLabelFromAllTasks = async (labelId: string) => {
    try {
      setLoading(true)
      clearError()

      const context = createErrorContext('remove_label_from_all_tasks')
      await tasksRepository.removeLabelFromAllTasks(labelId)

      tasks.value.forEach(task => {
        task.labelIds = task.labelIds.filter(id => id !== labelId)
      })
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to remove label from all tasks'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const setLabelFilters = (labelIds: string[]) => {
    labelFilters.value = [...labelIds]
  }

  const addLabelFilter = (labelId: string) => {
    if (!labelFilters.value.includes(labelId)) {
      labelFilters.value.push(labelId)
    }
  }

  const removeLabelFilter = (labelId: string) => {
    labelFilters.value = labelFilters.value.filter(id => id !== labelId)
  }

  const clearLabelFilters = () => {
    labelFilters.value = []
  }

  const setFilterOperator = (operator: 'AND' | 'OR') => {
    filterOperator.value = operator
  }

  const toggleFilterOperator = () => {
    filterOperator.value = filterOperator.value === 'AND' ? 'OR' : 'AND'
  }

  const getTasksByLabel = (labelId: string): TaskWithLabels[] => {
    return tasks.value.filter(task => task.labelIds.includes(labelId))
  }

  const getTasksByLabels = (
    labelIds: string[],
    operator: 'AND' | 'OR' = 'OR'
  ): TaskWithLabels[] => {
    if (operator === 'AND') {
      return tasks.value.filter(task => labelIds.every(labelId => task.labelIds.includes(labelId)))
    } else {
      return tasks.value.filter(task => labelIds.some(labelId => task.labelIds.includes(labelId)))
    }
  }

  const getLabelUsageCount = (labelId: string): number => {
    return tasks.value.reduce((count, task) => {
      return count + (task.labelIds.includes(labelId) ? 1 : 0)
    }, 0)
  }

  const getUnusedLabels = (allLabelIds: string[]): string[] => {
    const usedLabelIds = new Set<string>()
    tasks.value.forEach(task => {
      task.labelIds.forEach(labelId => usedLabelIds.add(labelId))
    })

    return allLabelIds.filter(labelId => !usedLabelIds.has(labelId))
  }

  const hasActiveFilters = computed(() => labelFilters.value.length > 0)

  const activeFilterCount = computed(() => labelFilters.value.length)

  return {
    // State
    tasks,
    loading,
    error,
    labelFilters,
    filterOperator,

    // Getters
    filteredTasks,
    tasksByLabel,
    tasksWithoutLabels,
    labelUsageStats,
    hasActiveFilters,
    activeFilterCount,

    // Actions
    setLoading,
    setError,
    clearError,
    loadTasks,
    addLabelToTask,
    removeLabelFromTask,
    updateTaskLabels,
    removeLabelFromAllTasks,
    setLabelFilters,
    addLabelFilter,
    removeLabelFilter,
    clearLabelFilters,
    setFilterOperator,
    toggleFilterOperator,
    getTasksByLabel,
    getTasksByLabels,
    getLabelUsageCount,
    getUnusedLabels,
  }
})
