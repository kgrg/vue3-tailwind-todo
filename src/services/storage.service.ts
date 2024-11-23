import { Todo } from '@/types/todo'

const STORAGE_KEY = 'todos'

export const StorageService = {
  getTodos(): Todo[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading todos:', error)
      return []
    }
  },

  saveTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch (error) {
      console.error('Error saving todos:', error)
    }
  }
}
