import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Tabs from './Tabs.vue'

const tabs = [
  { value: 'now', label: 'Now', badge: '3' },
  { value: 'next', label: 'Next' },
  { value: 'later', label: 'Later', disabled: true },
]

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  render: (args) => ({
    components: { Tabs },
    setup: () => ({ args }),
    template: `
      <div class="w-[420px]">
        <Tabs v-bind="args" />
      </div>
    `,
  }),
  argTypes: {
    'onUpdate:modelValue': { action: 'update:modelValue' },
  },
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Focus window',
    modelValue: 'now',
    tabs,
  },
}

export const AlternateSelection: Story = {
  args: {
    label: 'Focus window',
    modelValue: 'next',
    tabs,
  },
}