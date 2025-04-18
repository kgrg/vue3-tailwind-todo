import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import TodayView from '@/views/TodayView.vue'
import LoginPage from '@/modules/auth/pages/LoginPage.vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'all-day',
        component: TodayView
      },
      {
        path: 'today',
        name: 'today',
        component: TodayView
      },
      {
        path: 'tomorrow',
        name: 'tomorrow',
        component: TodayView
      },
      {
        path: 'next7days',
        name: 'next7days',
        component: TodayView
      },
      {
        path: 'inbox',
        name: 'inbox',
        component: TodayView
      },
      {
        path: 'work',
        name: 'work',
        component: TodayView
      },
      {
        path: 'freelance',
        name: 'freelance',
        component: TodayView
      },
      {
        path: 'workout',
        name: 'workout',
        component: TodayView
      },
      {
        path: 'learning',
        name: 'learning',
        component: TodayView
      },
      {
        path: 'reading',
        name: 'reading',
        component: TodayView
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