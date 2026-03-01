# Custom Environment

## Overview

Environment configuration allows you to customize your Vue 3 + Tailwind Todo application behavior across different environments (development, staging, production). This guide covers environment variables, configuration management, and best practices for the JustDo Vue application.

## Guiding Principles

1. **Environment Separation**: Clear distinction between dev, staging, and production
2. **Security First**: Never commit secrets to version control
3. **Type Safety**: Use TypeScript for environment variables
4. **Validation**: Validate environment variables at build time
5. **Documentation**: Document all environment variables

## Environment Files

### File Structure

```bash
project-root/
  ├── .env                    # Default environment variables
  ├── .env.local              # Local overrides (not committed)
  ├── .env.development        # Development environment
  ├── .env.staging            # Staging environment
  ├── .env.production         # Production environment
  ├── .env.example            # Template (committed to repo)
  ├── vite.config.ts          # Vite configuration
  └── tailwind.config.ts      # Tailwind CSS configuration
```

### Environment Variable Naming

Vite uses `VITE_` prefix for environment variables accessible in client-side code.

**File**: `.env.example`

```bash
# Application
VITE_APP_NAME=JustDo Vue
VITE_APP_VERSION=0.0.0
VITE_APP_ENV=development

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Authentication
VITE_AUTH_TOKEN_KEY=auth_token
VITE_AUTH_REFRESH_TOKEN_KEY=refresh_token

# Features
VITE_FEATURE_ANALYTICS=false
VITE_FEATURE_ERROR_TRACKING=false
VITE_FEATURE_DEBUG_MODE=true

# External Services
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=

# URLs
VITE_APP_URL=http://localhost:5173
VITE_FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:3000
```

### Development Environment

**File**: `.env.development`

```bash
# Application
VITE_APP_NAME=JustDo Vue (Dev)
VITE_APP_ENV=development

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Features
VITE_FEATURE_ANALYTICS=false
VITE_FEATURE_ERROR_TRACKING=false
VITE_FEATURE_DEBUG_MODE=true

# Debug
VITE_LOG_LEVEL=debug
VITE_ENABLE_DEVTOOLS=true
```

### Staging Environment

**File**: `.env.staging`

```bash
# Application
VITE_APP_NAME=JustDo Vue (Staging)
VITE_APP_ENV=staging

# API Configuration
VITE_API_BASE_URL=https://staging-api.example.com/api
VITE_API_TIMEOUT=30000

# Features
VITE_FEATURE_ANALYTICS=true
VITE_FEATURE_ERROR_TRACKING=true
VITE_FEATURE_DEBUG_MODE=false

# External Services
VITE_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-1
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# URLs
VITE_APP_URL=https://staging.example.com
VITE_FRONTEND_URL=https://staging.example.com
VITE_BACKEND_URL=https://staging-api.example.com
```

### Production Environment

**File**: `.env.production`

```bash
# Application
VITE_APP_NAME=JustDo Vue
VITE_APP_ENV=production

# API Configuration
VITE_API_BASE_URL=https://api.example.com/api
VITE_API_TIMEOUT=30000

# Features
VITE_FEATURE_ANALYTICS=true
VITE_FEATURE_ERROR_TRACKING=true
VITE_FEATURE_DEBUG_MODE=false

# External Services
VITE_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-2
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# URLs
VITE_APP_URL=https://example.com
VITE_FRONTEND_URL=https://example.com
VITE_BACKEND_URL=https://api.example.com

# Performance
VITE_ENABLE_PWA=true
VITE_ENABLE_COMPRESSION=true
```

## TypeScript Configuration

### Environment Types

**File**: `src/types/env.d.ts`

```typescript
// src/types/env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string

  // Authentication
  readonly VITE_AUTH_TOKEN_KEY: string
  readonly VITE_AUTH_REFRESH_TOKEN_KEY: string

  // Application
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'

  // Features
  readonly VITE_FEATURE_ANALYTICS: string
  readonly VITE_FEATURE_ERROR_TRACKING: string
  readonly VITE_FEATURE_DEBUG_MODE: string

  // External Services
  readonly VITE_GOOGLE_ANALYTICS_ID?: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string

  // URLs
  readonly VITE_APP_URL: string
  readonly VITE_FRONTEND_URL: string
  readonly VITE_BACKEND_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### Environment Configuration Module

**File**: `src/config/env.config.ts`

```typescript
// src/config/env.config.ts

/**
 * Parse boolean from string
 */
function parseBoolean(value: string | undefined, defaultValue = false): boolean {
  if (!value) return defaultValue
  return value.toLowerCase() === 'true' || value === '1'
}

/**
 * Parse number from string
 */
function parseNumber(value: string | undefined, defaultValue = 0): number {
  if (!value) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Environment configuration
 */
export const env = {
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
  appEnv: import.meta.env.VITE_APP_ENV,

  // API
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    timeout: parseNumber(import.meta.env.VITE_API_TIMEOUT, 30000)
  },

  // Authentication
  auth: {
    tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
    refreshTokenKey: import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || 'refresh_token'
  },

  // Application
  app: {
    name: import.meta.env.VITE_APP_NAME || 'My Vue App',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    url: import.meta.env.VITE_APP_URL
  },

  // Features
  features: {
    analytics: parseBoolean(import.meta.env.VITE_FEATURE_ANALYTICS),
    errorTracking: parseBoolean(import.meta.env.VITE_FEATURE_ERROR_TRACKING),
    debugMode: parseBoolean(import.meta.env.VITE_FEATURE_DEBUG_MODE)
  },

  // External Services
  services: {
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
    stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  },

  // URLs
  urls: {
    frontend: import.meta.env.VITE_FRONTEND_URL,
    backend: import.meta.env.VITE_BACKEND_URL
  }
} as const

/**
 * Validate required environment variables
 */
export function validateEnv(): void {
  const required = [
    'VITE_API_BASE_URL',
    'VITE_APP_NAME',
    'VITE_APP_ENV'
  ]

  const missing = required.filter(key => !import.meta.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}`
    )
  }

  console.log('✓ Environment variables validated')
}

/**
 * Get environment info
 */
export function getEnvInfo() {
  return {
    mode: env.mode,
    appEnv: env.appEnv,
    isDevelopment: env.isDevelopment,
    isProduction: env.isProduction,
    appName: env.app.name,
    appVersion: env.app.version,
    apiBaseUrl: env.api.baseUrl
  }
}

export default env
```

### Application Configuration

**File**: `src/config/app.config.ts`

```typescript
// src/config/app.config.ts
import { env } from './env.config'

export const appConfig = {
  // Application metadata
  name: env.app.name,
  version: env.app.version,
  description: 'Vue 3 Application',

  // API configuration
  api: {
    baseUrl: env.api.baseUrl,
    timeout: env.api.timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },

  // Authentication configuration
  auth: {
    tokenKey: env.auth.tokenKey,
    refreshTokenKey: env.auth.refreshTokenKey,
    tokenExpiry: 3600000, // 1 hour
    refreshTokenExpiry: 604800000 // 7 days
  },

  // Router configuration
  router: {
    baseUrl: '/',
    mode: 'history' as const,
    scrollBehavior: 'smooth' as const
  },

  // UI configuration
  ui: {
    theme: 'light' as 'light' | 'dark',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MMM DD, YYYY',
    timeFormat: 'HH:mm:ss'
  },

  // Feature flags
  features: {
    analytics: env.features.analytics,
    errorTracking: env.features.errorTracking,
    debugMode: env.features.debugMode,
    darkMode: true,
    notifications: true,
    offline: false
  },

  // External services
  services: {
    googleAnalytics: {
      enabled: !!env.services.googleAnalyticsId,
      measurementId: env.services.googleAnalyticsId
    },
    sentry: {
      enabled: !!env.services.sentryDsn,
      dsn: env.services.sentryDsn,
      environment: env.appEnv,
      tracesSampleRate: env.isProduction ? 0.1 : 1.0
    },
    stripe: {
      publishableKey: env.services.stripePublishableKey
    }
  },

  // Storage configuration
  storage: {
    prefix: 'app_',
    version: '1'
  },

  // Logging configuration
  logging: {
    enabled: true,
    level: env.isDevelopment ? 'debug' : 'info',
    maxLogs: env.isProduction ? 100 : 500,
    persistLogs: env.isProduction
  },

  // Performance configuration
  performance: {
    enableCache: env.isProduction,
    cacheDuration: 300000, // 5 minutes
    lazyLoadImages: true,
    enableCompression: env.isProduction
  }
} as const

export type AppConfig = typeof appConfig

export default appConfig
```

## Usage in Application

### Main Entry Point

**File**: `src/main.ts`

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import { env, validateEnv } from './config/env.config'
import { appConfig } from './config/app.config'

// Validate environment variables
try {
  validateEnv()
} catch (error) {
  console.error('Environment validation failed:', error)
  throw error
}

// Log environment info in development
if (env.isDevelopment) {
  console.log('Environment:', env.appEnv)
  console.log('API URL:', env.api.baseUrl)
  console.log('Features:', env.features)
}

const app = createApp(App)

app.use(store)
app.use(router)

// Make config available globally
app.config.globalProperties.$config = appConfig

app.mount('#app')
```

### Using Environment in Components

```vue
<script setup lang="ts">
import { env } from '@/config/env.config'
import { appConfig } from '@/config/app.config'

// Access environment variables
const apiUrl = env.api.baseUrl
const appName = env.app.name

// Access feature flags
const analyticsEnabled = appConfig.features.analytics

// Conditional rendering based on environment
const showDebugInfo = env.isDevelopment

console.log('Running in:', env.appEnv)
</script>

<template>
  <div>
    <h1>{{ appConfig.name }}</h1>
    <p>Version: {{ appConfig.version }}</p>
    
    <div v-if="showDebugInfo" class="debug-info">
      <h3>Debug Information</h3>
      <p>API URL: {{ apiUrl }}</p>
      <p>Environment: {{ env.appEnv }}</p>
    </div>
  </div>
</template>
```

### Using Configuration in Services

```typescript
// src/services/api.service.ts
import axios from 'axios'
import { env } from '@/config/env.config'
import { appConfig } from '@/config/app.config'

const apiClient = axios.create({
  baseURL: env.api.baseUrl,
  timeout: env.api.timeout,
  headers: appConfig.api.headers
})

export default apiClient
```

### Feature Flags

```typescript
// src/composables/useFeatureFlag.ts
import { computed } from 'vue'
import { appConfig } from '@/config/app.config'

export function useFeatureFlag(featureName: keyof typeof appConfig.features) {
  const isEnabled = computed(() => appConfig.features[featureName])

  return {
    isEnabled
  }
}

// Usage in component
const { isEnabled: analyticsEnabled } = useFeatureFlag('analytics')
```

## Build Configuration

### Vite Configuration

**File**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Tailwind CSS Configuration

**File**: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

### Package Scripts

**File**: `package.json`

```json
{
  "name": "justdo-vue",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@headlessui/vue": "1.7.23",
    "@heroicons/vue": "2.2.0",
    "@tailwindcss/vite": "4.1.4",
    "chart.js": "4.4.9",
    "heroicons": "2.2.0",
    "pinia": "^2.1.7",
    "ts-node": "10.9.2",
    "uuid": "11.1.0",
    "vue": "^3.4.21",
    "vue-router": "4.5.0"
  },
  "devDependencies": {
    "@types/chart.js": "2.9.41",
    "@types/node": "22.14.1",
    "@vitejs/plugin-vue": "^5.0.4",
    "tailwindcss": "^4.1.4",
    "vite": "^5.1.6"
  }
}
```

## Environment-Specific Code

### Conditional Imports

```typescript
// Load different implementations based on environment
const analyticsService = import.meta.env.PROD
  ? await import('./services/analytics.production')
  : await import('./services/analytics.development')

export default analyticsService
```

### Tree Shaking Development Code

```typescript
// This code will be removed in production builds
if (import.meta.env.DEV) {
  // Development-only code
  console.log('Debug info:', data)
  window.__APP_DEBUG__ = true
}
```

## Security Best Practices

### DO ✅

- Use `.env.local` for local secrets (add to `.gitignore`)
- Provide `.env.example` as template
- Validate environment variables at startup
- Use TypeScript for type safety
- Document all environment variables
- Use different keys for different environments
- Never expose sensitive data in client-side code
- Use environment variables for configuration
- Rotate secrets regularly

### DON'T ❌

- Don't commit `.env` files with secrets
- Don't hardcode API keys or secrets
- Don't expose server-side secrets to client
- Don't use same credentials across environments
- Don't skip environment validation
- Don't ignore missing required variables
- Don't use production keys in development

## Deployment

### CI/CD Environment Variables

```yaml
# .github/workflows/deploy.yml
env:
  VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
  VITE_GOOGLE_ANALYTICS_ID: ${{ secrets.GA_ID }}
  VITE_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build with environment
ARG VITE_APP_ENV=production
ENV VITE_APP_ENV=$VITE_APP_ENV

RUN npm run build

# Production image
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Testing with Different Environments

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    env: {
      VITE_API_BASE_URL: 'http://localhost:3000/api',
      VITE_APP_ENV: 'test'
    }
  }
})
```

---

[← Back to Middleware](./milddware.md) | [Back to Index →](./index.md)

