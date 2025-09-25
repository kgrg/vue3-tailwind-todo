/**
 * Label Filtering Integration Tests
 * Tests for label-based task filtering workflows
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LabelFilter from '@/modules/labels/components/LabelFilter.vue'
import { useLabelsStore } from '@/stores/labels.store'
import { useTasksStore } from '@/stores/tasks.store'
import type { Label } from '@/types/label.types'

// Mock the repositories
vi.mock('@/core/repositories/labels.repository', () => ({
  labelsRepository: {
    getAll: vi.fn(),
    search: vi.fn(),
  },
}))

vi.mock('@/core/repositories/tasks.repository', () => ({
  tasksRepository: {
    getTasksByLabelIds: vi.fn(),
    getTasksWithLabels: vi.fn(),
  },
}))

describe('Label Filtering Integration', () => {
  let pinia: ReturnType<typeof createPinia>

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

  const mockTasks = [
    {
      id: 'task-1',
      title: 'Complete project proposal',
      labelIds: ['1', '3'],
      completed: false,
    },
    {
      id: 'task-2',
      title: 'Buy groceries',
      labelIds: ['2'],
      completed: false,
    },
    {
      id: 'task-3',
      title: 'Read documentation',
      labelIds: ['1'],
      completed: true,
    },
    {
      id: 'task-4',
      title: 'Call family',
      labelIds: ['2', '3'],
      completed: false,
    },
  ]

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  describe('Single Label Filtering', () => {
    it('should filter tasks by single label', async () => {
      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      const { tasksRepository } = await import('@/core/repositories/tasks.repository')

      vi.mocked(labelsRepository.getAll).mockResolvedValue(mockLabels)
      vi.mocked(tasksRepository.getTasksByLabelIds).mockResolvedValue([
        mockTasks[0], // Work + Urgent
        mockTasks[2], // Work only
      ])

      const wrapper = mount(LabelFilter, {
        global: {
          plugins: [pinia],
        },
      })

      const labelsStore = useLabelsStore()
      const tasksStore = useTasksStore()

      await labelsStore.loadLabels()

      // Select Work label
      const workLabel = wrapper.find('[data-testid="label-option"][data-label-id="1"]')
      await workLabel.trigger('click')

      // Verify filter was applied
      expect(labelsStore.selectedLabels).toContain('1')
      expect(tasksRepository.getTasksByLabelIds).toHaveBeenCalledWith(['1'], 'OR')
    })

    it('should clear single label filter', async () => {
      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      vi.mocked(labelsRepository.getAll).mockResolvedValue(mockLabels)

      const wrapper = mount(LabelFilter, {
        global: {
          plugins: [pinia],
        },
      })

      const labelsStore = useLabelsStore()
      await labelsStore.loadLabels()

      // Select and then deselect Work label
      const workLabel = wrapper.find('[data-testid="label-option"][data-label-id="1"]')
      await workLabel.trigger('click')
      await workLabel.trigger('click')

      // Verify filter was cleared
      expect(labelsStore.selectedLabels).not.toContain('1')
    })
  })

  describe('Multiple Label Filtering', () => {
    it('should filter tasks by multiple labels with OR logic', async () => {
      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      const { tasksRepository } = await import('@/core/repositories/tasks.repository')

      vi.mocked(labelsRepository.getAll).mockResolvedValue(mockLabels)
      vi.mocked(tasksRepository.getTasksByLabelIds).mockResolvedValue([
        mockTasks[0], // Work + Urgent
        mockTasks[1], // Personal
        mockTasks[2], // Work only
        mockTasks[3], // Personal + Urgent
      ])

      const wrapper = mount(LabelFilter, {
        global: {
          plugins: [pinia],
        },
      })

      const labelsStore = useLabelsStore()
      await labelsStore.loadLabels()

      // Select Work and Personal labels
      const workLabel = wrapper.find('[data-testid="label-option"][data-label-id="1"]')
      const personalLabel = wrapper.find('[data-testid="label-option"][data-label-id="2"]')

      await workLabel.trigger('click')
      await personalLabel.trigger('click')

      // Verify OR filter was applied
      expect(labelsStore.selectedLabels).toEqual(['1', '2'])
      expect(tasksRepository.getTasksByLabelIds).toHaveBeenCalledWith(['1', '2'], 'OR')
    })

    it('should filter tasks by multiple labels with AND logic', async () => {
      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      const { tasksRepository } = await import('@/core/repositories/tasks.repository')

      vi.mocked(labelsRepository.getAll).mockResolvedValue(mockLabels)
      vi.mocked(tasksRepository.getTasksByLabelIds).mockResolvedValue([
        mockTasks[0], // Work + Urgent
        mockTasks[3], // Personal + Urgent
      ])

      const wrapper = mount(LabelFilter, {
        global: {
          plugins: [pinia],
        },
      })

      const labelsStore = useLabelsStore()
      await labelsStore.loadLabels()

      // Select Work and Urgent labels
      const workLabel = wrapper.find('[data-testid="label-option"][data-label-id="1"]')
      const urgentLabel = wrapper.find('[data-testid="label-option"][data-label-id="3"]')

      await workLabel.trigger('click')
      await urgentLabel.trigger('click')

      // Switch to AND mode
      const andToggle = wrapper.find('[data-testid="and-toggle"]')
      await andToggle.trigger('click')

      // Verify AND filter was applied
      expect(tasksRepository.getTasksByLabelIds).toHaveBeenCalledWith(['1', '3'], 'AND')
    })
  })

  describe('Filter State Management', () => {
    it('should persist filter state across component updates', async () => {
      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      vi.mocked(labelsRepository.getAll).mockResolvedValue(mockLabels)

      const wrapper = mount(LabelFilter, {
        global: {
          plugins: [pinia],
        },
      })

      const labelsStore = useLabelsStore()
      await labelsStore.loadLabels()

      // Select labels
      const workLabel = wrapper.find('[data-testid="label-option"][data-label-id="1"]')
      await workLabel.trigger('click')

      // Simulate component re-render
      await wrapper.vm.$nextTick()

      // Verify filter state is maintained
      expect(labelsStore.selectedLabels).toContain('1')
    })

    it('should clear all filters', async () => {
      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      vi.mocked(labelsRepository.getAll).mockResolvedValue(mockLabels)

      const wrapper = mount(LabelFilter, {
        global: {
          plugins: [pinia],
        },
      })

      const labelsStore = useLabelsStore()
      await labelsStore.loadLabels()

      // Select multiple labels
      const workLabel = wrapper.find('[data-testid="label-option"][data-label-id="1"]')
      const personalLabel = wrapper.find('[data-testid="label-option"][data-label-id="2"]')

      await workLabel.trigger('click')
      await personalLabel.trigger('click')

      // Clear all filters
      const clearAllButton = wrapper.find('[data-testid="clear-all-button"]')
      await clearAllButton.trigger('click')

      // Verify all filters are cleared
      expect(labelsStore.selectedLabels).toEqual([])
    })
  })

  describe('Search Integration', () => {
    it('should search labels while maintaining filters', async () => {
      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      vi.mocked(labelsRepository.getAll).mockResolvedValue(mockLabels)
      vi.mocked(labelsRepository.search).mockResolvedValue({
        labels: [mockLabels[0]], // Only Work label
        total: 1,
        query: 'work',
      })

      const wrapper = mount(LabelFilter, {
        global: {
          plugins: [pinia],
        },
      })

      const labelsStore = useLabelsStore()
      await labelsStore.loadLabels()

      // Search for labels
      const searchInput = wrapper.find('[data-testid="search-input"]')
      await searchInput.setValue('work')
      await searchInput.trigger('input')

      await labelsStore.searchLabels('work')

      // Verify search results
      expect(labelsStore.filteredLabels).toHaveLength(1)
      expect(labelsStore.filteredLabels[0].name).toBe('Work')

      // Select the found label
      const workLabel = wrapper.find('[data-testid="label-option"][data-label-id="1"]')
      await workLabel.trigger('click')

      // Verify filter is applied
      expect(labelsStore.selectedLabels).toContain('1')
    })
  })

  describe('Filter Performance', () => {
    it('should handle filtering with large datasets efficiently', async () => {
      const largeLabelSet: Label[] = Array.from({ length: 50 }, (_, i) => ({
        id: `label-${i}`,
        name: `Label ${i}`,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        createdAt: '2025-01-27T00:00:00.000Z',
      }))

      const largeTaskSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `task-${i}`,
        title: `Task ${i}`,
        labelIds: [`label-${i % 50}`],
        completed: i % 2 === 0,
      }))

      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      const { tasksRepository } = await import('@/core/repositories/tasks.repository')

      vi.mocked(labelsRepository.getAll).mockResolvedValue(largeLabelSet)
      vi.mocked(tasksRepository.getTasksByLabelIds).mockResolvedValue(largeTaskSet.slice(0, 100))

      const wrapper = mount(LabelFilter, {
        global: {
          plugins: [pinia],
        },
      })

      const labelsStore = useLabelsStore()
      await labelsStore.loadLabels()

      // Select multiple labels
      const startTime = performance.now()

      for (let i = 0; i < 10; i++) {
        const label = wrapper.find(`[data-testid="label-option"][data-label-id="label-${i}"]`)
        await label.trigger('click')
      }

      const endTime = performance.now()

      // Verify performance (should complete within reasonable time)
      expect(endTime - startTime).toBeLessThan(500) // Less than 500ms
      expect(labelsStore.selectedLabels).toHaveLength(10)
    })
  })

  describe('Filter Validation', () => {
    it('should handle invalid label IDs gracefully', async () => {
      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      const { tasksRepository } = await import('@/core/repositories/tasks.repository')

      vi.mocked(labelsRepository.getAll).mockResolvedValue(mockLabels)
      vi.mocked(tasksRepository.getTasksByLabelIds).mockRejectedValue(new Error('Invalid label ID'))

      const wrapper = mount(LabelFilter, {
        global: {
          plugins: [pinia],
        },
      })

      const labelsStore = useLabelsStore()
      await labelsStore.loadLabels()

      // Select invalid label
      const invalidLabel = wrapper.find('[data-testid="label-option"][data-label-id="invalid"]')
      if (invalidLabel.exists()) {
        await invalidLabel.trigger('click')
      }

      // Verify error handling
      expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard navigable', async () => {
      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      vi.mocked(labelsRepository.getAll).mockResolvedValue(mockLabels)

      const wrapper = mount(LabelFilter, {
        global: {
          plugins: [pinia],
        },
      })

      const labelsStore = useLabelsStore()
      await labelsStore.loadLabels()

      // Test keyboard navigation
      const searchInput = wrapper.find('[data-testid="search-input"]')
      await searchInput.trigger('keydown.arrow-down')
      await searchInput.trigger('keydown.enter')

      // Verify keyboard interaction
      expect(wrapper.emitted('keyboard-navigate')).toBeTruthy()
    })

    it('should have proper ARIA attributes', async () => {
      const { labelsRepository } = await import('@/core/repositories/labels.repository')
      vi.mocked(labelsRepository.getAll).mockResolvedValue(mockLabels)

      const wrapper = mount(LabelFilter, {
        global: {
          plugins: [pinia],
        },
      })

      const labelsStore = useLabelsStore()
      await labelsStore.loadLabels()

      // Verify ARIA attributes
      const filterContainer = wrapper.find('[data-testid="filter-container"]')
      expect(filterContainer.attributes('role')).toBe('group')
      expect(filterContainer.attributes('aria-label')).toBe('Label filters')
    })
  })
})
