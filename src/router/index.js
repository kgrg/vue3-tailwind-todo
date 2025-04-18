import { createRouter, createWebHistory } from 'vue-router'
import TodayView from '@/views/TodayView.vue'

const routes = [
  {
    path: '/',
    name: 'all-day',
    component: TodayView
  },
  {
    path: '/today',
    name: 'today',
    component: TodayView
  },
  {
    path: '/tomorrow',
    name: 'tomorrow',
    component: TodayView
  },
  {
    path: '/next7days',
    name: 'next7days',
    component: TodayView
  },
  {
    path: '/inbox',
    name: 'inbox',
    component: TodayView
  },
  {
    path: '/work',
    name: 'work',
    component: TodayView
  },
  {
    path: '/freelance',
    name: 'freelance',
    component: TodayView
  },
  {
    path: '/workout',
    name: 'workout',
    component: TodayView
  },
  {
    path: '/learning',
    name: 'learning',
    component: TodayView
  },
  {
    path: '/reading',
    name: 'reading',
    component: TodayView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 