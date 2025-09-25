<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isVisible"
      class="toast-container"
      :class="toastClass"
      role="alert"
      :aria-live="type === 'error' ? 'assertive' : 'polite'"
    >
      <div class="toast-content">
        <div class="toast-icon">
          <CheckCircleIcon v-if="type === 'success'" class="w-5 h-5" />
          <ExclamationTriangleIcon v-else-if="type === 'warning'" class="w-5 h-5" />
          <XCircleIcon v-else-if="type === 'error'" class="w-5 h-5" />
          <InformationCircleIcon v-else class="w-5 h-5" />
        </div>

        <div class="toast-body">
          <h4 v-if="title" class="toast-title">{{ title }}</h4>
          <p class="toast-message">{{ message }}</p>
        </div>

        <div class="toast-actions">
          <button
            v-if="actionText && actionHandler"
            @click="handleAction"
            class="toast-action-button"
            :disabled="isActionLoading"
          >
            <span v-if="isActionLoading">Loading...</span>
            <span v-else>{{ actionText }}</span>
          </button>

          <button @click="handleClose" class="toast-close-button" :aria-label="closeAriaLabel">
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Progress bar for auto-dismiss -->
      <div
        v-if="autoDismiss && progress > 0"
        class="toast-progress"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

// Props
interface Props {
  type?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  message: string
  actionText?: string
  actionHandler?: () => void | Promise<void>
  autoDismiss?: boolean
  duration?: number
  closeAriaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  title: undefined,
  message: '',
  actionText: undefined,
  actionHandler: undefined,
  autoDismiss: true,
  duration: 5000,
  closeAriaLabel: 'Close notification',
})

// Emits
const emit = defineEmits<{
  close: []
  action: []
}>()

// State
const isVisible = ref(false)
const isActionLoading = ref(false)
const progress = ref(100)
const progressInterval = ref<number | null>(null)

// Computed
const toastClass = computed(() => ({
  'toast-success': props.type === 'success',
  'toast-warning': props.type === 'warning',
  'toast-error': props.type === 'error',
  'toast-info': props.type === 'info',
}))

// Methods
const handleAction = async () => {
  if (!props.actionHandler) return

  try {
    isActionLoading.value = true
    await props.actionHandler()
    emit('action')
  } catch (error) {
    console.error('Toast action failed:', error)
  } finally {
    isActionLoading.value = false
  }
}

const handleClose = () => {
  isVisible.value = false
  emit('close')
}

const startProgress = () => {
  if (!props.autoDismiss) return

  const startTime = Date.now()
  const updateProgress = () => {
    const elapsed = Date.now() - startTime
    const remaining = Math.max(0, props.duration - elapsed)
    progress.value = (remaining / props.duration) * 100

    if (remaining <= 0) {
      handleClose()
    } else {
      progressInterval.value = requestAnimationFrame(updateProgress)
    }
  }

  progressInterval.value = requestAnimationFrame(updateProgress)
}

const stopProgress = () => {
  if (progressInterval.value) {
    cancelAnimationFrame(progressInterval.value)
    progressInterval.value = null
  }
}

// Lifecycle
onMounted(() => {
  isVisible.value = true
  startProgress()
})

onUnmounted(() => {
  stopProgress()
})

// Watch for visibility changes
watch(isVisible, visible => {
  if (visible) {
    startProgress()
  } else {
    stopProgress()
  }
})
</script>

<style scoped>
.toast-container {
  @apply max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden;
}

.toast-content {
  @apply p-4 flex items-start;
}

.toast-icon {
  @apply flex-shrink-0;
}

.toast-body {
  @apply ml-3 w-0 flex-1;
}

.toast-title {
  @apply text-sm font-medium text-gray-900;
}

.toast-message {
  @apply mt-1 text-sm text-gray-500;
}

.toast-actions {
  @apply ml-4 flex-shrink-0 flex space-x-2;
}

.toast-action-button {
  @apply bg-white rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.toast-close-button {
  @apply bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}

.toast-progress {
  @apply h-1 bg-current opacity-30;
}

/* Type-specific styles */
.toast-success {
  @apply ring-green-500;
}

.toast-success .toast-icon {
  @apply text-green-400;
}

.toast-success .toast-title {
  @apply text-green-800;
}

.toast-success .toast-message {
  @apply text-green-700;
}

.toast-success .toast-progress {
  @apply bg-green-500;
}

.toast-warning {
  @apply ring-yellow-500;
}

.toast-warning .toast-icon {
  @apply text-yellow-400;
}

.toast-warning .toast-title {
  @apply text-yellow-800;
}

.toast-warning .toast-message {
  @apply text-yellow-700;
}

.toast-warning .toast-progress {
  @apply bg-yellow-500;
}

.toast-error {
  @apply ring-red-500;
}

.toast-error .toast-icon {
  @apply text-red-400;
}

.toast-error .toast-title {
  @apply text-red-800;
}

.toast-error .toast-message {
  @apply text-red-700;
}

.toast-error .toast-progress {
  @apply bg-red-500;
}

.toast-info {
  @apply ring-blue-500;
}

.toast-info .toast-icon {
  @apply text-blue-400;
}

.toast-info .toast-title {
  @apply text-blue-800;
}

.toast-info .toast-message {
  @apply text-blue-700;
}

.toast-info .toast-progress {
  @apply bg-blue-500;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .toast-container {
    @apply bg-gray-800 ring-gray-600;
  }

  .toast-title {
    @apply text-gray-100;
  }

  .toast-message {
    @apply text-gray-300;
  }

  .toast-action-button {
    @apply text-indigo-400 hover:text-indigo-300;
  }

  .toast-close-button {
    @apply text-gray-500 hover:text-gray-400;
  }

  .toast-success .toast-title {
    @apply text-green-200;
  }

  .toast-success .toast-message {
    @apply text-green-300;
  }

  .toast-warning .toast-title {
    @apply text-yellow-200;
  }

  .toast-warning .toast-message {
    @apply text-yellow-300;
  }

  .toast-error .toast-title {
    @apply text-red-200;
  }

  .toast-error .toast-message {
    @apply text-red-300;
  }

  .toast-info .toast-title {
    @apply text-blue-200;
  }

  .toast-info .toast-message {
    @apply text-blue-300;
  }
}

/* Responsive design */
@media (max-width: 640px) {
  .toast-container {
    @apply max-w-xs;
  }

  .toast-content {
    @apply p-3;
  }

  .toast-actions {
    @apply flex-col space-x-0 space-y-1;
  }

  .toast-action-button {
    @apply w-full text-center;
  }
}
</style>
