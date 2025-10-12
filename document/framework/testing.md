# Testing

## Overview

This guide covers testing patterns for Vue 3 applications using the AAA (Arrange-Act-Assert) pattern with Vue Test Utils and Jest. A comprehensive testing strategy ensures code quality, prevents regressions, and serves as living documentation.

## Guiding Principles

1. **AAA Pattern**: Structure tests with Arrange, Act, Assert
2. **Test Behavior, Not Implementation**: Focus on what components do, not how
3. **Isolation**: Each test should be independent
4. **Readability**: Tests should be clear and self-documenting
5. **Coverage**: Aim for >80% code coverage
6. **Fast Feedback**: Tests should run quickly

## Testing Stack

- **Vue Test Utils**: Official testing library for Vue components
- **Jest**: JavaScript testing framework
- **@vue/test-utils**: Vue 3 testing utilities
- **@testing-library/vue**: Additional testing utilities (optional)
- **jest-serializer-vue**: Snapshot serializer for Vue

## Project Setup

### Installation

```bash
npm install -D @vue/test-utils jest @types/jest \
  @vue/vue3-jest babel-jest ts-jest \
  jest-environment-jsdom
```

### Jest Configuration

**File**: `jest.config.js`

```javascript
// jest.config.js
module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testEnvironment: 'jsdom',
  
  // Transform files
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Module file extensions
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  
  // Module name mapper for aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@views/(.*)$': '<rootDir>/src/views/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  
  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.(test|spec).(js|ts)',
    '**/*.(test|spec).(js|ts)'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,ts,vue}',
    '!src/main.ts',
    '!src/**/*.d.ts',
    '!src/**/*.stories.ts',
    '!**/node_modules/**'
  ],
  
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
}
```

### Test Setup

**File**: `tests/setup.ts`

```typescript
// tests/setup.ts
import { config } from '@vue/test-utils'

// Global test configuration
config.global.mocks = {
  $t: (key: string) => key, // Mock i18n
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any
```

## AAA Testing Pattern

The AAA pattern structures tests in three clear phases:

1. **Arrange**: Set up test data and dependencies
2. **Act**: Execute the code being tested
3. **Assert**: Verify the expected outcome

### Basic AAA Example

```typescript
describe('Button Component', () => {
  it('should emit click event when clicked', async () => {
    // Arrange
    const wrapper = mount(Button, {
      props: { label: 'Click Me' }
    })
    
    // Act
    await wrapper.trigger('click')
    
    // Assert
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
```

## Component Testing

### Simple Component Test

```typescript
// src/components/common/Button/Button.test.ts
import { describe, it, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button.vue', () => {
  describe('Rendering', () => {
    it('should render button with label', () => {
      // Arrange
      const label = 'Click Me'
      
      // Act
      const wrapper = mount(Button, {
        props: { label }
      })
      
      // Assert
      expect(wrapper.text()).toContain(label)
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should apply variant classes', () => {
      // Arrange
      const variant = 'primary'
      
      // Act
      const wrapper = mount(Button, {
        props: { variant }
      })
      
      // Assert
      expect(wrapper.classes()).toContain('btn-primary')
    })

    it('should show loading state', () => {
      // Arrange & Act
      const wrapper = mount(Button, {
        props: { loading: true }
      })
      
      // Assert
      expect(wrapper.find('.spinner').exists()).toBe(true)
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })
  })

  describe('Interactions', () => {
    it('should emit click event when clicked', async () => {
      // Arrange
      const wrapper = mount(Button, {
        props: { label: 'Click' }
      })
      
      // Act
      await wrapper.trigger('click')
      
      // Assert
      expect(wrapper.emitted()).toHaveProperty('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('should not emit click when disabled', async () => {
      // Arrange
      const wrapper = mount(Button, {
        props: { disabled: true }
      })
      
      // Act
      await wrapper.trigger('click')
      
      // Assert
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      // Arrange & Act
      const wrapper = mount(Button, {
        props: { 
          label: 'Submit',
          ariaLabel: 'Submit form'
        }
      })
      
      // Assert
      expect(wrapper.attributes('aria-label')).toBe('Submit form')
    })
  })
})
```

### Component with Props and Slots

```typescript
// src/components/common/Card/Card.test.ts
import { mount } from '@vue/test-utils'
import Card from './Card.vue'

describe('Card.vue', () => {
  it('should render with title prop', () => {
    // Arrange
    const title = 'Card Title'
    
    // Act
    const wrapper = mount(Card, {
      props: { title }
    })
    
    // Assert
    expect(wrapper.find('.card-title').text()).toBe(title)
  })

  it('should render default slot content', () => {
    // Arrange
    const content = '<p>Card content</p>'
    
    // Act
    const wrapper = mount(Card, {
      slots: {
        default: content
      }
    })
    
    // Assert
    expect(wrapper.html()).toContain(content)
  })

  it('should render named slots', () => {
    // Arrange
    const header = '<h2>Header</h2>'
    const footer = '<div>Footer</div>'
    
    // Act
    const wrapper = mount(Card, {
      slots: {
        header,
        footer
      }
    })
    
    // Assert
    expect(wrapper.find('.card-header').html()).toContain(header)
    expect(wrapper.find('.card-footer').html()).toContain(footer)
  })
})
```

### Component with Vuex Store

```typescript
// src/components/UserProfile/UserProfile.test.ts
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import UserProfile from './UserProfile.vue'

describe('UserProfile.vue', () => {
  // Arrange - Create mock store
  const createMockStore = (user = null) => {
    return createStore({
      modules: {
        auth: {
          namespaced: true,
          state: { user },
          getters: {
            currentUser: (state) => state.user,
            isAuthenticated: (state) => !!state.user
          }
        }
      }
    })
  }

  it('should display user information when authenticated', () => {
    // Arrange
    const user = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }
    const store = createMockStore(user)
    
    // Act
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [store]
      }
    })
    
    // Assert
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('john@example.com')
  })

  it('should show login prompt when not authenticated', () => {
    // Arrange
    const store = createMockStore(null)
    
    // Act
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [store]
      }
    })
    
    // Assert
    expect(wrapper.find('.login-prompt').exists()).toBe(true)
  })

  it('should dispatch logout action when logout button clicked', async () => {
    // Arrange
    const user = { id: 1, firstName: 'John', lastName: 'Doe' }
    const store = createMockStore(user)
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [store]
      }
    })
    
    // Act
    await wrapper.find('.logout-button').trigger('click')
    
    // Assert
    expect(dispatchSpy).toHaveBeenCalledWith('auth/logout')
  })
})
```

### Component with Router

```typescript
// src/components/Navigation/Navigation.test.ts
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Navigation from './Navigation.vue'

describe('Navigation.vue', () => {
  const createMockRouter = () => {
    return createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
        { path: '/about', name: 'About', component: { template: '<div>About</div>' } }
      ]
    })
  }

  it('should navigate to home when home link clicked', async () => {
    // Arrange
    const router = createMockRouter()
    await router.push('/')
    await router.isReady()
    
    const wrapper = mount(Navigation, {
      global: {
        plugins: [router]
      }
    })
    
    const pushSpy = jest.spyOn(router, 'push')
    
    // Act
    await wrapper.find('[data-testid="home-link"]').trigger('click')
    
    // Assert
    expect(pushSpy).toHaveBeenCalledWith({ name: 'Home' })
  })

  it('should highlight active route', async () => {
    // Arrange
    const router = createMockRouter()
    await router.push('/about')
    await router.isReady()
    
    // Act
    const wrapper = mount(Navigation, {
      global: {
        plugins: [router]
      }
    })
    
    // Assert
    expect(wrapper.find('[data-testid="about-link"]').classes()).toContain('active')
  })
})
```

### Component with Composables

```typescript
// src/views/Dashboard/DashboardPage.test.ts
import { mount } from '@vue/test-utils'
import DashboardPage from './DashboardPage.vue'
import { useAuth } from '@/composables/useAuth'

// Mock the composable
jest.mock('@/composables/useAuth')

describe('DashboardPage.vue', () => {
  it('should display welcome message with user name', () => {
    // Arrange
    const mockUser = { firstName: 'John', lastName: 'Doe' }
    
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { value: mockUser },
      isAuthenticated: { value: true },
      logout: jest.fn()
    })
    
    // Act
    const wrapper = mount(DashboardPage)
    
    // Assert
    expect(wrapper.text()).toContain('Welcome, John Doe')
  })

  it('should call logout when logout button clicked', async () => {
    // Arrange
    const mockLogout = jest.fn()
    
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { value: { firstName: 'John' } },
      isAuthenticated: { value: true },
      logout: mockLogout
    })
    
    const wrapper = mount(DashboardPage)
    
    // Act
    await wrapper.find('[data-testid="logout-btn"]').trigger('click')
    
    // Assert
    expect(mockLogout).toHaveBeenCalled()
  })
})
```

## Testing Vuex Store

### State and Mutations

```typescript
// src/store/modules/auth/auth.test.ts
import { createStore } from 'vuex'
import authModule from './index'
import * as types from './mutation-types'

describe('Auth Store Module', () => {
  let store: any

  beforeEach(() => {
    // Arrange - Fresh store for each test
    store = createStore({
      modules: {
        auth: authModule
      }
    })
  })

  describe('State', () => {
    it('should have initial state', () => {
      // Assert
      expect(store.state.auth.user).toBeNull()
      expect(store.state.auth.token).toBeNull()
      expect(store.state.auth.isAuthenticated).toBe(false)
    })
  })

  describe('Mutations', () => {
    it('should set user with SET_USER mutation', () => {
      // Arrange
      const user = { id: 1, firstName: 'John', lastName: 'Doe' }
      
      // Act
      store.commit(`auth/${types.SET_USER}`, user)
      
      // Assert
      expect(store.state.auth.user).toEqual(user)
      expect(store.state.auth.isAuthenticated).toBe(true)
    })

    it('should set token with SET_TOKEN mutation', () => {
      // Arrange
      const token = 'test-token-123'
      
      // Act
      store.commit(`auth/${types.SET_TOKEN}`, token)
      
      // Assert
      expect(store.state.auth.token).toBe(token)
    })

    it('should clear auth with CLEAR_AUTH mutation', () => {
      // Arrange
      store.commit(`auth/${types.SET_USER}`, { id: 1, firstName: 'John' })
      store.commit(`auth/${types.SET_TOKEN}`, 'token')
      
      // Act
      store.commit(`auth/${types.CLEAR_AUTH}`)
      
      // Assert
      expect(store.state.auth.user).toBeNull()
      expect(store.state.auth.token).toBeNull()
      expect(store.state.auth.isAuthenticated).toBe(false)
    })
  })

  describe('Getters', () => {
    it('should return isAuthenticated status', () => {
      // Arrange
      store.commit(`auth/${types.SET_USER}`, { id: 1, firstName: 'John' })
      
      // Act
      const isAuthenticated = store.getters['auth/isAuthenticated']
      
      // Assert
      expect(isAuthenticated).toBe(true)
    })

    it('should return full name', () => {
      // Arrange
      store.commit(`auth/${types.SET_USER}`, {
        id: 1,
        firstName: 'John',
        lastName: 'Doe'
      })
      
      // Act
      const fullName = store.getters['auth/userFullName']
      
      // Assert
      expect(fullName).toBe('John Doe')
    })
  })

  describe('Actions', () => {
    it('should login successfully', async () => {
      // Arrange
      const credentials = { email: 'test@example.com', password: 'password' }
      const mockResponse = {
        user: { id: 1, firstName: 'John' },
        token: 'test-token'
      }

      // Mock API call
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      } as Response)
      
      // Act
      await store.dispatch('auth/login', credentials)
      
      // Assert
      expect(store.state.auth.user).toEqual(mockResponse.user)
      expect(store.state.auth.token).toBe(mockResponse.token)
      expect(store.state.auth.isAuthenticated).toBe(true)
    })

    it('should handle login error', async () => {
      // Arrange
      const credentials = { email: 'test@example.com', password: 'wrong' }
      
      jest.spyOn(global, 'fetch').mockRejectedValue(
        new Error('Invalid credentials')
      )
      
      // Act & Assert
      await expect(
        store.dispatch('auth/login', credentials)
      ).rejects.toThrow('Invalid credentials')
      
      expect(store.state.auth.error).toBeTruthy()
    })

    it('should logout user', async () => {
      // Arrange
      store.commit(`auth/${types.SET_USER}`, { id: 1, firstName: 'John' })
      store.commit(`auth/${types.SET_TOKEN}`, 'token')
      
      // Act
      await store.dispatch('auth/logout')
      
      // Assert
      expect(store.state.auth.user).toBeNull()
      expect(store.state.auth.token).toBeNull()
    })
  })
})
```

## Testing Utilities

```typescript
// tests/utils/test-helpers.ts
import { mount, VueWrapper } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'

/**
 * Create a test wrapper with common dependencies
 */
export const createTestWrapper = (
  component: any,
  options: any = {}
) => {
  const mockStore = createStore({
    modules: options.store || {}
  })

  const mockRouter = createRouter({
    history: createWebHistory(),
    routes: options.routes || []
  })

  return mount(component, {
    global: {
      plugins: [mockStore, mockRouter],
      ...options.global
    },
    ...options
  })
}

/**
 * Find element by test ID
 */
export const findByTestId = (
  wrapper: VueWrapper,
  testId: string
) => {
  return wrapper.find(`[data-testid="${testId}"]`)
}

/**
 * Wait for promises to resolve
 */
export const flushPromises = () => {
  return new Promise(resolve => setTimeout(resolve, 0))
}
```

## Best Practices

### DO ✅

- Follow the AAA pattern for all tests
- Use `data-testid` attributes for reliable element selection
- Test user behavior, not implementation details
- Mock external dependencies (API, stores, etc.)
- Use `beforeEach` for common setup
- Test edge cases and error states
- Write descriptive test names
- Keep tests isolated and independent
- Use async/await for asynchronous operations
- Clean up after tests (spies, mocks, etc.)

### DON'T ❌

- Don't test Vue internals or framework behavior
- Don't rely on CSS classes for assertions (use data-testid)
- Don't test multiple things in one test
- Don't make tests dependent on execution order
- Don't use real API calls in unit tests
- Don't ignore failing tests
- Don't test private methods directly
- Don't copy-paste test code (use helpers)

## Test Organization

```typescript
describe('ComponentName', () => {
  describe('Rendering', () => {
    // Tests for rendering logic
  })

  describe('Props', () => {
    // Tests for prop validation and behavior
  })

  describe('Events', () => {
    // Tests for emitted events
  })

  describe('Interactions', () => {
    // Tests for user interactions
  })

  describe('Computed Properties', () => {
    // Tests for computed properties
  })

  describe('Watchers', () => {
    // Tests for watchers
  })

  describe('Lifecycle', () => {
    // Tests for lifecycle hooks
  })

  describe('Error Handling', () => {
    // Tests for error scenarios
  })

  describe('Accessibility', () => {
    // Tests for a11y
  })
})
```

## Running Tests

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testMatch='**/*.test.ts'",
    "test:verbose": "jest --verbose"
  }
}
```

---

[← Back to Routing](./routing.md) | [Next: Error Handling →](./error-handling.md)

