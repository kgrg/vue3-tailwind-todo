import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from './Button.vue'
import PageHeader from './PageHeader.vue'

const meta = {
  title: 'Page/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  render: (args) => ({
    components: { Button, PageHeader },
    setup: () => ({ args }),
    template: `
      <div class="rounded-3xl border border-slate-200 bg-white p-6">
        <PageHeader v-bind="args">
          <template #meta>
            <span>3 priority items</span>
            <span>Focus window: 9:00-13:00</span>
          </template>

          <template #actions>
            <Button variant="secondary">Share</Button>
            <Button>Start focus session</Button>
          </template>
        </PageHeader>
      </div>
    `,
  }),
} satisfies Meta<typeof PageHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    eyebrow: 'Today',
    title: 'Build a plan you can actually finish',
    description: 'Group essential work, optional work, and follow-up in a way that makes the tradeoffs obvious.',
  },
}

export const Centered: Story = {
  args: {
    eyebrow: 'Weekly reset',
    title: 'Make room before adding more work',
    description: 'This variant works for landing states and larger planning checkpoints.',
    align: 'center',
  },
}