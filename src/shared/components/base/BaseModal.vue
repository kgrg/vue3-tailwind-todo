<template>
  <Teleport to="body">
    <Transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modalActive"
        class="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
        @keydown.esc="closeModal"
      >
        <div
          class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0"
        >
          <!-- Backdrop -->
          <div
            class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity dark:bg-opacity-80"
            aria-hidden="true"
            @click="handleBackdropClick"
          ></div>

          <!-- Modal panel -->
          <div
            class="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all dark:bg-gray-800 sm:p-5"
            @click.stop
          >
            <!-- Header -->
            <header
              class="mb-4 flex items-center justify-between rounded-t border-b pb-4 dark:border-gray-600 sm:mb-5"
            >
              <h2
                id="modal-title"
                class="text-lg font-semibold text-gray-900 dark:text-white"
              >
                <slot name="title">{{ title }}</slot>
              </h2>

              <button
                type="button"
                class="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-600 dark:hover:text-white"
                @click="closeModal"
                aria-label="Close modal"
              >
                <svg
                  aria-hidden="true"
                  class="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </header>

            <!-- Body -->
            <div class="modal-body">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, defineProps, defineEmits } from 'vue'
import { useFocusTrap } from '@/shared/composables/useFocusTrap'

interface ModalProps {
  modalActive: boolean
  title?: string
}

interface ModalEmits {
  'close-modal': () => void
  'update:modalActive': (value: boolean) => void
}

const props = withDefaults(defineProps<ModalProps>(), {
  title: 'Add Task'
})
const emit = defineEmits<ModalEmits>()

const { handleTabKey, initializeFocus, restoreFocus } = useFocusTrap(props.modalActive)

const closeModal = () => {
  emit('close-modal')
  emit('update:modalActive', false)
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

// Manage modal state
watch(() => props.modalActive, (newValue) => {
  if (newValue) {
    initializeFocus()
    document.body.style.overflow = 'hidden'
  } else {
    restoreFocus()
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleTabKey)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleTabKey)
})
</script>

<style scoped>
.modal-body {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
