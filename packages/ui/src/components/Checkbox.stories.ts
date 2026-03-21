import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Checkbox from './Checkbox.vue'

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    'onUpdate:modelValue': { action: 'update:modelValue' },
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    modelValue: false,
    label: 'Remember me',
  },
}

export const Checked: Story = {
  args: {
    modelValue: true,
    label: 'Remember me',
  },
}

export const Error: Story = {
  args: {
    modelValue: false,
    label: 'Accept terms',
    error: 'This field is required',
  },
}