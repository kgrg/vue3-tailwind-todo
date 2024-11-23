<template>
  <nav
    class="flex flex-col items-start justify-between space-y-3 p-4 md:flex-row md:items-center md:space-y-0"
    aria-label="Table navigation"
  >
    <h2
      class="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-4xl"
    >
      {{ title }}
    </h2>
  </nav>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
