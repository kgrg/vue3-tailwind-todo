<template>
  <div
    v-if="open"
    class="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/45 p-4"
    @click.self="closeOnBackdrop && $emit('close')"
  >
    <div
      class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="base-modal-title"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-2">
          <p v-if="eyebrow" class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {{ eyebrow }}
          </p>
          <h2 id="base-modal-title" class="text-xl font-semibold text-slate-900">
            {{ title }}
          </h2>
          <p v-if="description" class="text-sm leading-6 text-slate-600">
            {{ description }}
          </p>
        </div>

        <button
          type="button"
          class="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          aria-label="Close dialog"
          @click="$emit('close')"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>

      <div class="mt-5">
        <slot></slot>
      </div>

      <div v-if="showFooter" class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <slot name="footer">
          <Button variant="secondary" @click="$emit('close')">
            {{ cancelLabel }}
          </Button>
          <Button :variant="tone === 'danger' ? 'danger' : 'primary'" @click="$emit('confirm')">
            {{ confirmLabel }}
          </Button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import Button from './Button.vue'

withDefaults(defineProps<{
  open: boolean
  title: string
  description?: string
  eyebrow?: string
  confirmLabel?: string
  cancelLabel?: string
  closeOnBackdrop?: boolean
  showFooter?: boolean
  tone?: 'default' | 'danger'
}>(), {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  closeOnBackdrop: true,
  showFooter: true,
  tone: 'default',
})

defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()
</script>