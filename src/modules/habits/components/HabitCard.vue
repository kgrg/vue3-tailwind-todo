<template>
  <BaseCard customClass="group cursor-pointer">
    <template #content>
      <div class="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-2">
        <img 
          :src="`/images/${image}`" 
          :alt="title"
          class="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <h3 class="text-sm font-medium text-gray-900">{{ title }}</h3>
      <p class="text-xs text-gray-500">{{ formatTime(startTime) }} - {{ formatTime(endTime) }}</p>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Habit } from '../types'
import BaseCard from '@/core/components/BaseCard.vue'

const props = defineProps<{
  title: string
  image: string
  startTime: string
  endTime: string
}>()

const formatTime = (time: string): string => {
  return time.replace(':', '.')
}
</script> 