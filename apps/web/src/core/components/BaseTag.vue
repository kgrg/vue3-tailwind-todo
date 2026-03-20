<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
    :class="getTagClasses(color)"
  >
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { getTagClasses } from '@/core/utils/colorClasses'

defineProps<{
  color: string
}>()
</script> 