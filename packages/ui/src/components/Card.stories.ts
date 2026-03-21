import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Card from './Card.vue'

const meta = {
  title: 'Layout/Card',
  component: Card,
  tags: ['autodocs'],
  render: (args) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" style="width: 320px;">
        <template #header-left>
          <span class="text-sm font-medium text-gray-600">Work</span>
        </template>
        <template #header-right>
          <span class="text-xs text-gray-400">Today</span>
        </template>
        <template #content>
          <h3 class="mb-1 text-base font-medium text-gray-900">Ship UI package</h3>
          <p class="text-sm text-gray-500">Extract reusable primitives into a documented shared package.</p>
        </template>
        <template #footer-left>
          <span>2h</span>
        </template>
        <template #footer-right>
          <span>Planning</span>
        </template>
      </Card>
    `,
  }),
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const InteractiveSurface: Story = {
  args: {
    customClass: 'group cursor-pointer',
  },
}