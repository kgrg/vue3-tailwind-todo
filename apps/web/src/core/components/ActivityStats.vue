<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Activity Overview</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Stats Cards -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="text-sm font-medium text-gray-500">Total Activities</div>
        <div class="mt-1 text-2xl font-semibold text-gray-900">{{ stats.total }}</div>
      </div>
      
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="text-sm font-medium text-gray-500">Completed</div>
        <div class="mt-1 text-2xl font-semibold text-green-600">{{ stats.completed }}</div>
      </div>
      
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="text-sm font-medium text-gray-500">Pending</div>
        <div class="mt-1 text-2xl font-semibold text-yellow-600">{{ stats.pending }}</div>
      </div>
    </div>

    <!-- Category Distribution Chart -->
    <div class="mt-6">
      <h4 class="text-sm font-medium text-gray-500 mb-4">Activities by Category</h4>
      <div class="h-64">
        <canvas ref="chartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useActivityStore } from '@/modules/activities/store/activities.store'

Chart.register(...registerables)

const activityStore = useActivityStore()
const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const stats = activityStore.getActivityStats

const updateChart = () => {
  if (!chartRef.value) return

  const categories = Object.keys(stats.byCategory)
  const counts = Object.values(stats.byCategory)

  if (chart) {
    chart.destroy()
  }

  chart = new Chart(chartRef.value, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [{
        data: counts,
        backgroundColor: [
          '#2564CF', // Work
          '#10B981', // Personal
          '#F59E0B', // Learning
          '#EF4444', // Health
          '#8B5CF6'  // Other
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 20
          }
        }
      },
      cutout: '70%'
    }
  })
}

onMounted(() => {
  updateChart()
})

watch(() => activityStore.activities, () => {
  updateChart()
}, { deep: true })
</script> 