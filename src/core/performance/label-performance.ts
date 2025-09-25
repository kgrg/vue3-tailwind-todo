/**
 * Label Performance Optimization
 * Provides performance utilities and optimizations for label components
 */

export interface PerformanceOptions {
  debounceDelay?: number
  throttleDelay?: number
  maxItems?: number
  enableVirtualization?: boolean
  enableMemoization?: boolean
}

export class LabelPerformance {
  private options: PerformanceOptions

  constructor(options: PerformanceOptions = {}) {
    this.options = {
      debounceDelay: 150,
      throttleDelay: 100,
      maxItems: 1000,
      enableVirtualization: true,
      enableMemoization: true,
      ...options,
    }
  }

  /**
   * Debounces a function call
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number = this.options.debounceDelay!
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null

    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  /**
   * Throttles a function call
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number = this.options.throttleDelay!
  ): (...args: Parameters<T>) => void {
    let lastCall = 0
    let timeoutId: NodeJS.Timeout | null = null

    return (...args: Parameters<T>) => {
      const now = Date.now()

      if (now - lastCall >= delay) {
        lastCall = now
        func(...args)
      } else {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(
          () => {
            lastCall = Date.now()
            func(...args)
          },
          delay - (now - lastCall)
        )
      }
    }
  }

  /**
   * Creates a memoized function
   */
  memoize<T extends (...args: any[]) => any>(
    func: T,
    keyGenerator?: (...args: Parameters<T>) => string
  ): T {
    if (!this.options.enableMemoization) {
      return func
    }

    const cache = new Map<string, ReturnType<T>>()

    return ((...args: Parameters<T>) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)

      if (cache.has(key)) {
        return cache.get(key)
      }

      const result = func(...args)
      cache.set(key, result)
      return result
    }) as T
  }

  /**
   * Creates a computed map for efficient lookups
   */
  createComputedMap<T, K>(items: T[], keyExtractor: (item: T) => K): Map<K, T> {
    const map = new Map<K, T>()

    for (const item of items) {
      const key = keyExtractor(item)
      map.set(key, item)
    }

    return map
  }

  /**
   * Creates a computed set for efficient membership checks
   */
  createComputedSet<T>(items: T[], keyExtractor?: (item: T) => any): Set<T | any> {
    const set = new Set<T | any>()

    for (const item of items) {
      const key = keyExtractor ? keyExtractor(item) : item
      set.add(key)
    }

    return set
  }

  /**
   * Implements virtual scrolling for large lists
   */
  createVirtualScroller<T>(options: {
    items: T[]
    containerHeight: number
    itemHeight: number
    overscan?: number
  }) {
    const { items, containerHeight, itemHeight, overscan = 5 } = options
    const totalHeight = items.length * itemHeight
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const overscanCount = overscan * 2

    return {
      getVisibleItems: (scrollTop: number) => {
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
        const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscanCount)

        return {
          items: items.slice(startIndex, endIndex + 1),
          startIndex,
          endIndex,
          totalHeight,
          offsetY: startIndex * itemHeight,
        }
      },
    }
  }

  /**
   * Implements search optimization
   */
  createSearchOptimizer<T>(items: T[], searchFields: (keyof T)[]) {
    const searchIndex = new Map<string, Set<number>>()

    // Build search index
    items.forEach((item, index) => {
      searchFields.forEach(field => {
        const value = String(item[field]).toLowerCase()
        const words = value.split(/\s+/)

        words.forEach(word => {
          if (word.length > 0) {
            if (!searchIndex.has(word)) {
              searchIndex.set(word, new Set())
            }
            searchIndex.get(word)!.add(index)
          }
        })
      })
    })

    return {
      search: (query: string) => {
        if (!query.trim()) {
          return items
        }

        const searchWords = query.toLowerCase().split(/\s+/)
        const matchingIndices = new Set<number>()

        searchWords.forEach(word => {
          if (word.length > 0) {
            const indices = searchIndex.get(word)
            if (indices) {
              if (matchingIndices.size === 0) {
                indices.forEach(index => matchingIndices.add(index))
              } else {
                // Intersection for AND search
                const currentIndices = new Set(matchingIndices)
                matchingIndices.clear()
                currentIndices.forEach(index => {
                  if (indices.has(index)) {
                    matchingIndices.add(index)
                  }
                })
              }
            }
          }
        })

        return Array.from(matchingIndices).map(index => items[index])
      },
    }
  }

  /**
   * Implements filter optimization
   */
  createFilterOptimizer<T>(items: T[], filterFunctions: Array<(item: T) => boolean>) {
    return {
      filter: (item: T) => {
        return filterFunctions.every(filterFn => filterFn(item))
      },

      filterAll: () => {
        return items.filter(item => filterFunctions.every(filterFn => filterFn(item)))
      },
    }
  }

  /**
   * Implements sort optimization
   */
  createSortOptimizer<T>(items: T[], sortFunction: (a: T, b: T) => number) {
    return {
      sort: () => {
        return [...items].sort(sortFunction)
      },

      sortInPlace: () => {
        items.sort(sortFunction)
        return items
      },
    }
  }

  /**
   * Implements pagination optimization
   */
  createPaginationOptimizer<T>(items: T[], pageSize: number) {
    const totalPages = Math.ceil(items.length / pageSize)

    return {
      getPage: (page: number) => {
        const startIndex = (page - 1) * pageSize
        const endIndex = Math.min(startIndex + pageSize, items.length)

        return {
          items: items.slice(startIndex, endIndex),
          page,
          totalPages,
          totalItems: items.length,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        }
      },

      getTotalPages: () => totalPages,
    }
  }

  /**
   * Implements batch processing
   */
  createBatchProcessor<T>(items: T[], batchSize: number = 100) {
    return {
      processBatches: async (processor: (batch: T[]) => Promise<void>) => {
        for (let i = 0; i < items.length; i += batchSize) {
          const batch = items.slice(i, i + batchSize)
          await processor(batch)
        }
      },

      processBatchesSync: (processor: (batch: T[]) => void) => {
        for (let i = 0; i < items.length; i += batchSize) {
          const batch = items.slice(i, i + batchSize)
          processor(batch)
        }
      },
    }
  }

  /**
   * Implements performance monitoring
   */
  createPerformanceMonitor() {
    const metrics = new Map<string, number[]>()

    return {
      start: (name: string) => {
        const start = performance.now()
        return () => {
          const end = performance.now()
          const duration = end - start

          if (!metrics.has(name)) {
            metrics.set(name, [])
          }
          metrics.get(name)!.push(duration)
        }
      },

      getMetrics: () => {
        const result: Record<string, { avg: number; min: number; max: number; count: number }> = {}

        metrics.forEach((durations, name) => {
          const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length
          const min = Math.min(...durations)
          const max = Math.max(...durations)

          result[name] = { avg, min, max, count: durations.length }
        })

        return result
      },

      clear: () => {
        metrics.clear()
      },
    }
  }
}

// Export singleton instance
export const labelPerformance = new LabelPerformance()

// Utility functions
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 150
): (...args: Parameters<T>) => void {
  return labelPerformance.debounce(func, delay)
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 100
): (...args: Parameters<T>) => void {
  return labelPerformance.throttle(func, delay)
}

export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  return labelPerformance.memoize(func, keyGenerator)
}

export function createComputedMap<T, K>(items: T[], keyExtractor: (item: T) => K): Map<K, T> {
  return labelPerformance.createComputedMap(items, keyExtractor)
}

export function createComputedSet<T>(items: T[], keyExtractor?: (item: T) => any): Set<T | any> {
  return labelPerformance.createComputedSet(items, keyExtractor)
}

export function createSearchOptimizer<T>(items: T[], searchFields: (keyof T)[]) {
  return labelPerformance.createSearchOptimizer(items, searchFields)
}

export function createFilterOptimizer<T>(items: T[], filterFunctions: Array<(item: T) => boolean>) {
  return labelPerformance.createFilterOptimizer(items, filterFunctions)
}

export function createSortOptimizer<T>(items: T[], sortFunction: (a: T, b: T) => number) {
  return labelPerformance.createSortOptimizer(items, sortFunction)
}

export function createPaginationOptimizer<T>(items: T[], pageSize: number) {
  return labelPerformance.createPaginationOptimizer(items, pageSize)
}

export function createBatchProcessor<T>(items: T[], batchSize: number = 100) {
  return labelPerformance.createBatchProcessor(items, batchSize)
}

export function createPerformanceMonitor() {
  return labelPerformance.createPerformanceMonitor()
}
