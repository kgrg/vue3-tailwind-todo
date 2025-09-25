/**
 * BaseLabelChip Component Unit Tests
 * Tests for the BaseLabelChip component functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseLabelChip from '@/core/components/BaseLabelChip.vue'
import type { Label } from '@/types/label.types'

// Mock the color contrast utility
vi.mock('@/core/utils/color-contrast', () => ({
  getBestTextColor: vi.fn(() => ({
    textColor: 'white',
    contrast: 4.5,
    meetsAA: true,
    meetsAAA: false,
  })),
}))

describe('BaseLabelChip', () => {
  const mockLabel: Label = {
    id: '1',
    name: 'Work',
    color: '#22c55e',
    createdAt: '2025-01-27T00:00:00.000Z',
  }

  describe('Props', () => {
    it('should render with required props', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
        },
      })

      expect(wrapper.text()).toContain('Work')
      expect(wrapper.find('[data-testid="label-chip"]').exists()).toBe(true)
    })

    it('should render with optional props', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          size: 'large',
          removable: true,
          clickable: true,
        },
      })

      expect(wrapper.find('[data-testid="remove-button"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="label-chip"]').classes()).toContain('cursor-pointer')
    })
  })

  describe('Rendering', () => {
    it('should display label name', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
        },
      })

      expect(wrapper.text()).toContain('Work')
    })

    it('should display label color as background', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.attributes('style')).toContain('background-color: #22c55e')
    })

    it('should apply correct size classes', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          size: 'small',
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.classes()).toContain('text-xs')
    })

    it('should apply large size classes', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          size: 'large',
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.classes()).toContain('text-sm')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.attributes('role')).toBe('button')
      expect(chip.attributes('aria-label')).toBe('Label: Work')
    })

    it('should be keyboard accessible when clickable', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          clickable: true,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.attributes('tabindex')).toBe('0')
    })

    it('should not be keyboard accessible when not clickable', () => {
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

  describe('Events', () => {
    it('should emit click event when clicked', async () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          clickable: true,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      await chip.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.[0]).toEqual([mockLabel])
    })

    it('should emit remove event when remove button is clicked', async () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          removable: true,
        },
      })

      const removeButton = wrapper.find('[data-testid="remove-button"]')
      await removeButton.trigger('click')

      expect(wrapper.emitted('remove')).toBeTruthy()
      expect(wrapper.emitted('remove')?.[0]).toEqual([mockLabel])
    })

    it('should not emit click event when not clickable', async () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          clickable: false,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      await chip.trigger('click')

      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should handle Enter key press', async () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          clickable: true,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      await chip.trigger('keydown.enter')

      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('should handle Space key press', async () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          clickable: true,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      await chip.trigger('keydown.space')

      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('should not handle key press when not clickable', async () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          clickable: false,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      await chip.trigger('keydown.enter')

      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('Visual States', () => {
    it('should show loading state', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          loading: true,
        },
      })

      expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(true)
    })

    it('should show disabled state', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          disabled: true,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.classes()).toContain('opacity-50')
      expect(chip.classes()).toContain('cursor-not-allowed')
    })

    it('should show selected state', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
          selected: true,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.classes()).toContain('ring-2')
      expect(chip.classes()).toContain('ring-blue-500')
    })
  })

  describe('Color Contrast', () => {
    it('should apply correct text color based on background', () => {
      const { getBestTextColor } = await import('@/core/utils/color-contrast')
      vi.mocked(getBestTextColor).mockReturnValue({
        textColor: 'white',
        contrast: 4.5,
        meetsAA: true,
        meetsAAA: false,
      })

      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.classes()).toContain('text-white')
    })

    it('should apply black text for light backgrounds', async () => {
      const { getBestTextColor } = await import('@/core/utils/color-contrast')
      vi.mocked(getBestTextColor).mockReturnValue({
        textColor: 'black',
        contrast: 4.5,
        meetsAA: true,
        meetsAAA: false,
      })

      const wrapper = mount(BaseLabelChip, {
        props: {
          label: { ...mockLabel, color: '#ffffff' },
        },
      })

      const chip = wrapper.find('[data-testid="label-chip"]')
      expect(chip.classes()).toContain('text-black')
    })
  })

  describe('Slots', () => {
    it('should render default slot content', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
        },
        slots: {
          default: 'Custom Label Text',
        },
      })

      expect(wrapper.text()).toContain('Custom Label Text')
    })

    it('should render prefix slot', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
        },
        slots: {
          prefix: '<span data-testid="prefix-icon">🔖</span>',
        },
      })

      expect(wrapper.find('[data-testid="prefix-icon"]').exists()).toBe(true)
    })

    it('should render suffix slot', () => {
      const wrapper = mount(BaseLabelChip, {
        props: {
          label: mockLabel,
        },
        slots: {
          suffix: '<span data-testid="suffix-icon">✓</span>',
        },
      })

      expect(wrapper.find('[data-testid="suffix-icon"]').exists()).toBe(true)
    })
  })
})
