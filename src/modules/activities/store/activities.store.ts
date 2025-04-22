import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Activity, NewActivityForm } from '../types/activity.types'
import { v4 as uuidv4 } from 'uuid'

export const useActivityStore = defineStore('activities', () => {
  const activities = ref<Activity[]>([])

  const addActivity = (newActivity: NewActivityForm) => {
    const activity: Activity = {
      ...newActivity,
      id: uuidv4(),
      completed: false
    }
    activities.value.push(activity)
  }

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    const index = activities.value.findIndex(a => a.id === id)
    if (index !== -1) {
      activities.value[index] = { ...activities.value[index], ...updates }
    }
  }

  const deleteActivity = (id: string) => {
    activities.value = activities.value.filter(a => a.id !== id)
  }

  const todayActivities = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return activities.value.filter(activity => activity.date === today)
  })

  return {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    todayActivities
  }
}) 