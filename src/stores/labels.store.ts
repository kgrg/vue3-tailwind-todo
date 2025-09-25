/**
 * Labels Store
 * Pinia store for managing labels state and operations
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Label,
  CreateLabelRequest,
  UpdateLabelRequest,
  LabelSearchResult,
  LabelStats,
} from '@/types/label.types'
import { labelsRepository } from '@/core/repositories/labels.repository'
import { createErrorContext, LabelError } from '@/core/utils/error-handler'

export const useLabelsStore = defineStore('labels', () => {
  // State
  const labels = ref<Label[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const selectedLabels = ref<string[]>([])

  // Getters
  const filteredLabels = computed(() => {
    if (!searchQuery.value.trim()) {
      return labels.value
    }

    const query = searchQuery.value.toLowerCase()
    return labels.value.filter(
      label => label.name.toLowerCase().includes(query) || label.color.toLowerCase().includes(query)
    )
  })

  const labelMap = computed(() => {
    const map = new Map<string, Label>()
    labels.value.forEach(label => {
      map.set(label.id, label)
    })
    return map
  })

  const labelNameMap = computed(() => {
    const map = new Map<string, string>()
    labels.value.forEach(label => {
      map.set(label.name.toLowerCase(), label.id)
    })
    return map
  })

  const labelStats = computed((): LabelStats => {
    const total = labels.value.length
    // This would be calculated with task integration
    const used = 0
    const unused = total - used

    return { total, used, unused }
  })

  // Actions
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (value: string | null) => {
    error.value = value
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setSelectedLabels = (labelIds: string[]) => {
    selectedLabels.value = labelIds
  }

  const clearError = () => {
    error.value = null
  }

  const loadLabels = async () => {
    try {
      setLoading(true)
      clearError()

      const context = createErrorContext('load_labels')
      const loadedLabels = await labelsRepository.getAll()

      labels.value = loadedLabels
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load labels'
      setError(errorMessage)
      console.error('Error loading labels:', err)
    } finally {
      setLoading(false)
    }
  }

  const createLabel = async (labelData: CreateLabelRequest) => {
    try {
      setLoading(true)
      clearError()

      const context = createErrorContext('create_label')
      const newLabel = await labelsRepository.create(labelData)

      labels.value.push(newLabel)
      return newLabel
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create label'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateLabel = async (id: string, updates: UpdateLabelRequest) => {
    try {
      setLoading(true)
      clearError()

      const context = createErrorContext('update_label')
      const updatedLabel = await labelsRepository.update(id, updates)

      const index = labels.value.findIndex(label => label.id === id)
      if (index !== -1) {
        labels.value[index] = updatedLabel
      }

      return updatedLabel
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update label'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteLabel = async (id: string) => {
    try {
      setLoading(true)
      clearError()

      const context = createErrorContext('delete_label')
      await labelsRepository.delete(id)

      labels.value = labels.value.filter(label => label.id !== id)
      selectedLabels.value = selectedLabels.value.filter(labelId => labelId !== id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete label'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const searchLabels = async (query: string) => {
    try {
      setLoading(true)
      clearError()

      const context = createErrorContext('search_labels')
      const results: LabelSearchResult = await labelsRepository.search(query)

      searchQuery.value = query
      return results
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search labels'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getLabelById = (id: string): Label | undefined => {
    return labels.value.find(label => label.id === id)
  }

  const getLabelsByIds = (ids: string[]): Label[] => {
    return labels.value.filter(label => ids.includes(label.id))
  }

  const exists = async (name: string): Promise<boolean> => {
    try {
      const context = createErrorContext('check_label_exists')
      return await labelsRepository.exists(name)
    } catch (err) {
      console.error('Error checking label existence:', err)
      return false
    }
  }

  const clearLabels = () => {
    labels.value = []
    selectedLabels.value = []
    searchQuery.value = ''
    error.value = null
  }

  const selectLabel = (id: string) => {
    if (!selectedLabels.value.includes(id)) {
      selectedLabels.value.push(id)
    }
  }

  const deselectLabel = (id: string) => {
    selectedLabels.value = selectedLabels.value.filter(labelId => labelId !== id)
  }

  const toggleLabel = (id: string) => {
    if (selectedLabels.value.includes(id)) {
      deselectLabel(id)
    } else {
      selectLabel(id)
    }
  }

  const clearSelection = () => {
    selectedLabels.value = []
  }

  const getSelectedLabels = (): Label[] => {
    return getLabelsByIds(selectedLabels.value)
  }

  const hasSelectedLabels = computed(() => selectedLabels.value.length > 0)

  const selectedLabelsCount = computed(() => selectedLabels.value.length)

  return {
    // State
    labels,
    loading,
    error,
    searchQuery,
    selectedLabels,

    // Getters
    filteredLabels,
    labelMap,
    labelNameMap,
    labelStats,
    hasSelectedLabels,
    selectedLabelsCount,

    // Actions
    setLoading,
    setError,
    setSearchQuery,
    setSelectedLabels,
    clearError,
    loadLabels,
    createLabel,
    updateLabel,
    deleteLabel,
    searchLabels,
    getLabelById,
    getLabelsByIds,
    exists,
    clearLabels,
    selectLabel,
    deselectLabel,
    toggleLabel,
    clearSelection,
    getSelectedLabels,
  }
})
