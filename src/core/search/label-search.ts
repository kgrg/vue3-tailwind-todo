/**
 * Label Search Implementation
 * Provides type-ahead search functionality for labels
 */

import { debounce, createSearchOptimizer } from '@/core/performance/label-performance'
import type { Label } from '@/types/label.types'

export interface SearchOptions {
  debounceDelay?: number
  minQueryLength?: number
  maxResults?: number
  searchFields?: (keyof Label)[]
  caseSensitive?: boolean
}

export interface SearchResult {
  items: Label[]
  query: string
  total: number
  hasMore: boolean
}

export class LabelSearch {
  private options: SearchOptions
  private searchOptimizer: ReturnType<typeof createSearchOptimizer<Label>>
  private debouncedSearch: (query: string) => void

  constructor(
    private labels: Label[],
    options: SearchOptions = {}
  ) {
    this.options = {
      debounceDelay: 150,
      minQueryLength: 1,
      maxResults: 50,
      searchFields: ['name', 'color'],
      caseSensitive: false,
      ...options,
    }

    this.searchOptimizer = createSearchOptimizer(labels, this.options.searchFields!)

    this.debouncedSearch = debounce(this.performSearch.bind(this), this.options.debounceDelay!)
  }

  /**
   * Performs a search with debouncing
   */
  search(query: string, callback: (result: SearchResult) => void): void {
    this.debouncedSearch(query, callback)
  }

  /**
   * Performs an immediate search without debouncing
   */
  searchImmediate(query: string): SearchResult {
    return this.performSearch(query)
  }

  /**
   * Performs the actual search
   */
  private performSearch(query: string, callback?: (result: SearchResult) => void): SearchResult {
    const normalizedQuery = this.options.caseSensitive ? query : query.toLowerCase()

    if (normalizedQuery.length < this.options.minQueryLength!) {
      const result: SearchResult = {
        items: [],
        query,
        total: 0,
        hasMore: false,
      }
      callback?.(result)
      return result
    }

    const searchResults = this.searchOptimizer.search(normalizedQuery)
    const limitedResults = searchResults.slice(0, this.options.maxResults!)

    const result: SearchResult = {
      items: limitedResults,
      query,
      total: searchResults.length,
      hasMore: searchResults.length > this.options.maxResults!,
    }

    callback?.(result)
    return result
  }

  /**
   * Updates the labels array
   */
  updateLabels(labels: Label[]): void {
    this.labels = labels
    this.searchOptimizer = createSearchOptimizer(labels, this.options.searchFields!)
  }

  /**
   * Gets search suggestions based on partial query
   */
  getSuggestions(query: string, maxSuggestions: number = 5): string[] {
    if (query.length < this.options.minQueryLength!) {
      return []
    }

    const normalizedQuery = this.options.caseSensitive ? query : query.toLowerCase()

    const suggestions = new Set<string>()

    this.labels.forEach(label => {
      const name = this.options.caseSensitive ? label.name : label.name.toLowerCase()

      if (name.includes(normalizedQuery)) {
        // Find the position of the query in the name
        const index = name.indexOf(normalizedQuery)
        if (index >= 0) {
          // Extract the word containing the query
          const words = label.name.split(/\s+/)
          const matchingWord = words.find(word =>
            (this.options.caseSensitive ? word : word.toLowerCase()).includes(normalizedQuery)
          )

          if (matchingWord) {
            suggestions.add(matchingWord)
          }
        }
      }
    })

    return Array.from(suggestions).slice(0, maxSuggestions)
  }

  /**
   * Gets popular search terms
   */
  getPopularTerms(maxTerms: number = 10): string[] {
    const termCounts = new Map<string, number>()

    this.labels.forEach(label => {
      const words = label.name.split(/\s+/)
      words.forEach(word => {
        if (word.length > 2) {
          const normalizedWord = this.options.caseSensitive ? word : word.toLowerCase()

          termCounts.set(normalizedWord, (termCounts.get(normalizedWord) || 0) + 1)
        }
      })
    })

    return Array.from(termCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxTerms)
      .map(([term]) => term)
  }

  /**
   * Gets search statistics
   */
  getSearchStats(): {
    totalLabels: number
    averageNameLength: number
    uniqueWords: number
    mostCommonWords: Array<{ word: string; count: number }>
  } {
    const wordCounts = new Map<string, number>()
    let totalNameLength = 0

    this.labels.forEach(label => {
      totalNameLength += label.name.length
      const words = label.name.split(/\s+/)
      words.forEach(word => {
        if (word.length > 0) {
          const normalizedWord = this.options.caseSensitive ? word : word.toLowerCase()
          wordCounts.set(normalizedWord, (wordCounts.get(normalizedWord) || 0) + 1)
        }
      })
    })

    const mostCommonWords = Array.from(wordCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }))

    return {
      totalLabels: this.labels.length,
      averageNameLength: this.labels.length > 0 ? totalNameLength / this.labels.length : 0,
      uniqueWords: wordCounts.size,
      mostCommonWords,
    }
  }

  /**
   * Clears search cache
   */
  clearCache(): void {
    // Reset the search optimizer
    this.searchOptimizer = createSearchOptimizer(this.labels, this.options.searchFields!)
  }

  /**
   * Updates search options
   */
  updateOptions(options: Partial<SearchOptions>): void {
    this.options = { ...this.options, ...options }

    // Recreate debounced search with new delay
    this.debouncedSearch = debounce(this.performSearch.bind(this), this.options.debounceDelay!)
  }
}

// Export utility functions
export function createLabelSearch(labels: Label[], options?: SearchOptions): LabelSearch {
  return new LabelSearch(labels, options)
}

export function searchLabels(
  labels: Label[],
  query: string,
  options?: SearchOptions
): SearchResult {
  const search = new LabelSearch(labels, options)
  return search.searchImmediate(query)
}

export function getLabelSuggestions(
  labels: Label[],
  query: string,
  maxSuggestions: number = 5,
  options?: SearchOptions
): string[] {
  const search = new LabelSearch(labels, options)
  return search.getSuggestions(query, maxSuggestions)
}

export function getPopularLabelTerms(
  labels: Label[],
  maxTerms: number = 10,
  options?: SearchOptions
): string[] {
  const search = new LabelSearch(labels, options)
  return search.getPopularTerms(maxTerms)
}

export function getLabelSearchStats(
  labels: Label[],
  options?: SearchOptions
): {
  totalLabels: number
  averageNameLength: number
  uniqueWords: number
  mostCommonWords: Array<{ word: string; count: number }>
} {
  const search = new LabelSearch(labels, options)
  return search.getSearchStats()
}
