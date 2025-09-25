/**
 * Local Storage Persistence
 * Provides localStorage abstraction with error handling and fallbacks
 */

import { createErrorContext, StorageError } from '@/core/utils/error-handler'

export interface StorageOptions {
  prefix?: string
  version?: string
  fallback?: any
}

export class LocalStorageManager {
  private prefix: string
  private version: string

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix || ''
    this.version = options.version || 'v1'
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}:${this.version}`
  }

  private isAvailable(): boolean {
    try {
      const testKey = '__localStorage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  setItem(key: string, value: any): void {
    if (!this.isAvailable()) {
      throw new StorageError('localStorage is not available', createErrorContext('set_item'))
    }

    try {
      const serialized = JSON.stringify({
        data: value,
        timestamp: new Date().toISOString(),
        version: this.version,
      })
      localStorage.setItem(this.getKey(key), serialized)
    } catch (error) {
      throw new StorageError(
        `Failed to save ${key} to localStorage`,
        createErrorContext('set_item'),
        error
      )
    }
  }

  getItem<T = any>(key: string, fallback?: T): T | null {
    if (!this.isAvailable()) {
      return fallback || null
    }

    try {
      const item = localStorage.getItem(this.getKey(key))
      if (!item) {
        return fallback || null
      }

      const parsed = JSON.parse(item)

      // Check version compatibility
      if (parsed.version !== this.version) {
        console.warn(`Version mismatch for ${key}: expected ${this.version}, got ${parsed.version}`)
        return fallback || null
      }

      return parsed.data
    } catch (error) {
      console.error(`Failed to parse ${key} from localStorage:`, error)
      return fallback || null
    }
  }

  removeItem(key: string): void {
    if (!this.isAvailable()) {
      return
    }

    try {
      localStorage.removeItem(this.getKey(key))
    } catch (error) {
      throw new StorageError(
        `Failed to remove ${key} from localStorage`,
        createErrorContext('remove_item'),
        error
      )
    }
  }

  clear(): void {
    if (!this.isAvailable()) {
      return
    }

    try {
      const keys = Object.keys(localStorage)
      const prefixedKeys = keys.filter(key => key.startsWith(this.prefix))

      prefixedKeys.forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      throw new StorageError('Failed to clear localStorage', createErrorContext('clear'), error)
    }
  }

  getSize(): number {
    if (!this.isAvailable()) {
      return 0
    }

    try {
      let size = 0
      const keys = Object.keys(localStorage)
      const prefixedKeys = keys.filter(key => key.startsWith(this.prefix))

      prefixedKeys.forEach(key => {
        const value = localStorage.getItem(key)
        if (value) {
          size += key.length + value.length
        }
      })

      return size
    } catch {
      return 0
    }
  }

  getKeys(): string[] {
    if (!this.isAvailable()) {
      return []
    }

    try {
      const keys = Object.keys(localStorage)
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, '').replace(`:${this.version}`, ''))
    } catch {
      return []
    }
  }

  hasItem(key: string): boolean {
    if (!this.isAvailable()) {
      return false
    }

    try {
      return localStorage.getItem(this.getKey(key)) !== null
    } catch {
      return false
    }
  }

  getItemInfo(key: string): { timestamp: string; version: string; size: number } | null {
    if (!this.isAvailable()) {
      return null
    }

    try {
      const item = localStorage.getItem(this.getKey(key))
      if (!item) {
        return null
      }

      const parsed = JSON.parse(item)
      return {
        timestamp: parsed.timestamp,
        version: parsed.version,
        size: item.length,
      }
    } catch {
      return null
    }
  }
}

// Export singleton instances
export const labelsStorage = new LocalStorageManager({
  prefix: 'labels:',
  version: 'v1',
})

export const tasksStorage = new LocalStorageManager({
  prefix: 'tasks:',
  version: 'v1',
})

export const appStorage = new LocalStorageManager({
  prefix: 'app:',
  version: 'v1',
})

// Utility functions
export function createStorageManager(options: StorageOptions = {}): LocalStorageManager {
  return new LocalStorageManager(options)
}

export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export function getStorageQuota(): { used: number; available: number } {
  if (!isLocalStorageAvailable()) {
    return { used: 0, available: 0 }
  }

  try {
    let used = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length
      }
    }

    // Estimate available space (most browsers have 5-10MB limit)
    const estimatedLimit = 5 * 1024 * 1024 // 5MB
    const available = Math.max(0, estimatedLimit - used)

    return { used, available }
  } catch {
    return { used: 0, available: 0 }
  }
}

export function cleanupOldVersions(prefix: string): void {
  if (!isLocalStorageAvailable()) {
    return
  }

  try {
    const keys = Object.keys(localStorage)
    const prefixedKeys = keys.filter(key => key.startsWith(prefix))

    prefixedKeys.forEach(key => {
      // Remove keys that don't match current version pattern
      if (!key.includes(':v1')) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Failed to cleanup old versions:', error)
  }
}
