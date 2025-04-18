<template>
  <div
    class="group flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
  >
    <button
      type="button"
      class="flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors duration-200"
      :class="[
        isCompleted
          ? 'bg-blue-500 border-blue-500'
          : 'border-gray-300 hover:border-blue-500'
      ]"
      @click="$emit('toggle-complete')"
    >
      <CheckIcon
        v-if="isCompleted"
        class="w-full h-full text-white p-0.5"
      />
    </button>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span
          class="text-sm font-medium"
          :class="{ 'line-through text-gray-400': isCompleted }"
        >
          {{ title }}
        </span>
        <span
          v-if="tag"
          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
          :class="`bg-${tag.color}-100 text-${tag.color}-800`"
        >
          {{ tag.label }}
        </span>
      </div>
      
      <div
        v-if="description || dueDate"
        class="mt-1 text-sm text-gray-500"
      >
        <p v-if="description" class="line-clamp-1">
          {{ description }}
        </p>
        <p v-if="dueDate" class="flex items-center gap-1 mt-0.5">
          <CalendarIcon class="w-4 h-4" />
          <span>{{ formatDate(dueDate) }}</span>
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        v-if="!isCompleted"
        type="button"
        class="p-1 text-gray-400 hover:text-yellow-500 rounded-full hover:bg-gray-100"
        @click="$emit('toggle-important')"
      >
        <StarIcon
          class="w-5 h-5"
          :class="{ 'fill-yellow-500 text-yellow-500': isImportant }"
        />
      </button>
      <button
        type="button"
        class="p-1 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
        @click="$emit('edit')"
      >
        <PencilIcon class="w-5 h-5" />
      </button>
      <button
        type="button"
        class="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
        @click="$emit('delete')"
      >
        <TrashIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  CheckIcon,
  StarIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon
} from '@/components/icons'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    default: null
  },
  tag: {
    type: Object,
    default: null
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

defineEmits(['toggle-complete', 'toggle-important', 'edit', 'delete'])
</script> 