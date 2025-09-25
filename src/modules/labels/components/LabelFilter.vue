<template>
  <div data-testid="filter-container" class="space-y-4" role="group" aria-label="Label filters">
    <!-- Filter Toggle Button -->
    <div class="flex items-center justify-between">
      <button
        data-testid="label-filter-button"
        class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        :class="{ 'bg-blue-50 border-blue-300 text-blue-700': hasActiveFilters }"
        @click="toggleFilterDropdown"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filter by Labels
        <span
          v-if="filterCount > 0"
          data-testid="filter-count-badge"
          class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {{ filterCount }}
        </span>
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <!-- Clear All Button -->
      <button
        v-if="hasActiveFilters"
        data-testid="clear-filters-button"
        class="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        @click="clearFilters"
      >
        Clear all
      </button>
    </div>

    <!-- Filter Dropdown -->
    <div
      v-if="filterDropdownOpen"
      data-testid="label-dropdown"
      class="bg-white border border-gray-300 rounded-md shadow-lg p-4"
    >
      <!-- Search -->
      <div class="mb-4">
        <input
          data-testid="label-search-input"
          v-model="searchQuery"
          type="text"
          placeholder="Search labels..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          @input="handleSearch"
        />
      </div>

      <!-- Filter Operator Toggle -->
      <div class="mb-4">
        <div class="flex items-center space-x-4">
          <label class="text-sm font-medium text-gray-700">Filter Logic:</label>
          <div class="flex items-center space-x-2">
            <button
              data-testid="or-toggle"
              class="px-3 py-1 text-sm rounded-md"
              :class="
                filterOperator === 'OR'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              "
              @click="setFilterOperator('OR')"
            >
              OR
            </button>
            <button
              data-testid="and-toggle"
              class="px-3 py-1 text-sm rounded-md"
              :class="
                filterOperator === 'AND'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              "
              @click="setFilterOperator('AND')"
            >
              AND
            </button>
          </div>
        </div>
        <p class="mt-1 text-xs text-gray-500">
          {{
            filterOperator === 'OR'
              ? 'Show tasks with any of the selected labels'
              : 'Show tasks with all selected labels'
          }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-4">
        <div
          class="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"
        />
        <span class="ml-2 text-sm text-gray-500">Loading labels...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-sm text-red-600">
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="availableLabels.length === 0" class="text-sm text-gray-500">
        No labels available
      </div>

      <!-- Label Options -->
      <div v-else class="space-y-2 max-h-60 overflow-y-auto">
        <button
          v-for="label in availableLabels"
          :key="label.id"
          data-testid="label-option"
          :data-label-id="label.id"
          :data-label-name="label.name"
          class="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-md"
          :class="{ 'bg-blue-50 text-blue-700': selectedLabelIds.includes(label.id) }"
          @click="toggleLabelFilter(label.id)"
        >
          <!-- Color Dot -->
          <div
            class="w-3 h-3 rounded-full flex-shrink-0"
            :style="{ backgroundColor: label.color }"
          />

          <!-- Label Name -->
          <span class="flex-1 text-sm">{{ label.name }}</span>

          <!-- Usage Count -->
          <span class="text-xs text-gray-500">({{ getLabelUsageCount(label.id) }})</span>

          <!-- Selection Indicator -->
          <div v-if="selectedLabelIds.includes(label.id)" class="text-blue-600">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
      <div
        v-for="label in selectedLabels"
        :key="label.id"
        class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
      >
        <div class="w-2 h-2 rounded-full mr-2" :style="{ backgroundColor: label.color }" />
        {{ label.name }}
        <button
          class="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
          @click="removeLabelFilter(label.id)"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Filter Summary -->
    <div v-if="hasActiveFilters" class="text-sm text-gray-600">
      Showing tasks with {{ filterOperator === 'OR' ? 'any' : 'all' }} of the selected labels
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLabelFilter } from '@/core/composables/useLabelFilter'

// Composable
const {
  selectedLabelIds,
  filterOperator,
  loading,
  error,
  selectedLabels,
  hasActiveFilters,
  filterCount,
  availableLabels,
  loadLabels,
  addLabelFilter,
  removeLabelFilter,
  toggleLabelFilter,
  clearFilters,
  setFilterOperator,
  getLabelUsageCount,
} = useLabelFilter()

// Local state
const filterDropdownOpen = ref(false)
const searchQuery = ref('')

// Methods
const toggleFilterDropdown = () => {
  filterDropdownOpen.value = !filterDropdownOpen.value
}

const handleSearch = () => {
  // Search is handled by the composable
}

// Keyboard handling
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && filterDropdownOpen.value) {
    filterDropdownOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadLabels()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
