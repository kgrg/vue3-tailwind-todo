import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from './Button.vue'
import Card from './Card.vue'
import PageLayout from './PageLayout.vue'
import StatCard from './StatCard.vue'

const priorities = [
  {
    title: 'Ship the new layout primitives',
    description: 'Lock the shared UI API before refactoring the app screens.',
  },
  {
    title: 'Review blocked work',
    description: 'Resolve the tasks that cannot move without a product decision.',
  },
  {
    title: 'Trim non-essential scope',
    description: 'Move lower-signal work out of the sprint while delivery is the priority.',
  },
]

const meta = {
  title: 'Layout/PageLayout',
  component: PageLayout,
  tags: ['autodocs'],
  render: (args) => ({
    components: { Button, Card, PageLayout, StatCard },
    setup: () => ({ args, priorities }),
    template: `
      <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <PageLayout v-bind="args">
          <template #meta>
            <span>Updated 15 minutes ago</span>
            <span>Owner: Product ops</span>
          </template>

          <template #actions>
            <Button variant="secondary">Share brief</Button>
            <Button>Start review</Button>
          </template>

          <div class="grid gap-4 md:grid-cols-3">
            <StatCard label="Active streams" value="6" change="+1" caption="Two streams close this week." tone="positive" />
            <StatCard label="Blocked tasks" value="3" change="Needs review" caption="These items need a direct decision." tone="negative" />
            <StatCard label="Confidence" value="High" caption="The plan is stable if the top risks get handled today." />
          </div>

          <Card customClass="p-0">
            <template #content>
              <div class="space-y-4 p-6">
                <div>
                  <p class="text-sm font-medium text-slate-500">Priorities</p>
                  <h3 class="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                    Focus the page body on the work users need to scan first.
                  </h3>
                </div>

                <div class="space-y-3">
                  <div
                    v-for="priority in priorities"
                    :key="priority.title"
                    class="rounded-2xl bg-slate-50 p-4"
                  >
                    <p class="text-sm font-medium text-slate-900">{{ priority.title }}</p>
                    <p class="mt-2 text-sm leading-6 text-slate-600">{{ priority.description }}</p>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <template #aside>
            <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p class="text-sm font-medium text-slate-900">Right rail</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Use the optional aside for context, checkpoints, filters, or status notes that support the main page.
              </p>
            </div>

            <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p class="text-sm font-medium text-slate-900">Release checklist</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Storybook coverage, responsive pass, and package export all need to land together.
              </p>
            </div>
          </template>

          <template #footer>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-sm text-slate-600">Footer content can hold pagination, secondary actions, or supporting notes.</p>
              <div class="flex items-center gap-3">
                <Button variant="secondary">Archive</Button>
                <Button>Continue</Button>
              </div>
            </div>
          </template>
        </PageLayout>
      </div>
    `,
  }),
  args: {
    eyebrow: 'Weekly planning',
    title: 'Turn the overview into a page structure people can use quickly',
    description: 'PageLayout wraps the page header and arranges the main content, optional right rail, and footer in a consistent section-level scaffold.',
    align: 'left',
  },
} satisfies Meta<typeof PageLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CenteredHeader: Story = {
  args: {
    eyebrow: 'Quarterly review',
    title: 'Use a centered page introduction for wider editorial or summary views',
    description: 'The page scaffold still supports actions, content, and the right rail while shifting the header tone.',
    align: 'center',
  },
}
