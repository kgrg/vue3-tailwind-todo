<template>
  <div
    data-testid="label-picker"
    class="relative"
    role="combobox"
    :aria-expanded="isOpen"
    aria-haspopup="listbox"
    :aria-labelledby="labelId"
  >
    <!-- Label -->
    <label v-if="label" :id="labelId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>

    <!-- Search Input -->
    <div class="relative">
      <input
        ref="searchInput"
        data-testid="search-input"
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        :aria-label="label || 'Select labels'"
        :aria-describedby="error ? `${id}-error` : undefined"
        @input="handleSearch"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <!-- Search Icon -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      :id="`${id}-error`"
      data-testid="error-message"
      class="mt-1 text-sm text-red-600"
      role="alert"
    >
      {{ error }}
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      data-testid="label-dropdown"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
      role="listbox"
      :aria-multiselectable="multiple"
    >
      <!-- Loading State -->
      <div
        v-if="loading"
        data-testid="loading-spinner"
        class="flex items-center justify-center py-4"
      >
        <div
          class="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"
        />
        <span class="ml-2 text-sm text-gray-500">Loading labels...</span>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredLabels.length === 0"
        data-testid="empty-state"
        class="px-3 py-2 text-sm text-gray-500"
      >
        <slot name="empty">No labels found</slot>
      </div>

      <!-- Label Options -->
      <div v-else>
        <button
          v-for="label in filteredLabels"
          :key="label.id"
          :data-testid="'label-option'"
          :data-label-id="label.id"
          :data-label-name="label.name"
          class="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{
            'bg-blue-50 text-blue-700': isSelected(label.id),
            disabled: isMaxLabelsReached && !isSelected(label.id),
          }"
          :disabled="isMaxLabelsReached && !isSelected(label.id)"
          :aria-selected="isSelected(label.id)"
          @click="handleLabelClick(label)"
        >
          <div class="flex items-center">
            <!-- Color Dot -->
            <div
              class="w-3 h-3 rounded-full mr-2 flex-shrink-0"
              :style="{ backgroundColor: label.color }"
            />

            <!-- Label Name -->
            <span class="truncate">{{ label.name }}</span>

            <!-- Selection Indicator -->
            <div v-if="isSelected(label.id)" class="ml-auto">
              <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Selected Labels -->
    <div v-if="selectedLabels.length > 0" class="mt-2 flex flex-wrap gap-1">
      <BaseLabelChip
        v-for="label in selectedLabels"
        :key="label.id"
        :label="label"
        size="small"
        removable
        @remove="handleRemoveLabel"
      />

      <!-- Clear All Button -->
      <button
        v-if="selectedLabels.length > 1"
        data-testid="clear-all-button"
        class="inline-flex items-center px-2 py-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        @click="handleClearAll"
      >
        Clear all
      </button>
    </div>

    <!-- Validation Error -->
    <div
      v-if="validationError"
      data-testid="validation-error"
      class="mt-1 text-sm text-red-600"
      role="alert"
    >
      {{ validationError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { Label } from '@/types/label.types'
import BaseLabelChip from './BaseLabelChip.vue'
import { useLabelPicker } from '@/core/composables/useLabelPicker'

interface Props {
  modelValue: string[]
  label?: string
  placeholder?: string
  multiple?: boolean
  maxLabels?: number
  disabled?: boolean
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
  (e: 'search', query: string): void
  (e: 'select', label: Label): void
  (e: 'deselect', label: Label): void
  (e: 'clear-all'): void
  (e: 'keyboard-navigate', direction: 'up' | 'down'): void
  (e: 'select-focused'): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  multiple: true,
  maxLabels: 12,
  disabled: false,
  placeholder: 'Search labels...',
})

const emit = defineEmits<Emits>()

// Generate unique IDs
const id = `label-picker-${Math.random().toString(36).substr(2, 9)}`
const labelId = `${id}-label`

// Refs
const searchInput = ref<HTMLInputElement>()
const isOpen = ref(false)
const searchQuery = ref('')
const focusedIndex = ref(-1)

// Use composable
const {
  labels,
  selectedLabels,
  loading,
  error,
  filteredLabels,
  selectLabel,
  deselectLabel,
  toggleLabel,
  clearSelection,
  setSearchQuery,
  loadLabels,
} = useLabelPicker()

// Computed
const isMaxLabelsReached = computed(() => {
  return props.maxLabels && selectedLabels.value.length >= props.maxLabels
})

const validationError = computed(() => {
  if (isMaxLabelsReached.value) {
    return `Maximum ${props.maxLabels} labels allowed`
  }
  return null
})

// Methods
const isSelected = (labelId: string): boolean => {
  return props.modelValue.includes(labelId)
}

const handleSearch = () => {
  setSearchQuery(searchQuery.value)
  emit('search', searchQuery.value)
}

const handleLabelClick = (label: Label) => {
  if (isSelected(label.id)) {
    handleRemoveLabel(label)
  } else {
    handleSelectLabel(label)
  }
}

const handleSelectLabel = (label: Label) => {
  if (isMaxLabelsReached.value && !isSelected(label.id)) {
    return
  }

  if (props.multiple) {
    const newValue = [...props.modelValue, label.id]
    emit('update:modelValue', newValue)
  } else {
    emit('update:modelValue', [label.id])
    isOpen.value = false
  }

  emit('select', label)
}

const handleRemoveLabel = (label: Label) => {
  const newValue = props.modelValue.filter(id => id !== label.id)
  emit('update:modelValue', newValue)
  emit('deselect', label)
}

const handleClearAll = () => {
  emit('update:modelValue', [])
  emit('clear-all')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      isOpen.value = true
      focusedIndex.value = Math.min(focusedIndex.value + 1, filteredLabels.value.length - 1)
      emit('keyboard-navigate', 'down')
      break
    case 'ArrowUp':
      event.preventDefault()
      focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
      emit('keyboard-navigate', 'up')
      break
    case 'Enter':
      event.preventDefault()
      if (focusedIndex.value >= 0 && focusedIndex.value < filteredLabels.value.length) {
        const label = filteredLabels.value[focusedIndex.value]
        handleLabelClick(label)
      }
      emit('select-focused')
      break
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      emit('close')
      break
  }
}

const handleFocus = () => {
  if (!props.disabled) {
    isOpen.value = true
  }
}

const handleBlur = () => {
  // Delay closing to allow for clicks on options
  setTimeout(() => {
    isOpen.value = false
  }, 150)
}

// Watch for external changes
watch(
  () => props.modelValue,
  newValue => {
    // Update selected labels when modelValue changes externally
    // This would typically sync with the store
  },
  { deep: true }
)

// Lifecycle
onMounted(() => {
  loadLabels()
})

onUnmounted(() => {
  // Cleanup if needed
})
</script>
