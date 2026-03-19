<template>
  <BaseListItem>
    <template #leading>
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
    </template>

    <template #title>
      <span
        class="text-sm font-medium"
        :class="{ 'line-through text-gray-400': isCompleted }"
      >
        {{ title }}
      </span>
      <BaseTag v-if="tag" :color="tag.color">
        {{ tag.label }}
      </BaseTag>
    </template>

    <template #description>
      <p v-if="description" class="line-clamp-1">
        {{ description }}
      </p>
      <p v-if="dueDate" class="flex items-center gap-1 mt-0.5">
        <CalendarIcon class="w-4 h-4" />
        <span>{{ formatDate(dueDate) }}</span>
      </p>
    </template>

    <template #actions>
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
    </template>
  </BaseListItem>
</template>

<script setup>
import {
  CheckIcon,
  StarIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon
} from '@/components/icons'
import BaseListItem from '@/core/components/BaseListItem.vue'
import BaseTag from '@/core/components/BaseTag.vue'

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