<template>
  <div class="max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-8">
    <div class="flex items-center justify-between mb-8 pt-12 lg:pt-0">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Today Activities</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your habits, reminders, events, activities.</p>
      </div>
      <button 
        @click="isNewActivityModalOpen = true"
        class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        <span class="hidden sm:inline">New Activity</span>
      </button>
    </div>

    <!-- Activities Section -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Today's Activities</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ActivityCard
          v-for="activity in activityStore.todayActivities"
          :key="activity.id"
          v-bind="activity"
        />
      </div>
    </section>

    <!-- Habits Section -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Your Habits</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
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
          class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-gray-100 gap-3 sm:gap-4"
        >
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <component :is="reminder.icon" class="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span class="text-sm font-medium">{{ reminder.category }}</span>
            </div>
            <h3 class="text-sm font-medium text-gray-900">{{ reminder.title }}</h3>
            <p class="text-sm text-gray-500 hidden sm:block">{{ reminder.description }}</p>
          </div>
          <div class="flex items-center justify-end sm:justify-start">
            <component :is="reminder.locationIcon" class="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
            <span class="text-sm text-gray-600">{{ reminder.location }}</span>
            <span class="mx-4 text-gray-300 hidden sm:inline">|</span>
            <span class="text-sm font-medium">{{ reminder.time }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- New Activity Modal -->
    <NewActivityModal
      :is-open="isNewActivityModalOpen"
      @close="isNewActivityModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon, BriefcaseIcon, AcademicCapIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { useHabitStore } from '@/modules/habits/store/habits.store'
import { useActivityStore } from '@/modules/activities/store/activities.store'
import HabitCard from '@/modules/habits/components/HabitCard.vue'
import ActivityCard from '@/modules/activities/components/ActivityCard.vue'
import NewActivityModal from '@/modules/activities/components/NewActivityModal.vue'

const habitStore = useHabitStore()
const activityStore = useActivityStore()
const { sortedHabits } = storeToRefs(habitStore)

const isNewActivityModalOpen = ref(false)

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