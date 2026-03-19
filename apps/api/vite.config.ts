import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    entry: ['src/index.ts'],
    format: ['esm'],
    platform: 'node',
    target: 'node22',
    clean: true,
  },
})
