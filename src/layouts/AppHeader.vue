<template>
  <header class="bg-white border-b border-gray-200">
    <div class="flex items-center justify-between px-6 py-3">
      <div class="flex items-center flex-1">
        <div class="relative w-96">
          <input
            type="text"
            placeholder="Search"
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">
            <SearchIcon class="w-5 h-5" />
          </span>
        </div>
      </div>
      
      <div class="flex items-center space-x-4">
        <button class="p-2 hover:bg-gray-100 rounded-full">
          <SunIcon class="w-5 h-5 text-gray-600" />
        </button>
        <div class="flex items-center space-x-2">
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

<script setup>
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