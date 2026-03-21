import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Input from './Input.vue'

const meta = {
  title: 'Form/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false },
    'onUpdate:modelValue': { action: 'update:modelValue' },
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    modelValue: '',
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
  },
}

export const Filled: Story = {
  args: {
    modelValue: 'alex@example.com',
    label: 'Email',
    type: 'email',
  },
}

export const Error: Story = {
  args: {
    modelValue: 'alex@example',
    label: 'Email',
    type: 'email',
    error: 'Please enter a valid email',
  },
}

export const Disabled: Story = {
  args: {
    modelValue: 'alex@example.com',
    label: 'Email',
    type: 'email',
    disabled: true,
  },
}