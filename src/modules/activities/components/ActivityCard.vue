<template>
  <BaseCard>
    <template #header-left>
      <span 
        class="w-2 h-2 rounded-full"
        :class="{
          'bg-blue-500': category === 'Work',
          'bg-green-500': category === 'Personal',
          'bg-purple-500': category === 'Learning',
          'bg-red-500': category === 'Health',
          'bg-gray-500': category === 'Other'
        }"
      ></span>
      <span class="text-sm font-medium text-gray-600">{{ category }}</span>
    </template>

    <template #header-right>
      <button 
        @click="toggleComplete"
        class="text-sm font-medium"
        :class="completed ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'"
      >
        {{ completed ? 'Completed' : 'Mark Complete' }}
      </button>
    </template>

    <template #content>
      <h3 class="text-base font-medium text-gray-900 mb-1">{{ title }}</h3>
      <p class="text-sm text-gray-500 mb-3">{{ description }}</p>
    </template>

    <template #footer-left>
      <div class="flex items-center space-x-2">
        <ClockIcon class="w-4 h-4" />
        <span>{{ time }}</span>
      </div>
    </template>

    <template #footer-right>
      <div v-if="location" class="flex items-center space-x-2">
        <MapPinIcon class="w-4 h-4" />
        <span>{{ location }}</span>
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { ClockIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import { useActivityStore } from '../store/activities.store'
import type { Activity } from '../types/activity.types'
import BaseCard from '@/core/components/BaseCard.vue'

const props = defineProps<{
  id: Activity['id']
  title: string
  description: string
  category: Activity['category']
  time: string
  location?: string
  completed: boolean
}>()

const activityStore = useActivityStore()

const toggleComplete = () => {
  activityStore.updateActivity(props.id, { completed: !props.completed })
}
</script> 