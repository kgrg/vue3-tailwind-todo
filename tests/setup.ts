/**
 * Test Setup Configuration
 * Global test setup for Vitest
 */

import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'mock-uuid-' + Math.random().toString(36).substr(2, 9)),
  },
})

// Global test utilities
global.testUtils = {
  createMockLabel: (overrides = {}) => ({
    id: 'test-label-id',
    name: 'Test Label',
    color: '#22c55e',
    createdAt: '2025-01-27T00:00:00.000Z',
    updatedAt: '2025-01-27T00:00:00.000Z',
    ...overrides,
  }),

  createMockTask: (overrides = {}) => ({
    id: 'test-task-id',
    title: 'Test Task',
    completed: false,
    createdAt: '2025-01-27T00:00:00.000Z',
    updatedAt: '2025-01-27T00:00:00.000Z',
    labelIds: [],
    ...overrides,
  }),

  createMockStore: () => ({
    labels: [],
    tasks: [],
    loading: false,
    error: null,
  }),
}

// Configure Vue Test Utils
config.global.mocks = {
  $t: (key: string) => key, // Mock i18n
  $route: {
    params: {},
    query: {},
    path: '/',
  },
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  },
}

// Mock console methods in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
  localStorageMock.clear()
})
