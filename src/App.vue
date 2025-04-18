<script setup>
import AppSidebar from '@/layouts/AppSidebar.vue'
</script>

<template>
  <div class="h-screen flex">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto bg-white">
      <router-view></router-view>
    </main>
  </div>
</template>
