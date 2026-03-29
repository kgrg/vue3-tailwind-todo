import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AppLayout from './AppLayout.vue'
import Button from './Button.vue'
import Card from './Card.vue'
import PageHeader from './PageHeader.vue'
import StatCard from './StatCard.vue'

const navItems = [
  'Inbox',
  'Today',
  'Calendar',
  'Projects',
  'Reports',
]

const meta = {
  title: 'Layout/AppLayout',
  component: AppLayout,
  tags: ['autodocs'],
  render: (args) => ({
    components: { AppLayout, Button, Card, PageHeader, StatCard },
    setup: () => ({ args, navItems }),
    template: `
      <AppLayout v-bind="args">
        <template #sidebar>
          <div class="flex h-full flex-col px-5 py-6">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Taskflow</p>
              <h2 class="mt-3 text-xl font-semibold tracking-tight text-white">Operations</h2>
              <p class="mt-2 text-sm leading-6 text-slate-400">
                A focused workspace for planning, execution, and review.
              </p>
            </div>

            <nav class="mt-8 space-y-2">
              <a
                v-for="item in navItems"
                :key="item"
                href="#"
                class="flex items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {{ item }}
              </a>
            </nav>

            <div class="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-sm font-medium text-white">Sprint health</p>
              <p class="mt-2 text-sm leading-6 text-slate-400">
                7 tasks are on track. 2 tasks need a decision today.
              </p>
            </div>
          </div>
        </template>

        <template #header>
          <div class="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Workspace</p>
              <h2 class="mt-1 text-lg font-semibold text-slate-900">Product planning</h2>
            </div>

            <div class="flex items-center gap-3">
              <Button variant="secondary">Share</Button>
              <Button>New task</Button>
            </div>
          </div>
        </template>

        <div class="space-y-8">
          <PageHeader
            eyebrow="Tuesday sprint"
            title="Keep the week stable while shipping visible progress"
            description="Use the layout shell for sidebar navigation, page-level header content, and a constrained workspace for the main page."
          >
            <template #meta>
              <span>12 open items</span>
              <span>3 blocked</span>
            </template>

            <template #actions>
              <Button variant="secondary">Export</Button>
              <Button>Review blockers</Button>
            </template>
          </PageHeader>

          <div class="grid gap-4 md:grid-cols-3">
            <StatCard label="Delivery" value="84%" change="+6%" caption="Higher than last sprint." tone="positive" />
            <StatCard label="Focus time" value="18h" change="-2h" caption="Meetings expanded on Wednesday." tone="negative" />
            <StatCard label="Open decisions" value="5" change="2 urgent" caption="Resolve these before the next planning pass." />
          </div>

          <Card customClass="p-0">
            <template #content>
              <div class="space-y-4 p-6">
                <div>
                  <p class="text-sm font-medium text-slate-500">Execution plan</p>
                  <h3 class="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                    Ship the shared layout primitives before extending the dashboard.
                  </h3>
                </div>

                <div class="grid gap-3 md:grid-cols-2">
                  <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-sm font-medium text-slate-900">Today</p>
                    <p class="mt-2 text-sm leading-6 text-slate-600">
                      Finalize the layout shell, align the story states, and validate responsive spacing.
                    </p>
                  </div>
                  <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-sm font-medium text-slate-900">Next</p>
                    <p class="mt-2 text-sm leading-6 text-slate-600">
                      Replace local app-specific wrappers with the shared component once the API settles.
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <template #aside>
          <div class="space-y-6">
            <div>
              <p class="text-sm font-medium text-slate-500">Sidebar panel</p>
              <h3 class="mt-1 text-lg font-semibold text-slate-900">Context</h3>
            </div>

            <div class="rounded-2xl bg-slate-50 p-4">
              <p class="text-sm font-medium text-slate-900">Design goals</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Keep the shell reusable for dashboards, project pages, and focused task views.
              </p>
            </div>

            <div class="rounded-2xl bg-slate-50 p-4">
              <p class="text-sm font-medium text-slate-900">Responsive behavior</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                The left and right side panels collapse away below large breakpoints while main content keeps its max width.
              </p>
            </div>
          </div>
        </template>
      </AppLayout>
    `,
  }),
  args: {
    sidebarWidth: 'default',
    contentMaxWidth: '7xl',
    contentPadding: 'md',
    stickyHeader: true,
  },
} satisfies Meta<typeof AppLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WideSidebar: Story = {
  args: {
    sidebarWidth: 'wide',
    contentMaxWidth: '6xl',
  },
}
