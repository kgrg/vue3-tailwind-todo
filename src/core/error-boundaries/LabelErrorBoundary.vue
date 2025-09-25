<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">
        <ExclamationTriangleIcon class="w-8 h-8 text-red-500" />
      </div>

      <div class="error-details">
        <h3 class="error-title">Something went wrong with labels</h3>
        <p class="error-message">
          We encountered an error while working with labels. This might be due to corrupted data or
          a temporary issue.
        </p>

        <div class="error-actions">
          <button @click="handleRetry" class="retry-button" :disabled="isRetrying">
            <span v-if="isRetrying">Retrying...</span>
            <span v-else>Try Again</span>
          </button>

          <button @click="handleReset" class="reset-button" :disabled="isResetting">
            <span v-if="isResetting">Resetting...</span>
            <span v-else>Reset Labels</span>
          </button>
        </div>

        <details class="error-details-collapsible" v-if="errorDetails">
          <summary class="error-details-summary">Technical Details</summary>
          <pre class="error-details-content">{{ errorDetails }}</pre>
        </details>
      </div>
    </div>
  </div>

  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, provide, inject } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useLabelsStore } from '@/stores/labels.store'
import { useTasksStore } from '@/stores/tasks.store'

// Props
interface Props {
  fallback?: boolean
  onError?: (error: Error, errorInfo: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  fallback: true,
  onError: undefined,
})

// State
const hasError = ref(false)
const errorDetails = ref<string | null>(null)
const isRetrying = ref(false)
const isResetting = ref(false)

// Stores
const labelsStore = useLabelsStore()
const tasksStore = useTasksStore()

// Error handling
onErrorCaptured((error: Error, instance, info) => {
  console.error('LabelErrorBoundary caught error:', error, info)

  hasError.value = true
  errorDetails.value = `${error.message}\n\nStack trace:\n${error.stack}\n\nComponent info:\n${info}`

  // Call custom error handler if provided
  if (props.onError) {
    props.onError(error, info)
  }

  // Prevent error from propagating
  return false
})

// Error recovery methods
const handleRetry = async () => {
  try {
    isRetrying.value = true

    // Clear error state
    hasError.value = false
    errorDetails.value = null

    // Attempt to reload labels data
    await labelsStore.loadLabels()
    await tasksStore.loadTasks()
  } catch (error) {
    console.error('Retry failed:', error)
    hasError.value = true
    errorDetails.value = `Retry failed: ${error.message}`
  } finally {
    isRetrying.value = false
  }
}

const handleReset = async () => {
  try {
    isResetting.value = true

    // Clear error state
    hasError.value = false
    errorDetails.value = null

    // Reset labels to default state
    await labelsStore.resetLabels()

    // Remove all label assignments from tasks
    await tasksStore.clearAllLabelAssignments()
  } catch (error) {
    console.error('Reset failed:', error)
    hasError.value = true
    errorDetails.value = `Reset failed: ${error.message}`
  } finally {
    isResetting.value = false
  }
}

// Provide error boundary context to child components
provide('labelErrorBoundary', {
  hasError: hasError.value,
  retry: handleRetry,
  reset: handleReset,
})
</script>

<style scoped>
.error-boundary {
  @apply p-6 bg-red-50 border border-red-200 rounded-lg;
}

.error-content {
  @apply flex items-start space-x-4;
}

.error-icon {
  @apply flex-shrink-0;
}

.error-details {
  @apply flex-1;
}

.error-title {
  @apply text-lg font-semibold text-red-800 mb-2;
}

.error-message {
  @apply text-sm text-red-700 mb-4;
}

.error-actions {
  @apply flex space-x-3 mb-4;
}

.retry-button {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.reset-button {
  @apply px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.error-details-collapsible {
  @apply mt-4;
}

.error-details-summary {
  @apply cursor-pointer text-sm font-medium text-red-800 hover:text-red-900;
}

.error-details-content {
  @apply mt-2 p-3 bg-red-100 border border-red-200 rounded text-xs text-red-800 overflow-auto max-h-32;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .error-boundary {
    @apply bg-red-900/20 border-red-800;
  }

  .error-title {
    @apply text-red-200;
  }

  .error-message {
    @apply text-red-300;
  }

  .error-details-summary {
    @apply text-red-200 hover:text-red-100;
  }

  .error-details-content {
    @apply bg-red-900/30 border-red-800 text-red-200;
  }
}

/* Responsive design */
@media (max-width: 640px) {
  .error-content {
    @apply flex-col space-x-0 space-y-3;
  }

  .error-actions {
    @apply flex-col space-x-0 space-y-2;
  }

  .retry-button,
  .reset-button {
    @apply w-full;
  }
}
</style>
