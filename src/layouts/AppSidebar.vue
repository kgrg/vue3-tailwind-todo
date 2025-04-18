<template>
  <div>
    <!-- Mobile Menu Button -->
    <button 
      @click="isOpen = !isOpen"
      class="lg:hidden fixed top-3 left-3 z-20 p-2 rounded-md bg-white shadow-lg border border-gray-100"
      aria-label="Toggle menu"
    >
      <Bars3Icon v-if="!isOpen" class="w-6 h-6 text-gray-600" />
      <XMarkIcon v-else class="w-6 h-6 text-gray-600" />
    </button>

    <!-- Overlay -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity lg:hidden z-10"
      @click="isOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex flex-col h-full p-4 pt-16 lg:pt-4 space-y-6">
        <!-- Top Navigation -->
        <nav class="space-y-1">
          <NavItem 
            v-for="item in topNavItems" 
            :key="item.path"
            :to="item.path"
            :icon="item.icon"
            :label="item.label"
            :active="isActive(item.path)"
            @click="closeMobileMenu"
          />
        </nav>

        <!-- Lists Section -->
        <div>
          <h3 class="text-sm font-semibold text-gray-500 px-3 mb-2">Lists</h3>
          <nav class="space-y-1">
            <NavItem 
              v-for="item in listItems" 
              :key="item.path"
              :to="item.path"
              :icon="item.icon"
              :label="item.label"
              :active="isActive(item.path)"
              @click="closeMobileMenu"
            />
          </nav>
        </div>

        <!-- Tags Section -->
        <div>
          <h3 class="text-sm font-semibold text-gray-500 px-3 mb-2">Tags</h3>
          <nav class="space-y-1">
            <NavItem 
              v-for="item in tagItems" 
              :key="item.path"
              :to="item.path"
              :icon="item.icon"
              :label="item.label"
              :active="isActive(item.path)"
              :color="item.color"
              @click="closeMobileMenu"
            />
          </nav>
        </div>

        <!-- Bottom Navigation -->
        <div class="mt-auto space-y-1">
          <NavItem 
            v-for="item in bottomNavItems" 
            :key="item.path"
            :to="item.path"
            :icon="item.icon"
            :label="item.label"
            :active="isActive(item.path)"
            @click="closeMobileMenu"
          />
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import NavItem from '@/core/components/NavItem.vue'
import { 
  HomeIcon,
  CalendarDaysIcon, 
  ClockIcon,
  InboxIcon,
  BriefcaseIcon,
  UserGroupIcon,
  BookOpenIcon,
  RocketLaunchIcon,
  TagIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const isOpen = ref(false)

const closeMobileMenu = () => {
  isOpen.value = false
}

const isActive = (path: string): boolean => {
  return route?.path === path
}

const topNavItems = [
  {
    path: '/',
    label: 'All day',
    icon: HomeIcon
  },
  {
    path: '/today',
    label: 'Today',
    icon: CalendarDaysIcon
  },
  {
    path: '/activities',
    label: 'Activities',
    icon: ClipboardDocumentListIcon
  },
  {
    path: '/tomorrow',
    label: 'Tomorrow',
    icon: ClockIcon
  },
  {
    path: '/next7days',
    label: 'Next 7 days',
    icon: CalendarDaysIcon
  },
  {
    path: '/inbox',
    label: 'Inbox',
    icon: InboxIcon
  }
]

const listItems = [
  {
    path: '/work',
    label: 'Work',
    icon: BriefcaseIcon
  },
  {
    path: '/freelance',
    label: 'Freelance',
    icon: UserGroupIcon
  },
  {
    path: '/workout',
    label: 'Workout',
    icon: RocketLaunchIcon
  },
  {
    path: '/learning',
    label: 'Learning',
    icon: BookOpenIcon
  },
  {
    path: '/reading',
    label: 'Reading',
    icon: BookOpenIcon
  }
]

const tagItems = [
  {
    path: '/tags/work',
    label: 'work',
    icon: TagIcon,
    color: 'gray'
  },
  {
    path: '/tags/uxresearch',
    label: 'uxresearch',
    icon: TagIcon,
    color: 'blue'
  },
  {
    path: '/tags/inspiration',
    label: 'inspiration',
    icon: TagIcon,
    color: 'pink'
  },
  {
    path: '/tags/meeting',
    label: 'meeting',
    icon: TagIcon,
    color: 'purple'
  },
  {
    path: '/tags/designteam',
    label: 'designteam',
    icon: TagIcon,
    color: 'green'
  }
]

const bottomNavItems = [
  {
    path: '/completed',
    label: 'Completed',
    icon: ArchiveBoxIcon
  },
  {
    path: '/trash',
    label: 'Trash',
    icon: ArchiveBoxIcon
  },
  {
    path: '/summary',
    label: 'Summary',
    icon: ChartBarIcon
  }
]
</script> 