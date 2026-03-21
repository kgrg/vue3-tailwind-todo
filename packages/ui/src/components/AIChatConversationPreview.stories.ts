import type { Meta, StoryObj } from '@storybook/vue3-vite'

const assistantLead = [
  {
    role: 'assistant',
    text: 'You have more planned work than fits today. Keep the first two items and move the rest into tomorrow.',
  },
  {
    role: 'user',
    text: 'What should I move first?',
  },
  {
    role: 'assistant',
    text: 'Move the optional reporting task. It depends on energy you may not have after the meeting block.',
  },
]

const escalated = [
  {
    role: 'assistant',
    text: 'You slipped the same task three times. Consider breaking it down or postponing it intentionally.',
  },
  {
    role: 'user',
    text: 'Break it down for me.',
  },
  {
    role: 'assistant',
    text: 'Try: outline requirements, draft the first section, then review for blockers before expanding further.',
  },
]

const meta = {
  title: 'AI Chat/ConversationPreview',
  tags: ['autodocs'],
  argTypes: {
    messages: { control: false },
  },
  render: (args) => ({
    setup: () => ({ args }),
    template: `
      <div class="max-w-xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p class="text-sm font-semibold text-slate-900">Focus coach</p>
            <p class="text-xs text-slate-500">{{ args.status }}</p>
          </div>
          <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Package safe</span>
        </div>

        <div class="mt-4 space-y-3">
          <div
            v-for="message in args.messages"
            :key="message.text"
            class="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6"
            :class="message.role === 'assistant'
              ? 'bg-slate-900 text-white'
              : 'ml-auto bg-slate-100 text-slate-700'"
          >
            {{ message.text }}
          </div>
        </div>
      </div>
    `,
  }),
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const AssistantLead: Story = {
  args: {
    status: 'Ready to guide',
    messages: assistantLead,
  },
}

export const EscalatedPlan: Story = {
  args: {
    status: 'Suggesting a breakdown',
    messages: escalated,
  },
}