<template>
  <div
    class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
    :class="customClass"
  >
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <slot name="header-left"></slot>
      </div>
      <div class="flex items-center space-x-2">
        <slot name="header-right"></slot>
      </div>
    </div>

    <div class="mb-3">
      <slot name="content"></slot>
    </div>

    <div class="flex items-center justify-between text-sm text-gray-600">
      <slot name="footer-left"></slot>
      <slot name="footer-right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  customClass?: string
}>()
</script>
