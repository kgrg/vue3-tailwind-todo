import { SparklesIcon } from '@heroicons/vue/24/outline'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from './Button.vue'
import EmptyState from './EmptyState.vue'

const meta = {
  title: 'Content/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  render: (args) => ({
    components: { Button, EmptyState, SparklesIcon },
    setup: () => ({ args }),
    template: `
      <EmptyState v-bind="args">
        <template #icon>
          <SparklesIcon class="h-6 w-6" />
        </template>

        <template #actions>
          <Button variant="secondary">Browse examples</Button>
          <Button>Create first plan</Button>
        </template>
      </EmptyState>
    `,
  }),
} satisfies Meta<typeof EmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Nothing has been planned yet',
    description: 'Start with one meaningful priority, then add optional work only if there is real room for it.',
    tone: 'neutral',
  },
}

export const WarningState: Story = {
  args: {
    title: 'Your backlog is crowded',
    description: 'Before creating more work, archive stale ideas or move them into a later review bucket.',
    tone: 'warning',
  },
}