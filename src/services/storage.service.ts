import { Todo } from '@/types/todo'

const STORAGE_KEY = 'todos'

export class StorageError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'StorageError'
  }
}

export const StorageService = {
  getTodos(): Todo[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      throw new StorageError(
        'Failed to load todos from storage',
        'STORAGE_READ_ERROR'
      )
    }
  },

  saveTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch (error) {
      throw new StorageError(
        'Failed to save todos to storage',
        'STORAGE_WRITE_ERROR'
      )
    }
  }
}
