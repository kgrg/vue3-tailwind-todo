<template>
  <div
    :data-testid="'label-chip'"
    :class="chipClasses"
    :style="chipStyles"
    :role="clickable ? 'button' : 'img'"
    :aria-label="`Label: ${label.name}`"
    :aria-pressed="selected ? 'true' : 'false'"
    :tabindex="clickable ? '0' : '-1'"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- Loading Spinner -->
    <div
      v-if="loading"
      data-testid="loading-spinner"
      class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
    />

    <!-- Prefix Slot -->
    <slot name="prefix">
      <span
        v-if="showColorDot"
        class="w-2 h-2 rounded-full mr-1"
        :style="{ backgroundColor: label.color }"
      />
    </slot>

    <!-- Default Slot Content -->
    <slot>
      <span class="truncate">{{ label.name }}</span>
    </slot>

    <!-- Suffix Slot -->
    <slot name="suffix">
      <button
        v-if="removable"
        data-testid="remove-button"
        class="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
        :aria-label="`Remove ${label.name} label`"
        @click.stop="handleRemove"
      >
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Label } from '@/types/label.types'
import { getBestTextColor } from '@/core/utils/color-contrast'

interface Props {
  label: Label
  size?: 'small' | 'medium' | 'large'
  removable?: boolean
  clickable?: boolean
  selected?: boolean
  disabled?: boolean
  loading?: boolean
  showColorDot?: boolean
}

interface Emits {
  (e: 'click', label: Label): void
  (e: 'remove', label: Label): void
  (e: 'keydown', event: KeyboardEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  removable: false,
  clickable: true,
  selected: false,
  disabled: false,
  loading: false,
  showColorDot: true,
})

const emit = defineEmits<Emits>()

// Color contrast calculation
const textColor = ref<'black' | 'white'>('white')
const contrast = ref(4.5)

onMounted(() => {
  const result = getBestTextColor(props.label.color)
  textColor.value = result.textColor
  contrast.value = result.contrast
})

const chipClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'px-2',
    'py-1',
    'rounded-full',
    'font-medium',
    'transition-all',
    'duration-200',
    'border',
    'border-transparent',
  ]

  // Size classes
  const sizeClasses = {
    small: ['text-xs', 'px-1.5', 'py-0.5'],
    medium: ['text-sm', 'px-2', 'py-1'],
    large: ['text-sm', 'px-3', 'py-1.5'],
  }

  // Interactive classes
  if (props.clickable && !props.disabled) {
    baseClasses.push(
      'cursor-pointer',
      'hover:opacity-80',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:outline-none'
    )
  }

  if (props.disabled) {
    baseClasses.push('opacity-50', 'cursor-not-allowed')
  }

  if (props.selected) {
    baseClasses.push('ring-2', 'ring-blue-500')
  }

  return [...baseClasses, ...sizeClasses[props.size]]
})

const chipStyles = computed(() => {
  return {
    backgroundColor: props.label.color,
    color: textColor.value,
  }
})

const handleClick = () => {
  if (props.disabled || props.loading || !props.clickable) {
    return
  }

  emit('click', props.label)
}

const handleRemove = () => {
  if (props.disabled || props.loading) {
    return
  }

  emit('remove', props.label)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled || props.loading || !props.clickable) {
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick()
  }

  emit('keydown', event)
}
</script>
