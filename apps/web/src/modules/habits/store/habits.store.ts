import { defineStore } from 'pinia'
import type { Habit, HabitState } from '../types'

export const useHabitStore = defineStore('habits', {
  state: (): HabitState => ({
    habits: [
      {
        id: 1,
        title: 'Observing',
        image: 'habit_observing.png',
        startTime: '07:00',
        endTime: '07:30'
      },
      {
        id: 2,
        title: 'Cooking',
        image: 'habit_cooking.png',
        startTime: '09:00',
        endTime: '10:00'
      },
      {
        id: 3,
        title: 'Self Caring',
        image: 'habit_selfcaring.png',
        startTime: '11:00',
        endTime: '12:00'
      },
      {
        id: 4,
        title: 'Singing',
        image: 'habit_singing.png',
        startTime: '14:00',
        endTime: '14:30'
      },
      {
        id: 5,
        title: 'Reading',
        image: 'habit_reading.png',
        startTime: '16:00',
        endTime: '17:30'
      }
    ],
    loading: false,
    error: null
  }),

  getters: {
    getHabitById: (state) => (id: number) => {
      return state.habits.find(habit => habit.id === id)
    },
    sortedHabits: (state) => {
      return [...state.habits].sort((a, b) => {
        return a.startTime.localeCompare(b.startTime)
      })
    }
  },

  actions: {
    async fetchHabits() {
      this.loading = true
      try {
        // TODO: Implement API call
        this.loading = false
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
        this.loading = false
      }
    },

    async addHabit(habit: Omit<Habit, 'id'>) {
      this.loading = true
      try {
        // TODO: Implement API call
        const newHabit = {
          ...habit,
          id: Math.max(...this.habits.map(h => h.id)) + 1
        }
        this.habits.push(newHabit)
        this.loading = false
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
        this.loading = false
      }
    },

    async updateHabit(id: number, updates: Partial<Habit>) {
      this.loading = true
      try {
        // TODO: Implement API call
        const index = this.habits.findIndex(h => h.id === id)
        if (index !== -1) {
          this.habits[index] = { ...this.habits[index], ...updates }
        }
        this.loading = false
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
        this.loading = false
      }
    },

    async deleteHabit(id: number) {
      this.loading = true
      try {
        // TODO: Implement API call
        this.habits = this.habits.filter(h => h.id !== id)
        this.loading = false
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
        this.loading = false
      }
    }
  }
}) 