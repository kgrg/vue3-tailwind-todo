<template>
  <div>
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        :class="[
          error ? 'border-red-300' : '',
          disabled ? 'cursor-not-allowed bg-gray-100' : ''
        ]"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
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
      <div v-if="error" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <ExclamationCircleIcon class="h-5 w-5 text-red-500" />
      </div>
      <div v-if="icon" class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <component :is="icon" class="h-5 w-5 text-gray-400" />
      </div>
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import type { Component } from 'vue'

export interface BaseSelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

defineProps<{
  modelValue: string | number
  id?: string
  label?: string
  options: BaseSelectOption[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  icon?: Component
}>()

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>