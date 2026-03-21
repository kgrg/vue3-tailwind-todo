import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Textarea from './Textarea.vue'

const meta = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false },
    'onUpdate:modelValue': { action: 'update:modelValue' },
  },
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    modelValue: '',
    label: 'Description',
    placeholder: 'Describe your activity',
    rows: 3,
  },
}

export const Filled: Story = {
  args: {
    modelValue: 'A reusable textarea with label, validation state, and Tailwind styling.',
    label: 'Description',
    rows: 4,
  },
}

export const Error: Story = {
  args: {
    modelValue: '',
    label: 'Description',
    placeholder: 'Describe your activity',
    rows: 3,
    error: 'Description is required',
  },
}