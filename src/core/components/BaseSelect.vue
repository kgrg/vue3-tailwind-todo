<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        :required="required"
        :disabled="disabled"
        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        :class="[
          error ? 'border-red-300' : '',
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        ]"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <div v-if="error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <ExclamationCircleIcon class="h-5 w-5 text-red-500" />
      </div>
      <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="icon" class="h-5 w-5 text-gray-400" />
      </div>
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'

interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

defineProps<{
  modelValue: string | number
  id?: string
  label?: string
  options: Option[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  icon?: any
}>()

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script> 