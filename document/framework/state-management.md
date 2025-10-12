# State Management

## Overview

This guide covers state management patterns using Pinia for Vue 3 applications. We follow a modern, modular architecture with clear separation between state, getters, and actions using the Composition API.

## Guiding Principles

1. **Single Source of Truth**: All application state lives in Pinia stores
2. **Reactivity**: State is reactive and automatically updates components
3. **Predictability**: State changes follow a clear, traceable flow
4. **Modularity**: Stores are organized into feature-based modules
5. **Type Safety**: Leverage TypeScript for type-safe state management
6. **Composition API**: Use modern Vue 3 patterns throughout

## Store Structure

### Basic Module Structure

Each Pinia store follows this structure:

```bash
src/modules/[module-name]/
  ├── store/
  │   └── [module].store.ts    # Pinia store definition
  ├── types/
  │   └── index.ts             # TypeScript type definitions
  ├── components/              # Module-specific components
  └── pages/                   # Module-specific pages (optional)
```

## Pinia Store Patterns

### 1. Store Definition

Pinia stores use the `defineStore` function with either Options API or Composition API patterns.

**File**: `src/modules/auth/store/auth.store.ts`

```typescript
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
    currentUser: (state): User | null => state.user,
    isLoggedIn: (state): boolean => state.isAuthenticated
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      try {
        // API call logic here
        this.user = { /* user data */ }
        this.isAuthenticated = true
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.user = null
      this.isAuthenticated = false
    }
  }
})
```

**Naming Convention**:
- Use `camelCase` for store names
- Use `use` prefix for store composables: `useAuthStore`
- Use descriptive action names: `login`, `logout`, `updateProfile`

### 2. State Definition

State holds the actual data for the store.

**File**: `src/modules/auth/types/index.ts`

```typescript
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}
```

**Best Practices**:
- Define state interface with TypeScript
- Use factory function `(): StateType => ({})` to ensure fresh state
- Initialize with sensible defaults
- Consider persisted state (localStorage/sessionStorage)
- Keep state flat and normalized

### 3. Getters

Getters are computed properties for the store.

**File**: `src/modules/auth/store/auth.store.ts`

```typescript
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    currentUser: (state): User | null => state.user,
    
    isLoggedIn: (state): boolean => state.isAuthenticated,
    
    userFullName: (state): string => {
      if (!state.user) return ''
      return state.user.name
    },
    
    hasRole: (state) => (role: string) => {
      return state.user?.roles?.includes(role) ?? false
    },
    
    isLoading: (state): boolean => state.loading
  },

  actions: {
    // ... actions
  }
})
```

**Best Practices**:
- Use getters for derived state
- Define getter return types
- Avoid complex computations in getters
- Use getters that return functions for parameterized queries
- Leverage TypeScript for type safety

### 4. Actions

Actions contain business logic and can be asynchronous. They directly modify state.

**File**: `src/modules/auth/store/auth.store.ts`

```typescript
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    // ... getters
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      try {
        // API call logic here
        const response = await authService.login(credentials)
        this.user = response.user
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
        await authService.logout()
        this.user = null
        this.isAuthenticated = false
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Logout failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    setUser(user: User | null) {
      this.user = user
      this.isAuthenticated = !!user
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    }
  }
})
```

**Best Practices**:
- Actions can be asynchronous
- Directly modify state using `this`
- Handle errors with try/catch
- Set loading states appropriately
- Use TypeScript for parameter types

### 5. Composition API Store Pattern

For more complex stores, you can use the Composition API pattern with `defineStore`.

**File**: `src/stores/todoStore.js`

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTodoStore = defineStore('todo', () => {
  // State
  const todos = ref([])
  const lists = ref([
    { id: 'default', name: 'Tasks', icon: '📝' },
    { id: 'important', name: 'Important', icon: '⭐' },
    { id: 'planned', name: 'Planned', icon: '📅' },
  ])
  const activeList = ref('default')

  // Getters (computed)
  const filteredTodos = computed(() => {
    if (activeList.value === 'important') {
      return todos.value.filter(todo => todo.important)
    }
    if (activeList.value === 'planned') {
      return todos.value.filter(todo => todo.dueDate)
    }
    return todos.value.filter(todo => todo.listId === activeList.value)
  })

  // Actions
  const addTodo = (todo) => {
    todos.value.push({
      id: Date.now(),
      title: todo.title,
      completed: false,
      important: false,
      dueDate: todo.dueDate || null,
      notes: todo.notes || '',
      listId: todo.listId || activeList.value,
      createdAt: new Date().toISOString(),
    })
  }

  const toggleTodo = (id) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  const deleteTodo = (id) => {
    todos.value = todos.value.filter(t => t.id !== id)
  }

  const setActiveList = (listId) => {
    activeList.value = listId
  }

  return {
    // State
    todos,
    lists,
    activeList,
    // Getters
    filteredTodos,
    // Actions
    addTodo,
    toggleTodo,
    deleteTodo,
    setActiveList,
  }
})
```

**Best Practices**:
- Use `ref()` for reactive state
- Use `computed()` for derived state
- Return state, getters, and actions from the store
- Use TypeScript for better type safety
- Keep actions simple and focused

## Store Configuration

### Pinia Setup

**File**: `src/main.ts`

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

### Store Registration

Pinia stores are automatically registered when imported. No manual registration needed.

**File**: `src/modules/auth/store/auth.store.ts`

```typescript
import { defineStore } from 'pinia'
import type { AuthState, LoginCredentials, User } from '../types'

export const useAuthStore = defineStore('auth', {
  // Store definition
})
```

### Type Safety

**File**: `src/modules/auth/types/index.ts`

```typescript
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}
```

## Usage in Components

### Composition API (Recommended)

```vue
<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useTodoStore } from '@/stores/todoStore'

const authStore = useAuthStore()
const todoStore = useTodoStore()

// State access
const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Getter access
const userFullName = computed(() => authStore.userFullName)

// Action dispatch
const login = async (credentials: LoginCredentials) => {
  try {
    await authStore.login(credentials)
    // Handle success
  } catch (error) {
    // Handle error
  }
}

const logout = () => {
  authStore.logout()
}

// Todo store usage
const addTodo = (todo) => {
  todoStore.addTodo(todo)
}
</script>
```

### Using Composables (Better Abstraction)

```typescript
// src/composables/useAuth.ts
import { computed } from 'vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { LoginCredentials, RegisterData } from '@/modules/auth/types'

export function useAuth() {
  const authStore = useAuthStore()

  // State
  const user = computed(() => authStore.user)
  const isLoading = computed(() => authStore.loading)
  const error = computed(() => authStore.error)

  // Getters
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const userFullName = computed(() => authStore.userFullName)
  
  const hasRole = (role: string) => {
    return authStore.hasRole(role)
  }

  // Actions
  const login = async (credentials: LoginCredentials) => {
    await authStore.login(credentials)
  }

  const register = async (data: RegisterData) => {
    await authStore.register(data)
  }

  const logout = async () => {
    await authStore.logout()
  }

  const fetchCurrentUser = async () => {
    await authStore.fetchCurrentUser()
  }

  return {
    // State
    user,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    userFullName,
    hasRole,
    
    // Actions
    login,
    register,
    logout,
    fetchCurrentUser
  }
}
```

**Usage in Component**:

```vue
<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { user, isAuthenticated, login, logout } = useAuth()

const handleLogin = async () => {
  try {
    await login({ email: 'user@example.com', password: 'password' })
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<template>
  <div>
    <div v-if="isAuthenticated">
      <p>Welcome, {{ user?.name }}!</p>
      <button @click="logout">Logout</button>
    </div>
    <div v-else>
      <button @click="handleLogin">Login</button>
    </div>
  </div>
</template>
```

## Common Module Examples

### Log Module

Used for centralized logging throughout the application.

```typescript
// src/store/modules/log/mutation-types.ts
export const ADD_LOG = 'log/ADD_LOG'
export const CLEAR_LOGS = 'log/CLEAR_LOGS'

// src/store/modules/log/state.ts
export interface LogEntry {
  id: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: Date
  context?: Record<string, any>
}

export interface LogState {
  logs: LogEntry[]
  maxLogs: number
}

export const state = (): LogState => ({
  logs: [],
  maxLogs: 100
})

// src/store/modules/log/actions.ts
export const actions = {
  info({ commit }, message: string, context?: Record<string, any>) {
    commit(types.ADD_LOG, { level: 'info', message, context })
    console.info(message, context)
  },
  
  warn({ commit }, message: string, context?: Record<string, any>) {
    commit(types.ADD_LOG, { level: 'warn', message, context })
    console.warn(message, context)
  },
  
  error({ commit }, message: string, context?: Record<string, any>) {
    commit(types.ADD_LOG, { level: 'error', message, context })
    console.error(message, context)
  }
}
```

## Best Practices Summary

### DO ✅

- Use TypeScript for type safety
- Use composables for store access
- Handle errors in actions
- Use getters for derived state
- Follow the module structure
- Use `ref()` and `computed()` in Composition API stores
- Keep actions simple and focused
- Use proper naming conventions

### DON'T ❌

- Mutate state directly in components
- Create circular dependencies between stores
- Duplicate state across stores
- Use magic strings for store names
- Expose store internals to components
- Store component-local state in Pinia
- Mix Options API and Composition API patterns unnecessarily

## Testing Store Modules

```typescript
// src/modules/auth/store/auth.store.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './auth.store'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('State', () => {
    it('should initialize with default state', () => {
      const authStore = useAuthStore()
      
      expect(authStore.user).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.loading).toBe(false)
      expect(authStore.error).toBeNull()
    })
  })

  describe('Getters', () => {
    it('userFullName should return user name', () => {
      const authStore = useAuthStore()
      authStore.setUser({ id: '1', email: 'test@example.com', name: 'John Doe' })
      
      expect(authStore.userFullName).toBe('John Doe')
    })

    it('isLoggedIn should return authentication status', () => {
      const authStore = useAuthStore()
      authStore.setUser({ id: '1', email: 'test@example.com', name: 'John Doe' })
      
      expect(authStore.isLoggedIn).toBe(true)
    })
  })

  describe('Actions', () => {
    it('login should authenticate user', async () => {
      const authStore = useAuthStore()
      const credentials = { email: 'test@example.com', password: 'password' }
      
      // Mock the API call
      vi.spyOn(authService, 'login').mockResolvedValue({
        user: { id: '1', email: 'test@example.com', name: 'John Doe' }
      })
      
      await authStore.login(credentials)
      
      expect(authStore.isAuthenticated).toBe(true)
      expect(authStore.user).toEqual({ id: '1', email: 'test@example.com', name: 'John Doe' })
    })

    it('logout should clear user data', async () => {
      const authStore = useAuthStore()
      authStore.setUser({ id: '1', email: 'test@example.com', name: 'John Doe' })
      
      await authStore.logout()
      
      expect(authStore.user).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
    })
  })
})
```

---

[← Back to File Structure](./file-structure.md) | [Next: Routing →](./routing.md)

