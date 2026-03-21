import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from './Button.vue'

const meta = {
  title: 'Element/Button',
  component: Button,
  tags: ['autodocs'],
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-3">
        <Button v-bind="args">Save changes</Button>
      </div>
    `,
  }),
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
  },
}

export const Disabled: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    disabled: true,
  },
}