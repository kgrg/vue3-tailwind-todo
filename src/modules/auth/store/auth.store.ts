import { defineStore } from 'pinia'
import type { AuthState, LoginCredentials, User } from '../types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    currentUser: (state): User | null => state.user
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual API call
        // Mock successful login
        this.user = {
          id: '1',
          email: credentials.email,
          name: 'John Doe',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe'
        }
        this.isAuthenticated = true
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        // TODO: Implement actual API call
        this.user = null
        this.isAuthenticated = false
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Logout failed'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 