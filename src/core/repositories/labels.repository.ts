/**
 * Labels Repository
 * Provides localStorage persistence for labels with repository pattern
 */

import type {
  Label,
  CreateLabelRequest,
  UpdateLabelRequest,
  LabelRepository,
  LabelSearchResult,
} from '../../types/label.types'
import {
  LabelError,
  StorageError,
  NotFoundError,
  DuplicateError,
  createErrorContext,
  handleAsyncOperation,
} from '../utils/error-handler'
import {
  validateLabelCreate,
  validateLabelUpdate,
  validateLabelNameUnique,
} from '../validation/label.validation'

const STORAGE_KEY = 'labels:v1'
const MAX_LABELS = 200

interface StoredLabels {
  version: 'v1'
  labels: Label[]
  lastUpdated: string
}

export class LabelsRepositoryImpl implements LabelRepository {
  private getStorageData(): StoredLabels {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        return {
          version: 'v1',
          labels: [],
          lastUpdated: new Date().toISOString(),
        }
      }

      const data = JSON.parse(stored) as StoredLabels
      return data
    } catch (error) {
      const context = createErrorContext('get_storage_data')
      throw new StorageError('Failed to read labels from storage', context)
    }
  }

  private setStorageData(data: StoredLabels): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      const context = createErrorContext('set_storage_data')
      throw new StorageError('Failed to save labels to storage', context)
    }
  }

  async getAll(): Promise<Label[]> {
    return (
      handleAsyncOperation(() => {
        const data = this.getStorageData()
        return data.labels
      }, createErrorContext('get_all_labels')) || []
    )
  }

  async getById(id: string): Promise<Label | null> {
    return (
      handleAsyncOperation(async () => {
        const data = this.getStorageData()
        const label = data.labels.find(l => l.id === id)
        return label || null
      }, createErrorContext('get_label_by_id')) || null
    )
  }

  async create(labelData: CreateLabelRequest): Promise<Label> {
    return handleAsyncOperation(async () => {
      // Validate input
      const validation = validateLabelCreate(labelData)
      if (!validation.isValid) {
        const context = createErrorContext('create_label')
        throw new LabelError(
          validation.errors[0]?.message || 'Validation failed',
          validation.errors[0]?.code || 'VALIDATION_ERROR',
          context,
          validation.errors[0]?.field
        )
      }

      const data = this.getStorageData()

      // Check if we've reached the maximum number of labels
      if (data.labels.length >= MAX_LABELS) {
        const context = createErrorContext('create_label')
        throw new LabelError(
          `Maximum number of labels (${MAX_LABELS}) reached`,
          'MAX_LABELS_REACHED',
          context
        )
      }

      // Check for duplicate name
      if (!validateLabelNameUnique(labelData.name, data.labels)) {
        const context = createErrorContext('create_label')
        throw new DuplicateError('name', labelData.name, context)
      }

      // Create new label
      const newLabel: Label = {
        id: crypto.randomUUID(),
        name: labelData.name.trim(),
        color: labelData.color,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Update storage
      const updatedData: StoredLabels = {
        ...data,
        labels: [...data.labels, newLabel],
        lastUpdated: new Date().toISOString(),
      }

      this.setStorageData(updatedData)
      return newLabel
    }, createErrorContext('create_label'))!
  }

  async update(id: string, updates: UpdateLabelRequest): Promise<Label> {
    return handleAsyncOperation(async () => {
      // Validate input
      const validation = validateLabelUpdate(updates)
      if (!validation.isValid) {
        const context = createErrorContext('update_label')
        throw new LabelError(
          validation.errors[0]?.message || 'Validation failed',
          validation.errors[0]?.code || 'VALIDATION_ERROR',
          context,
          validation.errors[0]?.field
        )
      }

      const data = this.getStorageData()
      const labelIndex = data.labels.findIndex(l => l.id === id)

      if (labelIndex === -1) {
        const context = createErrorContext('update_label')
        throw new NotFoundError('Label', id, context)
      }

      const existingLabel = data.labels[labelIndex]

      // Check for duplicate name if name is being updated
      if (updates.name && updates.name !== existingLabel.name) {
        if (!validateLabelNameUnique(updates.name, data.labels, id)) {
          const context = createErrorContext('update_label')
          throw new DuplicateError('name', updates.name, context)
        }
      }

      // Update label
      const updatedLabel: Label = {
        ...existingLabel,
        ...updates,
        name: updates.name?.trim() || existingLabel.name,
        updatedAt: new Date().toISOString(),
      }

      // Update storage
      const updatedLabels = [...data.labels]
      updatedLabels[labelIndex] = updatedLabel

      const updatedData: StoredLabels = {
        ...data,
        labels: updatedLabels,
        lastUpdated: new Date().toISOString(),
      }

      this.setStorageData(updatedData)
      return updatedLabel
    }, createErrorContext('update_label'))!
  }

  async delete(id: string): Promise<void> {
    return handleAsyncOperation(async () => {
      const data = this.getStorageData()
      const labelIndex = data.labels.findIndex(l => l.id === id)

      if (labelIndex === -1) {
        const context = createErrorContext('delete_label')
        throw new NotFoundError('Label', id, context)
      }

      // Remove label from storage
      const updatedLabels = data.labels.filter(l => l.id !== id)

      const updatedData: StoredLabels = {
        ...data,
        labels: updatedLabels,
        lastUpdated: new Date().toISOString(),
      }

      this.setStorageData(updatedData)
    }, createErrorContext('delete_label'))!
  }

  async exists(name: string): Promise<boolean> {
    return (
      handleAsyncOperation(async () => {
        const data = this.getStorageData()
        const trimmedName = name.trim().toLowerCase()
        return data.labels.some(label => label.name.toLowerCase() === trimmedName)
      }, createErrorContext('check_label_exists')) || false
    )
  }

  async search(query: string): Promise<LabelSearchResult> {
    return (
      handleAsyncOperation(async () => {
        const data = this.getStorageData()
        const trimmedQuery = query.trim().toLowerCase()

        if (!trimmedQuery) {
          return {
            labels: data.labels,
            total: data.labels.length,
            query,
          }
        }

        const filteredLabels = data.labels.filter(
          label =>
            label.name.toLowerCase().includes(trimmedQuery) ||
            label.color.toLowerCase().includes(trimmedQuery)
        )

        return {
          labels: filteredLabels,
          total: filteredLabels.length,
          query,
        }
      }, createErrorContext('search_labels')) || { labels: [], total: 0, query }
    )
  }

  /**
   * Gets labels by IDs
   */
  async getByIds(ids: string[]): Promise<Label[]> {
    return (
      handleAsyncOperation(async () => {
        const data = this.getStorageData()
        return data.labels.filter(label => ids.includes(label.id))
      }, createErrorContext('get_labels_by_ids')) || []
    )
  }

  /**
   * Gets label statistics
   */
  async getStats(): Promise<{ total: number; used: number; unused: number }> {
    return (
      handleAsyncOperation(async () => {
        const data = this.getStorageData()
        const total = data.labels.length

        // This would need to be calculated with task data
        // For now, return basic stats
        return {
          total,
          used: 0, // Would be calculated with task integration
          unused: total,
        }
      }, createErrorContext('get_label_stats')) || { total: 0, used: 0, unused: 0 }
    )
  }

  /**
   * Clears all labels (for testing)
   */
  async clearAll(): Promise<void> {
    return handleAsyncOperation(() => {
      const emptyData: StoredLabels = {
        version: 'v1',
        labels: [],
        lastUpdated: new Date().toISOString(),
      }
      this.setStorageData(emptyData)
    }, createErrorContext('clear_all_labels'))!
  }
}

// Export singleton instance
export const labelsRepository = new LabelsRepositoryImpl()
