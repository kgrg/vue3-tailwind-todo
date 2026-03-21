import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta = {
  title: 'Color Mode/ThemeTogglePreview',
  tags: ['autodocs'],
  render: (args) => ({
    setup: () => ({ args }),
    template: `
      <div
        class="max-w-2xl rounded-[28px] border p-6 shadow-sm"
        :class="args.mode === 'dark'
          ? 'border-slate-800 bg-slate-950 text-white'
          : 'border-amber-200 bg-amber-50 text-slate-900'"
      >
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-semibold">{{ args.title }}</p>
            <p class="mt-1 text-sm opacity-80">{{ args.description }}</p>
          </div>

          <div class="inline-flex rounded-full border p-1" :class="args.mode === 'dark' ? 'border-slate-700' : 'border-amber-300'">
            <button
              type="button"
              class="rounded-full px-3 py-1.5 text-sm font-medium"
              :class="args.mode === 'light' ? 'bg-white text-slate-900' : 'text-slate-300'"
            >
              Light
            </button>
            <button
              type="button"
              class="rounded-full px-3 py-1.5 text-sm font-medium"
              :class="args.mode === 'dark' ? 'bg-white text-slate-900' : 'text-slate-500'"
            >
              Dark
            </button>
          </div>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl p-4" :class="args.mode === 'dark' ? 'bg-white/5' : 'bg-white'">
            <p class="text-sm font-medium">Primary surface</p>
            <p class="mt-2 text-sm opacity-80">Use strong contrast to keep planning signals readable.</p>
          </div>
          <div class="rounded-2xl p-4" :class="args.mode === 'dark' ? 'bg-emerald-500/10 text-emerald-100' : 'bg-emerald-100 text-emerald-900'">
            <p class="text-sm font-medium">Success accent</p>
            <p class="mt-2 text-sm opacity-80">The preview demonstrates token intent without a global theme store.</p>
          </div>
        </div>
      </div>
    `,
  }),
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const LightMode: Story = {
  args: {
    mode: 'light',
    title: 'Warm daylight palette',
    description: 'A package-safe preview that shows how theme choices affect hierarchy and contrast.',
  },
}

export const DarkMode: Story = {
  args: {
    mode: 'dark',
    title: 'Focused evening palette',
    description: 'Dark mode stays readable by using clear surfaces and strong text contrast.',
  },
}