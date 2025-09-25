<template>
  <canvas ref="chartRef"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps<{
  data: {
    labels: string[]
    datasets: {
      data: number[]
      backgroundColor: string[]
    }[]
  }
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

onMounted(() => {
  if (chartRef.value) {
    chart = new Chart(chartRef.value, {
      type: 'doughnut',
      data: props.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 15,
            },
          },
        },
        cutout: '70%',
      },
    })
  }
})

watch(
  () => props.data,
  newData => {
    if (chart) {
      chart.data = newData
      chart.update()
    }
  },
  { deep: true }
)
</script>
