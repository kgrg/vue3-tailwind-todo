/**
 * Label Management Integration Tests
 * Tests for complete label management workflows
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LabelManagement from '@/modules/labels/components/LabelManagement.vue'
import { useLabelsStore } from '@/stores/labels.store'
import type { Label } from '@/types/label.types'

// Mock the repository
vi.mock('@/core/repositories/labels.repository', () => ({
  labelsRepository: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    search: vi.fn(),
  },
}))

describe('Label Management Integration', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  describe('Label CRUD Workflow', () => {
    it('should complete full label lifecycle', async () => {
      const { labelsRepository } = await import('@/core/repositories/labels.repository')

      // Mock initial empty state
      vi.mocked(labelsRepository.getAll).mockResolvedValue([])

      const wrapper = mount(LabelManagement, {
        global: {
          plugins: [pinia],
        },
      })

      const store = useLabelsStore()
      await store.loadLabels()

      // Verify initial state
      expect(store.labels).toEqual([])
      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)

      // Create a new label
      const newLabel: Label = {
        id: '1',
        name: 'Work',
        color: '#22c55e',
        createdAt: '2025-01-27T00:00:00.000Z',
      }

      vi.mocked(labelsRepository.create).mockResolvedValue(newLabel)
      vi.mocked(labelsRepository.getAll).mockResolvedValue([newLabel])

      await store.createLabel({ name: 'Work', color: '#22c55e' })
      await store.loadLabels()

      // Verify label was created
      expect(store.labels).toHaveLength(1)
      expect(store.labels[0]).toEqual(newLabel)
      expect(wrapper.find('[data-testid="label-item"]').exists()).toBe(true)

      // Update the label
      const updatedLabel: Label = {
        ...newLabel,
        name: 'Work Tasks',
        color: '#3b82f6',
        updatedAt: '2025-01-27T00:00:00.000Z',
      }

      vi.mocked(labelsRepository.update).mockResolvedValue(updatedLabel)
      vi.mocked(labelsRepository.getAll).mockResolvedValue([updatedLabel])

      await store.updateLabel('1', { name: 'Work Tasks', color: '#3b82f6' })
      await store.loadLabels()

      // Verify label was updated
      expect(store.labels[0].name).toBe('Work Tasks')
      expect(store.labels[0].color).toBe('#3b82f6')

      // Delete the label
      vi.mocked(labelsRepository.delete).mockResolvedValue(undefined)
      vi.mocked(labelsRepository.getAll).mockResolvedValue([])

      await store.deleteLabel('1')
      await store.loadLabels()

      // Verify label was deleted
      expect(store.labels).toEqual([])
      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
    })
  })

  describe('Label Search and Filtering', () => {
    it('should search and filter labels', async () => {
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
          name: 'Work Tasks',
          color: '#ef4444',
          createdAt: '2025-01-27T00:00:00.000Z',
        },
      ]

      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      vi.mocked(labelsRepository.getAll).mockResolvedValue(mockLabels)
      vi.mocked(labelsRepository.search).mockResolvedValue({
        labels: [mockLabels[0], mockLabels[2]],
        total: 2,
        query: 'work',
      })

      const wrapper = mount(LabelManagement, {
        global: {
          plugins: [pinia],
        },
      })

      const store = useLabelsStore()
      await store.loadLabels()

      // Verify all labels are displayed
      expect(wrapper.findAll('[data-testid="label-item"]')).toHaveLength(3)

      // Search for labels containing 'work'
      const searchInput = wrapper.find('[data-testid="search-input"]')
      await searchInput.setValue('work')
      await searchInput.trigger('input')

      await store.searchLabels('work')

      // Verify filtered results
      expect(store.filteredLabels).toHaveLength(2)
      expect(store.filteredLabels.map(l => l.name)).toEqual(['Work', 'Work Tasks'])
    })
  })

  describe('Label Validation', () => {
    it('should handle validation errors during creation', async () => {
      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      vi.mocked(labelsRepository.getAll).mockResolvedValue([])
      vi.mocked(labelsRepository.create).mockRejectedValue(new Error('Label name already exists'))

      const wrapper = mount(LabelManagement, {
        global: {
          plugins: [pinia],
        },
      })

      const store = useLabelsStore()
      await store.loadLabels()

      // Attempt to create duplicate label
      await store.createLabel({ name: 'Work', color: '#22c55e' })

      // Verify error handling
      expect(store.error).toBe('Label name already exists')
      expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
    })

    it('should handle validation errors during update', async () => {
      const existingLabel: Label = {
        id: '1',
        name: 'Work',
        color: '#22c55e',
        createdAt: '2025-01-27T00:00:00.000Z',
      }

      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      vi.mocked(labelsRepository.getAll).mockResolvedValue([existingLabel])
      vi.mocked(labelsRepository.update).mockRejectedValue(new Error('Label name already exists'))

      const wrapper = mount(LabelManagement, {
        global: {
          plugins: [pinia],
        },
      })

      const store = useLabelsStore()
      await store.loadLabels()

      // Attempt to update with duplicate name
      await store.updateLabel('1', { name: 'Personal' })

      // Verify error handling
      expect(store.error).toBe('Label name already exists')
      expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
    })
  })

  describe('Label Statistics', () => {
    it('should display label statistics', async () => {
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
      ]

      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      vi.mocked(labelsRepository.getAll).mockResolvedValue(mockLabels)

      const wrapper = mount(LabelManagement, {
        global: {
          plugins: [pinia],
        },
      })

      const store = useLabelsStore()
      await store.loadLabels()

      // Verify statistics display
      const stats = store.labelStats
      expect(stats.total).toBe(2)
      expect(wrapper.find('[data-testid="label-stats"]').text()).toContain('2 labels')
    })
  })

  describe('Bulk Operations', () => {
    it('should handle bulk label deletion', async () => {
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
      ]

      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      vi.mocked(labelsRepository.getAll).mockResolvedValue(mockLabels)
      vi.mocked(labelsRepository.delete).mockResolvedValue(undefined)

      const wrapper = mount(LabelManagement, {
        global: {
          plugins: [pinia],
        },
      })

      const store = useLabelsStore()
      await store.loadLabels()

      // Select multiple labels
      const checkboxes = wrapper.findAll('[data-testid="label-checkbox"]')
      await checkboxes[0].trigger('change')
      await checkboxes[1].trigger('change')

      // Delete selected labels
      const deleteButton = wrapper.find('[data-testid="bulk-delete-button"]')
      await deleteButton.trigger('click')

      // Verify confirmation dialog
      expect(wrapper.find('[data-testid="delete-confirmation"]').exists()).toBe(true)

      // Confirm deletion
      const confirmButton = wrapper.find('[data-testid="confirm-delete-button"]')
      await confirmButton.trigger('click')

      // Verify labels were deleted
      expect(labelsRepository.delete).toHaveBeenCalledTimes(2)
    })
  })

  describe('Error Recovery', () => {
    it('should recover from network errors', async () => {
      const { labelsRepository } = await import('@/core/repositories/labels.repository')

      // Simulate network error
      vi.mocked(labelsRepository.getAll).mockRejectedValue(new Error('Network error'))

      const wrapper = mount(LabelManagement, {
        global: {
          plugins: [pinia],
        },
      })

      const store = useLabelsStore()
      await store.loadLabels()

      // Verify error state
      expect(store.error).toBe('Network error')
      expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)

      // Retry loading
      vi.mocked(labelsRepository.getAll).mockResolvedValue([])
      await store.loadLabels()

      // Verify recovery
      expect(store.error).toBeNull()
      expect(store.labels).toEqual([])
    })
  })

  describe('Performance', () => {
    it('should handle large number of labels efficiently', async () => {
      const largeLabelSet: Label[] = Array.from({ length: 100 }, (_, i) => ({
        id: `label-${i}`,
        name: `Label ${i}`,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        createdAt: '2025-01-27T00:00:00.000Z',
      }))

      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      vi.mocked(labelsRepository.getAll).mockResolvedValue(largeLabelSet)

      const wrapper = mount(LabelManagement, {
        global: {
          plugins: [pinia],
        },
      })

      const store = useLabelsStore()

      const startTime = performance.now()
      await store.loadLabels()
      const endTime = performance.now()

      // Verify performance (should complete within reasonable time)
      expect(endTime - startTime).toBeLessThan(1000) // Less than 1 second
      expect(store.labels).toHaveLength(100)
    })
  })
})
