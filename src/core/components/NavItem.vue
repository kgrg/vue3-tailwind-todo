<template>
  <router-link
    :to="to"
    class="block"
  >
    <div 
      class="flex items-center px-3 py-1.5 rounded-lg transition-colors group"
      :class="[
        active 
          ? 'bg-gray-100' 
          : 'hover:bg-gray-50'
      ]"
    >
      <component 
        :is="icon" 
        class="w-4 h-4 mr-2"
        :class="[
          color ? `text-${color}-500` : 'text-gray-500',
          active ? 'text-gray-900' : ''
        ]"
      />
      <span 
        class="text-sm"
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

defineProps<Props>()</script> 