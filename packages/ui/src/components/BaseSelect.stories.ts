import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseSelect from './BaseSelect.vue'

const options = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'learning', label: 'Learning' },
]

const meta = {
  title: 'Form/BaseSelect',
  component: BaseSelect,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false },
    'onUpdate:modelValue': { action: 'update:modelValue' },
  },
} satisfies Meta<typeof BaseSelect>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    modelValue: '',
    label: 'Category',
    placeholder: 'Select a category',
    options,
  },
}

export const Selected: Story = {
  args: {
    modelValue: 'learning',
    label: 'Category',
    options,
  },
}

export const Error: Story = {
  args: {
    modelValue: '',
    label: 'Category',
    placeholder: 'Select a category',
    options,
    error: 'Please choose a category',
  },
}