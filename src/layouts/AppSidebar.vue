<template>
  <aside class="w-64 bg-white border-r border-gray-100 p-4">
    <div class="flex flex-col h-full space-y-6">
      <!-- Top Navigation -->
      <nav class="space-y-1">
        <NavItem 
          v-for="item in topNavItems" 
          :key="item.path"
          :to="item.path"
          :icon="item.icon"
          :label="item.label"
          :active="isActive(item.path)"
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
        />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
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
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()

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