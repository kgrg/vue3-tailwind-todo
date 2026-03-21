<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm font-medium text-slate-500">{{ label }}</p>
        <p class="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{{ value }}</p>
      </div>

      <span
        v-if="change"
        class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
        :class="toneClasses[tone]"
      >
        {{ change }}
      </span>
    </div>

    <p v-if="caption" class="mt-4 text-sm leading-6 text-slate-600">{{ caption }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  value: string
  change?: string
  caption?: string
  tone?: 'neutral' | 'positive' | 'negative'
}>(), {
  tone: 'neutral',
})

const toneClasses = {
  neutral: 'bg-slate-100 text-slate-700',
  positive: 'bg-emerald-50 text-emerald-700',
  negative: 'bg-rose-50 text-rose-700',
} as const
</script>