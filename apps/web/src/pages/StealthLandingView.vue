<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const heroVisible = ref(false)
const gridVisible = ref(false)
const demoVisible = ref(false)
const statsVisible = ref(false)
const ctaVisible = ref(false)

// Animated planner demo state
const demoStep = ref(0)
const demoInterval = ref<ReturnType<typeof setInterval>>()

const demoTasks = [
  { label: 'Review Q2 roadmap', energy: 'High', time: '45m', done: false },
  { label: 'Reply to design feedback', energy: 'Medium', time: '15m', done: false },
  { label: 'Update sprint board', energy: 'Low', time: '10m', done: false },
  { label: 'Draft launch email', energy: 'High', time: '30m', done: false },
]

const visibleTasks = ref<typeof demoTasks>([])
const checkedTasks = ref<Set<number>>(new Set())
const aiHint = ref('')

onMounted(() => {
  setTimeout(() => (heroVisible.value = true), 200)
  setTimeout(() => (gridVisible.value = true), 800)
  setTimeout(() => (demoVisible.value = true), 1200)
  setTimeout(() => (statsVisible.value = true), 1600)
  setTimeout(() => (ctaVisible.value = true), 2000)

  // Start planner demo animation loop
  setTimeout(() => startDemoLoop(), 2400)
})

onUnmounted(() => {
  if (demoInterval.value) clearInterval(demoInterval.value)
})

function startDemoLoop() {
  // Reset
  visibleTasks.value = []
  checkedTasks.value = new Set()
  aiHint.value = ''
  demoStep.value = 0

  const steps = [
    // Tasks appear one by one
    () => { visibleTasks.value = [demoTasks[0]] },
    () => { visibleTasks.value = [demoTasks[0], demoTasks[1]] },
    () => { visibleTasks.value = [demoTasks[0], demoTasks[1], demoTasks[2]] },
    () => { visibleTasks.value = [demoTasks[0], demoTasks[1], demoTasks[2], demoTasks[3]] },
    // AI hint appears
    () => { aiHint.value = 'Start with "Review Q2 roadmap" — your energy peaks in the morning.' },
    // Tasks get checked off
    () => { checkedTasks.value = new Set([0]) },
    () => { checkedTasks.value = new Set([0, 1]) },
    () => { aiHint.value = 'Great pace. "Draft launch email" needs focus — save it for after break.' },
    () => { checkedTasks.value = new Set([0, 1, 2]) },
    // Pause, then restart
    () => {},
    () => {
      visibleTasks.value = []
      checkedTasks.value = new Set()
      aiHint.value = ''
    },
  ]

  let i = 0
  demoInterval.value = setInterval(() => {
    if (i < steps.length) {
      steps[i]()
      i++
    } else {
      i = 0
      visibleTasks.value = []
      checkedTasks.value = new Set()
      aiHint.value = ''
    }
  }, 1200)
}
</script>

<template>
  <div class="relative min-h-screen bg-white text-gray-900">
    <!-- Main content -->
    <main class="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:py-24">

      <!-- HERO -->
      <section
        class="text-center transition-all duration-1000 ease-out"
        :class="heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <div class="mb-6 flex items-center justify-center gap-3">
          <div class="relative flex h-12 w-12 items-center justify-center">
            <div class="absolute inset-0 rounded-xl bg-teal-50"></div>
            <svg
              class="relative h-8 w-8 text-teal-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
            <span class="text-gray-900">Focus</span><span class="text-teal-600">OS</span>
          </h1>
        </div>

        <p class="mx-auto max-w-xl text-xl leading-relaxed text-gray-600 sm:text-2xl">
          Your to-do app helps you <span class="text-gray-900 font-semibold">store</span> tasks.<br />
          We help you <span class="text-teal-600 font-semibold">actually do them</span>.
        </p>
        <p class="mx-auto mt-5 max-w-lg text-base text-gray-500">
          AI-powered daily planning that understands your energy, detects when you're stuck, and explains every recommendation.
        </p>

        <div class="mt-6 flex items-center justify-center gap-2">
          <span class="inline-block h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
          <span class="text-xs font-medium tracking-widest text-gray-400 uppercase">Building in stealth</span>
        </div>
      </section>

      <!-- FEATURE GRID — 2×2 cards -->
      <section
        class="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-2 transition-all duration-1000 ease-out"
        :class="gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
        aria-label="Features"
      >
        <!-- Card 1 -->
        <div class="flex flex-col gap-2 bg-white p-6 sm:p-8">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
            <svg class="h-5 w-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-gray-900">Explainable AI</h3>
          <p class="text-sm leading-relaxed text-gray-500">Every recommendation shows its reasoning. No black-box decisions — you stay in control of your day.</p>
        </div>

        <!-- Card 2 -->
        <div class="flex flex-col gap-2 bg-white p-6 sm:p-8">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <svg class="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-gray-900">Energy-Aware Planning</h3>
          <p class="text-sm leading-relaxed text-gray-500">Schedules demanding work when your energy is highest and saves routine tasks for the afternoon dip.</p>
        </div>

        <!-- Card 3 -->
        <div class="flex flex-col gap-2 bg-white p-6 sm:p-8">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <svg class="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-gray-900">Behavioral Intelligence</h3>
          <p class="text-sm leading-relaxed text-gray-500">Detects when you procrastinate, over-plan, or burn out — and suggests course corrections before you stall.</p>
        </div>

        <!-- Card 4 -->
        <div class="flex flex-col gap-2 bg-white p-6 sm:p-8">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <svg class="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-gray-900">Actionable Reflection</h3>
          <p class="text-sm leading-relaxed text-gray-500">End-of-day reviews that surface patterns, not guilt. See what worked and carry forward what matters.</p>
        </div>
      </section>

      <!-- ANIMATED PRODUCT DEMO -->
      <section
        class="mt-20 transition-all duration-1000 ease-out"
        :class="demoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
      >
        <h2 class="mb-2 text-center text-xs font-medium tracking-widest text-gray-400 uppercase">How it works</h2>
        <p class="mb-8 text-center text-lg font-semibold text-gray-900">Your AI plans the day. You execute.</p>

        <div class="mx-auto max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <!-- Mock app header -->
          <div class="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <span class="text-sm font-semibold text-gray-900">Today's Plan</span>
            </div>
            <span class="text-xs text-gray-400">Thursday, Mar 20</span>
          </div>

          <!-- Task list -->
          <div class="min-h-[220px] p-4">
            <TransitionGroup name="task-list" tag="div" class="flex flex-col gap-2">
              <div
                v-for="(task, i) in visibleTasks"
                :key="task.label"
                class="flex items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-300"
                :class="checkedTasks.has(i)
                  ? 'border-gray-100 bg-gray-50'
                  : 'border-gray-200 bg-white'"
              >
                <!-- Checkbox -->
                <div
                  class="flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors duration-300"
                  :class="checkedTasks.has(i)
                    ? 'border-teal-500 bg-teal-500'
                    : 'border-gray-300'"
                  aria-hidden="true"
                >
                  <svg v-if="checkedTasks.has(i)" class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>

                <!-- Task info -->
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm transition-all duration-300"
                    :class="checkedTasks.has(i) ? 'text-gray-400 line-through' : 'text-gray-800'"
                  >{{ task.label }}</p>
                </div>

                <!-- Meta -->
                <div class="flex shrink-0 items-center gap-2">
                  <span class="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">{{ task.time }}</span>
                  <span
                    class="rounded px-1.5 py-0.5 text-xs"
                    :class="{
                      'bg-teal-50 text-teal-700': task.energy === 'High',
                      'bg-gray-100 text-gray-600': task.energy === 'Medium',
                      'bg-gray-50 text-gray-500': task.energy === 'Low',
                    }"
                  >{{ task.energy }}</span>
                </div>
              </div>
            </TransitionGroup>

            <!-- Empty state before tasks load -->
            <div v-if="visibleTasks.length === 0" class="flex h-[180px] items-center justify-center">
              <div class="flex flex-col items-center gap-2 text-gray-300">
                <svg class="h-8 w-8 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <span class="text-xs">AI is planning your day…</span>
              </div>
            </div>
          </div>

          <!-- AI hint bar -->
          <Transition name="hint-fade">
            <div
              v-if="aiHint"
              class="border-t border-teal-100 bg-teal-50 px-5 py-3"
            >
              <div class="flex items-start gap-2">
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <p class="text-xs leading-relaxed text-teal-800">{{ aiHint }}</p>
              </div>
            </div>
          </Transition>
        </div>
      </section>

      <!-- STATS GRID -->
      <section
        class="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-4 transition-all duration-1000 ease-out"
        :class="statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
        aria-label="Industry statistics"
      >
        <div class="bg-white p-6 text-center">
          <p class="text-2xl font-bold text-gray-900">80%</p>
          <p class="mt-1 text-xs text-gray-500">feel productivity anxiety</p>
        </div>
        <div class="bg-white p-6 text-center">
          <p class="text-2xl font-bold text-gray-900">66%</p>
          <p class="mt-1 text-xs text-gray-500">burnout rate (all-time high)</p>
        </div>
        <div class="bg-white p-6 text-center">
          <p class="text-2xl font-bold text-gray-900">2h 23m</p>
          <p class="mt-1 text-xs text-gray-500">avg productive time / day</p>
        </div>
        <div class="bg-white p-6 text-center">
          <p class="text-2xl font-bold text-gray-900">23 min</p>
          <p class="mt-1 text-xs text-gray-500">to refocus after interruption</p>
        </div>
      </section>

      <!-- CTA -->
      <section
        class="mt-20 text-center transition-all duration-1000 ease-out"
        :class="ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <p class="text-sm text-gray-500">Something better is coming.</p>
        <div class="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-6 py-3">
          <span class="relative flex h-2.5 w-2.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-75"></span>
            <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-600"></span>
          </span>
          <span class="text-sm font-medium text-gray-600">Building in stealth</span>
        </div>
      </section>

      <!-- Footer -->
      <footer class="mt-20 mb-8 text-center text-xs text-gray-400">
        <p>&copy; 2026 FocusOS &middot; Rethinking how you plan your day</p>
      </footer>
    </main>
  </div>
</template>

<style scoped>
/* Task list enter/leave transitions */
.task-list-enter-active {
  transition: all 0.4s ease-out;
}
.task-list-leave-active {
  transition: all 0.3s ease-in;
}
.task-list-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.task-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.task-list-move {
  transition: transform 0.3s ease;
}

/* AI hint bar transition */
.hint-fade-enter-active {
  transition: all 0.4s ease-out;
}
.hint-fade-leave-active {
  transition: all 0.3s ease-in;
}
.hint-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.hint-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
