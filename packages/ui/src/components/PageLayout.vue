<template>
  <section class="space-y-8">
    <PageHeader
      v-if="hasHeader"
      :eyebrow="eyebrow"
      :title="title"
      :description="description"
      :align="align"
    >
      <template v-if="$slots.meta" #meta>
        <slot name="meta"></slot>
      </template>

      <template v-if="$slots.actions" #actions>
        <slot name="actions"></slot>
      </template>
    </PageHeader>

    <div
      class="grid gap-6"
      :class="{
        'xl:grid-cols-[minmax(0,1fr)_20rem]': $slots.aside,
      }"
    >
      <div class="min-w-0 space-y-6">
        <slot></slot>
      </div>

      <aside v-if="$slots.aside" class="space-y-6">
        <slot name="aside"></slot>
      </aside>
    </div>

    <div v-if="$slots.footer" class="border-t border-slate-200 pt-6">
      <slot name="footer"></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import PageHeader from './PageHeader.vue'

const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  description?: string
  align?: 'left' | 'center'
}>(), {
  align: 'left',
})

const slots = useSlots()

const hasHeader = computed(() => {
  return Boolean(props.title || slots.meta || slots.actions)
})
</script>
