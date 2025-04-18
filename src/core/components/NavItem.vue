<template>
  <router-link
    :to="to"
    class="block"
    @click="$emit('click')"
  >
    <div 
      class="flex items-center px-3 py-2 sm:py-1.5 rounded-lg transition-colors group"
      :class="[
        active 
          ? 'bg-gray-100' 
          : 'hover:bg-gray-50'
      ]"
    >
      <component 
        :is="icon" 
        class="w-5 h-5 sm:w-4 sm:h-4 mr-3 sm:mr-2 flex-shrink-0"
        :class="[
          color ? `text-${color}-500` : 'text-gray-500',
          active ? 'text-gray-900' : ''
        ]"
      />
      <span 
        class="text-base sm:text-sm truncate"
        :class="[
          active ? 'font-medium text-gray-900' : 'text-gray-600',
          color ? `group-hover:text-${color}-600` : 'group-hover:text-gray-900'
        ]"
      >
        {{ label }}
      </span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
interface Props {
  to: string
  icon: object
  label: string
  active?: boolean
  color?: string
}

defineProps<Props>()
defineEmits<{
  (e: 'click'): void
}>()
</script> 