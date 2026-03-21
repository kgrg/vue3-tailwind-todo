import type { Meta, StoryObj } from '@storybook/vue3-vite'

const locales = {
  en: {
    label: 'English',
    headline: 'Today looks realistic',
    body: 'You kept the plan small enough to finish without carrying hidden overflow into the evening.',
  },
  fr: {
    label: 'Francais',
    headline: 'Le plan du jour reste realiste',
    body: 'Vous avez garde un nombre raisonnable de taches pour terminer sans surcharge cachee.',
  },
} as const

const meta = {
  title: 'i18n/LocaleSwitcherPreview',
  tags: ['autodocs'],
  render: (args) => ({
    setup: () => ({ args, locales }),
    template: `
      <div class="max-w-xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-slate-900">Locale switcher preview</p>
            <p class="text-xs text-slate-500">Static copy only, no localization runtime required.</p>
          </div>

          <div class="inline-flex rounded-full bg-slate-100 p-1">
            <button
              v-for="(locale, key) in locales"
              :key="key"
              type="button"
              class="rounded-full px-3 py-1.5 text-sm font-medium"
              :class="args.locale === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'"
            >
              {{ locale.label }}
            </button>
          </div>
        </div>

        <div class="mt-6 rounded-2xl bg-slate-50 p-4">
          <p class="text-lg font-semibold text-slate-900">{{ locales[args.locale].headline }}</p>
          <p class="mt-2 text-sm leading-6 text-slate-600">{{ locales[args.locale].body }}</p>
        </div>
      </div>
    `,
  }),
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const EnglishSelected: Story = {
  args: {
    locale: 'en',
  },
}

export const FrenchSelected: Story = {
  args: {
    locale: 'fr',
  },
}