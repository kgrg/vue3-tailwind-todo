/**
 * LabelDialog Component Unit Tests
 * Tests for the LabelDialog component functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LabelDialog from '@/core/components/LabelDialog.vue'
import type { Label, CreateLabelRequest, UpdateLabelRequest } from '@/types/label.types'

// Mock the validation
vi.mock('@/core/validation/label.validation', () => ({
  validateLabelCreate: vi.fn(() => ({ isValid: true, errors: [] })),
  validateLabelUpdate: vi.fn(() => ({ isValid: true, errors: [] })),
}))

// Mock the color contrast utility
vi.mock('@/core/utils/color-contrast', () => ({
  getBestTextColor: vi.fn(() => ({
    textColor: 'white',
    contrast: 4.5,
    meetsAA: true,
    meetsAAA: false,
  })),
}))

describe('LabelDialog', () => {
  const mockLabel: Label = {
    id: '1',
    name: 'Work',
    color: '#22c55e',
    createdAt: '2025-01-27T00:00:00.000Z',
  }

  describe('Props', () => {
    it('should render create mode by default', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      expect(wrapper.find('[data-testid="dialog-title"]').text()).toContain('Create Label')
      expect(wrapper.find('[data-testid="save-button"]').text()).toContain('Create')
    })

    it('should render edit mode when label is provided', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
          label: mockLabel,
        },
      })

      expect(wrapper.find('[data-testid="dialog-title"]').text()).toContain('Edit Label')
      expect(wrapper.find('[data-testid="save-button"]').text()).toContain('Update')
    })

    it('should render with custom title', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
          title: 'Custom Title',
        },
      })

      expect(wrapper.find('[data-testid="dialog-title"]').text()).toBe('Custom Title')
    })
  })

  describe('Form Fields', () => {
    it('should have name input field', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const nameInput = wrapper.find('[data-testid="name-input"]')
      expect(nameInput.exists()).toBe(true)
      expect(nameInput.attributes('type')).toBe('text')
      expect(nameInput.attributes('placeholder')).toBe('Enter label name')
    })

    it('should have color input field', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const colorInput = wrapper.find('[data-testid="color-input"]')
      expect(colorInput.exists()).toBe(true)
      expect(colorInput.attributes('type')).toBe('color')
    })

    it('should populate fields in edit mode', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
          label: mockLabel,
        },
      })

      const nameInput = wrapper.find('[data-testid="name-input"]')
      const colorInput = wrapper.find('[data-testid="color-input"]')

      expect(nameInput.element.value).toBe('Work')
      expect(colorInput.element.value).toBe('#22c55e')
    })
  })

  describe('Form Validation', () => {
    it('should show validation errors for invalid input', async () => {
      const { validateLabelCreate } = await import('@/core/validation/label.validation')
      vi.mocked(validateLabelCreate).mockReturnValue({
        isValid: false,
        errors: [{ code: 'LABEL_NAME_REQUIRED', message: 'Label name is required', field: 'name' }],
      })

      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const saveButton = wrapper.find('[data-testid="save-button"]')
      await saveButton.trigger('click')

      expect(wrapper.find('[data-testid="validation-error"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="validation-error"]').text()).toContain(
        'Label name is required'
      )
    })

    it('should disable save button when form is invalid', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const nameInput = wrapper.find('[data-testid="name-input"]')
      await nameInput.setValue('')

      const saveButton = wrapper.find('[data-testid="save-button"]')
      expect(saveButton.attributes('disabled')).toBeDefined()
    })

    it('should enable save button when form is valid', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const nameInput = wrapper.find('[data-testid="name-input"]')
      const colorInput = wrapper.find('[data-testid="color-input"]')

      await nameInput.setValue('Test Label')
      await colorInput.setValue('#000000')

      const saveButton = wrapper.find('[data-testid="save-button"]')
      expect(saveButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Color Picker', () => {
    it('should show color preview', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const colorPreview = wrapper.find('[data-testid="color-preview"]')
      expect(colorPreview.exists()).toBe(true)
    })

    it('should update color preview when color changes', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const colorInput = wrapper.find('[data-testid="color-input"]')
      await colorInput.setValue('#ff0000')

      const colorPreview = wrapper.find('[data-testid="color-preview"]')
      expect(colorPreview.attributes('style')).toContain('background-color: #ff0000')
    })

    it('should show predefined color options', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const colorOptions = wrapper.findAll('[data-testid="color-option"]')
      expect(colorOptions.length).toBeGreaterThan(0)
    })

    it('should handle predefined color selection', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const colorOption = wrapper.find('[data-testid="color-option"]')
      await colorOption.trigger('click')

      const colorInput = wrapper.find('[data-testid="color-input"]')
      expect(colorInput.element.value).toBeDefined()
    })
  })

  describe('Form Submission', () => {
    it('should emit create event with form data', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const nameInput = wrapper.find('[data-testid="name-input"]')
      const colorInput = wrapper.find('[data-testid="color-input"]')

      await nameInput.setValue('New Label')
      await colorInput.setValue('#00ff00')

      const saveButton = wrapper.find('[data-testid="save-button"]')
      await saveButton.trigger('click')

      expect(wrapper.emitted('create')).toBeTruthy()
      expect(wrapper.emitted('create')?.[0]).toEqual([
        {
          name: 'New Label',
          color: '#00ff00',
        },
      ])
    })

    it('should emit update event in edit mode', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
          label: mockLabel,
        },
      })

      const nameInput = wrapper.find('[data-testid="name-input"]')
      await nameInput.setValue('Updated Label')

      const saveButton = wrapper.find('[data-testid="save-button"]')
      await saveButton.trigger('click')

      expect(wrapper.emitted('update')).toBeTruthy()
      expect(wrapper.emitted('update')?.[0]).toEqual([
        {
          name: 'Updated Label',
          color: '#22c55e',
        },
      ])
    })
  })

  describe('Dialog Actions', () => {
    it('should emit close event when cancel button is clicked', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const cancelButton = wrapper.find('[data-testid="cancel-button"]')
      await cancelButton.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should emit close event when backdrop is clicked', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const backdrop = wrapper.find('[data-testid="dialog-backdrop"]')
      await backdrop.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should not close when dialog content is clicked', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const dialogContent = wrapper.find('[data-testid="dialog-content"]')
      await dialogContent.trigger('click')

      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should close dialog on Escape key', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      await wrapper.trigger('keydown.escape')

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should submit form on Enter key', async () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
      })

      const nameInput = wrapper.find('[data-testid="name-input"]')
      await nameInput.setValue('Test Label')
      await nameInput.trigger('keydown.enter')

      expect(wrapper.emitted('create')).toBeTruthy()
    })
  })

  describe('Loading States', () => {
    it('should show loading state when saving', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
          loading: true,
        },
      })

      const saveButton = wrapper.find('[data-testid="save-button"]')
      expect(saveButton.find('[data-testid="loading-spinner"]').exists()).toBe(true)
      expect(saveButton.attributes('disabled')).toBeDefined()
    })

    it('should disable form fields when loading', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
          loading: true,
        },
      })

      const nameInput = wrapper.find('[data-testid="name-input"]')
      const colorInput = wrapper.find('[data-testid="color-input"]')

      expect(nameInput.attributes('disabled')).toBeDefined()
      expect(colorInput.attributes('disabled')).toBeDefined()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
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
    })
  })

  describe('Slots', () => {
    it('should render custom header slot', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
        slots: {
          header: '<div data-testid="custom-header">Custom Header</div>',
        },
      })

      expect(wrapper.find('[data-testid="custom-header"]').exists()).toBe(true)
    })

    it('should render custom footer slot', () => {
      const wrapper = mount(LabelDialog, {
        props: {
          open: true,
        },
        slots: {
          footer: '<div data-testid="custom-footer">Custom Footer</div>',
        },
      })

      expect(wrapper.find('[data-testid="custom-footer"]').exists()).toBe(true)
    })
  })
})
