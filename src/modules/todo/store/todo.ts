import { defineStore } from 'pinia'
import { StorageService } from '@/shared/services/storage'
import type { Todo, TodoState } from '../types/todo'

export const useTodoStore = defineStore('todo', {
  state: (): TodoState => ({
    todos: [],
    isLoading: false,
    error: null
  }),

  actions: {
    loadTodos() {
      try {
        this.isLoading = true
        this.todos = StorageService.getTodos()
      } catch (error) {
        this.error = 'Failed to load todos'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    createTodo(todo: Partial<Todo>) {
      try {
        const newTodo: Todo = {
          id: Date.now(),
          ...todo,
          createdDate: new Date().toLocaleString(),
          lastModifiedDate: new Date().toLocaleString()
        } as Todo

        this.todos.push(newTodo)
        StorageService.saveTodos(this.todos)
      } catch (error) {
        this.error = 'Failed to create todo'
        throw error
      }
    },

    updateTodo(updatedTodo: Todo) {
      try {
        const index = this.todos.findIndex((todo) => todo.id === updatedTodo.id)
        if (index !== -1) {
          this.todos[index] = {
            ...updatedTodo,
            lastModifiedDate: new Date().toLocaleString()
          }
          StorageService.saveTodos(this.todos)
        }
      } catch (error) {
        this.error = 'Failed to update todo'
        throw error
      }
    },

    deleteTodo(todoId: number) {
      try {
        this.todos = this.todos.filter((todo) => todo.id !== todoId)
        StorageService.saveTodos(this.todos)
      } catch (error) {
        this.error = 'Failed to delete todo'
        throw error
      }
    }
  },

  getters: {
    getTodoList: (state): Todo[] => state.todos,

    getTodoById: (state) => (id: number): Todo | undefined => {
      return state.todos.find((todo) => todo.id === id)
    },

    getTodoColumns: () => [
      { key: 'name', label: 'Task' },
      { key: 'description', label: 'Description' },
      { key: 'status', label: 'Status' },
      { key: 'createdDate', label: 'Created Date' },
      { key: 'lastModifiedDate', label: 'Last Modified Date' }
    ]
  }
})
