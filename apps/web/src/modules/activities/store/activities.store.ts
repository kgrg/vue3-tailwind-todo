import { defineStore } from 'pinia'
import type { Activity, NewActivityForm } from '../types/activity.types'

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Morning Standup',
    description: 'Daily team sync meeting',
    category: 'Work',
    date: '2024-03-20',
    time: '09:00',
    location: 'Zoom',
    status: 'completed',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Gym Session',
    description: 'Upper body workout',
    category: 'Health',
    date: '2024-03-20',
    time: '18:00',
    location: 'Fitness Center',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Project Planning',
    description: 'Plan next sprint tasks',
    category: 'Work',
    date: '2024-03-21',
    time: '14:00',
    location: 'Office',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Read Book',
    description: 'Read Clean Code chapter 3',
    category: 'Learning',
    date: '2024-03-21',
    time: '20:00',
    location: 'Home',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Team Lunch',
    description: 'Team building lunch',
    category: 'Work',
    date: '2024-03-22',
    time: '12:30',
    location: 'Restaurant',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
]

export const useActivityStore = defineStore('activities', {
  state: () => ({
    activities: mockActivities,
    loading: false,
    error: null as string | null
  }),

  getters: {
    getActivitiesByDate: (state) => (date: string) => {
      return state.activities.filter(activity => activity.date === date)
    },
    getActivitiesByCategory: (state) => (category: string) => {
      return state.activities.filter(activity => activity.category === category)
    },
    getActivityStats: (state) => {
      const stats = {
        total: state.activities.length,
        completed: state.activities.filter(a => a.status === 'completed').length,
        pending: state.activities.filter(a => a.status === 'pending').length,
        byCategory: {} as Record<string, number>
      }

      state.activities.forEach(activity => {
        stats.byCategory[activity.category] = (stats.byCategory[activity.category] || 0) + 1
      })

      return stats
    }
  },

  actions: {
    addActivity(activity: NewActivityForm) {
      const newActivity: Activity = {
        id: Date.now().toString(),
        ...activity,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      this.activities.push(newActivity)
    },

    updateActivityStatus(id: string, status: 'completed' | 'pending') {
      const activity = this.activities.find(a => a.id === id)
      if (activity) {
        activity.status = status
      }
    },

    deleteActivity(id: string) {
      this.activities = this.activities.filter(a => a.id !== id)
    }
  }
}) 