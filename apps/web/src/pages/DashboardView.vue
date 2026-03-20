<template>
  <div class="max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">Overview of your activities and progress</p>
      </div>
      <button 
        @click="isNewActivityModalOpen = true"
        class="flex items-center px-4 py-2 bg-[#2564CF] text-white rounded-lg hover:bg-[#215ABB]"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        <span class="hidden sm:inline">New Activity</span>
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Today's Activities -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Today's Activities</p>
            <p class="mt-2 text-3xl font-semibold text-gray-900">{{ todayStats.total }}</p>
          </div>
          <div class="p-3 bg-blue-50 rounded-full">
            <CalendarDaysIcon class="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center justify-between text-sm">
            <span class="text-green-600">Completed: {{ todayStats.completed }}</span>
            <span class="text-gray-500">{{ todayStats.completionRate }}%</span>
          </div>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-green-500 h-2 rounded-full" 
              :style="{ width: `${todayStats.completionRate}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Weekly Performance -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Weekly Performance</p>
            <p class="mt-2 text-3xl font-semibold text-gray-900">{{ weeklyStats.averageCompletion }}%</p>
          </div>
          <div class="p-3 bg-purple-50 rounded-full">
            <ChartBarIcon class="w-6 h-6 text-purple-500" />
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center justify-between text-sm">
            <span class="text-purple-600">Best day: {{ weeklyStats.bestDay }}</span>
            <span class="text-gray-500">{{ weeklyStats.trend }}% vs last week</span>
          </div>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-purple-500 h-2 rounded-full" 
              :style="{ width: `${weeklyStats.trend}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Time Management -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Time Management</p>
            <p class="mt-2 text-3xl font-semibold text-gray-900">{{ timeStats.totalHours }}h</p>
          </div>
          <div class="p-3 bg-green-50 rounded-full">
            <ClockIcon class="w-6 h-6 text-green-500" />
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center justify-between text-sm">
            <span class="text-green-600">Productive: {{ timeStats.productiveHours }}h</span>
            <span class="text-gray-500">{{ timeStats.efficiency }}% efficiency</span>
          </div>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-green-500 h-2 rounded-full" 
              :style="{ width: `${timeStats.efficiency}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Category Focus -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Category Focus</p>
            <p class="mt-2 text-3xl font-semibold text-gray-900">{{ categoryFocus.topCategory }}</p>
          </div>
          <div class="p-3 bg-yellow-50 rounded-full">
            <TagIcon class="w-6 h-6 text-yellow-500" />
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center justify-between text-sm">
            <span class="text-yellow-600">{{ categoryFocus.percentage }}% of time</span>
            <span class="text-gray-500">{{ categoryFocus.trend }}% increase</span>
          </div>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-yellow-500 h-2 rounded-full" 
              :style="{ width: `${categoryFocus.percentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Trends -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Completion Rate Chart -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Completion Rate Trend</h2>
        <div class="h-[300px] w-full">
          <ActivityCompletionChart :data="completionData" />
        </div>
      </div>

      <!-- Category Distribution Chart -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Category Distribution</h2>
        <div class="h-[300px] w-full">
          <ActivityCategoryChart :data="categoryData" />
        </div>
      </div>
    </div>

    <!-- Time Analysis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Daily Activity Hours -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Daily Activity Hours</h2>
        <div class="h-[300px] w-full">
          <ActivityHoursChart :data="activityHoursData" />
        </div>
      </div>

      <!-- Productivity by Time of Day -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Productivity by Time of Day</h2>
        <div class="h-[300px] w-full">
          <ProductivityChart :data="productivityData" />
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="bg-white rounded-lg border border-gray-200 mb-8">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Recent Activities</h2>
      </div>
      <div class="divide-y divide-gray-200">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="p-4 hover:bg-gray-50"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">{{ activity.title }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ activity.description }}</p>
              <div class="mt-2 flex items-center space-x-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
                <CheckCircleIcon
                  v-else
                  class="h-5 w-5"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  CalendarDaysIcon, 
  ClockIcon, 
  TagIcon, 
  ChartBarIcon,
  MapPinIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import { useActivityStore } from '@/modules/activities/store/activities.store'
import NewActivityModal from '@/modules/activities/components/NewActivityModal.vue'
import ActivityCompletionChart from '@/core/components/charts/ActivityCompletionChart.vue'
import ActivityCategoryChart from '@/core/components/charts/ActivityCategoryChart.vue'
import ActivityHoursChart from '@/core/components/charts/ActivityHoursChart.vue'
import ProductivityChart from '@/core/components/charts/ProductivityChart.vue'

const activityStore = useActivityStore()
const isNewActivityModalOpen = ref(false)

// Today's Stats
const todayStats = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const activities = activityStore.getActivitiesByDate(today)
  const completed = activities.filter(a => a.status === 'completed').length
  const total = activities.length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return {
    total,
    completed,
    completionRate
  }
})

// Upcoming Stats
const upcomingStats = computed(() => {
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)

  const activities = activityStore.activities.filter(activity => {
    const activityDate = new Date(activity.date)
    return activityDate > today && activityDate <= nextWeek
  })

  const overdue = activityStore.activities.filter(activity => {
    const activityDate = new Date(activity.date)
    return activityDate < today && activity.status !== 'completed'
  }).length

  return {
    total: activities.length,
    next7Days: activities.length,
    overdue
  }
})

// Category Stats
const categoryStats = computed(() => {
  const categories = ['Work', 'Personal', 'Health & Fitness', 'Learning']
  const distribution = categories.map(category => ({
    name: category,
    count: activityStore.activities.filter(a => a.category === category).length
  }))

  return {
    total: activityStore.activities.length,
    distribution
  }
})

// Productivity Score
const productivityScore = computed(() => {
  const completed = activityStore.activities.filter(a => a.status === 'completed').length
  const total = activityStore.activities.length
  return total > 0 ? Math.round((completed / total) * 100) : 0
})

const productivityTrend = computed(() => {
  // This would be calculated based on historical data
  return 5 // Placeholder for now
})

// Recent Activities
const recentActivities = computed(() => {
  return activityStore.activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
})

// Chart Data
const completionData = computed(() => {
  // This would be calculated based on historical data
  return {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Completion Rate',
      data: [65, 70, 80, 75, 85, 60, 70],
      backgroundColor: '#2564CF'
    }]
  }
})

const categoryData = computed(() => {
  return {
    labels: categoryStats.value.distribution.map(c => c.name),
    datasets: [{
      data: categoryStats.value.distribution.map(c => c.count),
      backgroundColor: ['#2564CF', '#7C3AED', '#059669', '#D97706']
    }]
  }
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

// Weekly Stats
const weeklyStats = computed(() => {
  return {
    averageCompletion: 75,
    bestDay: 'Wednesday',
    trend: 12
  }
})

// Time Management Stats
const timeStats = computed(() => {
  return {
    totalHours: 42,
    productiveHours: 32,
    efficiency: 76
  }
})

// Category Focus Stats
const categoryFocus = computed(() => {
  return {
    topCategory: 'Work',
    percentage: 45,
    trend: 8
  }
})

// Activity Hours Data
const activityHoursData = computed(() => {
  return {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Hours',
      data: [6, 5, 7, 6, 5, 3, 2],
      backgroundColor: '#2564CF'
    }]
  }
})

// Productivity Data
const productivityData = computed(() => {
  return {
    labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
    datasets: [{
      label: 'Productivity',
      data: [85, 70, 60, 40],
      backgroundColor: '#7C3AED'
    }]
  }
})
</script> 