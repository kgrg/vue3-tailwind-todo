<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto bg-white lg:h-screen">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
</script> 