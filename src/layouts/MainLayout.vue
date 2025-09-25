<template>
  <div class="flex min-h-screen bg-gray-50">
    <AppSidebar />
    <main class="flex-1 overflow-auto">
      <AppHeader />
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '@/layouts/AppSidebar.vue'
import AppHeader from '@/layouts/AppHeader.vue'
</script>
