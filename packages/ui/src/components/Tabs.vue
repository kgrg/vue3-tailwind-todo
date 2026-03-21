<template>
  <div class="flex flex-col gap-2">
    <span v-if="label" class="text-sm font-medium text-slate-700">{{ label }}</span>

    <div
      class="inline-flex w-fit flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1"
      role="tablist"
      :aria-label="label ?? 'Tabs'"
    >
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        role="tab"
        class="inline-flex min-w-24 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        :class="[
          tab.value === modelValue
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:bg-white/80 hover:text-slate-700',
          tab.disabled ? 'cursor-not-allowed opacity-50' : ''
        ]"
        :aria-selected="tab.value === modelValue"
        :tabindex="tab.value === modelValue ? 0 : -1"
        :disabled="tab.disabled"
        @click="$emit('update:modelValue', tab.value)"
      >
        <span>{{ tab.label }}</span>
        <span
          v-if="tab.badge"
          class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600"
        >
          {{ tab.badge }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TabItem {
  value: string
  label: string
  disabled?: boolean
  badge?: string
}

defineProps<{
  modelValue: string
  tabs: TabItem[]
  label?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>