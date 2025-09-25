/**
 * Label Theme Support
 * Provides dark mode and theming support for label components
 */

export interface LabelTheme {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    error: string
    warning: string
    success: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
    }
    fontWeight: {
      normal: string
      medium: string
      semibold: string
      bold: string
    }
  }
  shadows: {
    sm: string
    md: string
    lg: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    full: string
  }
}

export const lightTheme: LabelTheme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    accent: '#8b5cf6',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
}

export const darkTheme: LabelTheme = {
  colors: {
    primary: '#60a5fa',
    secondary: '#9ca3af',
    accent: '#a78bfa',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
    error: '#f87171',
    warning: '#fbbf24',
    success: '#34d399',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
}

export class ThemeManager {
  private currentTheme: LabelTheme
  private isDarkMode: boolean

  constructor(initialTheme: LabelTheme = lightTheme) {
    this.currentTheme = initialTheme
    this.isDarkMode = initialTheme === darkTheme
  }

  getTheme(): LabelTheme {
    return this.currentTheme
  }

  setTheme(theme: LabelTheme): void {
    this.currentTheme = theme
    this.isDarkMode = theme === darkTheme
    this.applyTheme()
  }

  toggleDarkMode(): void {
    this.setTheme(this.isDarkMode ? lightTheme : darkTheme)
  }

  setDarkMode(enabled: boolean): void {
    this.setTheme(enabled ? darkTheme : lightTheme)
  }

  isDark(): boolean {
    return this.isDarkMode
  }

  private applyTheme(): void {
    const root = document.documentElement
    const theme = this.currentTheme

    // Apply CSS custom properties
    root.style.setProperty('--color-primary', theme.colors.primary)
    root.style.setProperty('--color-secondary', theme.colors.secondary)
    root.style.setProperty('--color-accent', theme.colors.accent)
    root.style.setProperty('--color-background', theme.colors.background)
    root.style.setProperty('--color-surface', theme.colors.surface)
    root.style.setProperty('--color-text', theme.colors.text)
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary)
    root.style.setProperty('--color-border', theme.colors.border)
    root.style.setProperty('--color-error', theme.colors.error)
    root.style.setProperty('--color-warning', theme.colors.warning)
    root.style.setProperty('--color-success', theme.colors.success)

    // Apply spacing
    root.style.setProperty('--spacing-xs', theme.spacing.xs)
    root.style.setProperty('--spacing-sm', theme.spacing.sm)
    root.style.setProperty('--spacing-md', theme.spacing.md)
    root.style.setProperty('--spacing-lg', theme.spacing.lg)
    root.style.setProperty('--spacing-xl', theme.spacing.xl)

    // Apply typography
    root.style.setProperty('--font-family', theme.typography.fontFamily)
    root.style.setProperty('--font-size-xs', theme.typography.fontSize.xs)
    root.style.setProperty('--font-size-sm', theme.typography.fontSize.sm)
    root.style.setProperty('--font-size-md', theme.typography.fontSize.md)
    root.style.setProperty('--font-size-lg', theme.typography.fontSize.lg)
    root.style.setProperty('--font-size-xl', theme.typography.fontSize.xl)

    // Apply shadows
    root.style.setProperty('--shadow-sm', theme.shadows.sm)
    root.style.setProperty('--shadow-md', theme.shadows.md)
    root.style.setProperty('--shadow-lg', theme.shadows.lg)

    // Apply border radius
    root.style.setProperty('--border-radius-sm', theme.borderRadius.sm)
    root.style.setProperty('--border-radius-md', theme.borderRadius.md)
    root.style.setProperty('--border-radius-lg', theme.borderRadius.lg)
    root.style.setProperty('--border-radius-full', theme.borderRadius.full)

    // Apply dark mode class
    if (this.isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  getLabelChipClasses(): string {
    const theme = this.currentTheme
    return `
      inline-flex items-center px-2 py-1 rounded-full text-sm font-medium
      bg-${theme.colors.primary} text-white
      hover:opacity-80 focus:ring-2 focus:ring-${theme.colors.primary}
      transition-all duration-200
    `.trim()
  }

  getLabelPickerClasses(): string {
    const theme = this.currentTheme
    return `
      w-full px-3 py-2 border rounded-md
      bg-${theme.colors.background} text-${theme.colors.text}
      border-${theme.colors.border}
      focus:ring-2 focus:ring-${theme.colors.primary} focus:border-${theme.colors.primary}
    `.trim()
  }

  getLabelDialogClasses(): string {
    const theme = this.currentTheme
    return `
      bg-${theme.colors.background} text-${theme.colors.text}
      border border-${theme.colors.border}
      shadow-${theme.shadows.lg}
    `.trim()
  }
}

// Export singleton instance
export const themeManager = new ThemeManager()

// Auto-detect system preference
export function detectSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

// Initialize theme based on system preference
export function initializeTheme(): void {
  const systemTheme = detectSystemTheme()
  const savedTheme = localStorage.getItem('theme-preference')

  if (savedTheme === 'dark' || savedTheme === 'light') {
    themeManager.setDarkMode(savedTheme === 'dark')
  } else {
    themeManager.setDarkMode(systemTheme === 'dark')
  }
}

// Watch for system theme changes
export function watchSystemTheme(): void {
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    mediaQuery.addEventListener('change', e => {
      const savedTheme = localStorage.getItem('theme-preference')
      if (!savedTheme) {
        themeManager.setDarkMode(e.matches)
      }
    })
  }
}
