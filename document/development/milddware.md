# Middleware

## Overview

Middleware in Vue 3 applications provides a way to intercept and process requests, responses, and navigation events. This guide covers route middleware, HTTP interceptors, and other middleware patterns.

## Guiding Principles

1. **Single Responsibility**: Each middleware does one thing
2. **Composability**: Middleware can be chained together
3. **Reusability**: Middleware is reusable across routes
4. **Order Matters**: Middleware execution order is important
5. **Clean Exit**: Middleware should allow flow to continue or stop explicitly

## Types of Middleware

### 1. Route Middleware (Navigation Guards)
### 2. HTTP Request/Response Middleware (Interceptors)
### 3. Custom Middleware Patterns

## Route Middleware

Route middleware intercepts navigation and can perform checks before allowing access.

### Middleware Structure

```bash
src/middleware/
  ├── auth.middleware.ts          # Authentication check
  ├── guest.middleware.ts         # Guest-only routes
  ├── permission.middleware.ts    # Permission/role check
  ├── logger.middleware.ts        # Log navigation
  ├── analytics.middleware.ts     # Track page views
  └── index.ts                    # Export all middleware
```

### Authentication Middleware

**File**: `src/middleware/auth.middleware.ts`

```typescript
// src/middleware/auth.middleware.ts
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useLogStore } from '@/stores/logStore'

/**
 * Check if user is authenticated
 * Redirect to login if not authenticated
 */
export const authMiddleware = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  const logStore = useLogStore()

  if (!authStore.isAuthenticated) {
    // Store intended destination
    const redirectPath = to.fullPath
    
    // Log attempt
    logStore.warn({
      message: 'Unauthenticated access attempt',
      context: { path: to.path, from: from.path }
    })

    // Redirect to login
    next({
      name: 'Login',
      query: { redirect: redirectPath }
    })
    return
  }

  // Try to fetch user if not loaded
  if (!authStore.user) {
    try {
      await authStore.fetchCurrentUser()
    } catch (error) {
      // Clear invalid auth and redirect
      await authStore.logout()
      next({ name: 'Login' })
      return
    }
  }

  next()
}
```

### Guest Middleware

**File**: `src/middleware/guest.middleware.ts`

```typescript
// src/middleware/guest.middleware.ts
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

/**
 * Allow access only to guests (non-authenticated users)
 * Redirect to dashboard if authenticated
 */
export const guestMiddleware = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    // Redirect authenticated users to dashboard
    next({ name: 'Dashboard' })
    return
  }

  next()
}
```

### Permission Middleware

**File**: `src/middleware/permission.middleware.ts`

```typescript
// src/middleware/permission.middleware.ts
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useLogStore } from '@/stores/logStore'
import { useNotificationStore } from '@/stores/notificationStore'

/**
 * Check if user has required permissions/roles
 */
export const permissionMiddleware = (requiredRoles: string[]) => {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()
    const logStore = useLogStore()
    const notificationStore = useNotificationStore()
    
    const user = authStore.user
    const userRoles = user?.roles || []

    // Check if user has any of the required roles
    const hasPermission = requiredRoles.some(role => userRoles.includes(role))

    if (!hasPermission) {
      // Log unauthorized attempt
      logStore.warn({
        message: 'Unauthorized access attempt',
        context: {
          path: to.path,
          requiredRoles,
          userRoles
        }
      })

      // Show notification
      notificationStore.error('You do not have permission to access this page')

      // Redirect to forbidden page or dashboard
      next({ name: 'Forbidden' })
      return
    }

    next()
  }
}

/**
 * Check specific permissions
 */
export const hasPermission = (requiredPermissions: string[]) => {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()
    const notificationStore = useNotificationStore()
    
    const user = authStore.user
    const userPermissions = user?.permissions || []

    const hasAllPermissions = requiredPermissions.every(
      permission => userPermissions.includes(permission)
    )

    if (!hasAllPermissions) {
      notificationStore.error('Insufficient permissions')
      next({ name: 'Dashboard' })
      return
    }

    next()
  }
}
```

### Logger Middleware

**File**: `src/middleware/logger.middleware.ts`

```typescript
// src/middleware/logger.middleware.ts
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useLogStore } from '@/stores/logStore'

/**
 * Log navigation events
 */
export const loggerMiddleware = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  const logStore = useLogStore()
  const user = authStore.user

  // Log navigation
  logStore.info({
    message: 'Navigation',
    context: {
      to: {
        name: to.name,
        path: to.path,
        params: to.params,
        query: to.query
      },
      from: {
        name: from.name,
        path: from.path
      },
      userId: user?.id,
      timestamp: new Date().toISOString()
    }
  })

  next()
}
```

### Analytics Middleware

**File**: `src/middleware/analytics.middleware.ts`

```typescript
// src/middleware/analytics.middleware.ts
import { RouteLocationNormalized } from 'vue-router'

/**
 * Track page views in analytics
 */
export const analyticsMiddleware = (to: RouteLocationNormalized) => {
  // Track page view
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: to.path,
      page_title: to.meta.title || to.name
    })
  }

  // Track in custom analytics
  trackPageView({
    path: to.path,
    name: String(to.name),
    title: String(to.meta.title),
    params: to.params,
    query: to.query
  })
}

function trackPageView(data: any) {
  // Implement your analytics tracking
  console.log('Page view:', data)
}
```

### Applying Middleware to Routes

**File**: `src/router/index.ts`

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { 
  authMiddleware, 
  guestMiddleware, 
  loggerMiddleware,
  analyticsMiddleware 
} from '@/middleware'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Apply global middleware
router.beforeEach(loggerMiddleware)
router.beforeEach(authMiddleware)

// Apply analytics after navigation
router.afterEach(analyticsMiddleware)

export default router
```

**File**: `src/router/routes/admin.ts`

```typescript
// src/router/routes/admin.ts
import { RouteRecordRaw } from 'vue-router'
import { permissionMiddleware } from '@/middleware'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin/AdminLayout.vue'),
    beforeEnter: permissionMiddleware(['admin']),
    meta: {
      requiresAuth: true,
      roles: ['admin']
    }
  }
]

export default adminRoutes
```

## HTTP Middleware (Interceptors)

HTTP middleware intercepts API requests and responses.

### Request Interceptor

**File**: `src/services/api.ts`

```typescript
// src/services/api.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { useLogStore } from '@/stores/logStore'
import { useNotificationStore } from '@/stores/notificationStore'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000
})

// Request interceptor
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const authStore = useAuthStore()
    const logStore = useLogStore()
    
    // Add authentication token
    const token = authStore.token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request ID for tracking
    const requestId = generateRequestId()
    if (config.headers) {
      config.headers['X-Request-ID'] = requestId
    }

    // Log request
    logStore.debug({
      message: 'API Request',
      context: {
        method: config.method,
        url: config.url,
        requestId
      }
    })

    // Add timestamp
    ;(config as any).metadata = { startTime: Date.now() }

    return config
  },
  (error: AxiosError) => {
    const logStore = useLogStore()
    logStore.error({
      message: 'Request interceptor error',
      stack: error.stack
    })
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const logStore = useLogStore()
    
    // Calculate request duration
    const duration = Date.now() - (response.config as any).metadata.startTime

    // Log successful response
    logStore.debug({
      message: 'API Response',
      context: {
        method: response.config.method,
        url: response.config.url,
        status: response.status,
        duration: `${duration}ms`
      }
    })

    return response
  },
  (error: AxiosError) => {
    const authStore = useAuthStore()
    const logStore = useLogStore()
    const notificationStore = useNotificationStore()
    
    // Handle specific error codes
    if (error.response) {
      const { status } = error.response

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect
          authStore.logout()
          router.push({ name: 'Login' })
          break

        case 403:
          // Forbidden
          notificationStore.error('You do not have permission to perform this action')
          break

        case 429:
          // Too many requests
          notificationStore.warning('Too many requests. Please try again later.')
          break

        case 500:
        case 502:
        case 503:
          // Server errors
          notificationStore.error('Server error. Please try again later.')
          break
      }

      // Log error
      logStore.error({
        message: 'API Error',
        context: {
          method: error.config?.method,
          url: error.config?.url,
          status,
          data: error.response.data
        }
      })
    }

    return Promise.reject(error)
  }
)

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export default api
```

### Retry Interceptor

**File**: `src/services/interceptors/retry.interceptor.ts`

```typescript
// src/services/interceptors/retry.interceptor.ts
import { AxiosError, AxiosInstance } from 'axios'

interface RetryConfig {
  retries?: number
  retryDelay?: number
  retryCondition?: (error: AxiosError) => boolean
}

/**
 * Add retry logic to axios instance
 */
export function setupRetryInterceptor(
  instance: AxiosInstance,
  config: RetryConfig = {}
) {
  const {
    retries = 3,
    retryDelay = 1000,
    retryCondition = (error) => {
      // Retry on network errors or 5xx responses
      return !error.response || (error.response.status >= 500 && error.response.status <= 599)
    }
  } = config

  instance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const config = error.config as any

      // Initialize retry count
      if (!config.__retryCount) {
        config.__retryCount = 0
      }

      // Check if should retry
      if (
        config.__retryCount >= retries ||
        !retryCondition(error)
      ) {
        return Promise.reject(error)
      }

      // Increment retry count
      config.__retryCount += 1

      // Calculate delay with exponential backoff
      const delay = retryDelay * Math.pow(2, config.__retryCount - 1)

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay))

      // Retry request
      return instance(config)
    }
  )
}
```

### Cache Interceptor

**File**: `src/services/interceptors/cache.interceptor.ts`

```typescript
// src/services/interceptors/cache.interceptor.ts
import { AxiosInstance, AxiosResponse } from 'axios'

interface CacheEntry {
  data: any
  timestamp: number
}

const cache = new Map<string, CacheEntry>()

/**
 * Add caching to GET requests
 */
export function setupCacheInterceptor(
  instance: AxiosInstance,
  cacheDuration = 5 * 60 * 1000 // 5 minutes
) {
  instance.interceptors.request.use(config => {
    // Only cache GET requests
    if (config.method !== 'get') return config

    const cacheKey = `${config.url}${JSON.stringify(config.params)}`
    const cached = cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      // Return cached response
      return Promise.reject({
        config,
        response: {
          data: cached.data,
          status: 200,
          statusText: 'OK (Cached)',
          headers: {},
          config
        }
      })
    }

    return config
  })

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Cache successful GET responses
      if (response.config.method === 'get') {
        const cacheKey = `${response.config.url}${JSON.stringify(response.config.params)}`
        cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        })
      }

      return response
    },
    error => {
      // Return cached response if available
      if (error.response) {
        return Promise.resolve(error.response)
      }
      return Promise.reject(error)
    }
  )
}

/**
 * Clear cache
 */
export function clearCache() {
  cache.clear()
}
```

## Custom Middleware Patterns

### Middleware Chain

**File**: `src/middleware/chain.ts`

```typescript
// src/middleware/chain.ts
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

type MiddlewareFunction = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => void | Promise<void>

/**
 * Chain multiple middleware functions
 */
export function chainMiddleware(...middlewares: MiddlewareFunction[]) {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    let index = 0

    const processNext = async () => {
      if (index >= middlewares.length) {
        next()
        return
      }

      const middleware = middlewares[index++]
      
      await middleware(to, from, (nextArg?: any) => {
        if (nextArg) {
          // Middleware stopped the chain
          next(nextArg)
        } else {
          // Continue to next middleware
          processNext()
        }
      })
    }

    await processNext()
  }
}

// Usage
import { authMiddleware, loggerMiddleware } from '@/middleware'

const combinedMiddleware = chainMiddleware(
  loggerMiddleware,
  authMiddleware
)

router.beforeEach(combinedMiddleware)
```

## Best Practices

### DO ✅

- Keep middleware focused on single responsibility
- Chain middleware in logical order
- Handle errors gracefully
- Log important middleware events
- Use TypeScript for type safety
- Test middleware in isolation
- Document middleware purpose and usage
- Clear middleware chain on navigation cancel

### DON'T ❌

- Don't perform heavy computations in middleware
- Don't forget to call `next()`
- Don't create circular middleware dependencies
- Don't modify route objects directly
- Don't make unnecessary API calls
- Don't block navigation indefinitely
- Don't ignore error cases

## Testing Middleware

```typescript
// src/middleware/auth.middleware.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authMiddleware } from './auth.middleware'
import { useAuthStore } from '@/stores/authStore'
import { useLogStore } from '@/stores/logStore'

// Mock the stores
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn()
}))

vi.mock('@/stores/logStore', () => ({
  useLogStore: vi.fn()
}))

describe('authMiddleware', () => {
  const mockNext = vi.fn()
  const mockTo = { name: 'Dashboard', fullPath: '/dashboard' } as any
  const mockFrom = { name: 'Home', path: '/' } as any

  const mockAuthStore = {
    isAuthenticated: false,
    user: null,
    fetchCurrentUser: vi.fn(),
    logout: vi.fn()
  }

  const mockLogStore = {
    warn: vi.fn()
  }

  beforeEach(() => {
    mockNext.mockClear()
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
    vi.mocked(useLogStore).mockReturnValue(mockLogStore)
  })

  it('should allow authenticated users', async () => {
    // Arrange
    mockAuthStore.isAuthenticated = true
    mockAuthStore.user = { id: 1, name: 'John' }

    // Act
    await authMiddleware(mockTo, mockFrom, mockNext)

    // Assert
    expect(mockNext).toHaveBeenCalledWith()
  })

  it('should redirect unauthenticated users to login', async () => {
    // Arrange
    mockAuthStore.isAuthenticated = false

    // Act
    await authMiddleware(mockTo, mockFrom, mockNext)

    // Assert
    expect(mockNext).toHaveBeenCalledWith({
      name: 'Login',
      query: { redirect: '/dashboard' }
    })
  })
})
```

---

[← Back to Utility Functions](./utility.md) | [Next: Custom Environment →](./custom-enviroment.md)

