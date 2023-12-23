import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: []
  }),
  actions: {
    loadTodos() {
      const storedTodosString = localStorage.getItem('todos')
      if (storedTodosString) {
        const storedTodos = JSON.parse(storedTodosString)
        this.todos = storedTodos
        console.log(this.todos)
      }
    },
    createTodo(todo) {
      this.todos.push({
        id: Date.now(),
        ...todo,
        createdDate: new Date().toLocaleString(),
        lastModifiedDate: new Date().toLocaleString()
      })
      localStorage.setItem('todos', JSON.stringify(this.todos))
    },
    updateTodo(updatedTodo) {
      const index = this.todos.findIndex((todo) => todo.id === updatedTodo.id)
      if (index !== -1) {
        this.todos[index] = {
          ...updatedTodo,
          lastModifiedDate: new Date().toLocaleString()
        }
        localStorage.setItem('todos', JSON.stringify(this.todos))
      }
    },
    deleteTodo(todoId) {
      this.todos = this.todos.filter((todo) => todo.id !== todoId)
      localStorage.setItem('todos', JSON.stringify(this.todos))
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
