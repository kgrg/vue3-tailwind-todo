<template>
  <header class="bg-white border-b border-todo-border">
    <div class="flex items-center justify-between px-6 py-3">
      <div class="flex items-center flex-1">
        <div class="relative w-96">
          <input
            type="text"
            placeholder="Search"
            class="todo-input"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">
            <SearchIcon class="w-5 h-5" />
          </span>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <button class="p-2 hover:bg-todo-gray rounded-full">
          <SunIcon class="w-5 h-5 text-gray-600" />
        </button>
        <div class="flex items-center gap-2">
          <img
            :src="userAvatar"
            :alt="userName"
            class="w-8 h-8 rounded-full"
          />
          <span class="font-medium">{{ userName }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { SearchIcon, SunIcon } from '@/components/icons'

defineProps({
  userName: {
    type: String,
    required: true,
    default: 'User'
  },
  userAvatar: {
    type: String,
    required: true,
    default: 'https://ui-avatars.com/api/?name=User'
  }
})
</script> 