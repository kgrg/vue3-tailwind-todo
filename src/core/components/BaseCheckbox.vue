<template>
  <div class="flex items-center">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      :required="required"
      :disabled="disabled"
      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
      :class="[
        error ? 'border-red-300' : '',
        disabled ? 'bg-gray-100 cursor-not-allowed' : ''
      ]"
    />
    <label v-if="label" :for="id" class="ml-2 block text-sm text-gray-900">
      {{ label }}
    </label>
    <div v-if="error" class="ml-2">
      <ExclamationCircleIcon class="h-5 w-5 text-red-500" />
    </div>
  </div>
  <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
</template>

<script setup lang="ts">
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'

defineProps<{
  modelValue: boolean
  id?: string
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script> 