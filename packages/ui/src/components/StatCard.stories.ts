import type { Meta, StoryObj } from '@storybook/vue3-vite'
import StatCard from './StatCard.vue'

const meta = {
  title: 'Data/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  render: (args) => ({
    components: { StatCard },
    setup: () => ({ args }),
    template: `
      <div class="w-[320px]">
        <StatCard v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof StatCard>

export default meta

type Story = StoryObj<typeof meta>

export const PositiveTrend: Story = {
  args: {
    label: 'Focus minutes',
    value: '225',
    change: '+18%',
    caption: 'Higher than your rolling seven-day average.',
    tone: 'positive',
  },
}

export const NeutralTrend: Story = {
  args: {
    label: 'Tasks completed',
    value: '6 of 8',
    change: 'On track',
    caption: 'Two optional items remain unscheduled.',
    tone: 'neutral',
  },
}

export const RecoveryTrend: Story = {
  args: {
    label: 'Backlog pressure',
    value: 'High',
    change: '+4 slipped items',
    caption: 'Use this state to show a clear signal without color alone carrying the meaning.',
    tone: 'negative',
  },
}