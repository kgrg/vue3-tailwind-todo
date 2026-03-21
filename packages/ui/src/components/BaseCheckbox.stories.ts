import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseCheckbox from './BaseCheckbox.vue'

const meta = {
  title: 'Form/BaseCheckbox',
  component: BaseCheckbox,
  tags: ['autodocs'],
  argTypes: {
    'onUpdate:modelValue': { action: 'update:modelValue' },
  },
} satisfies Meta<typeof BaseCheckbox>

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