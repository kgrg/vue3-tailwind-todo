/**
 * useLabelPicker Composable
 * Provides label picker functionality with search and selection
 */

import { ref, computed, watch } from 'vue'
import { useLabelsStore } from '@/stores/labels.store'
import type { Label } from '@/types/label.types'

export function useLabelPicker() {
  const labelsStore = useLabelsStore()

  // Local state
  const searchQuery = ref('')
  const selectedLabels = ref<Label[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const filteredLabels = computed(() => {
    if (!searchQuery.value.trim()) {
      return labelsStore.filteredLabels
    }

    const query = searchQuery.value.toLowerCase()
    return labelsStore.filteredLabels.filter(
      label => label.name.toLowerCase().includes(query) || label.color.toLowerCase().includes(query)
    )
  })

  const selectedLabelIds = computed(() => selectedLabels.value.map(label => label.id))

  const hasSelectedLabels = computed(() => selectedLabels.value.length > 0)

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

  const searchLabels = async (query: string) => {
    try {
      loading.value = true
      error.value = null
      await labelsStore.searchLabels(query)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search labels'
    } finally {
      loading.value = false
    }
  }

  const selectLabel = (label: Label) => {
    if (!selectedLabels.value.find(l => l.id === label.id)) {
      selectedLabels.value.push(label)
    }
  }

  const deselectLabel = (label: Label) => {
    selectedLabels.value = selectedLabels.value.filter(l => l.id !== label.id)
  }

  const toggleLabel = (label: Label) => {
    if (selectedLabels.value.find(l => l.id === label.id)) {
      deselectLabel(label)
    } else {
      selectLabel(label)
    }
  }

  const clearSelection = () => {
    selectedLabels.value = []
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setSelectedLabels = (labels: Label[]) => {
    selectedLabels.value = [...labels]
  }

  const setSelectedLabelIds = (labelIds: string[]) => {
    const labels = labelsStore.getLabelsByIds(labelIds)
    setSelectedLabels(labels)
  }

  // Watch for store changes
  watch(
    () => labelsStore.labels,
    newLabels => {
      // Update selected labels if they still exist
      selectedLabels.value = selectedLabels.value.filter(selectedLabel =>
        newLabels.some(label => label.id === selectedLabel.id)
      )
    }
  )

  watch(
    () => labelsStore.error,
    newError => {
      if (newError) {
        error.value = newError
      }
    }
  )

  watch(
    () => labelsStore.loading,
    newLoading => {
      loading.value = newLoading
    }
  )

  return {
    // State
    labels: computed(() => labelsStore.labels),
    selectedLabels,
    searchQuery,
    loading,
    error,

    // Computed
    filteredLabels,
    selectedLabelIds,
    hasSelectedLabels,

    // Methods
    loadLabels,
    searchLabels,
    selectLabel,
    deselectLabel,
    toggleLabel,
    clearSelection,
    setSearchQuery,
    setSelectedLabels,
    setSelectedLabelIds,
  }
}
