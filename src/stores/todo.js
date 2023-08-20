import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: []
  }),
  actions: {
    createTodo(todo) {
      this.todos.push({
        id : Date.now(),
        ...todo,
        createdDate: new Date().toLocaleString(),
        lastModifiedDate: new Date().toLocaleString(),
      })
    },
    updateTodo(updatedTodo) {
      const index = this.todos.findIndex((todo) => todo.id === updatedTodo.id)
      if (index !== -1) {
        this.todos[index] = { ...updatedTodo , lastModifiedDate : new Date().toLocaleString() }
      }
    },
    deleteTodo(todoId) {
      this.todos = this.todos.filter((todo) => todo.id !== todoId)
    }
  },
  getters: {
    getTodoList: (state) => state.todos,
    getTodoById: (state) => (id) => {
      return state.todos.find((todo) => todo.id === id)
    },
    getTodoColumns: () => {
      return [
        {
          key: 'name',
          label: 'Task'
        },
        {
          key: 'description',
          label: 'Description'
        },
        {
          key: 'status',
          label: 'Status'
        },
        {
          key: 'createdDate',
          label: 'Created Date'
        },
        {
          key: 'lastModifiedDate',
          label: 'Last Modified Date'
        }
      ]
    }
  }
})
