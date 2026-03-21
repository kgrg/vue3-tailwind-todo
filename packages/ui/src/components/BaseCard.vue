<template>
  <div
    class="rounded-xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md"
    :class="customClass"
  >
    <div class="mb-3 flex items-center justify-between">
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