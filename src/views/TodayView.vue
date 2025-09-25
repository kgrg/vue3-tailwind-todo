<template>
  <div class="max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Today's Activities</h1>
        <p class="mt-1 text-sm text-gray-500">View and manage your activities for today</p>
      </div>
      <button
        @click="isNewActivityModalOpen = true"
        class="flex items-center px-4 py-2 bg-[#2564CF] text-white rounded-lg hover:bg-[#215ABB]"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        <span class="hidden sm:inline">New Activity</span>
      </button>
    </div>

    <!-- Activity Stats -->
    <div class="mb-8">
      <ActivityStats />
    </div>

    <!-- Activity List -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="divide-y divide-gray-200">
        <div v-for="activity in todayActivities" :key="activity.id" class="p-4 hover:bg-gray-50">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">{{ activity.title }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ activity.description }}</p>
              <div class="mt-2 flex items-center space-x-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ activity.category }}
                </span>
                <span class="text-sm text-gray-500">{{ activity.time }}</span>
                <span v-if="activity.location" class="text-sm text-gray-500">
                  <MapPinIcon class="h-4 w-4 inline-block mr-1" />
                  {{ activity.location }}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="toggleActivityStatus(activity.id)"
                class="p-2 text-gray-400 hover:text-gray-500"
              >
                <CheckCircleIcon
                  v-if="activity.status === 'completed'"
                  class="h-5 w-5 text-green-500"
                />
                <CheckCircleIcon v-else class="h-5 w-5" />
              </button>
              <button
                @click="deleteActivity(activity.id)"
                class="p-2 text-gray-400 hover:text-red-500"
              >
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NewActivityModal :is-open="isNewActivityModalOpen" @close="isNewActivityModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusIcon, MapPinIcon, CheckCircleIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useActivityStore } from '@/modules/activities/store/activities.store'
import NewActivityModal from '@/modules/activities/components/NewActivityModal.vue'
import ActivityStats from '@/core/components/ActivityStats.vue'

const activityStore = useActivityStore()
const isNewActivityModalOpen = ref(false)

const todayActivities = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return activityStore.getActivitiesByDate(today)
})

const toggleActivityStatus = (id: string) => {
  const activity = activityStore.activities.find(a => a.id === id)
  if (activity) {
    activityStore.updateActivityStatus(
      id,
      activity.status === 'completed' ? 'pending' : 'completed'
    )
  }
}

const deleteActivity = (id: string) => {
  activityStore.deleteActivity(id)
}
</script>
