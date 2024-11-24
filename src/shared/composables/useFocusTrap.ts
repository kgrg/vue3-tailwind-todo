export const useFocusTrap = (isActive: boolean) => {
  let previousActiveElement: HTMLElement | null = null

  const handleTabKey = (event: KeyboardEvent) => {
    if (!isActive) return

    const modal = document.querySelector('[role="dialog"]')
    if (!modal) return

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable.focus()
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus()
      }
    }
  }

  const initializeFocus = () => {
    previousActiveElement = document.activeElement as HTMLElement
    setTimeout(() => {
      const firstFocusable = document.querySelector('[role="dialog"] button') as HTMLElement
      firstFocusable?.focus()
    }, 100)
  }

  const restoreFocus = () => {
    previousActiveElement?.focus()
  }

  return {
    handleTabKey,
    initializeFocus,
    restoreFocus
  }
}
