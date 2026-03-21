<template>
  <div
    class="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between"
    :class="align === 'center' ? 'items-center text-center sm:flex-col sm:items-center' : ''"
  >
    <div class="space-y-2">
      <p v-if="eyebrow" class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        {{ eyebrow }}
      </p>
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{{ title }}</h1>
      <p v-if="description" class="max-w-2xl text-sm leading-6 text-slate-600">
        {{ description }}
      </p>
      <div v-if="$slots.meta" class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <slot name="meta"></slot>
      </div>
    </div>

    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-3">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}>(), {
  align: 'left',
})
</script>