<template>
  <div class="sm:col-span-2">
    <label
      for="description"
      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >Description</label
    >
    <textarea
      id="description"
      rows="4"
      :value="modelValue"
      @input="updateModelValue"
      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
    ></textarea>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const updateModelValue = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>
