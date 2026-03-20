<template>
  <div>
    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out mt-0 lg:mt-0 lg:translate-x-0 lg:static lg:z-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Mobile Menu Button (only when sidebar is closed) -->
      <button 
        v-if="!isOpen"
        @click="$emit('close-sidebar')"
        class="lg:hidden absolute top-3 left-3 z-40 p-2 rounded-md bg-white shadow-lg border border-gray-100"
        aria-label="Open menu"
      >
        <Bars3Icon class="w-6 h-6 text-gray-600" />
      </button>
      <!-- Close Button (only when sidebar is open) -->
      <button 
        v-if="isOpen"
        @click="$emit('close-sidebar')"
        class="lg:hidden absolute top-3 left-3 z-40 p-2 rounded-md bg-white shadow-lg border border-gray-100"
        aria-label="Close menu"
      >
        <XMarkIcon class="w-6 h-6 text-gray-600" />
      </button>
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
            @click="() => $emit('close-sidebar')"
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
              @click="() => $emit('close-sidebar')"
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
              @click="() => $emit('close-sidebar')"
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
            @click="() => $emit('close-sidebar')"
          />
        </div>
      </div>
    </aside>
    <!-- Overlay -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity lg:hidden z-20"
      @click="$emit('close-sidebar')"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
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

const props = defineProps<{ isOpen: boolean }>()
defineEmits(['close-sidebar'])

const route = useRoute()

const isActive = (path: string): boolean => {
  return route?.path === path
}

const topNavItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: HomeIcon
  },
  {
    path: '/today',
    label: 'Today',
    icon: CalendarDaysIcon
  },
  {
    path: '/upcoming',
    label: 'Upcoming',
    icon: ClockIcon
  },
  {
    path: '/activities',
    label: 'All Activities',
    icon: ClipboardDocumentListIcon
  }
]

const listItems = [
  {
    path: '/categories/work',
    label: 'Work',
    icon: BriefcaseIcon
  },
  {
    path: '/categories/personal',
    label: 'Personal',
    icon: UserIcon
  },
  {
    path: '/categories/health',
    label: 'Health & Fitness',
    icon: RocketLaunchIcon
  },
  {
    path: '/categories/learning',
    label: 'Learning',
    icon: BookOpenIcon
  }
]

const tagItems = [
  {
    path: '/tags/priority',
    label: 'Priority',
    icon: TagIcon,
    color: 'red'
  },
  {
    path: '/tags/meeting',
    label: 'Meetings',
    icon: TagIcon,
    color: 'blue'
  },
  {
    path: '/tags/deadline',
    label: 'Deadlines',
    icon: TagIcon,
    color: 'purple'
  },
  {
    path: '/tags/errand',
    label: 'Errands',
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
    path: '/analytics',
    label: 'Analytics',
    icon: ChartBarIcon
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Cog6ToothIcon
  }
]
</script> 