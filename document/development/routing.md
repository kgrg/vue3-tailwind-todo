# Routing

## Overview

This guide covers routing patterns for Vue 3 applications using Vue Router 4. We follow a modular architecture that keeps route definitions organized by feature while maintaining a centralized router configuration.

## Guiding Principles

1. **Modular Organization**: Routes are organized by feature/domain
2. **Lazy Loading**: Components are loaded on-demand for optimal performance
3. **Type Safety**: Leverage TypeScript for route definitions
4. **Guard Composition**: Navigation guards are reusable and composable
5. **Clear Naming**: Routes have consistent, descriptive names

## Router Structure

```bash
src/router/
  └── index.ts                 # Main router configuration with all routes
```

## Route Configuration

### Main Router Setup

The application uses a single router file with all route definitions.

**File**: `src/router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import TodayView from '@/pages/TodayView.vue'
import LoginPage from '@/modules/auth/pages/LoginPage.vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ActivityListView from '@/pages/ActivityListView.vue'
import DashboardView from '@/pages/DashboardView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardView
      },
      {
        path: 'today',
        name: 'today',
        component: TodayView
      },
      {
        path: 'upcoming',
        name: 'upcoming',
        component: ActivityListView
      },
      {
        path: 'activities',
        name: 'activities',
        component: ActivityListView
      },
      {
        path: 'categories/:category',
        name: 'category',
        component: ActivityListView
      },
      {
        path: 'tags/:tag',
        name: 'tag',
        component: ActivityListView
      },
      {
        path: 'completed',
        name: 'completed',
        component: ActivityListView
      },
      {
        path: 'analytics',
        name: 'analytics',
        component: DashboardView
      },
      {
        path: 'settings',
        name: 'settings',
        component: ActivityListView
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
```

### Router Instance and Navigation Guards

```typescript
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
```

## Layout-Based Routing

The application uses layout-based routing with two main layouts:

### Dashboard Layout
- **Path**: `/` (root)
- **Layout**: `DashboardLayout`
- **Routes**: All main application routes (dashboard, today, activities, etc.)
- **Authentication**: Required for all routes

### Auth Layout
- **Path**: `/` (root)
- **Layout**: `AuthLayout`
- **Routes**: Authentication routes (login)
- **Authentication**: Guest-only routes

## Navigation Guards

### Authentication Guard

The application uses a simple authentication guard that checks for authentication status using Pinia store.

```typescript
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
```

### Route Meta Properties

The application uses the following meta properties:

- **`requiresAuth`**: Route requires authentication
- **`requiresGuest`**: Route requires guest (non-authenticated) user

## Route Naming Conventions

### Path Naming

- Use **kebab-case** for URL paths: `/user-profile`, `/admin-dashboard`
- Use meaningful, SEO-friendly paths
- Keep paths hierarchical: `/admin/users`, `/admin/users/:id`

### Route Name Naming

- Use **camelCase** for route names: `userProfile`, `adminDashboard`
- Use descriptive names that match component names
- For nested routes, use prefixes: `dashboardOverview`, `dashboardSettings`

```typescript
// ✅ Good
{
  path: '/user-profile',
  name: 'userProfile',
  component: UserProfile
}

// ❌ Avoid
{
  path: '/userprofile',
  name: 'user_profile',
  component: UserProfile
}
```

## Best Practices

### DO ✅

- Use layout-based routing for different application sections
- Use navigation guards for authentication
- Use meaningful route names
- Use TypeScript for route definitions
- Use lazy loading for components
- Use route meta properties for additional configuration
- Use nested routes for related functionality

### DON'T ❌

- Don't put business logic in route definitions
- Don't hardcode paths in components (use named routes)
- Don't forget to handle authentication in guards
- Don't create overly complex route structures
- Don't mix different routing patterns unnecessarily

## Route Meta Types

Define TypeScript types for route meta fields.

**File**: `src/types/router.types.ts`

```typescript
// src/types/router.types.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // Authentication
    requiresAuth?: boolean
    requiresGuest?: boolean
    
    // Layout
    layout?: 'dashboard' | 'auth'
    
    // UI
    showInMenu?: boolean
    icon?: string
    
    // SEO
    title?: string
    description?: string
  }
}
```

## Programmatic Navigation

### In Components

```vue
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Navigate to named route
const goToDashboard = () => {
  router.push({ name: 'dashboard' })
}

// Navigate to today page
const goToToday = () => {
  router.push({ name: 'today' })
}

// Navigate with parameters
const goToCategory = (category: string) => {
  router.push({ 
    name: 'category', 
    params: { category } 
  })
}

// Navigate with query parameters
const searchActivities = (query: string) => {
  router.push({ 
    name: 'activities', 
    query: { search: query } 
  })
}

// Navigate with replace (no history entry)
const redirectToLogin = () => {
  router.replace({ name: 'login' })
}

// Go back
const goBack = () => {
  router.back()
}

// Access current route
const currentPath = route.path
const currentParams = route.params
const currentQuery = route.query
</script>
```

### In Composables

```typescript
// src/composables/useNavigation.ts
import { useRouter } from 'vue-router'

export function useNavigation() {
  const router = useRouter()

  const navigateToDashboard = () => {
    router.push({ name: 'dashboard' })
  }

  const navigateToToday = () => {
    router.push({ name: 'today' })
  }

  const navigateToActivities = () => {
    router.push({ name: 'activities' })
  }

  const navigateToLogin = (redirectUrl?: string) => {
    router.push({
      name: 'login',
      query: redirectUrl ? { redirect: redirectUrl } : undefined
    })
  }

  const navigateBack = () => {
    router.back()
  }

  return {
    navigateToDashboard,
    navigateToToday,
    navigateToActivities,
    navigateToLogin,
    navigateBack
  }
}
```

## Lazy Loading Strategies

### Basic Lazy Loading

The application uses direct imports for components, but lazy loading can be implemented for better performance:

```typescript
{
  path: '/dashboard',
  name: 'dashboard',
  component: () => import('@/pages/DashboardView.vue')
}
```

### Lazy Loading with Webpack Magic Comments

```typescript
{
  path: '/activities',
  name: 'activities',
  component: () => import(
    /* webpackChunkName: "activities" */
    /* webpackPrefetch: true */
    '@/pages/ActivityListView.vue'
  )
}
```

## Testing Routes

```typescript
// src/router/index.test.ts
import { describe, it, expect } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './index'

describe('Router', () => {
  it('should define all required routes', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes
    })

    const routeNames = router.getRoutes().map(route => route.name)
    
    expect(routeNames).toContain('dashboard')
    expect(routeNames).toContain('today')
    expect(routeNames).toContain('activities')
    expect(routeNames).toContain('login')
  })

  it('should have proper route structure', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes
    })

    const dashboardRoute = router.getRoutes().find(r => r.name === 'dashboard')
    expect(dashboardRoute).toBeDefined()
    expect(dashboardRoute?.path).toBe('')
  })
})
```

## Best Practices

### DO ✅

- Use lazy loading for all route components
- Organize routes by feature/domain
- Use navigation guards for authentication and authorization
- Define route meta types with TypeScript
- Use named routes for navigation
- Implement proper error handling
- Set meaningful page titles
- Use route params for dynamic segments
- Use query params for filters and search

### DON'T ❌

- Don't import all components eagerly
- Don't put business logic in route definitions
- Don't hardcode paths in components (use named routes)
- Don't forget to handle 404 routes
- Don't duplicate route definitions
- Don't use route guards for data fetching (use composables)

## Advanced Patterns

### Dynamic Route Registration

```typescript
// src/router/dynamic.ts
import { RouteRecordRaw } from 'vue-router'
import router from './index'

export const registerRoutes = (routes: RouteRecordRaw[]) => {
  routes.forEach(route => {
    router.addRoute(route)
  })
}

export const unregisterRoute = (name: string) => {
  router.removeRoute(name)
}
```

### Route-Based Code Splitting

```typescript
// Load routes based on user permissions
const loadAdminRoutes = async () => {
  const adminRoutes = await import('./routes/admin')
  registerRoutes(adminRoutes.default)
}
```

## Testing Routes

```typescript
// src/router/routes/home.test.ts
import { describe, it, expect } from 'vitest'
import homeRoutes from './home'

describe('Home Routes', () => {
  it('should define home route', () => {
    const homeRoute = homeRoutes.find(r => r.name === 'Home')
    
    expect(homeRoute).toBeDefined()
    expect(homeRoute?.path).toBe('/')
    expect(homeRoute?.meta?.requiresAuth).toBe(false)
  })

  it('should use lazy loading', () => {
    const homeRoute = homeRoutes.find(r => r.name === 'Home')
    
    expect(typeof homeRoute?.component).toBe('function')
  })
})
```

---

[← Back to State Management](./state-management.md) | [Next: Testing →](./testing.md)

