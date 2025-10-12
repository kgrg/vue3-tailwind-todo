# Logging

## Overview

This guide covers logging strategies for Vue 3 applications using Pinia stores. A centralized logging system helps with debugging, monitoring, and understanding application behavior in production.

## Guiding Principles

1. **Centralized**: All logging goes through a single system
2. **Structured**: Use consistent log formats and levels
3. **Contextual**: Include relevant context with each log
4. **Performance**: Minimize impact on application performance
5. **Environment-Aware**: Different behavior for development vs production

## Log Levels

We use standard log levels:

- **DEBUG**: Detailed information for debugging (development only)
- **INFO**: General informational messages
- **WARN**: Warning messages for potentially harmful situations
- **ERROR**: Error events that might still allow the application to continue
- **FATAL**: Very severe error events that might cause termination

## Logging Store with Pinia

### Log Store Structure

**File**: `src/stores/logStore.ts`

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LogEntry {
  id: string
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, any>
  component?: string
  userId?: string | number
  sessionId?: string
  stack?: string
}

export const useLogStore = defineStore('log', () => {
  const logs = ref<LogEntry[]>([])
  const maxLogs = ref(import.meta.env.PROD ? 100 : 500)
  const enabledLevels = ref<LogLevel[]>(
    import.meta.env.PROD 
      ? ['info', 'warn', 'error', 'fatal']
      : ['debug', 'info', 'warn', 'error', 'fatal']
  )
  const persistLogs = ref(import.meta.env.PROD)

  // Getters
  const allLogs = computed(() => logs.value)
  
  const logsByLevel = computed(() => (level: LogLevel) => {
    return logs.value.filter(log => log.level === level)
  })
  
  const recentLogs = computed(() => (count: number = 10) => {
    return logs.value.slice(0, count)
  })
  
  const logsByTimeRange = computed(() => (startTime: Date, endTime: Date) => {
    return logs.value.filter(
      log => log.timestamp >= startTime && log.timestamp <= endTime
    )
  })
  
  const logsByComponent = computed(() => (componentName: string) => {
    return logs.value.filter(log => log.component === componentName)
  })
  
  const errorLogs = computed(() => {
    return logs.value.filter(log => log.level === 'error' || log.level === 'fatal')
  })
  
  const countByLevel = computed(() => {
    return logs.value.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1
      return acc
    }, {} as Record<LogLevel, number>)
  })

  return {
    logs,
    maxLogs,
    enabledLevels,
    persistLogs,
    allLogs,
    logsByLevel,
    recentLogs,
    logsByTimeRange,
    logsByComponent,
    errorLogs,
    countByLevel
  }
})
```

### Logging Actions

**File**: `src/stores/logStore.ts` (continued)

```typescript
// Add these actions to the useLogStore function
interface LogOptions {
  component?: string
  context?: Record<string, any>
  stack?: string
}

// Actions
const addLog = (log: LogEntry) => {
  logs.value.unshift(log)

  // Keep only max logs
  if (logs.value.length > maxLogs.value) {
    logs.value = logs.value.slice(0, maxLogs.value)
  }

  // Persist to localStorage if enabled
  if (persistLogs.value) {
    try {
      const persistedLogs = logs.value.slice(0, 50) // Only persist last 50
      localStorage.setItem('app_logs', JSON.stringify(persistedLogs))
    } catch (error) {
      console.warn('Failed to persist logs:', error)
    }
  }
}

const clearLogs = () => {
  logs.value = []
  if (persistLogs.value) {
    localStorage.removeItem('app_logs')
  }
}

const setMaxLogs = (newMaxLogs: number) => {
  maxLogs.value = newMaxLogs
  if (logs.value.length > newMaxLogs) {
    logs.value = logs.value.slice(0, newMaxLogs)
  }
}

const setEnabledLevels = (levels: LogLevel[]) => {
  enabledLevels.value = levels
}

const removeOldLogs = (olderThan: Date) => {
  logs.value = logs.value.filter(log => log.timestamp > olderThan)
}

const exportLogs = () => {
  const dataStr = JSON.stringify(logs.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `logs-${new Date().toISOString()}.json`
  link.click()
  
  URL.revokeObjectURL(url)
}

// Logging methods
const debug = (messageOrOptions: string | { message: string } & LogOptions) => {
  if (!enabledLevels.value.includes('debug')) return

  const { message, ...options } = normalizeLogInput(messageOrOptions)
  const logEntry = createLogEntry('debug', message, options)

  addLog(logEntry)
  console.debug(`[DEBUG] ${message}`, options.context)
}

const info = (messageOrOptions: string | { message: string } & LogOptions) => {
  if (!enabledLevels.value.includes('info')) return

  const { message, ...options } = normalizeLogInput(messageOrOptions)
  const logEntry = createLogEntry('info', message, options)

  addLog(logEntry)
  console.info(`[INFO] ${message}`, options.context)

  // Send to analytics in production
  if (import.meta.env.PROD) {
    sendToAnalytics('info', message, options.context)
  }
}

const warn = (messageOrOptions: string | { message: string } & LogOptions) => {
  if (!enabledLevels.value.includes('warn')) return

  const { message, ...options } = normalizeLogInput(messageOrOptions)
  const logEntry = createLogEntry('warn', message, options)

  addLog(logEntry)
  console.warn(`[WARN] ${message}`, options.context)

  // Send to monitoring service
  if (import.meta.env.PROD) {
    sendToMonitoring('warn', message, options.context)
  }
}

const error = (messageOrOptions: string | { message: string } & LogOptions) => {
  if (!enabledLevels.value.includes('error')) return

  const { message, ...options } = normalizeLogInput(messageOrOptions)
  const logEntry = createLogEntry('error', message, options)

  addLog(logEntry)
  console.error(`[ERROR] ${message}`, options.context, options.stack)

  // Send to error tracking service
  if (import.meta.env.PROD) {
    sendToErrorTracking('error', message, options)
  }
}

const fatal = (messageOrOptions: string | { message: string } & LogOptions) => {
  if (!enabledLevels.value.includes('fatal')) return

  const { message, ...options } = normalizeLogInput(messageOrOptions)
  const logEntry = createLogEntry('fatal', message, options)

  addLog(logEntry)
  console.error(`[FATAL] ${message}`, options.context, options.stack)

  // Always send fatal errors to tracking service
  sendToErrorTracking('fatal', message, options)
}

// Helper functions
function normalizeLogInput(input: string | { message: string } & LogOptions) {
  if (typeof input === 'string') {
    return { message: input }
  }
  return input
}

function createLogEntry(level: LogLevel, message: string, options: LogOptions): LogEntry {
  return {
    id: Date.now().toString(),
    level,
    message,
    timestamp: new Date(),
    component: options.component,
    context: options.context,
    stack: options.stack,
    userId: getCurrentUserId(),
    sessionId: getSessionId()
  }
}

function getCurrentUserId(): string | number | undefined {
  // Get user ID from auth store if available
  // This would need to be implemented based on your auth store
  return undefined
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = Date.now().toString()
    sessionStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

function sendToAnalytics(level: string, message: string, context?: any) {
  // Implement analytics integration (e.g., Google Analytics)
  // gtag('event', 'log', { level, message, context })
}

function sendToMonitoring(level: string, message: string, context?: any) {
  // Implement monitoring integration (e.g., Datadog, New Relic)
  // datadog.log(level, message, context)
}

function sendToErrorTracking(level: string, message: string, options: LogOptions) {
  // Implement error tracking integration (e.g., Sentry)
  // Sentry.captureMessage(message, {
  //   level: level as SeverityLevel,
  //   extra: options.context,
  //   tags: { component: options.component }
  // })
}

// Return all the methods and state
return {
  // State
  logs,
  maxLogs,
  enabledLevels,
  persistLogs,
  
  // Getters
  allLogs,
  logsByLevel,
  recentLogs,
  logsByTimeRange,
  logsByComponent,
  errorLogs,
  countByLevel,
  
  // Actions
  addLog,
  clearLogs,
  setMaxLogs,
  setEnabledLevels,
  removeOldLogs,
  exportLogs,
  
  // Logging methods
  debug,
  info,
  warn,
  error,
  fatal
}
```

## Usage in Components

### Basic Usage

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useLogStore } from '@/stores/logStore'

const logStore = useLogStore()

onMounted(() => {
  // Simple string message
  logStore.info('Component mounted successfully')

  // With context
  logStore.info({
    message: 'User action performed',
    context: {
      action: 'button_click',
      buttonId: 'submit-btn',
      timestamp: new Date().toISOString()
    }
  })

  // With component name
  logStore.debug({
    message: 'Debug information',
    component: 'DashboardPage',
    context: { data: 'some debug data' }
  })
})

const handleError = (error: Error) => {
  logStore.error({
    message: error.message,
    component: 'DashboardPage',
    stack: error.stack,
    context: {
      additionalInfo: 'Any relevant context'
    }
  })
}
</script>
```

### Using Composable (Recommended)

**File**: `src/composables/useLogger.ts`

```typescript
// src/composables/useLogger.ts
import { useLogStore } from '@/stores/logStore'
import { getCurrentInstance } from 'vue'

export function useLogger() {
  const logStore = useLogStore()
  const instance = getCurrentInstance()
  const componentName = instance?.type.name || 'Unknown'

  const debug = (message: string, context?: Record<string, any>) => {
    logStore.debug({
      message,
      component: componentName,
      context
    })
  }

  const info = (message: string, context?: Record<string, any>) => {
    logStore.info({
      message,
      component: componentName,
      context
    })
  }

  const warn = (message: string, context?: Record<string, any>) => {
    logStore.warn({
      message,
      component: componentName,
      context
    })
  }

  const error = (message: string, errorObj?: Error, context?: Record<string, any>) => {
    logStore.error({
      message,
      component: componentName,
      stack: errorObj?.stack,
      context: {
        ...context,
        errorName: errorObj?.name
      }
    })
  }

  const fatal = (message: string, errorObj?: Error, context?: Record<string, any>) => {
    logStore.fatal({
      message,
      component: componentName,
      stack: errorObj?.stack,
      context
    })
  }

  return {
    debug,
    info,
    warn,
    error,
    fatal
  }
}
```

**Usage in Component**:

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useLogger } from '@/composables/useLogger'

const logger = useLogger()

onMounted(() => {
  logger.info('Component mounted')
})

const handleSubmit = async () => {
  try {
    logger.debug('Starting form submission', { formId: 'user-form' })
    
    // Form submission logic
    
    logger.info('Form submitted successfully', { 
      formId: 'user-form',
      userId: 123 
    })
  } catch (error) {
    logger.error('Form submission failed', error as Error, {
      formId: 'user-form'
    })
  }
}

const handleCriticalError = (error: Error) => {
  logger.fatal('Critical system error', error, {
    recoverable: false
  })
}
</script>
```

## Log Viewer Component

Create a component to view logs in development.

**File**: `src/components/dev/LogViewer.vue`

```vue
<template>
  <div v-if="isDevelopment" class="log-viewer">
    <div class="log-viewer__header">
      <h3>Application Logs</h3>
      <div class="log-viewer__controls">
        <select v-model="selectedLevel" class="log-viewer__filter">
          <option value="">All Levels</option>
          <option value="debug">Debug</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
          <option value="fatal">Fatal</option>
        </select>********
        <button @click="clearLogs" class="btn-clear">Clear</button>
        <button @click="exportLogs" class="btn-export">Export</button>
        <button @click="isVisible = !isVisible" class="btn-toggle">
          {{ isVisible ? 'Hide' : 'Show' }}
        </button>
      </div>
    </div>

    <div v-if="isVisible" class="log-viewer__content">
      <div
        v-for="log in filteredLogs"
        :key="log.id"
        :class="['log-entry', `log-entry--${log.level}`]"
      >
        <div class="log-entry__header">
          <span class="log-entry__level">{{ log.level.toUpperCase() }}</span>
          <span class="log-entry__time">
            {{ formatTime(log.timestamp) }}
          </span>
          <span v-if="log.component" class="log-entry__component">
            {{ log.component }}
          </span>
        </div>
        <div class="log-entry__message">{{ log.message }}</div>
        <div v-if="log.context" class="log-entry__context">
          <pre>{{ JSON.stringify(log.context, null, 2) }}</pre>
        </div>
        <div v-if="log.stack" class="log-entry__stack">
          <pre>{{ log.stack }}</pre>
        </div>
      </div>

      <div v-if="filteredLogs.length === 0" class="log-viewer__empty">
        No logs to display
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLogStore } from '@/stores/logStore'

const logStore = useLogStore()
const isDevelopment = import.meta.env.DEV
const isVisible = ref(false)
const selectedLevel = ref('')

const allLogs = computed(() => logStore.allLogs)

const filteredLogs = computed(() => {
  if (!selectedLevel.value) return allLogs.value
  return logStore.logsByLevel(selectedLevel.value as any)
})

const formatTime = (timestamp: Date) => {
  return new Date(timestamp).toLocaleTimeString()
}

const clearLogs = () => {
  logStore.clearLogs()
}

const exportLogs = () => {
  logStore.exportLogs()
}
</script>

<style scoped>
.log-viewer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  z-index: 9999;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
}

.log-viewer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #252526;
  border-bottom: 1px solid #3e3e42;
}

.log-viewer__controls {
  display: flex;
  gap: 0.5rem;
}

.log-viewer__content {
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
}

.log-entry {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-left: 3px solid;
  background: #2d2d30;
}

.log-entry--debug {
  border-left-color: #808080;
}

.log-entry--info {
  border-left-color: #4fc3f7;
}

.log-entry--warn {
  border-left-color: #ffb74d;
}

.log-entry--error {
  border-left-color: #f44336;
}

.log-entry--fatal {
  border-left-color: #d32f2f;
  background: #3d1f1f;
}

.log-entry__header {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.25rem;
  font-size: 11px;
}

.log-entry__level {
  font-weight: bold;
}

.log-entry__message {
  margin-bottom: 0.25rem;
}

pre {
  margin: 0.25rem 0 0;
  padding: 0.5rem;
  background: #1e1e1e;
  overflow-x: auto;
}
</style>
```

## Best Practices

### DO ✅

- Use appropriate log levels
- Include relevant context with logs
- Log user actions for analytics
- Log errors with stack traces
- Use the logger composable for automatic component names
- Clear old logs periodically in production
- Export logs for debugging
- Send critical errors to monitoring services
- Use structured logging (objects, not just strings)
- Use Pinia stores for centralized logging management
- Implement proper log rotation and cleanup
- Use environment-specific log levels

### DON'T ❌

- Don't log sensitive information (passwords, tokens, PII)
- Don't log excessively in tight loops
- Don't log in production without levels filter
- Don't forget to remove debug logs before deploying
- Don't log full objects with circular references
- Don't block the main thread with logging
- Don't rely solely on console.log
- Don't forget to clean up log listeners
- Don't store logs indefinitely in memory

## Production Logging Integration

### Sentry Integration Example

```typescript
// src/services/sentry.service.ts
import * as Sentry from '@sentry/vue'

export const initSentry = (app: App, router: Router) => {
  if (import.meta.env.PROD) {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router)
        })
      ],
      tracesSampleRate: 0.2,
      logErrors: true
    })
  }
}
```

---

[← Back to Error Handling](./error-handling.md) | [Next: Utility Functions →](./utility.md)

