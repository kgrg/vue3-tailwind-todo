<template>
  <div>
    <label
      :for="id"
      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :value="modelValue"
      @input="updateValue"
      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
      :placeholder="placeholder"
      :required="required"
    />
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  placeholder: {
    type: String
  },
  required: {
    type: Boolean
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>
