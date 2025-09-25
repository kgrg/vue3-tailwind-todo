<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <!-- Mobile Menu Button at the very top -->
    <button
      @click="isSidebarOpen = true"
      class="lg:hidden fixed top-0 left-0 w-full z-50 p-4 bg-white border-b border-gray-200 flex items-center"
      aria-label="Open menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
      <span class="ml-2 font-semibold text-gray-700">Menu</span>
    </button>
    <AppSidebar :is-open="isSidebarOpen" @close-sidebar="isSidebarOpen = false" />
    <main class="flex-1 overflow-y-auto bg-white lg:h-screen pt-16 lg:pt-0">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'

const isSidebarOpen = ref(false)
</script>
