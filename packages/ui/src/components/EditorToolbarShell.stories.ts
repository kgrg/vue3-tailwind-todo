import type { Meta, StoryObj } from '@storybook/vue3-vite'

const draftingTools = ['Heading', 'Checklist', 'Comment', 'Link']
const reviewTools = ['Bold', 'Highlight', 'Resolve', 'Assign']

const meta = {
  title: 'Editor/ToolbarShell',
  tags: ['autodocs'],
  argTypes: {
    tools: { control: false },
  },
  render: (args) => ({
    setup: () => ({ args }),
    template: `
      <div class="max-w-3xl rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3">
          <button
            v-for="tool in args.tools"
            :key="tool"
            type="button"
            class="rounded-full px-3 py-1.5 text-sm font-medium"
            :class="tool === args.activeTool ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'"
          >
            {{ tool }}
          </button>
        </div>

        <div class="space-y-4 px-4 py-5 text-sm leading-7 text-slate-700">
          <p class="font-semibold text-slate-900">{{ args.title }}</p>
          <p>{{ args.body }}</p>
          <div class="rounded-2xl bg-slate-50 p-4 text-slate-600">
            {{ args.callout }}
          </div>
        </div>
      </div>
    `,
  }),
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Drafting: Story = {
  args: {
    title: 'Draft the weekly review in three passes',
    body: 'Start by listing outcomes, then add blockers, then decide what should move into next week. Keep the toolbar lightweight and store-free.',
    callout: 'Draft mode keeps attention on content first.',
    activeTool: 'Checklist',
    tools: draftingTools,
  },
}

export const ReviewMode: Story = {
  args: {
    title: 'Review notes before sending them',
    body: 'The same shell can represent a review state without any editor engine or backend dependency.',
    callout: 'Review mode emphasizes confirmation and handoff.',
    activeTool: 'Resolve',
    tools: reviewTools,
  },
}