import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import TodayView from '@/pages/TodayView.vue'
import LoginPage from '@/modules/auth/pages/LoginPage.vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ActivityListView from '@/pages/ActivityListView.vue'
import DashboardView from '@/pages/DashboardView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardView
      },
      {
        path: 'today',
        name: 'today',
        component: TodayView
      },
      {
        path: 'upcoming',
        name: 'upcoming',
        component: ActivityListView
      },
      {
        path: 'activities',
        name: 'activities',
        component: ActivityListView
      },
      {
        path: 'categories/:category',
        name: 'category',
        component: ActivityListView
      },
      {
        path: 'tags/:tag',
        name: 'tag',
        component: ActivityListView
      },
      {
        path: 'completed',
        name: 'completed',
        component: ActivityListView
      },
      {
        path: 'analytics',
        name: 'analytics',
        component: DashboardView
      },
      {
        path: 'settings',
        name: 'settings',
        component: ActivityListView
      }
    ]
  },
  {
    path: '/',
    component: AuthLayout,
    meta: { requiresGuest: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginPage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router 