<template>
  <div class="max-w-6xl mx-auto px-6 py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Today Activities</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your habits, reminders, events, activities.</p>
      </div>
      <button class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        <PlusIcon class="w-5 h-5 mr-2" />
        New Activity
      </button>
    </div>

    <!-- Habits Section -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Your Habits</h2>
      <div class="grid grid-cols-5 gap-6">
        <HabitCard
          v-for="habit in sortedHabits"
          :key="habit.id"
          v-bind="habit"
        />
      </div>
    </section>

    <!-- Reminders Section -->
    <section>
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Reminders</h2>
      <div class="space-y-3">
        <div 
          v-for="reminder in reminders" 
          :key="reminder.id"
          class="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100"
        >
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <component :is="reminder.icon" class="w-5 h-5 text-gray-400" />
              <span class="text-sm font-medium">{{ reminder.category }}</span>
            </div>
            <h3 class="text-sm font-medium text-gray-900">{{ reminder.title }}</h3>
            <p class="text-sm text-gray-500">{{ reminder.description }}</p>
          </div>
          <div class="flex items-center">
            <component :is="reminder.locationIcon" class="w-5 h-5 text-gray-400 mr-2" />
            <span class="text-sm text-gray-600">{{ reminder.location }}</span>
            <span class="mx-4 text-gray-300">|</span>
            <span class="text-sm font-medium">{{ reminder.time }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, BriefcaseIcon, AcademicCapIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { useHabitStore } from '@/modules/habits/store/habits.store'
import HabitCard from '@/modules/habits/components/HabitCard.vue'

const habitStore = useHabitStore()
const { sortedHabits } = storeToRefs(habitStore)

const reminders = [
  {
    id: 1,
    category: 'Work',
    icon: BriefcaseIcon,
    title: 'Gym Session Week 3',
    description: 'Day for biceps, legs, and back.',
    location: 'Dona Gym',
    locationIcon: MapPinIcon,
    time: '15:00'
  },
  {
    id: 2,
    category: 'Learning',
    icon: AcademicCapIcon,
    title: 'Advanced Piano Class',
    description: 'Practicing melody with Mrs. Angeline.',
    location: 'Mrs. Angeline house',
    locationIcon: MapPinIcon,
    time: '19:00'
  }
]
</script> 