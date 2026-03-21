import type { StorybookConfig } from '@storybook/vue3-vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'

const storybookVueDir = fileURLToPath(
  new URL('../../../node_modules/.pnpm/node_modules/@storybook/vue3/dist', import.meta.url),
)

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    const tailwindcss = (await import('@tailwindcss/vite')).default

    return mergeConfig(config, {
      resolve: {
        alias: {
          '@storybook/vue3/dist/entry-preview.mjs': path.join(storybookVueDir, 'entry-preview.mjs'),
          '@storybook/vue3/dist/entry-preview-docs.mjs': path.join(storybookVueDir, 'entry-preview-docs.mjs'),
        },
      },
      plugins: [tailwindcss()],
    })
  },
}

export default config