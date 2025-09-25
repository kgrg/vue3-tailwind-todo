<template>
  <div class="label-skeleton" :class="skeletonClass">
    <!-- Label chip skeleton -->
    <div v-if="type === 'chip'" class="skeleton-chip">
      <div class="skeleton-chip-color"></div>
      <div class="skeleton-chip-text"></div>
    </div>

    <!-- Label list skeleton -->
    <div v-else-if="type === 'list'" class="skeleton-list">
      <div v-for="n in count" :key="n" class="skeleton-list-item">
        <div class="skeleton-list-color"></div>
        <div class="skeleton-list-text"></div>
        <div class="skeleton-list-actions"></div>
      </div>
    </div>

    <!-- Label picker skeleton -->
    <div v-else-if="type === 'picker'" class="skeleton-picker">
      <div class="skeleton-picker-input"></div>
      <div class="skeleton-picker-options">
        <div v-for="n in Math.min(count, 3)" :key="n" class="skeleton-picker-option">
          <div class="skeleton-picker-option-color"></div>
          <div class="skeleton-picker-option-text"></div>
        </div>
      </div>
    </div>

    <!-- Label dialog skeleton -->
    <div v-else-if="type === 'dialog'" class="skeleton-dialog">
      <div class="skeleton-dialog-header">
        <div class="skeleton-dialog-title"></div>
        <div class="skeleton-dialog-close"></div>
      </div>
      <div class="skeleton-dialog-content">
        <div class="skeleton-dialog-field">
          <div class="skeleton-dialog-label"></div>
          <div class="skeleton-dialog-input"></div>
        </div>
        <div class="skeleton-dialog-field">
          <div class="skeleton-dialog-label"></div>
          <div class="skeleton-dialog-color-picker"></div>
        </div>
      </div>
      <div class="skeleton-dialog-footer">
        <div class="skeleton-dialog-button"></div>
        <div class="skeleton-dialog-button"></div>
      </div>
    </div>

    <!-- Filter skeleton -->
    <div v-else-if="type === 'filter'" class="skeleton-filter">
      <div class="skeleton-filter-input"></div>
      <div class="skeleton-filter-chips">
        <div v-for="n in Math.min(count, 2)" :key="n" class="skeleton-filter-chip">
          <div class="skeleton-filter-chip-color"></div>
          <div class="skeleton-filter-chip-text"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  type?: 'chip' | 'list' | 'picker' | 'dialog' | 'filter'
  count?: number
  animated?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'chip',
  count: 3,
  animated: true,
  size: 'md',
})

// Computed
const skeletonClass = computed(() => ({
  'skeleton-animated': props.animated,
  [`skeleton-${props.size}`]: true,
}))
</script>

<style scoped>
.label-skeleton {
  @apply w-full;
}

/* Skeleton chip */
.skeleton-chip {
  @apply flex items-center space-x-2 p-2 bg-gray-100 rounded-lg;
}

.skeleton-chip-color {
  @apply w-4 h-4 rounded-full bg-gray-300;
}

.skeleton-chip-text {
  @apply h-4 bg-gray-300 rounded w-16;
}

/* Skeleton list */
.skeleton-list {
  @apply space-y-3;
}

.skeleton-list-item {
  @apply flex items-center justify-between p-3 bg-gray-100 rounded-lg;
}

.skeleton-list-color {
  @apply w-6 h-6 rounded-full bg-gray-300;
}

.skeleton-list-text {
  @apply h-4 bg-gray-300 rounded w-24;
}

.skeleton-list-actions {
  @apply flex space-x-2;
}

.skeleton-list-actions::before {
  content: '';
  @apply w-6 h-6 bg-gray-300 rounded;
}

.skeleton-list-actions::after {
  content: '';
  @apply w-6 h-6 bg-gray-300 rounded;
}

/* Skeleton picker */
.skeleton-picker {
  @apply space-y-3;
}

.skeleton-picker-input {
  @apply h-10 bg-gray-300 rounded-md;
}

.skeleton-picker-options {
  @apply space-y-2;
}

.skeleton-picker-option {
  @apply flex items-center space-x-3 p-2 bg-gray-100 rounded-md;
}

.skeleton-picker-option-color {
  @apply w-4 h-4 rounded-full bg-gray-300;
}

.skeleton-picker-option-text {
  @apply h-4 bg-gray-300 rounded w-20;
}

/* Skeleton dialog */
.skeleton-dialog {
  @apply bg-white rounded-lg shadow-lg p-6 space-y-4;
}

.skeleton-dialog-header {
  @apply flex items-center justify-between;
}

.skeleton-dialog-title {
  @apply h-6 bg-gray-300 rounded w-32;
}

.skeleton-dialog-close {
  @apply w-6 h-6 bg-gray-300 rounded;
}

.skeleton-dialog-content {
  @apply space-y-4;
}

.skeleton-dialog-field {
  @apply space-y-2;
}

.skeleton-dialog-label {
  @apply h-4 bg-gray-300 rounded w-16;
}

.skeleton-dialog-input {
  @apply h-10 bg-gray-300 rounded-md;
}

.skeleton-dialog-color-picker {
  @apply h-10 bg-gray-300 rounded-md w-32;
}

.skeleton-dialog-footer {
  @apply flex justify-end space-x-3;
}

.skeleton-dialog-button {
  @apply h-10 bg-gray-300 rounded-md w-20;
}

/* Skeleton filter */
.skeleton-filter {
  @apply space-y-3;
}

.skeleton-filter-input {
  @apply h-10 bg-gray-300 rounded-md;
}

.skeleton-filter-chips {
  @apply flex flex-wrap gap-2;
}

.skeleton-filter-chip {
  @apply flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full;
}

.skeleton-filter-chip-color {
  @apply w-3 h-3 rounded-full bg-gray-300;
}

.skeleton-filter-chip-text {
  @apply h-3 bg-gray-300 rounded w-12;
}

/* Animation */
.skeleton-animated .skeleton-chip-color,
.skeleton-animated .skeleton-chip-text,
.skeleton-animated .skeleton-list-color,
.skeleton-animated .skeleton-list-text,
.skeleton-animated .skeleton-list-actions::before,
.skeleton-animated .skeleton-list-actions::after,
.skeleton-animated .skeleton-picker-input,
.skeleton-animated .skeleton-picker-option-color,
.skeleton-animated .skeleton-picker-option-text,
.skeleton-animated .skeleton-dialog-title,
.skeleton-animated .skeleton-dialog-close,
.skeleton-animated .skeleton-dialog-label,
.skeleton-animated .skeleton-dialog-input,
.skeleton-animated .skeleton-dialog-color-picker,
.skeleton-animated .skeleton-dialog-button,
.skeleton-animated .skeleton-filter-input,
.skeleton-animated .skeleton-filter-chip-color,
.skeleton-animated .skeleton-filter-chip-text {
  @apply animate-pulse;
}

/* Size variants */
.skeleton-sm .skeleton-chip {
  @apply p-1;
}

.skeleton-sm .skeleton-chip-color {
  @apply w-3 h-3;
}

.skeleton-sm .skeleton-chip-text {
  @apply h-3 w-12;
}

.skeleton-lg .skeleton-chip {
  @apply p-4;
}

.skeleton-lg .skeleton-chip-color {
  @apply w-6 h-6;
}

.skeleton-lg .skeleton-chip-text {
  @apply h-6 w-24;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .skeleton-chip,
  .skeleton-list-item,
  .skeleton-picker-option,
  .skeleton-filter-chip {
    @apply bg-gray-800;
  }

  .skeleton-chip-color,
  .skeleton-chip-text,
  .skeleton-list-color,
  .skeleton-list-text,
  .skeleton-list-actions::before,
  .skeleton-list-actions::after,
  .skeleton-picker-input,
  .skeleton-picker-option-color,
  .skeleton-picker-option-text,
  .skeleton-dialog-title,
  .skeleton-dialog-close,
  .skeleton-dialog-label,
  .skeleton-dialog-input,
  .skeleton-dialog-color-picker,
  .skeleton-dialog-button,
  .skeleton-filter-input,
  .skeleton-filter-chip-color,
  .skeleton-filter-chip-text {
    @apply bg-gray-700;
  }
}

/* Responsive design */
@media (max-width: 640px) {
  .skeleton-dialog {
    @apply p-4;
  }

  .skeleton-dialog-footer {
    @apply flex-col space-x-0 space-y-2;
  }

  .skeleton-dialog-button {
    @apply w-full;
  }

  .skeleton-filter-chips {
    @apply flex-col;
  }

  .skeleton-filter-chip {
    @apply w-full;
  }
}
</style>
