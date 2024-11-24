import { onMounted, onUnmounted } from 'vue'

interface FocusTrapHooks {
  trapFocus: () => void
  releaseFocus: () => void
}

export function useFocusTrap(): FocusTrapHooks {
  let focusableElements: HTMLElement[] = []
  let firstFocusableElement: HTMLElement | null = null
  let lastFocusableElement: HTMLElement | null = null

  const handleKeydown = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return

    if (!firstFocusableElement || !lastFocusableElement) return

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus()
        e.preventDefault()
      }
    }
  }

  const trapFocus = (): void => {
    focusableElements = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    )
    firstFocusableElement = focusableElements[0]
    lastFocusableElement = focusableElements[focusableElements.length - 1]
    document.addEventListener('keydown', handleKeydown)
  }

  const releaseFocus = (): void => {
    document.removeEventListener('keydown', handleKeydown)
  }

  onMounted(() => {
    trapFocus()
  })

  onUnmounted(() => {
    releaseFocus()
  })

  return {
    trapFocus,
    releaseFocus
  }
}
