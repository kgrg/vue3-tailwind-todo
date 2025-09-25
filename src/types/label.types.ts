/**
 * Label Types and Interfaces
 * Defines the core data structures for the labels feature
 */

export interface Label {
  id: string
  name: string
  color: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateLabelRequest {
  name: string
  color: string
}

export interface UpdateLabelRequest {
  name?: string
  color?: string
}

export interface LabelResponse {
  id: string
  name: string
  color: string
  createdAt: string
  updatedAt?: string
}

export interface LabelError {
  code: string
  message: string
  field?: string
}

export interface LabelValidationResult {
  isValid: boolean
  errors: LabelError[]
}

export interface LabelFilter {
  labelIds: string[]
  operator: 'AND' | 'OR'
}

export interface LabelStats {
  total: number
  used: number
  unused: number
}

export interface LabelAssignment {
  taskId: string
  labelIds: string[]
}

export interface LabelSearchResult {
  labels: Label[]
  total: number
  query: string
}

export interface LabelRepository {
  getAll(): Promise<Label[]>
  getById(id: string): Promise<Label | null>
  create(label: CreateLabelRequest): Promise<Label>
  update(id: string, updates: UpdateLabelRequest): Promise<Label>
  delete(id: string): Promise<void>
  exists(name: string): Promise<boolean>
  search(query: string): Promise<LabelSearchResult>
}

export interface TaskLabelRepository {
  updateLabelIds(taskId: string, labelIds: string[]): Promise<void>
  getTasksByLabelIds(labelIds: string[], operator: 'AND' | 'OR'): Promise<any[]>
  removeLabelFromAllTasks(labelId: string): Promise<void>
}

export type LabelColor = string // Hex color format
export type LabelId = string // UUID format
export type LabelName = string // 1-32 characters, unique
