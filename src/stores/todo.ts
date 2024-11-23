import { defineStore } from 'pinia'
import { Todo, TodoState, TodoColumn } from '@/types/todo'
import { StorageService } from '@/services/storage.service'

export const useTodoStore = defineStore('todo', {
  state: (): TodoState => ({
    todos: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async loadTodos() {
      this.isLoading = true
      this.error = null

      try {
        this.todos = StorageService.getTodos()
      } catch (error) {
        this.error = 'Failed to load todos'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    async createTodo(todo: Partial<Todo>) {
      try {
        const newTodo: Todo = {
          id: Date.now(),
          ...todo,
          createdDate: new Date().toLocaleString(),
          lastModifiedDate: new Date().toLocaleString()
        }

        // Optimistic update
        this.todos.push(newTodo)

        // Persist changes
        StorageService.saveTodos(this.todos)

        return newTodo
      } catch (error) {
        // Rollback on error
        this.todos = this.todos.filter(t => t.id !== todo.id)
        throw new Error('Failed to create todo')
      }
    },

    async updateTodo(updatedTodo: Todo) {
      try {
        const index = this.todos.findIndex((todo) => todo.id === updatedTodo.id)
        if (index === -1) throw new Error('Todo not found')

        const oldTodo = this.todos[index]

        // Optimistic update
        this.todos[index] = {
          ...updatedTodo,
          lastModifiedDate: new Date().toLocaleString()
        }

        // Persist changes
        StorageService.saveTodos(this.todos)
      } catch (error) {
        this.error = 'Failed to update todo'
        throw error
      }
    },

    async deleteTodo(todoId: number) {
      try {
        const todoToDelete = this.todos.find(todo => todo.id === todoId)
        if (!todoToDelete) throw new Error('Todo not found')

        // Optimistic update
        this.todos = this.todos.filter((todo) => todo.id !== todoId)

        // Persist changes
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

    getTodoColumns: (): TodoColumn[] => [
      { key: 'name', label: 'Task' },
      { key: 'description', label: 'Description' },
      { key: 'status', label: 'Status' },
      { key: 'createdDate', label: 'Created Date' },
      { key: 'lastModifiedDate', label: 'Last Modified Date' }
    ]
  }
})
