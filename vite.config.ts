import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['@headlessui/vue', '@heroicons/vue'],
          'utils-vendor': ['uuid', 'zod'],

          // Feature chunks
          labels: [
            './src/modules/labels/components/LabelManagement.vue',
            './src/modules/labels/components/LabelFilter.vue',
            './src/modules/labels/store/labels.store.ts',
          ],
          'label-components': [
            './src/core/components/BaseLabelChip.vue',
            './src/core/components/LabelPicker.vue',
            './src/core/components/LabelDialog.vue',
          ],
          'label-utils': [
            './src/core/repositories/labels.repository.ts',
            './src/core/repositories/tasks.repository.ts',
            './src/core/validation/label.validation.ts',
            './src/core/utils/color-contrast.ts',
            './src/core/utils/error-handler.ts',
          ],
          'label-performance': [
            './src/core/performance/label-performance.ts',
            './src/core/search/label-search.ts',
            './src/core/accessibility/label-a11y.ts',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', '@headlessui/vue', '@heroicons/vue', 'uuid', 'zod'],
  },
})
