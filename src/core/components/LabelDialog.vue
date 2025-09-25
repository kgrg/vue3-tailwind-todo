<template>
  <Teleport to="body">
    <div
      v-if="open"
      data-testid="dialog-backdrop"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="handleBackdropClick"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

      <!-- Dialog -->
      <div
        data-testid="dialog"
        class="relative min-h-screen flex items-center justify-center p-4"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="titleId"
        @click.stop
      >
        <div
          data-testid="dialog-content"
          class="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <header class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2
              :id="titleId"
              data-testid="dialog-title"
              class="text-lg font-semibold text-gray-900"
            >
              <slot name="header">
                {{ isEditMode ? 'Edit Label' : 'Create Label' }}
              </slot>
            </h2>

            <button
              class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
              @click="handleClose"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </header>

          <!-- Body -->
          <div class="p-6">
            <form @submit.prevent="handleSubmit">
              <!-- Name Field -->
              <div class="mb-4">
                <label :for="nameInputId" class="block text-sm font-medium text-gray-700 mb-1">
                  Label Name
                </label>
                <input
                  :id="nameInputId"
                  ref="nameInput"
                  data-testid="name-input"
                  v-model="formData.name"
                  type="text"
                  placeholder="Enter label name"
                  :disabled="loading"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="{ 'border-red-500': nameError }"
                  @input="clearNameError"
                />
                <div v-if="nameError" class="mt-1 text-sm text-red-600" role="alert">
                  {{ nameError }}
                </div>
              </div>

              <!-- Color Field -->
              <div class="mb-4">
                <label :for="colorInputId" class="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>

                <!-- Color Preview -->
                <div class="flex items-center space-x-3">
                  <div
                    data-testid="color-preview"
                    class="w-8 h-8 rounded-full border-2 border-gray-300 flex-shrink-0"
                    :style="{ backgroundColor: formData.color }"
                  />

                  <input
                    :id="colorInputId"
                    ref="colorInput"
                    data-testid="color-input"
                    v-model="formData.color"
                    type="color"
                    :disabled="loading"
                    class="w-12 h-8 border border-gray-300 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />

                  <input
                    v-model="formData.color"
                    type="text"
                    placeholder="#000000"
                    :disabled="loading"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    :class="{ 'border-red-500': colorError }"
                    @input="handleColorInput"
                  />
                </div>

                <div v-if="colorError" class="mt-1 text-sm text-red-600" role="alert">
                  {{ colorError }}
                </div>
              </div>

              <!-- Predefined Colors -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Quick Colors</label>
                <div class="grid grid-cols-8 gap-2">
                  <button
                    v-for="color in predefinedColors"
                    :key="color"
                    data-testid="color-option"
                    type="button"
                    class="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                    :class="{ 'border-blue-500': formData.color === color }"
                    :style="{ backgroundColor: color }"
                    :aria-label="`Select ${color} color`"
                    @click="selectColor(color)"
                  />
                </div>
              </div>

              <!-- Validation Error -->
              <div
                v-if="validationError"
                data-testid="validation-error"
                class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
                role="alert"
              >
                <div class="flex">
                  <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <div class="ml-3">
                    <p class="text-sm text-red-800">{{ validationError }}</p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <footer
            class="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200"
          >
            <slot name="footer">
              <button
                data-testid="cancel-button"
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="loading"
                @click="handleClose"
              >
                Cancel
              </button>

              <button
                data-testid="save-button"
                type="button"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!isFormValid || loading"
                @click="handleSubmit"
              >
                <span v-if="loading" class="flex items-center">
                  <div
                    class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  {{ isEditMode ? 'Updating...' : 'Creating...' }}
                </span>
                <span v-else>
                  {{ isEditMode ? 'Update' : 'Create' }}
                </span>
              </button>
            </slot>
          </footer>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import type { Label, CreateLabelRequest, UpdateLabelRequest } from '@/types/label.types'
import { validateLabelCreate, validateLabelUpdate } from '@/core/validation/label.validation'

interface Props {
  open: boolean
  label?: Label
  title?: string
  loading?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'create', data: CreateLabelRequest): void
  (e: 'update', data: UpdateLabelRequest): void
  (e: 'focus-restore'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

// Generate unique IDs
const id = `label-dialog-${Math.random().toString(36).substr(2, 9)}`
const titleId = `${id}-title`
const nameInputId = `${id}-name`
const colorInputId = `${id}-color`

// Refs
const nameInput = ref<HTMLInputElement>()
const colorInput = ref<HTMLInputElement>()
const formData = ref({
  name: '',
  color: '#22c55e',
})
const nameError = ref('')
const colorError = ref('')
const validationError = ref('')

// Predefined colors
const predefinedColors = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
]

// Computed
const isEditMode = computed(() => !!props.label)

const isFormValid = computed(() => {
  return (
    formData.value.name.trim().length > 0 &&
    formData.value.name.trim().length <= 32 &&
    /^#[0-9A-Fa-f]{3,6}$/.test(formData.value.color)
  )
})

// Methods
const clearNameError = () => {
  nameError.value = ''
  validationError.value = ''
}

const clearColorError = () => {
  colorError.value = ''
  validationError.value = ''
}

const selectColor = (color: string) => {
  formData.value.color = color
  clearColorError()
}

const handleColorInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.trim()

  // Add # if missing
  if (value && !value.startsWith('#')) {
    value = '#' + value
  }

  formData.value.color = value
  clearColorError()
}

const handleSubmit = async () => {
  if (!isFormValid.value || props.loading) {
    return
  }

  // Validate form data
  const validation = isEditMode.value
    ? validateLabelUpdate(formData.value)
    : validateLabelCreate(formData.value)

  if (!validation.isValid) {
    validationError.value = validation.errors[0]?.message || 'Validation failed'
    return
  }

  // Emit appropriate event
  if (isEditMode.value) {
    emit('update', formData.value)
  } else {
    emit('create', formData.value)
  }
}

const handleClose = () => {
  emit('close')
  emit('focus-restore')
}

const handleBackdropClick = () => {
  handleClose()
}

const resetForm = () => {
  formData.value = {
    name: props.label?.name || '',
    color: props.label?.color || '#22c55e',
  }
  nameError.value = ''
  colorError.value = ''
  validationError.value = ''
}

// Watch for prop changes
watch(
  () => props.open,
  newValue => {
    if (newValue) {
      resetForm()
      nextTick(() => {
        nameInput.value?.focus()
      })
    }
  }
)

watch(
  () => props.label,
  () => {
    if (props.open) {
      resetForm()
    }
  }
)

// Keyboard handling
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
