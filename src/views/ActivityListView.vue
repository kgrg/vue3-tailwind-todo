<template>
  <div class="max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">All Activities</h1>
        <p class="mt-1 text-sm text-gray-500">View and manage all your activities</p>
      </div>
      <button 
        @click="isNewActivityModalOpen = true"
        class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        <span class="hidden sm:inline">New Activity</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            v-model="filters.category"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Learning">Learning</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="filters.status"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            v-model="sortBy"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="date">Date</option>
            <option value="category">Category</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Activities List -->
    <div class="space-y-4">
      <div v-if="filteredActivities.length === 0" class="text-center py-12">
        <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No activities</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new activity.</p>
        <div class="mt-6">
          <button
            @click="isNewActivityModalOpen = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            New Activity
          </button>
        </div>
      </div>

      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4">
              <div 
                class="w-3 h-3 mt-1.5 rounded-full flex-shrink-0"
                :class="{
                  'bg-blue-500': activity.category === 'Work',
                  'bg-green-500': activity.category === 'Personal',
                  'bg-purple-500': activity.category === 'Learning',
                  'bg-red-500': activity.category === 'Health',
                  'bg-gray-500': activity.category === 'Other'
                }"
              ></div>
              <div>
                <h3 class="text-base font-medium text-gray-900">{{ activity.title }}</h3>
                <p class="mt-1 text-sm text-gray-500">{{ activity.description }}</p>
                <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <div class="flex items-center">
                    <CalendarIcon class="w-4 h-4 mr-1" />
                    {{ formatDate(activity.date) }}
                  </div>
                  <div class="flex items-center">
                    <ClockIcon class="w-4 h-4 mr-1" />
                    {{ activity.time }}
                  </div>
                  <div v-if="activity.location" class="flex items-center">
                    <MapPinIcon class="w-4 h-4 mr-1" />
                    {{ activity.location }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="toggleComplete(activity)"
                class="inline-flex items-center px-2.5 py-1.5 text-sm font-medium rounded-md"
                :class="activity.completed ? 'text-green-700 bg-green-50 hover:bg-green-100' : 'text-gray-700 bg-gray-50 hover:bg-gray-100'"
              >
                <CheckIcon v-if="activity.completed" class="w-4 h-4 mr-1" />
                {{ activity.completed ? 'Completed' : 'Mark Complete' }}
              </button>
              <button
                @click="deleteActivity(activity.id)"
                class="text-gray-400 hover:text-red-500"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- New Activity Modal -->
    <NewActivityModal
      :is-open="isNewActivityModalOpen"
      @close="isNewActivityModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  PlusIcon, 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  CheckIcon, 
  TrashIcon,
  DocumentIcon 
} from '@heroicons/vue/24/outline'
import { useActivityStore } from '@/modules/activities/store/activities.store'
import NewActivityModal from '@/modules/activities/components/NewActivityModal.vue'
import type { Activity } from '@/modules/activities/types/activity.types'

const activityStore = useActivityStore()
const isNewActivityModalOpen = ref(false)

const filters = ref({
  category: '',
  status: ''
})

const sortBy = ref('date')

const filteredActivities = computed(() => {
  let result = [...activityStore.activities]

  // Apply filters
  if (filters.value.category) {
    result = result.filter(activity => activity.category === filters.value.category)
  }
  if (filters.value.status) {
    result = result.filter(activity => {
      return filters.value.status === 'completed' ? activity.completed : !activity.completed
    })
  }

  // Apply sorting
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'date':
        return new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime()
      case 'category':
        return a.category.localeCompare(b.category)
      case 'status':
        return Number(b.completed) - Number(a.completed)
      default:
        return 0
    }
  })

  return result
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const toggleComplete = (activity: Activity) => {
  activityStore.updateActivity(activity.id, { completed: !activity.completed })
}

const deleteActivity = (id: string) => {
  if (confirm('Are you sure you want to delete this activity?')) {
    activityStore.deleteActivity(id)
  }
}
</script> 