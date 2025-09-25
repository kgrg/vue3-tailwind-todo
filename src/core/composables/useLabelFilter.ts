/**
 * useLabelFilter Composable
 * Provides label filtering functionality for tasks
 */

import { ref, computed, watch } from 'vue'
import { useLabelsStore } from '@/stores/labels.store'
import { useTasksStore } from '@/stores/tasks.store'
import type { Label } from '@/types/label.types'

export function useLabelFilter() {
  const labelsStore = useLabelsStore()
  const tasksStore = useTasksStore()

  // Local state
  const selectedLabelIds = ref<string[]>([])
  const filterOperator = ref<'AND' | 'OR'>('OR')
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const selectedLabels = computed(() => labelsStore.getLabelsByIds(selectedLabelIds.value))

  const hasActiveFilters = computed(() => selectedLabelIds.value.length > 0)

  const filterCount = computed(() => selectedLabelIds.value.length)

  const availableLabels = computed(() => labelsStore.labels)

  const filteredTasks = computed(() => {
    if (!hasActiveFilters.value) {
      return tasksStore.tasks
    }

    return tasksStore.getTasksByLabels(selectedLabelIds.value, filterOperator.value)
  })

  // Methods
  const loadLabels = async () => {
    try {
      loading.value = true
      error.value = null
      await labelsStore.loadLabels()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load labels'
    } finally {
      loading.value = false
    }
  }

  const addLabelFilter = (labelId: string) => {
    if (!selectedLabelIds.value.includes(labelId)) {
      selectedLabelIds.value.push(labelId)
      applyFilters()
    }
  }

  const removeLabelFilter = (labelId: string) => {
    selectedLabelIds.value = selectedLabelIds.value.filter(id => id !== labelId)
    applyFilters()
  }

  const toggleLabelFilter = (labelId: string) => {
    if (selectedLabelIds.value.includes(labelId)) {
      removeLabelFilter(labelId)
    } else {
      addLabelFilter(labelId)
    }
  }

  const clearFilters = () => {
    selectedLabelIds.value = []
    applyFilters()
  }

  const setFilterOperator = (operator: 'AND' | 'OR') => {
    filterOperator.value = operator
    applyFilters()
  }

  const toggleFilterOperator = () => {
    filterOperator.value = filterOperator.value === 'AND' ? 'OR' : 'AND'
    applyFilters()
  }

  const applyFilters = () => {
    try {
      tasksStore.setLabelFilters(selectedLabelIds.value)
      tasksStore.setFilterOperator(filterOperator.value)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to apply filters'
    }
  }

  const getLabelUsageCount = (labelId: string) => {
    return tasksStore.getLabelUsageCount(labelId)
  }

  const getTasksByLabel = (labelId: string) => {
    return tasksStore.getTasksByLabel(labelId)
  }

  // Watch for changes
  watch(
    selectedLabelIds,
    () => {
      applyFilters()
    },
    { deep: true }
  )

  watch(filterOperator, () => {
    applyFilters()
  })

  // Watch for store changes
  watch(
    () => labelsStore.error,
    newError => {
      if (newError) {
        error.value = newError
      }
    }
  )

  watch(
    () => tasksStore.error,
    newError => {
      if (newError) {
        error.value = newError
      }
    }
  )

  return {
    // State
    selectedLabelIds,
    filterOperator,
    loading,
    error,

    // Computed
    selectedLabels,
    hasActiveFilters,
    filterCount,
    availableLabels,
    filteredTasks,

    // Methods
    loadLabels,
    addLabelFilter,
    removeLabelFilter,
    toggleLabelFilter,
    clearFilters,
    setFilterOperator,
    toggleFilterOperator,
    applyFilters,
    getLabelUsageCount,
    getTasksByLabel,
  }
}
