/**
 * Label Accessibility Features
 * Provides accessibility utilities and features for label components
 */

export interface A11yOptions {
  announceChanges?: boolean
  focusManagement?: boolean
  keyboardNavigation?: boolean
  screenReaderSupport?: boolean
}

export class LabelAccessibility {
  private options: A11yOptions

  constructor(options: A11yOptions = {}) {
    this.options = {
      announceChanges: true,
      focusManagement: true,
      keyboardNavigation: true,
      screenReaderSupport: true,
      ...options,
    }
  }

  /**
   * Announces changes to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.options.announceChanges || !this.options.screenReaderSupport) {
      return
    }

    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  /**
   * Manages focus for modal dialogs
   */
  trapFocus(element: HTMLElement): () => void {
    if (!this.options.focusManagement) {
      return () => {}
    }

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }

  /**
   * Provides keyboard navigation for lists
   */
  setupKeyboardNavigation(
    container: HTMLElement,
    itemSelector: string,
    options: {
      onSelect?: (element: HTMLElement) => void
      onActivate?: (element: HTMLElement) => void
      onEscape?: () => void
    } = {}
  ): () => void {
    if (!this.options.keyboardNavigation) {
      return () => {}
    }

    let currentIndex = -1
    const items = Array.from(container.querySelectorAll(itemSelector)) as HTMLElement[]

    const updateFocus = (index: number) => {
      items.forEach((item, i) => {
        if (i === index) {
          item.focus()
          item.setAttribute('aria-selected', 'true')
        } else {
          item.setAttribute('aria-selected', 'false')
        }
      })
    }

    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          currentIndex = Math.min(currentIndex + 1, items.length - 1)
          updateFocus(currentIndex)
          break

        case 'ArrowUp':
          e.preventDefault()
          currentIndex = Math.max(currentIndex - 1, 0)
          updateFocus(currentIndex)
          break

        case 'Enter':
        case ' ':
          e.preventDefault()
          if (currentIndex >= 0 && currentIndex < items.length) {
            const currentItem = items[currentIndex]
            options.onActivate?.(currentItem)
            options.onSelect?.(currentItem)
          }
          break

        case 'Escape':
          e.preventDefault()
          options.onEscape?.()
          break

        case 'Home':
          e.preventDefault()
          currentIndex = 0
          updateFocus(currentIndex)
          break

        case 'End':
          e.preventDefault()
          currentIndex = items.length - 1
          updateFocus(currentIndex)
          break
      }
    }

    container.addEventListener('keydown', handleKeydown)

    return () => {
      container.removeEventListener('keydown', handleKeydown)
    }
  }

  /**
   * Provides ARIA labels for label components
   */
  getLabelAriaLabel(label: { name: string; color: string; selected?: boolean }): string {
    const parts = [`Label: ${label.name}`]

    if (label.selected) {
      parts.push('selected')
    }

    parts.push(`Color: ${label.color}`)

    return parts.join(', ')
  }

  /**
   * Provides ARIA labels for label picker
   */
  getPickerAriaLabel(options: {
    selectedCount: number
    totalCount: number
    searchQuery?: string
  }): string {
    const parts = ['Label picker']

    if (options.searchQuery) {
      parts.push(`Searching for: ${options.searchQuery}`)
    }

    parts.push(`${options.selectedCount} of ${options.totalCount} labels selected`)

    return parts.join(', ')
  }

  /**
   * Provides ARIA labels for label filter
   */
  getFilterAriaLabel(options: {
    activeFilters: number
    operator: 'AND' | 'OR'
    totalTasks: number
    filteredTasks: number
  }): string {
    const parts = ['Label filter']

    if (options.activeFilters > 0) {
      parts.push(`${options.activeFilters} filters active`)
      parts.push(`Showing ${options.filteredTasks} of ${options.totalTasks} tasks`)
      parts.push(`Filter logic: ${options.operator}`)
    } else {
      parts.push('No filters active')
    }

    return parts.join(', ')
  }

  /**
   * Validates color contrast for accessibility
   */
  validateColorContrast(
    backgroundColor: string,
    textColor: string
  ): {
    passes: boolean
    ratio: number
    level: 'AA' | 'AAA' | 'FAIL'
  } {
    // This would typically use a color contrast calculation library
    // For now, we'll provide a basic implementation
    const ratio = this.calculateContrastRatio(backgroundColor, textColor)

    let level: 'AA' | 'AAA' | 'FAIL'
    if (ratio >= 7) {
      level = 'AAA'
    } else if (ratio >= 4.5) {
      level = 'AA'
    } else {
      level = 'FAIL'
    }

    return {
      passes: ratio >= 4.5,
      ratio,
      level,
    }
  }

  /**
   * Calculates color contrast ratio
   */
  private calculateContrastRatio(color1: string, color2: string): number {
    // Simplified contrast calculation
    // In a real implementation, you'd use a proper color contrast library
    const rgb1 = this.hexToRgb(color1)
    const rgb2 = this.hexToRgb(color2)

    const lum1 = this.getLuminance(rgb1)
    const lum2 = this.getLuminance(rgb2)

    const lighter = Math.max(lum1, lum2)
    const darker = Math.min(lum1, lum2)

    return (lighter + 0.05) / (darker + 0.05)
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  private getLuminance(rgb: { r: number; g: number; b: number }): number {
    const { r, g, b } = rgb
    const normalize = (value: number) => {
      const normalized = value / 255
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4)
    }

    return 0.2126 * normalize(r) + 0.7152 * normalize(g) + 0.0722 * normalize(b)
  }

  /**
   * Provides screen reader support for label operations
   */
  announceLabelOperation(operation: string, label: { name: string; color: string }): void {
    const message = `${operation} label: ${label.name}`
    this.announce(message, 'polite')
  }

  /**
   * Provides screen reader support for filter operations
   */
  announceFilterOperation(operation: string, count: number): void {
    const message = `${operation} filter. ${count} tasks shown`
    this.announce(message, 'polite')
  }

  /**
   * Provides screen reader support for search operations
   */
  announceSearchOperation(query: string, results: number): void {
    const message = `Searching for "${query}". ${results} results found`
    this.announce(message, 'polite')
  }

  /**
   * Provides screen reader support for validation errors
   */
  announceValidationError(error: string): void {
    this.announce(`Error: ${error}`, 'assertive')
  }

  /**
   * Provides screen reader support for success messages
   */
  announceSuccess(message: string): void {
    this.announce(`Success: ${message}`, 'polite')
  }
}

// Export singleton instance
export const labelA11y = new LabelAccessibility()

// Utility functions
export function createAriaLabel(label: {
  name: string
  color: string
  selected?: boolean
}): string {
  return labelA11y.getLabelAriaLabel(label)
}

export function createPickerAriaLabel(options: {
  selectedCount: number
  totalCount: number
  searchQuery?: string
}): string {
  return labelA11y.getPickerAriaLabel(options)
}

export function createFilterAriaLabel(options: {
  activeFilters: number
  operator: 'AND' | 'OR'
  totalTasks: number
  filteredTasks: number
}): string {
  return labelA11y.getFilterAriaLabel(options)
}

export function validateColorContrast(
  backgroundColor: string,
  textColor: string
): {
  passes: boolean
  ratio: number
  level: 'AA' | 'AAA' | 'FAIL'
} {
  return labelA11y.validateColorContrast(backgroundColor, textColor)
}

export function announceLabelOperation(
  operation: string,
  label: { name: string; color: string }
): void {
  labelA11y.announceLabelOperation(operation, label)
}

export function announceFilterOperation(operation: string, count: number): void {
  labelA11y.announceFilterOperation(operation, count)
}

export function announceSearchOperation(query: string, results: number): void {
  labelA11y.announceSearchOperation(query, results)
}

export function announceValidationError(error: string): void {
  labelA11y.announceValidationError(error)
}

export function announceSuccess(message: string): void {
  labelA11y.announceSuccess(message)
}
