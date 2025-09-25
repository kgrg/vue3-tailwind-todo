<template>
  <div
    class="group flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
    :class="customClass"
  >
    <div class="flex-shrink-0">
      <slot name="leading"></slot>
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <slot name="title"></slot>
      </div>

      <div class="mt-1 text-sm text-gray-500">
        <slot name="description"></slot>
      </div>
    </div>

    <div
      class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  customClass?: string
}>()
</script>
