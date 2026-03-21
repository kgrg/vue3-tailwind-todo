<template>
  <div>
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="relative">
      <textarea
        :id="id"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :rows="rows"
        class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        :class="[
          error ? 'border-red-300' : '',
          disabled ? 'cursor-not-allowed bg-gray-100' : ''
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      ></textarea>
      <div v-if="error" class="pointer-events-none absolute right-0 top-2 flex items-center pr-3">
        <ExclamationCircleIcon class="h-5 w-5 text-red-500" />
      </div>
      <div v-if="icon" class="pointer-events-none absolute left-0 top-2 flex items-center pl-3">
        <component :is="icon" class="h-5 w-5 text-gray-400" />
      </div>
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import type { Component } from 'vue'

withDefaults(defineProps<{
  modelValue: string
  id?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  icon?: Component
  rows?: number
}>(), {
  rows: 3,
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>