import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from './Button.vue'
import Card from './Card.vue'
import PageHeader from './PageHeader.vue'
import StatCard from './StatCard.vue'

const meta = {
  title: 'Dashboard/FocusSnapshot',
  tags: ['autodocs'],
  render: (args) => ({
    components: { Button, Card, PageHeader, StatCard },
    setup: () => ({ args }),
    template: `
      <div class="space-y-6 rounded-4xl bg-slate-950 p-6 text-white">
        <PageHeader
          eyebrow="Dashboard"
          title="Daily focus snapshot"
          description="A package-safe dashboard composition that shows priorities, signals, and next steps."
        >
          <template #actions>
            <Button variant="secondary">Review plan</Button>
            <Button>Start timer</Button>
          </template>
        </PageHeader>

        <div class="grid gap-4 md:grid-cols-3">
          <StatCard label="Planned work" value="3" change="Core only" caption="Keep optional work separate." tone="neutral" />
          <StatCard label="Energy budget" value="78%" change="Stable" caption="Enough room for one stretch task." tone="positive" />
          <StatCard label="Slip risk" value="Low" change="1 at risk" caption="One task may need to move later." tone="neutral" />
        </div>

        <div class="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <template #header-left>
              <span class="text-sm font-medium text-slate-300">Today's priorities</span>
            </template>
            <template #header-right>
              <span class="text-xs text-slate-500">{{ args.modeLabel }}</span>
            </template>
            <template #content>
              <ul class="space-y-3 text-sm text-slate-200">
                <li class="rounded-xl bg-white/5 px-4 py-3">Ship the component catalog expansion</li>
                <li class="rounded-xl bg-white/5 px-4 py-3">Trim backlog overflow before noon</li>
                <li class="rounded-xl bg-white/5 px-4 py-3">Leave a clear handoff note for tomorrow</li>
              </ul>
            </template>
            <template #footer-left>
              <span>3 core items</span>
            </template>
            <template #footer-right>
              <span>{{ args.footerLabel }}</span>
            </template>
          </Card>

          <Card>
            <template #header-left>
              <span class="text-sm font-medium text-slate-300">Recovery plan</span>
            </template>
            <template #content>
              <p class="text-sm text-slate-200">If energy drops, pause optional work and keep only the first two items visible.</p>
            </template>
            <template #footer-left>
              <span>Safety rule</span>
            </template>
            <template #footer-right>
              <span>Never hide tradeoffs</span>
            </template>
          </Card>
        </div>
      </div>
    `,
  }),
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const CalmDay: Story = {
  args: {
    modeLabel: 'Balanced plan',
    footerLabel: 'All within capacity',
  },
}

export const RecoveryMode: Story = {
  args: {
    modeLabel: 'Trimmed plan',
    footerLabel: 'Optional work removed',
  },
}