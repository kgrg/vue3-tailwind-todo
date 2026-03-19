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
      label: string
      data: number[]
      backgroundColor: string
    }[]
  }
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

onMounted(() => {
  if (chartRef.value) {
    chart = new Chart(chartRef.value, {
      type: 'line',
      data: props.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Completion Rate (%)'
            },
            ticks: {
              callback: (value: number | string) => `${value}%`
            }
          }
        }
      }
    })
  }
})

watch(() => props.data, (newData) => {
  if (chart) {
    chart.data = newData
    chart.update()
  }
}, { deep: true })
</script> 