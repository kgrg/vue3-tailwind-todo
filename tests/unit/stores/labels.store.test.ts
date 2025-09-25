/**
 * Labels Store Unit Tests
 * Tests for the Pinia labels store functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLabelsStore } from '@/stores/labels.store'
import type { Label, CreateLabelRequest, UpdateLabelRequest } from '@/types/label.types'

// Mock the repository
vi.mock('@/core/repositories/labels.repository', () => ({
  labelsRepository: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    exists: vi.fn(),
    search: vi.fn(),
  },
}))

describe('Labels Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useLabelsStore()

      expect(store.labels).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.searchQuery).toBe('')
      expect(store.selectedLabels).toEqual([])
    })
  })

  describe('Actions', () => {
    let store: ReturnType<typeof useLabelsStore>

    beforeEach(() => {
      store = useLabelsStore()
    })

    describe('loadLabels', () => {
      it('should load labels successfully', async () => {
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

        await store.loadLabels()

        expect(store.labels).toEqual(mockLabels)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('should handle loading errors', async () => {
        const { labelsRepository } = await import('@/core/repositories/labels.repository')
        vi.mocked(labelsRepository.getAll).mockRejectedValue(new Error('Storage error'))

        await store.loadLabels()

        expect(store.labels).toEqual([])
        expect(store.loading).toBe(false)
        expect(store.error).toBe('Storage error')
      })
    })

    describe('createLabel', () => {
      it('should create a new label successfully', async () => {
        const newLabel: CreateLabelRequest = {
          name: 'Urgent',
          color: '#ef4444',
        }

        const createdLabel: Label = {
          id: '3',
          name: 'Urgent',
          color: '#ef4444',
          createdAt: '2025-01-27T00:00:00.000Z',
        }

        const { labelsRepository } = await import('@/core/repositories/labels.repository')
        vi.mocked(labelsRepository.create).mockResolvedValue(createdLabel)

        await store.createLabel(newLabel)

        expect(store.labels).toContain(createdLabel)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('should handle creation errors', async () => {
        const newLabel: CreateLabelRequest = {
          name: 'Test',
          color: '#000000',
        }

        const { labelsRepository } = await import('@/core/repositories/labels.repository')
        vi.mocked(labelsRepository.create).mockRejectedValue(new Error('Validation error'))

        await store.createLabel(newLabel)

        expect(store.labels).toEqual([])
        expect(store.loading).toBe(false)
        expect(store.error).toBe('Validation error')
      })
    })

    describe('updateLabel', () => {
      it('should update an existing label successfully', async () => {
        const existingLabel: Label = {
          id: '1',
          name: 'Work',
          color: '#22c55e',
          createdAt: '2025-01-27T00:00:00.000Z',
        }

        store.labels = [existingLabel]

        const updateData: UpdateLabelRequest = {
          name: 'Work Tasks',
          color: '#3b82f6',
        }

        const updatedLabel: Label = {
          ...existingLabel,
          name: 'Work Tasks',
          color: '#3b82f6',
          updatedAt: '2025-01-27T00:00:00.000Z',
        }

        const { labelsRepository } = await import('@/core/repositories/labels.repository')
        vi.mocked(labelsRepository.update).mockResolvedValue(updatedLabel)

        await store.updateLabel('1', updateData)

        expect(store.labels[0]).toEqual(updatedLabel)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('should handle update errors', async () => {
        const existingLabel: Label = {
          id: '1',
          name: 'Work',
          color: '#22c55e',
          createdAt: '2025-01-27T00:00:00.000Z',
        }

        store.labels = [existingLabel]

        const updateData: UpdateLabelRequest = {
          name: 'Work Tasks',
        }

        const { labelsRepository } = await import('@/core/repositories/labels.repository')
        vi.mocked(labelsRepository.update).mockRejectedValue(new Error('Update failed'))

        await store.updateLabel('1', updateData)

        expect(store.labels[0]).toEqual(existingLabel) // Should remain unchanged
        expect(store.loading).toBe(false)
        expect(store.error).toBe('Update failed')
      })
    })

    describe('deleteLabel', () => {
      it('should delete a label successfully', async () => {
        const labels: Label[] = [
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

        store.labels = labels

        const { labelsRepository } = await import('@/core/repositories/labels.repository')
        vi.mocked(labelsRepository.delete).mockResolvedValue(undefined)

        await store.deleteLabel('1')

        expect(store.labels).toHaveLength(1)
        expect(store.labels[0].id).toBe('2')
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('should handle deletion errors', async () => {
        const labels: Label[] = [
          {
            id: '1',
            name: 'Work',
            color: '#22c55e',
            createdAt: '2025-01-27T00:00:00.000Z',
          },
        ]

        store.labels = labels

        const { labelsRepository } = await import('@/core/repositories/labels.repository')
        vi.mocked(labelsRepository.delete).mockRejectedValue(new Error('Delete failed'))

        await store.deleteLabel('1')

        expect(store.labels).toEqual(labels) // Should remain unchanged
        expect(store.loading).toBe(false)
        expect(store.error).toBe('Delete failed')
      })
    })

    describe('searchLabels', () => {
      it('should search labels successfully', async () => {
        const searchResults: Label[] = [
          {
            id: '1',
            name: 'Work',
            color: '#22c55e',
            createdAt: '2025-01-27T00:00:00.000Z',
          },
        ]

        const { labelsRepository } = await import('@/core/repositories/labels.repository')
        vi.mocked(labelsRepository.search).mockResolvedValue({
          labels: searchResults,
          total: 1,
          query: 'work',
        })

        await store.searchLabels('work')

        expect(store.searchQuery).toBe('work')
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })
    })
  })

  describe('Getters', () => {
    let store: ReturnType<typeof useLabelsStore>

    beforeEach(() => {
      store = useLabelsStore()
    })

    describe('filteredLabels', () => {
      it('should return all labels when no search query', () => {
        const labels: Label[] = [
          { id: '1', name: 'Work', color: '#22c55e', createdAt: '2025-01-27T00:00:00.000Z' },
          { id: '2', name: 'Personal', color: '#3b82f6', createdAt: '2025-01-27T00:00:00.000Z' },
        ]

        store.labels = labels
        store.searchQuery = ''

        expect(store.filteredLabels).toEqual(labels)
      })

      it('should filter labels by search query', () => {
        const labels: Label[] = [
          { id: '1', name: 'Work', color: '#22c55e', createdAt: '2025-01-27T00:00:00.000Z' },
          { id: '2', name: 'Personal', color: '#3b82f6', createdAt: '2025-01-27T00:00:00.000Z' },
          { id: '3', name: 'Work Tasks', color: '#ef4444', createdAt: '2025-01-27T00:00:00.000Z' },
        ]

        store.labels = labels
        store.searchQuery = 'work'

        const filtered = store.filteredLabels
        expect(filtered).toHaveLength(2)
        expect(filtered.map(l => l.name)).toEqual(['Work', 'Work Tasks'])
      })
    })

    describe('labelMap', () => {
      it('should create a map of labels by ID', () => {
        const labels: Label[] = [
          { id: '1', name: 'Work', color: '#22c55e', createdAt: '2025-01-27T00:00:00.000Z' },
          { id: '2', name: 'Personal', color: '#3b82f6', createdAt: '2025-01-27T00:00:00.000Z' },
        ]

        store.labels = labels

        const labelMap = store.labelMap
        expect(labelMap.get('1')).toEqual(labels[0])
        expect(labelMap.get('2')).toEqual(labels[1])
        expect(labelMap.get('3')).toBeUndefined()
      })
    })

    describe('labelStats', () => {
      it('should calculate label statistics', () => {
        const labels: Label[] = [
          { id: '1', name: 'Work', color: '#22c55e', createdAt: '2025-01-27T00:00:00.000Z' },
          { id: '2', name: 'Personal', color: '#3b82f6', createdAt: '2025-01-27T00:00:00.000Z' },
        ]

        store.labels = labels

        const stats = store.labelStats
        expect(stats.total).toBe(2)
        expect(stats.used).toBe(0) // Would be calculated with task integration
        expect(stats.unused).toBe(2)
      })
    })
  })

  describe('Mutations', () => {
    let store: ReturnType<typeof useLabelsStore>

    beforeEach(() => {
      store = useLabelsStore()
    })

    describe('setLoading', () => {
      it('should set loading state', () => {
        store.setLoading(true)
        expect(store.loading).toBe(true)

        store.setLoading(false)
        expect(store.loading).toBe(false)
      })
    })

    describe('setError', () => {
      it('should set error state', () => {
        store.setError('Test error')
        expect(store.error).toBe('Test error')

        store.setError(null)
        expect(store.error).toBeNull()
      })
    })

    describe('setSearchQuery', () => {
      it('should set search query', () => {
        store.setSearchQuery('work')
        expect(store.searchQuery).toBe('work')
      })
    })

    describe('setSelectedLabels', () => {
      it('should set selected labels', () => {
        const selectedLabels = ['1', '2']
        store.setSelectedLabels(selectedLabels)
        expect(store.selectedLabels).toEqual(selectedLabels)
      })
    })

    describe('clearError', () => {
      it('should clear error state', () => {
        store.setError('Test error')
        store.clearError()
        expect(store.error).toBeNull()
      })
    })
  })
})
