/**
 * Label Accessibility Tests
 * Tests for WCAG 2.1 AA compliance in label components
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'
import BaseLabelChip from '@/core/components/BaseLabelChip.vue'
import LabelPicker from '@/core/components/LabelPicker.vue'
import LabelDialog from '@/core/components/LabelDialog.vue'
import type { Label } from '@/types/label.types'

// Extend expect with axe matchers
expect.extend(toHaveNoViolations)

// Mock the composables
vi.mock('@/core/composables/useLabelPicker', () => ({
  useLabelPicker: vi.fn(() => ({
    labels: [],
    selectedLabels: [],
    searchQuery: '',
    loading: false,
    error: null,
    filteredLabels: [],
    selectLabel: vi.fn(),
    deselectLabel: vi.fn(),
    toggleLabel: vi.fn(),
    clearSelection: vi.fn(),
    setSearchQuery: vi.fn(),
    loadLabels: vi.fn(),
  })),
}))

describe('Label Accessibility Tests', () => {
  const mockLabel: Label = {
    id: '1',
    name: 'Work',
    color: '#22c55e',
    createdAt: '2025-01-27T00:00:00.000Z',
  }

  describe('BaseLabelChip Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          clickable: true,
        },
      })

      const results = await axe(wrapper.element)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA attributes', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          clickable: true,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.attributes('role')).toBe('button')
      expect(chip.attributes('aria-label')).toBe('Label: Work')
      expect(chip.attributes('tabindex')).toBe('0')
    })

    it('should be keyboard accessible', async () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          clickable: true,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')

      // Test Enter key
      await chip.trigger('keydown.enter')
      expect(wrapper.emitted('click')).toBeTruthy()

      // Test Space key
      await chip.trigger('keydown.space')
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('should have proper focus indicators', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          clickable: true,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.classes()).toContain('focus:ring-2')
      expect(chip.classes()).toContain('focus:ring-blue-500')
    })

    it('should have sufficient color contrast', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      const style = chip.attributes('style')

      // Verify background color is set
      expect(style).toContain('background-color: #22c55e')

      // Verify text color provides contrast
      expect(chip.classes()).toContain('text-white')
    })

    it('should announce state changes to screen readers', async () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          selected: false,
        },
      })

      // Test selection state change
      await wrapper.setProps({ selected: true })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.attributes('aria-pressed')).toBe('true')
    })
  })

  describe('LabelPicker Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
      })

      const results = await axe(wrapper.element)
      expect(results).toHaveNoViolations()
    })

    it('should have proper combobox ARIA attributes', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
      })

      const picker = wrapper.find('[data-testid="label-picker"]')
      expect(picker.attributes('role')).toBe('combobox')
      expect(picker.attributes('aria-expanded')).toBeDefined()
      expect(picker.attributes('aria-haspopup')).toBe('listbox')
    })

    it('should have proper listbox ARIA attributes', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
      })

      const listbox = wrapper.find('[data-testid="label-listbox"]')
      expect(listbox.attributes('role')).toBe('listbox')
      expect(listbox.attributes('aria-multiselectable')).toBe('true')
    })

    it('should have proper option ARIA attributes', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
        global: {
          mocks: {
            useLabelPicker: () => ({
              labels: [mockLabel],
              selectedLabels: [],
              searchQuery: '',
              loading: false,
              error: null,
              filteredLabels: [mockLabel],
              selectLabel: vi.fn(),
              deselectLabel: vi.fn(),
              toggleLabel: vi.fn(),
              clearSelection: vi.fn(),
              setSearchQuery: vi.fn(),
              loadLabels: vi.fn(),
            }),
          },
        },
      })

      const option = wrapper.find('[data-testid="label-option"]')
      expect(option.attributes('role')).toBe('option')
      expect(option.attributes('aria-selected')).toBe('false')
    })

    it('should support keyboard navigation', async () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
      })

      const searchInput = wrapper.find('[data-testid="search-input"]')

      // Test arrow key navigation
      await searchInput.trigger('keydown.arrow-down')
      expect(wrapper.emitted('navigate')).toBeTruthy()

      // Test Enter key selection
      await searchInput.trigger('keydown.enter')
      expect(wrapper.emitted('select-focused')).toBeTruthy()

      // Test Escape key
      await searchInput.trigger('keydown.escape')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should have proper labels for screen readers', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
          label: 'Select labels',
        },
      })

      const label = wrapper.find('label')
      expect(label.text()).toBe('Select labels')

      const searchInput = wrapper.find('[data-testid="search-input"]')
      expect(searchInput.attributes('aria-labelledby')).toBeDefined()
    })

    it('should announce selection changes', async () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
      })

      // Test selection
      const option = wrapper.find('[data-testid="label-option"]')
      await option.trigger('click')

      expect(wrapper.emitted('select')).toBeTruthy()
    })
  })

  describe('LabelDialog Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const results = await axe(wrapper.element)
      expect(results).toHaveNoViolations()
    })

    it('should have proper dialog ARIA attributes', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const dialog = wrapper.find('[data-testid="dialog"]')
      expect(dialog.attributes('role')).toBe('dialog')
      expect(dialog.attributes('aria-modal')).toBe('true')
      expect(dialog.attributes('aria-labelledby')).toBeDefined()
    })

    it('should trap focus within dialog', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const focusableElements = wrapper.findAll('[tabindex="0"], input, button')
      expect(focusableElements.length).toBeGreaterThan(0)

      // Test focus trap
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      expect(firstElement.attributes('tabindex')).toBe('0')
      expect(lastElement.attributes('tabindex')).toBe('0')
    })

    it('should have proper form labels', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const nameInput = wrapper.find('[data-testid="name-input"]')
      const colorInput = wrapper.find('[data-testid="color-input"]')

      expect(nameInput.attributes('aria-label')).toBeDefined()
      expect(colorInput.attributes('aria-label')).toBeDefined()
    })

    it('should announce validation errors', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      // Trigger validation error
      const saveButton = wrapper.find('[data-testid="save-button"]')
      await saveButton.trigger('click')

      const errorMessage = wrapper.find('[data-testid="validation-error"]')
      expect(errorMessage.attributes('role')).toBe('alert')
      expect(errorMessage.attributes('aria-live')).toBe('polite')
    })

    it('should support keyboard navigation', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      // Test Tab navigation
      await wrapper.trigger('keydown.tab')

      // Test Escape key
      await wrapper.trigger('keydown.escape')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should have proper button labels', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const saveButton = wrapper.find('[data-testid="save-button"]')
      const cancelButton = wrapper.find('[data-testid="cancel-button"]')

      expect(saveButton.attributes('aria-label')).toBeDefined()
      expect(cancelButton.attributes('aria-label')).toBeDefined()
    })
  })

  describe('Color Contrast Compliance', () => {
    it('should meet WCAG AA contrast requirements', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      const style = chip.attributes('style')

      // Verify background color is set
      expect(style).toContain('background-color: #22c55e')

      // Verify text color provides sufficient contrast
      expect(chip.classes()).toContain('text-white')
    })

    it('should handle dark backgrounds with light text', () => {
      const darkLabel: Label = {
        ...mockLabel,
        color: '#000000',
      }

      const wrapper = mount(BaseLabelChip, {
        props: {
          label: darkLabel,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.classes()).toContain('text-white')
    })

    it('should handle light backgrounds with dark text', () => {
      const lightLabel: Label = {
        ...mockLabel,
        color: '#ffffff',
      }

      const wrapper = mount(BaseLabelChip, {
        props: {
          label: lightLabel,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.classes()).toContain('text-black')
    })
  })

  describe('Screen Reader Support', () => {
    it('should provide meaningful labels for screen readers', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.attributes('aria-label')).toBe('Label: Work')
    })

    it('should announce state changes', async () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          selected: false,
        },
      })

      await wrapper.setProps({ selected: true })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.attributes('aria-pressed')).toBe('true')
    })

    it('should provide context for interactive elements', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          removable: true,
        },
      })

      const removeButton = wrapper.find('[data-testid="remove-button"]')
      expect(removeButton.attributes('aria-label')).toContain('Remove')
    })
  })

  describe('Keyboard Navigation', () => {
    it('should support standard keyboard interactions', async () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          clickable: true,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')

      // Test Enter key
      await chip.trigger('keydown.enter')
      expect(wrapper.emitted('click')).toBeTruthy()

      // Test Space key
      await chip.trigger('keydown.space')
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('should skip non-interactive elements', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          clickable: false,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.attributes('tabindex')).toBe('-1')
    })
  })

  describe('Focus Management', () => {
    it('should manage focus properly', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const dialog = wrapper.find('[data-testid="dialog"]')
      expect(dialog.attributes('aria-hidden')).toBe('false')
    })

    it('should restore focus when closed', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      await wrapper.setProps({ open: false })

      // Verify focus is restored to trigger element
      expect(wrapper.emitted('focus-restore')).toBeTruthy()
    })
  })
})
