import { defineConfig } from 'vite-plus'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'TaskFlowUI',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: (id) => id === 'vue' || id.startsWith('vue/') || id.startsWith('@heroicons/vue'),
    },
  },
})