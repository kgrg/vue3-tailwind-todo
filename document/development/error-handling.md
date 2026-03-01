# Error Handling

## Overview

Proper error handling is crucial for building robust Vue 3 + Tailwind Todo applications. This guide covers strategies for handling errors at different levels of your application: global, component, API, and runtime errors using modern Vue 3 patterns.

## Guiding Principles

1. **Fail Gracefully**: Never let errors crash the application
2. **User-Friendly Messages**: Show meaningful messages to users
3. **Comprehensive Logging**: Log all errors for debugging
4. **Recovery Mechanisms**: Provide ways to recover from errors
5. **Prevention**: Validate data and handle edge cases proactively

## Error Handling Layers

### 1. Global Error Handler

Handle uncaught errors at the application level.

**File**: `src/main.ts`

```typescript
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/main.css'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  // Log error to console
  console.error('Global error:', err)
  console.error('Error info:', info)
  
  // Send to error tracking service (e.g., Sentry)
  if (import.meta.env.PROD) {
    // Sentry.captureException(err)
  }
}

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  
  // Send to error tracking service
  if (import.meta.env.PROD) {
    // Sentry.captureException(event.reason)
  }
})

app.mount('#app')
```

### 2. Error Boundary Component

Create reusable error boundary components to catch errors in component trees.

**File**: `src/core/error-boundaries/ErrorBoundary.vue`

```vue
<template>
  <div v-if="error" class="error-boundary">
    <div class="error-boundary__content">
      <div class="error-boundary__icon">⚠️</div>
      <h2 class="error-boundary__title">
        {{ title || 'Something went wrong' }}
      </h2>
      <p class="error-boundary__message">
        {{ userMessage || 'An unexpected error occurred. Please try again.' }}
      </p>
      <div class="error-boundary__actions">
        <button 
          class="btn btn-primary" 
          @click="retry"
        >
          Try Again
        </button>
        <button 
          v-if="showDetails" 
          class="btn btn-secondary" 
          @click="toggleDetails"
        >
          {{ showErrorDetails ? 'Hide' : 'Show' }} Details
        </button>
      </div>
      <div v-if="showErrorDetails && showDetails" class="error-boundary__details">
        <pre>{{ errorDetails }}</pre>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured } from 'vue'

interface Props {
  title?: string
  userMessage?: string
  showDetails?: boolean
  onError?: (error: Error) => void
  onRetry?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false
})

const error = ref<Error | null>(null)
const showErrorDetails = ref(false)

const errorDetails = computed(() => {
  if (!error.value) return ''
  return `${error.value.message}\n\n${error.value.stack}`
})

// Capture errors from child components
onErrorCaptured((err, instance, info) => {
  error.value = err
  
  // Log error
  console.error('Component error:', err)
  console.error('Error info:', info)

  // Call custom error handler
  if (props.onError) {
    props.onError(err)
  }

  // Prevent error from propagating
  return false
})

const retry = () => {
  error.value = null
  showErrorDetails.value = false
  
  if (props.onRetry) {
    props.onRetry()
  }
}

const toggleDetails = () => {
  showErrorDetails.value = !showErrorDetails.value
}
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
}

.error-boundary__content {
  text-align: center;
  max-width: 600px;
}

.error-boundary__icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-boundary__title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #e53e3e;
}

.error-boundary__message {
  color: #4a5568;
  margin-bottom: 1.5rem;
}

.error-boundary__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.error-boundary__details {
  margin-top: 1rem;
  text-align: left;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  padding: 1rem;
  overflow-x: auto;
}

.error-boundary__details pre {
  margin: 0;
  font-size: 0.875rem;
  color: #e53e3e;
}
</style>
```

**Usage**:

```vue
<template>
  <ErrorBoundary
    title="Dashboard Error"
    user-message="Failed to load dashboard data"
    :show-details="isDevelopment"
    @retry="loadDashboard"
  >
    <DashboardContent />
  </ErrorBoundary>
</template>

<script setup lang="ts">
import ErrorBoundary from '@/components/common/ErrorBoundary/ErrorBoundary.vue'
import DashboardContent from './components/DashboardContent.vue'

const isDevelopment = process.env.NODE_ENV === 'development'

const loadDashboard = () => {
  // Reload dashboard logic
}
</script>
```

### 3. API Error Handling

Centralized error handling for API requests.

**File**: `src/services/api.ts`

```typescript
// src/services/api.ts
import axios, { AxiosError, AxiosResponse } from 'axios'
import { store } from '@/store'
import router from '@/router'

// API error types
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: any,
    message?: string
  ) {
    super(message || statusText)
    this.name = 'ApiError'
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network error occurred') {
    super(message)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends ApiError {
  constructor(
    public errors: Record<string, string[]>,
    message = 'Validation failed'
  ) {
    super(422, 'Unprocessable Entity', errors, message)
    this.name = 'ValidationError'
  }
}

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = store.state.auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    return handleApiError(error)
  }
)

// Centralized error handler
function handleApiError(error: AxiosError): Promise<never> {
  // Network error
  if (!error.response) {
    const networkError = new NetworkError(
      'Unable to connect to server. Please check your internet connection.'
    )
    
    store.dispatch('log/error', networkError.message)
    store.dispatch('notification/error', networkError.message)
    
    return Promise.reject(networkError)
  }

  const { status, statusText, data } = error.response

  // Create appropriate error type
  let apiError: ApiError

  switch (status) {
    case 400: // Bad Request
      apiError = new ApiError(
        status,
        statusText,
        data,
        data.message || 'Invalid request'
      )
      store.dispatch('notification/error', apiError.message)
      break

    case 401: // Unauthorized
      apiError = new ApiError(
        status,
        statusText,
        data,
        'Your session has expired. Please log in again.'
      )
      
      // Clear auth and redirect to login
      store.dispatch('auth/logout')
      router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
      store.dispatch('notification/warning', apiError.message)
      break

    case 403: // Forbidden
      apiError = new ApiError(
        status,
        statusText,
        data,
        'You do not have permission to perform this action.'
      )
      store.dispatch('notification/error', apiError.message)
      break

    case 404: // Not Found
      apiError = new ApiError(
        status,
        statusText,
        data,
        data.message || 'The requested resource was not found.'
      )
      store.dispatch('notification/error', apiError.message)
      break

    case 422: // Validation Error
      const validationError = new ValidationError(
        data.errors || {},
        data.message || 'Please check your input and try again.'
      )
      store.dispatch('notification/error', validationError.message)
      return Promise.reject(validationError)

    case 429: // Too Many Requests
      apiError = new ApiError(
        status,
        statusText,
        data,
        'Too many requests. Please try again later.'
      )
      store.dispatch('notification/warning', apiError.message)
      break

    case 500: // Internal Server Error
      apiError = new ApiError(
        status,
        statusText,
        data,
        'A server error occurred. Our team has been notified.'
      )
      store.dispatch('notification/error', apiError.message)
      break

    case 503: // Service Unavailable
      apiError = new ApiError(
        status,
        statusText,
        data,
        'Service is temporarily unavailable. Please try again later.'
      )
      store.dispatch('notification/warning', apiError.message)
      break

    default:
      apiError = new ApiError(
        status,
        statusText,
        data,
        data.message || 'An unexpected error occurred.'
      )
      store.dispatch('notification/error', apiError.message)
  }

  // Log all API errors
  store.dispatch('log/error', {
    message: apiError.message,
    status: apiError.status,
    data: apiError.data
  })

  return Promise.reject(apiError)
}

export default api
```

### 4. Component-Level Error Handling

Handle errors within components using try-catch.

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'

const todoStore = useTodoStore()
const todos = ref([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadTodos = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    todos.value = todoStore.todos
    
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load todos'
    error.value = message
    
    console.error('Error loading todos:', err)
    
  } finally {
    loading.value = false
  }
}

const retryLoad = () => {
  loadTodos()
}

onMounted(() => {
  loadTodos()
})
</script>

<template>
  <div class="todo-list">
    <!-- Loading state -->
    <div v-if="loading" class="loading">
      Loading todos...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="retryLoad" class="btn-retry">
        Retry
      </button>
    </div>

    <!-- Success state -->
    <div v-else-if="todos.length" class="todos">
      <div v-for="todo in todos" :key="todo.id" class="todo-item">
        {{ todo.title }}
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      No todos found
    </div>
  </div>
</template>
```

### 5. Form Validation Errors

Handle validation errors in forms.

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'

interface FormData {
  email: string
  password: string
  confirmPassword: string
}

const authStore = useAuthStore()
const formData = reactive<FormData>({
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive<Record<string, string[]>>({})
const loading = ref(false)
const generalError = ref<string | null>(null)

const clearError = (field: string) => {
  delete errors[field]
  generalError.value = null
}

const handleSubmit = async () => {
  try {
    loading.value = true
    generalError.value = null
    Object.keys(errors).forEach(key => delete errors[key])

    await authStore.login(formData)
    
    // Handle success
    
  } catch (err) {
    // Handle general errors
    generalError.value = err instanceof Error 
      ? err.message 
      : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- General error -->
    <div v-if="generalError" class="alert alert-error">
      {{ generalError }}
    </div>

    <!-- Email field -->
    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="formData.email"
        type="email"
        :class="{ 'is-invalid': errors.email }"
        @input="clearError('email')"
      />
      <div v-if="errors.email" class="error-messages">
        <p v-for="error in errors.email" :key="error" class="error-message">
          {{ error }}
        </p>
      </div>
    </div>

    <!-- Password field -->
    <div class="form-group">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="formData.password"
        type="password"
        :class="{ 'is-invalid': errors.password }"
        @input="clearError('password')"
      />
      <div v-if="errors.password" class="error-messages">
        <p v-for="error in errors.password" :key="error" class="error-message">
          {{ error }}
        </p>
      </div>
    </div>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Submitting...' : 'Submit' }}
    </button>
  </form>
</template>
```

## Error Logging with Pinia

**File**: `src/stores/errorStore.ts`

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ErrorEntry {
  id: string
  message: string
  stack?: string
  timestamp: Date
  component?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  resolved: boolean
}

export const useErrorStore = defineStore('error', () => {
  const errors = ref<ErrorEntry[]>([])
  const maxErrors = ref(50)

  const addError = (errorData: Partial<ErrorEntry>) => {
    const error: ErrorEntry = {
      id: Date.now().toString(),
      message: errorData.message || 'Unknown error',
      stack: errorData.stack,
      timestamp: new Date(),
      component: errorData.component,
      severity: errorData.severity || 'medium',
      resolved: false
    }

    errors.value.unshift(error)
    
    // Keep only max errors
    if (errors.value.length > maxErrors.value) {
      errors.value = errors.value.slice(0, maxErrors.value)
    }

    // Send to external service in production
    if (import.meta.env.PROD) {
      // sendToErrorTracking(error)
    }
  }

  const resolveError = (errorId: string) => {
    const error = errors.value.find(e => e.id === errorId)
    if (error) {
      error.resolved = true
    }
  }

  const clearErrors = () => {
    errors.value = []
  }

  return {
    errors,
    maxErrors,
    addError,
    resolveError,
    clearErrors
  }
})
```

## Notification System

Create a notification system to display user-friendly error messages.

**File**: `src/stores/notificationStore.ts`

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  persistent: boolean
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  const showNotification = (notificationData: Partial<Notification>) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type: notificationData.type || 'info',
      title: notificationData.title || '',
      message: notificationData.message || '',
      duration: notificationData.duration || 5000,
      persistent: notificationData.persistent || false
    }

    notifications.value.push(notification)

    // Auto-remove after duration (unless persistent)
    if (!notification.persistent && notification.duration) {
      setTimeout(() => {
        hideNotification(notification.id)
      }, notification.duration)
    }
  }

  const hideNotification = (notificationId: string) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  // Convenience methods
  const success = (message: string, title?: string) => {
    showNotification({ type: 'success', message, title, duration: 3000 })
  }

  const error = (message: string, title?: string) => {
    showNotification({ type: 'error', message, title, duration: 5000 })
  }

  const warning = (message: string, title?: string) => {
    showNotification({ type: 'warning', message, title, duration: 4000 })
  }

  const info = (message: string, title?: string) => {
    showNotification({ type: 'info', message, title, duration: 3000 })
  }

  return {
    notifications,
    showNotification,
    hideNotification,
    clearNotifications,
    success,
    error,
    warning,
    info
  }
})
```

## Best Practices

### DO ✅

- Always handle errors explicitly (try-catch)
- Provide meaningful error messages to users
- Log all errors for debugging using Pinia stores
- Show loading and error states in UI
- Provide retry mechanisms
- Use error boundaries for component isolation
- Handle validation errors gracefully
- Clear errors when user corrects input
- Use typed error classes
- Test error scenarios
- Use Pinia stores for centralized error management
- Implement proper error recovery patterns
- Use notification system for user feedback

### DON'T ❌

- Don't expose technical errors to users
- Don't ignore caught errors
- Don't let errors crash the application
- Don't show stack traces in production
- Don't use alert() for error messages
- Don't forget to handle edge cases
- Don't block UI during error handling
- Don't reuse error state across components
- Don't forget to clean up error listeners
- Don't store sensitive information in error logs

## Error Recovery Patterns

### Automatic Retry

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries === 0) throw error
    
    await new Promise(resolve => setTimeout(resolve, delay))
    return fetchWithRetry(fn, retries - 1, delay * 2)
  }
}

// Usage in component
import { useErrorStore } from '@/stores/errorStore'

export default {
  setup() {
    const errorStore = useErrorStore()
    
    const fetchData = async () => {
      try {
        const data = await fetchWithRetry(() => api.getData())
        return data
      } catch (error) {
        errorStore.addError({
          message: 'Failed to fetch data after retries',
          severity: 'high'
        })
        throw error
      }
    }
    
    return { fetchData }
  }
}
```

### Fallback Data

```typescript
import { useErrorStore } from '@/stores/errorStore'

const loadData = async () => {
  const errorStore = useErrorStore()
  
  try {
    data.value = await api.fetchData()
  } catch (error) {
    // Use cached data as fallback
    data.value = getCachedData() || getDefaultData()
    
    errorStore.addError({
      message: 'Using cached data due to network error',
      severity: 'medium'
    })
  }
}
```

---

[← Back to Testing](./testing.md) | [Next: Logging →](./logging.md)

