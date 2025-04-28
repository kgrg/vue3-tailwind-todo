<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
    :class="`bg-${color}-100 text-${color}-800`"
  >
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  color: string
}>()
</script> 