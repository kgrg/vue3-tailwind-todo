import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '@/modules/todo/views/HomePage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
