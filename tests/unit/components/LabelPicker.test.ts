/**
 * LabelPicker Component Unit Tests
 * Tests for the LabelPicker component functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LabelPicker from '@/core/components/LabelPicker.vue'
import type { Label } from '@/types/label.types'

// Mock the composable
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

describe('LabelPicker', () => {
  const mockLabels: Label[] = [
    {
      id: '1',
      name: 'Work',
      color: '#22c55e',
      createdAt: '2025-01-27T00:00:00.000Z',
    },
    {
      id: '2',
      name: 'Personal',
      color: '#3b82f6',
      createdAt: '2025-01-27T00:00:00.000Z',
    },
    {
      id: '3',
      name: 'Urgent',
      color: '#ef4444',
      createdAt: '2025-01-27T00:00:00.000Z',
    },
  ]

  describe('Props', () => {
    it('should render with required props', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
      })

      expect(wrapper.find('[data-testid="label-picker"]').exists()).toBe(true)
    })

    it('should render with optional props', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: ['1', '2'],
          placeholder: 'Select labels...',
          maxLabels: 5,
          disabled: false,
          multiple: true,
        },
      })

      expect(wrapper.find('[data-testid="search-input"]').attributes('placeholder')).toBe(
        'Select labels...'
      )
    })
  })

  describe('Search Functionality', () => {
    it('should display search input', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
      })

      expect(wrapper.find('[data-testid="search-input"]').exists()).toBe(true)
    })

    it('should handle search input changes', async () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
      })

      const searchInput = wrapper.find('[data-testid="search-input"]')
      await searchInput.setValue('work')

      expect(wrapper.emitted('search')).toBeTruthy()
      expect(wrapper.emitted('search')?.[0]).toEqual(['work'])
    })

    it('should debounce search input', async () => {
      vi.useFakeTimers()

      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
      })

      const searchInput = wrapper.find('[data-testid="search-input"]')
      await searchInput.setValue('w')
      await searchInput.setValue('wo')
      await searchInput.setValue('work')

      // Fast-forward time to trigger debounced search
      vi.advanceTimersByTime(150)

      expect(wrapper.emitted('search')).toBeTruthy()

      vi.useRealTimers()
    })
  })

  describe('Label Selection', () => {
    it('should display available labels', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
        global: {
          mocks: {
            useLabelPicker: () => ({
              labels: mockLabels,
              selectedLabels: [],
              searchQuery: '',
              loading: false,
              error: null,
              filteredLabels: mockLabels,
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

      expect(wrapper.findAll('[data-testid="label-option"]')).toHaveLength(3)
    })

    it('should handle label selection', async () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
      })

      const labelOption = wrapper.find('[data-testid="label-option"]')
      await labelOption.trigger('click')

      expect(wrapper.emitted('select')).toBeTruthy()
    })

    it('should handle label deselection', async () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: ['1'],
        },
      })

      const selectedLabel = wrapper.find('[data-testid="selected-label"]')
      await selectedLabel.find('[data-testid="remove-button"]').trigger('click')

      expect(wrapper.emitted('deselect')).toBeTruthy()
    })
  })

  describe('Selected Labels Display', () => {
    it('should display selected labels as chips', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: ['1', '2'],
        },
      })

      expect(wrapper.findAll('[data-testid="selected-label"]')).toHaveLength(2)
    })

    it('should show clear all button when labels are selected', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: ['1', '2'],
        },
      })

      expect(wrapper.find('[data-testid="clear-all-button"]').exists()).toBe(true)
    })

    it('should handle clear all action', async () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: ['1', '2'],
        },
      })

      const clearAllButton = wrapper.find('[data-testid="clear-all-button"]')
      await clearAllButton.trigger('click')

      expect(wrapper.emitted('clear-all')).toBeTruthy()
    })
  })

  describe('Loading and Error States', () => {
    it('should display loading state', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
        global: {
          mocks: {
            useLabelPicker: () => ({
              labels: [],
              selectedLabels: [],
              searchQuery: '',
              loading: true,
              error: null,
              filteredLabels: [],
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

      expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(true)
    })

    it('should display error state', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
        global: {
          mocks: {
            useLabelPicker: () => ({
              labels: [],
              selectedLabels: [],
              searchQuery: '',
              loading: false,
              error: 'Failed to load labels',
              filteredLabels: [],
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

      expect(wrapper.find('[data-testid="error-message"]').text()).toBe('Failed to load labels')
    })
  })

  describe('Keyboard Navigation', () => {
    it('should handle arrow key navigation', async () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
      })

      const searchInput = wrapper.find('[data-testid="search-input"]')
      await searchInput.trigger('keydown.arrow-down')

      expect(wrapper.emitted('navigate')).toBeTruthy()
    })

    it('should handle Enter key to select focused label', async () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
      })

      const searchInput = wrapper.find('[data-testid="search-input"]')
      await searchInput.trigger('keydown.enter')

      expect(wrapper.emitted('select-focused')).toBeTruthy()
    })

    it('should handle Escape key to close dropdown', async () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
      })

      const searchInput = wrapper.find('[data-testid="search-input"]')
      await searchInput.trigger('keydown.escape')

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
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

    it('should have proper labels for screen readers', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
          label: 'Select labels',
        },
      })

      expect(wrapper.find('label').text()).toBe('Select labels')
    })
  })

  describe('Validation', () => {
    it('should show validation error when max labels exceeded', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: ['1', '2', '3', '4', '5', '6'],
          maxLabels: 5,
        },
      })

      expect(wrapper.find('[data-testid="validation-error"]').exists()).toBe(true)
    })

    it('should disable selection when max labels reached', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: ['1', '2', '3', '4', '5'],
          maxLabels: 5,
        },
      })

      const labelOptions = wrapper.findAll('[data-testid="label-option"]')
      labelOptions.forEach(option => {
        expect(option.classes()).toContain('disabled')
      })
    })
  })

  describe('Slots', () => {
    it('should render empty state slot', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
        slots: {
          empty: '<div data-testid="empty-state">No labels available</div>',
        },
      })

      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
    })

    it('should render loading slot', () => {
      const wrapper = mount(LabelPicker, {
        props: {
          modelValue: [],
        },
        slots: {
          loading: '<div data-testid="custom-loading">Loading labels...</div>',
        },
      })

      expect(wrapper.find('[data-testid="custom-loading"]').exists()).toBe(true)
    })
  })
})
