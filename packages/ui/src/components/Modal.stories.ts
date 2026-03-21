import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Modal from './Modal.vue'

const meta = {
  title: 'Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
  render: (args) => ({
    components: { Modal },
    setup: () => ({ args }),
    template: `
      <div class="min-h-[460px] rounded-3xl bg-slate-100 p-6">
        <Modal v-bind="args">
          <div class="space-y-3 text-sm leading-6 text-slate-600">
            <p>Move unfinished tasks into tomorrow's holding list so today's plan stays realistic.</p>
            <ul class="space-y-2 rounded-2xl bg-slate-50 p-4 text-slate-700">
              <li>Design the first dashboard wireframe</li>
              <li>Review backlog overflow rules</li>
              <li>Trim optional tasks after 4 PM</li>
            </ul>
          </div>
        </Modal>
      </div>
    `,
  }),
  argTypes: {
    onClose: { action: 'close' },
    onConfirm: { action: 'confirm' },
  },
} satisfies Meta<typeof Modal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
    eyebrow: 'Plan reset',
    title: 'Reschedule overflow',
    description: 'Keep the day realistic by moving work that no longer fits.',
    confirmLabel: 'Move to tomorrow',
    cancelLabel: 'Keep items here',
  },
}

export const Danger: Story = {
  args: {
    open: true,
    eyebrow: 'Destructive action',
    title: 'Archive abandoned draft',
    description: 'This removes the draft from your active plan and hides it from the dashboard.',
    confirmLabel: 'Archive draft',
    cancelLabel: 'Keep draft',
    tone: 'danger',
  },
}