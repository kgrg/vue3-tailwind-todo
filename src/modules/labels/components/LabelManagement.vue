<template>
  <div data-testid="labels-page" class="max-w-4xl mx-auto p-6">
    <!-- Header -->
    <header class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Labels</h1>
          <p class="text-gray-600">Organize your tasks with custom labels</p>
        </div>

        <button
          data-testid="create-label-button"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          @click="openCreateDialog"
        >
          Create Label
        </button>
      </div>
    </header>

    <!-- Search and Filters -->
    <div class="mb-6 flex items-center space-x-4">
      <div class="flex-1">
        <input
          data-testid="search-input"
          v-model="searchQuery"
          type="text"
          placeholder="Search labels..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          @input="handleSearch"
        />
      </div>

      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500">
          {{ filteredLabels.length }} of {{ labels.length }} labels
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div
        class="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"
      />
      <span class="ml-2 text-gray-600">Loading labels...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 0114 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredLabels.length === 0 && !searchQuery" class="text-center py-12">
      <div data-testid="empty-state">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No labels</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first label.</p>
        <div class="mt-6">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            @click="openCreateDialog"
          >
            Create Label
          </button>
        </div>
      </div>
    </div>

    <!-- Labels Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="label in filteredLabels"
        :key="label.id"
        data-testid="label-item"
        :data-color="label.color"
        class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <!-- Color Dot -->
            <div
              class="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              :style="{ backgroundColor: label.color }"
            />

            <!-- Label Info -->
            <div>
              <h3 class="font-medium text-gray-900">{{ label.name }}</h3>
              <p class="text-sm text-gray-500">{{ label.color }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <button
              data-testid="edit-label-button"
              class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              @click="openEditDialog(label)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <button
              data-testid="delete-label-button"
              class="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              @click="openDeleteDialog(label)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Usage Stats -->
        <div class="mt-3 text-xs text-gray-500">
          Used in {{ getLabelUsageCount(label.id) }} tasks
        </div>
      </div>
    </div>

    <!-- Label Dialog -->
    <LabelDialog
      :open="dialogOpen"
      :label="editingLabel"
      :loading="dialogLoading"
      @close="closeDialog"
      @create="handleCreate"
      @update="handleUpdate"
    />

    <!-- Delete Confirmation Dialog -->
    <div
      v-if="deleteDialogOpen"
      data-testid="delete-confirmation"
      class="fixed inset-0 z-50 overflow-y-auto"
    >
      <div class="fixed inset-0 bg-black bg-opacity-50" />
      <div class="relative min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 class="ml-3 text-lg font-medium text-gray-900">Delete Label</h3>
          </div>

          <div class="mt-4">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete the label "{{ deletingLabel?.name }}"? This action
              cannot be undone and will remove the label from all tasks.
            </p>
          </div>

          <div class="mt-6 flex items-center justify-end space-x-3">
            <button
              data-testid="cancel-delete-button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              @click="closeDeleteDialog"
            >
              Cancel
            </button>

            <button
              data-testid="confirm-delete-button"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
              @click="handleDelete"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Label, CreateLabelRequest, UpdateLabelRequest } from '@/types/label.types'
import { useLabelsStore } from '@/stores/labels.store'
import { useTasksStore } from '@/stores/tasks.store'
import LabelDialog from '@/core/components/LabelDialog.vue'

// Stores
const labelsStore = useLabelsStore()
const tasksStore = useTasksStore()

// Local state
const searchQuery = ref('')
const dialogOpen = ref(false)
const editingLabel = ref<Label | undefined>()
const deleteDialogOpen = ref(false)
const deletingLabel = ref<Label | undefined>()
const dialogLoading = ref(false)

// Computed
const labels = computed(() => labelsStore.labels)
const loading = computed(() => labelsStore.loading)
const error = computed(() => labelsStore.error)

const filteredLabels = computed(() => {
  if (!searchQuery.value.trim()) {
    return labels.value
  }

  const query = searchQuery.value.toLowerCase()
  return labels.value.filter(
    label => label.name.toLowerCase().includes(query) || label.color.toLowerCase().includes(query)
  )
})

// Methods
const loadLabels = async () => {
  await labelsStore.loadLabels()
}

const handleSearch = () => {
  // Search is handled by computed property
}

const openCreateDialog = () => {
  editingLabel.value = undefined
  dialogOpen.value = true
}

const openEditDialog = (label: Label) => {
  editingLabel.value = label
  dialogOpen.value = true
}

const closeDialog = () => {
  dialogOpen.value = false
  editingLabel.value = undefined
}

const handleCreate = async (data: CreateLabelRequest) => {
  try {
    dialogLoading.value = true
    await labelsStore.createLabel(data)
    closeDialog()
  } catch (err) {
    console.error('Error creating label:', err)
  } finally {
    dialogLoading.value = false
  }
}

const handleUpdate = async (data: UpdateLabelRequest) => {
  if (!editingLabel.value) return

  try {
    dialogLoading.value = true
    await labelsStore.updateLabel(editingLabel.value.id, data)
    closeDialog()
  } catch (err) {
    console.error('Error updating label:', err)
  } finally {
    dialogLoading.value = false
  }
}

const openDeleteDialog = (label: Label) => {
  deletingLabel.value = label
  deleteDialogOpen.value = true
}

const closeDeleteDialog = () => {
  deleteDialogOpen.value = false
  deletingLabel.value = undefined
}

const handleDelete = async () => {
  if (!deletingLabel.value) return

  try {
    await labelsStore.deleteLabel(deletingLabel.value.id)
    closeDeleteDialog()
  } catch (err) {
    console.error('Error deleting label:', err)
  }
}

const getLabelUsageCount = (labelId: string) => {
  return tasksStore.getLabelUsageCount(labelId)
}

// Lifecycle
onMounted(() => {
  loadLabels()
})
</script>
