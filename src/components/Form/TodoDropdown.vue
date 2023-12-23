<template>
  <div>
    <label
      for="status"
      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >Status</label
    >
    <select
      :value="modelValue"
      @input="updateModelValue"
      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
    >
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  options: Array
})

const emit = defineEmits(['update:modelValue'])

const updateModelValue = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>
