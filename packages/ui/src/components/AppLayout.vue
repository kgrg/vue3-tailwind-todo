<template>
  <div class="min-h-screen bg-slate-100 text-slate-950">
    <div class="flex min-h-screen w-full">
      <aside
        v-if="$slots.sidebar"
        class="hidden shrink-0 border-r border-slate-200 bg-slate-950 text-slate-100 lg:block"
        :class="sidebarWidthClasses[sidebarWidth]"
      >
        <div class="sticky top-0 h-screen overflow-y-auto">
          <slot name="sidebar"></slot>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header
          v-if="$slots.header"
          class="border-b border-slate-200 bg-white/90 backdrop-blur"
          :class="{ 'sticky top-0 z-10': stickyHeader }"
        >
          <slot name="header"></slot>
        </header>

        <div class="flex flex-1">
          <main class="min-w-0 flex-1">
            <div
              class="mx-auto w-full"
              :class="[contentMaxWidthClasses[contentMaxWidth], contentPaddingClasses[contentPadding]]"
            >
              <slot></slot>
            </div>
          </main>

          <aside
            v-if="$slots.aside"
            class="hidden w-80 shrink-0 border-l border-slate-200 bg-white xl:block"
          >
            <div class="sticky top-0 h-screen overflow-y-auto p-6">
              <slot name="aside"></slot>
            </div>
          </aside>
        </div>

        <footer v-if="$slots.footer" class="border-t border-slate-200 bg-white">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  sidebarWidth?: 'compact' | 'default' | 'wide'
  contentMaxWidth?: 'none' | '5xl' | '6xl' | '7xl'
  contentPadding?: 'sm' | 'md' | 'lg'
  stickyHeader?: boolean
}>(), {
  sidebarWidth: 'default',
  contentMaxWidth: '7xl',
  contentPadding: 'md',
  stickyHeader: true,
})

const sidebarWidthClasses = {
  compact: 'w-64',
  default: 'w-72',
  wide: 'w-80',
} as const

const contentMaxWidthClasses = {
  none: 'max-w-none',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
} as const

const contentPaddingClasses = {
  sm: 'px-4 py-5 sm:px-6 sm:py-6',
  md: 'px-4 py-6 sm:px-6 sm:py-8 lg:px-8',
  lg: 'px-5 py-8 sm:px-8 sm:py-10 lg:px-10',
} as const
</script>
