<template>
  <div
    class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center shadow-sm"
    :class="compact ? 'max-w-md' : 'max-w-xl'"
  >
    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full" :class="toneClasses[tone]">
      <slot name="icon">
        <span class="text-lg font-semibold">?</span>
      </slot>
    </div>

    <h2 class="mt-4 text-xl font-semibold text-slate-900">{{ title }}</h2>
    <p class="mt-2 text-sm leading-6 text-slate-600">{{ description }}</p>

    <div v-if="$slots.actions" class="mt-5 flex justify-center gap-3">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description: string
  tone?: 'neutral' | 'success' | 'warning'
  compact?: boolean
}>(), {
  tone: 'neutral',
  compact: false,
})

const toneClasses = {
  neutral: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
} as const
</script>